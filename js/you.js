// Your own character in a place (Scott, 2026-10-17: show your character
// wherever we can; 2026-10-18: drag them around the room, and sit on any couch).
//
// You stand just inside every place you walk into (data/standing.js). Drag
// yourself anywhere in the picture: you get smaller the further back you go,
// like in a real room. Drop yourself on a couch or chair, or click it, and you
// sit down on it, sized to fit. Seats are furniture pieces with "seat" in
// data/furniture.js (they can be dragged around, and you move with them) and
// spots with "sitAt" in data/places.js. You stand up when you drag yourself off
// a seat or leave the place. In the Snowy Hut you can then pull the blanket
// over you (js/windy.js).

let youNow = { el: null, on: null, covered: false }; // on: { piece } or { spot } while sitting
let youDrag = null; // while you're being dragged: { startX, startY, moved }

// You, standing just inside the place, in the corner unless data/standing.js
// says somewhere else. Nobody stands on shelves or in the places listed in "skip".
function standYouIn(place) {
  const box = document.getElementById("place-you");
  box.innerHTML = "";
  youNow = { el: null, on: null, covered: false };
  const standing = GAME_DATA.standing;
  if (place.shelf || standing.skip.includes(place.id)) return;
  const spot = standing.places[place.id] || standing.where;
  const you = makeYou("standing-you");
  placeYou(spot.x, spot.y, spot.size || standing.where.size);
  box.appendChild(you);
}

// Sit down at seat (x, y = your feet, size = your height, all percent of the
// picture). "on" says what you're sitting on: { piece: id } or { spot: id }.
function sitYouAt(seat, on) {
  const box = document.getElementById("place-you");
  const you = youNow.el && youNow.el.isConnected ? youNow.el : makeYou("");
  you.className = "sitting-you";
  if (!you.isConnected) box.appendChild(you);
  youNow.on = on || {};
  placeYou(seat.x, seat.y, (seat.size || 30) * GAME_DATA.standing.movedSize); // smaller once you've moved, below
}

// Sit on a piece of furniture, wherever it stands now (js/furniture.js).
function sitOnPiece(piece) {
  if (seatTaken(piece)) {
    document.getElementById("place-description").textContent =
      GAME_DATA.standing.words.taken.replace("SEAT", piece.name);
    return;
  }
  seatYouOn(piece);
  document.getElementById("place-description").textContent =
    GAME_DATA.standing.words.sat.replace("SEAT", piece.name);
  showWindy(findPlace(player.at)); // the Snowy Hut's blanket can cover you now, the little WIT shuffles over (js/windy.js)
}

// Put you on the piece: in the middle, or on the left if someone else sits there too.
function seatYouOn(piece) {
  sitYouAt(seatPlace(piece, 0, othersSittingOn(piece.id) > 0), { piece: piece.id });
}

// Where someone sits on a piece of furniture (Scott, 2026-10-18): one sitter
// sits in the middle; two on a couch sit a little apart, place 0 on the left
// and place 1 on the right. "seat" in data/furniture.js: x, y are percent
// across and down the piece, size is a sitter's height in percent of the
// picture (before it's halved, see sitYouAt), "sitters" how many fit (1 if not given).
function seatPlace(piece, place, sharing) {
  const rect = pieceRect(piece);
  const shift = sharing ? (place === 0 ? -1 : 1) * GAME_DATA.standing.shareShift : 0;
  return { x: rect[0] + rect[2] * (piece.seat.x + shift) / 100,
           y: rect[1] + rect[3] * piece.seat.y / 100,
           size: piece.seat.size };
}

// Is there no room left for you? (the little WIT in the Snowy Hut, js/windy.js)
function seatTaken(piece) {
  return othersSittingOn(piece.id) >= (piece.seat.sitters || 1);
}

// You or someone else sat down or got up: you shuffle to the middle, or over to make room.
function youFollowFurniture(piece) {
  if (youNow.on && youNow.on.piece === piece.id && piece.seat) seatYouOn(piece);
}

function youSitting() {
  return !!(youNow.el && youNow.on);
}

// Stand up (dragging yourself off a seat): the blanket comes off too.
function standYouUp() {
  if (!youNow.on) return;
  youNow.on = null;
  youNow.covered = false;
  youNow.el.className = "standing-you moved";
  museumSeated = false; // eating in the Museum needs you sitting (js/museum.js)
  showWindy(findPlace(player.at)); // the blanket goes back on the couch (js/windy.js)
}

