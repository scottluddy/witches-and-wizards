// The Pixie Quest (Scott, 2026-10-13, a Quest since 2026-10-14). The numbers,
// riddles and clues are in data/pixie.js.
//
// 1. The Pixie hides in one of the Forest's places and flies to another every
//    few minutes. The troll stole her Golden Acorn. Give her a Crystal Fish
//    and she gives you a Finding Potion.
// 2. The troll hides in a Forest place and moves every couple of minutes. The
//    potion only works where he is: a sip anywhere else flashes up the map
//    to show where he's hiding. It has 4 sips (🎒 backpack).
// 3. Each riddle answered right gets you a piece of the troll's map.
// 4. Put the pieces in the right order: the Secret Pathway to the Pond House
//    appears on the Forest map.
// 5. Search inside the Pond House for the acorn. The fireplace lights up the
//    right part of the room, hot chocolate tells you warm or cold, the couch
//    has a note, and the Pond Turtle's shell glows when it's close. Found,
//    the acorn goes in your backpack.
// 6. Give the acorn back to the Pixie: the Quest is done (+1 Adventure Point).
// The pond has a turtle pet. Inside: s'mores to roast, hot chocolate, a couch.

// ---------------------------------------------------------------- the Pixie

// The Forest places she (and the troll) can hide in.
function pixiePlaces() {
  return placesIn(GAME_DATA.pixie.territory).filter(function (place) {
    return place.type === "place" && !place.opens && !place.secret;
  });
}

// Where she is right now. Time is cut into slots of "stayMinutes"; each slot
// gets its own made-up random number, so everyone sees her in the same place
// until the slot ends, and then she flies off somewhere else.
function pixieNow() {
  const slot = Math.floor(Date.now() / (GAME_DATA.pixie.stayMinutes * 60000));
  const places = pixiePlaces();
  const random = function (n) { return Math.abs(Math.sin(slot * 12.9898 + n * 78.233) * 43758.5453) % 1; };
  return {
    place: places[Math.floor(random(1) * places.length)].id,
    x: 15 + random(2) * 70,
    y: 25 + random(3) * 50
  };
}

// Called by showPlace for every place: shows the Pixie if she's here.
function showPixie(place) {
  const box = document.getElementById("place-pixie");
  box.innerHTML = "";
  showAcornHunt(place);
  potionBubbles(place);
  const now = pixieNow();
  box.hidden = place.id !== now.place || !adventureUnlocked("pixie"); // only once you've earned this adventure (js/adventures.js)
  if (box.hidden) return;
  const pixie = document.createElement("button");
  pixie.className = "pixie";
  pixie.style.left = now.x + "%";
  pixie.style.top = now.y + "%";
  pixie.style.width = GAME_DATA.pixie.size + "%";
  pixie.title = "Pixie";
  if (isDrawn("pixie")) {
    const img = document.createElement("img");
    img.src = picture("pixie");
    img.alt = "Pixie";
    pixie.appendChild(img);
  } else {
    pixie.textContent = "🧚";
  }
  pixie.addEventListener("click", meetPixie);
  box.appendChild(pixie);
}

// Where's the fish she wants? In the cooler you carry (where fish go) or the backpack.
function pixieFishBag() {
  const wants = GAME_DATA.pixie.wants;
  if (player.cooler.indexOf(wants) !== -1) return "cooler";
  if (player.backpack.indexOf(wants) !== -1) return "backpack";
  return null;
}

function meetPixie() {
  revealAdventure("pixie"); // you found her: the Adventures list shows its steps now (js/adventures.js)
  const rules = GAME_DATA.pixie;
  const quest = GAME_DATA.pixieQuest;
  const fish = findFish(rules.wants); // js/fishing.js
  const potion = findItem(rules.gives);
  if (carryingAcorn()) return offerAcorn();
  if (player.pixieQuest.hasAcorn) {
    return openInfoPanel("🧚", "Pixie", "\"You found my " + quest.treasure.name + "? Oh, please bring it to me in your backpack!\"");
  }
  if (owns(rules.gives)) {
    return openInfoPanel("🧚", "Pixie", "\"You have my " + potion.name + "! Drink it from your backpack and it will take you to the troll. Please find my " + quest.treasure.name + "!\"" + questProgress());
  }
  const bag = pixieFishBag();
  if (!bag) {
    return openInfoPanel("🧚", quest.name, "\"Boo hoo! The troll under the bridge stole my " + quest.treasure.name + " " + quest.treasure.emoji +
      " and hid it somewhere secret! I'm too hungry to look for it. Bring me a " + fish.name + " from the Lake and I'll give you a potion that finds the troll.\" (Hurry, she flies off somewhere else in the Forest every " + rules.stayMinutes + " minutes!)" + questProgress());
  }
  const body = openInfoPanel("🧚", quest.name, "\"Is that a " + fish.name + " in your " + bag + "? Give it to me and I'll give you a " + potion.name + ". It takes you to the troll who stole my " + quest.treasure.name + "!\"" + questProgress());
  const give = document.createElement("button");
  give.className = "big-button";
  give.textContent = "🐡 Give the " + fish.name;
  give.addEventListener("click", function () { givePixieFish(bag); });
  body.appendChild(give);
}

