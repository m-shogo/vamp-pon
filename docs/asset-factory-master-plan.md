# Asset Factory Master Plan

Vamp Pon / Lantern Ledger 専用の素材量産パイプライン構想。

目的は、AIで完全自動生成することではない。**AIで作る、Vamp Ponルールで整える、検査して壊れを防ぐ、Web / Unityへ出力する**ための制作基盤を作る。

## Why This Exists

完全自動の「1枚絵からゲーム素材全部」はまだ破綻しやすい。

特に壊れるもの:

- キャラ一貫性。
- 左右の手持ちルール。
- バッグ位置。
- ドット縮小時の可読性。
- フレームごとの色ブレ。
- 端接触。
- Unity出力時の命名。
- 画像として良いがゲームでは読めない問題。

Asset Factoryは、生成AIの代替ではなく、生成物を**ゲーム素材に変換する工場**。

## Core Philosophy

```txt
Generate fast
↓
Normalize strictly
↓
Check automatically
↓
Export predictably
↓
Human chooses only the good ones
```

## Factory Modules

```txt
Asset Factory
├── Character Factory
├── Enemy Factory
├── Weapon Factory
├── Item Factory
├── Background Prep
├── Cutin Prep
├── Icon Prep
├── SpriteSheet Exporter
├── Unity Exporter
└── Quality Gate
```

## Build Priority

### Phase 1: Item / Weapon Factory

一番成功率が高い。

- 1枚アイコンから始められる。
- キャラ一貫性問題が少ない。
- ゲームへすぐ反映できる。
- 64 / 128 / 256出力がしやすい。

### Phase 2: Enemy Factory

人型より簡単で、Vamp Pon世界観にも合う。

- オンブ素体。
- オンブロ素体。
- 忘れ物パーツ。
- 行動型。
- 色 / サイズ差分。

### Phase 3: Character Factory

一番価値が高いが難しい。

- 共通マネキン。
- 頭 / 目 / 手 / 腰 / 足の座標固定。
- パーツ差し替え。
- 喜怒哀楽。
- 左右 / 座り / 歩き。
- 黒曜化overlay。

### Phase 4: Background Prep

背景は生成より、ゲーム視認性の調整が重要。

- 390x844 crop。
- 暗さ調整。
- コントラスト制御。
- 敵 / EXP / UI可読性チェック。
- ループ化。

## Character Factory

### Concept

1枚絵から全て生成しない。共通マネキンにパーツを乗せる。

```txt
base_mannequin
+ hair
+ face
+ outfit
+ bag
+ hand_item
+ accessory
+ black_form_overlay
= character frame
```

### Required Mannequin Poses

```txt
front_idle_01
front_idle_02
left_idle_01
right_idle_01
walk_left_01
walk_left_02
walk_right_01
walk_right_02
sit_front
hit_front
down_front
```

### Anchor Points

| Anchor | 用途 |
|---|---|
| head_center | 髪 / 顔 |
| eye_left | 表情 |
| eye_right | 表情 |
| mouth | 表情 |
| neck | 首飾り / マフラー |
| shoulder_right | バッグ紐起点 |
| shoulder_left | 服 / 装備 |
| hand_right | ランタン / 武器 |
| hand_left | 補助装備 |
| waist_left | バッグ本体 |
| waist_right | 小物 |
| foot_left | 歩行 |
| foot_right | 歩行 |
| shadow_center | 接地影 |

### Yui Fixed Rules

- ランタンは本人の右手。
- バッグ紐は右肩から左腰。
- バッグ本体は左腰。
- 左向きでもランタンを完全に消さない。
- 黒曜化しても暖色coreを残す。
- 可愛い悪魔顔にしない。

### Character Output

```txt
exports/characters/yui/
  yui_master_1024.png
  parts/
    body.png
    hair.png
    face_normal.png
    face_smile.png
    face_angry.png
    face_sad.png
    outfit.png
    bag.png
    lantern.png
    kokuyou_overlay.png
  sheets/
    yui_sheet_180x180_8x6.png
    yui_sheet_unity.png
  manifests/
    yui_character.json
    yui_unity.json
```

## Enemy Factory

See also: `docs/enemy-factory-design.md`.

### Concept

```txt
base family
+ forgotten item motif
+ behavior type
+ palette
+ size tier
+ stage context
= enemy
```

### Output

```txt
exports/enemies/ombu-umbrella-shield/
  master.png
  sheet_180x180_8x6.png
  preview.gif
  manifest.json
  unity.json
```

