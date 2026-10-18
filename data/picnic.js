// Rosy Hills (Scott, 2026-10-18, the girls' drawing art/raw/sheets/rosy_hills.jpeg):
// a picnic blanket between the hills, where you sit and eat food you carry, and a
// Meeting Place on the hill where friendly wild animals come to visit. Code in js/picnic.js.
// Numbers are Claude's guesses.
GAME_DATA.picnic = {
  // Where you stand at the Meeting Place (feet, percent of the picture).
  "meetAt": { "x": 76, "y": 62 },
  // Animals come in from the right edge and stop this far to your right.
  "stopShift": 9,
  // The first visitor comes this many seconds after you get there, the next ones
  // somewhere between the two numbers after the last one left.
  "firstSeconds": 3,
  "everySeconds": [6, 12],
  // How long a visitor stays before wandering off.
  "staySeconds": 15,
  // How tall a visitor is, in percent of the picture.
  "size": 8,

  // The friendly wild animals, picked at random. The pictures are the girls' pet
  // drawings; animals with only an emoji aren't drawn yet.
  "animals": [
    { "name": "Capybara",   "picture": "pet_capybara",      "says": "The capybara flops down next to you. So relaxed!" },
    { "name": "Mouse",      "picture": "pet_mouse",         "says": "The mouse sniffs your shoe and squeaks hello." },
    { "name": "Gray Owl",   "picture": "pet_owl_gray",      "says": "The owl hoots softly and ruffles its feathers." },
    { "name": "Orange Cat", "picture": "pet_cat_orange",    "says": "The cat rubs against your leg and purrs." },
    { "name": "Black Cat",  "picture": "pet_cat_black",     "says": "The black cat blinks slowly at you. That means it likes you!" },
    { "name": "Turtle",     "picture": "pet_turtle_little", "says": "The little turtle pokes its head out to say hi." },
    { "name": "Bunny",      "emoji": "🐰", "says": "The bunny wiggles its nose and hops in a circle." },
    { "name": "Fox",        "emoji": "🦊", "says": "The fox swishes its fluffy tail. It wants to be friends!" },
    { "name": "Deer",       "emoji": "🦌", "says": "The deer bows its head so you can pat it." },
    { "name": "Hedgehog",   "emoji": "🦔", "says": "The hedgehog curls up, then peeks out and snuffles." },
    { "name": "Squirrel",   "emoji": "🐿️", "says": "The squirrel chatters and shows you its acorn." }
  ],

  "words": {
    "waiting": "🌸 You wait quietly at the Meeting Place. Friendly animals come by to say hello.",
    "here": "Someone has come to visit: the NAME! Click it to say hello.",
    "bye": "The NAME wanders back into the flowers.",
    "picnic": "🧺 You sit down on the picnic blanket. What would you like to eat?",
    "nothing": "You don't have any food with you. Buy some at a shop, or pick fruit in the Fruit Orchard, then come back for a picnic!"
  }
};
