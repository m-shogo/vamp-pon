import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { RuntimeState } from '../../runtime';
import {
  getDefaultProfile,
  loadProfile,
  saveProfile,
  settleRun,
  spendUpgrade,
  resetUpgrades,
  getUpgradeRefundAmount,
  getUpgradeLevel,
  upgradeCost,
  characterXpToNext,
  EXPLORATION_DEPTHS,
  type PlayerProfile,
  type ExplorationDepthId,
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
    __store: store,
  };
}

function makeState(opts: {
  stageNumber?: number;
  depth?: ExplorationDepthId;
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
    // 敵速度は上げすぎない
    expect(d.enemySpeed).toBeLessThanOrEqual(1.2);
  });
});

describe('永続強化の購入とリセット', () => {
  it('購入で黒曜片を消費しレベルが上がる', () => {
    const profile = getDefaultProfile();
    profile.currency = 1000;
    const cost = upgradeCost('maxHp', 0);
    const next = spendUpgrade('maxHp', profile);
    expect(getUpgradeLevel('maxHp', next)).toBe(1);
    expect(next.currency).toBe(1000 - cost);
  });

  it('黒曜片が足りなければ購入されない', () => {
    const profile = getDefaultProfile();
    profile.currency = 0;
    const next = spendUpgrade('maxHp', profile);
    expect(getUpgradeLevel('maxHp', next)).toBe(0);
    expect(next.currency).toBe(0);
  });

  it('リセットで消費した黒曜片を全額返還する', () => {
    let profile = getDefaultProfile();
    profile.currency = 5000;
    const start = profile.currency;
    profile = spendUpgrade('maxHp', profile);
    profile = spendUpgrade('maxHp', profile);
    profile = spendUpgrade('might', profile);
    expect(profile.currency).toBeLessThan(start);
    const refund = getUpgradeRefundAmount(profile);
    const reset = resetUpgrades(profile);
    expect(reset.currency).toBe(profile.currency + refund);
    expect(reset.currency).toBe(start);
    expect(getUpgradeLevel('maxHp', reset)).toBe(0);
    expect(getUpgradeLevel('might', reset)).toBe(0);
  });
});

describe('リザルト精算（黒曜片）', () => {
  it('1分以上生存して負けても最低10は貯まる', () => {
    const profile = getDefaultProfile();
    const result = settleRun(makeState({ survivedSec: 65, kills: 1 }), false, profile);
    expect(result.shardsEarned).toBeGreaterThanOrEqual(10);
  });

  it('クリアは最低150を保証し、所持に加算される', () => {
    const profile = getDefaultProfile();
    profile.currency = 40;
    const result = settleRun(makeState({ survivedSec: 5 }), true, profile);
    expect(result.shardsEarned).toBeGreaterThanOrEqual(150);
    expect(result.shardTotal).toBe(40 + result.shardsEarned);
  });

  it('初回クリアと初回深度クリアの加算ボーナスが付く', () => {
    const profile = getDefaultProfile();
    const first = settleRun(makeState({ depth: 'shallow', kills: 20, survivedSec: 120 }), true, profile);
    expect(first.firstClearBonus).toBe(100);
    expect(first.firstDepthClearBonus).toBe(80);
    // 同じステージ・深度を再クリアすると追加ボーナスは消える
    const again = settleRun(makeState({ depth: 'shallow', kills: 20, survivedSec: 120 }), true, profile);
    expect(again.firstClearBonus).toBe(0);
    expect(again.firstDepthClearBonus).toBe(0);
  });

  it('深層は浅層より黒曜片が多い', () => {
    const base = { kills: 40, survivedSec: 180, fragments: 30, capsules: 3 };
    const shallow = settleRun(makeState({ ...base, depth: 'shallow' }), false, getDefaultProfile());
    const deep = settleRun(makeState({ ...base, depth: 'deep' }), false, getDefaultProfile());
    expect(deep.shardsEarned).toBeGreaterThan(shallow.shardsEarned);
  });

  it('黒曜化を使うと未使用ボーナスが消える', () => {
    const base = { kills: 40, survivedSec: 180 };
    const clean = settleRun(makeState({ ...base, berserkUses: 0 }), false, getDefaultProfile());
    const used = settleRun(makeState({ ...base, berserkUses: 2 }), false, getDefaultProfile());
    expect(clean.noBerserk).toBe(true);
    expect(used.noBerserk).toBe(false);
    expect(clean.noBerserkMultiplier).toBeGreaterThan(used.noBerserkMultiplier);
  });
});

describe('キャラレベル', () => {
  it('Lv1→2 に必要な経験値は100', () => {
    expect(characterXpToNext(1)).toBe(100);
  });

  it('大量の経験値でキャラレベルが上がる', () => {
    const profile = getDefaultProfile();
    const result = settleRun(makeState({ kills: 400, survivedSec: 300, playerLevel: 20 }), true, profile);
    expect(result.characterLevelAfter).toBeGreaterThan(result.characterLevelBefore);
    expect(result.characterXpEarned).toBeGreaterThan(0);
  });
});

describe('localStorage の保存・読み込み・移行', () => {
  beforeEach(() => {
    vi.stubGlobal('window', fakeWindow());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('保存したプロフィールを読み戻せる', () => {
    const profile = getDefaultProfile();
    profile.currency = 777;
    profile.selectedDepth = 'deep';
    saveProfile(profile);
    const loaded = loadProfile();
    expect(loaded.currency).toBe(777);
    expect(loaded.selectedDepth).toBe('deep');
  });

  it('旧キー currencyGain を shardGain へ移行する', () => {
    (window as unknown as { localStorage: Storage }).localStorage.setItem(
      'vamp-pon:profile:v1',
      JSON.stringify({ version: 1, upgrades: { currencyGain: 5 } }),
    );
    const loaded = loadProfile();
    expect(getUpgradeLevel('shardGain', loaded)).toBe(5);
  });

  it('壊れた localStorage でもデフォルトで起動する', () => {
    (window as unknown as { localStorage: Storage }).localStorage.setItem('vamp-pon:profile:v1', '{ broken json');
    const loaded = loadProfile();
    expect(loaded).toEqual(getDefaultProfile());
  });

  it('レガシーキーからも読み込める', () => {
    const legacy: Partial<PlayerProfile> = { version: 1, currency: 321 };
    (window as unknown as { localStorage: Storage }).localStorage.setItem('vampPon.playerProfile.v1', JSON.stringify(legacy));
    const loaded = loadProfile();
    expect(loaded.currency).toBe(321);
  });
});
