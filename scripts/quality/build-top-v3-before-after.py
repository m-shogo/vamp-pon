#!/usr/bin/env python3
"""Build TOP V3 before/after comparison sheets from two runtime-capture roots.

Usage:
    build-top-v3-before-after.py <before_root> <after_root>

Both roots are `.../runtime-captures/current` style directories produced by the
capture harness. Output comparison PNGs land under <after_root>/review/. This is
a review aid derived from real Unity captures; it promotes no approval flag.
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw

PAD = 14
LABEL_H = 26
BG = (12, 14, 30)
FG = (232, 236, 250)
RESOLUTIONS = ["360x800", "390x844", "430x932"]
STEADY = "frame-t2-5000ms.png"


def load(root: Path, res: str, mode: str) -> Image.Image | None:
    p = root / res / mode / STEADY
    return Image.open(p).convert("RGB") if p.exists() else None


def side_by_side(before: Image.Image, after: Image.Image, title: str, out: Path,
                 scale: float = 0.6) -> None:
    def s(img: Image.Image) -> Image.Image:
        return img.resize((int(img.width * scale), int(img.height * scale)))

    b, a = s(before), s(after)
    cell_w = max(b.width, a.width)
    cell_h = max(b.height, a.height)
    width = cell_w * 2 + PAD * 3
    height = cell_h + LABEL_H * 2 + PAD
    sheet = Image.new("RGB", (width, height), BG)
    draw = ImageDraw.Draw(sheet)
    draw.text((PAD, 6), title, fill=FG)
    sheet.paste(b, (PAD, LABEL_H))
    sheet.paste(a, (PAD * 2 + cell_w, LABEL_H))
    draw.text((PAD, LABEL_H + cell_h + 4), "before (main)", fill=FG)
    draw.text((PAD * 2 + cell_w, LABEL_H + cell_h + 4), "after (this PR)", fill=FG)
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out)


def button_focus(before: Image.Image, after: Image.Image, out: Path) -> None:
    # Buttons + ambient copy occupy the lower part of the frame.
    def crop_bottom(img: Image.Image) -> Image.Image:
        return img.crop((0, int(img.height * 0.62), img.width, img.height))

    side_by_side(crop_bottom(before), crop_bottom(after),
                 "Buttons before / after (430x932 normal, lower frame)", out, scale=1.0)


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit("usage: build-top-v3-before-after.py <before_root> <after_root>")
    before_root = Path(sys.argv[1])
    after_root = Path(sys.argv[2])
    review = after_root / "review"
    made = []
    for res in RESOLUTIONS:
        for mode in ("normal", "reduced"):
            b = load(before_root, res, mode)
            a = load(after_root, res, mode)
            if b is None or a is None:
                continue
            out = review / f"before-after-{res}-{mode}.png"
            side_by_side(b, a, f"{res} {mode} — steady frame", out)
            made.append(out.name)

    b = load(before_root, "430x932", "normal")
    a = load(after_root, "430x932", "normal")
    if b is not None and a is not None:
        out = review / "before-after-buttons.png"
        button_focus(b, a, out)
        made.append(out.name)

    print(f"before/after comparison built: {len(made)} sheets")
    for name in made:
        print(f"  review/{name}")


if __name__ == "__main__":
    main()
