#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"
MANIFEST = OUTPUT_DIR / "manifest.json"
CHARACTERS = ("yui", "asa", "nagi", "michiru", "tomori")
CLEAN_PLATE = "core5-clean-composition-plate-v1.png"
LAYOUT_PROOF = "core5-layout-proof-v1.png"
COMBINED_REFERENCE = "core5-clean-generation-reference-pack-v1.png"
IDENTITY_CUTOUTS = [f"core5-{character}-fullbody-cutout-v1.png" for character in CHARACTERS]


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            value.update(chunk)
    return value.hexdigest()


def alpha_component_metrics(image: Image.Image) -> tuple[int, int, int]:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    alpha = list(rgba.getchannel("A").getdata())
    foreground = bytearray(1 if value > 64 else 0 for value in alpha)
    total = sum(foreground)
    seen = bytearray(width * height)
    largest = 0

    for start in range(width * height):
        if not foreground[start] or seen[start]:
            continue
        queue = deque([start])
        seen[start] = 1
        size = 0
        while queue:
            index = queue.popleft()
            size += 1
            y, x = divmod(index, width)
            for neighbor in (
                index - width if y > 0 else -1,
                index + width if y + 1 < height else -1,
                index - 1 if x > 0 else -1,
                index + 1 if x + 1 < width else -1,
            ):
                if neighbor >= 0 and foreground[neighbor] and not seen[neighbor]:
                    seen[neighbor] = 1
                    queue.append(neighbor)
        largest = max(largest, size)

    border = 0
    thickness = max(2, round(width * 0.015))
    for y in range(height):
        for x in range(width - thickness, width):
            border += foreground[y * width + x]
    return total, largest, border


def main() -> None:
    if not MANIFEST.is_file():
        raise RuntimeError("preproduction manifest is missing")
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if manifest.get("schemaVersion") != 3 or manifest.get("authority") != "PREPRODUCTION_ONLY_NOT_FINAL_ART":
        raise RuntimeError("preproduction manifest authority/schema mismatch")
    rules = manifest.get("rules", {})
    if rules.get("mayRegisterAsFinalCandidate") is not False:
        raise RuntimeError("preproduction pack must explicitly forbid final-candidate registration")
    if rules.get("mayPromoteApproval") is not False:
        raise RuntimeError("preproduction pack must explicitly forbid approval promotion")
    if rules.get("rawBridgeAllowedAsGeneratorFacingInput") is not False:
        raise RuntimeError("preproduction pack must forbid raw bridge as generator-facing input")

    engineering_bridge = manifest.get("engineeringBridge", {})
    if engineering_bridge.get("generatorFacing") is not False:
        raise RuntimeError("engineering bridge must remain provenance-only")
    generation_composition = manifest.get("generationComposition", {})
    if generation_composition.get("file") != CLEAN_PLATE:
        raise RuntimeError("preproduction generation composition must bind the clean plate")
    if generation_composition.get("containsBridgeHumans") is not False:
        raise RuntimeError("clean composition plate must explicitly exclude bridge humans")
    if generation_composition.get("containsOnlyCore5WhenHumansArePresent") is not True:
        raise RuntimeError("preproduction model-facing pack must allow only Core5 humans")

    roles = manifest.get("modelInputRoles", {})
    if roles.get("primaryComposition") != CLEAN_PLATE:
        raise RuntimeError("preproduction model-input roles must select the sanitized clean plate as primary composition")
    if roles.get("primaryIdentityCutouts") != IDENTITY_CUTOUTS:
        raise RuntimeError("preproduction model-input roles must select exactly five ordered Core5 identity cutouts")
    if roles.get("optionalConvenienceReference") != COMBINED_REFERENCE:
        raise RuntimeError("preproduction convenience-reference role mismatch")
    if roles.get("blockingOnly") != [LAYOUT_PROOF]:
        raise RuntimeError("preproduction blocking-only role must contain only the layout proof")
    if roles.get("blockingOnlyIsFinalStyleAuthority") is not False:
        raise RuntimeError("preproduction layout proof must never become final-style authority")
    if roles.get("diagnosticsAllowed") is not False:
        raise RuntimeError("preproduction diagnostics must never be model inputs")
    if roles.get("rawBridgeAllowed") is not False:
        raise RuntimeError("preproduction raw bridge must never be a model input")

    by_name = {entry["file"]: entry for entry in manifest.get("outputs", [])}
    expected_names = {CLEAN_PLATE, LAYOUT_PROOF, COMBINED_REFERENCE, *IDENTITY_CUTOUTS}
    if set(by_name) != expected_names:
        raise RuntimeError(f"preproduction output set mismatch: {sorted(by_name)}")

    role_files = {
        roles["primaryComposition"],
        *roles["primaryIdentityCutouts"],
        roles["optionalConvenienceReference"],
        *roles["blockingOnly"],
    }
    if role_files != expected_names:
        raise RuntimeError("preproduction model-input roles must classify every generated PNG exactly once by intent")

    for name, entry in by_name.items():
        path = OUTPUT_DIR / name
        if not path.is_file():
            raise RuntimeError(f"preproduction file missing: {name}")
        if digest(path) != entry.get("sha256"):
            raise RuntimeError(f"preproduction hash mismatch: {name}")
        with Image.open(path) as image:
            image.load()
            if list(image.size) != [entry.get("width"), entry.get("height")]:
                raise RuntimeError(f"preproduction dimension mismatch: {name}")

    with Image.open(OUTPUT_DIR / CLEAN_PLATE) as clean_plate:
        clean_plate.load()
        if clean_plate.size != (430, 932):
            raise RuntimeError(f"clean composition plate must be 430x932, got {clean_plate.size}")
        if clean_plate.mode not in {"RGB", "RGBA"}:
            raise RuntimeError(f"clean composition plate must be RGB/RGBA, got {clean_plate.mode}")

    with Image.open(OUTPUT_DIR / LAYOUT_PROOF) as layout:
        if layout.size != (430, 932):
            raise RuntimeError(f"layout proof must be 430x932, got {layout.size}")
    with Image.open(OUTPUT_DIR / COMBINED_REFERENCE) as reference_pack:
        if reference_pack.size != (1400, 1800):
            raise RuntimeError(f"clean reference pack must be 1400x1800, got {reference_pack.size}")

    for character in CHARACTERS:
        path = OUTPUT_DIR / f"core5-{character}-fullbody-cutout-v1.png"
        with Image.open(path) as sprite:
            sprite.load()
            if sprite.mode != "RGBA":
                raise RuntimeError(f"{character} cutout must be RGBA")
            total, largest, right_border = alpha_component_metrics(sprite)
            if total <= 0:
                raise RuntimeError(f"{character} cutout is empty")
            largest_ratio = largest / total
            border_ratio = right_border / total
            if largest_ratio < 0.82:
                raise RuntimeError(
                    f"{character} cutout has too much disconnected debris: largestRatio={largest_ratio:.4f}"
                )
            if border_ratio > 0.02:
                raise RuntimeError(
                    f"{character} cutout leaks into the neighboring master panel: rightBorderRatio={border_ratio:.4f}"
                )
            print(
                f"{character}: alphaPixels={total} largestRatio={largest_ratio:.4f} rightBorderRatio={border_ratio:.4f}"
            )

    print("TOP preproduction visual pack validation: PASS")
    print("roles: primary=sanitized 430x932 plate + five Core5 cutouts; combined reference optional; layout proof blocking-only; diagnostics/raw bridge forbidden")
    print("all preproduction PNGs are hash-bound and remain non-final/non-approving")


if __name__ == "__main__":
    main()
