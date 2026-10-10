// Chores (data/chores.js). The first one is Clean Room: your room at Home gets
// dirtier the longer you stay there, and a broomstick from your backpack
// sweeps it clean for Chore Points.

let sweepTimer = null;

// The chore that belongs to a place, if it has one.
function choreAt(placeId) {
  return GAME_DATA.chores.find(function (chore) { return chore.place === placeId; });
}

// How dirty a room is: 0 is clean, and each level up is a bit messier.
function dirtOf(chore) {
  return player.dirt[chore.place] || 0;
}

// The first item in the backpack that can do the chore (any broomstick).
function choreTool(chore) {
  return player.backpack.map(findItem).find(function (item) {
    return item && item.category === chore.needs;
  });
}

// ---------------------------------------------------------------- getting dirty

// Once a second: if you're in a room with a chore, it gets a little closer to
// its next level of dirt. Only counts while the game is on screen.
setInterval(function () {
  if (!player || document.hidden || sweepTimer) return;
  if (document.getElementById("screen-place").hidden) return;
  const chore = choreAt(player.at);
  if (!chore) return;
  const most = chore.levels.length - 1;
  if (dirtOf(chore) >= most) return; // as messy as it gets
  player.dirtSeconds[chore.place] = (player.dirtSeconds[chore.place] || 0) + 1;
  if (player.dirtSeconds[chore.place] >= chore.secondsPerLevel) {
    player.dirtSeconds[chore.place] = 0;
    player.dirt[chore.place] = dirtOf(chore) + 1;
    writeSave(player);
    showChore(findPlace(player.at));
  }
}, 1000);

// ---------------------------------------------------------------- showing it

// Draw the dust bunnies and the Clean Room button for this place.
function showChore(place) {
  const dustBox = document.getElementById("place-dust");
  const button = document.getElementById("btn-chore");
  const chore = choreAt(place.id);
  dustBox.innerHTML = "";
  button.hidden = !chore;
  if (!chore) return;

  // More dust bunnies for each level of dirt.
  const level = dirtOf(chore);
  const perLevel = Math.ceil(chore.dust.length / (chore.levels.length - 1));
  chore.dust.slice(0, level * perLevel).forEach(function (spot) {
    const bunny = document.createElement("span");
    bunny.className = "dust";
    bunny.style.left = spot[0] + "%";
    bunny.style.top = spot[1] + "%";
    dustBox.appendChild(bunny);
  });
  button.textContent = "🧹 " + chore.name + " (" + chore.levels[level] + ")";
}

// ---------------------------------------------------------------- sweeping

function openChore() {
  const chore = choreAt(player.at);
  const tool = choreTool(chore);
  const dirt = dirtOf(chore);
  document.getElementById("chore-title").textContent = chore.name;
  document.getElementById("chore-art").textContent = "🧹";
  document.getElementById("chore-art").classList.remove("sweeping");
  const sweep = document.getElementById("btn-chore-sweep");
  sweep.hidden = true;
  if (dirt === 0) {
    say("Your room is sparkling clean! Spend some time here and it will get dusty again.");
  } else if (!tool) {
    say("Your room is " + chore.levels[dirt].toLowerCase() + ". You need a broomstick in your backpack to sweep it. The Campus Store has lots of broomsticks.");
  } else {
    say("Your room is " + chore.levels[dirt].toLowerCase() + ". Sweep it with your " + tool.name + " broomstick?");
    sweep.hidden = false;
  }
  document.getElementById("chore-panel").hidden = false;
}

function say(message) {
  document.getElementById("chore-message").textContent = message;
}

function startSweeping() {
  const chore = choreAt(player.at);
  document.getElementById("btn-chore-sweep").hidden = true;
  document.getElementById("chore-art").classList.add("sweeping");
  say("Sweep, sweep, sweep...");
  sweepTimer = setTimeout(function () { finishSweeping(chore); }, chore.sweepSeconds * 1000);
}

function finishSweeping(chore) {
  sweepTimer = null;
  const points = dirtOf(chore) * chore.pointsPerLevel;
  player.chorePoints += points;
  player.dirt[chore.place] = 0;
  player.dirtSeconds[chore.place] = 0;
  writeSave(player);
  updateStatus();
  showChore(findPlace(player.at));
  document.getElementById("chore-art").classList.remove("sweeping");
  document.getElementById("chore-art").textContent = "✨";
  say("All clean! You earned " + points + " Chore Point" + (points === 1 ? "" : "s") + ".");
}

// Closing the pop-up mid-sweep stops sweeping (the room stays dirty).
function stopSweeping() {
  clearTimeout(sweepTimer);
  sweepTimer = null;
  document.getElementById("chore-panel").hidden = true;
}

document.getElementById("btn-chore").addEventListener("click", openChore);
document.getElementById("btn-chore-sweep").addEventListener("click", startSweeping);
document.getElementById("btn-chore-close").addEventListener("click", stopSweeping);
