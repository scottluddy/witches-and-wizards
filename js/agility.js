// The Pet Training Field's agility park (Scott, 2026-10-19: two activities).
// Your dogs and wolves stand next to you. Drag one onto the Starting Line and
// it walks a lap of the track, then runs one; drop it on the Obstacle Course
// and it goes over the ramp, through the weave posts, the bendy tunnel, the
// hoops and the long tunnel, disappearing inside each tunnel for a moment.
// Each finished: +1 Bonding Point. Numbers and routes are in data/agility.js.

const FIELD = "agility_park"; // inside the Pet Training Field
let agility = { pets: [], visit: 0 }; // pets: { pet, el, x, y, run } for each dog or wolf on the field

// Called for every place you walk into (js/world.js showPlace).
function showAgility(place) {
  agility = { pets: [], visit: agility.visit + 1 }; // a new visit stops any runs from the last one
  const box = document.getElementById("place-agility");
  box.innerHTML = "";
  box.hidden = place.id !== FIELD;
  if (box.hidden) return;
  drawStartMarks(box);
  const pets = agilityPets();
  if (!pets.length) return say(GAME_DATA.agility.words.noPets);
  // They stand in a row just beside you.
  const you = whereYouAre();
  pets.forEach(function (pet, i) { addTrainee(box, pet, you.x + 8 + i * 6, you.y); });
  say(GAME_DATA.agility.words.ready, pets.length === 1 ? pets[0] : null);
}

function stillAtField(visit) {
  return agility.visit === visit && player && player.at === FIELD &&
    !document.getElementById("screen-place").hidden;
}

// Dogs and wolves in your backpack (data/agility.js "animals").
function agilityPets() {
  const animals = GAME_DATA.agility.animals;
  return petsIn(player.backpack).filter(function (pet) { return animals.indexOf(animalOf(pet)) !== -1; }); // js/bonding.js
}

// PET in the words becomes the pet's name ("your pet" if there's more than one).
function say(text, pet) {
  document.getElementById("place-description").textContent = text.replace(/PET/g, pet ? pet.name : "your pet");
}

function whereYouAre() {
  if (!youNow.el) return GAME_DATA.standing.places[FIELD];
  return { x: parseFloat(youNow.el.style.left), y: parseFloat(youNow.el.style.top) };
}

// A checkered starting line across the track, and a flag where the course starts.
function drawStartMarks(box) {
  const a = GAME_DATA.agility;
  const line = document.createElement("div");
  line.className = "start-line";
  line.style.left = a.track.start[0] + "%";
  line.style.top = a.track.start[1] + "%";
  const flag = document.createElement("div");
  flag.className = "course-flag";
  flag.textContent = "🚩";
  flag.style.left = a.course.start[0] + "%";
  flag.style.top = a.course.start[1] + "%";
  box.append(line, flag);
}

// Clicking the Starting Line or the Obstacle Course: they work by dropping a pet on them.
function openPetWalk() { explainDrop(); }
function openPetTricks() { explainDrop(); }
function explainDrop() {
  const words = GAME_DATA.agility.words;
  say(agilityPets().length ? words.dragHere : words.noPets);
}

// ---------------------------------------------------------------- pets on the field

function addTrainee(box, pet, x, y) {
  const el = document.createElement("div");
  el.className = "agility-pet";
  el.title = pet.name + ": drag me!";
  el.appendChild(itemArt(pet)); // js/items.js: the girls' drawing, or its emoji
  box.appendChild(el);
  const trainee = { pet: pet, el: el, x: x, y: y, run: null };
  agility.pets.push(trainee);
  placePet(trainee, x, y, 0);
  el.addEventListener("pointerdown", function (event) { grabPet(trainee, event); });
  el.addEventListener("pointermove", function (event) { dragPet(trainee, event); });
  el.addEventListener("pointerup", function (event) { dropPet(trainee, event); });
  el.addEventListener("click", function (event) { event.stopPropagation(); });
}

// Feet at x, y; "lift" raises it off the ground (a jump) without making it smaller.
// Further back (higher up the picture) pets are smaller, like you (js/you.js).
function placePet(trainee, x, y, lift) {
  trainee.x = x;
  trainee.y = y;
  const height = movedHeight(y) * GAME_DATA.agility.petSize;
  const el = trainee.el;
  el.style.left = x + "%";
  el.style.top = (y - lift) + "%";
  el.style.height = height + "%";
  // A square box: the picture is 4 wide by 3 tall, so the same size across is 3/4 the percent.
  el.style.width = height * 3 / 4 + "%";
}

// ---------------------------------------------------------------- dragging and dropping

function grabPet(trainee, event) {
  event.preventDefault();
  event.stopPropagation();
  trainee.drag = { x: event.clientX, y: event.clientY, moved: false };
  trainee.el.setPointerCapture(event.pointerId);
}

function dragPet(trainee, event) {
  const drag = trainee.drag;
  if (!drag) return;
  if (!drag.moved) {
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < DRAG_START) return; // js/furniture.js
    drag.moved = true;
    stopRun(trainee);
    trainee.el.classList.add("dragging");
  }
  // It hangs from the mouse by its middle, like you do.
  const at = pointInPicture(event); // js/you.js
  const y = Math.min(99, at.y + movedHeight(at.y) * GAME_DATA.agility.petSize / 2);
  placePet(trainee, Math.min(Math.max(at.x, 2), 98), y, 0);
}

