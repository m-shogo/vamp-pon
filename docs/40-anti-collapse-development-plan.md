# 破綻しないための開発計画

## 目的

Vamp Pon は、ここまでで仕様がかなり増えた。

このまま勢いで実装すると、以下で破綻しやすい。

```txt
仕様がコードに直書きされる
武器/敵/パッシブの追加で壊れる
調整値が散らばる
デザイン確定前の仮素材で判断を誤る
スマホ前提を忘れる
テスト不能なゲームループになる
実装順が前後して作り直しになる
```

このドキュメントでは、デザインを保留したまま、実装が破綻しないためのルールとロードマップを固定する。

---

# 1. 絶対に守る原則

## 1. デザインとゲームロジックを分離する

デザインは別途詰める。

そのため、今作るコードは以下を仮素材で動かせるようにする。

```txt
移動
敵湧き
武器
経験値
レベルアップ
進化
必殺技
リザルト
```

NG:

```txt
特定画像サイズにロジックを依存させる
UIの見た目とゲーム状態を密結合する
素材名をロジックIDにする
```

OK:

```txt
id: night_pencil
name: 夜の鉛筆
spriteKey: optional
```

## 2. すべてデータ駆動にする

武器、敵、パッシブ、ウェーブ、進化条件、実績はデータで管理する。

NG:

```ts
if (weapon.name === '夜の鉛筆') { ... }
```

OK:

```ts
if (weapon.definition.effect.type === 'projectile') { ... }
```

## 3. MVPでやらないことを守る

MVPではやらない。

```txt
大量キャラ
大量ステージ
オンライン
ランキング
課金
広告
長編ストーリー
複雑な地形
本格アニメーション
ネイティブアプリ化
```

## 4. スマホ前提を忘れない

Webで作るが、スマホブラウザで遊ぶ前提。

```txt
縦持ち
仮想スティック
必殺技1ボタン
3択固定
敵数上限
欠片上限
非アクティブ時ポーズ
```

## 5. 仕様追加は必ず分類する

新アイデアは、いきなり実装しない。

必ず以下に分類する。

```txt
MVP必須
MVP強く推奨
MVP後
将来案
不採用
```

---

# 2. 推奨技術スタック

## 採用

```txt
Vite
TypeScript
Phaser
pnpm
Vitest
localStorage
```

## 理由

```txt
実装が速い
スマホブラウザで確認できる
データ駆動と相性が良い
型定義できる
Git差分で追いやすい
PWA/Capacitorへ進める余地がある
```

## 後で検討

```txt
PWA
Capacitor
iOS/Androidストア対応
Unity/Godot移植
```

---

# 3. ディレクトリ構成

## 推奨構成

```txt
src/
  main.ts
  game/
    scenes/
      BootScene.ts
      MainScene.ts
      ResultScene.ts
    overlays/
      LevelUpOverlay.ts
      CapsuleOverlay.ts
      PauseOverlay.ts
    systems/
      MovementSystem.ts
      EnemySpawnSystem.ts
      EnemyAISystem.ts
      WeaponSystem.ts
      ProjectileSystem.ts
      PickupSystem.ts
      XpSystem.ts
      LevelUpSystem.ts
      EvolutionSystem.ts
      UltimateSystem.ts
      CollisionSystem.ts
      ResultSystem.ts
      SaveSystem.ts
      DebugSystem.ts
    data/
      characters.ts
      weapons.ts
      passives.ts
      enemies.ts
      waves.ts
      evolutions.ts
      achievements.ts
      codex.ts
      powerups.ts
    domain/
      types.ts
      constants.ts
      balance.ts
      ids.ts
    utils/
      math.ts
      rng.ts
      assert.ts
      storage.ts
    tests/
      level-up.test.ts
      evolution.test.ts
      waves.test.ts
      save.test.ts
```

## 分け方の理由

### scenes

Phaser の画面単位。

### overlays

レベルアップ、カプセル、ポーズなど、MainScene上に乗る一時UI。

