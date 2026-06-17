# public/assets/prototypes

This directory is for runtime-loadable **prototype** images only.

It is intentionally separate from production player assets:

```txt
public/assets/prototypes/        # prototype / debug preview
public/assets/sprites/player/    # production player sprites
```

## Current runtime-facing prototype sources

These assets are not production art. They are ChatGPT image-generation outputs or derivatives used
as prototype references / temporary runtime inputs. Codex should not regenerate them unless the user
explicitly asks for an asset-generation task.

### Main character frames

The current Yui/Core5 runtime candidate frames are sliced here:

```txt
public/assets/prototypes/sprite-sheets/core5-original-frames/
```

Current inventory:

```txt
core5-original-frames/{yui,asa,nagi,michiru,tomori}/  # 48 frames each, 240 PNGs total
```

`src/game/assets/playerFrames.ts` currently reads Yui gameplay/HUD frames from
`core5-original-frames/yui/`. These are still prototype-reference / runtime-candidate frames, not
hand-final production sprites.

### Inventory icons

Weapon / passive / rare-item 180px originals live here:

```txt
public/assets/prototypes/sprite-sheets/weapon/   # 15 PNGs
public/assets/prototypes/sprite-sheets/passive/  # 8 PNGs
public/assets/prototypes/sprite-sheets/rare/     # 4 PNGs
```

`src/game/assets/inventoryOriginalIcons.ts` uses these 27 files as the current inventory UI source.
They are expected to come from the ChatGPT image-generation flow, then be reviewed/adapted before
any future production promotion.

### Latest background and enemy prototype sources

These folders contain the latest background and enemy prototype sources:

```txt
public/assets/prototypes/backgrounds/
public/assets/prototypes/sprite-sheets/enemies-original/
```

Backgrounds in `public/assets/prototypes/backgrounds/manifest.json` are runtime-enabled prototype
backgrounds. Enemy sheets under `enemies-original/` are the current runtime enemy sheet candidates.
They are still prototype assets, not production / hand-final art.

## Core5 52px sprite sheets

Generated Core5 sprite sheets live here:

```txt
public/assets/prototypes/sprite-sheets/core5-52px/
```

Normalized review outputs live here:

```txt
public/assets/prototypes/sprite-sheets/core5-52px-normalized/
```

Expected normalized filenames:

```txt
yui.png
asa.png
nagi.png
michiru.png
tomori.png
```

These files are still **prototype-reference / sprite-sheet-candidate**.

## Review flow

```sh
pnpm character-assets:verify
pnpm core5:sprites:normalize
pnpm dev
# /?debug=core5sprites&protoCharacter=yui
```

`core5:sprites:normalize` is conservative. It only copies a source sheet to normalized PNG when the source is exactly the expected `8x6` / `52px` grid (`416x312`). Otherwise it writes review metadata and flags `needsManualCrop: true`.

## Source of truth

- Manifest: `data/character-assets/core5-character-master-assets.json`
- 48-cell layout: `data/character-assets/core5-52px-sprite-sheet-cells.json`
- Review doc: `docs/reviews/design-team/core5-52px-sprite-sheet-ingame-preview-review.md`

## Hard rule

Do not move these generated sheets into `public/assets/sprites/player/` until a separate production-promotion task explicitly approves it.
