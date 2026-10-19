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
  { "name": "Give your capybara a bath", "kind": "Bonding", "where": "Home", "inGame": true,
    "note": "The Bath Tub at Home: +1 Bonding Point per pet every 5 minutes." },
  { "name": "Cuddle your cat on a couch or sofa", "kind": "Bonding", "where": "Cozy Lounge (Meadows), Pond House", "inGame": true,
    "note": "Bring a cat in your backpack: +1 Bonding Point per cat every 5 minutes." },
  { "name": "Play with yarn", "kind": "Bonding", "where": "Home", "inGame": true,
    "note": "Cats chase the Ball of Yarn: +1 Bonding Point every 5 minutes." },
  { "name": "Falconry lessons", "kind": "Bonding", "where": "Pet Training Field (Meadows)", "inGame": true,
    "note": "Any owl in your backpack: +1 Bonding Point every 5 minutes." },
  { "name": "Let your snowy owl fly", "kind": "Bonding", "where": "Snowy Owl Dropoff (Windy Peak)", "inGame": true,
    "note": "Bring a Snowy Owl in your backpack: +1 Bonding Point every 5 minutes (Scott, 2026-10-13)." },
  { "name": "Take your turtle swimming", "kind": "Bonding", "where": "Dock, Turtle Cove (Pebble Beach), Pearl Waterfall, Stream, Pond House", "inGame": true,
    "note": "+1 Bonding Point every 5 minutes. Very rarely (3%) a turtle run happens: help the baby turtles to the water for 3 bonus points." },
  { "name": "Clean your jellyfish's tank", "kind": "Bonding", "where": "Fish Hut (Lake)", "inGame": true,
    "note": "Jellyfish: +1 Bonding Point every 5 minutes." },
  { "name": "Take your beluga for a swim", "kind": "Bonding", "where": "Dock and Pebble Beach (Lake)", "inGame": true,
    "note": "Belugas: +1 Bonding Point every 5 minutes." },
  { "name": "Laps and the obstacle course", "kind": "Bonding", "where": "Pet Training Field (Meadows)", "inGame": true,
    "note": "The girls' agility park (Scott, 2026-10-19): drag a dog or wolf onto the Starting Line (a lap walking, a lap running) or the Obstacle Course (ramp, weave posts, bendy tunnel, hoops, long tunnel). +1 Bonding Point each, every 5 minutes." },
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
  { "name": "Find the pearls", "kind": "Mining", "where": "Pearl Cave (behind the Pearl Waterfall)", "inGame": true,
    "note": "Click the water to search; \"Warmer!\" means you're close. 3 pearls hide each visit and come back after 5 minutes. Pearls go in the bucket and are for spells (data/pearls.js)." },
  { "name": "Mine in the Crystal Cave", "kind": "Mining", "where": "Crystal Cave", "inGame": true,
    "note": "Pay 3 gems at the pickaxe rack beside the cave for a pickaxe (it goes back when you leave), then click the wall. Only the last 3 dug spots stay marked. Crystals add to your Crystals; bones go in the satchel for spells (data/mining.js)." },
  { "name": "Solve to Dance", "kind": "Learning", "where": "Mushroom Ring", "inGame": true,
    "note": "Maths problems (3rd grade). + and - earn 1 dance point, × and ÷ earn 2; every 9 points is 1 gem. Solve 2 to dance (data/dance.js)." },
  { "name": "Pick apples", "kind": "Mining", "where": "Fruit Orchard", "inGame": true,
    "note": "Click the Apple Tree to see it up close. It sways in the wind, so click each apple to pick it (it sways faster after each one). 5 apples on the tree; one grows back every minute. Apples go in your fruit basket: eat them or feed them to unicorns." },
  { "name": "Help a blind unicorn", "kind": "Bonding", "where": "Unicorn Meadow", "inGame": true,
    "note": "Spot the shy unicorn when it comes out from behind the trees, hold an apple and feed it so it trusts you, cast the Seeing Spell, then feed it 2 to 4 more apples: it finds its family. +1 Adventure Point. Each new unicorn comes out less often." },
  { "name": "Archery and soccer", "kind": "Learning", "where": "Stadium (Sports Classroom, Wizard School)", "inGame": true,
    "note": "10 Levels each: pass a test to go up a Level, then wait 3 to 5 minutes for the next, harder one." },
  { "name": "The Pixie Quest", "kind": "Adventure", "where": "the Pixie (Forest), the Troll Bridge", "inGame": true,
    "note": "Give the Pixie a Crystal Fish, drink the Finding Potion, win 3 map pieces from the troll's riddles, follow the Secret Pathway and find her Golden Acorn in the Pond House." },
  { "name": "Collect honey", "kind": "Food", "where": "Beehive (Meadows)", "inGame": true,
    "note": "Scoop honey into your pot and put it in your basket before the bees come out. Bees spill your pot and may sting you; heal with a Healing Potion or wait 10 minutes." },
  { "name": "Roast s'mores", "kind": "Food", "where": "Pond House", "inGame": true,
    "note": "Grab one from the table, roast it at the fireplace: -2 hunger." },
  { "name": "Trade at the Trading Post", "kind": "Trading", "where": "Trading Post (Forest)", "inGame": true,
    "note": "Swap anything in your backpack for anything on a Trading Post shelf, or sell things on the Gems shelf for Gems." },
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
    "earn": "3 each of Adventure Points, Chore Points, Bonding Points and Skills since your last Level, plus gems (data/levels.js). Click the Level in the top bar.", "use": "Each Level above 1 makes you 5% luckier." },
  { "name": "Adventure Points", "shows": "Adventure ☆☆☆", "inGame": true,
    "earn": "Adventures: so far, reuniting a blind unicorn with its family.", "use": "3 of them (with other things) raise your Level." },
  { "name": "Crystals", "shows": "💎", "inGame": true,
    "earn": "Digging at the Crystal Dig Spot and mining in the Crystal Cave.", "use": "Making spells: every spell needs one Crystal, its magic spark (Scott, 2026-10-15)." },
  { "name": "Gems", "shows": "the girls' gem drawing", "inGame": true,
    "earn": "Fishing, digging at Pebble Beach, the Solve to Dance puzzle, and selling on the Trading Post's Gems shelf.", "use": "Buying things priced in gems (pets, potions, brooms, snacks), using a pickaxe, and making spells." },
  { "name": "Fish caught", "shows": "(not shown yet)", "inGame": true,
    "earn": "Catching fish (treasures don't count).", "use": "Saved for something later." },
  { "name": "Skills", "shows": "🎓 4 (click it for every skill and its Level)", "inGame": true,
    "earn": "Passing a skill test at the Wizard School (each Level adds 1) and making spells.", "use": "3 of them (with other things) raise your Level." },
  { "name": "Chore Points", "shows": "🧹", "inGame": true,
    "earn": "Doing chores, like sweeping your room (1 point per level of dust).", "use": "3 of them (with other things) raise your Level." },
  { "name": "Hunger", "shows": "🍽️ 0/10", "inGame": true,
    "earn": "Walking around (1 point per map-width walked, up to 10). Full speed at 0 to 3, three quarter speed at 4 to 6, two thirds at 7 to 9, half speed at 10.", "use": "Eat to take hunger away: healthy food by its full price, snacks by half (data/hunger.js)." }
];
