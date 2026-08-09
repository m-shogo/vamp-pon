#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path
import shutil
import struct
import zlib

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

    offset = len(PNG_SIGNATURE)
    saw_ihdr = False
    saw_idat = False
    saw_iend = False
    width = 0
    height = 0
    channels = 0
    idat_parts: list[bytes] = []

    while offset < len(data):
        invariant(offset + 12 <= len(data), "incoming TOP PNG has a truncated chunk header")
        length = struct.unpack(">I", data[offset : offset + 4])[0]
        chunk_type = data[offset + 4 : offset + 8]
        chunk_data_start = offset + 8
        chunk_data_end = chunk_data_start + length
        chunk_end = chunk_data_end + 4
        invariant(chunk_end <= len(data), f"incoming TOP PNG chunk {chunk_type!r} is truncated")

        expected_crc = struct.unpack(">I", data[chunk_data_end:chunk_end])[0]
        actual_crc = zlib.crc32(chunk_type)
        actual_crc = zlib.crc32(data[chunk_data_start:chunk_data_end], actual_crc) & 0xFFFFFFFF
        invariant(
            expected_crc == actual_crc,
            f"incoming TOP PNG chunk {chunk_type.decode('ascii', errors='replace')} CRC mismatch",
        )

        if chunk_type == b"IHDR":
            invariant(not saw_ihdr, "incoming TOP PNG contains duplicate IHDR")
            invariant(offset == 8, "incoming TOP PNG IHDR must be the first chunk")
            invariant(length == 13, "incoming TOP PNG IHDR length must be 13")
            ihdr = data[chunk_data_start:chunk_data_end]
            width, height = struct.unpack(">II", ihdr[:8])
            invariant(ihdr[8] == 8, f"incoming TOP PNG must be 8-bit, got {ihdr[8]}")
            invariant(ihdr[9] in (2, 6), f"incoming TOP PNG must be RGB/RGBA, got color type {ihdr[9]}")
            channels = 3 if ihdr[9] == 2 else 4
            invariant(ihdr[10] == 0, "incoming TOP PNG must use standard compression method")
            invariant(ihdr[11] == 0, "incoming TOP PNG must use standard filter method")
            invariant(ihdr[12] == 0, "incoming TOP PNG must be non-interlaced for deterministic QA/import")
            saw_ihdr = True
        elif chunk_type == b"IDAT":
            invariant(saw_ihdr, "incoming TOP PNG IDAT appears before IHDR")
            saw_idat = True
            idat_parts.append(data[chunk_data_start:chunk_data_end])
        elif chunk_type == b"IEND":
            invariant(length == 0, "incoming TOP PNG IEND length must be zero")
            saw_iend = True
            invariant(chunk_end == len(data), "incoming TOP PNG contains trailing bytes after IEND")
            offset = chunk_end
            break

        offset = chunk_end

    invariant(saw_ihdr, "incoming TOP PNG is missing IHDR")
    invariant(saw_idat, "incoming TOP PNG is missing IDAT")
    invariant(saw_iend, "incoming TOP PNG is missing IEND")
    invariant(offset == len(data), "incoming TOP PNG parsing did not consume the full file")

    try:
        scanlines = zlib.decompress(b"".join(idat_parts))
    except zlib.error as exc:
        raise RuntimeError(f"incoming TOP PNG IDAT stream is not decodable: {exc}") from exc

    row_bytes = width * channels
    expected_scanline_bytes = height * (row_bytes + 1)
    invariant(
        len(scanlines) == expected_scanline_bytes,
        f"incoming TOP PNG decoded scanline length mismatch: expected {expected_scanline_bytes}, got {len(scanlines)}",
    )
    for row in range(height):
        filter_type = scanlines[row * (row_bytes + 1)]
        invariant(filter_type <= 4, f"incoming TOP PNG row {row} has invalid filter type {filter_type}")

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
    print("PNG integrity=full chunk bounds + CRC + IHDR/IDAT/IEND + decodable exact scanlines + valid filters + no trailing bytes")
    print("NOTE: staging copies bytes only; registration/review/runtime approval are separate guarded steps.")


if __name__ == "__main__":
    main()
