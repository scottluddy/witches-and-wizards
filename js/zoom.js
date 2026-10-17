// Zooming in and out (Scott, 2026-10-17: "feel like you're inside it").
// Going into a place, from a map or from a bigger place (the store to a shelf),
// zooms the picture in on it until it fills the box, then the place's own
// drawing fades in. Zooming back out starts zoomed in on the place you left and
// zooms out to the whole picture. Each picture's things sit in one zoom layer:
// #map-zoom on maps, #place-zoom in places.

const ZOOM_SCALE = 4;        // how many times bigger the picture grows (a quarter of it fills the box)
const ZOOM_IN_SECONDS = 0.8;
const ZOOM_OUT_SECONDS = 0.6;

// Some people's computers ask for less movement on screen; then we just switch.
function lessMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Grow a zoom layer ZOOM_SCALE times so (x, y) (percent of the picture) ends up
// in the middle of the box, held in at the edges so the box never shows past
// the end of the picture. It grows from one fixed point, so it's one smooth zoom.
function zoomTowards(layer, x, y) {
  const s = ZOOM_SCALE;
  // The fixed point: where the picture's left/top edge would have to move to, as a share of the growth.
  const fixed = function (p) { return Math.min(100, Math.max(0, (p * s - 50) / (s - 1))); };
  layer.style.transformOrigin = fixed(x) + "% " + fixed(y) + "%";
  layer.style.transform = "scale(" + s + ")";
  layer.style.opacity = "0.15"; // fades as it nears, so the next drawing can fade in after
  layer.classList.add("zooming");
  layer.parentElement.classList.add("zooming"); // hides things laid on the picture outside the layer
}

// Zoom in on a spot (on the map or place showing now), then call done() (which opens it).
function zoomInto(spot, done) {
  const layer = document.querySelector(".screen:not([hidden]) .zoom-layer");
  if (lessMotion() || !layer || spot.x === undefined) return done();
  layer.style.transition = "transform " + ZOOM_IN_SECONDS + "s ease-in, opacity " + ZOOM_IN_SECONDS + "s ease-in";
  zoomTowards(layer, spot.x, spot.y);
  setTimeout(function () {
    const before = player.at;
    done();
    resetZoom(layer);
    if (player.at === before) return; // it didn't open after all (like the Museum without a ticket)
    arriveIn(document.querySelector(".screen:not([hidden]) .picture"));
  }, ZOOM_IN_SECONDS * 1000);
}

// Put a zoom layer back to normal at once (no animation).
function resetZoom(layer) {
  layer.style.transition = "none";
  layer.style.transform = "";
  layer.style.opacity = "";
  layer.classList.remove("zooming");
  layer.parentElement.classList.remove("zooming");
}

// The new picture fades in, settling from slightly too big, as if you're still moving in.
function arriveIn(picture) {
  if (!picture) return;
  picture.classList.remove("arriving");
  void picture.offsetWidth; // restart the animation if it's already run once
  picture.classList.add("arriving");
  picture.onanimationend = function (event) {
    if (event.target === picture) picture.classList.remove("arriving"); // or it fades in again every time it's shown
  };
}

// Coming back out to a map or place from a spot on it (or from somewhere inside
// that spot): start zoomed in on the spot, then zoom out to the whole picture.
function zoomOutFrom(fromId, toId, layerId) {
  const spot = spotOnMap(fromId, toId);
  if (lessMotion() || !spot || spot.x === undefined) return;
  const layer = document.getElementById(layerId);
  layer.style.transition = "none";
  zoomTowards(layer, spot.x, spot.y);
  void layer.offsetWidth; // let the browser draw the zoomed-in start first
  layer.style.transition = "transform " + ZOOM_OUT_SECONDS + "s ease-out, opacity " + ZOOM_OUT_SECONDS + "s ease-out";
  layer.style.transform = "";
  layer.style.opacity = "";
  setTimeout(function () {
    layer.classList.remove("zooming");
    layer.parentElement.classList.remove("zooming");
  }, ZOOM_OUT_SECONDS * 1000);
}

// The spot on this map or place that another place is in (the place itself, or what it's inside of).
function spotOnMap(placeId, mapId) {
  let place = findPlace(placeId);
  while (place && place.in && place.in !== mapId) place = findPlace(place.in);
  return place && place.in === mapId ? place : null;
}

// The name of a map or place shows like a storybook caption when you arrive,
// then fades away (Scott, 2026-10-17: less writing on top, more being inside it).
function flashTitle(titleId, name, arrived) {
  const title = document.getElementById(titleId);
  title.textContent = name;
  if (!arrived) return; // the same place drawn again, like after buying something
  title.classList.remove("caption");
  void title.offsetWidth; // restart the fade
  title.classList.add("caption");
}
