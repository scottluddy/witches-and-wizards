// Things you can own. Shelves in the Campus Store show the items of their category.
// Only the girls' own items go here. Suggestions live in data/ideas.js (catalog only).
//
//   id          short name (no spaces). The picture is art/processed/<id>.png;
//               draw one and save it as art/raw/<id>.jpg, then run the art script.
//   category    Broomstick, Pet, Potion, Hat, Wand or Special Item
//   price       cost in Crystals (after the Scholarship is used up)
//   gems        cost in Gems instead of Crystals (Gems are earned by fishing)
//   emoji       shown until there's a drawing
GAME_DATA.items = [
  {"id": "broom_snowball", "name": "Snowball", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A frosty white broom that leaves a trail of snowflakes."},
  {"id": "pet_turtle", "name": "Healing Turtle", "category": "Pet", "gems": 3, "emoji": "🐢", "description": "A gentle turtle whose shell glows when someone needs healing."},
  {"id": "potion_float", "name": "Levitating Potion", "category": "Potion", "gems": 1, "emoji": "🫧", "description": "A star-shaped bottle. One sip and you float up off the ground."},
  {"id": "special_book", "name": "Wizard Essentials Spellbook", "category": "Special Item", "gems": 5, "emoji": "📖", "description": "Every spell a young witch or wizard needs to know."}
];
