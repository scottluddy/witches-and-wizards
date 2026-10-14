// The Pixie Quest (Scott, 2026-10-13, made a Quest 2026-10-14).
//
// A Pixie hides somewhere in the Forest: in one of its places, for
// "stayMinutes", then she flies off to another. The troll stole her Golden
// Acorn and hid it in a secret part of the Forest.
//   1. Give her the fish she wants and she gives you a Finding Potion.
//   2. Drinking it takes you to the troll at the Troll Bridge.
//   3. Each riddle you answer right gets you one piece of the troll's map.
//   4. Put the pieces in the right order and the Secret Pathway to the Pond
//      House appears.
//   5. Search inside the Pond House for the Golden Acorn. It goes in your backpack.
//   6. Take it back to the Pixie (wherever she has flown) to finish the Quest.
// The Pond House also has a turtle in the pond, s'mores, hot chocolate and a couch.
GAME_DATA.pixie = {
  "territory": "forest",
  "stayMinutes": 3,
  "wants": "fish_crystal",
  "gives": "potion_finding",
  "takesYouTo": "troll_bridge",
  "size": 9
};

// The Quest's own things (generic pictures until the girls draw them).
//   mapPieces      how many map pieces (one for each riddle answered right)
//   mapArea        the part of the Forest map the troll's map shows, around
//                  the Secret Pathway: [left, top, right, bottom] percent.
//                  It's cut into "mapPieces" strips, left to right.
//   treasure       what the troll stole from the Pixie ("item" in data/items.js:
//                  it goes in your backpack when you find it)
//   hiddenIn       the place the treasure is hidden in
//   area           where in that picture it can hide: [left, top, right, bottom] percent
//   findDistance   click this close (percent of the picture) to find it
//   adventurePoints  earned for giving the treasure back
//   kind           its celebration picture (data/adventures.js)
GAME_DATA.pixieQuest = {
  "name": "The Pixie's Lost Treasure",
  "mapPieces": 3,
  "mapEmoji": "🗺️",
  "mapArea": [64, 36, 100, 78],
  "treasure": { "name": "Golden Acorn", "emoji": "🌰", "item": "quest_golden_acorn" },
  "hiddenIn": "pond_house_inside",
  "area": [10, 30, 90, 90],
  "findDistance": 7,
  "adventurePoints": 1,
  "kind": "quest",
  // The Finding Potion (Scott, 2026-10-14): it only works where the troll is
  // hiding. Each sip somewhere else flashes up the Forest map for a moment,
  // showing where he is. "sips" in a potion; he moves to another Forest
  // place every "trollMoveMinutes"; the flash lasts "flashSeconds".
  "sips": 4,
  "fewerSipsEachTime": 1, // each time you've done the Quest, the potion has 1 sip fewer...
  "fewestSips": 2,        // ...but never fewer than 2
  "trollMoveMinutes": 2,
  "flashSeconds": 1,
  "secret": "pixie_path",
  // The Pond Turtle (from the pond outside) doesn't know where the acorn is,
  // but its shell glows (Scott, 2026-10-14). It wanders "speed" percent of the
  // picture a second, turning up to "turn" degrees a step. Its shell glows
  // brighter the closer it is ("glowRange"). Within "shineDistance" it shines
  // bright for "shineSeconds", then slowly turns ("turnRate" degrees a step)
  // the right way. After each shine it stays nearer the brightest spot so far:
  // within "leash", shrinking by "leashShrink" each shine down to
  // "smallestLeash", so left alone it narrows the search to a small spot.
  // It can shine again after "restSeconds". Every "feelEvery" steps it feels
  // if its shell got dimmer, and if so turns "colderTurn" degrees a step until
  // it's getting brighter again.
  "turtle": { "pet": "pet_pond_turtle", "start": [44, 80], "speed": 1, "turn": 12, "turnRate": 3,
    "glowRange": 70, "shineDistance": 22, "shineSeconds": 2, "restSeconds": 6,
    "leash": 25, "leashShrink": 0.7, "smallestLeash": 5,
    "feelEvery": 5, "colderTurn": 4,
    // It leaves a footprint every "footprintEvery" percent; each fades away after "footprintSeconds".
    "footprintEvery": 2, "footprintSeconds": 90 },
  // Clues in the Pond House (Scott, 2026-10-14: they help you narrow down
  // where the acorn is, but you still have to click right on it).
  //   fireLight   roasting a marshmallow at the fireplace lights up the
  //               quarter of the room the acorn is in, and the other three
  //               quarters go dark ("shadow": how dark, 0 to 1). The room is
  //               split down the middle of "area".
  //   warmSense   drinking hot chocolate gives you a warm feeling for
  //               "seconds": every click says how close you are, in colour.
  //               Each mug adds more time. "words" go from closest to
  //               farthest: "within" this far (percent of the picture).
  //   clues       the couch (Claude's idea): the first time you sit on it
  //               while searching, NEAREST becomes the thing in the room the
  //               acorn is closest to.
  "fireLight": { "shadow": 0.62 },
  "warmSense": { "seconds": 60, "words": [
    { "within": 10,  "word": "Warmer!", "colour": "#e0301e" },
    { "within": 22,  "word": "Warm",    "colour": "#f08a12" },
    { "within": 38,  "word": "Cool",    "colour": "#4fa3e0" },
    { "within": 999, "word": "Cold",    "colour": "#2a4fa0" } ] },
  "clues": [
    { "at": "pond_couch",
      "says": "Under a couch cushion there's a note in wobbly troll writing: \"Hid it near the NEAREST. Grrr.\"" }
  ]
};

