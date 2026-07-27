#!/usr/bin/env python3
"""Verify immutable U48 Batch C policy provenance and its current-policy supersession."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
BATCH_C = ROOT / "docs/design-targets/generated/unity-u48/batch-c"
GOLDEN_PATH = BATCH_C / "golden-references.json"
CONTRACTS_PATH = BATCH_C / "generation-contracts.json"
SUPERSESSION_PATH = BATCH_C / "policy-supersession.json"


def sha256(path: str) -> str:
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def fail(message: str) -> None:
    raise SystemExit(f"U48 Batch C policy provenance check failed: {message}")


def main() -> None:
    supersession = load_json(SUPERSESSION_PATH)
    if supersession.get("schemaVersion") != 1:
        fail("unsupported supersession schema")
    if supersession.get("historicalSourceHead") != "eba336591d6414465a87cbe72db69715d7517d61":
        fail("historical source HEAD changed")

    historical_path = supersession.get("historicalPolicyPath")
    historical_hash = supersession.get("historicalPolicySha256")
    current_path = supersession.get("currentPolicyPath")
    current_hash = supersession.get("currentPolicySha256")
    if not all(isinstance(value, str) and value for value in (historical_path, historical_hash, current_path, current_hash)):
        fail("policy paths or hashes are malformed")
    if sha256(historical_path) != historical_hash:
        fail("immutable historical snapshot hash mismatch")
    if sha256(current_path) != current_hash:
        fail("current policy changed without an explicit supersession review")
    if historical_path == current_path or historical_hash == current_hash:
        fail("historical snapshot is not separated from current policy")

    if supersession.get("compatibilityResult") not in {
        "COMPATIBLE_WITH_U48_OUTPUT",
        "INCOMPATIBLE_REQUIRES_NEW_CANDIDATES",
    }:
        fail("unknown compatibility result")
    for key in (
        "runtimeAssetsRegenerated",
        "historicalScreenshotsRegenerated",
        "humanApprovalReusedForNewAssets",
    ):
        if supersession.get(key) is not False:
            fail(f"{key} must remain false for this historical record")

    golden = load_json(GOLDEN_PATH)
    contracts = load_json(CONTRACTS_PATH)
    golden_count = 0
    for entry in golden.get("entries", []):
        for reference in entry.get("references", []):
            if reference.get("path") == current_path:
                fail("Golden Reference still points at mutable current policy")
            if reference.get("path") == historical_path:
                golden_count += 1
                if reference.get("sha256") != historical_hash:
                    fail("Golden Reference snapshot hash mismatch")

    contract_count = 0
    for contract in contracts.get("contracts", []):
        paths = contract.get("goldenReferencePaths", [])
        hashes = contract.get("goldenReferenceSha256", [])
        if len(paths) != len(hashes):
            fail(f"malformed Golden Reference arrays: {contract.get('candidateId')}")
        if current_path in paths:
            fail("generation contract still points at mutable current policy")
        for index, path in enumerate(paths):
            if path == historical_path:
                contract_count += 1
                if hashes[index] != historical_hash:
                    fail(f"generation contract snapshot hash mismatch: {contract.get('candidateId')}")

    if golden_count != 30 or contract_count != 120:
        fail(f"unexpected snapshot reference coverage: golden={golden_count}, contracts={contract_count}")

    print(
        "U48 Batch C policy provenance check passed: "
        f"immutable snapshot={historical_hash}, current={current_hash}, "
        f"golden={golden_count}, contracts={contract_count}"
    )


if __name__ == "__main__":
    main()
