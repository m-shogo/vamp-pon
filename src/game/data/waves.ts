import type { WaveDefinition } from '../domain/types';

/**
 * 8分（480秒）ウェーブ。docs/44・docs/82 のタイムライン準拠。
 * エリート（オンブロ・黒ラベル）は 2:30 / 5:00 / 7:00 に出現。
 * 方針: HPを硬くするのではなく、倒す・避ける・追う・囲まれる役割差でテンポを作る。
 */
export const waves: WaveDefinition[] = [
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
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.18, maxAlive: 5, directionWeights: { bottom: 60, top: 20, left: 10, right: 10 } },
    ],
  },
  {
    start: 45,
    end: 75,
    note: 'Lv2〜3まで寂しくしない。追尾・突進・回り込みを混ぜる。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.15, maxAlive: 34, directionWeights: { bottom: 60, top: 15, left: 12, right: 13 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.24, maxAlive: 7, directionWeights: { bottom: 55, top: 20, left: 12, right: 13 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.08, maxAlive: 3, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
    ],
  },
  {
    start: 75,
    end: 120,
    note: '回り込みを本格導入。敵数だけでなく逃げ道の作り方を変える。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.05, maxAlive: 36, directionWeights: { bottom: 55, top: 20, left: 12, right: 13 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.34, maxAlive: 10, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.18, maxAlive: 8, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
    ],
  },
  {
    start: 120,
    end: 150,
    note: '追う報酬敵を導入。逃げる黒カプセルでプレイヤーに小目標を渡す。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.95, maxAlive: 34, directionWeights: { bottom: 55, top: 20, left: 12, right: 13 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.32, maxAlive: 10, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'black_capsule', spawnRatePerSecond: 0.07, maxAlive: 2, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
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
