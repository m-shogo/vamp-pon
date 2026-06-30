# AI Image Greenback Transparency Rule 2026-06-30

## Current best practice

Do not rely on direct transparent background generation.

Generate asset candidates on a solid chroma key green background, then remove the green background and export a transparent PNG.

## Prompt rule

Use this direction for character, enemy, item, pickup, VFX source, cut-in source, and collection art candidates when transparency is needed:

```txt
solid chroma key green background
no white background
no checkerboard background
no text
no watermark
```

After generation:

```txt
remove green background
export transparent PNG
inspect alpha
check edge fringe
check no green spill remains
```

## Unity asset rule

A generated image is not approved only because it looks transparent in preview.

Before Unity import, verify:

```txt
real alpha channel
clean edges
no green fringe
subject does not touch canvas edge
readable at gameplay size
```

## Notes

This rule is the current practical default because direct transparent background generation is unreliable for this project.
