// The Flea Market (Scott, 2026-10-17), Floor 3 of the Multi-House.
// Rent the free table from the Market Witch at the head booth, sit down, and
// witches and wizards walking round the market stop to buy things you've
// found (fish, shells, sand dollars, pearls, bones...) and still carry.
// They make an offer and you haggle. The numbers are Claude's first try.
//
//   rentGems      what the table costs; it's yours until you leave the market
//   booth         where the Market Witch's booth is (x, y in percent)
//   tables        the 4 tables; "free" is the one you can rent, the others
//                 have a WIT (one of the game's characters) selling at them
//   door          where shoppers come in and go out
//   shopperEvery  a new shopper comes in every this many seconds (random in between)
//   maxShoppers   how many can be walking round at once
//   hopSeconds    how long a shopper takes to walk from one table to the next
//   youHopSeconds how long you take to walk to the booth or your table (quicker, so you're not kept waiting)
//   stopChance    how often a shopper stops at your table (luck makes it more often)
//
// Haggling: each shopper picks one thing you have and secretly decides the
// most they'll pay ("most", a share of what it's worth). They offer less
// ("firstOffer", a share of their most). You can say yes, or ask for a
// price. If you ask for their most or less, it's a deal. If not, they offer
// once more, closer to their most ("secondOffer", a share of the gap). Ask
// too much a second time and they walk on. Each side makes at most 2 offers.
//   worth: fish, treasures, beach finds and pearls are worth their gems,
//   other things the "worth" below or in their own data file (apples, honey).
// On average a shopper's most is a bit under what a thing is worth, so good
// guessing gets you close to its worth: more than the Gems shelf (half),
// but you pay for the table and wait for shoppers.
GAME_DATA.market = {
  "rentGems": 3,
  "booth": { "x": 50, "y": 20 },
  "tables": [
    { "x": 22, "y": 46, "wit": "charmy" },
    { "x": 78, "y": 46, "wit": "winky" },
    { "x": 22, "y": 76, "wit": "wanda" },
    { "x": 78, "y": 76, "free": true }
  ],
  "door": { "x": 50, "y": 97 },
  "shopperEvery": [5, 10],
  "maxShoppers": 2,
  "hopSeconds": 2.5,
  "youHopSeconds": 1.2,
  "stopChance": 0.7,
  "most": [0.6, 1.15],
  "firstOffer": [0.45, 0.75],
  "secondOffer": [0.4, 0.8],
  "worth": { "mine_bone": 1 },
  "witch": {
    "name": "Market Witch",
    "emoji": "🧙‍♀️",
    "says": "Welcome to the Flea Market! Rent a table for 3 gems and sell the things you've found. Haggle well!"
  },
  // Pictures still to draw (shown on the catalog's Still to Draw page).
  "drawings": [
    { "what": "The Flea Market room: 4 tables and the head booth (Floor 3 of the Multi-House)", "file": "place_multi_flea" },
    { "what": "The Market Witch, who rents out the free table", "file": "market_witch" },
    { "what": "Shoppers walking round the market (for now they're the game's characters)", "file": "market_shoppers" }
  ]
};
