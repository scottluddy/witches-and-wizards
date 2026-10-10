// Saving and loading the player's progress in the browser (localStorage).

const SAVE_KEY = "witches-and-wizards-save";
const SAVE_VERSION = 2; // bump when the save's shape changes, so old saves are ignored

function loadSave() {
  try {
    const save = JSON.parse(localStorage.getItem(SAVE_KEY));
    return save && save.version === SAVE_VERSION ? save : null;
  } catch (err) {
    return null; // no save yet, or the browser blocks storage
  }
}

function writeSave(player) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
  } catch (err) {
    console.warn("Could not save progress:", err);
  }
}

function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    // nothing to clear
  }
}

// A brand-new player, as made on the character select screen.
function newPlayer(playerName, characterId) {
  return {
    version: SAVE_VERSION,
    playerName: playerName,   // the real person playing
    characterId: characterId, // which character they chose (its name is fixed)
    at: "world",              // the map or place on screen
    spots: {},                // on each map, the place the character stands at
    grade: 1,
    adventurePoints: 0,
    crystals: 0,
    scholarship: true,        // one free item per store category, until all are chosen
    freePicks: {},            // the free item chosen in each category: { "Pet": "pet_owl" }
    backpack: [],             // item ids the character carries (never shown as a bag)
    stored: {}                // item ids put down somewhere: { "home": ["pet_owl"] }
  };
}
