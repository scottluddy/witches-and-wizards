// Lost on Windy Peak (Scott, 2026-10-15): a rescue adventure. The numbers
// and words are in data/windy.js. Scott wants it to be figured out, not
// told: there are few instructions on purpose.
//
// player.windy.stage says how far along you are:
//   ""         not started (let your Snowy Owl fly while you own a Night Vision Potion)
//   "lost"     the owl spotted a little WIT somewhere on the ski slope
//   "search"   you skied to the right spot: it's magnified, now find the exact spot
//   "found"    you found them: click them to ski down together
//   "cold"     in the Snowy Hut, standing and shivering
//   "sitting"  sitting on the couch
//   "covered"  under the blanket, ready for the hot chocolate
// player.windy.seeing is true after a sip, until it's used (a binocular look
// or an owl flight).

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

// Start (or start again): the little WIT is lost somewhere on the slope.
function startWindyRescue() {
  const rules = windyRules();
  player.windy.stage = "lost";
  player.windy.who = randomLittleWit(); // which little WIT is lost (js/game.js)
  player.windy.at = randomSlopeSpot(); // where on the slope they are (percent of the picture)
  player.windy.view = null;            // the zoomed-in view around where you skied to
  player.windy.wit = null;             // where they are in that view
  player.windy.tries = 0;
  player.windy.looked = [];
  player.windy.searched = [];
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

// The 🌙 Sip button on the potion in your backpack (only while you're
// looking for the little WIT, so sips aren't wasted).
function nightVisionButton(item) {
  const stage = player.windy.stage;
  if (stage !== "lost" && stage !== "search") return document.createTextNode("");
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

// One sip: you can see in the dark until you use it (a binocular look, or
// watching the owl fly over the magnified section). The last sip uses up the potion.
function sipNightVision() {
  drinkSip();
  if (player.at === windyRules().slope) showSlope(false);
}

function drinkSip() {
  const left = sipsLeft() - 1;
  player.windy.sips = left;
  player.windy.seeing = true;
  if (left === 0) removeOne(player.backpack, windyRules().potion); // js/items.js
  writeSave(player);
  document.getElementById("place-description").textContent = windyRules().words.sipped;
}

// Uses up the sip. Returns whether you could see.
function useSip() {
  const could = player.windy.seeing;
  player.windy.seeing = false;
  writeSave(player);
  return could;
}

// ---------------------------------------------------------------- the binoculars

// Windy Peak's "Binocular View" spot. During the rescue it shows a blown-up view
// of the ski slope: too dark to see, unless you've had a sip. Then you can see
// the little WIT in their lantern's glow: remember where, then ski down there.
function windyLook(spot) {
  if (player.windy.stage !== "lost") return false;
  if (!player.windy.at) startWindyRescue(); // older saves (the slope had 12 sections)
  const rules = windyRules();
  const seeing = useSip();
  openInfoPanel("🔭", spot.name, seeing ? "" : rules.words.tooDark);
  const lens = document.createElement("div");
  lens.className = "binocular-view slope-view " + (seeing ? "night-vision" : "night");
  const view = document.createElement("img");
  view.src = picture("place_" + rules.slope);
  view.alt = "The ski slope";
  lens.appendChild(view);
  if (seeing) {
    const glow = document.createElement("span");
    glow.className = "slope-glow";
    glow.style.left = player.windy.at.x + "%";
    glow.style.top = player.windy.at.y + "%";
    glow.style.width = rules.glowSize + "%";
    lens.appendChild(glow);
    lens.appendChild(binocularWit(player.windy.at)); // Scott, 2026-10-18: you can see the little WIT on the slope
  }
  document.getElementById("info-body").appendChild(lens);
  return true;
}

// The little WIT, tiny in the middle of their lantern's glow.
function binocularWit(at) {
  const wit = document.createElement("span");
  wit.className = "binocular-wit";
  wit.style.left = at.x + "%";
  wit.style.top = at.y + "%";
  wit.style.height = windyRules().binocularWit + "%";
  const art = windyArt();
  if (typeof art === "string") wit.textContent = art;
  else wit.appendChild(art);
  return wit;
}

// ---------------------------------------------------------------- the slope's shape

// Is this point (percent of the slope picture) on the snowy slope, not the
// mountains either side? "slopeShape" in data/windy.js is its outline.
function onSlope(at) {
  const shape = windyRules().slopeShape;
  let inside = false;
  for (let i = 0, j = shape.length - 1; i < shape.length; j = i++) {
    const a = shape[i], b = shape[j];
    if ((a[1] > at.y) !== (b[1] > at.y) && at.x < (b[0] - a[0]) * (at.y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

// A random spot on the slope for the little WIT: not right at the top where you
// start, and not hugging the edge, so the zoomed-in view always has snow around them.
function randomSlopeSpot() {
  const rules = windyRules();
  let at;
  do {
    at = { x: 5 + Math.random() * 90, y: rules.lostFrom + Math.random() * (95 - rules.lostFrom) };
  } while (!onSlope(at) || !onSlope({ x: at.x - 4, y: at.y }) || !onSlope({ x: at.x + 4, y: at.y }));
  return at;
}

// How big the zoomed-in view is, in percent of the picture's width (and of its
// height: it keeps the picture's shape), so it covers "viewShare" of the slope.
function viewSize() {
  const shape = windyRules().slopeShape;
  let area = 0; // the slope's area, in percent × percent (the shoelace formula)
  for (let i = 0, j = shape.length - 1; i < shape.length; j = i++) {
    area += (shape[j][0] + shape[i][0]) * (shape[j][1] - shape[i][1]);
  }
  return Math.sqrt(Math.abs(area) / 2 * windyRules().viewShare);
}

// The zoomed-in view around a spot you skied to: left, top and size in percent
// of the picture, kept inside the picture.
function viewAround(at) {
  const size = viewSize();
  const edge = function (middle) { return Math.max(0, Math.min(100 - size, middle - size / 2)); };
  return { x: edge(at.x), y: edge(at.y), size: size };
}

// Where a picture point is inside the zoomed-in view (percent of the view).
function inView(at, view) {
  return { x: (at.x - view.x) / view.size * 100, y: (at.y - view.y) / view.size * 100 };
}

// ---------------------------------------------------------------- the slope

// Windy Peak's "Ski down" spot: onto the dark slope during the rescue,
// otherwise a ride down the slope to the Snowy Hut (showWindy starts it).
function windySkiDown(spot) {
  // No skis, no skiing (Scott, 2026-10-18): rent them at the Ski Reserve.
  if (spot.needsItem && player.backpack.indexOf(spot.needsItem) === -1) return sayWindy(spot.withoutIt);
  goTo(windyRules().slope);
}

// Searching the slope for the little WIT (the rest of the time the slope is a ride).
function searchingSlope() {
  const stage = player.windy.stage;
  return stage === "lost" || stage === "search" || stage === "found";
}

// At the bottom (the Snowy Hut) the rented skis go back to the Ski Reserve.
function giveSkisBack() {
  const spot = GAME_DATA.places.find(function (p) { return p.type === "ski_down" && p.needsItem; });
  if (!spot || player.backpack.indexOf(spot.needsItem) === -1) return;
  removeOne(player.backpack, spot.needsItem); // js/items.js
  writeSave(player);
  const words = document.getElementById("place-description");
  words.textContent = (words.textContent ? words.textContent + " " : "") + spot.afterwards;
}

// Called by showPlace (and after furniture moves): the dark slope, or the
// Snowy Hut's mug, blanket and the little WIT.
function showWindy(place) {
  const box = document.getElementById("place-windy");
  const image = document.getElementById("place-image");
  box.innerHTML = "";
  image.classList.remove("night", "night-vision");
  const rules = windyRules();
  box.hidden = !place || (place.id !== rules.slope && place.id !== rules.hut);
  if (box.hidden) return;
  if (place.id !== rules.slope) showHut();
  else if (searchingSlope()) showSlope(false);
  else startSkiRide(player.windy.stage === "cold"); // "cold": the little WIT skis with you
}

function sayWindy(text) {
  document.getElementById("place-description").textContent = text;
}

// The dark slope to click on, or the zoomed-in view around where you skied to.
// "grow" makes the view grow to fill the picture.
function showSlope(grow) {
  const rules = windyRules();
  const state = player.windy;
  if (!state.at || (state.stage !== "lost" && !state.view)) startWindyRescue(); // older saves (12 sections)
  const box = document.getElementById("place-windy");
  box.innerHTML = "";
  document.getElementById("place-image").classList.add("night");
  if (state.stage === "lost") {
    box.appendChild(darkSlope());
    box.appendChild(skierAtTop());
    return sayWindy(rules.words.choose + " " + "🔦".repeat(rules.tries - state.tries));
  }
  box.appendChild(magnifiedSection(grow));
  sayWindy(state.stage === "search" ? rules.words.searchHere + " " + "🔦".repeat(rules.searches - state.searched.length) : "");
}

// The whole dark slope: click where you saw the little WIT. Spots you already
// skied to are crossed off.
function darkSlope() {
  const slope = document.createElement("div");
  slope.className = "dark-slope";
  player.windy.looked.forEach(function (at) { slope.appendChild(searchMark(at)); });
  slope.addEventListener("click", function (event) {
    const r = slope.getBoundingClientRect();
    chooseSpot({ x: (event.clientX - r.left) / r.width * 100, y: (event.clientY - r.top) / r.height * 100 });
  });
  return slope;
}

// Clicking the dark slope (Scott, 2026-10-21): you ski down to that exact spot.
// If the little WIT is close enough to be in the view around it, it zooms in;
// if not it's "Not here..." and you're back at the top to ski again.
function chooseSpot(at) {
  const rules = windyRules();
  const state = player.windy;
  if (document.querySelector(".dark-slope.skiing")) return; // already on your way
  if (!onSlope(at)) return sayWindy(rules.words.offSlope);
  const view = viewAround(at);
  const wit = inView(state.at, view);
  const margin = rules.viewMargin;
  const found = wit.x > margin && wit.x < 100 - margin && wit.y > margin && wit.y < 100 - margin;
  if (found) {
    state.stage = "search";
    state.view = view;
    state.wit = wit;
    state.searched = [];
    writeSave(player);
    return skiToSpot(at, function () { showSlope(true); });
  }
  state.tries++;
  state.looked.push({ x: Math.round(at.x), y: Math.round(at.y) });
  const wandered = state.tries >= rules.tries;
  if (wandered) startWindyRescue(); // they wander somewhere new: look through the binoculars again
  writeSave(player);
  skiToSpot(at, function () {
    sayWindy(wandered ? rules.words.wandered : rules.words.missed + " " + "🔦".repeat(rules.tries - state.tries));
    setTimeout(function () {
      if (player.at !== rules.slope || player.windy.stage !== "lost") return;
      const said = document.getElementById("place-description").textContent;
      showSlope(false);
      sayWindy(said); // keep the "Not here..." words while you choose again
    }, 1500);
  });
}

// You, on skis, waiting at the top of the slope.
function skierAtTop() {
  const you = makeSkier(characterPicture(findCharacter(player.characterId)), "You");
  const start = windyRules().skiTo.start;
  placeSkier(you, 0, 1, [start, start]);
  return you;
}

// Ski from the top down to a spot, weaving side to side, then "arrived".
// Further down takes longer, so the speed stays about the same.
function skiToSpot(at, arrived) {
  const rules = windyRules();
  const box = document.getElementById("place-windy");
  const you = box.querySelector(".skier") || box.appendChild(skierAtTop());
  box.querySelector(".dark-slope").classList.add("skiing"); // no choosing while you ski
  sayWindy(rules.words.skiing);
  const path = pathToSpot(at);
  const seconds = rules.skiTo.seconds * (0.4 + 0.6 * at.y / 100);
  const thisRide = ++skiRide;
  const start = performance.now();
  function glide(now) {
    if (thisRide !== skiRide || !you.isConnected || player.at !== rules.slope) return; // you left the slope
    const done = Math.min((now - start) / (seconds * 1000), 1);
    placeSkier(you, done, 1, path);
    if (done < 1) return requestAnimationFrame(glide);
    setTimeout(arrived, 400); // a moment to see where you stopped
  }
  requestAnimationFrame(glide);
}

// The way down to a spot: from the top, swinging left and right, kept on the slope.
function pathToSpot(end) {
  const rules = windyRules();
  const start = rules.skiTo.start;
  const turns = Math.max(2, Math.round((end.y - start[1]) / 12));
  const path = [start];
  for (let i = 1; i < turns; i++) {
    const part = i / turns;
    const swing = i % 2 ? rules.skiTo.weave : -rules.skiTo.weave;
    const point = { x: start[0] + (end.x - start[0]) * part, y: start[1] + (end.y - start[1]) * part };
    if (onSlope({ x: point.x + swing, y: point.y })) point.x += swing;
    path.push([point.x, point.y]);
  }
  path.push([end.x, end.y]);
  return path;
}

// The view around where you skied to, magnified to fill the picture: the slope
// picture is drawn bigger and slid so only that part shows.
function magnifiedSection(grow) {
  const rules = windyRules();
  const state = player.windy;
  const view = state.view;
  const zoom = document.createElement("div");
  zoom.className = "slope-zoom night";
  const img = document.createElement("img");
  img.src = picture("place_" + rules.slope);
  img.alt = "";
  img.style.width = 10000 / view.size + "%";
  img.style.height = 10000 / view.size + "%";
  img.style.left = -view.x / view.size * 100 + "%";
  img.style.top = -view.y / view.size * 100 + "%";
  zoom.appendChild(img);
  state.searched.forEach(function (at) { zoom.appendChild(searchMark(at)); });
  zoom.appendChild(skierInSection());
  if (state.stage === "search") zoom.append(perchedOwl(), potionBeside(zoom));

  if (state.stage === "found") zoom.appendChild(littleWitButton());
  else zoom.addEventListener("click", function (event) { searchHere(event, zoom); });

  if (grow) {
    // Start at the view's size and place, then grow to the whole picture (a CSS transition).
    zoom.style.transition = "none";
    setBox(zoom, view.x, view.y, view.size, view.size);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        zoom.style.transition = "";
        zoom.style.transitionDuration = rules.zoomSeconds + "s";
        setBox(zoom, 0, 0, 100, 100);
      });
    });
    if (state.seeing) setTimeout(function () { flyOwl(zoom); }, rules.zoomSeconds * 1000);
  } else {
    setBox(zoom, 0, 0, 100, 100);
    if (state.seeing && state.stage === "search") setTimeout(function () { flyOwl(zoom); }, 300);
  }
  return zoom;
}

// You, standing on your skis in a bottom corner of the zoomed-in view: the
// corner further from the little WIT, so you never stand in front of them.
function skierInSection() {
  const corner = windyRules().skiTo.corner;
  const you = makeSkier(characterPicture(findCharacter(player.characterId)), "You");
  you.classList.add("in-section");
  you.style.left = (player.windy.wit.x < 50 ? 100 - corner.x : corner.x) + "%";
  you.style.top = corner.y + "%";
  you.style.height = corner.size + "%";
  you.style.fontSize = corner.size * 0.8 + "cqh";
  return you;
}

// Beside you in the zoomed-in view (Scott, 2026-10-21): your Snowy Owl, ready
// to fly, and the Night Vision Potion. Click the potion to take a sip and send
// the owl flying. "beside" in data/windy.js says how far in from you each one
// stands (percent of the view) and how tall it is.
function besideYou(what) {
  const rules = windyRules();
  const step = rules.skiTo.beside[what];
  const left = player.windy.wit.x >= 50; // you're in the bottom-left corner
  const x = left ? rules.skiTo.corner.x + step.x : 100 - rules.skiTo.corner.x - step.x;
  return { x: x, y: rules.skiTo.corner.y, height: step.height };
}

function placeBeside(el, what) {
  const at = besideYou(what);
  el.style.left = at.x + "%";
  el.style.top = at.y + "%";
  el.style.height = at.height + "%";
  el.style.fontSize = at.height * 0.8 + "cqh"; // the emoji, if there's no drawing
}

function perchedOwl() {
  const owl = document.createElement("span");
  owl.className = "perched-owl";
  owl.appendChild(drawingOr(windyRules().owl, "🦉", "Snowy Owl"));
  placeBeside(owl, "owl");
  return owl;
}

function potionBeside(zoom) {
  const rules = windyRules();
  const potion = document.createElement("button");
  potion.className = "potion-beside";
  potion.title = "Night Vision Potion: take a sip";
  potion.hidden = !hasNightVision() && !player.windy.seeing;
  potion.appendChild(drawingOr(rules.potion, "🌙", "Night Vision Potion"));
  placeBeside(potion, "potion");
  potion.addEventListener("click", function (event) {
    event.stopPropagation(); // not a search click on the snow
    if (zoom.classList.contains("owl-flying") || potion.classList.contains("sipping")) return;
    if (player.windy.seeing) return flyOwl(zoom); // already sipped (from the backpack)
    // Tip the bottle up to your mouth, glug, then the owl takes off.
    const view = zoom.getBoundingClientRect();
    const you = windyRules().skiTo.corner;
    const across = (besideYou("potion").x > 50 ? 1 : -1) * rules.skiTo.beside.potion.x; // towards you
    potion.style.setProperty("--to-you", across / 100 * view.width * 0.85 + "px");
    potion.style.setProperty("--up", you.size * 0.7 / 100 * view.height + "px");
    potion.style.setProperty("--tip", across > 0 ? 1 : -1);
    potion.style.setProperty("--sip", rules.sipSeconds + "s");
    potion.classList.add("sipping");
    setTimeout(function () {
      potion.classList.remove("sipping");
      drinkSip();
      if (!hasNightVision()) potion.hidden = true; // that was the last sip
      flyOwl(zoom);
    }, rules.sipSeconds * 1000);
  });
  return potion;
}

// A drawing as an <img>, or an emoji if it isn't drawn yet.
function drawingOr(name, emoji, alt) {
  if (!isDrawn(name)) return document.createTextNode(emoji);
  const img = document.createElement("img");
  img.src = picture(name);
  img.alt = alt;
  img.draggable = false;
  return img;
}

function setBox(el, left, top, width, height) {
  el.style.left = left + "%";
  el.style.top = top + "%";
  el.style.width = width + "%";
  el.style.height = height + "%";
}

function searchMark(at) {
  const mark = document.createElement("span");
  mark.className = "search-mark";
  mark.textContent = "✖️";
  mark.style.left = at.x + "%";
  mark.style.top = at.y + "%";
  return mark;
}

// The width of the magnified section divided by its height, to turn
// up-and-down percents into across percents for measuring distances.
function zoomShape(zoom) {
  const r = zoom.getBoundingClientRect();
  return r.width / r.height;
}

// The Snowy Owl flies straight across the magnified section, through the
// little WIT's spot. As it passes them, a spot bigger than the little WIT
// lights up for a moment, somewhere around them. Uses up the sip.
function flyOwl(zoom) {
  const rules = windyRules();
  const wit = player.windy.wit;
  if (!useSip() || !zoom.isConnected) return;
  const shape = zoomShape(zoom);
  let angle = Math.random() * Math.PI * 2;
  const perch = zoom.querySelector(".perched-owl"); // your owl beside you takes off from there
  const owl = document.createElement("span");
  owl.className = "flying-owl";
  if (isDrawn(rules.owl)) {
    const img = document.createElement("img");
    img.src = picture(rules.owl);
    img.alt = "Snowy Owl";
    owl.appendChild(img);
  } else owl.textContent = "🦉";
  let from = { x: wit.x - Math.cos(angle) * 90, y: wit.y - Math.sin(angle) * 90 * shape };
  if (perch) {
    // Straight from its perch over the little WIT and on out of sight (twice as far).
    const at = besideYou("owl");
    from = { x: at.x, y: at.y - at.height / 2 };
    angle = Math.atan2(wit.y - from.y, wit.x - from.x);
    perch.style.visibility = "hidden";
  }
  const to = { x: 2 * wit.x - from.x, y: 2 * wit.y - from.y };
  owl.style.left = from.x + "%";
  owl.style.top = from.y + "%";
  owl.style.transitionDuration = rules.flySeconds + "s";
  if (Math.cos(angle) < 0) owl.classList.add("facing-left");
  zoom.appendChild(owl);
  zoom.classList.replace("night", "night-vision"); // you can see while the owl flies over
  zoom.classList.add("owl-flying");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      owl.style.left = to.x + "%";
      owl.style.top = to.y + "%";
    });
  });
  setTimeout(function () { lightUp(zoom, shape); }, rules.flySeconds * 500); // halfway: right over them
  setTimeout(function () {
    owl.remove();
    zoom.classList.replace("night-vision", "night");
    zoom.classList.remove("owl-flying");
    if (perch) perch.style.visibility = ""; // back beside you
  }, rules.flySeconds * 1000);
}

