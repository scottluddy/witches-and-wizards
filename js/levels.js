// Going up a Level: click the Level in the top bar to see what you need.
// The plan (what counts, how many, the gems it costs) is in data/levels.js.

// How many of one thing you have: a number, or how many are in a list
// (like the spells in your spell book). Several names are added together.
function counterOf(id) {
  if (Array.isArray(id)) return id.reduce(function (sum, one) { return sum + counterOf(one); }, 0);
  const value = player[id];
  return Array.isArray(value) ? value.length : value || 0;
}

// How many of one thing you've earned since your last Level.
function sinceLastLevel(need) {
  const start = (player.levelStart || {})[need.id] || 0;
  return Math.max(0, counterOf(need.id) - start);
}

// Gems it costs to go from your Level to the next one.
function levelUpGems() {
  return GAME_DATA.levels.gemsPerLevel * player.level;
}

function readyToLevelUp() {
  const enough = GAME_DATA.levels.needs.every(function (need) { return sinceLastLevel(need) >= need.count; });
  return enough && player.gems >= levelUpGems();
}

// One row of the pop-up: emoji, name, a bar filling up, "2 of 3", and how to earn it.
function progressRow(emoji, name, have, needed, how) {
  const row = document.createElement("div");
  row.className = "level-row" + (have >= needed ? " done" : "");
  const label = document.createElement("span");
  label.className = "level-name";
  label.textContent = emoji + " " + name;
  const bar = document.createElement("span");
  bar.className = "level-bar";
  const fill = document.createElement("span");
  fill.style.width = Math.min(100, Math.round(have / needed * 100)) + "%";
  bar.appendChild(fill);
  const count = document.createElement("span");
  count.className = "level-count";
  count.textContent = (have >= needed ? "✓ " : "") + Math.min(have, needed) + " of " + needed;
  const note = document.createElement("small");
  note.className = "level-how";
  note.textContent = how;
  row.append(label, bar, count, note);
  return row;
}

function openLevelPanel(message) {
  const next = Object.assign({}, player, { level: player.level + 1 });
  const body = openInfoPanel("🌟", levelLabel(player), message ||
    "To become " + levelLabel(next) + " you need:");
  GAME_DATA.levels.needs.forEach(function (need) {
    body.appendChild(progressRow(need.emoji, need.name, sinceLastLevel(need), need.count, need.how));
  });
  // The gems it costs (you keep earning toward it like the others).
  const gemRow = progressRow("", "Gems to pay", player.gems, levelUpGems(), "Paid when you go up. Fishing is the best way to earn gems.");
  gemRow.querySelector(".level-name").prepend(moneyIcon("gems"));
  body.appendChild(gemRow);

  // Powers: what being a higher Level does for you.
  const powers = document.createElement("p");
  powers.className = "note";
  powers.textContent = "Your powers: 🍀 " + GAME_DATA.levels.luckPerLevel * (player.level - 1) + "% luckier from your Level" +
    " (fish bite more, crystals turn up more, trolls stay asleep more). At " + levelLabel(next) + ": " +
    GAME_DATA.levels.luckPerLevel * player.level + "% luckier.";
  body.appendChild(powers);

  const button = document.createElement("button");
  button.className = "big-button";
  button.textContent = "🌟 Go up to " + levelLabel(next) + "!";
  button.disabled = !readyToLevelUp();
  button.addEventListener("click", levelUp);
  body.appendChild(button);
}

function levelUp() {
  if (!readyToLevelUp()) return;
  player.gems -= levelUpGems();
  player.level += 1;
  // Start counting again from here for the next Level.
  player.levelStart = {};
  GAME_DATA.levels.needs.forEach(function (need) { player.levelStart[need.id] = counterOf(need.id); });
  writeSave(player);
  openLevelPanel("🎉 Hooray! You are now " + levelLabel(player) + "! You feel a little luckier. For the next Level you need:");
}

document.getElementById("btn-level").addEventListener("click", function () {
  if (player && !walking) openLevelPanel();
});
