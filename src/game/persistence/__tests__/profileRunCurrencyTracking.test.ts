import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RuntimeState } from '../../runtime';
import {
  readRunEarnedMetaCurrency,
  STAGE1_RUN_EARNED_META_CURRENCY_TARGET,
} from '../../data/collectionEconomyTerminology';
import {
  createDefaultProfile,
  loadProfile,
  saveProfile,
  settleRunProgress,
} from '../profile';

function fakeWindow() {
  const store = new Map<string, string>();
  return {
    localStorage: {
      getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
      setItem: (key: string, value: string) => { store.set(key, value); },
      removeItem: (key: string) => { store.delete(key); },
      clear: () => store.clear(),
    },
  };
}

function makeState(overrides: {
  kills?: number;
  fragments?: number;
  survivedSec?: number;
  clearedLevel?: number;
} = {}): RuntimeState {
  return {
    status: 'cleared',
    stageNumber: 1,
    explorationDepth: 'shallow',
    characterId: 'yui',
    player: { level: overrides.clearedLevel ?? 10 },
    stats: {
      kills: overrides.kills ?? 40,
      elitesKilled: 0,
      memoryFragmentsCollected: overrides.fragments ?? 40,
      capsulesOpened: 0,
      survivedSec: overrides.survivedSec ?? 480,
      berserkUses: 0,
      evolutions: [],
      pairUltimateUses: 0,
    },
  } as unknown as RuntimeState;
}

describe('run meta currency tracking', () => {
  beforeEach(() => {
    vi.stubGlobal('window', fakeWindow());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('settlement.currencyEarnedとtransient counterが同じ値になる', () => {
    saveProfile(createDefaultProfile());
    const state = makeState();

    expect(readRunEarnedMetaCurrency(state.stats)).toBe(0);
    const settlement = settleRunProgress(state, true);

    expect(readRunEarnedMetaCurrency(state.stats)).toBe(settlement.currencyEarned);
    expect(readRunEarnedMetaCurrency(state.stats)).toBeGreaterThanOrEqual(
      STAGE1_RUN_EARNED_META_CURRENCY_TARGET,
    );
  });

  it('初回実績報酬はrun counterへ混ぜない', () => {
    saveProfile(createDefaultProfile());
    const state = makeState();
    const settlement = settleRunProgress(state, true);
    const profile = loadProfile();

    expect(settlement.achievementReward).toBeGreaterThan(0);
    expect(readRunEarnedMetaCurrency(state.stats)).toBe(settlement.currencyEarned);
    expect(profile.currency).toBe(settlement.currencyEarned + settlement.achievementReward);
    expect(readRunEarnedMetaCurrency(state.stats)).not.toBe(profile.currency);
  });

  it('以前のproxy式なら100相当でも、未精算statsだけでは達成扱いにしない', () => {
    const state = makeState({ kills: 200, fragments: 200 });
    expect(readRunEarnedMetaCurrency(state.stats)).toBe(0);
  });
});
