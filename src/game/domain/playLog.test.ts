import { describe, expect, it } from 'vitest';
import type { RuntimeState } from '../runtime';
import { buildPlayLog, ELITE_WINDOWS, eliteKilledInWindow } from './playLog';

describe('play log elite windows', () => {
  it('初回エリート窓は150秒から始まる', () => {
    expect(ELITE_WINDOWS.m3.start).toBe(150);
    expect(eliteKilledInWindow([149.9], ELITE_WINDOWS.m3.start, ELITE_WINDOWS.m3.end)).toBe(false);
    expect(eliteKilledInWindow([150], ELITE_WINDOWS.m3.start, ELITE_WINDOWS.m3.end)).toBe(true);
  });

  it('150秒台の撃破を初回エリート撃破としてログへ残す', () => {
    const state = {
      runId: 'test-run',
      elapsedSec: 160,
      telemetry: {
        firstKillSec: 1,
        level2Sec: 20,
        firstDamageSec: 30,
        firstCapsuleSec: 155,
        eliteKillSecs: [156],
      },
      stats: {
        survivedSec: 160,
        kills: 100,
        evolutions: [],
      },
      player: { level: 7 },
      inventory: { weapons: [], passives: [] },
    } as RuntimeState;

    expect(buildPlayLog(state, false).elite3mKilled).toBe(true);
  });
});
