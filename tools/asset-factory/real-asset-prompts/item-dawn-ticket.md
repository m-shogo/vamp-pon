# item-dawn-ticket

## generation prompt

Create a production-ready 2D game item icon for Vamp Pon.

Asset ID: `dawn-ticket`.
Display name: 夜明けチケット.
Preset: Item / 夜明けチケット.

Canvas: 1024 x 1024 px.
Output: PNG with true alpha transparency.

Design a small old ticket with rounded corners and a tear line. The ticket has a warm paper body and a faint dawn orange-pink gradient along one edge. It may have faint decorative line marks, but no readable text, letters, numbers, logos, or symbols. One edge is slightly torn like a ticket stub that can be used once.

This is a rare revive consumable: a promise of one more chance, the dawn will come. The orange-pink dawn color must be subtle, not a full sunrise illustration. Mostly warm paper color, readable at 32px and 64px.

Style: dark but warm Vamp Pon mood, paper / memory / black ink / small light, mobile-readable 2D game icon.

## negative prompt

Readable text, letters, numbers, logo, barcode, watermark, rarity frame, decorative border, checkerboard background, white background, white fringe, white outline, photorealistic paper scan, 3D render gloss, train-company ticket design, full sunrise scene, existing IP imitation.

## target size

- 1024 x 1024 px master icon
- Centered subject
- Readable at 64px and 32px

## transparent/background rule

Use true PNG alpha transparency. Do not use a white background or drawn checkerboard. Keep transparent padding around the ticket; no paper edge, glow, or shadow may touch the canvas edge.

## Asset Factory check steps

1. Load PNG into Asset Factory.
2. Set Asset Type to `item`.
3. Apply preset `dawn-ticket`.
4. Confirm image size is 1024x1024.
5. Check checkerboard preview for true alpha and white fringe.
6. Check 64px and 32px readability.
7. Confirm no readable text, logo, border, barcode, or rarity frame.
8. Set review status, quality score, review notes, and save to Library.

## expected manual issues to watch

- `white-background`
- `checkerboard-background`
- `white-fringe`
- `rarity-frame-baked`
- `baked-text`
- `wrong-size`

## regeneration notes

If rejected, keep the old ticket silhouette and fix only the issue. Common fixes: remove readable letters/numbers, remove frame, make the dawn gradient subtler, enlarge ticket for 32px readability, restore true alpha.

