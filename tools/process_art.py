"""
Turns the kids' drawings in art/raw into game-ready pictures in art/processed,
and makes placeholder pictures for anything that hasn't been drawn yet.

Run it any time you add or change a drawing:

    python3 tools/process_art.py

Needs: pip install pillow numpy

How to name drawings in art/raw (photos or scans, .jpg or .png):
  - Characters:   charmy.jpg                 (the id from data/characters.js)
  - Items:        broom_snowball.jpg         (the id from data/items.js)
  - Maps:         map_world.jpg, map_forest.jpg     ("map_" + id from data/places.js)
  - Places:       place_store.jpg, place_shelf_brooms.jpg   ("place_" + id)
  - Fish:         fish_bubble.jpg            (the id from data/fish.js)
  - Saved for later: extra_gem.jpg           (listed in data/extras.js)

Characters and items are cut out as stickers. Maps and places keep the whole
page, laid onto parchment. Optional per-drawing settings (crop, rotate, ...)
live in art/art_config.json.

It also writes data/drawn.js, the list of pictures that are real drawings, so
the game and the catalog know what still needs drawing.
"""

import json
import shutil
import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

GAME_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = GAME_DIR / "art" / "raw"
OUT_DIR = GAME_DIR / "art" / "processed"
CONFIG_FILE = GAME_DIR / "art" / "art_config.json"

CHARACTER_HEIGHT = 400     # every character ends up this tall (pixels)
ITEM_SIZE = 300            # items fit inside a square this big
ITEM_PREFIXES = ("broom_", "pet_", "potion_", "hat_", "wand_", "special_", "fish_", "extra_", "ski_", "treasure_", "beach_", "mine_", "tool_", "snack_", "lake_", "cafe_")
PICTURE_TYPES = (".jpg", ".jpeg", ".png", ".webp")
GAP_CLOSE = 6              # how big a gap in the pencil lines still counts as closed

DATA_DIR = GAME_DIR / "data"
PICTURE_SIZE = (1600, 1000)  # maps and place pictures
PARCHMENT = (244, 228, 188)
INK = (70, 45, 30)


# ---------------------------------------------------------------- drawings

