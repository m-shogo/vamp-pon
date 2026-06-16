# Core5 52px Sprite Sheet In-game Preview Review

## Current decision

Core5 の 52px sprite sheet は **prototype-reference / sprite-sheet-candidate** として扱う。

production 昇格はしない。`public/assets/sprites/player/` と `assets/source/aseprite/player/` は今回の対象外。

## Preview pipeline

```txt
data/character-assets/core5-character-master-assets.json
+ data/character-assets/core5-52px-sprite-sheet-cells.json
+ public/assets/prototypes/sprite-sheets/core5-52px/*.png
-> pnpm character-assets:verify
-> pnpm core5:sprites:normalize
-> ?debug=core5sprites&protoCharacter=yui
-> Aseprite manual crop / hand correction
-> production promotion later
```

## Sprite sheet status by character

| character | prototype sheet | current status | first review focus |
| --- | --- | --- | --- |
| Yui | `public/assets/prototypes/sprite-sheets/core5-52px/yui-52px-sprite-sheet-v1.png` | sheet candidate. strict gate requires the file before visual review. | 主人公基準。フード、顔、ランタン、hitCore 誤認を最初に見る。 |
| Asa | `public/assets/prototypes/sprite-sheets/core5-52px/asa-52px-sprite-sheet-v1.png` | sheet candidate. strict gate requires the file before visual review. | 名札・紙片が文字なしで読めるか。Yui recolor 化しないか。 |
| Nagi | `public/assets/prototypes/sprite-sheets/core5-52px/nagi-52px-sprite-sheet-v1.png` | sheet candidate. strict gate requires the file before visual review. | 月箱・鍵・防御姿勢。暗フードがYuiと混ざらないか。 |
| Michiru | `public/assets/prototypes/sprite-sheets/core5-52px/michiru-52px-sprite-sheet-v1.png` | sheet candidate. strict gate requires the file before visual review. | コンパス・地図線・帰り道の光が52pxで残るか。 |
| Tomori | `public/assets/prototypes/sprite-sheets/core5-52px/tomori-52px-sprite-sheet-v1.png` | sheet candidate. strict gate requires the file before visual review. | 修理ランプ・道具袋・火花。Yuiのランタン役割と被らないか。 |

## 48-cell review map

The current 48 cells are divided like this:

| range | row role | expected usage | risk |
| --- | --- | --- | --- |
| 0-7 | idle / direction / ready | game idle, direction readability, vessel ready pose | 最重要。ここが崩れると本編で使えない。 |
| 8-15 | walk cycle | movement preview | 左右差・足運びがAI生成で破綻しやすい。 |
| 16-23 | cast / attack | weapon and ultimate preview | vessel/effect が大きすぎると hitCore / pickup と誤認する。 |
| 24-31 | hurt / recoil | damage feedback | 52pxだと表情よりシルエットで読む必要がある。 |
| 32-39 | special / black / interact / emote | special, story, result, black-evolution | black frame はただ黒いだけにしない。通常版との差分が必要。 |
| 40-47 | portrait / vessel / crest / item / effect icons | UI icons and future character card | icon cells は gameplay sprite と切り離して評価する。 |

## Usable / suspicious / remake-required cells

現時点では画像を直接目視していないため、セル単位の採点は **preview後に更新**する。

Initial review assumptions:

- **Likely usable first**: `idle_front`, `ready_front`, `walk_front_a`, `walk_front_b`, `vessel_icon`, `crest_normal`
- **Suspicious**: left/right directional pairs, `hurt_*`, `recoil_*`, `special_black`, portrait cells
- **Likely needs remake or Aseprite correction**: any cell where the generated sheet breaks the 52px boundary, contains text, merges multiple poses, or loses the character vessel

## Why Yui first

Yui is the player-facing baseline. If Yui's 52px sheet cannot survive 1x/4x/8x preview, the other four characters should not be promoted into the same format yet.

Yui review decides:

- actual crop boundary strategy
- 1x readability target
- hitCore / lantern separation
- dark background contrast
- how much Aseprite correction is required before a sheet can become production-candidate

## Why production is not touched

These generated sheets are not hand-final. The project policy requires player/main character production assets to pass a separate promotion flow:

- human review
- Aseprite correction / manual crop
- 80-point quality gate
- production path guard
- `public/assets/sprites/player/` update only in a dedicated promotion task

Therefore this branch only adds preview infrastructure.

## Aseprite correction checklist

Next Aseprite pass should focus on:

1. Slice each source sheet against the 8x6 logical grid and mark actual cell boundaries.
2. Remove accidental text, labels, duplicated props, or merged cells.
3. Normalize each cell to 52x52 with consistent baseline / foot position.
4. Keep outline and rim light tight enough for the night background.
5. Separate character vessel glow from hitCore / pickup glow.
6. Fix left/right pairs so they are not simple broken mirrors.
7. Rebuild `hurt`, `recoil`, `special_black`, and icon rows manually if AI generation is ambiguous.
8. Export a review sheet before any production promotion discussion.

## Preview commands

```sh
pnpm character-assets:verify
pnpm core5:sprites:normalize
pnpm dev
# open /?debug=core5sprites&protoCharacter=yui
```

Other characters:

```txt
/?debug=core5sprites&protoCharacter=asa
/?debug=core5sprites&protoCharacter=nagi
/?debug=core5sprites&protoCharacter=michiru
/?debug=core5sprites&protoCharacter=tomori
```
