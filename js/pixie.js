// The Pixie Quest (Scott, 2026-10-13, a Quest since 2026-10-14). The numbers,
// riddles and clues are in data/pixie.js.
//
// 1. The Pixie hides in one of the Forest's places and flies to another every
//    few minutes. The troll stole her Golden Acorn. Give her a Crystal Fish
//    and she gives you a Finding Potion.
// 2. The troll hides in a Forest place and moves every couple of minutes. The
//    potion only works where he is: a sip anywhere else flashes up the map
//    to show where he's hiding. It has 4 sips (🎒 backpack).
// 3. Each riddle answered right gives a piece of the troll's map.
// 4. The pieces join up, and the Secret Pathway to the Pond House appears on
//    the Forest map.
// 5. Search inside the Pond House for the acorn. The fireplace, hot chocolate
//    and couch give clues, and the Pond Turtle slowly crawls toward it.
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
  const now = pixieNow();
  box.hidden = place.id !== now.place;
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
  const rules = GAME_DATA.pixie;
  const quest = GAME_DATA.pixieQuest;
  const fish = findFish(rules.wants); // js/fishing.js
  const potion = findItem(rules.gives);
  if (player.pixieQuest.hasAcorn) return giveBackAcorn();
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
  player.pixieQuest.sips = GAME_DATA.pixieQuest.sips;
  writeSave(player);
  openInfoPanel(itemArt(findItem(rules.gives)), "A Finding Potion!",
    "\"Yum! Thank you!\" The Pixie gives you a Finding Potion with " + GAME_DATA.pixieQuest.sips + " sips. " +
    "It only works where the troll is hiding, somewhere in the Forest. Take a sip anywhere else and you'll see a flash of where he is. Answer his riddles to get his map!");
}

// " (Map pieces: 2 of 3)" so you always know how far along the Quest is.
function questProgress() {
  const state = player.pixieQuest;
  const quest = GAME_DATA.pixieQuest;
  if (state.acornAt) return " (You have the whole map. Follow the Secret Pathway on the Forest map: the " + quest.treasure.name + " is hidden in the Pond House!)";
  if (state.pieces > 0) return " (Map pieces: " + state.pieces + " of " + quest.mapPieces + ")";
  return "";
}

// The end of the Quest: the acorn goes back to the Pixie.
function giveBackAcorn() {
  const quest = GAME_DATA.pixieQuest;
  const state = player.pixieQuest;
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
    ? "✨ Flash! Did you see where the troll is hiding? Go there and take another sip. (" + state.sips + " sip" + (state.sips === 1 ? "" : "s") +
      " left, and hurry: he moves every " + GAME_DATA.pixieQuest.trollMoveMinutes + " minutes!)"
    : "✨ Flash! That was the last sip, and the troll wasn't here. Out of luck! Bring the Pixie another Crystal Fish for a new potion.");
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

// A riddle not asked yet in this Quest (once they're all used, any riddle).
function nextRiddle() {
  const asked = player.pixieQuest.asked;
  let left = GAME_DATA.riddles.filter(function (r, i) { return asked.indexOf(i) === -1; });
  if (left.length === 0) left = GAME_DATA.riddles;
  return left[randomBetween(0, left.length - 1)]; // js/digging.js
}

function mapPieces() {
  const quest = GAME_DATA.pixieQuest;
  return " " + quest.mapEmoji.repeat(player.pixieQuest.pieces) + " Map pieces: " + player.pixieQuest.pieces + " of " + quest.mapPieces + ".";
}

function askRiddle() {
  if (haveWholeMap()) {
    return openInfoPanel(trollArt(), "Troll", "\"Grrr. You have my whole map now. Go on then, follow the Secret Pathway on the Forest map... if you dare!\"");
  }
  const riddle = nextRiddle();
  player.pixieQuest.asked.push(GAME_DATA.riddles.indexOf(riddle));
  const intro = player.pixieQuest.pieces === 0
    ? "\"Want my map to the secret part of the Forest? Ha! Answer my riddles: one map piece for each right answer!\" "
    : "\"Another riddle, then!\" ";
  const body = openInfoPanel(trollArt(), "Troll's Riddle", intro + riddle.question);
  const row = document.createElement("div");
  row.className = "riddle-answers";
  riddle.answers.forEach(function (answer, i) {
    const button = document.createElement("button");
    button.className = "big-button secondary";
    button.textContent = answer;
    button.addEventListener("click", function () { answerRiddle(i === riddle.right); });
    row.appendChild(button);
  });
  body.appendChild(row);
}

