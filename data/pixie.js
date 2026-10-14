// The Pixie Quest (Scott, 2026-10-13, made a Quest 2026-10-14).
//
// A Pixie hides somewhere in the Forest: in one of its places, for
// "stayMinutes", then she flies off to another. The troll stole her Golden
// Acorn and hid it in a secret part of the Forest.
//   1. Give her the fish she wants and she gives you a Finding Potion.
//   2. Drinking it takes you to the troll at the Troll Bridge.
//   3. Each riddle you answer right gives you one piece of the troll's map.
//   4. With all the pieces, the map shows a Secret Pathway to the Pond House.
//   5. Search inside the Pond House for the Golden Acorn ("Warmer!").
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
//   treasure       what the troll stole from the Pixie
//   hiddenIn       the place the treasure is hidden in
//   area           where in that picture it can hide: [left, top, right, bottom] percent
//   findDistance   click this close (percent of the picture) to find it
//   warmDistance   this close says "Warmer!"
//   adventurePoints  earned for giving the treasure back
//   kind           its celebration picture (data/adventures.js)
GAME_DATA.pixieQuest = {
  "name": "The Pixie's Lost Treasure",
  "mapPieces": 3,
  "mapEmoji": "🗺️",
  "treasure": { "name": "Golden Acorn", "emoji": "🌰" },
  "hiddenIn": "pond_house_inside",
  "area": [10, 30, 90, 90],
  "findDistance": 7,
  "warmDistance": 18,
  "adventurePoints": 1,
  "kind": "quest",
  // The Finding Potion (Scott, 2026-10-14): it only works where the troll is
  // hiding. Each sip somewhere else flashes up the Forest map for a moment,
  // showing where he is. "sips" in a potion; he moves to another Forest
  // place every "trollMoveMinutes"; the flash lasts "flashSeconds".
  "sips": 4,
  "trollMoveMinutes": 2,
  "flashSeconds": 1,
  "secret": "pixie_path",
  // The Pond Turtle (from the pond outside) can sniff out the acorn, but it's
  // a turtle (Scott, 2026-10-14: slow, roundabout, never crossing its own
  // trail, never quite getting there). It crawls up to "speed" percent of the
  // picture a second, slower as it gets near, wandering up to "wander" degrees
  // off course (changing by up to "turn" degrees a step), and sits down
  // "closest" percent from the acorn: about 2 to 3 minutes.
  "turtle": { "pet": "pet_pond_turtle", "start": [44, 80], "speed": 0.5, "wander": 80, "turn": 7, "closest": 16,
    // It leaves a footprint every "footprintEvery" percent; each fades away after "footprintSeconds".
    "footprintEvery": 2, "footprintSeconds": 90 },
  // Clues in the Pond House (Scott, 2026-10-14: doing things there makes the
  // acorn easier to find). Each one, the first time you do it while
  // searching, says something helpful and makes the search "bigger" (you can
  // click a little farther from the acorn and still find it). SIDE becomes
  // "left" or "right" and HEIGHT "up high" or "down low", from where the
  // acorn really is. Claude's ideas.
  "clues": [
    { "at": "fireplace", "bigger": 4,
      "says": "The fire blazes up and lights the whole room. Now it's much easier to spot things!" },
    { "at": "pond_hot_chocolate", "bigger": 2,
      "says": "Next to the mugs you spot muddy troll footprints. They lead to the SIDE of the room!" },
    { "at": "pond_couch", "bigger": 2,
      "says": "Under a couch cushion there's a note in wobbly troll writing: \"Hid it HEIGHT. Grrr.\"" }
  ]
};

// The troll's riddles: the question, three answers, and which one is right (0, 1 or 2).
GAME_DATA.riddles = [
  { "question": "What has hands but can't clap?", "answers": ["A clock", "A glove", "A tree"], "right": 0 },
  { "question": "What gets wetter the more it dries?", "answers": ["Rain", "A towel", "A fish"], "right": 1 },
  { "question": "What has to be broken before you can use it?", "answers": ["A window", "A pencil", "An egg"], "right": 2 },
  { "question": "What has keys but can't open a door?", "answers": ["A piano", "A castle", "A car"], "right": 0 },
  { "question": "What goes up but never comes down?", "answers": ["A balloon", "Your age", "A kite"], "right": 1 },
  { "question": "What has one eye but can't see?", "answers": ["A pirate", "A cyclops", "A needle"], "right": 2 },
  { "question": "What can you catch but not throw?", "answers": ["A cold", "A ball", "A fish"], "right": 0 },
  { "question": "What has lots of teeth but never bites?", "answers": ["A shark", "A comb", "A troll"], "right": 1 }
];

// Inside the Pond House: how many hunger points each treat takes away (Scott).
GAME_DATA.pondHouse = {
  "smores": 2,
  "hotChocolate": 1,
  "turtle": "pet_pond_turtle"
};
