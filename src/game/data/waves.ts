import type { Id, WaveDefinition, WaveSpawnDefinition } from '../domain/types';
import type { StageRecipe } from './stageRecipes';

/**
 * 8分（480秒）ウェーブ。docs/44・docs/82 のタイムライン準拠。
 * エリート（オンブロ・黒ラベル）は 2:30 / 5:00 / 7:00 に出現。
 * 方針: HPを硬くするのではなく、倒す・避ける・追う・囲まれる役割差でテンポを作る。
 */
const rawWaves: WaveDefinition[] = [
  {
    start: 0,
    end: 20,
    note: '操作確認。オンブを柔らかく倒して最初の快感を作る。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.95, maxAlive: 22, directionWeights: { bottom: 70, top: 10, left: 10, right: 10 } },
    ],
  },
  {
    start: 20,
    end: 45,
    note: '早い段階で突進敵を少量導入。単調な追尾だけにしない。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.05, maxAlive: 28, directionWeights: { bottom: 65, top: 15, left: 10, right: 10 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.15, maxAlive: 4, directionWeights: { bottom: 60, top: 20, left: 10, right: 10 } },
    ],
  },
  {
    start: 45,
    end: 75,
    note: 'Lv2〜3まで寂しくしない。追尾・突進・回り込みを混ぜる。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.15, maxAlive: 34, directionWeights: { bottom: 60, top: 15, left: 12, right: 13 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.19, maxAlive: 5, directionWeights: { bottom: 55, top: 20, left: 12, right: 13 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.08, maxAlive: 3, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
    ],
  },
  {
    start: 75,
    end: 120,
    note: '回り込みを本格導入。敵数だけでなく逃げ道の作り方を変える。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.0, maxAlive: 34, directionWeights: { bottom: 55, top: 20, left: 12, right: 13 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.26, maxAlive: 7, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.13, maxAlive: 6, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
    ],
  },
  {
    start: 120,
    end: 150,
    note: '追う報酬敵を導入。逃げる黒カプセルでプレイヤーに小目標を渡す。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.9, maxAlive: 32, directionWeights: { bottom: 55, top: 20, left: 12, right: 13 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.26, maxAlive: 8, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'black_capsule', spawnRatePerSecond: 0.1, maxAlive: 2, directionWeights: { bottom: 60, top: 20, left: 10, right: 10 } },
    ],
  },
  {
    start: 150,
    end: 151,
    note: 'エリート1。3分まで待たせず、最初のカプセル/進化導線を早める。',
    spawns: [
      { enemyId: 'black_label_shadow', spawnCount: 1, directionWeights: { bottom: 100 } },
    ],
  },
  {
    start: 151,
    end: 210,
    note: 'エリート後のご褒美時間。倒しやすい敵を多めにしてビルドの伸びを見せる。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.15, maxAlive: 42, directionWeights: { bottom: 55, top: 20, left: 12, right: 13 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.26, maxAlive: 12, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
    ],
  },
  {
    start: 210,
    end: 270,
    note: '黒いカプセル増加。火力チェックより、追い切れるかの判断を作る。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.95, maxAlive: 42, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.42, maxAlive: 16, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'black_capsule', spawnRatePerSecond: 0.14, maxAlive: 5, directionWeights: { bottom: 60, top: 20, left: 10, right: 10 } },
    ],
  },
  {
    start: 270,
    end: 300,
    note: '夜のもやを早めに導入。面で押す敵を混ぜて武器差を出す。',
    spawns: [
      { enemyId: 'night_haze', spawnRatePerSecond: 0.42, maxAlive: 22, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.82, maxAlive: 38, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
    ],
  },
  {
    start: 300,
    end: 301,
    note: 'エリート2。進化チャンス。',
    spawns: [
      { enemyId: 'black_label_shadow', spawnCount: 1, directionWeights: { bottom: 80, top: 20 } },
    ],
  },
  {
    start: 301,
    end: 360,
    note: 'ビルド差が見える時間。追尾・突進・旋回・報酬敵を混在。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.0, maxAlive: 48, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.5, maxAlive: 20, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.35, maxAlive: 18, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
      { enemyId: 'black_capsule', spawnRatePerSecond: 0.16, maxAlive: 7, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
    ],
  },
  {
    start: 360,
    end: 420,
    note: '夜のもや本番。群れ圧力。',
    spawns: [
      { enemyId: 'night_haze', spawnRatePerSecond: 0.75, maxAlive: 38, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.8, maxAlive: 44, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.2, maxAlive: 14, directionWeights: { bottom: 40, top: 20, left: 20, right: 20 } },
    ],
  },
  {
    start: 420,
    end: 421,
    note: 'エリート3。最後のカプセル機会。',
    spawns: [
      { enemyId: 'black_label_shadow', spawnCount: 1, directionWeights: { bottom: 70, top: 10, left: 10, right: 10 } },
    ],
  },
  {
    start: 421,
    end: 470,
    note: 'クライマックス。全敵混合。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.0, maxAlive: 52, directionWeights: { bottom: 40, top: 20, left: 20, right: 20 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.55, maxAlive: 28, directionWeights: { bottom: 35, top: 20, left: 22, right: 23 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.4, maxAlive: 22, directionWeights: { bottom: 35, top: 20, left: 22, right: 23 } },
      { enemyId: 'night_haze', spawnRatePerSecond: 0.9, maxAlive: 48, directionWeights: { bottom: 35, top: 20, left: 22, right: 23 } },
    ],
  },
  {
    start: 470,
    end: 480,
    note: '最後の10秒。押し込み。',
    spawns: [
      { enemyId: 'night_haze', spawnRatePerSecond: 1.3, maxAlive: 64, directionWeights: { bottom: 35, top: 20, left: 22, right: 23 } },
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.1, maxAlive: 58, directionWeights: { bottom: 35, top: 20, left: 22, right: 23 } },
    ],
  },
];

