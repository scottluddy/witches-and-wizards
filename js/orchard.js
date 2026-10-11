// Picking fruit in the Fruit Orchard: click a fruit tree and one fruit goes
// into your fruit basket (🧺 in the top bar). The fruits are in data/orchard.js.

function findFruit(id) {
  return GAME_DATA.fruits.find(function (fruit) { return fruit.id === id; });
}

function pickFruit(tree) {
  const fruit = findFruit(tree.fruit);
  player.basket.push(fruit.id);
  writeSave(player);
  document.getElementById("place-description").textContent =
    fruit.emoji + " You picked " + aOrAn(fruit.name) + " " + fruit.name + "! It's in your fruit basket.";
  // A little bounce on the basket button, so you can see where it went.
  const button = document.getElementById("btn-basket");
  button.classList.remove("bump");
  void button.offsetWidth; // restarts the bounce if you pick again quickly
  button.classList.add("bump");
}

// "an Apple", "a Pear"
function aOrAn(word) {
  return "aeiou".indexOf(word[0].toLowerCase()) !== -1 ? "an" : "a";
}
