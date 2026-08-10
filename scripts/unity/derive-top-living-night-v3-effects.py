#!/usr/bin/env python3
"""Deterministically derive the 10 TOP Living Night V3 effect companions from the
locked Core5 candidate. Staging only: writes to incoming/effects/, never to final/,
never mutates status/approval/readiness. Pure Pillow, fixed seed, exact contract
dimensions and real alpha.

Masks are registered to the candidate by sampling its warm/cool luminance inside
per-effect regions of interest; atlases are procedural sprite sheets at the exact
contract grid. Outputs are CANDIDATE-quality staging, not approved final assets.
"""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
V3 = ROOT / "docs/design-targets/generated/top-living-night-v3"
CANDIDATE = V3 / "incoming/top-living-night-core5-candidate-430x932.png"
OUT = V3 / "incoming/effects"
W, H = 430, 932

random.seed(20260810)


def load_candidate() -> Image.Image:
    if not CANDIDATE.exists():
        raise SystemExit(f"ERROR: candidate missing: {CANDIDATE}")
    return Image.open(CANDIDATE).convert("RGB")


def region_window(box_frac, feather):
    """White soft-edged window (L) over a fractional bbox on a black field."""
    win = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(win)
    x0, y0, x1, y1 = box_frac
    d.rectangle([x0 * W, y0 * H, x1 * W, y1 * H], fill=255)
    return win.filter(ImageFilter.GaussianBlur(feather))


def warm_luma(cand: Image.Image) -> Image.Image:
    r, g, b = cand.split()
    lum = cand.convert("L")
    warmth = ImageChops.subtract(r, b)  # >0 where amber/warm
    return ImageChops.multiply(lum, warmth.point(lambda v: min(255, v * 3)))


def cool_luma(cand: Image.Image) -> Image.Image:
    r, g, b = cand.split()
    lum = cand.convert("L")
    coolth = ImageChops.subtract(b, r)  # >0 where blue/cool
    return ImageChops.multiply(lum, coolth.point(lambda v: min(255, v * 4)))


def tinted_mask(mask_l: Image.Image, rgb, gain=1.0, blur=6.0) -> Image.Image:
    a = mask_l.point(lambda v: min(255, int(v * gain))).filter(
        ImageFilter.GaussianBlur(blur)
    )
    out = Image.new("RGBA", (W, H), (rgb[0], rgb[1], rgb[2], 0))
    out.putalpha(a)
    return out


def save(img: Image.Image, name: str, expect):
    OUT.mkdir(parents=True, exist_ok=True)
    p = OUT / name
    img.save(p, "PNG")
    assert img.size == expect, (name, img.size, expect)
    print(f"  {name} {img.size} {img.mode}")


# ---------- full-canvas 430x932 effects ----------

def eff_stars():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for _ in range(90):
        x = random.randint(0, W - 1)
        y = random.randint(6, int(H * 0.42))  # sky band only
        fade = 1.0 - (y / (H * 0.42))
        a = int(40 + 150 * fade * random.random())
        s = random.choice([0, 0, 0, 1])
        d.ellipse([x - s, y - s, x + s, y + s], fill=(255, 252, 235, a))
    return img.filter(ImageFilter.GaussianBlur(0.4))


def _cloud_band(y_center_frac, thickness_frac, alpha, blobs):
    img = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(img)
    yc = y_center_frac * H
    th = thickness_frac * H
    for _ in range(blobs):
        cx = random.randint(-60, W + 60)  # overscan for drift
        cy = yc + random.uniform(-th, th)
        rw = random.uniform(50, 140)
        rh = random.uniform(12, 30)
        d.ellipse([cx - rw, cy - rh, cx + rw, cy + rh], fill=random.randint(40, 90))
    img = img.filter(ImageFilter.GaussianBlur(18))
    out = Image.new("RGBA", (W, H), (150, 160, 185, 0))
    out.putalpha(img.point(lambda v: int(v * alpha)))
    return out


def eff_clouds_far():
    return _cloud_band(0.20, 0.05, 0.55, 26)


def eff_clouds_near():
    return _cloud_band(0.30, 0.08, 0.75, 34)