// A spot lights up around the little WIT, never centred on them: they're
// somewhere near its edge, a different side each flight. So one flight only
// narrows it down, and where two or three lit spots overlap is the place to look.
function lightUp(zoom, shape) {
  const rules = windyRules();
  const wit = player.windy.wit;
  const farthest = (rules.lightSize - rules.witSize) / 2;
  const away = farthest * (rules.offCentre + Math.random() * (1 - rules.offCentre));
  const angle = Math.random() * Math.PI * 2;
  const light = document.createElement("span");
  light.className = "owl-light";
  light.style.width = rules.lightSize + "%";
  light.style.left = wit.x + Math.cos(angle) * away + "%";
  light.style.top = wit.y + Math.sin(angle) * away * shape + "%";
  light.style.animationDuration = rules.lightSeconds + "s";
  zoom.appendChild(light);
  setTimeout(function () { light.remove(); }, rules.lightSeconds * 1000);
}

// A click in the magnified section: close enough to the little WIT finds them.
function searchHere(event, zoom) {
  const rules = windyRules();
  const state = player.windy;
  const r = zoom.getBoundingClientRect();
  const at = { x: (event.clientX - r.left) / r.width * 100, y: (event.clientY - r.top) / r.height * 100 };
  const distance = Math.hypot(at.x - state.wit.x, (at.y - state.wit.y) / zoomShape(zoom));
  if (distance <= rules.findDistance) {
    state.stage = "found";
    writeSave(player);
    return showSlope(false);
  }
  state.searched.push({ x: Math.round(at.x), y: Math.round(at.y) });
  writeSave(player);
  if (state.searched.length >= rules.searches) {
    startWindyRescue();
    showSlope(false);
    return sayWindy(rules.words.wandered);
  }
  zoom.appendChild(searchMark(at));
  sayWindy(rules.words.notThere + " " + "🔦".repeat(rules.searches - state.searched.length));
}

