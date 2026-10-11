// Luck: the Luck Potion and your Level make good things happen more often.
// The numbers are in data/luck.js and data/levels.js.

// How lucky you are right now, in percent (0 = normal luck).
function luckPercent() {
  if (!player) return 0;
  const potion = player.luckSeconds > 0 ? GAME_DATA.luck.boost : 0;
  return potion + GAME_DATA.levels.luckPerLevel * (player.level - 1);
}

// A chance (0 to 1) made bigger by your luck, but never more than 1 (always).
function luckyChance(chance) {
  return Math.min(1, chance * (1 + luckPercent() / 100));
}

// When something didn't work out, luck gives it another go. This is the
// chance of that second try, worked out so the overall chance comes to
// luckyChance(chance). Example: 75% normally, 25% luck: 75% of the misses
// get saved, so 94% of tries work.
function secondChance(chance) {
  if (chance >= 1) return 0;
  return (luckyChance(chance) - chance) / (1 - chance);
}

// Does luck keep a troll asleep? With 25% luck, a troll wakes only
// 4 times out of 5 (1 ÷ 1.25), so 1 time in 5 it stays asleep.
function luckKeepsTrollAsleep() {
  return Math.random() < 1 - 1 / (1 + luckPercent() / 100);
}

// ---------------------------------------------------------------- the Luck Potion

function isLuckPotion(item) {
  return item.id === GAME_DATA.luck.potion;
}

// A button on the Luck Potion in the backpack: drink it to be lucky for a while.
function drinkButton(item) {
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "🍀 Drink (+" + GAME_DATA.luck.boost + "% luck for " + GAME_DATA.luck.minutes + " minutes)";
  button.addEventListener("click", function () {
    player.backpack.splice(player.backpack.indexOf(item.id), 1); // drunk, so it's gone
    player.luckSeconds = (player.luckSeconds || 0) + GAME_DATA.luck.minutes * 60;
    writeSave(player);
    openBackpack();
    document.getElementById("backpack-free").textContent =
      "🍀 You feel lucky! Fish bite more, crystals turn up more and trolls stay asleep more, for " + GAME_DATA.luck.minutes + " minutes.";
  });
  return button;
}

// "🍀 4:05" in the top bar while the potion lasts.
function showLuck() {
  const badge = document.getElementById("status-luck");
  const seconds = player ? player.luckSeconds : 0;
  badge.hidden = !(seconds > 0);
  if (seconds > 0) {
    const secs = seconds % 60;
    badge.textContent = "🍀 " + Math.floor(seconds / 60) + ":" + (secs < 10 ? "0" : "") + secs;
  }
}

// Once a second, while the game is being played (not on the title screen or
// in a hidden browser tab), the potion wears off a little.
setInterval(function () {
  if (!player || !(player.luckSeconds > 0)) return;
  if (document.hidden || document.getElementById("status-bar").hidden) return;
  player.luckSeconds--;
  if (player.luckSeconds % 10 === 0) writeSave(player); // saving now and then is enough
  showLuck();
}, 1000);
