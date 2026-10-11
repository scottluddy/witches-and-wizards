// The Trading Post in the Forest (the rules are in data/trading.js).
// Nothing is bought here: you swap something from your backpack for
// something on a shelf. The Gems shelf buys your things for Gems.

// ---------------------------------------------------------------- trading

// The pop-up for a Trading Post item: pick what to give for it.
function openTradePicker(item, message) {
  const body = openInfoPanel("🔄", "Trade for the " + item.name, message ||
    (player.backpack.length
      ? "No Crystals or Gems here! Choose something from your backpack to give the trader."
      : "Your backpack is empty, so you have nothing to trade yet. Buy or find something first!"));
  const row = document.createElement("div");
  row.className = "item-row";
  player.backpack.forEach(function (giveId) {
    const give = findItem(giveId);
    if (!give) return;
    row.appendChild(itemCard(give, "Give this", function () { trade(give, item); }));
  });
  body.appendChild(row);
}

// One for one: what you give leaves your backpack, the new item goes in.
function trade(give, get) {
  player.backpack.splice(player.backpack.indexOf(give.id), 1);
  player.marshmallows = player.marshmallows.filter(function (id) { return id !== give.id; });
  player.backpack.push(get.id);
  writeSave(player);
  openInfoPanel("🤝", "It's a Trade!", "You gave the " + give.name + " and got the " + get.name +
    ". It went into your backpack.");
  showPlace(player.at); // the shelf now shows "Yours ✓"
}

// ---------------------------------------------------------------- the Gems shelf

// What the Gems shelf pays for something: { amount, money }, or null if it
// isn't worth anything.
function sellValue(thing) {
  const rules = GAME_DATA.trading;
  let amount, money = "gems";
  if (rules.worth[thing.id] !== undefined) {
    amount = rules.worth[thing.id];                 // a fair price set by hand
  } else if (thing.trade) {
    amount = rules.tradedWorth;                    // Trading Post items have no price
  } else if (findItem(thing.id)) {
    const cost = priceOf(thing);                   // bought in a shop: about 90% back
    amount = Math.round(cost.amount * rules.sellShare);
    money = cost.money;
  } else {
    amount = thing.gems || 0;                      // fish, treasures, beach finds
  }
  return amount > 0 ? { amount: amount, money: money } : null;
}

// Everything you carry that the Gems shelf could buy: [{ thing, from }].
function sellableThings() {
  const list = [];
  player.backpack.forEach(function (id) {
    const item = findItem(id);
    if (item) list.push({ thing: item, from: "backpack" });
  });
  ["cooler", "bucket", "satchel", "basket"].forEach(function (bag) {
    keepableThings().forEach(function (thing) {        // js/storage.js
      if (player[bag].indexOf(thing.id) !== -1) list.push({ thing: thing, from: bag });
    });
  });
  return list.filter(function (entry) { return sellValue(entry.thing); });
}

function openGemsShelf(message) {
  const art = document.createElement("img");
  art.src = picture("extra_gem_strings");
  art.alt = "Gems";
  const things = sellableThings();
  const body = openInfoPanel(art, "The Gems Shelf", message ||
    (things.length ? "The trader will buy these from you. Things from shops get about 90% of what they cost."
                   : "You have nothing the trader wants to buy yet. Go fishing, digging or mining!"));
  const row = document.createElement("div");
  row.className = "item-row";
  things.forEach(function (entry) {
    const value = sellValue(entry.thing);
    const count = entry.from === "backpack" ? 1 : player[entry.from].filter(function (id) { return id === entry.thing.id; }).length;
    const card = itemCard(entry.thing, "Sell for " + value.amount + " " + moneyName(value), function () {
      sell(entry.thing, entry.from, value);
    });
    if (count > 1) card.querySelector(".item-name").textContent += " × " + count;
    row.appendChild(card);
  });
  body.appendChild(row);
}

// "1 Gem", "3 Gems", "2 Crystals"
function moneyName(value) {
  const name = value.money === "gems" ? "Gem" : "Crystal";
  return value.amount === 1 ? name : name + "s";
}

function sell(thing, from, value) {
  const list = player[from];
  list.splice(list.indexOf(thing.id), 1);
  player.marshmallows = player.marshmallows.filter(function (id) { return id !== thing.id; });
  player[value.money] += value.amount;
  writeSave(player);
  openGemsShelf("Sold the " + thing.name + " for " + value.amount + " " + moneyName(value) + "!");
}