def load_photo(path, crop):
    """Open a photo the right way up and cut it to the crop box (percentages)."""
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    if crop:
        w, h = img.size
        left, top, right, bottom = crop
        img = img.crop((w * left // 100, h * top // 100, w * right // 100, h * bottom // 100))
    # Work at a sensible size so the script stays quick.
    img.thumbnail((1200, 1200))
    return img


def flatten_paper(img):
    """Even out shadows and lighting so the paper becomes plain white."""
    small = img.resize((max(1, img.width // 8), max(1, img.height // 8)))
    # MaxFilter wipes out the pencil lines, leaving just the paper's brightness.
    paper = small.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(4))
    paper = paper.resize(img.size, Image.BILINEAR)
    a = np.asarray(img, dtype=np.float32)
    p = np.maximum(np.asarray(paper, dtype=np.float32), 1)
    flat = np.clip(a / p, 0, 1)
    return Image.fromarray((flat * 255).astype(np.uint8))


def find_drawing(flat, min_part, gap, ink_level=190, see_through=False):
    """Return a mask (L image) covering the drawing, with its insides filled in.
    ink_level: how pale a mark can be and still count as drawing (0-255; raise
    it for drawings in very light colours, like pale yellow).
    see_through: leave the spaces inside the drawing see-through instead of
    filling them in (for open shapes like the pickaxe rack)."""
    gray = flat.convert("L")
    scale = 500 / max(gray.size)
    small = gray.resize((round(gray.width * scale), round(gray.height * scale)))
    ink = small.point(lambda v: 255 if v < ink_level else 0)
    # Fatten the lines so small gaps in them close up (shrunk back below).
    for _ in range(gap):
        ink = ink.filter(ImageFilter.MaxFilter(3))

    # Everything you can reach from the edge without crossing a line is paper.
    padded = Image.new("L", (ink.width + 2, ink.height + 2), 0)
    padded.paste(ink, (1, 1))
    ImageDraw.floodfill(padded, (0, 0), 128)
    shape = padded.point(lambda v: 0 if v == 128 else 255).crop((1, 1, ink.width + 1, ink.height + 1))
    if see_through:
        shape = ink
    for _ in range(gap - 1):
        shape = shape.filter(ImageFilter.MinFilter(3))

    # Keep only the big pieces (drops stray marks and handwriting).
    labels = shape.copy()
    sizes, label = {}, 1
    while label < 250:
        spots = np.argwhere(np.asarray(labels) == 255)
        if len(spots) == 0:
            break
        y, x = spots[0]
        ImageDraw.floodfill(labels, (int(x), int(y)), label)
        sizes[label] = int((np.asarray(labels) == label).sum())
        label += 1
    if not sizes:
        raise ValueError("no drawing found - try a different crop in art_config.json")
    biggest = max(sizes.values())
    keep = [k for k, n in sizes.items() if n >= biggest * min_part]
    arr = np.isin(np.asarray(labels), keep).astype(np.uint8) * 255

    mask = Image.fromarray(arr).resize(flat.size, Image.BILINEAR)
    mask = mask.filter(ImageFilter.GaussianBlur(2)).point(lambda v: 255 if v > 140 else 0)
    return mask.filter(ImageFilter.MinFilter(3))  # undo the gap-closing growth


def add_outline(img):
    """Give the picture a white sticker edge and a soft shadow."""
    pad = 24
    canvas = Image.new("RGBA", (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad))
    alpha = canvas.getchannel("A")

    edge = alpha.filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(1.5))
    shadow = alpha.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(6))
    shadow = shadow.point(lambda v: v * 0.55)

    out = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    out.paste((60, 30, 90, 255), (0, 0), shadow)        # soft purple glow
    out.paste((255, 255, 255, 255), (0, 0), edge)       # white outline
    return Image.alpha_composite(out, canvas)


def process_drawing(path, settings):
    is_item = path.stem.startswith(ITEM_PREFIXES)
    img = load_photo(path, settings.get("crop"))
    flat = flatten_paper(img)
    if settings.get("whole"):
        # Keep the whole cut-out piece of paper as a little card, for things
        # drawn too small and pale to cut around (the Lakeside Store's food).
        mask = Image.new("L", flat.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, flat.width - 1, flat.height - 1), radius=min(flat.size) // 6, fill=255)
    else:
        mask = find_drawing(flat, settings.get("min_part", 0.15), settings.get("gap", GAP_CLOSE),
                            settings.get("ink_level", 190), settings.get("see_through", False))

    # Brighter colours and darker pencil lines.
    pretty = ImageEnhance.Color(flat).enhance(1.4)
    pretty = ImageEnhance.Contrast(pretty).enhance(1.3)
    pretty = pretty.point(lambda v: int(255 * (v / 255) ** 1.4))  # deepen the lines

    cut = pretty.convert("RGBA")
    cut.putalpha(mask)
    cut = cut.crop(mask.getbbox())

    if is_item:
        cut.thumbnail((ITEM_SIZE, ITEM_SIZE), Image.LANCZOS)
    else:
        width = round(cut.width * CHARACTER_HEIGHT / cut.height)
        cut = cut.resize((width, CHARACTER_HEIGHT), Image.LANCZOS)

    add_outline(cut).save(OUT_DIR / f"{path.stem}.png")


# ---------------------------------------------------------------- reading the game data

def read_data(name):
    """Read a list from one of the data/*.js files (the part between [ and ])."""
    text = (DATA_DIR / name).read_text(encoding="utf-8")
    lines = [line for line in text.splitlines() if not line.strip().startswith("//")]
    text = "\n".join(lines)
    return json.loads(text[text.index("["):text.rindex("]") + 1])


# ---------------------------------------------------------------- whole-page pictures

def parchment(size, seed=3):
    """A plain parchment page with a little speckle."""
    w, h = size
    rng = random.Random(seed)
    paper = Image.new("RGB", size, PARCHMENT)
    d = ImageDraw.Draw(paper)
    for _ in range(w * h // 400):
        x, y = rng.randint(0, w), rng.randint(0, h)
        shade = rng.randint(-14, 8)
        d.ellipse((x, y, x + 3, y + 3), fill=(232 + shade, 214 + shade, 170 + shade))
    return paper


def add_wash(paper, x, y, size, colour, strength=110):
    """A soft blob of watercolour paint, at x, y percentages."""
    w, h = paper.size
    blob = Image.new("L", paper.size, 0)
    r = w * size / 100
    cx, cy = w * x / 100, h * y / 100
    ImageDraw.Draw(blob).ellipse((cx - r, cy - r * 0.8, cx + r, cy + r * 0.8), fill=strength)
    paper.paste(colour, (0, 0), blob.filter(ImageFilter.GaussianBlur(r * 0.35)))


def storybook_edge(img):
    """Darken the edges a little, like an old page."""
    w, h = img.size
    fade = Image.new("L", img.size, 0)
    ImageDraw.Draw(fade).rectangle((30, 30, w - 30, h - 30), fill=255)
    fade = fade.filter(ImageFilter.GaussianBlur(40))
    return Image.composite(img, Image.new("RGB", img.size, (150, 110, 70)), fade)


def process_page(path, settings, furniture=None):
    """A drawn map or place: straighten, crop, clean the paper, lay it on parchment.

    Settings (art_config.json, under the file name):
      rotate  - degrees to turn the photo anticlockwise (90 turns a sideways photo)
      crop    - [left, top, right, bottom] percentages, to cut off the table
      erase   - list of [left, top, right, bottom] boxes (percentages of the
                cropped picture) to rub out stray marks
      washes  - list of [x, y, size, "#colour"] soft paint blobs under the drawing
      also_as - other picture names to use the same drawing for, e.g. one shelf
                drawing for every store shelf: ["place_shelf_brooms", ...]
    """
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    img = img.rotate(settings.get("rotate", 0), expand=True)
    crop = settings.get("crop")
    if crop:
        w, h = img.size
        img = img.crop((w * crop[0] // 100, h * crop[1] // 100, w * crop[2] // 100, h * crop[3] // 100))
    width = PICTURE_SIZE[0]
    img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)

    # White paper, darker pencil, brighter colours (colours are kept).
    drawing = flatten_paper(img)
    drawing = drawing.point(lambda v: 255 if v > 225 else int(255 * (v / 225) ** 3))
    drawing = ImageEnhance.Color(drawing).enhance(1.2)
    rub_out = ImageDraw.Draw(drawing)
    w, h = drawing.size
    for box in settings.get("erase", []):
        rub_out.rectangle((w * box[0] / 100, h * box[1] / 100, w * box[2] / 100, h * box[3] / 100),
                          fill=(255, 255, 255))

    # Lay the drawing on parchment (white paper vanishes, lines and colours stay).
    paper = parchment(drawing.size)
    for x, y, size, colour in settings.get("washes", []):
        add_wash(paper, x, y, size, colour)
    save_page(on_paper(drawing, paper), OUT_DIR / f"{path.stem}.png")

    # Rooms with movable furniture: cut each piece out, and make an empty room.
    if furniture:
        empty = cut_out_furniture(path.stem[len("place_"):], drawing, paper, furniture)
        save_page(on_paper(empty, paper), OUT_DIR / f"{path.stem}_room.png")


def on_paper(drawing, paper):
    """The drawing laid on parchment: white paper vanishes, lines and colours stay."""
    return Image.fromarray((np.asarray(paper, dtype=np.float32) *
                            np.asarray(drawing, dtype=np.float32) / 255).astype(np.uint8))


def save_page(page, out):
    # 256 colours keeps the file small (crayon pictures are huge otherwise),
    # so the whole game stays quick to load and fits in one published page.
    page = storybook_edge(page).quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    page.save(out, optimize=True)


FURNITURE_BOXES = {}  # "place/piece": the exact [left, top, right, bottom] of each cut-out piece


def cut_out_furniture(place_id, drawing, paper, pieces):
    """Save each piece of furniture as its own picture, and return the drawing
    with the pieces rubbed out (the empty room they stand in)."""
    w, h = drawing.size
    empty = drawing.copy()
    for piece in pieces:
        l, t, r, b = piece["box"]
        box = (round(w * l / 100), round(h * t / 100), round(w * r / 100), round(h * b / 100))
        # Cut from the room as it is so far, so a piece never takes bits of a
        # piece listed before it (like a chest's shadow next to a chair).
        part = empty.crop(box)
        mask = find_drawing(part, piece.get("min_part", 0.05), piece.get("gap", GAP_CLOSE),
                            piece.get("ink_level", 190))
        sticker = on_paper(part, paper.crop(box)).convert("RGBA")
        sticker.putalpha(mask)
        inside = mask.getbbox()
        sticker.crop(inside).save(OUT_DIR / f"furniture_{place_id}_{piece['id']}.png")
        # Rub the piece out of the room (a little extra all round, for stray edges).
        rub = mask.filter(ImageFilter.MaxFilter(9))
        empty.paste((255, 255, 255), box, rub)
        FURNITURE_BOXES[f"{place_id}/{piece['id']}"] = [
            round((box[0] + inside[0]) / w * 100, 1), round((box[1] + inside[1]) / h * 100, 1),
            round((box[0] + inside[2]) / w * 100, 1), round((box[1] + inside[3]) / h * 100, 1)]
        print(f"    cut out the {piece['name']}")
    return empty


# ---------------------------------------------------------------- placeholder pictures

THEMES = {
    # territory id: (paint colour, what to scatter around)
    "village":  ("#a8d08a", "houses"),
    "forest":   ("#7fb069", "trees"),
    "mountain": ("#b9c3d6", "mountains"),
    "lake":     ("#9ccbe8", "lake"),
    "meadows":  ("#cde8a0", "flowers"),
}


def draw_flower(d, x, y, s, rng):
    d.line((x, y, x, y + s), fill=(70, 130, 60), width=4)
    petal = rng.choice([(240, 120, 160), (250, 210, 80), (190, 140, 230), (255, 255, 255)])
    for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        px, py = x + dx * s * 0.3, y + dy * s * 0.3
        d.ellipse((px - s * 0.22, py - s * 0.22, px + s * 0.22, py + s * 0.22), fill=petal, outline=INK, width=2)
    d.ellipse((x - s * 0.15, y - s * 0.15, x + s * 0.15, y + s * 0.15), fill=(250, 190, 60), outline=INK, width=2)


def draw_tree(d, x, y, s, rng):
    d.rectangle((x - s * 0.1, y, x + s * 0.1, y + s * 0.45), fill=(110, 75, 45))
    green = (50 + rng.randint(0, 30), 120 + rng.randint(0, 40), 60)
    d.polygon([(x - s * 0.5, y + s * 0.1), (x + s * 0.5, y + s * 0.1), (x, y - s * 0.9)], fill=green,
              outline=INK)
    d.polygon([(x - s * 0.38, y - s * 0.3), (x + s * 0.38, y - s * 0.3), (x, y - s * 1.15)], fill=green,
              outline=INK)


def draw_house(d, x, y, s, roof=(200, 90, 90)):
    """A little house sitting on the point x, y."""
    d.rectangle((x - s * 0.5, y - s * 0.75, x + s * 0.5, y), fill=(250, 238, 205), outline=INK, width=4)
    d.polygon([(x - s * 0.65, y - s * 0.75), (x + s * 0.65, y - s * 0.75), (x, y - s * 1.35)], fill=roof,
              outline=INK)
    d.rectangle((x - s * 0.12, y - s * 0.4, x + s * 0.12, y), fill=(120, 80, 50))


def draw_mountain(d, x, y, s):
    d.polygon([(x - s, y), (x + s, y), (x, y - s * 1.3)], fill=(150, 150, 175), outline=INK)
    d.polygon([(x - s * 0.3, y - s * 0.9), (x + s * 0.3, y - s * 0.9), (x, y - s * 1.3)], fill=(255, 255, 255))


def far_from(points, x, y, gap):
    return all(math.hypot(x - px, y - py) > gap for px, py in points)


def placeholder_map(place, children):
    """A simple painted map with a little house at every place on it."""
    w, h = PICTURE_SIZE
    rng = random.Random(place["id"])
    colour, scatter = THEMES.get(place["id"], ("#c8dca0", "trees"))
    img = parchment(PICTURE_SIZE)
    add_wash(img, 50, 55, 70, colour, strength=150)
    d = ImageDraw.Draw(img)
    spots = [(w * c["x"] / 100, h * c["y"] / 100) for c in children]

    if scatter == "lake":
        d.ellipse((w * 0.3, h * 0.2, w * 0.82, h * 0.68), fill=(140, 195, 230), outline=(80, 140, 200), width=8)
        d.ellipse((w * 0.53, h * 0.36, w * 0.63, h * 0.46), fill=(150, 200, 110), outline=INK, width=3)
        scatter = "trees"
    for _ in range(60):
        x, y = rng.randint(60, w - 60), rng.randint(120, h - 40)
        if not far_from(spots, x, y, 170):
            continue
        if place["id"] == "lake" and ((x / w - 0.56) / 0.28) ** 2 + ((y / h - 0.44) / 0.28) ** 2 < 1:
            continue  # no trees in the water
        if scatter == "trees":
            draw_tree(d, x, y, rng.randint(45, 75), rng)
        elif scatter == "mountains":
            draw_mountain(d, x, y, rng.randint(60, 110))
        elif scatter == "flowers":
            draw_flower(d, x, y, rng.randint(30, 50), rng)
        elif scatter == "houses" and rng.random() < 0.4:
            draw_house(d, x, y, rng.randint(40, 60), roof=(170, 150, 190))
        elif scatter == "houses":
            draw_tree(d, x, y, rng.randint(40, 60), rng)

    for x, y in spots:
        draw_house(d, x, y - 20, 90)
    d.text((w / 2, h - 50), f"Placeholder map. Draw your own and save it as art/raw/map_{place['id']}.jpg",
           fill=INK, anchor="mm", font_size=30)
    storybook_edge(img).save(OUT_DIR / f"map_{place['id']}.png")


def dashed_box(d, box, colour=INK, dash=18, width=5):
    x1, y1, x2, y2 = box
    for x in range(int(x1), int(x2), dash * 2):
        d.line((x, y1, min(x + dash, x2), y1), fill=colour, width=width)
        d.line((x, y2, min(x + dash, x2), y2), fill=colour, width=width)
    for y in range(int(y1), int(y2), dash * 2):
        d.line((x1, y, x1, min(y + dash, y2)), fill=colour, width=width)
        d.line((x2, y, x2, min(y + dash, y2)), fill=colour, width=width)


def placeholder_place(place, children):
    """A 'draw me!' page. Shelves, counters and spots inside get simple shapes."""
    w, h = PICTURE_SIZE
    img = parchment(PICTURE_SIZE, seed=place["id"])
    d = ImageDraw.Draw(img)
    dashed_box(d, (60, 60, w - 60, h - 60), colour=(170, 140, 100))

    if place.get("shelf"):
        # Three empty shelves for the items to sit on.
        # Keep these heights in step with SHELF_ROWS (the bottoms) in js/items.js.
        for y in (0.42, 0.66, 0.90):
            d.rectangle((w * 0.1, h * y, w * 0.9, h * y + 22), fill=(150, 105, 65), outline=INK, width=3)
    for c in children:
        x, y = w * c["x"] / 100, h * c["y"] / 100
        if c.get("shelf"):
            d.rectangle((x - 150, y - 110, x + 150, y + 110), fill=(205, 165, 115), outline=INK, width=5)
            for dy in (-40, 30):
                d.line((x - 140, y + dy, x + 140, y + dy), fill=INK, width=5)
        else:
            dashed_box(d, (x - 140, y - 90, x + 140, y + 90))
    if any(c.get("shelf") for c in children):
        # The shop counter, with the clerk behind it.
        cx, cy = w * 0.5, h * 0.8
        d.ellipse((cx - 45, cy - 230, cx + 45, cy - 140), fill=(250, 220, 190), outline=INK, width=4)
        d.polygon([(cx - 60, cy - 220), (cx + 60, cy - 220), (cx, cy - 330)], fill=(120, 80, 170), outline=INK)
        d.rectangle((cx - 70, cy - 140, cx + 70, cy - 40), fill=(120, 80, 170), outline=INK, width=4)
        d.rectangle((cx - 260, cy - 60, cx + 260, cy + 70), fill=(170, 120, 75), outline=INK, width=5)
        d.text((cx, cy + 5), "the clerk", fill=(255, 245, 225), anchor="mm", font_size=34)

    title_y = h * 0.1 if place.get("shelf") else h * 0.14 if children else h * 0.42
    d.text((w / 2, title_y), place["name"], fill=INK, anchor="mm", font_size=90)
    d.text((w / 2, title_y + 80), f"Draw this place and save it as art/raw/place_{place['id']}.jpg",
           fill=(120, 90, 60), anchor="mm", font_size=32)
    storybook_edge(img).save(OUT_DIR / f"place_{place['id']}.png")


def placeholder_character():
    """A mystery wizard silhouette for characters that haven't been drawn yet."""
    img = Image.new("RGBA", (260, CHARACTER_HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    purple = (120, 90, 160, 255)
    d.polygon([(130, 10), (60, 130), (200, 130)], fill=purple)            # hat
    d.ellipse((30, 115, 230, 150), fill=purple)                           # brim
    d.ellipse((80, 130, 180, 230), fill=purple)                           # head
    d.polygon([(130, 200), (40, CHARACTER_HEIGHT - 20), (220, CHARACTER_HEIGHT - 20)], fill=purple)  # robe
    d.text((130, 290), "?", fill=(255, 240, 200, 255), anchor="mm", font_size=110)
    add_outline(img).save(OUT_DIR / "placeholder_character.png")


# ---------------------------------------------------------------- computer drawings
# A few things are drawn by the computer until the girls draw their own (when
# art/raw has a drawing with the same name, that is used instead).

def draw_bath_tub():
    """A clawfoot bath tub full of bubbles (Scott asked for one, 2026-10-11)."""
    k = 4                                  # draw big, then shrink, for smooth edges
    w, h = 600 * k, 440 * k
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    ink, line = INK + (255,), 7 * k
    gold = (222, 170, 60, 255)
    # Clawfeet.
    for x in (130, 430):
        d.ellipse((x * k, 340 * k, (x + 50) * k, 400 * k), fill=gold, outline=ink, width=line)
    # Tap and pipe on the left.
    d.rectangle((40 * k, 60 * k, 64 * k, 190 * k), fill=(175, 180, 190, 255), outline=ink, width=line)
    d.rectangle((40 * k, 60 * k, 130 * k, 84 * k), fill=(175, 180, 190, 255), outline=ink, width=line)
    d.ellipse((24 * k, 40 * k, 80 * k, 70 * k), fill=(200, 205, 215, 255), outline=ink, width=line)
    # The tub: straight top, round bottom.
    d.rounded_rectangle((60 * k, 150 * k, 560 * k, 370 * k), radius=110 * k,
                        fill=(250, 250, 255, 255), outline=ink, width=line)
    d.rectangle((60 * k + line // 2, 150 * k, 560 * k - line // 2, 255 * k), fill=(250, 250, 255, 255))
    d.line((60 * k, 150 * k, 60 * k, 262 * k), fill=ink, width=line)
    d.line((560 * k, 150 * k, 560 * k, 262 * k), fill=ink, width=line)
    # A pink stripe round the tub.
    d.line((70 * k, 250 * k, 550 * k, 250 * k), fill=(240, 150, 190, 255), width=14 * k)
    # Water and a heap of bubbles on top.
    d.rectangle((48 * k, 138 * k, 572 * k, 162 * k), fill=(140, 200, 240, 255), outline=ink, width=line)
    rng = random.Random(7)
    for _ in range(26):
        x, y, r = rng.randint(90, 530), rng.randint(95, 145), rng.randint(18, 38)
        d.ellipse(((x - r) * k, (y - r) * k, (x + r) * k, (y + r) * k),
                  fill=(255, 255, 255, 255), outline=(150, 190, 225, 255), width=4 * k)
    for x, y, r in ((200, 40, 14), (330, 22, 10), (460, 45, 12)):   # floating bubbles
        d.ellipse(((x - r) * k, (y - r) * k, (x + r) * k, (y + r) * k), outline=(120, 180, 225, 255), width=4 * k)
    img = img.resize((w // k, h // k), Image.LANCZOS)
    return add_outline(img)


COMPUTER_DRAWINGS = {"bath_tub": draw_bath_tub}


# ---------------------------------------------------------------- main

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    config = json.loads(CONFIG_FILE.read_text()) if CONFIG_FILE.exists() else {}

    # 1. The kids' drawings.
    furniture = read_data("furniture.js")
    drawn = []
    for path in sorted(RAW_DIR.iterdir()):
        if path.suffix.lower() not in PICTURE_TYPES:
            continue
        try:
            settings = config.get(path.stem, {})
            if path.stem.startswith(("map_", "place_")):
                pieces = [f for f in furniture if "place_" + f["place"] == path.stem]
                process_page(path, settings, pieces)
            else:
                process_drawing(path, settings)
            drawn.append(path.stem)
            print(f"  made {path.stem}.png from the drawing")
            for other in settings.get("also_as", []):
                shutil.copyfile(OUT_DIR / f"{path.stem}.png", OUT_DIR / f"{other}.png")
                drawn.append(other)
                print(f"  ...and used it for {other}.png")
        except Exception as err:
            print(f"  could not process {path.name}: {err}")

    # 2. Placeholders for every map and place nobody has drawn yet.
    places = read_data("places.js")
    for place in places:
        if place["type"] not in ("map", "place"):
            continue  # people and fishing spots are part of the picture they're in
        kind = "map" if place["type"] == "map" else "place"
        if f"{kind}_{place['id']}" in drawn:
            continue
        children = [p for p in places if p.get("in") == place["id"] and p["type"] in ("map", "place")]
        if kind == "map":
            placeholder_map(place, children)
        else:
            placeholder_place(place, children)
        print(f"  made a placeholder for {kind}_{place['id']}")
    placeholder_character()
    for name, draw in COMPUTER_DRAWINGS.items():
        if name not in drawn:
            draw().save(OUT_DIR / f"{name}.png")
            print(f"  made a computer drawing for {name}")

    # 3. Tell the game which pictures are real drawings.
    (DATA_DIR / "drawn.js").write_text(
        "// Made by tools/process_art.py: the pictures that are real drawings, not placeholders.\n"
        "GAME_DATA.drawn = " + json.dumps(sorted(drawn)) + ";\n", encoding="utf-8")
    (DATA_DIR / "furniture_art.js").write_text(
        "// Made by tools/process_art.py: where each cut-out piece of furniture sits\n"
        "// in its room's drawing, as [left, top, right, bottom] percentages.\n"
        "GAME_DATA.furnitureBoxes = " + json.dumps(FURNITURE_BOXES) + ";\n", encoding="utf-8")
    print(f"Done! Pictures are in {OUT_DIR}")


if __name__ == "__main__":
    main()
