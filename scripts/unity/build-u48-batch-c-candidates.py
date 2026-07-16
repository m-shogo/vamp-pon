#!/usr/bin/env python3
"""Deterministically build U48 Batch C sliced UI component candidates."""

from __future__ import annotations

import argparse
import hashlib
import json
import random
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-c"
OUTPUT = ROOT / "unity/VampPonUnity/Assets/_Project/Art/Candidates/U48/BatchC"
SOURCE_HEAD = "7f4ec593"
TOOL_VERSION = "1"
WIDTH, HEIGHT, BORDER = 240, 120, 18

INK = (18, 12, 14, 238)
INK_SOFT = (58, 42, 37, 210)
PAPER = (214, 194, 154, 248)
PAPER_LIGHT = (233, 219, 187, 245)
PAPER_DARK = (132, 99, 66, 230)
LANTERN = (255, 161, 61, 220)
MORNING = (230, 196, 140, 215)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def stable_guid(value: str) -> str:
    return hashlib.md5(f"u48-batch-c:{value}".encode(), usedforsecurity=False).hexdigest()


def folder_meta(value: str) -> str:
    return f"fileFormatVersion: 2\nguid: {stable_guid('folder:' + value)}\nfolderAsset: yes\nDefaultImporter:\n  externalObjects: {{}}\n  userData:\n  assetBundleName:\n  assetBundleVariant:\n"