### systems

ゲームロジック。

### data

調整値。

### domain

型・ID・定数。

### utils

ゲームに依存しない小物。

---

# 4. 型定義方針

## ID型

```ts
export type Id = string;
```

将来、厳密化するなら以下。

```ts
export type WeaponId = string;
export type EnemyId = string;
export type PassiveId = string;
```

MVPでは過剰に型を複雑化しない。

## 基本型

```ts
export type Vec2 = {
  x: number;
  y: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

## GameConfig

```ts
export type GameConfig = {
  orientation: 'portrait' | 'landscape';
  logicalWidth: number;
  logicalHeight: number;
  durationSec: number;
  maxEnemies: number;
  maxPickups: number;
  maxProjectiles: number;
};
```

初期値:

```ts
export const DEFAULT_GAME_CONFIG: GameConfig = {
  orientation: 'portrait',
  logicalWidth: 390,
  logicalHeight: 844,
  durationSec: 480,
  maxEnemies: 140,
  maxPickups: 250,
  maxProjectiles: 120,
};
```

8分を標準にする。

10分は `durationSec: 600` で切り替える。

---

# 5. 実装の優先順位

## Phase 1: 1分遊べる核

必須。

```txt
Vite/Phaser起動
縦持ち論理解像度
ユイ表示
仮想スティック or キーボード移動
インクの影スポーン
夜の鉛筆自動攻撃
敵死亡
記憶の欠片ドロップ
XP加算
Lv2到達
```

完了条件:

```txt
スマホブラウザで1分遊べる
```

## Phase 2: ビルドが見える

```txt
レベルアップ3択
武器5種
パッシブ5種
武器/パッシブ枠
Lv.MAX除外
HP低下時回復候補
```

完了条件:

```txt
5分遊んで毎回ビルドが少し変わる
```

## Phase 3: 8分ステージ

```txt
8分ウェーブ
敵5種
強敵 黒ラベルの影
記憶カプセル
```

完了条件:

```txt
8分の山がある
3分/5分/7分に報酬イベントがある
```

## Phase 4: 進化と必殺技

```txt
進化2種
消えない名前
必殺技ゲージ
カプセル進化優先処理
```

完了条件:

```txt
1回のプレイで進化1回以上を狙える
必殺技が気持ちいい
```

## Phase 5: リザルト/保存

```txt
ResultScene
RunStats
localStorage
実績
図鑑
通貨
次の目標
```

完了条件:

```txt
もう一度遊ぶ理由が出る
```

## Phase 6: 調整と破綻防止

```txt
DebugSystem
テスト
バランスログ
スマホ実機確認
```

完了条件:

```txt
修正が勘ではなくログとテストでできる
```

---

# 6. 8分版MVPへの補正

アプリ前提なので、標準は8分にする。

10分版は残すが、MVP評価は8分優先。

## 8分構成

```txt
0:00-1:30 操作確認/最初の成長
1:30-3:00 速い敵/初ピンチ
3:00     黒ラベルの影1/初カプセル
3:00-5:00 硬い敵/回り込み
5:00     黒ラベルの影2/進化チャンス
5:00-7:00 群れ/圧力
7:00     黒ラベルの影3/最後の報酬
7:00-8:00 クライマックス
8:00     朝
```

## 8分版の目標値

```txt
到達Lv: 18〜24
倒した影: 550〜850
カプセル: 2〜3
進化: 1〜2
必殺技: 2〜4回
```

## 10分版との扱い

10分は後で `full` モードとして使う。

```txt
short: 5分
standard: 8分
full: 10分
```

---

# 7. システム疑似コード

## LevelUpSystem

```ts
function buildLevelUpChoices(context: LevelUpContext): LevelUpChoice[] {
  const pool: WeightedChoice[] = [];

  addOwnedWeaponUpgrades(pool, context);
  addNewWeaponsIfSlotsAvailable(pool, context);
  addOwnedPassiveUpgrades(pool, context);
  addNewPassivesIfSlotsAvailable(pool, context);

  if (context.player.hp / context.player.maxHp <= 0.35) {
    addRecoveryChoice(pool, 25);
  } else {
    addRecoveryChoice(pool, 5);
  }

  removeMaxedItems(pool);
  removeDuplicates(pool);

  const choices = pickWeightedUnique(pool, 3);
  return ensurePlayableChoices(choices, context);
}
```

## EvolutionSystem

```ts
function resolveCapsuleReward(context: CapsuleContext): CapsuleReward {
  const evolution = findAvailableEvolution(context.inventory);

  if (evolution) {
    return {
      type: 'evolution',
      evolutionId: evolution.id,
      title: '記憶がつながった',
    };
  }

  const upgrade = findRandomUpgradeableOwnedItem(context.inventory);

  if (upgrade) {
    return {
      type: 'upgrade',
      itemId: upgrade.id,
      title: '道具が少し戻った',
    };
  }

  return {
    type: 'currency',
    amount: 50,
    title: '欠片が残った',
  };
}
```

## WaveSystem

```ts
function updateWaveSpawner(state: GameState, deltaSec: number): SpawnRequest[] {
  const activeWaves = getActiveWaves(state.elapsedSec);
  const requests: SpawnRequest[] = [];

  for (const wave of activeWaves) {
    for (const spawn of wave.spawns) {
      if (isMaxAliveReached(spawn.enemyId, spawn.maxAlive, state.enemies)) continue;
      if (!shouldSpawn(spawn.spawnRatePerSecond, deltaSec, state.rng)) continue;

      requests.push({
        enemyId: spawn.enemyId,
        position: pickSpawnPosition(spawn.directionWeights, state.rng),
      });
    }
  }

  return requests;
}
```

## WeaponSystem

```ts
function updateWeapons(state: GameState, deltaSec: number): void {
  for (const weapon of state.inventory.weapons) {
    weapon.cooldownRemaining -= deltaSec;

    if (weapon.cooldownRemaining > 0) continue;

    fireWeapon(weapon, state);
    weapon.cooldownRemaining = calculateCooldown(weapon, state.player, state.inventory.passives);
  }
}
```

## UltimateSystem

```ts
function updateUltimate(state: GameState, deltaSec: number): void {
  if (state.player.ultimateReady) return;

  state.player.ultimateCharge += deltaSec;

  if (state.player.ultimateCharge >= getUltimateChargeSeconds(state.player.characterId)) {
    state.player.ultimateReady = true;
  }
}

