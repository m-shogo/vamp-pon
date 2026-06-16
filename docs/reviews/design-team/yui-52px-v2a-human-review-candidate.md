# Review: Yui 52px V2a — Human-Review Candidate (HR)

date: 2026-06-16
reviewer: pixel-art director pass（human review 提出）
prev (PF): [yui-52px-v2a-procedural-finish-review.md](./yui-52px-v2a-procedural-finish-review.md)
pipeline: [docs/pixel-art/vamp-pon-pixel-art-pipeline-v1.md](../../pixel-art/vamp-pon-pixel-art-pipeline-v1.md)

Design role: pixel-art director / pro app quality gate
iteration history: A/B/C → v2（V2a/V2b/V2c）→ PF（script-assisted）→ **HR（refinement + 人間レビュー提出）**

---

## これは何か / 何でないか（最重要・最初に明記）

- これは **GUI hand-finish ではない。** 人間が Aseprite のキャンバスで鉛筆ツールで1pxを彫っていない。
- これは **hand-final ではない。**
- 中身は **script-assisted refinement（pass 2）＋ ディレクター人間レビュー** の組み合わせ。
- status: **`human-reviewed-candidate`**。
  pipeline §4 の定義どおり「人間がレビューしKeep判定。**手仕上げは未/一部**」の段。
  GUI手仕上げ完了（=`hand-final`）はこの段の要件ではない。
- ここから `hand-final` へ上げるには、別途 **人間の GUI 1px 手仕上げ** が必要
  （[human-aseprite-guide](./yui-52px-v2a-human-aseprite-guide.md)）。

## Asset

- before（PF / script-assisted-candidate）: `public/assets/prototypes/yui_idle_52_v2a_pf.png`
- after（HR / human-review-candidate）: `public/assets/prototypes/yui_idle_52_v2a_hr.png`
- after source: `assets/source/prototypes/yui_idle_52_v2a_hr.aseprite`
- review sheet: `public/assets/prototypes/yui_idle_52_v2a_hr_review_sheet.png`
  （before/after 1x・6x・夜街背景・インク斑背景+欠片pickup+hitCore中心点・部位拡大）
- refinement script: `scripts/prototypes/refine-yui-52-v2a-pf.lua`（named-layer 編集）
- recipe: `data/pixel-art/character-recipes/yui.json`

`_pf` は script-assisted baseline として保存（provenance: v2a → _pf → _hr）。

## 実行コマンド

```sh
pnpm aseprite:pixel-refine:yui52hr     # _pf -> _hr（refinement + HR review sheet）
# 内訳:
aseprite -b \
  --script-param input=assets/source/prototypes/yui_idle_52_v2a_pf.aseprite \
  --script-param output=assets/source/prototypes/yui_idle_52_v2a_hr.aseprite \
  --script-param png=public/assets/prototypes/yui_idle_52_v2a_hr.png \
  --script scripts/prototypes/refine-yui-52-v2a-pf.lua
aseprite -b \
  --script-param before=public/assets/prototypes/yui_idle_52_v2a_pf.png \
  --script-param after=public/assets/prototypes/yui_idle_52_v2a_hr.png \
  --script-param png=public/assets/prototypes/yui_idle_52_v2a_hr_review_sheet.png \
  --script scripts/prototypes/build-pixel-finisher-review-sheet.lua
```

## script-assisted refinement で直した箇所（GUI手仕上げではない）

7重点に対する**控えめ・低リスク**な refinement を named layer に適用:

1. **顔・目・口元**: 各目に下まぶた側の副キャッチライト（1px）を追加して表情を生かす。
   口を平らな3pxから**ゆるい微笑み**（端上がり・中央1px下げ）に。
2. **フード幅・左右バランス**: フード fill の左右 extent を face 中心基準で計測。
   今回は実測で左右差<3pxのため**erodeなし（0行）**＝既に対称。過剰な削りはしない。
