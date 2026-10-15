// Spells: brewed in the cauldron at the Crafting Table in the Crafting Cabin,
// kept in your spell book, cast where they're needed (the Seeing Spell on the
// unicorns). What each spell needs, and the cauldron's numbers, are in
// data/spells.js.

// Every list a thing can be in: what you carry, and what you've put away at
// Home or left somewhere. (Things count wherever they are.)
const THING_LISTS = ["backpack", "cooler", "bucket", "satchel", "basket", "homeCooler", "homeChest", "homeMaterials"];

function allThingLists() {
  const lists = THING_LISTS.map(function (name) { return player[name]; });
  return lists.concat(Object.keys(player.stored).map(function (place) { return player.stored[place]; }));
}

// How many of these things (any of the ids) you have.
function countThings(ids) {
  let count = 0;
  allThingLists().forEach(function (list) {
    list.forEach(function (id) { if (ids.indexOf(id) !== -1) count++; });
  });
  return count;
}

// Use up some things, taking from what you carry first.
function useThings(ids, count) {
  allThingLists().forEach(function (list) {
    for (let i = list.length - 1; i >= 0 && count > 0; i--) {
      if (ids.indexOf(list[i]) !== -1) { list.splice(i, 1); count--; }
    }
  });
}

// How many you have of one thing a spell needs.
function haveOf(need) {
  return need.money ? player[need.money] : countThings(need.things);
}

function needName(need) {
  return need.money === "crystals" ? "Crystal 💎" : need.money === "gems" ? "Gems" : need.name;
}

function hasSpellBook() {
  return owns(GAME_DATA.spellBook); // js/items.js: carried or left somewhere
}

function knowsSpell(id) {
  return player.spells.indexOf(id) !== -1;
}

// ---------------------------------------------------------------- the crafting table

function openCrafting(message) {
  const book = findItem(GAME_DATA.spellBook);
  const body = openInfoPanel("🛠️", "Crafting Table", message || (hasSpellBook()
    ? "📖 Your spell book: " + (player.spells.length ? player.spells.map(spellName).join(", ") : "no spells yet") + "."
    : "📖 You need a spell book to keep spells in: the " + book.name + " from the Campus Store."));
  GAME_DATA.spells.forEach(function (spell) { body.appendChild(spellCard(spell)); });
}

function spellName(id) {
  const spell = GAME_DATA.spells.find(function (s) { return s.id === id; });
  return spell ? spell.name : id;
}

function hasEverything(spell) {
  return spell.needs.every(function (need) { return haveOf(need) >= need.count; });
}

// One spell: what it needs (✓ when you have enough), and a button to rent
// the cauldron and brew it.
function spellCard(spell) {
  const rent = GAME_DATA.cauldron.rentGems;
  const card = document.createElement("div");
  card.className = "spell-card";
  const title = document.createElement("h3");
  title.textContent = spell.emoji + " " + spell.name;
  const use = document.createElement("p");
  use.className = "note";
  use.textContent = spell.use;
  const list = document.createElement("ul");
  list.className = "spell-needs";
  spell.needs.forEach(function (need) {
    list.appendChild(needLine(needName(need), haveOf(need), need.count));
  });
  list.appendChild(needLine("Gems to rent the cauldron", player.gems, rent));
  const button = document.createElement("button");
  button.className = "big-button";
  if (knowsSpell(spell.id)) {
    button.textContent = "In your spell book ✓";
    button.disabled = true;
  } else {
    button.textContent = "⚗️ Rent the cauldron (" + rent + " gems) and brew it";
    button.disabled = !(hasEverything(spell) && hasSpellBook() && player.gems >= rent);
    button.addEventListener("click", function () { startBrewing(spell); });
  }
  card.append(title, use, list, button);
  return card;
}

function needLine(name, have, count) {
  const line = document.createElement("li");
  const enough = have >= count;
  line.className = enough ? "enough" : "missing";
  line.textContent = (enough ? "✓ " : "✗ ") + name + ": " + Math.min(have, count) + " of " + count;
  return line;
}

// ---------------------------------------------------------------- brewing (Scott, 2026-10-15)
//
// 1. Drop the Crystal into the cauldron.
// 2. Pour in the potion: the fire is lit and the brew starts to heat.
// 3. Keep it bubbling in the green: the heat slowly drops, charcoal adds heat,
//    too much and it boils over.
// 4. The table calls for each material in turn: toss it in while it's in the green.
// 5. When everything is in, it steams and the spell flies into your spell book.
// Nothing is used up until the spell is done, except the cauldron's rent.

let brew = null; // the brew going on now

