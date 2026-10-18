// Lost on Windy Peak (Scott, 2026-10-15, reworked on 2026-10-16: fewer
// instructions, more figuring out). Code in js/windy.js.
//
// 1. Your Snowy Owl needs a falconry lesson (Pet Training Field) before it
//    can fly at the Windy Peak dropoff.
// 2. Letting it fly while you own a Night Vision Potion starts the adventure:
//    the owl spots a little future WIT lost on the ski slope.
// 3. Sip the potion (backpack) and look through the binoculars: a blown-up,
//    green view of the slope with a glow from the little WIT's lantern.
//    That's the first clue.
// 4. Ski down onto the dark slope, cut into 12 big sections, and choose the
//    section to search (3 chances, then they wander somewhere new).
// 5. The right section grows to fill the picture. Each sip, your Snowy Owl
//    flies across it, and as it passes over the little WIT a spot lights up
//    for a moment. The spot is bigger than the little WIT, so there's still
//    some luck: 3 searches, then they wander off again.
// 6. Click the little WIT and ski down together to the Snowy Hut. There
//    they're cold: sit them on the couch, cover them with the blanket, then
//    give them the hot chocolate. Nothing says so: you figure it out.
GAME_DATA.windyRescue = {
  "potion": "potion_night_vision",
  "sips": 4,              // sips in one Night Vision Potion: one for the binoculars, three for the owl
  "tries": 3,             // sections you can choose before the little WIT wanders off
  "searches": 3,          // clicks in the magnified section before they wander off
  "adventurePoints": 1,
  "slope": "ski_slope",   // the slope place (data/places.js); its picture is the binocular view too
  "hut": "hut",           // where you warm up together
  "columns": 4,           // the slope's 12 big sections: 4 across, 3 down
  "rows": 3,
  "glowSize": 0.6,        // the binoculars' lantern glow, as a share of one section's width
  "zoomSeconds": 1.5,     // how long the chosen section takes to grow
  "owl": "pet_owl",       // the Snowy Owl's picture (🦉 until drawn)
  "flySeconds": 3,        // one flight across the magnified section
  "lightSize": 36,        // the lit spot's width, in percent of the magnified section...
  "witSize": 8,           // ...the little WIT's, which is somewhere inside the lit spot...
  "offCentre": 0.5,       // ...at least this far out from its middle (0 = middle, 1 = edge; Scott: never the middle)...
  "findDistance": 5,      // ...and how close a click must be to find them
  "lightSeconds": 1.2,    // how long the spot stays lit
  "lostWit": "🧒",        // if no little WIT is drawn (they're in data/characters.js, one is picked at random)
  "binocularWit": 4,      // the little WIT's height in the Binocular View, percent of the slope picture
  "hutSpot": { "x": 50, "y": 72 },   // where the little WIT's feet are when you come in
  // In the Snowy Hut, things sit on the furniture they belong to and move with it.
  // x, y, width: percent of the hut picture, where they are when the furniture hasn't been moved.
  // The girls' hot chocolate mug, cut out of the hut drawing (art/raw/hut_mug.jpg) and erased from it:
  "mug": { "picture": "hut_mug", "on": "snack_table", "x": 18.9, "y": 18.8, "width": 5.2 },
  // The blanket hanging over the couch (the girls' purple and yellow zigzag blanket, 2026-10-18, turned on its side):
  "blanket": { "picture": "hut_blanket", "on": "armchair", "x": 76, "y": 30, "width": 9 },
  // The couch the little WIT sits on (the furniture piece; where on it comes from
  // its "seat" in data/furniture.js). x, y: where their feet go if it isn't cut out.
  "seat": { "on": "armchair", "x": 79, "y": 47 },
  // The ride down the Ski Slope (Scott, 2026-10-18): you on skis, weaving between
  // the girls' trees and the "area closed" sign. "path" is where your feet go, in
  // order (x, y in percent of the slope picture); "gems" are the girls' drawn
  // gems, worth 1 each if you ski past them (within "reach"). Size is your height
  // at the top and the bottom (you look bigger as you come closer).
  "ride": {
    "seconds": 7,
    "path": [[50, 3], [58, 10], [63, 18], [65.5, 28], [63, 38], [51, 45], [48, 52], [46, 60],
             [40.5, 71], [31, 78], [29, 88], [31, 104]],
    "gems": [[65.5, 26], [40.5, 69]],
    "reach": 5,
    "sizeTop": 9,
    "sizeBottom": 24,
    "words": {
      "start": "⛷️ Wheee! Down the ski slope you go!",
      "together": "⛷️ You and the little WIT ski down together!",
      "gem": "+1 gem!"
    }
  },
  "words": {
    "needLesson": "needs a falconry lesson at the Pet Training Field before it can fly here",
    "owlSpotted": "🦉 Your PET flies back hooting and flapping (BONDING)! It spotted a little future WIT lost on the ski slope, and it's getting dark...",
    "sipped": "🌙 Everything glows green! You can see in the dark.",
    "tooDark": "🌑 It's too dark to see.",
    "choose": "Choose a section to search.",
    "missed": "Not here...",
    "searchHere": "Somewhere in here...",
    "notThere": "Just snow...",
    "wandered": "The little WIT wandered off somewhere else on the slope!",
    "hello": "\"You found me! I got lost when it got dark.\"",
    "skiTogether": "⛷️ Ski down together",
    "cold": "Brrr! I'm so cold...",
    "sitting": "Still sooo chilly...",
    "covered": "Ahh, cozy!",
    "slips": "It keeps slipping off!",
    "shaky": "My hands are too cold to hold it!",
    "youSitFirst": "Sit down on the couch first, then snuggle under the blanket.",
    "youCovered": "🧣 You snuggle under the blanket. So cozy!",
    "done": "Warm and cozy! The little WIT says thank you and promises to stay with a grown-up next time. You finished an adventure: +POINTS Adventure Point!"
  }
};
