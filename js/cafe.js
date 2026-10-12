// The Cafe in the Village: click the menu, order a meal and eat it right
// there. Meals are proper food (healthy), so each takes away as many hunger
// points as its price in gems. The dishes are in data/items.js ("Cafe Menu").

function openCafe(spot, message) {
  const dishes = GAME_DATA.items.filter(function (item) { return item.category === spot.menu; });
  const body = openInfoPanel("🍽️", "Cafe Menu", message ||
    "What would you like? You eat it right here at the table. Hungry: " + player.hunger + "/" + GAME_DATA.hunger.max + " 🍽️");
  const row = document.createElement("div");
  row.className = "item-row";
  dishes.forEach(function (dish, i) {
    const card = itemCard(dish, "Eat here: " + dish.gems + " gems", function () { eatAtCafe(spot, dish); });
    card.querySelector(".item-name").textContent = (i + 1) + ". " + dish.name;
    const note = document.createElement("small");
    note.textContent = foodLabel(dish);
    card.appendChild(note);
    row.appendChild(card);
  });
  body.appendChild(row);
}

function eatAtCafe(spot, dish) {
  if (player.gems < dish.gems) {
    return openCafe(spot, "Oh no, the " + dish.name + " costs " + dish.gems + " gems and you have " + player.gems + ". Fishing at the Lake earns gems.");
  }
  // Not added to the backpack: you eat it at the table, so it's paid and eaten at once.
  player.gems -= dish.gems;
  const before = player.hunger;
  player.hunger = Math.max(0, player.hunger - foodIn(dish));
  writeSave(player);
  openCafe(spot, "🍽️ " + yumText(dish, before - player.hunger));
}
