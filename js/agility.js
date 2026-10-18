// Walks and Tricks in the Agility Park, part of the Pet Training Field
// (Scott, 2026-10-18): the girls' drawing. Your pet comes out of your backpack and stands next to you;
// click a tunnel, the hoops, the weave posts or the ramp and you walk over
// while your pet runs it. All four in one visit finish the course (+1 Bonding
// Point); a lap of the track together is another. Numbers and paths are in
// data/agility.js, the Bonding Points in data/bonding.js.

const FIELD = "agility_park"; // inside the Pet Training Field
let agility = { pet: null, done: [], busy: false, timer: null };

// Called for every place you walk into (js/world.js showPlace).
function showAgility(place) {
  clearTimeout(agility.timer);
  agility = { pet: null, done: [], busy: false, timer: null };
  const box = document.getElementById("place-agility");
  box.innerHTML = "";
  box.hidden = place.id !== FIELD;
  if (box.hidden) return;
  // With just one pet that can train, it comes straight out; with more, you pick at the first click.
  const pets = agilityPets();
  if (pets.length === 1) bringOut(pets[0]);
}

function stillAtField() {
  return player && player.at === FIELD && !document.getElementById("screen-place").hidden;
}

// Pets in your backpack that can walk and do tricks (data/agility.js "animals").
function agilityPets() {
  const animals = GAME_DATA.agility.animals;
  return petsIn(player.backpack).filter(function (pet) { return animals.indexOf(animalOf(pet)) !== -1; }); // js/bonding.js
}

function say(text) {
  document.getElementById("place-description").textContent = text.replace(/PET/g, agility.pet ? agility.pet.name : "your pet");
}

// ---------------------------------------------------------------- clicking things

// A tunnel, the hoops, the weave posts or the ramp ("type": "pet_tricks" in data/places.js).
function openPetTricks(spot) {
  whenPetReady(function () { doTrick(spot); });
}

// Walk the Track ("type": "pet_walk").
function openPetWalk() {
  whenPetReady(walkTrack);
}

// Your pet needs to be out (and still in your backpack), and not in the middle of something.
function whenPetReady(then) {
  if (agility.busy) return say(GAME_DATA.agility.words.busy);
  if (agility.pet && player.backpack.indexOf(agility.pet.id) === -1) {
    say(GAME_DATA.agility.words.left);
    agility.pet = null;
    document.getElementById("place-agility").innerHTML = "";
  }
  if (agility.pet) return then();
  const pets = agilityPets();
  if (pets.length === 1) {
    bringOut(pets[0]);
    return then();
  }
  choosePet(then);
}

// Pick which pet trains (several in your backpack, or swapping at the sign).
function choosePet(then) {
  const words = GAME_DATA.agility.words;
  const pets = agilityPets();
  const body = openInfoPanel("🐾", "Walks and Tricks", pets.length ? words.choose : words.noPets);
  const row = document.createElement("div");
  row.className = "item-row";
  pets.forEach(function (pet) {
    row.appendChild(itemCard(pet, words.pick, function () {
      document.getElementById("info-panel").hidden = true;
      bringOut(pet);
      if (then) then();
    }));
  });
  body.appendChild(row);
}

// The Training Sign: what your pet has done this visit, and the tricks each pet knows.
function openPetSign() {
  const a = GAME_DATA.agility;
  const pets = agilityPets();
  let message = pets.length ? "" : a.words.noPets;
  if (agility.pet) {
    message = "Today's course with " + agility.pet.name + ": " + Object.keys(a.tricks).map(function (id) {
      return (agility.done.indexOf(id) !== -1 ? "✅ " : "⬜ ") + a.tricks[id].name;
    }).join("   ");
  }
  const body = openInfoPanel("🪧", a.words.sign, message);
  const row = document.createElement("div");
  row.className = "item-row";
  pets.forEach(function (pet) {
    const card = itemCard(pet, pet === agility.pet ? null : a.words.swap, function () {
      document.getElementById("info-panel").hidden = true;
      if (agility.busy) return say(a.words.busy);
      bringOut(pet);
    });
    const known = document.createElement("small");
    const learned = learnedTricks(pet);
    known.textContent = learned.length ? "Knows: " + learned.join(", ") : "No tricks learned yet";
    card.appendChild(known);
    row.appendChild(card);
  });
  body.appendChild(row);
}

// ---------------------------------------------------------------- your pet on the field

// Your pet hops out of the backpack and stands next to you.
function bringOut(pet) {
  agility.pet = pet;
  agility.done = [];
  const box = document.getElementById("place-agility");
  box.innerHTML = "";
  const el = document.createElement("div");
  el.id = "agility-pet";
  el.className = "agility-pet";
  el.title = pet.name;
  el.appendChild(itemArt(pet)); // js/items.js: the girls' drawing, or its emoji
  box.appendChild(el);
  const you = whereYouAre();
  placePet(you.x + 6, you.y);
  markLearned();
  say(GAME_DATA.agility.words.ready);
}

