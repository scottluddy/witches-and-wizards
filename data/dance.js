// Solve to Dance in the Mushroom Ring (Scott, 2026-10-10): answer maths
// problems at a 3rd grade level; solve "toDance" of them and you dance.
//
// Dancing is fun, not a gem mine (Scott, 2026-10-11): right answers earn
// dance points, and only every "pointsPerGem" dance points earn 1 gem.
// + and - are worth half as much as × and ÷ (Scott, 2026-10-10).
// The point numbers are Claude's guesses: about 1 gem for every 3 dances.
GAME_DATA.dance = {
  "toDance": 2,           // the drawing says "1 out of 2"
  "addSubtract": 1,       // dance points for a + or - problem
  "multiplyDivide": 2,    // dance points for a × or ÷ problem
  "pointsPerGem": 9,      // this many dance points earn 1 gem
  "biggest": 1000,        // + and - use numbers up to this
  "timesTables": 10       // × and ÷ use the times tables up to this
};
