# Greenback to Alpha Tool

Purpose: AI-generated asset candidates should use a solid chroma key green background, then this shared script removes the green and exports a transparent PNG.

## Tool

```txt
scripts/assets/greenback_to_alpha.py
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
