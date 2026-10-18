// The Art Classroom (Scott, 2026-10-18): copy the drawing on the easel onto
// the drawing board. Pick a paintbrush, draw with the mouse, then press
// ✅ I'm done!. A good enough copy passes the next Art Level (js/skills.js)
// and the next drawing goes up on the easel. The rules are in data/art.js.

let artRoom = null; // while you're in the classroom: { brush (its number), painting (true while the mouse is down), last [x, y] }

const ART_GRID = 20; // copies are checked on a 20 × 20 grid of little squares, so a wobbly line still counts

function isArtClass(place) {
  return place.id === GAME_DATA.artClass.place;
}

function artSay(message) {
  document.getElementById("place-description").textContent = message;
}

// The drawing on the easel: the one for your next Art Level (the last one once mastered).
function easelDrawing() {
  const list = GAME_DATA.artClass.drawings;
  return list[Math.min(skillLevel("art"), list.length - 1)];
}

// A [left, top, right, bottom] box, as CSS.
function placeBox(element, box) {
  element.style.left = box[0] + "%";
  element.style.top = box[1] + "%";
  element.style.width = (box[2] - box[0]) + "%";
  element.style.height = (box[3] - box[1]) + "%";
}

// ---------------------------------------------------------------- the classroom

// Called by showPlace: set up the easel, the board and the brushes, or tidy them away.
function showArtClass(place) {
  const box = document.getElementById("place-art");
  box.innerHTML = "";
  box.hidden = !isArtClass(place);
  artRoom = null;
  if (box.hidden) return;
  const rules = GAME_DATA.artClass;
  artRoom = { brush: 1, painting: false, last: null };

  const easel = document.createElement("img");
  easel.id = "art-easel";
  easel.alt = "";
  easel.draggable = false;
  placeBox(easel, rules.easel);

  // The board's paper: 900 × 400 dots, stretched over the board.
  const board = document.createElement("canvas");
  board.id = "art-board";
  board.width = 900;
  board.height = 400;
  placeBox(board, rules.board);
  board.addEventListener("pointerdown", startPainting);
  board.addEventListener("pointermove", paint);
  board.addEventListener("pointerup", stopPainting);
  board.addEventListener("pointercancel", stopPainting);
  board.addEventListener("click", function (event) { event.stopPropagation(); });

  box.append(easel, board);
  rules.brushes.forEach(function (brush, number) { box.appendChild(brushButton(brush, number)); });
  showEasel();
  pickBrush(artRoom.brush);
  artSay(isMastered("art") ? rules.words.mastered : rules.words.start);
}

function showEasel() {
  const drawing = easelDrawing();
  const easel = document.getElementById("art-easel");
  easel.src = picture(drawing.picture);
  easel.title = drawing.name;
}

// An invisible button over each drawn paintbrush.
function brushButton(brush, number) {
  const button = document.createElement("button");
  button.className = "art-brush";
  button.dataset.number = number;
  button.title = brush.name;
  button.style.left = brush.x + "%";
  button.style.top = brush.y + "%";
  button.style.setProperty("--paint", brush.colour || "#8c8c8c"); // the sponge glows grey
  button.innerHTML = '<span class="art-brush-name"></span>';
  button.querySelector(".art-brush-name").textContent = brush.name;
  button.addEventListener("click", function (event) {
    event.stopPropagation();
    pickBrush(number);
  });
  return button;
}

// The chosen brush lifts up a little and shows its name.
function pickBrush(number) {
  artRoom.brush = number;
  document.querySelectorAll(".art-brush").forEach(function (button) {
    button.classList.toggle("chosen", Number(button.dataset.number) === number);
  });
  document.getElementById("art-board").classList.toggle("erasing", !!GAME_DATA.artClass.brushes[number].eraser);
}

// ---------------------------------------------------------------- painting

// Where the mouse is, in the board's own dots.
function boardPoint(event) {
  const board = event.currentTarget;
  const box = board.getBoundingClientRect();
  return [(event.clientX - box.left) / box.width * board.width,
          (event.clientY - box.top) / box.height * board.height];
}

function startPainting(event) {
  event.preventDefault();
  event.currentTarget.setPointerCapture(event.pointerId);
  artRoom.painting = true;
  artRoom.last = boardPoint(event);
  paintLine(event.currentTarget, artRoom.last, artRoom.last); // a dot, for a single click
}

