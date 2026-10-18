// Getting around: maps you walk on (the world, each territory) and places you
// click around in (the store, its shelves, home...). Everything comes from
// data/places.js and data/paths.js.

const WALK_SPEED = 0.3;   // how fast the character walks, in map-widths per second

let walking = false;        // true while the character is on the move
let placementMode = false;  // press P to switch on: clicking shows positions

// ---------------------------------------------------------------- looking things up

function findPlace(id) {
  return GAME_DATA.places.find(function (place) { return place.id === id; });
}

// The places that sit inside a map or place. "hidden" places (like the Troll
// Bridge) aren't shown: you only get there by magic. "secret" places (like the
// Pond House) only show up once you've found the secret (player.secrets).
function placesIn(id) {
  return GAME_DATA.places.filter(function (place) {
    return place.in === id && !place.hidden && secretFound(place.secret);
  });
}

// No secret, or one the player has found (like "pixie_path", from the troll's map).
function secretFound(secret) {
  return !secret || player.secrets.indexOf(secret) !== -1;
}

// A little picture in front of each kind of spot's name.
const SPOT_ICONS = {
  fishing: "🎣", digging: "⛏️", picking: "🍎", selling: "💎", bath: "🛁", cuddle: "🛋️",
  cafe: "🍽️", travel: "➡️", classroom: "🚪", look: "🔭", ski_down: "⛷️", owl_dropoff: "🦉",
  honey: "🍯", piano: "🎹", piano_lesson: "🎹", archery: "🏹", soccer: "⚽", riddle: "❓", bridge: "🌉",
  pond: "🐢", elevator: "🛗", coaster: "🎢", turtle_sniff: "🐢", smores: "🍫", fireplace: "🔥", hot_chocolate: "☕", tiny_hole: "🕳️",
  museum_pay: "🎟️", menu_shop: "📋", seat: "🪑", market_booth: "🧙‍♀️", market_table: "🪑", artifact_chest: "🧰",
  pet_tricks: "⭕", pet_walk: "🐾", pet_sign: "🪧"
};

function isDrawn(name) {
  return (GAME_DATA.drawn || []).indexOf(name) !== -1;
}

// "?v=" makes the browser fetch a fresh copy after each update (see tools/bump_version.py).
function picture(name) {
  return "art/processed/" + name + ".png?v=" + GAME_VERSION;
}

function characterPicture(character) {
  return character && isDrawn(character.id) ? picture(character.id) : picture("placeholder_character");
}

// Open any map or place.
function goTo(id) {
  const place = findPlace(id);
  if (!place) return showMap("world");
  if (place.opens) return goTo(place.opens); // skip straight into the place it opens
  if (place.floors) return openElevator(place); // a building's door opens on its elevator
  if (museumStops(place)) return; // the Museum needs a ticket, and a round before the Snack Shop (js/museum.js)
  if (place.type === "map") showMap(id);
  else showPlace(id);
}

// The "Zoom out to ..." button: go up to the map or place this one sits inside.
// A place that just "opens" another is skipped, or Back would bounce straight back in.
function setBackButton(button, place) {
  let parent = place.in ? findPlace(place.in) : null;
  while (parent && parent.opens && parent.in) parent = findPlace(parent.in);
  button.hidden = !parent;
  if (parent) {
    button.textContent = "🔍 Zoom out to " + parent.name; // it zooms out, too (js/zoom.js)
    button.onclick = function () { goTo(parent.id); };
  }
}

