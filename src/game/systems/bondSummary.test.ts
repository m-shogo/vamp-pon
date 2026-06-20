import { describe, expect, it } from 'vitest';
import { pairKey } from '../data/characterRelationshipDesign';
import { bondLevelLabel, bondSummaryForPair } from './bondSummary';
import type { BondProgressState } from './bondProgress';

describe('bondSummary', () => {
  it('未選択なら空サマリーを返す', () => {
    const summary = bondSummaryForPair('yui', undefined, { pairs: {} });
    expect(summary.level).toBe(0);
    expect(summary.unlocks).toEqual([]);
    expect(summary.pairUltimate).toBeNull();
  });

  it('好感度Lvと次Lvまでを返す', () => {
    const progress: BondProgressState = {
      pairs: {
        [pairKey('yui', 'asa')]: {
          pairKey: pairKey('yui', 'asa'),
          points: 80,
          level: 3,
          seenTalkIds: [],
        },
      },
    };
    const summary = bondSummaryForPair('yui', 'asa', progress);
    expect(summary.subCharacterName).toBe('アサ');
    expect(summary.level).toBe(3);
    expect(summary.pointsToNextLevel).toBe(70);
    expect(summary.subEffect?.id).toBe('sub_ultimate');
    expect(summary.pairUltimate?.ready).toBe(false);
  });

  it('Lv4以上ならペア必殺をreadyにする', () => {
    const progress: BondProgressState = {
      pairs: {
        [pairKey('yui', 'asa')]: {
          pairKey: pairKey('yui', 'asa'),
          points: 150,
          level: 4,
          seenTalkIds: [],
        },
      },
    };
    const summary = bondSummaryForPair('yui', 'asa', progress);
    expect(summary.pairUltimate?.id).toBe('yui_asa_two_lanterns');
    expect(summary.pairUltimate?.ready).toBe(true);
  });

  it('好感度ラベルを返す', () => {
    expect(bondLevelLabel(0)).toBe('未同行');
    expect(bondLevelLabel(2)).toBe('Lv2');
    expect(bondLevelLabel(5)).toBe('Lv5 / 最大');
  });
});
