// Test games (Scott, 2026-10-15): type the secret code from data/testing.js
// as your name and the new game starts with lots of everything, plus a
// 🧪 Test button in the top bar to get more and skip waiting. It's for
// trying out new things quickly; turn it off ("on": false) before sharing.

function isTestCode(name) {
  const testing = GAME_DATA.testing;
  return testing.on && name.trim().toLowerCase() === testing.code.toLowerCase();
}

function isTester() {
  return GAME_DATA.testing.on && !!player && !!player.tester;
}

// A new game made with the code: called "Tester" and given everything in "start".
function makeTester(newPlayer) {
  const start = GAME_DATA.testing.start;
  newPlayer.tester = true;
  newPlayer.playerName = GAME_DATA.testing.name;
  newPlayer.gems += start.gems;
  newPlayer.crystals += start.crystals;
  fillTestBags(newPlayer);
  return newPlayer;
}

// Put the "start" things in each bag again (fresh fish for a Crystal Fish, etc.).
function fillTestBags(who) {
  const start = GAME_DATA.testing.start;
  ["backpack", "cooler", "basket", "satchel", "bucket"].forEach(function (bag) {
    (start[bag] || []).forEach(function (id) {
      // things that aren't supplies are one of each, so don't add a second
      if (bag === "backpack" && who.backpack.indexOf(id) !== -1) return;
      who[bag].push(id);
    });
  });
}

// The 🧪 Test button only shows in a test game.
function showTestButton() {
  document.getElementById("btn-test").hidden = !isTester();
}

function openTestPanel(message) {
  const topUp = GAME_DATA.testing.topUp;
  const body = openInfoPanel("🧪", "Test Tools", message || "Only test games have these.");
  const row = document.createElement("div");
  row.className = "button-row test-tools";
  testButton(row, "💰 +" + topUp.gems + " Gems", function () { player.gems += topUp.gems; return "Gems: " + player.gems; });
  testButton(row, "💎 +" + topUp.crystals + " Crystals", function () { player.crystals += topUp.crystals; return "Crystals: " + player.crystals; });
  testButton(row, "🎓 +" + topUp.skills + " Skills", addTestSkills);
  testButton(row, "🎒 Refill the bags", function () { fillTestBags(player); return "The bags have their test things again."; });
  testButton(row, "🗺️ Unlock every adventure", unlockEveryAdventure);
  testButton(row, "⏩ Skip the waiting", skipWaiting);
  testButton(row, "🍽️ Not hungry", function () { player.hunger = 0; return "Hunger: 0"; });
  testButton(row, "📜 Hear the welcome", function () { tellWelcome(0); return null; });
  body.appendChild(row);
  body.appendChild(goAnywhere());
}

// A button that does something, saves, and says what it did.
function testButton(row, label, action) {
  const button = document.createElement("button");
  button.className = "big-button secondary";
  button.textContent = label;
  button.addEventListener("click", function () {
    const said = action();
    writeSave(player);
    if (said !== null) openTestPanel("✓ " + said);
  });
  row.appendChild(button);
}

// The next Levels of skills that aren't mastered yet.
function addTestSkills() {
  for (let i = 0; i < GAME_DATA.testing.topUp.skills; i++) {
    const skill = GAME_DATA.skills.list.find(function (s) { return countOf(player.skills, s.id) < s.levels; }); // js/storage.js
    if (skill) player.skills.push(skill.id);
  }
  return "Skills: " + skillsTotal();
}

function unlockEveryAdventure() {
  GAME_DATA.adventureList.forEach(function (a) {
    if (adventureUnlocked(a.id)) return;
    player.adventures.unlocked.push(a.id);
    player.adventures.waiting.push(a.id);
  });
  return "Every adventure is unlocked. The Head Witch or Wizard will pop out to tell you.";
}

// No more waiting for skill tests, pet care, fruit, bee stings or the Head Witch.
function skipWaiting() {
  player.skillWait = {};
  Object.keys(player.lastCare).forEach(function (kind) { player.lastCare[kind] = {}; });
  player.trees = {};
  player.stungAt = 0;
  player.adventures.lastGuideAt = 0;
  return "No more waiting.";
}

// A list of every map and place, to jump straight there.
function goAnywhere() {
  const box = document.createElement("p");
  const list = document.createElement("select");
  GAME_DATA.places.filter(function (p) { return p.type === "map" || p.type === "place"; }).forEach(function (p) {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = p.name + (p.in ? " (" + findPlace(p.in).name + ")" : "");
    list.appendChild(option);
  });
  const go = document.createElement("button");
  go.className = "big-button";
  go.textContent = "🚀 Go there";
  go.addEventListener("click", function () {
    document.getElementById("info-panel").hidden = true;
    goTo(list.value);
  });
  box.append("Go anywhere: ", list, " ", go);
  return box;
}

document.getElementById("btn-test").addEventListener("click", function () { openTestPanel(); });
