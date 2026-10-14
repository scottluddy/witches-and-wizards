// The game's screens and what the buttons do.

let player = null;             // the game being played
let chosenCharacterId = null;  // picked on the character select screen
let chosenKind = null;         // "witch" or "wizard", picked on the same screen

// Show one screen and hide all the others.
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function (screen) {
    screen.hidden = screen.id !== id;
  });
  // The status bar only shows once you're playing.
  document.getElementById("status-bar").hidden = !(id === "screen-map" || id === "screen-place");
  updateStatus();
}

// Fill in the status bar: character, player's name, Level, Adventure Points (3 stars), Crystals, Gems, Chore Points and Hunger.
function updateStatus() {
  showHolding(); // the apple in your hand, if any (js/unicorns.js)
  if (!player) return;
  const character = findCharacter(player.characterId);
  document.getElementById("status-character").textContent = character ? character.name : "?";
  document.getElementById("status-player").textContent = "(" + player.playerName + ")";
  document.getElementById("status-level").textContent = levelLabel(player);
  // Stars for the Adventure Points earned toward the next Level (js/levels.js).
  const adventure = GAME_DATA.levels.needs.find(function (need) { return need.id === "adventurePoints"; });
  const earned = adventure ? sinceLastLevel(adventure) : player.adventurePoints;
  const needed = adventure ? adventure.count : 3;
  document.getElementById("status-points").textContent =
    "★".repeat(earned) + "☆".repeat(Math.max(0, needed - earned));
  showLuck(); // the Luck Potion's time left (js/luck.js)
  document.getElementById("status-crystals").textContent = player.crystals;
  document.getElementById("status-gems").textContent = player.gems;
  document.getElementById("status-chores").textContent = player.chorePoints;
  document.getElementById("status-skills").textContent = skillsTotal(); // js/skills.js
  document.getElementById("status-bonding").textContent = player.bondingPoints;
  document.getElementById("status-hunger").textContent = player.hunger + "/" + GAME_DATA.hunger.max;
  // How many things each carried bag holds, as a small number on its button.
  ["backpack", "cooler", "bucket", "satchel", "basket"].forEach(function (bag) {
    document.getElementById("count-" + bag).textContent = player[bag].length;
  });
}

// The shared pop-up (marshmallow machine, crafting table, unicorn): a big
// picture or emoji, a title and a message. Returns the empty area below the
// message, for buttons and lists.
// "art" is an emoji, or a picture (an <img>) like the girls' unicorn drawing.
function openInfoPanel(art, title, message) {
  const artBox = document.getElementById("info-art");
  if (typeof art === "string") artBox.textContent = art;
  else artBox.replaceChildren(art);
  document.getElementById("info-title").textContent = title;
  document.getElementById("info-message").textContent = message || "";
  const body = document.getElementById("info-body");
  body.innerHTML = "";
  document.getElementById("info-panel").hidden = false;
  return body;
}

// The girls' fun picture for a finished adventure of this kind
// (data/adventures.js), or "fallback" (an emoji) if there isn't one.
function celebrationArt(kind, fallback) {
  const celebration = GAME_DATA.celebrations[kind];
  if (!celebration || !isDrawn(celebration.picture)) return fallback;
  const img = document.createElement("img");
  img.className = "celebration";
  img.src = picture(celebration.picture);
  img.alt = celebration.name;
  return img;
}

document.getElementById("btn-info-close").addEventListener("click", function () {
  document.getElementById("info-panel").hidden = true;
});

function findCharacter(id) {
  return GAME_DATA.characters.find(function (c) { return c.id === id; });
}

// ---------------------------------------------------------------- title

function showTitle() {
  player = null;
  document.getElementById("confirm-new").hidden = true;
  fillSavedGames();
  showScreen("screen-title");
}

// The dropdown of saved games, newest first, like
// "Scott as Rosy, Witch Level 1 (Oct 10, 3:40 PM)".
function fillSavedGames() {
  const saves = loadSaves();
  const list = document.getElementById("saved-games");
  list.innerHTML = "";
  saves.forEach(function (save) {
    const option = document.createElement("option");
    option.value = save.id;
    option.textContent = saveName(save) + " (" + whenSaved(save) + ")";
    list.appendChild(option);
  });
  document.getElementById("continue-box").hidden = saves.length === 0;
}

