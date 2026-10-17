// The Flea Market (Scott, 2026-10-17), Floor 3 of the Multi-House.
// Rent the free table at the Market Witch's booth, then shoppers walking from
// table to table stop at yours and haggle for things you've found.
// The numbers are in data/market.js, the room and its spots in data/places.js.

let market = null; // while you're in the Flea Market: { placeId, rented, shoppers, haggle, timer }

// ---------------------------------------------------------------- the room

// Called by showPlace: set up the market, or tidy it away when you leave.
function showMarket(place) {
  stopMarket();
  const box = document.getElementById("place-market");
  box.hidden = !place.market;
  if (box.hidden) return;
  market = { placeId: place.id, rented: false, shoppers: [], haggle: null, timer: null };
  drawMarket();
  addYou();
  nextShopper(1);
}

function stopMarket() {
  if (!market) return;
  clearTimeout(market.timer);
  clearTimeout(market.youTimer);
  market.shoppers.forEach(function (s) { clearTimeout(s.timer); });
  market = null;
  document.getElementById("place-market").innerHTML = "";
}

// Still in the market? (You might have gone to the elevator, a map or the title screen.)
function stillInMarket() {
  if (market && player && player.at === market.placeId && !document.getElementById("screen-place").hidden) return true;
  stopMarket();
  return false;
}

// Who sits at the other tables and who goes shopping: the game's characters,
// but never the one you're playing.
function marketPeople() {
  const others = GAME_DATA.characters.map(function (c) { return c.id; })
    .filter(function (id) { return id !== player.characterId; });
  const sellers = [];
  GAME_DATA.market.tables.forEach(function (table) {
    if (table.free) return;
    let wit = table.wit;
    if (wit === player.characterId) wit = others.find(function (id) {
      return sellers.indexOf(id) === -1 && !GAME_DATA.market.tables.some(function (t) { return t.wit === id; });
    });
    sellers.push(wit);
  });
  const shoppers = others.filter(function (id) { return sellers.indexOf(id) === -1; });
  return { sellers: sellers, shoppers: shoppers };
}

// The booth, the 4 tables and who's sitting at them.
function drawMarket() {
  const rules = GAME_DATA.market;
  const box = document.getElementById("place-market");
  box.innerHTML = "";
  const drawnRoom = isDrawn("place_" + market.placeId); // once the girls draw it, the booth and tables are in the picture
  if (!drawnRoom) {
    const booth = document.createElement("div");
    booth.className = "market-booth";
    booth.style.left = rules.booth.x + "%";
    booth.style.top = rules.booth.y + "%";
    booth.innerHTML = '<span class="market-awning"></span><span class="market-witch"></span>';
    booth.querySelector(".market-witch").appendChild(marketWitchArt());
    box.appendChild(booth);
  }
  const sellers = marketPeople().sellers;
  let n = 0;
  rules.tables.forEach(function (table) {
    if (!table.free) box.appendChild(personAt(sellers[n++], table.x, table.y, "market-seller"));
    if (!drawnRoom) {
      const top = document.createElement("div");
      top.className = "market-table";
      top.style.left = table.x + "%";
      top.style.top = table.y + "%";
      if (table.free) {
        top.id = "market-for-rent";
        top.textContent = "For rent";
      }
      box.appendChild(top);
    }
  });
}

// A character's picture standing (or sitting) with their feet at x, y.
function personAt(id, x, y, className) {
  const img = document.createElement("img");
  img.className = "market-person " + className;
  img.src = characterPicture(findCharacter(id));
  img.alt = findCharacter(id).name;
  img.style.left = x + "%";
  img.style.top = y + "%";
  return img;
}

// The Market Witch's drawing, or her emoji until it's drawn.
function marketWitchArt() {
  if (!isDrawn("market_witch")) return document.createTextNode(GAME_DATA.market.witch.emoji);
  const img = document.createElement("img");
  img.src = picture("market_witch");
  img.alt = GAME_DATA.market.witch.name;
  return img;
}

// ---------------------------------------------------------------- renting the table

// The head booth: rent the free table from the Market Witch.
function openMarketBooth() {
  if (market.rented) return boothPopUp(); // you stay sitting at your table
  const booth = GAME_DATA.market.booth;
  walkYou(booth.x, booth.y + 16, boothPopUp);
}

