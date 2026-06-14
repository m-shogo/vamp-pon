import type { WaveDefinition } from '../domain/types';

/**
 * 8分（480秒）ウェーブ。docs/44・docs/82 のタイムライン準拠。
 * エリート（黒ラベルの影）は 3:00 / 5:00 / 7:00 に出現。
 * spawnRatePerSecond は暫定値。プレイテストで調整する。
 */
export const waves: WaveDefinition[] = [
  {
    start: 0,
    end: 30,
    note: '操作確認。最初の気持ちよさ。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.6, maxAlive: 18, directionWeights: { bottom: 70, top: 10, left: 10, right: 10 } },
    ],
  },
  {
    start: 30,
    end: 60,
    note: '最初のレベルアップを目指す。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.9, maxAlive: 26, directionWeights: { bottom: 70, top: 10, left: 10, right: 10 } },
    ],
  },
  {
    start: 60,
    end: 90,
    note: '基本敵の密度を上げる。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.1, maxAlive: 34, directionWeights: { bottom: 65, top: 15, left: 10, right: 10 } },
    ],
  },
  {
    start: 90,
    end: 150,
    note: '速い敵の導入。少し忙しくする。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.0, maxAlive: 36, directionWeights: { bottom: 60, top: 15, left: 12, right: 13 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.45, maxAlive: 14, directionWeights: { bottom: 60, top: 20, left: 10, right: 10 } },
    ],
  },
  {
    start: 150,
    end: 180,
    note: '初ピンチ。紙くず多め。',
    spawns: [
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.85, maxAlive: 24, directionWeights: { bottom: 55, top: 20, left: 12, right: 13 } },
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.7, maxAlive: 30, directionWeights: { bottom: 55, top: 15, left: 15, right: 15 } },
    ],
  },
  {
    start: 180,
    end: 181,
    note: 'エリート1。初カプセル機会。',
    spawns: [
      { enemyId: 'black_label_shadow', spawnCount: 1, directionWeights: { bottom: 100 } },
    ],
  },
  {
    start: 181,
    end: 240,
    note: '迷子の方角導入。回り込みで単調さを崩す。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.9, maxAlive: 38, directionWeights: { bottom: 55, top: 20, left: 12, right: 13 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.28, maxAlive: 12, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
    ],
  },
  {
    start: 240,
    end: 300,
    note: '黒いカプセル導入。火力チェック。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.9, maxAlive: 42, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'paper_scrap_shadow', spawnRatePerSecond: 0.4, maxAlive: 16, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'black_capsule', spawnRatePerSecond: 0.13, maxAlive: 5, directionWeights: { bottom: 60, top: 20, left: 10, right: 10 } },
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
    note: 'ビルド差が見える時間。',
    spawns: [
      { enemyId: 'ink_shadow', spawnRatePerSecond: 1.0, maxAlive: 48, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
      { enemyId: 'lost_direction', spawnRatePerSecond: 0.35, maxAlive: 18, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
      { enemyId: 'black_capsule', spawnRatePerSecond: 0.16, maxAlive: 7, directionWeights: { bottom: 50, top: 20, left: 15, right: 15 } },
    ],
  },
  {
    start: 360,
    end: 420,
    note: '夜のもや導入。群れ圧力。',
    spawns: [
      { enemyId: 'night_haze', spawnRatePerSecond: 0.7, maxAlive: 34, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
      { enemyId: 'ink_shadow', spawnRatePerSecond: 0.8, maxAlive: 44, directionWeights: { bottom: 45, top: 20, left: 18, right: 17 } },
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
