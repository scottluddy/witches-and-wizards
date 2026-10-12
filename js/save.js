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
  // Older saves only had the cooler, which held nothing but fish.
  if (save.fishCount === undefined) save.fishCount = save.cooler.length;
  if (!save.bucket) save.bucket = [];
  if (!save.homeCooler) save.homeCooler = [];
  if (!save.homeChest) save.homeChest = [];
  if (!save.satchel) save.satchel = [];
  if (!save.homeMaterials) save.homeMaterials = [];
  if (save.treasures) {
    // Treasures used to have their own list: fishing ones go in the cooler,
    // dug-up ones in the bucket.
    save.treasures.forEach(function (id) {
      (id.indexOf("beach_") === 0 ? save.bucket : save.cooler).push(id);
    });
    delete save.treasures;
  }
  if (!save.furniture) save.furniture = {};
  if (save.chorePoints === undefined) save.chorePoints = 0;
  if (!save.dirt) save.dirt = {};
  if (!save.dirtSeconds) save.dirtSeconds = {};
  if (save.hunger === undefined) save.hunger = 0;
  if (save.walked === undefined) save.walked = 0;
  if (!save.marshmallows) save.marshmallows = [];
  if (!save.basket) save.basket = [];
  if (!save.spells) save.spells = [];
  if (!save.unicorn) save.unicorn = { trusted: false, canSee: false, applesNeeded: 0, applesFed: 0 };
  // Unicorns now need to trust you first; one that can already see trusts you.
  if (save.unicorn.trusted === undefined) save.unicorn.trusted = save.unicorn.canSee;
  if (save.holding === undefined) save.holding = null;
  if (save.dancePoints === undefined) save.dancePoints = 0;
  if (save.bondingPoints === undefined) save.bondingPoints = 0;
  if (save.skills === undefined) save.skills = [];
  // When each pet was last cared for, by kind (was "lastBath" before the sofa).
  if (save.lastCare === undefined) save.lastCare = { bath: save.lastBath || {} };
  delete save.lastBath;
  Object.keys(GAME_DATA.bonding).forEach(function (kind) {
    if (GAME_DATA.bonding[kind].everyMinutes && !save.lastCare[kind]) save.lastCare[kind] = {};
  });
  if (save.sashimi === undefined) save.sashimi = [];
  if (save.caughtAt === undefined) save.caughtAt = [];
  if (save.luckSeconds === undefined) save.luckSeconds = 0;
  if (save.levelStart === undefined) save.levelStart = {};
  if (save.unicornsHelped === undefined) save.unicornsHelped = 0;
  renameItem(save, "broom_snowball", "broom_snowflake"); // the coloured Snowflake replaced Snowball
  // Scott named the Floor 1 Snack Shack shelves.
  renameItem(save, "snack_jars", "snack_water");
  renameItem(save, "snack_bottles", "snack_icees");
  renameItem(save, "snack_shelf_mugs", "snack_tea");
  renameItem(save, "snack_straw_cup", "snack_straws");
  renamePlace(save, "rec_room", "hut"); // the Rec Room drawing became the Snowy Hut itself
  return save;
}

// When a place is renamed, games that were there or left things there follow it.
function renamePlace(save, oldId, newId) {
  if (save.at === oldId) save.at = newId;
  Object.keys(save.spots).forEach(function (map) { if (save.spots[map] === oldId) save.spots[map] = newId; });
  ["stored", "furniture", "dirt", "dirtSeconds"].forEach(function (field) {
    if (save[field] && save[field][oldId]) {
      save[field][newId] = save[field][oldId];
      delete save[field][oldId];
    }
  });
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
  updateStatus(); // the game saves after every change, so the top bar stays up to date (js/game.js)
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
    cooler: [],               // what the character caught fishing and carries (one id per catch)
    fishCount: 0,             // how many fish caught in all (treasures don't count), for later
    bucket: [],               // what the character dug up at Pebble Beach and carries
    homeCooler: [],           // catches put away in the cooler at Home
    homeChest: [],            // finds put away in the treasure chest at Home
    satchel: [],              // bones (and later other materials) from the Crystal Cave, carried
    homeMaterials: [],        // materials put away at the Spell Book Table at Home, for spells
    furniture: {},            // where furniture was moved: { "hut": { "armchair": [x, y] } }
    chorePoints: 0,           // earned by doing chores, like cleaning your room (js/chores.js)
    dirt: {},                 // how dirty each room is: { "home": 2 } (0 is clean)
    dirtSeconds: {},          // seconds spent in each room since it last got dirtier
    hunger: 0,                // 0 to 10: walking adds hunger, snacks take it away (js/hunger.js)
    walked: 0,                // map-widths walked toward the next hunger point
    marshmallows: [],         // hot chocolates in the backpack that have marshmallows
    basket: [],               // fruit picked in the Fruit Orchard, carried (js/orchard.js)
    spells: [],               // spells in your spell book, like "seeing" (js/spells.js)
    skills: [],               // other skills learned, like "piano" (js/music.js)
    unicorn: { trusted: false, canSee: false, applesNeeded: 0, applesFed: 0 }, // the blind unicorn you're helping
    dancePoints: 0,           // Solve to Dance points; every few earn a gem (js/dance.js)
    bondingPoints: 0,         // earned by taking care of your pet (js/bonding.js)
    lastCare: { bath: {}, cuddle: {} }, // when each pet was last cared for: { bath: { "pet_owl": time } }
    caughtAt: [],             // when each fish in the cooler you carry was caught: [{ id, at }]
    sashimi: [],              // fish in the cooler at Home that are Sashimi Grade (one id each)
    luckSeconds: 0,           // seconds of Luck Potion left (js/luck.js)
    levelStart: {},           // the counters when you last went up a Level (js/levels.js)
    holding: null,            // a fruit taken out of the basket and held in your hand (js/unicorns.js)
    unicornsHelped: 0,        // unicorns that found their families (js/unicorns.js)
    scholarship: true,        // one free item per store category, until all are chosen
    freePicks: {},            // the free item chosen in each category: { "Pet": "pet_owl" }
    backpack: [],             // item ids the character carries (never shown as a bag)
    stored: {}                // item ids put down somewhere: { "home": ["pet_owl"] }
  };
}
