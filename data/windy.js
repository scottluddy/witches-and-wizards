// Lost on Windy Peak (Scott, 2026-10-15): a rescue adventure. Code in js/windy.js.
//
// 1. Your Snowy Owl must have had a falconry lesson (Pet Training Field)
//    before it can fly at the Windy Peak dropoff.
// 2. Letting it fly while you own a Night Vision Potion starts the adventure:
//    the owl spots a little future WIT lost on the slope.
// 3. A sip of the potion lets you see in the dark through the binoculars:
//    you get a clue to where they are.
// 4. Ski down: the slope map has 12 sections. Each look into one costs a
//    sip, and you get 3 tries.
// 5. Found! Ski down to the Snowy Hut together and warm up with hot chocolate.
GAME_DATA.windyRescue = {
  "potion": "potion_night_vision",
  "sips": 4,              // sips in one Night Vision Potion
  "tries": 3,             // looks into the slope before the little WIT wanders off
  "adventurePoints": 1,
  "hut": "hut",           // where you warm up together
  "lostWit": "🧒",        // until the girls draw the little WIT (art/raw/extra_little_wit.jpg)
  "picture": "extra_little_wit",
  // The slope map: 4 rows from the top of the slope down, 3 columns. Each
  // section has one landmark; every landmark is once in each column, so a
  // landmark plus a side tells you exactly where to look.
  "rows": ["near the top", "a little way down", "halfway down", "near the bottom"],
  "columns": ["left", "middle", "right"],
  "sides": ["on the left side of the slope", "in the middle of the slope", "on the right side of the slope"], // how the clue says each column
  "landmarks": [
    { "emoji": "🌲", "name": "pine tree" },
    { "emoji": "⛄", "name": "snowman" },
    { "emoji": "🪨", "name": "big rock" },
    { "emoji": "🚩", "name": "red flag" }
  ],
  "words": {
    "needLesson": "needs a falconry lesson at the Pet Training Field before it can fly here",
    "owlSpotted": "🦉 Your PET flies back hooting and flapping (BONDING)! It spotted a little future WIT lost on the slope, and it's getting dark. Drink a sip of your Night Vision Potion and look through the binoculars to find them!",
    "lookAsk": "It's too dark to see the slope. A sip of Night Vision Potion will help.",
    "noPotion": "It's too dark to see! You need a Night Vision Potion (the Trading Post has one).",
    "clue": "🌙 Everything glows green! Far below you spot a tiny lantern: the little WIT is next to a LANDMARK, SIDE. Remember that, then Ski down!",
    "slopeAsk": "Where is the little WIT? Each look costs a sip of Night Vision Potion. Tries left: TRIES.",
    "nothing": "Only snow and a LANDMARK here. Not this one!",
    "found": "🏮 There they are, next to the LANDMARK! The little WIT gives you a big hug. \"I got lost when it got dark!\"",
    "wandered": "Oh no, the little WIT wandered off to another spot. Your owl is still watching: look through the binoculars again to find where they went.",
    "outOfSips": "Your Night Vision Potion is empty. Get another one (the Trading Post has them) to keep looking.",
    "skiTogether": "⛷️ Ski down to the Snowy Hut together",
    "warmAsk": "You're both cold and sleepy after the snowy ski. The hut has a pot of hot chocolate on the table.",
    "drink": "☕ Drink hot chocolate together",
    "done": "Warm and cozy! The little WIT says thank you and promises to stay with a grown-up next time. You finished an adventure: +POINTS Adventure Point!"
  }
};
