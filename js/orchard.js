// Picking fruit in the Fruit Orchard: click a fruit tree to see it up close.
// The tree sways in the wind, so you have to click each fruit to pick it; each
// one goes into your fruit basket (🧺 in the top bar). Picking makes the tree
// sway faster, and picked fruit grows back slowly. The fruits and the numbers
// are in data/orchard.js.

function findFruit(id) {
  return GAME_DATA.fruits.find(function (fruit) { return fruit.id === id; });
}

// How many fruits are on this tree now (one grows back every "growSeconds").
function fruitOnTree(tree) {
  const rules = GAME_DATA.picking;
  const state = player.trees[tree.id] || { fruit: rules.fruitOnTree, at: Date.now() };
  const grown = Math.floor((Date.now() - state.at) / (rules.growSeconds * 1000));
  if (grown > 0) {
    state.fruit = Math.min(rules.fruitOnTree, state.fruit + grown);
    state.at += grown * rules.growSeconds * 1000;
  }
  if (state.fruit === rules.fruitOnTree) state.at = Date.now(); // a full tree doesn't grow more
  player.trees[tree.id] = state;
  return state.fruit;
}

// The close-up of the tree, swaying, with its fruit to click.
function pickFruit(tree) {
  const fruit = findFruit(tree.fruit);
  const count = fruitOnTree(tree);
  const body = openInfoPanel(fruit.emoji, tree.name, count > 0
    ? "The tree is swaying in the wind! Click " + (fruit.name.toLowerCase()) + "s to pick them."
    : "No " + fruit.name.toLowerCase() + "s left. A new one grows every " + GAME_DATA.picking.growSeconds + " seconds.");
  const stage = document.createElement("div");
  stage.className = "tree-stage";
  const swaying = document.createElement("div");
  swaying.className = "tree-sway";
  swaying.style.setProperty("--sway", GAME_DATA.picking.swayDegrees + "deg");
  swaying.style.animationDuration = GAME_DATA.picking.swaySeconds + "s";
  const treeImg = document.createElement("img");
  treeImg.className = "tree-picture";
  treeImg.src = picture(tree.closeUp);
  treeImg.alt = tree.name;
  swaying.appendChild(treeImg);
  GAME_DATA.picking.spots.slice(0, count).forEach(function (spot) {
    swaying.appendChild(fruitOnBranch(tree, fruit, spot, swaying));
  });
  stage.appendChild(swaying);
  body.appendChild(stage);
}

// One fruit hanging on the tree. Click it to pick it.
function fruitOnBranch(tree, fruit, spot, swaying) {
  const hanging = document.createElement(isDrawn(fruit.id) ? "img" : "button");
  hanging.className = "tree-fruit";
  if (isDrawn(fruit.id)) hanging.src = picture(fruit.id);
  else hanging.textContent = fruit.emoji;
  hanging.style.left = spot[0] + "%";
  hanging.style.top = spot[1] + "%";
  hanging.addEventListener("click", function () {
    hanging.remove();
    putInBasket(tree, fruit);
    // Each pick makes the tree sway a little faster: harder to pick the next one.
    const seconds = parseFloat(swaying.style.animationDuration) * GAME_DATA.picking.fasterEach;
    swaying.style.animationDuration = seconds + "s";
    const left = player.trees[tree.id].fruit;
    document.getElementById("info-message").textContent = fruit.emoji + " You picked " + aOrAn(fruit.name) + " " +
      fruit.name + "! It's in your fruit basket. " + (left > 0 ? left + " left on the tree." : "That was the last one!");
  });
  return hanging;
}

function putInBasket(tree, fruit) {
  const state = player.trees[tree.id];
  if (state.fruit === GAME_DATA.picking.fruitOnTree) state.at = Date.now(); // regrowing starts now
  state.fruit -= 1;
  player.basket.push(fruit.id);
  writeSave(player);
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
