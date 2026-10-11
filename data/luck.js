// Luck (Scott, 2026-10-11). Being lucky makes good things happen more often:
//   a fish bites more often at the Lucky Rods,
//   the Crystal Dig Spot finds a Crystal more often,
//   and a troll you wake may just roll over and stay asleep.
// A chance of 40% with 25% luck becomes 50% (40 + a quarter of 40).
//
//   potion    the Luck Potion (Trading Post); drink it from the backpack
//   boost     how much luckier it makes you, in percent (Scott: about 20 to 25)
//   minutes   how long it lasts (Claude's guess); only counts while playing
// Each Level above 1 adds a little luck too ("luckPerLevel" in data/levels.js).
GAME_DATA.luck = {
  "potion": "potion_luck",
  "boost": 25,
  "minutes": 5
};
