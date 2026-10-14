// The Roller Coaster on Floor 2 of the Multi-House. The track is in
// data/coaster.js. The black box the girls drew at the start of the track is
// the coaster car (Scott, 2026-10-14): it's cut out of the picture
// (coaster_car) so it can move. You ride in it, and so does your pet if you
// take one from your backpack along, for a Bonding Point (once every few
// minutes for each pet, like other bonding).

let riding = false;

// Called by showPlace for every place: on the coaster floor, the car waits
// at the start of the track.
function showCoasterCar(place) {
  if (riding) return;
  const old = document.querySelector(".coaster-train");
  if (old) old.remove();
  if (!placesIn(place.id).some(function (spot) { return spot.type === "coaster"; })) return;
  const train = coasterTrain(null, false);
  document.getElementById("place-picture").appendChild(train);
  placeTrain(train, GAME_DATA.coaster.track[0], -Math.PI / 2);
}

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

// The car, with you (and your pet) sitting in it when "riders" is true.
function coasterTrain(pet, riders) {
  const train = document.createElement("div");
  train.className = "coaster-train";
  const car = document.createElement("div");
  car.className = "coaster-car";
  if (isDrawn("coaster_car")) {
    const img = document.createElement("img");
    img.src = picture("coaster_car");
    img.alt = "Coaster car";
    car.appendChild(img);
  } else {
    car.textContent = GAME_DATA.coaster.car;
  }
  train.appendChild(car);
  if (!riders) return train;
  const seats = document.createElement("div"); // the riders stay upright while the car turns
  seats.className = "coaster-riders";
  const me = document.createElement("img");
  me.src = characterPicture(findCharacter(player.characterId)); // js/world.js
  me.alt = player.playerName;
  seats.appendChild(me);
  if (pet) {
    const art = itemArt(pet); // js/items.js: the drawing, or the emoji
    const petSeat = document.createElement("span");
    petSeat.className = "coaster-pet";
    if (typeof art === "string") petSeat.textContent = art;
    else petSeat.appendChild(art);
    seats.appendChild(petSeat);
  }
  train.appendChild(seats);
  return train;
}

// Put the train at a spot on the picture, the car turned the way the track goes.
// The girls drew the car pointing up the track, so "up" is no turn.
function placeTrain(train, at, angle) {
  train.style.left = at[0] + "%";
  train.style.top = at[1] + "%";
  train.querySelector(".coaster-car").style.rotate = (angle * 180 / Math.PI + 90) + "deg";
}

// The car whooshes along the track: slower going up, faster going down.
function rideCoaster(pet) {
  if (riding) return;
  riding = true;
  document.getElementById("info-panel").hidden = true;
  const old = document.querySelector(".coaster-train");
  if (old) old.remove(); // the parked car becomes the one you ride
  const rules = GAME_DATA.coaster;
  const train = coasterTrain(pet, true);
  document.getElementById("place-picture").appendChild(train);
  document.getElementById("place-description").textContent = "🎢 Wheeeee!";

  const track = rules.track;
  const startedAt = player.at; // the ride stops if you leave the floor
  let leg = 0;      // which bit of track the car is on
  let along = 0;    // how far along that bit (0 to 1)
  let last = performance.now();
  const baseSpeed = trackLength(track) / rules.seconds; // percent per second, on the flat
  function step(now) {
    if (player.at !== startedAt) { riding = false; return train.remove(); } // you took the elevator mid-ride
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
    placeTrain(train, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], Math.atan2(b[1] - a[1], b[0] - a[0]));
    if (leg >= track.length - 2 && along >= 1) return endRide(train, pet);
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function trackLength(track) {
  let total = 0;
  for (let i = 0; i < track.length - 1; i++) total += Math.hypot(track[i + 1][0] - track[i][0], track[i + 1][1] - track[i][1]);
  return total;
}

function endRide(train, pet) {
  riding = false;
  train.remove();
  showCoasterCar(findPlace(player.at)); // the car is back at the start for the next ride
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
