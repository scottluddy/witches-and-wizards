// Lost on Windy Peak (Scott, 2026-10-15, reworked the same day: less
// telling, more figuring out). Code in js/windy.js.
//
// 1. Your Snowy Owl needs a falconry lesson (Pet Training Field) before it
//    can fly at the Windy Peak dropoff.
// 2. Letting it fly while you own a Night Vision Potion starts the adventure:
//    the owl spots a little future WIT lost on the ski slope.
// 3. Sip the potion (backpack) and look through the binoculars: a blown-up,
//    glowing green view of the slope with a faint glow from the little
//    WIT's lantern, somewhere near them.
// 4. Ski down onto the dark slope. It's in 48 puzzle-piece areas. After a
//    sip you can see your Snowy Owl: it flies down the slope and circles over
//    the little WIT. Click an area to look there; each look needs a sip, and
//    after 3 misses they wander somewhere new.
// 5. Click the little WIT, ski down together, and in the Snowy Hut drag a
//    hot chocolate over to them to warm them up.
GAME_DATA.windyRescue = {
  "potion": "potion_night_vision",
  "sips": 4,              // sips in one Night Vision Potion; each sip is one look
  "tries": 3,             // looks on the slope before the little WIT wanders off
  "adventurePoints": 1,
  "slope": "ski_slope",   // the slope place (data/places.js); its picture is the binocular view too
  "hut": "hut",           // where you warm up together
  "columns": 8,           // the slope's 48 puzzle-piece areas: 8 across, 6 down (was 12, Scott: too easy)
  "rows": 6,
  "glowSize": 3,          // the binoculars' lantern glow is this many pieces wide...
  "glowNear": 1,          // ...and its middle is up to this many pieces from the little WIT
  "owl": "pet_owl",       // the Snowy Owl's picture (🦉 until drawn)
  "owlCircle": 0.8,       // the owl circles this many pieces wide...
  "owlNear": 0.5,         // ...around a point up to this many pieces from the little WIT
  "lostWit": "🧒",        // until the girls draw the little WIT (art/raw/extra_little_wit.jpg)
  "picture": "extra_little_wit",
  "hutSpot": { "x": 58, "y": 62 },   // where the little WIT stands in the Snowy Hut
  // The girls' hot chocolate mug, cut out of the Snowy Hut drawing (art/raw/hut_mug.jpg)
  // and erased from it, so it can be dragged. x, y, width: where it was drawn, in percent
  // of the hut picture. It sits on the Snack Table and moves with it.
  "mug": { "picture": "hut_mug", "table": "snack_table", "x": 18.9, "y": 18.8, "width": 5.2 },
  "words": {
    "needLesson": "needs a falconry lesson at the Pet Training Field before it can fly here",
    "owlSpotted": "🦉 Your PET flies back hooting and flapping (BONDING)! It spotted a little future WIT lost on the ski slope, and it's getting dark...",
    "sipped": "🌙 Everything glows green! You can see in the dark, just long enough for one look.",
    "tooDark": "🌑 It's too dark to see.",
    "missed": "Not here...",
    "wandered": "The little WIT wandered off somewhere else on the slope!",
    "hello": "\"You found me! I got lost when it got dark.\"",
    "skiTogether": "⛷️ Ski down together",
    "cold": "Brrr! I'm so cold...",
    "done": "Warm and cozy! The little WIT says thank you and promises to stay with a grown-up next time. You finished an adventure: +POINTS Adventure Point!"
  }
};
