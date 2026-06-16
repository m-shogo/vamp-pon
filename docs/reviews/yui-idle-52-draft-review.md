# Yui Idle 52px Master Draft Review

## Status

draft / temporary candidate

> 52px の新しいユイ master 設計の draft。
> final-candidate でも hand-final candidate でもない。
> production（42px）には一切反映していない。

---

## Current problems in 42px

現 production `yui_idle_42.png`（v5）の弱点:

- フードが巨大な青ベタの塊（「キノコ化」）で顔より支配的
- 胴体が脚も靴もないクリーム色の三角形
- ランタンが腕とつながらず浮遊
- soft painterly の階調がなく記号的
- グッズ化に耐える主人公シルエットになっていない

---

## Why 52px

42px では情報量が足りず、顔の可愛さ・前髪の束感・服の厚み・ランタンの魅力を同時に成立させにくい。
52px master にすることで以下を確保:

- 大きめで読める目とキャッチライト
- 前髪の束感（strand tips）
- フードの丸みと内側ライニング影
- 古紙色の服の厚み + 赤裾 + 赤いしおり紐（IP記号）
- 腕と手につながり暖色コア（記憶の光）を持つランタン
- フード / 顔 / 体 / ランタンの比率が取れた主人公シルエット

将来的に gameplay 用 42px へ落とす際の master / IP 基準として使う想定。

---

## Created draft artifacts

| path | 内容 |
| --- | --- |
| `assets/source/aseprite/player/prototypes/yui_idle_52_draft.aseprite` | 52px master draft source（11レイヤー） |
| `scripts/aseprite/build-yui-idle-52-draft.lua` | 52px draft ビルドスクリプト（補助） |
| `public/assets/sprites/player/prototypes/yui_idle_52_draft.png` | 52px draft 1x PNG（prototypes配下＝非production） |
| `public/assets/sprites/player/prototypes/yui_idle_52_dark.png` | 暗背景視認チェック |
| `docs/reviews/images/yui_idle_42_vs_52_draft.png` | 42px production vs 52px draft 比較 |

---

## Before / After

- before: `public/assets/sprites/player/yui_idle_42.png`（= 現 production v5「青いキノコ」）
- after: `public/assets/sprites/player/prototypes/yui_idle_52_draft.png`（52px draft、production非反映）
- comparison: `docs/reviews/images/yui_idle_42_vs_52_draft.png`（左=42px / 右=52px、暗背景5x）
- dark background: `public/assets/sprites/player/prototypes/yui_idle_52_dark.png`

visible differences:

- 巨大ベタフード → 顔を囲む丸いドレープフード（上左ハイライト / 下右クレセント影 / 内側ライニング影 / 上部ピーク）
- 脚なし三角胴 → cloak ドレープ + 襟 + エプロン + 赤いしおり紐 + 赤裾 + 見える脚・ダークブーツ
- 浮遊ランタン → 右腕・手につながった保持。ケージ + 暖色コア + 記憶の光スパーク + 淡い glow
- のっぺり顔 → 前髪の束 / 大きめキャッチライト入りの目 / 眉 / 頬 / 小さい口（少し不安だけど優しい表情）

---

## IP / mascot 観点チェック

1. silhouette: フード/顔/体/ランタンの比率が取れ、キノコ化していない。ランタンが輪郭として効く。黒塗りでもユイと分かる方向。
2. face: 1xでシルエット内に顔が読め、拡大で可愛い。無表情すぎない（眉 + 口 + 頬）。
3. prop: ランタンが腕と手につながり、暖色コア + 記憶の光スパークあり。中央 hitCore とは右に離れていて誤認しにくい。
4. costume: 古紙色の服に厚み、赤裾 + 赤いしおり紐、脚と靴が見える。

---

## Aseprite hand-finish check

- source: `assets/source/aseprite/player/prototypes/yui_idle_52_draft.aseprite`（11レイヤー）
- GUI used: **No** — headless CLI 環境のため、Aseprite GUI 上でのマウス 1px 手仕上げは未実施。pixel空間で script authoring した source-prep draft。
- hand-finished areas: なし（GUI手仕上げ前）
- direct PNG edit: no（production PNG / production source は未変更）

---

## Quality Gate

| Item | Score | Notes |
| --- | ---: | --- |
| 1x readability | 4 | フード+クリーム胴体+ランタンで主人公と判別可。目の細部は1xでは小さめ |
| reference match | 4 | フード/前髪/服/エプロン/赤裾/しおり紐/脚靴/保持ランタンのIP核が揃った |
| charm / appeal | 4 | マスコットとして明確に可愛い。GUI手仕上げで5へ伸ばせる |
| mascot silhouette | 4 | 比率良好・キノコ化なし・ランタンが輪郭に効く |
| merchandise potential | 4 | 青フード/ランタン/しおり紐など記号性が立つ |
| gameplay visibility | 4 | 暗背景で分離。中央hitCoreと混ざらない位置 |
| background separation | 4 | クリーム+青+暖色が暗背景で読める |
| style consistency | 3 | art-direction準拠だが新サイズで他素材(42px/敵/背景)と未調和。GUI手仕上げ前 |
| final confidence | 3 | draft。GUI未仕上げ・サイズ未採用のため final ではない |

3以下（style consistency / final confidence）があるため final-candidate にしない。

---

## Decision

draft only / not production.

- production source changed: no
- production png changed: no
- gameplay constants changed: no
- move / hurt / ultimate changed: no

レビュー可能な prototype として保持する。

---

## Next step

`yui_idle_52_draft.aseprite` を Aseprite GUI で開いて 1px 手仕上げ:

- eyes / catchlight（左右対称・虹彩の柔らかさ）
- bangs（束のメリハリ）
- cheeks / mouth（表情の最終調整）
- hood roundness（丸みとライニング）
- cloak folds（ドレープの折り）
- dress thickness（厚みと折り）
- lantern handle / cage / 記憶の光（魅力の最終調整）

charm/appeal と全項目が ≥ 4 になり、52px 採用方針が決まったら、
gameplay 用サイズ運用（52px採用 or 42pxへ縮小master）を決めて production 反映を検討する。
