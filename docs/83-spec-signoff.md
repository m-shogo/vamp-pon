# Gameplay Spec Sign-off

## 目的

Vamp Pon の仕様レビューと補完を完了し、次に進む判断を明確にする。

これは資料Sign-offではなく、仕様Sign-off。

---

# 1. Sign-off対象

## 対象

```txt
Prototype 1仕様
Prototype 2仕様
Prototype 3/MVP仕様
```

## 対象外

```txt
商用リリース仕様
ストア提出仕様
本格デザイン仕様
複数キャラ/複数ステージ
```

---

# 2. 現在の仕様完成度

```txt
Prototype 1 Spec: 100 / 100
Prototype 2 Spec: 92 / 100
Prototype 3 / MVP Spec: 90 / 100
Full Production Spec: 65 / 100
Commercial Release Spec: 40 / 100
```

## 解釈

Prototype 1は仕様100%。

Prototype 2/3は実装開始前として十分だが、Prototype 1/2の検証結果で更新する。

Full Production/Commercial Releaseは今は対象外。

---

# 3. 補完済み

```txt
Professional Spec Review
docs/78-professional-spec-review.md

Prototype別仕様ロック
docs/79-prototype-spec-lock.md

ランタイム/衝突ルール
docs/80-runtime-rules-and-collision-spec.md

データ契約
docs/81-data-contract.md

数値目標/受け入れ基準
docs/82-balance-target-matrix-and-acceptance.md
```

---

# 4. Prototype 1 Spec: COMPLETE

Prototype 1は以下で固定。

```txt
60秒検証
ユイのみ
インクの影のみ
夜の鉛筆Lv1〜2のみ
記憶の欠片
XP
Lv2
簡易HUD
被弾最小
debug
```

禁止:

```txt
武器5種
パッシブ
記憶カプセル
進化
必殺技
本格デザイン
```

## Go判定

```txt
GO
```

---

# 5. Prototype 2 Spec: CONDITIONAL READY

Prototype 2仕様は十分。

ただし開始条件は以下。

```txt
Prototype 1がGo判定
Prototype 1 Playtest Reportがある
Prototype 1で移動/自動攻撃/欠片回収が不快ではない
```

## Go判定

```txt
NO-GO until Prototype 1 validation
```

---

# 6. Prototype 3 / MVP Spec: CONDITIONAL READY

Prototype 3/MVP仕様は十分。

ただし開始条件は以下。

```txt
Prototype 2がGo判定
武器差/3択/5分成長感が確認済み
```

## Go判定

```txt
NO-GO until Prototype 2 validation
```

---

# 7. 実装開始条件

次はPrototype 1へ進む。

実装前に必ず行う。

```txt
repo棚卸し
Prototype 1 Issue作成
First PR作成
```

---

# 8. 仕様変更ルール

Prototype 1中に変更してよいもの。

```txt
敵HP
敵速度
敵spawn
夜の鉛筆damage
夜の鉛筆cooldown
欠片吸引範囲
XP to Lv2
```

変更してはいけないもの。

```txt
キャラ追加
武器追加
パッシブ追加
敵追加
必殺技追加
カプセル追加
進化追加
```

数値変更は必ず記録。

```txt
docs/balance-log.md
```

---

# 9. 最終判断

```txt
Prototype 1 Documentation: COMPLETE
Prototype 1 Gameplay Spec: COMPLETE
Next Phase: Prototype 1 Implementation
```

## 最重要

```txt
仕様は完了。
次は触って検証する。
```

Vamp Ponは、ここから文書ではなくプレイ感で判断する。
