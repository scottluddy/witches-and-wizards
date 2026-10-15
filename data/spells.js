// Spells (Scott, 2026-10-10; brewed in a cauldron since 2026-10-15). At the
// Crafting Table in the Crafting Cabin, with your spell book (the Wizard
// Essentials Spellbook), rent the cauldron from under the table and brew the
// spell. When it's done it flies into your spell book, and you can cast it.
//
// Every spell needs (Scott, 2026-10-15):
//   - one Crystal: Crystals aren't money, they're the magic spark that makes
//     a spell work ("step": "crystal")
//   - one potion, poured on top to start the boil ("step": "potion")
//   - one or two each of 3 materials, tossed in when the table calls for
//     them ("step": "toss")
// Each need: "money" ("crystals") or "things" (any of these ids) with a
// "count", a "name" and an "emoji" to show. Things count wherever they are
// (carried or kept at Home) and are only used up when the spell is done.
GAME_DATA.spellBook = "special_book";
GAME_DATA.spells = [
  { "id": "seeing", "name": "Seeing Spell", "emoji": "👁️",
    "use": "Cast it on a blind unicorn in the Meadows so it can see.",
    "needs": [
      { "step": "crystal", "money": "crystals", "count": 1, "name": "Crystal", "emoji": "💎" },
      { "step": "potion", "name": "Sense Potion", "things": ["potion_sense", "potion_sense_trade"], "count": 1, "emoji": "🧪" },
      { "step": "toss", "name": "Bones", "things": ["mine_bone"], "count": 2, "emoji": "🦴" },
      { "step": "toss", "name": "Shell (any kind)", "things": ["treasure_shell", "beach_redshell"], "count": 1, "emoji": "🐚" },
      { "step": "toss", "name": "Bottle Cap", "things": ["beach_bottlecap"], "count": 1, "emoji": "⚪" }
    ] }
];

// The cauldron (Scott, 2026-10-15). Rent it for "rentGems" (a spell is very
// valuable). After the potion goes in, the brew's heat drops "coolPerSecond"
// every second; each scoop of charcoal adds "charcoalHeat". Keep it in the
// "green" zone [from, to] to keep a good boil: things can only be tossed in
// then, and each one cools the brew by "itemCools". At "boilOver" it boils
// over: your things are safe, but the rent is gone (Scott: gentle, for kids).
// The table waits "orderSeconds" before calling for the next thing.
// The numbers are Claude's guesses.
GAME_DATA.cauldron = {
  "rentGems": 25,
  "startHeat": 35,
  "coolPerSecond": 3,
  "charcoalHeat": 11,
  "itemCools": 9,
  "green": [55, 80],
  "boilOver": 100,
  "orderSeconds": 2
};
