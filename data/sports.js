// Sports at the Stadium, in the Wizard School's Sports Classroom (Scott, 2026-10-13).
// The school is for learning: each game is a test for the next Level of that
// skill (1 to 10, data/skills.js). Each Level's test is a little harder.
//
// Archery: click the bow to load an arrow, then click the target to shoot.
// The target moves around. Each ring scores points.
//   centre, radius   where the rings are on the target drawing (percent of its
//                    width and height), measured by Claude
//   rings            from the middle out: how far out it goes (1 = the edge) and its points
//   levels           one line per Level's test (the first line is the test for Level 1):
//                      passPoints   points needed with "arrows" arrows
//                      size         how big the target is (percent of the range's width)
//                      moveSeconds  how long the target takes to move to its next spot
//
// Soccer: the little goalie paces across the goal. Click a spot in the goal to
// kick the ball there.
//   ballSeconds      how long the ball takes to fly to the goal (slower is harder:
//                    the goalie has longer to wander into the way; Scott, 2026-10-13)
//   levels           one line per Level's test:
//                      goalsNeeded    goals needed with "kicks" kicks
//                      goalieWidth    how wide the goalie is (percent of the goal)
//                      goalieSeconds  how long the goalie takes to pace to the next spot
// The numbers are Claude's guesses: Level 1 is about as hard as before.
GAME_DATA.sports = {
  "archery": {
    "skill": "archery", "name": "Archery", "arrows": 5,
    "centre": [54, 47], "radius": [44, 45],
    "rings": [
      { "name": "yellow", "upTo": 0.13, "points": 5 },
      { "name": "red",    "upTo": 0.31, "points": 3 },
      { "name": "blue",   "upTo": 0.56, "points": 2 },
      { "name": "black",  "upTo": 1.0,  "points": 1 }
    ],
    "levels": [
      { "passPoints": 12, "size": 22, "moveSeconds": 1.8 },
      { "passPoints": 13, "size": 21, "moveSeconds": 1.7 },
      { "passPoints": 14, "size": 20, "moveSeconds": 1.6 },
      { "passPoints": 15, "size": 19, "moveSeconds": 1.5 },
      { "passPoints": 15, "size": 18, "moveSeconds": 1.4 },
      { "passPoints": 16, "size": 17, "moveSeconds": 1.3 },
      { "passPoints": 17, "size": 16, "moveSeconds": 1.2 },
      { "passPoints": 18, "size": 15, "moveSeconds": 1.1 },
      { "passPoints": 19, "size": 14, "moveSeconds": 1.0 },
      { "passPoints": 20, "size": 13, "moveSeconds": 0.9 }
    ]
  },
  "soccer": {
    "skill": "soccer", "name": "Soccer", "kicks": 5, "ballSeconds": 0.9,
    "levels": [
      { "goalsNeeded": 3, "goalieWidth": 18, "goalieSeconds": 1.2 },
      { "goalsNeeded": 3, "goalieWidth": 19, "goalieSeconds": 1.1 },
      { "goalsNeeded": 3, "goalieWidth": 20, "goalieSeconds": 1.0 },
      { "goalsNeeded": 3, "goalieWidth": 21, "goalieSeconds": 0.9 },
      { "goalsNeeded": 3, "goalieWidth": 22, "goalieSeconds": 0.85 },
      { "goalsNeeded": 4, "goalieWidth": 22, "goalieSeconds": 0.8 },
      { "goalsNeeded": 4, "goalieWidth": 23, "goalieSeconds": 0.75 },
      { "goalsNeeded": 4, "goalieWidth": 24, "goalieSeconds": 0.7 },
      { "goalsNeeded": 4, "goalieWidth": 25, "goalieSeconds": 0.65 },
      { "goalsNeeded": 4, "goalieWidth": 26, "goalieSeconds": 0.6 }
    ]
  }
};