function paint(event) {
  if (!artRoom || !artRoom.painting) return;
  const here = boardPoint(event);
  paintLine(event.currentTarget, artRoom.last, here);
  artRoom.last = here;
}

function stopPainting() {
  if (artRoom) artRoom.painting = false;
}

// A thick round line in the brush's colour. The sponge rubs paint out instead.
function paintLine(board, from, to) {
  const brush = GAME_DATA.artClass.brushes[artRoom.brush];
  const pen = board.getContext("2d");
  pen.globalCompositeOperation = brush.eraser ? "destination-out" : "source-over";
  pen.strokeStyle = brush.colour || "#000";
  pen.lineWidth = board.height * GAME_DATA.artClass.brushSize / 100 * (brush.eraser ? 3 : 1);
  pen.lineCap = "round";
  pen.lineJoin = "round";
  pen.beginPath();
  pen.moveTo(from[0], from[1]);
  pen.lineTo(to[0], to[1]);
  pen.stroke();
}

// 🧽 Start over: wipe the board clean.
function clearArtBoard() {
  const board = document.getElementById("art-board");
  if (!board) return;
  board.getContext("2d").clearRect(0, 0, board.width, board.height);
  artSay(GAME_DATA.artClass.words.start);
}

// ---------------------------------------------------------------- checking a copy

// What colour family a dot is: "black", "red", "pink"... or null for paper
// (white, or see-through). Crayon colours are never exactly the brush colours,
// so it goes by the colour's hue (where it sits on the colour wheel), and the
// numbers were tuned on the girls' five drawings. tools/process_art.py does the
// same for the easel's drawings (data/art_grids.js): change both together.
function colourFamily(r, g, b, a) {
  if (a < 200) return null;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const value = max / 255;
  const sat = max ? (max - min) / max : 0;
  if (value > 0.84 && sat < 0.16) return null; // white paper
  if (value < 0.3 || (sat < 0.25 && value < 0.67)) return "black"; // pencil lines
  if (sat < 0.25) return null; // pale smudges
  let hue;
  if (max === r) hue = 60 * (((g - b) / (max - min) + 6) % 6);
  else if (max === g) hue = 60 * ((b - r) / (max - min) + 2);
  else hue = 60 * ((r - g) / (max - min) + 4);
  if (hue < 15 || hue >= 338) return "red";
  if (hue < 40) return "orange";
  if (hue < 75) return hue >= 55 && value < 0.5 ? "green" : "yellow"; // dark olive is green (the pine tree)
  if (hue < 185) return "green";
  if (hue < 228) return "blue";
  if (hue < 290) return "purple";
  return "pink";
}

// Turn your painting into a 20 × 20 grid. Only the part with paint on it counts,
// stretched to fill the grid (keeping its shape), so it doesn't matter where
// on the board you drew or how big. Each square that's painted lists its
// main colours. Returns null if there's no paint at all.
function paintGrid(source, width, height) {
  const sheet = document.createElement("canvas");
  sheet.width = width;
  sheet.height = height;
  const pen = sheet.getContext("2d");
  pen.drawImage(source, 0, 0, width, height);
  const dots = pen.getImageData(0, 0, width, height).data;

  // Every painted dot, and the box around them all.
  const painted = [];
  let left = width, top = height, right = 0, bottom = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const family = colourFamily(dots[i], dots[i + 1], dots[i + 2], dots[i + 3]);
      if (!family) continue;
      painted.push([x, y, family]);
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  if (painted.length === 0) return null;

  // Squeeze the box into the grid, in the middle.
  const size = Math.max(right - left, bottom - top) + 1;
  const scale = ART_GRID / size;
  const shiftX = (ART_GRID - (right - left + 1) * scale) / 2;
  const shiftY = (ART_GRID - (bottom - top + 1) * scale) / 2;
  const squares = [];
  for (let i = 0; i < ART_GRID * ART_GRID; i++) squares.push({ count: 0, families: {} });
  painted.forEach(function (dot) {
    const col = Math.min(ART_GRID - 1, Math.floor((dot[0] - left) * scale + shiftX));
    const row = Math.min(ART_GRID - 1, Math.floor((dot[1] - top) * scale + shiftY));
    const square = squares[row * ART_GRID + col];
    square.count += 1;
    square.families[dot[2]] = (square.families[dot[2]] || 0) + 1;
  });

  // A square counts as painted if at least an eighth of it is painted; its
  // colours are the ones making up at least a fifth of its paint.
  const full = Math.pow(size / ART_GRID, 2);
  return squares.map(function (square) {
    if (square.count < Math.max(1, full / 8)) return null;
    return Object.keys(square.families).filter(function (f) { return square.families[f] >= square.count / 5; });
  });
}

