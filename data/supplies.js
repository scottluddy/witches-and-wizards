// Supplies (Scott, 2026-10-13): food, drinks and bait can be bought more than
// once. Everything else (pets, wands, brooms, dresses, hats, potions...) is a
// keepsake: one of each, and you can buy it again once it's used up or sold.
//   most            how many of one supply you can have (carried plus put away)
//   shopStock       how many of each supply a shop has on its shelf
//   restockMinutes  a shop puts one more back on the shelf this often, like
//                   apples growing back on the tree
//   alsoSupplies    things that aren't food but stack too
GAME_DATA.supplies = {
  "most": 3,
  "shopStock": 3,
  "restockMinutes": 3,
  "alsoSupplies": ["lake_bait_worm", "lake_bait_jar"]
};
