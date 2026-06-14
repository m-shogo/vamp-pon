# Stage 1 play feel audit

この監査は Stage 1 Vertical Slice の気持ちよさ確認項目を分けるためのもの。
現時点では自動テストとギャラリー確認の準備が中心で、実機プレイ評価は未確認。

## OK

- player collision は小さい半径6で、見た目サイズ36とは分離されている。
- 通常時の `hitCore` と debug用 `debugHitCircle` が分離されている。
- pickup の回復吸引なし仕様、collectRadius、magnetRange は変更していない。
- 主要な通常武器、敵、拾得物、UIカードは image 化済み。

## 弱い

- ユイは generated-draft で、最終本命の説得力はまだ足りない。
- ランタン、hitCore、記憶の欠片が同系色なので、密集時に誤認リスクがある。
- 8分プレイ後半の画面密度は、`combat-mock` だけでは再現しきれていない。

## 未確認

- 実機スマホでの縦持ち操作時の中心点の見え方。
- 被弾直前に debugHitCircle なしで避けやすいか。
- ultimate 発動時にユイのシルエットが消えないか。

## 次に直すべき

1. `?scene=combat-mock` に後半密度プリセットを追加する。
2. ユイ idle/move を Aseprite で手修正する。
3. ランタンと hitCore の色差を実機で確認する。
