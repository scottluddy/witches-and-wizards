// Wands from the Campus Store's Wand shelf (Scott, 2026-10-18; the girls'
// drawings). Each wand has a little picture that flies out of it when you
// use it ("magic": the girls drew it above or beside the wand).
//
//   healing    at the Crafting Table: fills in for up to "covers" materials
//              you don't have when you brew a spell (never the Crystal or the
//              potion: those are the spell's spark and boil)
//   lightning  when a troll steals your Crystals: zap! it drops them and runs away
//   music      in a Piano test: forgives up to "forgives" wrong notes
//
//   restMinutes  after you use a wand it rests this long before it works
//                again (real minutes; Claude's guesses, so a wand never runs
//                out but can't be used every second)
GAME_DATA.wands = {
  "healing":   { "id": "wand_healing",   "magic": "wand_healing_magic",   "emoji": "💖", "covers": 3,   "restMinutes": 30 },
  "lightning": { "id": "wand_lightning", "magic": "wand_lightning_magic", "emoji": "⚡", "restMinutes": 10 },
  "music":     { "id": "wand_music",     "magic": "wand_music_magic",     "emoji": "🎶", "forgives": 3, "restMinutes": 5 }
};

// Potions you drink from the backpack that last a while (Scott, 2026-10-18).
// "potions" lists every bottle that works (the Campus Store's and the
// Trading Post's Invisibility Potions both do). The time only counts while
// you're playing.
//   invisible  you fade to a shimmer: a woken troll can't see you to steal,
//              and bees can't find you to sting (Claude's choices)
//   wisdom     you're smarter at the Wizard School: after passing a test you
//              wait half as long for the next one ("waitShare"; Claude's choice)
GAME_DATA.timedPotions = {
  "invisible": { "potions": ["potion_invisible", "potion_invisibility"], "emoji": "🫥", "seconds": 60,
                 "button": "Drink (invisible for 1 minute)",
                 "drank": "🫥 You fade away to a faint shimmer! For 1 minute trolls can't see you and bees can't find you." },
  "wisdom":    { "potions": ["potion_wisdom"], "emoji": "🦉", "seconds": 300, "waitShare": 0.5,
                 "button": "Drink (smarter at school for 5 minutes)",
                 "drank": "🦉 Your head feels bright and clear! For 5 minutes, every Wizard School test you pass needs only half the rest before the next one." }
};