function answerRiddle(right) {
  const message = right ? "\"Grrr... that's right!\" The troll grumbles and hands you a piece of his map."
    : "\"Wrong! Ha ha!\" No map piece this time. But the troll likes riddles so much, he'll ask you another.";
  if (right) player.pixieQuest.pieces++;
  if (haveWholeMap()) hideAcorn();
  writeSave(player);
  if (haveWholeMap()) {
    const body = openInfoPanel(GAME_DATA.pixieQuest.mapEmoji.repeat(GAME_DATA.pixieQuest.mapPieces), "The Whole Map!", message + mapPieces() +
      " That's all of them! Put them together and see where they lead.");
    const join = document.createElement("button");
    join.className = "big-button";
    join.textContent = "🧩 Put the pieces together";
    join.addEventListener("click", function () {
      document.getElementById("info-panel").hidden = true;
      joinMapPieces();
    });
    return body.appendChild(join);
  }
  const body = openInfoPanel(trollArt(), "Troll's Riddle", message + mapPieces());
  const again = document.createElement("button");
  again.className = "big-button";
  again.textContent = "❓ Next riddle";
  again.addEventListener("click", askRiddle);
  body.appendChild(again);
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

// The three pieces are strips of the Forest map. They fly together, the
// Secret Pathway appears on them, then the whole map slides onto the real
// Forest map, where the path stays (player.secrets) until the Quest is done.
function joinMapPieces() {
  const quest = GAME_DATA.pixieQuest;
  const forest = GAME_DATA.pixie.territory;
  if (player.secrets.indexOf(quest.secret) === -1) player.secrets.push(quest.secret);
  writeSave(player);

  const overlay = document.createElement("div");
  overlay.className = "map-join";
  const board = document.createElement("div");
  board.className = "map-join-board";
  const sizer = document.createElement("img"); // an invisible copy of the map, so the board is the map's shape
  sizer.className = "map-join-sizer";
  sizer.src = picture("map_" + forest);
  sizer.alt = "";
  board.appendChild(sizer);
  for (let i = 0; i < quest.mapPieces; i++) board.appendChild(mapPiece(i, quest.mapPieces, forest));
  board.appendChild(secretPathDrawing(quest.secret));
  const house = findPlace(GAME_DATA.paths.find(function (p) { return p.secret === quest.secret; }).to);
  const mark = document.createElement("span"); // a little house where the path ends
  mark.className = "map-join-mark";
  mark.textContent = "🏡";
  mark.style.left = house.x + "%";
  mark.style.top = house.y + "%";
  board.appendChild(mark);
  const words = document.createElement("p");
  words.className = "map-join-words";
  words.textContent = "🧩 The pieces fit together...";
  overlay.appendChild(board);
  overlay.appendChild(words);
  document.body.appendChild(overlay);

  setTimeout(function () { board.classList.add("joined"); }, 100);          // the pieces fly together
  setTimeout(function () {                                                   // the path appears
    board.classList.add("path-shown");
    words.textContent = "✨ A Secret Pathway to the Pond House!";
  }, 1600);
  setTimeout(function () { slideOntoMap(overlay, board, forest); }, 4000);   // onto the Forest map
}

// One strip of the map, starting tilted and far from where it belongs.
function mapPiece(i, count, mapId) {
  const piece = document.createElement("div");
  piece.className = "map-join-piece";
  piece.style.left = (i * 100 / count) + "%";
  piece.style.width = (100 / count) + "%";
  piece.style.backgroundImage = "url(" + picture("map_" + mapId) + ")";
  piece.style.backgroundSize = (count * 100) + "% 100%";
  piece.style.backgroundPosition = (i * 100 / (count - 1)) + "% 0";
  const spread = (i - (count - 1) / 2) * 45;      // left piece left, right piece right
  piece.style.setProperty("--start", "translate(" + spread + "%, " + (i % 2 ? 25 : -20) + "%) rotate(" + (spread / 3 + 6) + "deg)");
  return piece;
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

// Show the real Forest map underneath, then shrink the joined map onto it.
function slideOntoMap(overlay, board, mapId) {
  const found = player.pixieQuest.foundTrollAt;
  if (findPlace(found)) player.spots[mapId] = found; // you're back where you found the troll
  showMap(mapId);
  const target = document.getElementById("map").getBoundingClientRect();
  const now = board.getBoundingClientRect();
  board.style.transformOrigin = "0 0";
  board.style.transition = "transform 1.2s ease-in-out";
  board.style.transform = "translate(" + (target.left - now.left) + "px, " + (target.top - now.top) + "px) scale(" + (target.width / now.width) + ")";
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
}

function huntingAcorn(place) {
  return place.id === GAME_DATA.pixieQuest.hiddenIn && !!player.pixieQuest.acornAt;
}

// Called by showPlace: in the Pond House while the acorn is hidden, say so.
function showAcornHunt(place) {
  if (!huntingAcorn(place)) return;
  document.getElementById("place-description").textContent = "🌰 The troll hid the Pixie's " +
    GAME_DATA.pixieQuest.treasure.name + " somewhere in here! Click around the room to search. " +
    "(Doing things here might turn up clues, and turtles have great noses...)";
}

// How close a click has to be, made bigger by each clue found.
function acornDistance(base) {
  const found = player.pixieQuest.clues || [];
  return GAME_DATA.pixieQuest.clues.reduce(function (sum, clue) {
    return sum + (found.indexOf(clue.at) !== -1 ? clue.bigger : 0);
  }, base);
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
  if (distance <= acornDistance(quest.findDistance)) return foundAcorn(box);
  showSplash(x, y, "🔍", box); // js/pearls.js
  document.getElementById("place-description").textContent = distance <= acornDistance(quest.warmDistance)
    ? "🔥 Warmer! The " + quest.treasure.name + " is close by." : "Nothing here. Keep looking!";
}

function foundAcorn(box) {
  const quest = GAME_DATA.pixieQuest;
  const spot = player.pixieQuest.acornAt;
  player.pixieQuest.acornAt = null;
  player.pixieQuest.hasAcorn = true;
  writeSave(player);
  showSplash(spot[0], spot[1], quest.treasure.emoji, box).classList.add("found");
  document.getElementById("place-description").textContent = "✨ You found the " + quest.treasure.name +
    "! Take it back to the Pixie. She's hiding somewhere in the Forest.";
}

// A clue from doing something in the Pond House while the acorn is hidden:
// the words to add to that spot's message (or "" if no new clue).
function acornClue(spotId) {
  const state = player.pixieQuest;
  if (!state.acornAt) return "";
  const clue = GAME_DATA.pixieQuest.clues.find(function (c) { return c.at === spotId; });
  if (!clue) return "";
  state.clues = state.clues || [];
  if (state.clues.indexOf(spotId) !== -1) return "";
  state.clues.push(spotId);
  writeSave(player);
  const side = state.acornAt[0] < 50 ? "left" : "right";
  const height = state.acornAt[1] < 60 ? "up high" : "down low";
  return " 🔎 Clue! " + clue.says.replace("SIDE", side).replace("HEIGHT", height);
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
  sayHere("🐢 Your " + turtle.name + " sniffs the air... and sets off, very... very... slowly. Which way is it going?");
  crawl(sprite, rules.start.slice(), player.at);
}

// Turn the turtle the way it's crawling. The girls drew it head down; the
// emoji 🐢 looks left.
function faceTurtle(sprite, angle) {
  const degrees = angle * 180 / Math.PI;
  if (sprite.querySelector("img")) sprite.style.rotate = (degrees - 90) + "deg";
  else sprite.style.scale = Math.cos(angle) < 0 ? "1 1" : "-1 1";
}

// One small step at a time. The turtle wanders left and right of the way to
// the acorn, but never more than "wander" degrees, so every step takes it a
// little closer. That's why it can never cross its own trail: each spot on
// the trail is closer to the acorn than every spot before it.
function crawl(sprite, at, placeId) {
  const rules = GAME_DATA.pixieQuest.turtle;
  const step = 0.2; // seconds between steps
  const most = rules.wander * Math.PI / 180;
  let off = (Math.random() - 0.5) * 2 * most; // how far off course it's heading
  const timer = setInterval(function () {
    const acorn = player.pixieQuest.acornAt;
    if (player.at !== placeId || !acorn || !sprite.isConnected) { // you left, or found it
      clearInterval(timer);
      return sprite.remove();
    }
    const left = Math.hypot(acorn[0] - at[0], acorn[1] - at[1]) - rules.closest;
    if (left < 0.5) {
      clearInterval(timer);
      sprite.classList.add("sitting");
      return sayHere("🐢 Your turtle is tired out. It sits down and sniffs: the " + GAME_DATA.pixieQuest.treasure.name + " must be somewhere around here!");
    }
    off += (Math.random() - 0.5) * 2 * rules.turn * Math.PI / 180;
    off = Math.max(-most, Math.min(most, off));
    const distance = rules.speed * Math.max(0.15, Math.min(1, left / 20)) * step; // slower near the end
    const toward = Math.atan2(acorn[1] - at[1], acorn[0] - at[0]);
    let next = stepFrom(at, toward + off, distance);
    if (offPicture(next)) { off = -off; next = stepFrom(at, toward + off, distance); } // bump the wall: turn the other way
    if (offPicture(next)) { off = 0; next = stepFrom(at, toward, distance); }        // still stuck: straight on
    at[0] = next[0];
    at[1] = next[1];
    sprite.style.left = at[0] + "%";
    sprite.style.top = at[1] + "%";
    faceTurtle(sprite, toward + off);
  }, step * 1000);
  sprite.style.left = at[0] + "%";
  sprite.style.top = at[1] + "%";
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
  openInfoPanel("🔥", "Fireplace", "You toast the marshmallow until it's golden and gooey, then gobble it up. Mmm! " + hungerNow() + acornClue("fireplace"));
}

function drinkHotChocolate() {
  eatHere(GAME_DATA.pondHouse.hotChocolate);
  openInfoPanel("☕", "Hot Chocolate", "A warm mug of hot chocolate by the fire. Lovely! " + hungerNow() + acornClue("pond_hot_chocolate"));
}

// Treats at the Pond House are eaten on the spot (nothing to carry).
function eatHere(points) {
  player.hunger = Math.max(0, player.hunger - points);
  writeSave(player);
}

function hungerNow() {
  return "Hunger is now " + player.hunger + "/" + GAME_DATA.hunger.max + ".";
}
