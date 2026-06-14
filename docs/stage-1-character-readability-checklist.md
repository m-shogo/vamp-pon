# Stage 1 character readability checklist

スマホ縦画面でユイが読めるかを確認するためのチェックリスト。
判定仕様は [hitbox-policy.md](hitbox-policy.md) を正とし、キャラ改善と collision 変更を混ぜない。

## ユイ

- [ ] 32〜36px の範囲で見た目が成立している。
- [ ] 小さいフードが背景から分離している。
- [ ] 古紙色の服がドロップや紙片敵と混ざりすぎない。
- [ ] 小さいランタンが弾や欠片に見えすぎない。
- [ ] 1px 縁取りで夜背景から浮く。
- [ ] 中心 `hitCore` が常時見える。
- [ ] `?debug=true` の `debugHitCircle` が半径6の確認用として読める。
- [ ] 横/斜め移動でも姿勢が崩れない。

## 周辺要素との距離

- [ ] 黒インク敵とユイの外形が混ざらない。
- [ ] 記憶の欠片とランタンが誤認されすぎない。
- [ ] 回復/カプセルとユイの服色が近すぎない。
- [ ] 通常弾とユイのランタンが重なっても判別できる。

## 判定仕様

- [ ] `PLAYER_DEFAULTS.radius` は `6`。
- [ ] `PLAYER_DEFAULTS.visualSize` は `36`。
- [ ] `hitCore` と `debugHitCircle` は別オブジェクト。
- [ ] キャラ素材更新で collision を変更していない。
