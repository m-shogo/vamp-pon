#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path
import shutil
import struct

ROOT = Path(__file__).resolve().parents[2]
INCOMING = ROOT / "docs/design-targets/generated/top-living-night-v3/incoming/top-living-night-core5-candidate-430x932.png"
CANONICAL = ROOT / "docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png"
EXPECTED_SIZE = (430, 932)
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def invariant(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def png_dimensions(data: bytes) -> tuple[int, int]:
    invariant(len(data) >= 33, "incoming TOP PNG is truncated")
    invariant(data[:8] == PNG_SIGNATURE, "incoming TOP candidate is not a PNG")
    invariant(data[12:16] == b"IHDR", "incoming TOP PNG is missing IHDR")
    width, height = struct.unpack(">II", data[16:24])
    invariant(data[24] == 8, f"incoming TOP PNG must be 8-bit, got {data[24]}")
    invariant(data[25] in (2, 6), f"incoming TOP PNG must be RGB/RGBA, got color type {data[25]}")
    invariant(data[28] == 0, "incoming TOP PNG must be non-interlaced for deterministic QA/import")
    return width, height


def main() -> None:
    invariant(INCOMING.is_file(), f"incoming TOP candidate is missing: {INCOMING.relative_to(ROOT)}")
    data = INCOMING.read_bytes()
    width, height = png_dimensions(data)
    invariant((width, height) == EXPECTED_SIZE, f"incoming TOP candidate must be 430x932, got {width}x{height}")

    digest = hashlib.sha256(data).hexdigest()
    CANONICAL.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(INCOMING, CANONICAL)
    invariant(CANONICAL.read_bytes() == data, "canonical TOP candidate copy differs from intake bytes")

    print("TOP final-art intake staging: PASS")
    print(f"incoming={INCOMING.relative_to(ROOT)}")
    print(f"canonical={CANONICAL.relative_to(ROOT)}")
    print(f"sha256={digest}")
    print("NOTE: staging copies bytes only; registration/review/runtime approval are separate guarded steps.")


if __name__ == "__main__":
    main()
