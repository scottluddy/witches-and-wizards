// Adventures (Scott, 2026-10-12). Each finished adventure earns Adventure
// Points, and shows a fun picture by the girls for its kind of adventure,
// just for fun.
//   kind      used by each adventure's data, e.g. "kind": "reuniting" in data/unicorns.js
//   picture   the drawing shown when that kind of adventure is done
GAME_DATA.celebrations = {
  "reuniting": { "picture": "celebrate_birds",   "name": "Love birds" },  // bringing families back together
  "aquatic":   { "picture": "celebrate_narwhal", "name": "Narwhal" },     // any water adventure (none yet)
  "quest":     { "picture": "celebrate_narwhal", "name": "Narwhal" },     // finding something lost, like the Pixie's acorn (Scott: the narwhal for now, until a quest picture is drawn)
  "rescue":    { "picture": "", "name": "" }                              // helping someone lost, like on Windy Peak (no picture picked yet)
};

// Getting adventures (Scott, 2026-10-14). You start with none: every
// "unlockEverySkills" Skills (skill Levels plus spells) earns room for a new
// one, and the adventure's "unlockItem" is its key: once you have both (the
// Skills and the item carried in a bag), it unlocks. If you carry the keys to
// more than one, one is picked at random. The Head Witch and the Head
// Wizard take turns popping out to tell you about it; click them to hear where
// to go. The adventure's real name and steps stay a secret until you find
// whoever needs help. If you haven't started one, they come back to remind you
// every "reminderMinutes". They stay out for "staySeconds".
GAME_DATA.adventureGuide = {
  "unlockEverySkills": 2,
  "reminderMinutes": 30,
  "staySeconds": 20,
  "guides": [
    { "name": "Head Witch",  "kind": "witch",  "picture": "head_witch",  "emoji": "🧙‍♀️" },
    { "name": "Head Wizard", "kind": "wizard", "picture": "head_wizard", "emoji": "🧙‍♂️" }
  ]
};

// Every adventure. "unlockItem" is the item (and how many) you carry to
// unlock it, in your backpack, cooler or fruit basket. "hint" is what the Head Witch or Wizard tells you; "steps"
// show in the Adventures pop-up once you've found whoever needs help.
// Doing one again is a bit harder (Scott): the Pixie's potion has fewer sips
// (data/pixie.js), and each new unicorn comes out less often (data/unicorns.js).
// "drawings" lists the pictures an adventure uses, so the catalog's Still to
// Draw page can show what each adventure is still waiting for.
GAME_DATA.adventureList = [
  { "id": "pixie", "name": "The Pixie's Lost Treasure", "emoji": "🧚",
    "unlockItem": { "item": "fish_crystal", "count": 1 },
    "hint": "Head to the Forest and find a pixie who needs your help. She flies to a different place every few minutes, so look carefully!",
    "steps": [
      "Bring the Pixie a Crystal Fish for a Finding Potion",
      "Find the troll who stole her Golden Acorn: a sip shows where he's hiding, and the potion bubbles when you're there",
      "Answer his riddles to win the 3 pieces of his map, then put them in order",
      "Follow the Secret Pathway to the Pond House and find the acorn",
      "Give it back to the Pixie"
    ],
    "drawings": [
      { "what": "The Pixie", "file": "pixie" },
      { "what": "The troll", "file": "troll" },
      { "what": "Troll Bridge", "file": "place_troll_bridge" },
      { "what": "Pond House", "file": "place_pond_house" },
      { "what": "Inside the Pond House", "file": "place_pond_house_inside" },
      { "what": "Golden Acorn", "file": "quest_golden_acorn" },
      { "what": "Pond Turtle", "file": "pet_pond_turtle" },
      { "what": "Finding Potion", "file": "potion_finding" }
    ] },
  { "id": "unicorn", "name": "Reunite the Unicorn", "emoji": "🦄",
    "unlockItem": { "item": "fruit_apple", "count": 5 },
    "hint": "Go to the Unicorn Meadow in the Meadows. Someone shy is hiding in the trees. Bring apples!",
    "steps": [
      "Spot the unicorn when it peeks out from behind a tree",
      "Hold an apple and click it so it trusts you",
      "Cast the Seeing Spell on it",
      "Feed it more apples, one at a time"
    ],
    "drawings": [
      { "what": "Unicorn Meadow", "file": "place_unicorn_meadow" },
      { "what": "The blind unicorn", "file": "extra_unicorn" },
      { "what": "Apple", "file": "fruit_apple" }
    ] },
  // Lost on Windy Peak (Scott, 2026-10-15; data/windy.js). Unlocked by letting your
  // Snowy Owl fly at Windy Peak while you own a Night Vision Potion, not by Skills.
  { "id": "windy", "name": "Lost on Windy Peak", "emoji": "🏔️",
    "unlockBy": "Let your Snowy Owl fly at the Windy Peak dropoff while you own a Night Vision Potion",
    "hint": "Your Snowy Owl spotted a little future WIT lost on the ski slope at Windy Peak, and it's dark!",
    "steps": [
      "Find where they are",
      "Bring them somewhere warm",
      "Warm them up"
    ],
    "drawings": [
      { "what": "The ski slope seen from the top (it gets cut into 12 big sections, 4 across and 3 down, and each one is shown big, so draw lots of little things all over)", "file": "place_ski_slope" },
      { "what": "The blanket hanging over the couch in the Snowy Hut", "file": "hut_blanket" },
      { "what": "Snowy Owl", "file": "pet_owl" },
      { "what": "Night Vision Potion", "file": "potion_night_vision" },
      { "what": "Snowy Hut", "file": "place_hut" }
    ] }
];
