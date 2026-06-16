# Review: Yui 52px V2a — Procedural Finish (PF)

date: 2026-06-16
reviewer: pixel-art director pass（prototype review）
prev review (v2): [yui-52px-master-v2-review.md](./yui-52px-master-v2-review.md)
pipeline: [docs/pixel-art/vamp-pon-pixel-art-pipeline-v1.md](../../pixel-art/vamp-pon-pixel-art-pipeline-v1.md)

Design role: pixel-art director / pro app quality gate
iteration history: A/B/C → v2 合成（V2a/V2b/V2c）→ **V2a に procedural finish（PF）を適用**
next（human review）: [yui-52px-v2a-human-review-candidate.md](./yui-52px-v2a-human-review-candidate.md)

> このdocは PF（script-assisted）段の記録。PF を出発点に script-assisted refinement（pass 2）＋
> ディレクター人間レビューを行った次段（`human-reviewed-candidate`）は上記 next doc を参照。

---

## これは何か（最重要・最初に明記）

- これは **hand-final ではない。**
- これは **GUI hand-finish ではない。** 人間が Aseprite で 1px を手で動かしていない。
- これは **`procedural-finished` / `script-assisted-candidate`** である。
  ([pipeline doc](../../pixel-art/vamp-pon-pixel-art-pipeline-v1.md) §1, §4)
- player（ユイ）は **humanReviewRequired = true**。点数に関係なく、
  人間の GUI 手仕上げ + 人間レビューを通さない限り production には上げない。

## Asset

- before: `public/assets/prototypes/yui_idle_52_v2a.png`（V2a prototype）
- after : `public/assets/prototypes/yui_idle_52_v2a_pf.png`（procedural finish）
- after source: `assets/source/prototypes/yui_idle_52_v2a_pf.aseprite`
- review sheet: `public/assets/prototypes/yui_idle_52_v2a_pf_review_sheet.png`
  （before/after 1x・before/after 6x・夜街背景・インク斑背景+欠片pickup+hitCore中心点・部位拡大）
- finisher: `scripts/aseprite/vamp-pon-pixel-finisher.lua`（mode=yui52-v2a, layer-aware）
- review sheet generator: `scripts/prototypes/build-pixel-finisher-review-sheet.lua`
- recipe: `data/pixel-art/character-recipes/yui.json`

status: **script-assisted-candidate**（PF適用済み。GUI手仕上げ未実施）

## 実行コマンド

```sh
pnpm aseprite:pixel-finisher:yui52     # V2a -> V2a_pf を生成
pnpm aseprite:pixel-finisher:verify    # _pf 出力の存在確認
# review sheet:
aseprite -b \
  --script-param png=public/assets/prototypes/yui_idle_52_v2a_pf_review_sheet.png \
  --script scripts/prototypes/build-pixel-finisher-review-sheet.lua
```

## 適用した仕上げパス一覧（mode=yui52-v2a）

V2a の named layer（hood / hair / eyes / lantern / glow …）に直接適用:

1. フード左右を1px締める（crown rows 6–22。アウトライン＋rim を1px内側へ移動）
2. top sheen を3pxクラスタ化（散った HOOD_B を集約）
3. 目の白ハイライトを1px clean dot 化
4. 下まぶた1px
5. 前髪を3房化（forehead に hair tuft を新レイヤーで追加）
6. 手に指（finger groove ×2）
7. handle 接続（手→ランタンを4pxブリッジ）
8. 袖陰影（DRESS_SH underside 8px）
9. ランタン暖色リム（lit edge 4px）
10. glow 最外周弱化（28px を 50% alpha に）
11. 顎下首影（SKIN_SH 6px）
12. リムライト整理（buried inner rim のみ。1px edge は保持）

> 注: 11 のうち「lantern warm rim」「fringe」は当初 0px no-op だったが、合成後ではなく
> **named layer** に対して処理する方式へ修正し、実効化した（透明/glowブレンドの誤判定を回避）。

## Target score

