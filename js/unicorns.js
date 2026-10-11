// The blind unicorns in the Meadows (data/unicorns.js): cast the Seeing
// Spell, then feed apples from your fruit basket, and the unicorn finds its
// family. That's one adventure: an Adventure Point.

function randomBetween(low, high) {
  return low + Math.floor(Math.random() * (high - low + 1));
}

function openUnicorn(message) {
  const u = GAME_DATA.unicorns;
  const unicorn = player.unicorn;
  const button = document.createElement("button");
  button.className = "big-button";
  let text;
  if (!unicorn.canSee) {
    text = "This unicorn was born blind, so it can't find its family.";
    button.textContent = "👁️ Cast the " + spellName(u.spell);
    if (!knowsSpell(u.spell)) {
      text += " You need the " + spellName(u.spell) + " in your spell book. Make it at the Crafting Cabin.";
      button.disabled = true;
    }
    button.addEventListener("click", castSeeingSpell);
  } else {
    const apples = player.basket.filter(function (id) { return id === u.food; }).length;
    text = "The unicorn can see you! It's hungry. Apples eaten: " + unicorn.applesFed + " of " + unicorn.applesNeeded + ".";
    button.textContent = "🍎 Feed it an apple";
    if (apples === 0) {
      text += " Pick apples in the Fruit Orchard.";
      button.disabled = true;
    }
    button.addEventListener("click", feedUnicorn);
  }
  const body = openInfoPanel(u.emoji, unicorn.canSee ? "A Unicorn That Can See" : "A Blind Unicorn", message || text);
  if (message) {
    const more = document.createElement("p");
    more.className = "note";
    more.textContent = text;
    body.appendChild(more);
  }
  body.appendChild(button);
}

function castSeeingSpell() {
  const range = GAME_DATA.unicorns.apples;
  player.unicorn = { canSee: true, applesNeeded: randomBetween(range[0], range[1]), applesFed: 0 };
  writeSave(player);
  document.getElementById("info-art").classList.add("sparkle");
  setTimeout(function () { document.getElementById("info-art").classList.remove("sparkle"); }, 1200);
  openUnicorn("✨ Sparkle! The unicorn blinks... and opens its eyes. It can see!");
}

function feedUnicorn() {
  const u = GAME_DATA.unicorns;
  player.basket.splice(player.basket.indexOf(u.food), 1);
  player.unicorn.applesFed++;
  if (player.unicorn.applesFed < player.unicorn.applesNeeded) {
    writeSave(player);
    return openUnicorn("Crunch! The unicorn loves the apple.");
  }
  // Fed enough: it finds its family. One adventure done!
  player.adventurePoints += u.adventurePoints;
  player.unicornsHelped++;
  player.unicorn = { canSee: false, applesNeeded: 0, applesFed: 0 }; // another blind unicorn comes along
  writeSave(player);
  openInfoPanel("🦄💖🦄", "Back With Its Family!",
    "The unicorn sees its family across the meadow and gallops off to join them. You finished an adventure: +" +
    u.adventurePoints + " Adventure Point! Another blind unicorn wanders over...");
}
