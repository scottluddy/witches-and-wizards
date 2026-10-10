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
  {"id": "tool_pickaxe", "name": "Pickaxe", "category": "Tool", "price": 0, "emoji": "⛏️", "description": "From the rack in the Crystal Cave. Use it to mine for crystals and bones."},
  {"id": "snack_cookies", "name": "Cookies", "category": "Snack Shack Floor 2", "gems": 6, "emoji": "🍪", "inPicture": true, "shelfX": 12, "shelfY": 59, "description": "Two jars full of cookies."},
  {"id": "snack_chocolate", "name": "Chocolate", "category": "Snack Shack Floor 2", "gems": 6, "emoji": "🍫", "inPicture": true, "shelfX": 30, "shelfY": 59, "description": "Chocolate bars on a plate."},
  {"id": "snack_chips", "name": "Chips", "category": "Snack Shack Floor 2", "gems": 4, "emoji": "🥔", "inPicture": true, "shelfX": 10, "shelfY": 77, "description": "Two bags of chips."},
  {"id": "snack_candy", "name": "Candy", "category": "Snack Shack Floor 2", "gems": 4, "emoji": "🍬", "inPicture": true, "shelfX": 26, "shelfY": 78, "description": "A stripy wrapped candy."},
  {"id": "snack_lollipops", "name": "Lollipops", "category": "Snack Shack Floor 2", "gems": 2, "emoji": "🍭", "inPicture": true, "shelfX": 8, "shelfY": 97, "description": "Four lollipops on a stand."},
  {"id": "snack_gummies", "name": "Fruit Gummies", "category": "Snack Shack Floor 2", "gems": 2, "emoji": "🍓", "inPicture": true, "shelfX": 26, "shelfY": 98, "description": "Packets of fruit gummies."},
  {"id": "snack_pie", "name": "Pie", "category": "Snack Shack Floor 2", "gems": 10, "emoji": "🥧", "inPicture": true, "shelfX": 66, "shelfY": 80, "description": "A warm pie from the food counter."},
  {"id": "snack_fruit_basket", "name": "Fruit Basket", "category": "Snack Shack Floor 2", "gems": 10, "emoji": "🧺", "inPicture": true, "shelfX": 74.5, "shelfY": 80, "description": "A basket of fruit from the food counter."},
  {"id": "snack_mug_black", "name": "Black Mug", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 60, "shelfY": 46, "description": "A mug of hot cocoa."},
  {"id": "snack_mug_tall_black", "name": "Tall Black Mug", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 70, "shelfY": 38, "description": "A tall mug of hot cocoa."},
  {"id": "snack_mug_pink", "name": "Pink Mug", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 78, "shelfY": 40, "description": "A pink mug of hot cocoa."},
  {"id": "snack_mug_heart", "name": "Heart Mug", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 86, "shelfY": 45, "description": "A mug with hearts and flowers on it."},
  {"id": "snack_mug_rose", "name": "Rosy Mug", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 69, "shelfY": 51, "description": "A rosy pink mug of hot cocoa."},
  {"id": "snack_mug_little_black", "name": "Little Black Mug", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 80, "shelfY": 53, "description": "A little mug of hot cocoa."},
  {"id": "snack_straw_cup", "name": "Cup of Straws", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "🥤", "inPicture": true, "shelfX": 4, "shelfY": 49, "description": "A cup full of straws."},
  {"id": "snack_jars", "name": "Snack Jars", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "🫙", "inPicture": true, "shelfX": 13, "shelfY": 62, "description": "Four jars of snacks."},
  {"id": "snack_bottles", "name": "Bottled Drinks", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "🧃", "inPicture": true, "shelfX": 13, "shelfY": 79, "description": "Four bottles of drinks."},
  {"id": "snack_shelf_mugs", "name": "Shelf Mugs", "category": "Snack Shack Floor 1", "gems": 1, "emoji": "☕", "inPicture": true, "shelfX": 14, "shelfY": 93, "description": "Mugs on the bottom shelf."},
  {"id": "dress_winter", "name": "Winter Dress", "category": "Dresses", "price": 1, "emoji": "👗", "inPicture": true, "shelfX": 15, "shelfY": 26, "description": "A soft pink winter dress with a frilly hem."},
  {"id": "dress_multi", "name": "Multi Dress", "category": "Dresses", "price": 2, "emoji": "👗", "inPicture": true, "shelfX": 40, "shelfY": 27, "description": "A dress that fades from blue to pink."},
  {"id": "dress_magenta_winter", "name": "Magenta Winter Dress", "category": "Dresses", "price": 4, "emoji": "👗", "inPicture": true, "shelfX": 58, "shelfY": 29, "description": "A bright magenta winter dress with frills."},
  {"id": "dress_summer_ballgown", "name": "Summer Ballgown", "category": "Dresses", "price": 1, "emoji": "👗", "inPicture": true, "shelfX": 79, "shelfY": 30, "description": "A sunny yellow and orange ballgown with a bow."},
  {"id": "dress_golden_rose", "name": "Golden Rose Fall Dress", "category": "Dresses", "price": 3, "emoji": "👗", "inPicture": true, "shelfX": 14, "shelfY": 75, "description": "A red fall dress with a golden rose."},
  {"id": "dress_iridescent_spring", "name": "Iridescent Spring Gown", "category": "Dresses", "price": 2, "emoji": "👗", "inPicture": true, "shelfX": 81, "shelfY": 75, "description": "A shimmering blue spring gown."}
];
