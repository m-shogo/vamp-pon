#!/usr/bin/env python3
"""Run deterministic technical QA for generated U48 Batch A candidate assets."""

from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageStat


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-a"
CONTRACTS = EVIDENCE / "generation-contracts.json"
OUTPUT = EVIDENCE / "automatic-qa.json"
SHEET_GROUPS = {"player-yui", "enemy-onbu"}
BACKGROUND_GROUP = "stage1-background"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parse_meta(path: Path) -> dict[str, object]:
    text = path.read_text()
    guid = re.search(r"^guid: ([0-9a-f]{32})$", text, re.MULTILINE)
    ppu = re.search(r"^  spritePixelsToUnits: ([0-9.]+)$", text, re.MULTILINE)
    sprite_mode = re.search(r"^  spriteMode: (\d+)$", text, re.MULTILINE)
    return {
        "guid": guid.group(1) if guid else None,
        "ppu": float(ppu.group(1)) if ppu else None,
        "spriteMode": int(sprite_mode.group(1)) if sprite_mode else None,
        "filterModePoint": "    filterMode: 0" in text,
        "mipmapDisabled": "    enableMipMap: 0" in text,
        "defaultCompressionNone": "    textureCompression: 0" in text,
    }


def alpha_bounds(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").getbbox()


def touches_edge(bounds: tuple[int, int, int, int] | None, width: int, height: int) -> bool:
    return bounds is not None and (bounds[0] <= 0 or bounds[1] <= 0 or bounds[2] >= width or bounds[3] >= height)


def qa(contract: dict[str, object]) -> dict[str, object]:
    path = ROOT / str(contract["outputPath"])
    meta_path = Path(str(path) + ".meta")
    failures: list[str] = []
    warnings: list[str] = []
    expected_size = (1440, 1080) if contract["assetGroup"] in SHEET_GROUPS else (390, 844) if contract["assetGroup"] == BACKGROUND_GROUP else (180, 180)
    if not path.exists():
        return {"candidateId": contract["candidateId"], "assetGroup": contract["assetGroup"], "status": "FAIL", "failures": ["file-missing"], "warnings": []}
    image = Image.open(path)
    if image.format != "PNG": failures.append("format-not-png")
    if image.mode != "RGBA": failures.append("mode-not-rgba")
    if image.size != expected_size: failures.append("unexpected-dimensions")
    if digest(path) != contract["outputSha256"]: failures.append("output-sha-mismatch")
    bounds = alpha_bounds(image.convert("RGBA"))
    if bounds is None: failures.append("empty-alpha-bounds")
    if not meta_path.exists(): failures.append("meta-missing")
    meta = parse_meta(meta_path) if meta_path.exists() else {}
    import_contract = contract["targetImportContract"]
    if meta and meta.get("ppu") != float(import_contract["ppu"]): failures.append("ppu-mismatch")
    if meta and not meta.get("filterModePoint"): failures.append("filter-mode-not-point")
    if meta and not meta.get("mipmapDisabled"): failures.append("mipmap-enabled")
    if meta and not meta.get("defaultCompressionNone"): failures.append("default-compression-not-none")
    expected_mode = 2 if contract["assetGroup"] in SHEET_GROUPS else 1
    if meta and meta.get("spriteMode") != expected_mode: failures.append("sprite-mode-mismatch")

    frame_qa = None
    if contract["assetGroup"] in SHEET_GROUPS:
        empty_frames = 0
        clipped_frames = 0
        coverages: list[float] = []
        for row in range(6):
            for column in range(8):
                frame = image.crop((column * 180, row * 180, (column + 1) * 180, (row + 1) * 180)).convert("RGBA")
                frame_bounds = alpha_bounds(frame)
                if frame_bounds is None:
                    empty_frames += 1
                    continue
                if touches_edge(frame_bounds, 180, 180): clipped_frames += 1
                coverages.append((frame_bounds[2] - frame_bounds[0]) * (frame_bounds[3] - frame_bounds[1]) / (180 * 180))
        if empty_frames: failures.append("empty-animation-frame")
        if clipped_frames: warnings.append("frame-edge-contact")
        frame_qa = {
            "expectedFrameCount": 48,
            "detectedFrameCount": 48 - empty_frames,
            "grid": "8x6",
            "cellSize": "180x180",
            "emptyFrameCount": empty_frames,
            "clippedFrameCount": clipped_frames,
            "coverageMin": min(coverages) if coverages else 0,
            "coverageMax": max(coverages) if coverages else 0,
            "directionContractRecorded": True,
            "continuityRequiresLiveReview": True,
        }
    elif contract["assetGroup"] != BACKGROUND_GROUP and touches_edge(bounds, image.width, image.height):
        warnings.append("sprite-edge-contact")

    background_qa = None
    if contract["assetGroup"] == BACKGROUND_GROUP:
        rgb = image.convert("RGB")
        stats = ImageStat.Stat(rgb)
        luminance = tuple(round(value, 3) for value in stats.mean)
        variance = tuple(round(value, 3) for value in stats.var)
        background_qa = {
            "exactRuntimeDimensions": image.size == (390, 844),
            "meanRgb": luminance,
            "varianceRgb": variance,
            "seamReview": "live-capture-required",
            "contrastReview": "live-capture-required",
            "excessiveSaturation": max(luminance) - min(luminance) > 95,
        }
        if background_qa["excessiveSaturation"]: warnings.append("background-saturation-risk")

    occupancy = None
    if bounds is not None:
        occupancy = round((bounds[2] - bounds[0]) * (bounds[3] - bounds[1]) / (image.width * image.height), 6)
        if contract["assetGroup"] not in SHEET_GROUPS | {BACKGROUND_GROUP} and occupancy > .72: warnings.append("oversized-bounds")

    status = "FAIL" if failures else "WARNING" if warnings else "PASS"
    return {
        "assetGroup": contract["assetGroup"],
        "candidateId": contract["candidateId"],
        "status": status,
        "path": contract["outputPath"],
        "sha256": digest(path),
        "format": image.format,
        "mode": image.mode,
        "width": image.width,
        "height": image.height,
        "alphaChannelPresent": "A" in image.getbands(),
        "nonEmptyBounds": bounds,
        "edgeContact": touches_edge(bounds, image.width, image.height),
        "occupancy": occupancy,
        "metaPath": str(meta_path.relative_to(ROOT)) if meta_path.exists() else None,
        "meta": meta,
        "frameQa": frame_qa,
        "backgroundQa": background_qa,
        "failures": failures,
        "warnings": warnings,
        "notAutomated": ["animation jitter", "silhouette/identity drift", "gameplay-size visibility", "density/overdraw", "live sorting and lifetime"],
    }


def main() -> None:
    source = json.loads(CONTRACTS.read_text())
    entries = [qa(contract) for contract in source["contracts"] if contract["outputSha256"] is not None]
    hashes: dict[str, list[str]] = {}
    for entry in entries:
        hashes.setdefault(entry.get("sha256", "missing"), []).append(entry["candidateId"])
    duplicates = [values for key, values in hashes.items() if key != "missing" and len(values) > 1]
    if duplicates:
        for duplicate_ids in duplicates:
            for entry in entries:
                if entry["candidateId"] in duplicate_ids:
                    entry["status"] = "FAIL"
                    entry["failures"].append("duplicate-content-hash")
    guids: dict[str, list[str]] = {}
    for entry in entries:
        value = entry.get("meta", {}).get("guid")
        if value: guids.setdefault(value, []).append(entry["candidateId"])
    duplicate_guids = [values for values in guids.values() if len(values) > 1]
    if duplicate_guids:
        for duplicate_ids in duplicate_guids:
            for entry in entries:
                if entry["candidateId"] in duplicate_ids:
                    entry["status"] = "FAIL"
                    entry["failures"].append("duplicate-guid")
    counts = {status: sum(entry["status"] == status for entry in entries) for status in ["PASS", "WARNING", "FAIL"]}
    output = {
        "schemaVersion": 1,
        "sourceHead": source["sourceHead"],
        "batch": "A",
        "generatedAtUtc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "candidateCount": len(entries),
        "duplicateContentHashCount": len(duplicates),
        "duplicateGuidCount": len(duplicate_guids),
        "summary": counts,
        "entries": entries,
    }
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(f"U48 Batch A QA: {len(entries)} candidates, PASS={counts['PASS']}, WARNING={counts['WARNING']}, FAIL={counts['FAIL']}, duplicate hash={len(duplicates)}, duplicate GUID={len(duplicate_guids)}")


if __name__ == "__main__":
    main()
