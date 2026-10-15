// Earning adventures, and the Head Witch and Head Wizard who tell you about
// them (Scott, 2026-10-14). The rules and words are in data/adventures.js.
//
// You start with no adventures. Every few Skills earns room for a new one,
// and carrying an adventure's item (a Crystal Fish, 5 apples...) unlocks it. The Head Witch and Head Wizard take turns popping out at the corner
// of the screen; click them to hear where to go. Once you find whoever needs
// help, the adventure is "revealed": the Adventures pop-up (click Adventure
// at the top) shows its name and steps.

function findAdventure(id) {
  return GAME_DATA.adventureList.find(function (a) { return a.id === id; });
}

function adventureUnlocked(id) {
  return player.adventures.unlocked.indexOf(id) !== -1;
}

function adventureRevealed(id) {
  return player.adventures.revealed.indexOf(id) !== -1;
}

// Called when you find whoever needs help.
function revealAdventure(id) {
  if (!adventureUnlocked(id) || adventureRevealed(id)) return;
  player.adventures.revealed.push(id);
  writeSave(player);
}

// How many times you've finished each adventure.
function timesDone(id) {
  if (id === "pixie") return player.pixieQuest.done;
  if (id === "unicorn") return player.unicornsHelped;
  if (id === "windy") return player.windy.done;
  return 0;
}

// ---------------------------------------------------------------- earning them

// How many adventures your Skills have earned so far.
function adventuresEarned() {
  return Math.floor(skillsTotal() / GAME_DATA.adventureGuide.unlockEverySkills); // js/skills.js
}

// How many of an adventure's unlock item you're carrying (backpack, cooler
// or fruit basket).
function carryingKey(adventure) {
  const key = adventure.unlockItem;
  const carried = player.backpack.concat(player.cooler, player.basket);
  return countOf(carried, key.item) >= key.count; // js/storage.js
}

// Adventures unlocked by Skills and an item. Some (like Lost on Windy Peak)
// unlock by doing something instead ("unlockBy"), so they don't use up a
// Skills-earned place.
function skillAdventures() {
  return GAME_DATA.adventureList.filter(function (a) { return a.unlockItem; });
}

function skillAdventuresUnlocked() {
  return skillAdventures().filter(function (a) { return adventureUnlocked(a.id); }).length;
}

// If your Skills have earned another adventure and you carry its item,
// unlock it (picked at random if you carry the items for more than one).
function unlockAdventures() {
  const state = player.adventures;
  while (skillAdventuresUnlocked() < adventuresEarned()) {
    const ready = skillAdventures().filter(function (a) { return !adventureUnlocked(a.id) && carryingKey(a); });
    if (ready.length === 0) return;
    const next = ready[Math.floor(Math.random() * ready.length)];
    state.unlocked.push(next.id);
    state.waiting.push(next.id); // the Head Witch or Wizard will come and tell you
    writeSave(player);
  }
}

// What the Adventures pop-up says about getting the next one.
function nextAdventureNote() {
  const state = player.adventures;
  const locked = skillAdventures().filter(function (a) { return !adventureUnlocked(a.id); });
  if (locked.length === 0) return "";
  if (skillAdventuresUnlocked() < adventuresEarned()) {
    return " You've earned a new adventure! Carry the right thing to unlock it: " +
      locked.map(function (a) { return keyName(a); }).join(", or ") + ".";
  }
  const every = GAME_DATA.adventureGuide.unlockEverySkills;
  const toNext = every - (skillsTotal() % every);
  return " Earn " + toNext + " more Skill" + (toNext === 1 ? "" : "s") + " (🎓 at the top) for a new adventure.";
}

// "a Crystal Fish" or "5 Apples".
function keyName(adventure) {
  const key = adventure.unlockItem;
  const item = findItem(key.item) || findFish(key.item) || findFruit(key.item); // a shop item, a fish or a fruit
  return (key.count === 1 ? "a " + item.name : key.count + " " + item.name + "s");
}

// ---------------------------------------------------------------- the Head Witch and Wizard

// The one to tell you next: they take turns.
function nextGuide() {
  const guides = GAME_DATA.adventureGuide.guides;
  return guides[player.adventures.guideTurn % guides.length];
}

