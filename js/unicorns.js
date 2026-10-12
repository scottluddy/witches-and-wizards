// The shy blind unicorns in the Unicorn Meadow (data/unicorns.js).
// A unicorn hides behind the trees and only comes out now and then. Spot it,
// hold an apple from your fruit basket and click it to feed it: then it
// trusts you. Cast the Seeing Spell, feed it a few more apples, and it finds
// its family. That's one adventure: an Adventure Point.

let unicornTimer = null;   // when the unicorn next comes out (or goes back)
let rustleTimer = null;    // trees rustling now and then while it hides
let unicornOut = false;    // true while it's out from behind a tree

function randomBetween(low, high) {
  return low + Math.floor(Math.random() * (high - low + 1));
}

function holdingApple() {
  return player.holding === GAME_DATA.unicorns.food;
}

// ---------------------------------------------------------------- holding an apple

// Take one fruit out of the basket and hold it in your hand (the mouse
// pointer turns into it). Feeding the unicorn uses it up.
function holdFruit(fruit) {
  if (player.holding) putBackFruit();
  player.basket.splice(player.basket.indexOf(fruit.id), 1);
  player.holding = fruit.id;
  writeSave(player);
  showHolding();
}

// Put the held fruit back in the basket.
function putBackFruit() {
  if (!player.holding) return;
  player.basket.push(player.holding);
  player.holding = null;
  writeSave(player);
  showHolding();
}

// The ✋ button in the top bar, and the apple pointer.
function showHolding() {
  const fruit = player && player.holding ? findFruit(player.holding) : null; // js/orchard.js
  const button = document.getElementById("btn-holding");
  button.hidden = !fruit;
  if (fruit) {
    button.textContent = "✋" + fruit.emoji;
    button.title = "You're holding " + aOrAn(fruit.name) + ". Click to put it back in your basket.";
  }
  document.body.classList.toggle("holding-apple", !!fruit);
}

document.getElementById("btn-holding").addEventListener("click", putBackFruit);

// ---------------------------------------------------------------- hiding behind the trees

// Called by showPlace for every place: only the meadow has trees to hide behind.
function showUnicornWoods(place) {
  clearTimeout(unicornTimer);
  clearTimeout(rustleTimer);
  unicornOut = false;
  const woods = document.getElementById("place-woods");
  woods.innerHTML = "";
  woods.hidden = place.id !== "unicorn_meadow";
  if (woods.hidden) return;

  const u = GAME_DATA.unicorns;
  u.trees.forEach(function (spot, i) {
    const tree = document.createElement("button");
    tree.className = "meadow-tree";
    tree.dataset.tree = i;
    tree.style.left = spot[0] + "%";
    tree.style.top = spot[1] + "%";
    tree.textContent = i % 2 ? "🌲" : "🌳";
    tree.title = "A tree";
    tree.addEventListener("click", function () {
      if (placementMode) return;
      document.getElementById("place-description").textContent = unicornOut
        ? "There it is! Click the unicorn, not the tree."
        : "Rustle, rustle... Something might be hiding behind the trees. Watch quietly!";
    });
    woods.appendChild(tree);
  });

  const unicorn = document.createElement("button");
  unicorn.id = "meadow-unicorn";
  unicorn.className = "meadow-unicorn";
  unicorn.title = "A blind unicorn";
  const img = document.createElement("img");
  img.src = picture(u.picture);
  img.alt = "Unicorn";
  unicorn.appendChild(img);
  unicorn.addEventListener("click", function () {
    if (!placementMode && unicornOut) clickUnicorn();
  });
  woods.appendChild(unicorn);

  rustle();
  unicornTimer = setTimeout(comeOut, hiddenTime());
}

// How long the unicorn stays hidden, in milliseconds. On average it comes out
// once every "everySeconds" (more seconds for each later unicorn).
function hiddenTime() {
  const u = GAME_DATA.unicorns;
  const every = u.everySeconds[Math.min(player.unicornsHelped, u.everySeconds.length - 1)];
  const seconds = every * (0.5 + Math.random()) - u.showSeconds; // between half and one and a half times
  return Math.max(5, seconds) * 1000;
}

// Out it comes, from behind one of the trees, for "showSeconds".
function comeOut() {
  const u = GAME_DATA.unicorns;
  const spot = u.trees[randomBetween(0, u.trees.length - 1)];
  const unicorn = document.getElementById("meadow-unicorn");
  if (!unicorn) return;
  unicorn.style.left = spot[0] + "%";
  unicorn.style.top = spot[1] + "%";
  unicorn.classList.remove("out");
  void unicorn.offsetWidth; // start the slide from behind the tree
  unicorn.classList.add("out");
  unicornOut = true;
  document.getElementById("place-description").textContent = "Look! A unicorn peeks out from behind a tree!";
  unicornTimer = setTimeout(goBack, u.showSeconds * 1000);
}

// Back behind the tree. It waits while you're busy with it in the pop-up.
function goBack() {
  if (!document.getElementById("info-panel").hidden) {
    unicornTimer = setTimeout(goBack, 1000);
    return;
  }
  const unicorn = document.getElementById("meadow-unicorn");
  if (unicorn) unicorn.classList.remove("out");
  unicornOut = false;
  document.getElementById("place-description").textContent = "The unicorn tiptoes back behind the trees...";
  unicornTimer = setTimeout(comeOut, hiddenTime());
}

