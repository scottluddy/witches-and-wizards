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
      "note": "A sample plan is built: 3 Adventure Points, Chore Points, fish and dances plus some gems. For now each Level only makes you 5% luckier. Ideas: walk farther before getting hungry, a cheaper pickaxe, a new place that opens at Level 3." },
    { "text": "What are Bonding Points, and how do you earn them?", "who": "Girls",
      "note": "Once they exist they can count toward the next Level too (data/levels.js)." },
    { "text": "What are Chore Points for?", "who": "Girls",
      "note": "They count toward the next Level now. They could also buy something at Home." },
    { "text": "What happens with the Turtle Egg? Does it hatch?", "who": "Girls" },
    { "text": "What other fruit grows in the Fruit Orchard, and what does the Treehouse's fruit cooler do?", "who": "Girls" },
    { "text": "What can you do at the Fish Hut, the Crafting Cabin's supplies and Pearl Waterfall?", "who": "Girls",
      "note": "They have pictures but nothing to click yet." }
  ],
  "consider": [
    { "text": "Hunger slows you down, but being very hungry doesn't stop anything.", "who": "Girls",
      "note": "Maybe at 10 you can't mine or fish until you eat something." },
    { "text": "Saved games live in one browser only.", "who": "Scott",
      "note": "Playing on another computer, or clearing the browser, starts over. Claude suggested a \"save code\" you can copy and paste into another computer (no server needed). Playing together in one world from different computers would need a small server; ideas for that are in the thread." },
    { "text": "The Meadows map and the Unicorn Meadow still need drawings.", "who": "Girls" }
  ]
};
