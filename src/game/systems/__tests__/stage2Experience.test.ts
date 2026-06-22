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
  elitesKilled?: number;
}): RuntimeState {
  return {
    stageNumber: opts.stageNumber ?? 1,
    explorationDepth: opts.depth ?? 'shallow',
    characterId: 'yui',
    player: { level: opts.playerLevel ?? 1 },
    stats: {
      kills: opts.kills ?? 0,
      elitesKilled: opts.elitesKilled ?? 0,
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

describe('Stage2 wave手動チューニング', () => {
  it('Stage2序盤(wave0)は横/上の出現比率がStage1より高い', () => {
    const w1 = wavesForStage(1);
    const w2 = wavesForStage(2);
    const s1Dir = w1[0]?.spawns[0]?.directionWeights;
    const s2Dir = w2[0]?.spawns[0]?.directionWeights;
    expect((s2Dir?.left ?? 0) + (s2Dir?.right ?? 0)).toBeGreaterThan(
      (s1Dir?.left ?? 0) + (s1Dir?.right ?? 0),
    );
    expect(s2Dir?.top ?? 0).toBeGreaterThan(s1Dir?.top ?? 0);
  });

  it('Stage2終盤(最終wave)はaround/全方向で収束感がある', () => {
    const w2 = wavesForStage(2);
    const lastWave = w2[w2.length - 1];
    const dir = lastWave?.spawns[0]?.directionWeights;
    expect(dir?.bottom ?? 0).toBeLessThan(40);
    expect((dir?.left ?? 0) + (dir?.right ?? 0)).toBeGreaterThanOrEqual(40);
  });

  it('Stage2はnight_hazeをStage1より早く導入する', () => {
    const w1 = wavesForStage(1);
    const w2 = wavesForStage(2);
    const s1FirstHaze = w1.findIndex((w) => w.spawns.some((s) => s.enemyId === 'night_haze'));
    const s2FirstHaze = w2.findIndex((w) => w.spawns.some((s) => s.enemyId === 'night_haze'));
    expect(s2FirstHaze).toBeLessThan(s1FirstHaze);
    expect(s2FirstHaze).toBeGreaterThanOrEqual(0);
  });
});

describe('Stage報酬倍率', () => {
  beforeEach(() => { vi.stubGlobal('window', fakeWindow()); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('Stage2の報酬がStage1より多い（stageBonus反映）', () => {
    saveProfile(createDefaultProfile());
    const s1 = settleRunProgress(makeState({ stageNumber: 1, kills: 100, survivedSec: 300, fragments: 50 }), false);
    saveProfile(createDefaultProfile());
    const s2 = settleRunProgress(makeState({ stageNumber: 2, kills: 100, survivedSec: 300, fragments: 50 }), false);
    expect(s2.currencyEarned).toBeGreaterThan(s1.currencyEarned);
    expect(s2.stageBonus).toBe(1.2);
    expect(s1.stageBonus).toBe(1);
  });

  it('Stage2のcharacterXpもstageBonus分増える', () => {
    saveProfile(createDefaultProfile());
    const s1 = settleRunProgress(makeState({ stageNumber: 1, kills: 100, survivedSec: 300 }), false);
    saveProfile(createDefaultProfile());
    const s2 = settleRunProgress(makeState({ stageNumber: 2, kills: 100, survivedSec: 300 }), false);
    expect(s2.characterXpEarned).toBeGreaterThan(s1.characterXpEarned);
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

describe('ボス/エリート体験', () => {
  it('Stage1の420sエリートにhpMultiplierが設定されている', () => {
    const w = wavesForStage(1);
    const bossWave = w.find((wave) => wave.start === 420);
    expect(bossWave).toBeDefined();
    const bossSpawn = bossWave!.spawns.find((s) => s.enemyId === 'black_label_shadow');
    expect(bossSpawn).toBeDefined();
    expect(bossSpawn!.hpMultiplier).toBeGreaterThan(1);
  });

  it('Stage2の420sエリートはStage1より硬い', () => {
    const w1 = wavesForStage(1);
    const w2 = wavesForStage(2);
    const s1Boss = w1.find((w) => w.start === 420)!.spawns.find((s) => s.enemyId === 'black_label_shadow')!;
    const s2Boss = w2.find((w) => w.start === 420)!.spawns.find((s) => s.enemyId === 'black_label_shadow')!;
    expect(s2Boss.hpMultiplier!).toBeGreaterThan(s1Boss.hpMultiplier!);
  });

  it('Stage1のエリートタイミングが3回ある（150s, 300s, 420s）', () => {
    const w = wavesForStage(1);
    const eliteWaves = w.filter((wave) => wave.spawns.some((s) => s.enemyId === 'black_label_shadow'));
    expect(eliteWaves.length).toBe(3);
    expect(eliteWaves.map((e) => e.start)).toEqual([150, 300, 420]);
  });
});

describe('エリート撃破報酬', () => {
  beforeEach(() => { vi.stubGlobal('window', fakeWindow()); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('エリート撃破数が報酬に加算される', () => {
    saveProfile(createDefaultProfile());
    const noElite = settleRunProgress(makeState({ stageNumber: 1, kills: 100, survivedSec: 300, elitesKilled: 0 }), false);
    saveProfile(createDefaultProfile());
    const withElite = settleRunProgress(makeState({ stageNumber: 1, kills: 100, survivedSec: 300, elitesKilled: 3 }), false);
    expect(withElite.currencyEarned).toBeGreaterThan(noElite.currencyEarned);
  });

  it('エリート未撃破でも報酬は0にならない', () => {
    saveProfile(createDefaultProfile());
    const result = settleRunProgress(makeState({ stageNumber: 1, kills: 50, survivedSec: 200, elitesKilled: 0 }), false);
    expect(result.currencyEarned).toBeGreaterThanOrEqual(1);
  });
});

describe('hpMultiplier型一貫性', () => {
  it('spawnRatePerSecond系spawnでもhpMultiplierを設定できる', () => {
    const spawn: import('../../domain/types').WaveSpawnDefinition = {
      enemyId: 'ink_shadow',
      spawnRatePerSecond: 1.0,
      maxAlive: 10,
      hpMultiplier: 1.5,
      directionWeights: { bottom: 50, top: 20, left: 15, right: 15 },
    };
    expect(spawn.hpMultiplier).toBe(1.5);
    expect(spawn.spawnRatePerSecond).toBe(1.0);
  });
});
