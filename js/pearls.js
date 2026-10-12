// Find the Pearls! in the Pearl Cave. Pearls hide at random spots in the
// water; click to search. Where they hide is saved, so leaving and coming
// back doesn't reshuffle them. The numbers are in data/pearls.js.

// Hide new pearls, if they're all found and enough time has passed.
function refillPearls() {
  const hunt = GAME_DATA.pearlHunt;
  const state = player.pearls;
  if (state.hidden.length > 0 || Date.now() < state.refillAt) return;
  const a = hunt.area;
  for (let i = 0; i < hunt.pearls; i++) {
    state.hidden.push([a[0] + Math.random() * (a[2] - a[0]), a[1] + Math.random() * (a[3] - a[1])]);
  }
  writeSave(player);
}

function showPearlCave(place) {
  const box = document.getElementById("place-pearls");
  box.innerHTML = "";
  box.hidden = place.id !== GAME_DATA.pearlHunt.place;
  if (box.hidden) return;
  refillPearls();
  pearlSay(pearlCount());
}

function pearlSay(message) {
  document.getElementById("place-description").textContent = message;
}

// "3 pearls are hiding in the water..." or how long until new ones come.
function pearlCount() {
  const left = player.pearls.hidden.length;
  if (left > 0) return "Find the pearls! " + left + " pearl" + (left === 1 ? " is" : "s are") + " hiding in the water. Click to search.";
  const minutes = Math.max(1, Math.ceil((player.pearls.refillAt - Date.now()) / 60000));
  return "You found all the pearls! New ones will wash in in about " + minutes + " minute" + (minutes === 1 ? "" : "s") + ".";
}

// How far (in percent of the picture) from x, y to the closest hidden pearl: [distance, index].
function closestPearl(x, y) {
  let best = [Infinity, -1];
  player.pearls.hidden.forEach(function (spot, i) {
    const d = Math.hypot(spot[0] - x, spot[1] - y);
    if (d < best[0]) best = [d, i];
  });
  return best;
}

function searchForPearl(event) {
  if (placementMode || document.getElementById("place-pearls").hidden) return;
  if (event.target.closest(".spot")) return; // clicking a spot isn't searching
  const pic = document.getElementById("place-picture");
  const rect = pic.getBoundingClientRect();
  const x = (event.clientX - rect.left - pic.clientLeft) / pic.clientWidth * 100;
  const y = (event.clientY - rect.top - pic.clientTop) / pic.clientHeight * 100;
  if (player.pearls.hidden.length === 0) return pearlSay(pearlCount());

  const hunt = GAME_DATA.pearlHunt;
  const closest = closestPearl(x, y);
  if (closest[0] <= hunt.findDistance) return foundPearl(closest[1]);
  showSplash(x, y, "💧");
  pearlSay(closest[0] <= hunt.warmDistance ? "🔥 Warmer! A pearl is close by." : "Splash! Nothing here. Keep looking.");
}

function foundPearl(i) {
  const spot = player.pearls.hidden.splice(i, 1)[0];
  const pearl = GAME_DATA.pearlFinds[0];
  player.satchel.push(pearl.id);   // spell ingredients go in the satchel (js/storage.js)
  player.gems += pearl.gems;
  if (player.pearls.hidden.length === 0) {
    player.pearls.refillAt = Date.now() + GAME_DATA.pearlHunt.refillMinutes * 60000;
  }
  writeSave(player);
  showSplash(spot[0], spot[1], pearl.emoji).classList.add("found");
  pearlSay("✨ You found a pearl! +" + pearl.gems + " gems, and it's in your satchel for spells. " + pearlCount());
}

// A little picture that pops up where you clicked, then fades away.
function showSplash(x, y, emoji) {
  const splash = document.createElement("span");
  splash.className = "pearl-splash";
  splash.textContent = emoji;
  splash.style.left = x + "%";
  splash.style.top = y + "%";
  document.getElementById("place-pearls").appendChild(splash);
  setTimeout(function () { splash.remove(); }, 1500);
  return splash;
}

document.getElementById("place-picture").addEventListener("click", searchForPearl);
