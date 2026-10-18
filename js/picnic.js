// Rosy Hills (Scott, 2026-10-18): a picnic between the hills, and a Meeting
// Place where friendly wild animals come to visit. Words and numbers are in data/picnic.js.
//
// The picnic blanket is a seat ("sitAt" in data/places.js), so clicking it sits
// you down first (js/world.js), then this shows the food you carry to eat there.
// The Meeting Place walks you up the hill; while you stay there, an animal
// comes by now and then. Click it to say hello. Nothing to catch or win: it's
// just for fun (Scott: "friendly wild animals will come visit").

let visitTimer = null;  // when the next animal comes, or the one here leaves
let visitor = null;     // the animal visiting now: { animal, el }

// ---------------------------------------------------------------- the picnic

// The food in your backpack and fruit basket, each with a 😋 Eat button.
function openPicnic(message) {
  const words = GAME_DATA.picnic.words;
  const foods = picnicFood();
  const body = openInfoPanel("🧺", "Picnic", message || (foods.length ? words.picnic : words.nothing));
  const row = document.createElement("div");
  row.className = "item-row";
  foods.forEach(function (food) {
    const card = itemCard(food.item, "😋 Eat " + foodLabel(food.item), function () {
      openPicnic(yumText(food.item, eat(food.item, food.from))); // js/hunger.js
    });
    row.appendChild(card);
  });
  body.appendChild(row);
}

// One of each food you carry (the backpack can hold 3 of a supply), and where it is.
function picnicFood() {
  const foods = [];
  [["backpack", findItem], ["basket", findKeepable]].forEach(function (bag) {
    player[bag[0]].forEach(function (id) {
      const item = bag[1](id);
      const already = foods.some(function (f) { return f.item.id === id; });
      if (item && item.food && !already) foods.push({ item: item, from: bag[0] });
    });
  });
  return foods;
}

// Fruit and honey in the basket aren't shop items (js/storage.js keepableThings).
function findKeepable(id) {
  return keepableThings().find(function (thing) { return thing.id === id; });
}

// ---------------------------------------------------------------- the Meeting Place

// Called on every place you walk into (js/world.js): animals only visit you at
// the Meeting Place, so leaving Rosy Hills sends them away.
function showRosyHills(place) {
  clearTimeout(visitTimer);
  visitor = null;
  const box = document.getElementById("place-animals");
  box.innerHTML = "";
  box.hidden = place.id !== "rosy_hills";
}

// Walk up to the Meeting Place and wait for visitors.
function goToMeetingPlace() {
  const at = GAME_DATA.picnic.meetAt;
  if (youSitting()) standYouUp(); // js/you.js
  if (youNow.el) {
    youNow.el.classList.add("moved");
    standAt(at.x, at.y);
  }
  document.getElementById("place-description").textContent = GAME_DATA.picnic.words.waiting;
  if (!visitor) waitForVisitor(GAME_DATA.picnic.firstSeconds);
}

function waitForVisitor(seconds) {
  clearTimeout(visitTimer);
  visitTimer = setTimeout(animalVisits, seconds * 1000);
}

// Still at the Meeting Place? You might have walked off or dragged yourself away.
function atMeetingPlace() {
  if (player.at !== "rosy_hills" || !youNow.el) return false;
  const at = GAME_DATA.picnic.meetAt;
  const x = parseFloat(youNow.el.style.left);
  const y = parseFloat(youNow.el.style.top);
  return Math.hypot(x - at.x, y - at.y) < 15;
}

// A random animal walks in from the right and stops next to you.
function animalVisits() {
  if (!atMeetingPlace()) return; // they only come while you wait there
  const p = GAME_DATA.picnic;
  const animal = p.animals[Math.floor(Math.random() * p.animals.length)];
  const el = document.createElement("button");
  el.className = "visiting-animal facing-left";
  el.title = animal.name;
  el.style.height = p.size + "%";
  el.style.left = "102%";
  el.style.top = (p.meetAt.y + 1) + "%";
  el.appendChild(animalArt(animal));
  el.addEventListener("click", function () { sayHello(el, animal); });
  document.getElementById("place-animals").appendChild(el);
  visitor = { animal: animal, el: el };
  requestAnimationFrame(function () { // so it walks in instead of jumping
    requestAnimationFrame(function () { el.style.left = (p.meetAt.x + p.stopShift) + "%"; });
  });
  document.getElementById("place-description").textContent = p.words.here.replace("NAME", animal.name);
  visitTimer = setTimeout(animalLeaves, p.staySeconds * 1000);
}

// The girls' drawing, or a big emoji until it's drawn.
function animalArt(animal) {
  if (animal.picture && isDrawn(animal.picture)) {
    const img = document.createElement("img");
    img.src = picture(animal.picture);
    img.alt = animal.name;
    return img;
  }
  const span = document.createElement("span");
  span.className = "animal-emoji";
  span.textContent = animal.emoji || "🐾";
  return span;
}

// Click a visitor: a friendly hello and a little heart.
function sayHello(el, animal) {
  if (placementMode) return;
  document.getElementById("place-description").textContent = "💕 " + animal.says;
  const heart = document.createElement("span");
  heart.className = "animal-heart";
  heart.textContent = "💕";
  el.appendChild(heart);
  setTimeout(function () { heart.remove(); }, 1200);
}

// The visitor wanders back off to the right, and the next one will come later.
function animalLeaves() {
  if (!visitor) return;
  const gone = visitor;
  visitor = null;
  gone.el.classList.remove("facing-left");
  gone.el.style.left = "102%";
  setTimeout(function () { gone.el.remove(); }, 2500);
  if (player.at === "rosy_hills") {
    document.getElementById("place-description").textContent =
      GAME_DATA.picnic.words.bye.replace("NAME", gone.animal.name);
  }
  const every = GAME_DATA.picnic.everySeconds;
  waitForVisitor(every[0] + Math.random() * (every[1] - every[0]));
}
