# Asset Pipeline Foundation

Vamp Pon / Lantern Ledger の画像・生成物・実装素材を崩さず管理するためのルール。

この文書は、AI生成画像、実装向け参照画像、Phaser本番素材、Unity移行素材を混ぜないための土台。

## Core Principle

画像は4種類に分ける。

1. `final concept` — 世界観・完成目標を見る画像
2. `implementation target` — Phaserで分解しやすい参照画像
3. `source asset` — 切り出し・加工元の素材
4. `runtime asset` — 実際にゲームで読み込む素材

この4つを混ぜない。

## Directory Rules

### Design Targets

Use for reference only.

```txt
docs/design-targets/
  final/
  implementation/
  unknown/
  README.md
```

Rules:

- AI生成の完成画面はここへ置く。
- 本番ゲームで直接読み込まない。
- 画像内テキストは参考にしない。
- Phaser実装では、ここを見ながらGraphics/Text/UI helperで再現する。

### Runtime Assets

Use for actual game loading.

```txt
public/assets/
  ui/
  icons/
  characters/
  enemies/
  backgrounds/
  effects/
  cutins/
  prototypes/
```

Rules:

- ゲームで読み込むものだけ置く。
- UUID名禁止。
- 文字入りUI画像は禁止。
- 参照画像をそのまま入れない。

### Prototype Assets

Use for experiments.

```txt
public/assets/prototypes/
  sprite-sheets/
  backgrounds/
  cutins/
  ui/
```

Rules:

- 試作素材はここ。
- 本番採用前に名前と仕様を整理する。
- 使っていないものはREADMEで状態を書く。

### Unity Prep Assets

Unityへ移す時の候補は、まずdocsで一覧化する。

```txt
docs/unity-asset-export-checklist.md
```

実際のUnity projectをこのrepo内に作るかは、30秒デモ判断後に決める。

## Naming Rules

### Do Not Use

- UUID-only names
- Japanese-only filenames for runtime assets
- `image.png`
- `new.png`
- `test.png`
- `final_final.png`
- `スクリーンショット.png`

### Design Target Naming

```txt
<screen>-<type>-v<number>.png
```

Examples:

```txt
title-final-v1.png
title-implementation-v1.png
battle-final-v1.png
battle-implementation-v1.png
result-clear-final-v1.png
result-clear-implementation-v1.png
stage-select-final-v1.png
stage-select-implementation-v1.png
collection-final-v1.png
collection-implementation-v1.png
level-up-final-v1.png
level-up-implementation-v1.png
kokuyou-cutin-final-v1.png
kokuyou-cutin-implementation-v1.png
```

### Runtime Asset Naming

```txt
<category>_<subject>_<variant>_<size-or-state>.png
```

Examples:

```txt
ui_paper_card_base_390.png
ui_button_primary_paper_idle.png
ui_button_primary_paper_pressed.png
ui_rank_seal_s_clear.png
ui_badge_lantern_new.png
icon_memory_fragment_64.png
icon_weapon_ink_bottle_64.png
fx_ink_burst_soft_01.png
fx_lantern_glow_core_128.png
cutin_yui_kokuyou_base.png
char_yui_idle_52.png
enemy_ombu_walk_48.png
enemy_omburo_walk_64.png
bg_stage01_memory_street_loop.png
```

### Phaser Helper Naming

```txt
src/game/ui/<screen-or-system>Parts.ts
src/game/ui/<component>Name.ts
```

Examples:

```txt
src/game/ui/resultMemoryPage.ts
src/game/ui/levelUpCardParts.ts
src/game/ui/battleHudParts.ts
src/game/ui/collectionLedgerParts.ts
src/game/ui/paperButtonParts.ts
```

## Asset State Labels

Every non-runtime image in `docs/design-targets/README.md` should have a state.

Allowed states:

- `reference-only`
- `implementation-target`
- `needs-regeneration`
- `needs-crop`
- `needs-transparent-export`
- `candidate-runtime-asset`
- `rejected`

## What Goes Into README

For each design target image:

