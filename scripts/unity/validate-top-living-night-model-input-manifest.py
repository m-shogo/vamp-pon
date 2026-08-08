#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PREPRODUCTION_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"
PREPRODUCTION_MANIFEST = PREPRODUCTION_DIR / "manifest.json"
MODEL_MANIFEST = PREPRODUCTION_DIR / "model-input-manifest.json"
REFERENCE_MANIFEST = ROOT / "docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json"
ISOLATED_PROMPT = ROOT / "docs/design-targets/generated/top-living-night-v3/final-key-art-isolated-prompt.txt"
INPUT_ORDER = ROOT / "docs/design-targets/generated/top-living-night-v3/model-input-order.txt"

EXPECTED_VISUALS = [
    (1, "core5-clean-composition-plate-v1.png", "composition"),
    (2, "core5-yui-fullbody-cutout-v1.png", "identity-yui"),
    (3, "core5-asa-fullbody-cutout-v1.png", "identity-asa"),
    (4, "core5-nagi-fullbody-cutout-v1.png", "identity-nagi"),
    (5, "core5-michiru-fullbody-cutout-v1.png", "identity-michiru"),
    (6, "core5-tomori-fullbody-cutout-v1.png", "identity-tomori"),
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def resolve_source_commit() -> str:
    process = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    commit = process.stdout.strip()
    if process.returncode != 0 or len(commit) != 40 or any(char not in "0123456789abcdef" for char in commit):
        raise RuntimeError("TOP minimal model-input validator could not resolve current source commit")
    return commit


def invariant(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def main() -> None:
    invariant(MODEL_MANIFEST.is_file(), "TOP minimal model-input manifest is missing")
    invariant(PREPRODUCTION_MANIFEST.is_file(), "TOP preproduction manifest is missing")
    invariant(REFERENCE_MANIFEST.is_file(), "TOP Core5 reference manifest is missing")
    manifest = json.loads(MODEL_MANIFEST.read_text(encoding="utf-8"))
    reference = json.loads(REFERENCE_MANIFEST.read_text(encoding="utf-8"))

    invariant(manifest.get("schemaVersion") == 1, "TOP minimal model-input manifest schema mismatch")
    invariant(manifest.get("authority") == "MODEL_INPUTS_ONLY_NOT_FINAL_ART", "TOP minimal model-input manifest authority mismatch")
    invariant(manifest.get("sourceCommit") == resolve_source_commit(), "TOP minimal model-input manifest was generated from a different source commit")
    invariant(
        manifest.get("sourcePreproductionManifestSha256") == sha256(PREPRODUCTION_MANIFEST),
        "TOP minimal model-input manifest is not bound to the exact current preproduction-manifest bytes",
    )
    invariant(manifest.get("visualInputCount") == 6, "TOP minimal model-input manifest must contain exactly six visual inputs")
    invariant(manifest.get("core5ReferenceSetSha256") == reference.get("referenceSetSha256"), "TOP minimal model-input manifest Core5 reference set is stale")

    target = manifest.get("target", {})
    invariant(target == {"width": 430, "height": 932, "format": "png", "foregroundHumanCount": 5}, "TOP minimal model-input target contract mismatch")

    visuals = manifest.get("visualInputs")
    invariant(isinstance(visuals, list) and len(visuals) == 6, "TOP minimal model-input visual list mismatch")
    for actual, (order, name, role) in zip(visuals, EXPECTED_VISUALS):
        invariant(actual.get("order") == order, f"TOP minimal model-input order mismatch: {name}")
        invariant(actual.get("file") == name, f"TOP minimal model-input file mismatch at order {order}")
        invariant(actual.get("role") == role, f"TOP minimal model-input role mismatch: {name}")
        path = PREPRODUCTION_DIR / name
        invariant(path.is_file(), f"TOP minimal model-input PNG missing: {name}")
        invariant(actual.get("sha256") == sha256(path), f"TOP minimal model-input PNG SHA mismatch: {name}")
        invariant(isinstance(actual.get("width"), int) and actual["width"] > 0, f"TOP minimal model-input width invalid: {name}")
        invariant(isinstance(actual.get("height"), int) and actual["height"] > 0, f"TOP minimal model-input height invalid: {name}")

    instructions = manifest.get("textInstructions")
    expected_text = [
        ("final-key-art-isolated-prompt.txt", "generation-prompt", ISOLATED_PROMPT),
        ("model-input-order.txt", "visual-input-order", INPUT_ORDER),
    ]
    invariant(isinstance(instructions, list) and len(instructions) == 2, "TOP minimal model-input manifest must contain exactly two text instructions")
    for actual, (name, role, path) in zip(instructions, expected_text):
        invariant(actual.get("file") == name, f"TOP minimal model-input text file mismatch: {name}")
        invariant(actual.get("role") == role, f"TOP minimal model-input text role mismatch: {name}")
        invariant(actual.get("sha256") == sha256(path), f"TOP minimal model-input text SHA mismatch: {name}")

    rules = manifest.get("rules", {})
    for key in ("useOnlyListedVisualInputs", "exactlyFiveCore5Humans"):
        invariant(rules.get(key) is True, f"TOP minimal model-input rule must remain true: {key}")
    for key in (
        "rawBridgeAllowed",
        "oldHumanLayersAllowed",
        "layoutProofAllowed",
        "diagnosticsAllowed",
        "developmentScreensAllowed",
        "mayRegisterAsFinalCandidate",
        "mayPromoteApproval",
    ):
        invariant(rules.get(key) is False, f"TOP minimal model-input rule must remain false: {key}")

    serialized = json.dumps(manifest, ensure_ascii=False)
    for forbidden in (
        "top-living-night-layered-candidate-430x932.png",
        "05-distant-companion.png",
        "06-characters.png",
        "core5-layout-proof-v1.png",
        "core5-clean-generation-reference-pack-v1.png",
        "diagnostics/",
        "github",
        "pull request",
        "CI status",
    ):
        invariant(forbidden not in serialized, f"TOP minimal model-input manifest leaked forbidden context/reference: {forbidden}")

    print("TOP minimal model-input manifest validation: PASS")
    print(f"sourceCommit={manifest['sourceCommit']}")
    print(f"sourcePreproductionManifestSha256={manifest['sourcePreproductionManifestSha256']}")
    print("exactly 6 visual inputs + 2 hashed text instructions; exact source commit + preproduction-manifest hash; no raw bridge/layout/diagnostics/development context; non-final/non-approving")


if __name__ == "__main__":
    main()
