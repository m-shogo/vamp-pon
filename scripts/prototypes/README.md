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

## 確認コマンド

```sh
pnpm prototype:verify        # prototype画像/source/review doc 存在 + production未変更チェック
pnpm design:review:verify    # review doc の構造（score / Keep / Discard / Final decision 等）
git diff --stat HEAD -- public/assets/sprites/player assets/source/aseprite/player
                             #   ↑ 空であること（production sprite/source 未変更）
```

review: [docs/reviews/design-team/yui-52px-master-v2-review.md](../../docs/reviews/design-team/yui-52px-master-v2-review.md)