function givePixieFish(bag) {
  const rules = GAME_DATA.pixie;
  player[bag].splice(player[bag].indexOf(rules.wants), 1);
  if (bag === "cooler") forgetCatch(rules.wants); // js/storage.js: it can't become Sashimi Grade now
  player.backpack.push(rules.gives);
  player.pixieQuest.sips = potionSips();
  writeSave(player);
  openInfoPanel(itemArt(findItem(rules.gives)), "A Finding Potion!",
    "\"Yum! Thank you!\" The Pixie gives you a Finding Potion with " + potionSips() + " sips. " +
    "It only works where the troll is hiding, somewhere in the Forest. Take a sip anywhere else and you'll see a flash of where he is. Answer his riddles to get his map!");
}

// Sips in a new potion: fewer each time you've done the Quest, so doing it
// again is a little harder (Scott, 2026-10-14).
function potionSips() {
  const quest = GAME_DATA.pixieQuest;
  return Math.max(quest.fewestSips, quest.sips - quest.fewerSipsEachTime * player.pixieQuest.done);
}

// " (Map pieces: 2 of 3)" so you always know how far along the Quest is.
function questProgress() {
  const state = player.pixieQuest;
  const quest = GAME_DATA.pixieQuest;
  if (state.acornAt) return " (You have the whole map. Follow the Secret Pathway on the Forest map: the " + quest.treasure.name + " is hidden in the Pond House!)";
  if (state.pieces > 0) return " (Map pieces: " + state.pieces + " of " + quest.mapPieces + ")";
  return "";
}

function carryingAcorn() {
  return player.backpack.indexOf(GAME_DATA.pixieQuest.treasure.item) !== -1;
}

// Back at the Pixie with her acorn: a button to give it to her.
function offerAcorn() {
  const quest = GAME_DATA.pixieQuest;
  const body = openInfoPanel("🧚", "Pixie", "\"Is that... my " + quest.treasure.name + "? You found it?\"");
  const give = document.createElement("button");
  give.className = "big-button";
  give.textContent = quest.treasure.emoji + " Give back her " + quest.treasure.name;
  give.addEventListener("click", giveBackAcorn);
  body.appendChild(give);
}

// The end of the Quest: the acorn goes back to the Pixie.
function giveBackAcorn() {
  const quest = GAME_DATA.pixieQuest;
  const state = player.pixieQuest;
  removeOne(player.backpack, quest.treasure.item); // js/items.js
  player.adventurePoints += quest.adventurePoints;
  // Start fresh, in case the troll ever steals it again.
  // The troll grabs his map back, so the Secret Pathway disappears too.
  player.pixieQuest = { pieces: 0, asked: [], acornAt: null, hasAcorn: false, clues: [], done: state.done + 1, sips: state.sips };
  player.secrets = player.secrets.filter(function (s) { return s !== quest.secret; });
  writeSave(player);
  openInfoPanel(celebrationArt(quest.kind, "🧚" + quest.treasure.emoji + "✨"), "Quest Complete!", // js/game.js
    "\"My " + quest.treasure.name + "! You found it! Thank you, thank you!\" The Pixie twirls with joy. You finished the Quest: +" +
    quest.adventurePoints + " Adventure Point!");
}

// ---------------------------------------------------------------- the Finding Potion

function isFindingPotion(item) {
  return item.id === GAME_DATA.pixie.gives;
}

// Where the troll is hiding right now: a Forest place, worked out from the
// clock like the Pixie (but on his own timer, so they're rarely together).
function trollNow() {
  const slot = Math.floor(Date.now() / (GAME_DATA.pixieQuest.trollMoveMinutes * 60000));
  const places = pixiePlaces();
  const random = Math.abs(Math.sin(slot * 39.3467 + 11.135) * 24634.6345) % 1;
  return places[Math.floor(random * places.length)];
}

// Are you in that place (or somewhere inside it)?
function besideTroll() {
  const troll = trollNow();
  for (let place = findPlace(player.at); place; place = findPlace(place.in)) {
    if (place.id === troll.id) return true;
  }
  return false;
}

// The "Sip" button on the Finding Potion in the backpack.
function findingDrinkButton(item) {
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "🧪 Sip (" + player.pixieQuest.sips + " left)";
  button.addEventListener("click", function () {
    document.getElementById("backpack-panel").hidden = true;
    sipFindingPotion(item);
  });
  return button;
}

function sipFindingPotion(item) {
  const state = player.pixieQuest;
  state.sips--;
  if (besideTroll()) {
    player.backpack.splice(player.backpack.indexOf(item.id), 1); // the rest of it swirls away
    state.sips = 0;
    state.foundTrollAt = trollNow().id;
    writeSave(player);
    goTo(GAME_DATA.pixie.takesYouTo);
    return document.getElementById("place-description").textContent =
      "✨ Whoosh! The potion glows bright... there he is! The troll who stole the acorn was hiding right here, under his bridge.";
  }
  if (state.sips <= 0) player.backpack.splice(player.backpack.indexOf(item.id), 1); // all gone
  writeSave(player);
  flashTroll(trollNow());
  sayHere(state.sips > 0
    ? "✨ Flash! Did you see where the troll is hiding? Walk to that place, go in, and take another sip there: your potion bubbles when you're in the right place. (" + state.sips + " sip" + (state.sips === 1 ? "" : "s") +
      " left, and hurry: he moves every " + GAME_DATA.pixieQuest.trollMoveMinutes + " minutes!)"
    : "✨ Flash! That was the last sip, and the troll wasn't here. Out of luck! Bring the Pixie another Crystal Fish for a new potion.");
}

