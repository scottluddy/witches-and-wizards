// Sports at the Stadium (in the Wizard School's Sports Classroom): archery
// and soccer. Each game is a test: pass it to raise that skill one Level
// (js/skills.js), then wait a few minutes before the next, harder test.
// The numbers for each Level are in data/sports.js.

// The rules for the next test: Level 1's test if you haven't started, and so on.
function nextTest(rules) {
  const level = skillLevel(rules.skill) + 1;
  return Object.assign({ level: level }, rules.levels[level - 1]);
}

// "You passed!": one more Level, and when the next test is.
function passedTest(rules, score) {
  const level = gainSkillLevel(rules.skill); // js/skills.js
  const next = level >= GAME_DATA.skills.maxLevel
    ? " You've mastered " + rules.name + "!"
    : " Your next test is ready in " + Math.round(skillWaitMinutes(level)) + " minutes.";
  sportSay("🌟 " + score + "! You passed: " + rules.name + " Level " + level + " (it counts toward your next Level)." + next);
  showPlace(player.at); // greys out the sport until the next test
}

// A picture, or its emoji if the girls haven't drawn it.
function sportPicture(name, emoji, className) {
  const art = document.createElement(isDrawn(name) ? "img" : "span");
  art.className = className;
  if (isDrawn(name)) {
    art.src = picture(name);
    art.alt = "";
    art.draggable = false;
  } else {
    art.textContent = emoji;
  }
  return art;
}

function sportSay(message) {
  document.getElementById("info-message").textContent = message;
}

// The "Try again" button at the end of a game.
function againButton(body, start) {
  const again = document.createElement("button");
  again.className = "big-button";
  again.textContent = "🔁 Try again";
  again.addEventListener("click", start);
  body.appendChild(again);
}

// ---------------------------------------------------------------- archery

// Click the bow to load an arrow, then click the moving target to shoot.
function openArchery() {
  const rules = GAME_DATA.sports.archery;
  const test = nextTest(rules);
  const game = { arrows: rules.arrows, score: 0, loaded: false };
  const body = openInfoPanel("🏹", "Archery Level " + test.level + " Test", "Click the bow to load an arrow, then click the target to shoot. " +
    "Score " + test.passPoints + " points with " + rules.arrows + " arrows to pass.");

  const range = document.createElement("div");
  range.className = "archery-range";
  const target = document.createElement("div");
  target.className = "archery-target";
  target.style.transitionDuration = test.moveSeconds + "s";
  target.style.width = test.size + "%";
  target.appendChild(sportPicture("sport_target", "🎯", "archery-target-picture"));
  const bow = document.createElement("button");
  bow.className = "archery-bow";
  bow.appendChild(sportPicture("sport_bow", "🏹", "archery-bow-picture"));
  const score = document.createElement("p");
  score.className = "sport-score";
  range.append(target, bow);
  body.append(range, score);
  showArcheryScore(score, game);

  bow.addEventListener("click", function () {
    if (game.arrows === 0 || game.loaded) return;
    game.loaded = true;
    bow.classList.add("loaded");
    sportSay("🏹 Arrow ready! Now click the target.");
  });
  // Clicking anywhere on the range shoots: on the target it's a hit, anywhere else a miss.
  range.addEventListener("click", function (event) {
    if (!game.loaded || bow.contains(event.target)) return;
    shootArrow(event, target, game, rules);
    bow.classList.remove("loaded");
    showArcheryScore(score, game);
    if (game.arrows === 0) finishArchery(body, game, rules, test);
  });

  moveTarget(target, test);
  const mover = setInterval(function () {
    if (!range.isConnected) return clearInterval(mover); // the pop-up was closed
    moveTarget(target, test);
  }, test.moveSeconds * 1000);
}

// Off to a new random spot on the range (CSS slides it there).
function moveTarget(target, test) {
  target.style.left = randomBetween(5, 92 - test.size) + "%"; // js/digging.js
  target.style.top = randomBetween(2, 40) + "%";
}

// Which ring did the arrow hit? Work out how far from the middle it landed:
// 0 is the bull's-eye, 1 is the outside edge.
function shootArrow(event, target, game, rules) {
  game.loaded = false;
  game.arrows -= 1;
  const box = target.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width * 100;
  const y = (event.clientY - box.top) / box.height * 100;
  const distance = Math.hypot((x - rules.centre[0]) / rules.radius[0], (y - rules.centre[1]) / rules.radius[1]);
  const ring = rules.rings.find(function (r) { return distance <= r.upTo; });
  if (!ring) return sportSay("💨 Missed! " + game.arrows + " arrow" + (game.arrows === 1 ? "" : "s") + " left.");
  game.score += ring.points;
  // A little arrow stuck in the target (it moves with the target).
  const stuck = document.createElement("span");
  stuck.className = "archery-hit";
  stuck.style.left = x + "%";
  stuck.style.top = y + "%";
  target.appendChild(stuck);
  sportSay("🎯 You hit the " + ring.name + " ring! +" + ring.points + " point" + (ring.points === 1 ? "" : "s") + ".");
}