// The little WIT, found: click them to ski down together.
function littleWitButton() {
  const wit = document.createElement("span");
  wit.className = "little-wit";
  wit.style.left = player.windy.wit.x + "%";
  wit.style.top = player.windy.wit.y + "%";
  wit.style.width = windyRules().witSize + "%";
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
  showWindy(findPlace(windyRules().slope)); // the ride down, together
}

// ---------------------------------------------------------------- the ride down

// Scott, 2026-10-18: skiing down shows you on skis gliding down the girls'
// Ski Slope drawing, weaving between the trees, then you're at the Snowy Hut.
// The way down is "path" in data/windy.js; ski past a drawn gem to pick it up.

let skiRide = 0; // counts rides, so an old ride stops if a new one starts

function startSkiRide(together) {
  const ride = windyRules().ride;
  const box = document.getElementById("place-windy");
  const thisRide = ++skiRide;
  const you = makeSkier(characterPicture(findCharacter(player.characterId)), "You");
  box.appendChild(you);
  const friend = together ? makeSkier(littleWitPicture(), "Little WIT") : null;
  if (friend) box.appendChild(friend);
  sayWindy(together ? ride.words.together : ride.words.start);
  const gemsLeft = ride.gems.slice();
  let found = 0;
  const start = performance.now();
  function glide(now) {
    if (thisRide !== skiRide || player.at !== windyRules().slope) return; // you left the slope
    const done = Math.min((now - start) / (ride.seconds * 1000), 1);
    const at = placeSkier(you, done, 1);
    if (friend) placeSkier(friend, Math.max(done - 0.07, 0), 0.5); // just behind you, half your size
    gemsLeft.slice().forEach(function (gem) {
      if (Math.hypot(gem[0] - at.x, gem[1] - at.y) > ride.reach) return;
      gemsLeft.splice(gemsLeft.indexOf(gem), 1);
      found++;
      pickUpSlopeGem(box, gem);
    });
    if (done < 1) return requestAnimationFrame(glide);
    endSkiRide(found);
  }
  requestAnimationFrame(glide);
}

