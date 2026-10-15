// Mining in the Crystal Cave (Scott, 2026-10-10).
//
// Take a pickaxe from the rack, then click anywhere on the cave wall to pick
// at it. The wall has an invisible grid: some squares hide crystals (they add
// to your Crystals) and some hide bones (they go in your satchel, to take
// home and keep as spell materials). One hides a sleeping troll, who steals
// Crystals (data/troll.js). Every visit hides them in new places.
//
//   place          the place where you mine
//   area           where the grid covers the cave picture: [left, top, right, bottom] percent
//   columns, rows  how many squares across and down
//   crystalSquares how many squares hide crystals
//   boneSquares    how many squares hide bones
//   trollSquares   how many squares hide a sleeping troll
//   crystals       Crystals found in one crystal square (Scott: just 1, crystals are rare)
//   pickaxeGems    what it costs to use a pickaxe from the rack (Scott, 2026-10-11:
//                  3 gems). The rack stands to the right of the cave picture; the
//                  pickaxe goes back on the rack when you leave the cave.
//   marksShown     how many dug spots stay marked on the wall (Scott: the last 3,
//                  so you can't just work through every square in order)
//   pickSeconds    how long one swing of the pickaxe takes
// Squares, crystals and troll are Scott's numbers (2026-10-10; Scott,
// 2026-10-15: Crystals a third as easy to get, so 2 crystal squares, not 5);
// the grid size is Claude's guess.
GAME_DATA.mining = {
  "place": "cave",
  "area": [4, 6, 94, 92],
  "columns": 8,
  "rows": 7,
  "crystalSquares": 2,
  "boneSquares": 9,
  "trollSquares": 1,
  "crystals": 1,
  "pickaxeGems": 3,
  "marksShown": 3,
  "pickSeconds": 0.6
};

// The crystal drawings: a crystal square shows one of these when you find it.
GAME_DATA.mineCrystals = ["mine_crystal_blue", "mine_crystal_dark", "mine_crystal_teal"];

// Things that go in the satchel. The picture is art/processed/<id>.png
GAME_DATA.mineFinds = [
  { "id": "mine_bone", "name": "Bone", "emoji": "🦴",
    "description": "An old bone from deep in the Crystal Cave. Keep it for spells." }
];
