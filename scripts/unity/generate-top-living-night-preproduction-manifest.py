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
PRIMARY_COMPOSITION = "core5-clean-composition-plate-v1.png"
LAYOUT_PROOF = "core5-layout-proof-v1.png"
COMBINED_REFERENCE = "core5-clean-generation-reference-pack-v1.png"
IDENTITY_CUTOUTS = [
    "core5-yui-fullbody-cutout-v1.png",
    "core5-asa-fullbody-cutout-v1.png",
    "core5-nagi-fullbody-cutout-v1.png",
    "core5-michiru-fullbody-cutout-v1.png",
    "core5-tomori-fullbody-cutout-v1.png",
]
IDENTITY_REFERENCES = [
    "core5-yui-identity-reference-v1.png",
    "core5-asa-identity-reference-v1.png",
    "core5-nagi-identity-reference-v1.png",
    "core5-michiru-identity-reference-v1.png",
    "core5-tomori-identity-reference-v1.png",
]
REQUIRED_PNGS = [
    PRIMARY_COMPOSITION,
    LAYOUT_PROOF,
    COMBINED_REFERENCE,
    *IDENTITY_CUTOUTS,
    *IDENTITY_REFERENCES,
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
        raise RuntimeError("preproduction engineering bridge source is missing")

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
        "schemaVersion": 4,
        "authority": "PREPRODUCTION_ONLY_NOT_FINAL_ART",
        "core5ReferenceSetSha256": reference["referenceSetSha256"],
        "engineeringBridge": {
            "path": str(BRIDGE.relative_to(ROOT)),
            "sha256": digest(BRIDGE),
            "generatorFacing": False,
        },
        "generationComposition": {
            "file": PRIMARY_COMPOSITION,
            "containsBridgeHumans": False,
            "containsOnlyCore5WhenHumansArePresent": True,
        },
        "modelInputRoles": {
            "primaryComposition": PRIMARY_COMPOSITION,
            "primaryIdentityReferences": IDENTITY_REFERENCES,
            "engineeringIdentityCutouts": IDENTITY_CUTOUTS,
            "optionalConvenienceReference": COMBINED_REFERENCE,
            "blockingOnly": [LAYOUT_PROOF],
            "blockingOnlyIsFinalStyleAuthority": False,
            "diagnosticsAllowed": False,
            "rawBridgeAllowed": False,
        },
        "finalCandidateGenerated": bool(final_status.get("candidateGenerated")),
        "outputs": outputs,
        "rules": {
            "mayRegisterAsFinalCandidate": False,
            "mayPromoteApproval": False,
            "rawBridgeAllowedAsGeneratorFacingInput": False,
            "engineeringCutoutsAllowedInMinimalModelBundle": False,
            "mustRegenerateWhenCore5OrBridgeLayersChange": True,
        },
    }
    MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("TOP preproduction manifest: GENERATED")
    print(f"referenceSet={payload['core5ReferenceSetSha256']}")
    print(f"engineeringBridgeSha256={payload['engineeringBridge']['sha256']}")
    print(f"outputs={len(outputs)}")
    print(f"primaryComposition={payload['modelInputRoles']['primaryComposition']}")
    print(f"identityReferences={len(payload['modelInputRoles']['primaryIdentityReferences'])}")
    print("NOTE: minimal model inputs use the sanitized composition + five single-human identity references. Fullbody cutouts/layout proof remain engineering/blocking-only; raw bridge/diagnostics are never model inputs or approval evidence.")


if __name__ == "__main__":
    main()
