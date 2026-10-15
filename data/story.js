// The storyline (Scott, 2026-10-15): the Head Witch and the Head Wizard tell
// you what's going on. More story moments can be added here later.
//
// welcome   what you hear when you start a new game, one page at a time.
//           A witch hears it from the Head Witch, a wizard from the Head
//           Wizard (the guides are in data/adventures.js).
//           In the words: NAME = the player's name, KIND = "witch" or
//           "wizard". WIT means Witch or Wizard In Training.
//           The first four pages are Scott's; the last two (where to go
//           first) are Claude's.
GAME_DATA.story = {
  "welcome": {
    "title": "Welcome to Wizard School!",
    "pages": [
      "Welcome, NAME! From today you are a KIND in training: a WIT, for Witch or Wizard In Training.",
      "Your mission: learn skills, complete adventures and work your way up through the Levels.",
      "As a budding WIT you've been given a Scholarship to get you started. It gives you one FREE item from every aisle of the Campus Store, here in the Village.",
      "But the Scholarship won't last forever. Soon you'll need to earn your own gems, find food when you get hungry and collect other valuable things.",
      "Fishing at the Lake is the best way to earn gems. Learn skills at the Wizard School, and keep your things safe at Home.",
      "When an adventure is ready for you, I'll pop out and tell you about it. Good luck, NAME!"
    ],
    "done": "✨ Let's go!"
  }
};
