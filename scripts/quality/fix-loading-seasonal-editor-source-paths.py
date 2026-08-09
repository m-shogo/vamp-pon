#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path
import sys

TARGET = Path(
    "unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/LoadingSeasonalView.cs"
)

REPLACEMENTS = {
    "docs/design-targets/generated/top-living-night-v1/candidates/top-living-night-candidate-a.png":
        "docs/design-targets/generated/loading-seasonal-v1/sources/loading-01-spring.png",
    "docs/design-targets/generated/top-living-night-v1/candidates/top-living-night-candidate-b.png":
        "docs/design-targets/generated/loading-seasonal-v1/sources/loading-02-summer.png",
    "docs/design-targets/generated/top-living-night-v1/candidates/top-living-night-candidate-c.png":
        "docs/design-targets/generated/loading-seasonal-v1/sources/loading-03-autumn.png",
    "docs/design-targets/generated/top-living-night-v1/candidates/top-living-night-candidate-d.png":
        "docs/design-targets/generated/loading-seasonal-v1/sources/loading-04-winter.png",
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[2]
    target = root / TARGET
    if not target.is_file():
        print(f"missing LoadingSeasonalView: {target}", file=sys.stderr)
        return 1

    original = target.read_text(encoding="utf-8")
    updated = original
    replaced = 0

    for old, new in REPLACEMENTS.items():
        if old in updated:
            updated = updated.replace(old, new)
            replaced += 1

    missing_final = [new for new in REPLACEMENTS.values() if new not in updated]
    stale = [old for old in REPLACEMENTS if old in updated]

    if missing_final or stale:
        if missing_final:
            print("missing final editor source paths:", file=sys.stderr)
            for value in missing_final:
                print(f"- {value}", file=sys.stderr)
        if stale:
            print("stale TOP candidate paths remain:", file=sys.stderr)
            for value in stale:
                print(f"- {value}", file=sys.stderr)
        return 1

    if args.check:
        if updated != original:
            print(
                "LoadingSeasonalView still points at temporary TOP candidates; "
                "run this script without --check.",
                file=sys.stderr,
            )
            return 1
        print("loading seasonal editor source paths: PASS (final four seasonal PNGs)")
        return 0

    if updated == original:
        print("loading seasonal editor source paths already final")
        return 0

    target.write_text(updated, encoding="utf-8")
    print(
        "updated LoadingSeasonalView editor paths: "
        f"{replaced} temporary paths -> final seasonal sources"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
