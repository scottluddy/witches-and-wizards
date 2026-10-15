// Where catches and finds are kept.
//
// While you're out, fish (and anything else a Lucky Rod pulls up) go in your
// cooler, things dug up at Pebble Beach go in your bucket, and bones from the
// Crystal Cave go in your satchel, and fruit from the Fruit Orchard goes in
// your fruit basket. At Home, click the cooler, the treasure
// chest or the Spell Book Table (pieces of furniture with "holds" in
// data/furniture.js) to empty your cooler or bucket into them for keeping.

const STORAGE = {
  cooler:     { title: "🧊 Cooler",         empty: "Your cooler is empty. Go fishing at the Dock!" },
  bucket:     { title: "🪣 Bucket",         empty: "Your bucket is empty. Dig at Pebble Beach, or find pearls in the Pearl Cave!" },
  homeCooler: { title: "🧊 Home Cooler",    empty: "Nothing in here yet.", from: "cooler" },
  homeChest:  { title: "🧰 Treasure Chest", empty: "Nothing in here yet.", from: "bucket" },
  satchel:    { title: "👜 Satchel",        empty: "Your satchel is empty. Mine in the Crystal Cave!" },
  basket:     { title: "🧺 Fruit Basket",   empty: "Your fruit basket is empty. Pick fruit in the Fruit Orchard!" },
  homeMaterials: { title: "📖 Spell Materials", empty: "Nothing in here yet. Bring bones from the Crystal Cave.", from: "satchel" }
};

// Every kind of thing that can be kept, so each one shows with its picture.
function keepableThings() {
  return GAME_DATA.fish.concat(GAME_DATA.treasures || [], GAME_DATA.beachFinds || [], GAME_DATA.mineFinds || [], GAME_DATA.pearlFinds || [], GAME_DATA.fruits || [], GAME_DATA.honeyFinds || []);
}

let openStorageName = null; // which store the pop-up is showing

function openStorage(name) {
  openStorageName = name;
  const store = STORAGE[name];
  document.getElementById("storage-title").textContent = store.title;
  const list = document.getElementById("storage-items");
  list.innerHTML = "";
  const kept = player[name];
  if (kept.length === 0) list.textContent = store.empty;
  keepableThings().forEach(function (thing) {
    const count = kept.filter(function (id) { return id === thing.id; }).length;
    if (count === 0) return;
    // Sashimi Grade fish in the cooler at Home get their own card.
    const sashimi = name === "homeCooler" ? Math.min(count, countOf(player.sashimi, thing.id)) : 0;
    if (sashimi) list.appendChild(fishCard(thing, name, sashimi, true));
    if (count === sashimi) return;
    if (isFish(thing)) {
      const fishBox = fishCard(thing, name, count - sashimi, false);
      if (store.from) fishBox.appendChild(takeOutButton(thing, name));
      return list.appendChild(fishBox);
    }
    const card = itemCard(thing, null);
    card.querySelector(".item-name").textContent = thing.name + (count > 1 ? " × " + count : "");
    if (name === "basket" && thing.food) card.appendChild(eatFromBasket(thing)); // fruit can be eaten
    if (name === "basket") card.appendChild(holdButton(thing));                 // ...or held, for the unicorn
    if (store.from) card.appendChild(takeOutButton(thing, name));               // at Home: take one back
    list.appendChild(card);
  });

  // At Home: a button to empty what you carry into this one.
  const move = document.getElementById("btn-storage-move");
  move.hidden = !store.from;
  if (store.from) {
    const carried = player[store.from].length;
    move.disabled = carried === 0;
    move.textContent = carried === 0
      ? "Your " + store.from + " is empty"
      : "Put in everything from your " + store.from + " (" + carried + ")";
  }
  document.getElementById("storage-panel").hidden = false;
}

// A button to eat one fruit from the basket.
function eatFromBasket(fruit) {
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "😋 Eat one " + foodLabel(fruit);
  button.addEventListener("click", function () {
    const rule = cantEatHere(); // Museum rules (js/museum.js)
    if (rule) return (document.getElementById("storage-title").textContent = rule);
    const less = eat(fruit, "basket");
    openStorage("basket");
    document.getElementById("storage-title").textContent = "🧺 " + yumText(fruit, less);
  });
  return button;
}

// A button to take one fruit out and hold it in your hand (js/unicorns.js).
function holdButton(fruit) {
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "✋ Hold one";
  button.addEventListener("click", function () {
    holdFruit(fruit);
    document.getElementById("storage-panel").hidden = true;
  });
  return button;
}

