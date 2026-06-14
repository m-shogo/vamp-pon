import { describe, it, expect } from 'vitest';
import type { RuntimeState } from '../../runtime';
import { xpToNext } from '../../domain/balance';
import { generateChoices } from '../levelup';
import { generateCapsuleReward } from '../capsule';
import { recomputePlayerStats } from '../passives';
import { weightedPick } from '../../utils/rng';

function makeState(partial: {
  weapons?: RuntimeState['inventory']['weapons'];
  passives?: RuntimeState['inventory']['passives'];
  hp?: number;
  maxHp?: number;
}): RuntimeState {
  return {
    characterId: 'yui',
    player: {
      characterId: 'yui',
      hp: partial.hp ?? 100,
      maxHp: partial.maxHp ?? 100,
      might: 1,
      magnetMultiplier: 1,
      xpMultiplier: 1,
      cooldownMultiplier: 1,
      baseMoveSpeed: 100,
      moveSpeed: 100,
    },
    inventory: {
      weapons: partial.weapons ?? [{ id: 'night_pencil', level: 1, cooldownRemaining: 0 }],
      passives: partial.passives ?? [],
      evolvedWeaponIds: [],
      weaponSlots: 4,
      passiveSlots: 4,
    },
  } as unknown as RuntimeState;
}

describe('xpToNext', () => {
  it('Lv1→2 に必要なXPは8', () => {
    expect(xpToNext(1)).toBe(8);
  });
  it('レベルが上がると単調増加する', () => {
    expect(xpToNext(2)).toBeGreaterThan(xpToNext(1));
    expect(xpToNext(10)).toBeGreaterThan(xpToNext(5));
  });
});

describe('generateChoices', () => {
  it('常に3択を返す', () => {
    const choices = generateChoices(makeState({}));
    expect(choices).toHaveLength(3);
  });

  it('同じitemIdを重複させない', () => {
    const choices = generateChoices(makeState({}));
    const ids = choices.filter((c) => 'itemId' in c).map((c) => (c as { itemId: string }).itemId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('武器枠が満杯なら新武器を出さない', () => {
    const choices = generateChoices(
      makeState({
        weapons: [
          { id: 'night_pencil', level: 1, cooldownRemaining: 0 },
          { id: 'marble', level: 1, cooldownRemaining: 0 },
          { id: 'moon_bookmark', level: 1, cooldownRemaining: 0 },
          { id: 'black_ink_bottle', level: 1, cooldownRemaining: 0 },
        ],
      }),
    );
    expect(choices.some((c) => c.type === 'weapon_new')).toBe(false);
  });

  it('Lv.MAXの武器強化は候補に出さない', () => {
    const choices = generateChoices(
      makeState({ weapons: [{ id: 'night_pencil', level: 5, cooldownRemaining: 0 }] }),
    );
    const hasPencilUpgrade = choices.some(
      (c) => c.type === 'weapon_upgrade' && c.itemId === 'night_pencil',
    );
    expect(hasPencilUpgrade).toBe(false);
  });
});

describe('generateCapsuleReward', () => {
  it('進化条件を満たすと進化を返す', () => {
    const state = makeState({
      weapons: [{ id: 'night_pencil', level: 5, cooldownRemaining: 0 }],
      passives: [{ id: 'moonlight_bookmark', level: 1 }],
    });
    const reward = generateCapsuleReward(state);
    expect(reward.type).toBe('evolution');
    if (reward.type === 'evolution') {
      expect(reward.evolvedWeaponId).toBe('unfinished_line');
    }
  });

  it('進化条件を満たさなければ進化以外を返す', () => {
    const state = makeState({ weapons: [{ id: 'night_pencil', level: 2, cooldownRemaining: 0 }] });
    const reward = generateCapsuleReward(state);
    expect(reward.type).not.toBe('evolution');
  });
});

describe('recomputePlayerStats', () => {
  it('攻撃力パッシブが might に反映される', () => {
    const state = makeState({ passives: [{ id: 'travel_badge', level: 5 }] });
    recomputePlayerStats(state);
    expect(state.player.might).toBeCloseTo(1.25, 5);
  });

  it('移動速度パッシブが moveSpeed に反映される', () => {
    const state = makeState({ passives: [{ id: 'old_ticket', level: 5 }] });
    recomputePlayerStats(state);
    expect(state.player.moveSpeed).toBeCloseTo(120, 5);
  });
});

describe('weightedPick', () => {
  it('重み0の要素は選ばれない', () => {
    for (let i = 0; i < 50; i += 1) {
      const picked = weightedPick<string>([
        ['a', 1],
        ['b', 0],
      ]);
      expect(picked).toBe('a');
    }
  });
});
