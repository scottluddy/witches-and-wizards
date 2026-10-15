// Lost on Windy Peak (Scott, 2026-10-15): a rescue adventure. The numbers
// and words are in data/windy.js. Scott wants it to be figured out, not
// told: there are few instructions on purpose.
//
// player.windy.stage says how far along you are:
//   ""       not started (let your Snowy Owl fly while you own a Night Vision Potion)
//   "lost"   the owl spotted a little WIT somewhere on the dark ski slope
//   "found"  you found them on the slope: click them to ski down together
//   "cold"   they're in the Snowy Hut and need a hot chocolate
// player.windy.seeing is true after a sip, until your next look.

function windyRules() {
  return GAME_DATA.windyRescue;
}

function windyOn() {
  return player.windy.stage !== "";
}

// ---------------------------------------------------------------- the owl

// Has this owl had a falconry lesson? Only then can it fly at the dropoff.
function hadFalconry(pet) {
  return player.falconryDone.indexOf(pet.id) !== -1;
}

// Called after your Snowy Owl flies at the dropoff (js/bonding.js). With a
// Night Vision Potion, the owl spots the little WIT and the adventure starts.
// Returns true if it opened its own pop-up. "said" ends with the Bonding Points.
function owlFlewOverSlope(pet, said) {
  if (windyOn() || !hasNightVision()) return false;
  startWindyRescue();
  const bonding = said.slice(said.lastIndexOf("+")).replace("!", "");
  openInfoPanel(windyArt(), "Lost on Windy Peak",
    windyRules().words.owlSpotted.replace("PET", pet.name).replace("BONDING", bonding));
  return true;
}

// Start (or start again): the little WIT is lost in one of the slope's areas.
function startWindyRescue() {
  const rules = windyRules();
  player.windy.stage = "lost";
  player.windy.spot = Math.floor(Math.random() * rules.columns * rules.rows);
  player.windy.tries = 0;
  player.windy.looked = [];
  player.windy.glow = nearArea(player.windy.spot, rules.glowNear); // the binoculars' faint glow
  if (!adventureUnlocked("windy")) player.adventures.unlocked.push("windy"); // js/adventures.js
  revealAdventure("windy");
  writeSave(player);
}

// ---------------------------------------------------------------- the potion

function hasNightVision() {
  return player.backpack.indexOf(windyRules().potion) !== -1;
}

function isNightVisionPotion(item) {
  return item.id === windyRules().potion;
}

// Sips left in the potion you're carrying (a new potion has them all).
function sipsLeft() {
  if (!hasNightVision()) return 0;
  return player.windy.sips || windyRules().sips;
}

// The 🌙 Sip button on the potion in your backpack (only during the rescue,
// so sips aren't wasted).
function nightVisionButton(item) {
  if (player.windy.stage !== "lost") return document.createTextNode("");
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "🌙 Sip (" + sipsLeft() + " left)";
  button.disabled = player.windy.seeing;
  button.addEventListener("click", function () {
    document.getElementById("backpack-panel").hidden = true;
    sipNightVision();
  });
  return button;
}

// One sip: you can see in the dark for your next look. The last sip uses up the
// potion. Each sip the owl circles over a slightly different point near the little WIT.
function sipNightVision() {
  const left = sipsLeft() - 1;
  player.windy.sips = left;
  player.windy.seeing = true;
  player.windy.owlAt = nearArea(player.windy.spot, windyRules().owlNear);
  if (left === 0) removeOne(player.backpack, windyRules().potion); // js/items.js
  writeSave(player);
  if (player.at === windyRules().slope) showSlope();
  document.getElementById("place-description").textContent = windyRules().words.sipped;
}

// Uses up the sip's one look. Returns whether you could see.
function useLook() {
  const could = player.windy.seeing;
  player.windy.seeing = false;
  writeSave(player);
  return could;
}

// ---------------------------------------------------------------- the binoculars

// Windy Peak's "Look down" spot. During the rescue it shows a blown-up view
// of the ski slope: too dark to see, unless you've had a sip.
function windyLook(spot) {
  if (player.windy.stage !== "lost") return false;
  const rules = windyRules();
  const seeing = useLook();
  openInfoPanel("🔭", spot.name, seeing ? "" : rules.words.tooDark);
  const lens = document.createElement("div");
  lens.className = "binocular-view slope-view " + (seeing ? "night-vision" : "night");
  const view = document.createElement("img");
  view.src = picture("place_" + rules.slope);
  view.alt = "The ski slope";
  lens.appendChild(view);
  if (seeing) {
    // Not the exact spot: a faint glow from the lantern, somewhere near the little WIT.
    const glow = document.createElement("span");
    glow.className = "slope-glow";
    if (!player.windy.glow) player.windy.glow = nearArea(player.windy.spot, rules.glowNear); // older saves
    glow.style.left = player.windy.glow.x + "%";
    glow.style.top = player.windy.glow.y + "%";
    glow.style.width = rules.glowSize * 100 / rules.columns + "%";
    lens.appendChild(glow);
  }
  document.getElementById("info-body").appendChild(lens);
  return true;
}

