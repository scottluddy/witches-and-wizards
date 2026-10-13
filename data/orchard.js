// Fruit you pick in the Fruit Orchard (Scott, 2026-10-10). Picked fruit goes
// in your fruit basket (🧺). Fruit is healthy food; picked fruit has no price,
// so "worth" stands in for one (how many hunger points eating one takes away,
// Claude's guess). Apples can also be fed to the unicorns in the Meadows.
GAME_DATA.fruits = [
  { "id": "fruit_apple", "name": "Apple", "emoji": "🍎", "food": "healthy", "worth": 1,
    "description": "A shiny red apple. Eat it, or feed it to a unicorn." }
];

// Picking (Scott, 2026-10-13): click a fruit tree to see it up close. It sways
// in the wind, so you have to click each fruit to pick it: a little skill.
//   fruitOnTree   how many fruits hang on a tree when it's full
//   growSeconds   one new fruit grows every this many seconds, until it's full again
//   spots         where fruit hangs, as x, y percent of the close-up picture
//   swayDegrees   how far the tree leans each way
//   swaySeconds   how long one sway takes at first (smaller = faster)
//   fasterEach    each fruit you pick makes the sway this much quicker (0.85 = 15% quicker)
GAME_DATA.picking = {
  "fruitOnTree": 5,
  "growSeconds": 60,
  "spots": [[30, 24], [50, 17], [70, 23], [40, 37], [62, 39], [80, 33], [24, 38]],
  "swayDegrees": 6,
  "swaySeconds": 1.6,
  "fasterEach": 0.85
};
