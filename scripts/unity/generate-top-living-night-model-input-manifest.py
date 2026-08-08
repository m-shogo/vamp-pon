#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PREPRODUCTION_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"
PREPRODUCTION_MANIFEST = PREPRODUCTION_DIR / "manifest.json"
MODEL_MANIFEST = PREPRODUCTION_DIR / "model-input-manifest.json"
ISOLATED_PROMPT = ROOT / "docs/design-targets/generated/top-living-night-v3/final-key-art-isolated-prompt.txt"
INPUT_ORDER = ROOT / "docs/design-targets/generated/top-living-night-v3/model-input-order.txt"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def invariant(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def main() -> None:
    invariant(PREPRODUCTION_MANIFEST.is_file(), "TOP preproduction manifest is missing")
    invariant(ISOLATED_PROMPT.is_file(), "TOP isolated generation prompt is missing")
    invariant(INPUT_ORDER.is_file(), "TOP model-input order authority is missing")

    source = json.loads(PREPRODUCTION_MANIFEST.read_text(encoding="utf-8"))
    invariant(source.get("schemaVersion") == 3, "TOP preproduction manifest schema mismatch")
    invariant(source.get("authority") == "PREPRODUCTION_ONLY_NOT_FINAL_ART", "TOP preproduction manifest authority mismatch")

    roles = source.get("modelInputRoles", {})
    primary = roles.get("primaryComposition")
    identities = roles.get("primaryIdentityCutouts")
    invariant(primary == "core5-clean-composition-plate-v1.png", "TOP model primary composition mismatch")
    invariant(isinstance(identities, list) and len(identities) == 5, "TOP model manifest requires five identity cutouts")
    expected_identities = [
        "core5-yui-fullbody-cutout-v1.png",
        "core5-asa-fullbody-cutout-v1.png",
        "core5-nagi-fullbody-cutout-v1.png",
        "core5-michiru-fullbody-cutout-v1.png",
        "core5-tomori-fullbody-cutout-v1.png",
    ]
    invariant(identities == expected_identities, "TOP model identity cutout order mismatch")
    invariant(roles.get("rawBridgeAllowed") is False, "TOP model manifest cannot allow raw bridge")
    invariant(roles.get("diagnosticsAllowed") is False, "TOP model manifest cannot allow diagnostics")

    output_by_name = {entry["file"]: entry for entry in source.get("outputs", [])}
    visual_names = [primary, *identities]
    inputs = []
    role_names = ["composition", "identity-yui", "identity-asa", "identity-nagi", "identity-michiru", "identity-tomori"]
    for index, (name, role) in enumerate(zip(visual_names, role_names), start=1):
        invariant(name in output_by_name, f"TOP model visual input is missing from preproduction manifest: {name}")
        entry = output_by_name[name]
        path = PREPRODUCTION_DIR / name
        invariant(path.is_file(), f"TOP model visual input is missing: {name}")
        actual_sha = sha256(path)
        invariant(actual_sha == entry.get("sha256"), f"TOP model visual input hash mismatch: {name}")
        inputs.append(
            {
                "order": index,
                "file": name,
                "role": role,
                "width": entry["width"],
                "height": entry["height"],
                "sha256": actual_sha,
            }
        )

    payload = {
        "schemaVersion": 1,
        "authority": "MODEL_INPUTS_ONLY_NOT_FINAL_ART",
        "visualInputCount": 6,
        "target": {
            "width": 430,
            "height": 932,
            "format": "png",
            "foregroundHumanCount": 5,
        },
        "core5ReferenceSetSha256": source["core5ReferenceSetSha256"],
        "visualInputs": inputs,
        "textInstructions": [
            {
                "file": "final-key-art-isolated-prompt.txt",
                "sha256": sha256(ISOLATED_PROMPT),
                "role": "generation-prompt",
            },
            {
                "file": "model-input-order.txt",
                "sha256": sha256(INPUT_ORDER),
                "role": "visual-input-order",
            },
        ],
        "rules": {
            "useOnlyListedVisualInputs": True,
            "exactlyFiveCore5Humans": True,
            "rawBridgeAllowed": False,
            "oldHumanLayersAllowed": False,
            "layoutProofAllowed": False,
            "diagnosticsAllowed": False,
            "developmentScreensAllowed": False,
            "mayRegisterAsFinalCandidate": False,
            "mayPromoteApproval": False,
        },
    }
    MODEL_MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("TOP minimal model-input manifest: GENERATED")
    print(f"visualInputs={len(inputs)}")
    print(f"output={MODEL_MANIFEST.relative_to(ROOT)}")
    print("NOTE: this manifest describes only the six visual inputs physically shipped in the minimal model-input artifact; it contains no layout proof, diagnostic or raw bridge entry.")


if __name__ == "__main__":
    main()
