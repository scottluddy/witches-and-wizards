// The unicorns in the Unicorn Meadow (Scott, 2026-10-11). All unicorns are
// born blind, and shy: each one hides behind the trees and only comes out
// now and then, for "showSeconds". The first unicorn comes out about once a
// minute; each later one less often ("everySeconds", one number per unicorn;
// the last number is used for all the rest).
//
// To reunite a unicorn with its family (one adventure, an Adventure Point):
//   1. spot it while it's out from behind the trees
//   2. take an apple out of your fruit basket and hold it
//   3. click the unicorn to feed it: now it trusts you
//   4. cast the Seeing Spell on it (make the spell at the Crafting Cabin)
//   5. feed it 2 to 4 more apples (a random number), one at a time
// Then a new blind unicorn comes along.
GAME_DATA.unicorns = {
  "kind": "reuniting",        // its celebration picture (data/adventures.js)
  "spell": "seeing",
  "apples": [2, 4],
  "food": "fruit_apple",
  "adventurePoints": 1,
  "emoji": "🦄",
  "picture": "extra_unicorn",
  "showSeconds": 15,
  "everySeconds": [60, 120, 180],
  // Where the trees stand in the meadow (x, y percent); the unicorn hides behind them.
  "trees": [[18, 62], [40, 48], [62, 66], [82, 50]]
};