// Called by showPlace: with the Finding Potion in your backpack, it bubbles
// when you walk into the place where the troll is hiding.
function potionBubbles(place) {
  if (!owns(GAME_DATA.pixie.gives) || !besideTroll()) return;
  document.getElementById("place-description").textContent =
    "🧪 Your Finding Potion is bubbling like crazy! The troll must be hiding here. Take a sip from your 🎒 backpack!";
}

// A message under the map or the place picture, wherever you are.
function sayHere(message) {
  const onMap = !document.getElementById("screen-map").hidden;
  document.getElementById(onMap ? "map-hint" : "place-description").textContent = message;
}

// The screen flashes and, just for a moment, shows the Forest map with the
// troll where he's hiding.
function flashTroll(place) {
  const flash = document.createElement("div");
  flash.className = "troll-flash";
  const map = document.createElement("div");
  map.className = "troll-flash-map";
  const img = document.createElement("img");
  img.src = picture("map_" + place.in);
  img.alt = "";
  map.appendChild(img);
  const troll = document.createElement("span");
  troll.className = "troll-flash-troll";
  troll.style.left = place.x + "%";
  troll.style.top = place.y + "%";
  troll.appendChild(typeof trollArt() === "string" ? document.createTextNode("👹") : trollArt());
  map.appendChild(troll);
  flash.appendChild(map);
  document.body.appendChild(flash);
  setTimeout(function () { flash.classList.add("fading"); }, GAME_DATA.pixieQuest.flashSeconds * 1000);
  setTimeout(function () { flash.remove(); }, GAME_DATA.pixieQuest.flashSeconds * 1000 + 400);
}

// ---------------------------------------------------------------- the Troll Bridge

// The map is whole once every piece is won.
function haveWholeMap() {
  return player.pixieQuest.pieces >= GAME_DATA.pixieQuest.mapPieces;
}

// A riddle you've never heard (player.riddlesHeard remembers them, across
// every Quest). Once you've heard them all, they start over.
function nextRiddle() {
  let left = GAME_DATA.riddles.filter(function (r) { return player.riddlesHeard.indexOf(r.question) === -1; });
  if (left.length === 0) {
    player.riddlesHeard = [];
    left = GAME_DATA.riddles;
  }
  return left[randomBetween(0, left.length - 1)]; // js/digging.js
}

// The answers in a mixed-up order (in data/pixie.js the right one is first).
function mixedAnswers(riddle) {
  const answers = riddle.answers.map(function (text, i) { return { text: text, right: i === 0 }; });
  for (let i = answers.length - 1; i > 0; i--) {
    const j = randomBetween(0, i);
    const swap = answers[i];
    answers[i] = answers[j];
    answers[j] = swap;
  }
  return answers;
}

function mapPieces() {
  const quest = GAME_DATA.pixieQuest;
  return " " + quest.mapEmoji.repeat(player.pixieQuest.pieces) + " Map pieces: " + player.pixieQuest.pieces + " of " + quest.mapPieces + ".";
}

function askRiddle() {
  if (haveWholeMap()) {
    if (!secretFound(GAME_DATA.pixieQuest.secret)) return offerMapPuzzle("\"Grrr. You have all my map pieces. Bet you can't put them together!\""); // js/world.js
    return openInfoPanel(trollArt(), "Troll", "\"Grrr. You have my whole map now. Go on then, follow the Secret Pathway on the Forest map... if you dare!\"");
  }
  const riddle = nextRiddle();
  player.riddlesHeard.push(riddle.question);
  writeSave(player);
  const intro = player.pixieQuest.pieces === 0
    ? "\"Want my map to the secret part of the Forest? Ha! Answer my riddles: one map piece for each right answer!\" "
    : "\"Another riddle, then!\" ";
  const body = openInfoPanel(trollArt(), "Troll's Riddle", intro + riddle.question);
  const row = document.createElement("div");
  row.className = "riddle-answers";
  mixedAnswers(riddle).forEach(function (answer) {
    const button = document.createElement("button");
    button.className = "big-button secondary";
    button.textContent = answer.text;
    button.addEventListener("click", function () { answerRiddle(answer.right); });
    row.appendChild(button);
  });
  body.appendChild(row);
}

function answerRiddle(right) {
  const state = player.pixieQuest;
  if (!right) {
    const body = openInfoPanel(trollArt(), "Troll's Riddle", "\"Wrong! Ha ha!\" No map piece this time. But the troll likes riddles so much, he'll ask you another." + mapPieces());
    return body.appendChild(nextRiddleButton());
  }
  // The pieces come in a mixed-up order, so you have to work out where each goes.
  if (!state.pieceOrder) state.pieceOrder = shuffledPieces();
  state.pieces++;
  if (haveWholeMap()) hideAcorn();
  writeSave(player);
  const piece = mapPieceView(state.pieceOrder[state.pieces - 1]);
  const message = "\"Grrr... that's right!\" The troll grumbles and tears off a piece of his map for you." + mapPieces();
  if (haveWholeMap()) return offerMapPuzzle(message + " That's all of them! Now put them in the right order.", piece);
  openInfoPanel(piece, "A Map Piece!", message).appendChild(nextRiddleButton());
}

function nextRiddleButton() {
  const again = document.createElement("button");
  again.className = "big-button";
  again.textContent = "❓ Next riddle";
  again.addEventListener("click", askRiddle);
  return again;
}

