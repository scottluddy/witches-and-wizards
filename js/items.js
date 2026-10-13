// Items: store shelves, the free Scholarship picks, buying, the backpack,
// and putting things down at places.

// Gaps on a shelf picture where items stand, as [top, bottom] percent down
// from the top. A shelf can set its own with "rows" in places.js; this default
// matches the placeholder shelf in tools/process_art.py.
const SHELF_ROWS = [[21, 42], [45, 66], [69, 90]];
const ITEMS_PER_ROW = 3;

let shownItem = null; // the item open in the pop-up

function findItem(id) {
  return GAME_DATA.items.find(function (item) { return item.id === id; });
}

// A picture of the item: its drawing, or its emoji until it's drawn.
function itemArt(item) {
  if (isDrawn(item.id)) {
    const img = document.createElement("img");
    img.src = picture(item.id);
    img.alt = item.name;
    return img;
  }
  const span = document.createElement("span");
  span.className = "emoji";
  span.textContent = item.emoji || "✨";
  return span;
}

// ---------------------------------------------------------------- prices

// Most items cost Crystals ("price"); some cost Gems instead ("gems").
function priceOf(item) {
  if (item.gems !== undefined) return { amount: item.gems, money: "gems", name: "Gems" };
  return { amount: item.price, money: "crystals", name: "Crystals" };
}

function canAfford(item) {
  const cost = priceOf(item);
  return player[cost.money] >= cost.amount;
}

// The little money picture: 💎 for Crystals, the girls' gem drawing for Gems.
function moneyIcon(money) {
  if (money === "gems") {
    const img = document.createElement("img");
    img.className = "gem-icon";
    img.src = picture("extra_gem");
    img.alt = "Gems";
    return img;
  }
  return document.createTextNode("💎");
}

// "💎 12" or "(gem) 3", as something to put on the page.
function moneyLabel(money, amount) {
  const span = document.createElement("span");
  span.append(moneyIcon(money), " " + amount);
  return span;
}

// ---------------------------------------------------------------- owning things

function freePicks() {
  if (!player.freePicks) player.freePicks = {}; // category -> the item chosen free
  return player.freePicks;
}

// A free pick of an item that's no longer in the store doesn't count.
function hasFreePick(category) {
  if (categories().indexOf(category) === -1) return false; // not a Scholarship category
  const picked = freePicks()[category];
  return !picked || !findItem(picked);
}

// Owned means carried in the backpack or left somewhere.
function owns(itemId) {
  return howMany(itemId) > 0;
}

// How many of this item you have, carried or left somewhere.
function howMany(itemId) {
  let count = player.backpack.filter(function (id) { return id === itemId; }).length;
  Object.keys(player.stored).forEach(function (placeId) {
    count += player.stored[placeId].filter(function (id) { return id === itemId; }).length;
  });
  return count;
}

// ---------------------------------------------------------------- supplies (data/supplies.js)

// Food, drinks and bait stack: you can have a few of each. Everything else is one of each.
function isSupply(item) {
  return !!item.food && !item.trade || GAME_DATA.supplies.alsoSupplies.indexOf(item.id) !== -1;
}

// How many of a supply the shop has left. One more goes back on the shelf
// every "restockMinutes" (worked out like apples growing back, js/orchard.js).
function shopStock(item) {
  const rules = GAME_DATA.supplies;
  const every = rules.restockMinutes * 60000;
  const state = player.stock[item.id] || { left: rules.shopStock, at: Date.now() };
  const restocked = Math.floor((Date.now() - state.at) / every);
  if (restocked > 0) {
    state.left = Math.min(rules.shopStock, state.left + restocked);
    state.at += restocked * every;
  }
  if (state.left === rules.shopStock) state.at = Date.now(); // a full shelf doesn't fill up more
  player.stock[item.id] = state;
  return state.left;
}

function takeFromStock(item) {
  shopStock(item); // brings the count up to date first
  player.stock[item.id].left -= 1;
}