// Clickable spots (a dot and a name) for the places inside a map or place.
function drawSpots(box, places, onClick) {
  box.innerHTML = "";
  places.forEach(function (place) {
    const button = document.createElement("button");
    button.className = "spot";
    if (place.secret) button.classList.add("secret"); // a secret place, like the Pond House
    button.dataset.id = place.id;
    button.style.left = place.x + "%";
    button.style.top = place.y + "%";
    button.innerHTML = '<span class="dot"></span><span class="label"></span>';
    // A bonding spot shows its own picture from data/bonding.js (🦉 falconry, 🐢 swimming...).
    // "icon" on a spot picks its own, like ⬅️ for going back a room.
    const icon = place.icon || (place.type === "care" ? GAME_DATA.bonding[place.care].emoji : SPOT_ICONS[place.type]);
    button.querySelector(".label").textContent = (icon ? icon + " " : "") + (place.spotName || place.name); // "spotName": a different name on the spot, like "Go inside"
    // A spot can have its own picture, like the bath tub at Home ("size" is
    // its width in percent of the picture it's in).
    if (place.picture) {
      const img = document.createElement("img");
      img.className = "spot-picture";
      img.src = picture(place.picture);
      img.alt = place.name;
      button.prepend(img);
      button.classList.add("with-picture");
      button.style.width = (place.size || 10) + "%";
    }
    markSkillSpot(button, place); // "(Level 2) ⏳ 3:05", greyed out while waiting or if it needs a skill Level (js/skills.js)
    button.addEventListener("click", function () { onClick(place.id); });
    box.appendChild(button);
  });
}

// ---------------------------------------------------------------- maps

function showMap(mapId) {
  const map = findPlace(mapId);
  leaveBeehive(map); // honey still in your pot goes in the basket (js/honey.js)
  returnPickaxe(); // out of the Crystal Cave, the pickaxe goes back on its rack (js/mining.js)
  const spots = placesIn(mapId);
  const cameFrom = player.at; // to zoom back out from the place you just left (js/zoom.js)
  player.at = mapId;

  // Where the character stands: where they were last time, or the start spot.
  let here = player.spots[mapId];
  if (!findPlace(here) || findPlace(here).in !== mapId) {
    const start = spots.find(function (p) { return p.start; }) || spots[0];
    here = start ? start.id : null;
    player.spots[mapId] = here;
  }
  writeSave(player);

  flashTitle("map-title", map.name, cameFrom !== mapId); // js/zoom.js
  document.getElementById("map-image").src = picture("map_" + mapId);
  document.getElementById("map-image").alt = "Map of " + map.name;
  setBackButton(document.getElementById("btn-map-back"), map);
  drawPaths(mapId);
  drawSpots(document.getElementById("map-spots"), spots, travelTo);
  markHere();

  document.getElementById("map-sprite-img").src = characterPicture(findCharacter(player.characterId));
  const herePlace = findPlace(here);
  document.getElementById("map-sprite").hidden = !herePlace;
  if (herePlace) moveSprite(herePlace.x, herePlace.y);
  showScreen("screen-map");
  zoomOutFrom(cameFrom, mapId, "map-zoom");
}

function markHere() {
  const here = player.spots[player.at];
  document.querySelectorAll("#map-spots .spot").forEach(function (spot) {
    spot.classList.toggle("here", spot.dataset.id === here);
  });
}

// Dotted lines for the roads on this map.
function drawPaths(mapId) {
  const svg = document.getElementById("map-paths");
  svg.innerHTML = "";
  roadsOn(mapId).forEach(function (path) {
    const points = roadPoints(path.from, path.to);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", points.map(function (p) { return p.join(","); }).join(" "));
    if (path.secret) line.classList.add("secret-path"); // the Secret Pathway glows
    svg.appendChild(line);
  });
}

function roadsOn(mapId) {
  return GAME_DATA.paths.filter(function (path) {
    const from = findPlace(path.from);
    const to = findPlace(path.to);
    return from && to && from.in === mapId && to.in === mapId && secretFound(path.secret);
  });
}

function moveSprite(x, y) {
  const sprite = document.getElementById("map-sprite");
  sprite.style.left = x + "%";
  sprite.style.top = y + "%";
}

// ---------------------------------------------------------------- finding the way

// The points (x, y) along the road between two neighbouring places.
// With no road, it's just a straight line.
function roadPoints(fromId, toId) {
  const from = findPlace(fromId);
  const to = findPlace(toId);
  const path = GAME_DATA.paths.find(function (p) {
    return (p.from === fromId && p.to === toId) || (p.from === toId && p.to === fromId);
  });
  const bends = (path && path.via) ? path.via.slice() : [];
  if (path && path.from !== fromId) bends.reverse(); // walking the road backwards
  return [[from.x, from.y]].concat(bends, [[to.x, to.y]]);
}