// The middle of one puzzle-piece area, in percent of the slope picture.
function areaCentre(area) {
  const rules = windyRules();
  return {
    x: (area % rules.columns + 0.5) * 100 / rules.columns,
    y: (Math.floor(area / rules.columns) + 0.5) * 100 / rules.rows
  };
}

// A point up to "pieces" puzzle pieces away from the middle of an area, in percent.
function nearArea(area, pieces) {
  const rules = windyRules();
  const at = areaCentre(area);
  const angle = Math.random() * Math.PI * 2;
  const away = Math.random() * pieces;
  return {
    x: Math.min(97, Math.max(3, at.x + Math.cos(angle) * away * 100 / rules.columns)),
    y: Math.min(97, Math.max(3, at.y + Math.sin(angle) * away * 100 / rules.rows))
  };
}

// ---------------------------------------------------------------- the slope

// Windy Peak's "Ski down" spot: onto the dark slope during the rescue,
// otherwise straight to the Snowy Hut.
function windySkiDown(spot) {
  const stage = player.windy.stage;
  goTo(stage === "lost" || stage === "found" ? windyRules().slope : spot.to);
}

// Called by showPlace (and after furniture moves): the dark slope, or the
// Snowy Hut's mug (and the cold little WIT).
function showWindy(place) {
  const box = document.getElementById("place-windy");
  const image = document.getElementById("place-image");
  box.innerHTML = "";
  image.classList.remove("night", "night-vision");
  const rules = windyRules();
  box.hidden = !place || (place.id !== rules.slope && place.id !== rules.hut);
  if (box.hidden) return;
  if (place.id === rules.slope) showSlope();
  else showHut();
}

// The slope's 48 puzzle-piece areas over the dark picture.
function showSlope() {
  const rules = windyRules();
  const state = player.windy;
  const box = document.getElementById("place-windy");
  box.innerHTML = "";
  document.getElementById("place-image").classList.toggle("night", !state.seeing);
  document.getElementById("place-image").classList.toggle("night-vision", state.seeing);
  const pieces = document.createElement("div");
  pieces.className = "slope-pieces";
  pieces.style.gridTemplateColumns = "repeat(" + rules.columns + ", 1fr)";
  pieces.style.gridTemplateRows = "repeat(" + rules.rows + ", 1fr)";
  for (let area = 0; area < rules.columns * rules.rows; area++) pieces.appendChild(slopePiece(area));
  box.appendChild(pieces);
  if (state.seeing && state.stage === "lost") box.appendChild(slopeOwl());
  document.getElementById("place-description").textContent =
    findPlace(rules.slope).description + (state.stage === "lost" ? " " + "🔦".repeat(rules.tries - state.tries) : "");
}

function slopePiece(area) {
  const state = player.windy;
  const piece = document.createElement("button");
  piece.className = "slope-piece";
  if (state.looked.indexOf(area) !== -1) piece.textContent = "✖️";
  if (state.stage === "found" && area === state.spot) piece.appendChild(littleWitButton());
  else if (state.stage === "lost") piece.addEventListener("click", function () { lookInArea(area, piece); });
  return piece;
}

// Your Snowy Owl, seen with night vision: it flies down from the top of the
// slope and circles over a point near the little WIT.
function slopeOwl() {
  const rules = windyRules();
  const at = player.windy.owlAt || nearArea(player.windy.spot, rules.owlNear);
  const circle = document.createElement("div");
  circle.className = "slope-owl-circle";
  circle.style.width = rules.owlCircle * 100 / rules.columns + "%";
  circle.style.left = "50%";
  circle.style.top = "-10%";
  const owl = document.createElement("span");
  owl.className = "slope-owl";
  if (isDrawn(rules.owl)) {
    const img = document.createElement("img");
    img.src = picture(rules.owl);
    img.alt = "Snowy Owl";
    owl.appendChild(img);
  } else owl.textContent = "🦉";
  circle.appendChild(owl);
  // Next frame: glide down to its circle (the move is a CSS transition).
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      circle.style.left = at.x + "%";
      circle.style.top = at.y + "%";
    });
  });
  return circle;
}

// One look into an area of the slope: you need to have had a sip.
function lookInArea(area, piece) {
  const rules = windyRules();
  const state = player.windy;
  const say = function (text) { document.getElementById("place-description").textContent = text; };
  if (state.looked.indexOf(area) !== -1) return;
  if (!useLook()) {
    piece.classList.add("shake");
    setTimeout(function () { piece.classList.remove("shake"); }, 500);
    return say(rules.words.tooDark);
  }
  if (area === state.spot) {
    state.stage = "found";
    writeSave(player);
    showSlope();
    return;
  }
  state.tries++;
  state.looked.push(area);
  writeSave(player);
  if (state.tries >= rules.tries) {
    startWindyRescue(); // they wander somewhere new: look through the binoculars again
    showSlope();
    return say(rules.words.wandered);
  }
  showSlope();
  say(rules.words.missed + " " + "🔦".repeat(rules.tries - state.tries));
}