// Minutes until the shop has another one.
function minutesToRestock(item) {
  const state = player.stock[item.id];
  return Math.max(1, Math.ceil((state.at + GAME_DATA.supplies.restockMinutes * 60000 - Date.now()) / 60000));
}

// Can you get one more of this? Keepsakes: only if you don't have it.
// Supplies: if you have fewer than "most" and the shop has some left.
function canGetMore(item) {
  if (!isSupply(item)) return !owns(item.id);
  return howMany(item.id) < GAME_DATA.supplies.most && shopStock(item) > 0;
}

// Take just one of this item out of a list (there may be several the same).
function removeOne(list, itemId) {
  const i = list.indexOf(itemId);
  if (i !== -1) list.splice(i, 1);
}

// The Scholarship covers the Campus Store's shelves (not other shops, like
// the Ski Reserve), and only shelves that have something on them.
function categories() {
  const list = [];
  GAME_DATA.places.forEach(function (place) {
    if (!place.shelf || place.in !== "store" || list.indexOf(place.shelf) !== -1) return;
    const stocked = GAME_DATA.items.some(function (item) { return item.category === place.shelf; });
    if (stocked) list.push(place.shelf);
  });
  return list;
}

// ---------------------------------------------------------------- what a place shows

function showPlaceItems(place) {
  showShelfItems(place);
  showLeftHere(place);
}

// Items standing in the gaps of the shelf picture, three to a gap.
function showShelfItems(place) {
  const box = document.getElementById("place-items");
  const note = document.getElementById("shelf-note");
  box.innerHTML = "";
  note.hidden = !place.shelf;
  if (!place.shelf) return;

  const items = GAME_DATA.items.filter(function (item) { return item.category === place.shelf; });
  const rows = place.rows || SHELF_ROWS;
  const perRow = place.perRow || ITEMS_PER_ROW; // a shelf can fit more, like the brooms
  const spacing = 81 / perRow;                  // percent between items in a row
  items.forEach(function (item, i) {
    const row = Math.floor(i / perRow);
    const inRow = Math.min(perRow, items.length - row * perRow);
    const col = i % perRow;
    // An item can choose its own spot with "shelfX"/"shelfY" in items.js.
    const x = item.shelfX !== undefined ? item.shelfX : 50 + (col - (inRow - 1) / 2) * spacing;
    const gap = rows[Math.min(row, rows.length - 1)];
    const y = item.shelfY !== undefined ? item.shelfY : gap[1];

    const button = document.createElement("button");
    button.className = "shelf-item" + (canGetMore(item) ? "" : " owned") + (item.inPicture ? " in-picture" : "");
    button.style.left = x + "%";
    button.style.top = y + "%";
    // fits inside the gap, unless the item says how tall it is (like the Lakeside Store's pets)
    button.style.height = (item.shelfHeight || gap[1] - gap[0]) + "%";
    const art = document.createElement("span");
    art.className = "shelf-art";
    art.appendChild(itemArt(item));
    const tag = document.createElement("span");
    tag.className = "price-tag";
    if (isSupply(item) && shopStock(item) === 0) tag.textContent = "Sold out";
    else if (isSupply(item) && howMany(item.id) >= GAME_DATA.supplies.most) tag.textContent = "Yours ×" + howMany(item.id);
    else if (!isSupply(item) && owns(item.id)) tag.textContent = "Yours ✓";
    else if (item.trade) tag.textContent = "🔄 Trade";
    else if (hasFreePick(item.category)) tag.textContent = "FREE";
    else tag.appendChild(moneyLabel(priceOf(item).money, priceOf(item).amount));
    button.append(art, tag);
    button.title = item.name;
    button.addEventListener("click", function () {
      if (!placementMode) openItemPanel(item.id);
    });
    box.appendChild(button);
  });

  note.textContent = items.length === 0
    ? "Nothing on this shelf yet. Draw something for it!"
    : place.trade
    ? "Click something to trade for it. No Crystals or Gems here, only trades!"
    : hasFreePick(place.shelf)
    ? "Your Scholarship gives you one " + place.shelf + " for FREE! Click one to choose it."
    : "Click an item to see it. Items cost Crystals or Gems.";
}