function boothPopUp() {
  const rules = GAME_DATA.market;
  const art = isDrawn("market_witch") ? marketWitchArt() : rules.witch.emoji;
  const things = marketThings();
  let message = "💬 " + rules.witch.name + ': "' + rules.witch.says + '"';
  if (market.rented) message = "💬 " + rules.witch.name + ': "Your table is all set up. Good luck!"';
  else if (!things.length) message += " You have nothing to sell yet: fish, shells, sand dollars, pearls, bones, apples or honey in your cooler, bucket, satchel or basket.";
  else message += " You have " + player.gems + " gems.";
  const body = openInfoPanel(art, rules.witch.name, message);
  if (market.rented || !things.length) return;
  const rent = document.createElement("button");
  rent.className = "big-button";
  rent.textContent = "💰 Rent the table for " + rules.rentGems + " gems";
  rent.disabled = player.gems < rules.rentGems;
  rent.addEventListener("click", function () {
    player.gems -= rules.rentGems;
    writeSave(player);
    market.rented = true;
    const label = document.getElementById("market-for-rent");
    if (label) label.textContent = "";
    document.getElementById("info-panel").hidden = true;
    sitAtTable();
  });
  body.appendChild(rent);
}

// Clicking your table.
function openMarketTable() {
  const say = document.getElementById("place-description");
  if (!market.rented) {
    const table = freeTable();
    walkYou(table.x + (table.x < 50 ? 12 : -12), table.y + 6);
    say.textContent = "🪑 This table is free. Rent it from the " + GAME_DATA.market.witch.name + " at the booth.";
    return;
  }
  const things = marketThings();
  say.textContent = things.length
    ? "🪑 You're selling: " + things.map(function (t) { return t.thing.name; }).join(", ") + ". Wait for a shopper to stop by!"
    : "🪑 You've sold everything! Go and find some more.";
}

// ---------------------------------------------------------------- you, in the market

// Scott, 2026-10-17: show your own character wherever we can. You come in at
// the door, walk to the booth or your table when you click them, and sit at
// your table once it's rented.
function addYou() {
  const door = GAME_DATA.market.door;
  market.you = personAt(player.characterId, door.x, door.y, "market-shopper market-you");
  market.you.style.setProperty("--hop", GAME_DATA.market.youHopSeconds + "s");
  document.getElementById("place-market").appendChild(market.you);
  walkYou(door.x, door.y - 12);
}

// Walk to x, y, then do "then" (if given). Clicking somewhere else on the way
// just turns you round.
function walkYou(x, y, then) {
  const you = market.you;
  clearTimeout(market.youTimer);
  you.classList.toggle("facing-left", x < parseFloat(you.style.left));
  you.classList.add("walking");
  requestAnimationFrame(function () { // so a brand-new picture walks instead of jumping
    you.style.left = x + "%";
    you.style.top = y + "%";
  });
  market.youTimer = setTimeout(function () {
    if (!stillInMarket()) return;
    you.classList.remove("walking");
    if (then) then();
  }, GAME_DATA.market.youHopSeconds * 1000);
}

function freeTable() {
  return GAME_DATA.market.tables.find(function (t) { return t.free; });
}

// Walk to your table and sit behind it, like the other sellers.
function sitAtTable() {
  const table = freeTable();
  walkYou(table.x, table.y, function () {
    market.you.classList.remove("market-shopper", "facing-left");
    market.you.classList.add("market-seller");
    document.getElementById("place-description").textContent =
      "🪑 You sit down at your table. Shoppers will stop by to buy what you've found. The table is yours until you leave the market.";
  });
}

// ---------------------------------------------------------------- what you can sell

// What a found thing is worth at the market (0 = nobody wants it, like the Bottle Cap).
function marketWorth(thing) {
  return thing.gems || thing.worth || GAME_DATA.market.worth[thing.id] || 0;
}

// Everything you carry that a shopper might buy: [{ thing, bag }], one per copy.
function marketThings() {
  const list = [];
  ["cooler", "bucket", "satchel", "basket"].forEach(function (bag) {
    keepableThings().forEach(function (thing) { // js/storage.js
      if (!marketWorth(thing)) return;
      player[bag].forEach(function (id) { if (id === thing.id) list.push({ thing: thing, bag: bag }); });
    });
  });
  return list;
}

// ---------------------------------------------------------------- shoppers

