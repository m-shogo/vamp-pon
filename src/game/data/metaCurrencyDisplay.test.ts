import { describe, expect, it } from 'vitest';
import {
  currentMetaCurrencyDisplayName,
  formatMetaCurrencyAmount,
  formatMetaCurrencyCarryHome,
  formatMetaCurrencyGain,
  formatMetaCurrencyGrowthIntro,
  formatMetaCurrencyInsufficient,
  formatMetaCurrencyRefund,
  formatMetaCurrencyReturn,
  formatMetaCurrencyUpgradeDescription,
  formatMetaCurrencyUpgradeName,
  formatMetaCurrencyUseCta,
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

  it('StageSelect・Result・初回案内に必要な通貨文を共通sourceから作る', () => {
    expect(formatMetaCurrencyGrowthIntro()).toBe('黒曜片で強化して次の夜に備える');
    expect(formatMetaCurrencyInsufficient()).toBe('黒曜片が足りない — 探索で集めよう');
    expect(formatMetaCurrencyRefund(45)).toBe('黒曜片 45 を全額返還します。');
    expect(formatMetaCurrencyCarryHome()).toBe('黒曜片は持ち帰れる。');
    expect(formatMetaCurrencyUseCta()).toBe('黒曜片を使う');
    expect(formatMetaCurrencyUpgradeName()).toBe('黒曜片の目印');
    expect(formatMetaCurrencyUpgradeDescription()).toBe('黒曜片の獲得量が増える');
  });

  it('不正値と負数を0へ正規化する', () => {
    expect(formatMetaCurrencyAmount(Number.NaN)).toBe('黒曜片 0');
    expect(formatMetaCurrencyGain(-1)).toBe('黒曜片 +0');
    expect(formatMetaCurrencyReturn(Number.POSITIVE_INFINITY)).toBe('黒曜片が少し戻った +0');
    expect(formatMetaCurrencyRefund(-50)).toBe('黒曜片 0 を全額返還します。');
  });
});