// Things the player put down here, with a way to pick them back up.
function showLeftHere(place) {
  const box = document.getElementById("left-here");
  const list = document.getElementById("left-here-items");
  const here = player.stored[place.id] || [];
  box.hidden = here.length === 0;
  list.innerHTML = "";
  here.forEach(function (itemId) {
    const item = findItem(itemId);
    if (!item) return;
    list.appendChild(itemCard(item, "Pick up", function () {
      removeOne(here, itemId); // just this one (you may have left two the same)
      player.stored[place.id] = here;
      if (player.stored[place.id].length === 0) delete player.stored[place.id];
      player.backpack.push(itemId);
      writeSave(player);
      showLeftHere(place);
    }));
  });
}

// A small card: picture, name, and an optional button.
function itemCard(item, buttonText, onClick) {
  const card = document.createElement("div");
  card.className = "item-card";
  const art = document.createElement("span");
  art.className = "item-art";
  art.appendChild(itemArt(item));
  const name = document.createElement("span");
  name.className = "item-name";
  name.textContent = item.name;
  card.append(art, name);
  if (buttonText) {
    const button = document.createElement("button");
    button.className = "small-button";
    button.textContent = buttonText;
    button.addEventListener("click", onClick);
    card.appendChild(button);
  }
  return card;
}

// ---------------------------------------------------------------- the item pop-up

function openItemPanel(itemId) {
  const item = findItem(itemId);
  shownItem = item;
  const art = document.getElementById("item-panel-art");
  art.innerHTML = "";
  art.appendChild(itemArt(item));
  document.getElementById("item-panel-name").textContent = item.name;
  document.getElementById("item-panel-description").textContent = item.description || "";

  const message = document.getElementById("item-panel-message");
  const getButton = document.getElementById("btn-item-get");
  getButton.hidden = false;
  getButton.disabled = false;
  const supply = isSupply(item);
  if (supply && howMany(item.id) >= GAME_DATA.supplies.most) {
    message.textContent = "You have " + howMany(item.id) + " already. That's the most you can have! Eat one first.";
    getButton.hidden = true;
  } else if (supply && shopStock(item) === 0) {
    message.textContent = "Sold out! The shop gets another one in about " + minutesToRestock(item) + " minute" + (minutesToRestock(item) === 1 ? "" : "s") + ".";
    getButton.hidden = true;
  } else if (!supply && owns(item.id)) {
    message.textContent = "You already have this one!";
    getButton.hidden = true;
  } else if (item.trade) {
    message.textContent = "This can't be bought, only traded. Give the trader something from your backpack for it.";
    getButton.textContent = "🔄 Trade for it";
  } else if (hasFreePick(item.category)) {
    message.textContent = "This can be your free " + item.category + ". You only get one, so choose carefully!";
    getButton.textContent = "Take it for FREE";
  } else {
    const cost = priceOf(item);
    const have = player[cost.money];
    message.textContent = supply ? "The shop has " + shopStock(item) + " left. You have " + howMany(item.id) + ". " : "";
    message.append("It costs ", moneyLabel(cost.money, cost.amount), ". You have ",
      moneyLabel(cost.money, have), ".");
    if (canAfford(item)) {
      // "1 Gem", but "2 Gems"
      getButton.textContent = "Buy for " + cost.amount + " " + (cost.amount === 1 ? cost.name.replace(/s$/, "") : cost.name);
    } else {
      message.append(cost.money === "gems"
        ? " Go fishing at the Dock to earn Gems!"
        : " Go on adventures to earn more Crystals!");
      getButton.textContent = "Not enough " + cost.name;
      getButton.disabled = true;
    }
  }
  document.getElementById("item-panel").hidden = false;
}

function closeItemPanel() {
  document.getElementById("item-panel").hidden = true;
  shownItem = null;
}

document.getElementById("btn-item-close").addEventListener("click", closeItemPanel);