// You (or the little WIT) on a pair of skis. An empty picture is the 🧒 emoji.
function makeSkier(src, name) {
  const skier = document.createElement("div");
  skier.className = "skier";
  if (src) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = name;
    skier.appendChild(img);
  } else skier.textContent = windyRules().lostWit;
  const skis = document.createElement("span");
  skis.className = "skis";
  skier.appendChild(skis);
  return skier;
}

// Put a skier where they are "done" of the way down (0 = top, 1 = bottom):
// bigger as they come closer, leaning into each turn. Returns where their feet are.
// "path" is the way down (the ride's, unless another is given).
function placeSkier(skier, done, scale, path) {
  const ride = windyRules().ride;
  const at = pointOnPath(done, path);
  const ahead = pointOnPath(Math.min(done + 0.01, 1), path);
  const lean = Math.max(-20, Math.min(20, (ahead.x - at.x) * 15));
  const size = ride.sizeTop + (ride.sizeBottom - ride.sizeTop) * Math.min(at.y, 100) / 100;
  skier.style.left = at.x + "%";
  skier.style.top = at.y + "%";
  skier.style.height = size * scale + "%";
  skier.style.fontSize = size * scale * 0.8 + "cqh"; // the 🧒 emoji, until a little WIT is drawn
  skier.style.transform = "translate(-50%, -100%) rotate(" + lean + "deg)";
  return at;
}

