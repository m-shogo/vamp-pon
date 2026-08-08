#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
LAYOUT_GENERATOR = ROOT / "scripts/unity/generate-top-living-night-core5-layout-proof.py"
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"
CHARACTERS = ("yui", "asa", "nagi", "michiru", "tomori")


def load_layout_module():
    spec = importlib.util.spec_from_file_location("top_core5_layout_proof_polish", LAYOUT_GENERATOR)
    if spec is None or spec.loader is None:
        raise RuntimeError("could not load Core5 layout generator")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def largest_alpha_component(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    alpha = list(rgba.getchannel("A").getdata())
    foreground = bytearray(1 if value > 64 else 0 for value in alpha)

    # The normalized master crop intentionally includes a tiny safety margin.
    # Remove only the outermost strips before connected-component selection so
    # design-board frame/text fragments cannot stay attached to the figure via
    # paper/ground texture. Core5 silhouettes remain well inside these bounds.
    trim_x = max(3, round(width * 0.025))
    trim_y = max(3, round(height * 0.012))
    for y in range(height):
        row = y * width
        for x in range(trim_x):
            foreground[row + x] = 0
        for x in range(width - trim_x, width):
            foreground[row + x] = 0
    for y in list(range(trim_y)) + list(range(height - trim_y, height)):
        row = y * width
        for x in range(width):
            foreground[row + x] = 0

    seen = bytearray(width * height)
    largest: list[int] = []

    for start in range(width * height):
        if not foreground[start] or seen[start]:
            continue
        pending = [start]
        seen[start] = 1
        component: list[int] = []
        while pending:
            index = pending.pop()
            component.append(index)
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
        if len(component) > len(largest):
            largest = component

    if not largest:
        raise RuntimeError("Core5 cutout has no visible alpha component after border cleanup")

    cleaned_alpha = bytearray(width * height)
    for index in largest:
        cleaned_alpha[index] = alpha[index]
    alpha_image = Image.frombytes("L", (width, height), bytes(cleaned_alpha)).filter(ImageFilter.GaussianBlur(0.5))
    rgba.putalpha(alpha_image)
    return rgba


def rebuild_layout(module, sprites: dict[str, Image.Image]) -> None:
    with Image.open(module.CLEAN_PLATE) as clean_source:
        clean_source.load()
        if clean_source.size != (430, 932):
            raise RuntimeError(f"clean composition plate must remain 430x932, got {clean_source.size}")
        output = clean_source.convert("RGBA")

    for character, x, y, target_height in module.PLACEMENTS:
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
    output.convert("RGB").save(module.LAYOUT_PROOF, format="PNG", optimize=True)


def main() -> None:
    module = load_layout_module()
    sprites: dict[str, Image.Image] = {}
    for character in CHARACTERS:
        path = OUTPUT_DIR / f"core5-{character}-fullbody-cutout-v1.png"
        if not path.is_file():
            raise RuntimeError(f"missing generated Core5 cutout: {path.relative_to(ROOT)}")
        with Image.open(path) as source:
            source.load()
            cleaned = largest_alpha_component(source)
        cleaned.save(path, format="PNG", optimize=True)
        sprites[character] = cleaned
        print(f"cleaned={path.relative_to(ROOT)}")

    rebuild_layout(module, sprites)
    module.make_clean_reference_pack(sprites)
    print(f"rebuilt={module.LAYOUT_PROOF.relative_to(ROOT)}")
    print(f"rebuiltReferencePack={module.REFERENCE_PACK.relative_to(ROOT)}")
    print("TOP Core5 preproduction polish: PASS")
    print("NOTE: generated model-facing visuals contain the clean composition plate + Core5 only; no raw bridge humans or approval authority are written.")


if __name__ == "__main__":
    main()
