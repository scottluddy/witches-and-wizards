// The Beehive in the Meadows: scoop honey, but watch out for the bees!
// The numbers are in data/honey.js.

let honeyPot = 0; // honey scooped this visit, not yet in the basket (bees can spill it)

// ---------------------------------------------------------------- stings

// Minutes until a sting is better on its own (0 when you're not stung).
function stingMinutesLeft() {
  if (!player.stungAt) return 0;
  const left = player.stungAt + GAME_DATA.honey.healMinutes * 60000 - Date.now();
  if (left <= 0) player.stungAt = 0; // all better
  return left > 0 ? Math.ceil(left / 60000) : 0;
}

function isHealingPotion(item) {
  return item.id === GAME_DATA.honey.healPotion;
}

// The "Drink" button on the Healing Potion in the backpack. It's only used up
// if there's a sting to heal.
function healDrinkButton(item) {
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "❤️‍🩹 Drink";
  button.addEventListener("click", function () {
    if (!stingMinutesLeft()) {
      document.getElementById("backpack-free").textContent = "❤️‍🩹 You feel fine! Save the Healing Potion for when you need it.";
      return;
    }
    player.backpack.splice(player.backpack.indexOf(item.id), 1); // drunk, so it's gone
    player.stungAt = 0;
    writeSave(player);
    openBackpack();
    document.getElementById("backpack-free").textContent = "❤️‍🩹 Your bee sting is all better! You can collect honey again.";
  });
  return button;
}

// ---------------------------------------------------------------- the hive

function openBeehive(message) {
  const rules = GAME_DATA.honey;
  const stung = stingMinutesLeft();
  const body = openInfoPanel("🐝", "Beehive", message || (stung
    ? "Ouch, your bee sting still hurts! Drink a Healing Potion (from the Trading Post) to heal it, or wait about " + stung + " minute" + (stung === 1 ? "" : "s") + "."
    : "Buzz buzz... the bees are inside. Scoop honey into your pot, then put it in your basket before the bees come out!"));
  const pot = document.createElement("p");
  pot.className = "honey-pot";
  pot.textContent = "Honey pot: " + (honeyPot ? "🍯".repeat(honeyPot) : "empty") + " (" + honeyPot + " of " + rules.potHolds + ")";
  body.appendChild(pot);
  if (stung) return;
  const row = document.createElement("div");
  row.className = "song-buttons";
  const scoop = document.createElement("button");
  scoop.className = "big-button";
  scoop.textContent = "🥄 Scoop honey";
  scoop.disabled = honeyPot >= rules.potHolds;
  scoop.addEventListener("click", scoopHoney);
  const bank = document.createElement("button");
  bank.className = "big-button secondary";
  bank.textContent = "🧺 Put it in your basket";
  bank.disabled = honeyPot === 0;
  bank.addEventListener("click", honeyToBasket);
  row.append(scoop, bank);
  body.appendChild(row);
}

// Each scoop might bring the bees out. Luck makes it less likely
// (like luck keeping the troll asleep, js/luck.js).
function scoopHoney() {
  const rules = GAME_DATA.honey;
  const beesChance = rules.beesChance / (1 + luckPercent() / 100);
  if (Math.random() < beesChance) return beesComeOut();
  honeyPot += 1;
  openBeehive(honeyPot >= rules.potHolds
    ? "🍯 Your pot is full! Put the honey in your basket."
    : "🍯 Mmm, a scoop of honey! Scoop more, or put it in your basket to keep it safe.");
}

function beesComeOut() {
  const spilled = honeyPot;
  honeyPot = 0;
  const hidden = isInvisible(); // bees can't find you while you're invisible (js/potions.js)
  const stung = !hidden && Math.random() < GAME_DATA.honey.stingChance;
  if (stung) player.stungAt = Date.now();
  writeSave(player);
  const body = openInfoPanel("🐝🐝🐝", "The Bees Came Out!",
    "Bzzzz! The bees swarm out of the hive" + (spilled ? " and you spill your honey (" + spilled + " lost)" : "") + ". " +
    (stung ? "OUCH! A bee stung you. You can't collect honey until you're healed: drink a Healing Potion, or wait " + GAME_DATA.honey.healMinutes + " minutes."
           : hidden ? "They buzz all around, but you're invisible and they can't find you to sting! 🫥"
           : "Phew, no stings! Wait for the bees to go back inside, then try again."));
  const swarm = document.createElement("div");
  swarm.className = "bee-swarm";
  for (let i = 0; i < 8; i++) {
    const bee = document.createElement("span");
    bee.textContent = "🐝";
    bee.style.animationDelay = (i * 0.12) + "s";
    bee.style.left = (10 + i * 10) + "%";
    swarm.appendChild(bee);
  }
  body.appendChild(swarm);
}

function honeyToBasket() {
  const count = honeyPot;
  for (let i = 0; i < count; i++) player.basket.push("honey");
  honeyPot = 0;
  writeSave(player);
  openBeehive("🧺 " + count + " honey went into your basket. Eat it when you're hungry!");
}

// Leaving the Beehive: honey left in the pot comes along into the basket.
function leaveBeehive(place) {
  if (place.id === GAME_DATA.honey.place || honeyPot === 0) return;
  for (let i = 0; i < honeyPot; i++) player.basket.push("honey");
  honeyPot = 0;
  writeSave(player);
}
