# Yui Aseprite hand-final plan

`yui_idle` / `yui_move` / `yui_hurt` / `yui_ultimate` は **42pxネイティブ hand-final candidate**。
`yui_idle_v4_42` prototype のかわいい方向を本番候補基準として採用し、4ポーズを同一人物・同一ライティングで作成した。

2026-06-15 時点では、参照絵の「丸い青フード・大きめ顔・茶赤髪・古紙色ワンピ・右手側cageランタン」から離れないことを優先し、`scripts/aseprite/build-yui-42-source.lua` で4ポーズ共通の顔/フード/髪/胴体/ランタンを再整理した。

実機スマホでの可読性、指で隠れる感じ、端末ブラウザ固有の見え方はまだ未確認。

## Production Tool

- 使用対象: Aseprite stable v1.3.17.x
- 使用しない: Aseprite v1.3.18-beta2

## Current Basis

- `PLAYER_DEFAULTS.visualSize = 42`
- `PLAYER_DEFAULTS.radius = 6`
- `hitCore` / `debugHitCircle` は変更しない
- hp / moveSpeed / invulnSec は変更しない
- pickup collectRadius / magnetRange / magnetSpeed は変更しない
- 見た目と判定を分離する東方方式を維持

## 42px Native Source

`scripts/aseprite/build-yui-42-source.lua` が4ポーズの source を生成する。

```sh
aseprite -b \
  --script-param out=assets/source/aseprite/player/yui_idle.aseprite \
  --script-param pose=idle \
  --script scripts/aseprite/build-yui-42-source.lua
```

`pose` は `idle` / `move` / `hurt` / `ultimate`。

## Adopted Direction

- 丸い青フード
- 金の月リム
- 茶赤の前髪
- 大きめ顔
- 白ハイライト入りの目
- 頬
- 古紙色ワンピ
- 右手側の cage ランタン
- ランタンは中央 hitCore と混ざらない位置
- selective 1px outline
- 控えめ足元影

## 2026-06-15 Quality Review

### 直したこと

- 顔を少し大きくし、目の黒・茶色の虹彩・白ハイライトを1xで読ませる優先度に戻した。
- フードをより丸いシルエットにし、青の明部を増やして夜背景で黒い塊に見えにくくした。
- 茶赤の前髪を顔上部で読みやすくし、フードとの境界を強めた。
- 古紙色ワンピの前身頃と赤い裾の面積を増やし、参照の短い体つきに寄せた。
- ランタンを右手側へ少し離し、cageの縦バーを足して、中央 `hitCore` や記憶の欠片と形で区別しやすくした。

### 改善したこと

- 1x実寸で顔が先に読める。
- 4ポーズを並べても、同じ顔・同じフード・同じランタン位置の人物に見える。
- 黒インク敵と外形が混ざりにくいよう、顔と金リムを主な識別点にした。
- 服の明るい面積が増え、参照絵の「小さい体に明るい前身頃」の印象に近づいた。

### まだ残る弱点

- 42px内では月リム/フード模様/ランタンcageを同時に強めすぎると濁るため、月の記号は控えめ。
- `yui-gallery` は1x/3x表示で、4x専用レビュー画面はまだない。
- 実機スマホの発色、指で隠れる感じ、長時間プレイ時の疲れは未確認。

### 次にやるべきこと

- 4x固定のレビュー導線を追加し、1px単位の顔/髪/ランタンを比較しやすくする。
- `/?scene=combat-mock&density=late` を実機スマホで確認し、ランタン・欠片・hitCoreの誤認を記録する。
- 可能ならAseprite内でレイヤー名を整理し、顔/フード/体/ランタンのレビュー単位を分ける。

## Pose Notes

- `yui_idle`: 42px基準。顔、フード、ランタン、足元影の読みやすさを優先。
- `yui_move`: idle と同じ顔・色・ライティング。軽い前傾とランタン位置で移動差分を出す。
- `yui_hurt`: idle と同じ人物性を保ち、すくめ目・淡い赤み・小さな火花で一瞬の被弾に留める。
- `yui_ultimate`: generated-draft から昇格。idle と同じ人物性を保ち、ランタン光と小さな星線だけで奥義感を足す。

## Source Files

| pose | source | PNG |
| --- | --- | --- |
| idle | `assets/source/aseprite/player/yui_idle.aseprite` | `public/assets/sprites/player/yui_idle_42.png` |
| move | `assets/source/aseprite/player/yui_move.aseprite` | `public/assets/sprites/player/yui_move_42.png` |
| hurt | `assets/source/aseprite/player/yui_hurt.aseprite` | `public/assets/sprites/player/yui_hurt_42.png` |
| ultimate | `assets/source/aseprite/player/yui_ultimate.aseprite` | `public/assets/sprites/player/yui_ultimate_42.png` |

## Export

```sh
pnpm aseprite:check
pnpm aseprite:export:yui
pnpm assets:verify
```

public PNG を直接手編集しない。必ず Aseprite source / script / export 経由にする。

## Review

```txt
/?scene=yui-gallery
/?scene=yui-redesign42
/?scene=combat-mock&density=late
/?scene=asset-status
```

見ること:

- 42px native の4ポーズが同一人物・同一ライティングに見える。
- idle が主人公として読める。
- move は移動差分、hurt は被弾差分、ultimate は奥義差分として読める。
- ランタンと hitCore が混ざらない。
- 記憶の欠片とランタンが誤認されすぎない。
- late density で敵・弾・拾得物を隠しすぎない。

## Do Not Touch

- `PLAYER_DEFAULTS.radius`
- `PLAYER_DEFAULTS.visualSize`
- hp / moveSpeed / invulnSec
- pickup collectRadius / magnetRange / magnetSpeed
- `hitCore` / `debugHitCircle`
- background / enemy / weapon / drop の大幅変更
