# public/assets/prototypes

This directory is for runtime-loadable **prototype** images only.

It is intentionally separate from production player assets:

```txt
public/assets/prototypes/        # prototype / debug preview
public/assets/sprites/player/    # production player sprites
```

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
