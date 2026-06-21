# Runtime Rules and Collision Spec

## 目的

Vamp Pon の実装時に迷いやすいランタイムルールを固定する。

対象:

```txt
ゲーム状態
時間
入力
スポーン
衝突
被弾
弾
欠片
レベルアップ
ポーズ
```

---

# 1. Game State

## 状態一覧

```txt
boot
ready
playing
levelUp
capsule
paused
cleared
gameOver
```

## 状態遷移

```txt
boot → ready
ready → playing
playing → levelUp
levelUp → playing
playing → capsule
capsule → playing
playing → paused
paused → playing
playing → cleared
playing → gameOver
```

## 停止する状態

以下ではゲーム内時間を進めない。

```txt
levelUp
capsule
paused
cleared
gameOver
```

---

# 2. Time Rules

## Prototype 1

```txt
60秒検証
```

## Prototype 3

```txt
480秒 = 8分
```

## 経過時間

```txt
playing状態のみ加算
```

レベルアップ中、カプセル中、ポーズ中は加算しない。

---

# 3. Input Rules

## 移動

```txt
仮想スティック方向のみ
入力強度はMVPでは最大速度扱い
```

理由:

```txt
スマホで安定して避けやすい
```

## 攻撃

```txt
完全自動
```

## 必殺技

Prototype 1/2:

```txt
なし
```

Prototype 3:

```txt
ゲージ満タン時に1ボタン発動
```

---

# 4. Spawn Rules

## 敵スポーン位置

敵は画面内に直接出さない。

```txt
画面外 40〜80px
```

Prototype 1では簡易でよい。

```txt
画面下/左右外側
```

## プレイヤー近距離スポーン禁止

```txt
プレイヤーから120px以内には出さない
```

## 理由

```txt
見えない理不尽被弾を防ぐ
```

---

# 5. Enemy Contact Damage

## 接触判定

敵とプレイヤーの当たり判定が重なったらダメージ。

## 被弾無敵

```txt
0.6秒
```

無敵中は追加接触ダメージを受けない。

## Prototype 1

```txt
インクの影 contactDamage: 8
```

## 被弾フィードバック

最低限:

```txt
HP減少
プレイヤー短い点滅
```

SEは後回しでもよい。

---

# 6. Projectile Rules

## 夜の鉛筆

Prototype 1:

```txt
最も近い敵を狙う
弾速 260px/s
敵に当たるとダメージ
Prototype 1では貫通なし
画面外に出たら消す
```

## ターゲット探索

Prototype 1では全敵探索でよい。

Prototype 2以降、重くなったら最適化。

## 同時弾数

Prototype 1では少ないため制限不要。

Prototype 3では上限を持つ。

```txt
maxProjectiles: 120
```

---

# 7. Pickup / Fragment Rules

## 欠片発生

敵死亡位置に発生。

Prototype 1:

```txt
インクの影 xpDrop: 1
```

## 吸引開始

```txt
magnetRange: 70px
```

## 取得範囲

```txt
collectRange: 18px
```

## 吸引速度

```txt
magnetSpeed: 160px/s
```

## 取得後

```txt
XP加算
欠片オブジェクト削除
```

---

# 8. Level Up Rules

## Prototype 1

```txt
Lv2到達のみ
簡易選択
夜の鉛筆 Lv2
```

## XP to Lv2

```txt
8
```

## レベルアップ中

```txt
ゲーム時間停止
敵停止
弾停止
欠片停止
```

## 選択後

```txt
強化反映
playingへ戻る
```

---

# 9. Level Up Full Rules

Prototype 2以降。

## 候補生成

```txt
所持武器強化
新武器
所持パッシブ強化
新パッシブ
回復
```

## 除外

```txt
Lv.MAXの武器/パッシブ
枠が埋まっている時の新武器/新パッシブ
既に候補に入っている同一ID
```

## 候補が3つ未満の場合

以下で補う。

```txt
回復
記憶片少量
何もなければHP回復
```

MVPでは候補なし状態を作らない。

---

# 10. Capsule Rules

Prototype 3以降。

## 取得条件

```txt
黒ラベルの影を倒す
カプセルが落ちる
接触で取得
```

## 報酬優先順位

```txt
1. 進化条件を満たす武器
2. 所持武器/パッシブの通常強化
3. 記憶片
```

## カプセル中

```txt
ゲーム時間停止
演出0.8〜1.2秒
```

---

# 11. Pause Rules

## 非アクティブ

以下でpause。

```txt
visibilitychange
blur
```

## 復帰

```txt
即再開しない
PauseOverlayを表示
```

## 理由

```txt
復帰直後の理不尽被弾を防ぐ
```

---

# 12. Clear / GameOver Rules

## Clear

```txt
elapsedSec >= durationSec
```

Prototype 3:

```txt
480秒到達
```

表示:

```txt
朝まで残った
```

## GameOver

```txt
player.hp <= 0
```

表示:

```txt
夜に飲まれた
```

---

# 13. Object Limits

Prototype 3目標。

```txt
maxEnemies: 140
maxPickups: 250
maxProjectiles: 120
```

Prototype 1では小さいが、構造として上限を持つ。

---

# 14. 最重要

理不尽な即被弾を作らない。

```txt
敵は画面外から来る
プレイヤー近くに湧かない
被弾後は短い無敵
復帰時は即再開しない
```

これを守る。
