// Things you can own. Shelves in the Campus Store show the items of their category.
// Only the girls' own items go here. Suggestions live in data/ideas.js (catalog only).
//
//   id          short name (no spaces). The picture is art/processed/<id>.png;
//               draw one and save it as art/raw/<id>.jpg, then run the art script.
//   category    Broomstick, Pet, Potion, Hat, Wand or Special Item
//   price       cost in Crystals (after the Scholarship is used up)
//   gems        cost in Gems instead of Crystals (Gems are earned by fishing)
//   emoji       shown until there's a drawing
//   inPicture   true when the item is already drawn in its shop's picture: only
//               its price tag shows there, at shelfX/shelfY (percent)
GAME_DATA.items = [
  {"id": "broom_wave", "name": "Wave", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "The Wave broomstick."},
  {"id": "broom_no1", "name": "Broom No. 1", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_no2", "name": "Broom No. 2", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_stinger", "name": "Stinger", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "The Stinger broomstick."},
  {"id": "broom_firefly", "name": "Firefly", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "The Firefly broomstick."},
  {"id": "broom_bolt", "name": "Bolt", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "The Bolt broomstick."},
  {"id": "broom_rocketer", "name": "Rocketer", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "The Rocketer broomstick."},
  {"id": "broom_no3", "name": "Broom No. 3", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_no4", "name": "Broom No. 4", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_no5", "name": "Broom No. 5", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_no6", "name": "Broom No. 6", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_no7", "name": "Broom No. 7", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_no8", "name": "Broom No. 8", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_snowflake", "name": "Snowflake", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A frosty light-blue broom."},
  {"id": "broom_no9", "name": "Broom No. 9", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_no10", "name": "Broom No. 10", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "broom_no11", "name": "Broom No. 11", "category": "Broomstick", "price": 30, "emoji": "🧹", "description": "A broomstick drawn by the girls."},
  {"id": "pet_turtle", "name": "Healing Turtle", "category": "Pet", "gems": 3, "emoji": "🐢", "description": "A gentle turtle whose shell glows when someone needs healing."},
  {"id": "pet_owl", "name": "Snowy Owl", "category": "Pet", "gems": 17, "emoji": "🦉", "description": "A fluffy white owl with big round eyes."},
  {"id": "pet_cat", "name": "Midnight Cat", "category": "Pet", "gems": 15, "emoji": "🐈", "description": "A soft brown cat who loves the night."},
  {"id": "potion_float", "name": "Levitating Potion", "category": "Potion", "gems": 1, "emoji": "🫧", "description": "A star-shaped bottle. One sip and you float up off the ground."},
  {"id": "special_book", "name": "Wizard Essentials Spellbook", "category": "Special Item", "gems": 5, "emoji": "📖", "description": "Every spell a young witch or wizard needs to know."}
,
  {"id": "ski_size1", "name": "Ski Outfit (Size 1)", "category": "Ski Gear", "gems": 3, "emoji": "⛷️", "inPicture": true, "shelfX": 21, "shelfY": 76, "description": "A green ski outfit from the Ski Reserve."},
  {"id": "ski_size2", "name": "Ski Outfit (Size 2)", "category": "Ski Gear", "gems": 5, "emoji": "⛷️", "inPicture": true, "shelfX": 40, "shelfY": 74, "description": "A purple ski outfit from the Ski Reserve, one size bigger."}
];
