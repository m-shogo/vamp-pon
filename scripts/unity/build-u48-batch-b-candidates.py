#!/usr/bin/env python3
"""Deterministically build U48 Batch B ground-area and 黒耀化 candidate sprites."""

from __future__ import annotations

import hashlib
import json
import math
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "unity/VampPonUnity/Assets/_Project/Art/Candidates/U48/BatchB"
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-b"
INK_SOURCE = ROOT / "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-ink-burst.png"
SOURCE_HEAD = "32f38045"
TOOL_VERSION = "1"
SIZE = 180
SCALE = 2
INK = (9, 7, 12, 225)
INK_PURPLE = (45, 24, 48, 205)
PAPER = (214, 194, 154, 220)
PAPER_DARK = (120, 87, 52, 210)
LANTERN = (255, 161, 61, 225)
DAWN = (230, 196, 140, 230)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def guid(candidate: str) -> str:
    return hashlib.md5(f"u48-batch-b:{candidate}".encode(), usedforsecurity=False).hexdigest()


def canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGBA", (SIZE // SCALE, SIZE // SCALE))
    return image, ImageDraw.Draw(image)


def upscale(image: Image.Image) -> Image.Image:
    return image.resize((SIZE, SIZE), Image.Resampling.NEAREST)


def ring(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color, width: int, gaps: int = 0) -> None:
    if gaps == 0:
        draw.ellipse(box, outline=color, width=width)
        return
    for index in range(gaps):
        start = index * 360 / gaps + 8
        draw.arc(box, start=start, end=start + 360 / gaps - 23, fill=color, width=width)