function dropPet(trainee) {
  const drag = trainee.drag;
  trainee.drag = null;
  trainee.el.classList.remove("dragging");
  if (!drag || !drag.moved) return; // just a click
  const a = GAME_DATA.agility;
  if (near(trainee, a.track.start)) return startLaps(trainee);
  if (near(trainee, a.course.start)) return startCourse(trainee);
  say(a.words.stopped, trainee.pet);
}

function near(trainee, spot) {
  return Math.hypot(trainee.x - spot[0], trainee.y - spot[1]) < GAME_DATA.agility.dropReach;
}

// ---------------------------------------------------------------- moving along a route

// "legs" is a list of { to, mode ("walk" or "run"), jump, hidden, seconds, then }.
// The pet moves smoothly along each in turn; "done" runs at the end.
function runRoute(trainee, legs, done) {
  const run = { legs: legs, i: 0, start: null, from: null };
  trainee.run = run;
  const visit = agility.visit;
  function frame(now) {
    if (trainee.run !== run || !stillAtField(visit)) return; // picked up, or you left
    const leg = run.legs[run.i];
    if (run.start === null) startLeg(trainee, run, leg, now);
    const f = Math.min(1, (now - run.start) / (leg.seconds * 1000));
    const x = run.from[0] + (leg.to[0] - run.from[0]) * f;
    const y = run.from[1] + (leg.to[1] - run.from[1]) * f;
    placePet(trainee, x, y, (leg.jump || 0) * Math.sin(Math.PI * f)); // up and down again
    if (f >= 1) {
      run.i++;
      run.start = null;
      if (run.i >= run.legs.length) {
        stopRun(trainee);
        return done();
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function startLeg(trainee, run, leg, now) {
  run.start = now;
  run.from = [trainee.x, trainee.y];
  if (!leg.seconds) leg.seconds = legSeconds(trainee, run.from, leg);
  const el = trainee.el;
  const dx = leg.to[0] - run.from[0];
  if (Math.abs(dx) > 0.3) el.classList.toggle("facing-left", dx < 0);
  el.classList.toggle("in-tunnel", !!leg.hidden); // out of sight inside a tunnel
  el.classList.toggle("walking", leg.mode === "walk");
  el.classList.toggle("running", leg.mode !== "walk");
  if (leg.then) leg.then();
}

// How long a leg takes: its length at this animal's walking or running speed.
// Inside a tunnel it's always the same few seconds (Scott: "a couple seconds").
function legSeconds(trainee, from, leg) {
  const a = GAME_DATA.agility;
  if (leg.hidden) return a.tunnelSeconds;
  const speed = a.speed[animalOf(trainee.pet)][leg.mode || "run"];
  // The picture is wider than tall (4 by 3), so a step across counts a bit more.
  const length = Math.hypot((leg.to[0] - from[0]) * 4 / 3, leg.to[1] - from[1]);
  return Math.max(0.15, length / speed);
}

function stopRun(trainee) {
  trainee.run = null;
  trainee.el.classList.remove("in-tunnel", "walking", "running");
}

// ---------------------------------------------------------------- the two activities

// Laps of the track: around the oval from the Starting Line, a walk then a run.
function startLaps(trainee) {
  const a = GAME_DATA.agility;
  const words = a.words;
  const pet = trainee.pet;
  let legs = [{ to: a.track.start, mode: "walk" }];
  a.track.laps.forEach(function (mode) {
    const lap = lapLegs(mode);
    lap[0].then = function () { say(mode === "walk" ? words.walking : words.running, pet); };
    legs = legs.concat(lap);
  });
  runRoute(trainee, legs, function () {
    say(words.laps + " " + bondFor("pet_walk", pet), pet);
  });
}

// One lap: points around the oval, starting at the bottom (the Starting Line)
// and going right, up, left and back down.
function lapLegs(mode) {
  const track = GAME_DATA.agility.track;
  const steps = 48;
  const legs = [];
  for (let i = 1; i <= steps; i++) {
    const angle = Math.PI / 2 - i / steps * 2 * Math.PI;
    legs.push({ mode: mode, to: [track.middle[0] + track.size[0] * Math.cos(angle),
                                 track.middle[1] + track.size[1] * Math.sin(angle)] });
  }
  return legs;
}

// The obstacle course, every obstacle in order.
function startCourse(trainee) {
  const a = GAME_DATA.agility;
  const pet = trainee.pet;
  const legs = [{ to: a.course.start, mode: "run" }].concat(a.course.steps.map(function (step) {
    const leg = { to: step.to, mode: "run", jump: step.jump, hidden: step.hidden };
    if (step.name) leg.then = function () { say(a.words.obstacle.replace("OBSTACLE", step.name), pet); };
    return leg;
  }));
  runRoute(trainee, legs, function () {
    say(a.words.course + " " + bondFor("pet_tricks", pet), pet);
  });
}

// +1 Bonding Point, unless this pet had one this way in the last few minutes.
function bondFor(kind, pet) {
  const wait = minutesUntilCare(kind, pet); // js/bonding.js
  if (wait) return GAME_DATA.agility.words.practice.replace("MIN", wait);
  const points = GAME_DATA.bonding[kind].points;
  player.bondingPoints += points;
  player.lastCare[kind][pet.id] = Date.now();
  writeSave(player);
  return "+" + points + " Bonding Point" + (points === 1 ? "" : "s") + "!";
}