// The little WIT on the slope: click them to ski down together.
function littleWitButton() {
  const wit = document.createElement("span");
  wit.className = "little-wit";
  const art = windyArt();
  if (typeof art === "string") wit.textContent = art;
  else wit.appendChild(art);
  wit.addEventListener("click", function (event) {
    event.stopPropagation();
    const body = openInfoPanel(windyArt(), "Little WIT", windyRules().words.hello);
    const ski = document.createElement("button");
    ski.className = "big-button";
    ski.textContent = windyRules().words.skiTogether;
    ski.addEventListener("click", skiDownTogether);
    body.appendChild(ski);
  });
  return wit;
}

function skiDownTogether() {
  player.windy.stage = "cold";
  writeSave(player);
  document.getElementById("info-panel").hidden = true;
  goTo(windyRules().hut);
}

// ---------------------------------------------------------------- the Snowy Hut

// The hut's hot chocolate mug on the Snack Table, and during the rescue the
// little WIT shivering, waiting for you to drag the mug over to them.
function showHut() {
  const box = document.getElementById("place-windy");
  const mug = hutMug();
  box.appendChild(mug);
  if (player.windy.stage !== "cold") return;
  const wit = showColdWit(box);
  mug.classList.add("draggable");
  dragMug(mug, wit, box);
}

// The girls' mug (cut out of the hut drawing), standing where the Snack Table is now.
function hutMug() {
  const spec = windyRules().mug;
  const mug = document.createElement("span");
  mug.className = "hut-mug";
  if (isDrawn(spec.picture)) {
    const img = document.createElement("img");
    img.src = picture(spec.picture);
    img.alt = "Hot Chocolate";
    img.draggable = false;
    mug.appendChild(img);
    mug.style.width = spec.width + "%";
  } else mug.textContent = "☕";
  const moved = tableMoved(spec.table);
  mug.dataset.x = spec.x + moved[0];
  mug.dataset.y = spec.y + moved[1];
  mug.style.left = mug.dataset.x + "%";
  mug.style.top = mug.dataset.y + "%";
  return mug;
}

// How far the table has been moved from where it was drawn: [across, down] in percent.
function tableMoved(tableId) {
  const table = (GAME_DATA.furniture || []).find(function (p) { return p.place === windyRules().hut && p.id === tableId; });
  if (!table || roomPieces(table.place).indexOf(table) === -1) return [0, 0]; // js/furniture.js
  const drawn = GAME_DATA.furnitureBoxes[table.place + "/" + table.id];
  const now = pieceRect(table);
  return [now[0] - drawn[0], now[1] - drawn[1]];
}

function showColdWit(box) {
  const rules = windyRules();
  const wit = document.createElement("div");
  wit.className = "hut-wit";
  wit.style.left = rules.hutSpot.x + "%";
  wit.style.top = rules.hutSpot.y + "%";
  const bubble = document.createElement("span");
  bubble.className = "hut-wit-bubble";
  bubble.textContent = rules.words.cold;
  const art = windyArt();
  const face = document.createElement("span");
  face.className = "hut-wit-face";
  if (typeof art === "string") face.textContent = art;
  else face.appendChild(art);
  wit.append(bubble, face);
  box.appendChild(wit);
  return wit;
}

// Drag the mug with the mouse; let go on the little WIT to give it to them.
function dragMug(mug, wit, box) {
  mug.addEventListener("pointerdown", function (event) {
    event.preventDefault();
    mug.setPointerCapture(event.pointerId);
    mug.classList.add("dragging");
  });
  mug.addEventListener("pointermove", function (event) {
    if (!mug.classList.contains("dragging")) return;
    const area = box.getBoundingClientRect();
    mug.style.left = (event.clientX - area.left) / area.width * 100 + "%";
    mug.style.top = (event.clientY - area.top) / area.height * 100 + "%";
  });
  mug.addEventListener("pointerup", function (event) {
    mug.classList.remove("dragging");
    const target = wit.getBoundingClientRect();
    const onWit = event.clientX >= target.left && event.clientX <= target.right &&
      event.clientY >= target.top && event.clientY <= target.bottom;
    if (onWit) return warmUpTogether();
    mug.style.left = mug.dataset.x + "%"; // back to the table
    mug.style.top = mug.dataset.y + "%";
  });
}

function warmUpTogether() {
  const rules = windyRules();
  player.adventurePoints += rules.adventurePoints;
  player.windy.done++;
  player.windy.stage = ""; // the owl can spot another lost WIT next time
  writeSave(player);
  showWindy(findPlace(rules.hut)); // the mug goes back on the table
  openInfoPanel(celebrationArt("rescue", "☕🧒☕"), "Rescued!", // js/game.js
    rules.words.done.replace("POINTS", rules.adventurePoints));
}

// The little WIT: the girls' drawing once there is one, an emoji until then.
function windyArt() {
  const rules = windyRules();
  if (!isDrawn(rules.picture)) return rules.lostWit;
  const img = document.createElement("img");
  img.src = picture(rules.picture);
  img.alt = "Little WIT";
  img.className = "info-picture";
  return img;
}
