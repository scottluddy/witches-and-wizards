// Hunger (Scott, 2026-10-10): walking around makes you hungry, and the
// hungrier you are, the slower you walk. Eating snacks (items with "food"
// in items.js) takes hunger points away. The numbers are Claude's guesses.
GAME_DATA.hunger = {
  "max": 10,              // most hunger points you can have
  "walkPerPoint": 1,      // how far you walk (in map-widths) for 1 more hunger point
  "slowest": 0.5,         // walking speed when as hungry as can be (0.5 = half speed)
  "marshmallowFood": 1    // marshmallows on hot chocolate take away 1 more hunger point
};
