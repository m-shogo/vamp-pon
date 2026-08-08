#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"
REFERENCE_MANIFEST = ROOT / "docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json"
FINAL_STATUS = ROOT / "docs/design-targets/generated/top-living-night-v3/final-art-status.json"
BRIDGE = ROOT / "docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png"
MANIFEST = OUTPUT_DIR / "manifest.json"
REQUIRED_PNGS = [
    "core5-layout-proof-v1.png",
    "core5-clean-generation-reference-pack-v1.png",
    "core5-yui-fullbody-cutout-v1.png",
    "core5-asa-fullbody-cutout-v1.png",
    "core5-nagi-fullbody-cutout-v1.png",
    "core5-michiru-fullbody-cutout-v1.png",
    "core5-tomori-fullbody-cutout-v1.png",
]


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            value.update(chunk)
    return value.hexdigest()


def main() -> None:
    reference = json.loads(REFERENCE_MANIFEST.read_text(encoding="utf-8"))
    final_status = json.loads(FINAL_STATUS.read_text(encoding="utf-8"))
    if reference.get("schemaVersion") != 1 or reference.get("referenceCount") != 5:
        raise RuntimeError("preproduction manifest requires the locked five-reference Core5 manifest")
    if not BRIDGE.is_file():
        raise RuntimeError("preproduction manifest bridge source is missing")

    outputs = []
    for name in REQUIRED_PNGS:
        path = OUTPUT_DIR / name
        if not path.is_file():
            raise RuntimeError(f"preproduction output is missing: {name}")
        with Image.open(path) as image:
            image.load()
            width, height = image.size
        outputs.append(
            {
                "file": name,
                "width": width,
                "height": height,
                "sha256": digest(path),
            }
        )

    payload = {
        "schemaVersion": 1,
        "authority": "PREPRODUCTION_ONLY_NOT_FINAL_ART",
        "core5ReferenceSetSha256": reference["referenceSetSha256"],
        "bridge": {
            "path": str(BRIDGE.relative_to(ROOT)),
            "sha256": digest(BRIDGE),
        },
        "finalCandidateGenerated": bool(final_status.get("candidateGenerated")),
        "outputs": outputs,
        "rules": {
            "mayRegisterAsFinalCandidate": False,
            "mayPromoteApproval": False,
            "mustRegenerateWhenCore5OrBridgeChanges": True,
        },
    }
    MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("TOP preproduction manifest: GENERATED")
    print(f"referenceSet={payload['core5ReferenceSetSha256']}")
    print(f"bridgeSha256={payload['bridge']['sha256']}")
    print(f"outputs={len(outputs)}")
    print("NOTE: manifest describes generated preproduction inputs only and can never promote final/runtime approval.")


if __name__ == "__main__":
    main()
