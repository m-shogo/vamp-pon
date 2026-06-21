# Stage 1 character readability checklist

スマホ縦画面でユイが読めるかを確認するためのチェックリスト。
判定仕様は [hitbox-policy.md](hitbox-policy.md) を正とし、キャラ改善と collision 変更を混ぜない。

## ユイ

- [ ] `/?scene=yui-gallery` でユイ4ポーズの1xと4xを確認する。
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
- [ ] `PLAYER_DEFAULTS.visualSize` は42px本番候補として `42`。
- [ ] `hitCore` と `debugHitCircle` は別オブジェクト。
- [ ] キャラ素材更新で collision を変更していない。

## 実行コマンド

```sh
pnpm aseprite:check
pnpm aseprite:export:yui
pnpm assets:verify
pnpm test
pnpm build
```

## 未確認として残すもの

- 実機スマホの縦持ち表示。
- 8分通しプレイの後半視認性。

## 2026-06-15 ユイ42pxレビュー記録

- `yui_idle` は参照絵準拠で、顔・丸い青フード・茶赤髪・古紙色ワンピ・右手側cageランタンの優先度を上げた。
- `yui_move` / `yui_hurt` / `yui_ultimate` は idle と同じ生成元・同じライティングから展開し、別人化しないことを優先した。
- 1x実寸では、顔とフードが先に読める状態を目標にした。
- 4x拡大では、目の白ハイライト、前髪、cageランタンの縦バーが濁っていないかを見る。
- 暗背景では、金リムと明るい前身頃で黒インク敵から分離するかを見る。
- combat-mock late density では、ランタン・記憶の欠片・中央hitCoreが誤認されすぎないかを見る。
- 実機スマホ確認は未実施。ローカルブラウザ確認と実機確認は分けて記録する。

## Aseprite境界

- production export は stable v1.3.17.x を使う。
- beta v1.3.18-beta2 は使わない。
- 現在のユイ4ポーズは42pxネイティブ hand-final candidate。
- hand-final 化は idle → move → hurt → ultimate の順。
