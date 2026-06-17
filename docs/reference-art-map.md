# Reference Art Map

この文書は、Vamp Pon の reference art をどの素材に対応させるかを管理する。

重要:

- reference は完成素材ではない。
- reference は画風・密度・色・シルエットの正解方向を示す。
- 実素材は Aseprite でゲームサイズに落とし込み、品質ゲートを通す。

---

## 1. Reference 保存場所

```txt
assets/reference/
  player/
    yui_turnaround_soft_pixel_reference.png
  character-master/core5/
  enemies/
    enemy-48-sheet/
      enemy-48-sprite-sheet-v1.png
  backgrounds/
    stage1_night_tile_reference.png
```

現在の基準方向:

1. Player
   - soft painterly pixel art
   - 大きめの顔、丸い青フード、生成り服、暖色ランタン
2. Enemy
   - 48体設計台帳を正本とする
   - 共通familyはオンブ／オンブロ
   - Stage固有15体、中ボス10体、大ボス3体＋別形態10体
3. Background
   - 夜街 / 石畳 / 紙片 / 地図線 / 控えめな暖色灯り
   - 実ゲーム用には情報量を落としてtile化する

---

## 2. Player reference

### `yui_turnaround_soft_pixel_reference.png`

対応素材:

- `public/assets/sprites/player/yui_idle_42.png`
- `public/assets/sprites/player/yui_move_42.png`
- `public/assets/sprites/player/yui_hurt_42.png`
- `public/assets/sprites/player/yui_ultimate_42.png`

守る要素:

- 大きめで可愛い顔
- 丸く大きい青フード
- 茶赤の前髪
- 生成り〜古紙色の服
- 服の厚み
- 小さい体つき
- 右手側ランタン
- front / back / side の同一人物性
- 柔らかい陰影
- 強すぎないアウトライン

変えてよい要素:

- native sizeで読みやすいように細部を減らす
- 月リムや装飾を控えめにする
- ランタン位置をgameplayに合わせて外側へ逃がす

変えてはいけない要素:

- 顔を小さくする
- フードを細くする
- 服を棒状にする
- ランタンを中央`hitCore`と混ざる位置へ寄せる

---

## 3. Enemy reference

敵の正本:

- exact order: `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- complete design index: `data/enemy-assets/enemy-design-catalog.json`
- detailed briefs: catalogの`designFiles`
- common-family direction: `docs/enemies/omb-ombro-selected-direction.md`
- sheet plan: `docs/enemies/enemy-48-sprite-sheet-plan.md`
- readiness: `docs/enemies/enemy-48-production-readiness.md`

### 共通family

| family | 用途 | 固定記号 |
|---|---|---|
| `omb` | 各Stageの小型基準敵 | 柔らかい影体、インク芽、四角い古紙目、全身の暗い影炎 |
| `ombro` | 各Stageの中型圧力敵 | 低く横長、強い影炎、地面へ垂れる影の擬手 |

旧`ink_blob`を独立した正本familyとして扱わない。オンブが小型黒インク影の正本となる。

旧`pon_shadow`、`grown_pon_shadow`、`ポン影`、`ふくらみポン影`は禁止。

### 敵全体で守る要素

- black-ink world
- 黒一色ではなく濃紺・紫黒・青灰色の段階陰影
- プレイヤーより暗い
- 背景より読める
- eye/light placementを敵ごとに分ける
- silhouette、body ratio、signature parts、postureを重複させない
- 攻撃前に読めるtelegraphを持つ
- 暖色点をpickupやhit coreと誤認する大きさにしない
- 大ボス別形態をpalette-only swapにしない

### 48体reference sheet

```txt
assets/reference/enemies/enemy-48-sheet/enemy-48-sprite-sheet-v1.png
```

仕様:

```txt
1440x1080px
8 columns x 6 rows
180x180px per cell
true RGBA / alpha 0 background
48 non-empty cells
4px transparent safe border per cell
```

生成シートは`prototype-reference`。production敵素材への直接コピーは禁止。

---

## 4. Background reference

### `stage1_night_tile_reference.png`

対応予定:

- `bg_stage1_paper_night`
- tile: 32x32 or 64x64
- gameplay background

守る要素:

- 夜の青灰色
- 控えめな紙片
- 古い街 / 石畳 / 地図線の気配
- 小さな暖色灯り

落とす要素:

- 建物やランプの主張
- 目立つ明部
- 大きすぎる紙片
- repeatingを邪魔する構図

---

## 5. Referenceから実素材への変換ルール

1. referenceの良い点を言語化する
2. 現状素材との差分を書く
3. catalogの`nativePx`へ合わせて要素を減らす
4. Aseprite sourceを作る
5. exportする
6. 1x / 4x / 実背景 / combat mockで見る
7. 品質ゲートを通ったら`hand-final-candidate`にする

AI生成referenceを直接縮小してproductionへ置かない。

---

## 6. Core5 キャラクターマスター

Core5のキャラクターデザインボード:

```txt
assets/reference/character-master/core5/
  yui-character-master-v1.png
  asa-character-master-v1.png
  nagi-character-master-v1.png
  michiru-character-master-v1.png
  tomori-character-master-v1.png