// The point "done" of the way along the path (measured along its length, so the speed stays even).
function pointOnPath(done, path) {
  path = path || windyRules().ride.path;
  const lengths = [];
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    lengths.push(Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
    total += lengths[i - 1];
  }
  let left = done * total;
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i] || i === lengths.length - 1) {
      const part = lengths[i] ? Math.min(left / lengths[i], 1) : 0;
      return { x: path[i][0] + (path[i + 1][0] - path[i][0]) * part,
               y: path[i][1] + (path[i + 1][1] - path[i][1]) * part };
    }
    left -= lengths[i];
  }
}

// Skiing past one of the drawn gems: +1 gem, with a little "+1 gem!" floating up.
function pickUpSlopeGem(box, gem) {
  player.gems += 1;
  writeSave(player);
  updateStatus();
  const pop = document.createElement("span");
  pop.className = "slope-gem-pop";
  pop.textContent = windyRules().ride.words.gem;
  pop.style.left = gem[0] + "%";
  pop.style.top = gem[1] + "%";
  box.appendChild(pop);
  setTimeout(function () { pop.remove(); }, 1500);
}

// At the bottom: the Snowy Hut, and the skis go back.
function endSkiRide(found) {
  goTo(windyRules().hut);
  if (found) {
    const words = document.getElementById("place-description");
    words.textContent = (words.textContent ? words.textContent + " " : "") +
      "💎 You picked up " + found + " gem" + (found === 1 ? "" : "s") + " on the way down!";
  }
  giveSkisBack();
}

