# P1 Content Data and Gap Backlog

## 目的

P1実装で迷わないように、最小データ案と不足タスクを固定する。

対象:

```txt
武器
パッシブ
敵
Wave
LevelUp
GameOver文
不足実装
```

---

# 1. P1の完成条件

P1は以下を満たせば完成。

```txt
ユイが動く
黒インクの影が追ってくる
夜の鉛筆が自動攻撃する
影を倒すと記憶の欠片が落ちる
欠片を拾うとXPが増える
LvUP時に3択が出る
60秒以上遊べる
HPが0になると夜にのまれる
リトライできる
```

P1では以下は不要。

```txt
カプセル
進化
複数キャラ
複数ステージ
きずな
ボス
```

---

# 2. P1 WeaponDefinition案

## night_pencil

```ts
export const nightPencil = {
  id: 'night_pencil',
  name: '夜の鉛筆',
  category: 'weapon',
  maxLevel: 8,
  tags: ['projectile', 'starter', 'yui', 'meaning_owner'],
  description: '近くの影へ、短い鉛筆線を飛ばす。',
  lore: '誰の意味かを仮に書き留めるための道具。',
  levels: [
    {
      level: 1,
      label: '鉛筆線を1本飛ばす',
      effect: {
        type: 'projectile',
        damage: 10,
        cooldownSec: 1.2,
        projectileSpeed: 360,
        projectileCount: 1,
        pierce: 0,
        range: 420,
      },
    },
    {
      level: 2,
      label: '線が少し濃くなる',
      effect: {
        type: 'projectile',
        damage: 14,
        cooldownSec: 1.2,
        projectileSpeed: 360,
        projectileCount: 1,
        pierce: 0,
        range: 420,
      },
    },
    {
      level: 3,
      label: '少し早く書ける',
      effect: {
        type: 'projectile',
        damage: 14,
        cooldownSec: 1.0,
        projectileSpeed: 360,
        projectileCount: 1,
        pierce: 0,
        range: 420,
      },
    },
    {
      level: 4,
      label: '線が遠くまで届く',
      effect: {
        type: 'projectile',
        damage: 14,
        cooldownSec: 1.0,
        projectileSpeed: 430,
        projectileCount: 1,
        pierce: 0,
        range: 500,
      },
    },
    {
      level: 5,
      label: 'もう一本、線を引く',
      effect: {
        type: 'projectile',
        damage: 14,
        cooldownSec: 1.0,
        projectileSpeed: 430,
        projectileCount: 2,
        pierce: 0,
        range: 500,
      },
    },
    {
      level: 6,
      label: '薄い影を貫く',
      effect: {
        type: 'projectile',
        damage: 14,
        cooldownSec: 1.0,
        projectileSpeed: 430,
        projectileCount: 2,
        pierce: 1,
        range: 500,
      },
    },
    {
      level: 7,
      label: '線が太くなる',
      effect: {
        type: 'projectile',
        damage: 20,
        cooldownSec: 1.0,
        projectileSpeed: 430,
        projectileCount: 2,
        pierce: 1,
        range: 500,
      },
    },
    {
      level: 8,
      label: '書き残しが一瞬残る',
      effect: {
        type: 'projectile',
        damage: 20,
        cooldownSec: 0.9,
        projectileSpeed: 450,
        projectileCount: 2,
        pierce: 1,
        range: 540,
        trailDamage: 4,
      },
    },
  ],
} as const;
```

## 実装注意

`trailDamage` は既存処理になければ無視してよい。

P1では以下だけ実装できれば良い。

```txt
damage
cooldownSec
projectileSpeed
projectileCount
pierce
range
```

---

# 3. P1 PassiveDefinition案

## small_magnet

```ts
export const smallMagnet = {
  id: 'small_magnet',
  name: '小さな磁石',
  category: 'passive',
  maxLevel: 5,
  stat: 'magnetMultiplier',
  description: '記憶の欠片を少し遠くから引き寄せる。',
  lore: '持ち主へ戻ろうとする力。',
  levels: [
    { level: 1, value: 1.15, label: '吸引範囲 +15%' },
    { level: 2, value: 1.30, label: '吸引範囲 +30%' },
    { level: 3, value: 1.50, label: '吸引範囲 +50%' },
    { level: 4, value: 1.75, label: '吸引範囲 +75%' },
    { level: 5, value: 2.00, label: '吸引範囲 +100%' },
  ],
} as const;
```

## paper_bookmark

```ts
export const paperBookmark = {
  id: 'paper_bookmark',
  name: '紙片のしおり',
  category: 'passive',
  maxLevel: 5,
  stat: 'xpMultiplier',
  description: '記憶の欠片から得る経験が増える。',
  lore: '拾った意味を見失わないためのしおり。',
  levels: [
    { level: 1, value: 1.10, label: '欠片経験 +10%' },
    { level: 2, value: 1.20, label: '欠片経験 +20%' },
    { level: 3, value: 1.35, label: '欠片経験 +35%' },
    { level: 4, value: 1.50, label: '欠片経験 +50%' },
    { level: 5, value: 1.70, label: '欠片経験 +70%' },
  ],
} as const;
```

## light_shoes