```md
### battle-implementation-v1.png

- screen: Battle
- state: implementation-target
- source: AI generated
- use in runtime: no
- adopt:
  - paper HUD tags
  - ultimate lantern seal
  - kokuyou ink gauge
  - EXP curve trail feeling
- reject:
  - baked text
  - too detailed background
  - full-image usage
- implementation files:
  - `src/game/ui/hud.ts`
  - `src/game/ui/inventorySlot.ts`
  - `src/game/ui/battleHudParts.ts`
- regeneration needed: maybe
- regeneration prompt: only if needed
```

## AI Image Rules

AI images are useful for direction, not production UI.

### Allowed

- visual target
- composition reference
- color mood reference
- effect idea reference
- texture idea reference

### Not Allowed

- full-screen final UI background
- readable UI labels from image
- baked Japanese/English text
- tiny unreadable scraps used as content
- fake buttons baked into image
- character art in screens that should not need character art

## Runtime Asset Requirements

A runtime asset should be:

- named clearly
- placed under `public/assets/` or accepted runtime folder
- referenced by code or manifest
- no unreadable baked text
- size documented if special
- transparent if it is an overlay/effect/icon
- visually consistent with `docs/design-system.md`

## Transparency Rules

Use transparent PNG for:

- icons
- character sprites
- enemy sprites
- cutin character layers
- ink slash overlays
- particles/effects
- UI decals

Do not require transparency for:

- full background prototypes
- paper texture tiles
- design target screenshots

## Text Rules

Production text must be game-rendered.

Allowed image text:

- reference-only AI image text inside docs
- logo exploration only if clearly marked as non-runtime

Not allowed in runtime:

- button labels baked into images
- stat text baked into images
- result numbers baked into images
- AI pseudo-Japanese

## Image Regeneration Rule

If a generated image is not implementation-friendly, do not keep generating randomly.

Write one precise prompt per image:

```md
image path:
issue:
regenerate prompt:
```

Prompt must include:

- `implementation-oriented`
- `390x844 readable`
- `separable layers`
- `no final rendered text`
- `reduce decorative density`
- `reusable UI components`
- screen-specific layout

## Screen-Specific Asset Guidelines

### TOP

Good runtime assets:

- paper title banner
- primary paper button frame
- secondary paper card button
- small lantern NEW badge
- subtle paper/star-map background tile

Avoid:

- large baked title poster
- character-dependent composition

### Battle

Good runtime assets:

- inventory slot frame
- ultimate lantern seal button frame
- kokuyou gauge frame
- memory fragment icon
- ink burst particle texture
- lantern glow texture

Avoid:

- detailed painted battle background as one image
- baked HUD

### Result

Good runtime assets:

- large page texture
- rank seal texture
- reward card frame
- dawn glow overlay

Avoid:

- final result screenshot as UI
- baked reward numbers

### LevelUp

Good runtime assets:

- card frame
- rare seal
- icon slots
- light decals

Avoid:

- three cards baked into one image
- rarity text baked in

### Collection

Good runtime assets:

- index tab frame
- ledger page frame
- locked ink overlay
- small lantern NEW badge

Avoid:

- entire collection page screenshot

### 黒曜化 Cutin

Good runtime assets:

- character layer without text
- ink slash layer
- lantern streak layer
- dark band layer

Avoid:

- text baked into cutin
- red-eye demon expression
- one-piece poster cutin if UI needs separate text

## Compression / Size Caution

Do not optimize prematurely.

But avoid:

- huge 4K images in runtime
- multiple duplicate PNGs with tiny differences
- invisible alpha padding wasting size
- screenshots stored in runtime folders

For Phaser web:

- UI icons: usually 32/48/64px
- large UI panels: prefer Graphics where possible
- background prototypes: use only when needed
- effect textures: small soft sprites

For Unity later:

- keep source concepts in docs
- export clean layers only when needed
- avoid importing all design screenshots as runtime textures

## Asset Review Checklist

Before merging asset PR:

- [ ] UUID-only names removed or quarantined
- [ ] reference images moved to docs/design-targets
- [ ] runtime assets have stable names
- [ ] no baked UI text in runtime assets
- [ ] no full-screen AI UI used as production UI
- [ ] README documents state/use/rejection
- [ ] Phaser references updated if runtime path changed
- [ ] asset verification command run when applicable

## Final Rule

Reference images help decide what to build.

Runtime assets are only the pieces needed to build it.

Never confuse the two.
