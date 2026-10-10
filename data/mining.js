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
//   rack           where the pickaxe rack hangs: [left, top, width] percent
//   pickSeconds    how long one swing of the pickaxe takes
// Squares, crystals and troll are Scott's numbers (2026-10-10); the grid size is Claude's guess.
GAME_DATA.mining = {
  "place": "cave",
  "area": [4, 6, 94, 92],
  "columns": 8,
  "rows": 7,
  "crystalSquares": 5,
  "boneSquares": 9,
  "trollSquares": 1,
  "crystals": 1,
  "rack": [67.5, 51.5, 18],
  "pickSeconds": 0.6
};

// The crystal drawings: a crystal square shows one of these when you find it.
GAME_DATA.mineCrystals = ["mine_crystal_blue", "mine_crystal_dark", "mine_crystal_teal"];

// Things that go in the satchel. The picture is art/processed/<id>.png
GAME_DATA.mineFinds = [
  { "id": "mine_bone", "name": "Bone", "emoji": "🦴",
    "description": "An old bone from deep in the Crystal Cave. Keep it for spells." }
];