// Now and then a tree wiggles, so it feels like something is in there.
function rustle() {
  const trees = document.querySelectorAll(".meadow-tree");
  if (trees.length === 0) return;
  const tree = trees[randomBetween(0, trees.length - 1)];
  tree.classList.remove("rustle");
  void tree.offsetWidth;
  tree.classList.add("rustle");
  rustleTimer = setTimeout(rustle, randomBetween(3, 7) * 1000);
}

// ---------------------------------------------------------------- helping the unicorn

function clickUnicorn() {
  const unicorn = player.unicorn;
  if (!unicorn.trusted) {
    if (holdingApple()) return feedUnicorn();
    return openUnicorn();
  }
  if (!unicorn.canSee) return openUnicorn();
  if (holdingApple()) return feedUnicorn();
  openUnicorn();
}

// The unicorn pop-up: what to do, with a tick for each step done.
function openUnicorn(message) {
  const u = GAME_DATA.unicorns;
  const unicorn = player.unicorn;
  const art = document.createElement("img");
  art.src = picture(u.picture);
  art.alt = "Unicorn";
  art.className = "info-picture";
  const title = unicorn.canSee ? "A Unicorn That Can See" : unicorn.trusted ? "A Unicorn That Trusts You" : "A Shy Blind Unicorn";
  const body = openInfoPanel(art, title, message || "This unicorn was born blind, so it can't find its family. To help it:");

  const spell = spellName(u.spell);
  const more = unicorn.canSee
    ? "Feed it " + unicorn.applesNeeded + " more apples (" + unicorn.applesFed + " eaten so far)"
    : "Feed it " + u.apples[0] + " to " + u.apples[1] + " more apples";
  const steps = [
    [true, "Spot it when it comes out from behind the trees"],
    [unicorn.trusted || holdingApple(), "Hold an apple: open your 🧺 basket and click ✋ Hold"],
    [unicorn.trusted, "Click the unicorn to feed it the apple, so it trusts you"],
    [unicorn.canSee, "Cast the " + spell + " on it" + (knowsSpell(u.spell) ? "" : " (make it at the Crafting Table in the Crafting Cabin first)")],
    [false, more + ", one at a time, to give it the strength to find its family"]
  ];
  const list = document.createElement("ol");
  list.className = "unicorn-steps";
  steps.forEach(function (step) {
    const line = document.createElement("li");
    line.className = step[0] ? "done" : "";
    line.textContent = (step[0] ? "✓ " : "") + step[1];
    list.appendChild(line);
  });
  body.appendChild(list);

  if (unicorn.trusted && !unicorn.canSee) {
    const cast = document.createElement("button");
    cast.className = "big-button";
    cast.textContent = "👁️ Cast the " + spell;
    cast.disabled = !knowsSpell(u.spell);
    cast.addEventListener("click", castSeeingSpell);
    body.appendChild(cast);
  } else if (!holdingApple()) {
    body.appendChild(holdAppleButton());
  }
}

// "✋ Hold an apple" straight from the pop-up, if there's one in the basket.
function holdAppleButton() {
  const u = GAME_DATA.unicorns;
  const button = document.createElement("button");
  button.className = "big-button";
  const apples = player.basket.filter(function (id) { return id === u.food; }).length;
  button.textContent = apples ? "✋🍎 Hold an apple (" + apples + " in your basket)" : "No apples in your basket";
  button.disabled = apples === 0;
  button.addEventListener("click", function () {
    holdFruit(findFruit(u.food));
    document.getElementById("info-panel").hidden = true;
  });
  return button;
}

function castSeeingSpell() {
  const range = GAME_DATA.unicorns.apples;
  player.unicorn.canSee = true;
  player.unicorn.applesNeeded = randomBetween(range[0], range[1]);
  player.unicorn.applesFed = 0;
  writeSave(player);
  const art = document.getElementById("info-art");
  art.classList.add("sparkle");
  setTimeout(function () { art.classList.remove("sparkle"); }, 1200);
  openUnicorn("✨ Sparkle! The unicorn blinks... and opens its eyes. It can see! Now it needs strength.");
}

function feedUnicorn() {
  const u = GAME_DATA.unicorns;
  const unicorn = player.unicorn;
  player.holding = null;
  showHolding();
  if (!unicorn.trusted) {
    unicorn.trusted = true;
    writeSave(player);
    return openUnicorn("Crunch! The unicorn sniffs your hand and nuzzles you. It trusts you now!");
  }
  unicorn.applesFed++;
  if (unicorn.applesFed < unicorn.applesNeeded) {
    writeSave(player);
    return openUnicorn("Crunch! The unicorn loves the apple. " + (unicorn.applesNeeded - unicorn.applesFed) + " more to go!");
  }
  // Fed enough: it finds its family. One adventure done!
  player.adventurePoints += u.adventurePoints;
  player.unicornsHelped++;
  player.unicorn = { trusted: false, canSee: false, applesNeeded: 0, applesFed: 0 }; // another blind unicorn comes along
  writeSave(player);
  const unicornPic = document.getElementById("meadow-unicorn");
  if (unicornPic) unicornPic.classList.add("gallop");
  openInfoPanel(celebrationArt(u.kind, "🦄💖🦄"), "Back With Its Family!",
    "The unicorn sees its family across the meadow and gallops off to join them. You finished an adventure: +" +
    u.adventurePoints + " Adventure Point! Another shy blind unicorn is hiding in the trees now. It comes out less often...");
  // The new unicorn starts hidden.
  clearTimeout(unicornTimer);
  unicornTimer = setTimeout(function () {
    if (unicornPic) unicornPic.classList.remove("out", "gallop");
    unicornOut = false;
    unicornTimer = setTimeout(comeOut, hiddenTime());
  }, 1500);
}
