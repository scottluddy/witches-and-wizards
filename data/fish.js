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
  { "id": "fish_dream",   "name": "Dream Fish",   "gems": 6, "chance": 3, "emoji": "🐠",
    "description": "A sleepy pink fish in a nightcap." },
  { "id": "fish_crystal", "name": "Crystal Fish", "gems": 10, "chance": 1, "emoji": "🐡",
    "description": "A rare spiky blue fish." }
];

// Treasures: other things a Lucky Rod can pull up. They earn gems like fish,
// but they are NOT fish: they don't count toward the fish count and they're
// kept in their own list (player.treasures). "chance" works the same as for
// fish, compared with every fish and treasure together.
GAME_DATA.treasures = [
  { "id": "treasure_shell",      "name": "Shell",      "gems": 2, "chance": 4, "emoji": "🐚",
    "description": "A pink sea shell." },
  { "id": "treasure_sanddollar", "name": "Sand Dollar", "gems": 5, "chance": 2, "emoji": "🪙",
    "description": "A yellow sand dollar with a star on it." }
];

// How long you wait for a bite, in seconds (a random time in between).
// If the wait would be longer than giveUpSeconds, nothing bites: after
// giveUpSeconds you're told "Sorry, nothing caught, please try again."
GAME_DATA.fishing = { "minSeconds": 5, "maxSeconds": 25, "giveUpSeconds": 20 };