## Weapon / Item Factory

See also: `docs/weapon-item-factory-design.md`.

### Concept

```txt
motif
+ effect
+ trajectory
+ rarity visual
+ evolution rule
= usable game item
```

### Output

```txt
exports/weapons/black-ink-bottle/
  master_1024.png
  icon_256.png
  icon_128.png
  icon_64.png
  projectile.png
  effect_preview.png
  manifest.json
  unity.json
```

## Background Prep

### Concept

背景は綺麗さより戦闘可読性。

```txt
AI / hand background
↓
crop to 390x844
↓
darken combat area
↓
reserve HUD contrast
↓
check player / enemy / EXP visibility
↓
export
```

### Required Checks

- Player readable。
- Enemy readable。
- EXP readable。
- HUD readable。
- LevelUp overlay readable。
- Result page background not too noisy。

### Output

```txt
exports/backgrounds/stage-1-forgotten-street/
  master.png
  game_390x844.png
  combat_visibility_check.png
  ui_overlay_check.png
  unity_bg.png
```

## Cutin Prep

### Concept

カットインはSpriteSheetとは別管理。

- 横長。
- 文字なし。
- 透明背景。
- 表情とランタン位置を固定。
- Unity / Web両対応。

### Output

```txt
exports/cutins/yui/
  yui_cutin_normal_1440x360.png
  yui_cutin_kokuyou_1440x360.png
  yui_cutin_manifest.json
```

## Quality Gate

Asset Factoryは生成より検査が大事。

### Image Checks

- PNG。
- RGBA。
- Transparent background。
- No white fringe。
- No checkerboard background。
- No text baked into asset unless explicitly allowed。
- No frame border。

### Sprite Checks

- 180x180 cell alignment。
- 8x6 sheet if required。
- 48 cells detected。
- No edge contact。
- Character center stable。
- Shadow center stable。
- Palette stable。

### Character Checks

- Right hand / left hand rule。
- Bag position。
- Face identity。
- Height consistency。
- Head position consistency。
- Eye position consistency。
- Side direction clarity。
- Black form still readable as same character。

### Enemy Checks

- Silhouette readable at 32〜64px。
- Behavior role exists。
- Stage context exists。
- Not too scary。
- Not too detailed。
- Distinct from other enemies。

### Item Checks

- Icon readable at 32px。
- No baked rarity frame。
- Motif is clear。
- Effect can be explained in one short line。
- Evolution pair makes sense。

## Tooling Draft

### Minimal Local Tool

```txt
Next.js local app
+ Node image pipeline
+ Python Pillow/OpenCV scripts
+ optional Aseprite CLI
+ JSON manifests
```

### Why Not Full App First

まずはCLI / local webでよい。Electron化は後回し。

### Commands Draft

```txt
asset-factory validate ./input/yui.png
asset-factory export-character yui
asset-factory export-enemy ombu-umbrella-shield
asset-factory export-icon black-ink-bottle
asset-factory check-sheet yui_sheet_180x180_8x6.png
asset-factory export-unity ./exports
```

## Unity Export Contract

Unityへ渡す時は、画像だけではなくmanifestも必須。

```json
{
  "id": "yui",
  "type": "character",
  "displayName": "ユイ",
  "spriteSheet": "yui_sheet_180x180_8x6.png",
  "cellWidth": 180,
  "cellHeight": 180,
  "columns": 8,
  "rows": 6,
  "anchors": {
    "hand_right": [100, 108],
    "waist_left": [78, 120]
  }
}
```

## Anti-Goals

- 独自画像生成AIを作らない。
- 独自ドットエディタを作らない。
- 独自3Dモデラーを作らない。
- Asepriteを手作業前提にしない。
- 素材作りで本体開発を止めない。

## Definition of Done for Factory v0

Factory v0は以下ができれば十分。

- PNG透過チェック。
- 180x180 / 8x6チェック。
- 端接触チェック。
- アイコン64 / 128 / 256出力。
- manifest出力。
- Unity向け命名出力。
- Stage1敵5体分の仕様を吐ける。
- 武器 / アイテム8個分の仕様を吐ける。

## First Build Recommendation

最初に作るなら、Character Factoryではなく、Item / Weapon Factoryから。

理由:

- 成功率が高い。
- すぐゲームへ入る。
- Asepriteを使えなくても成立する。
- Unity移行にもそのまま使える。

次にEnemy Factory。

Character Factoryは、共通マネキンと座標表が決まってから始める。