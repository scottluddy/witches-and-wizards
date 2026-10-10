# Witches and Wizards

A family wizard-school adventure game built from the kids' drawings.

## Play

Download or clone this repo and double-click `index.html`. No install or server needed.
`catalog.html` shows every item in the game.

## Adding drawings

Put new photos in `art/raw/`, set their crop in `art/art_config.json`, then run:

```
python3 tools/process_art.py
```

That regenerates `art/processed/` and `data/drawn.js`.

See `PLAN.md` for the build stages and `CLAUDE.md` for the game's rules and world layout.
