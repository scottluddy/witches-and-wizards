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
  "lostWit": "🧒",        // until the girls draw the little WIT (art/raw/extra_little_wit.jpg)
  "picture": "extra_little_wit",
  "hutSpot": { "x": 50, "y": 72 },   // where the little WIT's feet are when you come in
  // In the Snowy Hut, things sit on the furniture they belong to and move with it.
  // x, y, width: percent of the hut picture, where they are when the furniture hasn't been moved.
  // The girls' hot chocolate mug, cut out of the hut drawing (art/raw/hut_mug.jpg) and erased from it:
  "mug": { "picture": "hut_mug", "on": "snack_table", "x": 18.9, "y": 18.8, "width": 5.2 },
  // The blanket hanging over the couch (art/raw/hut_blanket.jpg when drawn):
  "blanket": { "picture": "hut_blanket", "on": "armchair", "x": 76, "y": 30, "width": 9 },
  // The couch the little WIT sits on (the furniture piece; where on it comes from
  // its "seat" in data/furniture.js). x, y: where their feet go if it isn't cut out.
  "seat": { "on": "armchair", "x": 79, "y": 47 },
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
