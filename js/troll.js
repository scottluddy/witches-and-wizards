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

// Wake the troll: it takes a few Crystals ("steals" in data/troll.js, but only what you have).
// If you're lucky (js/luck.js), it may stay asleep and take nothing.
function wakeTroll(whereText) {
  const range = GAME_DATA.troll.steals;
  const wants = randomBetween(range[0], range[1]); // js/digging.js
  const asleep = luckKeepsTrollAsleep();
  const takes = asleep ? 0 : Math.min(wants, player.crystals);
  player.crystals -= takes;
  writeSave(player);

  let message;
  if (asleep) {
    message = "You nearly woke a sleeping troll " + whereText + "! It snorts and rolls over... and keeps on snoring. 🍀 Lucky you!";
  } else if (takes === 0) {
    message = "You woke a sleeping troll " + whereText + "! It grabs for your Crystals, but your pockets are empty. It grumbles and stomps back to sleep.";
  } else {
    message = "You woke a sleeping troll " + whereText + "! It grabs " + takes +
      (takes === 1 ? " Crystal and stomps off with it." : " Crystals and stomps off with them.") + " Be careful where you dig!";
  }
  const art = document.getElementById("troll-art");
  art.innerHTML = "";
  art.appendChild(trollArt());
  document.getElementById("troll-title").textContent = asleep ? "Shh! A sleeping troll!" : takes === 0 ? "A troll woke up!" : "A troll stole " + takes + (takes === 1 ? " Crystal!" : " Crystals!");
  document.getElementById("troll-message").textContent = message;
  document.getElementById("troll-panel").hidden = false;
}

document.getElementById("btn-troll-close").addEventListener("click", function () {
  document.getElementById("troll-panel").hidden = true;
});
