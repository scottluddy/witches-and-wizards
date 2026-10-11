// Trading post logic (Scott, 2026-10-11). This can be changed later.
//
// At the Trading Post in the Forest nothing is bought with Crystals or Gems.
// For now, any item in your backpack can be traded for any item on a
// Trading Post shelf (one for one).
//
// The Gems shelf buys things from you instead, for Gems:
//   things bought in a shop get back about 90% of what they cost ("sellShare"),
//   in the same money they cost (Crystals or Gems);
//   things found, caught, mined or picked get a fair number of Gems for how
//   hard they are to find ("worth" below, Claude's guesses). Fish and
//   treasures use the gems in data/fish.js, beach finds data/digging.js.
//   Things worth nothing (like the Bottle Cap) can't be sold.
GAME_DATA.trading = {
  "rule": "any item for any item",
  "sellShare": 0.9,
  "tradedWorth": 2,
  "worth": {
    "mine_bone": 1,
    "fruit_apple": 1,
    "tool_pickaxe": 0
  }
};