80 / 100（hand-final / production を狙うライン。PF 単体ではここに到達させない設計）

## Current score

V2a=80 → **V2a_pf=82**（director 主観・100点換算）

| 観点 | V2a | V2a_pf | 備考 |
| --- | ---: | ---: | --- |
| 1x readability | 4 | 4 | 目のhighlightが1px化し締まった |
| reference match | 4 | 4 | 青フード/茶赤前髪/右手ランタン 維持 |
| charm appeal | 4 | 4 | 前髪3房・下まぶたで表情が出た |
| mascot silhouette | 4 | 4 | フード1px締めで「布感」前進、まだ気持ち大きい |
| merchandise potential | 3 | 3 | グッズ化はGUI手仕上げ後に再評価 |
| gameplay visibility | 4 | 5 | glow最外周弱化＋rim保持で暗背景視認↑ |
| background separation | 4 | 5 | hood rim を1px内側へ保持し分離維持 |
| final confidence | 3 | 3 | **script-assisted のため据え置き（意図通り）** |

`final confidence` が 3 のままなのは **GUI手仕上げ未実施**だから。点数が上がっても
`hand-final` / `final-candidate` には**しない**。

## Missing points for 80（hand-final 自信＝80+ に足りないもの）

PF はベースラインを底上げしたが、人間の手でないと埋まらない点が残る:

- フード幅は1px締めたが、左右の曲率・厚みの微調整は人手向き。
- 前髪3房は tuft を置いただけで、毛流れ・房ごとの陰影は未調整。
- 手の指は groove のみ。指関節・握りの説得力は手仕上げ領域。
- ランタンの金属ハイライト/映り込み、煙突の質感は未着手。
- 口元・頬の最終バランス、まつ毛の質感。

→ これらは **A ルート（人間GUI手仕上げ）** で詰める。

## 各品質ゲート（self-eval）

- 1x readability: ◎（review sheet 1x で役割・表情が読める）
- reference match: ◎（固定アイデンティティ維持）
- charm appeal: ○
- mascot silhouette: ○（フードまだ気持ち大）
- merchandise potential: △（手仕上げ後に再評価）
- gameplay visibility: ◎（インク斑背景でも沈まない）
- background separation: ◎（rim 保持で分離）
- final confidence: △（script-assisted 据え置き）

## hitCore / pickup 誤認テスト（review sheet 中段）

- ランタン glow は tight を維持し、hitCore 中心点（マゼンタ）に届かない。✅
- 欠片 pickup（クリーム破れ紙）と glow（暖色）は色・形で明確に区別できる。✅

## Production touched: **no**

- `public/assets/sprites/player/` 未変更
- `assets/source/aseprite/player/` 未変更
- `src/game/domain/constants.ts`（gameplay定数）未変更
- 出力は `assets/source/prototypes/` と `public/assets/prototypes/` のみ
- preview / production への接続なし

## production-candidate に進めるか

- **まだ進めない。** PF は `script-assisted-candidate` 止まり。
- player は humanReviewRequired=true。production-candidate へ上げる前提（pipeline §5）は
  「80点rubric通過 **かつ** 人間GUI手仕上げ + 人間レビュー」。後者が未実施。
- Target score 80 は満たし得るが、**自信(final confidence)が3**である以上 candidate にしない。

## まだ足りない点 / 人間レビューが必要か

- **人間レビュー: 必要（player）。** 上記「Missing points」をGUIで詰める。
- 次点: フード幅、前髪の毛流れ、手の握り、ランタン質感。

## Keep / Discard

- **Keep**: V2a_pf を「人間GUI手仕上げの新しい出発点」として採用。finisher / review sheet / recipe も keep。
- **Discard**: なし（V2a 原本も比較用に残す）。PF を hand-final と称する運用は discard（禁止）。

## Final decision

**iterate（script-assisted-candidate として keep、次は人間GUI手仕上げ）。**
production 反映は今回しない。player のため次工程は A ルート（人間）必須。
