import { describe, expect, it } from 'vitest';
import { createDefaultBondProgress, normalizeBondProgress } from './bonds';

describe('bond persistence', () => {
  it('デフォルト好感度保存データを作れる', () => {
    expect(createDefaultBondProgress()).toEqual({ version: 1, pairs: {} });
  });

  it('壊れた入力はデフォルトへ正規化する', () => {
    expect(normalizeBondProgress(null)).toEqual(createDefaultBondProgress());
    expect(normalizeBondProgress('bad')).toEqual(createDefaultBondProgress());
  });

  it('pointsからlevelを再計算し、seenTalkIdsを重複除去する', () => {
    const normalized = normalizeBondProgress({
      version: 1,
      pairs: {
        yui__asa: {
          pairKey: 'wrong',
          points: 160,
          level: 1,
          seenTalkIds: ['talk-1', 'talk-1', 123, 'talk-2'],
        },
      },
    });

    expect(normalized.pairs.yui__asa).toEqual({
      pairKey: 'yui__asa',
      points: 160,
      level: 4,
      seenTalkIds: ['talk-1', 'talk-2'],
    });
  });
});
