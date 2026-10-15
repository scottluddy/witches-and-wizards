// Lost on Windy Peak (Scott, 2026-10-15, reworked the same day: less
// telling, more figuring out). Code in js/windy.js.
//
// 1. Your Snowy Owl needs a falconry lesson (Pet Training Field) before it
//    can fly at the Windy Peak dropoff.
// 2. Letting it fly while you own a Night Vision Potion starts the adventure:
//    the owl spots a little future WIT lost on the ski slope.
// 3. Sip the potion (backpack) and look through the binoculars: a blown-up,
//    glowing green view of the slope with the little WIT's lantern on it.
// 4. Ski down onto the dark slope. It's in 12 puzzle-piece areas. Sip, then
//    click an area to look there; 3 chances, then they wander somewhere new.
// 5. Click the little WIT, ski down together, and in the Snowy Hut drag a
//    hot chocolate over to them to warm them up.
GAME_DATA.windyRescue = {
  "potion": "potion_night_vision",
  "sips": 4,              // sips in one Night Vision Potion; each sip is one look
  "tries": 3,             // looks on the slope before the little WIT wanders off
  "adventurePoints": 1,
  "slope": "ski_slope",   // the slope place (data/places.js); its picture is the binocular view too
  "hut": "hut",           // where you warm up together
  "columns": 4,           // the slope's 12 puzzle-piece areas: 4 across, 3 down
  "rows": 3,
  "lostWit": "🧒",        // until the girls draw the little WIT (art/raw/extra_little_wit.jpg)
  "picture": "extra_little_wit",
  "hutSpot": { "x": 58, "y": 62 },   // where the little WIT stands in the Snowy Hut
  "mugSpot": { "x": 22, "y": 30 },   // the hot chocolate on the hut's snack table
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
