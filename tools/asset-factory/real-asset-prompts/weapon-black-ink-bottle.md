# weapon-black-ink-bottle

## generation prompt

Create a production-ready 2D game weapon icon for Vamp Pon.

Asset ID: `black-ink-bottle`.
Display name: 黒インク瓶.
Preset: Weapon / 黒インク瓶.

Canvas: 1024 x 1024 px.
Final output: PNG with true alpha transparency.
Built-in image generation source workflow: generate on a perfectly flat pure `#00FF00` chroma-key background, then remove the chroma key locally and QA the RGBA output. The green background is source-only and must not remain in the final PNG.

Design a compact small round ink bottle with a cork or cap slightly askew. Black ink pools gently around the base, but stays inside the canvas padding. The bottle is dark glass with a faint warm reflection highlight; the ink is deep black with a very subtle warm amber reflection at the edge; the cap is dark warm brown.

It is an area weapon that creates ink pools on the ground. The ink is creative and memory-like, not toxic. Avoid skulls, poison symbols, horror, or aggressive labeling. The cork/cap detail should feel charming and readable, not busy.

Style: dark but warm Vamp Pon mood, paper / memory / black ink / small light, mobile-readable 2D game icon.

## negative prompt

Text, letters, numbers, logo, poison label, skull, watermark, rarity frame, decorative border, checkerboard background, white background, white fringe, white outline, photorealistic glass, 3D render gloss, toxic green liquid, horror, existing IP imitation.

## target size

- 1024 x 1024 px master icon
- Centered subject
- Readable at 64px and 32px

## transparent/background rule

Use true PNG alpha transparency. Do not use a white background or drawn checkerboard. Keep transparent padding around the bottle and ink pool; no drip, shadow, or glow may touch the canvas edge.
When using chroma-key source generation, do not use green in the subject. After removal, inspect alpha, corners, edge contact, and green fringe before candidate registration.

## candidate file convention

- Source: `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-1024-chromakey.png`
- Candidate master: `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-1024-rgba.png`
- Review sizes: `weapon-black-ink-bottle-icon-v1-clean-180.png`, `weapon-black-ink-bottle-icon-v1-clean-64.png`, `weapon-black-ink-bottle-icon-v1-clean-32.png`
- Display review: `weapon-black-ink-bottle-icon-v1-clean-display-review.png`

Do not replace `public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png` until this candidate is separately approved for runtime promotion.

## Asset Factory check steps

1. Load PNG into Asset Factory.
2. Set Asset Type to `weapon`.
3. Apply preset `black-ink-bottle`.
4. Confirm image size is 1024x1024.
5. Check checkerboard preview for true alpha and white fringe.
6. Check 64px and 32px readability.
7. Confirm no text, logo, poison symbol, border, or rarity frame.
8. Set review status to `candidate`, quality score to `4` at most, review notes, and save to Library.

## expected manual issues to watch

- `white-background`
- `checkerboard-background`
- `white-fringe`
- `rarity-frame-baked`
- `baked-text`
- `wrong-size`

## regeneration notes

If rejected, keep the ink bottle silhouette and fix only the issue. Common fixes: remove poison-like symbols, simplify ink pool, enlarge bottle for 32px readability, remove frame, remove white fringe.
