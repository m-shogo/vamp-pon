# Visual Reference Inventory

repo 内の参考画像と、そこから採用する/しない要素の一覧。
ビジュアル実装はこの参考画像を基準にする（最重要）。

> 画像は実際に目視して分類した（2026-06-14 / クロード）。

---

## 画像一覧

| パス | 何の参考か | 使える要素 | 使わない要素 | ゲーム内反映先 |
|---|---|---|---|---|
| `assets/concept-design/00_style-reference/style_design-sheet_01.png` | マスターデザインシート（全体トーン・パレット・敵・進化・UI） | 深い藍紫×暖色のトーン、白目の黒インク影、紙カードUI、武器進化の段階表現 | 文字情報の直訳 | 全体方針 / `docs/visual-direction.md` |
| `assets/concept-design/00_style-reference/style_gameplay_01.png` | ゲームプレイ全景 | 画面密度、敵配置、HUD配置 | — | HUD / 背景密度 |
| `assets/concept-design/00_style-reference/style_gameplay_02.png` | ゲームプレイ全景（鮮明） | 背景=藍紫＋淡いタイル＋街灯の暖光、ユイ=青帽子・クリーム服・ランタン、敵=黒インク影＋白目＋インク溜まり、欠片=小さな金の光、カード=古紙＋茶縁＋★ | 仮スティック/コンパスボタンの形は任意 | 背景 / プレイヤー / 敵 / 欠片 / カードUI |
| `assets/concept-design/00_style-reference/style_sprite-sheet_01.png` | キャラ・敵・欠片・タイルのスプライト | ユイ=フード＋ランタンの暖光、敵=不規則なインク飛沫＋光沢＋白目（大中小）、欠片=金の四芒星＋きらめき、古紙タイル | — | プレイヤー / 敵 / 欠片 |
| `assets/concept-design/01_world/world_night-town_01.png` | 夜の街・床タイル | 藍紫のヴィネット（中央やや明・縁暗）、紙グレイン、縁に淡い紙片/街灯/標識/小花、まばらな黒インク染み。**グリッドではない** | ハードな格子線 | 背景 |
| `assets/concept-design/05_ui/ui_card-levelup_01.png` | レベルアップカード / HUDパネル | 古紙クリーム＋茶のラフな縁、角の星（レア）、アイコン絵、★レア行、紙/木パネルのHUD枠 | — | レベルアップカード / HUD |
| `assets/concept-design/04_items/item_memory-fragment_01.png` | 拾得物（欠片・紙片星・カプセル） | ①金の星＋柔光（基本の欠片）②紙ページ入りの金の星③コルク付きガラス瓶の中に金の星（記憶カプセル） | 過剰なきらめき | 欠片 / カプセル |

---

## 参考画像から確定したパレット（近似）

```txt
夜背景(中央)   #2a2747
夜背景(縁)     #1d1a34
紙グレイン     #332f54
淡い紙片       #b8aecb
地図線         #4a4570
黒インク(敵)   #171328
インク縁       #3a3358  ← 明るすぎる紫にしない
インク溜まり   #1b1730
白い目         #f5f3ff
街灯/ランタン  #ffce7a
欠片の金       #ffd45e / 柔光 #fff0b0
古紙クリーム   #f3e9cf
紙の茶縁       #b8a06a
紙の文字       #4a3f2a
朝の色         #f6d9a8 / #f3c9a0
HP赤           #e0564f
XP紫           #9b7fc0
```

---

## 参考画像と現実装のズレ（修正対象）

```txt
背景がグリッド線        → 参考は紙グレイン+ヴィネット+縁の紙片。修正。
進化弾がSFビーム(青)    → 参考は鉛筆の濃い一行(紙)。修正。
夜明けの輪が魔法陣      → 参考は黒インク染み+街灯の丸い光+朝色。修正。
北極星弾がギラ星        → 参考は小さな紙ランタンの灯り。修正。
プレイヤーがただの丸    → 参考はフード+ランタンの小さな主人公。修正。
回復が緑の十字          → 紙の絆創膏/包帯紙にする。修正。
敵の縁が明るい紫        → 参考はほぼ黒+控えめな縁。修正。
カプセル演出が青リング  → 暖色/紙に寄せる。修正。
```

採用要素・再現要素・仮要素のまとめは [docs/visual-direction.md](visual-direction.md) を参照。

---

## 正式 reference 画像

以下は `assets/concept-design/` から `assets/reference/` に移動済み。

| パス | 何の参考か |
|---|---|
| `assets/reference/player/yui/yui-turnaround-softpixel-v1.png` | ユイ4方向ターンアラウンド（soft pixel） |
| `assets/reference/player/yui/yui-turnaround-4dir-reference-v1.jpeg` | ユイ4方向ターンアラウンド（高精細） |
| `assets/reference/player/yui/yui-fullbody-standing-reference-v1.png` | ユイフルボディ立ち絵 |
| `assets/reference/player/yui/yui-sprite-sheet-48poses-reference-v1.jpeg` | ユイ48ポーズ参考シート |
| `assets/reference/player/yui/yui-rage-overdrive-48cells-reference-v1.png` | ユイ暴走/OD 48セル参考 |
| `assets/reference/enemies/ink_enemy_family_reference.png` | 黒インク敵4系統 |
| `assets/reference/backgrounds/stage1_night_tile_reference.png` | 夜の街背景 |

---

## Core5 キャラクターマスター

全5キャラの設計ボードは `assets/reference/character-master/core5/` に v1 として正規配置済み。

- マニフェスト: `data/character-assets/core5-character-master-assets.json`
- 48セル定義: `data/character-assets/core5-52px-sprite-sheet-cells.json`
- 詳細: [core5-image-asset-ingest.md](character-assets/core5-image-asset-ingest.md)

status は全て **prototype-reference**。production sprite ではない。
