import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RuntimeState } from '../runtime';
import { createDefaultProfile, saveProfile, settleRunProgress } from '../persistence/profile';
import { loadCollectionProgress } from '../persistence/collection';
import { settleCollectionProgress } from './collectionProgress';

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

function makeState(input: {
  kills: number;
  fragments: number;
  survivedSec: number;
  level?: number;
}): RuntimeState {
  return {
    status: 'playing',
    stageNumber: 1,
    explorationDepth: 'shallow',
    characterId: 'yui',
    player: {
      hp: 100,
      maxHp: 100,
      level: input.level ?? 1,
    },
    inventory: {
      weapons: [{ id: 'night_pencil', level: 1, cooldownRemaining: 0 }],
      passives: [],
      rareItems: [],
      evolvedWeaponIds: [],
      weaponSlots: 5,
      passiveSlots: 5,
      rareItemSlots: 2,
    },
    stats: {
      kills: input.kills,
      elitesKilled: 0,
      xpCollected: input.fragments,
      memoryFragmentsCollected: input.fragments,
      capsulesOpened: 0,
      evolutions: [],
      ultimateUses: 0,
      pairUltimateUses: 0,
      berserkUses: 0,
      damageTaken: 0,
      levelUps: 0,
      survivedSec: input.survivedSec,
      newCodexEntries: [],
      unlockedAchievements: [],
    },
    telemetry: {
      firstKillSec: null,
      level2Sec: null,
      level3Sec: null,
      firstDamageSec: null,
      firstCapsuleSec: null,
      eliteKillSecs: [],
    },
  } as unknown as RuntimeState;
}

describe('Stage1 fs019 actual run currency integration', () => {
  beforeEach(() => {
    vi.stubGlobal('window', fakeWindow());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('精算済み1ラン獲得額が100以上ならfs019を達成する', () => {
    saveProfile(createDefaultProfile());
    const state = makeState({ kills: 40, fragments: 40, survivedSec: 480, level: 10 });
    const runSettlement = settleRunProgress(state, true);
    expect(runSettlement.currencyEarned).toBeGreaterThanOrEqual(100);

    const collectionSettlement = settleCollectionProgress(state, true);
    expect(collectionSettlement.newlyCompleted.map((cell) => cell.id)).toContain(
      'fs_019_collect_100_light_coin',
    );
    expect(loadCollectionProgress().nightBoard.completedCellIds).toContain(
      'fs_019_collect_100_light_coin',
    );
  });

  it('wallet残高が大きくても今回の獲得額が100未満なら達成しない', () => {
    saveProfile({ ...createDefaultProfile(), currency: 10000, totalCurrencyEarned: 10000 });
    const state = makeState({ kills: 0, fragments: 0, survivedSec: 1, level: 1 });
    const runSettlement = settleRunProgress(state, false);
    expect(runSettlement.currencyEarned).toBeLessThan(100);

    const collectionSettlement = settleCollectionProgress(state, false);
    expect(collectionSettlement.newlyCompleted.map((cell) => cell.id)).not.toContain(
      'fs_019_collect_100_light_coin',
    );
    expect(loadCollectionProgress().nightBoard.completedCellIds).not.toContain(
      'fs_019_collect_100_light_coin',
    );
  });
});
