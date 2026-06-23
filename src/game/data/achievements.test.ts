import { describe, expect, it } from 'vitest';
import { ACHIEVEMENT_DEFS, getAchievementDef, achievementRewardAmount } from './achievements';

describe('ACHIEVEMENT_DEFS', () => {
  it('IDがすべてユニーク', () => {
    const ids = ACHIEVEMENT_DEFS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('報酬がすべて正の値', () => {
    for (const def of ACHIEVEMENT_DEFS) {
      expect(def.reward).toBeGreaterThan(0);
    }
  });

  it('titleとdescriptionが空でない', () => {
    for (const def of ACHIEVEMENT_DEFS) {
      expect(def.title.length).toBeGreaterThan(0);
      expect(def.description.length).toBeGreaterThan(0);
    }
  });

  it('categoryが有効値', () => {
    const valid = new Set(['stage', 'combat', 'build', 'challenge']);
    for (const def of ACHIEVEMENT_DEFS) {
      expect(valid.has(def.category)).toBe(true);
    }
  });

  it('getAchievementDefが存在するIDを返す', () => {
    expect(getAchievementDef('clear:s1:shallow')?.title).toBe('初めての夜明け');
    expect(getAchievementDef('unknown-id')).toBeUndefined();
  });

  it('achievementRewardAmountが正しい値を返す', () => {
    expect(achievementRewardAmount('clear:s1:shallow')).toBe(40);
    expect(achievementRewardAmount('unknown-id')).toBe(0);
  });
});
