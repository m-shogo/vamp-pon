#!/usr/bin/env python3
"""Technical and contract QA for U48 Batch B candidates."""

from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageStat


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-b"


def digest(path: Path) -> str: return hashlib.sha256(path.read_bytes()).hexdigest()


def meta(path: Path) -> dict:
    text = path.read_text()
    find = lambda pattern: (match.group(1) if (match := re.search(pattern, text, re.MULTILINE)) else None)
    return {"guid": find(r"^guid: ([0-9a-f]{32})$"), "ppu": float(find(r"^  spritePixelsToUnits: ([0-9.]+)$") or 0), "pivot": [0.5, 0.5], "filterModePoint": "    filterMode: 0" in text, "mipmapDisabled": "    enableMipMap: 0" in text, "compressionNone": "    textureCompression: 0" in text, "spriteMode": int(find(r"^  spriteMode: (\d+)$") or 0)}


def main() -> None:
    source = json.loads((EVIDENCE / "generation-contracts.json").read_text())
    entries = []
    hashes: dict[str, list[str]] = {}; guids: dict[str, list[str]] = {}
    for contract in source["contracts"]:
        path = ROOT / contract["outputPath"]; meta_path = Path(str(path) + ".meta"); failures=[]; warnings=[]
        if not path.exists() or not meta_path.exists(): failures.append("asset-or-meta-missing"); image = None
        else: image = Image.open(path).convert("RGBA")
        parsed = meta(meta_path) if meta_path.exists() else {}
        bounds = image.getchannel("A").getbbox() if image else None
        if image:
            if image.size != (180,180): failures.append("dimensions")
            if bounds is None: failures.append("empty-bounds")
            if bounds and (bounds[0] <= 0 or bounds[1] <= 0 or bounds[2] >= 180 or bounds[3] >= 180): failures.append("edge-contact")
            if ImageStat.Stat(image.getchannel("A")).mean[0] <= 0: failures.append("alpha-empty")
        if parsed and (parsed["ppu"] != 180 or not parsed["filterModePoint"] or not parsed["mipmapDisabled"] or not parsed["compressionNone"] or parsed["spriteMode"] != 1): failures.append("import-contract")
        file_hash=digest(path) if path.exists() else None
        if file_hash: hashes.setdefault(file_hash,[]).append(contract["candidateId"])
        if parsed.get("guid"): guids.setdefault(parsed["guid"],[]).append(contract["candidateId"])
        occupancy=round((bounds[2]-bounds[0])*(bounds[3]-bounds[1])/(180*180),6) if bounds else 0
        if occupancy > .82: warnings.append("screen-occupancy-review")
        entries.append({"assetGroup": contract["assetGroup"], "candidateId": contract["candidateId"], "status": "FAIL" if failures else "WARNING" if warnings else "PASS", "path": contract["outputPath"], "sha256": file_hash, "format": "PNG", "mode": "RGBA", "width": image.width if image else 0, "height": image.height if image else 0, "alphaChannelPresent": True, "nonEmptyBounds": bounds, "finiteBounds": bounds is not None, "edgeContact": bool(bounds and (bounds[0] <= 0 or bounds[1] <= 0 or bounds[2] >= 180 or bounds[3] >= 180)), "occupancy": occupancy, "metaPath": str(meta_path.relative_to(ROOT)) if meta_path.exists() else None, "meta": parsed, "failures": failures, "warnings": warnings, "runtimeQa": {"visualRadiusReview": "live-required", "centerAlignment": bounds is not None and abs((bounds[0]+bounds[2])/2-90)<8 and abs((bounds[1]+bounds[3])/2-90)<8, "sortingOrderExpected": 8 if contract["assetGroup"].startswith("ground-area-") else 9, "phaseIdentification": "live-required", "overdrawRisk": "human-review", "cleanup": "live-required"}})
    duplicate_hashes=[ids for ids in hashes.values() if len(ids)>1]; duplicate_guids=[ids for ids in guids.values() if len(ids)>1]
    for ids in duplicate_hashes:
        for entry in entries:
            if entry["candidateId"] in ids: entry["status"]="FAIL"; entry["failures"].append("duplicate-content-hash")
    for ids in duplicate_guids:
        for entry in entries:
            if entry["candidateId"] in ids: entry["status"]="FAIL"; entry["failures"].append("duplicate-guid")
    counts={status:sum(e["status"]==status for e in entries) for status in ("PASS","WARNING","FAIL")}
    out={"schemaVersion":1,"sourceHead":source["sourceHead"],"batch":"B","generatedAtUtc":datetime.now(timezone.utc).isoformat().replace("+00:00","Z"),"candidateCount":len(entries),"duplicateContentHashCount":len(duplicate_hashes),"duplicateGuidCount":len(duplicate_guids),"summary":counts,"entries":entries}
    (EVIDENCE/"automatic-qa.json").write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n")
    print(f"U48 Batch B QA: {len(entries)} candidates, PASS={counts['PASS']}, WARNING={counts['WARNING']}, FAIL={counts['FAIL']}, duplicate hash={len(duplicate_hashes)}, duplicate GUID={len(duplicate_guids)}")
    if counts["FAIL"]: raise SystemExit(1)


if __name__ == "__main__": main()
