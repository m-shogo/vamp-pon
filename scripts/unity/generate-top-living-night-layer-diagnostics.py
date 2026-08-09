#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[2]
LAYER_ROOT = ROOT / "docs/design-targets/generated/top-living-night-v2/layers"
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/diagnostics"
OUTPUT = OUTPUT_DIR / "layer-audit-contact-sheet-v1.png"

COLUMNS = 4
TILE_WIDTH = 270
TILE_HEIGHT = 570
HEADER_HEIGHT = 38
PREVIEW_WIDTH = 244
PREVIEW_HEIGHT = 510
BACKGROUND = (14, 20, 34)
CHECK_A = (38, 44, 58)
CHECK_B = (72, 78, 92)
TEXT = (235, 238, 246)


def checkerboard(size: tuple[int, int], cell: int = 16) -> Image.Image:
    image = Image.new("RGB", size, CHECK_A)
    draw = ImageDraw.Draw(image)
    width, height = size
    for y in range(0, height, cell):
        for x in range(0, width, cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, min(width, x + cell) - 1, min(height, y + cell) - 1), fill=CHECK_B)
    return image


def render_preview(path: Path) -> Image.Image:
    with Image.open(path) as source:
        source.load()
        rgba = source.convert("RGBA")
    preview = ImageOps.contain(rgba, (PREVIEW_WIDTH, PREVIEW_HEIGHT), Image.Resampling.LANCZOS)
    backing = checkerboard((PREVIEW_WIDTH, PREVIEW_HEIGHT))
    x = (PREVIEW_WIDTH - preview.width) // 2
    y = (PREVIEW_HEIGHT - preview.height) // 2
    backing.paste(preview.convert("RGB"), (x, y), preview.getchannel("A"))
    return backing


def layer_paths() -> list[Path]:
    paths = sorted(LAYER_ROOT.glob("*.png"))
    if len(paths) != 17:
        raise RuntimeError(f"TOP V2 diagnostic expects 17 PNG layers, got {len(paths)}")
    return paths


def main() -> None:
    if not LAYER_ROOT.is_dir():
        raise RuntimeError(f"TOP V2 layer root missing: {LAYER_ROOT.relative_to(ROOT)}")
    paths = layer_paths()
    rows = (len(paths) + COLUMNS - 1) // COLUMNS
    canvas = Image.new("RGB", (COLUMNS * TILE_WIDTH, rows * TILE_HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(canvas)

    for index, path in enumerate(paths):
        column = index % COLUMNS
        row = index // COLUMNS
        origin_x = column * TILE_WIDTH
        origin_y = row * TILE_HEIGHT
        label = path.name
        draw.text((origin_x + 12, origin_y + 12), label, fill=TEXT)
        preview = render_preview(path)
        canvas.paste(preview, (origin_x + (TILE_WIDTH - PREVIEW_WIDTH) // 2, origin_y + HEADER_HEIGHT))

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT, format="PNG", optimize=True)
    print("TOP V2 layer diagnostic contact sheet: GENERATED")
    print(f"output={OUTPUT.relative_to(ROOT)}")
    print(f"layers={len(paths)} size={canvas.width}x{canvas.height}")
    print("NOTE: diagnostic artifact may display old/generic humans and must never be used as a generation reference or approval artifact.")


if __name__ == "__main__":
    main()