def baseline_ink(group: str) -> Image.Image:
    source = Image.open(INK_SOURCE).convert("RGBA")
    bounds = source.getchannel("A").getbbox()
    if bounds:
        source = source.crop(bounds)
    source.thumbnail((138, 138), Image.Resampling.LANCZOS)
    alpha = Image.new("L", (SIZE, SIZE))
    alpha.paste(source.getchannel("A"), ((SIZE - source.width) // 2, (SIZE - source.height) // 2))
    if group == "ground-area-black-ink-bottle":
        alpha = alpha.filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: int(v * .72))
        color = (13, 8, 16, 0)
    elif group == "ground-area-streetlamp-ring":
        outer = alpha.filter(ImageFilter.MaxFilter(17))
        inner = alpha.filter(ImageFilter.MinFilter(13))
        alpha = ImageChops.subtract(outer, inner).point(lambda v: int(v * .68))
        color = (225, 136, 55, 0)
    else:
        outer = alpha.filter(ImageFilter.MaxFilter(25))
        inner = alpha.filter(ImageFilter.MinFilter(19))
        alpha = ImageChops.add(ImageChops.subtract(outer, inner), alpha.point(lambda v: int(v * .22))).point(lambda v: int(v * .68))
        color = (205, 150, 100, 0)
    result = Image.new("RGBA", (SIZE, SIZE), color)
    result.putalpha(alpha)
    return result


def ground(group: str, style: str) -> Image.Image:
    if style == "baseline":
        return baseline_ink(group)
    image, draw = canvas()
    if group == "ground-area-black-ink-bottle":
        if style == "shape":
            draw.polygon([(18, 48), (25, 33), (39, 27), (58, 31), (72, 43), (69, 59), (52, 68), (33, 65)], fill=INK)
            for x, y, r in [(20, 61, 4), (72, 59, 3), (31, 27, 3), (61, 28, 2)]: draw.ellipse((x-r, y-r, x+r, y+r), fill=INK_PURPLE)
        elif style == "motion":
            draw.ellipse((20, 25, 70, 69), fill=(12, 8, 16, 185)); ring(draw, (16, 21, 74, 73), (57, 31, 61, 150), 3, 7); ring(draw, (25, 30, 65, 64), (3, 2, 5, 190), 2, 5)
        else:
            draw.ellipse((19, 31, 71, 69), fill=(16, 10, 18, 190)); ring(draw, (13, 24, 77, 75), (83, 54, 69, 125), 3, 8)
            draw.rectangle((40, 20, 51, 34), fill=PAPER_DARK); draw.rectangle((38, 28, 53, 47), fill=(32, 22, 30, 230)); draw.rectangle((42, 17, 49, 23), fill=(88, 62, 40, 230))
    elif group == "ground-area-streetlamp-ring":
        if style == "shape":
            ring(draw, (15, 15, 75, 75), (205, 124, 47, 215), 5, 8); ring(draw, (24, 24, 66, 66), (255, 183, 81, 150), 2); draw.rectangle((42, 34, 48, 55), fill=PAPER_DARK); draw.rectangle((38, 28, 52, 39), fill=LANTERN)
        elif style == "motion":
            ring(draw, (14, 14, 76, 76), (233, 177, 100, 210), 4, 11); ring(draw, (21, 21, 69, 69), (117, 74, 42, 155), 2, 7)
            for x, y in [(21, 24), (68, 29), (62, 67), (28, 70)]: draw.polygon([(x-3,y), (x,y-3), (x+4,y), (x,y+3)], fill=PAPER)
        else:
            ring(draw, (12, 12, 78, 78), (30, 18, 31, 185), 6, 9); ring(draw, (19, 19, 71, 71), (255, 164, 64, 215), 4, 8); draw.ellipse((38, 36, 52, 51), fill=(255, 200, 111, 125))
    else:
        if style == "shape":
            ring(draw, (7, 7, 83, 83), (35, 18, 38, 200), 7, 10); ring(draw, (15, 15, 75, 75), (240, 172, 76, 220), 5, 9); ring(draw, (25, 25, 65, 65), DAWN, 3)
        elif style == "motion":
            ring(draw, (7, 7, 83, 83), (44, 25, 47, 190), 5, 12); ring(draw, (17, 17, 73, 73), (233, 183, 105, 210), 3, 9)
            for angle in range(0, 360, 45):
                x1=45+int(math.cos(math.radians(angle))*29); y1=45+int(math.sin(math.radians(angle))*29); x2=45+int(math.cos(math.radians(angle))*38); y2=45+int(math.sin(math.radians(angle))*38); draw.line((x1,y1,x2,y2), fill=PAPER, width=3)
        else:
            ring(draw, (6, 6, 84, 84), (28, 14, 31, 210), 6, 11); ring(draw, (14, 14, 76, 76), (236, 179, 94, 210), 5, 9); ring(draw, (24, 24, 66, 66), DAWN, 3)
            draw.polygon([(45, 25), (57, 43), (45, 60), (33, 43)], fill=(95, 60, 55, 225)); draw.polygon([(45, 30), (52, 43), (45, 53), (38, 43)], fill=LANTERN)
    return upscale(image)


def kokuyou(phase: str, style: str) -> Image.Image:
    image, draw = canvas()
    intensity = {"charging": .48, "ready": .68, "active": 1.0, "recovery": .43}[phase]
    dark = (int(48*intensity), int(26*intensity), int(52*intensity), int(205*intensity + 35))
    purple = (80, 44, 83, int(165*intensity + 30))
    if style == "baseline":
        ring(draw, (18, 13, 72, 72), dark, max(2, int(4*intensity)), 8)
        draw.ellipse((31, 29, 59, 60), fill=(18, 11, 20, int(75*intensity)))
    elif style == "shape":
        if phase == "charging":
            for x,y in [(27,58),(36,31),(57,27),(67,52)]: draw.arc((x-7,y-15,x+7,y+12), 195, 345, fill=purple, width=3)
        elif phase == "ready": ring(draw, (12, 8, 78, 76), dark, 5, 10)
        elif phase == "active":
            ring(draw, (9, 6, 81, 80), dark, 6, 11)
            for x in range(18, 78, 10): draw.polygon([(x,31),(x+5,8+(x%17)),(x+10,33)], fill=(20,10,23,220))
        else:
            for x,y,r in [(24,31,4),(35,22,3),(54,27,5),(68,39,3),(31,62,3),(57,66,2)]: draw.ellipse((x-r,y-r,x+r,y+r), fill=(38,30,36,135))
    elif style == "motion":
        if phase == "charging":
            ring(draw, (17, 12, 73, 74), dark, 3, 12); draw.arc((31,21,59,67), 70, 255, fill=(105,67,75,130), width=3)
        elif phase == "ready":
            ring(draw, (11, 7, 79, 79), dark, 5, 9)
            for x in range(22, 70, 12): draw.polygon([(x,29),(x+5,13),(x+10,30)], fill=(25,12,28,205))
        elif phase == "active":
            ring(draw, (8, 5, 82, 81), dark, 7, 12)
            for angle in range(0,360,45):
                x1=45+int(math.cos(math.radians(angle))*24); y1=43+int(math.sin(math.radians(angle))*24); x2=45+int(math.cos(math.radians(angle))*38); y2=43+int(math.sin(math.radians(angle))*38); draw.line((x1,y1,x2,y2), fill=purple, width=4)
        else:
            draw.ellipse((17,46,73,72), fill=(20,13,22,105)); draw.polygon([(19,59),(37,48),(65,58),(75,68),(30,70)], fill=(35,22,37,125)); ring(draw, (25,18,65,66), (80,55,61,95), 2, 7)
    else:
        if phase == "charging":
            ring(draw, (16,10,74,75), dark, 3, 10)
            for x,y in [(18,23),(72,31),(25,69),(67,66)]: draw.polygon([(x,y),(x+6,y-3),(x+4,y+5)], fill=(109,82,75,120))
        elif phase == "ready":
            ring(draw, (10,6,80,80), dark, 5, 10); draw.polygon([(45,21),(57,40),(45,59),(33,40)], fill=(32,20,35,220)); draw.polygon([(45,28),(52,40),(45,51),(38,40)], fill=(165,105,63,150))
        elif phase == "active":
            ring(draw, (7,4,83,83), (28,12,31,230), 7, 13); ring(draw, (17,14,73,73), purple, 4, 9); draw.ellipse((33,26,57,56), fill=(9,6,11,225)); draw.ellipse((39,32,51,50), fill=(172,106,64,115))
            for angle in range(0,360,60):
                x=45+int(math.cos(math.radians(angle))*36); y=43+int(math.sin(math.radians(angle))*36); draw.polygon([(45,43),(x,y),(x+3,y+5)], fill=(90,61,73,85))
        else:
            ring(draw, (20,15,70,70), (57,43,46,105), 2, 9); draw.polygon([(40,31),(50,31),(54,48),(45,57),(36,48)], fill=(78,55,48,130))
            for x,y in [(20,54),(28,66),(61,60),(70,48)]: draw.polygon([(x,y),(x+4,y-4),(x+7,y+2),(x+2,y+5)], fill=(150,135,111,100))
    return upscale(image)


def meta(candidate: str) -> str:
    return f"""fileFormatVersion: 2
guid: {guid(candidate)}
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
  spritePixelsToUnits: 180
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


def save(group: str, candidate: str, image: Image.Image) -> Path:
    path = OUTPUT / group / f"{candidate}.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGBA").save(path, format="PNG", optimize=False)
    Path(str(path) + ".meta").write_text(meta(candidate))
    return path


def main() -> None:
    contracts = json.loads((EVIDENCE / "generation-contracts.json").read_text())["contracts"]
    outputs = []
    for contract in contracts:
        group, candidate = contract["assetGroup"], contract["candidateId"]
        suffix = candidate.removeprefix(group + "-")
        style = "baseline" if suffix.startswith("a-") else "shape" if suffix.startswith("b-") else "motion" if suffix.startswith("c-") else "world"
        image = ground(group, style) if group.startswith("ground-area-") else kokuyou(group.removeprefix("kokuyou-"), style)
        path = save(group, candidate, image)
        outputs.append({"assetGroup": group, "candidateId": candidate, "path": str(path.relative_to(ROOT)), "sha256": digest(path), "metaPath": str(Path(str(path) + '.meta').relative_to(ROOT))})
    write = {"schemaVersion": 1, "sourceHead": SOURCE_HEAD, "tool": "scripts/unity/build-u48-batch-b-candidates.py", "toolVersion": TOOL_VERSION, "generatedAtUtc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"), "outputCount": len(outputs), "outputs": outputs}
    (EVIDENCE / "candidate-build-manifest.json").write_text(json.dumps(write, ensure_ascii=False, indent=2) + "\n")
    print(f"U48 Batch B candidates built: {len(outputs)} PNGs with deterministic Unity meta files")


if __name__ == "__main__":
    main()