function neighbours(id) {
  const result = [];
  GAME_DATA.paths.forEach(function (p) {
    if (!secretFound(p.secret)) return; // a secret road you haven't found yet
    if (p.from === id) result.push(p.to);
    if (p.to === id) result.push(p.from);
  });
  return result;
}

// The places to walk through, start to finish (fewest stops). It spreads out
// from the start like ripples in a pond until it reaches the goal.
// With no way by road, it walks straight there.
function findRoute(startId, goalId) {
  const cameFrom = {};
  cameFrom[startId] = null;
  const queue = [startId];
  while (queue.length > 0) {
    const id = queue.shift();
    if (id === goalId) break;
    neighbours(id).forEach(function (next) {
      if (!(next in cameFrom)) {
        cameFrom[next] = id;
        queue.push(next);
      }
    });
  }
  if (!(goalId in cameFrom)) return [startId, goalId];

  const route = [goalId];
  while (route[0] !== startId) route.unshift(cameFrom[route[0]]);
  return route;
}

// ---------------------------------------------------------------- walking

function travelTo(id) {
  if (walking || placementMode) return;
  if (!meetsSkill(findPlace(id).needsSkill)) { // a place that needs a skill Level (js/skills.js)
    document.getElementById("map-hint").textContent = needsSkillText(findPlace(id).needsSkill);
    return;
  }
  const mapId = player.at;
  const here = player.spots[mapId];
  if (!here || id === here) {
    player.spots[mapId] = id;
    zoomInto(findPlace(id), function () { goTo(id); }); // zoom in on it, then open it (js/zoom.js)
    return;
  }

  const route = findRoute(here, id);
  let points = [];
  for (let i = 0; i < route.length - 1; i++) {
    const leg = roadPoints(route[i], route[i + 1]);
    points = points.concat(i === 0 ? leg : leg.slice(1));
  }

  walkAlong(points, function () {
    player.spots[mapId] = id;
    writeSave(player);
    markHere();
    setTimeout(function () {
      zoomInto(findPlace(id), function () { goTo(id); }); // zoom in on it, then open it (js/zoom.js)
    }, 200);
  });
}

