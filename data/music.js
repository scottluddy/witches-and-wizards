// Music (Scott, 2026-10-12): the piano in the Disco Dance Hall. Playing the
// piano is a Skill: learn it with piano lessons at the Wizard School, then
// play the piano in the Disco Dance Hall and everyone dances under the disco
// ball. Skills count toward the next Level (data/levels.js).
//
//   skill     the skill's name in your list of skills (player.skills)
//   keys      the piano keys: a note name, how high it sounds (hertz) and a colour.
//             These five notes always sound nice together, whatever you play.
//   lessons   how many notes each lesson's tune has: listen, then play it back
//             (Claude's idea, Scott said to suggest a way to learn)
//   song      a tune the piano can play by itself (key numbers, 0 = the first key)
//   ball      where the disco ball is in the picture (x, y percent)
//   dancers   who dances, and where they stand (x, y percent) under the ball
//   danceSeconds  dancing keeps going this long after the last note
GAME_DATA.music = {
  "skill": "piano",
  "keys": [
    { "note": "C", "hertz": 261.6, "colour": "#e8545a" },
    { "note": "D", "hertz": 293.7, "colour": "#f39c3d" },
    { "note": "E", "hertz": 329.6, "colour": "#f5d04a" },
    { "note": "G", "hertz": 392.0, "colour": "#5cbf6a" },
    { "note": "A", "hertz": 440.0, "colour": "#4a90e2" },
    { "note": "C", "hertz": 523.3, "colour": "#9b6ad6" }
  ],
  "lessons": [3, 4, 5],
  "song": [2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4, 2, 1, 0, 1, 2, 2, 2, 2, 1, 1, 2, 1, 0],
  "ball": [49, 17],
  "dancers": [
    { "emoji": "💃", "x": 38, "y": 52 }, { "emoji": "🕺", "x": 50, "y": 46 },
    { "emoji": "💃", "x": 62, "y": 54 }, { "emoji": "🕺", "x": 44, "y": 66 },
    { "emoji": "🧚", "x": 58, "y": 68 }, { "emoji": "💃", "x": 72, "y": 64 }
  ],
  "danceSeconds": 4
};