// 0, 1, 2... in a random order (never already in the right order).
function shuffledPieces() {
  const count = GAME_DATA.pixieQuest.mapPieces;
  const order = [];
  for (let i = 0; i < count; i++) order.push(i);
  while (order.every(function (n, i) { return n === i; })) {
    for (let i = count - 1; i > 0; i--) {
      const j = randomBetween(0, i);
      const swap = order[i];
      order[i] = order[j];
      order[j] = swap;
    }
  }
  return order;
}

function offerMapPuzzle(message, art) {
  const body = openInfoPanel(art || GAME_DATA.pixieQuest.mapEmoji.repeat(GAME_DATA.pixieQuest.mapPieces), "The Troll's Map", message);
  const join = document.createElement("button");
  join.className = "big-button";
  join.textContent = "🧩 Put the pieces together";
  join.addEventListener("click", function () {
    document.getElementById("info-panel").hidden = true;
    mapPuzzle();
  });
  body.appendChild(join);
}

// The troll's picture (js/troll.js has the girls' drawing).
function trollArt() {
  if (!isDrawn("troll")) return "👹";
  const img = document.createElement("img");
  img.src = picture("troll");
  img.alt = "Troll";
  return img;
}

// ---------------------------------------------------------------- the map pieces

// The troll's map is the part of the Forest map around the Secret Pathway
// ("mapArea" in data/pixie.js), cut into strips. One strip: "piece" 0 is the
// left one.
function pieceArea(piece) {
  const quest = GAME_DATA.pixieQuest;
  const a = quest.mapArea;
  const width = (a[2] - a[0]) / quest.mapPieces;
  return [a[0] + piece * width, a[1], a[0] + (piece + 1) * width, a[3]];
}

// A window onto part of the Forest map: [left, top, right, bottom] percent.
// Inside it is the whole map (with the secret path, hidden until the pieces
// fit), moved so only that part shows.
function mapWindow(area) {
  const quest = GAME_DATA.pixieQuest;
  const mapId = GAME_DATA.pixie.territory;
  const width = area[2] - area[0];
  const height = area[3] - area[1];
  const view = document.createElement("div");
  view.className = "map-window";
  const whole = document.createElement("div");
  whole.className = "map-window-whole";
  whole.style.width = (100 * 100 / width) + "%";
  whole.style.left = (-area[0] * 100 / width) + "%";
  whole.style.top = (-area[1] * 100 / height) + "%";
  const map = document.createElement("img");
  map.src = picture("map_" + mapId);
  map.alt = "";
  // The window is the shape of its part of the map (known once the map has loaded).
  const shape = function () { view.style.aspectRatio = (width * map.naturalWidth) / (height * map.naturalHeight); };
  if (map.complete && map.naturalWidth) shape(); else map.addEventListener("load", shape);
  whole.appendChild(map);
  whole.appendChild(secretPathDrawing(quest.secret));
  const house = findPlace(GAME_DATA.paths.find(function (p) { return p.secret === quest.secret; }).to);
  const mark = document.createElement("span"); // a little house where the path ends
  mark.className = "map-join-mark";
  mark.textContent = "🏡";
  mark.style.left = house.x + "%";
  mark.style.top = house.y + "%";
  whole.appendChild(mark);
  view.appendChild(whole);
  return view;
}

function mapPieceView(piece) {
  const view = mapWindow(pieceArea(piece));
  view.classList.add("map-piece");
  view.dataset.piece = piece;
  return view;
}

// Put the pieces in order: click one piece, then another, to swap them. When
// they're all in the right place they join up, the Secret Pathway appears,
// and the map slides onto the real Forest map, where the path stays
// (player.secrets) until the Quest is done.
function mapPuzzle() {
  const overlay = document.createElement("div");
  overlay.className = "map-join";
  const board = document.createElement("div");
  board.className = "map-join-board";
  player.pixieQuest.pieceOrder.forEach(function (piece) { board.appendChild(mapPieceView(piece)); });
  const words = document.createElement("p");
  words.className = "map-join-words";
  words.textContent = "🧩 Click two pieces to swap them, until the map fits together.";
  overlay.appendChild(board);
  overlay.appendChild(words);
  document.body.appendChild(overlay);

  let picked = null;
  board.addEventListener("click", function (event) {
    const piece = event.target.closest(".map-piece");
    if (!piece || board.classList.contains("joined")) return;
    if (!picked) {
      picked = piece;
      return piece.classList.add("picked");
    }
    picked.classList.remove("picked");
    if (picked !== piece) swapPieces(board, picked, piece);
    picked = null;
    if (piecesInOrder(board)) mapFits(overlay, board, words);
  });
}

function swapPieces(board, one, two) {
  const marker = document.createElement("span");
  board.insertBefore(marker, one);
  board.insertBefore(one, two);
  board.insertBefore(two, marker);
  marker.remove();
}

function piecesInOrder(board) {
  return Array.prototype.every.call(board.children, function (piece, i) { return Number(piece.dataset.piece) === i; });
}

// They fit! The pieces close up, the path appears, then onto the Forest map.
function mapFits(overlay, board, words) {
  const quest = GAME_DATA.pixieQuest;
  if (player.secrets.indexOf(quest.secret) === -1) player.secrets.push(quest.secret);
  writeSave(player);
  board.classList.add("joined");
  words.textContent = "🧩 It fits!";
  setTimeout(function () {
    board.classList.add("path-shown");
    words.textContent = "✨ A Secret Pathway to the Pond House!";
  }, 900);
  setTimeout(function () { slideOntoMap(overlay, board, GAME_DATA.pixie.territory); }, 3400);
}

