// Rearranging furniture: in a room with movable furniture (data/furniture.js),
// any piece can be dragged somewhere else (Scott, 2026-10-15: no Rearrange
// button). A drag only starts once the mouse moves a little, so a plain click
// still opens the cooler or chest at Home. Pieces aren't allowed to land on top of each other: if one
// is dropped on another, it slides to the nearest free spot. Where each piece
// stands is saved in player.furniture.

let dragging = null;     // the piece being held: { piece, el, offsetX, offsetY, from, startX, startY, moved }
let justDragged = false; // stops the click at the end of a drag from opening the cooler or chest
const DRAG_START = 6;    // pixels the mouse moves before a click becomes a drag

// The movable pieces in a place (only ones the art script has cut out).
function roomPieces(placeId) {
  const boxes = GAME_DATA.furnitureBoxes || {};
  return (GAME_DATA.furniture || []).filter(function (piece) {
    return piece.place === placeId && boxes[placeId + "/" + piece.id] && isDrawn("place_" + placeId);
  });
}

// The room picture without its furniture (the pieces are drawn on top of it).
function roomPicture(placeId) {
  return roomPieces(placeId).length ? "place_" + placeId + "_room" : "place_" + placeId;
}

// A piece's size, and where it stands now: [left, top, width, height] in percent.
function pieceRect(piece) {
  const box = GAME_DATA.furnitureBoxes[piece.place + "/" + piece.id];
  const saved = (player.furniture[piece.place] || {})[piece.id];
  const left = saved ? saved[0] : box[0];
  const top = saved ? saved[1] : box[1];
  return [left, top, box[2] - box[0], box[3] - box[1]];
}

function showFurniture(place) {
  const box = document.getElementById("place-furniture");
  const pieces = roomPieces(place.id);
  box.innerHTML = "";
  pieces.forEach(function (piece) {
    const img = document.createElement("img");
    img.className = "furniture";
    img.src = picture("furniture_" + piece.place + "_" + piece.id);
    img.alt = piece.name;
    img.title = piece.name;
    img.draggable = false; // we do our own dragging
    img.dataset.id = piece.id;
    placePiece(img, pieceRect(piece));
    img.addEventListener("pointerdown", function (event) { startDrag(event, piece, img); });
    if (piece.holds) {
      // The cooler and chest at Home open when clicked (js/storage.js).
      img.classList.add("holds");
      img.addEventListener("click", function () { if (!justDragged) openStorage(piece.holds); });
    }
    box.appendChild(img);
  });
}

function placePiece(el, rect) {
  el.style.left = rect[0] + "%";
  el.style.top = rect[1] + "%";
  el.style.width = rect[2] + "%";
  el.style.height = rect[3] + "%";
}

// ---------------------------------------------------------------- dragging

function startDrag(event, piece, el) {
  event.preventDefault();
  const pic = document.getElementById("place-picture").getBoundingClientRect();
  const rect = pieceRect(piece);
  dragging = {
    piece: piece,
    el: el,
    // Where on the piece it was grabbed, so it doesn't jump under the finger.
    offsetX: (event.clientX - pic.left) / pic.width * 100 - rect[0],
    offsetY: (event.clientY - pic.top) / pic.height * 100 - rect[1],
    from: rect,
    startX: event.clientX,
    startY: event.clientY,
    moved: false
  };
  el.setPointerCapture(event.pointerId);
}

document.addEventListener("pointermove", function (event) {
  if (!dragging) return;
  if (!dragging.moved) {
    if (Math.hypot(event.clientX - dragging.startX, event.clientY - dragging.startY) < DRAG_START) return;
    dragging.moved = true;
    dragging.el.classList.add("dragging");
  }
  const pic = document.getElementById("place-picture").getBoundingClientRect();
  const rect = dragging.from.slice();
  rect[0] = (event.clientX - pic.left) / pic.width * 100 - dragging.offsetX;
  rect[1] = (event.clientY - pic.top) / pic.height * 100 - dragging.offsetY;
  placePiece(dragging.el, insideRoom(rect));
});

document.addEventListener("pointerup", function () {
  if (!dragging) return;
  if (!dragging.moved) { dragging = null; return; } // just a click
  justDragged = true;
  setTimeout(function () { justDragged = false; }, 0);
  const piece = dragging.piece;
  const el = dragging.el;
  const dropped = insideRoom([parseFloat(el.style.left), parseFloat(el.style.top),
    dragging.from[2], dragging.from[3]]);
  // Find the nearest spot that doesn't overlap anything, or go back where it was.
  const spot = freeSpot(piece, dropped) || dragging.from;
  placePiece(el, spot);
  el.classList.remove("dragging");
  dragging = null;

  if (!player.furniture[piece.place]) player.furniture[piece.place] = {};
  player.furniture[piece.place][piece.id] = [round1(spot[0]), round1(spot[1])];
  writeSave(player);
  showWindy(findPlace(player.at)); // the Snowy Hut's mug moves with its table (js/windy.js)
});

function round1(n) {
  return Math.round(n * 10) / 10;
}

// Keep a piece inside the picture.
function insideRoom(rect) {
  return [Math.min(Math.max(rect[0], 0), 100 - rect[2]),
          Math.min(Math.max(rect[1], 0), 100 - rect[3]), rect[2], rect[3]];
}

// ---------------------------------------------------------------- no overlapping

// Do two pieces overlap? The corners of a drawing are mostly empty, so each
// piece counts as a bit smaller than its box. That lets pieces stand close
// together without their outlines touching.
const OVERLAP_SLACK = 0.12; // ignore this much of each side

function overlaps(a, b) {
  const shrink = function (r) {
    return [r[0] + r[2] * OVERLAP_SLACK, r[1] + r[3] * OVERLAP_SLACK,
            r[2] * (1 - 2 * OVERLAP_SLACK), r[3] * (1 - 2 * OVERLAP_SLACK)];
  };
  const p = shrink(a);
  const q = shrink(b);
  return p[0] < q[0] + q[2] && q[0] < p[0] + p[2] && p[1] < q[1] + q[3] && q[1] < p[1] + p[3];
}

function fits(piece, rect) {
  return roomPieces(piece.place).every(function (other) {
    return other.id === piece.id || !overlaps(rect, pieceRect(other));
  });
}

// The free spot nearest to where the piece was dropped. It looks in growing
// circles around the drop point, like ripples, and takes the first spot that fits.
function freeSpot(piece, rect) {
  if (fits(piece, rect)) return rect;
  for (let distance = 1; distance <= 60; distance++) {
    for (let step = 0; step < 24; step++) {
      const angle = step / 24 * Math.PI * 2;
      const tryRect = insideRoom([rect[0] + Math.cos(angle) * distance,
                                  rect[1] + Math.sin(angle) * distance, rect[2], rect[3]]);
      if (fits(piece, tryRect)) return tryRect;
    }
  }
  return null; // the room is full
}
