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
- Atlas group: `Pickups` or `VFX` depending on behavior.

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
- `Pickups`
- `VFX`
- `UI`
- `FullscreenArt` separate from small sprites

Do not introduce full Sprite Atlas workflow during U6. Keep folder and manifest categories compatible with future atlas adoption.

## U5 Candidate Atlas Group Draft

U5Candidates are proof-only. The following groups are a draft for future approval work, not an approved Sprite Atlas setup.

| Candidate | Draft group | Notes |
| --- | --- | --- |
| `u5-yui-battle-candidate` | `Characters` | Single-frame battle proof only. Production movement sheets need their own import pass. |
| `u5-ombu-battle-candidate` | `Enemies` | Single-frame opponent proof only. Production enemy sheets need scale, pivot, and animation review. |
| `u5-exp-fragment` | `Pickups` | Gameplay pickup. Keep readable at mobile scale and avoid large transparent padding. |
| `u5-lantern-spark` | `VFX` | Projectile / hit / pulse source proof. Production use may split projectile and hit sprites. |
| `u5-ink-burst` | `VFX` | Enemy defeat proof. Pool and cap before production. |
| `u5-collect-trail` | `VFX` | EXP collect trail proof. Keep separate from UI glow. |
| `u5-paper-panel` | `UI` | Material source only. Production UI should use Prefab / 9-slice / TMP, not text-baked images. |
| `u5-icon-frame` | `UI` | Decorative frame source only. Production ownership belongs to UI Prefabs. |

Full-screen 黒耀化 / ultimate / Collection art is separate from battle sprites. It should use `FullscreenArt` or a separate loading path, not the small battle sprite atlas.

Production approved化する時にSprite Atlas分類を確定する。U5Candidatesはcandidateのままであり、`Resources/U5Candidates` is proof-only.

## U5Candidates

Current import settings:

- Battle candidates: PPU `900`
- VFX candidates: PPU `1400`
- UI candidates: PPU `100`
- Proof-only folder: `Assets/_Project/Resources/U5Candidates`

These values are acceptable for U5 proof. They are not final production import policy.

UI runtime textures must not bake text. UI text should be layered with TMP.