function makeYou(className) {
  const you = document.createElement("img");
  you.className = className;
  you.src = characterPicture(findCharacter(player.characterId));
  you.alt = "You";
  you.title = GAME_DATA.standing.words.title;
  you.draggable = false; // we do our own dragging, below
  you.addEventListener("pointerdown", startDragYou);
  you.addEventListener("pointermove", dragYou);
  you.addEventListener("pointerup", dropYou);
  // Clicking yourself does nothing, and mustn't dig the cave wall or search for pearls underneath.
  you.addEventListener("click", function (event) { event.stopPropagation(); });
  youNow.el = you;
  return you;
}

function placeYou(x, y, size) {
  const you = youNow.el;
  you.style.left = x + "%";
  you.style.top = y + "%";
  you.style.height = size + "%";
}

// ---------------------------------------------------------------- dragging

// Where the mouse is, in percent of the picture.
function pointInPicture(event) {
  const pic = document.getElementById("place-zoom").getBoundingClientRect();
  return { x: (event.clientX - pic.left) / pic.width * 100,
           y: (event.clientY - pic.top) / pic.height * 100 };
}

function startDragYou(event) {
  event.preventDefault();
  event.stopPropagation();
  youDrag = { startX: event.clientX, startY: event.clientY, moved: false };
  youNow.el.setPointerCapture(event.pointerId);
}

function dragYou(event) {
  if (!youDrag) return;
  if (!youDrag.moved) {
    if (Math.hypot(event.clientX - youDrag.startX, event.clientY - youDrag.startY) < DRAG_START) return; // js/furniture.js
    youDrag.moved = true;
    standYouUp();
    youNow.el.classList.add("dragging", "moved"); // "moved": no walking-in animation again
  }
  // You hang from the mouse by your middle (you shrink as you're picked up,
  // so holding on where you were grabbed would leave you far from the mouse).
  const at = pointInPicture(event);
  standAt(at.x, at.y + movedHeight(at.y) / 2);
}

function dropYou(event) {
  if (!youDrag) return;
  const moved = youDrag.moved;
  youDrag = null;
  youNow.el.classList.remove("dragging");
  if (!moved) return; // just a click
  // Your feet, and your middle (where people tend to aim when they drop you on a sofa).
  const feet = { x: parseFloat(youNow.el.style.left), y: parseFloat(youNow.el.style.top) };
  const middle = { x: feet.x, y: feet.y - parseFloat(youNow.el.style.height) / 2 };
  const piece = seatPieceAt(feet) || seatPieceAt(middle);
  if (piece) return sitOnPiece(piece);
  const spot = seatSpotAt(feet) || seatSpotAt(middle);
  if (spot) return openSpot(spot.id); // the same as clicking it: sit down, then cuddle, order... (js/world.js)
}

// Stand with your feet at x, y. Further back (higher up the picture) you're
// smaller, down to about half size at the very top. You always stay inside the picture.
// Scott, 2026-10-18: once you're moved around (or sit down) you're about half
// the size you walk in at, so you don't cover up the girls' drawings.
function standAt(x, y) {
  y = Math.min(Math.max(y, movedHeight(y) + 1), 99);
  placeYou(Math.min(Math.max(x, 4), 96), y, movedHeight(y));
}

// How tall you are, once moved, with your feet at y.
function movedHeight(y) {
  const standing = GAME_DATA.standing;
  const full = (standing.places[player.at] || {}).size || standing.where.size;
  return full * standing.movedSize * youDepth(y);
}

function youDepth(y) {
  const smallest = GAME_DATA.standing.smallest;
  return smallest + (1 - smallest) * Math.min(Math.max(y, 0), 100) / 100;
}

// A furniture seat dropped on (data/furniture.js "seat").
function seatPieceAt(at) {
  return roomPieces(player.at).find(function (piece) {
    const r = pieceRect(piece);
    return piece.seat && at.x >= r[0] && at.x <= r[0] + r[2] && at.y >= r[1] && at.y <= r[1] + r[3] * 1.15;
  });
}

// A spot with "sitAt" dropped near: near where you'd sit, or on its label.
function seatSpotAt(at) {
  const near = GAME_DATA.standing.seatReach;
  return placesIn(player.at).find(function (spot) {
    if (!spot.sitAt || spot.side) return false;
    return Math.hypot(at.x - spot.sitAt.x, at.y - spot.sitAt.y) < near ||
      Math.hypot(at.x - spot.x, at.y - spot.y) < near;
  });
}
