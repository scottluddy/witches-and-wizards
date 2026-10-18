// The Invisibility Room (Scott, 2026-10-18), Floor 4 of the Multi-House.
// A plain white room. Writing on the wall only shows up inside the purple
// glow of the Blacklight, which you drag left and right. With Invisible Ink
// you can write on the wall yourself; what you write is saved
// (player.invisibleWall). The words and numbers are in data/invisible.js.
// The Blacklight is found in the Crystal Cave (js/mining.js), the ink at
// the Dig Spot (js/digging.js).

let inkRoom = null; // while you're in the room: { beamX, lightOn, writing (the words waiting to be put on the wall) }

function isInvisibleRoom(place) {
  return place.id === GAME_DATA.invisibleRoom.place;
}

// ---------------------------------------------------------------- the room

// Called by showPlace: set up the wall, or tidy it away when you leave.
function showInvisibleRoom(place) {
  const box = document.getElementById("place-ink");
  box.innerHTML = "";
  box.hidden = !isInvisibleRoom(place);
  inkRoom = null;
  if (box.hidden) return;
  inkRoom = { beamX: 50, lightOn: false, writing: null };
  const words = document.createElement("div");
  words.id = "ink-words"; // everything written on the wall; only the bit inside the beam shows
  const beam = document.createElement("div");
  beam.id = "ink-beam";
  beam.hidden = true;
  beam.addEventListener("pointerdown", startDragBeam);
  beam.addEventListener("pointermove", dragBeam);
  beam.addEventListener("pointerup", function () { inkRoom && (inkRoom.dragging = false); });
  box.append(words, beam);
  drawWall();
  placeBeam();
}

// Put every writing on the wall (invisible until the beam shines on it).
function drawWall() {
  const words = document.getElementById("ink-words");
  words.innerHTML = "";
  player.invisibleWall.forEach(function (writing) {
    const line = document.createElement("span");
    line.className = "ink-writing";
    line.textContent = writing.text;
    line.style.left = writing.x + "%";
    line.style.top = writing.y + "%";
    words.appendChild(line);
  });
}

// The beam, and the slice of the writing it lights up. Without the light
// nothing shows at all.
function placeBeam() {
  const half = GAME_DATA.invisibleRoom.beamWidth / 2;
  const beam = document.getElementById("ink-beam");
  const words = document.getElementById("ink-words");
  beam.hidden = !inkRoom.lightOn;
  beam.style.left = (inkRoom.beamX - half) + "%";
  beam.style.width = (half * 2) + "%";
  words.style.clipPath = inkRoom.lightOn
    ? "inset(0 " + (100 - inkRoom.beamX - half) + "% 0 " + (inkRoom.beamX - half) + "%)"
    : "inset(0 100% 0 0)";
}

// In your backpack (not left at Home).
function carrying(itemId) {
  return player.backpack.indexOf(itemId) !== -1;
}

function inkSay(message) {
  document.getElementById("place-description").textContent = message;
}

// ---------------------------------------------------------------- the Blacklight

// The ⬅️ Blacklight button beside the picture: switch the light on or off.
function toggleBlacklight() {
  const rules = GAME_DATA.invisibleRoom;
  if (!inkRoom) return;
  if (!carrying(rules.blacklight)) return inkSay(rules.words.noLight);
  inkRoom.lightOn = !inkRoom.lightOn;
  placeBeam();
  inkSay(inkRoom.lightOn ? rules.words.lightOn : rules.words.lightOff);
}

// Drag the glow left and right (it always stays on the wall).
function startDragBeam(event) {
  event.preventDefault();
  event.stopPropagation();
  inkRoom.dragging = true;
  event.target.setPointerCapture(event.pointerId);
}

function dragBeam(event) {
  if (!inkRoom || !inkRoom.dragging) return;
  const half = GAME_DATA.invisibleRoom.beamWidth / 2;
  inkRoom.beamX = Math.min(Math.max(pointInPicture(event).x, half), 100 - half); // js/you.js
  placeBeam();
}

// ---------------------------------------------------------------- Invisible Ink

// The ➡️ Invisible Ink button: type what to write, then click the wall where it goes.
function openInvisibleInk() {
  const rules = GAME_DATA.invisibleRoom;
  if (!inkRoom) return;
  if (!carrying(rules.ink)) return inkSay(rules.words.noInk);
  const body = openInfoPanel("🖋️", "Invisible Ink",
    rules.words.write.replace("MAX", rules.maxLetters).replace("LEFT", inkLeft() === 1 ? "1 thing" : inkLeft() + " things"));
  const box = document.createElement("input");
  box.type = "text";
  box.maxLength = rules.maxLetters;
  box.className = "ink-input";
  const write = document.createElement("button");
  write.className = "big-button";
  write.textContent = "✍️ Write it";
  function done() {
    const text = box.value.trim();
    if (!text) return box.focus();
    document.getElementById("info-panel").hidden = true;
    inkRoom.writing = text;
    document.getElementById("place-ink").classList.add("aiming");
    inkSay(rules.words.aim);
  }
  write.addEventListener("click", done);
  box.addEventListener("keydown", function (event) { if (event.key === "Enter") done(); });
  body.append(box, " ", write);
  box.focus();
}

// How many more things the bottle you have can write. A bottle you've just
// found (or got some other way) is full.
function inkLeft() {
  if (!player.inkLeft) player.inkLeft = GAME_DATA.invisibleRoom.writesPerBottle;
  return player.inkLeft;
}

// Clicking the wall while aiming: the words go there, and use up some ink.
function writeOnWall(event) {
  if (!inkRoom || !inkRoom.writing) return;
  const rules = GAME_DATA.invisibleRoom;
  const at = pointInPicture(event); // js/you.js
  player.invisibleWall.push({ text: inkRoom.writing, x: Math.round(at.x * 10) / 10, y: Math.round(at.y * 10) / 10 });
  while (player.invisibleWall.length > rules.maxWritings) player.invisibleWall.shift(); // the oldest fades away
  inkRoom.writing = null;
  document.getElementById("place-ink").classList.remove("aiming");
  player.inkLeft = inkLeft() - 1;
  let message = rules.words.wrote;
  if (player.inkLeft <= 0) {
    removeOne(player.backpack, rules.ink); // js/items.js
    player.inkLeft = 0;
    message += " " + rules.words.lastInk;
  }
  writeSave(player);
  updateStatus();
  drawWall();
  inkSay(message);
}

document.getElementById("place-ink").addEventListener("click", writeOnWall);

// ---------------------------------------------------------------- finding them

// Called by js/mining.js when a square is plain rock: very rarely it hides the
// Blacklight (only while you don't have one). Returns true if it did.
function foundBlacklight() {
  const rules = GAME_DATA.invisibleRoom;
  if (owns(rules.blacklight)) return false;
  if (Math.random() >= luckyChance(rules.blacklightChance / 100)) return false; // luck helps (js/luck.js)
  player.backpack.push(rules.blacklight);
  writeSave(player);
  updateStatus();
  return true;
}

// Called by js/digging.js at the Dig Spot: very rarely a bottle of Invisible
// Ink (only while you don't have one). Returns true if it did.
function foundInvisibleInk() {
  const rules = GAME_DATA.invisibleRoom;
  if (owns(rules.ink)) return false;
  if (Math.random() >= luckyChance(rules.inkChance / 100)) return false; // luck helps (js/luck.js)
  player.backpack.push(rules.ink);
  player.inkLeft = rules.writesPerBottle;
  writeSave(player);
  updateStatus();
  return true;
}
