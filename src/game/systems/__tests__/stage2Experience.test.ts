import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { stageRecipes, recipeForStage, wavesForStage } from '../../data/waves';
import { createDefaultProfile, loadProfile, saveProfile, settleRunProgress } from '../../persistence/profile';
import type { RuntimeState } from '../../runtime';

function fakeWindow() {
  const store = new Map<string, string>();
  return {
    localStorage: {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => { store.set(k, v); },
      removeItem: (k: string) => { store.delete(k); },
      clear: () => store.clear(),
    },
  };
}

function makeState(opts: {
  stageNumber?: number;
  depth?: RuntimeState['explorationDepth'];
  playerLevel?: number;
  survivedSec?: number;
  kills?: number;
  fragments?: number;
  capsules?: number;
  berserkUses?: number;
}): RuntimeState {
  return {
    stageNumber: opts.stageNumber ?? 1,
    explorationDepth: opts.depth ?? 'shallow',
    characterId: 'yui',
    player: { level: opts.playerLevel ?? 1 },
    stats: {
      kills: opts.kills ?? 0,
      memoryFragmentsCollected: opts.fragments ?? 0,
      capsulesOpened: opts.capsules ?? 0,
      survivedSec: opts.survivedSec ?? 0,
      berserkUses: opts.berserkUses ?? 0,
      evolutions: [],
    },
  } as unknown as RuntimeState;
}

describe('Stage2体験差別化', () => {
  it('Stage2レシピのテーマが「にじむ地図帳」に関連する', () => {
    const recipe = recipeForStage(2);
    expect(recipe.name).toBe('にじむ地図帳');
    expect(recipe.id).toBe('stage.2.ink-map');
  });

  it('Stage2のwaveはStage1と異なる方向重みを持つ', () => {
    const w1 = wavesForStage(1);
    const w2 = wavesForStage(2);
    const s1Dir = w1[0]?.spawns[0]?.directionWeights;
    const s2Dir = w2[0]?.spawns[0]?.directionWeights;
    expect(s2Dir?.left).not.toBe(s1Dir?.left);
    expect(s2Dir?.right).not.toBe(s1Dir?.right);
  });

  it('Stage2のspawnRateがStage1より高い', () => {
    const w1 = wavesForStage(1);
    const w2 = wavesForStage(2);
    const s1Rate = w1[0]?.spawns[0]?.spawnRatePerSecond ?? 0;
    const s2Rate = w2[0]?.spawns[0]?.spawnRatePerSecond ?? 0;
    expect(s2Rate).toBeGreaterThan(s1Rate);
  });

  it('Stage2の圧はStage3より低い', () => {
    const w2 = wavesForStage(2);
    const w3 = wavesForStage(3);
    const last = w2.length - 1;
    const s2Max = w2[last]?.spawns[0]?.maxAlive ?? 0;
    const s3Max = w3[last]?.spawns[0]?.maxAlive ?? 0;
    expect(s2Max).toBeLessThan(s3Max);
  });
});

describe('Stage unlock safety', () => {
  beforeEach(() => { vi.stubGlobal('window', fakeWindow()); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('Stage2 clearでStage3が解放される（レシピ存在）', () => {
    saveProfile(createDefaultProfile());
    const result = settleRunProgress(makeState({ stageNumber: 2, kills: 30, survivedSec: 480 }), true);
    expect(result.unlockedStage).toBe(3);
    const profile = loadProfile();
    expect(profile.unlockedStages).toContain(3);
  });

  it('Stage5 clearで存在しないStage6は解放されない', () => {
    saveProfile(createDefaultProfile());
    const result = settleRunProgress(makeState({ stageNumber: 5, kills: 30, survivedSec: 480 }), true);
    expect(result.unlockedStage).toBeUndefined();
    const profile = loadProfile();
    expect(profile.unlockedStages).not.toContain(6);
  });

  it('recipeForStageが範囲外でも落ちない', () => {
    expect(() => recipeForStage(0)).not.toThrow();
    expect(() => recipeForStage(99)).not.toThrow();
    expect(recipeForStage(99).stageNumber).toBe(5);
  });

  it('全stageRecipesのstageNumberが連続している', () => {
    for (let i = 0; i < stageRecipes.length; i++) {
      expect(stageRecipes[i].stageNumber).toBe(i + 1);
    }
  });
});
