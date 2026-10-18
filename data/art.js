// The Art Classroom in the Wizard School (Scott, 2026-10-18, the girls' drawing,
// photo art/raw/sheets/art_classroom.jpeg). The easel on the left shows a
// drawing; copy it onto the big drawing board with the paintbrushes. Each
// drawing you copy well enough is one Level of the Art skill (data/skills.js),
// then the next drawing goes up on the easel. Code in js/art.js.
//
//   place      the Art Classroom
//   drawings   the easel's drawings, in order: the first is the test for Level 1.
//              To add one, draw it, save it as art/raw/art_drawing_6.jpg, add a
//              line here, and raise Art's "levels" in data/skills.js to match.
//   easel      where the easel's paper is on the classroom picture: [left, top, right, bottom] percent
//   board      where you draw on the drawing board: [left, top, right, bottom] percent
//   brushes    each paintbrush on the drawing board: its colour, and x, y of its middle (percent).
//              "eraser" is the grey sponge, which rubs out.
//   brushSize  how thick the paint is (compared to the board's height, in percent)
//   pass       how close your copy must be to pass, from 0 to 1 (Claude's guesses, kept
//              gentle so a good try passes):
//                shape    how much of the drawing you covered
//                tidy     how much of your painting is where the drawing is
//                colours  how much of it is in the right colours
//              It doesn't matter where on the board you draw or how big: your
//              painting is stretched to the drawing's size before checking.
//              A drawing can have its own "pass": the Flower, Rainbow and Pine
//              Tree fill most of their square, so they need a tidier copy, or
//              colouring in a big box would pass.
GAME_DATA.artClass = {
  "place": "art_classroom",
  "drawings": [
    { "name": "Flower",    "picture": "art_drawing_1", "pass": { "tidy": 0.62 } },
    { "name": "Rainbow",   "picture": "art_drawing_2", "pass": { "tidy": 0.66 } },
    { "name": "Moon",      "picture": "art_drawing_3" },
    { "name": "Snowflake", "picture": "art_drawing_4" },
    { "name": "Pine Tree", "picture": "art_drawing_5", "pass": { "tidy": 0.58 } }
  ],
  "easel": [19.5, 17, 37.5, 48],
  "board": [51, 18, 94, 59],
  "brushes": [
    { "name": "Sponge", "eraser": true,  "x": 51.3, "y": 69 },
    { "name": "Pink",   "colour": "#e86fb0", "x": 57.3, "y": 73 },
    { "name": "Red",    "colour": "#dd2228", "x": 62.4, "y": 73 },
    { "name": "Orange", "colour": "#f0861c", "x": 65.5, "y": 73 },
    { "name": "Yellow", "colour": "#f2cf1d", "x": 68.9, "y": 73 },
    { "name": "Green",  "colour": "#4f9a2a", "x": 72.9, "y": 73 },
    { "name": "Blue",   "colour": "#4fb3e8", "x": 79.3, "y": 73 },
    { "name": "Purple", "colour": "#8a3fc0", "x": 83.6, "y": 73 },
    { "name": "Black",  "colour": "#2b2b2b", "x": 90.7, "y": 73 }
  ],
  "brushSize": 4,
  "pass": { "shape": 0.6, "tidy": 0.5, "colours": 0.5 },
  "words": {
    "start": "🎨 Copy the drawing on the easel onto the drawing board. Click a paintbrush to pick a colour, then draw with the mouse. Press ✅ I'm done! when it looks right.",
    "empty": "The drawing board is empty! Pick a paintbrush and draw first.",
    "passed": "🌟 Beautiful! You passed: Art Level LEVEL (it counts toward your Skills).",
    "next": "Next on the easel: the NAME.",
    "mastered": "⭐ You've mastered Art! Draw anything you like.",
    "practice": "That's a practice drawing.",
    "tipShape": "Try colouring in more of the drawing.",
    "tipTidy": "Try to keep your painting to the shape of the drawing.",
    "tipColours": "Try using the same colours as the easel.",
    "again": "Nearly! TIP Press 🧽 Start over to try again."
  }
};
