# Core 5 Image Asset Ingest

This document fixes where the generated Core 5 character design boards and 52px sprite sheets should live.

## Current status

The generated images are **reference/prototype assets**.

They are useful for design review, slicing tests, and Aseprite normalization, but they are **not production sprites yet**.

## Folder policy

### Character design boards

Put full character master board PNGs here:

```txt
assets/reference/character-master/core5/
```

Recommended file names:

```txt
assets/reference/character-master/core5/yui-character-master-v1.png
assets/reference/character-master/core5/asa-character-master-v1.png
assets/reference/character-master/core5/nagi-character-master-v1.png
assets/reference/character-master/core5/michiru-character-master-v1.png
assets/reference/character-master/core5/tomori-character-master-v1.png
```

Reason:

- These are design references.
- They are not loaded directly by the game runtime.
- They should stay separate from production sprites.

### 52px sprite sheets for prototype/game slicing

Put generated textless 52px sprite-sheet PNGs here:

```txt
public/assets/prototypes/sprite-sheets/core5-52px/
```

Recommended file names:

```txt
public/assets/prototypes/sprite-sheets/core5-52px/yui-52px-sprite-sheet-v1.png
public/assets/prototypes/sprite-sheets/core5-52px/asa-52px-sprite-sheet-v1.png
public/assets/prototypes/sprite-sheets/core5-52px/nagi-52px-sprite-sheet-v1.png
public/assets/prototypes/sprite-sheets/core5-52px/michiru-52px-sprite-sheet-v1.png
public/assets/prototypes/sprite-sheets/core5-52px/tomori-52px-sprite-sheet-v1.png
```

Reason:

- `public/assets/prototypes/` is loadable by the Vite app for preview/testing.
- It clearly communicates prototype status.
- It avoids accidental production promotion.

## Excluded folders for this phase

The current prototype ingest phase does not write to:

```txt
public/assets/sprites/player/
assets/source/aseprite/player/
```

Those folders are reserved for production/hand-final pipeline assets.

## Data files

The asset placement manifest is here:

```txt
data/character-assets/core5-character-master-assets.json
```

The shared 48-cell sprite-sheet layout is here:

```txt
data/character-assets/core5-52px-sprite-sheet-cells.json
```

## 48-cell sprite sheet format

Every Core 5 sheet should use the same 8x6 logical layout:

```txt
8 columns x 6 rows = 48 cells
logical cell size: 52px
```

Row meaning:

1. idle / direction / ready
2. walk cycle
3. cast / attack
4. hurt / recoil
5. special / black-evolution / interact / downed / emotes
6. portrait / vessel / item / crest / effect icons

See `data/character-assets/core5-52px-sprite-sheet-cells.json` for the exact cell-by-cell meaning.

## Game usage path

Prototype usage:

```txt
generated sprite sheet PNG
-> public/assets/prototypes/sprite-sheets/core5-52px/
-> pnpm character-assets:verify
-> pnpm core5:sprites:normalize
-> ?debug=core5sprites&protoCharacter=yui
-> review/slicing experiment
-> Aseprite normalization
-> hand review
-> production promotion later
```

Production usage later:

```txt
Aseprite source
-> export sliced/clean sprites
-> public/assets/sprites/player/
```

## Prototype preview pipeline

Commands:

```sh
pnpm character-assets:verify
pnpm core5:sprites:normalize
pnpm dev
```

Debug URLs:

```txt
/?debug=core5sprites&protoCharacter=yui
/?debug=core5sprites&protoCharacter=asa
/?debug=core5sprites&protoCharacter=nagi
/?debug=core5sprites&protoCharacter=michiru
/?debug=core5sprites&protoCharacter=tomori
```

The preview uses normalized sheets when present. If normalized PNGs do not exist, it falls back to the original generated sheet path. If the original sheet is also missing, the app shows a fallback panel instead of changing the production player.

## Normalizer

Command:

```sh
pnpm core5:sprites:normalize
```

Output directory:

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

Initial behavior:

- Exact `416x312` source sheets are copied as normalized PNGs.
- Non-exact sheets only produce `manifest.json` / `overlay-cells.json` with `needsManualCrop: true`.
- Missing source sheets are recorded for review; the strict failure belongs to `pnpm character-assets:verify`.

## Required next step

After placing PNG files in the recommended folders, run or improve the slicing/Aseprite normalization pass so it can:

- read `core5-52px-sprite-sheet-cells.json`
- crop 48 cells
- export normalized per-cell PNGs
- reject sheets that do not match the required grid

## Naming rule

全キャラ v1 で統一する。v2 以降は手仕上げ後の改版時のみ付番する。

```txt
yui-character-master-v1.png    (v2 は作らない。全員 v1 統一)
yui-52px-sprite-sheet-v1.png
```

## Folder roles

```txt
assets/reference/character-master/core5/   → キャラ設計の正本
public/assets/prototypes/sprite-sheets/    → ゲームで仮読み込み可能な sprite sheet 候補
public/assets/sprites/player/              → production（手仕上げ+レビュー済みのみ）
```

## Production promotion

production 昇格は別工程。条件は以下を参照:

- [player-asset-promotion-policy.md](../player/player-asset-promotion-policy.md)
- [vamp-pon-pixel-art-pipeline-v1.md](../pixel-art/vamp-pon-pixel-art-pipeline-v1.md)

## Safety rule

Generated sheets can guide the game, but they are not final art.

They must be treated as:

```txt
prototype-reference / sprite-sheet-candidate
```

not:

```txt
hand-final / production-candidate
```
