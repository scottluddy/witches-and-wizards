// Bonding with your pet (Scott, 2026-10-11): taking care of your pet earns
// Bonding Points, which count toward the next Level.
// Each animal has its own ways to bond (Scott, 2026-10-13):
//   owls        falconry lessons at the Pet Training Field; the snowy owl can also fly at Windy Peak
//   cats        cuddle on any couch or sofa, or play with yarn at Home
//   capybaras   a bath in the tub at Home
//   turtles     swimming at any water, with bonus points if a (very rare) turtle run happens
//   belugas     swim in the lake from the Dock or Pebble Beach
//   jellyfish   clean their tanks at the Fish Hut
//   any pet     rides the roller coaster in the Multi-House with you, and eats at the Museum's Tiny Hole
//   dogs and wolves         walks, runs and tricks at the Pet Training Field (no dogs yet!)
//
//   pets        the shop shelves pets come from (a pet elsewhere says "pet": true
//               in items.js, like the Lakeside Store's beluga)
//   notPets     things on those shelves that can't be cared for (an egg!)
//   animals     which pets are which animal
//   each way to bond:
//     points        Bonding Points for doing it once
//     everyMinutes  how long before the same pet can do it again (Claude's guess)
//     animals       which animals can do it
//     from          "backpack" = you bring the pet along; "home" = it can also be left at Home
//     the rest are the words in the pop-up (PET is swapped for the pet's name)
GAME_DATA.bonding = {
  "pets": ["Pet", "Trading Pets"],
  "notPets": ["pet_turtle_egg"],
  "animals": {
    "owl": ["pet_owl", "pet_owl_gray", "pet_owl_little", "pet_owl_orange"],
    "cat": ["pet_cat", "pet_cat_orange", "pet_cat_black"],
    "capybara": ["pet_capybara"],
    "turtle": ["pet_turtle", "pet_pond_turtle", "pet_turtle_trade", "pet_turtle_little"],
    "beluga": ["pet_beluga"],
    "jellyfish": ["pet_jellyfish"],
    "dog": [],
    "wolf": []
  },
  "bath": { "points": 1, "everyMinutes": 5, "animals": ["capybara"] },
  "cuddle": { "points": 1, "everyMinutes": 5, "animals": ["cat"] },
  "fly": { "points": 1, "everyMinutes": 5, "pets": ["pet_owl"] },
  // Any pet can ride the Multi-House roller coaster with you (data/coaster.js).
  "coaster": { "points": 1, "everyMinutes": 5 },

  "falconry": { "points": 1, "everyMinutes": 5, "animals": ["owl"], "from": "backpack",
    "title": "Falconry Lesson", "emoji": "🦉", "button": "🦉 Fly to your glove", "done": "🪶 Resting. Ready again in ",
    "ask": "Hold out your glove and call your owl. It flies a big loop over the field and lands back on your glove!",
    "noPets": "Falconry is for owls. Bring an owl in your backpack (the Campus Store and the Trading Post have them).",
    "thanks": "🦉 Your PET swoops over the field and lands right on your glove. Good bird!" },
  "yarn": { "points": 1, "everyMinutes": 5, "animals": ["cat"], "from": "home",
    "title": "Ball of Yarn", "emoji": "🧶", "button": "🧶 Play", "done": "😺 Tired out. Ready again in ",
    "ask": "Roll the ball of yarn and watch your cat pounce!",
    "noPets": "Cats love yarn! Bring a cat Home (the Campus Store and the Trading Post have them).",
    "thanks": "🧶 Your PET chases the yarn all over the room and gets tangled up. So silly!" },
  "swim": { "points": 1, "everyMinutes": 5, "animals": ["turtle"], "from": "backpack",
    "title": "Turtle Swim", "emoji": "🐢", "button": "🌊 Go swimming", "done": "💤 Drying off. Ready again in ",
    "ask": "Turtles love the water! Take your turtle for a swim.",
    "noPets": "Swimming is for turtles. Bring a turtle in your backpack (the Campus Store, the Trading Post and the Pond House have them).",
    "thanks": "🌊 You and your PET paddle around together. Splash!",
    "bonus": { "chance": 0.03, "points": 3, "emoji": "🐢🐢🐢",
      "says": "A TURTLE RUN! Baby turtles are hatching and racing to the water. You and your PET help them get there safely!" } },
  // Belugas swim in the lake, from the Dock or Pebble Beach (Scott, 2026-10-14: a tank doesn't make sense for a whale).
  "whale_swim": { "points": 1, "everyMinutes": 5, "animals": ["beluga"], "from": "backpack",
    "title": "Beluga Swim", "emoji": "🐋", "button": "🌊 Swim in the lake", "done": "💤 Resting. Ready again in ",
    "ask": "Belugas need lots of room! Let your beluga out into the lake for a swim.",
    "noPets": "The lake is big enough for a beluga whale! Bring one in your backpack (the Lakeside Store has one).",
    "thanks": "🐋 Your PET splashes out into the lake, swims big circles around you and sings a happy whale song!" },
  "tank": { "points": 1, "everyMinutes": 5, "animals": ["jellyfish"], "from": "backpack",
    "title": "Fish Tanks", "emoji": "🫧", "button": "🧽 Clean the tank", "done": "✨ Sparkling. Dirty again in ",
    "ask": "Your jellyfish needs a clean tank. Scrub, scrub!",
    "noPets": "These tanks are for jellyfish. Bring one in your backpack (the Lakeside Store has them).",
    "thanks": "🧽 The tank is sparkling clean and your PET swims happy circles." },
  // The Pet Food bowl in the Museum's Tiny Hole (Scott, 2026-10-15): any pet can eat.
  "pet_food": { "points": 1, "everyMinutes": 5, "from": "backpack",
    "title": "Pet Food", "emoji": "🥣", "button": "🥣 Feed", "done": "😋 Full. Hungry again in ",
    "ask": "A bowl of pet food! Feed your pet a snack.",
    "noPets": "Bring a pet in your backpack to feed it.",
    "thanks": "🥣 Your PET gobbles up the food. Yum!" },
  "dog_walk": { "points": 1, "everyMinutes": 5, "animals": ["dog", "wolf"], "from": "backpack",
    "title": "Walks and Tricks", "emoji": "🐕", "button": "🐕 Go for a walk", "done": "💤 Resting. Ready again in ",
    "ask": "Walk, run and learn tricks with your dog or wolf.",
    "noPets": "Coming soon: dogs and wolves who need walks, runs and to learn tricks! (No dogs or wolves in the game yet. Draw one!)",
    "thanks": "🐕 You and your PET go for a lovely walk." }
};
