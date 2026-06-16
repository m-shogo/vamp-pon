# Reference Art Map

この文書は、Vamp Pon の reference art をどの素材に対応させるかを管理する。

重要:
- reference は完成素材ではない。
- reference は画風・密度・色・シルエットの正解方向を示す。
- 実素材は Aseprite でゲームサイズに落とし込み、品質ゲートを通す。

---

## 1. Reference 保存場所

今後、参照画像は以下に保存する。

```txt
assets/reference/
  player/
    yui_turnaround_soft_pixel_reference.png
  enemies/
    ink_enemy_family_reference.png
  backgrounds/
    stage1_night_tile_reference.png
```

現時点では、会話内で生成した以下の3方向を正式 reference として扱う。

1. ユイ turnaround reference
   - soft painterly pixel art
   - 4方向
   - 大きめ顔、丸い青フード、生成り服、右手ランタン
2. 敵 family reference
   - ink_blob
   - torn_paper_wisp
   - hooded_ink_specter
   - ink_hound
3. 背景 reference
   - 夜街 / 石畳 / 紙片 / 暖色ランタン
   - ただし実ゲーム用には情報量を落として tile 化する

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

- 42pxで読みやすいように細部を減らす
- 月リムや装飾を控えめにする
- ランタン位置を gameplay に合わせて外側へ逃がす

変えてはいけない要素:

- 顔を小さくする
- フードを細くする
- 服を棒状にする
- ランタンを中央 `hitCore` と混ざる位置へ寄せる

---

## 3. Enemy reference

### `ink_enemy_family_reference.png`

対応予定:

| reference enemy | asset id proposal | 用途 |
| --- | --- | --- |
| small blob | `enemy_ink_blob` | 序盤群れ |
| torn paper wisp | `enemy_torn_paper_wisp` | 中距離 / 浮遊 |
| hooded specter | `enemy_hooded_ink_specter` | 中型圧力 |
| ink hound | `enemy_ink_hound` | 高速横圧力 |

守る要素:

- black ink family
- 光る目
- シルエット差
- 紙片 / フード / 獣 の区別
- プレイヤーより暗い
- 背景より読める

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
- repeating を邪魔する構図

---

## 5. Reference から実素材への変換ルール

1. reference の良い点を言語化する
2. 現状素材との差分を書く
3. 42px / 32px / tile サイズに合わせて要素を減らす
4. Aseprite source を作る
5. export する
6. 1x / 4x / 実背景 / combat-mock で見る
7. 品質ゲートを通ったら `final-candidate` にする

---

## 6. Core5 キャラクターマスター

Core5 のキャラクターデザインボードは以下に正規配置済み。

```txt
assets/reference/character-master/core5/
  yui-character-master-v1.png
  asa-character-master-v1.png
  nagi-character-master-v1.png
  michiru-character-master-v1.png
  tomori-character-master-v1.png
```

52px sprite sheet の候補は以下（配置次第）。

```txt
public/assets/prototypes/sprite-sheets/core5-52px/
```

48セル定義: `data/character-assets/core5-52px-sprite-sheet-cells.json`
マニフェスト: `data/character-assets/core5-character-master-assets.json`

全て **prototype-reference** 扱い。production 昇格は別工程
（[player-asset-promotion-policy.md](player/player-asset-promotion-policy.md)）。

---

## 7. Enemy 48 reference sheet

敵48枠は、雑魚を各Stage 5体に絞り、余ったセルを大ボスの別形態へ割り当てる。

```txt
雑魚25
中ボス10
大ボス基本形態3
大ボス別形態10
合計48
```

正本:

- 48セル設計: `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- 設計・配置・検品: `docs/enemies/enemy-48-sprite-sheet-plan.md`
- 生成用コピペ: `assets/concept-design/06_prompts/enemy-48-sprite-sheet-generation-prompt.md`

参照画像の予定位置:

```txt
assets/reference/enemies/enemy-48-sheet/enemy-48-sprite-sheet-v1.png
```

prototype確認用の予定位置:

```txt
public/assets/prototypes/sprite-sheets/enemies-180px/enemy-48-sprite-sheet-v1.png
```

仕様:

```txt
1440x1080px
8 columns x 6 rows
180x180px per cell
RGBA / alpha 0 background
48 non-empty cells
```

大ボス戦中はStage時間、wave進行、通常spawnを停止する。プレイヤー操作と大ボス固有フェーズは進行する。

生成シートは **prototype-reference**。production敵素材への直接コピーは禁止。

---

## 8. フォルダの役割

| フォルダ | 役割 | production か |
|---|---|---|
| `assets/concept-design/` | 作業場。方向性を固める | no |
| `assets/reference/` | 正式参照画像 | no |
| `assets/reference/character-master/core5/` | キャラ設計の正本 | no |
| `assets/reference/enemies/enemy-48-sheet/` | 敵48体の生成参照シート | no |
| `public/assets/prototypes/sprite-sheets/core5-52px/` | ゲームで仮読み込み可能な character sheet候補 | no |
| `public/assets/prototypes/sprite-sheets/enemies-180px/` | ゲームで仮読み込み可能な enemy sheet候補 | no |
| `public/assets/sprites/player/` | production player sprite。手仕上げ+レビュー済みのみ | **yes** |
| `public/assets/sprites/enemies/` | production enemy sprite。手仕上げ+レビュー済みのみ | **yes** |

---

## 9. 現在の注意

現在 repo 上の `yui_idle_42` 系は、まだ reference の品質には届いていない。
扱いは **temporary candidate**。

次にやるべきこと:

1. `yui_idle_42` を reference 基準で再調整
2. 通ったら `yui_move_42` へ展開
3. Enemy 48 sheetを生成し、1440x1080 / RGBA / 48セル / overflow 0を機械検査
4. 48枠からゲーム初期投入敵を選び、native spriteへ再設計
5. 最後に背景 tile を再設計する
