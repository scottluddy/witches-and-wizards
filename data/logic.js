// Game play logic, shown in the catalog only (the game doesn't read this file).
// A plain picture of how the game works: the basic rules, the bags you carry
// and what goes in them. The catalog adds the rest straight from the game's
// data (where you earn and spend Crystals and Gems, what each territory has),
// so those parts stay up to date by themselves.
GAME_DATA.logic = {
  "rules": [
    "You pick a character, choose Witch or Wizard, and type your name. You start at Witch (or Wizard) Level 1.",
    "Walk between places on each map. Walking makes you hungry, and hunger slows you down: full speed at 0 to 3, three quarter speed at 4 to 6, two thirds at 7 to 9, half speed at 10.",
    "Eating takes hunger away: healthy food by its full price, snacks by half their price.",
    "There are two kinds of money. Crystals (💎) are common and buy dresses. Gems are rarer and buy almost everything else.",
    "The Scholarship gives one free item from each Campus Store shelf.",
    "Each item can only be owned once. Eating a snack, selling it or trading it lets you get it again.",
    "Adventures earn Adventure Points. So far the only adventure is reuniting a blind unicorn with its family.",
    "The troll lives in the Crystal Cave and under the Crystal Dig Spot. When it wakes, it steals 1 to 5 Crystals.",
    "Things you catch, dig, mine and pick go in a bag you carry. At Home you can empty the bags for keeping.",
    "Nothing is ever lost when you leave a place, except the pickaxe, which goes back on its rack."
  ],
  "containers": [
    { "name": "Backpack", "emoji": "🎒", "holds": "Items you buy, get free or trade for (pets, potions, wands, brooms, dresses, snacks...).",
      "empty": "Put things down inside any place, and pick them up again later." },
    { "name": "Cooler", "emoji": "🧊", "holds": "Fish and treasures from the Lucky Rods.", "empty": "Into the cooler at Home." },
    { "name": "Bucket", "emoji": "🪣", "holds": "Beach finds from the Dig Spot.", "empty": "Into the treasure chest at Home." },
    { "name": "Satchel", "emoji": "👜", "holds": "Bones from the Crystal Cave.", "empty": "Onto the Spell Book Table at Home." },
    { "name": "Fruit basket", "emoji": "🧺", "holds": "Fruit from the Fruit Orchard.", "empty": "Eat it, or hold one to feed a unicorn." },
    { "name": "Your hand", "emoji": "✋", "holds": "One fruit taken out of the basket.", "empty": "Feed it to a unicorn, or put it back." },
    { "name": "Spell book", "emoji": "📖", "holds": "Spells you make at the Crafting Table.", "empty": "Spells stay forever." }
  ],
  // Guesses the catalog uses to work out "about how many per minute" (Claude's guesses).
  "estimates": {
    "secondsPerDanceProblem": 15,
    "secondsPerMineClick": 1.5
  }
};
