# Greenback to Alpha Tool

Purpose: AI-generated asset candidates should use a solid chroma key green background, then this shared script removes the green and exports a transparent PNG.

## Tool

```txt
scripts/assets/greenback_to_alpha.py
```

## Setup

Use a local Python virtual environment. Do not install Pillow globally just for this repo.

```sh
cd /Users/m-shogo/Developer/personal/vamp-pon
pnpm python:setup
```

Quick check:

```sh
python - <<'PY'
from PIL import Image
print('Pillow OK')
PY
```

## Basic usage

Single file:

```sh
pnpm greenback:alpha -- --input path/to/input.png --output path/to/output.png
```

Directory batch:

```sh
pnpm greenback:alpha -- --dir path/to/greenback-images --out-dir path/to/alpha-images
```

JSON report:

```sh
pnpm greenback:alpha -- --input path/to/input.png --output path/to/output.png --json
```

`pnpm greenback:alpha` runs `.venv/bin/python` intentionally, so normal image processing does not depend on globally installed Pillow. If `.venv` is missing, run `pnpm python:setup` first.

## Default key

```txt
RGB: 0,255,0
```

If the generated green is not exact, adjust tolerance:

```sh
pnpm greenback:alpha -- --input input.png --output output.png --tolerance 88 --soft-edge 32
```

## Checks after export

Always inspect:

```txt
real alpha channel
clean edge
no green fringe
no green spill remains
subject does not touch canvas edge
readable at gameplay size
```

## Prompt reminder

Ask the image generator for:

```txt
solid chroma key green background, no white background, no checkerboard background, no text, no watermark
```

Avoid green colors on the subject itself, because chroma key removal can erase green clothing, green light, or green effects.

## Local verification (2026-06-30)

- Python: 3.14.5
- Pillow: 12.2.0 (`pip install -r requirements.txt` → OK)
- `from PIL import Image` → OK
- `greenback_to_alpha.py --help` → OK
- 180x180 greenback dummy image (green bg + red rect + blue circle) → converted to RGBA with real alpha
- Background pixels: alpha=0 (transparent)
- Subject pixels: alpha=255 (opaque)
- `greenSpillRemainingPixels`: 0
- `edgeTouches`: false
- Temporary test images deleted, not committed
