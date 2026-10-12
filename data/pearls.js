// Find the Pearls! in the Pearl Cave, behind the Pearl Waterfall (Scott, 2026-10-12).
//
// A few pearls hide somewhere in the cave's water on each visit. Click the
// water to search: "Warmer!" means a pearl is close. Found pearls go in your
// satchel: they're spell ingredients (Scott), and they earn a few gems.
// When you've found them all, new pearls wash in after a while.
//
//   place          the place where you search
//   area           where pearls can hide: [left, top, right, bottom] percent of the picture
//   pearls         how many pearls hide at once
//   findDistance   how close (percent of the picture) a click must be to find a pearl
//   warmDistance   how close counts as "Warmer!"
//   refillMinutes  how long until new pearls wash in after you've found them all
// Numbers are Claude's guesses: about 6 gems every 5 minutes, much less than fishing.
GAME_DATA.pearlHunt = {
  "place": "pearl_cave",
  "area": [14, 20, 95, 92],
  "pearls": 3,
  "findDistance": 8,
  "warmDistance": 18,
  "refillMinutes": 5
};

// What you find. "gems" are earned when you find one (the Gems shelf pays half again).
GAME_DATA.pearlFinds = [
  { "id": "pearl", "name": "Pearl", "emoji": "🦪", "gems": 2,
    "description": "A shiny pearl from the Pearl Cave. Keep it for spells." }
];
