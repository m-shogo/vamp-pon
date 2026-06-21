<!-- Vamp Pon PR テンプレート -->

## 概要

<!-- 何を・なぜ変えたか -->

## 種別

- [ ] コード / ロジック
- [ ] player sprite の promotion（production 反映）
- [ ] pixel-art draft / prototype（production 非反映）
- [ ] docs / 設計
- [ ] その他

---

## player sprite を production へ反映する PR の場合（必須）

production player asset
（`public/assets/sprites/player/*.png` / `assets/source/aseprite/player/*.aseprite`）
を変更する場合は、以下を **すべて** 満たすこと。
未達なら production を変更しない（draft branch に留める）。

- [ ] Aseprite GUI で 1px 手仕上げ済み（script bootstrap のままでない）
- [ ] `data/player-asset-promotion.json` を更新（status を `production-candidate`/`final-candidate`、証跡を記入）
- [ ] 必須 quality gate がすべて >= 4
      （1x readability / reference match / charm / mascot silhouette / merchandise / gameplay visibility / background separation）
- [ ] review md（before/after・採点）あり → `reviewDoc` に記入
- [ ] before/after 比較画像あり → `beforeAfterImage` に記入
- [ ] combat mock 確認あり
- [ ] public PNG は source から export（直接編集していない）→ `exportCommand` に記入
- [ ] commit message と実態が一致（「手仕上げ」と書くなら手仕上げ済み）
- [ ] `pnpm assets:check-player-promotion` が pass

参照: [docs/player/player-asset-promotion-policy.md](../docs/player/player-asset-promotion-policy.md) /
[docs/reviews/yui-next-production-readiness-plan.md](../docs/reviews/yui-next-production-readiness-plan.md) /
[bad example: c10e6c0](../docs/reviews/bad-examples/c10e6c0-yui-idle-failed-promotion.md)

---

## 確認

- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `pnpm assets:verify`（asset を変更した場合）
- [ ] `pnpm assets:check-player-promotion`（player asset を変更した場合）

## 触っていないことの確認（該当する場合）

- [ ] gameplay 定数（radius / visualSize / hp / moveSpeed / invulnSec / pickup magnet / hitCore / debugHitCircle）
- [ ] move / hurt / ultimate sprite
- [ ] background / enemy assets
