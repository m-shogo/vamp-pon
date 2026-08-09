#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Tuple

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
REFERENCE_MANIFEST = ROOT / "docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json"
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"

# Tight full-body crops from the locked character-master boards. These boxes
# deliberately begin below each panel heading and stay inside the illustrated
# full-body panel so generator-facing references contain one Core5 human only,
# not master-sheet labels, face duplicates, black-evolution art or UI-like grids.
IDENTITY_CROP_BOXES: Dict[str, Tuple[float, float, float, float]] = {
    "yui": (0.15, 0.15, 0.37, 0.70),
    "asa": (0.15, 0.15, 0.36, 0.70),
    "nagi": (0.15, 0.15, 0.36, 0.70),
    "michiru": (0.16, 0.15, 0.36, 0.69),
    "tomori": (0.20, 0.15, 0.38, 0.70),
}
EXPECTED_ORDER = ["yui", "asa", "nagi", "michiru", "tomori"]


def invariant(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def normalized_crop(image: Image.Image, box: Tuple[float, float, float, float]) -> Image.Image:
    left, top, right, bottom = box
    invariant(0.0 <= left < right <= 1.0 and 0.0 <= top < bottom <= 1.0, "invalid normalized identity crop")
    return image.crop(
        (
            round(image.width * left),
            round(image.height * top),
            round(image.width * right),
            round(image.height * bottom),
        )
    )


def main() -> None:
    invariant(REFERENCE_MANIFEST.is_file(), "Core5 reference manifest is missing")
    manifest = json.loads(REFERENCE_MANIFEST.read_text(encoding="utf-8"))
    invariant(manifest.get("schemaVersion") == 1, "Core5 reference manifest schema mismatch")
    invariant(manifest.get("referenceCount") == 5, "Core5 identity references require exactly five locked masters")
    references = manifest.get("references", [])
    invariant([entry.get("id") for entry in references] == EXPECTED_ORDER, "Core5 identity reference order mismatch")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for entry in references:
        character = entry["id"]
        invariant(character in IDENTITY_CROP_BOXES, f"unexpected Core5 id: {character}")
        master_path = ROOT / entry["path"]
        invariant(master_path.is_file(), f"Core5 master missing: {entry['path']}")
        with Image.open(master_path) as master:
            master.load()
            crop = normalized_crop(master.convert("RGB"), IDENTITY_CROP_BOXES[character])

        invariant(crop.width >= 250 and crop.height >= 500, f"Core5 identity crop is too small: {character}={crop.size}")
        invariant(crop.height > crop.width, f"Core5 identity crop must remain portrait: {character}={crop.size}")
        output = OUTPUT_DIR / f"core5-{character}-identity-reference-v1.png"
        crop.save(output, format="PNG", optimize=True)
        print(f"identityReference={output.relative_to(ROOT)} size={crop.width}x{crop.height}")

    print("TOP Core5 identity reference pack: GENERATED")
    print("NOTE: generator-facing identity references are single-human full-body crops from locked masters, below master-sheet headings; no duplicate face panel, black-evolution panel, dashboard or approval authority is included.")


if __name__ == "__main__":
    main()