// ---------------------------------------------------------------- the Snowy Hut

// The hut's mug on the Snack Table and blanket over the couch, and during
// the rescue the little WIT. Nothing tells you what to do: drag the little
// WIT onto the couch, the blanket onto them, then the mug.
function showHut() {
  const rules = windyRules();
  const stage = player.windy.stage;
  const box = document.getElementById("place-windy");
  const mug = hutThing(rules.mug, "hut-mug", "☕");
  const blanket = hutThing(rules.blanket, "hut-blanket", "");
  box.append(mug, blanket);
  if (stage !== "cold" && stage !== "sitting" && stage !== "covered") return blanketForYou(blanket, box);

  const wit = showColdWit(box);
  if (stage === "cold") {
    dragThing(wit, box, function (event) {
      if (!overCouch(event)) return false;
      player.windy.stage = "sitting";
      writeSave(player);
      shuffleOver(); // if you're on the couch, you make room
      showWindy(findPlace(rules.hut));
      return true;
    });
  }
  if (stage === "covered") {
    // The blanket is over them now.
    coverWith(blanket, wit, box);
  } else {
    dragThing(blanket, box, function (event) {
      if (!overThing(wit, event)) return false;
      if (player.windy.stage !== "sitting") { witSays(wit, rules.words.slips); return false; }
      player.windy.stage = "covered";
      writeSave(player);
      showWindy(findPlace(rules.hut));
      return true;
    });
  }
  dragThing(mug, box, function (event) {
    if (!overThing(wit, event)) return false;
    if (player.windy.stage !== "covered") { witSays(wit, rules.words.shaky); return false; }
    warmUpTogether();
    return true;
  });
}

