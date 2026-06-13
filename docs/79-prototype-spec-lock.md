# Prototype Spec Lock

## 目的

Prototype 1 / 2 / 3 で入れる仕様を固定する。

この資料は、実装時の仕様ロックとして使う。

---

# 1. Prototype 1 Spec Lock

## 目的

```txt
スマホ縦持ちで、移動・自動攻撃・欠片回収・初レベルアップが気持ちいいか確認する。
```

## プレイ時間

```txt
60秒検証
```

## キャラ

```txt
ユイのみ
```

## 入力

```txt
仮想スティック
PC開発用キーボード
攻撃は自動
必殺技なし
```

## 敵

```txt
インクの影のみ
```

## 武器

```txt
夜の鉛筆 Lv1〜2のみ
```

## 成長

```txt
XP
Lv2到達
簡易レベルアップ
```

## 数値初期値

```txt
Player HP: 100
Player moveSpeed: 100
Ink Shadow HP: 18
Ink Shadow speed: 55
Ink Shadow contactDamage: 8
Ink Shadow xpDrop: 1
Night Pencil damage: 12
Night Pencil cooldown: 1.25s
Night Pencil projectileSpeed: 260px/s
Fragment magnetRange: 70px
Fragment collectRange: 18px
Fragment magnetSpeed: 160px/s
XP to Lv2: 8
Enemy spawn interval: 1.2s
Enemy maxAlive: 18
Hit invulnerability: 0.6s
```

## 合格条件

```txt
3秒以内に移動できる
最初の敵を10秒以内に倒せる
30秒以内に欠片回収の意味が分かる
60秒以内にLv2になる
スマホで操作が不快ではない
```

## 禁止

```txt
武器5種
パッシブ
カプセル
進化
必殺技
リザルト詳細
図鑑
実績
本格デザイン
```

---

# 2. Prototype 2 Spec Lock

## 目的

```txt
3択レベルアップ、武器/パッシブ選択、ビルド差が楽しいか確認する。
```

## プレイ時間

```txt
5分検証
```

## キャラ

```txt
ユイのみ
```

## 入力

```txt
仮想スティック
攻撃自動
必殺技なし
```

## 敵

```txt
インクの影
紙くずの影
迷子の方角
```

## 武器

```txt
夜の鉛筆
ビー玉
月のしおり
黒インクの小瓶
星くず弾
```

## パッシブ

```txt
金のコンパス
旅のバッジ
月明かりのしおり
古い切符
白い余白
```

## 成長

```txt
3択レベルアップ
武器枠4
パッシブ枠4
Lv.MAX除外
枠満了時は新規候補除外
```

## レベル目標

```txt
1分時点: Lv2〜3
3分時点: Lv5〜7
5分時点: Lv8〜11
```

## 禁止

```txt
記憶カプセル
進化
必殺技
黒ラベルの影
8分ウェーブ
詳細リザルト
```

---

# 3. Prototype 3 Spec Lock

## 目的

```txt
8分MVPとして、カプセル・進化・必殺技・リザルトまで成立するか確認する。
```

## プレイ時間

```txt
8分
```

## キャラ

```txt
ユイのみ
```

## 入力

```txt
仮想スティック
攻撃自動
必殺技1ボタン
非アクティブ時ポーズ
```

## 敵

```txt
インクの影
紙くずの影
迷子の方角
黒いカプセル
夜のもや
黒ラベルの影
```

## 武器/パッシブ

Prototype 2と同じ。

## カプセル

```txt
3:00 黒ラベルの影1
5:00 黒ラベルの影2
7:00 黒ラベルの影3
```

許容:

```txt
±15秒
```

## 進化

必須:

```txt
夜の鉛筆 Lv5 + 月明かりのしおり → 未完成の一行
```

強く推奨:

```txt
星くず弾 Lv5 + 金のコンパス → 北極星のランタン
```

## 必殺技

```txt
消えない名前
Charge: 90秒
Range: 260px
Damage: 20
Magnet duration: 2.2s
```

## 8分目標

```txt
到達Lv: 18〜24
敵撃破: 550〜850
カプセル: 2〜3
進化: 1〜2
必殺技使用: 2〜4回
```

## 禁止

```txt
ミチル
2ステージ目
10分full
永続強化完全版
詳細図鑑
PWA/Capacitor
課金/広告
```

---

# 4. 仕様変更ルール

## Prototype 1中に変更してよいもの

```txt
敵HP
敵速度
武器ダメージ
武器cooldown
欠片吸引範囲
XP必要量
```

## Prototype 1中に変更してはいけないもの

```txt
キャラ追加
武器追加
敵追加
必殺技追加
カプセル追加
```

## 変更記録

数値変更は必ず以下へ記録。

```txt
docs/balance-log.md
```

---

# 5. 最重要

仕様ロックは、良いアイデアを殺すためではない。

```txt
何を検証しているかを守るためのもの。
```

Prototype 1では、1分の核以外を作らない。
