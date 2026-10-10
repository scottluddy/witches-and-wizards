// The characters players can choose from. Each one's name is fixed; the
// player types their own name separately.
// The picture is art/processed/<id>.png: draw the character, save the photo as
// art/raw/<id>.jpg and run tools/process_art.py. Until then a "?" wizard shows.
GAME_DATA.characters = [
  { "id": "charmy",  "name": "Charmy", "description": "Cheerful and brave, with bouncy pigtails." },
  { "id": "winky",   "name": "Winky",  "description": "Sparkly eyes that never miss a thing." },
  { "id": "mystery", "name": "Mystery Wizard", "description": "Waiting to be drawn and named!" }
];
