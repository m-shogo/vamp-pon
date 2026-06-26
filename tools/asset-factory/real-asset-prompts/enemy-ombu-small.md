# enemy-ombu-small

## generation prompt

Create a production-ready 2D game enemy spritesheet for Vamp Pon.

Asset ID: `ombu-small`.
Display name: オンブ（小型）.
Preset: Enemy / オンブ（小型基本）.

Canvas: 1440 x 1080 px.
Grid: 8 columns x 6 rows.
Cell: 180 x 180 px.
Output: PNG with true alpha transparency.

Design a tiny round shadow blob with one short ink sprout on top, no arms, and two small warm amber eye dots. It is the simplest Ombu form: a melancholic forgotten feeling that gently floats toward the player. Use a blue-black body, faint warm amber eyes, and no bright colors. Keep the silhouette readable at 32px and 64px.

Every cell must contain the same enemy identity with small animation changes. Keep scale and center stable across all 48 cells. Leave transparent padding inside each cell; no opaque pixel, glow, shadow, or sprout may touch a cell edge. Do not draw grid lines or cell borders.

Style: dark but warm Vamp Pon mood, paper / memory / black ink / small light, simple mobile-readable 2D game asset, not scary, not horror.

## negative prompt

Text, letters, numbers, logo, watermark, grid lines, cell borders, checkerboard background, white background, white fringe, white outline, photorealistic texture, 3D render gloss, gore, blood, horror monster, complex tiny details, existing IP imitation.

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
3. Apply preset `ombu-small`.
4. Run inspection.
5. Confirm expected grid is 8x6 / 180px.
6. Confirm empty cells = 0 and edge touch = 0.
7. Check bbox jitter and 64px readability.
8. Set review status, quality score, review notes, and save to Library.

## expected manual issues to watch

- `white-background`
- `checkerboard-background`
- `white-fringe`
- `identity-drift`
- `wrong-size`
- `baked-text`

## regeneration notes

If rejected, preserve the tiny round Ombu identity and fix only the detected issue. Common fixes: true alpha transparency, more cell padding, stable scale across all frames, simpler silhouette, no copied empty cells.

