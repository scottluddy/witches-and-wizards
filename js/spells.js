// Spells: made at the Crafting Table in the Crafting Cabin, kept in your
// spell book, cast where they're needed (the Seeing Spell on the unicorns).
// What each spell needs is in data/spells.js.

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
  return need.money === "crystals" ? "Crystals 💎" : need.money === "gems" ? "Gems" : need.name;
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

// One spell: what it needs (✓ when you have enough) and a button to make it.
function spellCard(spell) {
  const card = document.createElement("div");
  card.className = "spell-card";
  const title = document.createElement("h3");
  title.textContent = spell.emoji + " " + spell.name;
  const use = document.createElement("p");
  use.className = "note";
  use.textContent = spell.use;
  const list = document.createElement("ul");
  list.className = "spell-needs";
  let ready = true;
  spell.needs.forEach(function (need) {
    const have = haveOf(need);
    const enough = have >= need.count;
    if (!enough) ready = false;
    const line = document.createElement("li");
    line.className = enough ? "enough" : "missing";
    line.textContent = (enough ? "✓ " : "✗ ") + needName(need) + ": " + Math.min(have, need.count) + " of " + need.count;
    list.appendChild(line);
  });
  const button = document.createElement("button");
  button.className = "big-button";
  if (knowsSpell(spell.id)) {
    button.textContent = "In your spell book ✓";
    button.disabled = true;
  } else {
    button.textContent = "📖 Add to my spell book";
    button.disabled = !(ready && hasSpellBook());
    button.addEventListener("click", function () { makeSpell(spell); });
  }
  card.append(title, use, list, button);
  return card;
}

// Use up everything the spell needs and write it into the spell book.
function makeSpell(spell) {
  spell.needs.forEach(function (need) {
    if (need.money) player[need.money] -= need.count;
    else useThings(need.things, need.count);
  });
  player.spells.push(spell.id);
  writeSave(player);
  openCrafting("✨ The " + spell.name + " is in your spell book! " + spell.use);
}