// The squares around a square (and itself), as their numbers in the grid.
function nearbySquares(n) {
  const row = Math.floor(n / ART_GRID), col = n % ART_GRID;
  const result = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < ART_GRID && c >= 0 && c < ART_GRID) result.push(r * ART_GRID + c);
    }
  }
  return result;
}

// How close is the copy? Three numbers from 0 to 1:
//   shape    how much of the drawing has paint on or next to it
//   tidy     how much of the paint is on the drawing
//   colours  of the drawing you covered, how much has a right colour nearby
function compareDrawings(drawing, copy) {
  let drawingSquares = 0, covered = 0, rightColour = 0, copySquares = 0, tidy = 0;
  drawing.forEach(function (colours, n) {
    if (!colours) return;
    drawingSquares += 1;
    const near = nearbySquares(n).filter(function (m) { return copy[m]; });
    if (near.length === 0) return;
    covered += 1;
    const match = near.some(function (m) {
      return copy[m].some(function (c) { return colours.indexOf(c) !== -1; });
    });
    if (match) rightColour += 1;
  });
  copy.forEach(function (colours, n) {
    if (!colours) return;
    copySquares += 1;
    if (drawing[n]) tidy += 1; // right on the drawing (next to it isn't enough, or a big scribble would count)
  });
  return {
    shape: covered / drawingSquares,
    tidy: copySquares ? tidy / copySquares : 0,
    colours: covered ? rightColour / covered : 0
  };
}

// ✅ I'm done!: check the copy against the easel.
function checkArtDrawing() {
  const rules = GAME_DATA.artClass;
  const board = document.getElementById("art-board");
  if (!board) return;
  const copy = paintGrid(board, 300, Math.round(300 * board.height / board.width));
  if (!copy) return artSay(rules.words.empty);
  // The easel drawing's grid was worked out by the art script (data/art_grids.js):
  // a browser won't let the game read a picture's colours when index.html is
  // opened by double-clicking.
  const drawing = GAME_DATA.artGrids[easelDrawing().picture];
  const score = compareDrawings(drawing, copy);
  const scores = "Shape " + artPercent(score.shape) + " · Tidy " + artPercent(score.tidy) + " · Colours " + artPercent(score.colours) + ". ";
  const pass = Object.assign({}, rules.pass, easelDrawing().pass); // a drawing can need a tidier copy (data/art.js)
  const passed = score.shape >= pass.shape && score.tidy >= pass.tidy && score.colours >= pass.colours;

  if (isMastered("art")) return artSay(scores + rules.words.mastered);
  if (!passed) return artSay(scores + rules.words.again.replace("TIP", artTip(score, pass)));
  const wait = skillWaitLeft("art");
  if (wait) return artSay(scores + "🌟 " + rules.words.practice + " ⏳ Your next Art test is ready in " + minutesAndSeconds(wait) + ".");

  const level = gainSkillLevel("art"); // js/skills.js
  let message = scores + rules.words.passed.replace("LEVEL", level);
  if (isMastered("art")) message += " " + rules.words.mastered;
  else message += " " + rules.words.next.replace("NAME", easelDrawing().name) + nextTestText("art");
  showEasel();
  board.getContext("2d").clearRect(0, 0, board.width, board.height);
  artSay(message);
}

function artPercent(share) {
  return Math.round(share * 100) + "%";
}

// The tip for whichever part was furthest from passing.
function artTip(score, pass) {
  const short = ["shape", "tidy", "colours"].sort(function (a, b) {
    return (score[a] - pass[a]) - (score[b] - pass[b]);
  })[0];
  return GAME_DATA.artClass.words["tip" + short.charAt(0).toUpperCase() + short.slice(1)];
}