function guideArt(guide) {
  if (!isDrawn(guide.picture)) return guide.emoji;
  const img = document.createElement("img");
  img.src = picture(guide.picture);
  img.alt = guide.name;
  img.className = "info-picture";
  return img;
}

// Something to tell you? A new adventure, or one you haven't started yet
// (only every few minutes, so they don't nag).
function guideNews() {
  const state = player.adventures;
  if (state.waiting.length) return { id: state.waiting[0], isNew: true };
  const notStarted = state.unlocked.find(function (id) { return !adventureRevealed(id); });
  const minutes = (Date.now() - state.lastGuideAt) / 60000;
  if (notStarted && minutes >= GAME_DATA.adventureGuide.reminderMinutes) return { id: notStarted, isNew: false };
  return null;
}

// Pop out at the corner of the screen, if there's news and you're playing.
function maybeShowGuide() {
  if (!player || document.getElementById("status-bar").hidden) return;
  if (document.querySelector(".head-guide")) return; // already out
  if (!document.getElementById("info-panel").hidden) return; // busy with a pop-up
  unlockAdventures();
  const news = guideNews();
  if (!news) return;
  const guide = nextGuide();
  player.adventures.lastGuideAt = Date.now();
  player.adventures.guideTurn++;
  writeSave(player);

  const button = document.createElement("button");
  button.className = "head-guide";
  const art = guideArt(guide);
  const face = document.createElement("span");
  face.className = "head-guide-face";
  if (typeof art === "string") face.textContent = art;
  else face.appendChild(art);
  const bubble = document.createElement("span");
  bubble.className = "head-guide-bubble";
  bubble.textContent = news.isNew ? "✨ A new adventure is waiting! Click me!" : "🗺️ Don't forget your adventure! Click me.";
  button.appendChild(bubble);
  button.appendChild(face);
  button.addEventListener("click", function () {
    button.remove();
    tellAdventure(guide, news.id);
  });
  document.body.appendChild(button);
  setTimeout(function () { button.classList.add("leaving"); }, GAME_DATA.adventureGuide.staySeconds * 1000);
  setTimeout(function () { button.remove(); }, GAME_DATA.adventureGuide.staySeconds * 1000 + 800);
}

// Click the Head Witch or Wizard: where to go and what to look for.
function tellAdventure(guide, id) {
  const adventure = findAdventure(id);
  const state = player.adventures;
  state.waiting = state.waiting.filter(function (w) { return w !== id; });
  writeSave(player);
  openInfoPanel(guideArt(guide), guide.name,
    "\"Hello, " + player.playerName + "! " + adventure.hint + "\" (This adventure is saved in your Adventures list: click Adventure at the top to see it again.)");
}

setInterval(maybeShowGuide, 3000);

// ---------------------------------------------------------------- the Adventures pop-up

function openAdventuresPanel() {
  unlockAdventures();
  const state = player.adventures;
  const more = nextAdventureNote();
  const body = openInfoPanel("🗺️", "Your Adventures",
    (state.unlocked.length ? "Click an adventure to remember where to go." : "No adventures yet.") + more);
  state.unlocked.forEach(function (id) { body.appendChild(adventureCard(findAdventure(id))); });
  const again = document.createElement("button");
  again.className = "big-button secondary";
  again.textContent = "📜 Hear the welcome again";
  again.addEventListener("click", function () { tellWelcome(0); }); // js/story.js
  body.appendChild(again);
}

// One adventure: just its hint until you've found whoever needs help, then
// its name and steps too.
function adventureCard(adventure) {
  const card = document.createElement("details");
  card.className = "adventure-card";
  const title = document.createElement("summary");
  const done = timesDone(adventure.id);
  title.textContent = adventureRevealed(adventure.id)
    ? adventure.emoji + " " + adventure.name + (done ? "  ✓ done " + done + (done === 1 ? " time" : " times") : "")
    : "❓ A new adventure";
  card.appendChild(title);
  const hint = document.createElement("p");
  hint.textContent = adventure.hint;
  card.appendChild(hint);
  if (adventureRevealed(adventure.id)) {
    const steps = document.createElement("ol");
    adventure.steps.forEach(function (step) {
      const line = document.createElement("li");
      line.textContent = step;
      steps.appendChild(line);
    });
    card.appendChild(steps);
  }
  return card;
}

document.getElementById("btn-adventures").addEventListener("click", openAdventuresPanel);
