// Going up a Level (a sample plan, Scott 2026-10-11; easy to change).
//
// To go up one Level you need "count" more of each thing below since your
// last Level, and you pay some gems. Click the Level in the top bar to see
// how close you are.
//   id     the counter in the saved game it counts (js/save.js); for a
//          list, like "spells", it counts how many are in it; several
//          names in [ ] are added together
//   name   what it's called on screen
//   emoji  its little picture
//   count  how many more you need for each new Level
//   how    where to earn it
// Fish and dances don't count (Scott, 2026-10-11): fish are for food and
// spells, and dancing is just for fun.
GAME_DATA.levels = {
  "needs": [
    { "id": "adventurePoints", "name": "Adventure Points", "emoji": "⭐", "count": 3,
      "how": "Go on adventures, like helping a blind unicorn find its family in the Unicorn Meadow." },
    { "id": "chorePoints",     "name": "Chore Points",     "emoji": "🧹", "count": 3,
      "how": "Sweep your room at Home with a broomstick." },
    { "id": "bondingPoints",   "name": "Bonding Points",   "emoji": "🐾", "count": 3,
      "how": "Take care of your pet, like giving it a bath in the tub at Home." },
    // Skills: spells in your spell book, plus every skill Level gained (piano,
    // Archery Level 2 counts as 2...). Two lists, added together.
    { "id": ["spells", "skills"], "name": "Skills (spells and skill Levels)", "emoji": "📖", "count": 1,
      "how": "Make a spell at the Crafting Table in the Crafting Cabin, or pass a skill test at the Wizard School (piano, archery, soccer)." }
  ],
  // Going up costs gems too: 10 to reach Level 2, 20 to reach Level 3, and so on.
  "gemsPerLevel": 10,
  // Powers: each Level above 1 makes you a little luckier (see data/luck.js).
  "luckPerLevel": 5
};
