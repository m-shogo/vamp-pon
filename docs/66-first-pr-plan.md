# First PR Plan

## 目的

Vamp Pon の最初の実装PRで、何を入れて何を入れないかを明確にする。

最初のPRは「ゲームを完成させるPR」ではない。

目的はこれだけ。

```txt
Prototype 1 の土台を作り、スマホ縦持ちで1分操作感を検証できる状態へ進める。
```

---

# 1. PRタイトル案

```txt
feat: add Prototype 1 playable core
```

または、日本語運用なら:

```txt
feat: Prototype 1の1分操作感コアを追加
```

---

# 2. PRのゴール

## このPRで証明すること

```txt
Vite + TypeScript + Phaser が起動する
スマホ縦持ちキャンバスが表示される
仮素材のユイを移動できる
インクの影が出る
夜の鉛筆が自動攻撃する
敵が倒れる
記憶の欠片を拾える
Lv2に到達できる
```

## このPRで証明しないこと

```txt
8分MVPが面白いか
武器5種が面白いか
進化が気持ちいいか
必殺技が必要か
デザインが良いか
アプリ化できるか
```

---

# 3. PRに含める範囲

## 必須

```txt
package.json
Vite設定
TypeScript設定
index.html
src/main.ts
MainScene
基礎CSS
ユイ仮表示
移動
敵スポーン
自動攻撃
敵死亡
欠片ドロップ
欠片取得
XP
簡易Lv2
簡易HUD
```

## 推奨

```txt
F1 debug overlay
/?debug=true
PCキーボード移動
被弾/HP減少
HP0停止
```

## 入れない

```txt
武器5種
パッシブ5種
3択正式版
記憶カプセル
進化
必殺技
リザルト詳細
図鑑
実績
永続強化
本格デザイン
音
PWA/Capacitor
```

---

# 4. ファイル構成案

```txt
src/
  main.ts
  styles.css
  game/
    scenes/
      MainScene.ts
    domain/
      constants.ts
      types.ts
    data/
      prototype1.ts
    systems/
      movement.ts
      enemySpawn.ts
      weapon.ts
      pickups.ts
      xp.ts
    utils/
      math.ts
```

## 注意

最初から複雑にしすぎない。

ただし、巨大なMainSceneに全部書かない。

---

# 5. 実装順

## Step 1: 起動

```txt
Vite起動
Phaser表示
390x844キャンバス
```

## Step 2: プレイヤー

```txt
ユイ仮表示
キーボード移動
スマホ仮想スティック
```

## Step 3: 敵

```txt
インクの影スポーン
追跡
```

## Step 4: 攻撃

```txt
夜の鉛筆自動発射
近い敵を狙う
当たり判定
```

## Step 5: 報酬

```txt
敵死亡
欠片ドロップ
欠片吸引
XP増加
```

## Step 6: 成長

```txt
XPゲージ
Lv2到達
簡易レベルアップ
```

## Step 7: 検証補助

```txt
HUD
debug overlay
balance log更新
```

---

# 6. PR受け入れ条件

```txt
[ ] pnpm install が通る
[ ] pnpm dev で起動する
[ ] ブラウザで390x844画面が出る
[ ] スマホ縦持ちで表示できる
[ ] ユイを動かせる
[ ] インクの影が湧く
[ ] 夜の鉛筆が自動攻撃する
[ ] 敵を倒せる
[ ] 欠片が出る
[ ] 欠片を拾える
[ ] XPが増える
[ ] 60秒以内にLv2へ到達する
[ ] 戦闘中に長い文字が出ない
```

---

# 7. PRレビュー観点

## 見る

```txt
移動が不快ではないか
自動攻撃が遅すぎないか
欠片を拾うのが面倒ではないか
1分以内にレベルアップするか
コードが巨大MainScene化していないか
データ駆動の余地があるか
```

## 見ない

```txt
デザインがかわいいか
世界観が完成しているか
武器バランスが完成しているか
8分遊べるか
```

---

# 8. PR後にやること

```txt
Prototype 1 検証ログを書く
初回Lv2到達時間を測る
操作感メモを書く
不快ポイントを洗い出す
Prototype 2へ進むかGo/No-Go判定する
```

---

# 9. No-Go条件

このPR後、以下ならPrototype 2へ進まない。

```txt
スマホで移動が不快
欠片回収が面倒
1分以内にレベルアップしない
敵を倒す爽快感がない
重い
```

その場合は、武器追加ではなくPrototype 1の調整に戻る。

---

# 10. 最重要

このPRは、完成版ではない。

```txt
1分の核を確認するPR。
```

ここに余計なものを入れない。
