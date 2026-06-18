import { describe, expect, it } from 'vitest';
import {
  ELITE_WARNING_LEAD_SEC,
  ELITE_WARNING_STARTS,
  FINAL_COUNTDOWN_SEC,
  finalCountdownValue,
} from './runPacingEffects';

describe('run pacing effects', () => {
  it('エリート予告時刻を現在のウェーブに合わせる', () => {
    expect(ELITE_WARNING_STARTS).toEqual([150, 300, 420]);
    expect(ELITE_WARNING_LEAD_SEC).toBeGreaterThan(0);
  });

  it('ラスト10秒だけ正のカウントを返す', () => {
    expect(FINAL_COUNTDOWN_SEC).toBe(10);
    expect(finalCountdownValue(469.9, 480)).toBeNull();
    expect(finalCountdownValue(470, 480)).toBe(10);
    expect(finalCountdownValue(477.2, 480)).toBe(3);
    expect(finalCountdownValue(479.9, 480)).toBe(1);
    expect(finalCountdownValue(480, 480)).toBeNull();
  });
});
