// Potions that last a while (Scott, 2026-10-18): the Invisibility Potion
// (trolls can't see you, bees can't find you) and the Wisdom Potion (shorter
// rests between Wizard School tests). The numbers are in data/wands.js
// (GAME_DATA.timedPotions). Like the Luck Potion (js/luck.js), the time only
// counts down while you're playing.

// Which timed potion (its kind) an item is, or null.
function timedPotionKind(item) {
  const all = GAME_DATA.timedPotions;
  return Object.keys(all).find(function (kind) { return all[kind].potions.indexOf(item.id) !== -1; }) || null;
}

function potionSecondsLeft(kind) {
  return (player && player.potionSeconds[kind]) || 0;
}

function isInvisible() {
  return potionSecondsLeft("invisible") > 0;
}

function isWise() {
  return potionSecondsLeft("wisdom") > 0;
}

// The Drink button on the potion in the backpack.
function timedDrinkButton(item) {
  const kind = timedPotionKind(item);
  const rules = GAME_DATA.timedPotions[kind];
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = rules.emoji + " " + rules.button;
  button.addEventListener("click", function () {
    removeOne(player.backpack, item.id); // drunk, so it's gone
    player.potionSeconds[kind] = potionSecondsLeft(kind) + rules.seconds;
    writeSave(player);
    openBackpack();
    showTimedPotions();
    document.getElementById("backpack-free").textContent = rules.drank;
  });
  return button;
}

// "🫥 0:45" and "🦉 4:12" in the top bar while they last; you shimmer while invisible.
function showTimedPotions() {
  const badge = document.getElementById("status-potions");
  const parts = Object.keys(GAME_DATA.timedPotions).filter(potionSecondsLeft).map(function (kind) {
    return GAME_DATA.timedPotions[kind].emoji + " " + minutesAndSeconds(potionSecondsLeft(kind)); // js/skills.js
  });
  badge.hidden = parts.length === 0;
  badge.textContent = parts.join("  ");
  document.body.classList.toggle("you-invisible", isInvisible());
}

// Once a second, while the game is being played, the potions wear off a little.
setInterval(function () {
  if (!player || !player.potionSeconds) return;
  if (document.hidden || document.getElementById("status-bar").hidden) return;
  const kinds = Object.keys(player.potionSeconds).filter(potionSecondsLeft);
  if (!kinds.length) return;
  kinds.forEach(function (kind) { player.potionSeconds[kind]--; });
  if (kinds.some(function (kind) { return player.potionSeconds[kind] % 10 === 0; })) writeSave(player);
  showTimedPotions();
}, 1000);
