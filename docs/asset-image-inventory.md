# 画像アセット棚卸し

作成日: 2026-06-19

## 概要

| カテゴリ | ファイル数 | runtime参照 |
|---|---|---|
| assets/concept-design/ | 7 PNG | なし |
| assets/reference/ | 10 PNG/JPEG | なし |
| assets/source/ | 20 Aseprite | なし（ビルド時） |
| public/assets/prototypes/ sprite-sheets | 420 PNG | あり（主要） |
| public/assets/prototypes/ backgrounds | 5 PNG | あり |
| public/assets/prototypes/ cutins | 0 | （予定） |
| public/assets/sprites/ | 0 | 廃止済み |
| **合計** | **約462 画像 + 20 Aseprite** | |

---

## 今回の移動・リネーム

### 移動したファイル

| 移動前 | 移動後 | 理由 |
|---|---|---|
| `assets/reference/4A78C59F-7180-41C4-8EA6-677171100408.jpeg` | `assets/reference/player/yui/yui-sprite-sheet-48poses-reference-v1.jpeg` | UUID名 → 内容に基づく命名。ユイ48ポーズスプライトシート参考画像 |
| `assets/reference/ChatGPT Image Jun 18, 2026, 05_47_04 PM.png` | `assets/reference/player/yui/yui-fullbody-standing-reference-v1.png` | ChatGPT生成名 → 内容に基づく命名。ユイフルボディ立ち絵 |
| `assets/reference/DD2A30A6-8495-4144-99B4-575FE4A11275.jpeg` | `assets/reference/player/yui/yui-turnaround-4dir-reference-v1.jpeg` | UUID名 → 内容に基づく命名。ユイ高精細4方向ターンアラウンド |
| `assets/reference/yui_rage_48cells_final.png` | `assets/reference/player/yui/yui-rage-overdrive-48cells-reference-v1.png` | yui/配下へ統合。暴走/OD 48セル参考シート |
| `assets/reference/player/yui_turnaround_soft_pixel_reference.png` | `assets/reference/player/yui/yui-turnaround-softpixel-v1.png` | yui/サブフォルダへ移動・命名統一 |

### 削除したファイル

なし（今回は削除対象なし）

### 削除せず残した要確認画像

なし（全画像の役割が確認済み）

---

## assets/concept-design/ （7ファイル）

変更なし。適切に整理済み。

| パス | サイズ | 内容 |
|---|---|---|
| `00_style-reference/style_design-sheet_01.png` | 1024x1536 | ゲーム全体デザインボード |
| `00_style-reference/style_gameplay_01.png` | 853x1844 | ゲームプレイモックアップ |
| `00_style-reference/style_gameplay_02.png` | 941x1672 | レベルアップUI付きモックアップ |
| `00_style-reference/style_sprite-sheet_01.png` | 1024x1536 | スプライトシート参考 |
| `01_world/world_night-town_01.png` | 1024x1536 | 夜の街背景コンセプト |
| `04_items/item_memory-fragment_01.png` | 1536x1024 | 記憶の欠片アイテムデザイン |
| `05_ui/ui_card-levelup_01.png` | 1024x1536 | レベルアップカードUIコンセプト |

---

## assets/reference/ （10ファイル）

### player/yui/ （5ファイル — 今回整理）

| ファイル | サイズ | 形式 | 内容 |
|---|---|---|---|
| `yui-turnaround-softpixel-v1.png` | 1254x1254 | PNG | soft pixel 4方向ターンアラウンド |
| `yui-turnaround-4dir-reference-v1.jpeg` | 1536x512 | JPEG | 高精細 4方向ターンアラウンド |
| `yui-fullbody-standing-reference-v1.png` | 1254x1254 | PNG | フルボディ立ち絵（青フード+ランタン） |
| `yui-sprite-sheet-48poses-reference-v1.jpeg` | 1448x1086 | JPEG | 48ポーズ参考シート |
| `yui-rage-overdrive-48cells-reference-v1.png` | 1440x1080 | PNG | 暴走/OD 48セル参考シート |

### character-master/core5/ （5ファイル — 変更なし）

| ファイル | サイズ | 内容 |
|---|---|---|
| `yui-character-master-v1.png` | 1491x1055 | ユイ設計ボード |
| `asa-character-master-v1.png` | 1491x1055 | アサ設計ボード |
| `nagi-character-master-v1.png` | 1491x1055 | ナギ設計ボード |
| `michiru-character-master-v1.png` | 1491x1055 | ミチル設計ボード |
| `tomori-character-master-v1.png` | 1491x1055 | トモリ設計ボード |

### enemies/ （1ファイル — 変更なし）

- `ink_enemy_family_reference.png` (1254x1254) — インク敵4系統デザイン参考

### backgrounds/ （1ファイル — 変更なし）

- `stage1_night_tile_reference.png` (1448x1086) — Stage1夜の街タイル参考

---

## assets/source/ （20 Asepriteファイル）

変更なし。

