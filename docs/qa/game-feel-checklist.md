# Game Feel QA Checklist

## 30秒

- 30秒以内に楽しい出来事がある
- 初回の敵撃破が分かる
- hit / death / exp collect が0.1秒以内に返る
- 音素材がなくてもエラーにならない

## 1分

- 1分以内にLvUpする
- EXPが吸われる瞬間が気持ちいい
- EXPバーが急に飛ばず、伸びたことが分かる
- LvUpカードが390 x 844ではみ出さない

## 敵密度

- 序盤は現在比1.5倍程度
- 中盤は2倍程度
- 後半は2.5倍程度
- ラッシュ以外で常時3倍になっていない
- 四方同時即包囲が起きない
- プレイヤーが常に見える

## 被弾と回復

- 被弾した理由が分かる
- 被弾時に赤フラッシュと短い揺れがある
- 回復は強すぎない
- HP満タン時に回復を無駄に拾わない

## 進化と黒耀化

- 進化が見た目で分かる
- evolution SE / effect が出る
- 進化後に元武器が再抽選されない
- 黒耀化のゲージと状態が分かる
- 必殺ボタンが満タン時に目立つ

## Debug

- `?debug=true` の時だけ表示される
- fps
- enemy count
- projectile count
- exp gem count
- particle count
- current wave multiplier
- current maxEnemies
- player hp
- player level
- elapsed time

## 低スペック

- particleQuality low で演出量が減る
- lowSpecMode で敵上限が下がる
- damageNumbers off を想定した表示が破綻しない
- 50fps未満は改善対象として記録する

## Verification

- `pnpm build`
- `pnpm test`
- `?debug=true` を390 x 844想定で確認
- git status確認
