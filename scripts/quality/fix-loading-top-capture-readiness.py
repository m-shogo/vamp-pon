#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path
import sys

TARGET = Path(
    "unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingTopAutomatedCapture.cs"
)

OLD_TOP_WAIT = """                if (top == null || !top.gameObject.activeInHierarchy)\n                    return;\n                if (elapsed < 2.8d)\n                    return;\n"""

NEW_TOP_WAIT = """                if (top == null || !top.gameObject.activeInHierarchy)\n                    return;\n                if (!LoadingTopVisualPolishCoordinator.IsCurrentTopReady)\n                    return;\n                if (elapsed < 3.2d)\n                    return;\n"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[2]
    target = root / TARGET
    if not target.is_file():
        print(f"missing automated capture source: {target}", file=sys.stderr)
        return 1

    original = target.read_text(encoding="utf-8")
    updated = original

    if OLD_TOP_WAIT in updated:
        updated = updated.replace(OLD_TOP_WAIT, NEW_TOP_WAIT, 1)

    updated = updated.replace(
        "if (elapsed > 25d)",
        "if (elapsed > 45d)",
        1,
    )

    required = [
        "LoadingTopVisualPolishCoordinator.IsCurrentTopReady",
        "if (elapsed > 45d)",
        "if (elapsed < 3.2d)",
    ]
    missing = [token for token in required if token not in updated]
    if missing:
        print("automated capture readiness contract is incomplete:", file=sys.stderr)
        for token in missing:
            print(f"- {token}", file=sys.stderr)
        return 1

    if args.check:
        if updated != original:
            print(
                "automated capture still needs the TOP readiness patch; "
                "run this script without --check.",
                file=sys.stderr,
            )
            return 1
        print("Loading/TOP automated capture readiness: PASS")
        return 0

    if updated == original:
        print("Loading/TOP automated capture readiness already final")
        return 0

    target.write_text(updated, encoding="utf-8")
    print("updated automated capture: TOP Ready wait + 45s timeout")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
