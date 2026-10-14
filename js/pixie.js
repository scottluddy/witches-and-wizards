// The Pixie Quest (Scott, 2026-10-13, a Quest since 2026-10-14). The numbers,
// riddles and clues are in data/pixie.js.
//
// 1. The Pixie hides in one of the Forest's places and flies to another every
//    few minutes. The troll stole her Golden Acorn. Give her a Crystal Fish
//    and she gives you a Finding Potion.
// 2. Drink the potion (🎒 backpack) to go to the troll at the Troll Bridge.
// 3. Each riddle answered right gives a piece of the troll's map.
// 4. The whole map shows the Secret Pathway to the Pond House.
// 5. Search inside the Pond House for the acorn. The fireplace, hot chocolate
//    and couch give clues that make it easier to find.
// 6. Give the acorn back to the Pixie: the Quest is done (+1 Adventure Point).
// The pond has a turtle pet. Inside: s'mores to roast, hot chocolate, a couch.

// ---------------------------------------------------------------- the Pixie

// The Forest places she can hide in.
function pixiePlaces() {
  return placesIn(GAME_DATA.pixie.territory).filter(function (place) {
    return place.type === "place" && !place.opens;
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
  writeSave(player);
  openInfoPanel(itemArt(findItem(rules.gives)), "A Finding Potion!",
    "\"Yum! Thank you!\" The Pixie gives you a Finding Potion. It's in your backpack: drink it to find the troll. Answer his riddles to get his map!");
}

// " (Map pieces: 2 of 3)" so you always know how far along the Quest is.
function questProgress() {
  const state = player.pixieQuest;
  const quest = GAME_DATA.pixieQuest;
  if (state.acornAt) return " (You have the whole map. The " + quest.treasure.name + " is hidden in the Pond House!)";
  if (state.pieces > 0) return " (Map pieces: " + state.pieces + " of " + quest.mapPieces + ")";
  return "";
}

// The end of the Quest: the acorn goes back to the Pixie.
function giveBackAcorn() {
  const quest = GAME_DATA.pixieQuest;
  const state = player.pixieQuest;
  player.adventurePoints += quest.adventurePoints;
  // Start fresh, in case the troll ever steals it again.
  player.pixieQuest = { pieces: 0, asked: [], acornAt: null, hasAcorn: false, clues: [], done: state.done + 1 };
  writeSave(player);
  openInfoPanel(celebrationArt(quest.kind, "🧚" + quest.treasure.emoji + "✨"), "Quest Complete!", // js/game.js
    "\"My " + quest.treasure.name + "! You found it! Thank you, thank you!\" The Pixie twirls with joy. You finished the Quest: +" +
    quest.adventurePoints + " Adventure Point!");
}

// ---------------------------------------------------------------- the Finding Potion

function isFindingPotion(item) {
  return item.id === GAME_DATA.pixie.gives;
}

// The "Drink" button on the Finding Potion in the backpack.
function findingDrinkButton(item) {
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "🧪 Drink";
  button.addEventListener("click", function () {
    player.backpack.splice(player.backpack.indexOf(item.id), 1); // drunk, so it's gone
    writeSave(player);
    document.getElementById("backpack-panel").hidden = true;
    goTo(GAME_DATA.pixie.takesYouTo);
    document.getElementById("place-description").textContent =
      "✨ Whoosh! The potion swirls you away to a bridge deep in the Forest. The troll who stole the acorn lives under it...";
  });
  return button;
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
    return openInfoPanel(trollArt(), "Troll", "\"Grrr. You have my whole map now. Go on then, follow the Secret Pathway... if you dare!\"");
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
    return openInfoPanel(GAME_DATA.pixieQuest.mapEmoji, "The Whole Map!", message + mapPieces() +
      " The pieces fit together and show a Secret Pathway to a hidden part of the Forest: the Pond House! The " +
      GAME_DATA.pixieQuest.treasure.name + " must be there.");
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

// The Secret Pathway only shows up on the whole map.
function crossBridge(spot) {
  if (haveWholeMap()) return goTo(spot.to);
  document.getElementById("place-description").textContent =
    "🌫️ There's no path here that you can see. Maybe the troll's map shows the way: answer his riddles to get the pieces." + mapPieces();
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
    "(Doing things here might turn up clues.)";
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
