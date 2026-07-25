#!/usr/bin/env python3
"""Refresh or verify mutable policy-document hashes in tracked U48 Batch C manifests.

This intentionally does not regenerate candidate recipes, prompts, timestamps, output hashes,
or historical runtime screenshots. It updates only entries whose path exactly matches one of
the explicitly mutable current policy documents below.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
BATCH_C = ROOT / "docs/design-targets/generated/unity-u48/batch-c"
GOLDEN_PATH = BATCH_C / "golden-references.json"
CONTRACTS_PATH = BATCH_C / "generation-contracts.json"

MUTABLE_POLICY_PATHS = (
    "docs/unity-responsive-screen-policy.md",
)


def sha256(path: str) -> str:
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def write_json(path: Path, value: dict[str, Any]) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def refresh_golden(value: dict[str, Any], current: dict[str, str]) -> tuple[int, int]:
    found = 0
    changed = 0
    for entry in value.get("entries", []):
        for reference in entry.get("references", []):
            path = reference.get("path")
            if path not in current:
                continue
            found += 1
            expected = current[path]
            if reference.get("sha256") != expected:
                reference["sha256"] = expected
                changed += 1
    return found, changed


def refresh_contracts(value: dict[str, Any], current: dict[str, str]) -> tuple[int, int]:
    found = 0
    changed = 0
    for contract in value.get("contracts", []):
        paths = contract.get("goldenReferencePaths", [])
        hashes = contract.get("goldenReferenceSha256", [])
        if len(paths) != len(hashes):
            raise SystemExit(f"invalid golden reference array lengths: {contract.get('candidateId')}")
        for index, path in enumerate(paths):
            if path not in current:
                continue
            found += 1
            expected = current[path]
            if hashes[index] != expected:
                hashes[index] = expected
                changed += 1

        parent_paths = contract.get("parentSourcePaths", [])
        parent_hashes = contract.get("parentSourceSha256", [])
        if len(parent_paths) != len(parent_hashes):
            raise SystemExit(f"invalid parent source array lengths: {contract.get('candidateId')}")
        for index, path in enumerate(parent_paths):
            if path not in current:
                continue
            found += 1
            expected = current[path]
            if parent_hashes[index] != expected:
                parent_hashes[index] = expected
                changed += 1
    return found, changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Fail instead of writing when tracked hashes are stale")
    args = parser.parse_args()

    for path in MUTABLE_POLICY_PATHS:
        if not (ROOT / path).is_file():
            raise SystemExit(f"missing mutable policy source: {path}")

    current = {path: sha256(path) for path in MUTABLE_POLICY_PATHS}
    golden = load_json(GOLDEN_PATH)
    contracts = load_json(CONTRACTS_PATH)

    golden_found, golden_changed = refresh_golden(golden, current)
    contract_found, contract_changed = refresh_contracts(contracts, current)

    if golden_found == 0 or contract_found == 0:
        raise SystemExit(
            f"mutable policy path was not represented in both manifests: golden={golden_found}, contracts={contract_found}"
        )

    changed = golden_changed + contract_changed
    if args.check:
        if changed:
            for path, digest in current.items():
                print(f"stale U48 Batch C policy hash: {path} current={digest}")
            raise SystemExit(f"U48 Batch C policy hash check failed: {changed} stale hash entries")
        print(
            f"U48 Batch C policy hash check passed: {golden_found} golden and {contract_found} contract references current"
        )
        return

    if golden_changed:
        write_json(GOLDEN_PATH, golden)
    if contract_changed:
        write_json(CONTRACTS_PATH, contracts)

    for path, digest in current.items():
        print(f"U48 Batch C policy hash: {path}={digest}")
    print(
        f"U48 Batch C policy hashes refreshed: golden={golden_changed}, contracts={contract_changed}, total={changed}"
    )


if __name__ == "__main__":
    main()