function primaryPatternIdForEnemy(enemyId: Id): Id {
  switch (enemyId) {
    case 'paper_scrap_shadow':
      return 'charge.tellLine';
    case 'lost_direction':
      return 'orbit.player';
    case 'black_capsule':
      return 'retreat.shooter';
    case 'night_haze':
      return 'chase.swarm';
    case 'black_label_shadow':
      return 'chase.slowHeavy';
    case 'ink_shadow':
    default:
      return 'chase.basic';
  }
}

function withPrimaryPattern(spawn: WaveSpawnDefinition): WaveSpawnDefinition {
  return {
    patternId: spawn.patternId ?? primaryPatternIdForEnemy(spawn.enemyId),
    ...spawn,
  };
}

export const waves: WaveDefinition[] = rawWaves.map((wave) => ({
  ...wave,
  spawns: wave.spawns.map(withPrimaryPattern),
}));

/**
 * Stage2「にじむ地図帳」手動ウェーブ。
 * コンセプト: 雨の路地——序盤は安全寄り、中盤から横流し/挟み込みが増え、
 * 終盤は雨のように四方から敵が収束する。
 * Stage1との差: bottom偏重を崩し left/right/around を増やす。
 * night_haze（群れ＝雨粒）とlost_direction（回り込み＝路地裏の挟撃）を早期導入。
 */