// The troll's riddles (Scott, 2026-10-14: harder ones, picked at random from
// a big list, and each player hears every riddle once before any repeat).
// The FIRST answer is the right one; the game mixes up the order.
GAME_DATA.riddles = [
  { "question": "The more of me you take, the more you leave behind. What am I?", "answers": ["Footsteps", "Cookies", "Breaths"] },
  { "question": "I have cities but no houses, forests but no trees, and rivers but no fish. What am I?", "answers": ["A map", "A dream", "A painting"] },
  { "question": "What can travel all around the world while staying in a corner?", "answers": ["A stamp", "A spider", "The wind"] },
  { "question": "I'm tall when I'm young and short when I'm old. What am I?", "answers": ["A candle", "A mountain", "A puppy"] },
  { "question": "What has a neck but no head?", "answers": ["A bottle", "A snake", "A scarf"] },
  { "question": "What comes once in a minute, twice in a moment, but never in a thousand years?", "answers": ["The letter M", "A shooting star", "A sneeze"] },
  { "question": "What building has the most stories?", "answers": ["A library", "A castle", "A skyscraper"] },
  { "question": "Forward I am heavy, but backward I am not. What am I?", "answers": ["A ton", "A rock", "A troll"] },
  { "question": "What can you hold in your right hand but never in your left hand?", "answers": ["Your left elbow", "A pencil", "A cup"] },
  { "question": "If you drop me I'm sure to crack, but smile at me and I'll smile back. What am I?", "answers": ["A mirror", "An egg", "A plate"] },
  { "question": "What has a head and a tail but no body?", "answers": ["A coin", "A worm", "A comet"] },
  { "question": "What runs but never walks, and has a mouth but never talks?", "answers": ["A river", "A dog", "A clock"] },
  { "question": "What belongs to you, but other people use it more than you do?", "answers": ["Your name", "Your toys", "Your shoes"] },
  { "question": "What has four fingers and a thumb but isn't alive?", "answers": ["A glove", "A hand", "A fork"] },
  { "question": "What can fill a room but takes up no space?", "answers": ["Light", "Water", "Balloons"] },
  { "question": "The more there is, the less you see. What is it?", "answers": ["Darkness", "Snow", "Sunshine"] },
  { "question": "What word is spelled wrong in every dictionary?", "answers": ["Wrong", "Dictionary", "Spelling"] },
  { "question": "Which month of the year has 28 days?", "answers": ["All of them", "February", "None of them"] },
  { "question": "What goes through towns and over hills but never moves?", "answers": ["A road", "A train", "A bird"] },
  { "question": "What has an eye but can't see, and is full of wind?", "answers": ["A hurricane", "A needle", "A potato"] },
  { "question": "What has legs but can't walk?", "answers": ["A table", "A spider", "A snake"] },
  { "question": "What is full of holes but still holds water?", "answers": ["A sponge", "A bucket", "A net"] },
  { "question": "What can you break without touching it?", "answers": ["A promise", "A window", "An egg"] },
  { "question": "What starts with T, ends with T, and has T in it?", "answers": ["A teapot", "A tent", "A turtle"] },
  { "question": "What goes up and down but never moves?", "answers": ["Stairs", "An elevator", "A yo-yo"] },
  { "question": "Which is heavier: a pound of feathers or a pound of rocks?", "answers": ["They weigh the same", "The rocks", "The feathers"] },
  { "question": "What kind of room has no doors or windows?", "answers": ["A mushroom", "A cave", "A closet"] },
  { "question": "I'm as light as a feather, but the strongest wizard can't hold me for long. What am I?", "answers": ["Your breath", "A bubble", "A cloud"] },
  { "question": "What gets bigger the more you take away from it?", "answers": ["A hole", "A pizza", "A shadow"] },
  { "question": "What is always in front of you but can't be seen?", "answers": ["The future", "Your shoes", "A rainbow"] },
  { "question": "What has one head, one foot and four legs?", "answers": ["A bed", "A dog", "A chair"] },
  { "question": "What lets you look right through a wall?", "answers": ["A window", "A telescope", "A potion"] },
  { "question": "What is so fragile that saying its name breaks it?", "answers": ["Silence", "Glass", "A bubble"] },
  { "question": "I follow you all day but disappear at night. What am I?", "answers": ["Your shadow", "Your cat", "The moon"] },
  { "question": "What has lots of words but never speaks?", "answers": ["A book", "A parrot", "A troll"] },
  { "question": "What can you keep after giving it to someone?", "answers": ["Your word", "A cookie", "A balloon"] },
  { "question": "What always comes down but never goes up?", "answers": ["Rain", "A kite", "A ball"] },
  { "question": "I have keys but no locks, and space but no room. What am I?", "answers": ["A keyboard", "A castle", "A treasure chest"] },
  { "question": "What 4-letter word reads the same forward, backward, and even upside down?", "answers": ["NOON", "ROAR", "TOOT"] },
  { "question": "There are two in a corner, one in a room, none in a house, but one in a shelter. What am I?", "answers": ["The letter R", "A spider", "A chair"] },
  { "question": "What do you call a bear with no teeth?", "answers": ["A gummy bear", "A teddy bear", "A polar bear"] },
  { "question": "What has thirteen hearts but no other insides?", "answers": ["A deck of cards", "A troll", "A garden"] },
  { "question": "What has a bark but no bite?", "answers": ["A tree", "A puppy", "A seal"] },
  { "question": "What can you catch but not throw?", "answers": ["A cold", "A ball", "A fish"] },
  { "question": "I'm always hungry and must be fed, but give me water and I'll soon be dead. What am I?", "answers": ["A fire", "A plant", "A dragon"] },
  { "question": "What has many rings but no fingers?", "answers": ["A tree trunk", "A bell", "A jeweler"] },
  { "question": "What goes up when the rain comes down?", "answers": ["An umbrella", "A rainbow", "A frog"] },
  { "question": "What has to be broken before you can use it?", "answers": ["An egg", "A window", "A pencil"] }
];

// Inside the Pond House: how many hunger points each treat takes away (Scott).
GAME_DATA.pondHouse = {
  "smores": 2,
  "hotChocolate": 1,
  "turtle": "pet_pond_turtle"
};
