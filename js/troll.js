// The troll: woken by digging for crystals (js/digging.js, js/mining.js).
// It shows a big pop-up and steals some Crystals.

// The troll's picture: the girls' drawing once there is one, else the photo,
// else the emoji (the photo isn't on the public website).
function trollArt() {
  const troll = GAME_DATA.troll;
  const emoji = document.createElement("span");
  emoji.className = "emoji";
  emoji.textContent = troll.emoji;
  if (isDrawn("troll")) {
    const img = document.createElement("img");
    img.src = picture("troll");
    return img;
  }
  const img = document.createElement("img");
  img.src = troll.photo;
  img.alt = "A troll!";
  img.addEventListener("error", function () { img.replaceWith(emoji); });
  return img;
}

// Wake the troll: it takes 1 to 5 Crystals (but only what you have).
function wakeTroll(whereText) {
  const range = GAME_DATA.troll.steals;
  const wants = randomBetween(range[0], range[1]); // js/digging.js
  const takes = Math.min(wants, player.crystals);
  player.crystals -= takes;
  writeSave(player);

  let message;
  if (takes === 0) {
    message = "You woke a sleeping troll " + whereText + "! It grabs for your Crystals, but your pockets are empty. It grumbles and stomps back to sleep.";
  } else {
    message = "You woke a sleeping troll " + whereText + "! It grabs " + takes +
      (takes === 1 ? " Crystal and stomps off with it." : " Crystals and stomps off with them.") + " Be careful where you dig!";
  }
  const art = document.getElementById("troll-art");
  art.innerHTML = "";
  art.appendChild(trollArt());
  document.getElementById("troll-title").textContent = takes === 0 ? "A troll woke up!" : "A troll stole " + takes + (takes === 1 ? " Crystal!" : " Crystals!");
  document.getElementById("troll-message").textContent = message;
  document.getElementById("troll-panel").hidden = false;
}

document.getElementById("btn-troll-close").addEventListener("click", function () {
  document.getElementById("troll-panel").hidden = true;
});