function activateUltimate(state: GameState): void {
  if (!state.player.ultimateReady) return;

  applyUltimateEffect(state.player.characterId, state);
  state.player.ultimateCharge = 0;
  state.player.ultimateReady = false;
  state.runStats.ultimateUses += 1;
}
```

---

# 8. デバッグ必須項目

## 最初から入れる

```txt
F1 debug overlay
F2 force level up
F3 spawn capsule
F4 fill ultimate
F5 skip +60 sec
F6 clear enemies
F7 heal player
F8 satisfy evolution condition
```

## スマホ用デバッグ

スマホではキーボードがない。

開発用に画面端に小さい debug menu を出せるようにする。

```txt
debug=true クエリの時だけ表示
```

例:

```txt
/?debug=true
```

## デバッグ表示

```txt
FPS
elapsedSec
enemyCount
pickupCount
projectileCount
currentWave
playerLv
xp/xpToNext
weaponLevels
passiveLevels
ultimateCharge
```

---

# 9. テスト方針

## Vitestでテストするもの

Phaser依存の描画はテストしない。

純粋関数だけテストする。

```txt
level-up choice generation
evolution resolution
wave active range
save migration
xp curve
powerup cost
```

## 最初に書くテスト

### level-up.test.ts

```txt
武器枠が空なら新武器が候補に出る
武器枠が埋まると新武器は出ない
Lv.MAX武器は候補から外れる
HP35%以下で回復候補が出やすい
```

### evolution.test.ts

```txt
夜の鉛筆Lv5 + 月明かりのしおりで未完成の一行
星くず弾Lv5 + 金のコンパスで北極星のランタン
条件未達なら通常強化
```

### waves.test.ts

```txt
0秒でインクの影
180秒で黒ラベルの影
300秒で2回目カプセル機会
480秒でクリア
```

### save.test.ts

```txt
初期セーブ生成
実績保存
図鑑保存
version違い検出
```

---

# 10. 調整ログを残す

感覚だけで数値を変えると破綻する。

調整時はログを残す。

## docs/balance-log.md を作る

形式:

```md
# Balance Log