def eff_distant_lights(cand):
    win = region_window((0.30, 0.22, 0.62, 0.40), 10)
    m = ImageChops.multiply(warm_luma(cand), win)
    m = m.point(lambda v: 255 if v > 55 else v)  # keep small bright town windows
    return tinted_mask(m, (255, 196, 120), gain=1.6, blur=2.5)


def _brightest_point(gray_l, box_frac):
    """Locate the brightest pixel of a single-channel image inside a bbox."""
    x0, y0 = int(box_frac[0] * W), int(box_frac[1] * H)
    x1, y1 = int(box_frac[2] * W), int(box_frac[3] * H)
    crop = gray_l.crop((x0, y0, x1, y1))
    px = crop.load()
    best, bx, by = -1, (x0 + x1) // 2, (y0 + y1) // 2
    for j in range(crop.height):
        for i in range(crop.width):
            v = px[i, j]
            if v > best:
                best, bx, by = v, x0 + i, y0 + j
    return bx, by, best


def eff_robot_eye(cand):
    # The robot eye is a small, bright cool point; detect it and stamp a local glow.
    box = (0.50, 0.64, 0.80, 0.84)
    ex, ey, peak = _brightest_point(cool_luma(cand), box)
    a = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(a)
    r = 10
    d.ellipse([ex - r, ey - r, ex + r, ey + r], fill=210)
    d.ellipse([ex - 4, ey - 4, ex + 4, ey + 4], fill=255)
    a = a.filter(ImageFilter.GaussianBlur(5))
    print(f"    robot-eye peak={peak} at ({ex},{ey})")
    out = Image.new("RGBA", (W, H), (120, 200, 255, 0))
    out.putalpha(a)
    return out


def eff_fire_glow(cand):
    win = region_window((0.34, 0.50, 0.66, 0.74), 14)
    m = ImageChops.multiply(warm_luma(cand), win)
    return tinted_mask(m, (255, 150, 70), gain=1.5, blur=10.0)


def eff_lantern_glow(cand):
    # warm brights across the scene, minus the central fire region.
    full = warm_luma(cand)
    fire_win = region_window((0.34, 0.48, 0.66, 0.76), 16)
    fire_inv = fire_win.point(lambda v: 255 - v)
    m = ImageChops.multiply(full, fire_inv)
    # restrict to the mid character band, keep it local
    band = region_window((0.05, 0.28, 0.95, 0.70), 12)
    m = ImageChops.multiply(m, band)
    return tinted_mask(m, (255, 205, 120), gain=1.7, blur=6.0)


# ---------- procedural sprite atlases ----------

def _flame_lobe(draw, cx, base, w, h, col, alpha, rnd, wobble):
    """A soft organic flame lobe built from stacked tapering ellipses."""
    steps = 16
    for s in range(steps):
        t = s / (steps - 1)
        y = base - h * t
        lw = w * (1.0 - t) ** 0.85 * (1 + wobble * math.sin(t * 6 + rnd.random() * 3) * 0.12)
        sway = wobble * math.sin(t * 3.1 + rnd.random()) * w * 0.10 * t
        a = int(alpha * (0.55 + 0.45 * (1 - t)))
        draw.ellipse([cx - lw / 2 + sway, y - lw * 0.55, cx + lw / 2 + sway, y + lw * 0.55],
                     fill=col + (a,))


