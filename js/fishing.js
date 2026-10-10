// Fishing: click a fishing spot (like a Lucky Rod at the Dock), wait a random
// time for a bite, then reel it in. The fish goes in the cooler and you earn
// its gems. Fish and the waiting time are in data/fish.js.

let biteTimer = null;   // the countdown to the next bite
let fishingSpot = null; // the fishing spot in use

function findFish(id) {
  return GAME_DATA.fish.find(function (fish) { return fish.id === id; });
}

// A picture of the fish: its drawing, or its emoji until it's drawn.
function fishArt(fish) {
  return itemArt(fish); // fish look just like items (js/items.js)
}

// Pick a fish at random. Fish with a bigger "chance" bite more often.
function randomFish() {
  const total = GAME_DATA.fish.reduce(function (sum, fish) { return sum + fish.chance; }, 0);
  let roll = Math.random() * total;
  for (const fish of GAME_DATA.fish) {
    roll -= fish.chance;
    if (roll < 0) return fish;
  }
  return GAME_DATA.fish[0];
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
  biteTimer = setTimeout(function () {
    showFishing("🎣", "Something's tugging the line!", ["Quick, reel it in!"], ["reel"]);
    document.getElementById("fishing-art").classList.add("biting");
  }, waitSeconds() * 1000);
}

function reelIn() {
  const fish = randomFish();
  player.cooler.push(fish.id);
  player.gems += fish.gems;
  writeSave(player);
  updateStatus();
  showFishing(fishArt(fish), "You caught a " + fish.name + "!",
    ["+", moneyLabel("gems", fish.gems), " gems! It went into your cooler."], ["again"]);
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

// ---------------------------------------------------------------- the cooler

// Every kind of fish caught so far, with how many.
function openCooler() {
  const list = document.getElementById("cooler-fish");
  list.innerHTML = "";
  if (player.cooler.length === 0) {
    list.textContent = "Your cooler is empty. Go fishing at the Dock!";
  }
  GAME_DATA.fish.forEach(function (fish) {
    const count = player.cooler.filter(function (id) { return id === fish.id; }).length;
    if (count === 0) return;
    const card = itemCard(fish, null);
    card.querySelector(".item-name").textContent = fish.name + (count > 1 ? " × " + count : "");
    list.appendChild(card);
  });
  document.getElementById("cooler-panel").hidden = false;
}

document.getElementById("btn-cooler").addEventListener("click", function () {
  if (!walking) openCooler();
});

document.getElementById("btn-cooler-close").addEventListener("click", function () {
  document.getElementById("cooler-panel").hidden = true;
});
