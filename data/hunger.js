// Hunger (Scott, 2026-10-10): walking around makes you hungry, and the
// hungrier you are, the slower you walk. Eating food (items with "food" in
// items.js) takes hunger points away.
//
// Walking speed by hunger (Scott, 2026-10-11): 0 to 3 full speed, 4 to 6
// three quarter speed, 7 to 9 two thirds speed, 10 half speed.
// Food (Scott, 2026-10-11): healthy food takes away as many hunger points as
// its price; snacks take away half their price (rounded up, so always at
// least 1). Which food is healthy is Claude's choice: water, tea, the fruit
// basket and fruit.
GAME_DATA.hunger = {
  "max": 10,              // most hunger points you can have
  "walkPerPoint": 1,      // how far you walk (in map-widths) for 1 more hunger point (Claude's guess)
  "speeds": [             // [up to this many hunger points, walking speed]
    [3, 1],
    [6, 0.75],
    [9, 0.667],
    [10, 0.5]
  ],
  "healthyShare": 1,      // healthy food: hunger points = its price
  "snackShare": 0.5,      // snacks: hunger points = half its price
  "marshmallowFood": 1    // marshmallows on hot chocolate take away 1 more hunger point
};
