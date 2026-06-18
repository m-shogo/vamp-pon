import { describe, expect, it } from 'vitest';
import { enemyById } from './enemies';
import { waves } from './waves';

describe('Stage1 wave integrity', () => {
  it('0秒から480秒まで隙間なく時系列でつながる', () => {
    expect(waves[0]?.start).toBe(0);
    expect(waves[waves.length - 1]?.end).toBe(480);

    for (let index = 0; index < waves.length; index += 1) {
      const wave = waves[index];
      expect(wave.start).toBeLessThan(wave.end);
      if (index > 0) expect(wave.start).toBe(waves[index - 1].end);
    }
  });

  it('すべてのスポーンが定義済みの敵と正の数値を参照する', () => {
    for (const wave of waves) {
      for (const spawn of wave.spawns) {
        expect(enemyById.has(spawn.enemyId)).toBe(true);
        if (spawn.spawnCount != null) expect(spawn.spawnCount).toBeGreaterThan(0);
        if (spawn.spawnRatePerSecond != null) expect(spawn.spawnRatePerSecond).toBeGreaterThan(0);
        if (spawn.maxAlive != null) expect(spawn.maxAlive).toBeGreaterThan(0);
      }
    }
  });

  it('エリートを150秒・300秒・420秒に一度ずつ配置する', () => {
    const eliteStarts = waves
      .filter((wave) => wave.spawns.some((spawn) => spawn.enemyId === 'black_label_shadow' && spawn.spawnCount === 1))
      .map((wave) => wave.start);

    expect(eliteStarts).toEqual([150, 300, 420]);
  });

  it('150秒までに基本・突進・回り込み・報酬敵が登場する', () => {
    const earlyEnemyIds = new Set(
      waves
        .filter((wave) => wave.start < 150)
        .flatMap((wave) => wave.spawns.map((spawn) => spawn.enemyId)),
    );

    expect(earlyEnemyIds.has('ink_shadow')).toBe(true);
    expect(earlyEnemyIds.has('paper_scrap_shadow')).toBe(true);
    expect(earlyEnemyIds.has('lost_direction')).toBe(true);
    expect(earlyEnemyIds.has('black_capsule')).toBe(true);
  });
});
