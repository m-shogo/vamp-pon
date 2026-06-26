# enemy-ombu-umbrella-shield

## generation prompt

Create a production-ready 2D game enemy spritesheet for Vamp Pon.

Asset ID: `ombu-umbrella-shield`.
Display name: オンブ傘.
Preset: Enemy / オンブ傘（シールド）.

Canvas: 1440 x 1080 px.
Grid: 8 columns x 6 rows.
Cell: 180 x 180 px.
Output: PNG with true alpha transparency.

Design a small Ombu shadow creature carrying a broken umbrella silhouette. The umbrella is slightly too large for the small body and acts as a shield. Some frames may show the umbrella open facing the player; other frames may show it closed or tilted as a vulnerability pose. The body is blue-black, the umbrella is a darker silhouette, and the handle tip has a faint warm highlight.

The umbrella wanted to protect someone from rain. The character should feel melancholic and readable, not scary. Keep the same body side and attachment relationship across all frames; do not mirror the umbrella in a way that breaks continuity. Keep the umbrella simple enough to read at 64px.

Every cell must contain the same enemy identity with small animation changes. Keep scale and center stable across all 48 cells. Leave transparent padding inside each cell; no opaque pixel, umbrella rib, handle, glow, or shadow may touch a cell edge. Do not draw grid lines or cell borders.

Style: dark but warm Vamp Pon mood, paper / memory / black ink / small light, simple mobile-readable 2D game asset.

## negative prompt

Text, letters, numbers, logo, watermark, grid lines, cell borders, checkerboard background, white background, white fringe, white outline, photorealistic texture, 3D render gloss, gore, blood, horror monster, complex umbrella mechanics, existing IP imitation.

## target size

- 1440 x 1080 px
- 8 x 6 grid
- 180 x 180 px per cell
- 48 filled cells

## transparent/background rule

Use true PNG alpha transparency. Do not use a white background or drawn checkerboard. Keep all pixels inside each 180px cell with safe transparent padding.

## Asset Factory check steps

1. Load PNG into Asset Factory.
2. Set Asset Type to `enemy`.
3. Apply preset `ombu-umbrella-shield`.
4. Run inspection.
5. Confirm expected grid is 8x6 / 180px.
6. Confirm empty cells = 0 and edge touch = 0.
7. Check bbox jitter, umbrella continuity, shield/vulnerability readability, and 64px silhouette.
8. Set review status, quality score, review notes, and save to Library.

## expected manual issues to watch

- `white-background`
- `checkerboard-background`
- `white-fringe`
- `identity-drift`
- `wrong-direction`
- `wrong-size`
- `baked-text`

## regeneration notes

If rejected, preserve the broken umbrella shield identity. Fix only the named weak cells if possible. Common fixes: keep umbrella inside cell padding, reduce rib detail, keep scale stable, avoid mirrored handedness mistakes, remove white fringe.

