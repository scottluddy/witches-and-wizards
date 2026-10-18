// Tester Mode (Scott, 2026-10-15): the small 🧪 button at the far top left
// asks for the PIN, then keeps a copy of this game and fills the bags with
// lots of everything (data/testing.js). Leaving Tester Mode puts the copy
// back, so nothing from testing stays. The copy is kept in the save
// ("testerCopy"), so closing the page while testing loses nothing.

function isTester() {
  return GAME_DATA.testing.on && !!player && !!player.testerCopy;
}

function enterTesterMode() {
  const copy = JSON.parse(JSON.stringify(player)); // everything exactly as it is now
  const start = GAME_DATA.testing.start;
  player.testerCopy = copy;
  player.gems += start.gems;
  player.crystals += start.crystals;
  player.hunger = start.hunger;
  fillTestBags(player);
  player.falconryDone = GAME_DATA.items.filter(function (i) { return i.id.indexOf("pet_owl") === 0; }).map(function (i) { return i.id; }); // owls can fly at Windy Peak
  if (start.everySpell) GAME_DATA.spells.forEach(function (spell) {
    if (player.spells.indexOf(spell.id) === -1) player.spells.push(spell.id);
  });
  writeSave(player);
  openTestPanel("🧪 You're in Tester Mode! Your bags are full of test things. Click 🧪 again to leave: everything goes back to how it was.");
}

// Put the copy back: the game is exactly as it was before Tester Mode.
function leaveTesterMode() {
  player = fillIn(player.testerCopy) || player.testerCopy; // fillIn: in case the save changed shape since
  writeSave(player);
  document.getElementById("info-panel").hidden = true;
  goTo(player.at);
}

// Put the "start" things in each bag (every potion and pet too, if asked).
function fillTestBags(who) {
  const start = GAME_DATA.testing.start;
  const backpack = (start.backpack || []).slice();
  GAME_DATA.items.forEach(function (item) {
    if (start.everyPotion && item.id.indexOf("potion_") === 0) backpack.push(item.id);
    if (start.everyPet && (item.id.indexOf("pet_") === 0 || item.pet)) backpack.push(item.id);
  });
  backpack.forEach(function (id) {
    // things that aren't supplies are one of each, so don't add a second
    if (who.backpack.indexOf(id) === -1) who.backpack.push(id);
  });
  // potions with sips start full again
  if (who.pixieQuest) who.pixieQuest.sips = potionSips(); // js/pixie.js
  if (who.windy) who.windy.sips = 0;                      // 0 = a new Night Vision Potion (js/windy.js)
  ["cooler", "basket", "satchel", "bucket"].forEach(function (bag) {
    (start[bag] || []).forEach(function (id) { who[bag].push(id); });
  });
}

// ---------------------------------------------------------------- the PIN

// A scramble of a PIN: the same PIN always gives the same number, but the
// number doesn't show what the PIN is.
function pinHash(pin) {
  let number = 7;
  for (const digit of String(pin)) number = (number * 31 + digit.charCodeAt(0)) % 1000003;
  return number;
}

// Ask for the PIN; "onRight" runs once it's typed right (Scott, 2026-10-15).
function askTestPin(onRight, message) {
  const body = openInfoPanel("🔒", "Tester Mode", message || "Type the secret code to start Tester Mode.");
  const box = document.createElement("input");
  box.type = "password";
  box.inputMode = "numeric";
  box.maxLength = 8;
  box.className = "pin-box";
  const open = document.createElement("button");
  open.className = "big-button";
  open.textContent = "🔓 Open";
  const check = function () {
    if (pinHash(box.value.trim()) !== GAME_DATA.testing.pinHash) return askTestPin(onRight, "❌ That's not the code. Try again.");
    document.getElementById("info-panel").hidden = true;
    onRight();
  };
  open.addEventListener("click", check);
  box.addEventListener("keydown", function (event) { if (event.key === "Enter") check(); });
  body.append(box, " ", open);
  box.focus();
}

// ---------------------------------------------------------------- the Test button

// The small 🧪 button: hidden when Tester Mode is turned off, and lit up
// while you're testing.
function showTestButton() {
  const button = document.getElementById("btn-test");
  button.hidden = !GAME_DATA.testing.on;
  button.classList.toggle("testing", isTester());
  button.title = isTester() ? "Tester Mode: Test Tools, or leave Tester Mode" : "Tester Mode";
}

function openTestPanel(message) {
  const start = GAME_DATA.testing.start;
  const body = openInfoPanel("🧪", "Tester Mode", message || "Everything from testing goes away when you leave Tester Mode.");
  const leave = document.createElement("button");
  leave.className = "big-button";
  leave.textContent = "🚪 Leave Tester Mode (put everything back)";
  leave.addEventListener("click", leaveTesterMode);
  body.appendChild(leave);
  const row = document.createElement("div");
  row.className = "button-row test-tools";
  testButton(row, "💰 Refill Gems and Crystals", function () {
    player.gems = Math.max(player.gems, start.gems); player.crystals = Math.max(player.crystals, start.crystals);
    return "Gems: " + player.gems + ", Crystals: " + player.crystals;
  });
  testButton(row, "🎓 +" + GAME_DATA.testing.topUp.skills + " Skills", addTestSkills);
  testButton(row, "🎒 Refill the bags", function () { fillTestBags(player); return "The bags have their test things again."; });
  testButton(row, "📖 Empty the spell book", function () { player.spells = []; return "No spells now, so you can try brewing one."; });
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
  if (player.windy.stage === "") startWindyRescue(); // the owl has already spotted the little WIT (js/windy.js)
  return "Every adventure is unlocked. The Head Witch or Wizard will pop out to tell you.";
}

// No more waiting for skill tests, pet care, fruit, bee stings, wands or the Head Witch.
function skipWaiting() {
  player.skillWait = {};
  Object.keys(player.lastCare).forEach(function (kind) { player.lastCare[kind] = {}; });
  player.trees = {};
  player.stungAt = 0;
  player.wandRest = {}; // wands ready again (js/wands.js)
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

document.getElementById("btn-test").addEventListener("click", function () {
  if (isTester()) openTestPanel();
  else askTestPin(enterTesterMode);
});
