# Witches and Wizards: wizard school RPG

A family project: Scott drives, his two 9-year-old daughters make the art and design the content. Keep everything simple and readable, so a parent can follow the code and the kids can edit content.

## Rules

- Plain HTML, CSS and vanilla JavaScript. No frameworks, no libraries, no build step.
- Must run by double-clicking `index.html` (file://) and deploy to Netlify as static files.
- All game content (characters, locations, paths, items, levels) lives in `/data`. Never hard-code content in JS.
- Data files are `.js` files holding JSON-style content with one wrapper line, e.g. `GAME_DATA.characters = [ ... ];`, loaded by `<script>` tags. This is so double-clicking index.html works (browsers block reading `.json` from file://). Scott chose this on 2026-10-07.
- Progress is saved in `localStorage`. "New Game" clears it.
- Map positions are percentages (x, y) of the map image, so they survive resizing.
- Style: whimsical and magical, parchment backgrounds, friendly storybook font, big kid-friendly buttons.
- Short functions, plain names, a comment wherever a 9-year-old's parent might wonder "why".
- Build in stages and stop after each one so the family can test. See `PLAN.md`.

## World structure

- `data/places.js` is one list of every place, nested with `in`: World map → territory maps → locations → spots inside (store shelves). `type: "map"` = walkable with roads from `data/paths.js`; `type: "place"` = picture with clickable spots; `type: "person"` = someone in a picture who talks (`says`) when clicked; `type: "fishing"` = a fishing spot (the Lucky Rods at the Dock).
- The player types their own name (`playerName`); character names are fixed in `data/characters.js`.
- Items: `data/items.js`. The character's backpack is unseen (`player.backpack`); items can be put down at places (`player.stored[placeId]`).
- Two kinds of money (Scott, 2026-10-10): Crystals (`price`, 💎) and Gems (`gems`, shown with the girls' gem drawing). Gems are rarer and earned by fishing. The girls write prices in gems on their drawings.
- Fishing: `data/fish.js` (fish, their gems and `chance`, and the 5 to 20 second wait). Caught fish go in `player.cooler` and earn their gems. Code in `js/fishing.js`.
- Drawings not used yet are listed in `data/extras.js` and shown in the catalog's "Saved for later" section.
- `js/save.js` has `SAVE_VERSION`; bump it when the save's shape changes (old saves are then ignored).

## Art

- Kids' drawings go in `art/raw`. Photos often arrive sideways or upside down; fix with `rotate` in art_config.json (pages) or when cutting a sticker out.
- A photo with several drawings on it is kept whole in `art/raw/sheets` (not processed); each drawing is cut out, turned upright and saved in `art/raw` under its own name.
- Run `python3 tools/process_art.py` (needs `pip install pillow numpy`) to make `art/processed` and `data/drawn.js`.
- Names: `<character id>.jpg` and `<item id>.jpg` become stickers; `map_<place id>.jpg` and `place_<place id>.jpg` become whole pictures on parchment (colour kept).
- Anything not drawn gets a placeholder picture (items show their emoji instead). The game and catalog use `data/drawn.js` to tell drawings from placeholders.
- Per-drawing settings (crop, rotate, erase, washes, gap, min_part, also_as) live in `art/art_config.json`. `also_as` reuses one drawing under other names (the one shelf drawing serves all six store shelves).
- On shelf pictures, items stand in the gaps listed by each shelf's `rows` in `data/places.js` ([top, bottom] percent, three items per gap).
- Never edit `art/processed` or `data/drawn.js` by hand; they are regenerated.
- If a map is redrawn, recheck the x/y numbers in `data/places.js` and `data/paths.js` with placement mode (P).

## Folder layout

```
index.html        the game
catalog.html      list of everything in the game and what still needs drawing
css/  js/         style and code
data/             editable game content
art/raw/          original drawings (photos); art/raw/sheets holds whole multi-drawing photos
art/processed/    game-ready PNGs (generated)
tools/            the art script
```

## Playable links

- Game: https://claude.ai/artifact/LCVemmM75u1EtJmvXHjcVw
- Catalog: https://claude.ai/artifact/R2GqZzVSULbfTcxAjHstNN

Republish both after each change, to the same links. Each is published from a scratch copy: the page file is index.html's (or catalog.html's) `<title>`, head links and body content, plus `data/`, `art/processed/` (and for the game `css/`, `js/`) as files. When a file is removed or renamed, pass it as `null` so the old copy is deleted from the artifact.
The Artifact viewer blocks `alert()`, `confirm()` and `prompt()`, so the game never uses them; build questions into the page.
The app's file preview pane can't run the game. Play via the link or the unzipped folder.
