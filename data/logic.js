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
    "Adventures have to be earned (Scott, 2026-10-14): every 2 Skills unlocks a new one, in random order. The Head Witch and the Head Wizard take turns popping out at the corner of the screen to say a new adventure is waiting; click them to hear where to go. Click Adventure at the top to see your adventures again. An adventure's name and steps stay secret until you find whoever needs help. Doing one again is a little harder: the Pixie's potion has a sip fewer each time (never fewer than 2), and each new unicorn comes out less often.",
    "Adventures earn Adventure Points and show a fun picture when done: love birds for reuniting adventures, a narwhal for water adventures. So far the only adventure is reuniting a blind unicorn with its family.",
    "Going up a Level needs 3 more Adventure Points, Chore Points and Bonding Points and 3 more Skills (skill Levels or spells: 3 Levels of one skill or 1 Level each of three) since your last Level, and costs 10 gems × your Level. Click the Level in the top bar to see your progress.",
    "Bonding Points come from taking care of your pet, and each animal bonds its own way: owls have falconry lessons at the Pet Training Field (the snowy owl can also fly at Windy Peak), cats cuddle on a couch or sofa or play with yarn at Home, capybaras have a bath at Home, turtles go swimming at any water (with a very rare turtle run for bonus points), belugas swim in the lake from the Dock or Pebble Beach, and jellyfish get their tanks cleaned at the Fish Hut. Each one gives +1 Bonding Point, once per pet every 5 minutes.",
    "Fish are healthy food. A fish put in the cooler at Home within 5 minutes of being caught is Sashimi Grade, and fills you up more.",
    "Dancing is just for fun (and a few gems).",
    "Skills are spells you've made and things you've learned, like the piano (Piano Lessons in the Music Classroom at the Wizard School, which is also a rehearsal studio for practising). If you can play the piano, play a song on it in the Disco Dance Hall and everyone dances. The Wizard School is for gaining skills, and each skill has its own number of Levels: Archery 10, Soccer 10, Piano 5. Pass a test to go up one Level; each test is a little harder (a smaller, faster target; a bigger, faster goalie; longer, faster piano tunes). After passing, that test is greyed out for 3 minutes (growing to 5 at the high Levels) before the next one; you can still practise the piano while you wait. Fail and you can try again right away. The top Level is mastered. Click 🎓 Skills in the top bar to see every skill and its Level.",
    "Some actions may need a skill Level, like a spot that needs Piano Level 3 (\"needsSkill\" in data/places.js). It is greyed out until you have it. Nothing needs one yet: we'll decide as we go.",
    "At the Beehive in the Meadows, scoop honey into your pot (up to 5), then put it in your basket. Each scoop has a 1 in 5 chance of bringing the bees out: they spill your pot, and half the time they sting you. Once stung, you can't collect honey until a Healing Potion heals you or 10 minutes pass. Honey is healthy food.",
    "The Pixie hides in a Forest place and flies somewhere else every 3 minutes. Give her a Crystal Fish and she gives you a Finding Potion. The Pixie Quest: the troll stole her Golden Acorn. The troll hides in a Forest place and moves every 2 minutes. The potion has 4 sips and only works where he is: a sip anywhere else flashes up the Forest map showing where he's hiding. Each right answer to one of the troll's riddles gives a map piece; the 3 pieces join up and the Secret Pathway to the Pond House appears on the Forest map (until the quest is done). The acorn is hidden inside: click around to search (\"Warmer!\" when close). Roasting a s'more at the fireplace, drinking the hot chocolate and sitting on the couch each give a clue that narrows down where it is (what it's near, left or right, high or low), and the Pond Turtle (carried in the backpack) wanders the room: its shell glows brighter, from blue to gold, the closer it gets to the acorn, and when it's close it shines and slowly turns the right way, narrowing the search down if you wait. Take the acorn back to the Pixie for 1 Adventure Point; then the quest starts again. The troll then takes his map back, so the next time starts over. At the Pond House a turtle pet lives in the pond, and inside the s'mores take 2 hunger and the hot chocolate 1.",
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
