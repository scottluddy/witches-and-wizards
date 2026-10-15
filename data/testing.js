// Test games, for trying out new things quickly (Scott, 2026-10-15).
//
// On the character select screen, type the secret "code" as your name and
// the new game becomes a test game called "tester": it starts with
// everything in "start", shows 🧪 in front of its name on the title screen,
// and has a 🧪 Test button in the top bar for more (gems, Crystals, skills,
// adventures, going anywhere).
//
// The game's files are public on GitHub, so anyone who reads this file can
// see the code. Before sharing the game, set "on" to false: the code then
// does nothing and old test games lose their 🧪 button.
GAME_DATA.testing = {
  "on": true,
  "code": "wit-master",
  "name": "Tester",
  // Opening a test game (Scott, 2026-10-15) also asks for a secret PIN.
  // Only a scramble of the PIN is kept here, so reading this public file
  // doesn't give it away. To change the PIN, open the game, press F12 and
  // type pinHash("1234") in the Console, then put the number it shows here.
  "pinHash": 125994,
  "start": {
    "gems": 500,
    "crystals": 20,
    "backpack": ["special_book", "broom_no1", "potion_sense", "potion_luck", "potion_healing", "pet_cat", "pet_owl", "pet_pond_turtle"],
    "cooler": ["fish_crystal", "fish_crystal", "treasure_shell"],
    "basket": ["fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple"],
    "satchel": ["mine_bone", "mine_bone", "mine_bone", "mine_bone"],
    "bucket": ["beach_redshell", "beach_bottlecap", "beach_bottlecap"]
  },
  // What the 🧪 Test buttons add.
  "topUp": { "gems": 100, "crystals": 10, "skills": 2 }
};