const rawStage2Waves: WaveDefinition[] = [
  {
    start: 0, end: 20,
    note: 'Stage2: 操作確認。Stage1より少し上・横からも降ってくる。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.98, maxAlive: 24, directionWeights: { bottom: 50, top: 18, left: 14, right: 14, around: 4 } },
    ],
  },
  {
    start: 20, end: 45,
    note: 'Stage2: 回り込み敵を早期導入。路地の角から現れる感触。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.08, maxAlive: 28, directionWeights: { bottom: 45, top: 18, left: 16, right: 16, around: 5 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.08, maxAlive: 3, directionWeights: { bottom: 30, top: 20, left: 22, right: 22, around: 6 } },
    ],
  },
  {
    start: 45, end: 75,
    note: 'Stage2: 突進敵が横から。路地の入口から突っ込んでくるイメージ。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.15, maxAlive: 34, directionWeights: { bottom: 42, top: 18, left: 18, right: 18, around: 4 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.2, maxAlive: 5, directionWeights: { bottom: 25, top: 15, left: 28, right: 28, around: 4 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.1, maxAlive: 4, directionWeights: { bottom: 28, top: 20, left: 24, right: 24, around: 4 } },
    ],
  },
  {
    start: 75, end: 120,
    note: 'Stage2: 回り込みが本格化。左右から挟む配置。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.02, maxAlive: 34, directionWeights: { bottom: 38, top: 18, left: 20, right: 20, around: 4 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.28, maxAlive: 7, directionWeights: { bottom: 22, top: 14, left: 30, right: 30, around: 4 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.16, maxAlive: 7, directionWeights: { bottom: 24, top: 18, left: 26, right: 26, around: 6 } },
    ],
  },
  {
    start: 120, end: 150,
    note: 'Stage2: 黒カプセルと夜のもやを早期導入。雨粒のように小さな群れが流れてくる。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.92, maxAlive: 32, directionWeights: { bottom: 38, top: 18, left: 20, right: 20, around: 4 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.28, maxAlive: 8, directionWeights: { bottom: 22, top: 14, left: 30, right: 30, around: 4 } },
      { enemyId: 'night_haze', spawnRatePerSecond: 0.15, maxAlive: 8, directionWeights: { bottom: 30, top: 22, left: 22, right: 22, around: 4 } },
      { enemyId: 'black_capsule', spawnRatePerSecond: 0.1, maxAlive: 2, directionWeights: { bottom: 40, top: 20, left: 18, right: 18, around: 4 } },
    ],
  },
  {
    start: 150, end: 151,
    note: 'Stage2: エリート1。雨影の気配。',
    spawns: [
      { enemyId: 'black_label_shadow', spawnCount: 1, directionWeights: { bottom: 60, top: 20, left: 10, right: 10 } },
    ],
  },
  {
    start: 151, end: 210,
    note: 'Stage2: エリート後の雨間。群れを多めにして爽快に倒させる。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.18, maxAlive: 44, directionWeights: { bottom: 36, top: 20, left: 20, right: 20, around: 4 } },
      { enemyId: 'night_haze', spawnRatePerSecond: 0.22, maxAlive: 12, directionWeights: { bottom: 28, top: 22, left: 22, right: 22, around: 6 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.18, maxAlive: 10, directionWeights: { bottom: 26, top: 20, left: 24, right: 24, around: 6 } },
    ],
  },
  {
    start: 210, end: 270,
    note: 'Stage2: 横流しが強まる。突進敵が左右から挟む。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.98, maxAlive: 42, directionWeights: { bottom: 32, top: 20, left: 22, right: 22, around: 4 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.46, maxAlive: 16, directionWeights: { bottom: 18, top: 12, left: 32, right: 32, around: 6 } },
      { enemyId: 'night_haze', spawnRatePerSecond: 0.3, maxAlive: 16, directionWeights: { bottom: 26, top: 22, left: 24, right: 24, around: 4 } },
      { enemyId: 'black_capsule', spawnRatePerSecond: 0.14, maxAlive: 5, directionWeights: { bottom: 36, top: 20, left: 20, right: 20, around: 4 } },
    ],
  },
  {
    start: 270, end: 300,
    note: 'Stage2: 雨脚が強まる。全方向から群れが流れ込む。',
    spawns: [
      { enemyId: 'night_haze', spawnRatePerSecond: 0.52, maxAlive: 26, directionWeights: { bottom: 24, top: 24, left: 24, right: 24, around: 4 } },
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.85, maxAlive: 38, directionWeights: { bottom: 30, top: 22, left: 22, right: 22, around: 4 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.22, maxAlive: 14, directionWeights: { bottom: 22, top: 20, left: 26, right: 26, around: 6 } },
    ],
  },
  {
    start: 300, end: 301,
    note: 'Stage2: エリート2。雨の壁。',
    spawns: [
      { enemyId: 'black_label_shadow', spawnCount: 1, directionWeights: { bottom: 50, top: 25, left: 12, right: 13 } },
    ],
  },
  {
    start: 301, end: 360,
    note: 'Stage2: 挟み込みが激化。路地の両側から追い詰められる。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.05, maxAlive: 48, directionWeights: { bottom: 30, top: 22, left: 22, right: 22, around: 4 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.54, maxAlive: 20, directionWeights: { bottom: 16, top: 14, left: 32, right: 32, around: 6 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.38, maxAlive: 18, directionWeights: { bottom: 20, top: 18, left: 28, right: 28, around: 6 } },
      { enemyId: 'black_capsule', spawnRatePerSecond: 0.16, maxAlive: 7, directionWeights: { bottom: 32, top: 20, left: 22, right: 22, around: 4 } },
    ],
  },
  {
    start: 360, end: 420,
    note: 'Stage2: 雨の本番。群れが四方から収束する。',
    spawns: [
      { enemyId: 'night_haze', spawnRatePerSecond: 0.82, maxAlive: 40, directionWeights: { bottom: 22, top: 24, left: 24, right: 24, around: 6 } },
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.85, maxAlive: 44, directionWeights: { bottom: 26, top: 22, left: 24, right: 24, around: 4 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.24, maxAlive: 16, directionWeights: { bottom: 20, top: 20, left: 26, right: 26, around: 8 } },
    ],
  },
  {
    start: 420, end: 421,
    note: 'Stage2: エリート3。雨影の集結。',
    spawns: [
      { enemyId: 'black_label_shadow', spawnCount: 1, directionWeights: { bottom: 40, top: 20, left: 20, right: 20 } },
    ],
  },
  {
    start: 421, end: 470,
    note: 'Stage2: クライマックス。雨と影の全方向包囲。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.05, maxAlive: 52, directionWeights: { bottom: 26, top: 22, left: 24, right: 24, around: 4 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.58, maxAlive: 28, directionWeights: { bottom: 16, top: 16, left: 30, right: 30, around: 8 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.42, maxAlive: 22, directionWeights: { bottom: 18, top: 18, left: 28, right: 28, around: 8 } },
      { enemyId: 'night_haze', spawnRatePerSecond: 0.95, maxAlive: 50, directionWeights: { bottom: 22, top: 24, left: 24, right: 24, around: 6 } },
    ],
  },
  {
    start: 470, end: 480,
    note: 'Stage2: 最後の豪雨。止む前の一番激しい雨。',
    spawns: [
      { enemyId: 'night_haze', spawnRatePerSecond: 1.35, maxAlive: 66, directionWeights: { bottom: 22, top: 24, left: 24, right: 24, around: 6 } },
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.15, maxAlive: 58, directionWeights: { bottom: 24, top: 22, left: 24, right: 24, around: 6 } },
    ],
  },
];