document.getElementById("btn-item-get").addEventListener("click", function () {
  const item = shownItem;
  if (!item || !canGetMore(item)) return;
  if (item.trade) {
    closeItemPanel();
    return openTradePicker(item); // js/trading.js
  }
  if (hasFreePick(item.category)) {
    freePicks()[item.category] = item.id;
    if (categories().every(function (c) { return !hasFreePick(c); })) player.scholarship = false;
  } else if (canAfford(item)) {
    player[priceOf(item).money] -= priceOf(item).amount;
  } else {
    return;
  }
  if (isSupply(item)) takeFromStock(item);
  player.backpack.push(item.id);
  writeSave(player);
  closeItemPanel();
  showPlace(player.at); // redraw the shelf so it shows "Yours ✓" (or how many are left)
  document.getElementById("shelf-note").textContent =
    "🎒 " + item.name + " went into your backpack!";
});

// ---------------------------------------------------------------- the backpack

// Things can be put down inside places, but not on maps or store shelves.
function canPutDownHere() {
  const place = findPlace(player.at);
  return place && place.type === "place" && !place.shelf;
}

function openBackpack() {
  const character = findCharacter(player.characterId);
  document.getElementById("backpack-title").textContent =
    "🎒 " + (character ? character.name : "Your") + "'s Backpack";

  const left = categories().filter(hasFreePick);
  document.getElementById("backpack-free").textContent = left.length
    ? "Free Scholarship items still to choose at the Campus Store: " + left.join(", ") + "."
    : "";

  const list = document.getElementById("backpack-items");
  list.innerHTML = "";
  if (player.backpack.length === 0) {
    list.textContent = "Your backpack is empty.";
  }
  const place = findPlace(player.at);
  player.backpack.forEach(function (itemId) {
    const item = findItem(itemId);
    if (!item) return;
    const putDown = canPutDownHere() ? "Put down here" : null;
    const card = itemCard(item, putDown, function () {
      removeOne(player.backpack, itemId);
      player.stored[place.id] = (player.stored[place.id] || []).concat([itemId]);
      writeSave(player);
      openBackpack();
      showLeftHere(place);
    });
    if (hasMarshmallows(item.id)) card.querySelector(".item-name").textContent += " with marshmallows";
    if (item.food) card.appendChild(eatButton(item)); // snacks (js/hunger.js)
    if (isLuckPotion(item)) card.appendChild(drinkButton(item)); // js/luck.js
    if (isFindingPotion(item)) card.appendChild(findingDrinkButton(item)); // js/pixie.js
    list.appendChild(card);
  });

  // A reminder of things left around the world.
  const elsewhere = document.getElementById("backpack-elsewhere");
  elsewhere.innerHTML = "";
  Object.keys(player.stored).forEach(function (placeId) {
    const spot = findPlace(placeId);
    const names = player.stored[placeId].map(function (id) {
      const item = findItem(id);
      return item ? item.name : id;
    });
    if (!spot || names.length === 0) return;
    const line = document.createElement("p");
    line.textContent = "Left at " + spot.name + ": " + names.join(", ");
    elsewhere.appendChild(line);
  });
  if (!canPutDownHere() && player.backpack.length) {
    const tip = document.createElement("p");
    tip.className = "note";
    tip.textContent = "Tip: go inside a place, like Home, to put things down.";
    elsewhere.appendChild(tip);
  }
  document.getElementById("backpack-panel").hidden = false;
}

// A button to eat a snack, then a note saying how much less hungry you are.
function eatButton(item) {
  const button = document.createElement("button");
  button.className = "small-button";
  button.textContent = "😋 Eat " + foodLabel(item);
  button.addEventListener("click", function () {
    const less = eat(item);
    openBackpack();
    document.getElementById("backpack-free").textContent = yumText(item, less);
  });
  return button;
}

document.getElementById("btn-backpack").addEventListener("click", function () {
  if (!walking) openBackpack();
});

document.getElementById("btn-backpack-close").addEventListener("click", function () {
  document.getElementById("backpack-panel").hidden = true;
});
