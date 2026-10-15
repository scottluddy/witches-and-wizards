// Adventure ideas (Claude's suggestions, Scott asked 2026-10-15). Only the
// catalog shows this list (Next Steps page).
//   status    "inactive" = not in the game yet, "active" = built (in data/adventures.js)
//   favorite  true = one of Scott's favourites (2026-10-15: Camp, Windy Peak, Mermaid)
//
// Every adventure stays G rated: "bad guys" like the troll and a goblin are
// cheeky, never scary, and are won over with riddles, games or kindness,
// never fighting.
GAME_DATA.adventureIdeas = {
  "categories": [
    { "id": "reunite",  "name": "Reunite",  "emoji": "💞", "about": "Bring a family or friends back together.", "inGame": "Reunite the Unicorn" },
    { "id": "quest",    "name": "Quest",    "emoji": "🔎", "about": "Find something lost or taken and give it back.", "inGame": "The Pixie's Lost Treasure" },
    { "id": "rescue",   "name": "Rescue",   "emoji": "🛟", "about": "Someone is stuck or lost: find them and get them safely home." },
    { "id": "teach",    "name": "Teach",    "emoji": "🎓", "about": "Use your own Skills to help younger future WITs learn theirs." },
    { "id": "discover", "name": "Discover", "emoji": "🗺️", "about": "Find a secret place nobody knew about." },
    { "id": "mischief", "name": "Mischief", "emoji": "😜", "about": "A cheeky bad guy causes trouble; outsmart them and maybe make a friend." }
  ],
  "ideas": [
    { "name": "Camp Little WITs", "status": "inactive", "favorite": true, "category": "teach", "emoji": "🏕️",
      "unlock": "Reach Level 2 in any Skill (Piano, Archery or Soccer).",
      "idea": "A new Camp opens for future WITs. Each camper wants to learn something you already know: play back a tune you play for them, aim at the archery target while you show them how, or kick past the goalie. You can only teach Skills you've learned, so the more Skills you have, the more campers you can help. One Adventure Point per camper who passes.",
      "needs": "A Camp place (maybe one of the two empty Village houses, or in the Meadows) and drawings of a few young campers.",
      "celebrate": "celebrate_bunny" },
    { "name": "Lost on Windy Peak", "status": "active", "favorite": true, "category": "rescue", "emoji": "🏔️",
      "unlock": "Let your Snowy Owl fly at the Windy Peak dropoff while you own a Night Vision Potion. The owl needs a falconry lesson at the Pet Training Field first.",
      "idea": "Your owl spots a little future WIT lost on the slope at night. Sip the Night Vision Potion (4 sips) to look through the binoculars for a clue, then ski down: the slope has 12 sections, each look costs a sip, and you have 3 chances to pick the right one. Find them, ski down to the Snowy Hut together and warm up with hot chocolate. (Scott's design, 2026-10-15)",
      "needs": "Mostly things already in the game. A drawing of the lost little WIT.",
      "celebrate": "" },
    { "name": "The Goblin's Giggles", "status": "inactive", "category": "mischief", "emoji": "👺",
      "unlock": "Reach Archery Level 3.",
      "idea": "A cheeky goblin is playing pranks in the Village: the Campus Store's price tags are swapped, the Disco Dance Hall piano plays silly tunes, and the Cafe menu is upside down. Follow the giggles to find him, then beat him at archery (his favourite game). He laughs, puts everything back and becomes a friend who sometimes has something to trade.",
      "needs": "A drawing of the goblin.",
      "celebrate": "celebrate_unicorn_donut" },
    { "name": "The Giant Pumpkin", "status": "inactive", "category": "quest", "emoji": "🎃",
      "unlock": "Carry a Growing Potion (Mini Potion Shack).",
      "idea": "The Farmer wants a prize pumpkin for the Harvest Fair. Plant a seed in the Crop Fields, water it, shoo away the cheeky crows, and pour on the Growing Potion so it grows and grows. Roll it to the Fair and win a ribbon.",
      "needs": "The Farm's Crop Fields, a Farmer, a pumpkin seed and pumpkin drawings.",
      "celebrate": "celebrate_pumpkin_witch" },
    { "name": "The Mermaid's Song", "status": "inactive", "favorite": true, "category": "discover", "emoji": "🧜‍♀️",
      "unlock": "Find 3 pearls in the Pearl Cave and carry an Underwater Breathing Potion.",
      "idea": "Drink the potion and dive under the Pearl Waterfall to find a secret underwater kingdom. The mermaid there has lost her song: each of the 3 pearls holds a few notes. Put them in order, then play the whole song back to her on the piano.",
      "needs": "An underwater kingdom drawing and a mermaid. A good first \"aquatic\" adventure for the narwhal picture.",
      "celebrate": "celebrate_narwhal" }
  ]
};
