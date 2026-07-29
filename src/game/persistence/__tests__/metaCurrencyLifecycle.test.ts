import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RuntimeState } from '../../runtime';
import {
  buyUpgrade,
  createDefaultProfile,
  loadProfile,
  resetUpgrades,
  saveProfile,
  settleRunProgress,
  upgradeCost,
} from '../profile';
import { settleCollectionProgress } from '../../systems/collectionProgress';
import { formatMetaCurrencyAmount } from '../../data/metaCurrencyDisplay';

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

function makeState(): RuntimeState {
  return {
    status: 'playing',
    stageNumber: 1,
    explorationDepth: 'shallow',
    characterId: 'yui',
    player: {
      hp: 100,
      maxHp: 100,
      level: 10,
    },
    inventory: {
      weapons: [{ id: 'night_pencil', level: 5, cooldownRemaining: 0 }],
      passives: [],
      rareItems: [],
      evolvedWeaponIds: [],
      weaponSlots: 5,
      passiveSlots: 5,
      rareItemSlots: 2,
    },
    stats: {
      kills: 40,
      elitesKilled: 0,
      xpCollected: 40,
      memoryFragmentsCollected: 40,
      capsulesOpened: 0,
      evolutions: [],
      ultimateUses: 0,
      pairUltimateUses: 0,
      berserkUses: 0,
      damageTaken: 0,
      levelUps: 9,
      survivedSec: 480,
      newCodexEntries: [],
      unlockedAchievements: [],
    },
    telemetry: {
      firstKillSec: 2,
      level2Sec: 20,
      level3Sec: 42,
      firstDamageSec: null,
      firstCapsuleSec: null,
      eliteKillSecs: [],
    },
  } as unknown as RuntimeState;
}

describe('meta currency lifecycle', () => {
  beforeEach(() => {
    vi.stubGlobal('window', fakeWindow());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('保存→購入→返還で残高とstable fieldを壊さない', () => {
    const initial = createDefaultProfile();
    initial.currency = 1000;
    initial.totalCurrencyEarned = 1000;
    saveProfile(initial);

    const cost = upgradeCost('maxHp', 0);
    const purchased = buyUpgrade('maxHp');
    expect(purchased.currency).toBe(1000 - cost);
    expect(purchased.totalCurrencyEarned).toBe(1000);
    expect(purchased.upgrades.maxHp).toBe(1);

    const refunded = resetUpgrades();
    expect(refunded.currency).toBe(1000);
    expect(refunded.totalCurrencyEarned).toBe(1000);
    expect(refunded.upgrades.maxHp).toBe(0);

    const reloaded = loadProfile();
    expect(reloaded.currency).toBe(1000);
    expect(reloaded.totalCurrencyEarned).toBe(1000);
    expect(formatMetaCurrencyAmount(reloaded.currency)).toBe('黒曜片 1000');
  });

  it('ラン精算→実績報酬→Collection報酬を順番どおり一つのwalletへ加算する', () => {
    saveProfile(createDefaultProfile());
    const state = makeState();

    const run = settleRunProgress(state, true);
    const afterRun = loadProfile();
    expect(afterRun.currency).toBe(run.currencyEarned + run.achievementReward);
    expect(afterRun.totalCurrencyEarned).toBe(run.currencyEarned + run.achievementReward);

    const collection = settleCollectionProgress(state, true);
    const afterCollection = loadProfile();
    expect(afterCollection.currency).toBe(
      run.currencyEarned + run.achievementReward + collection.lightCoinReward,
    );
    expect(afterCollection.totalCurrencyEarned).toBe(afterCollection.currency);

    const reloaded = loadProfile();
    expect(reloaded.currency).toBe(afterCollection.currency);
    expect(reloaded.totalCurrencyEarned).toBe(afterCollection.totalCurrencyEarned);
  });

  it('同じCollection達成を再精算しても通貨報酬を二重加算しない', () => {
    saveProfile(createDefaultProfile());
    const state = makeState();
    settleRunProgress(state, true);

    const firstCollection = settleCollectionProgress(state, true);
    expect(firstCollection.lightCoinReward).toBeGreaterThan(0);
    const afterFirst = loadProfile();

    const secondCollection = settleCollectionProgress(state, true);
    expect(secondCollection.lightCoinReward).toBe(0);
    const afterSecond = loadProfile();
    expect(afterSecond.currency).toBe(afterFirst.currency);
    expect(afterSecond.totalCurrencyEarned).toBe(afterFirst.totalCurrencyEarned);
  });
});
