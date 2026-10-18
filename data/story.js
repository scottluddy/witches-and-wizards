// The storyline (Scott, 2026-10-15): the Head Witch and the Head Wizard tell
// you what's going on. More story moments can be added here later.
//
// welcome   what you hear when you start a new game, one page at a time,
//           right after choosing your name, Witch or Wizard, and character.
//           A witch hears it from the Head Witch, a wizard from the Head
//           Wizard (the guides are in data/adventures.js).
//           Short on purpose (Scott, 2026-10-18): kids don't want to read
//           much, so just the big ideas; they find the rest by playing.
//           In the words: NAME = the player's name.
GAME_DATA.story = {
  "welcome": {
    "pages": [
      { "title": "Your Mission", "words": "Complete Adventures. Learn Skills. Level Up!" },
      { "title": "Your Scholarship", "words": "Get free things at the Campus Store in the Village." },
      { "title": "Look Around", "words": "Find things here and there. When I pop out, an adventure is waiting!" }
    ],
    "done": "✨ Let's go, NAME!"
  }
};
