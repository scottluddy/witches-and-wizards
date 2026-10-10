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

// The places that sit inside a map or place.
function placesIn(id) {
  return GAME_DATA.places.filter(function (place) { return place.in === id; });
}

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
  if (place.opens) return goTo(place.opens); // e.g. the Snowy Hut opens straight into the Rec Room
  if (place.type === "map") showMap(id);
  else showPlace(id);
}

// The "Back to ..." button: go up to the map or place this one sits inside.
// A place that just "opens" another is skipped, or Back would bounce straight back in.
function setBackButton(button, place) {
  let parent = place.in ? findPlace(place.in) : null;
  while (parent && parent.opens && parent.in) parent = findPlace(parent.in);
  button.hidden = !parent;
  if (parent) {
    button.textContent = "⬅ Back to " + parent.name;
    button.onclick = function () { goTo(parent.id); };
  }
}

// Clickable spots (a dot and a name) for the places inside a map or place.
function drawSpots(box, places, onClick) {
  box.innerHTML = "";
  places.forEach(function (place) {
    const button = document.createElement("button");
    button.className = "spot";
    button.dataset.id = place.id;
    button.style.left = place.x + "%";
    button.style.top = place.y + "%";
    button.innerHTML = '<span class="dot"></span><span class="label"></span>';
    button.querySelector(".label").textContent = (place.type === "fishing" ? "🎣 " : place.type === "digging" ? "⛏️ " : "") + place.name;
    button.addEventListener("click", function () { onClick(place.id); });
    box.appendChild(button);
  });
}

// ---------------------------------------------------------------- maps

function showMap(mapId) {
  const map = findPlace(mapId);
  const spots = placesIn(mapId);
  player.at = mapId;

  // Where the character stands: where they were last time, or the start spot.
  let here = player.spots[mapId];
  if (!findPlace(here) || findPlace(here).in !== mapId) {
    const start = spots.find(function (p) { return p.start; }) || spots[0];
    here = start ? start.id : null;
    player.spots[mapId] = here;
  }
  writeSave(player);

  document.getElementById("map-title").textContent = map.name;
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
    svg.appendChild(line);
  });
}

function roadsOn(mapId) {
  return GAME_DATA.paths.filter(function (path) {
    const from = findPlace(path.from);
    const to = findPlace(path.to);
    return from && to && from.in === mapId && to.in === mapId;
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
  const mapId = player.at;
  const here = player.spots[mapId];
  if (!here || id === here) {
    player.spots[mapId] = id;
    goTo(id);
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
    setTimeout(function () { goTo(id); }, 400);
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
  const speed = WALK_SPEED * width; // pixels per second
  const startTime = performance.now();

  function step(now) {
    let distance = (now - startTime) / 1000 * speed;
    if (distance >= total) {
      const last = points[points.length - 1];
      moveSprite(last[0], last[1]);
      sprite.classList.remove("walking");
      spriteImg.style.scale = "1 1";
      walking = false;
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
  player.at = id;
  writeSave(player);

  document.getElementById("place-title").textContent = place.name;
  document.getElementById("place-image").src = picture(roomPicture(id)); // js/furniture.js
  document.getElementById("place-image").alt = place.name;
  document.getElementById("place-description").textContent = place.description || "";
  setBackButton(document.getElementById("btn-place-back"), place);
  drawSpots(document.getElementById("place-spots"), placesIn(id), function (childId) {
    if (placementMode) return;
    const child = findPlace(childId);
    if (child.type === "person") {
      // People talk instead of opening a new picture.
      document.getElementById("place-description").textContent =
        "💬 " + child.name + ': "' + (child.says || "Hello!") + '"';
      return;
    }
    if (child.type === "fishing") return startFishing(child); // js/fishing.js
    if (child.type === "digging") return startDigging(child); // js/digging.js
    goTo(childId);
  });
  showPlaceItems(place); // shelf items, or things left here (js/items.js)
  showFurniture(place);  // movable furniture (js/furniture.js)
  showChore(place);      // dust and the Clean Room button (js/chores.js)
  showScreen("screen-place");
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
    img.parentElement.style.setProperty("--shape", img.naturalWidth / img.naturalHeight);
  });
});
