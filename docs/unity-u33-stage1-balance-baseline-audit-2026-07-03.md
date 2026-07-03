# Unity U33 Stage1 Balance Baseline Audit

## Baseline

| 項目 | 現在値 | 体験意図 | 問題になりそうな点 | U33対応 |
| --- | --- | --- | --- | --- |
| player HP | 100 | 初回で即死しにくい | 実機操作で接触が増える可能性 | 変更しない |
| player move speed | 4.4 | 縦画面で避けやすい | 実機指操作はNOT_MEASURED | 変更しない |
| weapon cooldown | 900ms | U31で攻撃感を改善 | まだ序盤が薄い可能性 | 880msへ |
| weapon damage | 12 | 敵を硬くしすぎない | first pickupまでが少し遅い | 13へ |
| enemy HP | draft bucket | 低HPの群れ前提 | 実装上bucket詳細は未分化 | damage側で軽く改善 |
| enemy speed | draft bucket | 読める接近 | 実機未測定 | 変更しない |
| enemy contact damage | 5/6/7/8.5/10/12 | 終盤ほど圧 | 中盤以降が痛すぎる可能性 | 4〜7分を8/9.5に軽減 |
| spawn cadence | 2.6/2.1/1.85/1.45/1.2/0.95 | 徐々に密度上昇 | first 30 secondsと2分が薄い | 2.45/2.0/1.75/1.4/1.15/0.95 |
| max enemy cap | 7/12/18/26/32/38 | U29上限内 | 2〜6分が少し平ら | 8/13/20/27/34/38 |
| projectile cap | 24 | U29 cap | 実機未測定 | 変更しない |
| pickup cap | 48 | U29 cap | pickup多発時の視認性 | 変更しない |
| XP value | 2 opening / 3 after | 序盤は控えめ | Lv2が遅れる可能性 | threshold側で改善 |
| XP curve | 0/8/20/38/62/92/130/176 | Lv5まで段階的 | Lv5まで虚無に感じる可能性 | 0/7/18/34/56/84/120/162 |
| LevelUp timing | target 30s | 早めに選択 | 30〜45秒保証は未測定 | 改善 |
| drop rate | XP 0.88 | XP pickup中心 | pickup感が薄い可能性 | 0.9へ |
| heal drop rate | 0.045 | ありがたいが出すぎない | 緊張が消える可能性 | 0.04へ |
| rare rate | 0.035 | 少し特別 | Stage1で薄すぎる可能性 | 0.04へ |
| evolution threshold | 210s / weapon Lv5 / passive / material | 中盤以降の目標 | テスト到達が少し遠い | earliest 195s |
| Kokuyou gain | damage taken draft | 被弾で到達 | Readyが遠い可能性 | ready 330s |
| Kokuyou duration | 12s | 特別だが短い | 連発防止 | 変更しない |
| Kokuyou cooldown | 45s | 連発不可 | 実機未測定 | 変更しない |
| clear condition | 480s | 8分 clear | 本番balance未確定 | 変更しない |
| defeat condition | HP <= 0 | 明快 | 接触頻度未測定 | 変更しない |
| reward draft | U27 draft | 勝敗どちらも進む | 経済バランス未確定 | 変更しない |

## U35実機確認が必要な項目

FPS、memory、thermal、GC allocation、draw call、操作感、30〜45秒Lv2率、2分Lv3〜Lv4率、clear率、pickup / heal / rare出現体感、audio latency、haptic device behavior。
