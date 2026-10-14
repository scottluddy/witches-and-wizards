// The Roller Coaster on Floor 2 of the Multi-House. The track is in
// data/coaster.js. Ride alone, or take a pet from your backpack along for a
// Bonding Point (once every few minutes for each pet, like other bonding).

let riding = false;

function openCoaster(message) {
  const body = openInfoPanel("🎢", "Roller Coaster", message || "Hop in! Ride alone, or take a pet from your backpack along.");
  const alone = document.createElement("button");
  alone.className = "big-button";
  alone.textContent = "🎢 Ride alone";
  alone.addEventListener("click", function () { rideCoaster(null); });
  body.appendChild(alone);
  const row = document.createElement("div");
  row.className = "item-row";
  petsIn(player.backpack).forEach(function (pet) { // js/bonding.js
    row.appendChild(itemCard(pet, "🎢 Ride together", function () { rideCoaster(pet); }));
  });
  body.appendChild(row);
}

// The car whooshes along the track: slower going up, faster going down.
function rideCoaster(pet) {
  if (riding) return;
  riding = true;
  document.getElementById("info-panel").hidden = true;
  const rules = GAME_DATA.coaster;
  const car = document.createElement("span");
  car.className = "coaster-car";
  car.textContent = rules.car + (pet ? pet.emoji || "🐾" : "");
  document.getElementById("place-picture").appendChild(car);
  document.getElementById("place-description").textContent = "🎢 Wheeeee!";

  const track = rules.track;
  let leg = 0;      // which bit of track the car is on
  let along = 0;    // how far along that bit (0 to 1)
  const startedAt = player.at; // the ride stops if you leave the floor
  let last = performance.now();
  const baseSpeed = trackLength(track) / rules.seconds; // percent per second, on the flat
  function step(now) {
    if (player.at !== startedAt) { riding = false; return car.remove(); } // you took the elevator mid-ride
    const seconds = (now - last) / 1000;
    last = now;
    const from = track[leg];
    const to = track[leg + 1];
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
    const downhill = (to[1] - from[1]) / length; // +1 straight down the picture, -1 straight up
    along += baseSpeed * (1 + 0.6 * downhill) * seconds / length;
    while (along >= 1 && leg < track.length - 2) { along -= 1; leg++; }
    const a = track[leg];
    const b = track[leg + 1];
    const t = Math.min(1, along);
    car.style.left = (a[0] + (b[0] - a[0]) * t) + "%";
    car.style.top = (a[1] + (b[1] - a[1]) * t) + "%";
    car.style.scale = b[0] < a[0] ? "-1 1" : "1 1";
    if (leg >= track.length - 2 && along >= 1) return endRide(car, pet);
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function trackLength(track) {
  let total = 0;
  for (let i = 0; i < track.length - 1; i++) total += Math.hypot(track[i + 1][0] - track[i][0], track[i + 1][1] - track[i][1]);
  return total;
}

function endRide(car, pet) {
  riding = false;
  car.remove();
  if (!pet) return openCoaster("What a ride! 🎢 Want to go again?");
  if (minutesUntilCare("coaster", pet) > 0) { // js/bonding.js
    return openCoaster("What a ride! Your " + pet.name + " loved it. (No Bonding Point this time: ride together again in " + minutesUntilCare("coaster", pet) + " min.)");
  }
  const points = GAME_DATA.bonding.coaster.points;
  player.bondingPoints += points;
  player.lastCare.coaster[pet.id] = Date.now();
  writeSave(player);
  openCoaster("What a ride! You and your " + pet.name + " screamed all the way down. +" + points + " Bonding Point!");
}
