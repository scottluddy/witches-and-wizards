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
  {"id": "potion_sense", "name": "Sense Potion", "category": "Potion", "gems": 3, "emoji": "🧪", "description": "A potion for the senses. Needed for the Seeing Spell."},
  {"id": "special_book", "name": "Wizard Essentials Spellbook", "category": "Special Item", "gems": 5, "emoji": "📖", "description": "Every spell a young witch or wizard needs to know."}
,
  {"id": "ski_size1", "name": "Ski Outfit (Size 1)", "category": "Ski Gear", "gems": 3, "emoji": "⛷️", "inPicture": true, "shelfX": 21, "shelfY": 76, "description": "A green ski outfit from the Ski Reserve."},
  {"id": "ski_size2", "name": "Ski Outfit (Size 2)", "category": "Ski Gear", "gems": 5, "emoji": "⛷️", "inPicture": true, "shelfX": 40, "shelfY": 74, "description": "A purple ski outfit from the Ski Reserve, one size bigger."},
  {"id": "tool_pickaxe", "name": "Pickaxe", "category": "Tool", "price": 0, "emoji": "⛏️", "description": "From the rack in the Crystal Cave. Use it to mine for crystals and bones."},
  {"id": "snack_cookies", "name": "Cookies", "category": "Snack Shack Floor 2", "gems": 6, "emoji": "🍪", "inPicture": true, "shelfX": 12, "shelfY": 59, "description": "Two jars full of cookies.", "food": 3},
  {"id": "snack_chocolate", "name": "Chocolate", "category": "Snack Shack Floor 2", "gems": 6, "emoji": "🍫", "inPicture": true, "shelfX": 30, "shelfY": 59, "description": "Chocolate bars on a plate.", "food": 3},
  {"id": "snack_chips", "name": "Chips", "category": "Snack Shack Floor 2", "gems": 4, "emoji": "🥔", "inPicture": true, "shelfX": 10, "shelfY": 77, "description": "Two bags of chips.", "food": 2},
  {"id": "snack_candy", "name": "Candy", "category": "Snack Shack Floor 2", "gems": 4, "emoji": "🍬", "inPicture": true, "shelfX": 26, "shelfY": 78, "description": "A stripy wrapped candy.", "food": 2},
  {"id": "snack_lollipops", "name": "Lollipops", "category": "Snack Shack Floor 2", "gems": 2, "emoji": "🍭", "inPicture": true, "shelfX": 8, "shelfY": 97, "description": "Four lollipops on a stand.", "food": 1},
  {"id": "snack_gummies", "name": "Fruit Gummies", "category": "Snack Shack Floor 2", "gems": 2, "emoji": "🍓", "inPicture": true, "shelfX": 26, "shelfY": 98, "description": "Packets of fruit gummies.", "food": 1},
  {"id": "snack_pie", "name": "Pie", "category": "Snack Shack Floor 2", "gems": 10, "emoji": "🥧", "inPicture": true, "shelfX": 66, "shelfY": 80, "description": "A warm pie from the food counter.", "food": 5},
  {"id": "snack_fruit_basket", "name": "Fruit Basket", "category": "Snack Shack Floor 2", "gems": 10, "emoji": "🧺", "inPicture": true, "shelfX": 74.5, "shelfY": 80, "description": "A basket of fruit from the food counter.", "food": 5},
  {"id": "snack_mug_black", "name": "Hot Chocolate (Black Mug)", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 60, "shelfY": 46, "description": "Hot chocolate from the hot chocolate station. Hold it up to the marshmallow machine!", "hotChocolate": true, "food": 2},
  {"id": "snack_mug_tall_black", "name": "Hot Chocolate (Tall Black Mug)", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 70, "shelfY": 38, "description": "Hot chocolate from the hot chocolate station. Hold it up to the marshmallow machine!", "hotChocolate": true, "food": 2},
  {"id": "snack_mug_pink", "name": "Hot Chocolate (Pink Mug)", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 78, "shelfY": 40, "description": "Hot chocolate from the hot chocolate station. Hold it up to the marshmallow machine!", "hotChocolate": true, "food": 2},
  {"id": "snack_mug_heart", "name": "Hot Chocolate (Heart Mug)", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 86, "shelfY": 45, "description": "Hot chocolate from the hot chocolate station. Hold it up to the marshmallow machine!", "hotChocolate": true, "food": 2},
  {"id": "snack_mug_rose", "name": "Hot Chocolate (Rosy Mug)", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 69, "shelfY": 51, "description": "Hot chocolate from the hot chocolate station. Hold it up to the marshmallow machine!", "hotChocolate": true, "food": 2},
  {"id": "snack_mug_little_black", "name": "Hot Chocolate (Little Black Mug)", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 80, "shelfY": 53, "description": "Hot chocolate from the hot chocolate station. Hold it up to the marshmallow machine!", "hotChocolate": true, "food": 2},
  {"id": "snack_straws", "name": "Straws", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "🥤", "inPicture": true, "shelfX": 4, "shelfY": 49, "description": "Straws from the top of the shelf."},
  {"id": "snack_water", "name": "Water", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "💧", "inPicture": true, "shelfX": 13, "shelfY": 62, "description": "Bottles of water on the top shelf.", "food": 1},
  {"id": "snack_icees", "name": "Icees", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "🧊", "inPicture": true, "shelfX": 13, "shelfY": 79, "description": "Icy slushies on the middle shelf.", "food": 1},
  {"id": "snack_tea", "name": "Tea Bags and Mug", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "🍵", "inPicture": true, "shelfX": 14, "shelfY": 93, "description": "A mug and tea bags from the bottom shelf.", "food": 1},
  {"id": "dress_winter", "name": "Winter Dress", "category": "Dresses", "price": 1, "emoji": "👗", "inPicture": true, "shelfX": 15, "shelfY": 26, "description": "A soft pink winter dress with a frilly hem."},
  {"id": "dress_multi", "name": "Multi Dress", "category": "Dresses", "price": 2, "emoji": "👗", "inPicture": true, "shelfX": 40, "shelfY": 27, "description": "A dress that fades from blue to pink."},
  {"id": "dress_magenta_winter", "name": "Magenta Winter Dress", "category": "Dresses", "price": 4, "emoji": "👗", "inPicture": true, "shelfX": 58, "shelfY": 29, "description": "A bright magenta winter dress with frills."},
  {"id": "dress_summer_ballgown", "name": "Summer Ballgown", "category": "Dresses", "price": 1, "emoji": "👗", "inPicture": true, "shelfX": 79, "shelfY": 30, "description": "A sunny yellow and orange ballgown with a bow."},
  {"id": "dress_golden_rose", "name": "Golden Rose Fall Dress", "category": "Dresses", "price": 3, "emoji": "👗", "inPicture": true, "shelfX": 14, "shelfY": 75, "description": "A red fall dress with a golden rose."},
  {"id": "dress_iridescent_spring", "name": "Iridescent Spring Gown", "category": "Dresses", "price": 2, "emoji": "👗", "inPicture": true, "shelfX": 81, "shelfY": 75, "description": "A shimmering blue spring gown."}
];
