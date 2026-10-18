// Skills and their Levels (1 to 10). The rules are in data/skills.js.
//
// player.skills is a list with one entry for every skill Level gained, so
// ["piano", "archery", "archery"] means Piano Level 1 and Archery Level 2.
// That way going up a Level (js/levels.js) counts every skill Level you gain.

function skillLevel(skill) {
  return player.skills.filter(function (s) { return s === skill; }).length;
}

function findSkill(skill) {
  return GAME_DATA.skills.list.find(function (s) { return s.id === skill; });
}

function skillName(skill) {
  return findSkill(skill).name;
}

// How many Levels this skill has (Archery 10, Piano 5...).
function topLevel(skill) {
  return findSkill(skill).levels;
}

function isMastered(skill) {
  return skillLevel(skill) >= topLevel(skill);
}

// Your Skills total in the top bar: every skill Level plus every spell.
function skillsTotal() {
  return player.skills.length + player.spells.length;
}

// How long to wait after reaching this Level: 3 minutes after Level 1,
// growing to 5 minutes after the Level before the top (data/skills.js).
function skillWaitMinutes(skill, level) {
  const wait = GAME_DATA.skills.waitMinutes;
  const steps = Math.max(1, topLevel(skill) - 2);   // Levels 1 to (top - 1) have a wait after them
  return wait.from + (wait.to - wait.from) * Math.min(1, (level - 1) / steps);
}

// Pass a test: one more Level, then the wait before the next test starts.
// The Wisdom Potion (js/potions.js) makes that wait shorter.
function gainSkillLevel(skill) {
  player.skills.push(skill);
  const wise = isWise() ? GAME_DATA.timedPotions.wisdom.waitShare : 1;
  player.skillWait[skill] = Date.now() + skillWaitMinutes(skill, skillLevel(skill)) * wise * 60000;
  writeSave(player);
  return skillLevel(skill);
}

// Seconds until the next test for this skill (0 = ready now).
function skillWaitLeft(skill) {
  const until = player.skillWait[skill] || 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

// "3:05"
function minutesAndSeconds(seconds) {
  const secs = seconds % 60;
  return Math.floor(seconds / 60) + ":" + (secs < 10 ? "0" : "") + secs;
}

// The general rule: does the player have the skill Level a place or spot needs?
function meetsSkill(need) {
  return !need || skillLevel(need.skill) >= need.level;
}

function needsSkillText(need) {
  return "🔒 You need " + skillName(need.skill) + " Level " + need.level + " for this. Learn it at the Wizard School!";
}

// "Your next test is ready in 3 minutes." or "You've mastered Archery!"
function nextTestText(skill) {
  if (isMastered(skill)) return " You've mastered " + skillName(skill) + "!";
  return " Your next test is ready in " + Math.round(skillWaitLeft(skill) / 60) + " minutes.";
}

// ---------------------------------------------------------------- the spots

// What a skill test spot says after its name: its Level, or how long until
// the next test, or that it's mastered.
function skillSpotNote(skill) {
  if (isMastered(skill)) return " ⭐ Mastered!";
  const wait = skillWaitLeft(skill);
  const level = skillLevel(skill);
  return (level ? " (Level " + level + ")" : "") + (wait ? " ⏳ " + minutesAndSeconds(wait) : "");
}

// Is this skill test greyed out right now (waiting, or nothing left to learn)?
function skillLocked(skill) {
  return isMastered(skill) || skillWaitLeft(skill) > 0;
}

// Spots with "practice": true (Piano Lessons) stay open while you wait, so
// you can still practise; only their test button waits.
function spotGreyedOut(place) {
  return !place.practice && skillLocked(place.skill);
}

// Greyed-out spots: skill tests that are waiting, and spots needing a skill Level.
function markSkillSpot(button, place) {
  if (place.skill) {
    const label = button.querySelector(".label");
    button.dataset.skill = place.skill;
    button.dataset.name = label.textContent; // the name without the Level, for the countdown below
    label.textContent += skillSpotNote(place.skill);
    button.classList.toggle("locked", spotGreyedOut(place));
  }
  if (!meetsSkill(place.needsSkill)) {
    button.classList.add("locked");
    button.title = needsSkillText(place.needsSkill);
  }
}

// Clicking a greyed-out spot just says why. Returns true if it was locked.
function skillSpotLocked(place) {
  const say = document.getElementById("place-description");
  if (!meetsSkill(place.needsSkill)) {
    say.textContent = needsSkillText(place.needsSkill);
    return true;
  }
  if (!place.skill || place.practice) return false;
  if (isMastered(place.skill)) {
    say.textContent = "⭐ You've mastered " + skillName(place.skill) + ": Level " + topLevel(place.skill) + "! There's nothing left to learn.";
    return true;
  }
  const wait = skillWaitLeft(place.skill);
  if (wait) {
    say.textContent = "⏳ Rest a little! Your next " + skillName(place.skill) + " test is ready in " + minutesAndSeconds(wait) + ".";
    return true;
  }
  return false;
}

// Every second, keep the skill spots' countdowns up to date.
setInterval(function () {
  if (!player) return;
  document.querySelectorAll(".spot[data-skill]").forEach(function (button) {
    const place = findPlace(button.dataset.id);
    button.querySelector(".label").textContent = button.dataset.name + skillSpotNote(place.skill);
    button.classList.toggle("locked", spotGreyedOut(place));
  });
}, 1000);

// ---------------------------------------------------------------- the Skills pop-up

// 🎓 Skills in the top bar: click it to see every skill and its Level.
function openSkillsPanel() {
  const body = openInfoPanel("🎓", "Skills: " + skillsTotal(),
    "Every skill Level and every spell adds 1 to your Skills. Learn skills at the Wizard School. Going up a Level needs " +
    skillsNeeded() + " more Skills.");
  GAME_DATA.skills.list.forEach(function (skill) {
    const wait = skillWaitLeft(skill.id);
    const how = isMastered(skill.id) ? "⭐ Mastered!"
      : wait ? "⏳ Next test in " + minutesAndSeconds(wait)
      : skillLevel(skill.id) ? "Next test ready now" : "Not started yet";
    body.appendChild(progressRow(skill.emoji, skill.name, skillLevel(skill.id), skill.levels, how)); // js/levels.js
  });
  const spells = document.createElement("p");
  spells.className = "note";
  spells.textContent = "📖 Spells: " + (player.spells.length
    ? player.spells.map(spellName).join(", ") + " (" + player.spells.length + ")" // js/spells.js
    : "none yet. Make one at the Crafting Table in the Crafting Cabin.");
  body.appendChild(spells);
}

// How many Skills each Level Up needs (data/levels.js).
function skillsNeeded() {
  const need = GAME_DATA.levels.needs.find(function (n) { return Array.isArray(n.id) && n.id.indexOf("skills") !== -1; });
  return need ? need.count : 0;
}

document.getElementById("btn-skills").addEventListener("click", function () {
  if (player && !walking) openSkillsPanel();
});