export const stage2Waves: WaveDefinition[] = rawStage2Waves.map((wave) => ({
  ...wave,
  spawns: wave.spawns.map(withPrimaryPattern),
}));

function stage3DirectionWeights(weights: WaveSpawnDefinition['directionWeights']): WaveSpawnDefinition['directionWeights'] {
  return {
    bottom: Math.max(18, Math.round((weights.bottom ?? 0) * 0.58)),
    top: Math.round((weights.top ?? 0) * 1.38 + 8),
    left: Math.round((weights.left ?? 0) * 1.28 + 5),
    right: Math.round((weights.right ?? 0) * 1.28 + 5),
    around: Math.round((weights.around ?? 0) + 16),
  };
}

function stage3Spawn(spawn: WaveSpawnDefinition, waveIndex: number): WaveSpawnDefinition {
  const pressure = 1.16 + Math.min(0.24, waveIndex * 0.016);
  const patternBonus = spawn.patternId === 'charge.tellLine' || spawn.patternId === 'orbit.player' || spawn.patternId === 'chase.swarm'
    ? 1.12
    : 1;
  return {
    ...spawn,
    spawnRatePerSecond: spawn.spawnRatePerSecond == null
      ? undefined
      : Number((spawn.spawnRatePerSecond * pressure * patternBonus).toFixed(2)),
    maxAlive: spawn.maxAlive == null ? undefined : Math.ceil(spawn.maxAlive * 1.22 * patternBonus),
    directionWeights: stage3DirectionWeights(spawn.directionWeights),
  };
}

export const stage3Waves: WaveDefinition[] = waves.map((wave, index) => ({
  ...wave,
  note: `Stage3: ${wave.note}`,
  spawns: wave.spawns.map((spawn) => stage3Spawn(spawn, index)),
}));

function stage4DirectionWeights(weights: WaveSpawnDefinition['directionWeights']): WaveSpawnDefinition['directionWeights'] {
  return {
    bottom: Math.max(14, Math.round((weights.bottom ?? 0) * 0.46)),
    top: Math.round((weights.top ?? 0) * 1.55 + 10),
    left: Math.round((weights.left ?? 0) * 1.42 + 7),
    right: Math.round((weights.right ?? 0) * 1.42 + 7),
    around: Math.round((weights.around ?? 0) + 22),
  };
}

function stage4Spawn(spawn: WaveSpawnDefinition, waveIndex: number): WaveSpawnDefinition {
  const pressure = 1.24 + Math.min(0.3, waveIndex * 0.018);
  const patternBonus = spawn.patternId === 'charge.tellLine' || spawn.patternId === 'chase.swarm'
    ? 1.18
    : spawn.patternId === 'orbit.player'
      ? 1.12
      : 1;
  return {
    ...spawn,
    spawnRatePerSecond: spawn.spawnRatePerSecond == null
      ? undefined
      : Number((spawn.spawnRatePerSecond * pressure * patternBonus).toFixed(2)),
    maxAlive: spawn.maxAlive == null ? undefined : Math.ceil(spawn.maxAlive * 1.32 * patternBonus),
    directionWeights: stage4DirectionWeights(spawn.directionWeights),
  };
}

