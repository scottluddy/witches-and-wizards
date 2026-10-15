// Lost on Windy Peak (Scott, 2026-10-15): a rescue adventure. The steps,
// numbers and words are in data/windy.js.
//
// player.windy.stage says how far along you are:
//   ""         not started (let your Snowy Owl fly while you own a Night Vision Potion)
//   "lost"     the owl spotted a little WIT: look through the binoculars
//   "spotted"  you've seen the clue: ski down and look in the right section
//   "found"    found them! Ski down to the Snowy Hut and warm up

function windyRules() {
  return GAME_DATA.windyRescue;
}

function windyWords(text) {
  return text.replace("TRIES", windyRules().tries - player.windy.tries);
}

// ---------------------------------------------------------------- the owl

// Has this owl had a falconry lesson? Only then can it fly at the dropoff.
function hadFalconry(pet) {
  return player.falconryDone.indexOf(pet.id) !== -1;
}

// Called after your Snowy Owl flies at the dropoff (js/bonding.js). With a
// Night Vision Potion, the owl spots the little WIT and the adventure starts.
// Returns true if it opened its own pop-up. "said" ends with the Bonding Points earned.
function owlFlewOverSlope(pet, said) {
  if (player.windy.stage !== "" || !hasNightVision()) return false;
  startWindyRescue();
  const bonding = said.slice(said.lastIndexOf("+")).replace("!", "");
  openInfoPanel(windyArt(), "Lost on Windy Peak",
    windyRules().words.owlSpotted.replace("PET", pet.name).replace("BONDING", bonding));
  return true;
}

// Start (or start again): a new slope layout and a new place the little WIT is lost.
function startWindyRescue() {
  const state = player.windy;
  state.stage = "lost";
  state.slope = newSlope();
  state.spot = Math.floor(Math.random() * state.slope.length);
  state.tries = 0;
  state.looked = [];
  if (!adventureUnlocked("windy")) player.adventures.unlocked.push("windy"); // js/adventures.js
  revealAdventure("windy");
  writeSave(player);
}

// 12 sections, row by row from the top. Each column gets every landmark once
// in a mixed-up order, so a landmark and a side point to exactly one section.
function newSlope() {
  const rules = windyRules();
  const columns = rules.columns.map(function () {
    return rules.landmarks.map(function (l, i) { return i; }).sort(function () { return Math.random() - 0.5; });
  });
  const slope = [];
  rules.rows.forEach(function (row, r) {
    rules.columns.forEach(function (column, c) { slope.push(columns[c][r]); });
  });
  return slope;
}

// ---------------------------------------------------------------- the potion

function hasNightVision() {
  return player.backpack.indexOf(windyRules().potion) !== -1;
}

// Sips left in the potion you're carrying (a new potion has them all).
function sipsLeft() {
  if (!hasNightVision()) return 0;
  return player.windy.sips || windyRules().sips;
}

// Drink one sip. The last sip uses up the potion.
function sipNightVision() {
  const left = sipsLeft() - 1;
  player.windy.sips = left;
  if (left === 0) removeOne(player.backpack, windyRules().potion); // js/items.js
  writeSave(player);
}

function sipButton(label, onClick) {
  const button = document.createElement("button");
  button.className = "big-button";
  button.textContent = label + " (" + sipsLeft() + " sip" + (sipsLeft() === 1 ? "" : "s") + " left)";
  button.addEventListener("click", onClick);
  return button;
}

// ---------------------------------------------------------------- the binoculars

// Windy Peak's "Look down" spot. During the rescue, a sip of Night Vision
// Potion shows where the little WIT is. Otherwise it's the usual view.
function windyLook(spot) {
  const stage = player.windy.stage;
  if (stage !== "lost" && stage !== "spotted") return false;
  const words = windyRules().words;
  const body = openInfoPanel("🔭", spot.name, hasNightVision() ? words.lookAsk : words.noPotion);
  body.appendChild(binocularLens(spot, false));
  if (hasNightVision()) body.appendChild(sipButton("🌙 Sip and look", function () { showClue(spot); }));
  return true;
}

function showClue(spot) {
  sipNightVision();
  const rules = windyRules();
  const state = player.windy;
  const landmark = rules.landmarks[state.slope[state.spot]];
  const side = rules.sides[state.spot % rules.columns.length];
  state.stage = "spotted";
  writeSave(player);
  const body = openInfoPanel("🔭", spot.name,
    rules.words.clue.replace("LANDMARK", landmark.emoji + " " + landmark.name).replace("SIDE", side));
  body.appendChild(binocularLens(spot, landmark));
}

