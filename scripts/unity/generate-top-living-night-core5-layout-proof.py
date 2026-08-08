#!/usr/bin/env python3
from __future__ import annotations

from collections import deque
import json
import math
from pathlib import Path
from statistics import median
from typing import Dict, Tuple

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[2]
LAYER_ROOT = ROOT / "docs/design-targets/generated/top-living-night-v2/layers"
ENGINEERING_BRIDGE = ROOT / "docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png"
REFERENCE_MANIFEST = ROOT / "docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json"
FINAL_STATUS = ROOT / "docs/design-targets/generated/top-living-night-v3/final-art-status.json"
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"
CLEAN_PLATE = OUTPUT_DIR / "core5-clean-composition-plate-v1.png"
LAYOUT_PROOF = OUTPUT_DIR / "core5-layout-proof-v1.png"
REFERENCE_PACK = OUTPUT_DIR / "core5-clean-generation-reference-pack-v1.png"
TARGET_SIZE = (430, 932)
TARGET_ASPECT = TARGET_SIZE[0] / TARGET_SIZE[1]

# Generator-facing composition deliberately excludes every human-bearing bridge
# layer. Dynamic additive masks are also excluded because they are black-backed
# luminance masks whose ownership remains in Unity Runtime V3.
CLEAN_PLATE_LAYERS = (
    ("00-environment-starless.png", 1.00),
    ("01-stars.png", 0.72),
    ("01-moon.png", 1.00),
    ("02-clouds-far.png", 0.78),
    ("03-clouds-near.png", 0.82),
    ("09-fire-base.png", 1.00),
    ("08-animal-robot.png", 1.00),
    ("14-foreground-accents.png", 1.00),
)
FORBIDDEN_GENERATOR_LAYERS = {
    "05-distant-companion.png",
    "06-characters.png",
    "04-distant-lights-mask.png",
    "08-robot-eye-mask.png",
    "11-fire-glow-mask.png",
    "14-lantern-glow-mask.png",
}

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


def color_distance(left: Tuple[int, int, int], right: Tuple[float, float, float]) -> float:
    return math.sqrt(sum((left[index] - right[index]) ** 2 for index in range(3)))


