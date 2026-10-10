// "Solve to Dance" in the Mushroom Ring: answer maths problems to dance.
// The numbers are in data/dance.js.

let danceProblem = null; // { text, answer, reward }
let danceSolved = 0;     // right answers since you came to the puzzle

function randomNumber(low, high) {
  return low + Math.floor(Math.random() * (high - low + 1));
}

// One problem: +, -, × or ÷, all at a 3rd grade level.
function makeProblem() {
  const dance = GAME_DATA.dance;
  const kind = ["+", "-", "×", "÷"][randomNumber(0, 3)];
  if (kind === "+") {
    const a = randomNumber(10, dance.biggest / 2), b = randomNumber(10, dance.biggest / 2);
    return { text: a + " + " + b, answer: a + b, reward: dance.addSubtract };
  }
  if (kind === "-") {
    const a = randomNumber(20, dance.biggest - 1), b = randomNumber(10, a); // never below zero
    return { text: a + " − " + b, answer: a - b, reward: dance.addSubtract };
  }
  const a = randomNumber(2, dance.timesTables), b = randomNumber(2, dance.timesTables);
  if (kind === "×") return { text: a + " × " + b, answer: a * b, reward: dance.multiplyDivide };
  return { text: (a * b) + " ÷ " + a, answer: b, reward: dance.multiplyDivide }; // always comes out even
}

function openDancePuzzle() {
  danceSolved = 0;
  nextProblem();
  document.getElementById("dance-panel").hidden = false;
}

function nextProblem() {
  danceProblem = makeProblem();
  document.getElementById("dance-title").textContent = "Solve to dance!";
  document.getElementById("dance-progress").textContent = (danceSolved + 1) + " out of " + GAME_DATA.dance.toDance;
  document.getElementById("dance-question").textContent = danceProblem.text + " = ?";
  document.getElementById("dance-message").textContent = "";
  const answer = document.getElementById("dance-answer");
  answer.value = "";
  answer.hidden = false;
  document.getElementById("btn-dance-check").hidden = false;
  document.getElementById("btn-dance-again").hidden = true;
  answer.focus();
}

function checkAnswer() {
  const typed = document.getElementById("dance-answer").value.trim();
  if (typed === "") return;
  const message = document.getElementById("dance-message");
  if (Number(typed) !== danceProblem.answer) {
    message.textContent = "Not quite. Try again!";
    return;
  }
  const dance = GAME_DATA.dance;
  player[dance.money] += danceProblem.reward;
  writeSave(player);
  danceSolved++;
  message.textContent = "";
  message.append("✨ Right! You earned ", moneyLabel(dance.money, danceProblem.reward), ".");
  if (danceSolved < dance.toDance) {
    setTimeout(nextProblem, 1200);
    return;
  }
  // Solved them all: time to dance!
  document.getElementById("dance-title").textContent = "💃 You dance under the disco ball! 🕺";
  document.getElementById("dance-progress").textContent = "";
  document.getElementById("dance-answer").hidden = true;
  document.getElementById("btn-dance-check").hidden = true;
  document.getElementById("btn-dance-again").hidden = false;
}

document.getElementById("btn-dance-check").addEventListener("click", checkAnswer);
document.getElementById("dance-answer").addEventListener("keydown", function (event) {
  if (event.key === "Enter") checkAnswer();
});
document.getElementById("btn-dance-again").addEventListener("click", openDancePuzzle);
document.getElementById("btn-dance-close").addEventListener("click", function () {
  document.getElementById("dance-panel").hidden = true;
});
