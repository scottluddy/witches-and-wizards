// Next steps, shown in the catalog only (the game doesn't read this file).
// A short to-do list for the designers: things to answer and things to think
// about. What still needs drawing is worked out by the catalog itself, from
// the pictures that are still placeholders.
//
//   text   the question or idea
//   who    who it's for: "Girls" (design and drawing) or "Scott"
//   note   optional: why it matters, or Claude's suggestion
// Cross a line off by deleting it once it's decided (and say what was decided
// in CLAUDE.md, so the game remembers).
GAME_DATA.nextSteps = {
  "answer": [
    { "text": "What do potions, wands and pets actually do once you have them?", "who": "Girls",
      "note": "Right now they just sit in the backpack. Even one thing each (a Speed Potion makes you walk faster for a minute) would make buying them matter." },
    { "text": "What powers should each new Level give?", "who": "Girls",
      "note": "A sample plan is built: 3 Adventure Points, Chore Points and Bonding Points, 1 Skill, plus some gems. For now each Level only makes you 5% luckier. Ideas: walk farther before getting hungry, a cheaper pickaxe, a new place that opens at Level 3." },
    { "text": "What other ways can you bond with your pet?", "who": "Girls",
      "note": "So far: a bath in the tub at Home, and a cuddle on the big sofa in the Cozy Lounge. Scott's idea: walk or train your pet in the Meadows (walk a dog, falconry with a hawk). Other ideas: feed it, play with it." },
    { "text": "What do you learn in each Wizard School classroom?", "who": "Girls",
      "note": "The school has 9 classrooms (the 9-box drawing; the 25-box one is saved in case we need more). The Music Classroom has piano lessons and the Sports Classroom leads to the Stadium (archery and soccer). The other 7 are placeholders: Magic, Potions, Flying, Aquatic, Animal Care, Art and Cooking (Scott named Magic, Sports and Aquatic; Claude picked the rest). Each new Skill helps with going up a Level. Draw a classroom to give it a picture." },
    { "text": "Record the piano songs", "who": "Scott",
      "note": "The Disco Dance Hall piano plays Song 1, Song 2 and Song 3. For now they're simple tunes Claude added (Mary Had a Little Lamb, Hot Cross Buns, and a made-up one) in data/music.js." },
    { "text": "What other Skills are there?", "who": "Girls",
      "note": "Each new Level needs 1 more Skill. There are four so far: the Seeing Spell, the piano, archery and soccer, so after Level 5 you can't go up until there are more." },
    { "text": "What do you do at each new Meadows place?", "who": "Girls",
      "note": "The Meadows map has the Poppy Patch, Pet Training Field, Rosy Hills, Stream, Beehive and Butterfly Garden. They're spots on the map with placeholder pictures. The Beehive works (honey and bees). Ideas for the others: train or walk your pet (Pet Training Field), pick poppies (Poppy Patch), spot butterflies (Butterfly Garden). Draw the inside of each one too." },
    { "text": "Draw the Beehive", "who": "Girls",
      "note": "The inside of the Beehive is a placeholder. Draw the hive and the bees! Honey and a honey pot drawing would be nice too." },
    { "text": "Should honey sell for gems, or be used for something?", "who": "Scott",
      "note": "For now honey is just healthy food (1 hunger point) and can't be sold. The Healing Potion (Trading Post) heals a bee sting; Claude's guess is 10 minutes to heal on its own." },
    { "text": "Draw the Sports Classroom", "who": "Girls",
      "note": "It has a placeholder picture with one spot that leads out to the Stadium." },
    { "text": "Is finding the Pond House an adventure?", "who": "Scott",
      "note": "The Pixie, the Finding Potion, the troll's riddle and the Pond House don't give an Adventure Point yet. The troll's 8 riddles are Claude's (data/pixie.js)." },
    { "text": "Which things should stack?", "who": "Scott",
      "note": "Food, drinks and bait: you can have up to 3 of each, and a shop has 3 and puts one back every 3 minutes (data/supplies.js). Everything else, potions too, is one of each until it's used up or sold." },
    { "text": "What's on the other floors of the Disco Dance Hall?", "who": "Girls",
      "note": "The first drawing had a list of Floors 1 to 6. The Disco Dance Hall now uses the dance floor with a piano from the store page; the first drawing is the Music Classroom. One idea for another floor: a concert stage where you play for a crowd and get tips." },
    { "text": "What do the beluga, jellyfish and capybara cost?", "who": "Girls",
      "note": "Claude guessed 8, 5 and 6 gems (Lakeside Store, Floor 3). Write prices on a drawing to change them." },
    { "text": "Lakeside Store: what are the two things on the shelf above the sand dollars?", "who": "Girls",
      "note": "Claude called them Bait Worm (1 gem) and Bait Jar (2 gems)." },
    { "text": "Cafe menu: what is number 6, and what does the pizza cost?", "who": "Girls",
      "note": "Claude read number 6 as Salmon (7 gems) and the pizza as 4 gems." },
    { "text": "What do the raft, the boards and the store's fishing rods do?", "who": "Girls",
      "note": "Ideas: the raft or a board takes you to Tiny Island; your own fishing rod lets you fish anywhere on the shore." },
    { "text": "What else are Sashimi Grade fish good for?", "who": "Girls",
      "note": "Right now they just fill you up more. Maybe pets love them, or a spell needs one." },
    { "text": "What are Chore Points for?", "who": "Girls",
      "note": "They count toward the next Level now. They could also buy something at Home." },
    { "text": "What happens with the Turtle Egg? Does it hatch?", "who": "Girls" },
    { "text": "What other fruit grows in the Fruit Orchard, and what does the Treehouse's fruit cooler do?", "who": "Girls" },
    { "text": "Where should Ski down on Windy Peak take you?", "who": "Scott",
      "note": "For now it goes to the Snowy Hut. Maybe a ski run that ends at the Ski Reserve?" },
    { "text": "Which spells use pearls?", "who": "Girls",
      "note": "Pearls from the Pearl Cave go in the bucket and are spell ingredients, but no spell needs them yet." },
    { "text": "What can you do at the Fish Hut and with the Crafting Cabin's supplies?", "who": "Girls",
      "note": "They have pictures but nothing to click yet." }
  ],
  "consider": [
    { "text": "Hunger slows you down, but being very hungry doesn't stop anything.", "who": "Girls",
      "note": "Maybe at 10 you can't mine or fish until you eat something." },
    { "text": "Saved games live in one browser only.", "who": "Scott",
      "note": "Playing on another computer, or clearing the browser, starts over. Claude suggested a \"save code\" you can copy and paste into another computer (no server needed). Playing together in one world from different computers would need a small server; ideas for that are in the thread." },
    { "text": "The Meadows map and the Unicorn Meadow still need drawings.", "who": "Girls" },
    { "text": "The bath tub at Home is drawn by the computer.", "who": "Girls",
      "note": "Draw your own and save it as art/raw/bath_tub.jpg; the game will use it instead." }
  ]
};
