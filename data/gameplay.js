// Gameplay ideas, shown in the catalog only (the game doesn't read this file).
// A place to collect ideas, then build them into the right spots in the game.
//
// GAME_DATA.activities: good things to do, grouped by kind.
//   name      what it is
//   kind      "Bonding" (caring for your pet), "Chores" (tidying up) or
//             "Mining" (gathering things: digging, chopping wood, fishing...)
//   where     where in the game it happens (or would happen)
//   inGame    true once it's in the game; false while it's still an idea
//   note      anything else worth remembering
GAME_DATA.activities = [
  { "name": "Take care of your pet", "kind": "Bonding", "where": "Home", "inGame": false,
    "note": "" },
  { "name": "Clean Room", "kind": "Chores", "where": "Home", "inGame": true,
    "note": "The room gets dustier the longer you stay. Sweep it with a broomstick from your backpack for Chore Points (data/chores.js)." },
  { "name": "Pick up trash on the beach", "kind": "Chores", "where": "Pebble Beach", "inGame": false,
    "note": "" },
  { "name": "Dig at the Dig Spot", "kind": "Mining", "where": "Pebble Beach", "inGame": true,
    "note": "Finds a Bottle Cap, Conch Shell or Sand Dollar for the bucket." },
  { "name": "Dig at the Crystal Dig Spot", "kind": "Mining", "where": "Pebble Beach", "inGame": true,
    "note": "Finds Crystals." },
  { "name": "Fishing", "kind": "Mining", "where": "the Dock", "inGame": true,
    "note": "Fish and treasures for the cooler. (Put under Mining for now.)" },
  { "name": "Mine in the Crystal Cave", "kind": "Mining", "where": "Crystal Cave", "inGame": true,
    "note": "Take a pickaxe from the rack, then click the wall. Crystals add to your Crystals; bones go in the satchel for spells (data/mining.js)." },
  { "name": "Solve to Dance", "kind": "Learning", "where": "Mushroom Ring", "inGame": true,
    "note": "Maths problems (3rd grade). + and - earn 1 gem, × and ÷ earn 2. Solve 2 to dance (data/dance.js)." },
  { "name": "Pick apples", "kind": "Mining", "where": "Fruit Orchard", "inGame": true,
    "note": "Click the Apple Tree; apples go in your fruit basket. Eat them or feed them to unicorns." },
  { "name": "Help a blind unicorn", "kind": "Bonding", "where": "Unicorn Meadow", "inGame": true,
    "note": "Make the Seeing Spell at the Crafting Cabin, cast it on the unicorn, feed it 3 to 5 apples: it finds its family. +1 Adventure Point." },
  { "name": "Chop wood", "kind": "Mining", "where": "", "inGame": false,
    "note": "" }
];

// GAME_DATA.metrics: the counters in the bar at the top of the game.
//   name      what it's called
//   shows     how it looks in the bar
//   earn      how you get more
//   use       what it's for
//   inGame    true once it works in the game
GAME_DATA.metrics = [
  { "name": "Level", "shows": "Witch Level 1 / Wizard Level 1", "inGame": true,
    "earn": "Not yet. Plan: 3 Adventure Points raise your Level.", "use": "" },
  { "name": "Adventure Points", "shows": "Adventure ☆☆☆", "inGame": false,
    "earn": "Not yet.", "use": "3 of them raise your Level." },
  { "name": "Crystals", "shows": "💎", "inGame": true,
    "earn": "Digging at the Crystal Dig Spot.", "use": "Buying things priced in Crystals, like dresses." },
  { "name": "Gems", "shows": "the girls' gem drawing", "inGame": true,
    "earn": "Fishing and digging.", "use": "Buying things priced in gems, like pets." },
  { "name": "Fish caught", "shows": "(not shown yet)", "inGame": true,
    "earn": "Catching fish (treasures don't count).", "use": "Saved for something later." },
  { "name": "Chore Points", "shows": "🧹", "inGame": true,
    "earn": "Doing chores, like sweeping your room (1 point per level of dust).", "use": "Not decided yet." },
  { "name": "Hunger", "shows": "🍽️ 0/10", "inGame": true,
    "earn": "Walking around (1 point per map-width walked, up to 10). The hungrier you are, the slower you walk.", "use": "Eat snacks from the Snack Shack to take hunger away (data/hunger.js)." }
];
