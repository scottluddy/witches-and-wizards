// The Beehive in the Meadows (Scott, 2026-10-13): scoop honey from the hive
// into your honey pot, then put it in your basket. But the bees live inside!
// If they come out, you spill the honey in your pot, and you might get stung.
// Once stung you can't collect honey until you're healed: drink a Healing
// Potion, or wait for the sting to get better on its own.
//   potHolds        how much honey your pot holds before you must empty it into the basket
//   beesChance      the chance the bees come out at each scoop (luck makes it smaller)
//   stingChance     when the bees come out, the chance they sting you
//   healMinutes     how long a sting takes to get better on its own
//   healPotion      the potion that heals a sting at once
// The numbers are Claude's guesses.
GAME_DATA.honey = {
  "place": "beehive",
  "potHolds": 5,
  "beesChance": 0.2,
  "stingChance": 0.5,
  "healMinutes": 10,
  "healPotion": "potion_healing"
};

// Honey goes in your fruit basket, and you can eat it.
GAME_DATA.honeyFinds = [
  { "id": "honey", "name": "Honey", "emoji": "🍯", "food": "healthy", "worth": 1,
    "description": "Sweet golden honey from the Beehive in the Meadows." }
];
