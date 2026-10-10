// Mining in the Crystal Cave (data/mining.js).
//
// The cave wall has an invisible grid. Each visit, some squares get a crystal
// or a bone hidden in them. With a pickaxe in your backpack, click the wall
// to pick at the square you clicked.

let mineSquares = [];   // what each square hides this visit: "crystal", "bone" or "rock"
let picking = false;    // true while the pickaxe is swinging

function isMine(place) {
  return place.id === GAME_DATA.mining.place;
}

function hasPickaxe() {
  return player.backpack.indexOf("tool_pickaxe") !== -1;
}

// ---------------------------------------------------------------- setting up the cave

// Called by showPlace: draw the rack and hide new crystals and bones.
function showMine(place) {
  const box = document.getElementById("place-mine");
  box.innerHTML = "";
  box.hidden = !isMine(place);
  if (!isMine(place)) return;
  hideTreasure();

  // The pickaxe rack, where you take a pickaxe.
  const m = GAME_DATA.mining;
  const rack = document.createElement("img");
  rack.className = "pickaxe-rack";
  rack.src = picture("mine_pickaxes");
  rack.alt = rack.title = "Pickaxes";
  rack.style.left = m.rack[0] + "%";
  rack.style.top = m.rack[1] + "%";
  rack.style.width = m.rack[2] + "%";
  rack.addEventListener("click", function (event) {
    event.stopPropagation(); // taking a pickaxe isn't picking at the wall
    takePickaxe();
  });
  box.appendChild(rack);
  mineSay(hasPickaxe()
    ? "Click the cave wall to pick at it with your pickaxe."
    : "Take a pickaxe from the rack, then click the cave wall to mine.");
}

// Shuffle crystals and bones into random squares; the rest is plain rock.
function hideTreasure() {
  const m = GAME_DATA.mining;
  mineSquares = [];
  for (let i = 0; i < m.columns * m.rows; i++) {
    mineSquares.push(i < m.crystalSquares ? "crystal" : i < m.crystalSquares + m.boneSquares ? "bone" : "rock");
  }
  for (let i = mineSquares.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = mineSquares[i]; mineSquares[i] = mineSquares[j]; mineSquares[j] = swap;
  }
}

function takePickaxe() {
  if (hasPickaxe()) return mineSay("You already have a pickaxe. Click the cave wall to mine!");
  player.backpack.push("tool_pickaxe");
  writeSave(player);
  mineSay("You took a pickaxe! It's in your backpack. Now click the cave wall to mine.");
}

// The message under the cave picture.
function mineSay(message) {
  document.getElementById("place-description").textContent = message;
}

// ---------------------------------------------------------------- picking at the wall

// Which square was clicked, or -1 if it was outside the grid.
function squareAt(x, y) {
  const m = GAME_DATA.mining;
  const a = m.area;
  if (x < a[0] || x >= a[2] || y < a[1] || y >= a[3]) return -1;
  const col = Math.floor((x - a[0]) / (a[2] - a[0]) * m.columns);
  const row = Math.floor((y - a[1]) / (a[3] - a[1]) * m.rows);
  return row * m.columns + col;
}

// The middle of a square, in percent, to show what was found there.
function squareMiddle(i) {
  const m = GAME_DATA.mining;
  const a = m.area;
  const col = i % m.columns, row = Math.floor(i / m.columns);
  return [a[0] + (col + 0.5) * (a[2] - a[0]) / m.columns, a[1] + (row + 0.5) * (a[3] - a[1]) / m.rows];
}

function pickAt(event) {
  if (placementMode || picking || !isMine(findPlace(player.at))) return;
  if (!hasPickaxe()) return mineSay("You need a pickaxe to mine. Take one from the rack!");
  const pic = document.getElementById("place-picture");
  const x = (event.clientX - pic.getBoundingClientRect().left - pic.clientLeft) / pic.clientWidth * 100;
  const y = (event.clientY - pic.getBoundingClientRect().top - pic.clientTop) / pic.clientHeight * 100;
  const i = squareAt(x, y);
  if (i === -1) return;

  // Swing the pickaxe where you clicked, then see what's there.
  picking = true;
  const swing = addToCave("span", "pickaxe-swing", x, y);
  swing.textContent = "⛏️";
  setTimeout(function () {
    swing.remove();
    picking = false;
    findIn(i);
  }, GAME_DATA.mining.pickSeconds * 1000);
}

// Put something on the cave picture at x, y percent.
function addToCave(tag, className, x, y) {
  const el = document.createElement(tag);
  el.className = className;
  el.style.left = x + "%";
  el.style.top = y + "%";
  document.getElementById("place-mine").appendChild(el);
  return el;
}

// What the square held. Once mined, a square is just a hole.
function findIn(i) {
  const what = mineSquares[i];
  const middle = squareMiddle(i);
  if (what === "mined") return mineSay("You already dug that spot. Try somewhere else!");
  mineSquares[i] = "mined";
  addToCave("span", "mine-hole", middle[0], middle[1]);
  if (what === "crystal") {
    const range = GAME_DATA.mining.crystals;
    const count = randomBetween(range[0], range[1]); // js/digging.js
    player.crystals += count;
    const art = GAME_DATA.mineCrystals[Math.floor(Math.random() * GAME_DATA.mineCrystals.length)];
    showFound(art, middle, "+" + count + " 💎");
    mineSay("💎 You found " + count + (count === 1 ? " Crystal!" : " Crystals!"));
  } else if (what === "bone") {
    player.satchel.push("mine_bone");
    showFound("mine_bone", middle, "Bone!");
    mineSay("🦴 You found a bone! It's in your satchel.");
  } else {
    showFound(null, middle, "Rock");
    mineSay("Just rock. Keep picking!");
  }
  writeSave(player);
  updateStatus();
  if (mineSquares.indexOf("crystal") === -1 && mineSquares.indexOf("bone") === -1) {
    mineSay(document.getElementById("place-description").textContent + " That's everything in this cave for now. Come back later for more!");
  }
}

// The find pops out of the wall for a moment, with a word saying what it is
// (right on the picture, so you don't have to look down for the message).
function showFound(art, middle, words) {
  if (art) {
    const img = addToCave("img", "mine-found", middle[0], middle[1]);
    img.src = picture(art);
    img.alt = "";
    setTimeout(function () { img.remove(); }, 1600);
  }
  const label = addToCave("span", "mine-label" + (art ? "" : " rock"), middle[0], middle[1] + 6);
  label.textContent = words;
  setTimeout(function () { label.remove(); }, 1600);
}

document.getElementById("place-picture").addEventListener("click", pickAt);
