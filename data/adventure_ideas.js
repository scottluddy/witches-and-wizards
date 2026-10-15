// Adventure ideas (Claude's suggestions, Scott asked 2026-10-15). NOT in the
// game: only the catalog shows them (Next Steps page). When one is chosen,
// it moves into data/adventures.js with its own data and code.
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
    { "name": "Camp Little WITs", "category": "teach", "emoji": "🏕️",
      "unlock": "Reach Level 2 in any Skill (Piano, Archery or Soccer).",
      "idea": "A new Camp opens for future WITs. Each camper wants to learn something you already know: play back a tune you play for them, aim at the archery target while you show them how, or kick past the goalie. You can only teach Skills you've learned, so the more Skills you have, the more campers you can help. One Adventure Point per camper who passes.",
      "needs": "A Camp place (maybe one of the two empty Village houses, or in the Meadows) and drawings of a few young campers.",
      "celebrate": "celebrate_bunny" },
    { "name": "Lost on Windy Peak", "category": "rescue", "emoji": "🏔️",
      "unlock": "Carry a Snowy Owl and a Night Vision Potion.",
      "idea": "A little future WIT went skiing and got lost as it got dark. Use the Binoculars at Windy Peak to spot them, drink the Night Vision Potion, send your Snowy Owl from the Dropoff with a note saying help is coming, ski down to them, and bring them to the Snowy Hut for a warm hot chocolate.",
      "needs": "Mostly things already in the game. A drawing of the lost little WIT.",
      "celebrate": "" },
    { "name": "The Goblin's Giggles", "category": "mischief", "emoji": "👺",
      "unlock": "Reach Archery Level 3.",
      "idea": "A cheeky goblin is playing pranks in the Village: the Campus Store's price tags are swapped, the Disco Dance Hall piano plays silly tunes, and the Cafe menu is upside down. Follow the giggles to find him, then beat him at archery (his favourite game). He laughs, puts everything back and becomes a friend who sometimes has something to trade.",
      "needs": "A drawing of the goblin.",
      "celebrate": "celebrate_unicorn_donut" },
    { "name": "The Giant Pumpkin", "category": "quest", "emoji": "🎃",
      "unlock": "Carry a Growing Potion (Mini Potion Shack).",
      "idea": "The Farmer wants a prize pumpkin for the Harvest Fair. Plant a seed in the Crop Fields, water it, shoo away the cheeky crows, and pour on the Growing Potion so it grows and grows. Roll it to the Fair and win a ribbon.",
      "needs": "The Farm's Crop Fields, a Farmer, a pumpkin seed and pumpkin drawings.",
      "celebrate": "celebrate_pumpkin_witch" },
    { "name": "The Mermaid's Song", "category": "discover", "emoji": "🧜‍♀️",
      "unlock": "Find 3 pearls in the Pearl Cave and carry an Underwater Breathing Potion.",
      "idea": "Drink the potion and dive under the Pearl Waterfall to find a secret underwater kingdom. The mermaid there has lost her song: each of the 3 pearls holds a few notes. Put them in order, then play the whole song back to her on the piano.",
      "needs": "An underwater kingdom drawing and a mermaid. A good first \"aquatic\" adventure for the narwhal picture.",
      "celebrate": "celebrate_narwhal" }
  ]
};
