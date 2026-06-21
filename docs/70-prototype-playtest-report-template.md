# Prototype Playtest Report Template

## 目的

Prototype のプレイ結果を、感想だけで終わらせず、次の判断につなげるための報告書テンプレート。

Vamp Ponでは、各Prototypeの最後に必ずこの形式で結果を残す。

---

# 1. 基本情報

```txt
Report ID:
Date:
Prototype:
Build/Commit:
Tester:
Device:
OS:
Browser:
Input:
Play Count:
```

## 入力例

```txt
Prototype: Prototype 1
Build/Commit: xxxxxxx
Device: iPhone
OS: iOS xx
Browser: Safari
Input: touch / virtual stick
Play Count: 3
```

---

# 2. 検証目的

今回、何を確認するためにプレイしたか。

Prototype 1なら:

```txt
スマホ縦持ちで、移動・自動攻撃・欠片回収・初レベルアップが不快ではないか確認する。
```

Prototype 2なら:

```txt
3択レベルアップ、武器/パッシブ選択、ビルド差が楽しいか確認する。
```

Prototype 3なら:

```txt
8分MVPとして、カプセル・進化・必殺技・リザルトまで成立するか確認する。
```

---

# 3. 定量結果

## Prototype 1

```txt
初回Lv2到達時間:
最初の敵撃破時間:
初回被弾時間:
死亡時間:
敵撃破数:
欠片取得数:
平均FPS体感:
操作不能/重さ:
```

## Prototype 2

```txt
3分時点Lv:
5分時点Lv:
取得武器数:
取得パッシブ数:
一番強く感じた武器:
一番弱く感じた武器:
死亡/終了時間:
```

## Prototype 3

```txt
初カプセル時間:
進化達成時間:
進化数:
必殺技使用回数:
クリア/失敗:
生存時間:
倒した影:
取得欠片:
重さ:
```

---

# 4. 体感結果

## 気持ちよかった瞬間

```txt
例: 欠片が吸い寄せられる瞬間が気持ちよかった。
```

## 不快だった瞬間

```txt
例: 指で自キャラが隠れて避けづらかった。
```

## 分かりにくかったもの

```txt
例: XPゲージが増えていることが分かりにくかった。
```

## もう一度遊びたいか

```txt
YES / NO / 条件付きYES
```

理由:

```txt

```

---

# 5. QAチェック

参照:

```txt
docs/60-qa-checklist.md
```

## 合格

```txt
- 
```

## 不合格

```txt
- 
```

## 未確認

```txt
- 
```

---

# 6. Go / No-Go 判定

参照:

```txt
docs/65-go-no-go-checklist.md
```

## 判定

```txt
GO / NO-GO / HOLD
```

## 理由

```txt

```

## 次に進む場合

```txt
次のPrototype:
次の目的:
```

## 止める場合

```txt
直す対象:
再検証条件:
```

---

# 7. 修正候補

## 優先度S

次へ進む前に必ず直す。

```txt
- 
```

## 優先度A

できれば次へ進む前に直す。

```txt
- 
```

## 優先度B

後でよい。

```txt
- 
```

---

# 8. バランス調整候補

```txt
敵HP:
敵速度:
武器ダメージ:
武器CT:
欠片吸引範囲:
XP必要量:
```

調整する場合は `docs/56-balance-log-template.md` の形式で記録する。

---

# 9. スクリーンショット/動画メモ

```txt
必要なスクショ:
必要な動画:
気になる場面:
```

※ 実ファイルをrepoに入れる場合は、容量と用途を確認する。

---

# 10. 最終コメント

```txt
このPrototypeで分かったこと:
次に一番重要なこと:
```

---

# 最重要

プレイテスト報告は、褒めるためでも否定するためでもない。

目的はこれ。

```txt
次に何を直せば、もう一度遊びたくなるかを特定する。
```
