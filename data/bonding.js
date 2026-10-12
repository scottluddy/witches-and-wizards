// Bonding with your pet (Scott, 2026-10-11): taking care of your pet (feeding,
// washing, walking...) earns Bonding Points, which count toward the next Level.
// So far: a bath in the tub at Home, and a cuddle on the big sofa in the
// Cozy Lounge (Meadows, Claude's idea, 2026-10-12).
//
//   pets        the shop shelves pets come from (a pet elsewhere says "pet": true
//               in items.js, like the Lakeside Store's beluga)
//   notPets     things on those shelves that can't be cared for (an egg!)
//   bath        points: Bonding Points for one bath
//               everyMinutes: a pet gets dirty again after this long, so it
//               can have another bath (Claude's guess)
//   cuddle      the same for a cuddle on the Cozy Lounge's big sofa
GAME_DATA.bonding = {
  "pets": ["Pet", "Trading Pets"],
  "notPets": ["pet_turtle_egg"],
  "bath": { "points": 1, "everyMinutes": 5 },
  "cuddle": { "points": 1, "everyMinutes": 5 }
};
