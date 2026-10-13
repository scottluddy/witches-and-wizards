// The Pixie adventure (Scott, 2026-10-13).
//
// A Pixie hides somewhere in the Forest: in one of its places, for
// "stayMinutes", then she flies off to another. Give her the fish she wants
// from your cooler and she gives you a Finding Potion. Drinking it takes you
// to the Troll Bridge. Answer the troll's riddle to cross to the Pond House:
// a turtle lives in the pond, and inside there's a fireplace, s'mores, hot
// chocolate and a comfy couch.
GAME_DATA.pixie = {
  "territory": "forest",
  "stayMinutes": 3,
  "wants": "fish_crystal",
  "gives": "potion_finding",
  "takesYouTo": "troll_bridge",
  "size": 9
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
