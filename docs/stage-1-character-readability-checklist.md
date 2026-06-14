# Stage 1 character readability checklist

スマホ縦画面でユイが読めるかを確認するためのチェックリスト。
判定仕様は [hitbox-policy.md](hitbox-policy.md) を正とし、キャラ改善と collision 変更を混ぜない。

## ユイ

- [ ] `/?scene=visual-gallery` で 32〜36px の範囲の見た目が成立している。
- [ ] `/?scene=visual-gallery` で小さいフードが背景から分離している。
- [ ] `/?scene=visual-gallery` で古紙色の服がドロップや紙片敵と混ざりすぎない。
- [ ] `/?scene=visual-gallery` で小さいランタンが弾や欠片に見えすぎない。
- [ ] `/?scene=visual-gallery` で1px 縁取りが夜背景から浮く。
- [ ] `/?scene=combat-mock&density=late` で中心 `hitCore` が常時見える。
- [ ] `/?debug=true` または `/?scene=visual-gallery` で `debugHitCircle` が半径6の確認用として読める。
- [ ] `yui_move` が横/斜め移動の入口として姿勢崩れしない。

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

## 実行コマンド

```sh
pnpm test
pnpm build
```

## 未確認として残すもの

- 実機スマホの縦持ち表示。
- Aseprite source から hand-final 候補を書き出した後の比較。
- 8分通しプレイの後半視認性。
