// The storyline (Scott, 2026-10-15): when you start a new game, the Head
// Witch (for a witch) or the Head Wizard (for a wizard) welcomes you and
// explains what to do, one page at a time. The words are in data/story.js.

// Your Head Witch or Head Wizard (data/adventures.js).
function storyGuide() {
  const guides = GAME_DATA.adventureGuide.guides;
  return guides.find(function (g) { return g.kind === player.kind; }) || guides[0];
}

// Fill in the player's name and whether they're a witch or a wizard.
function storyWords(text) {
  return text.replace(/NAME/g, player.playerName).replace(/KIND/g, player.kind || "witch");
}

// Page "page" of the welcome (0 is the first), with a Next button.
function tellWelcome(page) {
  const welcome = GAME_DATA.story.welcome;
  const guide = storyGuide();
  const last = page === welcome.pages.length - 1;
  const body = openInfoPanel(guideArt(guide), welcome.title, // js/adventures.js
    guide.name + ": \"" + storyWords(welcome.pages[page]) + "\"");
  const next = document.createElement("button");
  next.className = "big-button";
  next.textContent = last ? welcome.done : "Next ➜ (" + (page + 1) + " of " + welcome.pages.length + ")";
  next.addEventListener("click", function () {
    if (last) document.getElementById("info-panel").hidden = true;
    else tellWelcome(page + 1);
  });
  body.appendChild(next);
}
