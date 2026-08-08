#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LAYOUT_GENERATOR = ROOT / "scripts/unity/generate-top-living-night-core5-layout-proof.py"
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"


def load_layout_module():
    spec = importlib.util.spec_from_file_location("top_core5_layout_proof", LAYOUT_GENERATOR)
    if spec is None or spec.loader is None:
        raise RuntimeError("could not load Core5 layout-proof generator")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> None:
    module = load_layout_module()
    sprites = module.extract_core5()
    if set(sprites) != {"yui", "asa", "nagi", "michiru", "tomori"}:
        raise RuntimeError("Core5 sprite pack must contain exactly Yui/Asa/Nagi/Michiru/Tomori")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for character in ("yui", "asa", "nagi", "michiru", "tomori"):
        path = OUTPUT_DIR / f"core5-{character}-fullbody-cutout-v1.png"
        sprites[character].save(path, format="PNG", optimize=True)
        print(f"sprite={path.relative_to(ROOT)}")

    print("TOP Core5 sprite pack: GENERATED")
    print("NOTE: transparent cutouts are preproduction generator inputs only; they never become runtime/final authority by themselves.")


if __name__ == "__main__":
    main()
