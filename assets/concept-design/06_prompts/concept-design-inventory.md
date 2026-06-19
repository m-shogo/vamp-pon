# Concept Design Inventory

repo 内のコンセプトデザイン・参照画像の棚卸し。

> 分類日: 2026-06-16

---

## concept-design/

| path | category | status | reason | weakness | mobile readability | implementation note | next action |
|---|---|---|---|---|---|---|---|
| `00_style-reference/style_design-sheet_01.png` | style | keep | 全体トーン・パレット・敵・進化・UI の方向性シート | 文字が多く直接使えない | 縮小時に文字は読めない | 方針参照のみ。素材としては使わない | — |
| `00_style-reference/style_gameplay_01.png` | style | keep | ゲームプレイ画面の密度・HUD配置の参照 | — | 良好。スマホ縦画面構図 | 画面密度・HUD位置の基準 | — |
| `00_style-reference/style_gameplay_02.png` | style | keep | ゲームプレイ画面（カード選択UI付き）の鮮明版 | — | 良好。カードUI読める | 背景・プレイヤー・敵・欠片・カードUIの実装基準 | — |
| `00_style-reference/style_sprite-sheet_01.png` | style | keep | キャラ・敵・欠片・タイルのスプライト参照 | 白背景で暗背景確認不可 | 個々のスプライトは読める | スプライト密度・サイズ感の参照 | — |
| `01_world/world_night-town_01.png` | world | keep | 夜の街の床タイル・雰囲気参照 | グリッドではない一枚絵 | 暗いが雰囲気は伝わる | tile化の参照。そのままは使えない | tile分割設計 |
| `04_items/item_memory-fragment_01.png` | item | keep | 記憶の欠片3種（星・紙片星・カプセル）の参照 | — | 金の光は読める | pickup実装の形状・光の参照 | ドット化 |
| `05_ui/ui_card-levelup_01.png` | ui | keep | レベルアップカード・HUDパネルの参照 | — | カード内容読める | カードUI・HUD枠の実装参照 | UI実装 |

---

## assets/reference/ (concept-designから移動済み)

| path | category | status | reason | weakness | mobile readability | implementation note | next action |
|---|---|---|---|---|---|---|---|
| `reference/player/yui/yui-turnaround-softpixel-v1.png` | character | keep | ユイ4方向ターンアラウンド。画風の正解基準 | — | 4方向とも読める | idle/move/hurt/ultimateの全ポーズ基準 | Aseprite手仕上げの参照 |
| `reference/enemies/ink_enemy_family_reference.png` | enemy | keep | 黒インク敵4系統（blob/wisp/specter/hound） | — | シルエット差明確 | 敵4系統の形状・光目の基準 | ドット化 |
| `reference/backgrounds/stage1_night_tile_reference.png` | world | keep | 夜の街背景。石畳・街灯・紙片 | 情報量多くtile化要 | 暗いが構成要素は見える | tile化して情報量を落とす必要 | tile分割設計 |

---

## assets/reference/character-master/core5/

| path | category | status | reason | weakness | mobile readability | implementation note | next action |
|---|---|---|---|---|---|---|---|
| `core5/yui-character-master-v1.png` | character | keep | ユイのキャラクターマスター設計シート | — | 全体構成読める | 52px sprite sheetのslicing基準 | sprite sheet slicing |
| `core5/asa-character-master-v1.png` | character | keep | アサのキャラクターマスター設計シート | — | 全体構成読める | 名札・紙片モチーフの基準 | sprite sheet slicing |
| `core5/nagi-character-master-v1.png` | character | keep | ナギのキャラクターマスター設計シート | フードがユイと近い | 全体構成読める | 月箱・鍵モチーフの基準 | sprite sheet slicing |
| `core5/michiru-character-master-v1.png` | character | keep | ミチルのキャラクターマスター設計シート | — | 全体構成読める | コンパス・地図モチーフの基準 | sprite sheet slicing |
| `core5/tomori-character-master-v1.png` | character | keep | トモリのキャラクターマスター設計シート | ランタンがユイと被る可能性 | 全体構成読める | 修理ランプ・火花モチーフの基準 | sprite sheet slicing |

---

## P1 必須デザインの充足状況

| P1要素 | 画像あり | 場所 | 状態 |
|---|---|---|---|
| ユイ | yes | `reference/player/` + `character-master/core5/` | keep。master sheetあり |
| 黒インク基本影 | yes | `reference/enemies/` | keep。4系統参照あり |
| 夜の鉛筆 | partial | `concept-design/00_style-reference/` 内に含まれる | 単体素材なし。要ドット化 |
| 記憶の欠片 | yes | `concept-design/04_items/` | keep。3種参照あり |
| 簡易HUD | yes | `concept-design/05_ui/` + `00_style-reference/` | keep。カード・HUD参照あり |
| ゲームオーバー/リトライ画面 | no | — | 未作成 |
| 背景1枚 | yes | `reference/backgrounds/` + `concept-design/01_world/` | keep。tile化要 |