// Move the character smoothly along a list of points, then call done().
function walkAlong(points, done) {
  const map = document.getElementById("map");
  const sprite = document.getElementById("map-sprite");
  const spriteImg = document.getElementById("map-sprite-img");
  const width = map.clientWidth;
  const height = map.clientHeight;

  // Work in pixels so walking speed is the same in every direction.
  const px = points.map(function (p) { return [p[0] / 100 * width, p[1] / 100 * height]; });
  const lengths = [];
  let total = 0;
  for (let i = 0; i < px.length - 1; i++) {
    const len = Math.hypot(px[i + 1][0] - px[i][0], px[i + 1][1] - px[i][1]);
    lengths.push(len);
    total += len;
  }

  walking = true;
  sprite.classList.add("walking");
  const speed = WALK_SPEED * width * walkSpeedFactor(); // pixels per second; hungry means slower (js/hunger.js)
  const startTime = performance.now();

  function step(now) {
    let distance = (now - startTime) / 1000 * speed;
    if (distance >= total) {
      const last = points[points.length - 1];
      moveSprite(last[0], last[1]);
      sprite.classList.remove("walking");
      spriteImg.style.scale = "1 1";
      walking = false;
      walkedSoFar(total / width); // walking makes you hungry (js/hunger.js)
      done();
      return;
    }
    // Find which bit of road we're on, and how far along it.
    let i = 0;
    while (distance > lengths[i]) {
      distance -= lengths[i];
      i++;
    }
    const t = lengths[i] ? distance / lengths[i] : 0;
    moveSprite(points[i][0] + (points[i + 1][0] - points[i][0]) * t,
               points[i][1] + (points[i + 1][1] - points[i][1]) * t);
    // Face the way we're walking.
    if (points[i + 1][0] < points[i][0]) spriteImg.style.scale = "-1 1";
    if (points[i + 1][0] > points[i][0]) spriteImg.style.scale = "1 1";
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ---------------------------------------------------------------- places

function showPlace(id) {
  const place = findPlace(id);
  const cameFrom = player.at; // to zoom back out from the spot you just left (js/zoom.js)
  player.at = id;
  writeSave(player);

  flashTitle("place-title", place.name, cameFrom !== id); // js/zoom.js
  document.getElementById("place-image").src = picture(roomPicture(id)); // js/furniture.js
  document.getElementById("place-image").alt = place.name;
  document.getElementById("place-description").textContent = place.description || "";
  setBackButton(document.getElementById("btn-place-back"), place);
  const spots = placesIn(id);
  drawSpots(document.getElementById("place-spots"), spots.filter(function (s) { return !s.side; }), openSpot);
  drawSideButtons(spots.filter(function (s) { return s.side; }));
  standYouIn(place); // you, standing just inside (js/you.js)
  showPlaceItems(place); // shelf items, or things left here (js/items.js)
  noteMuseumVisit(place); // the Exhibit Rooms seen so far (js/museum.js)
  showFurniture(place);  // movable furniture (js/furniture.js)
  showChore(place);      // dust and the Clean Room button (js/chores.js)
  showMine(place);       // the Crystal Cave's pickaxes and hidden finds (js/mining.js)
  showWindy(place);      // the dark ski slope, and the little WIT in the Snowy Hut (js/windy.js)
  showUnicornWoods(place); // the shy unicorn behind the meadow's trees (js/unicorns.js)
  showDanceFloor(place);   // the Disco Dance Hall's dancers and piano keys (js/music.js)
  showMarket(place);       // the Flea Market's tables and shoppers (js/market.js)
  showCoasterCar(place);   // the roller coaster car waiting at the start (js/coaster.js)
  showPearlCave(place);    // Find the Pearls! in the Pearl Cave (js/pearls.js)
  leaveBeehive(place);     // honey still in your pot goes in the basket (js/honey.js)
  showPixie(place);        // the Pixie, if she's hiding here today (js/pixie.js)
  showAgility(place);      // your pet in the Agility Park (js/agility.js)
  showScreen("screen-place");
  zoomOutFrom(cameFrom, id, "place-zoom");
}

// What happens when you click a spot in a place.
function openSpot(childId) {
  if (placementMode) return;
  const child = findPlace(childId);
  if (skillSpotLocked(child)) return; // waiting for the next skill test, or needs a skill Level (js/skills.js)
  if (child.sitAt) sitYouAt(child.sitAt, { spot: child.id }); // a seat: you sit down on it first (js/you.js)
  if (child.type === "person") {
    // People talk instead of opening a new picture.
    document.getElementById("place-description").textContent =
      "💬 " + child.name + ': "' + (child.says || "Hello!") + '"';
    return;
  }
  if (child.type === "fishing") return startFishing(child); // js/fishing.js
  if (child.type === "digging") return startDigging(child); // js/digging.js
  if (child.type === "marshmallows") return openMarshmallows(); // js/hunger.js
  if (child.type === "picking") return pickFruit(child);        // js/orchard.js
  if (child.type === "crafting") return openCrafting();         // js/spells.js
  if (child.type === "selling") return openGemsShelf();          // js/trading.js
  if (child.type === "dance_puzzle") return openDancePuzzle(); // js/dance.js
  if (child.type === "bath") return openBath();                // js/bonding.js
  if (child.type === "cuddle") return openCuddle(acornClue(child.id).trim() || undefined); // js/bonding.js (the Pond House couch may hide a clue, js/pixie.js)
  if (child.type === "cafe") return openCafe(child);           // js/cafe.js
  if (child.type === "travel") return goTo(child.to);          // a shortcut, like Windy Peak's arrows
  if (child.type === "owl_dropoff") return openOwlDropoff();   // js/bonding.js
  if (child.type === "look") return windyLook(child) || lookThrough(child); // binoculars, below (or the Windy Peak rescue, js/windy.js)
  if (child.type === "ski_down") return windySkiDown(child);   // the slope, or straight to the hut (js/windy.js)
  if (child.type === "elevator") return openElevator(child);   // a building with floors, below
  if (child.type === "coaster") return openCoaster();          // js/coaster.js
  if (child.type === "piano") return openPiano();              // js/music.js
  if (child.type === "piano_lesson") return openPianoLesson(); // js/music.js
  if (child.type === "pet_tricks") return openPetTricks(child);  // js/agility.js
  if (child.type === "pet_walk") return openPetWalk();         // js/agility.js
  if (child.type === "pet_sign") return openPetSign();         // js/agility.js
  if (child.type === "care") return openCareSpot(child);       // falconry, yarn, swimming... (js/bonding.js)
  if (child.type === "honey") return openBeehive();            // js/honey.js
  if (child.type === "archery") return openArchery();          // js/sports.js
  if (child.type === "soccer") return openSoccer();            // js/sports.js
  if (child.type === "riddle") return askRiddle();             // js/pixie.js
  if (child.type === "turtle_sniff") return turtleSniff();     // js/pixie.js
  if (child.type === "pond") return openPond();                // js/pixie.js
  if (child.type === "smores") return grabSmore();             // js/pixie.js
  if (child.type === "fireplace") return roastSmore();         // js/pixie.js
  if (child.type === "hot_chocolate") return drinkHotChocolate(); // js/pixie.js
  if (child.type === "tiny_hole") return openTinyHole(child);  // js/museum.js
  if (child.type === "museum_pay") return openMuseumPay();     // js/museum.js
  if (child.type === "menu_shop") return openMenuShop(child);  // js/museum.js
  if (child.type === "seat") return sitDown();                 // js/museum.js
  if (child.type === "market_booth") return openMarketBooth();  // js/market.js
  if (child.type === "market_table") return openMarketTable();  // js/market.js
  if (child.type === "artifact_chest") return openArtifactChest(); // js/museum.js
  if (child.type === "classroom") {                             // a Wizard School classroom with no teacher yet
    document.getElementById("place-description").textContent =
      "🚪 The " + child.name + " has no teacher yet. One day you'll learn: " + (child.teaches || "something new!");
    return;
  }
  zoomInto(child, function () { goTo(childId); }); // zoom in on it, then open it (js/zoom.js)
}

// Previous / next buttons ("side": "left" or "right") stand just outside the
// picture, so they never cover the girls' drawing (Scott, 2026-10-16).
function drawSideButtons(spots) {
  const box = document.getElementById("place-sides");
  box.innerHTML = "";
  document.getElementById("place-picture").classList.toggle("has-sides", spots.length > 0);
  spots.forEach(function (spot) {
    const button = document.createElement("button");
    button.className = "side-button side-" + spot.side;
    button.innerHTML = '<span class="side-arrow"></span><span class="side-name"></span>';
    button.querySelector(".side-arrow").textContent = spot.side === "left" ? "⬅️" : "➡️";
    button.querySelector(".side-name").textContent = spot.name;
    button.addEventListener("click", function () { openSpot(spot.id); });
    box.appendChild(button);
  });
  requestAnimationFrame(placeSideButtons); // once the place screen is showing
}

// Halfway down the picture, one each side of it.
function placeSideButtons() {
  const pic = document.getElementById("place-picture");
  document.querySelectorAll("#place-sides .side-button").forEach(function (button) {
    const gap = 12;
    const left = button.classList.contains("side-left")
      ? Math.max(4, pic.offsetLeft - button.offsetWidth - gap)
      : pic.offsetLeft + pic.offsetWidth + gap;
    button.style.left = left + "px";
    button.style.top = (pic.offsetTop + pic.offsetHeight / 2 - button.offsetHeight / 2) + "px";
  });
}

window.addEventListener("resize", placeSideButtons);
document.getElementById("place-image").addEventListener("load", placeSideButtons);

// The elevator in a building with floors (the Multi-House, Scott 2026-10-14).
// The building lists its floors in "floors", Floor 1 first; null is a floor
// not built yet. Like the girls' floor legends, but only the numbers show:
// you have to ride up and find out what's on each floor. Floor 6 is at the
// top and a star marks the floor you're on. "place" is the building itself
// (you're outside) or an elevator spot inside it.
function openElevator(place, message) {
  const building = place.floors ? place : findPlace(place.building);
  const body = openInfoPanel("🛗", building.name + " Elevator", message || "Which floor?");
  const list = document.createElement("div");
  list.className = "elevator-floors";
  for (let floor = building.floors.length; floor >= 1; floor--) {
    list.appendChild(floorButton(building, floor));
  }
  const exit = document.createElement("button");
  exit.className = "big-button";
  exit.textContent = "🚪 Exit";
  exit.addEventListener("click", function () {
    document.getElementById("info-panel").hidden = true;
    goTo(building.in);
  });
  list.appendChild(exit);
  body.appendChild(list);
}

function floorButton(building, floor) {
  const placeId = building.floors[floor - 1];
  const button = document.createElement("button");
  button.className = "big-button secondary";
  const here = placeId && placeId === player.at;
  button.textContent = "Floor " + floor + (here ? " ★" : "");
  button.disabled = here;
  button.addEventListener("click", function () {
    // A floor nobody has drawn yet: the doors open on an empty floor.
    if (!placeId) return openElevator(building, "🚧 Floor " + floor + " is still being built. Try another floor!");
    document.getElementById("info-panel").hidden = true;
    goTo(placeId);
  });
  return button;
}

// A spot you look through, like Windy Peak's binoculars: shows a picture
// ("picture" on the spot) in a round binocular view.
function lookThrough(spot) {
  const lens = document.createElement("div");
  lens.className = "binocular-view";
  const view = document.createElement("img");
  view.src = picture(spot.picture);
  view.alt = spot.name;
  lens.appendChild(view);
  openInfoPanel("🔭", spot.name, spot.says || "");
  document.getElementById("info-body").appendChild(lens);
}

// ---------------------------------------------------------------- placement mode

// Press P, then click a map or place picture to see the x/y numbers for places.js.
document.addEventListener("keydown", function (event) {
  if (event.key !== "p" && event.key !== "P") return;
  if (event.target.tagName === "INPUT") return; // typing a name, not a shortcut
  if (!player || walking) return;

  placementMode = !placementMode;
  document.querySelectorAll(".picture").forEach(function (pic) {
    pic.classList.toggle("placing", placementMode);
  });
  const info = document.getElementById("placement-info");
  info.textContent = "Placement mode: click the picture to see its position. Press P to stop.";
  info.hidden = !placementMode;
  document.getElementById("map-hint").hidden = placementMode;
  if (!placementMode) {
    document.querySelectorAll(".placement-marker").forEach(function (m) { m.remove(); });
  }
});

document.querySelectorAll(".picture").forEach(function (pic) {
  pic.addEventListener("click", function (event) {
    if (!placementMode) return;
    const rect = pic.getBoundingClientRect();
    const x = Math.round((event.clientX - rect.left - pic.clientLeft) / pic.clientWidth * 1000) / 10;
    const y = Math.round((event.clientY - rect.top - pic.clientTop) / pic.clientHeight * 1000) / 10;

    let marker = pic.querySelector(".placement-marker");
    if (!marker) {
      marker = document.createElement("div");
      marker.className = "placement-marker";
      pic.appendChild(marker);
    }
    marker.style.left = x + "%";
    marker.style.top = y + "%";
    document.getElementById("placement-info").textContent =
      '"x": ' + x + ', "y": ' + y + "   (press P to stop)";
  });
});

// Make each map or place picture as big as the window allows. The picture's
// shape (width / height) is passed to the CSS, which picks the largest size
// that still fits both the window's width and its height (see .picture).
document.querySelectorAll(".picture-image").forEach(function (img) {
  img.addEventListener("load", function () {
    img.closest(".picture").style.setProperty("--shape", img.naturalWidth / img.naturalHeight);
  });
});