// The secret road, drawn the same way the map draws roads.
function secretPathDrawing(secret) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.classList.add("map-paths", "map-join-path");
  GAME_DATA.paths.filter(function (p) { return p.secret === secret; }).forEach(function (path) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", roadPoints(path.from, path.to).map(function (p) { return p.join(","); }).join(" "));
    line.classList.add("secret-path");
    svg.appendChild(line);
  });
  return svg;
}

// Show the real Forest map underneath, then shrink the joined map onto its
// part of it.
function slideOntoMap(overlay, board, mapId) {
  const found = player.pixieQuest.foundTrollAt;
  if (findPlace(found)) player.spots[mapId] = found; // you're back where you found the troll
  showMap(mapId);
  const map = document.getElementById("map").getBoundingClientRect();
  const a = GAME_DATA.pixieQuest.mapArea;
  const now = board.getBoundingClientRect();
  board.style.transformOrigin = "0 0";
  board.style.transition = "transform 1.2s ease-in-out";
  board.style.transform = "translate(" + (map.left + map.width * a[0] / 100 - now.left) + "px, " +
    (map.top + map.height * a[1] / 100 - now.top) + "px) scale(" + (map.width * (a[2] - a[0]) / 100 / now.width) + ")";
  overlay.classList.add("sliding");
  setTimeout(function () {
    overlay.remove();
    document.getElementById("map").classList.add("secret-new"); // the path and the Pond House glow for a bit
    setTimeout(function () { document.getElementById("map").classList.remove("secret-new"); }, 4000);
    document.getElementById("map-hint").textContent = "🗺️ The Secret Pathway is on the Forest map now! Click the Pond House to follow it.";
  }, 1300);
}

// ---------------------------------------------------------------- the Golden Acorn

// The troll hid the acorn somewhere in the Pond House (a random spot, saved).
function hideAcorn() {
  const state = player.pixieQuest;
  if (state.acornAt || state.hasAcorn) return;
  const a = GAME_DATA.pixieQuest.area;
  state.acornAt = [a[0] + Math.random() * (a[2] - a[0]), a[1] + Math.random() * (a[3] - a[1])];
  state.clues = [];
  state.lit = false;
}

function huntingAcorn(place) {
  return place.id === GAME_DATA.pixieQuest.hiddenIn && !!player.pixieQuest.acornAt;
}

// Called by showPlace: in the Pond House while the acorn is hidden, say so
// (and the firelight stays on the part of the room you've lit up).
function showAcornHunt(place) {
  const old = document.querySelector(".fire-shade");
  if (old) old.remove();
  if (!huntingAcorn(place)) return;
  if (player.pixieQuest.lit) showFirelight();
  document.getElementById("place-description").textContent = "🌰 The troll hid the Pixie's " +
    GAME_DATA.pixieQuest.treasure.name + " somewhere in here! Click around the room to search. " +
    "(Doing things here might help you find it, and turtles have great noses...)";
}

function searchForAcorn(event) {
  const place = findPlace(player.at);
  if (placementMode || !place || !huntingAcorn(place)) return;
  if (event.target.closest(".spot")) return; // clicking a spot isn't searching
  const pic = document.getElementById("place-picture");
  const rect = pic.getBoundingClientRect();
  const x = (event.clientX - rect.left - pic.clientLeft) / pic.clientWidth * 100;
  const y = (event.clientY - rect.top - pic.clientTop) / pic.clientHeight * 100;
  const quest = GAME_DATA.pixieQuest;
  const spot = player.pixieQuest.acornAt;
  const distance = Math.hypot(spot[0] - x, spot[1] - y);
  const box = document.getElementById("place-pixie");
  box.hidden = false;
  if (distance <= quest.findDistance) return foundAcorn();
  const left = warmSecondsLeft();
  if (left > 0) return feelWarmth(x, y, distance, left, box);
  showSplash(x, y, "🔍", box); // js/pearls.js
  document.getElementById("place-description").textContent = "Nothing here. Keep looking!";
}

// ---------------------------------------------------------------- the clues

// The fireplace: the firelight shines on the quarter of the room the acorn
// is in, and the rest goes dark.
function showFirelight() {
  const quest = GAME_DATA.pixieQuest;
  const a = quest.area;
  const acorn = player.pixieQuest.acornAt;
  const middleX = (a[0] + a[2]) / 2;
  const middleY = (a[1] + a[3]) / 2;
  const left = acorn[0] < middleX ? 0 : middleX;
  const right = acorn[0] < middleX ? middleX : 100;
  const top = acorn[1] < middleY ? 0 : middleY;
  const bottom = acorn[1] < middleY ? middleY : 100;
  const shade = document.createElement("div");
  shade.className = "fire-shade";
  const light = document.createElement("div");
  light.className = "fire-light";
  light.style.left = left + "%";
  light.style.top = top + "%";
  light.style.width = (right - left) + "%";
  light.style.height = (bottom - top) + "%";
  light.style.setProperty("--shadow", quest.fireLight.shadow);
  shade.appendChild(light);
  document.getElementById("place-picture").appendChild(shade);
}

