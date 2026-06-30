# Unity Sprite Import Policy 2026-06-30

## Purpose

Unity sprite import settings should be deliberate before assets move from candidate to production. U5Candidates are proof-only and not production approved.

## Common Rules

- Texture Type: Sprite
- Alpha Source: From Input
- Alpha Is Transparency: enabled
- Mip Maps: off for 2D sprites/UI unless a specific full-screen art case needs them
- Filter Mode: Bilinear for soft matte candidates; Point only for intentional pixel art
- Compression: uncompressed for proof; production should evaluate platform compression
- Pivot: explicit per asset type
- Max Texture Size: keep as low as readability allows
- Sprite Atlas: plan group now, introduce atlas later

## Characters

- PPU: proof may use high PPU to normalize generated source size. Production should settle on character-scale PPU after sprite sheet sizing.
- Pivot: bottom-center for gameplay characters unless animation requires center pivot.
- Sorting: player above ground/pickups, below UI overlays.
- Max texture size: trimmed sheet or frames, avoid oversized transparent padding.
- Filter: Bilinear for painterly candidates; Point only if final art returns to pixel style.
- Atlas group: `Characters`.

## Enemies

- PPU: match gameplay scale against player, not source pixel size.
- Pivot: bottom-center or center depending on movement/body shape.
- Sorting: below player when appropriate, above background.
- Max texture size: trim soft transparent padding.
- Atlas group: `Enemies`.

## Pickups

- PPU: small readable gameplay size.
- Pivot: center.
- Sorting: above floor and below UI.
- Max texture size: 64/128/256 target after production crop.
- Atlas group: `Items` or `VFX` depending on behavior.

## VFX Source

- PPU: effect-specific, often higher than characters to avoid huge generated sources.
- Pivot: center for bursts/sparks, center-left or center for trails depending on animation.
- Sorting: battle overlay order, not UI canvas.
- Max texture size: 64/128/256 target after crop.
- Atlas group: `VFX`.

## UI Textures

- PPU: less important for uGUI Image, but import as Sprite.
- Pivot: center.
- Use sliced sprites for reusable panels/buttons when promoted.
- Text must be TMP, not baked in image.
- Atlas group: `UI`.

## Cut-In / Collection Art

- These are not 180x180 cells.
- Treat as full-screen or wide cut-in illustrations.
- No UI text baked into image.
- Fullscreen art belongs outside gameplay sprite atlases.
- Atlas group: `FullscreenArt` or separate loading path.

## Sprite Atlas Plan

Planned groups:

- `Characters`
- `Enemies`
- `Items`
- `VFX`
- `UI`
- `FullscreenArt` separate from small sprites

Do not introduce full Sprite Atlas workflow during U5.1. Keep folder and manifest categories compatible with future atlas adoption.

## U5Candidates

Current import settings:

- Battle candidates: PPU `900`
- VFX candidates: PPU `1400`
- UI candidates: PPU `100`
- Proof-only folder: `Assets/_Project/Resources/U5Candidates`

These values are acceptable for U5 proof. They are not final production import policy.
