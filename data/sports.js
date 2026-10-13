// Sports at the Stadium, in the Wizard School's Sports Classroom (Scott, 2026-10-13).
// Two games, each a Skill you can earn (Skills count toward the next Level):
//
// Archery: click the bow to load an arrow, then click the target to shoot.
// The target moves around. Each ring scores points; score "passPoints" with
// "arrows" arrows to earn the Archery skill (Scott: about 1 yellow, 2 reds and
// 2 blues, which is 5 + 3 + 3 + 2 + 2 = 15).
//   centre, radius   where the rings are on the target drawing (percent of its
//                    width and height), measured by Claude
//   rings            from the middle out: how far out it goes (1 = the edge) and its points
//   moveSeconds      how long the target takes to move to its next spot
//
// Soccer: the little goalie paces across the goal. Click a spot in the goal to
// kick the ball there. Score "goalsNeeded" goals in "kicks" kicks to earn the
// Soccer skill.
//   goalieWidth      how wide the goalie is, in percent of the goal (a kick this
//                    close to the goalie's middle is saved)
//   goalieSeconds    how long the goalie takes to pace to the next spot
GAME_DATA.sports = {
  "archery": {
    "skill": "archery", "name": "Archery", "arrows": 5, "passPoints": 15,
    "centre": [46, 53], "radius": [44, 45],
    "rings": [
      { "name": "yellow", "upTo": 0.13, "points": 5 },
      { "name": "red",    "upTo": 0.31, "points": 3 },
      { "name": "blue",   "upTo": 0.56, "points": 2 },
      { "name": "black",  "upTo": 1.0,  "points": 1 }
    ],
    "moveSeconds": 1.6
  },
  "soccer": {
    "skill": "soccer", "name": "Soccer", "kicks": 5, "goalsNeeded": 3,
    "goalieWidth": 20, "goalieSeconds": 0.9
  }
};
