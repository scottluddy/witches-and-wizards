// Sports at the Stadium (in the Wizard School's Sports Classroom): archery
// and soccer. Pass each test to earn it as a Skill (player.skills), which
// counts toward your next Level. The numbers are in data/sports.js.

function knowsSkill(skill) {
  return player.skills.indexOf(skill) !== -1;
}

function learnSkill(skill) {
  if (!knowsSkill(skill)) player.skills.push(skill);
  writeSave(player);
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
  const game = { arrows: rules.arrows, score: 0, loaded: false };
  const body = openInfoPanel("🏹", "Archery", "Click the bow to load an arrow, then click the target to shoot. " +
    (knowsSkill(rules.skill) ? "You already know archery: shoot for fun!" : "Score " + rules.passPoints + " points with " + rules.arrows + " arrows to earn the Archery Skill."));

  const range = document.createElement("div");
  range.className = "archery-range";
  const target = document.createElement("div");
  target.className = "archery-target";
  target.style.transitionDuration = rules.moveSeconds + "s";
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
    if (game.arrows === 0) finishArchery(body, game, rules);
  });

  moveTarget(target);
  const mover = setInterval(function () {
    if (!range.isConnected) return clearInterval(mover); // the pop-up was closed
    moveTarget(target);
  }, rules.moveSeconds * 1000);
}

// Off to a new random spot on the range (CSS slides it there).
function moveTarget(target) {
  target.style.left = randomBetween(5, 70) + "%"; // js/digging.js
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

function finishArchery(body, game, rules) {
  const passed = game.score >= rules.passPoints;
  if (passed && !knowsSkill(rules.skill)) {
    learnSkill(rules.skill);
    sportSay("🌟 " + game.score + " points! You passed: Archery is a new Skill (it counts toward your next Level)!");
  } else if (passed) {
    sportSay("🌟 " + game.score + " points! Great shooting.");
  } else {
    sportSay(game.score + " points. You need " + rules.passPoints + " to pass. Keep practising!");
  }
  againButton(body, openArchery);
}

// ---------------------------------------------------------------- soccer

// The goalie paces across the goal. Click a spot in the goal to kick the ball there.
function openSoccer() {
  const rules = GAME_DATA.sports.soccer;
  const game = { kicks: rules.kicks, goals: 0, kicking: false };
  const body = openInfoPanel("⚽", "Soccer", "Click a spot in the goal to kick the ball there. Don't let the goalie stop it! " +
    (knowsSkill(rules.skill) ? "You already know soccer: play for fun!" : "Score " + rules.goalsNeeded + " goals in " + rules.kicks + " kicks to earn the Soccer Skill."));

  const field = document.createElement("div");
  field.className = "soccer-field";
  const goal = document.createElement("div");
  goal.className = "soccer-goal";
  goal.appendChild(sportPicture("sport_goal", "🥅", "soccer-goal-picture"));
  const goalie = sportPicture("sport_goalie", "🧍", "soccer-goalie");
  goalie.style.width = rules.goalieWidth + "%";
  goalie.style.transitionDuration = rules.goalieSeconds + "s";
  goal.appendChild(goalie);
  const ball = sportPicture("sport_ball", "⚽", "soccer-ball");
  const score = document.createElement("p");
  score.className = "sport-score";
  field.append(goal, ball);
  body.append(field, score);
  showSoccerScore(score, game);

  goal.addEventListener("click", function (event) {
    if (game.kicking || game.kicks === 0) return;
    kickBall(event, field, ball, goalie, game, function () {
      showSoccerScore(score, game);
      if (game.kicks === 0) finishSoccer(body, game, rules);
    });
  });

  paceGoalie(goalie, rules);
  const pacer = setInterval(function () {
    if (!field.isConnected) return clearInterval(pacer); // the pop-up was closed
    paceGoalie(goalie, rules);
  }, rules.goalieSeconds * 1000);
}

// The goalie walks to a random spot across the goal.
function paceGoalie(goalie, rules) {
  goalie.style.left = randomBetween(8, 92 - rules.goalieWidth) + "%";
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
  }, 450); // how long the ball takes to fly (same as .soccer-ball in css/style.css)
}

function showSoccerScore(score, game) {
  score.textContent = "Goals: " + game.goals + "   ·   Kicks left: " + "⚽".repeat(game.kicks);
}

function finishSoccer(body, game, rules) {
  const passed = game.goals >= rules.goalsNeeded;
  if (passed && !knowsSkill(rules.skill)) {
    learnSkill(rules.skill);
    sportSay("🌟 " + game.goals + " goals! You passed: Soccer is a new Skill (it counts toward your next Level)!");
  } else if (passed) {
    sportSay("🌟 " + game.goals + " goals! What a striker.");
  } else {
    sportSay(game.goals + " goal" + (game.goals === 1 ? "" : "s") + ". You need " + rules.goalsNeeded + " to pass. Keep practising!");
  }
  againButton(body, openSoccer);
}
