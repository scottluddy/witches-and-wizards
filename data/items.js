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
  {"id": "broom_wave", "name": "Wave", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Wave broomstick."},
  {"id": "broom_no1", "name": "Iridescent", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Iridescent broomstick."},
  {"id": "broom_no2", "name": "Sunset", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Sunset broomstick."},
  {"id": "broom_stinger", "name": "Stinger", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Stinger broomstick."},
  {"id": "broom_firefly", "name": "Firefly", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Firefly broomstick."},
  {"id": "broom_bolt", "name": "Bolt", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Bolt broomstick."},
  {"id": "broom_rocketer", "name": "Rocketer", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Rocketer broomstick."},
  {"id": "broom_no3", "name": "Tangerine", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Tangerine broomstick."},
  {"id": "broom_no4", "name": "Icy", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Icy broomstick."},
  {"id": "broom_no5", "name": "Bubble", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Bubble broomstick."},
  {"id": "broom_no6", "name": "Emerald", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Emerald broomstick."},
  {"id": "broom_no7", "name": "Nature", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Nature broomstick."},
  {"id": "broom_no8", "name": "Moon", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Moon broomstick."},
  {"id": "broom_snowflake", "name": "Snowflake", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "A frosty light-blue broom."},
  {"id": "broom_no9", "name": "Comet", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Comet broomstick."},
  {"id": "broom_no10", "name": "Saturn", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Saturn broomstick."},
  {"id": "broom_no11", "name": "Play-doh", "category": "Broomstick", "gems": 5, "emoji": "🧹", "description": "The Play-doh broomstick."},
  {"id": "pet_turtle", "name": "Healing Turtle", "category": "Pet", "gems": 3, "emoji": "🐢", "description": "A gentle turtle whose shell glows when someone needs healing."},
  {"id": "pet_owl", "name": "Snowy Owl", "category": "Pet", "gems": 17, "emoji": "🦉", "description": "A fluffy white owl with big round eyes."},
  {"id": "pet_cat", "name": "Midnight Cat", "category": "Pet", "gems": 15, "emoji": "🐈", "description": "A soft brown cat who loves the night."},
  {"id": "potion_float", "name": "Levitating Potion", "category": "Potion", "gems": 1, "emoji": "🫧", "description": "A star-shaped bottle. One sip and you float up off the ground."},
  {"id": "special_book", "name": "Wizard Essentials Spellbook", "category": "Special Item", "gems": 5, "emoji": "📖", "description": "Every spell a young witch or wizard needs to know."}
,
  {"id": "ski_size1", "name": "Ski Outfit (Size 1)", "category": "Ski Gear", "gems": 3, "emoji": "⛷️", "inPicture": true, "shelfX": 21, "shelfY": 76, "description": "A green ski outfit from the Ski Reserve."},
  {"id": "ski_size2", "name": "Ski Outfit (Size 2)", "category": "Ski Gear", "gems": 5, "emoji": "⛷️", "inPicture": true, "shelfX": 40, "shelfY": 74, "description": "A purple ski outfit from the Ski Reserve, one size bigger."},
  {"id": "dress_winter", "name": "Winter Dress", "category": "Dresses", "price": 1, "emoji": "👗", "inPicture": true, "shelfX": 15, "shelfY": 26, "description": "A soft pink winter dress with a frilly hem."},
  {"id": "dress_multi", "name": "Multi Dress", "category": "Dresses", "price": 2, "emoji": "👗", "inPicture": true, "shelfX": 40, "shelfY": 27, "description": "A dress that fades from blue to pink."},
  {"id": "dress_magenta_winter", "name": "Magenta Winter Dress", "category": "Dresses", "price": 4, "emoji": "👗", "inPicture": true, "shelfX": 58, "shelfY": 29, "description": "A bright magenta winter dress with frills."},
  {"id": "dress_summer_ballgown", "name": "Summer Ballgown", "category": "Dresses", "price": 1, "emoji": "👗", "inPicture": true, "shelfX": 79, "shelfY": 30, "description": "A sunny yellow and orange ballgown with a bow."},
  {"id": "dress_golden_rose", "name": "Golden Rose Fall Dress", "category": "Dresses", "price": 3, "emoji": "👗", "inPicture": true, "shelfX": 14, "shelfY": 75, "description": "A red fall dress with a golden rose."},
  {"id": "dress_iridescent_spring", "name": "Iridescent Spring Gown", "category": "Dresses", "price": 2, "emoji": "👗", "inPicture": true, "shelfX": 81, "shelfY": 75, "description": "A shimmering blue spring gown."}
];
