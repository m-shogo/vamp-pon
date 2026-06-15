# Yui Idle v6 Draft Review

## Status

temporary candidate / draft

> final-candidate でも hand-final candidate でもない。
> GUI 手仕上げ前の script source-prep draft。

---

## Production impact

- production source changed: no （`assets/source/aseprite/player/yui_idle.aseprite` 未変更）
- production png changed: no （`public/assets/sprites/player/yui_idle_42.png` 未変更）
- gameplay constants changed: no （radius / visualSize / hp / moveSpeed / invulnSec / pickup magnet / hitCore / debugHitCircle すべて未変更）
- move / hurt / ultimate: 未変更

---

## Before / After

- before: `public/assets/sprites/player/yui_idle_42.png`（= 現 production の v5「青いキノコ」）
- after: `public/assets/sprites/player/prototypes/yui_idle_v6_candidate.png`（v6 draft、production非反映）
- comparison: `docs/reviews/images/yui_idle_v5_vs_v6.png`（左=before / 右=after、暗背景5x）
- dark background check: `public/assets/sprites/player/prototypes/yui_idle_v6_dark.png`
- source: `assets/source/aseprite/player/prototypes/yui_idle_v6_candidate.aseprite`（11レイヤー）
- build script: `scripts/aseprite/build-yui-idle-v6-candidate.lua`

---

## Improvements

- フード: 巨大な青ベタ塊 → 顔を囲む控えめなドレープフード（上左ハイライト / 下右クレセント陰影 / 内側ライニング影）
- 胴体: 脚なしの三角形 → cloak ドレープ + エプロン服 + 赤いヘム帯 + 見える脚 + ダークブーツ
- ランタン: 浮遊 → 右腕・手につながった保持。ケージ枠 + 暖色コア + 淡い glow
- 顔: のっぺり → 前髪の束感 / キャッチライト入りの目 / 頬 / 口を整理
- 階調: 平坦 → soft painterly 寄りの多段トーン

---

## Still weak

- charm / appeal: 3。before から大幅向上だが、ランタン腕付け根・左 cloak の塊感・服の腕付け根が荒い。
- style consistency: 3。方向性は art-direction に一致するが、GUI 手仕上げ未済で質が未達。他素材（敵・背景）は未更新。
- GUI hand-finish: 未実施。headless CLI 環境のため、Aseprite GUI 上での 1px 手仕上げができていない。これが charm 3→4 の最大の未解決点。
- combat mock: `/?scene=combat-mock&density=late` 未実施（dev server + ブラウザが必要、かつ候補は production 非反映のため gallery に出ない）。暗背景合成で代替確認のみ。

---

## Quality Gate

| Item | Score | Notes |
| --- | ---: | --- |
| 1x readability | 4 | フード + クリーム胴体 + ランタンで主人公と判別可。目は 1x で小さめ |
| reference match | 4 | ドレープフード / cloak / エプロン服 / ヘム / 脚靴 / 保持ランタンが揃った |
| charm / appeal | 3 | before から大幅向上。ランタン腕・左 cloak・服の腕付け根が荒く GUI 手仕上げ前で 4 未満 |
| gameplay visibility | 4 | 暗背景で分離。中央 hitCore と混ざらない位置 |
| background separation | 4 | クリーム + 青が暗背景で読める |
| style consistency | 3 | 方向性一致だが手仕上げ未済で質が未達 |
| final confidence | 3 | GUI 未仕上げのため final ではない |

---

## Decision

Not final.
Not production.
Keep as reviewable prototype.

---

## Next step

Open the `.aseprite` prototype in Aseprite GUI and hand-finish:

- eyes / catchlight
- bangs
- cheeks
- mouth
- hood roundness
- cloak folds
- dress thickness
- lantern handle and cage

charm / appeal ≥ 4 かつ quality gate 全項目 ≥ 4 になってから、初めて production source へ反映 → `pnpm aseprite:export:yui` → `/?scene=yui-gallery` `/?scene=combat-mock&density=late` 確認。
