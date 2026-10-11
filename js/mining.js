// Mining in the Crystal Cave (data/mining.js).
//
// The cave wall has an invisible grid. Each visit, some squares get a crystal
// or a bone hidden in them. With a pickaxe in your backpack, click the wall
// to pick at the square you clicked.

let mineSquares = [];   // what each square hides this visit: "crystal", "bone", "troll" or "rock"
let picking = false;    // true while the pickaxe is swinging

function isMine(place) {
  return place.id === GAME_DATA.mining.place;
}

function hasPickaxe() {
  return player.backpack.indexOf("tool_pickaxe") !== -1;
}

// ---------------------------------------------------------------- setting up the cave

// Called by showPlace: set up the rack and hide new crystals and bones.
// Leaving the cave puts the pickaxe back on the rack.
function showMine(place) {
  const box = document.getElementById("place-mine");
  const rack = document.getElementById("mine-rack");
  box.innerHTML = "";
  box.hidden = !isMine(place);
  rack.hidden = !isMine(place);
  if (!isMine(place)) return returnPickaxe();
  hideTreasure();
  showRack();
  placeRack();
  mineSay(hasPickaxe()
    ? "Click the cave wall to pick at it with your pickaxe."
    : "Use a pickaxe from the rack (" + gemsText(GAME_DATA.mining.pickaxeGems) + "), then click the cave wall to mine.");
}

// "1 gem", "3 gems"
function gemsText(n) {
  return n + (n === 1 ? " gem" : " gems");
}

// The rack button: its picture and what it says.
function showRack() {
  const cost = GAME_DATA.mining.pickaxeGems;
  document.getElementById("mine-rack-img").src = picture("mine_pickaxes");
  document.getElementById("mine-rack-label").textContent = hasPickaxe()
    ? "⛏️ You have a pickaxe ✓"
    : "⛏️ Use a pickaxe: " + gemsText(cost);
  document.getElementById("mine-rack").classList.toggle("taken", hasPickaxe());
}

// The rack stands just to the right of the cave picture (over its edge if
// the window is too narrow).
function placeRack() {
  const rack = document.getElementById("mine-rack");
  if (rack.hidden) return;
  const pic = document.getElementById("place-picture");
  const screen = document.getElementById("screen-place");
  const left = Math.min(pic.offsetLeft + pic.offsetWidth + 16, screen.clientWidth - rack.offsetWidth - 8);
  rack.style.left = left + "px";
  rack.style.top = (pic.offsetTop + pic.offsetHeight * 0.3) + "px";
}

window.addEventListener("resize", placeRack);
document.getElementById("place-image").addEventListener("load", placeRack);

// Shuffle crystals and bones into random squares; the rest is plain rock.
function hideTreasure() {
  const m = GAME_DATA.mining;
  mineSquares = [];
  for (let i = 0; i < m.columns * m.rows; i++) {
    if (i < m.crystalSquares) mineSquares.push("crystal");
    else if (i < m.crystalSquares + m.boneSquares) mineSquares.push("bone");
    else if (i < m.crystalSquares + m.boneSquares + m.trollSquares) mineSquares.push("troll");
    else mineSquares.push("rock");
  }
  for (let i = mineSquares.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = mineSquares[i]; mineSquares[i] = mineSquares[j]; mineSquares[j] = swap;
  }
}

// Pay the gems and take a pickaxe off the rack (into your backpack).
function takePickaxe() {
  const cost = GAME_DATA.mining.pickaxeGems;
  if (hasPickaxe()) return mineSay("You already have a pickaxe. Click the cave wall to mine!");
  if (player.gems < cost) {
    return mineSay("Using a pickaxe costs " + gemsText(cost) + ", and you have " + gemsText(player.gems) +
      ". Go fishing at the Dock to earn gems!");
  }
  player.gems -= cost;
  player.backpack.push("tool_pickaxe");
  writeSave(player);
  showRack();
  mineSay("You paid " + gemsText(cost) + " and took a pickaxe! Now click the cave wall to mine. It goes back on the rack when you leave.");
}

// Out of the cave, the pickaxe goes back on the rack.
function returnPickaxe() {
  if (!hasPickaxe()) return;
  player.backpack = player.backpack.filter(function (id) { return id !== "tool_pickaxe"; });
  writeSave(player);
}

document.getElementById("mine-rack").addEventListener("click", takePickaxe);

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
  if (!hasPickaxe()) return mineSay("You need a pickaxe to mine. Use one from the rack to the right of the cave!");
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
  forgetOldHoles();
  if (what === "crystal") {
    const art = GAME_DATA.mineCrystals[Math.floor(Math.random() * GAME_DATA.mineCrystals.length)];
    mineSay("💎 You found a Crystal!");
    // The crystal flies up to the Crystals counter, and counts when it lands.
    flyFromCave(art, middle, "status-crystals", function () {
      player.crystals += GAME_DATA.mining.crystals;
      writeSave(player);
    });
  } else if (what === "bone") {
    mineSay("🦴 You found a bone! It's going in your satchel.");
    flyFromCave("mine_bone", middle, "btn-satchel", function () {
      player.satchel.push("mine_bone");
      writeSave(player);
    });
  } else if (what === "troll") {
    mineSay("Oh no, a troll!");
    wakeTroll("deep in the Crystal Cave"); // js/troll.js
  } else {
    showFound(middle, "Rock");
    mineSay("Just rock. Keep picking!");
  }
  if (mineSquares.indexOf("crystal") === -1 && mineSquares.indexOf("bone") === -1) {
    mineSay(document.getElementById("place-description").textContent + " That's everything in this cave for now. Come back later for more!");
  }
}

// Only the last few dug spots stay marked (data/mining.js "marksShown").
function forgetOldHoles() {
  const holes = document.querySelectorAll("#place-mine .mine-hole");
  for (let i = 0; i < holes.length - GAME_DATA.mining.marksShown; i++) holes[i].remove();
}

// A word pops out of the wall for a moment, saying what was there.
function showFound(middle, words) {
  const label = addToCave("span", "mine-label rock", middle[0], middle[1]);
  label.textContent = words;
  setTimeout(function () { label.remove(); }, 1600);
}

// The find pops out of the wall, then flies up to its place in the top bar
// (the Crystals counter or the Satchel button). When it lands, landed() runs
// and the button gives a little bounce.
function flyFromCave(art, middle, targetId, landed) {
  const pic = document.getElementById("place-picture");
  const box = pic.getBoundingClientRect();
  const startX = box.left + pic.clientLeft + middle[0] / 100 * pic.clientWidth;
  const startY = box.top + pic.clientTop + middle[1] / 100 * pic.clientHeight;
  const target = document.getElementById(targetId).getBoundingClientRect();

  const img = document.createElement("img");
  img.className = "flying-find";
  img.src = picture(art);
  img.alt = "";
  img.style.left = startX + "px";
  img.style.top = startY + "px";
  document.body.appendChild(img);

  // First it pops out (0.5 s), then it flies (0.9 s).
  setTimeout(function () {
    img.classList.add("flying");
    img.style.left = (target.left + target.width / 2) + "px";
    img.style.top = (target.top + target.height / 2) + "px";
  }, 500);
  setTimeout(function () {
    img.remove();
    landed();
    const bump = document.getElementById(targetId).closest(".status-item, button");
    bump.classList.remove("bump");
    void bump.offsetWidth; // restart the bounce
    bump.classList.add("bump");
  }, 1400);
}

document.getElementById("place-picture").addEventListener("click", pickAt);