// Hot chocolate: a warm feeling for a minute. Each mug adds another minute.
function warmSecondsLeft() {
  return Math.max(0, Math.ceil(((player.pixieQuest.warmUntil || 0) - Date.now()) / 1000));
}

// A click while you're feeling warm: Cold, Cool, Warm or Warmer!, in colour.
function feelWarmth(x, y, distance, secondsLeft, box) {
  const words = GAME_DATA.pixieQuest.warmSense.words;
  const feeling = words.find(function (w) { return distance <= w.within; }) || words[words.length - 1];
  const word = showSplash(x, y, feeling.word, box);
  word.classList.add("warm-word");
  word.style.color = feeling.colour;
  document.getElementById("place-description").textContent = "☕ " + feeling.word + " (" + minutesAndSeconds(secondsLeft) + " of warm feeling left)"; // js/skills.js
}

// The couch: a clue the first time you sit on it while searching (the words
// to add to its message, or "" if no new clue).
function acornClue(spotId) {
  const state = player.pixieQuest;
  if (!state.acornAt) return "";
  const clue = GAME_DATA.pixieQuest.clues.find(function (c) { return c.at === spotId; });
  if (!clue) return "";
  state.clues = state.clues || [];
  if (state.clues.indexOf(spotId) !== -1) return "";
  state.clues.push(spotId);
  writeSave(player);
  return " 🔎 Clue! " + clue.says.replace("NEAREST", nearestThing(state.acornAt));
}

// The name of the thing in the Pond House closest to a spot, like "couch".
function nearestThing(spot) {
  const things = placesIn(GAME_DATA.pixieQuest.hiddenIn).filter(function (p) { return p.type !== "turtle_sniff"; });
  let best = things[0];
  things.forEach(function (thing) {
    if (Math.hypot(thing.x - spot[0], thing.y - spot[1]) < Math.hypot(best.x - spot[0], best.y - spot[1])) best = thing;
  });
  return (best.spotName || best.name).toLowerCase();
}

// ---------------------------------------------------------------- found it!

// A big moment: the acorn shines in the middle of the screen, then it goes
// into your backpack.
function foundAcorn() {
  const quest = GAME_DATA.pixieQuest;
  const item = findItem(quest.treasure.item);
  player.pixieQuest.acornAt = null;
  player.pixieQuest.hasAcorn = true;
  player.pixieQuest.warmUntil = 0;
  player.backpack.push(item.id);
  writeSave(player);
  showAcornHunt(findPlace(player.at)); // the firelight goes out

  const overlay = document.createElement("div");
  overlay.className = "acorn-found";
  const rays = document.createElement("div");
  rays.className = "acorn-rays";
  const acorn = document.createElement("div");
  acorn.className = "acorn-big";
  const art = itemArt(item);
  if (typeof art === "string") acorn.textContent = art; else acorn.appendChild(art);
  const words = document.createElement("p");
  words.className = "acorn-words";
  words.textContent = "✨ You found the " + quest.treasure.name + "! ✨";
  const put = document.createElement("button");
  put.className = "big-button";
  put.textContent = "🎒 Put it in my backpack";
  overlay.append(rays, acorn, words, put);
  for (let i = 0; i < 14; i++) overlay.appendChild(sparkle());
  document.body.appendChild(overlay);
  put.addEventListener("click", function () { acornToBackpack(overlay, acorn); });
}

function sparkle() {
  const star = document.createElement("span");
  star.className = "acorn-sparkle";
  star.textContent = Math.random() < 0.5 ? "✨" : "⭐";
  star.style.left = (10 + Math.random() * 80) + "%";
  star.style.top = (10 + Math.random() * 80) + "%";
  star.style.animationDelay = (Math.random() * 1.5) + "s";
  return star;
}

// The acorn flies up to the backpack button in the top bar.
function acornToBackpack(overlay, acorn) {
  const from = acorn.getBoundingClientRect();
  const to = document.getElementById("btn-backpack").getBoundingClientRect();
  acorn.style.transition = "transform 1s ease-in, opacity 1s ease-in";
  acorn.style.transform = "translate(" + (to.left + to.width / 2 - from.left - from.width / 2) + "px, " +
    (to.top + to.height / 2 - from.top - from.height / 2) + "px) scale(0.1)";
  overlay.classList.add("leaving");
  setTimeout(function () {
    overlay.remove();
    document.getElementById("place-description").textContent = "🎒 The " + GAME_DATA.pixieQuest.treasure.name +
      " is in your backpack. Take it back to the Pixie! She's hiding somewhere in the Forest.";
  }, 1000);
}

document.getElementById("place-picture").addEventListener("click", searchForAcorn);

// ---------------------------------------------------------------- the turtle's nose