def _flame_frame(size, seed_i):
    rnd = random.Random(1000 + seed_i)
    cell = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(cell)
    cx = size / 2
    base = size * 0.80
    wob = 1.0 + 0.5 * math.sin(seed_i)
    # outer amber -> mid orange -> inner gold, each taller/thinner, painterly stacked.
    _flame_lobe(d, cx, base, size * 0.46, size * 0.58 * (1 + rnd.uniform(-0.05, 0.08)),
                (214, 96, 34), 150, rnd, wob)
    _flame_lobe(d, cx, base, size * 0.32, size * 0.50 * (1 + rnd.uniform(-0.05, 0.08)),
                (240, 150, 58), 190, rnd, wob)
    _flame_lobe(d, cx, base, size * 0.19, size * 0.40 * (1 + rnd.uniform(-0.05, 0.08)),
                (255, 214, 130), 220, rnd, wob)
    cell = cell.filter(ImageFilter.GaussianBlur(size * 0.03))
    # warm coal bed
    coal = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    dc = ImageDraw.Draw(coal)
    for _ in range(10):
        r = rnd.uniform(size * 0.02, size * 0.05)
        x = cx + rnd.uniform(-size * 0.2, size * 0.2)
        y = base + rnd.uniform(-size * 0.02, size * 0.06)
        dc.ellipse([x - r, y - r, x + r, y + r], fill=(200, 70, 28, rnd.randint(120, 200)))
    coal = coal.filter(ImageFilter.GaussianBlur(size * 0.02))
    cell = Image.alpha_composite(cell, coal)
    # subtle paper grain in the lit area
    grain = Image.effect_noise((size, size), 18).convert("L").point(lambda v: max(0, v - 128))
    tex = Image.new("RGBA", (size, size), (255, 200, 140, 0))
    tex.putalpha(ImageChops.multiply(grain, cell.getchannel("A")).point(lambda v: v // 3))
    return Image.alpha_composite(cell, tex)


def atlas_fire():
    AW, AH, cols, rows = 1448, 1086, 4, 3
    cw, ch = AW // cols, AH // rows  # 362x362
    atlas = Image.new("RGBA", (AW, AH), (0, 0, 0, 0))
    for i in range(cols * rows):
        atlas.paste(_flame_frame(cw, i), ((i % cols) * cw, (i // cols) * ch))
    return atlas


def _smoke_frame(size, seed_i):
    rnd = random.Random(2000 + seed_i)
    cell = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(cell)
    x = size * 0.5
    y = size * 0.9
    for _ in range(6):
        r = rnd.uniform(size * 0.06, size * 0.14)
        x += rnd.uniform(-size * 0.06, size * 0.06)
        y -= size * 0.13
        d.ellipse([x - r, y - r, x + r, y + r], fill=rnd.randint(30, 70))
    cell = cell.filter(ImageFilter.GaussianBlur(size * 0.05))
    out = Image.new("RGBA", (size, size), (170, 170, 175, 0))
    out.putalpha(cell)
    return out


def atlas_smoke():
    AW, AH, cols, rows = 1536, 1024, 3, 2
    cw, ch = AW // cols, AH // rows  # 512x512
    atlas = Image.new("RGBA", (AW, AH), (0, 0, 0, 0))
    for i in range(cols * rows):
        atlas.paste(_smoke_frame(cw, i), ((i % cols) * cw, (i // cols) * ch))
    return atlas


def _ember_frame(size, seed_i):
    rnd = random.Random(3000 + seed_i)
    cell = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(cell)
    for _ in range(rnd.randint(2, 4)):
        x = rnd.randint(4, size - 4)
        y = rnd.randint(4, size - 4)
        a = rnd.randint(120, 230)
        d.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(255, 190, 110, a))
    return cell


def atlas_embers():
    AW, AH, cols, rows = 256, 128, 4, 2
    cw, ch = AW // cols, AH // rows  # 64x64
    atlas = Image.new("RGBA", (AW, AH), (0, 0, 0, 0))
    for i in range(cols * rows):
        atlas.paste(_ember_frame(cw, i), ((i % cols) * cw, (i // cols) * ch))
    return atlas


def main():
    cand = load_candidate()
    print(f"deriving effects from {CANDIDATE.relative_to(ROOT)} {cand.size}")
    save(eff_stars(), "01-stars.png", (W, H))
    save(eff_clouds_far(), "02-clouds-far.png", (W, H))
    save(eff_clouds_near(), "03-clouds-near.png", (W, H))
    save(eff_distant_lights(cand), "05-distant-lights-mask.png", (W, H))
    save(eff_robot_eye(cand), "08-robot-eye-mask.png", (W, H))
    save(atlas_fire(), "10-fire-flipbook-atlas.png", (1448, 1086))
    save(eff_fire_glow(cand), "11-fire-glow-mask.png", (W, H))
    save(atlas_smoke(), "12-smoke-atlas.png", (1536, 1024))
    save(atlas_embers(), "13-embers-atlas.png", (256, 128))
    save(eff_lantern_glow(cand), "14-lantern-glow-mask.png", (W, H))
    print("NOTE: 10 effect companions staged to incoming/effects/ only. "
          "Candidate-derived, unapproved. No final/, status, or approval touched.")


if __name__ == "__main__":
    main()
