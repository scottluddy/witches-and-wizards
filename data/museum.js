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
