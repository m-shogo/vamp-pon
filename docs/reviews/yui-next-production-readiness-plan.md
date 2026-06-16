# ユイ idle 次回 Production Readiness Plan

この文書は、ユイ idle を **次に production へ反映してよい条件** を固定するもの。

背景: c10e6c0 で temporary candidate（GUI未仕上げ・charm低）を production に入れて「青いキノコ」化し、279bbfa で戻した。
同じ失敗を繰り返さないため、production 反映は以下を **全て** 満たした時だけ許可する。

関連:
- [../player/yui-52px-master-design.md](../player/yui-52px-master-design.md)
- [../player/yui-merchandise-character-checklist.md](../player/yui-merchandise-character-checklist.md)
- [../player/yui-aseprite-gui-handoff.md](../player/yui-aseprite-gui-handoff.md)
- [yui-idle-production-revert-note.md](yui-idle-production-revert-note.md)

---

## 1. Production 反映の必須条件（全て満たすこと）

### A. 品質スコア（全て >= 4）

| Item | 必須 | 出典 |
| --- | ---: | --- |
| charm / appeal | >= 4 | quality-gate / merchandise |
| mascot silhouette | >= 4 | merchandise #1 |
| merchandise potential | >= 4 | merchandise #8 |
| reference match | >= 4 | quality-gate |
| 1x readability | >= 4 | quality-gate |
| gameplay visibility | >= 4 | quality-gate |
| dark background separation | >= 4 | quality-gate |

> 1項目でも 4 未満なら production 更新禁止。temporary / draft 据え置き。

### B. 工程条件（全て done）

- [ ] Aseprite GUI で 1px 手仕上げ済み（script bootstrap のままでない）
- [ ] before / after 比較画像あり（既存42px production と並べる）
- [ ] combat mock 確認あり（`/?scene=combat-mock&density=late` 等の実戦密度画面）
- [ ] 1x / 4x / 暗背景 の確認あり
- [ ] public PNG は source から export（直接編集なし）
- [ ] commit message と実態が一致している（「手仕上げ」と書くなら手仕上げ済み）

---

## 2. 反映してよい/だめの判定表

| 状態 | production反映 |
| --- | --- |
| Aで1つでも4未満 | ❌ 禁止 |
| Bのチェックが1つでも未完 | ❌ 禁止 |
| script bootstrapのまま | ❌ 禁止 |
| GUI手仕上げ未実施 | ❌ 禁止（draft据え置き） |
| A全て>=4 かつ B全てdone | ✅ 反映可（サイズ運用を決めてから） |

---

## 3. 反映前に決めること（サイズ運用）

A/B を満たした後でも、いきなり上書きしない。以下を決めてから反映する。

1. gameplay 表示サイズ（52px採用 / 48px / 42px縮小master のどれか）
   - 参照: [../player/yui-52px-master-design.md](../player/yui-52px-master-design.md) §6
2. gameplay定数への影響有無（原則、見た目反映と gameplay定数変更は分離する）
   - `radius` / `visualSize` / `hp` / `moveSpeed` / `invulnSec` / pickup magnet / `hitCore` / `debugHitCircle` は別タスク
3. assetManifest / collision の整合（既存42px前提と矛盾しないか）

---

## 4. 反映手順（条件達成後）

1. GUI手仕上げ済み source を prototype から確定。
2. before/after・combat mock・暗背景の確認成果物を docs/reviews に残す。
3. merchandise checklist と quality gate の採点を残す（全て>=4を明記）。
4. サイズ運用を決定（§3）。
5. source → export で production PNG を更新。public PNG 直接編集はしない。
6. `pnpm assets:verify` / `pnpm test` / `pnpm build` を通す。
7. production への commit は、実態（GUI手仕上げ済み）と一致した message で行う。

---

## 5. 現状（このplan作成時点）

- production: `yui_idle_42.png` は v5 反映前（279bbfa で復元済み）。完成品ではない。
- draft: `art/yui-idle-v6-draft`（42px改善）、`art/yui-idle-52-draft`（52px master draft）が review 可能な状態。
- 次の本命: 52px master を GUI 手仕上げ → 本planのゲート通過 → サイズ運用決定 → production反映。

**このゲートを満たすまで、ユイ idle の production は更新しない。**
