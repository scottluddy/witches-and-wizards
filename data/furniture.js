// Furniture the player can move around (the 🪑 Rearrange button in a room).
// Each piece is cut out of the room's drawing by tools/process_art.py, which
// also makes an empty copy of the room to stand the pieces in.
//
//   place  the place id from data/places.js
//   id     short name for the piece (no spaces)
//   name   what to call it
//   box    where it is in the drawing: [left, top, right, bottom] percentages.
//          Make the box a little bigger than the piece; the script finds the
//          exact outline. (Press P in the game to find the numbers.)
//   holds  optional: click it at Home to open this store ("homeCooler" or
//          "homeChest", see js/storage.js)
//   min_part  optional: keep smaller loose bits too (like shadows); default 0.05
GAME_DATA.furniture = [
  { "place": "rec_room", "id": "snack_table", "name": "Snack Table",  "box": [8, 13, 36, 40] },
  { "place": "rec_room", "id": "armchair",   "name": "Pink Armchair", "box": [67, 24, 92, 51] },
  { "place": "rec_room", "id": "bookshelf",  "name": "Bookshelf",    "box": [79, 50, 97, 86] },
  { "place": "rec_room", "id": "egg_chair",  "name": "Purple Chair", "box": [57, 71, 69, 88] },

  { "place": "cabin", "id": "table",    "name": "Little Table", "box": [7, 63, 22, 78] },
  { "place": "cabin", "id": "stool",    "name": "Stool",       "box": [22, 69, 30, 78] },
  { "place": "cabin", "id": "sofa",     "name": "Blue Sofa",   "box": [37, 55, 66, 75] },
  { "place": "cabin", "id": "bookshelf", "name": "Bookshelf",   "box": [84, 57, 100, 76] },

  { "place": "home", "id": "bird_cage", "name": "Bird Cage", "box": [36.5, 23.6, 56.5, 65.0], "min_part": 0.002 },
  { "place": "home", "id": "pet_cage", "name": "Pet Cage", "box": [1.0, 37.1, 35.0, 70.0], "min_part": 0.002 },
  { "place": "home", "id": "chest", "name": "Treasure Chest", "holds": "homeChest", "box": [78.0, 43.8, 100.0, 64.6], "min_part": 0.002 },
  { "place": "home", "id": "armchair", "name": "Pink Armchair", "box": [64.0, 60.5, 84.5, 95.0], "min_part": 0.002 },
  { "place": "home", "id": "cooler", "name": "Cooler and Pet Food", "holds": "homeCooler", "box": [2.0, 74.5, 19.8, 90.0], "min_part": 0.002 },
  { "place": "home", "id": "spellbook_table", "name": "Spell Book Table", "holds": "homeMaterials", "box": [19.6, 73.6, 42.0, 96.0], "min_part": 0.002 }
];