function startBrewing(spell) {
  player.gems -= GAME_DATA.cauldron.rentGems;
  writeSave(player);
  brew = {
    spell: spell,
    step: "crystal",
    heat: 0,
    orders: tossOrders(spell), // the materials the table will call for, in order
    nextOrderAt: 0,            // when the table calls for the next one
    tossed: 0,
    timer: null
  };
  const body = openInfoPanel("⚗️", "Brewing the " + spell.name, "");
  body.appendChild(brewingScreen());
  brewSays("🛠️ The crafting table rumbles: \"First, drop the Crystal into the cauldron!\"");
  showBrewButtons();
  brew.timer = setInterval(brewTick, 100);
}

// Each material, as many times as it's needed, in a mixed-up order.
function tossOrders(spell) {
  const orders = [];
  spell.needs.forEach(function (need) {
    if (need.step !== "toss") return;
    for (let i = 0; i < need.count; i++) orders.push(need);
  });
  for (let i = orders.length - 1; i > 0; i--) {
    const j = randomBetween(0, i); // js/digging.js
    const swap = orders[i];
    orders[i] = orders[j];
    orders[j] = swap;
  }
  return orders;
}

// The cauldron over its fire, a thermometer beside it, and the spell book.
function brewingScreen() {
  const screen = document.createElement("div");
  screen.className = "brew";
  screen.innerHTML =
    '<p class="brew-says"></p>' +
    '<div class="brew-stage">' +
    '  <div class="brew-thermometer" title="How hot the brew is"><div class="brew-green"></div><div class="brew-heat"></div></div>' +
    '  <div class="cauldron">' +
    '    <div class="cauldron-steam"></div>' +
    '    <div class="cauldron-pot"><div class="cauldron-brew"></div></div>' +
    '    <div class="cauldron-fire"></div>' +
    '  </div>' +
    '  <div class="brew-book">📖</div>' +
    '</div>' +
    '<div class="brew-buttons"></div>';
  const rules = GAME_DATA.cauldron;
  const green = screen.querySelector(".brew-green");
  green.style.bottom = (rules.green[0] / rules.boilOver * 100) + "%";
  green.style.height = ((rules.green[1] - rules.green[0]) / rules.boilOver * 100) + "%";
  return screen;
}

function brewSays(words) {
  document.querySelector(".brew-says").textContent = words;
}

// The buttons change as you go: Crystal, then potion, then charcoal and the materials.
function showBrewButtons() {
  const box = document.querySelector(".brew-buttons");
  box.innerHTML = "";
  const spell = brew.spell;
  if (brew.step === "crystal") return box.appendChild(brewButton(needOf("crystal"), dropCrystal));
  if (brew.step === "potion") return box.appendChild(brewButton(needOf("potion"), pourPotion));
  if (brew.step !== "brewing") return;
  const charcoal = document.createElement("button");
  charcoal.className = "big-button charcoal-button";
  charcoal.textContent = "🔥 Add charcoal";
  charcoal.addEventListener("click", addCharcoal);
  box.appendChild(charcoal);
  spell.needs.forEach(function (need) {
    if (need.step !== "toss") return;
    const left = brew.orders.slice(brew.tossed).filter(function (o) { return o === need; }).length;
    const button = brewButton(need, function () { tossIn(need); });
    button.querySelector(".brew-count").textContent = left ? " × " + left : " ✓";
    button.disabled = left === 0;
    box.appendChild(button);
  });
}

function needOf(step) {
  return brew.spell.needs.find(function (need) { return need.step === step; });
}

// A button with the thing's picture (the girls' drawing, or its emoji).
function brewButton(need, onClick) {
  const button = document.createElement("button");
  button.className = "small-button brew-thing";
  const id = need.things && need.things.find(isDrawn);
  if (id) {
    const img = document.createElement("img");
    img.src = picture(id);
    img.alt = "";
    button.appendChild(img);
  } else {
    button.appendChild(document.createTextNode(need.emoji + " "));
  }
  button.appendChild(document.createTextNode(need.name));
  const count = document.createElement("span");
  count.className = "brew-count";
  button.appendChild(count);
  button.addEventListener("click", onClick);
  return button;
}

function dropCrystal() {
  brew.step = "potion";
  document.querySelector(".cauldron").classList.add("has-crystal");
  brewSays("💎 Plink! The Crystal glows at the bottom of the cauldron. Now pour the " + needOf("potion").name + " on top!");
  showBrewButtons();
}

function pourPotion() {
  brew.step = "brewing";
  brew.heat = GAME_DATA.cauldron.startHeat;
  brew.nextOrderAt = 0;
  document.querySelector(".cauldron").classList.add("lit");
  brewSays("🧪 Glug glug... the fire flickers on! Add charcoal to get it bubbling in the green, but don't let it boil over!");
  showBrewButtons();
}

function addCharcoal() {
  brew.heat += GAME_DATA.cauldron.charcoalHeat;
  const fire = document.querySelector(".cauldron-fire");
  fire.classList.remove("whoosh");
  void fire.offsetWidth; // restart the flare-up
  fire.classList.add("whoosh");
}

function inTheGreen() {
  const green = GAME_DATA.cauldron.green;
  return brew.heat >= green[0] && brew.heat <= green[1];
}