- `aseprite/player/` — 本番用ソース4体（idle, move, hurt, ultimate）
- `aseprite/player/prototypes/` — 試作8体（v3〜v6, 各サイズバリアント）
- `prototypes/` — 52px探索バリアント8体（A/B/C, v2a/v2b/v2c系）

---

## public/assets/prototypes/ （435画像ファイル）

変更なし。全てruntime参照あり。

### sprite-sheets/core5-original/ （5シート）

1440x1080px / 8列x6行 / 180x180セル / PNG RGBA / 48セル

### sprite-sheets/core5-original-frames/ （240フレーム）

5キャラ x 48フレーム / 180x180px / PNG RGBA

### sprite-sheets/core5-52px/ （5シート）

1448x1086px / 52pxセル版

### sprite-sheets/core5-74px-exact-draft/ （5シート）

592x444px / 74pxセルドラフト版

### sprite-sheets/yui-expression-rage-original/ （1シート）

1440x1080px / ユイ表情・暴走48セル

### sprite-sheets/yui-expression-rage-original-frames/ （48フレーム）

180x180px / ユイ表情・暴走個別フレーム

### sprite-sheets/enemies-original/ （2シート + 96フレーム）

- enemy-48-left-1440x1080-rgba.png / enemy-48-right-1440x1080-rgba.png
- left-180/ (48枚) + right-180/ (48枚)

### sprite-sheets/weapon/ （15アイコン）

180x180px / 武器アイテムアイコン

### sprite-sheets/passive/ （8アイコン）

180x180px / パッシブアイテムアイコン

### sprite-sheets/rare/ （4アイコン）

180x180px / レアアイテムアイコン

### sprite-sheets/wepon-passive-rare-original/ （1レビューシート）

1440x720px / 全27アイコン一覧（ディレクトリ名タイポ "wepon"、runtime参照なし）

### backgrounds/ （5ステージ）

941x1672px / PNG / Stage1〜5の背景 / manifest.json でruntime有効

### cutins/yui/ （空）

カットイン画像の配置先。現在未制作。

---

## public/assets/sprites/ （廃止済み）

ディレクトリ構造のみ残存。画像ファイル0。
`prototypeManifest.ts` に参照が残るが `fileExists()` でスキップされる。

---

## 既知の壊れた参照

| 参照元 | パス | 影響 | 備考 |
|---|---|---|---|
| `core5PrototypeCharacters.ts` | `core5-52px-normalized/` | 低（ギャラリーのみ、fileExists()でスキップ） | normalize実行で生成可能 |
| `prototypeManifest.ts` | `sprites/player/prototypes/*.png` | 低（fileExists()でスキップ） | aseprite export で生成可能 |
| `reference-art-map.md` | `enemy-48-sheet/` | なし（ドキュメントのみ） | 今回修正済み |

---

## 参照更新箇所

| ファイル | 更新内容 |
|---|---|
| `docs/reference-art-map.md` | ユイ参照パスを yui/ サブフォルダに更新、敵48シートパス修正 |
| `docs/visual-reference-inventory.md` | ユイターンアラウンドパス更新、新規参照画像5件追記 |
| `assets/concept-design/06_prompts/concept-design-inventory.md` | ユイターンアラウンドパス更新 |
| `assets/reference/README.md` | フォルダ構成を最新化 |
| `assets/reference/player/README.md` | yui/サブフォルダの全画像リスト |
| `public/assets/README.md` | runtime参照元に説明追加、画像追加ルール表追加 |
| `public/assets/prototypes/README.md` | cutins、inventory source sheet の説明追加 |

---

## 画像追加時の置き場所ルール

| 種類 | 置き場所 | 命名例 |
|---|---|---|
| キャラクターマスター | `assets/reference/character-master/core5/` | `<id>-character-master-v1.png` |
| ユイ参考画像 | `assets/reference/player/yui/` | `yui-<kind>-v1.png` |
| 敵参考画像 | `assets/reference/enemies/` | `<enemy>-reference-v1.png` |
| 背景参考画像 | `assets/reference/backgrounds/` | `stage<N>-<theme>-reference-v1.png` |
| コンセプト・検討画像 | `assets/concept-design/<category>/` | `<category>_<description>_<NN>.png` |
| Aseprite編集元 | `assets/source/aseprite/` | `<id>_<action>.aseprite` |
| runtime スプライトシート | `public/assets/prototypes/sprite-sheets/` | `<id>-sprite-sheet-v1.png` |
| runtime 個別フレーム | `public/assets/prototypes/sprite-sheets/<group>-frames/` | `<NN>_r<RR>_c<CC>_<name>.png` |
| runtime カットイン | `public/assets/prototypes/cutins/<character>/` | `<id>-cutin-<state>-v1.png` |
| runtime 背景 | `public/assets/prototypes/backgrounds/stage-<NN>/` | `environment-master.png` |
| 一時受け渡し | `assets/import-staging/` | 正式配置後に削除 |

### 禁止

- `ChatGPT Image ...` のまま配置しない
- UUID / 連番のまま配置しない
- 日本語ファイル名をruntimeに置かない
- `public/assets/sprites/` に新規作成しない
