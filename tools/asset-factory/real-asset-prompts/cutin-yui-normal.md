# cutin-yui-normal

## generation prompt

Create a production-ready horizontal battle cutin PNG for Vamp Pon.

Asset ID: `yui-normal-cutin-1440x360`.
Display name: ユイ通常カットイン.
Type: Cutin.

Canvas: 1440 x 360 px.
Output: PNG with true alpha transparency.

Design Yui, a young girl carrying a lantern, in a wide horizontal cutin composition for a mobile 2D action game. The cutin should feel determined, warm, and quiet: a small light pushing through a dark forgotten night. Yui holds the lantern in her right hand. Her bag strap runs from right shoulder to left hip, and the bag body is on her left hip. Keep these body-relative placements correct.

Composition must be wide and readable, not a vertical poster portrait. Leave transparent space so the game can overlay the cutin on top of the battle scene. No text, no UI, no border. The lantern glow may extend softly but must remain within the 1440x360 canvas.

Style: dark but warm Vamp Pon mood, paper / memory / black ink / small light, expressive 2D game art, coherent with the current Yui identity.

## negative prompt

Text, letters, numbers, logo, watermark, UI panel, fake buttons, border, checkerboard background, white background, white fringe, vertical poster composition, full-body standing poster, lantern missing, bag on wrong side, photorealistic texture, 3D render gloss, gore, sexual content, existing IP imitation.

## target size

- 1440 x 360 px
- Horizontal cutin
- Transparent PNG

## transparent/background rule

Use true PNG alpha transparency. Do not use a white background or drawn checkerboard. The cutin is overlaid on the battle scene, so any atmosphere must be transparent glow/ink, not a filled rectangle.

## Asset Factory check steps

1. Load PNG into Asset Factory.
2. Set Asset Type to `cutin`.
3. Confirm target size is 1440x360.
4. Check checkerboard preview for true alpha and white fringe.
5. Check horizontal composition and Yui identity.
6. Check lantern in right hand, strap right shoulder to left hip, bag on left hip.
7. Confirm no text, logo, UI, border, or poster composition.
8. Set review status, quality score, review notes, and save to Library.

## expected manual issues to watch

- `white-background`
- `checkerboard-background`
- `white-fringe`
- `poster-composition`
- `lantern-missing`
- `bag-position-wrong`
- `baked-text`
- `ui-baked-in`
- `wrong-size`

## regeneration notes

If rejected, preserve the approved Yui identity and fix only named weak areas. Common fixes: restore horizontal cutin composition, restore true alpha, correct lantern and bag placement, remove text/UI, reduce edge glow.