def texture_meta(candidate: str) -> str:
    return f"""fileFormatVersion: 2
guid: {stable_guid(candidate)}
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
    filterMode: 1
    aniso: 1
    mipBias: 0
    wrapU: 1
    wrapV: 1
    wrapW: 1
  nPOTScale: 0
  spriteMode: 1
  spritePixelsToUnits: 100
  spritePivot: {{x: 0.5, y: 0.5}}
  spriteBorder: {{x: {BORDER}, y: {BORDER}, z: {BORDER}, w: {BORDER}}}
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


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill=None, outline=None, width: int = 1) -> None:
    draw.rectangle(box, fill=fill, outline=outline, width=width)


def paper_fibers(draw: ImageDraw.ImageDraw, rng: random.Random, count: int, alpha: int) -> None:
    for _ in range(count):
        y = rng.randint(BORDER + 2, HEIGHT - BORDER - 3)
        x = rng.randint(BORDER + 2, WIDTH - BORDER - 18)
        length = rng.randint(4, 18)
        draw.line((x, y, x + length, y + rng.choice([-1, 0, 1])), fill=(112, 82, 58, alpha), width=1)


def signature(draw: ImageDraw.ImageDraw, group: str) -> None:
    bits = int(hashlib.sha256(group.encode()).hexdigest()[:8], 16)
    for index in range(32):
        if bits & (1 << index):
            x = 3 + (index % 8) * 2
            y = 3 + (index // 8) * 2
            draw.rectangle((x, y, x + 1, y + 1), fill=(8, 6, 8, 220))


def candidate_image(group: str, role: str, seed: int) -> Image.Image:
    rng = random.Random(seed)
    image = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    if role == "runtime-baseline":
        rect(draw, (1, 1, WIDTH - 2, HEIGHT - 2), PAPER, PAPER_DARK, 3)
        rect(draw, (8, 8, WIDTH - 9, HEIGHT - 9), PAPER_LIGHT, INK_SOFT, 2)
        draw.line((BORDER, BORDER + 3, WIDTH - BORDER, BORDER + 3), fill=(118, 87, 56, 80), width=1)
    elif role == "readability":
        rect(draw, (1, 1, WIDTH - 2, HEIGHT - 2), PAPER_LIGHT, INK, 4)
        rect(draw, (10, 10, WIDTH - 11, HEIGHT - 11), PAPER, PAPER_DARK, 2)
        for x in (3, WIDTH - 13):
            draw.polygon([(x, 12), (x + 9, 12), (x + 4, 21)], fill=(32, 21, 20, 220))
        draw.line((BORDER, HEIGHT - BORDER - 3, WIDTH - BORDER, HEIGHT - BORDER - 3), fill=(72, 48, 37, 150), width=2)
    elif role == "worldbuilding":
        rect(draw, (2, 2, WIDTH - 3, HEIGHT - 3), PAPER, INK_SOFT, 3)
        points = [(8, 10), (15, 6), (WIDTH - 18, 8), (WIDTH - 8, 14), (WIDTH - 10, HEIGHT - 12), (WIDTH - 20, HEIGHT - 7), (16, HEIGHT - 9), (7, HEIGHT - 17)]
        draw.line(points + [points[0]], fill=INK, width=3, joint="curve")
        paper_fibers(draw, rng, 24, 55)
        draw.ellipse((WIDTH - 17, 5, WIDTH - 7, 15), fill=LANTERN)
        draw.ellipse((WIDTH - 14, 8, WIDTH - 10, 12), fill=(255, 221, 151, 230))
    else:
        rect(draw, (1, 1, WIDTH - 2, HEIGHT - 2), PAPER, INK_SOFT, 3)
        rect(draw, (9, 9, WIDTH - 10, HEIGHT - 10), PAPER_LIGHT, PAPER_DARK, 2)
        for x, y, sx, sy in ((6, 6, 1, 1), (WIDTH - 7, 6, -1, 1), (6, HEIGHT - 7, 1, -1), (WIDTH - 7, HEIGHT - 7, -1, -1)):
            draw.line((x, y, x + sx * 12, y), fill=INK, width=3)
            draw.line((x, y, x, y + sy * 12), fill=INK, width=3)
        draw.line((BORDER, BORDER, WIDTH - BORDER, BORDER), fill=MORNING, width=2)
        paper_fibers(draw, rng, 12, 42)
        draw.polygon([(WIDTH // 2 - 8, 7), (WIDTH // 2, 3), (WIDTH // 2 + 8, 7), (WIDTH // 2, 11)], fill=(96, 62, 42, 190))
    signature(draw, group)
    return image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--owners", help="comma separated runtime owners")
    args = parser.parse_args()
    owners = set(args.owners.split(",")) if args.owners else None
    contracts = json.loads((EVIDENCE / "generation-contracts.json").read_text())["contracts"]
    selected = [contract for contract in contracts if owners is None or contract["runtimeContract"]["owner"] in owners]
    if not selected:
        raise SystemExit("No Batch C contracts matched --owners")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    Path(str(OUTPUT) + ".meta").write_text(folder_meta("BatchC"))
    for contract in selected:
        group, candidate = contract["assetGroup"], contract["candidateId"]
        directory = OUTPUT / group
        directory.mkdir(parents=True, exist_ok=True)
        Path(str(directory) + ".meta").write_text(folder_meta(group))
        recipe = next(value for value in json.loads((EVIDENCE / "generation-recipes.json").read_text())["recipes"] if value["candidateId"] == candidate)
        path = directory / f"{candidate}.png"
        candidate_image(group, contract["candidateRole"], recipe["seed"]).save(path, format="PNG", optimize=False)
        Path(str(path) + ".meta").write_text(texture_meta(candidate))
    outputs = []
    for contract in contracts:
        path = ROOT / contract["outputPath"]
        if path.exists():
            outputs.append({"assetGroup": contract["assetGroup"], "candidateId": contract["candidateId"], "owner": contract["runtimeContract"]["owner"], "path": contract["outputPath"], "sha256": digest(path), "metaPath": f"{contract['outputPath']}.meta"})
    manifest = {"schemaVersion": 1, "sourceHead": SOURCE_HEAD, "tool": "scripts/unity/build-u48-batch-c-candidates.py", "toolVersion": TOOL_VERSION, "generatedAtUtc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"), "outputCount": len(outputs), "outputs": outputs}
    (EVIDENCE / "candidate-build-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"U48 Batch C candidates built: selected={len(selected)}, total existing={len(outputs)}")


if __name__ == "__main__":
    main()
