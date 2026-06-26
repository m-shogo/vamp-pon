# item-warm-shoes

## generation prompt

Create a production-ready 2D game item icon for Vamp Pon.

Asset ID: `warm-shoes`.
Display name: あったか靴.
Preset: Item / あったか靴.

Canvas: 1024 x 1024 px.
Output: PNG with true alpha transparency.

Design a small pair of warm shoes, slightly worn but cozy. It must read as a matched pair, not a single shoe. Use simple rounded shoe forms with short laces. Body color is warm brown, sole is darker warm grey, laces are lighter warm thread, with only a subtle comfortable warmth.

This is a traveler passive item for speed-up. The shoes remember long walks. The icon should be cozy but not childish, readable at 32px and 64px, and centered with clean transparent padding.

Style: dark but warm Vamp Pon mood, paper / memory / black ink / small light, mobile-readable 2D game icon.

## negative prompt

Text, letters, numbers, logo, watermark, rarity frame, decorative border, checkerboard background, white background, white fringe, white outline, photorealistic shoe texture, 3D render gloss, sneaker brand styling, cartoon oversized shoes, existing IP imitation.

## target size

- 1024 x 1024 px master icon
- Centered subject
- Readable at 64px and 32px

## transparent/background rule

Use true PNG alpha transparency. Do not use a white background or drawn checkerboard. Keep transparent padding around both shoes; no lace, glow, or shadow may touch the canvas edge.

## Asset Factory check steps

1. Load PNG into Asset Factory.
2. Set Asset Type to `item`.
3. Apply preset `warm-shoes`.
4. Confirm image size is 1024x1024.
5. Check checkerboard preview for true alpha and white fringe.
6. Check 64px and 32px readability.
7. Confirm no text, logo, border, or rarity frame.
8. Set review status, quality score, review notes, and save to Library.

## expected manual issues to watch

- `white-background`
- `checkerboard-background`
- `white-fringe`
- `rarity-frame-baked`
- `baked-text`
- `wrong-size`

## regeneration notes

If rejected, keep the matched pair silhouette and fix only the issue. Common fixes: make both shoes readable at 32px, remove brand-like detail, reduce glow, remove frame, restore true alpha.

