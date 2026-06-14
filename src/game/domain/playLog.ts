import type { RuntimeState } from '../runtime';

/**
 * 1プレイのログ（固定スキーマ）。docs/balance-log に貼る素データ。
 * device / painPoints は人が埋める。
 */
export type PlayLog = {
  device: string;
  runId: string;
  survivedSec: number;
  cleared: boolean;
  firstKillSec: number | null;
  level2Sec: number | null;
  firstDamageSec: number | null;
  firstCapsuleSec: number | null;
  elite3mKilled: boolean;
  elite5mKilled: boolean;
  elite7mKilled: boolean;
  finalLevel: number;
  kills: number;
  pickedWeapons: string[];
  pickedPassives: string[];
  evolvedWeapons: string[];
  goodPoints: string;
  painPoints: string;
};

/**
 * エリート（黒ラベルの影）撃破の判定窓 [start, end)。秒。
 * エリート spawn は 180 / 300 / 420 秒。
 * 3分窓だけ手前を 170 とし、3:00 ちょうどのスポーン/撃破のブレ（約10秒）を許容する
 * （180秒より前に撃破は発生しないため実害はない）。
 */
export const ELITE_WINDOWS = {
  m3: { start: 170, end: 300 },
  m5: { start: 300, end: 420 },
  m7: { start: 420, end: 600 },
} as const;

/** エリートの出現窓内に撃破があったか。 */
export function eliteKilledInWindow(secs: number[], start: number, end: number): boolean {
  return secs.some((s) => s >= start && s < end);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round1n(n: number | null): number | null {
  return n === null ? null : round1(n);
}

export function buildPlayLog(state: RuntimeState, cleared: boolean): PlayLog {
  const t = state.telemetry;
  return {
    device: '',
    runId: state.runId,
    survivedSec: round1(state.stats.survivedSec || state.elapsedSec),
    cleared,
    firstKillSec: round1n(t.firstKillSec),
    level2Sec: round1n(t.level2Sec),
    firstDamageSec: round1n(t.firstDamageSec),
    firstCapsuleSec: round1n(t.firstCapsuleSec),
    elite3mKilled: eliteKilledInWindow(t.eliteKillSecs, ELITE_WINDOWS.m3.start, ELITE_WINDOWS.m3.end),
    elite5mKilled: eliteKilledInWindow(t.eliteKillSecs, ELITE_WINDOWS.m5.start, ELITE_WINDOWS.m5.end),
    elite7mKilled: eliteKilledInWindow(t.eliteKillSecs, ELITE_WINDOWS.m7.start, ELITE_WINDOWS.m7.end),
    finalLevel: state.player.level,
    kills: state.stats.kills,
    pickedWeapons: state.inventory.weapons.map((w) => w.id),
    pickedPassives: state.inventory.passives.map((p) => p.id),
    evolvedWeapons: [...state.stats.evolutions],
    goodPoints: '',
    painPoints: '',
  };
}
