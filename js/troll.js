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
  const hidden = isInvisible(); // it can't see you to steal from you (js/potions.js)
  const takes = asleep || hidden ? 0 : Math.min(wants, player.crystals);
  player.crystals -= takes;
  writeSave(player);

  let message;
  if (asleep) {
    message = "You nearly woke a sleeping troll " + whereText + "! It snorts and rolls over... and keeps on snoring. 🍀 Lucky you!";
  } else if (hidden) {
    message = "You woke a sleeping troll " + whereText + "! It sniffs and stares... right through you. 🫥 You're invisible! It scratches its head and stomps back to sleep.";
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
  offerLightning(takes);
}

// ---------------------------------------------------------------- the Lightning Wand (Scott, 2026-10-18)

// If the troll took something and you carry the Lightning Wand, a button to
// zap it: the troll drops what it took and runs away. (js/wands.js)
function offerLightning(takes) {
  const old = document.getElementById("btn-troll-zap");
  if (old) old.remove();
  if (takes === 0 || !carriesWand("lightning")) return;
  const zap = document.createElement("button");
  zap.id = "btn-troll-zap";
  zap.className = "big-button";
  const resting = wandRestLeft("lightning");
  zap.disabled = resting > 0;
  zap.textContent = resting ? "⚡ Your Lightning Wand is resting (" + minutesAndSeconds(resting) + ")" : "⚡ Zap it with the Lightning Wand!";
  zap.addEventListener("click", function () {
    zap.remove();
    const troll = document.querySelector("#troll-art img, #troll-art .emoji");
    useWand("lightning", troll, function () { trollDropsIt(takes, troll); });
  });
  document.querySelector("#troll-panel .button-row").prepend(zap);
}

// Zapped! The troll jumps, drops the Crystals (they fall back to you) and runs off.
function trollDropsIt(takes, troll) {
  player.crystals += takes;
  writeSave(player);
  const art = document.getElementById("troll-art");
  for (let i = 0; i < takes; i++) {
    const crystal = document.createElement("span");
    crystal.className = "troll-drop";
    crystal.textContent = "💎";
    crystal.style.left = 40 + i * 12 + "%";
    art.appendChild(crystal);
  }
  if (troll) troll.classList.add("troll-runs");
  document.getElementById("troll-title").textContent = "⚡ Zap! The troll ran away!";
  document.getElementById("troll-message").textContent =
    "The lightning made the troll jump right out of its boots! It dropped your " + (takes === 1 ? "Crystal" : takes + " Crystals") +
    " and ran off as fast as it could. 💎 You got " + (takes === 1 ? "it" : "them") + " back!";
  document.getElementById("btn-troll-close").textContent = "Hooray!";
}

document.getElementById("btn-troll-close").addEventListener("click", function () {
  document.getElementById("troll-panel").hidden = true;
  document.getElementById("btn-troll-close").textContent = "Run away!";
});
