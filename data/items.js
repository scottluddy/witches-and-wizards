// Things you can own. Shelves in the Campus Store show the items of their category.
//
//   id          short name (no spaces). The picture is art/processed/<id>.png;
//               draw one and save it as art/raw/<id>.jpg, then run the art script.
//   category    Broomstick, Pet, Potion, Hat, Wand or Special Item
//   price       cost in Crystals (after the Scholarship is used up)
//   emoji       shown until there's a drawing
GAME_DATA.items = [
  { "id": "broom_snowball", "name": "Snowball",   "category": "Broomstick", "price": 30, "emoji": "🧹",
    "description": "A frosty white broom that leaves a trail of snowflakes." },
  { "id": "broom_2", "name": "Broomstick 2 (needs a name)", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "" },
  { "id": "broom_3", "name": "Broomstick 3 (needs a name)", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "" },
  { "id": "broom_4", "name": "Broomstick 4 (needs a name)", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "" },
  { "id": "broom_5", "name": "Broomstick 5 (needs a name)", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "" },
  { "id": "broom_6", "name": "Broomstick 6 (needs a name)", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "" },

  { "id": "pet_owl",    "name": "Snowy Owl",     "category": "Pet", "price": 25, "emoji": "🦉", "description": "Delivers letters and hoots hello." },
  { "id": "pet_cat",    "name": "Midnight Cat",  "category": "Pet", "price": 20, "emoji": "🐈‍⬛", "description": "Purrs when magic is near." },
  { "id": "pet_toad",   "name": "Bubble Toad",   "category": "Pet", "price": 10, "emoji": "🐸", "description": "Blows shiny bubbles." },

  { "id": "potion_giggle", "name": "Giggle Potion",    "category": "Potion", "price": 8,  "emoji": "🧪", "description": "One sip and you can't stop laughing." },
  { "id": "potion_glow",   "name": "Glow Potion",      "category": "Potion", "price": 12, "emoji": "✨", "description": "Makes you glow like a firefly." },
  { "id": "potion_float",  "name": "Floating Potion",  "category": "Potion", "price": 15, "emoji": "🫧", "description": "Float a little off the ground." },

  { "id": "hat_pointy", "name": "Pointy Purple Hat", "category": "Hat", "price": 12, "emoji": "🎩", "description": "A classic wizard hat with stars." },
  { "id": "hat_flower", "name": "Flower Crown",      "category": "Hat", "price": 10, "emoji": "🌸", "description": "Never wilts." },
  { "id": "hat_star",   "name": "Starry Beanie",     "category": "Hat", "price": 8,  "emoji": "⭐", "description": "Warm and twinkly." },

  { "id": "wand_oak",     "name": "Oak Wand",     "category": "Wand", "price": 20, "emoji": "🪄", "description": "Strong and steady." },
  { "id": "wand_crystal", "name": "Crystal Wand", "category": "Wand", "price": 30, "emoji": "🔮", "description": "Sparkles when you wave it." },
  { "id": "wand_candy",   "name": "Candy Wand",   "category": "Wand", "price": 15, "emoji": "🍭", "description": "Smells like strawberries." },

  { "id": "special_map",    "name": "Treasure Map",   "category": "Special Item", "price": 25, "emoji": "🗺️", "description": "Shows a secret spot... somewhere." },
  { "id": "special_lantern","name": "Fairy Lantern",  "category": "Special Item", "price": 18, "emoji": "🏮", "description": "A fairy lives inside and lights the way." },
  { "id": "special_book",   "name": "Spell Book",     "category": "Special Item", "price": 22, "emoji": "📖", "description": "Full of beginner spells." }
];
