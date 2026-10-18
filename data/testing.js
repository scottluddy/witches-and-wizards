// Tester Mode, for trying out new things quickly (Scott, 2026-10-15).
//
// The small 🧪 button at the far top left of the game asks for a secret PIN.
// With the right PIN this game goes into Tester Mode: the game keeps a copy
// of everything as it was, then fills your bags with lots of everything in
// "start". Clicking 🧪 again shows the Test Tools and the button to leave
// Tester Mode, which throws away everything from testing and puts the copy
// back (your Level, skills, bags, adventures, where you were).
//
// The game's files are public on GitHub. Before sharing the game, set "on"
// to false: the 🧪 button then disappears.
GAME_DATA.testing = {
  "on": true,
  // Only a scramble of the PIN is kept here, so reading this public file
  // doesn't give it away. To change the PIN, open the game, press F12 and
  // type pinHash("1234") in the Console, then put the number it shows here.
  "pinHash": 125994,
  "start": {
    "gems": 9999,
    "crystals": 99,
    "hunger": 0,
    // "everyPotion", "everyPet" and "everySpell" add every one in the game.
    "everyPotion": true,
    "everyPet": true,
    "everySpell": true,
    "backpack": ["special_book", "broom_no1", "quest_old_key", "skis_rental", "tool_blacklight", "tool_invisible_ink", "wand_healing", "wand_lightning", "wand_music"],
    "cooler": ["fish_crystal", "fish_crystal", "fish_crystal", "treasure_shell", "treasure_shell"],
    "basket": ["fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple", "fruit_apple"],
    "satchel": ["mine_bone", "mine_bone", "mine_bone", "mine_bone", "mine_bone", "mine_bone"],
    "bucket": ["beach_redshell", "beach_redshell", "beach_bottlecap", "beach_bottlecap", "beach_bottlecap"]
  },
  // What the Test Tools' Skills button adds.
  "topUp": { "skills": 2 }
};
