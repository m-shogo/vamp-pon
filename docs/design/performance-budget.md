# パフォーマンス予算

## 基準

- 基準ビューポート: 390 x 844
- 理想: 60fps
- 目標: 55fps以上
- 改善対象: 50fps未満
- NG: 40fps以下

## Runtime caps

- enemies: soft 118 / hard 140 を基準に、時間帯と低スペック設定で調整する
- projectiles: 140
- pickups: 250
- particles: 130
- damage numbers: 28

`src/game/config/GameFeelConfig.ts` を調整の起点にする。Stage1では常時3倍ではなく、0-60秒は1.5倍、60-180秒は2倍、180-420秒は2.5倍、終盤ラッシュのみ3倍を上限にする。

## 低スペック時に削るもの

1. particles を約半分にする
2. maxEnemies を 0.72 倍にする
3. damage numbers を非表示にする
4. screen shake を切れるようにする
5. 常時発生する環境演出より、hit / death / exp / levelUp の短い反応を優先する

## Atlas化候補

- hit / death / exp collect の短命粒子
- 回復ドロップ
- 進化リング
- 敵spawn予兆
- ボス警告UI

## Capacitor化時の注意

- 初回タップで audio unlock する
- localStorage が失敗してもゲームを止めない
- 端末が重い場合は lowSpecMode を起動時に選べる導線を用意する
- particleQuality / damageNumbers / screenShake は設定画面から変更可能にする
- 実機では 390 x 844 と近い縦長端末で、敵数上限到達時の入力遅延を確認する
