// The Pet Training Field's agility park (Scott, 2026-10-18: the girls' drawing;
// 2026-10-19: "there are only 2 activities"). Code in js/agility.js.
//
// Your dogs and wolves come out of your backpack and stand next to you. Drag
// one and drop it:
//   on the Starting Line    it walks a lap of the track, then runs one
//   on the Obstacle Course  it goes through every obstacle in order: up and
//                           over the ramp, in and out of the weave posts,
//                           through the bendy tunnel, through the three hoops
//                           and through the long tunnel
// Each one finished: +1 Bonding Point, once per pet every 5 minutes
// (data/bonding.js "pet_walk" and "pet_tricks").
//
//   animals        which pets can train here (Scott, 2026-10-19: dogs and wolves for now)
//   dropReach      how close (percent of the picture) a drop must be to a start to count
//   petSize        a pet's height compared with yours standing at the same spot
//   speed          how fast each animal goes, in percent of the picture per second
//   tunnelSeconds  how long a pet is out of sight inside a tunnel (Scott: "a couple seconds")
//   track          the oval path: its middle, how wide and tall it is (half), and
//                  the laps: "walk" or "run", one after the other
//   course         where it starts, then each step of the way: "to" is where the
//                  pet's feet go next; "jump" makes it hop up that high on the way
//                  (hoops, onto and off the ramp); "hidden" means inside a tunnel
GAME_DATA.agility = {
  "animals": ["dog", "wolf"],
  "dropReach": 9,
  "petSize": 0.7,
  "speed": {
    "dog":  { "walk": 12, "run": 22 },
    "wolf": { "walk": 14, "run": 28 }
  },
  "tunnelSeconds": 2,
  "track": {
    "start": [50, 89],
    "middle": [50.5, 51],
    "size": [42, 38],
    "laps": ["walk", "run"]
  },
  "course": {
    "start": [21, 50],
    "steps": [
      { "to": [25, 46] },
      { "to": [29, 39], "jump": 3, "name": "ramp" },
      { "to": [35, 37] },
      { "to": [39, 43], "jump": 3 },
      { "to": [42, 37], "name": "weave posts" },
      { "to": [44.5, 41] }, { "to": [47, 35] }, { "to": [50, 40] }, { "to": [53, 33] },
      { "to": [56.5, 39] }, { "to": [60, 32] }, { "to": [62.5, 38] }, { "to": [65, 31] },
      { "to": [69, 37] }, { "to": [73, 33] }, { "to": [77, 37] },
      { "to": [75, 42], "name": "bendy tunnel" },
      { "to": [75, 66], "hidden": true },
      { "to": [70, 63] },
      { "to": [65, 59], "name": "hoops" },
      { "to": [57, 59], "jump": 5 },
      { "to": [48.5, 59], "jump": 7 },
      { "to": [40.5, 59], "jump": 5 },
      { "to": [43, 72], "name": "long tunnel" },
      { "to": [64, 72], "hidden": true },
      { "to": [69, 77] }
    ]
  },
  "words": {
    "noPets": "Bring a dog or a wolf in your backpack to train here.",
    "ready": "🐾 Drag PET onto the Starting Line to do laps, or onto the Obstacle Course to run it.",
    "dragHere": "Drag your dog or wolf from beside you and drop it here.",
    "walking": "🐾 PET is walking a lap of the track...",
    "running": "💨 Now PET is running a lap!",
    "laps": "🏁 PET finished the laps!",
    "obstacle": "PET heads for the OBSTACLE...",
    "course": "🏆 PET went through every obstacle!",
    "practice": "Great practice! PET can earn another Bonding Point in MIN min.",
    "stopped": "You picked PET up. Drop it on the Starting Line or the Obstacle Course."
  }
};