function saveName(save) {
  const character = findCharacter(save.characterId);
  return save.playerName + " as " + (character ? character.name : "?") + ", " + levelLabel(save);
}

function whenSaved(save) {
  return new Date(save.savedAt).toLocaleString([], {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
  });
}

document.getElementById("btn-new-game").addEventListener("click", function () {
  const saves = loadSaves();
  if (saves.length >= MAX_SAVES) {
    // Ask first: the list is full, so the oldest game will be removed.
    const oldest = saves[saves.length - 1];
    document.getElementById("confirm-new-text").textContent = "Only " + MAX_SAVES +
      " games can be saved. Starting a new one removes the oldest: " + saveName(oldest) + ".";
    document.getElementById("confirm-new").hidden = false;
    return;
  }
  showSelect();
});

document.getElementById("btn-confirm-yes").addEventListener("click", showSelect);

document.getElementById("btn-confirm-no").addEventListener("click", function () {
  document.getElementById("confirm-new").hidden = true;
});

document.getElementById("btn-continue").addEventListener("click", function () {
  const id = document.getElementById("saved-games").value;
  player = loadSaves().find(function (save) { return save.id === id; });
  if (!player) return;
  writeSave(player); // moves it to the top of the list
  goTo(player.at);
});

// ---------------------------------------------------------------- character select

function showSelect() {
  chosenCharacterId = null;
  chooseKind(null);
  document.getElementById("player-name").value = "";
  buildCharacterCards();
  updateStartButton();
  showScreen("screen-select");
}

function buildCharacterCards() {
  const list = document.getElementById("character-list");
  list.innerHTML = "";
  GAME_DATA.characters.forEach(function (character) {
    const card = document.createElement("button");
    card.className = "character-card";
    card.dataset.id = character.id;

    const img = document.createElement("img");
    img.src = characterPicture(character);
    img.alt = character.name;

    const name = document.createElement("span");
    name.className = "character-name";
    name.textContent = character.name;

    const about = document.createElement("span");
    about.className = "character-about";
    about.textContent = character.description;

    card.append(img, name, about);
    card.addEventListener("click", function () { chooseCharacter(character.id); });
    list.appendChild(card);
  });
}

function chooseCharacter(id) {
  chosenCharacterId = id;
  document.querySelectorAll(".character-card").forEach(function (card) {
    card.classList.toggle("chosen", card.dataset.id === id);
  });
  updateStartButton();
  document.getElementById("player-name").focus();
}

// Witch or Wizard.
function chooseKind(kind) {
  chosenKind = kind;
  document.querySelectorAll(".kind-button").forEach(function (button) {
    button.classList.toggle("chosen", button.dataset.kind === kind);
  });
  updateStartButton();
}

document.querySelectorAll(".kind-button").forEach(function (button) {
  button.addEventListener("click", function () { chooseKind(button.dataset.kind); });
});

function updateStartButton() {
  const name = document.getElementById("player-name").value.trim();
  document.getElementById("btn-start").disabled = !(chosenCharacterId && chosenKind && name);
}

document.getElementById("player-name").addEventListener("input", updateStartButton);

document.getElementById("player-name").addEventListener("keydown", function (event) {
  if (event.key === "Enter") document.getElementById("btn-start").click();
});

document.getElementById("btn-start").addEventListener("click", function () {
  const name = document.getElementById("player-name").value.trim();
  if (!chosenCharacterId || !chosenKind || !name) return;
  player = newPlayer(name, chosenCharacterId, chosenKind);
  writeSave(player);
  goTo(player.at);
});

document.getElementById("btn-select-back").addEventListener("click", showTitle);

// Save this game and go back to the title screen, to pick another one.
document.getElementById("btn-switch-game").addEventListener("click", function () {
  if (walking) return;
  stopFishing();   // js/fishing.js
  stopDigging();   // js/digging.js
  stopSweeping();  // js/chores.js
  document.querySelectorAll(".overlay").forEach(function (panel) { panel.hidden = true; });
  writeSave(player);
  showTitle();
});

// Reload the page, so a game that was just updated shows its newest version.
document.getElementById("btn-refresh").addEventListener("click", function () {
  location.reload();
});

// ---------------------------------------------------------------- start

document.getElementById("load-error").hidden = true; // the code loaded fine
showTitle();
