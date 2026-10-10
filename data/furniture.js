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
GAME_DATA.furniture = [
  { "place": "rec_room", "id": "snack_table", "name": "Snack Table",   "box": [8, 13, 36, 40] },
  { "place": "rec_room", "id": "armchair",    "name": "Pink Armchair", "box": [67, 24, 92, 51] },
  { "place": "rec_room", "id": "bookshelf",   "name": "Bookshelf",     "box": [79, 50, 97, 86] },
  { "place": "rec_room", "id": "egg_chair",   "name": "Purple Chair",  "box": [57, 71, 69, 88] },

  { "place": "cabin", "id": "table",     "name": "Little Table", "box": [7, 63, 22, 78] },
  { "place": "cabin", "id": "stool",     "name": "Stool",        "box": [22, 69, 30, 78] },
  { "place": "cabin", "id": "sofa",      "name": "Blue Sofa",    "box": [37, 55, 66, 75] },
  { "place": "cabin", "id": "bookshelf", "name": "Bookshelf",    "box": [84, 57, 100, 76] }
];
