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
  painPoints: string;
};

/** エリート（黒ラベルの影）の出現窓内に撃破があったか。spawn: 180/300/420秒。 */
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
    elite3mKilled: eliteKilledInWindow(t.eliteKillSecs, 170, 300),
    elite5mKilled: eliteKilledInWindow(t.eliteKillSecs, 300, 420),
    elite7mKilled: eliteKilledInWindow(t.eliteKillSecs, 420, 600),
    finalLevel: state.player.level,
    kills: state.stats.kills,
    pickedWeapons: state.inventory.weapons.map((w) => w.id),
    pickedPassives: state.inventory.passives.map((p) => p.id),
    evolvedWeapons: [...state.stats.evolutions],
    painPoints: '',
  };
}
