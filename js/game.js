// The game's screens and what the buttons do.

let player = loadSave();       // the saved game, or null
let chosenCharacterId = null;  // picked on the character select screen

// Show one screen and hide all the others.
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function (screen) {
    screen.hidden = screen.id !== id;
  });
  // The status bar only shows once you're playing.
  document.getElementById("status-bar").hidden = !(id === "screen-map" || id === "screen-place");
  updateStatus();
}

// Fill in the status bar: character, player's name, Grade, Adventure Points (3 stars), Crystals and Gems.
function updateStatus() {
  if (!player) return;
  const character = findCharacter(player.characterId);
  document.getElementById("status-character").textContent = character ? character.name : "?";
  document.getElementById("status-player").textContent = "(" + player.playerName + ")";
  document.getElementById("status-grade").textContent = player.grade;
  document.getElementById("status-points").textContent =
    "★".repeat(player.adventurePoints) + "☆".repeat(3 - player.adventurePoints);
  document.getElementById("status-crystals").textContent = player.crystals;
  document.getElementById("status-gems").textContent = player.gems;
}

function findCharacter(id) {
  return GAME_DATA.characters.find(function (c) { return c.id === id; });
}

// ---------------------------------------------------------------- title

function showTitle() {
  document.getElementById("confirm-new").hidden = true;
  const continueButton = document.getElementById("btn-continue");
  const note = document.getElementById("continue-note");
  continueButton.hidden = !player;
  note.hidden = !player;
  if (player) {
    const character = findCharacter(player.characterId);
    note.textContent = "Continue: " + player.playerName + " as " +
      (character ? character.name : "?") + " (Grade " + player.grade + ")";
  }
  showScreen("screen-title");
}

document.getElementById("btn-new-game").addEventListener("click", function () {
  if (player) {
    // Ask first, so a saved adventure isn't erased by accident.
    document.getElementById("confirm-new-text").textContent =
      "Start over? " + player.playerName + "'s adventure will be erased.";
    document.getElementById("confirm-new").hidden = false;
    return;
  }
  showSelect();
});

document.getElementById("btn-confirm-yes").addEventListener("click", function () {
  clearSave();
  player = null;
  showSelect();
});

document.getElementById("btn-confirm-no").addEventListener("click", function () {
  document.getElementById("confirm-new").hidden = true;
});

document.getElementById("btn-continue").addEventListener("click", function () {
  goTo(player.at);
});

// ---------------------------------------------------------------- character select

function showSelect() {
  chosenCharacterId = null;
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

function updateStartButton() {
  const name = document.getElementById("player-name").value.trim();
  document.getElementById("btn-start").disabled = !(chosenCharacterId && name);
}

document.getElementById("player-name").addEventListener("input", updateStartButton);

document.getElementById("player-name").addEventListener("keydown", function (event) {
  if (event.key === "Enter") document.getElementById("btn-start").click();
});

document.getElementById("btn-start").addEventListener("click", function () {
  const name = document.getElementById("player-name").value.trim();
  if (!chosenCharacterId || !name) return;
  player = newPlayer(name, chosenCharacterId);
  writeSave(player);
  goTo(player.at);
});

document.getElementById("btn-select-back").addEventListener("click", showTitle);

// Reload the page, so a game that was just updated shows its newest version.
document.getElementById("btn-refresh").addEventListener("click", function () {
  location.reload();
});

// ---------------------------------------------------------------- start

document.getElementById("load-error").hidden = true; // the code loaded fine
showTitle();
