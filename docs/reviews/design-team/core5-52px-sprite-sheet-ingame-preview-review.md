# Core5 52px Sprite Sheet In-game Preview Review

## Current decision

Core5 のアップロード済み 5 枚は **raw reference board** として扱う。

**sprite sheet candidate からは降格**。現状はズレが大きく、52px / 74px / offset 調整で切り出す対象ではない。

production 昇格はしない。`public/assets/sprites/player/` と `assets/source/aseprite/player/` は今回の対象外。

## 2026-06-16 visual review result

Decision: **再生成必須**。

理由:

- 8×6 の均等グリッドとして成立していない。
- `cell=52` でも `cell=74` でも、セル境界にポーズが合わない。
- `ox/oy` の微調整で直るズレではない。
- 現在の画像は「sprite sheet」ではなく「複数案を並べた参照ボード」に近い。
- このまま normalizer / Aseprite crop に進むと、後工程で全セルを直すことになる。

結論:

```txt
current Core5 uploaded boards = reference only
next required asset = exact 8x6 sprite sheet
```

## Correct next asset target

次に作る画像は、名前より実体を優先する。

推奨:

```txt
cell: 74px
columns: 8
rows: 6
canvas: 592x444px
background: transparent or flat debug color
text: none
labels: none
one pose per cell
cell boundary: exact, uniform, no collage layout
```

52px は小さく見えるため、次の候補は **74px source / 74px in-game preview** を基準にする。

## Preview pipeline after this decision

```txt
public/assets/prototypes/sprite-sheets/core5-52px/*.png
-> raw reference board preview only
-> do not crop
-> do not normalize into frames
-> regenerate exact 8x6 sheet
-> then Aseprite manual crop / hand correction
-> production promotion later
```

## Sprite sheet status by character

| character | prototype board | current status | next action |
| --- | --- | --- | --- |
| Yui | `public/assets/prototypes/sprite-sheets/core5-52px/yui-52px-sprite-sheet-v1.png` | raw reference only | exact 8x6 / 74px sheet を再生成。主人公基準で最初に確認。 |
| Asa | `public/assets/prototypes/sprite-sheets/core5-52px/asa-52px-sprite-sheet-v1.png` | raw reference only | Yui と同じlayoutで再生成。名札・紙片は文字なしで読ませる。 |
| Nagi | `public/assets/prototypes/sprite-sheets/core5-52px/nagi-52px-sprite-sheet-v1.png` | raw reference only | 月箱・鍵・防御姿勢をセル内中央に固定。 |
| Michiru | `public/assets/prototypes/sprite-sheets/core5-52px/michiru-52px-sprite-sheet-v1.png` | raw reference only | コンパス・地図線・帰り道の光をセル外にはみ出させない。 |
| Tomori | `public/assets/prototypes/sprite-sheets/core5-52px/tomori-52px-sprite-sheet-v1.png` | raw reference only | 修理ランプ・道具袋・火花をYuiのランタンと差別化。 |

## 48-cell target map for regenerated sheet

The regenerated exact 8x6 sheet should use this layout:

| range | row role | expected usage | risk |
| --- | --- | --- | --- |
| 0-7 | idle / direction / ready | game idle, direction readability, vessel ready pose | 最重要。ここが崩れると本編で使えない。 |
| 8-15 | walk cycle | movement preview | 左右差・足運びがAI生成で破綻しやすい。 |
| 16-23 | cast / attack | weapon and ultimate preview | vessel/effect が大きすぎると hitCore / pickup と誤認する。 |
| 24-31 | hurt / recoil | damage readability | 表情より silhouette を優先。 |
| 32-39 | special / interaction / emote | story and special move | 派手すぎると gameplay sprite として使えない。 |
| 40-47 | portrait / icons / crest / memory | UI / inventory / result | icon row はキャラ本体と切り分ける。 |

## Regeneration prompt requirement

次の生成依頼では、以下を必ず入れる。

```txt
Create one exact pixel-art sprite sheet PNG, 592x444px, 8 columns and 6 rows, each cell exactly 74x74px. No text, no labels, no captions, no UI, no collage framing. One centered pose per cell. Keep every pose inside its cell. Transparent background. Same character design across all 48 cells. Pixel art for a vertical mobile action game. Export as a true grid-aligned sprite sheet.
```

## Why production is still untouched

この段階で production に入れると、後で破綻する。

- generated board は hand-final ではない。
- grid が成立していない。
- Aseprite での人間 crop / 1px correction が未実施。
- 本編 player asset は `public/assets/sprites/player/` と `assets/source/aseprite/player/` の別promotion gateで扱う。
