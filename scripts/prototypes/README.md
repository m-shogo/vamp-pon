# scripts/prototypes

ユイ 52px master の **prototype** 専用ジェネレータ。production 素材ではない。

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
