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
    "Most things can only be owned once (pets, wands, brooms, dresses, potions...). Using it up, selling it or trading it lets you get it again.",
    "Supplies stack: you can have up to 3 of each food, drink and bait. A shop has 3 of each and puts one more back on the shelf every 3 minutes, like apples growing back on the tree (5 apples, one grows back every minute).",
    "Adventures earn Adventure Points and show a fun picture when done: love birds for reuniting adventures, a narwhal for water adventures. So far the only adventure is reuniting a blind unicorn with its family.",
    "Going up a Level needs 3 more Adventure Points, Chore Points and Bonding Points and 1 more Skill (a spell) since your last Level, and costs 10 gems × your Level. Click the Level in the top bar to see your progress.",
    "Bonding Points come from taking care of your pet. So far: a bath in the tub at Home, a cuddle on the Cozy Lounge sofa, and letting your snowy owl fly at the Snowy Owl Dropoff on Windy Peak (each once every 5 minutes per pet).",
    "Fish are healthy food. A fish put in the cooler at Home within 5 minutes of being caught is Sashimi Grade, and fills you up more.",
    "Dancing is just for fun (and a few gems).",
    "Skills are spells you've made and things you've learned, like the piano (Piano Lessons in the Music Classroom at the Wizard School, which is also a rehearsal studio for practising). If you can play the piano, play a song on it in the Disco Dance Hall and everyone dances. At the Stadium (through the Sports Classroom) you can earn Archery (15 points with 5 arrows at a moving target) and Soccer (3 goals in 5 kicks past the goalie).",
    "The Pixie hides in a Forest place and flies somewhere else every 3 minutes. Give her a Crystal Fish and she gives you a Finding Potion. Drink it to go to the Troll Bridge; answer the troll's riddle to cross to the Pond House, where a turtle pet lives in the pond and inside there are s'mores to roast (-2 hunger), hot chocolate (-1 hunger) and a couch to cuddle your pet on.",
    "Luck makes good things happen more often. Each Level above 1 makes you 5% luckier, and the Luck Potion adds 25% for 5 minutes.",
    "The troll lives in the Crystal Cave and under the Crystal Dig Spot. When it wakes, it steals 1 to 3 Crystals.",
    "Crystals are rare: an easy way to get them should only just pay off on average (more found than the troll steals, but not by much).",
    "Fishing is the main way to earn Gems. Dancing earns dance points, and every 9 points makes 1 Gem.",
    "The Gems shelf at the Trading Post pays about 90% back for shop things and half the gems for things you caught or found. Scholarship gifts can't be sold.",
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
