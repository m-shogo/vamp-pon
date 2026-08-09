#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
from typing import Tuple

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
FINAL_STATUS = ROOT / "docs/design-targets/generated/top-living-night-v3/final-art-status.json"
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/crop-review-previews"
TARGETS: Tuple[Tuple[int, int], ...] = ((360, 800), (390, 844), (430, 932))
TITLE_FRACTION = 0.22
BUTTON_FRACTION = 0.22


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def center_cover(image: Image.Image, target_width: int, target_height: int) -> Image.Image:
    scale = max(target_width / image.width, target_height / image.height)
    scaled_width = math.ceil(image.width * scale)
    scaled_height = math.ceil(image.height * scale)
    resized = image.resize((scaled_width, scaled_height), Image.Resampling.LANCZOS)
    left = max(0, (scaled_width - target_width) // 2)
    top = max(0, (scaled_height - target_height) // 2)
    return resized.crop((left, top, left + target_width, top + target_height))


def overlay_safe_areas(image: Image.Image) -> Image.Image:
    result = image.convert("RGBA")
    draw = ImageDraw.Draw(result, "RGBA")
    width, height = result.size
    title_bottom = round(height * TITLE_FRACTION)
    button_top = round(height * (1.0 - BUTTON_FRACTION))

    # Review-only overlays: translucent, intentionally impossible to confuse
    # with the final candidate because the output path is generated-only.
    draw.rectangle((0, 0, width - 1, title_bottom), fill=(40, 80, 180, 55), outline=(100, 160, 255, 210), width=2)
    draw.rectangle((0, button_top, width - 1, height - 1), fill=(180, 70, 40, 55), outline=(255, 150, 100, 210), width=2)
    draw.line((0, title_bottom, width, title_bottom), fill=(100, 160, 255, 230), width=2)
    draw.line((0, button_top, width, button_top), fill=(255, 150, 100, 230), width=2)
    return result


def main() -> None:
    status = json.loads(FINAL_STATUS.read_text(encoding="utf-8"))
    candidate = ROOT / status["candidatePath"]

    if not status.get("candidateGenerated"):
        print("TOP crop review pack: NOT_READY")
        print("NEXT=final-candidate")
        return

    if not candidate.is_file():
        raise SystemExit(f"registered final candidate is missing: {candidate.relative_to(ROOT)}")

    expected_sha = status.get("candidateSha256", "")
    actual_sha = sha256(candidate)
    if actual_sha != expected_sha:
        raise SystemExit(f"registered final candidate SHA mismatch: expected={expected_sha} actual={actual_sha}")

    with Image.open(candidate) as source:
        source.load()
        if source.size != (430, 932):
            raise SystemExit(f"final candidate must be 430x932, got {source.size[0]}x{source.size[1]}")
        source = source.convert("RGB")

        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        manifest = {
            "schemaVersion": 1,
            "sourcePath": status["candidatePath"],
            "sourceSha256": actual_sha,
            "cropMode": "center-cover-envelope-parent",
            "titleSafeFraction": TITLE_FRACTION,
            "buttonSafeFraction": BUTTON_FRACTION,
            "targets": [],
        }

        for width, height in TARGETS:
            crop = center_cover(source, width, height)
            raw_name = f"top-core5-crop-{width}x{height}.png"
            overlay_name = f"top-core5-crop-{width}x{height}-safe-area.png"
            raw_path = OUTPUT_DIR / raw_name
            overlay_path = OUTPUT_DIR / overlay_name
            crop.save(raw_path, format="PNG", optimize=True)
            overlay_safe_areas(crop).save(overlay_path, format="PNG", optimize=True)
            manifest["targets"].append(
                {
                    "resolution": f"{width}x{height}",
                    "rawPreview": raw_name,
                    "rawSha256": sha256(raw_path),
                    "safeAreaPreview": overlay_name,
                    "safeAreaSha256": sha256(overlay_path),
                }
            )

    manifest_path = OUTPUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("TOP crop review pack: GENERATED")
    print(f"candidateSha256={actual_sha}")
    print("targets=360x800,390x844,430x932")
    print(f"output={OUTPUT_DIR.relative_to(ROOT)}")
    print("NOTE: previews are review-only generated artifacts and never approve crop status automatically.")


if __name__ == "__main__":
    main()