// What the table is calling for now (null if it's still waiting).
function currentOrder() {
  if (brew.nextOrderAt === 0 || Date.now() < brew.nextOrderAt) return null;
  return brew.orders[brew.tossed] || null;
}

function tossIn(need) {
  const order = currentOrder();
  if (!order) return brewSays("🛠️ \"Not yet! Wait for me to call for it.\"");
  if (order !== need) return brewSays("🛠️ \"No, no! I asked for the " + order.name + "!\"");
  if (!inTheGreen()) return brewSays("🌡️ It isn't bubbling right! Get the heat back in the green, then toss in the " + order.name + ".");
  brew.tossed++;
  brew.heat -= GAME_DATA.cauldron.itemCools; // cold things cool the brew
  const splash = document.querySelector(".cauldron-pot");
  splash.classList.remove("splash");
  void splash.offsetWidth;
  splash.classList.add("splash");
  showBrewButtons();
  if (brew.tossed >= brew.orders.length) return spellDone();
  brew.nextOrderAt = Date.now() + GAME_DATA.cauldron.orderSeconds * 1000;
  brewSays("💦 Sploosh! In it goes. Keep the boil going...");
}

// Ten times a second: the brew cools, the thermometer moves, and the table
// calls for the next thing once the brew is bubbling nicely.
function brewTick() {
  if (!brew) return;
  if (document.getElementById("info-panel").hidden) return stopBrewing(); // walked away
  const rules = GAME_DATA.cauldron;
  if (brew.step !== "brewing") return;
  brew.heat = Math.max(0, brew.heat - rules.coolPerSecond / 10);
  showHeat();
  if (brew.heat >= rules.boilOver) return boilOver();
  if (brew.nextOrderAt === 0 && inTheGreen()) brew.nextOrderAt = Date.now(); // first order once it's bubbling
  const order = currentOrder();
  if (order && !brew.called) {
    brew.called = order;
    brewSays("🛠️ The crafting table calls: \"Toss in " + (order.name === "Bones" ? "a bone" : "the " + order.name) + "!\"");
  }
  if (!order) brew.called = null;
}

function showHeat() {
  const rules = GAME_DATA.cauldron;
  const heat = document.querySelector(".brew-heat");
  heat.style.height = Math.min(100, brew.heat / rules.boilOver * 100) + "%";
  heat.classList.toggle("good", inTheGreen());
  heat.classList.toggle("hot", brew.heat > rules.green[1]);
  document.querySelector(".cauldron").style.setProperty("--bubble", Math.min(1, brew.heat / rules.boilOver).toFixed(2));
}

function stopBrewing() {
  if (brew) clearInterval(brew.timer);
  brew = null;
}

// Too hot! It boils over. The things weren't used up; only the rent is gone.
function boilOver() {
  const spell = brew.spell;
  stopBrewing();
  document.querySelector(".cauldron").classList.add("boiled-over");
  brewSays("💥 BLOOP! It boiled over everywhere! Don't worry, you still have all your things. The cauldron goes back under the table to be cleaned.");
  const box = document.querySelector(".brew-buttons");
  box.innerHTML = "";
  const again = document.createElement("button");
  again.className = "big-button";
  again.textContent = "🔄 Try again (" + GAME_DATA.cauldron.rentGems + " gems)";
  again.disabled = player.gems < GAME_DATA.cauldron.rentGems;
  again.addEventListener("click", function () { startBrewing(spell); });
  box.appendChild(again);
}

// Everything is in: steam, and the spell flies into the spell book. Now the
// things are used up.
function spellDone() {
  const spell = brew.spell;
  stopBrewing();
  spell.needs.forEach(function (need) {
    if (need.money) player[need.money] -= need.count;
    else useThings(need.things, need.count);
  });
  player.spells.push(spell.id);
  writeSave(player);
  const cauldron = document.querySelector(".cauldron");
  cauldron.classList.add("done");
  document.querySelector(".brew-buttons").innerHTML = "";
  brewSays("♨️ The cauldron bubbles and steams... ✨");
  const flying = document.createElement("span");
  flying.className = "spell-flying";
  flying.textContent = spell.emoji;
  cauldron.appendChild(flying);
  setTimeout(function () {
    const from = flying.getBoundingClientRect();
    const to = document.querySelector(".brew-book").getBoundingClientRect();
    flying.style.transform = "translate(" + (to.left - from.left) + "px, " + (to.top - from.top) + "px) scale(0.6)";
  }, 1200);
  setTimeout(function () {
    document.querySelector(".brew-book").classList.add("glowing");
    brewSays("✨ The " + spell.name + " flew into your spell book! " + spell.use);
    const box = document.querySelector(".brew-buttons");
    const back = document.createElement("button");
    back.className = "big-button";
    back.textContent = "📖 Back to the Crafting Table";
    back.addEventListener("click", function () { openCrafting(); });
    box.appendChild(back);
  }, 2600);
}