// Every few seconds a new shopper comes in (if there's room).
function nextShopper(seconds) {
  market.timer = setTimeout(function () {
    if (!stillInMarket()) return;
    if (market.shoppers.length < GAME_DATA.market.maxShoppers && !document.hidden) addShopper();
    const every = GAME_DATA.market.shopperEvery;
    nextShopper(every[0] + Math.random() * (every[1] - every[0]));
  }, seconds * 1000);
}

function addShopper() {
  const walking = market.shoppers.map(function (s) { return s.id; });
  const free = marketPeople().shoppers.filter(function (id) { return walking.indexOf(id) === -1; });
  if (!free.length) return;
  const rules = GAME_DATA.market;
  const shopper = { id: free[Math.floor(Math.random() * free.length)], step: 0, timer: null };
  shopper.img = personAt(shopper.id, rules.door.x, rules.door.y, "market-shopper");
  shopper.img.style.setProperty("--hop", rules.hopSeconds + "s");
  shopper.route = shopperRoute();
  document.getElementById("place-market").appendChild(shopper.img);
  market.shoppers.push(shopper);
  shopper.timer = setTimeout(function () { walkOn(shopper); }, 50);
}

// From the door, past each table in turn (standing in the aisle beside it), and out.
function shopperRoute() {
  const rules = GAME_DATA.market;
  const route = rules.tables.map(function (table) {
    return { x: table.x + (table.x < 50 ? 14 : -14), y: table.y + 4, table: table };
  });
  route.push({ x: rules.door.x, y: rules.door.y, out: true });
  return route;
}

// Walk to the next stop on the route; look around there, then walk on.
function walkOn(shopper) {
  if (!stillInMarket()) return;
  const stop = shopper.route[shopper.step++];
  if (!stop) return leaveMarket(shopper);
  const fromX = parseFloat(shopper.img.style.left);
  shopper.img.classList.toggle("facing-left", stop.x < fromX);
  shopper.img.classList.add("walking");
  shopper.img.style.left = stop.x + "%";
  shopper.img.style.top = stop.y + "%";
  shopper.timer = setTimeout(function () {
    if (!stillInMarket()) return;
    shopper.img.classList.remove("walking");
    if (stop.out) return leaveMarket(shopper);
    if (stop.table.free && wantsToBuy()) return startHaggle(shopper);
    shopper.timer = setTimeout(function () { walkOn(shopper); }, 800 + Math.random() * 1200);
  }, GAME_DATA.market.hopSeconds * 1000);
}

// Does this shopper stop at your table? Only if it's yours, you have
// something to sell and you're not haggling with someone else already.
function wantsToBuy() {
  return market.rented && !market.haggle && marketThings().length > 0 &&
    Math.random() < luckyChance(GAME_DATA.market.stopChance); // js/luck.js
}

function leaveMarket(shopper) {
  shopper.img.remove();
  market.shoppers.splice(market.shoppers.indexOf(shopper), 1);
}

// ---------------------------------------------------------------- haggling

// A random number between two shares, like [0.6, 1.15].
function shareBetween(range) {
  return range[0] + Math.random() * (range[1] - range[0]);
}

// The shopper picks one of your things and secretly decides the most
// they'll pay, then offers less than that.
function startHaggle(shopper) {
  const rules = GAME_DATA.market;
  const things = marketThings();
  const pick = things[Math.floor(Math.random() * things.length)];
  const worth = marketWorth(pick.thing);
  const most = Math.max(1, Math.round(worth * shareBetween(rules.most)));
  const offer = Math.max(1, Math.min(most, Math.floor(most * shareBetween(rules.firstOffer))));
  market.haggle = { shopper: shopper, pick: pick, worth: worth, most: most, offer: offer, asks: 0 };
  const name = findCharacter(shopper.id).name;
  showHaggle('💬 ' + name + ': "Ooh, ' + aOrAn(pick.thing.name) + "! I'll give you " + gemsText(offer) + ' for it."');
}

function aOrAn(name) {
  return (/^[AEIOU]/.test(name) ? "an " : "a ") + name;
}

function gemsText(amount) {
  return amount + (amount === 1 ? " gem" : " gems");
}

