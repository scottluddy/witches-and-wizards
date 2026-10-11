// Fishing: click a fishing spot (like a Lucky Rod at the Dock), wait a random
// time for a bite (sometimes nothing bites), then reel it in. The fish goes in
// the cooler you carry (js/storage.js) and you earn its gems. Fish and the waiting time are in data/fish.js.

let biteTimer = null;   // the countdown to the next bite
let fishingSpot = null; // the fishing spot in use

function findFish(id) {
  return GAME_DATA.fish.find(function (fish) { return fish.id === id; });
}

// A picture of the fish: its drawing, or its emoji until it's drawn.
function fishArt(fish) {
  return itemArt(fish); // fish look just like items (js/items.js)
}

// Everything a rod can pull up: the fish, then the treasures (shells and such).
function allCatches() {
  return GAME_DATA.fish.concat(GAME_DATA.treasures || []);
}

function isFish(thing) {
  return GAME_DATA.fish.indexOf(thing) !== -1;
}

// Pick a catch at random. Things with a bigger "chance" bite more often.
function randomCatch() {
  const catches = allCatches();
  const total = catches.reduce(function (sum, thing) { return sum + thing.chance; }, 0);
  let roll = Math.random() * total;
  for (const thing of catches) {
    roll -= thing.chance;
    if (roll < 0) return thing;
  }
  return catches[0];
}

// A whole number of seconds between minSeconds and maxSeconds.
function waitSeconds() {
  const min = GAME_DATA.fishing.minSeconds;
  const max = GAME_DATA.fishing.maxSeconds;
  return min + Math.floor(Math.random() * (max - min + 1));
}

// Show the fishing pop-up with a picture, a title, a message and which buttons.
function showFishing(art, title, message, buttons) {
  const artBox = document.getElementById("fishing-art");
  artBox.innerHTML = "";
  artBox.className = "panel-art";
  if (typeof art === "string") {
    artBox.textContent = art;
  } else {
    artBox.appendChild(art);
  }
  document.getElementById("fishing-title").textContent = title;
  const messageBox = document.getElementById("fishing-message");
  messageBox.textContent = "";
  messageBox.append.apply(messageBox, message);
  document.getElementById("btn-fishing-reel").hidden = buttons.indexOf("reel") === -1;
  document.getElementById("btn-fishing-again").hidden = buttons.indexOf("again") === -1;
  document.getElementById("btn-fishing-stop").textContent = buttons.indexOf("again") === -1 ? "Stop fishing" : "Done";
  document.getElementById("fishing-panel").hidden = false;
}

function startFishing(spot) {
  fishingSpot = spot;
  castLine();
}

// Throw the line in and wait for a bite.
function castLine() {
  clearTimeout(biteTimer);
  showFishing("🎣", "Fishing with " + fishingSpot.name, ["Waiting for a bite..."], []);
  document.getElementById("fishing-art").classList.add("waiting");
  let wait = waitSeconds();
  const giveUp = GAME_DATA.fishing.giveUpSeconds;
  if (giveUp && wait > giveUp) {
    // Luck (js/luck.js) can turn a miss into a bite after all.
    const catchChance = (giveUp - GAME_DATA.fishing.minSeconds) / (GAME_DATA.fishing.maxSeconds - GAME_DATA.fishing.minSeconds);
    if (Math.random() < secondChance(catchChance)) wait = randomBetween(GAME_DATA.fishing.minSeconds, giveUp);
  }
  if (giveUp && wait > giveUp) {
    // Too slow: nothing bites this time.
    biteTimer = setTimeout(function () {
      showFishing("🎣", "No luck this time", ["Sorry, nothing caught, please try again."], ["again"]);
    }, giveUp * 1000);
    return;
  }
  biteTimer = setTimeout(function () {
    showFishing("🎣", "Something's tugging the line!", ["Quick, reel it in!"], ["reel"]);
    document.getElementById("fishing-art").classList.add("biting");
  }, wait * 1000);
}

function reelIn() {
  const thing = randomCatch();
  player.gems += thing.gems;
  if (isFish(thing)) {
    player.cooler.push(thing.id);
    player.fishCount += 1; // only real fish count, treasures don't
    player.caughtAt.push({ id: thing.id, at: Date.now() }); // for Sashimi Grade (js/storage.js)
  } else {
    player.cooler.push(thing.id); // a treasure, not a fish (so not counted)
  }
  writeSave(player);
  updateStatus();
  const title = isFish(thing) ? "You caught a " + thing.name + "!" : "You found a " + thing.name + "!";
  showFishing(fishArt(thing), title,
    ["+", moneyLabel("gems", thing.gems), " gems! It went into your cooler."], ["again"]);
}

function stopFishing() {
  clearTimeout(biteTimer);
  biteTimer = null;
  fishingSpot = null;
  document.getElementById("fishing-panel").hidden = true;
}

document.getElementById("btn-fishing-reel").addEventListener("click", reelIn);
document.getElementById("btn-fishing-again").addEventListener("click", castLine);
document.getElementById("btn-fishing-stop").addEventListener("click", stopFishing);
