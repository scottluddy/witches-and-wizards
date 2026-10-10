// Every place in the game, from the whole world down to a single shelf.
//
//   id          short name used everywhere else (no spaces)
//   name        what players see
//   type        "map"    = the character walks between the places on it
//               "place"  = a picture with spots you can click
//               "person" = someone in a picture who talks when clicked ("says")
//   in          the place it sits inside (left out for the world)
//   x, y        where it sits on that picture, as percentages across and down
//               (press P in the game and click to find numbers)
//   start       true for the spot the character arrives at on a map
//   description shown under the picture
//   shelf       store shelves only: which item category it holds
//   rows        store shelves only: the gaps on the shelf drawing where items
//               stand, as [top, bottom] percentages down the picture, filled
//               three items to a gap (press P to find the numbers)
//   says        people only: what they say when you click them
//
// Pictures: maps use art/processed/map_<id>.png and places use
// art/processed/place_<id>.png. Draw one and save it in art/raw with that
// name (for example art/raw/place_store.jpg), then run tools/process_art.py.
// Until then a placeholder picture is made for you.
GAME_DATA.places = [
  { "id": "world", "name": "The World", "type": "map" },

  { "id": "village",  "name": "Village",  "type": "map", "in": "world", "x": 31, "y": 33, "start": true },
  { "id": "forest",   "name": "Forest",   "type": "map", "in": "world", "x": 32, "y": 80 },
  { "id": "mountain", "name": "Mountain", "type": "map", "in": "world", "x": 77, "y": 27 },
  { "id": "lake",     "name": "Lake",     "type": "map", "in": "world", "x": 91, "y": 66 },

  { "id": "home",   "name": "Home",          "type": "place", "in": "village", "x": 22, "y": 72, "start": true,
    "description": "Your cosy dorm room. You can leave things here for safe keeping." },
  { "id": "store",  "name": "Campus Store",  "type": "place", "in": "village", "x": 50, "y": 42,
    "description": "The clerk waves hello. Click a shelf to see what's for sale." },
  { "id": "school", "name": "Wizard School", "type": "place", "in": "village", "x": 79, "y": 62,
    "description": "Behind the round wall, young witches and wizards learn magic." },

  { "id": "shelf_brooms",  "name": "Broomsticks",   "type": "place", "in": "store", "x": 13, "y": 35, "shelf": "Broomstick",
    "rows": [[49, 60], [64, 78]] },
  { "id": "shelf_pets",    "name": "Pets",          "type": "place", "in": "store", "x": 40, "y": 51, "shelf": "Pet",
    "rows": [[64, 78]] },
  { "id": "shelf_potions", "name": "Potions",       "type": "place", "in": "store", "x": 44, "y": 22, "shelf": "Potion",
    "rows": [[64, 78]] },
  { "id": "shelf_hats",    "name": "Hats",          "type": "place", "in": "store", "x": 78, "y": 33, "shelf": "Hat",
    "rows": [[64, 78]] },
  { "id": "shelf_wands",   "name": "Wands",         "type": "place", "in": "store", "x": 10, "y": 86, "shelf": "Wand",
    "rows": [[64, 78]] },
  { "id": "shelf_special", "name": "Special Items", "type": "place", "in": "store", "x": 77, "y": 72, "shelf": "Special Item",
    "rows": [[64, 78]] },

  { "id": "cabin",     "name": "Little Cabin",   "type": "place", "in": "forest", "x": 28, "y": 68, "start": true,
    "description": "A tiny cabin between the trees. Who lives here?" },
  { "id": "old_oak",   "name": "Old Oak",        "type": "place", "in": "forest", "x": 62, "y": 34,
    "description": "The oldest tree in the forest. Some say it whispers." },
  { "id": "mushrooms", "name": "Mushroom Ring",  "type": "place", "in": "forest", "x": 76, "y": 74,
    "description": "A circle of glowing mushrooms. Fairies dance here at night." },

  { "id": "cave",      "name": "Crystal Cave",   "type": "place", "in": "mountain", "x": 26, "y": 74, "start": true,
    "description": "The walls sparkle with crystals." },
  { "id": "peak",      "name": "Windy Peak",     "type": "place", "in": "mountain", "x": 58, "y": 24,
    "description": "You can see the whole world from up here!" },
  { "id": "hut",       "name": "Snowy Hut",      "type": "place", "in": "mountain", "x": 80, "y": 66,
    "description": "Warm cocoa and a crackling fire." },

  { "id": "dock",      "name": "Dock",           "type": "place", "in": "lake", "x": 22, "y": 74, "start": true,
    "description": "Little boats bob on the water." },
  { "id": "island",    "name": "Tiny Island",    "type": "place", "in": "lake", "x": 58, "y": 42,
    "description": "Just big enough for one tree and a picnic." },
  { "id": "beach",     "name": "Pebble Beach",   "type": "place", "in": "lake", "x": 80, "y": 78,
    "description": "Smooth pebbles, perfect for skipping." }
];
