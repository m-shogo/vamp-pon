import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { RuntimeState } from '../../runtime';
import {
  createDefaultProfile,
  loadProfile,
  saveProfile,
  settleRunProgress,
  buyUpgrade,
  resetUpgrades,
  upgradeRefundValue,
  getUpgradeLevel,
  upgradeCost,
  characterXpToNext,
  EXPLORATION_DEPTHS,
  depthForState,
} from '../profile';

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

describe('探索深度の倍率', () => {
  it('深いほど敵が強く報酬が大きい（速度は控えめ）', () => {
    const s = EXPLORATION_DEPTHS.shallow;
    const m = EXPLORATION_DEPTHS.middle;
    const d = EXPLORATION_DEPTHS.deep;
    expect(s.enemyHp).toBe(1);
    expect(s.reward).toBe(1);
    expect(d.enemyHp).toBeGreaterThan(m.enemyHp);
    expect(d.reward).toBeGreaterThan(m.reward);
    expect(d.reward).toBe(2);
    expect(d.enemySpeed).toBeLessThanOrEqual(1.2);
  });

  it('depthForState は state の深度設定を引く', () => {
    expect(depthForState({ explorationDepth: 'deep' }).id).toBe('deep');
    expect(depthForState({ explorationDepth: undefined as never }).id).toBe('shallow');
  });
});

describe('永続強化のコストとレベル', () => {
  it('Lv1→2 のキャラ必要経験値は80（基礎値）', () => {
    expect(characterXpToNext(1)).toBe(80);
  });

  it('upgradeCost はレベルが上がるほど高くなる', () => {
    expect(upgradeCost('maxHp', 1)).toBeGreaterThan(upgradeCost('maxHp', 0));
  });
});

describe('localStorage を伴う進行（保存・購入・精算）', () => {
  beforeEach(() => {
    vi.stubGlobal('window', fakeWindow());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('保存したプロフィールを読み戻せる', () => {
    const profile = createDefaultProfile();
    profile.currency = 777;
    profile.selectedDepth = 'deep';
    saveProfile(profile);
    const loaded = loadProfile();
    expect(loaded.currency).toBe(777);
    expect(loaded.selectedDepth).toBe('deep');
  });

  it('壊れた localStorage でもデフォルトで起動する', () => {
    window.localStorage.setItem('vampPon.playerProfile.v1', '{ broken json');
    const loaded = loadProfile();
    expect(loaded).toEqual(createDefaultProfile());
  });

  it('購入で黒曜片を消費しレベルが上がる', () => {
    saveProfile({ ...createDefaultProfile(), currency: 1000 });
    const cost = upgradeCost('maxHp', 0);
    const next = buyUpgrade('maxHp');
    expect(getUpgradeLevel('maxHp', next)).toBe(1);
    expect(next.currency).toBe(1000 - cost);
  });

  it('黒曜片が足りなければ購入されない', () => {
    saveProfile({ ...createDefaultProfile(), currency: 0 });
    const next = buyUpgrade('maxHp');
    expect(getUpgradeLevel('maxHp', next)).toBe(0);
    expect(next.currency).toBe(0);
  });

  it('リセットで消費した黒曜片を全額返還する', () => {
    const start = 5000;
    saveProfile({ ...createDefaultProfile(), currency: start });
    buyUpgrade('maxHp');
    buyUpgrade('maxHp');
    const spent = loadProfile();
    expect(spent.currency).toBeLessThan(start);
    const refund = upgradeRefundValue(spent);
    const reset = resetUpgrades();
    expect(reset.currency).toBe(spent.currency + refund);
    expect(reset.currency).toBe(start);
    expect(getUpgradeLevel('maxHp', reset)).toBe(0);
  });

  it('1ランの精算で黒曜片とキャラ経験値が得られる', () => {
    saveProfile(createDefaultProfile());
    const result = settleRunProgress(makeState({ kills: 30, survivedSec: 120, fragments: 20 }), false);
    expect(result.currencyEarned).toBeGreaterThanOrEqual(1);
    expect(result.characterXpEarned).toBeGreaterThanOrEqual(1);
  });

  it('初回クリアボーナスは2回目には消える', () => {
    saveProfile(createDefaultProfile());
    const first = settleRunProgress(makeState({ kills: 20, survivedSec: 120 }), true);
    expect(first.firstClearBonus).toBeGreaterThan(1);
    const again = settleRunProgress(makeState({ kills: 20, survivedSec: 120 }), true);
    expect(again.firstClearBonus).toBe(1);
  });

  it('深層は浅層より黒曜片が多い', () => {
    const base = { kills: 40, survivedSec: 180, fragments: 30, capsules: 3 };
    saveProfile(createDefaultProfile());
    const shallow = settleRunProgress(makeState({ ...base, depth: 'shallow' }), false);
    saveProfile(createDefaultProfile());
    const deep = settleRunProgress(makeState({ ...base, depth: 'deep' }), false);
    expect(deep.currencyEarned).toBeGreaterThan(shallow.currencyEarned);
  });

  it('黒曜化を使うと未使用ボーナスが消える', () => {
    const base = { kills: 40, survivedSec: 180 };
    saveProfile(createDefaultProfile());
    const clean = settleRunProgress(makeState({ ...base, berserkUses: 0 }), false);
    saveProfile(createDefaultProfile());
    const used = settleRunProgress(makeState({ ...base, berserkUses: 2 }), false);
    expect(clean.noBerserkBonus).toBeGreaterThan(used.noBerserkBonus);
    expect(used.noBerserkBonus).toBe(1);
  });

  it('大量の経験値でキャラレベルが上がる', () => {
    saveProfile(createDefaultProfile());
    const result = settleRunProgress(makeState({ kills: 400, survivedSec: 300, playerLevel: 20 }), true);
    expect(result.characterLevelAfter).toBeGreaterThan(result.characterLevelBefore);
  });

  it('初期状態ではStage1のみ解放', () => {
    const profile = createDefaultProfile();
    expect(profile.unlockedStages).toEqual([1]);
  });

  it('Stage1クリアでStage2が解放される', () => {
    saveProfile(createDefaultProfile());
    const result = settleRunProgress(makeState({ stageNumber: 1, kills: 20, survivedSec: 480 }), true);
    expect(result.unlockedStage).toBe(2);
    const profile = loadProfile();
    expect(profile.unlockedStages).toContain(2);
  });

  it('Stage1 defeatではStage2は解放されない', () => {
    saveProfile(createDefaultProfile());
    const result = settleRunProgress(makeState({ stageNumber: 1, kills: 10, survivedSec: 200 }), false);
    expect(result.unlockedStage).toBeUndefined();
    const profile = loadProfile();
    expect(profile.unlockedStages).toEqual([1]);
  });

  it('Stage2解放はreload後も維持される', () => {
    saveProfile(createDefaultProfile());
    settleRunProgress(makeState({ stageNumber: 1, kills: 20, survivedSec: 480 }), true);
    const reloaded = loadProfile();
    expect(reloaded.unlockedStages).toContain(2);
  });

  it('再クリアでは重複解放しない', () => {
    saveProfile(createDefaultProfile());
    const first = settleRunProgress(makeState({ stageNumber: 1, kills: 20, survivedSec: 480 }), true);
    expect(first.unlockedStage).toBe(2);
    const second = settleRunProgress(makeState({ stageNumber: 1, kills: 20, survivedSec: 480 }), true);
    expect(second.unlockedStage).toBeUndefined();
    const profile = loadProfile();
    expect(profile.unlockedStages.filter((s) => s === 2)).toHaveLength(1);
  });
});
