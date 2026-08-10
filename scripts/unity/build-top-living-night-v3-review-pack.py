#!/usr/bin/env python3
"""Build TOP Living Night V3 review artifacts for PR review (staging only).

Writes contact sheets, a safe-area overlay, an identity map, a fire-motion GIF and
a semantic parallax diagnostic into incoming/review/. Deterministic, pure Pillow.
Never touches final/, status, or approval.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
V3 = ROOT / "docs/design-targets/generated/top-living-night-v3"
I = V3 / "incoming"
REV = I / "review"
W, H = 430, 932

# Single source of truth: the runtime FireFlipbook anchor. The review overlay and the
# emitted fire-anchor.json READ this value; the drift checker asserts they stay in sync.
VIEW_CS = ROOT / "unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightView.cs"


def runtime_final_fire_anchor():
    """Parse FinalV3FireAnchor (bottom-referenced) from the runtime; return top-ref (x,y)."""
    src = VIEW_CS.read_text()
    m = re.search(r"FinalV3FireAnchor\s*=\s*new Vector2\(\s*([0-9.]+)f\s*,\s*([0-9.]+)f\s*\)", src)
    if not m:
        raise SystemExit("ERROR: could not parse FinalV3FireAnchor from TopLivingNightView.cs")
    x, y_bottom = float(m.group(1)), float(m.group(2))
    return x, 1.0 - y_bottom, y_bottom  # top-ref x, top-ref y, bottom-ref y


def font(sz):
    try:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", sz)
    except Exception:
        return ImageFont.load_default()


def on_bg(img, bg=(24, 26, 36)):
    b = Image.new("RGBA", img.size, bg + (255,))
    b.alpha_composite(img.convert("RGBA"))
    return b.convert("RGB")


def label(draw, xy, text, fnt, fill=(240, 240, 245)):
    x, y = xy
    draw.rectangle([x - 2, y - 2, x + draw.textlength(text, font=fnt) + 4, y + fnt.size + 4], fill=(0, 0, 0))
    draw.text((x + 1, y), text, font=fnt, fill=fill)


def contact(paths_labels, cols, thumb_w, title, out):
    fnt = font(13); tfnt = font(18)
    rows = (len(paths_labels) + cols - 1) // cols
    pad, cap = 12, 26
    thumb_h = int(thumb_w * H / W)
    cw, ch = thumb_w + pad, thumb_h + cap + pad
    sheet = Image.new("RGB", (cols * cw + pad, rows * ch + pad + 34), (16, 17, 24))
    d = ImageDraw.Draw(sheet)
    d.text((pad, 8), title, font=tfnt, fill=(235, 235, 245))
    for idx, (p, lab) in enumerate(paths_labels):
        r, c = divmod(idx, cols)
        x = pad + c * cw; y = 40 + r * ch
        im = Image.open(p)
        thumb = on_bg(im).resize((thumb_w, thumb_h))
        sheet.paste(thumb, (x, y))
        d.rectangle([x, y, x + thumb_w, y + thumb_h], outline=(70, 74, 90))
        label(d, (x, y + thumb_h + 4), lab, fnt)
    REV.mkdir(parents=True, exist_ok=True)
    sheet.save(REV / out)
    print(f"  review/{out} {sheet.size}")


def variants_contact():
    v = I / "variants"
    items = [(I / "top-living-night-core5-candidate-430x932.png", "CANONICAL (=iter3-a)")]
    for n in ["candidate-iter1-430x932.png", "candidate-iter2-a-430x932.png",
              "candidate-iter2-b-430x932.png", "candidate-iter3-a-430x932.png",
              "candidate-iter3-b-430x932.png"]:
        if (v / n).exists():
            items.append((v / n, n.replace("candidate-", "").replace("-430x932.png", "")))
    contact(items, min(6, len(items)), 150, "Candidate variants", "00-candidate-variants-contact.png")


def layers_contact():
    order = ["00-environment-base.png", "04-distant-town.png", "06-core5.png",
             "07-animal-robot.png", "09-fire-base.png", "15-foreground-accents.png"]
    items = [(I / "layers" / n, n.replace(".png", "")) for n in order]
    contact(items, 6, 150, "Structural layers (separable)", "01-structural-layers-contact.png")


def effects_contact():
    order = ["01-stars.png", "02-clouds-far.png", "03-clouds-near.png", "05-distant-lights-mask.png",
             "08-robot-eye-mask.png", "10-fire-flipbook-atlas.png", "11-fire-glow-mask.png",
             "12-smoke-atlas.png", "13-embers-atlas.png", "14-lantern-glow-mask.png"]
    items = [(I / "effects" / n, n.replace(".png", "")) for n in order]
    contact(items, 5, 150, "Effect companions", "02-effects-contact.png")


def safe_area_overlay():
    cand = Image.open(I / "top-living-night-core5-candidate-430x932.png").convert("RGBA")
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    fnt = font(16)
    # title-safe top 18-20%, button-safe bottom 20-22%
    d.rectangle([0, 0, W, int(H * 0.20)], fill=(60, 160, 255, 60))
    d.rectangle([0, int(H * 0.78), W, H], fill=(255, 90, 90, 70))
    d.line([0, int(H * 0.20), W, int(H * 0.20)], fill=(60, 160, 255, 230), width=2)
    d.line([0, int(H * 0.78), W, int(H * 0.78)], fill=(255, 90, 90, 230), width=2)
    # fire anchor marker read from the runtime canonical FinalV3FireAnchor (no re-definition)
    ax, ay, _ = runtime_final_fire_anchor()
    fx, fy = int(W * ax), int(H * ay)
    d.ellipse([fx - 8, fy - 8, fx + 8, fy + 8], outline=(255, 210, 120, 255), width=2)
    out = Image.alpha_composite(cand, ov)
    d2 = ImageDraw.Draw(out)
    label(d2, (6, int(H * 0.20) + 4), "title-safe <=20%", fnt, (200, 225, 255))
    label(d2, (6, int(H * 0.78) - 22), "button-safe >=78%", fnt, (255, 210, 210))
    label(d2, (fx + 12, fy - 10), f"fire anchor {ax:.3f}/{ay:.3f} (runtime)", fnt, (255, 225, 170))
    REV.mkdir(parents=True, exist_ok=True)
    out.convert("RGB").save(REV / "03-safe-area-overlay.png")
    print("  review/03-safe-area-overlay.png")


def identity_map():
    cand = Image.open(I / "top-living-night-core5-candidate-430x932.png").convert("RGB")
    d = ImageDraw.Draw(cand)
    fnt = font(15)
    # approximate marker positions for review orientation (not baked into art assets).
    marks = {"Michiru (compass)": (0.22, 0.42), "Nagi (moon box)": (0.80, 0.42),
             "Yui (lantern)": (0.50, 0.52), "Asa (braid/name-tag)": (0.34, 0.63),
             "Tomori (repair lamp)": (0.72, 0.58)}
    for name, (nx, ny) in marks.items():
        x, y = int(nx * W), int(ny * H)
        d.ellipse([x - 6, y - 6, x + 6, y + 6], outline=(120, 240, 160), width=2)
        label(d, (min(x + 8, W - 130), max(0, y - 8)), name, fnt, (170, 245, 190))
    cand.save(REV / "04-identity-map.png")
    print("  review/04-identity-map.png (approximate review markers)")


def fire_motion_gif():
    atlas = Image.open(I / "effects" / "10-fire-flipbook-atlas.png").convert("RGBA")
    cw, ch = atlas.width // 4, atlas.height // 3
    frames = []
    for i in range(12):
        cell = atlas.crop(((i % 4) * cw, (i // 4) * ch, (i % 4) * cw + cw, (i // 4) * ch + ch))
        frames.append(on_bg(cell.resize((240, 240)), (20, 18, 26)))
    REV.mkdir(parents=True, exist_ok=True)
    frames[0].save(REV / "05-fire-motion-preview.gif", save_all=True, append_images=frames[1:],
                   duration=90, loop=0, disposal=2)
    print("  review/05-fire-motion-preview.gif (12 frames)")


def parallax_diagnostic():
    L = I / "layers"
    order = ["00-environment-base.png", "04-distant-town.png", "09-fire-base.png",
             "07-animal-robot.png", "06-core5.png", "15-foreground-accents.png"]

    def stack(offsets):
        base = Image.open(L / order[0]).convert("RGBA")
        for n in order[1:]:
            ov = Image.open(L / n).convert("RGBA")
            if n in offsets:
                ov = ImageChops.offset(ov, *offsets[n])
            base = Image.alpha_composite(base, ov)
        return base.convert("RGB")

    rest = stack({})
    shifted = stack({"06-core5.png": (18, 0), "07-animal-robot.png": (-12, 4),
                     "09-fire-base.png": (0, -4), "04-distant-town.png": (6, 0)})
    envonly = Image.open(L / "00-environment-base.png").convert("RGB")
    fnt = font(16)
    panel = Image.new("RGB", (W * 3 + 40, H + 40), (16, 17, 24))
    for i, (img, cap) in enumerate([(envonly, "00 env (foreground-free)"),
                                    (rest, "layers composited (rest)"),
                                    (shifted, "parallax-shifted (no ghost)")]):
        x = 10 + i * (W + 10)
        panel.paste(img, (x, 30))
        d = ImageDraw.Draw(panel); label(d, (x, 6), cap, fnt)
    REV.mkdir(parents=True, exist_ok=True)
    panel.save(REV / "06-semantic-parallax-diagnostic.png")
    print("  review/06-semantic-parallax-diagnostic.png")


def emit_fire_anchor_json():
    ax, ay, ay_bottom = runtime_final_fire_anchor()
    REV.mkdir(parents=True, exist_ok=True)
    payload = {
        "schemaVersion": 1,
        "note": "Derived from runtime TopLivingNightView.FinalV3FireAnchor; do not hand-edit.",
        "source": "unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightView.cs",
        "runtimeFinalFireAnchorBottomRef": {"x": round(ax, 4), "y": round(ay_bottom, 4)},
        "reviewFireAnchorTopRef": {"x": round(ax, 4), "y": round(ay, 4)},
    }
    (REV / "fire-anchor.json").write_text(json.dumps(payload, indent=2) + "\n")
    print(f"  review/fire-anchor.json top-ref=({ax:.3f},{ay:.3f}) bottom-ref=({ax:.3f},{ay_bottom:.3f})")


def main():
    print("building TOP Living Night V3 review pack -> incoming/review/")
    emit_fire_anchor_json()
    variants_contact()
    layers_contact()
    effects_contact()
    safe_area_overlay()
    identity_map()
    fire_motion_gif()
    parallax_diagnostic()
    print("NOTE: review artifacts only. No final/, status, or approval touched.")


if __name__ == "__main__":
    main()
