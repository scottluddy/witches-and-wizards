// Saving and loading games in the browser (localStorage).
//
// The browser keeps up to MAX_SAVES games, newest first. Each game saves
// itself as you play. Starting a new game when the list is full removes the
// oldest one. Saves live in this browser only: another browser, computer or
// web address (the GitHub site vs. the Claude link) has its own list.

const SAVES_KEY = "witches-and-wizards-saves";
const OLD_SAVE_KEY = "witches-and-wizards-save"; // the single save used before the list
const SAVE_VERSION = 3; // bump when the save's shape changes, so old saves are ignored
const MAX_SAVES = 10;

// Every saved game, newest first.
function loadSaves() {
  try {
    let saves = JSON.parse(localStorage.getItem(SAVES_KEY)) || [];
    const old = JSON.parse(localStorage.getItem(OLD_SAVE_KEY));
    if (old) saves.unshift(old); // bring the older single save into the list
    const needsUpdate = old || saves.some(function (save) { return save.version !== SAVE_VERSION; });
    saves = saves.map(fillIn).filter(Boolean);
    if (needsUpdate) {
      // Store the updated saves, so each keeps the same id from now on.
      localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
      localStorage.removeItem(OLD_SAVE_KEY);
    }
    return saves;
  } catch (err) {
    return []; // no saves yet, or the browser blocks storage
  }
}

// Older saves get any newer fields added, so they keep working.
function fillIn(save) {
  if (!save || (save.version !== SAVE_VERSION && save.version !== 2)) return null;
  if (save.version === 2) {
    // Version 2 had Grades and no Witch or Wizard choice yet.
    save.level = save.grade || 1;
    delete save.grade;
    save.version = SAVE_VERSION;
  }
  if (!save.id) save.id = "save-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  if (!save.savedAt) save.savedAt = Date.now();
  if (save.gems === undefined) save.gems = 0;
  if (!save.cooler) save.cooler = [];
  if (!save.treasures) save.treasures = [];
  // Older saves only had the cooler, which held nothing but fish.
  if (save.fishCount === undefined) save.fishCount = save.cooler.length;
  if (!save.furniture) save.furniture = {};
  renameItem(save, "broom_snowball", "broom_snowflake"); // the coloured Snowflake replaced Snowball
  return save;
}

// When an item is replaced by a new drawing, games that owned it get the new one.
function renameItem(save, oldId, newId) {
  const swap = function (id) { return id === oldId ? newId : id; };
  save.backpack = save.backpack.map(swap);
  Object.keys(save.stored).forEach(function (place) { save.stored[place] = save.stored[place].map(swap); });
  Object.keys(save.freePicks).forEach(function (kind) { save.freePicks[kind] = swap(save.freePicks[kind]); });
}

// Save this game: it moves to the top of the list.
function writeSave(player) {
  player.savedAt = Date.now();
  const others = loadSaves().filter(function (save) { return save.id !== player.id; });
  const saves = [player].concat(others).slice(0, MAX_SAVES);
  try {
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
  } catch (err) {
    console.warn("Could not save progress:", err);
  }
}

// "Witch Level 1". Games saved before the choice existed just say "Level 1".
function levelLabel(player) {
  const kind = player.kind === "witch" ? "Witch " : player.kind === "wizard" ? "Wizard " : "";
  return kind + "Level " + player.level;
}

// A brand-new player, as made on the character select screen.
function newPlayer(playerName, characterId, kind) {
  return {
    version: SAVE_VERSION,
    id: "save-" + Date.now(), // tells saved games apart
    savedAt: Date.now(),      // when it was last saved (for the list on the title screen)
    playerName: playerName,   // the real person playing
    characterId: characterId, // which character they chose (its name is fixed)
    kind: kind,               // "witch" or "wizard"
    at: "world",              // the map or place on screen
    spots: {},                // on each map, the place the character stands at
    level: 1,
    adventurePoints: 0,
    crystals: 0,
    gems: 0,                  // rarer money, earned by fishing
    cooler: [],               // fish ids the character has caught (one entry per fish)
    fishCount: 0,             // how many fish caught in all (treasures don't count), for later
    treasures: [],            // treasure ids pulled up while fishing (shells, sand dollars)
    furniture: {},            // where furniture was moved: { "rec_room": { "armchair": [x, y] } }
    scholarship: true,        // one free item per store category, until all are chosen
    freePicks: {},            // the free item chosen in each category: { "Pet": "pet_owl" }
    backpack: [],             // item ids the character carries (never shown as a bag)
    stored: {}                // item ids put down somewhere: { "home": ["pet_owl"] }
  };
}
