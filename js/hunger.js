// Hunger: walking makes you hungry (and slow); snacks fill you up again.
// The numbers are in data/hunger.js. Hot chocolate can get marshmallows from
// the self-serve machine at the Snack Shack, which makes it more filling.

// Walking adds hunger: one point for every "walkPerPoint" map-widths walked.
function walkedSoFar(mapWidths) {
  const hunger = GAME_DATA.hunger;
  player.walked += mapWidths;
  while (player.walked >= hunger.walkPerPoint) {
    player.walked -= hunger.walkPerPoint;
    player.hunger = Math.min(hunger.max, player.hunger + 1);
  }
}

// 1 when not hungry at all, down to "slowest" when as hungry as can be.
function walkSpeedFactor() {
  const hunger = GAME_DATA.hunger;
  return 1 - (player.hunger / hunger.max) * (1 - hunger.slowest);
}

// How many hunger points eating this takes away.
function foodIn(item) {
  let food = item.food || 0;
  if (player.marshmallows.indexOf(item.id) !== -1) food += GAME_DATA.hunger.marshmallowFood;
  return food;
}

// Eat (or drink) something. It comes out of the backpack (or the fruit
// basket), so a snack can be bought again at the Snack Shack.
function eat(item, from) {
  const list = player[from || "backpack"];
  const before = player.hunger;
  player.hunger = Math.max(0, player.hunger - foodIn(item));
  list.splice(list.indexOf(item.id), 1);
  player.marshmallows = player.marshmallows.filter(function (id) { return id !== item.id; });
  writeSave(player);
  return before - player.hunger; // how much less hungry you are
}

// "Yum! Apple took away 1 hunger point."
function yumText(item, less) {
  return less > 0
    ? "Yum! " + item.name + " took away " + less + " hunger point" + (less === 1 ? "" : "s") + "."
    : "Yum! " + item.name + ". You weren't hungry anyway.";
}

// ---------------------------------------------------------------- the marshmallow machine

// The self-serve marshmallow machine at the Snack Shack: it shows your hot
// chocolates, and you choose which ones to hold up for marshmallows.
function openMarshmallows(message) {
  const mugs = player.backpack.map(findItem).filter(function (item) { return item && item.hotChocolate; });
  const body = openInfoPanel("🍡", "Marshmallow Machine", message ||
    (mugs.length ? "Choose a hot chocolate to hold up to the machine."
                 : "You need a hot chocolate first. Buy one at the hot chocolate station!"));
  const row = document.createElement("div");
  row.className = "item-row";
  mugs.forEach(function (mug) {
    const has = hasMarshmallows(mug.id);
    const card = itemCard(mug, has ? "Has marshmallows ✓" : "🍡 Add marshmallows", function () {
      addMarshmallows(mug, card);
    });
    card.querySelector("button").disabled = has;
    if (has) showMarshmallowsOn(card, false);
    row.appendChild(card);
  });
  body.appendChild(row);
}

function hasMarshmallows(itemId) {
  return player.marshmallows.indexOf(itemId) !== -1;
}

// Little white marshmallows on top of a mug's picture. "falling" makes them
// drop in from above, one after another.
function showMarshmallowsOn(card, falling) {
  const art = card.querySelector(".item-art");
  art.classList.add("with-marshmallows");
  for (let i = 0; i < 6; i++) {
    const m = document.createElement("span");
    m.className = "marshmallow" + (falling ? " falling" : "");
    m.style.left = (25 + i * 10) + "%";
    m.style.animationDelay = (i * 0.15) + "s";
    art.appendChild(m);
  }
}

function addMarshmallows(mug, card) {
  card.querySelector("button").disabled = true;
  showMarshmallowsOn(card, true);
  setTimeout(function () {
    player.marshmallows.push(mug.id);
    writeSave(player);
    openMarshmallows("🍡 Plop, plop! Marshmallows dropped into your " + mug.name + ". Now it fills you up even more.");
  }, 1500);
}
