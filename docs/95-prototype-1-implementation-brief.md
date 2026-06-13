# Prototype 1 Implementation Brief

## 目的

Codex / Claude / Fable / Cursor へそのまま渡せる、Prototype 1実装指示書。

この指示書は、Vamp Pon の最初の実装で破綻しないための正本。

---

# 1. 作るもの

Prototype 1では、1分の核だけ作る。

```txt
移動
自動攻撃
欠片回収
初レベルアップ
```

## 体験目標

```txt
スマホ縦持ちで、ユイを動かし、黒インクの影を夜の鉛筆で払い、記憶の欠片を拾い、60秒以内にLv2へ到達する。
```

---

# 2. 絶対に作らないもの

```txt
武器5種
パッシブ5種
3択正式版
記憶カプセル
進化
必殺技
ミチル
敵3種以上
本格デザイン
本番背景
図鑑
実績
永続強化
PWA
Capacitor
ステージ2以降
ボス
```

これらはFuture LayerまたはPrototype 2以降。

---

# 3. 参照する正本

実装前に読む。

```txt
README.md
docs/47-mvp-freeze-list.md
docs/77-prototype-1-documentation-signoff.md
docs/79-prototype-spec-lock.md
docs/80-runtime-rules-and-collision-spec.md
docs/81-data-contract.md
docs/82-balance-target-matrix-and-acceptance.md
docs/83-spec-signoff.md
docs/89-prototype-1-visual-guardrail.md
docs/91-minimum-asset-spec.md
docs/92-prototype-1-asset-checklist.md
docs/93-deferred-detail-backlog.md
docs/94-next-required-work-roadmap.md
```

---

# 4. 実装順

順番を飛ばさない。

```txt
P1-00 起動確認
P1-01 縦持ちキャンバス
P1-02 ユイ仮表示
P1-03 仮想スティック移動
P1-04 インクの影スポーン
P1-05 夜の鉛筆 自動攻撃
P1-06 敵死亡と欠片ドロップ
P1-07 欠片取得/吸引
P1-08 XP/レベルアップ
P1-09 簡易HUD
P1-10 被弾/ゲームオーバー最小
P1-11 debug表示
P1-12 検証ログ
```

---

# 5. 技術方針

```txt
Vite
TypeScript
Phaser
スマホブラウザ
390 x 844 論理解像度
```

## package scripts目標

```txt
pnpm dev
pnpm build
pnpm test
```

---

# 6. ランタイム状態

```txt
boot
ready
playing
levelUp
paused
cleared
gameOver
```

Prototype 1では `capsule` は不要。

## 時間加算

```txt
playing状態のみ
```

levelUp / paused / cleared / gameOver では進めない。

---

# 7. Prototype 1 数値

```txt
Player HP: 100
Player moveSpeed: 100
Player visualSize: 34〜40px
Player collisionRadius: 14〜16px

Ink Shadow HP: 18
Ink Shadow speed: 55
Ink Shadow contactDamage: 8
Ink Shadow xpDrop: 1
Ink Shadow visualSize: 30〜36px
Ink Shadow collisionRadius: 14〜17px

Night Pencil damage: 12
Night Pencil cooldown: 1.25s
Night Pencil projectileSpeed: 260px/s
Night Pencil projectileCollisionRadius: 5px

Memory Fragment visualSize: 10〜14px
Memory Fragment collectRadius: 18px
Memory Fragment magnetRange: 70px
Memory Fragment magnetSpeed: 160px/s

XP to Lv2: 8
Enemy spawn interval: 1.2s
Enemy maxAlive: 18
Hit invulnerability: 0.6s
```

---

# 8. 入力仕様

## スマホ

```txt
左下仮想スティック
方向入力
入力強度は最大速度扱いでよい
```

## PC開発用

```txt
WASD
Arrow keys
```

## 攻撃

```txt
完全自動
最も近い敵を狙う
```

---

# 9. スポーン仕様

```txt
敵は画面外40〜80pxからスポーン
プレイヤー120px以内には出さない
Prototype 1では around / edges の簡易でよい
```

理不尽な即被弾を作らない。

---

# 10. 衝突仕様

## プレイヤー vs 敵

```txt
距離判定
接触でdamage
被弾後0.6秒無敵
```

## 弾 vs 敵

```txt
距離判定
当たったらdamage
Prototype 1では貫通なし
```

## プレイヤー vs 欠片

```txt
70px以内で吸引
18px以内で取得
取得でXP加算
```

---

# 11. 見た目仕様

採用方向:

```txt
紙片・絵本風ドット
夜の街
黒インクの影
小さなランタン
光る記憶の欠片
```

Prototype 1では本格画像は不要。

Phaser図形で代用可。

## 表示優先度

```txt
1. Player
2. Enemy
3. Pickup
4. Projectile
5. HUD
6. Background
```

---

# 12. HUD

Prototype 1で表示する。

```txt
HP
Time
Lv
XP gauge or XP text
```

高度なカードUIは不要。

Lv2到達時に簡易levelUp画面でよい。

---

# 13. Debug

`/?debug=true` またはキー操作で以下を表示できるとよい。

```txt
elapsedSec
enemyCount
pickupCount
projectileCount
playerHp
playerLv
xp
```

Prototype 1では簡易でよい。

---

# 14. 受け入れ条件

```txt
[ ] pnpm install が通る
[ ] pnpm dev が起動する
[ ] pnpm build が通る
[ ] 390x844相当で表示される
[ ] スマホ縦持ちで操作できる
[ ] ユイを動かせる
[ ] インクの影が湧く
[ ] 夜の鉛筆が自動攻撃する
[ ] 最初の敵を10秒以内に倒せる
[ ] 欠片が出る
[ ] 欠片を拾える
[ ] 60秒以内にLv2になる
[ ] 被弾してHPが減る
[ ] HP0でgameOverになる
[ ] debugで状態を確認できる
```

---

# 15. No-Go条件

以下ならPrototype 2へ進まない。

```txt
移動が不快
敵が見えない
欠片が見えない
欠片回収が面倒
1分以内にLv2にならない
スマホで操作不能
重い
```

---

# 16. 完了後に必ず作るもの

```txt
Playtest Report
Balance Log更新
Go/No-Go判定
改善Issue
```

---

# 17. 実装者への注意

良いアイデアでも、Prototype 1に不要なら入れない。

```txt
小さく作る。
触って判断する。
Future Layerを混ぜない。
```

## 最重要

```txt
Prototype 1は完成版ではない。
1分の核を証明するための実装。
```