// At Home: a button to take one thing back out, into the bag it came from
// (Home Cooler -> cooler, Treasure Chest -> bucket, Spell Materials -> satchel).
// Sashimi Grade fish stay at Home (they're only Sashimi Grade in the Home
// cooler), so their cards don't get this button; eat them here instead.
function takeOutButton(thing, name) {
  const bag = STORAGE[name].from;
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "↩️ Take one (into your " + bag + ")";
  button.addEventListener("click", function () {
    const list = player[name];
    list.splice(list.indexOf(thing.id), 1);
    player[bag].push(thing.id);
    writeSave(player);
    openStorage(name);
    document.getElementById("storage-title").textContent = "↩️ The " + thing.name + " is in your " + bag + " now.";
  });
  return button;
}

// Empty the cooler (or bucket) you carry into the one at Home.
function moveIntoStorage() {
  const from = STORAGE[openStorageName].from;
  const fresh = from === "cooler" ? keepFreshFish() : 0;
  player[openStorageName] = player[openStorageName].concat(player[from]);
  player[from] = [];
  writeSave(player);
  openStorage(openStorageName);
  if (fresh) {
    document.getElementById("storage-title").textContent = "🍣 " + fresh +
      (fresh === 1 ? " fish was" : " fish were") + " fresh enough to be Sashimi Grade!";
  }
}

// ---------------------------------------------------------------- fish and Sashimi Grade

// How many times "id" is in a list.
function countOf(list, id) {
  return list.filter(function (other) { return other === id; }).length;
}

// Fish in the cooler you carry that were caught in the last few minutes
// (data/fish.js "sashimi"), by name.
function freshCount(id) {
  const freshFor = GAME_DATA.sashimi.minutes * 60000;
  return player.caughtAt.filter(function (c) { return c.id === id && Date.now() - c.at <= freshFor; }).length;
}

// Putting fish away at Home: the fresh ones become Sashimi Grade. Returns how many.
function keepFreshFish() {
  let made = 0;
  GAME_DATA.fish.forEach(function (fish) {
    const fresh = Math.min(freshCount(fish.id), countOf(player.cooler, fish.id));
    for (let i = 0; i < fresh; i++) player.sashimi.push(fish.id);
    made += fresh;
  });
  player.caughtAt = []; // the cooler you carry is empty now
  return made;
}

// A fish left the cooler you carry (eaten or sold): forget its oldest catch time.
function forgetCatch(id) {
  const i = player.caughtAt.findIndex(function (c) { return c.id === id; });
  if (i !== -1) player.caughtAt.splice(i, 1);
}

// Hunger points eating a fish takes away; Sashimi Grade takes away more.
function fishFood(fish, sashimi) {
  return foodIn(fish) + (sashimi ? GAME_DATA.sashimi.extraFood : 0);
}

// A card for some fish: its name, how many, Sashimi Grade or still fresh, and an Eat button.
function fishCard(fish, storeName, count, sashimi) {
  const card = itemCard(fish, null);
  let name = fish.name + (sashimi ? " (🍣 Sashimi Grade)" : "") + (count > 1 ? " × " + count : "");
  const fresh = storeName === "cooler" ? freshCount(fish.id) : 0;
  if (fresh) name += " (🍣 " + fresh + " still fresh)";
  card.querySelector(".item-name").textContent = name;
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "😋 Eat one (🥦 healthy, -" + fishFood(fish, sashimi) + " 🍽️)";
  button.addEventListener("click", function () { eatFish(fish, storeName, sashimi); });
  card.appendChild(button);
  return card;
}

function eatFish(fish, storeName, sashimi) {
  const rule = cantEatHere(); // Museum rules (js/museum.js)
  if (rule) return (document.getElementById("storage-title").textContent = rule);
  const before = player.hunger;
  player.hunger = Math.max(0, player.hunger - fishFood(fish, sashimi));
  const list = player[storeName];
  list.splice(list.indexOf(fish.id), 1);
  if (sashimi) player.sashimi.splice(player.sashimi.indexOf(fish.id), 1);
  if (storeName === "cooler") forgetCatch(fish.id);
  writeSave(player);
  openStorage(storeName);
  document.getElementById("storage-title").textContent = "😋 Yum! The " + fish.name +
    " took away " + (before - player.hunger) + " hunger point" + (before - player.hunger === 1 ? "" : "s") + ".";
}

document.getElementById("btn-storage-move").addEventListener("click", moveIntoStorage);

document.getElementById("btn-storage-close").addEventListener("click", function () {
  document.getElementById("storage-panel").hidden = true;
});

document.getElementById("btn-cooler").addEventListener("click", function () {
  if (!walking) openStorage("cooler");
});

document.getElementById("btn-bucket").addEventListener("click", function () {
  if (!walking) openStorage("bucket");
});

document.getElementById("btn-satchel").addEventListener("click", function () {
  if (!walking) openStorage("satchel");
});

document.getElementById("btn-basket").addEventListener("click", function () {
  if (!walking) openStorage("basket");
});
