#!/usr/bin/env python3
"""Generate the TOP Living Night V3 Core5 candidate key art into incoming/.

Scope: m-shogo/vamp-pon only. This script ONLY stages a candidate image at
  docs/design-targets/generated/top-living-night-v3/incoming/top-living-night-core5-candidate-430x932.png
It never writes to final/, never touches final-art-status.json, never registers,
and never promotes any approval or readiness flag.

Image backend: OpenAI Images edits endpoint (gpt-image-1) via plain HTTPS, using
the six locked preproduction visual inputs (clean composition plate + five Core5
identity references) plus the isolated key-art prompt as the only text instruction.

Requires the environment variable OPENAI_API_KEY (billing-enabled). The key is
read from the environment only and is never printed or written to disk.

Usage:
  python3 scripts/unity/generate-top-living-night-v3-candidate.py --dry-run
  python3 scripts/unity/generate-top-living-night-v3-candidate.py            # real, spends API credits
"""
from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.request
import uuid
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
V3 = ROOT / "docs/design-targets/generated/top-living-night-v3"
PRE = V3 / "preproduction"
INCOMING = V3 / "incoming"

PROMPT_FILE = V3 / "final-key-art-isolated-prompt.txt"
INPUT_ORDER_FILE = V3 / "model-input-order.txt"

# Exact visual-input order mandated by model-input-order.txt.
INPUTS = [
    PRE / "core5-clean-composition-plate-v1.png",
    PRE / "core5-yui-identity-reference-v1.png",
    PRE / "core5-asa-identity-reference-v1.png",
    PRE / "core5-nagi-identity-reference-v1.png",
    PRE / "core5-michiru-identity-reference-v1.png",
    PRE / "core5-tomori-identity-reference-v1.png",
]

TARGET = INCOMING / "top-living-night-core5-candidate-430x932.png"
TARGET_W, TARGET_H = 430, 932

API_URL = "https://api.openai.com/v1/images/edits"
MODEL = "gpt-image-1"
GEN_SIZE = "1024x1536"  # nearest supported portrait; cropped/resized to 430x932


def die(msg: str) -> "None":
    print(f"ERROR: {msg}", file=sys.stderr)
    raise SystemExit(1)


def preflight() -> None:
    if not PROMPT_FILE.exists():
        die(f"missing prompt authority: {PROMPT_FILE}")
    if not INPUT_ORDER_FILE.exists():
        die(f"missing input-order authority: {INPUT_ORDER_FILE}")
    missing = [str(p) for p in INPUTS if not p.exists()]
    if missing:
        die(
            "missing preproduction visual inputs (build them first via the "
            "TOP Art Preproduction sequence):\n  " + "\n  ".join(missing)
        )
    # Sanity: composition plate must be the 430x932 master aspect source.
    with Image.open(INPUTS[0]) as im:
        print(f"composition plate: {im.size} {im.mode}")
    for p in INPUTS[1:]:
        with Image.open(p) as im:
            print(f"identity ref {p.name}: {im.size} {im.mode}")


def build_multipart(prompt: str) -> tuple[bytes, str]:
    boundary = f"----vamppon{uuid.uuid4().hex}"
    crlf = b"\r\n"
    parts: list[bytes] = []

    def field(name: str, value: str) -> None:
        parts.append(f"--{boundary}".encode())
        parts.append(f'Content-Disposition: form-data; name="{name}"'.encode())
        parts.append(b"")
        parts.append(value.encode())

    def file_field(name: str, path: Path) -> None:
        ctype = mimetypes.guess_type(path.name)[0] or "image/png"
        parts.append(f"--{boundary}".encode())
        parts.append(
            f'Content-Disposition: form-data; name="{name}"; filename="{path.name}"'.encode()
        )
        parts.append(f"Content-Type: {ctype}".encode())
        parts.append(b"")
        parts.append(path.read_bytes())

    field("model", MODEL)
    field("prompt", prompt)
    field("size", GEN_SIZE)
    field("n", "1")
    field("quality", "high")
    # Multiple reference images are passed as repeated image[] fields, in order.
    for p in INPUTS:
        file_field("image[]", p)

    body = crlf.join(parts) + crlf + f"--{boundary}--".encode() + crlf
    return body, boundary


def call_api(prompt: str, api_key: str) -> bytes:
    body, boundary = build_multipart(prompt)
    req = urllib.request.Request(API_URL, data=body, method="POST")
    req.add_header("Authorization", f"Bearer {api_key}")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    print(f"POST {API_URL} model={MODEL} size={GEN_SIZE} refs={len(INPUTS)} bytes={len(body)}")
    with urllib.request.urlopen(req, timeout=600) as resp:
        payload = json.loads(resp.read().decode())
    b64 = payload["data"][0]["b64_json"]
    return base64.b64decode(b64)


def postprocess_to_master(raw_png: bytes) -> None:
    tmp = INCOMING / ".raw-candidate-source.png"
    INCOMING.mkdir(parents=True, exist_ok=True)
    tmp.write_bytes(raw_png)
    with Image.open(tmp) as im:
        im = im.convert("RGB")
        gw, gh = im.size
        target_ratio = TARGET_W / TARGET_H
        # Center-crop to the 430:932 aspect, then resize to the exact master.
        crop_w = min(gw, int(round(gh * target_ratio)))
        crop_h = min(gh, int(round(gw / target_ratio)))
        left = (gw - crop_w) // 2
        top = (gh - crop_h) // 2
        im = im.crop((left, top, left + crop_w, top + crop_h))
        im = im.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        im.save(TARGET, format="PNG")
    tmp.unlink(missing_ok=True)
    with Image.open(TARGET) as im:
        assert im.size == (TARGET_W, TARGET_H), im.size
    print(f"staged candidate: {TARGET.relative_to(ROOT)} {TARGET_W}x{TARGET_H}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="validate inputs + build request, do not call the API")
    args = ap.parse_args()

    preflight()
    prompt = PROMPT_FILE.read_text().strip()
    print(f"prompt authority: {PROMPT_FILE.relative_to(ROOT)} ({len(prompt)} chars)")

    if args.dry_run:
        body, boundary = build_multipart(prompt)
        print(f"DRY-RUN: multipart ready, {len(body)} bytes, boundary set, 6 refs attached.")
        print("DRY-RUN: no API call made, no file written, no approval touched.")
        return

    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        die("OPENAI_API_KEY not set. Export a billing-enabled key, then re-run.")

    raw = call_api(prompt, api_key)
    postprocess_to_master(raw)
    print("NOTE: candidate staged as incoming/ only. No final/, no status mutation, no approval promoted.")


if __name__ == "__main__":
    main()
