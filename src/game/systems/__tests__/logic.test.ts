import { describe, it, expect } from 'vitest';
import type { RuntimeState } from '../../runtime';
import { xpToNext } from '../../domain/balance';
import { generateChoices } from '../levelup';
import { generateCapsuleReward } from '../capsule';
import { recomputePlayerStats } from '../passives';
import { weightedPick } from '../../utils/rng';
import { weaponById } from '../../data/weapons';
import { passiveById } from '../../data/passives';
import { rareItemById } from '../../data/rareItems';

function makeState(partial: {
  weapons?: RuntimeState['inventory']['weapons'];
  passives?: RuntimeState['inventory']['passives'];
  rareItems?: RuntimeState['inventory']['rareItems'];
  hp?: number;
  maxHp?: number;
  weaponSlots?: number;
  passiveSlots?: number;
  rareItemSlots?: number;
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
      rareItems: partial.rareItems ?? [],
      evolvedWeaponIds: [],
      weaponSlots: partial.weaponSlots ?? 5,
      passiveSlots: partial.passiveSlots ?? 5,
      rareItemSlots: partial.rareItemSlots ?? 2,
    },
  } as unknown as RuntimeState;
}

describe('xpToNext', () => {
  it('Lv1→2 に必要なXPは6', () => {
    expect(xpToNext(1)).toBe(6);
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

  it('武器枠が満杯でも入れ替え用の新武器候補を出せる', () => {
    const choices = generateChoices(
      makeState({
        weaponSlots: 5,
        weapons: [
          { id: 'night_pencil', level: 1, cooldownRemaining: 0 },
          { id: 'marble', level: 1, cooldownRemaining: 0 },
          { id: 'moon_bookmark', level: 1, cooldownRemaining: 0 },
          { id: 'black_ink_bottle', level: 1, cooldownRemaining: 0 },
          { id: 'stardust_shot', level: 1, cooldownRemaining: 0 },
        ],
      }),
    );
    const newWeapon = choices.find((c) => c.type === 'weapon_new');
    if (newWeapon) expect(newWeapon.title).toContain('入替');
  });

  it('Lv.MAXの武器強化は候補に出さない', () => {
    const choices = generateChoices(
      makeState({ weapons: [{ id: 'night_pencil', level: 5, cooldownRemaining: 0 }] }),
    );
    const hasPencilUpgrade = choices.some((c) => c.type === 'weapon_upgrade' && c.itemId === 'night_pencil');
    expect(hasPencilUpgrade).toBe(false);
  });
});

describe('追加データ', () => {
  it('新武器3種と合体進化武器が抽選データに存在する', () => {
    expect(weaponById.has('postcard_blade')).toBe(true);
    expect(weaponById.has('paper_airplane')).toBe(true);
    expect(weaponById.has('streetlamp_ring')).toBe(true);
    expect(weaponById.has('dawn_ink_lamp')).toBe(true);
  });

  it('新パッシブ3種が抽選データに存在する', () => {
    expect(passiveById.has('pressed_flower')).toBe(true);
    expect(passiveById.has('loose_map_pin')).toBe(true);
    expect(passiveById.has('small_alarm_clock')).toBe(true);
  });

  it('レアアイテムが存在する', () => {
    expect(rareItemById.has('name_tag')).toBe(true);
    expect(rareItemById.has('cracked_lens')).toBe(true);
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
