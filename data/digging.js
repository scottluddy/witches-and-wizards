// Digging at Pebble Beach: click a dig spot (type "digging" in data/places.js),
// dig for a few seconds, and see what turns up.
//
// The Dig Spot finds beach finds. Each earns its gems and goes in your cooler
// with the other treasures (they are not fish, so they don't add to the fish count).
//   id       short name (no spaces). The picture is art/processed/<id>.png
//   gems     gems it earns (0 = just for fun)
//   chance   how often it turns up compared to the others (bigger = more often)
GAME_DATA.beachFinds = [
  { "id": "beach_bottlecap",  "name": "Bottle Cap",  "gems": 0, "chance": 4, "emoji": "🧢",
    "description": "An old pink bottle cap. Not worth anything, but fun to find." },
  { "id": "beach_redshell",   "name": "Red Shell",   "gems": 2, "chance": 3, "emoji": "🐚",
    "description": "A twisty red sea shell." },
  { "id": "beach_sanddollar", "name": "Sand Dollar", "gems": 3, "chance": 2, "emoji": "🪙",
    "description": "A sand dollar with a star on it, dug out of the sand." }
];

// How long digging takes, in seconds (a random time in between).
// The Crystal Dig Spot (with the crystal mining shovel) finds Crystals
// instead: a random number from crystalsMin to crystalsMax.
GAME_DATA.digging = { "minSeconds": 3, "maxSeconds": 6, "crystalsMin": 1, "crystalsMax": 5 };
