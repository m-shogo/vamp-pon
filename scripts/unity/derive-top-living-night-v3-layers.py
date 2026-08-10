#!/usr/bin/env python3
"""Derive the TRULY-SEPARABLE structural layers for TOP Living Night V3.

Uses the codex-inpainted clean environment base (00) plus the locked candidate.
Foreground presence = |candidate - environment|; that difference is partitioned by
spatial region into core5 / animal-robot / fire-base / foreground-accents, each an
RGBA cutout of the candidate. 04-distant-town is cut from the environment's town/rail
band. Because the environment contains NO foreground, layers move independently
without ghost/double silhouettes.

Staging only: writes incoming/layers/ (00 is left as produced by codex). Never
touches final/, status, or approval. Pure Pillow.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
V3 = ROOT / "docs/design-targets/generated/top-living-night-v3"
CAND = V3 / "incoming/top-living-night-core5-candidate-430x932.png"
LAYERS = V3 / "incoming/layers"
ENV = LAYERS / "00-environment-base.png"
W, H = 430, 932


def window(box, feather):
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).rectangle([box[0] * W, box[1] * H, box[2] * W, box[3] * H], fill=255)
    return m.filter(ImageFilter.GaussianBlur(feather))


def inv(mask_l):
    return mask_l.point(lambda v: 255 - v)


def mul(a, b):
    return ImageChops.multiply(a, b)


def cutout(cand, alpha_l, name):
    out = cand.convert("RGBA")
    out.putalpha(alpha_l)
    out.save(LAYERS / name, "PNG")
    cov = sum(1 for v in alpha_l.getdata() if v > 12) / (W * H)
    print(f"  {name} {out.size} RGBA alpha_cov={cov:.3f}")
    return out


def main():
    cand = Image.open(CAND).convert("RGB")
    env = Image.open(ENV).convert("RGB")
    assert cand.size == (W, H) and env.size == (W, H)

    # Foreground presence: where the candidate differs from the clean environment.
    diff = ImageChops.difference(cand, env).convert("L")
    fg = diff.point(lambda v: min(255, int(v * 3.2))).filter(ImageFilter.GaussianBlur(1.4))
    fg = fg.point(lambda v: 0 if v < 24 else v)  # drop faint inpaint noise

    # Spatial regions (normalized x0,y0,x1,y1) from the candidate layout.
    r_fire = window((0.38, 0.60, 0.62, 0.78), 8)
    r_animal = window((0.00, 0.60, 0.32, 0.82), 8)
    r_robot = window((0.60, 0.70, 0.92, 0.90), 8)
    r_chars = window((0.05, 0.28, 0.92, 0.84), 10)
    r_lower = window((0.00, 0.80, 1.00, 1.00), 10)

    animal_robot = ImageChops.lighter(r_animal, r_robot)

    # Fire gets its region; animal/robot get theirs; characters get the rest of the
    # character band minus fire and animal/robot; foreground-accents get lower-edge
    # foreground not already claimed.
    a_fire = mul(fg, r_fire)
    a_ar = mul(mul(fg, animal_robot), inv(r_fire))
    a_core = mul(mul(fg, r_chars), mul(inv(r_fire), inv(animal_robot)))
    claimed = ImageChops.lighter(ImageChops.lighter(a_fire, a_ar), a_core)
    a_fore = mul(mul(fg, r_lower), inv(claimed))

    print(f"deriving separable layers from {CAND.name} vs clean {ENV.name}")
    cutout(cand, a_core, "06-core5.png")
    cutout(cand, a_ar, "07-animal-robot.png")
    cutout(cand, a_fire, "09-fire-base.png")
    cutout(cand, a_fore, "15-foreground-accents.png")

    # 04-distant-town: the town/rail depth band taken from the CLEAN environment so it
    # can be addressed as its own mid-depth layer.
    town_band = window((0.02, 0.26, 0.98, 0.46), 12)
    town = env.convert("RGBA")
    town.putalpha(town_band)
    town.save(LAYERS / "04-distant-town.png", "PNG")
    print(f"  04-distant-town.png {town.size} RGBA (from environment town/rail band)")
    print("NOTE: layers staged to incoming/layers/. Environment (00) is foreground-free; "
          "layers are independently movable. No final/, status, or approval touched.")


if __name__ == "__main__":
    main()
