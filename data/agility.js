// Walks and Tricks in the Agility Park, part of the Pet Training Field
// (Scott, 2026-10-18: the girls' drawing, "Walks and tricks"). Code in js/agility.js.
//
// Bring a pet in your backpack and pick it at the Training Sign (or just click
// anything). Click a tunnel, the hoops, the weave posts or the ramp and you
// walk over while your pet does the trick. Do all four in one visit to finish
// the course: +1 Bonding Point. Walk the Track: a lap of the path around the
// field together, +1 Bonding Point. Each pet once every 5 minutes (data/bonding.js
// "pet_tricks" and "pet_walk"). After doing a trick "learnAfter" times, your pet
// has learned it and does it with sparkles.
//
//   animals   which pets can do it (Claude's choice: pets that walk on land;
//             owls have falconry, water pets swim)
//   seconds   how long each step of a trick takes, per animal (turtles are slow!)
//   tricks    the four tricks: name, emoji, what happens
//   paths     where the pet goes for each obstacle spot: [x, y] of its feet, in
//             percent of the picture. "hide" lists the steps where it's inside a tunnel,
//             "jump" the steps where it's in the air.
//   track     points around the path for a walk
GAME_DATA.agility = {
  "animals": ["dog", "wolf", "cat", "capybara", "turtle"],
  "seconds": { "default": 0.7, "turtle": 1.6, "capybara": 1 },
  "learnAfter": 3,
  // A pet is this much of your height (Claude's guess: little WITs are half, a pet a bit more so you can see it).
  "petSize": 0.7,
  "tricks": {
    "tunnel": { "name": "Tunnel Dash", "emoji": "🌀", "says": "PET dashes into the tunnel... and pops out the other end!" },
    "hoops":  { "name": "Hoop Jump", "emoji": "⭕", "says": "PET leaps through all three hoops. Boing, boing, boing!" },
    "weave":  { "name": "Weave", "emoji": "〰️", "says": "PET weaves in and out of the posts without bumping a single one!" },
    "ramp":   { "name": "Ramp Walk", "emoji": "🪜", "says": "PET trots up the ramp, balances at the top and hops down." }
  },
  "paths": {
    "agility_tunnel": { "trick": "tunnel", "points": [[39, 72], [44, 71], [54, 71], [64, 71], [68, 74]], "hide": [2, 3] },
    "agility_tunnel_bend": { "trick": "tunnel", "points": [[73, 42], [75, 43], [76, 52], [77, 64], [80, 68]], "hide": [2, 3] },
    "agility_hoops": { "trick": "hoops",
      "points": [[38, 59], [44.5, 56], [48.5, 59], [52, 54], [56.5, 59], [61, 55], [66, 59]], "jump": [1, 3, 5] },
    "agility_weave": { "trick": "weave",
      "points": [[37, 37], [42, 34], [47, 37], [53, 34], [60, 37], [65, 33], [73, 37], [78, 35]] },
    "agility_ramp": { "trick": "ramp", "points": [[24, 46], [27, 40], [32, 36], [36, 34], [38, 44]], "jump": [2, 3] }
  },
  "track": [[16, 82], [10, 66], [9, 48], [13, 32], [24, 19], [40, 13], [58, 12], [75, 15], [87, 24],
            [93, 40], [93, 58], [88, 74], [76, 85], [58, 90], [40, 90], [26, 87], [16, 82]],
  "words": {
    "choose": "Who's coming to train? Pick a pet from your backpack.",
    "noPets": "Bring a pet that walks (a cat, a capybara or a turtle) in your backpack to walk and learn tricks here. Owls have Falconry Lessons instead.",
    "pick": "🐾 Let's go!",
    "busy": "Wait for PET to finish!",
    "ready": "🐾 PET is ready! Click a tunnel, the hoops, the weave posts or the ramp, or Walk the Track.",
    "learned": "🎉 PET learned the TRICK trick!",
    "course": "🏆 Course complete! You and PET did all four tricks.",
    "practice": "Great practice! PET can earn another Bonding Point in MIN min.",
    "walked": "🐾 You and PET walk a whole lap around the field together.",
    "sign": "Training Sign",
    "swap": "🔁 Train another pet",
    "left": "PET isn't in your backpack any more."
  }
};
