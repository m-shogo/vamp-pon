#!/usr/bin/env python3
"""Remove a chroma-key green background and export a transparent PNG.

Usage:
  python3 scripts/assets/greenback_to_alpha.py --input input.png --output output.png
  python3 scripts/assets/greenback_to_alpha.py --dir input_dir --out-dir output_dir

This script intentionally uses Pillow so it can be reused for AI asset candidates
without adding project runtime dependencies.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path
from typing import Iterable

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover - local environment guard
    raise SystemExit(
        "Pillow is required. Install with: python3 -m pip install Pillow"
    ) from exc

PNG_EXTENSIONS = {".png"}


def parse_rgb(value: str) -> tuple[int, int, int]:
    parts = value.split(",")
    if len(parts) != 3:
        raise argparse.ArgumentTypeError("RGB must be formatted as R,G,B")
    try:
        rgb = tuple(int(part.strip()) for part in parts)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("RGB values must be integers") from exc
    if any(channel < 0 or channel > 255 for channel in rgb):
        raise argparse.ArgumentTypeError("RGB values must be in 0..255")
    return rgb  # type: ignore[return-value]


def iter_inputs(input_file: Path | None, input_dir: Path | None) -> Iterable[Path]:
    if input_file is not None:
        yield input_file
        return
    if input_dir is None:
        return
    for path in sorted(input_dir.iterdir()):
        if path.is_file() and path.suffix.lower() in PNG_EXTENSIONS:
            yield path


def build_output_path(source: Path, output_file: Path | None, out_dir: Path | None, suffix: str) -> Path:
    if output_file is not None:
        return output_file
    if out_dir is None:
        return source.with_name(f"{source.stem}{suffix}.png")
    return out_dir / f"{source.stem}{suffix}.png"


def remove_greenback(
    source: Path,
    output: Path,
    key_rgb: tuple[int, int, int],
    tolerance: float,
    soft_edge: float,
    despill: bool,
    despill_margin: int,
) -> dict[str, object]:
    image = Image.open(source).convert("RGBA")
    pixels = image.load()
    width, height = image.size

    transparent = 0
    semi_transparent = 0
    opaque = 0
    green_spill_remaining = 0
    min_x = width
    min_y = height
    max_x = -1
    max_y = -1

    kr, kg, kb = key_rgb
    soft_edge = max(0.0, soft_edge)
    tolerance = max(0.0, tolerance)

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                transparent += 1
                continue

            distance = math.sqrt((r - kr) ** 2 + (g - kg) ** 2 + (b - kb) ** 2)
            new_alpha = a

            if distance <= tolerance:
                new_alpha = 0
            elif soft_edge > 0 and distance <= tolerance + soft_edge:
                fade = (distance - tolerance) / soft_edge
                new_alpha = int(round(a * fade))

            if new_alpha > 0 and despill:
                dominant_green = g > r and g > b
                if dominant_green:
                    green_limit = min(255, max(r, b) + despill_margin)
                    if g > green_limit:
                        g = green_limit

            pixels[x, y] = (r, g, b, new_alpha)

            if new_alpha == 0:
                transparent += 1
                continue
            if new_alpha < 255:
                semi_transparent += 1
            else:
                opaque += 1

            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

            if g > 150 and g > r * 1.25 and g > b * 1.25:
                green_spill_remaining += 1

    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)

    opaque_bounds = None
    if max_x >= 0 and max_y >= 0:
        opaque_bounds = {"x": min_x, "y": min_y, "width": max_x - min_x + 1, "height": max_y - min_y + 1}

    return {
        "source": str(source),
        "output": str(output),
        "size": {"width": width, "height": height},
        "keyRgb": list(key_rgb),
        "tolerance": tolerance,
        "softEdge": soft_edge,
        "despill": despill,
        "transparentPixels": transparent,
        "semiTransparentPixels": semi_transparent,
        "opaquePixels": opaque,
        "opaqueBounds": opaque_bounds,
        "greenSpillRemainingPixels": green_spill_remaining,
        "edgeTouches": opaque_bounds is not None
        and (
            opaque_bounds["x"] <= 0
            or opaque_bounds["y"] <= 0
            or opaque_bounds["x"] + opaque_bounds["width"] >= width
            or opaque_bounds["y"] + opaque_bounds["height"] >= height
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Remove chroma-key green background from PNG asset candidates.")
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--input", type=Path, help="Input PNG file")
    source.add_argument("--dir", type=Path, help="Input directory containing PNG files")
    parser.add_argument("--output", type=Path, help="Output PNG file. Use only with --input")
    parser.add_argument("--out-dir", type=Path, help="Output directory. Required for --dir")
    parser.add_argument("--suffix", default="-alpha", help="Suffix for generated files when --output is omitted")
    parser.add_argument("--key", type=parse_rgb, default=(0, 255, 0), help="Chroma key RGB, default: 0,255,0")
    parser.add_argument("--tolerance", type=float, default=72.0, help="Distance threshold for fully transparent pixels")
    parser.add_argument("--soft-edge", type=float, default=28.0, help="Additional distance range for semi-transparent edge fade")
    parser.add_argument("--no-despill", action="store_true", help="Disable green spill reduction")
    parser.add_argument("--despill-margin", type=int, default=10, help="Allowed green dominance after despill")
    parser.add_argument("--json", action="store_true", help="Print JSON report")
    args = parser.parse_args()

    if args.output is not None and args.input is None:
        parser.error("--output can only be used with --input")
    if args.dir is not None and args.out_dir is None:
        parser.error("--out-dir is required with --dir")

    results: list[dict[str, object]] = []
    input_paths = list(iter_inputs(args.input, args.dir))
    if not input_paths:
        parser.error("No PNG inputs found")

    for source_path in input_paths:
        if not source_path.exists():
            raise SystemExit(f"Input not found: {source_path}")
        output_path = build_output_path(source_path, args.output, args.out_dir, args.suffix)
        result = remove_greenback(
            source=source_path,
            output=output_path,
            key_rgb=args.key,
            tolerance=args.tolerance,
            soft_edge=args.soft_edge,
            despill=not args.no_despill,
            despill_margin=args.despill_margin,
        )
        results.append(result)

    if args.json:
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        for result in results:
            print(
                "greenback-to-alpha:",
                result["source"],
                "->",
                result["output"],
                f"spill={result['greenSpillRemainingPixels']}",
                f"edgeTouches={result['edgeTouches']}",
            )

    return 0


if __name__ == "__main__":
    sys.exit(main())