// The Pond Turtle can smell the acorn, but it's slow and wobbles off course:
// watch which way it heads, and search there. It sits down once it's close.
function turtleSniff() {
  const rules = GAME_DATA.pixieQuest.turtle;
  const turtle = findItem(rules.pet);
  const state = player.pixieQuest;
  if (player.backpack.indexOf(rules.pet) === -1) {
    return sayHere("🐢 Turtles have great noses. Maybe the " + turtle.name + " from the pond outside could sniff things out, if you carried it in your backpack.");
  }
  if (!state.acornAt) return sayHere("🐢 Your " + turtle.name + " sniffs around, but there's nothing hidden in here.");
  if (document.querySelector(".sniff-turtle")) return; // it's already crawling
  const box = document.getElementById("place-pixie");
  box.hidden = false;
  const sprite = document.createElement("span");
  sprite.className = "sniff-turtle";
  if (isDrawn(rules.pet)) {
    const img = document.createElement("img");
    img.src = picture(rules.pet);
    img.alt = turtle.name;
    sprite.appendChild(img);
  } else {
    sprite.textContent = "🐢";
  }
  box.appendChild(sprite);
  sayHere("🐢 Your " + turtle.name + " sets off, very... very... slowly. Watch its shell: it glows when it gets near the " + GAME_DATA.pixieQuest.treasure.name + "!");
  crawl(sprite, rules.start.slice(), player.at);
}

// Turn the turtle the way it's crawling. The girls drew it head down; the
// emoji 🐢 looks left.
function faceTurtle(sprite, angle) {
  const degrees = angle * 180 / Math.PI;
  if (sprite.querySelector("img")) sprite.style.rotate = (degrees - 90) + "deg";
  else sprite.style.scale = Math.cos(angle) < 0 ? "1 1" : "-1 1";
}

// One small step at a time. The turtle doesn't know where the acorn is: it
// wanders, and its shell tells it (and you) when it's getting close.
function crawl(sprite, at, placeId) {
  const rules = GAME_DATA.pixieQuest.turtle;
  const step = 0.2; // seconds between steps
  const turtle = {
    heading: Math.random() * 2 * Math.PI, // which way it's facing
    turnTo: null,       // after a shine: the way it's slowly turning
    best: null,         // the brightest spot so far, and how close that was
    bestDistance: Infinity,
    leash: rules.leash, // how far it will wander from the best spot
    pausedUntil: 0,     // it stops still while it shines
    restUntil: 0,       // and can't shine again straight away
    sinceFootprint: 0,
    lastGlow: 0,        // how bright its shell was a moment ago
    sinceSniff: 0,      // steps since it last compared
    sniffTurn: 0        // which way it's turning while it's getting colder
  };
  const timer = setInterval(function () {
    const acorn = player.pixieQuest.acornAt;
    if (player.at !== placeId || !acorn || !sprite.isConnected) { // you left, or found it
      clearInterval(timer);
      return sprite.remove();
    }
    const now = Date.now();
    const distance = Math.hypot(acorn[0] - at[0], acorn[1] - at[1]);
    const glow = glowShell(sprite, distance);
    if (now < turtle.pausedUntil) return;
    feelWarmer(turtle, glow);
    if (distance <= rules.shineDistance && now >= turtle.restUntil) return shine(sprite, turtle, at, acorn, distance);
    steer(turtle, at);
    move(sprite, turtle, at);
  }, step * 1000);
  sprite.style.left = at[0] + "%";
  sprite.style.top = at[1] + "%";
}

// The closer it is, the more its shell glows: from a dim blue far away,
// through green and yellow, to bright gold right next to it (css/style.css).
function glowShell(sprite, distance) {
  const glow = Math.max(0, 1 - distance / GAME_DATA.pixieQuest.turtle.glowRange);
  sprite.style.setProperty("--glow", glow.toFixed(2));
  return glow;
}

// Every few steps the turtle feels whether its shell got brighter. Brighter:
// keep going this way. Dimmer: start turning (one way, until it's brighter
// again). So its path keeps getting better, a little at a time.
function feelWarmer(turtle, glow) {
  const rules = GAME_DATA.pixieQuest.turtle;
  turtle.sinceSniff++;
  if (turtle.sinceSniff < rules.feelEvery) return;
  turtle.sinceSniff = 0;
  if (glow > turtle.lastGlow) turtle.sniffTurn = 0;
  else if (glow < turtle.lastGlow && turtle.sniffTurn === 0) turtle.sniffTurn = Math.random() < 0.5 ? -1 : 1;
  turtle.lastGlow = glow;
}

// Close enough: the shell shines bright, the turtle stops, then it knows
// which way to turn, and remembers this spot if it's the brightest yet.
function shine(sprite, turtle, at, acorn, distance) {
  const rules = GAME_DATA.pixieQuest.turtle;
  const now = Date.now();
  turtle.pausedUntil = now + rules.shineSeconds * 1000;
  turtle.restUntil = now + (rules.shineSeconds + rules.restSeconds) * 1000;
  turtle.turnTo = Math.atan2(acorn[1] - at[1], acorn[0] - at[0]);
  if (distance < turtle.bestDistance) {
    if (turtle.best) turtle.leash = Math.max(rules.smallestLeash, turtle.leash * rules.leashShrink);
    turtle.best = at.slice();
    turtle.bestDistance = distance;
  }
  sprite.classList.add("shining");
  setTimeout(function () { sprite.classList.remove("shining"); }, rules.shineSeconds * 1000);
  sayHere("✨ Your turtle's shell shines bright! It stops, sniffs... and slowly turns.");
}

