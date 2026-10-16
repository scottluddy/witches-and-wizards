// Every place in the game, from the whole world down to a single shelf.
//
//   id          short name used everywhere else (no spaces)
//   name        what players see
//   type        "map"    = the character walks between the places on it
//               "place"  = a picture with spots you can click
//               "person" = someone in a picture who talks when clicked ("says")
//               "fishing" = a fishing spot: click it to go fishing (fish are in data/fish.js)
//               "digging" = a dig spot: click it to dig ("finds": "beach" or "crystals";
//                           what turns up is in data/digging.js)
//   in          the place it sits inside (left out for the world)
//   x, y        where it sits on that picture, as percentages across and down
//               (press P in the game and click to find numbers)
//   side        "left" or "right" instead of x, y: a previous / next button just
//               outside the picture, so it never covers the drawing (Scott, 2026-10-16)
//   start       true for the spot the character arrives at on a map
//   description shown under the picture
//   shelf       shops and store shelves: which item category it sells
//   rows        store shelves only: the gaps on the shelf drawing where items
//               stand, as [top, bottom] percentages down the picture, filled
//               three items to a gap (press P to find the numbers)
//   perRow      store shelves only: how many items stand in each gap (3 if not set)
//   says        people only: what they say when you click them
//   opens       go straight into this place instead of showing this one
//   trade       Trading Post shelves: items are traded, not bought (data/trading.js)
//               "selling" = the Gems shelf at the Trading Post: sell things for gems
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
  { "id": "meadows",  "name": "Meadows",  "type": "map", "in": "world", "x": 66, "y": 80 },
  // The Farm (Scott, 2026-10-15): a new territory, just laid out for now with
  // its three sections. Placed by Claude in the empty space west of the
  // Village and the Forest until it's drawn on the World map.
  { "id": "farm",     "name": "Farm",     "type": "map", "in": "world", "x": 9, "y": 62 },

  { "id": "home",   "name": "Home",          "type": "place", "in": "village", "x": 17, "y": 80, "start": true,
    "description": "Your cosy dorm room. Click the cooler or the chest to put away what you caught and dug up, or the bath tub to wash your pet." },
  // The bath tub is computer-drawn for now ("picture", made by tools/process_art.py)
  // until the girls draw one. "size" is its width, in percent of the room picture.
  { "id": "home_yarn", "name": "Ball of Yarn", "type": "care", "care": "yarn", "in": "home", "x": 20, "y": 28 },
  { "id": "bath_tub", "name": "Bath Tub", "type": "bath", "in": "home", "x": 53, "y": 84, "picture": "bath_tub", "size": 15 },
  { "id": "store",  "name": "Campus Store",  "type": "place", "in": "village", "x": 14, "y": 33,
    "description": "The clerk waves hello. Click a shelf to see what's for sale." },
  { "id": "dress_shop", "name": "Fine Dressmaking", "type": "place", "in": "village", "x": 30, "y": 65, "shelf": "Dresses",
    "rows": [[6, 28], [58, 76]],
    "description": "Dresses for every season hang on the walls, priced in Crystals. The dressmaker waves from the counter." },
  { "id": "disco_hall", "name": "Disco Dance Hall", "type": "place", "in": "village", "x": 76, "y": 29,
    "description": "A dance floor under a big disco ball, and a piano. If you can play the piano, play a song and everyone dances!" },
  { "id": "hall_piano", "name": "Piano", "type": "piano", "in": "disco_hall", "x": 27, "y": 62 },
  // The Multi-House (Scott, 2026-10-14): six floors, reached by an elevator that
  // only shows floor numbers, so you have to find out what's on each floor.
  // "floors" lists them from Floor 1 up; null is a floor not drawn yet. Each
  // floor's drawn floor list is the elevator back (type "elevator"). Where it
  // lives isn't decided: the Village for now.
  { "id": "multi_house", "name": "Multi-House", "type": "place", "in": "village", "x": 66, "y": 57,
    "floors": ["multi_dance", "multi_coaster", null, null, "multi_jewelry", null] },
  { "id": "multi_dance", "name": "Dance Floor", "type": "place", "in": "village", "hidden": true, "building": "multi_house",
    "danceFloor": { "ball": [48, 15], "dancers": [
      { "emoji": "💃", "x": 42, "y": 50 }, { "emoji": "🕺", "x": 54, "y": 44 }, { "emoji": "💃", "x": 64, "y": 52 },
      { "emoji": "🕺", "x": 46, "y": 70 }, { "emoji": "🧚", "x": 58, "y": 66 }, { "emoji": "💃", "x": 68, "y": 74 } ] },
    "description": "Floor 1: a dance floor with a big disco ball and a piano." },
  { "id": "multi_dance_piano", "name": "Piano", "type": "piano", "in": "multi_dance", "x": 22, "y": 62 },
  { "id": "multi_dance_elevator", "name": "Elevator", "type": "elevator", "building": "multi_house", "in": "multi_dance", "x": 77, "y": 80 },
  { "id": "multi_coaster", "name": "Roller Coaster", "type": "place", "in": "village", "hidden": true, "building": "multi_house",
    "description": "Floor 2: a twisty roller coaster! Hop in the car at the start. Bring a pet in your backpack to ride together." },
  { "id": "coaster_ride", "name": "Ride", "type": "coaster", "in": "multi_coaster", "x": 49, "y": 86 },
  { "id": "multi_coaster_elevator", "name": "Elevator", "type": "elevator", "building": "multi_house", "in": "multi_coaster", "x": 87, "y": 86 },
  { "id": "multi_jewelry", "name": "Jewelry Shop", "type": "place", "in": "village", "hidden": true, "building": "multi_house", "shelf": "Jewelry",
    "description": "Floor 5: necklaces and bracelets with sparkly stones. The jeweler smiles from the counter." },
  { "id": "jeweler", "name": "Jeweler", "type": "person", "in": "multi_jewelry", "x": 46, "y": 60,
    "says": "Welcome to the Jewelry Shop! Every piece is made with a real gemstone. Have a look!" },
  { "id": "multi_jewelry_elevator", "name": "Elevator", "type": "elevator", "building": "multi_house", "in": "multi_jewelry", "x": 84, "y": 82 },
  { "id": "cafe", "name": "Cafe", "type": "place", "in": "village", "x": 81, "y": 76,
    "description": "Sit down for a proper meal. Click the menu to order; you eat it right here." },
  { "id": "cafe_menu", "name": "Menu", "type": "cafe", "in": "cafe", "x": 20, "y": 22, "menu": "Cafe Menu" },
  // The Museum (Scott, 2026-10-15, the girls' drawings; placed by Claude until a Village map is drawn).
  // Pay 5 gems at Pay Here for a ticket, then Enter the Exhibit Hall and visit
  // every room before the Snack Shop opens. Museum rules: you can only eat
  // sitting down ("museumRules", js/museum.js). The numbers are in data/museum.js.
  { "id": "museum", "name": "Museum", "type": "place", "in": "village", "x": 44, "y": 72, "museumRules": true,
    "description": "Welcome to the Museum! Pay at the desk for a ticket, then click Enter." },
  { "id": "museum_pay", "name": "Pay Here", "type": "museum_pay", "in": "museum", "x": 18, "y": 33 },
  { "id": "museum_hall", "name": "Exhibit Hall", "type": "place", "in": "museum", "x": 87, "y": 58, "needsTicket": true,
    "description": "The Exhibit Hall (not drawn yet). Visit every room, then the Snack Shop opens." },
  { "id": "museum_room_1", "name": "Art Exhibit", "type": "place", "in": "museum_hall", "x": 15, "y": 40, "museumRoom": true,
    "description": "Eight paintings hang on the walls." },
  { "id": "museum_room_2", "name": "Gem Stone Exhibit", "type": "place", "in": "museum_hall", "x": 35, "y": 25, "museumRoom": true,
    "description": "Six gem stones on their stands: Amethyst, Diamond, Sapphire, Opal, Ruby and a heart-shaped Emerald. Please don't touch anything!" },
  { "id": "museum_room_3", "name": "Exhibit Room 3", "type": "place", "in": "museum_hall", "x": 55, "y": 40, "museumRoom": true },
  { "id": "museum_room_4", "name": "Exhibit Room 4", "type": "place", "in": "museum_hall", "x": 75, "y": 25, "museumRoom": true },
  { "id": "museum_room_5", "name": "Exhibit Room 5", "type": "place", "in": "museum_hall", "x": 85, "y": 60, "museumRoom": true },
  // Previous / next room buttons in each Exhibit Room (Scott, 2026-10-15), beside the picture.
  { "id": "museum_room_1_back", "name": "Exhibit Hall", "type": "travel", "in": "museum_room_1", "side": "left", "to": "museum_hall" },
  { "id": "museum_room_1_next", "name": "Gem Stone Exhibit", "type": "travel", "in": "museum_room_1", "side": "right", "to": "museum_room_2" },
  { "id": "museum_room_2_back", "name": "Art Exhibit", "type": "travel", "in": "museum_room_2", "side": "left", "to": "museum_room_1" },
  { "id": "museum_room_2_next", "name": "Exhibit Room 3", "type": "travel", "in": "museum_room_2", "side": "right", "to": "museum_room_3" },
  { "id": "museum_room_3_back", "name": "Gem Stone Exhibit", "type": "travel", "in": "museum_room_3", "side": "left", "to": "museum_room_2" },
  { "id": "museum_room_3_next", "name": "Exhibit Room 4", "type": "travel", "in": "museum_room_3", "side": "right", "to": "museum_room_4" },
  { "id": "museum_room_4_back", "name": "Exhibit Room 3", "type": "travel", "in": "museum_room_4", "side": "left", "to": "museum_room_3" },
  { "id": "museum_room_4_next", "name": "Exhibit Room 5", "type": "travel", "in": "museum_room_4", "side": "right", "to": "museum_room_5" },
  { "id": "museum_room_5_back", "name": "Exhibit Room 4", "type": "travel", "in": "museum_room_5", "side": "left", "to": "museum_room_4" },
  { "id": "museum_room_5_next", "name": "Exhibit Hall", "type": "travel", "in": "museum_room_5", "side": "right", "to": "museum_hall" },
  { "id": "museum_hall_snacks", "name": "Snack Shop", "type": "travel", "in": "museum_hall", "x": 45, "y": 75, "to": "museum_snack_shop" },
  { "id": "museum_snack_shop", "name": "Snack Shop", "type": "place", "in": "museum_hall", "hidden": true, "needsRound": true,
    "description": "Click the menu to buy something. Museum rules: sit on the chair to eat or drink!" },
  { "id": "museum_chef", "name": "Chef", "type": "person", "in": "museum_snack_shop", "x": 17, "y": 50,
    "says": "Welcome!" },
  { "id": "museum_menu", "name": "Menu", "type": "menu_shop", "in": "museum_snack_shop", "x": 15, "y": 14, "menu": "Museum Snack Shop" },
  { "id": "museum_sit", "name": "Sit", "type": "seat", "in": "museum_snack_shop", "x": 78, "y": 66 },
  { "id": "museum_tiny_hole", "name": "Tiny Hole", "type": "tiny_hole", "in": "museum_snack_shop", "x": 45, "y": 90, "to": "tiny_hole" },
  { "id": "tiny_hole", "name": "Tiny Hole", "type": "place", "in": "museum_snack_shop", "hidden": true,
    "description": "You're tiny! Everything is huge in here. Go back to grow big again." },
  { "id": "tiny_brewing_stand", "name": "Brewing Stand", "type": "person", "in": "tiny_hole", "x": 18, "y": 70,
    "says": "Brew a potion here! (Which potion, and what it needs, isn't decided yet.)" },
  { "id": "tiny_pet_food", "name": "Pet Food", "type": "care", "care": "pet_food", "in": "tiny_hole", "x": 75, "y": 86 },
  { "id": "school", "name": "Wizard School", "type": "place", "in": "village", "x": 36, "y": 40,
    "description": "Nine classrooms, one for each thing you can learn. Only the Music Classroom has a teacher so far." },
  // The Wizard School's 9 classrooms, one per box on the girls' drawing (Scott, 2026-10-13).
  // The others are "classroom" spots with no teacher yet: placeholders (Scott: Magic, Sports,
  // Aquatic, and Claude's other ideas). "teaches" says what you'll learn there one day.
  // (There's also a drawing with 25 boxes, art/raw/sheets/grid_25_boxes.jpeg, if we need more.)
  { "id": "music_classroom", "name": "Music Classroom", "type": "place", "in": "school", "x": 14, "y": 20,
    "description": "The rehearsal studio. Take Piano Lessons here, then practise any time before you play at the Disco Dance Hall." },
  { "id": "piano_lessons", "name": "Piano Lessons", "type": "piano_lesson", "in": "music_classroom", "x": 21, "y": 70,
    "skill": "piano", "practice": true },
  { "id": "magic_classroom", "name": "Magic Classroom", "type": "classroom", "teaches": "Spells and charms. For now, spells are made at the Crafting Table in the Crafting Cabin.", "in": "school", "x": 50, "y": 17 },
  { "id": "potions_classroom", "name": "Potions Classroom", "type": "classroom", "teaches": "Mixing potions, like the Luck Potion.", "in": "school", "x": 84, "y": 13 },
  { "id": "flying_classroom", "name": "Flying Classroom", "type": "classroom", "teaches": "Riding your broomstick.", "in": "school", "x": 14, "y": 54 },
  // The Sports Classroom leads out to the Stadium (Scott, 2026-10-13): archery and soccer (js/sports.js).
  { "id": "sports_classroom", "name": "Sports Classroom", "type": "place", "in": "school", "x": 50, "y": 53,
    "description": "Sports class is outside today! Go to the Stadium to learn archery and soccer." },
  { "id": "stadium", "name": "Stadium", "type": "place", "in": "sports_classroom", "x": 50, "y": 50,
    "description": "Learn archery and soccer! Each test you pass raises that skill one Level (up to 10). After a test, rest a few minutes before the next one." },
  { "id": "archery", "name": "Archery", "type": "archery", "skill": "archery", "in": "stadium", "x": 26, "y": 42 },
  { "id": "soccer", "name": "Soccer", "type": "soccer", "skill": "soccer", "in": "stadium", "x": 72, "y": 40 },
  { "id": "aquatic_classroom", "name": "Aquatic Classroom", "type": "classroom", "teaches": "Swimming and diving, and the animals of the lake.", "in": "school", "x": 84, "y": 50 },
  { "id": "animals_classroom", "name": "Animal Care Classroom", "type": "classroom", "teaches": "Looking after your pet: walking, training and grooming.", "in": "school", "x": 17, "y": 87 },
  { "id": "art_classroom", "name": "Art Classroom", "type": "classroom", "teaches": "Drawing and painting, like the girls do for this game!", "in": "school", "x": 52, "y": 86 },
  { "id": "cooking_classroom", "name": "Cooking Classroom", "type": "classroom", "teaches": "Cooking meals that fill you up.", "in": "school", "x": 83, "y": 84 },

  { "id": "shelf_brooms",  "name": "Broomsticks",   "type": "place", "in": "store", "x": 13, "y": 35, "shelf": "Broomstick",
    "rows": [[17, 31], [33, 45], [47, 60], [63, 78]], "perRow": 5 },
  { "id": "shelf_pets",    "name": "Pets",          "type": "place", "in": "store", "x": 40, "y": 51, "shelf": "Pet",
    "rows": [[63, 78], [47, 60]] },
  { "id": "shelf_potions", "name": "Potions",       "type": "place", "in": "store", "x": 44, "y": 22, "shelf": "Potion",
    "rows": [[64, 78]] },
  { "id": "shelf_hats",    "name": "Hats",          "type": "place", "in": "store", "x": 78, "y": 33, "shelf": "Hat",
    "rows": [[64, 78]] },
  { "id": "shelf_wands",   "name": "Wands",         "type": "place", "in": "store", "x": 10, "y": 86, "shelf": "Wand",
    "rows": [[64, 78]] },
  { "id": "shelf_special", "name": "Special Items", "type": "place", "in": "store", "x": 77, "y": 72, "shelf": "Special Item",
    "rows": [[64, 78]] },

  { "id": "cabin",     "name": "Toadstool Cottage", "type": "place", "in": "forest", "x": 30, "y": 49, "start": true,
    "description": "Inside the toadstool cottage: books, a comfy blue sofa and a little table. You can leave things here." },
  { "id": "old_oak",   "name": "Old Oak",        "type": "place", "in": "forest", "x": 53, "y": 16,
    "description": "Inside the oldest tree in the forest: a cozy teal sofa, a crackling fireplace and a pile of cushions. Some say it whispers." },
  { "id": "mushrooms", "name": "Mushroom Ring",  "type": "place", "in": "forest", "x": 75, "y": 49,
    "description": "A dance floor under a sparkly disco ball. Dance!" },
  { "id": "solve_to_dance", "name": "Solve to Dance", "type": "dance_puzzle", "in": "mushrooms", "x": 18, "y": 62 },
  { "id": "apple_tree", "name": "Apple Tree", "type": "picking", "in": "orchard", "x": 51, "y": 30, "fruit": "fruit_apple", "closeUp": "tree_apple" },
  { "id": "crafting_table", "name": "Crafting Table", "type": "crafting", "in": "crafting_cabin", "x": 44, "y": 50 },
  { "id": "crafting_cabin", "name": "Crafting Cabin", "type": "place", "in": "forest", "x": 30, "y": 17,
    "description": "A crafting table, a row of colourful supplies and round windows." },
  { "id": "treehouse", "name": "Treehouse",    "type": "place", "in": "forest", "x": 11, "y": 63,
    "description": "A table and chairs, two windows, and a cooler for fruit only." },
  { "id": "trading_post", "name": "Trading Post", "type": "place", "in": "forest", "x": 41, "y": 45,
    "description": "No Crystals or Gems here: trade something from your backpack for something on a shelf. Or sell things on the Gems shelf." },
  { "id": "trade_gems_left",     "name": "Gems",        "type": "selling", "in": "trading_post", "x": 14, "y": 23 },
  { "id": "trade_wands",         "name": "Wands",       "type": "place", "in": "trading_post", "x": 15, "y": 41, "shelf": "Trading Wands", "trade": true,
    "rows": [[0, 8]], "description": "Wands for trading. Click one to trade for it." },
  { "id": "trade_potions",       "name": "Potions",     "type": "place", "in": "trading_post", "x": 17, "y": 56, "shelf": "Trading Potions", "trade": true,
    "rows": [[0, 8]], "description": "Potions for trading. Click one to trade for it." },
  { "id": "trade_pets",          "name": "Pets",        "type": "place", "in": "trading_post", "x": 18, "y": 70, "shelf": "Trading Pets", "trade": true,
    "rows": [[0, 8]], "description": "Turtles, owls and cats for trading. Click one to trade for it." },
  { "id": "trade_brooms",        "name": "Broomsticks", "type": "place", "in": "trading_post", "x": 19, "y": 87, "shelf": "Trading Brooms", "trade": true,
    "rows": [[0, 6]], "description": "Fan broomsticks for trading. Click one to trade for it." },
  { "id": "trade_gems_right",    "name": "Gems",        "type": "selling", "in": "trading_post", "x": 74, "y": 31 },
  { "id": "trade_wands_right",   "name": "Wands",       "type": "place", "in": "trading_post", "x": 76, "y": 46, "opens": "trade_wands" },
  { "id": "trade_potions_right", "name": "Potions",     "type": "place", "in": "trading_post", "x": 77, "y": 55, "opens": "trade_potions" },
  { "id": "trade_pets_right",    "name": "Pets",        "type": "place", "in": "trading_post", "x": 75, "y": 66, "opens": "trade_pets" },
  { "id": "trade_brooms_right",  "name": "Broomsticks", "type": "place", "in": "trading_post", "x": 78, "y": 82, "opens": "trade_brooms" },
  { "id": "trader", "name": "Trader", "type": "person", "in": "trading_post", "x": 46, "y": 32,
    "says": "Welcome to the Trading Post! Bring me something from your backpack and pick anything you like in return." },
  // The Pixie Quest (Scott, 2026-10-13; js/pixie.js). "hidden" places don't show
  // as spots: the only way to the Troll Bridge is the Pixie's Finding Potion. The
  // Pond House is "secret": on the Forest map once the troll's map is whole.
  { "id": "troll_bridge", "name": "Troll Bridge", "type": "place", "in": "forest", "hidden": true, "x": 50, "y": 95,
    "description": "The troll lives under this bridge. Answer his riddles to win the pieces of his map." },
  { "id": "riddle_troll", "name": "Troll", "type": "riddle", "in": "troll_bridge", "x": 47, "y": 65 },
  // "secret": only on the Forest map once the troll's map is whole (js/pixie.js).
  { "id": "pond_house", "name": "Pond House", "type": "place", "in": "forest", "secret": "pixie_path", "x": 92, "y": 57,
    "description": "A little flower house by a pond. Something lives in the pond..." },
  { "id": "pond_swim", "name": "Swim", "type": "care", "care": "swim", "in": "pond_house", "x": 22, "y": 62 },
  { "id": "pond", "name": "Pond", "type": "pond", "in": "pond_house", "x": 22, "y": 46 },
  { "id": "pond_house_inside", "name": "Inside the Pond House", "spotName": "Go inside", "type": "place", "in": "pond_house", "x": 57, "y": 56,
    "description": "A crackling fireplace, a table of s'mores, hot chocolate and a comfy couch." },
  { "id": "smores_table", "name": "S'mores", "type": "smores", "in": "pond_house_inside", "x": 81, "y": 52 },
  { "id": "fireplace", "name": "Fireplace", "type": "fireplace", "in": "pond_house_inside", "x": 75, "y": 22 },
  { "id": "pond_hot_chocolate", "name": "Hot Chocolate", "type": "hot_chocolate", "in": "pond_house_inside", "x": 17, "y": 78 },
  { "id": "pond_couch", "name": "Couch", "type": "cuddle", "in": "pond_house_inside", "x": 53, "y": 52 },
  { "id": "turtle_sniff", "name": "Turtle Sniff", "type": "turtle_sniff", "in": "pond_house_inside", "x": 30, "y": 90 },
  { "id": "orchard",   "name": "Fruit Orchard", "type": "place", "in": "forest", "x": 62, "y": 80,
    "description": "Fruit trees and berry bushes, and a basket for picking." },

  { "id": "cave",      "name": "Crystal Cave",   "type": "place", "in": "mountain", "x": 23, "y": 19, "start": true,
    "description": "The walls sparkle with crystals. Take a pickaxe and mine for crystals and bones." },
  { "id": "peak",      "name": "Windy Peak",     "type": "place", "in": "mountain", "x": 49, "y": 10,
    "description": "You can see the whole world from up here! Look down through the binoculars, ski down to the Snowy Hut, let your snowy owl fly, or follow an arrow to the Lake, the Forest or the Village." },
  // The arrows drawn on Windy Peak: click one to go straight to that territory.
  { "id": "peak_to_lake",    "name": "Lake",    "type": "travel", "in": "peak", "x": 16, "y": 14, "to": "lake" },
  { "id": "peak_to_forest",  "name": "Forest",  "type": "travel", "in": "peak", "x": 60, "y": 15, "to": "forest" },
  { "id": "peak_to_village", "name": "Village", "type": "travel", "in": "peak", "x": 88, "y": 19, "to": "village" },
  // Scott, 2026-10-13: "look down" shows the girls' Binocular view; the snowy owl dropoff is
  // where your snowy owl flies for Bonding Points; ski down goes to the Snowy Hut for now.
  { "id": "peak_look_down", "name": "Look down", "type": "look", "in": "peak", "x": 69, "y": 40, "picture": "extra_binocular_view",
    "says": "Through the binoculars you can see a green meadow far below." },
  // Ski down: the slope map during Lost on Windy Peak (js/windy.js), otherwise straight to the Snowy Hut.
  { "id": "peak_ski_down", "name": "Ski down", "type": "ski_down", "in": "peak", "x": 45, "y": 45, "to": "hut" },
  { "id": "peak_owl_dropoff", "name": "Snowy Owl Dropoff", "type": "owl_dropoff", "in": "peak", "x": 9, "y": 52 },
  // The ski slope (Scott, 2026-10-15): only reached by skiing down during Lost on Windy Peak (js/windy.js).
  { "id": "ski_slope", "name": "Ski Slope", "type": "place", "in": "peak", "hidden": true,
    "description": "The ski slope at night. Somewhere out here is a little lost WIT." },
  { "id": "hut",       "name": "Snowy Hut",      "type": "place", "in": "mountain", "x": 47, "y": 40,
    "description": "Comfy chairs, a big bookshelf, snacks and cocoa on the table, and twinkly lights." },
  { "id": "snack_shack", "name": "Snack Shack",  "type": "place", "in": "mountain", "x": 20, "y": 59, "shelf": "Snack Shack Floor 1",
    "rows": [[0, 9]],
    "description": "Floor 1, everything 1 gem: the hot chocolate station, self-serve marshmallows, and shelves of water, icees and tea, with straws on top." },
  { "id": "ski_reserve", "name": "Ski Reserve",  "type": "place", "in": "mountain", "x": 82, "y": 16, "shelf": "Ski Gear",
    "rows": [[34, 76]],
    "description": "Ski outfits in size 1 and size 2. Pay the fox at the check-out counter." },
  { "id": "mountain_house", "name": "Mountain House", "type": "place", "in": "mountain", "x": 80, "y": 62,
    "description": "Three little magic shops inside: the Wand Set, the Mini Potion Shack and the Broom Cabin. Prices are in gems." },
  { "id": "wand_set",    "name": "Wand Set",          "type": "place", "in": "mountain_house", "x": 21.4, "y": 56, "shelf": "Wand Set",
    "rows": [[0, 6]], "description": "Six wands, 1 gem each (the orange one is 2 gems)." },
  { "id": "potion_shack", "name": "Mini Potion Shack", "type": "place", "in": "mountain_house", "x": 57, "y": 43, "shelf": "Mini Potion Shack",
    "rows": [[0, 10]], "description": "Five little potions. The price is written next to each one." },
  { "id": "broom_cabin", "name": "Broom Cabin",       "type": "place", "in": "mountain_house", "x": 83, "y": 58, "shelf": "Broom Cabin",
    "rows": [[0, 6]], "description": "Two broomsticks, 3 gems each." },
  { "id": "snack_shack_upstairs", "name": "Snack Shack Floor 2", "type": "place", "in": "snack_shack", "x": 70, "y": 86, "shelf": "Snack Shack Floor 2",
    "rows": [[0, 9]],
    "description": "Floor 2: the price tag on each shelf says what its snacks cost. Food on the counter is 10 gems." },
  { "id": "marshmallows", "name": "Marshmallows", "type": "marshmallows", "in": "snack_shack", "x": 92, "y": 64 },
  { "id": "snack_keeper", "name": "Shopkeeper", "type": "person", "in": "snack_shack", "x": 45, "y": 52,
    "says": "Have a nice day! Crystals here, please." },

  // The girls' Meadows map (Scott, 2026-10-13, art/raw/sheets/meadows_map.jpeg). The Poppy Patch,
  // Pet Training Field, Rosy Hills, Stream, Beehive and Butterfly Garden have no pictures or things to do yet.
  { "id": "poppy_patch", "name": "Poppy Patch", "type": "place", "in": "meadows", "x": 43, "y": 43,
    "description": "A little house in a field of poppies." },
  { "id": "pet_training_field", "name": "Pet Training Field", "type": "place", "in": "meadows", "x": 29, "y": 71,
    "description": "Grass and pine trees: room to train your pet. Owls have falconry lessons here." },
  { "id": "falconry", "name": "Falconry Lessons", "type": "care", "care": "falconry", "in": "pet_training_field", "x": 35, "y": 45 },
  { "id": "dog_walks", "name": "Walks and Tricks", "type": "care", "care": "dog_walk", "in": "pet_training_field", "x": 68, "y": 65 },
  { "id": "rosy_hills", "name": "Rosy Hills", "type": "place", "in": "meadows", "x": 62, "y": 87,
    "description": "Rolling hills covered in flowers, with a tiny house." },
  { "id": "stream", "name": "Stream", "type": "place", "in": "meadows", "x": 81, "y": 63,
    "description": "A little stream winding through the Meadows." },
  { "id": "stream_swim", "name": "Swim", "type": "care", "care": "swim", "in": "stream", "x": 50, "y": 60 },
  { "id": "beehive", "name": "Beehive", "type": "place", "in": "meadows", "x": 64, "y": 29,
    "description": "A beehive hanging in a big tree. Scoop honey, but watch out for the bees!" },
  { "id": "hive", "name": "Beehive", "type": "honey", "in": "beehive", "x": 50, "y": 50 },
  { "id": "butterfly_garden", "name": "Butterfly Garden", "type": "place", "in": "meadows", "x": 90, "y": 77,
    "description": "Flowers everywhere, and butterflies fluttering between them." },
  { "id": "unicorn_meadow", "name": "Unicorn Meadow", "type": "place", "in": "meadows", "x": 72, "y": 48, "start": true,
    "description": "A shy blind unicorn hides behind these trees. Watch for it, then hold an apple from your basket and click it." },

  // The Farm's three sections (Scott, 2026-10-15). Nothing to do here yet.
  { "id": "farm_house", "name": "Farm House", "type": "place", "in": "farm", "x": 40, "y": 28,
    "description": "The farmer's house (not drawn yet). Nothing to do here yet." },
  { "id": "barn", "name": "Barn", "type": "place", "in": "farm", "x": 62, "y": 28,
    "description": "The barn next to the Farm House, full of farming tools (not drawn yet). Nothing to do here yet." },
  { "id": "animal_farm", "name": "Animal Farm", "type": "place", "in": "farm", "x": 25, "y": 70,
    "description": "Barns and pens for raising farm animals (not drawn yet). Nothing to do here yet." },
  { "id": "crop_fields", "name": "Crop Fields", "type": "place", "in": "farm", "x": 75, "y": 70,
    "description": "Fields for growing crops (not drawn yet). Nothing to do here yet." },
  { "id": "cozy_lounge", "name": "Cozy Lounge", "type": "place", "in": "meadows", "x": 20, "y": 38,
    "description": "Comfy sofas and armchairs. Sit on the big sofa with your pet to bond." },
  { "id": "lounge_sofa", "name": "Big Sofa", "type": "cuddle", "in": "cozy_lounge", "x": 68, "y": 72 },

  { "id": "dock",      "name": "Dock",           "type": "place", "in": "lake", "x": 35, "y": 61, "start": true,
    "description": "Click a Lucky Rod to go fishing. Fish go in your cooler." },
  { "id": "rod_1",     "name": "Lucky Rod #1",   "type": "fishing", "in": "dock", "x": 35, "y": 33 },
  { "id": "dock_swim", "name": "Swim", "type": "care", "care": "swim", "in": "dock", "x": 70, "y": 75 },
  { "id": "dock_whale_swim", "name": "Beluga Swim", "type": "care", "care": "whale_swim", "in": "dock", "x": 82, "y": 42 },
  { "id": "rod_2",     "name": "Lucky Rod #2",   "type": "fishing", "in": "dock", "x": 12, "y": 33 },
  { "id": "island",    "name": "Tiny Island",    "type": "place", "in": "lake", "x": 52, "y": 36,
    "description": "Just big enough for one tree, a picnic and a fishing rod." },
  { "id": "fish_hut",  "name": "Fish Hut",       "type": "place", "in": "lake", "x": 62, "y": 74,
    "description": "Bait in bowls, fishing rods on the wall, fish tanks, and fish and shells hanging on a line." },
  { "id": "fish_tanks", "name": "Fish Tanks", "type": "care", "care": "tank", "in": "fish_hut", "x": 20, "y": 78 },
  { "id": "waterfall", "name": "Pearl Waterfall", "type": "place", "in": "lake", "x": 38, "y": 20,
    "description": "A waterfall tumbling down the mountains into the lake. The Pearl Cave hides behind it." },
  { "id": "waterfall_swim", "name": "Swim", "type": "care", "care": "swim", "in": "waterfall", "x": 50, "y": 78 },
  { "id": "pearl_cave", "name": "Pearl Cave", "type": "place", "in": "waterfall", "x": 21, "y": 36,
    "description": "Find the pearls! They hide in the water behind the waterfall." },
  { "id": "lakeside_store", "name": "Lakeside Store", "type": "place", "in": "lake", "x": 22, "y": 82, "shelf": "Lakeside Store Floor 1",
    "rows": [[0, 9]],
    "description": "Floor 1: muffins, lollipops, boards and beanies. Prices are in gems. Go upstairs for food and lake things." },
  { "id": "lakeside_keeper", "name": "Shopkeeper", "type": "person", "in": "lakeside_store", "x": 22, "y": 30,
    "says": "Hello! Hi! Welcome to the Lakeside Store." },
  { "id": "lakeside_store_food", "name": "Floor 2: Food", "type": "place", "in": "lakeside_store", "x": 50, "y": 45, "shelf": "Lakeside Store Floor 2",
    "rows": [[0, 9]],
    "description": "Floor 2, food: burgers, salad, pizza, fruit, popcorn, popsicles, pie and flowers." },
  { "id": "lakeside_store_items", "name": "Floor 3: Items", "type": "place", "in": "lakeside_store_food", "x": 86, "y": 86, "shelf": "Lakeside Store Floor 3",
    "rows": [[0, 9]],
    "description": "Floor 3, items: potions, a raft, fishing rods, bait, sand dollars, and pets: a beluga, a jellyfish and a capybara." },
  { "id": "beach",     "name": "Pebble Beach",   "type": "place", "in": "lake", "x": 82, "y": 52,
    "description": "Pebbles, sand dollars and the Turtle Cove. Grab a shovel and dig!" },
  { "id": "turtle_cove", "name": "Turtle Cove", "type": "care", "care": "swim", "in": "beach", "x": 68, "y": 42 },
  { "id": "beach_whale_swim", "name": "Beluga Swim", "type": "care", "care": "whale_swim", "in": "beach", "x": 40, "y": 36 },
  { "id": "dig_spot",    "name": "Dig Spot",         "type": "digging", "in": "beach", "x": 86, "y": 57, "finds": "beach" },
  { "id": "crystal_dig", "name": "Crystal Dig Spot", "type": "digging", "in": "beach", "x": 19, "y": 82, "finds": "crystals" }
];
