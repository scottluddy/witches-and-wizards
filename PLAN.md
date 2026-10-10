# Build plan

We build in stages and stop after each one to play-test.

## How the world fits together (decided 2026-10-08)
- Layers: the World map → territory maps (Village, Forest, Mountain, Lake) → locations (a drawing with clickable spots) → smaller spots inside (for example the Campus Store's counter and clerk, then one shelf per item category).
- Everything is in `data/places.js`. Each place says which place it's `in`, and where it sits (x/y percentages). `type: "map"` means the character walks on it; `type: "place"` means a picture you click around in.
- Roads are in `data/paths.js`, between places on the same map.
- The player types their own name; each character's name is fixed.
- Each character has an unseen backpack holding all their items (`player.backpack`). They can put items down at Home or other places (`player.stored`).
- Pictures follow the ids: `map_<id>.png` and `place_<id>.png`. The art script makes placeholders for anything not drawn yet and writes `data/drawn.js`.
- `catalog.html` lists every place, character and item with its drawing status. It reads the same data files, so it's always current.

## Done
1. Art processing: `tools/process_art.py` cuts characters and items into stickers, lays drawn maps and places onto parchment, and makes placeholders.
2. Title and character select: New Game, Continue, pick a character, type the player's name.
3. Maps and travel, rebuilt as layers: walk on the World map and territory maps (routes through places in between), click into locations, the store and its shelves, "Back to ..." buttons, P for placement mode on any picture, status counters at the top right. Shelves list their items.

4. Store and belongings (done 2026-10-08): items stand on the shelf pictures (`SHELF_ROWS` in `js/items.js`, or `shelfX`/`shelfY` per item). One free item per category (Scholarship), then items cost Crystals. 🎒 Backpack button at the top right; put things down inside any place (not maps or shelves) and pick them up again.
   The girls' shelf drawing (2026-10-10) is used for all six shelves (`also_as` in art/art_config.json); each shelf's `rows` in places.js says which gaps the items stand in.

## Next
5. Progress: 3 Adventure Points raise the Grade with a celebration; earning Crystals; hidden debug key (D) for +1 Adventure Point and +10 Crystals.

## Data format (decided)
Content files are `data/*.js` holding JSON-style data with one wrapper line (`GAME_DATA.items = [...];`), so double-clicking index.html works.
