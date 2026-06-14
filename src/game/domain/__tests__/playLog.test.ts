import { describe, it, expect } from 'vitest';
import type { RuntimeState } from '../../runtime';
import { buildPlayLog, eliteKilledInWindow } from '../playLog';

describe('eliteKilledInWindow', () => {
  it('窓内の撃破を検出（end は含まない）', () => {
    expect(eliteKilledInWindow([185], 170, 300)).toBe(true);
    expect(eliteKilledInWindow([300], 170, 300)).toBe(false);
    expect(eliteKilledInWindow([], 170, 300)).toBe(false);
  });
});

describe('buildPlayLog', () => {
  it('テレメトリ/在庫から固定スキーマのログを作る', () => {
    const state = {
      runId: 'rtest',
      elapsedSec: 254.4,
      characterId: 'yui',
      player: { level: 12 },
      stats: { kills: 320, survivedSec: 254.4, evolutions: ['unfinished_line'] },
      telemetry: {
        firstKillSec: 3.2,
        level2Sec: 41.7,
        firstDamageSec: 22.0,
        firstCapsuleSec: 182.5,
        eliteKillSecs: [185.0, 305.0],
      },
      inventory: {
        weapons: [
          { id: 'unfinished_line', level: 1, cooldownRemaining: 0 },
          { id: 'marble', level: 3, cooldownRemaining: 0 },
        ],
        passives: [{ id: 'travel_badge', level: 2 }],
      },
    } as unknown as RuntimeState;

    const log = buildPlayLog(state, false);
    expect(log.runId).toBe('rtest');
    expect(log.survivedSec).toBe(254.4);
    expect(log.cleared).toBe(false);
    expect(log.level2Sec).toBe(41.7);
    expect(log.elite3mKilled).toBe(true); // 185 in [170,300)
    expect(log.elite5mKilled).toBe(true); // 305 in [300,420)
    expect(log.elite7mKilled).toBe(false);
    expect(log.finalLevel).toBe(12);
    expect(log.kills).toBe(320);
    expect(log.pickedWeapons).toEqual(['unfinished_line', 'marble']);
    expect(log.pickedPassives).toEqual(['travel_badge']);
    expect(log.evolvedWeapons).toEqual(['unfinished_line']);
    // 人間記入欄は空で出力される
    expect(log.goodPoints).toBe('');
    expect(log.painPoints).toBe('');
  });
});