```

52px sprite sheet候補:

```txt
public/assets/prototypes/sprite-sheets/core5-52px/
```

- 48セル定義: `data/character-assets/core5-52px-sprite-sheet-cells.json`
- マニフェスト: `data/character-assets/core5-character-master-assets.json`

全て`prototype-reference`扱い。production昇格は別工程。

---

## 7. Enemy 48 reference sheet

配分:

```txt
雑魚25
  オンブ5
  オンブロ5
  Stage固有15
中ボス10
大ボス基本形態3
大ボス別形態10
合計48
```

各Stage:

```txt
オンブ1
オンブロ1
Stage固有3
中ボス2
```

大ボス戦中はStage時間、wave進行、通常spawn、時間難易度上昇を停止する。プレイヤー操作、攻撃、cooldown、大ボス内部時間は進行する。大ボス戦時間は生存時間へ加算しない。

検査:

```sh
pnpm enemy48:design:check
pnpm enemy48:manifest:check
pnpm enemy48:sprites:verify
```

---

## 8. フォルダの役割

| フォルダ | 役割 | productionか |
|---|---|---|
| `assets/concept-design/` | 方向性検討と生成prompt | no |
| `assets/reference/` | 正式reference | no |
| `assets/reference/character-master/core5/` | キャラ設計の正本 | no |
| `assets/reference/enemies/enemy-48-sheet/` | 敵48体のreference sheet | no |
| `public/assets/prototypes/sprite-sheets/core5-original-frames/` | 主人公/キャラの現在のprototype frame候補。Yui runtime候補はここを読む | no |
| `public/assets/prototypes/sprite-sheets/core5-52px/` | Core5 character sheet reference。runtime正本ではない | no |
| `public/assets/prototypes/sprite-sheets/weapon/` | ChatGPT画像生成由来の武器180px inventory icon候補 | no |
| `public/assets/prototypes/sprite-sheets/passive/` | ChatGPT画像生成由来の忘れ物180px inventory icon候補 | no |
| `public/assets/prototypes/sprite-sheets/rare/` | ChatGPT画像生成由来のレア180px inventory icon候補 | no |
| `public/assets/prototypes/sprite-sheets/enemies-original/` | 最新enemy prototype sheet候補。runtimeで読む | no |
| `public/assets/prototypes/backgrounds/` | 最新background prototype。manifestでruntime有効 | no |
| `assets/source/aseprite/enemies/` | editable enemy source | source of truth |
| `public/assets/sprites/player/` | 手仕上げ・review済みplayer export | **yes** |
| `public/assets/sprites/enemies/` | 手仕上げ・review済みenemy export | **yes** |

---

## 9. 現在の優先順

1. Enemy 48 sheetを生成し、1440x1080 / RGBA / 48セル / overflow 0を機械検査
2. シルエット衝突とStageごとの見分けやすさをreview
3. オンブ／オンブロStage 1をnative Aseprite sourceへ再設計
4. Stage 1固有雑魚3体をnative化
5. Stage 1中ボス2体をnative化
6. runtimeを`docs/enemies/enemy-runtime-migration-plan.md`の順で移行
7. 1x / 4x / dark background / combat mockで品質ゲート
