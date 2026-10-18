// Skills (Scott, 2026-10-13): things you learn at the Wizard School, like
// archery, soccer and the piano. Each test you pass raises that skill one
// Level, and each Level's test is a little harder (the numbers for each
// sport are in data/sports.js, for the piano in data/music.js). Skills have
// different numbers of Levels ("levels"); the top Level means mastered.
//
// After passing, you have to wait before the next test, so a skill can't be
// learned all at once: "waitMinutes" goes from "from" (after Level 1) up to
// "to" (after the Level before the top). While you wait, the test is greyed out.
//
// Your Skills total (🎓 in the top bar) adds up all your skill Levels and
// spells. Going up a Level needs 3 more of them (data/levels.js): 3 Levels
// of one skill, or 1 Level each of three skills (Scott, 2026-10-13).
//
// A general rule for the game: any spot can say
//   "needsSkill": { "skill": "piano", "level": 3 }
// and then it stays locked (greyed out) until you reach that Level of that
// skill. Nothing uses it yet: we decide as we go (Scott).
//
//   list    each skill: its id, its name on screen, an emoji and how many Levels it has
GAME_DATA.skills = {
  "waitMinutes": { "from": 3, "to": 5 },
  "list": [
    { "id": "archery", "name": "Archery", "emoji": "🏹", "levels": 10 },
    { "id": "soccer",  "name": "Soccer",  "emoji": "⚽", "levels": 10 },
    { "id": "piano",   "name": "Piano",   "emoji": "🎹", "levels": 5 },
    { "id": "art",     "name": "Art",     "emoji": "🎨", "levels": 5 }  // one Level per easel drawing (data/art.js)
  ]
};
