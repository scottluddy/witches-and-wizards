// The Pixie adventure (Scott, 2026-10-13). The numbers and riddles are in data/pixie.js.
//
// 1. The Pixie hides in one of the Forest's places and flies to another every
//    few minutes. Give her a Crystal Fish and she gives you a Finding Potion.
// 2. Drink the potion (🎒 backpack) to go to the Troll Bridge.
// 3. Answer the troll's riddle to cross the bridge to the Pond House.
// 4. Click the pond for a turtle pet. Inside: s'mores to roast, hot chocolate, a couch.

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
  const fish = findFish(rules.wants); // js/fishing.js
  const potion = findItem(rules.gives);
  if (owns(rules.gives)) {
    return openInfoPanel("🧚", "Pixie", "\"You already have my " + potion.name + "! Drink it from your backpack and see where it takes you.\"");
  }
  const bag = pixieFishBag();
  if (!bag) {
    return openInfoPanel("🧚", "Pixie", "\"Oh, I'm SO hungry for a " + fish.name + "! Bring me one from the Lake and I'll give you something magic.\" (Hurry, she flies off somewhere else in the Forest every " + rules.stayMinutes + " minutes!)");
  }
  const body = openInfoPanel("🧚", "Pixie", "\"Is that a " + fish.name + " in your " + bag + "? Give it to me and I'll give you a " + potion.name + "!\"");
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
    "\"Yum! Thank you!\" The Pixie gives you a Finding Potion. It's in your backpack: drink it to find a secret place.");
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
    player.bridgeOpen = false; // a new riddle each time you come
    writeSave(player);
    document.getElementById("backpack-panel").hidden = true;
    goTo(GAME_DATA.pixie.takesYouTo);
    document.getElementById("place-description").textContent =
      "✨ Whoosh! The potion swirls you away to a bridge deep in the Forest. A troll lives under it...";
  });
  return button;
}

// ---------------------------------------------------------------- the Troll Bridge

function askRiddle() {
  if (player.bridgeOpen) {
    return openInfoPanel(trollArt(), "Troll", "\"You answered my riddle. Off you go, cross the bridge!\"");
  }
  const riddle = GAME_DATA.riddles[randomBetween(0, GAME_DATA.riddles.length - 1)]; // js/digging.js
  const body = openInfoPanel(trollArt(), "Troll's Riddle", "\"Nobody crosses my bridge without answering my riddle!\" " + riddle.question);
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
  if (!right) {
    const body = openInfoPanel(trollArt(), "Troll's Riddle", "\"Wrong! Ha ha!\" But the troll likes riddles so much, it will ask you another one.");
    const again = document.createElement("button");
    again.className = "big-button";
    again.textContent = "❓ Another riddle";
    again.addEventListener("click", askRiddle);
    return body.appendChild(again);
  }
  player.bridgeOpen = true;
  writeSave(player);
  openInfoPanel(trollArt(), "Troll", "\"Grrr... that's right!\" The troll steps aside. You can cross the bridge to the Pond House now.");
}

// The troll's picture (js/troll.js has the girls' drawing).
function trollArt() {
  if (!isDrawn("troll")) return "👹";
  const img = document.createElement("img");
  img.src = picture("troll");
  img.alt = "Troll";
  return img;
}

function crossBridge(spot) {
  if (player.bridgeOpen) return goTo(spot.to);
  document.getElementById("place-description").textContent =
    "🚧 The troll won't let you cross until you answer its riddle. Click the troll!";
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
  openInfoPanel("🔥", "Fireplace", "You toast the marshmallow until it's golden and gooey, then gobble it up. Mmm! " + hungerNow());
}

function drinkHotChocolate() {
  eatHere(GAME_DATA.pondHouse.hotChocolate);
  openInfoPanel("☕", "Hot Chocolate", "A warm mug of hot chocolate by the fire. Lovely! " + hungerNow());
}

// Treats at the Pond House are eaten on the spot (nothing to carry).
function eatHere(points) {
  player.hunger = Math.max(0, player.hunger - points);
  writeSave(player);
}

function hungerNow() {
  return "Hunger is now " + player.hunger + "/" + GAME_DATA.hunger.max + ".";
}
