#!/usr/bin/env python3
from __future__ import annotations

from collections import deque
import json
import math
from pathlib import Path
from typing import Dict, Iterable, Tuple

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[2]
BRIDGE = ROOT / "docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png"
REFERENCE_MANIFEST = ROOT / "docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json"
FINAL_STATUS = ROOT / "docs/design-targets/generated/top-living-night-v3/final-art-status.json"
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"
LAYOUT_PROOF = OUTPUT_DIR / "core5-layout-proof-v1.png"
REFERENCE_PACK = OUTPUT_DIR / "core5-clean-generation-reference-pack-v1.png"

# The full-body panel occupies the same left-hand region on all locked Core5
# master boards. Coordinates are normalized so locked master resolution can
# change without silently changing identity content.
FULL_BODY_BOXES: Dict[str, Tuple[float, float, float, float]] = {
    "yui": (0.11, 0.16, 0.40, 0.78),
    "asa": (0.11, 0.17, 0.40, 0.79),
    "nagi": (0.11, 0.18, 0.40, 0.80),
    "michiru": (0.11, 0.18, 0.42, 0.81),
    "tomori": (0.11, 0.20, 0.42, 0.81),
}

# Layered blocking, never an equal-scale idol lineup. Back row first.
PLACEMENTS = [
    ("michiru", 38, 370, 140),
    ("nagi", 266, 356, 144),
    ("asa", 90, 386, 170),
    ("tomori", 318, 400, 168),
    ("yui", 171, 346, 186),
]


