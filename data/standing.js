// Where your own character stands when you walk into a place (Scott, 2026-10-17:
// show the player's character wherever possible). x, y are where your feet are
// (percent of the picture), size is your height in percent of the picture.
// Clicking a seat sits you down instead (sitAt in data/places.js).
GAME_DATA.standing = {
  "where": { "x": 9, "y": 98, "size": 26 },

  // Places where you'd get in the way, or something else already shows you:
  // shelf close-ups, the Wizard School's boxes, the Flea Market (you walk in there), the roller coaster
  // (the car carries you), and the dark ski slope search.
  "skip": ["multi_flea", "multi_coaster", "ski_slope", "multi_house", "school",
           "trade_wands_right", "trade_potions_right", "trade_pets_right", "trade_brooms_right"],

  // Places where the corner isn't a good spot.
  "places": {
    "beach":             { "x": 45, "y": 99 },
    "cafe":              { "x": 92, "y": 98 },
    "crafting_cabin":    { "x": 72, "y": 98 },
    "fish_hut":          { "x": 44, "y": 99, "size": 20 },
    "museum":            { "x": 55, "y": 97 },
    "museum_snack_shop": { "x": 88, "y": 98 },
    "mushrooms":         { "x": 50, "y": 98 },
    "old_oak":           { "x": 92, "y": 98 },
    "pearl_cave":        { "x": 90, "y": 98 },
    "pond_house_inside": { "x": 85, "y": 98 },
    "store":             { "x": 90, "y": 98 },
    "tiny_hole":         { "x": 50, "y": 98 },
    "treehouse":         { "x": 50, "y": 98 }
  }
};
