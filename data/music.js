// Music (Scott, 2026-10-12): the piano in the Disco Dance Hall. Playing the
// piano is a Skill: learn it with Piano Lessons in the Music Classroom at the
// Wizard School (the rehearsal studio, where you can also practise), then
// play a song on the piano in the Disco Dance Hall and everyone dances under
// the disco ball. Skills count toward the next Level (data/levels.js).
//
//   skill     the skill's name in your list of skills (player.skills)
//   keys      the piano keys: a note name, how high it sounds (hertz) and a colour.
//             These five notes always sound nice together, whatever you play.
//   lessons   how many notes each lesson's tune has: listen, then play it back
//             (Claude's idea, Scott said to suggest a way to learn)
//   songs     tunes the piano can play by itself: a name and the keys to play
//             (key numbers, 0 = the first key). Stand-ins until the family
//             records real songs (Scott, 2026-10-13): Song 1 is "Mary Had a
//             Little Lamb", Song 2 "Hot Cross Buns", Song 3 a little tune Claude made up.
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
  "songs": [
    { "name": "Song 1", "keys": [2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 3, 3, 2, 1, 0, 1, 2, 2, 2, 2, 1, 1, 2, 1, 0] },
    { "name": "Song 2", "keys": [2, 1, 0, 2, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 1, 0] },
    { "name": "Song 3", "keys": [0, 2, 3, 4, 3, 2, 1, 0, 2, 3, 5, 4, 3, 2, 3, 1, 0] }
  ],
  "ball": [79, 30],
  "dancers": [
    { "emoji": "💃", "x": 62, "y": 70 }, { "emoji": "🕺", "x": 74, "y": 62 },
    { "emoji": "💃", "x": 86, "y": 66 }, { "emoji": "🕺", "x": 70, "y": 84 },
    { "emoji": "🧚", "x": 82, "y": 82 }, { "emoji": "💃", "x": 93, "y": 80 }
  ],
  "danceSeconds": 4
};
