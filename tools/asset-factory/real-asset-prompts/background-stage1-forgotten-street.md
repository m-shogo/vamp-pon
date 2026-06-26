# background-stage1-forgotten-street

## generation prompt

Create a production-ready portrait mobile battle background for Vamp Pon.

Asset ID: `stage1-forgotten-street-390x844`.
Display name: Stage1 忘れ物の夜道.
Type: Background.

Canvas: 390 x 844 px.
Output: PNG. Opaque background is acceptable for this asset.

Design a Stage1 forgotten nighttime street / plaza background. It is a quiet place where forgotten objects gather: paper texture, small warm lantern light, black ink shadows, faint memory fragments, a streetlamp or pencil-like lamp, old paper ground, and subtle edge details. The center battle area must stay calm and readable for player, enemies, projectiles, and EXP fragments.

This is not an endless runner lane and not a side-scrolling scene. It is a vertical mobile battle arena background. Keep the top HUD area readable. Keep high-contrast objects near the edges, not in the center. No characters, no enemies, no UI, no text.

Style: dark but warm Vamp Pon mood, paper / memory / black ink / small light, readable mobile combat background.

## negative prompt

Text, letters, numbers, logo, watermark, UI panel, fake HUD, buttons, characters, enemies, EXP items baked in, endless runner lanes, side-scroller platform layout, too-noisy center, bright central light, photorealistic street photo, 3D render gloss, horror gore, existing IP imitation.

## target size

- 390 x 844 px
- Portrait mobile battle background

## transparent/background rule

Background does not need transparency. It should be a complete 390x844 scene. Do not bake in UI, text, characters, enemies, or item drops.

## Asset Factory check steps

1. Load PNG into Asset Factory.
2. Set Asset Type to `background`.
3. Confirm target size is 390x844.
4. Check top HUD safe area readability.
5. Check central combat readability for Yui, Ombu, projectiles, and EXP fragments.
6. Confirm no UI, text, characters, enemies, or pickups are baked in.
7. Confirm it is a portrait battle arena, not endless runner or side-scroller layout.
8. Set review status, quality score, review notes, and save to Library.

## expected manual issues to watch

- `too-noisy`
- `baked-text`
- `ui-baked-in`
- `wrong-size`

## regeneration notes

If rejected, preserve the Stage1 forgotten-night mood and fix only the issue. Common fixes: simplify center, darken noisy highlights, move landmarks to edges, remove UI/text/characters, output exact 390x844.

