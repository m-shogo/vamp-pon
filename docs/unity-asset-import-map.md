# Unity向け素材インポート方針

作成日: 2026-06-28
目的: Unityへ持っていく素材と保留素材を分け、import設定の方針を決める。

---

## 1. 持っていく素材

| 素材 | Web側パス | Unity用途 | 優先度 |
|---|---|---|---|
| ユイ キャラフレーム | `public/assets/prototypes/sprite-sheets/core5-original-frames/yui/` | プレイヤースプライト | 必須 |
| 敵スプライトシート (採用済み分) | `public/assets/prototypes/sprite-sheets/enemies-original/` | 敵スプライト | 必須 |
| 武器 inventory icon | `public/assets/prototypes/sprite-sheets/weapon/` | UI / LvUpカード | 高 |
| パッシブ inventory icon | `public/assets/prototypes/sprite-sheets/passive/` | UI / LvUpカード | 高 |
| レア inventory icon | `public/assets/prototypes/sprite-sheets/rare/` | UI / LvUpカード | 高 |
| dawn_ticket.png | `public/assets/prototypes/sprite-sheets/rare/dawn_ticket.png` | QA用レアUI | 高 |
| Stage1背景 | `public/assets/prototypes/backgrounds/` | ゲーム背景 | 必須 |
| キャラクターマスター (参照用) | `assets/reference/character-master/core5/` | 制作参照 | 参照のみ |

---

## 2. 保留素材

| 素材 | 理由 |
|---|---|
| ユイ以外のcore5キャラ | Vertical SliceはユイのみでOK |
| 全敵48体シート | 最低3〜5種から始める |
| カットイン / スペシャル演出 | Phase U5以降 |
| gold_compass等の特殊passive icon | Vertical Sliceでは一部のみでよい |
| StoryMap / 図鑑素材 | Phase U4以降 |

---

## 3. 使わない / retired素材

| 素材 | 理由 |
|---|---|
| `public/assets/sprites/` 以下 | retired。再生成・Unityへの持ち込み禁止 |
| 古いprototypeシートの旧バージョン | 最新のcore5-original / enemies-originalを使う |

---

## 4. Unity import設定候補

### 4-1. キャラ / 敵スプライト

| 設定項目 | 推奨値 | 備考 |
|---|---|---|
| Texture Type | Sprite (2D and UI) | |
| Sprite Mode | Multiple (スプライトシートの場合) / Single (frame単位) | core5-original-framesはSingleでよい |
| Pixels Per Unit (PPU) | 仮値: 180 | 180px原本基準。実機確認後に調整 |
| Filter Mode | Point (no filter) | ピクセルアート寄りなら Point 推奨 |
| Compression | None (QA確認時) → High Quality (リリース候補) | UI素材はNone推奨 |
| Generate Mip Maps | チェックなし (2D固定) | |
| Alpha Is Transparency | チェックあり | |
| Read/Write Enabled | 通常はオフ (スクリプトからpixel読み取りが必要な場合のみオン) | |

**注意**: 絵本風/柔らかい素材はBilinearも選択肢。Pointとの見た目を実機で比較する。

### 4-2. 背景

| 設定項目 | 推奨値 |
|---|---|
| Sprite Mode | Single |
| PPU | 仮値: 1 (full-screen背景の場合) または表示サイズに合わせる |
| Filter Mode | Bilinear (背景は柔らかさ優先) |
| Compression | Normal Quality |

### 4-3. inventory icon (UI用)

| 設定項目 | 推奨値 |
|---|---|
| Texture Type | Sprite (2D and UI) |
| Sprite Mode | Single |
| PPU | 仮値: 180 (180px原本) |
| Filter Mode | Point (ピクセルアート) または Bilinear (柔らかい素材) |
| Compression | None or High Quality |

**注意**: 32px/64px表示確認済みのものはUI Imageとして使用。白フリンジ (透明PNGの輪郭にgrayが出る現象) に注意。Alpha Is Transparency を必ず有効にする。

---

## 5. フォルダ案 (Unity側)

```
Assets/
├── Art/
│   ├── Characters/
│   │   └── Yui/
│   │       ├── yui_idle.png
│   │       ├── yui_walk.png
│   │       └── ...
│   ├── Enemies/
│   │   ├── ombu_sheet.png
│   │   └── ...
│   ├── Backgrounds/
│   │   └── stage1_bg.png
│   └── UI/
│       ├── Icons/
│       │   ├── Weapons/
│       │   ├── Passives/
│       │   └── Rares/
│       └── Hud/
├── Data/
│   ├── Weapons/
│   ├── Passives/
│   ├── Rares/
│   └── Enemies/
├── Prefabs/
├── Scenes/
└── Scripts/
```

---

## 6. 命名規則

- スネークケース維持: `night_pencil.png`, `dawn_ticket.png`
- キャラフレーム: `yui_walk_left_01.png` 等、Web側命名に合わせる
- Unity Asset名 (ScriptableObject): `NightPencilDefinition` 等、PascalCaseで

---

## 7. 注意点

- `public/assets/sprites/` はretired。絶対にUnityへ持ち込まない。
- 180px原本を基準にする。32px/64px縮小はUnity側のUI表示設定で対応。
- Addressablesは初期は使わずResources or direct referenceでよい。本格化時に検討。
- dawn_ticket.png はアイコン採用済みだが通常run出現は未解禁のまま。
- 透明PNGのアルファ確認: `Alpha Is Transparency` を有効にし、白フリンジが出ないか実機確認。
- PPUは仮値のため、実機で見た目を確認してから確定する。
- core5キャラはcore5-original-framesをフレーム単位でimportする (シートごとのMultipleでも可)。