// When there's no little WIT to warm up, the blanket is yours (Scott,
// 2026-10-18): sit down on the couch or a chair, then drag the blanket onto you.
function blanketForYou(blanket, box) {
  const you = youNow.el; // js/you.js
  if (!you) return;
  if (youNow.covered) return coverWith(blanket, you, box);
  dragThing(blanket, box, function (event) {
    if (!overThing(you, event)) return false;
    if (!youSitting()) { sayWindy(windyRules().words.youSitFirst); return false; }
    youNow.covered = true;
    sayWindy(windyRules().words.youCovered);
    showWindy(findPlace(windyRules().hut));
    return true;
  });
}

// The blanket over someone's lap, sized to fit them. Their height is in percent
// of the picture's height, the blanket's width in percent of its width, so
// "shape" turns one into the other.
function coverWith(blanket, sitter, box) {
  const size = parseFloat(sitter.style.height);
  const pic = box.getBoundingClientRect();
  const shape = pic.width ? pic.height / pic.width : 0.66;
  blanket.classList.add("covering");
  blanket.style.left = sitter.style.left;
  blanket.style.top = parseFloat(sitter.style.top) - size * 0.22 + "%";
  blanket.style.width = size * 0.42 * shape + "%";
}

// Is the little WIT sitting on this piece of furniture? (for sharing a couch, js/you.js)
function othersSittingOn(pieceId) {
  const stage = player.windy.stage;
  const sitting = player.at === windyRules().hut && (stage === "sitting" || stage === "covered");
  return sitting && windyRules().seat.on === pieceId ? 1 : 0;
}

// The little WIT sat down or got up: if you're on the couch, you move over or back to the middle.
function shuffleOver() {
  const couch = witCouch();
  if (couch) youFollowFurniture(couch); // js/you.js
}

// The couch the little WIT sits on, if it's cut out as movable furniture.
function witCouch() {
  const rules = windyRules();
  return roomPieces(rules.hut).find(function (p) { return p.id === rules.seat.on && p.seat; }) || null; // js/furniture.js
}

// The mug or the blanket, standing where its furniture is now.
function hutThing(spec, className, emoji) {
  const thing = document.createElement("span");
  thing.className = className;
  if (isDrawn(spec.picture)) {
    const img = document.createElement("img");
    img.src = picture(spec.picture);
    img.alt = "";
    img.draggable = false;
    thing.appendChild(img);
  } else if (emoji) thing.textContent = emoji;
  else thing.classList.add("placeholder"); // a plain plaid blanket until it's drawn
  thing.style.width = spec.width + "%";
  placeOnFurniture(thing, spec);
  return thing;
}

// Put something at x, y, shifted by however far its furniture has been moved.
// dataset keeps that place, for snapping back after a drag.
function placeOnFurniture(el, spec) {
  const moved = furnitureMoved(spec.on);
  el.dataset.x = spec.x + moved[0];
  el.dataset.y = spec.y + moved[1];
  el.style.left = el.dataset.x + "%";
  el.style.top = el.dataset.y + "%";
}

// How far a hut piece has been moved from where it was drawn: [across, down] in percent.
function furnitureMoved(pieceId) {
  const piece = (GAME_DATA.furniture || []).find(function (p) { return p.place === windyRules().hut && p.id === pieceId; });
  if (!piece || roomPieces(piece.place).indexOf(piece) === -1) return [0, 0]; // js/furniture.js
  const drawn = GAME_DATA.furnitureBoxes[piece.place + "/" + piece.id];
  const now = pieceRect(piece);
  return [now[0] - drawn[0], now[1] - drawn[1]];
}

