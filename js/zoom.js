// Zooming in and out of maps (Scott, 2026-10-17: "feel like you're inside it").
// Walking into a place on a map zooms the map in on that place until it fills
// the box, then the place's own drawing fades in. Going back out to the map
// starts zoomed in on the place you left and zooms back out.

const ZOOM_SCALE = 4;        // how many times bigger the map grows (a quarter of the map fills the box)
const ZOOM_IN_SECONDS = 0.8;
const ZOOM_OUT_SECONDS = 0.6;

// Some people's computers ask for less movement on screen; then we just switch.
function lessMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Grow the map layer ZOOM_SCALE times so (x, y) (percent of the map) ends up in
// the middle of the box, held in at the edges so the box never shows past the
// end of the map. It grows from one fixed point, so it's one smooth zoom.
function zoomTowards(layer, x, y) {
  const s = ZOOM_SCALE;
  // The fixed point: where the map's left/top edge would have to move to, as a share of the growth.
  const fixed = function (p) { return Math.min(100, Math.max(0, (p * s - 50) / (s - 1))); };
  layer.style.transformOrigin = fixed(x) + "% " + fixed(y) + "%";
  layer.style.transform = "scale(" + s + ")";
}

// Zoom the map in on a spot, then call done() (which opens the place).
function zoomInto(spot, done) {
  const layer = document.getElementById("map-zoom");
  if (lessMotion() || spot.x === undefined) return done();
  layer.style.transition = "transform " + ZOOM_IN_SECONDS + "s ease-in, opacity " + ZOOM_IN_SECONDS + "s ease-in";
  layer.classList.add("zooming");
  zoomTowards(layer, spot.x, spot.y);
  layer.style.opacity = "0.15"; // fades as it nears, so the place's drawing can fade in after
  setTimeout(function () {
    done();
    resetZoom();
    arriveIn(document.getElementById("place-picture"));
    arriveIn(document.getElementById("map")); // a territory map opened from the World map
  }, ZOOM_IN_SECONDS * 1000);
}

// Put the map layer back to normal at once (no animation).
function resetZoom() {
  const layer = document.getElementById("map-zoom");
  layer.style.transition = "none";
  layer.style.transform = "";
  layer.style.opacity = "";
  layer.classList.remove("zooming");
}

// The new picture fades in, settling from slightly too big, as if you're still moving in.
function arriveIn(picture) {
  picture.classList.remove("arriving");
  void picture.offsetWidth; // restart the animation if it's already run once
  picture.classList.add("arriving");
  picture.onanimationend = function (event) {
    if (event.target === picture) picture.classList.remove("arriving"); // or it fades in again every time it's shown
  };
}

// Coming back out to a map from a place on it (or from somewhere inside that
// place): start zoomed in on the place, then zoom out to the whole map.
function zoomOutFrom(fromId, mapId) {
  const spot = spotOnMap(fromId, mapId);
  if (lessMotion() || !spot || spot.x === undefined) return;
  const layer = document.getElementById("map-zoom");
  layer.style.transition = "none";
  layer.classList.add("zooming");
  zoomTowards(layer, spot.x, spot.y);
  layer.style.opacity = "0.15";
  void layer.offsetWidth; // let the browser draw the zoomed-in start first
  layer.style.transition = "transform " + ZOOM_OUT_SECONDS + "s ease-out, opacity " + ZOOM_OUT_SECONDS + "s ease-out";
  layer.style.transform = "";
  layer.style.opacity = "";
  setTimeout(function () { layer.classList.remove("zooming"); }, ZOOM_OUT_SECONDS * 1000);
}

// The spot on this map that a place is in (the place itself, or what it's inside of).
function spotOnMap(placeId, mapId) {
  let place = findPlace(placeId);
  while (place && place.in && place.in !== mapId) place = findPlace(place.in);
  return place && place.in === mapId ? place : null;
}
