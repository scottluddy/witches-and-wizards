// Skills and their Levels (1 to 10). The rules are in data/skills.js.
//
// player.skills is a list with one entry for every skill Level gained, so
// ["piano", "archery", "archery"] means Piano Level 1 and Archery Level 2.
// That way going up a Level (js/levels.js) counts every skill Level you gain.

function skillLevel(skill) {
  return player.skills.filter(function (s) { return s === skill; }).length;
}

function skillName(skill) {
  return GAME_DATA.skills.names[skill] || skill;
}

function isMastered(skill) {
  return skillLevel(skill) >= GAME_DATA.skills.maxLevel;
}

// How long to wait after reaching this Level: 3 minutes after Level 1,
// growing to 5 minutes after Level 9 (data/skills.js).
function skillWaitMinutes(level) {
  const wait = GAME_DATA.skills.waitMinutes;
  const steps = GAME_DATA.skills.maxLevel - 2;   // Levels 1 to 9 have a wait after them
  return wait.from + (wait.to - wait.from) * Math.min(1, (level - 1) / steps);
}

// Pass a test: one more Level, then the wait before the next test starts.
function gainSkillLevel(skill) {
  player.skills.push(skill);
  player.skillWait[skill] = Date.now() + skillWaitMinutes(skillLevel(skill)) * 60000;
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

// Greyed-out spots: skill tests that are waiting, and spots needing a skill Level.
function markSkillSpot(button, place) {
  if (place.skill) {
    const label = button.querySelector(".label");
    button.dataset.skill = place.skill;
    button.dataset.name = label.textContent; // the name without the Level, for the countdown below
    label.textContent += skillSpotNote(place.skill);
    button.classList.toggle("locked", skillLocked(place.skill));
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
  if (!place.skill) return false;
  if (isMastered(place.skill)) {
    say.textContent = "⭐ You've mastered " + skillName(place.skill) + ": Level " + GAME_DATA.skills.maxLevel + "! There's nothing left to learn.";
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
    const skill = button.dataset.skill;
    button.querySelector(".label").textContent = button.dataset.name + skillSpotNote(skill);
    button.classList.toggle("locked", skillLocked(skill));
  });
}, 1000);
