#!/usr/bin/env python3
"""Deterministically build U48 Batch A candidate PNGs and Unity import metadata."""

from __future__ import annotations

import hashlib
import json
import math
import shutil
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_ROOT = ROOT / "unity/VampPonUnity/Assets/_Project/Art/Candidates/U48/BatchA"
EVIDENCE_ROOT = ROOT / "docs/design-targets/generated/unity-u48/batch-a"
SOURCE_HEAD = "192471e044124885e432d6ecc4166ccfdf8134e8"
TOOL_VERSION = "1"
CELL = 180

YUI = ROOT / "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Characters/Yui/yui-runtime-dot-sheet.png"
ONBU = ROOT / "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Enemies/Onbu/onbu-runtime-dot-sheet.png"
EXP = ROOT / "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-exp-fragment.png"
PROJECTILE = ROOT / "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-lantern-spark.png"
DEATH = ROOT / "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-ink-burst.png"
TRAIL = ROOT / "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-collect-trail.png"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def guid(candidate_id: str) -> str:
    return hashlib.md5(f"u48-batch-a:{candidate_id}".encode(), usedforsecurity=False).hexdigest()


def output_path(group: str, candidate_id: str) -> Path:
    path = OUTPUT_ROOT / group / f"{candidate_id}.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def save(image: Image.Image, group: str, candidate_id: str) -> Path:
    path = output_path(group, candidate_id)
    image.convert("RGBA").save(path, format="PNG", optimize=False)
    return path


def copy_sheet(source: Path, group: str, candidate_id: str, mode: str) -> Path:
    base = rgba(source)
    if mode == "copy":
        result = base
    else:
        result = Image.new("RGBA", base.size)
        for row in range(6):
            for column in range(8):
                box = (column * CELL, row * CELL, (column + 1) * CELL, (row + 1) * CELL)
                frame = base.crop(box)
                alpha = frame.getchannel("A")
                if mode == "outline":
                    expanded = alpha.filter(ImageFilter.MaxFilter(3))
                    outline = Image.new("RGBA", frame.size, (11, 9, 14, 0))
                    outline.putalpha(ImageChops.subtract(expanded, alpha))
                    frame = Image.alpha_composite(outline, frame)
                elif mode == "readability":
                    pixels = list(frame.get_flattened_data())
                    adjusted = []
                    for red, green, blue, a in pixels:
                        if a == 0:
                            adjusted.append((0, 0, 0, 0))
                        elif red > 105 and red > blue * 1.18 and green > 55:
                            adjusted.append((min(255, int(red * 1.17 + 12)), min(230, int(green * 1.10 + 8)), max(20, int(blue * .88)), a))
                        elif red > 45 and red > blue * 1.25 and green < red * .85:
                            adjusted.append((min(170, int(red * 1.13 + 5)), min(125, int(green * 1.08 + 3)), max(18, int(blue * .92)), a))
                        else:
                            adjusted.append((max(0, int(red * .92)), max(0, int(green * .94)), min(235, int(blue * 1.04 + 2)), a))
                    frame.putdata(adjusted)
                    expanded = alpha.filter(ImageFilter.MaxFilter(3))
                    outline = Image.new("RGBA", frame.size, (12, 9, 13, 0))
                    outline.putalpha(ImageChops.subtract(expanded, alpha).point(lambda value: min(210, value)))
                    frame = Image.alpha_composite(outline, frame)
                elif mode == "paper-ink":
                    pixels = list(frame.get_flattened_data())
                    adjusted = []
                    for index, (red, green, blue, a) in enumerate(pixels):
                        if a == 0:
                            adjusted.append((0, 0, 0, 0))
                            continue
                        x, y = index % CELL, index // CELL
                        grain = ((x * 17 + y * 31 + row * 13 + column * 7) % 11) - 5
                        luminance = (red * 3 + green * 5 + blue * 2) // 10
                        if luminance < 70:
                            adjusted.append((max(5, red + grain), max(4, green + grain), max(7, blue + grain), a))
                        else:
                            adjusted.append((max(0, min(255, red + grain + 4)), max(0, min(240, green + grain)), max(0, min(225, blue + grain - 3)), a))
                    frame.putdata(adjusted)
                elif mode == "sprout-mist":
                    pixels = list(frame.get_flattened_data())
                    adjusted = []
                    for index, (red, green, blue, a) in enumerate(pixels):
                        y = index // CELL
                        if a and y < 92:
                            adjusted.append((min(210, int(red * 1.06 + 5)), min(190, int(green * 1.08 + 4)), min(220, int(blue * 1.14 + 7)), a))
                        elif a:
                            adjusted.append((max(2, int(red * .90)), max(2, int(green * .91)), max(5, int(blue * .96)), a))
                        else:
                            adjusted.append((0, 0, 0, 0))
                    frame.putdata(adjusted)
                elif mode == "ink-death":
                    pixels = list(frame.get_flattened_data())
                    adjusted = []
                    death_row = row >= 3
                    for index, (red, green, blue, a) in enumerate(pixels):
                        if not a:
                            adjusted.append((0, 0, 0, 0))
                            continue
                        x, y = index % CELL, index // CELL
                        ink = 0.76 if death_row else 0.86
                        fleck = 12 if death_row and (x * 5 + y * 3 + column) % 17 == 0 else 0
                        adjusted.append((max(2, int(red * ink) + fleck), max(2, int(green * ink) + fleck), max(5, int(blue * .92) + fleck), a))
                    frame.putdata(adjusted)
                result.paste(frame, box[:2])
    path = save(result, group, candidate_id)
    source_meta = source.with_name(source.name + ".meta").read_text()
    source_meta = source_meta.replace(source_meta.split("guid: ", 1)[1].splitlines()[0], guid(candidate_id), 1)
    path.with_name(path.name + ".meta").write_text(source_meta)
    return path


