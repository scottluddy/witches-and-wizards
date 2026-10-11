// Going up a Level (a sample plan, Scott 2026-10-11; easy to change).
//
// To go up one Level you need "count" more of each thing below since your
// last Level, and you pay some gems. Click the Level in the top bar to see
// how close you are.
//   id     the counter in the saved game it counts (js/save.js)
//   name   what it's called on screen
//   emoji  its little picture
//   count  how many more you need for each new Level
//   how    where to earn it
// Bonding Points aren't counted yet; add them here once they exist.
GAME_DATA.levels = {
  "needs": [
    { "id": "adventurePoints", "name": "Adventure Points", "emoji": "⭐", "count": 3,
      "how": "Help a blind unicorn find its family in the Unicorn Meadow." },
    { "id": "chorePoints",     "name": "Chore Points",     "emoji": "🧹", "count": 3,
      "how": "Sweep your room at Home with a broomstick." },
    { "id": "fishCount",       "name": "Fish caught",      "emoji": "🐟", "count": 3,
      "how": "Fish with a Lucky Rod at the Dock." },
    { "id": "dances",          "name": "Dances",           "emoji": "💃", "count": 3,
      "how": "Solve to Dance in the Mushroom Ring." }
  ],
  // Going up costs gems too: 10 to reach Level 2, 20 to reach Level 3, and so on.
  "gemsPerLevel": 10,
  // Powers: each Level above 1 makes you a little luckier (see data/luck.js).
  "luckPerLevel": 5
};