## 2026-xx-xx

### 変更
- インクの影 HP 18 → 15
- 夜の鉛筆 damage 12 → 14

### 理由
- 1分時点で敵が溜まりすぎた
- 初回レベルアップが遅かった

### 結果
- 1:00前後でLv2到達
- 爽快感は改善

### 次の懸念
- 3分以降が簡単すぎる可能性
```

## ログに残すべき値

```txt
初回Lv2到達時間
3分時点Lv
5分時点Lv
クリア時Lv
敵撃破数
進化数
必殺技使用回数
死亡時間
```

---

# 11. 仕様追加のゲート

新アイデアが出たら、以下を確認する。

```txt
1. MVPに必要か
2. スマホで操作が重くならないか
3. デザイン確定前に作ってよいか
4. 既存データ構造で表現できるか
5. テスト可能か
6. 追加後に調整箇所が爆増しないか
```

## 判定

### MVPに入れる

```txt
ゲームの核に必要
実装が軽い
調整しやすい
スマホで邪魔にならない
```

### 後回し

```txt
面白いが実装が重い
演出依存
デザイン依存
別システムが必要
```

### 捨てる

```txt
操作が忙しい
説明が増える
爽快感を邪魔する
スマホで読めない
```

---

# 12. 破綻しないための禁止事項

## コード面

```txt
巨大なMainSceneに全部書く
if文で武器ごとに分岐し続ける
UIとゲーム状態を直接結合する
セーブ構造にversionを持たない
調整値を複数箇所に直書きする
```

## 仕様面

```txt
MVP前にキャラを増やす
MVP前にステージを増やす
MVP前に複雑なストーリー演出を入れる
MVP前に広告/課金を考える
MVP前に本素材前提で調整する
```

## デザイン面

今回は保留なので、以下はしない。

```txt
色を決める
フォントを決める
キャラ見た目を決める
背景美術を決める
完成UIを決める
```

---

# 13. 今やれる最大範囲

デザイン以外で、ここまで進められる。

```txt
技術選定
ディレクトリ構成
型定義
データ構造
システム責務
疑似コード
テスト方針
デバッグ方針
調整ログ方針
MVPロードマップ
スマホ補正
```

ここまで固めれば、デザインが決まった後でも崩れにくい。

---

# 14. 次の作業候補

次は実装にかなり近い。

```txt
1. package.json / Vite / Phaser の初期セットアップ
2. src/game/domain/types.ts 作成
3. src/game/data/*.ts 作成
4. LevelUpSystem 純粋関数実装
5. EvolutionSystem 純粋関数実装
6. WaveSystem 純粋関数実装
7. Vitest でテスト追加
8. Phaser MainScene の最小実装
```

## 実装に入る前の判断

デザインを保留しても、ロジック検証目的なら実装してよい。

ただし、仮素材を見て完成度評価しないこと。

見るべきは以下。

```txt
操作感
敵密度
レベルアップ速度
欠片回収の気持ちよさ
進化の快感
必殺技の価値
スマホで重くないか
```

## 結論

この状態なら、次から実装に入っても大きく破綻しにくい。

ただし、最初の実装は必ず小さく始める。

```txt
1分遊べる
↓
5分遊べる
↓
8分遊べる
↓
進化/必殺技/リザルト
```

この順番を守る。