def fit_sprite(source: Path, size: tuple[int, int] = (128, 128)) -> Image.Image:
    image = rgba(source)
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if bounds:
        image = image.crop(bounds)
    image.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CELL, CELL))
    canvas.alpha_composite(image, ((CELL - image.width) // 2, (CELL - image.height) // 2))
    return canvas


def pixel_canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGBA", (90, 90))
    return image, ImageDraw.Draw(image)


def upscale(image: Image.Image) -> Image.Image:
    return image.resize((CELL, CELL), Image.Resampling.NEAREST)


PAPER = (214, 194, 154, 255)
PAPER_DARK = (120, 87, 52, 255)
INK = (9, 7, 12, 255)
BLUE = (118, 177, 192, 255)
LANTERN = (255, 161, 61, 255)
DAWN = (230, 196, 140, 255)


def draw_exp(style: str) -> Image.Image:
    image, draw = pixel_canvas()
    if style == "paper":
        draw.polygon([(35, 25), (59, 30), (54, 61), (30, 56)], fill=PAPER_DARK)
        draw.polygon([(37, 22), (62, 28), (55, 58), (31, 53)], fill=PAPER)
        draw.line([(39, 30), (56, 34), (43, 48)], fill=BLUE, width=3)
    elif style == "crystal":
        draw.polygon([(45, 18), (62, 42), (48, 68), (27, 50)], fill=(67, 112, 136, 255))
        draw.polygon([(45, 22), (56, 42), (47, 58), (34, 48)], fill=(155, 213, 218, 255))
        draw.line([(45, 22), (47, 58)], fill=DAWN, width=2)
    else:
        draw.polygon([(28, 40), (44, 23), (64, 34), (58, 58), (38, 65)], fill=INK)
        draw.polygon([(35, 41), (45, 29), (57, 37), (53, 53), (41, 58)], fill=BLUE)
        draw.ellipse((43, 39, 49, 45), fill=DAWN)
    return upscale(image)


def draw_healing(style: str) -> Image.Image:
    image, draw = pixel_canvas()
    if style == "drop":
        draw.polygon([(45, 17), (61, 43), (57, 61), (45, 70), (32, 61), (29, 43)], fill=PAPER_DARK)
        draw.polygon([(45, 22), (56, 44), (53, 57), (45, 64), (37, 57), (34, 44)], fill=DAWN)
        draw.ellipse((41, 38, 49, 49), fill=LANTERN)
    elif style == "charm":
        draw.polygon([(29, 25), (60, 22), (64, 62), (33, 68)], fill=PAPER_DARK)
        draw.polygon([(32, 21), (61, 26), (59, 63), (30, 59)], fill=PAPER)
        draw.line([(30, 43), (61, 45)], fill=(171, 126, 78, 255), width=5)
        draw.line([(45, 27), (44, 58)], fill=(238, 210, 157, 255), width=3)
    elif style == "dew":
        draw.ellipse((26, 28, 64, 66), fill=PAPER_DARK)
        draw.ellipse((30, 25, 60, 60), fill=(166, 138, 96, 255))
        draw.ellipse((35, 30, 55, 53), fill=DAWN)
        draw.rectangle((42, 17, 48, 28), fill=(101, 72, 44, 255))
        draw.point((39, 35), fill=(255, 232, 183, 255))
    else:
        draw.rectangle((33, 31, 59, 66), fill=PAPER_DARK)
        draw.rectangle((37, 34, 55, 62), fill=(126, 91, 61, 255))
        draw.rectangle((40, 19, 52, 34), fill=(83, 61, 43, 255))
        draw.rectangle((41, 40, 51, 55), fill=DAWN)
        draw.line([(43, 44), (49, 50), (43, 54)], fill=LANTERN, width=2)
    return upscale(image)


def draw_projectile(style: str) -> Image.Image:
    image, draw = pixel_canvas()
    if style == "pencil":
        draw.polygon([(17, 55), (66, 27), (73, 29), (23, 60)], fill=PAPER_DARK)
        draw.polygon([(66, 27), (80, 24), (73, 34)], fill=(70, 60, 55, 255))
        draw.line([(20, 65), (56, 44)], fill=(126, 104, 82, 180), width=2)
    elif style == "paper":
        draw.polygon([(14, 50), (61, 28), (77, 32), (35, 51)], fill=PAPER)
        draw.line([(18, 58), (55, 42)], fill=(150, 122, 85, 190), width=2)
    else:
        draw.line([(14, 58), (75, 28)], fill=INK, width=6)
        draw.line([(19, 63), (56, 47)], fill=(38, 25, 43, 170), width=3)
        draw.ellipse((70, 25, 78, 33), fill=(93, 58, 89, 230))
    return upscale(image)


def draw_hit(style: str) -> Image.Image:
    image, draw = pixel_canvas()
    if style == "paper":
        draw.polygon([(39, 27), (48, 39), (61, 36), (52, 47), (57, 60), (45, 53), (34, 61), (38, 48), (27, 39), (40, 40)], fill=PAPER)
    elif style == "ink":
        draw.ellipse((39, 39, 51, 51), fill=INK)
        for x, y in [(31, 44), (57, 35), (58, 54), (42, 30)]:
            draw.ellipse((x, y, x + 3, y + 3), fill=(35, 24, 39, 220))
    else:
        draw.line([(45, 27), (45, 63)], fill=LANTERN, width=3)
        draw.line([(27, 45), (63, 45)], fill=DAWN, width=3)
        draw.line([(33, 33), (57, 57)], fill=(238, 151, 68, 220), width=2)
    return upscale(image)


def draw_death(style: str) -> Image.Image:
    image, draw = pixel_canvas()
    if style == "paper":
        for polygon in [[(25, 35), (37, 27), (39, 42), (28, 46)], [(50, 23), (65, 31), (59, 43), (48, 37)], [(39, 52), (50, 47), (56, 64), (43, 68)]]:
            draw.polygon(polygon, fill=PAPER)
    elif style == "ink":
        for x, y, radius in [(45, 45, 13), (29, 50, 5), (61, 34, 6), (56, 62, 4), (32, 29, 3)]:
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=INK)
    else:
        draw.ellipse((31, 32, 59, 61), fill=INK)
        for polygon in [[(20, 37), (34, 30), (31, 44)], [(59, 27), (70, 37), (57, 42)], [(42, 60), (51, 72), (36, 68)]]:
            draw.polygon(polygon, fill=PAPER)
        draw.ellipse((43, 42, 49, 48), fill=LANTERN)
    return upscale(image)


def draw_trail(style: str) -> Image.Image:
    image, draw = pixel_canvas()
    points = [(24, 59), (37, 52), (50, 45), (63, 38)]
    if style == "pencil":
        draw.line(points, fill=(108, 89, 72, 160), width=3)
        for x, y in [(20, 62), (31, 58), (45, 51), (58, 45)]:
            draw.rectangle((x, y, x + 2, y + 2), fill=(92, 76, 67, 170))
    elif style == "paper":
        for x, y in points:
            draw.polygon([(x - 3, y), (x + 2, y - 4), (x + 5, y + 1), (x, y + 4)], fill=(PAPER[0], PAPER[1], PAPER[2], 170))
    else:
        for index, (x, y) in enumerate(points):
            radius = 5 - index
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(LANTERN[0], LANTERN[1], LANTERN[2], 110 + index * 25))
    return upscale(image)


