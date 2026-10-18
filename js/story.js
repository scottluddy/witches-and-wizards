// The storyline (Scott, 2026-10-15): when you start a new game, the Head
// Witch (for a witch) or the Head Wizard (for a wizard) welcomes you and
// explains what to do, one page at a time. The words are in data/story.js.

// Your Head Witch or Head Wizard (data/adventures.js).
function storyGuide() {
  const guides = GAME_DATA.adventureGuide.guides;
  return guides.find(function (g) { return g.kind === player.kind; }) || guides[0];
}

// Fill in the player's name.
function storyWords(text) {
  return text.replace(/NAME/g, player.playerName);
}

// Page "page" of the welcome (0 is the first), with a Next button. It's
// shown in big story letters (the "story" class in css/style.css).
function tellWelcome(page) {
  const welcome = GAME_DATA.story.welcome;
  const words = welcome.pages[page];
  const last = page === welcome.pages.length - 1;
  const body = openInfoPanel(guideArt(storyGuide()), words.title, storyWords(words.words)); // js/adventures.js
  document.getElementById("info-panel").classList.add("story");
  document.getElementById("btn-info-close").textContent = "Skip"; // for players who've heard it before
  const next = document.createElement("button");
  next.className = "big-button";
  next.textContent = last ? storyWords(welcome.done) : "Next ➜";
  next.addEventListener("click", function () {
    if (last) document.getElementById("info-panel").hidden = true;
    else tellWelcome(page + 1);
  });
  body.appendChild(next);
}
