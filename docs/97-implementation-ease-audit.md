# Implementation Ease Audit

## 目的

Vamp Pon Prototype 1の実装が楽になるか、あらゆる角度から監査する。

この資料は、実装前に「まだ詰めるべき穴」がないか確認するための最終監査。

---

# 1. 現状評価

```txt
Implementation Ease: 92 / 100
```

かなり実装しやすい状態。

ただし、100ではない。

理由:

```txt
実装土台の実地確認がまだ
CI未整備
Phaser Scene分割の実装実体がまだ
スマホ実機テスト未実施
```

---

# 2. 実装が楽になっている点

## スコープが小さい

Prototype 1は以下だけ。

```txt
移動
自動攻撃
欠片回収
初レベルアップ
```

## 数値がある

```txt
HP
speed
damage
cooldown
XP
magnetRange
collisionRadius
```

## 見た目の方向がある

```txt
紙片・絵本風ドット
ランタン持ちユイ
黒インク影
光る欠片
```

## 禁止事項がある

```txt
武器5種を入れない
必殺技を入れない
ボスを入れない
本格デザインを入れない
```

## 完了条件がある

```txt
3秒で移動
10秒で敵撃破
30秒で欠片理解
60秒でLv2
```

---

# 3. 実装で詰まりやすい点

## 3.1 Phaser構造

詰まり:

```txt
MainSceneに全部書きすぎる
```

対策:

```txt
Sceneは薄く
systemsに処理を分ける
constants/dataを分ける
```

## 3.2 仮想スティック

詰まり:

```txt
スマホタッチ座標がズレる
```

対策:

```txt
canvas座標変換をutility化
Pointer IDを保持
スティック領域外タッチを無視
```

## 3.3 自動攻撃

詰まり:

```txt
ターゲット探索と弾生成がMainSceneに直書きされる
```

対策:

```txt
findNearestEnemy関数
spawnProjectile関数
weaponCooldownをRuntimeWeaponで管理
```

## 3.4 欠片吸引

詰まり:

```txt
吸引/取得/XP加算が混ざる
```

対策:

```txt
updatePickups
collectPickup
addXp
```

## 3.5 レベルアップ

詰まり:

```txt
Prototype 1なのに3択正式版を作りたくなる
```

対策:

```txt
Lv2到達時は簡易停止 + 夜の鉛筆Lv2のみ
```

---

# 4. まだ楽にするために必要なこと

## 最小フォルダ構成を守る

参照:

```txt
docs/98-target-code-architecture.md
```

## 実装プロンプトを使う

参照:

```txt
docs/99-agent-implementation-prompt.md
```

## Traceabilityを見る

参照:

```txt
docs/100-prototype-1-traceability-matrix.md
```

---

# 5. 実装前にやるべきこと

```txt
[ ] package.json確認
[ ] pnpm install
[ ] pnpm build
[ ] 既存src確認
[ ] P1-00/P1-01から開始
```

---

# 6. 危険サイン

```txt
MainSceneが500行を超え始める
weapon名でif分岐している
enemy名でif分岐している
Prototype 1なのに武器追加している
画像素材探しに時間を使っている
スマホ確認を後回しにしている
```

---

# 7. 最終判断

実装はかなり楽にできる。

ただし、楽にする条件はこれ。

```txt
小さく作る
順番を守る
MainSceneを太らせない
スマホで早めに見る
```

この4つを守れば、Prototype 1は破綻しにくい。
