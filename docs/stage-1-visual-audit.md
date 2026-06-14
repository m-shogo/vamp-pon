# Stage 1 visual audit

対象は Stage 1 Vertical Slice のスマホ縦画面。現時点では実装と既存ギャラリーを前提にした監査であり、長時間実機プレイは未確認。

| 項目 | 状態 | メモ |
| --- | --- | --- |
| ユイが背景に埋もれないか | 弱い | generated-draft は改善したが、hand-final の手仕上げ前。 |
| hitCore が見えるか | OK | 通常時に小さい暖色点を常時表示する仕様。 |
| debugHitCircle が邪魔ではないか | 未確認 | `/?debug=true` と `/?scene=combat-mock&density=late` で確認する。実機確認は未実施。 |
| 敵の黒インク影が読めるか | OK | 6種が image 化済み。haze は薄さの再確認が必要。 |
| 欠片/回復/カプセルが背景と被らないか | OK | 背面影/黒縁/pulse の改善済み。 |
| 弾が敵/ドロップと誤認されないか | 弱い | ランタン/星/欠片系は密集時の目視確認が必要。 |
| レベルアップカードが読みやすいか | OK | UIカード差分は image 化済み。 |
| 8分プレイ想定でごちゃつかないか | 未確認 | `/?scene=combat-mock&density=late` は入口。通しプレイ確認は未実施。 |

## 次に直すべき

1. ユイ idle/move の hand-final 手仕上げ。
2. ランタン、hitCore、欠片の色差の実機確認。
3. 8分相当の敵/弾/ドロップ密度を `/?scene=combat-mock&density=late` で確認し、結果を追記する。

## 確認URL

- `/?scene=yui-gallery`
- `/?scene=visual-gallery`
- `/?scene=asset-status`
- `/?scene=combat-mock&density=early`
- `/?scene=combat-mock&density=mid`
- `/?scene=combat-mock&density=late`

## 確認コマンド

```sh
pnpm generate:pixel-assets
pnpm assets:verify
pnpm test
pnpm build
```

## Aseprite状態

- Aseprite production export は stable v1.3.17.1 を対象にする。
- beta v1.3.18-beta2 は本番exportに使わない。
- ユイ4ポーズはまだ generated-draft。
- `.aseprite` source が無いものは source-missing として扱う。
