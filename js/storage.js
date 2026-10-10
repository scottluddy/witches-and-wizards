// Where catches and finds are kept.
//
// While you're out, fish (and anything else a Lucky Rod pulls up) go in your
// cooler, things dug up at Pebble Beach go in your bucket, and bones from the
// Crystal Cave go in your satchel. At Home, click the cooler, the treasure
// chest or the Spell Book Table (pieces of furniture with "holds" in
// data/furniture.js) to empty your cooler or bucket into them for keeping.

const STORAGE = {
  cooler:     { title: "🧊 Cooler",         empty: "Your cooler is empty. Go fishing at the Dock!" },
  bucket:     { title: "🪣 Bucket",         empty: "Your bucket is empty. Dig at Pebble Beach!" },
  homeCooler: { title: "🧊 Home Cooler",    empty: "Nothing in here yet.", from: "cooler" },
  homeChest:  { title: "🧰 Treasure Chest", empty: "Nothing in here yet.", from: "bucket" },
  satchel:    { title: "👜 Satchel",        empty: "Your satchel is empty. Mine in the Crystal Cave!" },
  homeMaterials: { title: "📖 Spell Materials", empty: "Nothing in here yet. Bring bones from the Crystal Cave.", from: "satchel" }
};

// Every kind of thing that can be kept, so each one shows with its picture.
function keepableThings() {
  return GAME_DATA.fish.concat(GAME_DATA.treasures || [], GAME_DATA.beachFinds || [], GAME_DATA.mineFinds || []);
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
    const card = itemCard(thing, null);
    card.querySelector(".item-name").textContent = thing.name + (count > 1 ? " × " + count : "");
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

// Empty the cooler (or bucket) you carry into the one at Home.
function moveIntoStorage() {
  const from = STORAGE[openStorageName].from;
  player[openStorageName] = player[openStorageName].concat(player[from]);
  player[from] = [];
  writeSave(player);
  openStorage(openStorageName);
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