export const stage4Waves: WaveDefinition[] = waves.map((wave, index) => ({
  ...wave,
  note: `Stage4: ${wave.note}`,
  spawns: wave.spawns.map((spawn) => stage4Spawn(spawn, index)),
}));

function stage5DirectionWeights(weights: WaveSpawnDefinition['directionWeights']): WaveSpawnDefinition['directionWeights'] {
  return {
    bottom: Math.max(10, Math.round((weights.bottom ?? 0) * 0.36)),
    top: Math.round((weights.top ?? 0) * 1.72 + 12),
    left: Math.round((weights.left ?? 0) * 1.6 + 10),
    right: Math.round((weights.right ?? 0) * 1.6 + 10),
    around: Math.round((weights.around ?? 0) + 30),
  };
}

function stage5Spawn(spawn: WaveSpawnDefinition, waveIndex: number): WaveSpawnDefinition {
  const pressure = 1.32 + Math.min(0.36, waveIndex * 0.022);
  const patternBonus = spawn.patternId === 'chase.swarm'
    ? 1.25
    : spawn.patternId === 'charge.tellLine' || spawn.patternId === 'orbit.player'
      ? 1.18
      : 1;
  return {
    ...spawn,
    spawnRatePerSecond: spawn.spawnRatePerSecond == null
      ? undefined
      : Number((spawn.spawnRatePerSecond * pressure * patternBonus).toFixed(2)),
    maxAlive: spawn.maxAlive == null ? undefined : Math.ceil(spawn.maxAlive * 1.45 * patternBonus),
    directionWeights: stage5DirectionWeights(spawn.directionWeights),
  };
}

export const stage5Waves: WaveDefinition[] = waves.map((wave, index) => ({
  ...wave,
  note: `Stage5: ${wave.note}`,
  spawns: wave.spawns.map((spawn) => stage5Spawn(spawn, index)),
}));

const allowedStagePatterns = ['chase.basic', 'charge.tellLine', 'orbit.player', 'retreat.shooter', 'chase.swarm', 'chase.slowHeavy'];

const stage1Recipe: StageRecipe = {
  stageNumber: 1,
  id: 'stage.1.memory-road',
  name: '忘れ物の夜道',
  theme: '基本追尾・突進・回り込みを覚える導入ステージ',
  allowedPatternIds: allowedStagePatterns,
  waves,
};

const stage2Recipe: StageRecipe = {
  stageNumber: 2,
  id: 'stage.2.ink-map',
  name: 'にじむ地図帳',
  theme: 'Stage1の構成を保ちつつ、出現方向と密度で包囲感を上げるステージ',
  allowedPatternIds: allowedStagePatterns,
  waves: stage2Waves,
};

const stage3Recipe: StageRecipe = {
  stageNumber: 3,
  id: 'stage.3.lost-crossing',
  name: '迷子の交差点',
  theme: '上下左右と周囲湧きを増やし、突進・回り込み・群れで逃げ道を揺さぶるステージ',
  allowedPatternIds: allowedStagePatterns,
  waves: stage3Waves,
};

const stage4Recipe: StageRecipe = {
  stageNumber: 4,
  id: 'stage.4.black-corridor',
  name: '黒い回廊',
  theme: '左右と周囲湧きで道幅を削り、突進と群れの圧を強めるステージ',
  allowedPatternIds: allowedStagePatterns,
  waves: stage4Waves,
};

const stage5Recipe: StageRecipe = {
  stageNumber: 5,
  id: 'stage.5.dawn-garden',
  name: '夜明け前の黒曜庭',
  theme: '全方向から押し寄せる終盤ステージ。範囲火力と移動判断を要求する',
  allowedPatternIds: allowedStagePatterns,
  waves: stage5Waves,
};

export const stageRecipes: StageRecipe[] = [stage1Recipe, stage2Recipe, stage3Recipe, stage4Recipe, stage5Recipe];

export function recipeForStage(stageNumber: number): StageRecipe {
  if (stageNumber >= 5) return stage5Recipe;
  if (stageNumber >= 4) return stage4Recipe;
  if (stageNumber >= 3) return stage3Recipe;
  if (stageNumber >= 2) return stage2Recipe;
  return stage1Recipe;
}

export function wavesForStage(stageNumber: number): WaveDefinition[] {
  return recipeForStage(stageNumber).waves;
}
