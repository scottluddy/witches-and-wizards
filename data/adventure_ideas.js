// Adventure ideas (Claude's suggestions, Scott asked 2026-10-15). Only the
// catalog shows this list (Next Steps page).
//   status    "inactive" = not in the game yet, "started" = partly built, "active" = built (in data/adventures.js)
//   drawings  optional: the pictures it needs (shown with a ✅ once drawn)
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
    // The girls' idea (Scott, 2026-10-17). Started: the key and the locked chest are in the game.
    { "name": "The Kitty Pirate Treasure Hunt", "status": "started", "category": "discover", "emoji": "🗝️",
      "unlock": "Dig up the Old Key at the Dig Spot on Pebble Beach (1 dig in 20). There's only one, and it goes in your backpack.",
      "idea": "The key opens the old chest in the Museum's Ancient Kitty Pirate Room, next to the stone elephant statue. Inside is a treasure map; the rest isn't decided yet. Claude's ideas: the map is faded and only shows its path after you cast the Seeing Spell on it. It leads somewhere you've been but never looked closely, like the Tiny Island at the Lake or the pond in the trees (the new drawing), with three clues on the way (the girls could draw a stone statue, an old tree and a rock with a mark). At the X you dig up a lost museum treasure, maybe a crown, and give it back to the Museum: it goes on show in the Ancient Kitty Pirate Room with your name on its sign, for +1 Adventure Point. Each time you finish, the museum curator hides a different treasure, so the exhibit slowly fills up.",
      "needs": "The Old Key; the chest, closed and open (it's a computer drawing for now); the Ancient Kitty Pirate Room; the treasure map; the treasure at the end (a crown?); the places and clues on the map. A drawing of the stone elephant could replace its photo. Maybe a museum curator who tells you about the lost treasures.",
      "drawings": [
        { "what": "Old Key (the one you dig up)", "file": "quest_old_key" },
        { "what": "Old Chest, closed (and one open for later)", "file": "artifact_chest" },
        { "what": "Ancient Kitty Pirate Room (the room)", "file": "place_museum_room_4" },
        { "what": "Treasure map", "file": "quest_treasure_map" },
        { "what": "The treasure at the end", "file": "quest_museum_treasure" },
        { "what": "Stone elephant statue (a photo for now)", "file": "museum_elephant_statue" }
      ],
      "celebrate": "" },
    { "name": "The Mermaid's Song", "status": "inactive", "favorite": true, "category": "discover", "emoji": "🧜‍♀️",
      "unlock": "Find 3 pearls in the Pearl Cave and carry an Underwater Breathing Potion.",
      "idea": "Drink the potion and dive under the Pearl Waterfall to find a secret underwater kingdom. The mermaid there has lost her song: each of the 3 pearls holds a few notes. Put them in order, then play the whole song back to her on the piano.",
      "needs": "An underwater kingdom drawing and a mermaid. A good first \"aquatic\" adventure for the narwhal picture.",
      "celebrate": "celebrate_narwhal" }
  ]
};