// The round binocular view. With night vision it glows green and shows the
// landmark with the little WIT's lantern next to it.
function binocularLens(spot, landmark) {
  const lens = document.createElement("div");
  lens.className = "binocular-view" + (landmark ? " night-vision" : " night");
  const view = document.createElement("img");
  view.src = picture(spot.picture);
  view.alt = spot.name;
  lens.appendChild(view);
  if (landmark) {
    const seen = document.createElement("div");
    seen.className = "night-clue";
    seen.textContent = landmark.emoji + " 🏮";
    lens.appendChild(seen);
  }
  return lens;
}

// ---------------------------------------------------------------- the slope

// Windy Peak's "Ski down" spot: during the rescue it shows the slope map.
function windySkiDown(spot) {
  if (player.windy.stage !== "spotted") return goTo(spot.to);
  openSlope("");
}

function openSlope(message) {
  const rules = windyRules();
  const state = player.windy;
  const body = openInfoPanel("⛷️", "The Slope at Night", message || windyWords(rules.words.slopeAsk));
  const slope = document.createElement("div");
  slope.className = "slope-map";
  rules.columns.forEach(function (column) {
    slope.appendChild(Object.assign(document.createElement("b"), { textContent: column }));
  });
  state.slope.forEach(function (landmarkIndex, i) {
    const section = document.createElement("button");
    section.className = "slope-section";
    const looked = state.looked.indexOf(i) !== -1;
    section.textContent = rules.landmarks[landmarkIndex].emoji + (looked ? " ✖️" : "");
    section.title = rules.rows[Math.floor(i / rules.columns.length)] + ", " + rules.columns[i % rules.columns.length];
    section.disabled = looked || !hasNightVision();
    section.addEventListener("click", function () { lookInSection(i); });
    slope.appendChild(section);
  });
  body.appendChild(slope);
  if (!hasNightVision()) body.appendChild(document.createTextNode(rules.words.outOfSips));
  const hut = document.createElement("button");
  hut.className = "big-button secondary";
  hut.textContent = "⛷️ Just ski to the Snowy Hut";
  hut.addEventListener("click", function () { document.getElementById("info-panel").hidden = true; goTo(rules.hut); });
  body.appendChild(hut);
}

// One look into a section of the slope: a sip, and one of your tries.
function lookInSection(i) {
  const rules = windyRules();
  const state = player.windy;
  sipNightVision();
  const landmark = rules.landmarks[state.slope[i]];
  if (i === state.spot) return foundLittleWit(landmark);
  state.tries++;
  state.looked.push(i);
  writeSave(player);
  const said = rules.words.nothing.replace("LANDMARK", landmark.emoji + " " + landmark.name);
  if (state.tries >= rules.tries) {
    startWindyRescue(); // the little WIT wanders somewhere new
    return openInfoPanel(windyArt(), "Wandered Off", said + " " + rules.words.wandered +
      (hasNightVision() ? "" : " " + rules.words.outOfSips));
  }
  openSlope(said + " " + windyWords(rules.words.slopeAsk));
}

function foundLittleWit(landmark) {
  const rules = windyRules();
  player.windy.stage = "found";
  writeSave(player);
  const body = openInfoPanel(windyArt(), "Found!", rules.words.found.replace("LANDMARK", landmark.emoji + " " + landmark.name));
  const ski = document.createElement("button");
  ski.className = "big-button";
  ski.textContent = rules.words.skiTogether;
  ski.addEventListener("click", function () {
    document.getElementById("info-panel").hidden = true;
    goTo(rules.hut);
  });
  body.appendChild(ski);
}

// ---------------------------------------------------------------- the Snowy Hut

// Called by showPlace: arriving at the Snowy Hut with the little WIT.
function windyArrive(place) {
  if (place.id !== windyRules().hut || player.windy.stage !== "found") return;
  const words = windyRules().words;
  const body = openInfoPanel(windyArt(), "Snowy Hut", words.warmAsk);
  const drink = document.createElement("button");
  drink.className = "big-button";
  drink.textContent = words.drink;
  drink.addEventListener("click", warmUpTogether);
  body.appendChild(drink);
}

function warmUpTogether() {
  const rules = windyRules();
  player.adventurePoints += rules.adventurePoints;
  player.windy.done++;
  player.windy.stage = ""; // the owl can spot another lost WIT next time
  writeSave(player);
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
