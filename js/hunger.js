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

// Eat (or drink) something from the backpack. Once eaten it's gone, so it
// can be bought again at the Snack Shack.
function eat(item) {
  const before = player.hunger;
  player.hunger = Math.max(0, player.hunger - foodIn(item));
  player.backpack.splice(player.backpack.indexOf(item.id), 1);
  player.marshmallows = player.marshmallows.filter(function (id) { return id !== item.id; });
  writeSave(player);
  return before - player.hunger; // how much less hungry you are
}

// The marshmallow machine: hold up your hot chocolate and marshmallows drop in.
function useMarshmallows() {
  const mug = player.backpack.map(findItem).find(function (item) {
    return item && item.hotChocolate && player.marshmallows.indexOf(item.id) === -1;
  });
  const note = document.getElementById("place-description");
  if (!mug) {
    note.textContent = "🍡 Hold a mug of hot chocolate up to the machine for marshmallows. Get one at the hot chocolate station!";
    return;
  }
  player.marshmallows.push(mug.id);
  writeSave(player);
  note.textContent = "🍡 Plop, plop! Marshmallows drop into your " + mug.name + ".";
}
