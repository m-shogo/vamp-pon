import { describe, expect, it } from 'vitest';
import {
  currentMetaCurrencyDisplayName,
  formatMetaCurrencyAmount,
  formatMetaCurrencyGain,
  formatMetaCurrencyReturn,
} from './metaCurrencyDisplay';

describe('meta currency display formatter', () => {
  it('Human approval前はCurrent表示の黒曜片を使う', () => {
    expect(currentMetaCurrencyDisplayName()).toBe('黒曜片');
    expect(currentMetaCurrencyDisplayName()).not.toBe('灯貨');
  });

  it('amount・gain・return表示を一つのlabel sourceから作る', () => {
    expect(formatMetaCurrencyAmount(123.9)).toBe('黒曜片 123');
    expect(formatMetaCurrencyGain(25)).toBe('黒曜片 +25');
    expect(formatMetaCurrencyGain(25, '実績')).toBe('実績 黒曜片 +25');
    expect(formatMetaCurrencyReturn(10)).toBe('黒曜片が少し戻った +10');
  });

  it('不正値と負数を0へ正規化する', () => {
    expect(formatMetaCurrencyAmount(Number.NaN)).toBe('黒曜片 0');
    expect(formatMetaCurrencyGain(-1)).toBe('黒曜片 +0');
    expect(formatMetaCurrencyReturn(Number.POSITIVE_INFINITY)).toBe('黒曜片が少し戻った +0');
  });
});
