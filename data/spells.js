// Spells (Scott, 2026-10-10). Bring everything a spell needs to the Crafting
// Table in the Crafting Cabin, with your spell book (the Wizard Essentials
// Spellbook), and the spell is added to your book. Then you can cast it.
//   needs: "crystals" / "gems" with a count, or "things" (any of these ids)
//   with a count and a "name" to show. Things can be carried or kept at Home.
GAME_DATA.spellBook = "special_book";
GAME_DATA.spells = [
  { "id": "seeing", "name": "Seeing Spell", "emoji": "👁️",
    "use": "Cast it on a blind unicorn in the Meadows so it can see.",
    "needs": [
      { "money": "crystals", "count": 10 },
      { "name": "Sense Potion", "things": ["potion_sense", "potion_sense_trade"], "count": 1 },
      { "name": "Bones", "things": ["mine_bone"], "count": 6 },
      { "name": "Shells (any kind)", "things": ["treasure_shell", "beach_redshell"], "count": 2 },
      { "name": "Bottle Cap", "things": ["beach_bottlecap"], "count": 1 },
      { "money": "gems", "count": 25 }
    ] }
];