def remove_connected_cream_background(crop: Image.Image) -> Image.Image:
    rgb = crop.convert("RGB")
    width, height = rgb.size
    pixels = list(rgb.getdata())
    corner = max(4, min(width, height) // 15)

    sample_pixels = []
    for y in range(corner):
        for x in range(corner):
            sample_pixels.append(pixels[y * width + x])
            sample_pixels.append(pixels[y * width + (width - 1 - x)])
            sample_pixels.append(pixels[(height - 1 - y) * width + x])
            sample_pixels.append(pixels[(height - 1 - y) * width + (width - 1 - x)])
    background = tuple(float(median(channel)) for channel in zip(*sample_pixels))

    candidate = [False] * (width * height)
    for index, pixel in enumerate(pixels):
        lightness = sum(pixel) / 3.0
        saturation = max(pixel) - min(pixel)
        candidate[index] = (
            color_distance(pixel, background) < 50.0
            and lightness > 150.0
            and saturation < 65
        )

    background_connected = bytearray(width * height)
    queue: deque[int] = deque()

    def seed(index: int) -> None:
        if candidate[index] and not background_connected[index]:
            background_connected[index] = 1
            queue.append(index)

    for x in range(width):
        seed(x)
        seed((height - 1) * width + x)
    for y in range(height):
        seed(y * width)
        seed(y * width + width - 1)

    while queue:
        index = queue.popleft()
        y, x = divmod(index, width)
        if y > 0:
            neighbor = index - width
            if candidate[neighbor] and not background_connected[neighbor]:
                background_connected[neighbor] = 1
                queue.append(neighbor)
        if y + 1 < height:
            neighbor = index + width
            if candidate[neighbor] and not background_connected[neighbor]:
                background_connected[neighbor] = 1
                queue.append(neighbor)
        if x > 0:
            neighbor = index - 1
            if candidate[neighbor] and not background_connected[neighbor]:
                background_connected[neighbor] = 1
                queue.append(neighbor)
        if x + 1 < width:
            neighbor = index + 1
            if candidate[neighbor] and not background_connected[neighbor]:
                background_connected[neighbor] = 1
                queue.append(neighbor)

    foreground = bytearray(0 if background_connected[index] else 1 for index in range(width * height))
    seen = bytearray(width * height)
    components = []
    for start in range(width * height):
        if not foreground[start] or seen[start]:
            continue
        points = []
        pending = [start]
        seen[start] = 1
        while pending:
            index = pending.pop()
            points.append(index)
            y, x = divmod(index, width)
            for neighbor in (
                index - width if y > 0 else -1,
                index + width if y + 1 < height else -1,
                index - 1 if x > 0 else -1,
                index + 1 if x + 1 < width else -1,
            ):
                if neighbor >= 0 and foreground[neighbor] and not seen[neighbor]:
                    seen[neighbor] = 1
                    pending.append(neighbor)
        components.append(points)

    components.sort(key=len, reverse=True)
    alpha = bytearray(width * height)
    minimum_area = max(40, (height * width) // 2500)
    for points in components[:5]:
        if len(points) < minimum_area:
            continue
        for index in points:
            alpha[index] = 255

    alpha_image = Image.frombytes("L", (width, height), bytes(alpha)).filter(ImageFilter.GaussianBlur(0.7))
    result = rgb.convert("RGBA")
    result.putalpha(alpha_image)
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


def apply_layer_opacity(image: Image.Image, opacity: float) -> Image.Image:
    rgba = image.convert("RGBA")
    if opacity >= 0.999:
        return rgba
    alpha = rgba.getchannel("A").point(lambda value: round(value * opacity))
    rgba.putalpha(alpha)
    return rgba


def build_clean_composition_plate() -> None:
    layer_names = {name for name, _ in CLEAN_PLATE_LAYERS}
    invariant(not (layer_names & FORBIDDEN_GENERATOR_LAYERS), "clean TOP plate accidentally includes a forbidden human/mask layer")

    output: Image.Image | None = None
    native_size: Tuple[int, int] | None = None
    for index, (file_name, opacity) in enumerate(CLEAN_PLATE_LAYERS):
        path = LAYER_ROOT / file_name
        invariant(path.is_file(), f"clean TOP plate source missing: {path.relative_to(ROOT)}")
        with Image.open(path) as source:
            source.load()
            source_size = source.size
            source_aspect = source.width / source.height
            invariant(
                abs(source_aspect - TARGET_ASPECT) < 0.002,
                f"clean TOP plate layer aspect mismatch: {file_name}={source.size}",
            )
            if native_size is None:
                native_size = source_size
            else:
                invariant(
                    source_size == native_size,
                    f"clean TOP plate layers must share native dimensions: expected {native_size}, {file_name}={source_size}",
                )
            layer = source.convert("RGBA")

        if index == 0:
            output = layer
            continue

        alpha_min, alpha_max = layer.getchannel("A").getextrema()
        invariant(alpha_min < 255, f"clean TOP overlay must contain transparency: {file_name}")
        invariant(alpha_max > 0, f"clean TOP overlay is fully transparent: {file_name}")
        output = Image.alpha_composite(output, apply_layer_opacity(layer, opacity))

    invariant(output is not None and native_size is not None, "clean TOP composition plate did not render")
    if output.size != TARGET_SIZE:
        output = output.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    invariant(output.size == TARGET_SIZE, f"clean TOP composition plate target resize failed: {output.size}")
    output.convert("RGB").save(CLEAN_PLATE, format="PNG", optimize=True)


def make_layout_proof(sprites: Dict[str, Image.Image]) -> None:
    with Image.open(CLEAN_PLATE) as clean_source:
        clean_source.load()
        invariant(clean_source.size == TARGET_SIZE, f"clean composition plate must be 430x932, got {clean_source.size}")
        output = clean_source.convert("RGBA")

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
    # Model-facing combined reference intentionally contains no raw bridge and
    # no master-board labels/text. The left side is the five-Core5 layout proof;
    # the right side is five transparent identity silhouettes on a neutral field.
    canvas = Image.new("RGB", (1400, 1800), (10, 18, 32))
    with Image.open(LAYOUT_PROOF) as layout:
        layout = ImageOps.contain(layout.convert("RGB"), (720, 1720), Image.Resampling.LANCZOS)
        canvas.paste(layout, (40 + (720 - layout.width) // 2, 40 + (1720 - layout.height) // 2))

    y = 40
    for character in ("yui", "asa", "nagi", "michiru", "tomori"):
        sprite = ImageOps.contain(sprites[character].convert("RGBA"), (500, 300), Image.Resampling.LANCZOS)
        x = 820 + (560 - sprite.width) // 2
        slot_y = y + (310 - sprite.height) // 2
        canvas.paste(sprite.convert("RGB"), (x, slot_y), sprite.getchannel("A"))
        y += 340
    canvas.save(REFERENCE_PACK, format="PNG", optimize=True)


def main() -> None:
    invariant(LAYER_ROOT.is_dir(), f"TOP V2 layer root missing: {LAYER_ROOT.relative_to(ROOT)}")
    invariant(ENGINEERING_BRIDGE.is_file(), f"engineering bridge source missing: {ENGINEERING_BRIDGE.relative_to(ROOT)}")
    invariant(REFERENCE_MANIFEST.is_file(), "Core5 reference manifest is missing")
    invariant(FINAL_STATUS.is_file(), "final-art status is missing")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    build_clean_composition_plate()
    sprites = extract_core5()
    make_layout_proof(sprites)
    make_clean_reference_pack(sprites)

    final_status = json.loads(FINAL_STATUS.read_text(encoding="utf-8"))
    print("TOP Core5 layout proof: GENERATED")
    print(f"cleanPlate={CLEAN_PLATE.relative_to(ROOT)}")
    print(f"layout={LAYOUT_PROOF.relative_to(ROOT)}")
    print(f"referencePack={REFERENCE_PACK.relative_to(ROOT)}")
    print(f"finalCandidateGenerated={str(bool(final_status.get('candidateGenerated'))).lower()}")
    print("NOTE: generator-facing visuals exclude all bridge humans; native V2 layers are composited before one high-quality 430x932 downsample; outputs are PREPRODUCTION references only and never set candidateGenerated or any approval flag.")


if __name__ == "__main__":
    main()
