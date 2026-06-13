# Target Code Architecture

## 目的

Prototype 1を実装するときの目標コード構成を定義する。

目的は、最初から大規模設計にすることではない。

```txt
MainSceneが太りすぎない
Prototype 2へ拡張しやすい
データ駆動へ移行しやすい
```

この3つを守るための最小構成。

---

# 1. 推奨構成

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
      input.ts
      movement.ts
      enemies.ts
      weapons.ts
      pickups.ts
      xp.ts
      hud.ts
    utils/
      math.ts
      viewport.ts
```

---

# 2. 各ファイルの役割

## main.ts

```txt
Phaser Game起動
canvas設定
MainScene登録
```

やらない:

```txt
ゲームロジック
敵生成
武器処理
```

---

## MainScene.ts

```txt
Scene lifecycle
create/update
systems呼び出し
runtime state保持
```

やらない:

```txt
大量のif文
武器別の詳細処理
敵別の詳細処理
数値直書き乱用
```

---

## domain/constants.ts

```txt
画面サイズ
Prototype 1数値
色
UI座標
```

例:

```ts
export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;
```

---

## domain/types.ts

```txt
GameState
PlayerRuntime
EnemyRuntime
ProjectileRuntime
PickupRuntime
```

---

## data/prototype1.ts

```txt
Prototype 1で使う敵/武器/XP/アセットID定義
```

Prototype 1では最小でよい。

---

## systems/input.ts

```txt
キーボード入力
仮想スティック入力
入力ベクトル生成
```

---

## systems/movement.ts

```txt
プレイヤー移動
画面内制限
```

---

## systems/enemies.ts

```txt
敵スポーン
敵追跡
敵とプレイヤー接触
```

---

## systems/weapons.ts

```txt
夜の鉛筆cooldown
最寄り敵探索
弾生成
弾移動
弾と敵の衝突
```

---

## systems/pickups.ts

```txt
欠片生成
欠片吸引
欠片取得
```

---

## systems/xp.ts

```txt
XP加算
Lv2判定
簡易レベルアップ
```

---

## systems/hud.ts

```txt
HP/Time/Lv/XP/debug表示
```

---

## utils/math.ts

```txt
距離
正規化
clamp
ランダム方向
```

---

## utils/viewport.ts

```txt
画面外スポーン座標
UI安全領域
```

---

# 3. Prototype 1で許す妥協

Prototype 1では、完璧な設計は不要。

許す:

```txt
一部systemsが薄い
一部定数が後で調整前提
Phaser図形で仮描画
テストが少ない
```

許さない:

```txt
すべてMainScene直書き
武器名でif分岐だらけ
敵名でif分岐だらけ
数値が複数箇所に散る
Prototype 2要素を混ぜる
```

---

# 4. Runtime State案

```ts
export type RuntimeState = {
  status: 'ready' | 'playing' | 'levelUp' | 'paused' | 'cleared' | 'gameOver';
  elapsedSec: number;
  player: PlayerRuntime;
  enemies: EnemyRuntime[];
  projectiles: ProjectileRuntime[];
  pickups: PickupRuntime[];
  xp: number;
  level: number;
  debug: boolean;
};
```

---

# 5. 実装順とファイル対応

```txt
P1-00 main.ts / MainScene.ts
P1-01 constants.ts / styles.css
P1-02 MainScene.ts / constants.ts
P1-03 input.ts / movement.ts
P1-04 enemies.ts / viewport.ts
P1-05 weapons.ts / math.ts
P1-06 enemies.ts / pickups.ts
P1-07 pickups.ts / xp.ts
P1-08 xp.ts / hud.ts
P1-09 hud.ts
P1-10 enemies.ts / MainScene.ts
P1-11 hud.ts
```

---

# 6. 目標行数目安

厳密ではないが、肥大化防止の目安。

```txt
MainScene.ts: 250〜400行まで
input.ts: 100〜180行
movement.ts: 40〜80行
enemies.ts: 120〜220行
weapons.ts: 120〜220行
pickups.ts: 80〜160行
xp.ts: 40〜100行
hud.ts: 80〜180行
```

MainSceneが500行を超えたら分割を検討。

---

# 7. 最重要

Prototype 1は速く作る。

ただし、雑に全部MainSceneへ詰め込まない。

```txt
薄いScene + 小さいsystems
```

これを守る。
