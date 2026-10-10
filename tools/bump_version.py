"""
Gives the game a new version number, so browsers fetch the newest files
instead of old copies they kept (GitHub Pages lets browsers keep files for
about 10 minutes).

Run it after changing anything:

    python3 tools/bump_version.py

It updates every "?v=" in index.html and catalog.html, and GAME_VERSION
(which the game adds to picture addresses).
"""

import re
from pathlib import Path

GAME_DIR = Path(__file__).resolve().parent.parent
PAGES = [GAME_DIR / "index.html", GAME_DIR / "catalog.html"]


def main():
    text = PAGES[0].read_text(encoding="utf-8")
    found = re.search(r'GAME_VERSION = "(\d+)"', text)
    version = int(found.group(1)) + 1 if found else 1
    for page in PAGES:
        text = page.read_text(encoding="utf-8")
        text = re.sub(r'\?v=\d+', f"?v={version}", text)
        text = re.sub(r'GAME_VERSION = "\d+"', f'GAME_VERSION = "{version}"', text)
        page.write_text(text, encoding="utf-8")
    print(f"Version is now {version}")


if __name__ == "__main__":
    main()
