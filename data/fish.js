// Fish you can catch from a fishing spot (like the Lucky Rods at the Dock).
// You wait a random time for a bite, then reel it in. The fish goes in your
// cooler and you earn its gems.
//
//   id       short name (no spaces). The picture is art/processed/<id>.png
//   gems     gems you earn for catching it
//   chance   how often it bites compared to the others (bigger = more often)
GAME_DATA.fish = [
  { "id": "fish_bubble",  "name": "Bubble Fish",  "gems": 3, "chance": 6, "emoji": "🐟",
    "description": "A round orange fish with a yellow crown." },
  { "id": "fish_dream",   "name": "Dream Fish",   "gems": 5, "chance": 3, "emoji": "🐠",
    "description": "A sleepy pink fish in a nightcap." },
  { "id": "fish_crystal", "name": "Crystal Fish", "gems": 7, "chance": 1, "emoji": "🐡",
    "description": "A rare spiky blue fish." }
];

// How long you wait for a bite, in seconds (a random time in between).
GAME_DATA.fishing = { "minSeconds": 5, "maxSeconds": 20 };