// The haggling pop-up: say yes, ask for a price, or say no thanks.
function showHaggle(message) {
  const h = market.haggle;
  const art = document.createElement("img");
  art.className = "info-picture";
  art.src = characterPicture(findCharacter(h.shopper.id));
  art.alt = findCharacter(h.shopper.id).name;
  const body = openInfoPanel(art, "Haggling for your " + h.pick.thing.name, message);
  const hint = document.createElement("p");
  hint.className = "note";
  hint.textContent = "It's worth about " + gemsText(h.worth) + ". The Gems shelf would pay " +
    gemsText(Math.max(1, Math.floor(h.worth * GAME_DATA.trading.catchShare))) + ". " +
    (h.asks ? "Last chance to ask: ask too much and they'll walk on!" : "You can ask for more twice.");
  body.appendChild(hint);

  const yes = document.createElement("button");
  yes.className = "big-button";
  yes.textContent = "✅ Sell it for " + gemsText(h.offer);
  yes.addEventListener("click", function () { sellAtMarket(h.offer); });
  body.appendChild(yes);

  // Your price: pick it with − and +, then ask.
  let ask = Math.max(h.offer + 1, h.worth);
  const row = document.createElement("div");
  row.className = "haggle-row";
  const less = document.createElement("button");
  const more = document.createElement("button");
  const shown = document.createElement("span");
  const askButton = document.createElement("button");
  less.className = more.className = "small-button";
  less.textContent = "−";
  more.textContent = "+";
  shown.className = "haggle-price";
  askButton.className = "big-button secondary";
  function showAsk() {
    shown.textContent = gemsText(ask);
    askButton.textContent = "🗣️ Ask for " + gemsText(ask);
    less.disabled = ask <= h.offer + 1;
  }
  less.addEventListener("click", function () { ask--; showAsk(); });
  more.addEventListener("click", function () { ask++; showAsk(); });
  askButton.addEventListener("click", function () { askFor(ask); });
  showAsk();
  row.append(less, shown, more, askButton);
  body.appendChild(row);

  const no = document.createElement("button");
  no.className = "big-button secondary";
  no.textContent = "🙅 No thanks";
  no.addEventListener("click", function () { endHaggle(); });
  body.appendChild(no);
}

// You ask for a price. Their most or less: it's a deal. Too much: the first
// time they offer once more (closer to their most), the second time they walk on.
function askFor(ask) {
  const h = market.haggle;
  const name = findCharacter(h.shopper.id).name;
  if (ask <= h.most) return sellAtMarket(ask);
  h.asks++;
  if (h.asks >= 2) {
    endHaggle('💬 ' + name + ': "' + gemsText(ask) + '? That\'s too much for me. Bye!" ' + name + " walks on.");
    return;
  }
  const better = Math.min(h.most, h.offer + Math.max(1, Math.round((h.most - h.offer) * shareBetween(GAME_DATA.market.secondOffer))));
  const howMuch = ask >= h.most * 1.5 ? "Way too much!" : "Hmm, that's a bit much.";
  const reply = better > h.offer ? "How about " + gemsText(better) + "?" : "I can't pay more than " + gemsText(h.offer) + ".";
  h.offer = better;
  showHaggle('💬 ' + name + ': "' + howMuch + " " + reply + '"');
}

// A deal: the thing leaves your bag and you get the gems.
function sellAtMarket(price) {
  const h = market.haggle;
  const bag = player[h.pick.bag];
  bag.splice(bag.indexOf(h.pick.thing.id), 1);
  if (h.pick.bag === "cooler") forgetCatch(h.pick.thing.id); // js/storage.js
  player.gems += price;
  writeSave(player);
  endHaggle("🤝 It's a deal! " + findCharacter(h.shopper.id).name + " paid " + gemsText(price) + " for your " + h.pick.thing.name + ".");
}

// The shopper walks on. "message" (if any) says how it ended, in the pop-up.
function endHaggle(message) {
  if (!market || !market.haggle) return;
  const shopper = market.haggle.shopper;
  market.haggle = null;
  if (message) {
    const body = openInfoPanel("🛍️", "Flea Market", message);
    const ok = document.createElement("button");
    ok.className = "big-button";
    ok.textContent = "👍 Back to my table";
    ok.addEventListener("click", function () { document.getElementById("info-panel").hidden = true; });
    body.appendChild(ok);
  } else {
    document.getElementById("info-panel").hidden = true;
  }
  shopper.timer = setTimeout(function () { walkOn(shopper); }, 600);
}

// Closing the pop-up with ✕ while haggling is the same as "No thanks".
document.getElementById("btn-info-close").addEventListener("click", function () {
  if (market && market.haggle) endHaggle();
});
