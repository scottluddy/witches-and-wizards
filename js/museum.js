// The Museum (Scott, 2026-10-15): buy a ticket at Pay Here, go into the
// Exhibit Hall, visit every room, then the Snack Shop opens. Museum rules:
// you can only eat sitting down. The Snack Shop's Tiny Hole needs a Shrink
// Potion. Words and numbers in data/museum.js, places in data/places.js.

let museumSeated = false; // sitting on the Snack Shop chair (you stand up when you leave)

// ---------------------------------------------------------------- tickets and rooms

// Pay Here: 5 gems for a ticket (one at a time).
function openMuseumPay(message) {
  const rules = GAME_DATA.museum;
  const hasTicket = player.backpack.indexOf(rules.ticket) !== -1;
  const body = openInfoPanel("🎟️", "Pay Here", message ||
    ("💬 Cashier: \"" + rules.says + "\"" + (hasTicket ? " You already have a ticket. Click Enter to go in!" : " You have " + player.gems + " gems.")));
  if (hasTicket) return;
  const pay = document.createElement("button");
  pay.className = "big-button";
  pay.textContent = "💰 Pay " + rules.ticketGems + " gems for a ticket";
  pay.disabled = player.gems < rules.ticketGems;
  pay.addEventListener("click", function () {
    player.gems -= rules.ticketGems;
    player.backpack.push(rules.ticket);
    writeSave(player);
    openMuseumPay("🎟️ Here's your ticket! Click Enter to go into the Exhibit Hall.");
  });
  body.appendChild(pay);
}

function museumRooms() {
  return GAME_DATA.places.filter(function (p) { return p.museumRoom; });
}

function roomsLeft() {
  return museumRooms().filter(function (room) { return player.museum.visited.indexOf(room.id) === -1; });
}

// Called by goTo. Returns true if it stopped you going in (and said why).
function museumStops(place) {
  if (place.needsTicket) return useTicket(place);
  if (place.needsRound && roomsLeft().length) {
    openInfoPanel("🏛️", place.name, "Take a round of the Museum first: visit every Exhibit Room. Still to see: " +
      roomsLeft().map(function (r) { return r.name; }).join(", ") + ".");
    return true;
  }
  return false;
}

// Going into the Exhibit Hall uses up your ticket (but not coming back out of
// one of its rooms, or reloading the game while inside).
function useTicket(place) {
  const from = findPlace(player.at);
  if (player.at === place.id || (from && from.in === place.id)) return false;
  const ticket = GAME_DATA.museum.ticket;
  if (player.backpack.indexOf(ticket) === -1) {
    openInfoPanel("🎟️", "Tickets, please!", "You need an Admission Ticket to go in. Get one at Pay Here.");
    return true;
  }
  removeOne(player.backpack, ticket);
  player.museum.visited = []; // a new visit: see every room again
  writeSave(player);
  return false;
}

// Called by showPlace: remember the rooms you've seen, and stand up when
// you leave the Snack Shop.
function noteMuseumVisit(place) {
  if (!placesIn(place.id).some(function (p) { return p.type === "seat"; })) museumSeated = false;
  if (!place.museumRoom || player.museum.visited.indexOf(place.id) !== -1) return;
  player.museum.visited.push(place.id);
  writeSave(player);
  const left = roomsLeft().length;
  document.getElementById("place-description").textContent = left
    ? "🏛️ " + left + " more room" + (left === 1 ? "" : "s") + " to see."
    : "🏛️ You've seen every room! The Snack Shop is open for you now.";
}

// ---------------------------------------------------------------- the Snack Shop

// The menu: click something to buy it into your backpack.
function openMenuShop(spot) {
  const things = GAME_DATA.items.filter(function (item) { return item.category === spot.menu; });
  const body = openInfoPanel("📋", "Menu", "Click something to buy it. Then sit down to eat it!");
  const row = document.createElement("div");
  row.className = "item-row";
  things.forEach(function (item) {
    row.appendChild(itemCard(item, item.gems + " gems", function () {
      document.getElementById("info-panel").hidden = true;
      openItemPanel(item.id); // the usual buying pop-up (js/items.js)
    }));
  });
  body.appendChild(row);
}

function sitDown() {
  museumSeated = true;
  document.getElementById("place-description").textContent = GAME_DATA.museum.sitting;
  openBackpack(); // js/items.js
}

// Museum rules: inside the Museum you can only eat sitting down. Returns
// what to say if you can't eat here, or "" if you can.
function cantEatHere() {
  let place = findPlace(player.at);
  while (place && !place.museumRules) place = place.in ? findPlace(place.in) : null;
  return place && !museumSeated ? GAME_DATA.museum.sitRule : "";
}

// ---------------------------------------------------------------- the Tiny Hole

// The girls' notes, what you still need, and the way in.
function openTinyHole(spot) {
  const rules = GAME_DATA.museum;
  const potion = rules.potions.find(function (id) { return player.backpack.indexOf(id) !== -1; });
  const round = roomsLeft().length === 0;
  let art = "🕳️";
  if (isDrawn(rules.notes)) {
    art = document.createElement("img");
    art.src = picture(rules.notes);
    art.alt = "Tiny hole notes";
    art.className = "info-picture";
  }
  const body = openInfoPanel(art, spot.name, potion && round ? "You have everything you need!" : "To get in you need to:");
  const list = document.createElement("ul");
  [[!!potion, rules.needPotion], [round, rules.needRound]].forEach(function (need) {
    const line = document.createElement("li");
    line.textContent = (need[0] ? "✅ " : "⬜ ") + need[1];
    list.appendChild(line);
  });
  body.appendChild(list);
  if (!potion || !round) return;
  const go = document.createElement("button");
  go.className = "big-button";
  go.textContent = rules.button;
  go.addEventListener("click", function () {
    removeOne(player.backpack, potion);
    document.getElementById("info-panel").hidden = true;
    showPlace(spot.to);
  });
  body.appendChild(go);
}

// ---------------------------------------------------------------- the Ancient Kitty Pirate Room

// The Old Chest: locked until you bring the Old Key from the Dig Spot.
function openArtifactChest() {
  const chest = GAME_DATA.artifactsChest;
  if (player.museum.chestOpened) return openInfoPanel("📜", "Old Chest", chest.openAgain);
  const hasKey = player.backpack.indexOf(chest.key) !== -1;
  const body = openInfoPanel("🧰", "Old Chest", chest.locked);
  if (!hasKey) return;
  const tryKey = document.createElement("button");
  tryKey.className = "big-button";
  tryKey.textContent = chest.button;
  tryKey.addEventListener("click", function () {
    player.museum.chestOpened = true; // the key stays in your backpack as a keepsake
    writeSave(player);
    openInfoPanel("📜", "The chest is open!", chest.opened);
  });
  body.appendChild(tryKey);
}