// Which way to go: turning slowly after a shine, back toward the brightest
// spot if it's wandered too far, otherwise just wandering.
function steer(turtle, at) {
  const rules = GAME_DATA.pixieQuest.turtle;
  const noise = (Math.random() - 0.5) * 2 * rules.turn * Math.PI / 180;
  if (turtle.turnTo === null && turtle.best && Math.hypot(turtle.best[0] - at[0], turtle.best[1] - at[1]) > turtle.leash) {
    turtle.turnTo = Math.atan2(turtle.best[1] - at[1], turtle.best[0] - at[0]);
  }
  if (turtle.turnTo === null) return turtle.heading += noise + turtle.sniffTurn * rules.colderTurn * Math.PI / 180;
  let left = turtle.turnTo - turtle.heading;
  left = Math.atan2(Math.sin(left), Math.cos(left)); // the short way round
  const most = rules.turnRate * Math.PI / 180;
  if (Math.abs(left) <= most) {
    turtle.heading = turtle.turnTo;
    turtle.turnTo = null;
  } else {
    turtle.heading += Math.sign(left) * most;
  }
}

function move(sprite, turtle, at) {
  const rules = GAME_DATA.pixieQuest.turtle;
  const distance = rules.speed * 0.2;
  let next = stepFrom(at, turtle.heading, distance);
  if (offPicture(next)) { // bumped a wall: turn toward the middle of the room
    turtle.heading = Math.atan2(50 - at[1], 50 - at[0]);
    turtle.turnTo = null;
    next = stepFrom(at, turtle.heading, distance);
  }
  at[0] = next[0];
  at[1] = next[1];
  sprite.style.left = at[0] + "%";
  sprite.style.top = at[1] + "%";
  faceTurtle(sprite, turtle.heading);
  turtle.sinceFootprint += distance;
  if (turtle.sinceFootprint >= rules.footprintEvery) { // little footprints, so you can see the way it went
    turtle.sinceFootprint = 0;
    leaveFootprint(sprite.parentNode, at);
  }
}

function leaveFootprint(box, at) {
  const print = document.createElement("span");
  print.className = "turtle-footprint";
  print.style.left = at[0] + "%";
  print.style.top = at[1] + "%";
  print.style.animationDuration = GAME_DATA.pixieQuest.turtle.footprintSeconds + "s";
  box.appendChild(print);
  setTimeout(function () { print.remove(); }, GAME_DATA.pixieQuest.turtle.footprintSeconds * 1000);
}

function stepFrom(at, angle, distance) {
  return [at[0] + Math.cos(angle) * distance, at[1] + Math.sin(angle) * distance];
}

function offPicture(spot) {
  return spot[0] < 3 || spot[0] > 97 || spot[1] < 3 || spot[1] > 97;
}

// ---------------------------------------------------------------- the Pond House

// Click the pond and a turtle pops out to be your pet (just once).
function openPond() {
  const turtle = findItem(GAME_DATA.pondHouse.turtle);
  if (owns(turtle.id)) {
    return openInfoPanel(itemArt(turtle), "Pond", "Ripples on the pond... Your " + turtle.name + " already lives with you.");
  }
  player.backpack.push(turtle.id);
  writeSave(player);
  openInfoPanel(itemArt(turtle), "A Turtle!", "Splash! A turtle pops out of the pond and climbs into your backpack. The " + turtle.name + " is your new pet!");
}

// The s'mores: grab one, roast it at the fireplace, then eat it.
function grabSmore() {
  if (player.smore) {
    return openInfoPanel("🍫", "S'mores", "You're already holding a s'more. Take it to the fireplace to roast it!");
  }
  player.smore = "raw";
  writeSave(player);
  openInfoPanel("🍫", "S'mores", "You grab a s'more: graham crackers, chocolate and a marshmallow. Now roast it at the fireplace!");
}

function roastSmore() {
  if (!player.smore) {
    return openInfoPanel("🔥", "Fireplace", "The fire crackles and pops. Grab a s'more from the table to roast it here.");
  }
  player.smore = null;
  eatHere(GAME_DATA.pondHouse.smores);
  let clue = "";
  // While you're searching, the fire blazes up and lights part of the room.
  if (huntingAcorn(findPlace(player.at)) && !player.pixieQuest.lit) {
    player.pixieQuest.lit = true;
    writeSave(player);
    showFirelight();
    clue = " 🔥 Whoosh! The fire blazes up and lights one part of the room. The acorn must be there, where the light shines!";
  }
  openInfoPanel("🔥", "Fireplace", "You toast the marshmallow until it's golden and gooey, then gobble it up. Mmm! " + hungerNow() + clue);
}

// Hot chocolate: while you're searching, it gives you a warm feeling for a
// minute (more mugs, more minutes): every click says how warm you are.
function drinkHotChocolate() {
  eatHere(GAME_DATA.pondHouse.hotChocolate);
  let clue = "";
  if (huntingAcorn(findPlace(player.at))) {
    const state = player.pixieQuest;
    state.warmUntil = Math.max(Date.now(), state.warmUntil || 0) + GAME_DATA.pixieQuest.warmSense.seconds * 1000;
    writeSave(player);
    clue = " ☕ You feel all warm inside... For " + minutesAndSeconds(warmSecondsLeft()) +
      ", every click tells you if you're cold, cool, warm or warmer! (Another mug adds more time.)";
  }
  openInfoPanel("☕", "Hot Chocolate", "A warm mug of hot chocolate by the fire. Lovely! " + hungerNow() + clue);
}

// Treats at the Pond House are eaten on the spot (nothing to carry).
function eatHere(points) {
  player.hunger = Math.max(0, player.hunger - points);
  writeSave(player);
}

function hungerNow() {
  return "Hunger is now " + player.hunger + "/" + GAME_DATA.hunger.max + ".";
}
