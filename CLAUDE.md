# Witches and Wizards: wizard school RPG

A family project: Scott drives, his two 9-year-old daughters make the art and design the content. Keep everything simple and readable, so a parent can follow the code and the kids can edit content.

## Rules

- Plain HTML, CSS and vanilla JavaScript. No frameworks, no libraries, no build step.
- Must run by double-clicking `index.html` (file://) and deploy to Netlify as static files.
- All game content (characters, locations, paths, items, levels) lives in `/data`. Never hard-code content in JS.
- Data files are `.js` files holding JSON-style content with one wrapper line, e.g. `GAME_DATA.characters = [ ... ];`, loaded by `<script>` tags. This is so double-clicking index.html works (browsers block reading `.json` from file://). Scott chose this on 2026-10-07.
- Progress is saved in `localStorage` as a list of up to 10 saved games (newest first, `js/save.js`); the title screen has a dropdown to continue one, and the 💾 Switch Game button in the top bar saves and goes back to the title screen. "New Game" adds a new game and, when the list is full, removes the oldest after asking (Scott, 2026-10-10). Saves belong to one browser and one web address.
- The player chooses Witch or Wizard (`player.kind`) at the start; progress is Levels starting at 1, shown as "Witch Level 1" (Scott, 2026-10-10; was Grades).
- Map positions are percentages (x, y) of the map image, so they survive resizing.
- Desktop game for now (Scott, 2026-10-10: no need to design for phones). Map and place pictures grow to fill the window's width or height, whichever runs out first (`.picture` in css/style.css, `--shape` set in js/world.js).
- Style: whimsical and magical, parchment backgrounds, friendly storybook font, big kid-friendly buttons.
- Short functions, plain names, a comment wherever a 9-year-old's parent might wonder "why".
- Build in stages and stop after each one so the family can test. See `PLAN.md`.

## World structure

- `data/places.js` is one list of every place, nested with `in`: World map → territory maps → locations → spots inside (store shelves). `type: "map"` = walkable with roads from `data/paths.js`; `type: "place"` = picture with clickable spots; `type: "person"` = someone in a picture who talks (`says`) when clicked; `type: "fishing"` = a fishing spot (the Lucky Rods at the Dock); `type: "digging"` = a dig spot (Pebble Beach).
- Snack Shack (Mountain): opens at Floor 1 (`place_snack_shack`, with the horned Shopkeeper who talks); a spot leads up to Floor 2 (`snack_shack_upstairs`: cookies, chips, chocolate, candy, fruit gummies, food; the girls' price tags are on the drawing, not for sale yet).
- Territories on the World map: Village, Forest, Mountain, Lake, Meadows (Scott, 2026-10-10: the flowers at the bottom right; placeholder flower map until the girls draw `map_meadows`, nothing inside yet).
- The player types their own name (`playerName`); character names are fixed in `data/characters.js`.
- Items: `data/items.js`. The character's backpack is unseen (`player.backpack`); items can be put down at places (`player.stored[placeId]`).
- Shops outside the Campus Store (the Ski Reserve; Fine Dressmaking in the Village, dresses priced in Crystals from the girls' drawing, Scott 2026-10-10; the Snack Shack's two floors, priced in Gems: everything on Floor 1 is 1 gem, on Floor 2 each shelf's drawn tag sets its snacks' price, food 10, Scott 2026-10-10; snack names on Floor 1 are Claude's) are places with `shelf` set; their items use `inPicture` so only the price tag shows over the drawn item. The Scholarship covers only the Campus Store's shelves.
- Two kinds of money (Scott, 2026-10-10): Crystals (`price`, 💎) and Gems (`gems`, shown with the girls' gem drawing). Gems are rarer and earned by fishing. The girls write prices in gems on their drawings.
- Fishing: `data/fish.js` (fish, their gems and `chance`, and the 5 to 25 second wait; past 20 seconds nothing is caught). Caught fish go in `player.cooler`, add to `player.fishCount` and earn their gems. Treasures (`GAME_DATA.treasures`, also in fish.js: shell, sand dollar) are caught the same way and earn gems but are not fish: they also go in the cooler but never add to `fishCount` (Scott, 2026-10-10; the count is for something later). Code in `js/fishing.js`.
- Digging (Pebble Beach): places with `type: "digging"` and `finds` ("beach" or "crystals"). `data/digging.js` has the beach finds (Bottle Cap 0, Conch Shell 2, Sand Dollar 3 gems, from the girls' drawing) and the dig time; the Crystal Dig Spot (Scott, 2026-10-10): 60% one Crystal, 20% wakes the troll, 20% "tired of digging". Finds go in the bucket and are not fish. Code in `js/digging.js`.
- Mining (Scott, 2026-10-10): the Crystal Cave picture had its crystals and pickaxe rack painted out (original in art/raw/sheets/crystal_cave.jpeg); they are stickers now (`mine_crystal_*`, `mine_pickaxes`, `tool_pickaxe`, `mine_bone` from art/raw/sheets/bone.jpeg). `data/mining.js` sets an invisible grid over the cave; each visit hides 5 crystal, 9 bone and 1 troll squares at random (Scott). Click the rack to take a Pickaxe (into the backpack), then click the wall: a crystal (just 1, crystals are rare) flies to the 💎 counter, a bone flies to the satchel (`player.satchel`, 👜 button), the troll square wakes the troll. At Home the Spell Book Table holds `player.homeMaterials` (materials for spells later). Numbers are Claude's guesses. Code in `js/mining.js`.
- The troll (Scott, 2026-10-10): `data/troll.js`, `js/troll.js`. Woken in the cave or at the Crystal Dig Spot, it shows a big pop-up and steals 1 to 5 Crystals (never more than you have). Its picture is the girls' drawing (`art/raw/troll.jpg`, 2026-10-10). Before that it was a photo of one of the girls, kept only in the local `art/troll/` folder (gitignored, never in the zip or the game link); `js/troll.js` only falls back to it if the drawing is missing.
- Carrying and keeping (Scott, 2026-10-10): catches go in the cooler you carry (`player.cooler`, 🧊 button), dig finds in the bucket (`player.bucket`, 🪣 button). Each carried bag's button (Backpack, Cooler, Bucket, Satchel) shows a small count of what's in it; `writeSave` refreshes the top bar. At Home, clicking the cooler or the treasure chest (furniture with `holds`) opens `player.homeCooler` / `player.homeChest` with a button to empty the carried one into it. Code in `js/storage.js`.
- The store holds only the girls' own items (Scott, 2026-10-10). Claude's suggestions go in `data/ideas.js`, which only the catalog loads ("Ideas" section); never add made-up items to `data/items.js`.
- Movable furniture: `data/furniture.js` lists pieces per room with a rough box; the art script cuts each out (`furniture_<place>_<id>.png`), makes the empty room (`place_<id>_room.png`) and writes the exact boxes to `data/furniture_art.js` (generated). `js/furniture.js` does the 🪑 Rearrange button, dragging and no-overlap; positions save in `player.furniture`. Pieces are cut in list order and a piece never takes bits of one listed before it; `min_part` on a piece keeps small loose bits like shadows; `ink_level` keeps pale colours (the Old Oak's yellow cushion). Rooms with furniture: Snowy Hut (the rec room drawing is the hut itself, Scott 2026-10-10; old saves move from `rec_room` in js/save.js `renamePlace`), Toadstool Cottage, Old Oak (sofa, round stool, cushions; the fireplace, window and birdhouse stay put), Home (dorm room; the girls' labels are erased, Scott 2026-10-10; the tall arched piece is the bird cage with a waterfall into a drinking bowl).
- Broomsticks: 17 from the girls' sheet (art/raw/sheets/broomsticks.jpeg), five to a gap on the broom shelf (`perRow`). The 11 unnamed ones were named by Scott (Iridescent, Sunset, Tangerine, Icy, Bubble, Emerald, Nature, Moon, Comet, Saturn, Play-doh; ids stay `broom_no1`…`broom_no11`). Brooms cost Gems, not Crystals (Scott, 2026-10-10); 5 gems each is Claude's placeholder. Snowflake replaced Snowball; old saves are moved over in js/save.js `renameItem`.
- Chores (Scott, 2026-10-10): `data/chores.js`, code in `js/chores.js`. Clean Room: Home gets one level dirtier (dust bunnies) per minute spent there; with any broomstick in the backpack the 🧹 Clean Room button sweeps it and earns Chore Points (`player.chorePoints`, 1 per level; use not decided). Dirt saves in `player.dirt` / `player.dirtSeconds`. Numbers are Claude's guesses.
- Gameplay ideas (Scott, 2026-10-10): `data/gameplay.js` (catalog only) lists "good things to do" by kind (Bonding, Chores, Mining) and the "metrics" (the top-bar counters). Add ideas there first, mark `inGame` once built.
- Drawings not used yet are listed in `data/extras.js` and shown in the catalog's "Saved for later" section.
- `js/save.js` has `SAVE_VERSION`; bump it when the save's shape changes (old saves are then ignored).

## Art

- Kids' drawings go in `art/raw`. Photos often arrive sideways or upside down; fix with `rotate` in art_config.json (pages) or when cutting a sticker out.
- A photo with several drawings on it is kept whole in `art/raw/sheets` (not processed); each drawing is cut out, turned upright and saved in `art/raw` under its own name.
- Run `python3 tools/process_art.py` (needs `pip install pillow numpy`) to make `art/processed` and `data/drawn.js`.
- Names: `<character id>.jpg` and `<item id>.jpg` become stickers; `map_<place id>.jpg` and `place_<place id>.jpg` become whole pictures on parchment (colour kept).
- Anything not drawn gets a placeholder picture (items show their emoji instead). The game and catalog use `data/drawn.js` to tell drawings from placeholders.
- Per-drawing settings (crop, rotate, erase, washes, gap, min_part, ink_level, see_through, also_as; `see_through` leaves gaps inside open shapes like the pickaxe rack clear) live in `art/art_config.json`. `also_as` reuses one drawing under other names (the one shelf drawing serves all six store shelves).
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

After every change run `python3 tools/bump_version.py` (new `?v=` numbers, so browsers fetch fresh files instead of GitHub Pages' cached copies), then push to GitHub (the public site https://scottluddy.github.io/witches-and-wizards/ redeploys from main). The title screen has a "Check for updates" button that reloads the page.

Republish both after each change, to the same links. Each is published from a scratch copy: the page file is index.html's (or catalog.html's) `<title>`, head links and body content, plus `data/`, `art/processed/` (and for the game `css/`, `js/`) as files. When a file is removed or renamed, pass it as `null` so the old copy is deleted from the artifact.
The Artifact viewer blocks `alert()`, `confirm()` and `prompt()`, so the game never uses them; build questions into the page.
The app's file preview pane can't run the game. Play via the link or the unzipped folder.
