// Chores: good things to do that earn Chore Points.
//
// Clean Room (Scott, 2026-10-10): the longer you spend in your room, the
// dirtier it gets. With a broomstick in your backpack you can sweep it clean,
// which earns Chore Points. (What Chore Points are for is still to be decided.)
//
//   place            the room that gets dirty
//   needs            a store category: you need one of these in your backpack
//   secondsPerLevel  seconds spent in the room before it gets one level dirtier
//   levels           how the room looks at each level, from clean to messiest
//   pointsPerLevel   Chore Points earned for each level of dirt swept up
//   sweepSeconds     how long sweeping takes
//   dust             where dust bunnies appear on the picture, as [x, y] percent.
//                    The first few show when it's a little dusty, more as it gets dirtier.
// The numbers are Claude's first guesses; change them to whatever feels right.
GAME_DATA.chores = [
  { "id": "clean_room", "name": "Clean Room", "place": "home", "needs": "Broomstick",
    "secondsPerLevel": 60,
    "levels": ["Sparkling clean", "A little dusty", "Dusty", "Very messy"],
    "pointsPerLevel": 1,
    "sweepSeconds": 3,
    "dust": [[48, 72], [62, 80], [88, 76], [30, 67], [45, 90], [58, 93], [93, 90], [64, 63],
             [15, 96], [76, 66], [5, 66], [52, 82]] }
];