// Feet at x, y, a bit smaller than you would be standing there (smaller further back).
function placePet(x, y) {
  const el = document.getElementById("agility-pet");
  if (!el) return;
  const old = parseFloat(el.style.left);
  if (!isNaN(old) && x !== old) el.classList.toggle("facing-left", x < old);
  el.style.left = x + "%";
  el.style.top = y + "%";
  el.style.height = movedHeight(y) * GAME_DATA.agility.petSize + "%"; // js/you.js
  // An emoji pet (not drawn yet) needs its size in pixels.
  el.style.fontSize = document.getElementById("place-zoom").getBoundingClientRect().height *
    parseFloat(el.style.height) / 100 * 0.8 + "px";
}

// A golden glow once your pet has learned a trick.
function markLearned() {
  const el = document.getElementById("agility-pet");
  if (el) el.classList.toggle("learned", learnedTricks(agility.pet).length > 0);
}

function whereYouAre() {
  if (!youNow.el) return GAME_DATA.standing.places[FIELD];
  return { x: parseFloat(youNow.el.style.left), y: parseFloat(youNow.el.style.top) };
}

// You walk (not jump) to x, y, taking "seconds".
function walkYouTo(x, y, seconds) {
  if (!youNow.el) return;
  youNow.el.classList.add("moved", "strolling");
  youNow.el.style.setProperty("--step", seconds + "s");
  standAt(x, y); // js/you.js: smaller further back
}

// How long one step takes for this pet (turtles are slow!).
function stepSeconds() {
  const seconds = GAME_DATA.agility.seconds;
  return seconds[animalOf(agility.pet)] || seconds.default;
}

// The pet goes from point to point; "each" is told which step it's on.
function runAlong(points, seconds, each, done) {
  const el = document.getElementById("agility-pet");
  el.style.setProperty("--step", seconds + "s");
  let i = 0;
  function next() {
    if (!stillAtField()) return;
    if (i >= points.length) return done();
    placePet(points[i][0], points[i][1]);
    if (each) each(i);
    i++;
    agility.timer = setTimeout(next, seconds * 1000);
  }
  next();
}

// ---------------------------------------------------------------- tricks

function doTrick(spot) {
  const a = GAME_DATA.agility;
  const path = a.paths[spot.id];
  const el = document.getElementById("agility-pet");
  const steps = stepSeconds();
  agility.busy = true;
  // You both walk over to the start; you wait just beside it and watch.
  walkYouTo(path.points[0][0] - 5, path.points[0][1] + 3, 1);
  runAlong([path.points[0]], 1, null, function () {
    runAlong(path.points, steps, function (i) {
      el.classList.toggle("hidden", (path.hide || []).indexOf(i) !== -1);  // inside the tunnel
      el.classList.toggle("jumping", (path.jump || []).indexOf(i) !== -1); // in the air
    }, function () {
      el.classList.remove("hidden", "jumping");
      agility.busy = false;
      finishTrick(path.trick);
    });
  });
}

function finishTrick(trick) {
  const a = GAME_DATA.agility;
  const pet = agility.pet;
  const counts = player.tricks[pet.id] || (player.tricks[pet.id] = {});
  counts[trick] = (counts[trick] || 0) + 1;
  let said = a.tricks[trick].emoji + " " + a.tricks[trick].says;
  if (counts[trick] === a.learnAfter) said += " " + a.words.learned.replace("TRICK", a.tricks[trick].name);
  if (agility.done.indexOf(trick) === -1) agility.done.push(trick);
  if (agility.done.length === Object.keys(a.tricks).length) {
    said += " " + a.words.course + " " + bondFor("pet_tricks");
    agility.done = []; // start the course again
  } else {
    said += " (" + agility.done.length + " of " + Object.keys(a.tricks).length + " tricks on today's course)";
  }
  writeSave(player);
  markLearned();
  say(said);
}

// The tricks this pet has learned (done "learnAfter" times), by name.
function learnedTricks(pet) {
  const a = GAME_DATA.agility;
  const counts = player.tricks[pet.id] || {};
  return Object.keys(a.tricks).filter(function (id) { return (counts[id] || 0) >= a.learnAfter; })
    .map(function (id) { return a.tricks[id].name; });
}

// ---------------------------------------------------------------- the walk

// A whole lap of the path around the field, side by side.
function walkTrack() {
  const track = GAME_DATA.agility.track;
  const steps = stepSeconds() * 1.5; // a walk, not a run
  agility.busy = true;
  runAlong(track, steps, function (i) {
    walkYouTo(track[i][0] - 4, track[i][1] + 1, steps); // you walk just beside your pet
  }, function () {
    agility.busy = false;
    writeSave(player);
    say(GAME_DATA.agility.words.walked + " " + bondFor("pet_walk"));
  });
}

// ---------------------------------------------------------------- Bonding Points

// +1 Bonding Point, unless this pet had one this way in the last few minutes.
function bondFor(kind) {
  const pet = agility.pet;
  const wait = minutesUntilCare(kind, pet); // js/bonding.js
  if (wait) return GAME_DATA.agility.words.practice.replace("MIN", wait);
  const points = GAME_DATA.bonding[kind].points;
  player.bondingPoints += points;
  player.lastCare[kind][pet.id] = Date.now();
  writeSave(player);
  return "+" + points + " Bonding Point" + (points === 1 ? "" : "s") + "!";
}
