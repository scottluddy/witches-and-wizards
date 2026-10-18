// The Museum (Scott, 2026-10-15). The places are in data/places.js.
//   ticketGems   what a ticket costs at Pay Here; you need one to go into the
//                Exhibit Hall, and it's used up when you go in
//   ticket       the ticket (data/items.js)
//   says         what the cashier says (from the girls' drawing)
//   Visit every Exhibit Room ("museumRoom" in places.js) after going in, and
//   the Snack Shop opens. That's also "taking a round of the Museum".
//   Museum rules: inside the Museum you can only eat and drink sitting down.
//
// The Tiny Hole, from the girls' "tiny hole notes": "Get the shrink potion
// to get in this hole! P.S. you HAVE to take a round of the museum to get in
// the hole!" You need one of "potions" in your backpack (it's used up).
GAME_DATA.museum = {
  "ticketGems": 5,
  "ticket": "museum_ticket",
  "says": "Hi! Pay me 5 gems to enter.",
  "potions": ["potion_shrink", "potion_shrinking"],
  "notes": "extra_tiny_hole_notes",
  "needPotion": "a Shrink Potion in your backpack (the Campus Store sells them)",
  "needRound": "take a round of the Museum: visit every Exhibit Room",
  "button": "🤏 Drink the Shrink Potion and squeeze in",
  "sitRule": "🪑 Museum rules: no eating or drinking unless you're sitting down! Sit on the chair in the Snack Shop.",
  "sitting": "🪑 You sit down at the table. Now you can eat and drink what's in your backpack."
};

// The Ancient Cat Pirate Room's chest (Scott, 2026-10-17, the girls' idea; their
// drawing and notes 2026-10-18). The start of a treasure hunt: the rest of it
// isn't decided yet.
//   keyChance  percent chance of digging up the Old Key at the Dig Spot (5 =
//              1 in 20). There's only one: once you have it (or have opened
//              the chest) it never turns up again.
//   gems       the surprise inside (the girls' note: "you opened the chest! +20 gems"), once only
//   note       the girls' note that pops up when you click the chest without the key
GAME_DATA.artifactsChest = {
  "key": "quest_old_key",
  "keyChance": 5,
  "gems": 20,
  "note": "extra_chest_note",
  "found": "Something rusty clinks against your shovel... an Old Key! It went into your backpack. What could it open?",
  "locked": "Dig up the key at the Dig Spot, then open the chest for a surprise!",
  "hasKey": "A big old chest with a rusty lock. Your Old Key might fit!",
  "button": "🗝️ Try the Old Key",
  "opened": "Click! The key turns and the lid creaks open. You opened the chest! +GEMS gems! Under the gems is an old rolled-up treasure map. (The rest of this adventure is still being planned.)",
  "openAgain": "The chest is open and empty now, except for the treasure map. It shows the way to... (still being planned!)"
};

// The Ancient Cat Pirate Room's ship model (Scott, 2026-10-18): with a Shrink
// Potion in your backpack (one of GAME_DATA.museum.potions) you can go on it.
// The potion isn't used up, because there's nothing to do on the ship yet.
//   note   the girls' note that pops up when you click the ship without the potion
//   deck   where you stand on the ship (x, y = your feet, size = your height before
//          it's halved, all percent of the room picture; js/you.js sitYouAt)
GAME_DATA.shipModel = {
  "note": "extra_ship_note",
  "noPotion": "Get the Shrink Potion to be on the ship! 💚",
  "hasPotion": "A little model of the cat pirates' ship. You have a Shrink Potion: you could be tiny enough to stand on it!",
  "button": "🤏 Shrink and climb aboard",
  "aboard": "🏴‍☠️ You're tiny, standing on the deck of the ship model! Ahoy! Drag yourself off to climb down.",
  "deck": { "x": 68, "y": 58, "size": 22 }
};