3. **前髪の毛流れ**: 3房 tuft に HAIR_H ハイライトを足し、左右の房を外側へ傾けて strand 感を付与。
4. **ランタンを握る手**: ナックル位置に soft skin highlight（1px）を足し、握りを丸く読ませる。
5. **ランタン金属質感**: cage 上の lit corner に LAN_CORE の金属 glint（1px）。
6. **頬・首影・顎下**: 頬紅を 4行から **2x2 のソフト核（BLUSH_L）** に縮小・淡色化。首影は1pxのまま。
7. **1x背景分離**: hood rim（左）を保持。erode しないので暗背景分離は維持。

> これらは「絵を機械的に少し整えた」だけ。**かわいさ・人格・手の握り解剖・金属反射・髪の本格的な毛流れは
> 依然 human GUI 手仕上げの領域**として残す（下記）。

## まだ human GUI 手仕上げが必要な点（hand-final へ向けて）

- 目の形・視線・まつ毛の質感（script の副キャッチライトは“生かし”止まり）。
- 口元の人格（微笑みの曲率・口角）。
- 手の指関節・親指・握りの説得力。
- ランタンの金属反射・煙突・映り込み。
- 前髪の房ごとの陰影と毛流れ。
- フード幅の最終的な詰め（今回は対称確認のみ。幅そのものの詰めは人手）。

## Target score

80 / 100（production を狙うライン）

## Current score

PF=82 → **HR=84**（director 主観・100点換算）

| 観点 | PF | HR | 備考 |
| --- | ---: | ---: | --- |
| 1x readability | 4 | 4 | 維持 |
| reference match | 4 | 4 | 固定アイデンティティ維持 |
| charm appeal | 4 | 4 | 副キャッチライト＋頬ソフト化で“生き”が出た |
| mascot silhouette | 4 | 4 | フード対称確認（破壊なし） |
| merchandise potential | 3 | 3 | hand-final 後に再評価 |
| gameplay visibility | 5 | 5 | 維持（rim 保持） |
| background separation | 5 | 5 | 維持 |
| final confidence (hand-final) | 3 | 3 | **GUI手仕上げ未のため据え置き** |

`final confidence (hand-final)` は **3 のまま**。理由は GUI 手仕上げ未実施だから。
一方 **human-review-candidate としての自信は 4**（レビューに出せる品質に達した）。

## Missing points for 80（hand-final 自信＝80+ に足りないもの）

上記「まだ human GUI 手仕上げが必要な点」がそのまま不足点。
script で取れるのはここまで（≈84）。残りは人手でしか埋まらない。

## hitCore / pickup 誤認テスト（review sheet 中段）

- ランタン glow は tight を維持し、hitCore 中心点（マゼンタ）に届かない。✅
- 欠片 pickup（クリーム破れ紙）と glow（暖色）は色・形で区別できる。✅

## Production touched: **no**

- `public/assets/sprites/player/` 未変更
- `assets/source/aseprite/player/` 未変更
- `src/game/domain/constants.ts`（gameplay定数）未変更
- 出力は `assets/source/prototypes/` と `public/assets/prototypes/` のみ
- preview / production への接続なし

## production-candidate に進めるか

- **まだ進めない。** HR は `human-reviewed-candidate` 止まり。
- Target score 80 は満たし得るが、player は humanReviewRequired=true で、production-candidate の前提
  （80点rubric通過 **かつ** 人間GUI手仕上げ）の後者が未実施。
- `final confidence (hand-final)=3` のため candidate にしない。

## Keep / Discard

- **Keep**: `_hr` を「人間GUI手仕上げの出発点（human-reviewed-candidate）」として採用。
  refinement script / HR review sheet / recipe も keep。`_pf` も baseline として keep。
- **Discard**: なし。HR を hand-final / GUI hand-finish と称する運用は discard（禁止）。

## Final decision

**iterate（`human-reviewed-candidate` として Keep。次は人間GUI手仕上げで hand-final を目指す）。**
production 反映は今回しない。player のため次工程は人間GUI手仕上げ必須。
