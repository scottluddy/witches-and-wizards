// Skills (Scott, 2026-10-13): things you learn, like archery, soccer and the
// piano. The Wizard School is for learning: each test you pass there raises
// that skill one Level, from 1 up to "maxLevel". Each Level's test is a
// little harder (the numbers for each sport are in data/sports.js).
//
// After passing, you have to wait before the next test, so a skill can't be
// learned all at once: "waitMinutes" goes from "from" (after Level 1) up to
// "to" (after Level 9). While you wait, the sport is greyed out.
//
// A general rule for the game: any place or spot can say
//   "needsSkill": { "skill": "archery", "level": 3 }
// and then it stays locked until you reach that Level of that skill.
//
//   names   what each skill is called on screen
GAME_DATA.skills = {
  "maxLevel": 10,
  "waitMinutes": { "from": 3, "to": 5 },
  "names": { "archery": "Archery", "soccer": "Soccer", "piano": "Piano" }
};
