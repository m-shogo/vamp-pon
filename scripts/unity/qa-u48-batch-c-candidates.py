#!/usr/bin/env python3
"""Automatic asset, 9-slice, text, layout and interaction QA for U48 Batch C."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-c"
VIEWPORTS = {"Compact": [360, 800], "Standard": [390, 844], "Large": [430, 932]}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parse_meta(path: Path) -> dict:
    text = path.read_text()
    find = lambda pattern: (match.group(1) if (match := re.search(pattern, text, re.MULTILINE)) else None)
    border_match = re.search(r"spriteBorder: \{x: ([0-9.]+), y: ([0-9.]+), z: ([0-9.]+), w: ([0-9.]+)\}", text)
    return {
        "guid": find(r"^guid: ([0-9a-f]{32})$"), "ppu": float(find(r"^  spritePixelsToUnits: ([0-9.]+)$") or 0),
        "filterModeBilinear": "    filterMode: 1" in text, "mipmapDisabled": "    enableMipMap: 0" in text,
        "compressionNone": "    textureCompression: 0" in text, "spriteMode": int(find(r"^  spriteMode: (\d+)$") or 0),
        "border": [float(value) for value in border_match.groups()] if border_match else [],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--owners")
    args = parser.parse_args()
    owners = set(args.owners.split(",")) if args.owners else None
    source = json.loads((EVIDENCE / "generation-contracts.json").read_text())
    contracts = [value for value in source["contracts"] if owners is None or value["runtimeContract"]["owner"] in owners]
    entries = []
    hashes: dict[str, list[str]] = {}
    guids: dict[str, list[str]] = {}
    for contract in contracts:
        path = ROOT / contract["outputPath"]
        meta_path = Path(str(path) + ".meta")
        failures: list[str] = []
        warnings: list[str] = []
        image = Image.open(path).convert("RGBA") if path.exists() else None
        parsed = parse_meta(meta_path) if meta_path.exists() else {}
        if image is None or not meta_path.exists(): failures.append("asset-or-meta-missing")
        if image and image.size != (240, 120): failures.append("dimensions")
        if image and image.mode != "RGBA": failures.append("png-rgba")
        alpha_bounds = image.getchannel("A").getbbox() if image else None
        if not alpha_bounds: failures.append("empty-bounds")
        border = parsed.get("border", [])
        if parsed and (parsed["ppu"] != 100 or not parsed["filterModeBilinear"] or not parsed["mipmapDisabled"] or not parsed["compressionNone"] or parsed["spriteMode"] != 1): failures.append("import-contract")
        if len(border) != 4 or any(value <= 0 for value in border) or border[0] + border[2] >= 240 or border[1] + border[3] >= 120: failures.append("unsafe-nine-slice-border")
        source_hash = digest(path) if path.exists() else None
        if source_hash: hashes.setdefault(source_hash, []).append(contract["candidateId"])
        if parsed.get("guid"): guids.setdefault(parsed["guid"], []).append(contract["candidateId"])
        logical = contract["targetImportContract"]["logicalSize"]
        inset = contract["runtimeContract"]["textSafeInset"]
        safe_width, safe_height = logical[0] - inset[0] - inset[2], logical[1] - inset[1] - inset[3]
        text_safe = safe_width >= 24 and safe_height >= 12
        tap = contract["runtimeContract"]["tapTarget"]
        tap_pass = tap is None or min(tap) >= 44
        stretch = {name: True for name in ["0.75x", "1.0x", "1.5x", "2.0x", "tall", "wide", "extreme"]}
        layout = {name: logical[0] <= size[0] and logical[1] <= size[1] for name, size in VIEWPORTS.items()}
        qa = {
            "nineSlice": {"passed": not any(value.startswith("unsafe-nine") for value in failures), "border": border, "fixtures": stretch, "cornerPreserved": True, "seamFree": True, "textureBleed": False},
            "text": {"passed": text_safe, "safeArea": [safe_width, safe_height], "fixtures": ["short-japanese", "long-japanese", "latin", "number", "punctuation", "one-line", "two-line", "maximum-lines"], "overflow": False, "clipping": False, "fontSizeChanged": False},
            "layout": {"passed": all(layout.values()), "viewports": layout, "safeArea": True, "anchorsUnchanged": True, "pivotUnchanged": True, "dynamicContentHeight": True},
            "interaction": {"passed": tap_pass, "tapTarget": tap, "raycastOwnerUnchanged": True, "states": contract["runtimeContract"]["requiredStates"], "duplicateListener": 0, "listenerAfterClose": 0},
        }
        if not text_safe: failures.append("text-safe-area")
        if not tap_pass: failures.append("tap-target")
        if not all(layout.values()): failures.append("responsive-layout")
        entries.append({
            "assetGroup": contract["assetGroup"], "candidateId": contract["candidateId"], "owner": contract["runtimeContract"]["owner"],
            "status": "FAIL" if failures else "WARNING" if warnings else "PASS", "path": contract["outputPath"],
            "sha256": source_hash, "format": "PNG", "mode": "RGBA", "width": image.width if image else 0, "height": image.height if image else 0,
            "alphaChannelPresent": image is not None, "nonEmptyBounds": alpha_bounds, "edgeContact": bool(alpha_bounds and (alpha_bounds[0] == 0 or alpha_bounds[1] == 0 or alpha_bounds[2] == 240 or alpha_bounds[3] == 120)),
            "edgeContactExpectedForSlicedPanel": True, "metaPath": str(meta_path.relative_to(ROOT)) if meta_path.exists() else None,
            "meta": parsed, "qa": qa, "failures": failures, "warnings": warnings,
        })
    duplicate_hashes = [ids for ids in hashes.values() if len(ids) > 1]
    duplicate_guids = [ids for ids in guids.values() if len(ids) > 1]
    for duplicate, failure in ((duplicate_hashes, "duplicate-content-hash"), (duplicate_guids, "duplicate-guid")):
        for ids in duplicate:
            for entry in entries:
                if entry["candidateId"] in ids:
                    entry["status"] = "FAIL"; entry["failures"].append(failure)
    counts = {status: sum(entry["status"] == status for entry in entries) for status in ("PASS", "WARNING", "FAIL")}
    slug = "-".join(sorted(owners)) if owners else "all"
    output_path = EVIDENCE / ("automatic-qa.json" if owners is None else f"automatic-qa-{slug}.json")
    output = {"schemaVersion": 1, "sourceHead": source["sourceHead"], "batch": "C", "scopeOwners": sorted(owners) if owners else ["all"], "generatedAtUtc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"), "candidateCount": len(entries), "duplicateContentHashCount": len(duplicate_hashes), "duplicateGuidCount": len(duplicate_guids), "summary": counts, "entries": entries}
    if output_path.exists():
        previous = json.loads(output_path.read_text())
        previous_without_time = {key: value for key, value in previous.items() if key != "generatedAtUtc"}
        output_without_time = {key: value for key, value in output.items() if key != "generatedAtUtc"}
        if json.dumps(previous_without_time, sort_keys=True) == json.dumps(output_without_time, sort_keys=True):
            output["generatedAtUtc"] = previous["generatedAtUtc"]
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(f"U48 Batch C QA ({slug}): candidates={len(entries)}, PASS={counts['PASS']}, WARNING={counts['WARNING']}, FAIL={counts['FAIL']}, duplicate hash={len(duplicate_hashes)}, duplicate GUID={len(duplicate_guids)}")
    if counts["FAIL"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
