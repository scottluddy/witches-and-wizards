"""
Makes the browser-tab icon (favicon) and the home-screen icon from the logo.

The logo is art/logo/logo.png (for now the girls' Head Witch drawing, Scott
2026-10-18). To swap in a new logo, replace that one file and run:

    python3 tools/make_logo.py

Small icons can't show the whole drawing, so they use the top part (the hat
and face), set on parchment so they don't look see-through on dark tabs.
"""

from pathlib import Path
from PIL import Image

LOGO_DIR = Path(__file__).resolve().parent.parent / "art" / "logo"
PARCHMENT = (246, 236, 210, 255)

# Which part of the logo the small icons show, as fractions of its width and
# height (left, top, right, bottom): the hat and face, leaving out the broom.
ICON_BOX = (0.0, 0.0, 0.72, 0.56)

SIZES = {"favicon.png": 64, "apple-touch-icon.png": 180}


def square_icon(logo, size):
    """Crops the hat and face, centres it on a parchment square."""
    w, h = logo.size
    left, top, right, bottom = ICON_BOX
    part = logo.crop((int(w * left), int(h * top), int(w * right), int(h * bottom)))
    part = part.crop(part.getbbox())  # trim empty edges
    side = max(part.size)
    square = Image.new("RGBA", (side, side), PARCHMENT)
    square.alpha_composite(part, ((side - part.width) // 2, (side - part.height) // 2))
    return square.resize((size, size), Image.LANCZOS)


def main():
    logo = Image.open(LOGO_DIR / "logo.png").convert("RGBA")
    for name, size in SIZES.items():
        square_icon(logo, size).save(LOGO_DIR / name)
        print("made", name)


if __name__ == "__main__":
    main()
