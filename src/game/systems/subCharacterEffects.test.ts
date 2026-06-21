import { describe, expect, it } from 'vitest';
import { pairKey } from '../data/characterRelationshipDesign';
import { subCharacterBattleBonuses } from './subCharacterEffects';
import type { BondProgressState } from './bondProgress';

describe('subCharacterEffects', () => {
  it('サブキャラ未選択なら空ボーナス', () => {
    const bonuses = subCharacterBattleBonuses('yui', undefined, { pairs: {} });
    expect(bonuses.hpMultiplier).toBe(1);
    expect(bonuses.bondLevel).toBe(0);
  });

  it('同一キャラなら空ボーナス', () => {
    const bonuses = subCharacterBattleBonuses('yui', 'yui', { pairs: {} });
    expect(bonuses.xpMultiplier).toBe(1);
    expect(bonuses.effectId).toBeUndefined();
  });

  it('ユイをサブにすると経験値ボーナスを返す', () => {
    const state: BondProgressState = {
      pairs: {
        [pairKey('asa', 'yui')]: {
          pairKey: pairKey('asa', 'yui'),
          points: 0,
          level: 1,
          seenTalkIds: [],
        },
      },
    };
    const bonuses = subCharacterBattleBonuses('asa', 'yui', state);
    expect(bonuses.effectId).toBe('sub_xp');
    expect(bonuses.bondLevel).toBe(1);
    expect(bonuses.xpMultiplier).toBe(1.04);
  });

  it('好感度レベルで効果量が伸びる', () => {
    const state: BondProgressState = {
      pairs: {
        [pairKey('yui', 'asa')]: {
          pairKey: pairKey('yui', 'asa'),
          points: 250,
          level: 5,
          seenTalkIds: [],
        },
      },
    };
    const bonuses = subCharacterBattleBonuses('yui', 'asa', state);
    expect(bonuses.effectId).toBe('sub_ultimate');
    expect(bonuses.bondLevel).toBe(5);
    expect(bonuses.ultimateChargeMultiplier).toBe(1.1);
  });
});
