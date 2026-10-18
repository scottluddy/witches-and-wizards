// The Invisibility Room (Scott, 2026-10-18), Floor 4 of the Multi-House.
// A plain white room. Things written on its wall can only be seen in the
// purple glow of a Blacklight. You stand in the middle at the bottom; shine
// the light and drag its glow left and right across the wall. With Invisible
// Ink you can write on the wall yourself (it starts blank).
//
//   place            the room
//   blacklight       the item that shines the light (one only, kept for good)
//   blacklightChance percent chance a cave square of plain rock hides the Blacklight (5 = 1 in 20, Scott)
//   ink              the item you write with
//   inkChance        percent chance a dig at the Dig Spot turns up Invisible Ink (5 = 1 in 20, Scott)
//   writesPerBottle  how many things one bottle of ink can write (Claude's guess)
//   maxLetters       the longest thing you can write at once (Claude's guess)
//   maxWritings      how many writings the wall holds; past that the oldest fades away (Claude's guess)
//   beamWidth        how wide the light's glow is, in percent of the picture (Scott: about a tenth)
// Finding them: you only find one of each while you don't already have one.
GAME_DATA.invisibleRoom = {
  "place": "multi_invisible",
  "blacklight": "tool_blacklight",
  "blacklightChance": 5,
  "ink": "tool_invisible_ink",
  "inkChance": 5,
  "writesPerBottle": 3,
  "maxLetters": 30,
  "maxWritings": 20,
  "beamWidth": 10,
  "words": {
    "blank": "A plain white room. It's very quiet in here...",
    "noLight": "It's too dark to see anything special. You need a Blacklight. Maybe one is hidden deep in a cave...",
    "lightOn": "🔦 Drag the purple glow left and right across the wall.",
    "lightOff": "You switch the Blacklight off. The wall is plain white again.",
    "noInk": "You need Invisible Ink to write on the wall. Maybe some is buried at the beach...",
    "write": "What do you want to write? (Up to MAX letters. The bottle has LEFT more to write.)",
    "aim": "✍️ Now click the wall where you want to write it.",
    "wrote": "You wrote it! But it's invisible... shine the Blacklight to see it.",
    "lastInk": "That was the last of the ink. The empty bottle is gone.",
    "foundLight": "🔦 Something purple glints in the rock... a Blacklight! It went into your backpack.",
    "foundInk": "Your shovel hits a tiny bottle... Invisible Ink! It went into your backpack. The bottle looks empty, but it isn't!"
  }
};
