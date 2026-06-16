# scripts/prototypes

ユイ 52px master の **prototype** 専用ジェネレータ。production 素材ではない。

> **2つのルートを分離する**（[pipeline doc](../../docs/pixel-art/vamp-pon-pixel-art-pipeline-v1.md)）:
> - **人間ルート（A）**: player / 主役級の GUI 手仕上げと**最終レビュー**。これだけが `hand-final` を名乗れる。
> - **procedural ルート（B）**: `vamp-pon-pixel-finisher.lua` による量産・基礎品質底上げ。産物は
>   `script-assisted-candidate` 止まり。**hand-final / GUI hand-finish ではない。**
> - **production 昇格は別**（pipeline §5）。本ディレクトリの生成物で production を触らない。

すべて Lua 図形 bootstrap であり、`final-candidate` / `hand-final` / `final` には**しない**
（[docs/pixel-art-quality-gate.md](../../docs/pixel-art-quality-gate.md)）。
production 反映は GUI手仕上げ＋80点rubric通過の**後のみ**検討する。

## 出力先（書き込みガードあり）

- source: `assets/source/prototypes/`（`.aseprite`）
- png: `public/assets/prototypes/`（`.png`）
- production の `public/assets/sprites/player/` と `assets/source/aseprite/player/` には**書き込まない**。

## 生成コマンド

Aseprite CLI が必要（`pnpm aseprite:check` でパス確認 / `ASEPRITE_BIN` で上書き可）。

```sh
ASE="$(pnpm -s aseprite:check >/dev/null; echo "${ASEPRITE_BIN:-aseprite}")"

# v2 master prototype（V2a / V2b / V2c）
for v in V2a V2b V2c; do
  lv=$(echo "$v" | tr 'A-Z' 'a-z')
  "$ASE" -b \
    --script-param variant=$v \
    --script-param out=assets/source/prototypes/yui_idle_52_${lv}.aseprite \
    --script-param png=public/assets/prototypes/yui_idle_52_${lv}.png \
    --script scripts/prototypes/build-yui-52-v2.lua
done

# v2 review sheet（1x / 6x夜背景 / インク斑 + 欠片pickup + hitCore中心点 / 旧A/B/C比較）
"$ASE" -b \
  --script-param png=public/assets/prototypes/yui_idle_52_v2_review_sheet.png \
  --script scripts/prototypes/build-yui-52-v2-review-sheet.lua
```

旧 A/B/C 版は `build-yui-52-master.lua` / `build-yui-52-review-sheet.lua`。

## procedural finish（PF / script-assisted route B）

V2a に定型仕上げパスを機械適用して `_pf` を作る。**hand-final ではない**（pipeline §1）。

```sh
pnpm aseprite:pixel-finisher:yui52     # V2a -> V2a_pf（source + png）
pnpm aseprite:pixel-finisher:verify    # _pf 出力の存在確認

# PF review sheet（before/after 1x・6x・夜背景・インク斑+欠片+hitCore・部位拡大）
"$ASE" -b \
  --script-param png=public/assets/prototypes/yui_idle_52_v2a_pf_review_sheet.png \
  --script scripts/prototypes/build-pixel-finisher-review-sheet.lua
```

- finisher: `scripts/aseprite/vamp-pon-pixel-finisher.lua`（mode=yui52-v2a, named-layer 編集）
- review: [yui-52px-v2a-procedural-finish-review.md](../../docs/reviews/design-team/yui-52px-v2a-procedural-finish-review.md)
- 出力は `assets/source/prototypes/` / `public/assets/prototypes/` のみ（production 書き込み拒否）。
- player（ユイ）は humanReviewRequired=true。PF 後も**人間GUI手仕上げ + 人間レビュー**を経ない限り production に上げない。

### human-review-candidate（HR / script-assisted refinement pass 2 + 人間レビュー）

PF を出発点に控えめな refinement を当て、**人間レビューに提出**する段。**GUI手仕上げではない**。

```sh
pnpm aseprite:pixel-refine:yui52hr     # _pf -> _hr（refinement + HR review sheet）
```

- refinement: `scripts/prototypes/refine-yui-52-v2a-pf.lua`（_pf 保存・_hr 新規。provenance: v2a→_pf→_hr）
- review: [yui-52px-v2a-human-review-candidate.md](../../docs/reviews/design-team/yui-52px-v2a-human-review-candidate.md)
- status は **`human-reviewed-candidate` 止まり**（手仕上げ未/一部）。`hand-final` にはしない。
  `hand-final` には**人間の GUI 1px 手仕上げ**が必要。

## 運用ルール（prototype作業時）

- **prototype作業中は production を触らない。**
  `public/assets/sprites/player/` と `assets/source/aseprite/player/`、および gameplay定数
  （`src/game/domain/constants.ts` の PLAYER_DEFAULTS / visualSize / radius / hitCore 等）は変更禁止。
- **V2a は `prototype-pass` であり `production-candidate` ではない。** V2b/V2c は `iterate`。
- production-candidate の検討は **GUI手仕上げ後のみ**
  （[handoff](../../docs/reviews/design-team/yui-52px-v2a-gui-handfinish-handoff.md) の昇格条件を全て満たした時）。
- Lua再生成しただけのものを final / hand-final / production-candidate と呼ばない。

## 確認コマンドの使い分け

```sh
pnpm pixel-art:pipeline:verify # pipeline一式(doc/schema/recipe/finisher/extension/PF出力/review)+ production未変更
pnpm prototype:verify         # prototype画像/source/review doc が存在し、production未変更か
pnpm design:review:verify     # review doc の構造（Current/Target score・Keep・Discard・Final decision 等）
pnpm player:protected:verify  # production player assets / gameplay定数を触っていないか
                              #   - working tree の変更 → 失敗（exit 1）
                              #   - 直近commit(HEAD~1..HEAD)の変更 → 警告表示（検出用）
git diff --stat HEAD -- public/assets/sprites/player assets/source/aseprite/player src/game/domain/constants.ts
                              #   ↑ 空であること（production sprite/source/定数 未変更）
```

| コマンド | 守る対象 | 失敗条件 |
| --- | --- | --- |
| `prototype:verify` | prototype成果物の存在 + 作業ツリーの production 非変更 | 画像/doc欠落 or production変更 |
| `design:review:verify` | review doc の体裁・production-candidate の根拠 | 必須セクション欠落 / 80未満でcandidate |
| `player:protected:verify` | production player資産・gameplay定数の非変更 | 作業ツリーが protected path を変更 |

review: [docs/reviews/design-team/yui-52px-master-v2-review.md](../../docs/reviews/design-team/yui-52px-master-v2-review.md)
handoff: [docs/reviews/design-team/yui-52px-v2a-gui-handfinish-handoff.md](../../docs/reviews/design-team/yui-52px-v2a-gui-handfinish-handoff.md)
human GUI guide: [docs/reviews/design-team/yui-52px-v2a-human-aseprite-guide.md](../../docs/reviews/design-team/yui-52px-v2a-human-aseprite-guide.md)
（GUI手仕上げは人間がAsepriteで実施。AI/CLI生成だけでは hand-final / production-candidate にしない）
