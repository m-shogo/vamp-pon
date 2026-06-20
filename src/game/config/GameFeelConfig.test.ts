import { describe, expect, it } from 'vitest';
import { DEFAULT_GAME_CONFIG } from '../domain/constants';
import { enemyDensityMultiplierForTime, GAME_FEEL_CONFIG, maxEnemiesForElapsed } from './GameFeelConfig';

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

  it('soft/hard が物理上限 DEFAULT_GAME_CONFIG.maxEnemies を超えない', () => {
    // config 上の hardCap が物理上限より大きいと、SpawnSystem が想定外の敵数で動く。
    // 上限を伸ばす時は両方を揃えて上げるための保険テスト。
    expect(GAME_FEEL_CONFIG.maxEnemiesSoftCap).toBeLessThanOrEqual(DEFAULT_GAME_CONFIG.maxEnemies);
    expect(GAME_FEEL_CONFIG.maxEnemiesHardCap).toBeLessThanOrEqual(DEFAULT_GAME_CONFIG.maxEnemies);
    const lateCap = maxEnemiesForElapsed(900, DEFAULT_GAME_CONFIG.maxEnemies);
    expect(lateCap.hard).toBeLessThanOrEqual(DEFAULT_GAME_CONFIG.maxEnemies);
  });
});
