# weapon-night-pencil

## generation prompt

Create a production-ready 2D game weapon icon for Vamp Pon.

Asset ID: `night-pencil`.
Display name: 夜鉛筆.
Preset: Weapon / 夜鉛筆.

Canvas: 1024 x 1024 px.
Output: PNG with true alpha transparency.

Design a small magical pencil of night and memory. The pencil body is dark graphite grey-blue, with a subtle warm amber glowing tip and a faint star-line trail. The form is simple and elongated with a slight curve, centered in the canvas, readable at 32px and 64px.

It is a directional straight-line weapon that writes memories in the dark. It should feel like a small everyday object with quiet magic, not a fantasy wand. Keep the silhouette clean and iconic. No UI frame, no rarity frame, no text.

Style: dark but warm Vamp Pon mood, paper / memory / black ink / small light, mobile-readable 2D game icon.

## negative prompt

Text, letters, numbers, logo, watermark, rarity frame, decorative border, checkerboard background, white background, white fringe, white outline, photorealistic pencil texture, 3D render gloss, excessive sparkles, weapon blade, magic wand, existing IP imitation.

## target size

- 1024 x 1024 px master icon
- Centered subject
- Readable at 64px and 32px

## transparent/background rule

Use true PNG alpha transparency. Do not use a white background or drawn checkerboard. Keep transparent padding around the pencil; no glow or trail may touch the canvas edge.

## Asset Factory check steps

1. Load PNG into Asset Factory.
2. Set Asset Type to `weapon`.
3. Apply preset `night-pencil`.
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

If rejected, keep the same pencil identity and fix only the issue. Common fixes: enlarge subject, simplify star trail, remove frame, remove white fringe, restore 1024x1024 transparent canvas.

