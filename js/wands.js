// Wands from the Campus Store (Scott, 2026-10-18): the Healing Wand helps
// brew spells (js/spells.js), the Lightning Wand scares off a troll that
// stole your Crystals (js/troll.js), the Music Wand fixes wrong notes in a
// Piano test (js/music.js). The numbers are in data/wands.js.
//
// A wand works when it's in your backpack and has rested since its last use.
// Using it shows the wand big in the middle of the screen with its little
// picture (the girls drew it next to each wand) flying out of the tip.

function wandRules(kind) {
  return GAME_DATA.wands[kind];
}

// Seconds until the wand works again (0 = ready).
function wandRestLeft(kind) {
  const until = player.wandRest[kind] || 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

function carriesWand(kind) {
  return player.backpack.indexOf(wandRules(kind).id) !== -1;
}

function wandReady(kind) {
  return carriesWand(kind) && wandRestLeft(kind) === 0;
}

// Use the wand: it starts resting, the magic flies out (towards "target", an
// element on screen, if given), then "done" runs.
function useWand(kind, target, done) {
  player.wandRest[kind] = Date.now() + wandRules(kind).restMinutes * 60000;
  writeSave(player);
  waveWand(kind, target, done);
}

// The wand pops up big, and its magic picture flies out of the tip.
function waveWand(kind, target, done) {
  const rules = wandRules(kind);
  const show = document.createElement("div");
  show.className = "wand-wave";
  const wand = wandPicture(rules.id, findItem(rules.id).emoji);
  wand.classList.add("wand-big");
  const magic = wandPicture(rules.magic, rules.emoji);
  magic.classList.add("wand-magic");
  show.append(wand, magic);
  document.body.appendChild(show);
  setTimeout(function () {
    // Fly to the target, or just up and away.
    const from = magic.getBoundingClientRect();
    let dx = 0, dy = -window.innerHeight * 0.35;
    if (target && target.isConnected) {
      const to = target.getBoundingClientRect();
      dx = to.left + to.width / 2 - (from.left + from.width / 2);
      dy = to.top + to.height / 2 - (from.top + from.height / 2);
    }
    magic.style.transform = "translate(" + dx + "px, " + dy + "px) scale(1.3)";
    magic.classList.add("flying");
  }, 450);
  setTimeout(function () {
    show.remove();
    if (done) done();
  }, 1700);
}

// The girls' drawing, or the emoji until it's drawn.
function wandPicture(id, emoji) {
  if (isDrawn(id)) {
    const img = document.createElement("img");
    img.src = picture(id);
    img.alt = "";
    return img;
  }
  const span = document.createElement("span");
  span.className = "emoji";
  span.textContent = emoji;
  return span;
}

// Which wand (its kind) an item is, or null.
function wandKindOf(item) {
  return Object.keys(GAME_DATA.wands).find(function (kind) { return GAME_DATA.wands[kind].id === item.id; }) || null;
}

// A line on the wand in the backpack: ready, or how long it's still resting.
function wandNote(item) {
  const kind = wandKindOf(item);
  const note = document.createElement("p");
  note.className = "note";
  const left = wandRestLeft(kind);
  note.textContent = left ? "😴 Resting: works again in " + minutesAndSeconds(left) : "✨ Ready to use"; // js/skills.js
  return note;
}