function showArcheryScore(score, game) {
  score.textContent = "Score: " + game.score + "   ·   Arrows left: " + "🏹".repeat(game.arrows);
}

function finishArchery(body, game, rules, test) {
  if (game.score >= test.passPoints) return passedTest(rules, game.score + " points");
  sportSay(game.score + " points. You need " + test.passPoints + " to pass. Try again!");
  againButton(body, openArchery);
}

// ---------------------------------------------------------------- soccer

// The goalie paces across the goal. Click a spot in the goal to kick the ball there.
function openSoccer() {
  const rules = GAME_DATA.sports.soccer;
  const test = nextTest(rules);
  const game = { kicks: rules.kicks, goals: 0, kicking: false };
  const body = openInfoPanel("⚽", "Soccer Level " + test.level + " Test", "Click a spot in the goal to kick the ball there. Don't let the goalie stop it! " +
    "Score " + test.goalsNeeded + " goals in " + rules.kicks + " kicks to pass.");

  const field = document.createElement("div");
  field.className = "soccer-field";
  const goal = document.createElement("div");
  goal.className = "soccer-goal";
  goal.appendChild(sportPicture("sport_goal", "🥅", "soccer-goal-picture"));
  const goalie = sportPicture("sport_goalie", "🧍", "soccer-goalie");
  goalie.style.width = test.goalieWidth + "%";
  goalie.style.transitionDuration = test.goalieSeconds + "s";
  goal.appendChild(goalie);
  const ball = sportPicture("sport_ball", "⚽", "soccer-ball");
  ball.style.transitionDuration = rules.ballSeconds + "s";
  const score = document.createElement("p");
  score.className = "sport-score";
  field.append(goal, ball);
  body.append(field, score);
  showSoccerScore(score, game);

  goal.addEventListener("click", function (event) {
    if (game.kicking || game.kicks === 0) return;
    kickBall(event, field, ball, goalie, game, function () {
      showSoccerScore(score, game);
      if (game.kicks === 0) finishSoccer(body, game, rules, test);
    });
  });

  paceGoalie(goalie, test);
  const pacer = setInterval(function () {
    if (!field.isConnected) return clearInterval(pacer); // the pop-up was closed
    paceGoalie(goalie, test);
  }, test.goalieSeconds * 1000);
}

// The goalie walks to a random spot across the goal.
function paceGoalie(goalie, test) {
  goalie.style.left = randomBetween(8, 92 - test.goalieWidth) + "%";
}

// The ball flies to where you clicked. When it gets there: if the goalie is in
// the way, it's saved; otherwise it's a goal.
function kickBall(event, field, ball, goalie, game, done) {
  game.kicking = true;
  const box = field.getBoundingClientRect();
  ball.style.left = (event.clientX - box.left) / box.width * 100 + "%";
  ball.style.top = (event.clientY - box.top) / box.height * 100 + "%";
  ball.classList.add("kicked");
  setTimeout(function () {
    const ballBox = ball.getBoundingClientRect();
    const keeper = goalie.getBoundingClientRect();
    const middle = ballBox.left + ballBox.width / 2;
    const saved = middle > keeper.left && middle < keeper.right;
    game.kicks -= 1;
    if (saved) sportSay("🧤 Saved by the goalie! " + game.kicks + " kick" + (game.kicks === 1 ? "" : "s") + " left.");
    else {
      game.goals += 1;
      sportSay("🥅 GOAL! " + game.kicks + " kick" + (game.kicks === 1 ? "" : "s") + " left.");
    }
    setTimeout(function () {
      // Back to the penalty spot for the next kick.
      ball.classList.remove("kicked");
      ball.style.left = "";
      ball.style.top = "";
      game.kicking = false;
      done();
    }, 700);
  }, GAME_DATA.sports.soccer.ballSeconds * 1000); // when the ball reaches the goal
}

function showSoccerScore(score, game) {
  score.textContent = "Goals: " + game.goals + "   ·   Kicks left: " + "⚽".repeat(game.kicks);
}

function finishSoccer(body, game, rules, test) {
  if (game.goals >= test.goalsNeeded) return passedTest(rules, game.goals + " goals");
  sportSay(game.goals + " goal" + (game.goals === 1 ? "" : "s") + ". You need " + test.goalsNeeded + " to pass. Try again!");
  againButton(body, openSoccer);
}