def background_from_source(source: Path, style: str) -> Image.Image:
    image = ImageOps.fit(rgba(source), (390, 844), method=Image.Resampling.LANCZOS)
    image = image.resize((195, 422), Image.Resampling.LANCZOS).resize((390, 844), Image.Resampling.NEAREST)
    if style == "paper-map":
        image = ImageEnhance.Color(image).enhance(.58)
        image = ImageEnhance.Contrast(image).enhance(.78)
        overlay = Image.new("RGBA", image.size, (92, 75, 61, 42))
        image = Image.alpha_composite(image, overlay)
    elif style == "night-street":
        image = ImageEnhance.Color(image).enhance(.72)
        image = ImageEnhance.Brightness(image).enhance(.72)
        center = Image.new("RGBA", image.size)
        draw = ImageDraw.Draw(center)
        draw.rounded_rectangle((64, 105, 326, 739), radius=80, fill=(40, 48, 68, 42))
        image = Image.alpha_composite(image, center)
    else:
        image = ImageEnhance.Color(image).enhance(.66)
        image = ImageEnhance.Contrast(image).enhance(.86)
        veil = Image.new("RGBA", image.size, (19, 22, 36, 34))
        image = Image.alpha_composite(image, veil)
    return image.convert("RGBA")


def procedural_background() -> Image.Image:
    image = Image.new("RGBA", (390, 844))
    pixels = []
    for y in range(844):
        for x in range(390):
            noise = ((x * 37 + y * 19 + (x // 12) * (y // 17) * 3) % 31) / 30
            edge = min(x, 389 - x, y, 843 - y) / 54
            vignette = max(0.0, min(1.0, edge))
            tone = .055 + noise * .035
            alpha = int(255 * (.92 + .08 * vignette))
            pixels.append((int(255 * tone * .72), int(255 * tone * .64), int(255 * tone * .58), alpha))
    image.putdata(pixels)
    return image


def single_meta(candidate_id: str, ppu: int) -> str:
    return f"""fileFormatVersion: 2
guid: {guid(candidate_id)}
TextureImporter:
  internalIDToNameTable: []
  externalObjects: {{}}
  serializedVersion: 13
  mipmaps:
    mipMapMode: 0
    enableMipMap: 0
    sRGBTexture: 1
    linearTexture: 0
  isReadable: 0
  textureSettings:
    serializedVersion: 2
    filterMode: 0
    aniso: 1
    mipBias: 0
    wrapU: 1
    wrapV: 1
    wrapW: 1
  nPOTScale: 0
  spriteMode: 1
  spritePixelsToUnits: {ppu}
  spritePivot: {{x: 0.5, y: 0.5}}
  spriteBorder: {{x: 0, y: 0, z: 0, w: 0}}
  alphaUsage: 1
  alphaIsTransparency: 1
  textureType: 8
  platformSettings:
  - serializedVersion: 4
    buildTarget: DefaultTexturePlatform
    maxTextureSize: 2048
    textureFormat: -1
    textureCompression: 0
    compressionQuality: 50
    crunchedCompression: 0
    overridden: 0
  spriteSheet:
    serializedVersion: 2
    sprites: []
    outline: []
    physicsShape: []
    bones: []
    spriteID: 5e97eb03825dee720800000000000000
    internalID: 0
    vertices: []
    indices:
    edges: []
    weights: []
  userData:
  assetBundleName:
  assetBundleVariant:
"""


def save_single(image: Image.Image, group: str, candidate_id: str, ppu: int = 100) -> Path:
    path = save(image, group, candidate_id)
    path.with_name(path.name + ".meta").write_text(single_meta(candidate_id, ppu))
    return path


def build() -> list[dict[str, str]]:
    outputs: list[Path] = []
    outputs += [
        copy_sheet(YUI, "player-yui", "player-yui-a-runtime-baseline", "copy"),
        copy_sheet(YUI, "player-yui", "player-yui-b-silhouette", "outline"),
        copy_sheet(YUI, "player-yui", "player-yui-c-lantern-bag", "readability"),
        copy_sheet(YUI, "player-yui", "player-yui-d-paper-ink", "paper-ink"),
        copy_sheet(ONBU, "enemy-onbu", "enemy-onbu-a-runtime-baseline", "copy"),
        copy_sheet(ONBU, "enemy-onbu", "enemy-onbu-b-silhouette", "outline"),
        copy_sheet(ONBU, "enemy-onbu", "enemy-onbu-c-sprout-mist", "sprout-mist"),
        copy_sheet(ONBU, "enemy-onbu", "enemy-onbu-d-ink-death", "ink-death"),
    ]
    outputs += [
        save_single(procedural_background(), "stage1-background", "stage1-background-a-procedural-baseline", 64),
        save_single(background_from_source(ROOT / "assets/reference/backgrounds/stage1_night_tile_reference.png", "paper-map"), "stage1-background", "stage1-background-b-paper-map", 64),
        save_single(background_from_source(ROOT / "assets/concept-design/01_world/world_night-town_01.png", "night-street"), "stage1-background", "stage1-background-c-night-street", 64),
        save_single(background_from_source(ROOT / "public/assets/prototypes/backgrounds/stage-01/environment-master.png", "balanced"), "stage1-background", "stage1-background-d-balanced", 64),
    ]
    outputs.append(save_single(fit_sprite(EXP), "exp-pickup", "exp-pickup-a-runtime-baseline"))
    for style, candidate_id in [("paper", "exp-pickup-b-paper-fragment"), ("crystal", "exp-pickup-c-small-crystal"), ("hybrid", "exp-pickup-d-ink-light-hybrid")]:
        outputs.append(save_single(draw_exp(style), "exp-pickup", candidate_id))
    for style, candidate_id in [("drop", "healing-pickup-a-dawn-drop"), ("charm", "healing-pickup-b-bandaged-paper-charm"), ("dew", "healing-pickup-c-warm-lantern-dew"), ("bottle", "healing-pickup-d-restorative-bottle")]:
        outputs.append(save_single(draw_healing(style), "healing-pickup", candidate_id))
    outputs.append(save_single(fit_sprite(PROJECTILE, (118, 118)), "common-projectile", "common-projectile-a-lantern-spark"))
    for style, candidate_id in [("pencil", "common-projectile-b-pencil-slash"), ("paper", "common-projectile-c-paper-streak"), ("ink", "common-projectile-d-ink-line")]:
        outputs.append(save_single(draw_projectile(style), "common-projectile", candidate_id))
    baseline_hit = fit_sprite(PROJECTILE, (72, 72)).filter(ImageFilter.MaxFilter(3))
    outputs.append(save_single(baseline_hit, "hit-effect", "hit-effect-a-runtime-baseline"))
    for style, candidate_id in [("paper", "hit-effect-b-paper-nick"), ("ink", "hit-effect-c-ink-pinprick"), ("lantern", "hit-effect-d-lantern-cross")]:
        outputs.append(save_single(draw_hit(style), "hit-effect", candidate_id))
    outputs.append(save_single(fit_sprite(DEATH, (142, 142)), "enemy-death-effect", "enemy-death-effect-a-runtime-baseline"))
    for style, candidate_id in [("paper", "enemy-death-effect-b-paper-scatter"), ("ink", "enemy-death-effect-c-ink-dissolve"), ("hybrid", "enemy-death-effect-d-paper-ink-burst")]:
        outputs.append(save_single(draw_death(style), "enemy-death-effect", candidate_id))
    outputs.append(save_single(fit_sprite(TRAIL, (136, 88)), "movement-trail", "movement-trail-a-runtime-baseline"))
    for style, candidate_id in [("pencil", "movement-trail-b-pencil-dust"), ("paper", "movement-trail-c-paper-flecks"), ("lantern", "movement-trail-d-lantern-motes")]:
        outputs.append(save_single(draw_trail(style), "movement-trail", candidate_id))
    return [{"path": str(path.relative_to(ROOT)), "sha256": digest(path), "metaPath": str(path.with_name(path.name + ".meta").relative_to(ROOT))} for path in outputs]


def main() -> None:
    outputs = build()
    EVIDENCE_ROOT.mkdir(parents=True, exist_ok=True)
    manifest = {
        "schemaVersion": 1,
        "sourceHead": SOURCE_HEAD,
        "tool": "scripts/unity/build-u48-batch-a-candidates.py",
        "toolVersion": TOOL_VERSION,
        "generatedAtUtc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "outputCount": len(outputs),
        "outputs": outputs,
    }
    (EVIDENCE_ROOT / "candidate-build-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"U48 Batch A candidates built: {len(outputs)} PNGs with deterministic Unity meta files.")


if __name__ == "__main__":
    main()