// The little WIT in the hut: standing and shivering, or sitting on the couch.
// Little WITs are always half the size of your character (Scott, 2026-10-18):
// half your size standing in the same spot, or sitting on the same couch.
function showColdWit(box) {
  const rules = windyRules();
  const stage = player.windy.stage;
  const wit = document.createElement("div");
  wit.className = "hut-wit" + (stage === "cold" ? " shivering" : "");
  let spot;
  const couch = witCouch();
  if (stage === "cold") spot = { x: rules.hutSpot.x, y: rules.hutSpot.y, size: movedHeight(rules.hutSpot.y) }; // js/you.js
  else if (couch) {
    // On the right if you're sitting there too, in the middle if not.
    const sharing = !!(youNow.on && youNow.on.piece === couch.id);
    spot = seatPlace(couch, 1, sharing);
    if (sharing) wit.classList.add("beside"); // their speech bubble leans away from you
    spot.size *= GAME_DATA.standing.movedSize; // your size sitting there (js/you.js sitYouAt)
  } else spot = { x: rules.seat.x, y: rules.seat.y, size: movedHeight(rules.seat.y) };
  wit.dataset.x = spot.x;
  wit.dataset.y = spot.y;
  wit.style.left = spot.x + "%";
  wit.style.top = spot.y + "%";
  wit.style.height = spot.size / 2 + "%";
  wit.style.setProperty("--height", spot.size / 2); // for the emoji's size (css/style.css)
  const bubble = document.createElement("span");
  bubble.className = "hut-wit-bubble";
  bubble.textContent = rules.words[stage];
  const art = windyArt();
  const face = document.createElement("span");
  face.className = "hut-wit-face";
  if (typeof art === "string") face.textContent = art;
  else face.appendChild(art);
  wit.append(bubble, face);
  box.appendChild(wit);
  return wit;
}

// The little WIT says something for a moment, then goes back to what they were saying.
function witSays(wit, text) {
  const bubble = wit.querySelector(".hut-wit-bubble");
  bubble.textContent = text;
  setTimeout(function () { bubble.textContent = windyRules().words[player.windy.stage] || ""; }, 2000);
}

function overThing(el, event) {
  const r = el.getBoundingClientRect();
  return event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
}

// Dropped on the couch? (the hut's pink couch is the "armchair" furniture piece)
function overCouch(event) {
  const couch = document.querySelector('#place-furniture .furniture[data-id="' + windyRules().seat.on + '"]');
  if (couch) return overThing(couch, event);
  // no cut-out furniture: near where the little WIT would sit
  const r = document.getElementById("place-windy").getBoundingClientRect();
  const seat = windyRules().seat;
  return Math.abs((event.clientX - r.left) / r.width * 100 - seat.x) < 12 &&
    Math.abs((event.clientY - r.top) / r.height * 100 - seat.y) < 12;
}

// Drag something with the mouse. "dropped" says whether the drop worked;
// if not, it goes back where it was.
function dragThing(el, box, dropped) {
  el.classList.add("draggable");
  el.addEventListener("pointerdown", function (event) {
    event.preventDefault();
    el.setPointerCapture(event.pointerId);
    el.classList.add("dragging");
  });
  el.addEventListener("pointermove", function (event) {
    if (!el.classList.contains("dragging")) return;
    const area = box.getBoundingClientRect();
    el.style.left = (event.clientX - area.left) / area.width * 100 + "%";
    el.style.top = (event.clientY - area.top) / area.height * 100 + "%";
  });
  el.addEventListener("pointerup", function (event) {
    if (!el.classList.contains("dragging")) return;
    el.classList.remove("dragging");
    el.style.pointerEvents = "none"; // so what's underneath can be found
    const worked = dropped(event);
    el.style.pointerEvents = "";
    if (worked || !el.isConnected) return;
    el.style.left = el.dataset.x + "%";
    el.style.top = el.dataset.y + "%";
  });
}

function warmUpTogether() {
  const rules = windyRules();
  player.adventurePoints += rules.adventurePoints;
  player.windy.done++;
  player.windy.stage = ""; // the owl can spot another lost WIT next time
  writeSave(player);
  shuffleOver(); // you get the couch to yourself again
  showWindy(findPlace(rules.hut)); // the mug and blanket go back
  openInfoPanel(celebrationArt("rescue", "☕🧒☕"), "Rescued!", // js/game.js
    rules.words.done.replace("POINTS", rules.adventurePoints));
}

// The lost little WIT's picture ("" if none is drawn), the same one all
// through a rescue. Older saves didn't keep one, so they pick one now.
function littleWitPicture() {
  if (!isDrawn(player.windy.who)) player.windy.who = randomLittleWit(); // js/game.js
  return player.windy.who ? picture(player.windy.who) : "";
}

// The lost little WIT's drawing, or an emoji if none is drawn.
function windyArt() {
  if (!littleWitPicture()) return windyRules().lostWit;
  const img = document.createElement("img");
  img.src = littleWitPicture();
  img.alt = "Little WIT";
  img.className = "info-picture";
  return img;
}