def invariant(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def normalized_crop(image: Image.Image, box: Tuple[float, float, float, float]) -> Image.Image:
    left, top, right, bottom = box
    return image.crop(
        (
            round(image.width * left),
            round(image.height * top),
            round(image.width * right),
            round(image.height * bottom),
        )
    )


def remove_connected_cream_background(crop: Image.Image) -> Image.Image:
    rgb = np.asarray(crop.convert("RGB"), dtype=np.uint8)
    height, width, _ = rgb.shape
    corner = max(4, min(width, height) // 15)
    samples = np.concatenate(
        [
            rgb[:corner, :corner].reshape(-1, 3),
            rgb[:corner, -corner:].reshape(-1, 3),
            rgb[-corner:, :corner].reshape(-1, 3),
            rgb[-corner:, -corner:].reshape(-1, 3),
        ]
    )
    background = np.median(samples.astype(np.float32), axis=0)
    difference = np.linalg.norm(rgb.astype(np.float32) - background, axis=2)
    maximum = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    saturation = maximum - minimum
    lightness = rgb.mean(axis=2)
    candidate = (difference < 50.0) & (lightness > 150.0) & (saturation < 65)

    background_connected = np.zeros((height, width), dtype=np.bool_)
    queue: deque[Tuple[int, int]] = deque()

    def seed(y: int, x: int) -> None:
        if candidate[y, x] and not background_connected[y, x]:
            background_connected[y, x] = True
            queue.append((y, x))

    for x in range(width):
        seed(0, x)
        seed(height - 1, x)
    for y in range(height):
        seed(y, 0)
        seed(y, width - 1)

    while queue:
        y, x = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < height and 0 <= nx < width and candidate[ny, nx] and not background_connected[ny, nx]:
                background_connected[ny, nx] = True
                queue.append((ny, nx))

    foreground = ~background_connected
    # Remove small disconnected text/palette fragments. The body/ground cluster
    # dominates the crop and the next few components contain prop/lantern edges.
    seen = np.zeros((height, width), dtype=np.bool_)
    components = []
    for y in range(height):
        for x in range(width):
            if not foreground[y, x] or seen[y, x]:
                continue
            points = []
            pending = [(y, x)]
            seen[y, x] = True
            while pending:
                py, px = pending.pop()
                points.append((py, px))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = py + dy, px + dx
                    if 0 <= ny < height and 0 <= nx < width and foreground[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        pending.append((ny, nx))
            components.append(points)

    components.sort(key=len, reverse=True)
    keep = np.zeros((height, width), dtype=np.uint8)
    minimum_area = max(40, (height * width) // 2500)
    for points in components[:5]:
        if len(points) < minimum_area:
            continue
        for y, x in points:
            keep[y, x] = 255

    alpha = Image.fromarray(keep, mode="L").filter(ImageFilter.GaussianBlur(0.7))
    result = crop.convert("RGBA")
    result.putalpha(alpha)
    return result


def extract_core5() -> Dict[str, Image.Image]:
    manifest = json.loads(REFERENCE_MANIFEST.read_text(encoding="utf-8"))
    invariant(manifest.get("schemaVersion") == 1, "Core5 reference manifest schema mismatch")
    invariant(manifest.get("referenceCount") == 5, "layout proof requires exactly five locked Core5 masters")
    extracted: Dict[str, Image.Image] = {}
    for reference in manifest["references"]:
        character = reference["id"]
        invariant(character in FULL_BODY_BOXES, f"unexpected Core5 id: {character}")
        master_path = ROOT / reference["path"]
        invariant(master_path.is_file(), f"Core5 master missing: {reference['path']}")
        with Image.open(master_path) as master:
            master.load()
            crop = normalized_crop(master.convert("RGB"), FULL_BODY_BOXES[character])
            extracted[character] = remove_connected_cream_background(crop)
    invariant(set(extracted) == set(FULL_BODY_BOXES), "layout proof did not extract exactly the Core5 set")
    return extracted


def blur_bridge_human_cluster(bridge: Image.Image) -> Image.Image:
    rgba = bridge.convert("RGBA")
    blurred = rgba.filter(ImageFilter.GaussianBlur(18))
    darkened = Image.alpha_composite(blurred, Image.new("RGBA", rgba.size, (3, 10, 24, 185)))
    mask = Image.new("L", rgba.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((-20, 250, 450, 560), radius=90, fill=245)
    mask = mask.filter(ImageFilter.GaussianBlur(32))
    return Image.composite(darkened, rgba, mask)


def make_layout_proof(sprites: Dict[str, Image.Image]) -> None:
    with Image.open(BRIDGE) as bridge_source:
        bridge_source.load()
        invariant(bridge_source.size == (430, 932), f"bridge must be 430x932, got {bridge_source.size}")
        output = blur_bridge_human_cluster(bridge_source)

    for character, x, y, target_height in PLACEMENTS:
        sprite = sprites[character]
        scale = target_height / sprite.height
        target_width = max(1, round(sprite.width * scale))
        resized = sprite.resize((target_width, target_height), Image.Resampling.LANCZOS)
        alpha = resized.getchannel("A")
        shadow = Image.new("RGBA", resized.size, (0, 0, 0, 0))
        shadow.putalpha(alpha.filter(ImageFilter.GaussianBlur(4)).point(lambda value: round(value * 0.55)))
        output.alpha_composite(shadow, (x + 4, y + 6))
        output.alpha_composite(resized, (x, y))

    warm_mask = Image.new("L", output.size, 0)
    draw = ImageDraw.Draw(warm_mask)
    draw.ellipse((60, 365, 380, 690), fill=55)
    warm_mask = warm_mask.filter(ImageFilter.GaussianBlur(60))
    warm = Image.new("RGBA", output.size, (255, 125, 45, 0))
    warm.putalpha(warm_mask)
    output = Image.alpha_composite(output, warm)
    output.convert("RGB").save(LAYOUT_PROOF, format="PNG", optimize=True)


def make_clean_reference_pack(sprites: Dict[str, Image.Image]) -> None:
    canvas = Image.new("RGB", (1400, 1800), (10, 18, 32))
    with Image.open(BRIDGE) as bridge:
        bridge = ImageOps.contain(bridge.convert("RGB"), (720, 1720), Image.Resampling.LANCZOS)
        canvas.paste(bridge, (40 + (720 - bridge.width) // 2, 40 + (1720 - bridge.height) // 2))

    y = 40
    manifest = json.loads(REFERENCE_MANIFEST.read_text(encoding="utf-8"))
    refs = {entry["id"]: entry for entry in manifest["references"]}
    for character in ("yui", "asa", "nagi", "michiru", "tomori"):
        with Image.open(ROOT / refs[character]["path"]) as board:
            board = ImageOps.contain(board.convert("RGB"), (560, 310), Image.Resampling.LANCZOS)
            canvas.paste(board, (820 + (560 - board.width) // 2, y + (310 - board.height) // 2))
        y += 340
    canvas.save(REFERENCE_PACK, format="PNG", optimize=True)


def main() -> None:
    invariant(BRIDGE.is_file(), f"bridge source missing: {BRIDGE.relative_to(ROOT)}")
    invariant(REFERENCE_MANIFEST.is_file(), "Core5 reference manifest is missing")
    invariant(FINAL_STATUS.is_file(), "final-art status is missing")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    sprites = extract_core5()
    make_layout_proof(sprites)
    make_clean_reference_pack(sprites)

    final_status = json.loads(FINAL_STATUS.read_text(encoding="utf-8"))
    print("TOP Core5 layout proof: GENERATED")
    print(f"layout={LAYOUT_PROOF.relative_to(ROOT)}")
    print(f"referencePack={REFERENCE_PACK.relative_to(ROOT)}")
    print(f"finalCandidateGenerated={str(bool(final_status.get('candidateGenerated'))).lower()}")
    print("NOTE: these are PREPRODUCTION references only; they never set candidateGenerated or any approval flag.")


if __name__ == "__main__":
    main()
