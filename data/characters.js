// The characters players can choose from. Each one's name is fixed; the
// player types their own name separately.
// "kind": "witch" (a girl) or "wizard" (a boy). A new Witch picks from the
// witches, a new Wizard from the wizards (Scott, 2026-10-18).
// The picture is art/processed/<id>.png: draw the character, save the photo as
// art/raw/<id>.jpg and run tools/process_art.py. Until then a "?" wizard shows.
GAME_DATA.characters = [
  { "kind": "witch", "id": "charmy",  "name": "Charmy", "description": "Cheerful and brave, with bouncy yellow pigtails." },
  { "kind": "witch", "id": "winky",   "name": "Winky",  "description": "Long golden hair and sparkly eyes that never miss a thing." },
  { "kind": "witch", "id": "rosy",    "name": "Rosy",   "description": "Long flowing hair and a frilly pink party dress." },
  { "kind": "witch", "id": "wanda",   "name": "Wanda",  "description": "Dark pigtails and a twirly blue, pink and red dress." },
  { "kind": "witch", "id": "bany",    "name": "Bany",   "description": "Sunny yellow hair and a cheeky wink." },
  { "kind": "witch", "id": "coachy",  "name": "Coachy", "description": "Round fluffy ears and a pink and purple outfit." },
  { "kind": "witch", "id": "lisley",  "name": "Lisley", "description": "Cosy in a red sweater with a heart, ready for snow." }
];
