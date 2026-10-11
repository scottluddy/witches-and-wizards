// Bonding with your pet (Scott, 2026-10-11): taking care of your pet (feeding,
// washing, walking...) earns Bonding Points, which count toward the next Level.
// So far there's one way: a bath in the tub at Home.
//
//   pets        the shop shelves pets come from
//   notPets     things on those shelves that can't have a bath (an egg!)
//   bath        points: Bonding Points for one bath
//               everyMinutes: a pet gets dirty again after this long, so it
//               can have another bath (Claude's guess)
GAME_DATA.bonding = {
  "pets": ["Pet", "Trading Pets"],
  "notPets": ["pet_turtle_egg"],
  "bath": { "points": 1, "everyMinutes": 5 }
};
