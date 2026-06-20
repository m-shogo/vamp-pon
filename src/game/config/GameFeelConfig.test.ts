import { describe, expect, it } from 'vitest';
import { enemyDensityMultiplierForTime, maxEnemiesForElapsed } from './GameFeelConfig';

describe('GameFeelConfig', () => {
  it('時間帯ごとの敵密度倍率を返す', () => {
    expect(enemyDensityMultiplierForTime(0)).toBe(1.5);
    expect(enemyDensityMultiplierForTime(60)).toBe(2);
    expect(enemyDensityMultiplierForTime(180)).toBe(2.5);
    expect(enemyDensityMultiplierForTime(420)).toBe(3);
  });

  it('表示用capも実効hard capを超えない', () => {
    expect(maxEnemiesForElapsed(0, 140).hard).toBeLessThanOrEqual(140);
    expect(maxEnemiesForElapsed(480, 140).hard).toBeLessThanOrEqual(140);
    expect(maxEnemiesForElapsed(480, 140).soft).toBeLessThanOrEqual(maxEnemiesForElapsed(480, 140).hard);
  });
});
