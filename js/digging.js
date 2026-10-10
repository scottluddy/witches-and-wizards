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

function foundCrystals() {
  const crystals = randomBetween(GAME_DATA.digging.crystalsMin, GAME_DATA.digging.crystalsMax);
  player.crystals += crystals;
  writeSave(player);
  updateStatus();
  showDigging("💎", "You dug up " + crystals + (crystals === 1 ? " Crystal!" : " Crystals!"),
    ["+", moneyLabel("crystals", crystals), " Crystals!"], true);
}

function stopDigging() {
  clearTimeout(digTimer);
  digTimer = null;
  digSpot = null;
  document.getElementById("digging-panel").hidden = true;
}

document.getElementById("btn-digging-again").addEventListener("click", dig);
document.getElementById("btn-digging-stop").addEventListener("click", stopDigging);
