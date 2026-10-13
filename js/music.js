// Music: learn the piano in the Wizard School's Music Classroom (the
// rehearsal studio, where you can practise too), then play a song on the
// piano in the Disco Dance Hall and everyone dances under the disco ball.
// The keys, the lessons, the songs and the dancers are in data/music.js.

let sound = null;        // the browser's sound maker, made on the first note
let danceTimer = null;   // stops the dancing a little after the last note
let lesson = null;       // the lesson being played: { number, tune, played }

function knowsPiano() {
  return player.skills.indexOf(GAME_DATA.music.skill) !== -1;
}

// ---------------------------------------------------------------- sounds

// Play one piano key: a short "plink" at the key's note.
function playNote(key) {
  if (!sound) sound = new (window.AudioContext || window.webkitAudioContext)();
  const tone = sound.createOscillator();
  const volume = sound.createGain();
  tone.type = "triangle";
  tone.frequency.value = key.hertz;
  volume.gain.setValueAtTime(0.35, sound.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.001, sound.currentTime + 0.8); // fades like a piano
  tone.connect(volume).connect(sound.destination);
  tone.start();
  tone.stop(sound.currentTime + 0.8);
}

// A row of big coloured piano keys. onPress(keyNumber) is called for each press.
function pianoKeys(onPress) {
  const row = document.createElement("div");
  row.className = "piano-keys";
  GAME_DATA.music.keys.forEach(function (key, i) {
    const button = document.createElement("button");
    button.className = "piano-key";
    button.style.background = key.colour;
    button.textContent = key.note;
    button.dataset.key = i;
    button.addEventListener("click", function () { pressKey(row, i); onPress(i); });
    row.appendChild(button);
  });
  return row;
}

// Make a key sound and light up, as if pressed.
function pressKey(row, i) {
  playNote(GAME_DATA.music.keys[i]);
  const button = row.querySelector('[data-key="' + i + '"]');
  button.classList.remove("pressed");
  void button.offsetWidth; // restart the light-up
  button.classList.add("pressed");
  setTimeout(function () { button.classList.remove("pressed"); }, 250);
}

// Play a list of keys one after another (for the lessons and the song).
function playTune(row, tune, gapMs, done) {
  tune.forEach(function (i, n) {
    setTimeout(function () { pressKey(row, i); }, n * gapMs);
  });
  if (done) setTimeout(done, tune.length * gapMs);
}

// A button for each song in data/music.js. onNote is called on every note it plays.
function songButtons(row, onNote) {
  const box = document.createElement("div");
  box.className = "song-buttons";
  GAME_DATA.music.songs.forEach(function (song) {
    const button = document.createElement("button");
    button.className = "small-button";
    button.textContent = "🎵 " + song.name;
    button.addEventListener("click", function () {
      playTune(row, song.keys, 380);
      if (onNote) song.keys.forEach(function (key, n) { setTimeout(onNote, n * 380); });
    });
    box.appendChild(button);
  });
  return box;
}

// ---------------------------------------------------------------- the Music Classroom

function openPianoLesson() {
  if (knowsPiano()) return openRehearsal();
  startLesson(0);
}

// Once you can play: the rehearsal studio, to practise the keys and the songs.
function openRehearsal() {
  const body = openInfoPanel("🎹", "Rehearsal Studio",
    "You know how to play the piano! Practise here, then play for everyone at the Disco Dance Hall.");
  const row = pianoKeys(function () {});
  body.append(row, songButtons(row));
}

// A lesson: the teacher plays a short tune, then you play it back.
function startLesson(number) {
  const keys = GAME_DATA.music.keys.length;
  const tune = [];
  for (let n = 0; n < GAME_DATA.music.lessons[number]; n++) tune.push(randomBetween(0, keys - 1)); // js/digging.js
  lesson = { number: number, tune: tune, played: [] };
  showLesson("Lesson " + (number + 1) + " of " + GAME_DATA.music.lessons.length +
    ": listen to the teacher's tune, then play it back.");
}

function showLesson(message) {
  const body = openInfoPanel("🎹", "Piano Lessons", message);
  const row = pianoKeys(playedKey);
  body.appendChild(row);
  const again = document.createElement("button");
  again.className = "big-button secondary";
  again.textContent = "👂 Listen again";
  again.addEventListener("click", function () { lesson.played = []; listen(row); });
  body.appendChild(again);
  listen(row);
}

// The teacher plays the tune; you can't press keys until it's done.
function listen(row) {
  row.classList.add("listening");
  setTimeout(function () {
    playTune(row, lesson.tune, 600, function () { row.classList.remove("listening"); });
  }, 500);
}

function playedKey(i) {
  if (!lesson || document.querySelector(".piano-keys.listening")) return;
  lesson.played.push(i);
  const n = lesson.played.length - 1;
  if (lesson.played[n] !== lesson.tune[n]) {
    lesson.played = [];
    return setTimeout(function () { showLesson("Oops, not quite! Listen again and try once more."); }, 500);
  }
  if (lesson.played.length < lesson.tune.length) return;
  // Played the whole tune!
  if (lesson.number + 1 < GAME_DATA.music.lessons.length) {
    const next = lesson.number + 1;
    return setTimeout(function () { startLesson(next); }, 700);
  }
  player.skills.push(GAME_DATA.music.skill);
  lesson = null;
  writeSave(player);
  setTimeout(function () {
    openInfoPanel("🎹🌟", "You Can Play the Piano!",
      "Bravo! You passed all the lessons. Playing the piano is a new Skill (it counts toward your next Level). Practise here any time, or go and play a song in the Disco Dance Hall!");
  }, 700);
}

// ---------------------------------------------------------------- the Disco Dance Hall

// Called by showPlace for every place: only the Disco Dance Hall has a dance floor.
function showDanceFloor(place) {
  const floor = document.getElementById("dance-floor");
  floor.innerHTML = "";
  floor.className = "";
  floor.hidden = place.id !== "disco_hall";
  if (floor.hidden) return;
  const music = GAME_DATA.music;
  const glow = document.createElement("div");
  glow.className = "disco-glow";
  glow.style.left = music.ball[0] + "%";
  glow.style.top = music.ball[1] + "%";
  floor.appendChild(glow);
  music.dancers.forEach(function (dancer, i) {
    const who = document.createElement("span");
    who.className = "dancer";
    who.textContent = dancer.emoji;
    who.style.left = dancer.x + "%";
    who.style.top = dancer.y + "%";
    who.style.animationDelay = (i * 0.13) + "s";
    floor.appendChild(who);
  });
}

function openPiano() {
  if (!knowsPiano()) {
    document.getElementById("place-description").textContent =
      "🎹 You don't know how to play the piano yet. Take Piano Lessons in the Music Classroom at the Wizard School, here in the Village!";
    return;
  }
  const floor = document.getElementById("dance-floor");
  let keys = floor.querySelector(".hall-piano");
  if (keys) return keys.remove(); // click the piano again to put the keys away
  keys = document.createElement("div");
  keys.className = "hall-piano";
  const row = pianoKeys(startDancing);
  keys.append(row, songButtons(row, startDancing));
  floor.appendChild(keys);
  document.getElementById("place-description").textContent = "🎶 Play a song (or the keys) and everyone dances! Click the piano again to put the keys away.";
}

// Music is playing: everyone dances, and stops a few seconds after the last note.
function startDancing() {
  const floor = document.getElementById("dance-floor");
  floor.classList.add("dancing");
  clearTimeout(danceTimer);
  danceTimer = setTimeout(function () { floor.classList.remove("dancing"); }, GAME_DATA.music.danceSeconds * 1000);
}
