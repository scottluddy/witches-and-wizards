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

// One sip: you can see in the dark for your next look. The last sip uses up the potion.
function sipNightVision() {
  const left = sipsLeft() - 1;
  player.windy.sips = left;
  player.windy.seeing = true;
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
    const lantern = document.createElement("span");
    lantern.className = "slope-lantern";
    const at = areaCentre(player.windy.spot);
    lantern.style.left = at.x + "%";
    lantern.style.top = at.y + "%";
    lantern.textContent = "🏮";
    lens.appendChild(lantern);
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

// ---------------------------------------------------------------- the slope

// Windy Peak's "Ski down" spot: onto the dark slope during the rescue,
// otherwise straight to the Snowy Hut.
function windySkiDown(spot) {
  const stage = player.windy.stage;
  goTo(stage === "lost" || stage === "found" ? windyRules().slope : spot.to);
}

// Called by showPlace: the dark slope, or the little WIT in the Snowy Hut.
function showWindy(place) {
  const box = document.getElementById("place-windy");
  const image = document.getElementById("place-image");
  box.innerHTML = "";
  image.classList.remove("night", "night-vision");
  const rules = windyRules();
  box.hidden = !(place.id === rules.slope || (place.id === rules.hut && player.windy.stage === "cold"));
  if (box.hidden) return;
  if (place.id === rules.slope) showSlope();
  else showColdWit();
}

// The slope's 12 puzzle-piece areas over the dark picture.
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
  for (let area = 0; area < rules.columns * rules.rows; area++) pieces.appendChild(slopePiece(area));
  box.appendChild(pieces);
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

// The little WIT shivering in the hut, and a hot chocolate on the table to
// drag over to them.
function showColdWit() {
  const rules = windyRules();
  const box = document.getElementById("place-windy");
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

  const mug = document.createElement("span");
  mug.className = "hut-mug";
  mug.textContent = "☕";
  mug.style.left = rules.mugSpot.x + "%";
  mug.style.top = rules.mugSpot.y + "%";
  box.appendChild(mug);
  dragMug(mug, wit, box);
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
    if (onWit) warmUpTogether();
  });
}

function warmUpTogether() {
  const rules = windyRules();
  player.adventurePoints += rules.adventurePoints;
  player.windy.done++;
  player.windy.stage = ""; // the owl can spot another lost WIT next time
  writeSave(player);
  document.getElementById("place-windy").hidden = true;
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