```ts
export const lightShoes = {
  id: 'light_shoes',
  name: '軽い靴',
  category: 'passive',
  maxLevel: 5,
  stat: 'moveSpeedMultiplier',
  description: 'ユイの移動速度が上がる。',
  lore: '夜の道をもう少し長く歩ける。',
  levels: [
    { level: 1, value: 1.08, label: '移動速度 +8%' },
    { level: 2, value: 1.16, label: '移動速度 +16%' },
    { level: 3, value: 1.25, label: '移動速度 +25%' },
    { level: 4, value: 1.35, label: '移動速度 +35%' },
    { level: 5, value: 1.45, label: '移動速度 +45%' },
  ],
} as const;
```

---

# 4. P1 EnemyDefinition案

## ink_shadow

```ts
export const inkShadow = {
  id: 'ink_shadow',
  name: '黒インクの影',
  hp: 18,
  moveSpeed: 48,
  contactDamage: 8,
  xpDrop: 1,
  tags: ['small', 'shadow', 'ink'],
  behavior: 'chase',
  description: 'ユイへにじみ寄る、小さな黒インクの影。',
  lore: '固定された誤解の影。',
} as const;
```

## P1後半で追加するなら

```ts
export const fastInkShadow = {
  id: 'fast_ink_shadow',
  name: '走る黒インク',
  hp: 12,
  moveSpeed: 72,
  contactDamage: 6,
  xpDrop: 1,
  tags: ['small', 'fast', 'shadow', 'ink'],
  behavior: 'chase',
  description: '細く伸びて、少し速くにじみ寄る影。',
  lore: '急いで固定されようとする誤解。',
} as const;
```

`fast_ink_shadow` は `behavior: chase` のまま移動速度だけ速くする。

---

# 5. P1 WaveDefinition案

## 60秒版

```ts
export const prototypeWaves = [
  {
    start: 0,
    end: 15,
    note: '夜の入口。基本影だけ。',
    spawns: [
      {
        enemyId: 'ink_shadow',
        spawnRatePerSecond: 0.7,
        maxAlive: 12,
        directionWeights: { around: 1 },
      },
    ],
  },
  {
    start: 15,
    end: 35,
    note: '少し密度を上げる。',
    spawns: [
      {
        enemyId: 'ink_shadow',
        spawnRatePerSecond: 1.0,
        maxAlive: 20,
        directionWeights: { around: 1 },
      },
    ],
  },
  {
    start: 35,
    end: 60,
    note: '朝前の圧。',
    spawns: [
      {
        enemyId: 'ink_shadow',
        spawnRatePerSecond: 1.3,
        maxAlive: 28,
        directionWeights: { around: 1 },
      },
    ],
  },
];
```

## 180秒版

P1が安定したら、60秒を180秒へ伸ばす。

```txt
0-30秒: 基本影のみ
30-90秒: 基本影密度UP
90-150秒: fast_ink_shadow混入
150-180秒: maxAlive増加、朝前の圧
```

---

# 6. LevelUpChoice 文言

## 武器新規

```txt
夜の鉛筆
近くの影へ、短い鉛筆線を飛ばす。
誰の意味かを仮に書き留めるための道具。
```

## 武器強化

```txt
線が濃くなる
夜の鉛筆の威力が上がる。
```

## 小さな磁石

```txt
小さな磁石
記憶の欠片を少し遠くから引き寄せる。
持ち主へ戻ろうとする力。
```

## 紙片のしおり

```txt
紙片のしおり
記憶の欠片から得る経験が増える。
拾った意味を見失わないためのしおり。
```

## 軽い靴

```txt
軽い靴
移動速度が上がる。
夜の道をもう少し長く歩ける。
```

## 回復

```txt
朝のしずく
少しだけHPを回復する。
朝まで残りかけた意味の余熱。
```

---

# 7. GameOver / Clear 文言

## GameOver

```txt
夜にのまれた。
この読み方では、朝まで残れなかった。
```

## Retry

```txt
地図帳は、もう一度この夜を開いた。
```

## Clear 60sec

```txt
朝になった。
小さな紙片は、まだ光っていた。
```

## Clear 180sec

```txt
朝になった。
このページの端に、消えない折り目が残った。
```

---

# 8. 足りない実装タスク

## 必須

```txt
weapons.ts を作る
passives.ts を作る
enemies.ts を作る
waves.ts を作る
levelUpChoice生成をデータから作る
Projectile処理で projectileCount / pierce / range を読む
Passive効果を runtime に反映する
XP吸引範囲を magnetMultiplier で変える
GameOver文を現行正史に合わせる
```

## あれば強い

```txt
memoryFragmentsCollected をHUD/Resultに出す
60秒Clearを作る
夜明けまで表示を作る
欠片吸引の気持ちよさを調整する
```

## P1でやらない

```txt
Evolution処理
Capsule処理
Boss処理
Bond処理
Stage別リザルト
```

---

# 9. 足りないデザインタスク

## 必須

```txt
ユイ 32px前後の仮スプライト
黒インク影 24px前後の仮スプライト
記憶の欠片 10〜14pxの仮スプライト
夜の鉛筆弾
背景タイル1種
```

## 置き場

```txt
assets/concept-design/02_characters/
assets/concept-design/03_enemies/
assets/concept-design/04_items/
assets/concept-design/01_world/
```

---

# 10. 実装判断

P1では、データ量より手触り。

優先順位:

```txt
1. 移動が気持ちいい
2. 欠片を拾うのが気持ちいい
3. 鉛筆が当たって気持ちいい
4. 影が見やすい
5. LevelUpが分かりやすい
6. 朝まで残りたいと思える
```

これ以外は後回し。
