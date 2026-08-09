import { describe, expect, it } from 'vitest';
import {
  CURRENT_KEEPER_HEADER,
  LEGACY_KEEPER_HEADER,
  normalizeCollectionDisplayTerm,
} from '../data/collectionDisplayTerms';

describe('collection display term normalization', () => {
  it('灯し手headerのLegacy略称だけを黒耀化へ直す', () => {
    expect(normalizeCollectionDisplayTerm(LEGACY_KEEPER_HEADER)).toBe(CURRENT_KEEPER_HEADER);
    expect(CURRENT_KEEPER_HEADER).toContain('黒耀化');
    expect(CURRENT_KEEPER_HEADER).not.toContain('黒曜・');
  });

  it('Enemy名・黒曜片・黒曜研究所など別判断の文字列は変更しない', () => {
    const untouched = [
      'くろよオンブロを初めてほどく',
      '黒曜片 100',
      '黒曜研究所',
      'くすんだ灯貨',
    ];
    for (const value of untouched) {
      expect(normalizeCollectionDisplayTerm(value)).toBe(value);
    }
  });
});
