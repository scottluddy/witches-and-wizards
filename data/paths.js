// Roads on the maps. The character walks along these between two places on
// the same map. "via" lists bends in the road (x, y percentages) so the walk
// can follow a drawn street; leave it empty for a straight road.
// If two places have no road between them, the character walks straight there.
GAME_DATA.paths = [
  // The world
  { "from": "village", "to": "forest",   "via": [[30, 50], [27, 64]] },
  { "from": "village", "to": "mountain", "via": [[48, 30], [64, 30]] },
  { "from": "mountain", "to": "lake",    "via": [[86, 42]] },
  { "from": "forest",   "to": "lake",    "via": [[55, 82], [78, 76]] },

  // Village
  { "from": "home",  "to": "store",  "via": [[34, 58]] },
  { "from": "store", "to": "school", "via": [[66, 50]] },
  { "from": "store", "to": "dress_shop", "via": [[36, 36]] },

  // Forest
  { "from": "cabin",   "to": "old_oak",   "via": [[45, 52]] },
  { "from": "old_oak", "to": "mushrooms", "via": [] },

  // Mountain
  { "from": "cave",        "to": "hut",        "via": [] },
  { "from": "hut",         "to": "peak",       "via": [] },
  { "from": "snack_shack", "to": "hut",        "via": [] },
  { "from": "hut",         "to": "ski_reserve", "via": [[66, 30]] },
  { "from": "hut",         "to": "mountain_house", "via": [] },

  // Lake
  { "from": "dock",   "to": "island", "via": [[40, 60]] },
  { "from": "island", "to": "beach",  "via": [] }
];
