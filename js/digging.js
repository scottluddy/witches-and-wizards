// Digging at Pebble Beach: click a dig spot, wait while the shovel digs, then
// see what you found. Finds go in your bucket (js/storage.js). A Dig Spot ("finds": "beach") turns up beach finds that
// earn gems; the Crystal Dig Spot ("finds": "crystals") turns up Crystals.
// What can be found, and how long it takes, is in data/digging.js.

let digTimer = null; // the countdown until the shovel finds something
let digSpot = null;  // the dig spot in use

// Pick a beach find at random. Finds with a bigger "chance" turn up more often.
function randomFind() {
  const finds = GAME_DATA.beachFinds;
  const total = finds.reduce(function (sum, find) { return sum + find.chance; }, 0);
  let roll = Math.random() * total;
  for (const find of finds) {
    roll -= find.chance;
    if (roll < 0) return find;
  }
  return finds[0];
}

// A whole number from min to max.
function randomBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// Show the digging pop-up with a picture, a title, a message and whether
// the "Dig again" button shows.
function showDigging(art, title, message, done) {
  const artBox = document.getElementById("digging-art");
  artBox.innerHTML = "";
  artBox.className = "panel-art";
  if (typeof art === "string") artBox.textContent = art;
  else artBox.appendChild(art);
  document.getElementById("digging-title").textContent = title;
  const messageBox = document.getElementById("digging-message");
  messageBox.textContent = "";
  messageBox.append.apply(messageBox, message);
  document.getElementById("btn-digging-again").hidden = !done;
  document.getElementById("btn-digging-stop").textContent = done ? "Done" : "Stop digging";
  document.getElementById("digging-panel").hidden = false;
}

function startDigging(spot) {
  digSpot = spot;
  dig();
}

function dig() {
  clearTimeout(digTimer);
  showDigging("⛏️", "Digging at the " + digSpot.name, ["Dig, dig, dig..."], false);
  document.getElementById("digging-art").classList.add("waiting");
  const seconds = randomBetween(GAME_DATA.digging.minSeconds, GAME_DATA.digging.maxSeconds);
  digTimer = setTimeout(digSpot.finds === "crystals" ? foundCrystals : foundBeachFind, seconds * 1000);
}

function foundBeachFind() {
  if (foundOldKey()) return;
  if (foundInvisibleInk()) { // very rarely, ink for the Invisibility Room (js/invisible.js)
    const ink = GAME_DATA.invisibleRoom.ink;
    return showDigging(itemArt(findItem(ink)), "You found Invisible Ink!", [GAME_DATA.invisibleRoom.words.foundInk], true);
  }
  const find = randomFind();
  player.bucket.push(find.id); // into the bucket you carry (js/storage.js)
  player.gems += find.gems;
  writeSave(player);
  updateStatus();
  const message = find.gems > 0
    ? ["+", moneyLabel("gems", find.gems), " gems! It went into your bucket."]
    : ["No gems for this one, but it went into your bucket."];
  showDigging(itemArt(find), "You found a " + find.name + "!", message, true);
}

// Very rarely the Dig Spot turns up the Old Key for the chest in the Museum's
// Ancient Cat Pirate Room (data/museum.js). There's only one, so once you have it (or
// have opened the chest) it never turns up again.
function foundOldKey() {
  const chest = GAME_DATA.artifactsChest;
  if (owns(chest.key) || player.museum.chestOpened) return false;
  if (Math.random() >= luckyChance(chest.keyChance / 100)) return false; // luck helps (js/luck.js)
  player.backpack.push(chest.key);
  writeSave(player);
  updateStatus();
  showDigging(itemArt(findItem(chest.key)), "You found an Old Key!", [chest.found], true);
  return true;
}

// The Crystal Dig Spot: 1 Crystal, a troll, or too tired to keep digging.
function foundCrystals() {
  const roll = Math.random() * 100;
  const crystalChance = luckyChance(GAME_DATA.digging.crystalChance / 100) * 100; // luck helps (js/luck.js)
  if (roll < crystalChance) {
    player.crystals += 1;
    writeSave(player);
    showDigging("💎", "You dug up a Crystal!", ["+", moneyLabel("crystals", 1), " Crystal!"], true);
  } else if (roll < crystalChance + GAME_DATA.digging.trollChance) {
    document.getElementById("digging-panel").hidden = true;
    wakeTroll("under the Crystal Dig Spot"); // js/troll.js
  } else {
    showDigging("😴", "You got tired of digging", ["Phew! Rest a moment, then try again."], true);
  }
}

function stopDigging() {
  clearTimeout(digTimer);
  digTimer = null;
  digSpot = null;
  document.getElementById("digging-panel").hidden = true;
}

document.getElementById("btn-digging-again").addEventListener("click", dig);
document.getElementById("btn-digging-stop").addEventListener("click", stopDigging);
