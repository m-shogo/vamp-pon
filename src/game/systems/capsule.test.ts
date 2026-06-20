import { describe, expect, it } from 'vitest';
import type { RuntimeState } from '../runtime';
import { weaponById } from '../data/weapons';
import { applyCapsule, applyReadyEvolutions, generateCapsuleReward } from './capsule';

const INK_MAX = weaponById.get('black_ink_bottle')!.maxLevel;
const LAMP_MAX = weaponById.get('streetlamp_ring')!.maxLevel;

function makeState(): RuntimeState {
  return {
    characterId: 'yui',
    player: {
      baseMoveSpeed: 160,
      moveSpeed: 160,
      might: 1,
      magnetMultiplier: 1,
      xpMultiplier: 1,
      cooldownMultiplier: 1,
    },
    inventory: {
      weapons: [
        // 合体条件は weaponById.maxLevel に連動するので、ここも maxLevel に揃える。
        { id: 'black_ink_bottle', level: INK_MAX, cooldownRemaining: 0 },
        { id: 'streetlamp_ring', level: LAMP_MAX, cooldownRemaining: 0 },
      ],
      passives: [],
      rareItems: [],
      evolvedWeaponIds: [],
      weaponSlots: 5,
      passiveSlots: 5,
      rareItemSlots: 2,
    },
    stats: {
      memoryFragmentsCollected: 0,
      evolutions: [],
    },
  } as RuntimeState;
}

describe('capsule rewards', () => {
  it('両武器が maxLevel でもカプセル報酬は合体そのものを返さない', () => {
    const state = makeState();
    const reward = generateCapsuleReward(state);

    expect(reward.type).not.toBe('evolution');
  });

  it('両武器が maxLevel なら所持条件から合体し、素材2枠を1枠へまとめる', () => {
    const state = makeState();
    const evolved = applyReadyEvolutions(state);

    expect(evolved).toEqual(['dawn_ink_lamp']);

    expect(state.inventory.weapons.map((weapon) => weapon.id)).toEqual(['dawn_ink_lamp']);
    expect(state.inventory.evolvedWeaponIds).toContain('dawn_ink_lamp');
    expect(state.stats.evolutions).toContain('dawn_ink_lamp');
  });

  it('進化後武器を所持済みなら追跡配列が空でも同じ進化を再発生させない', () => {
    const state = makeState();
    state.inventory.weapons.push({ id: 'dawn_ink_lamp', level: 1, cooldownRemaining: 0 });
    state.inventory.evolvedWeaponIds = [];
    state.stats.evolutions = [];

    const evolved = applyReadyEvolutions(state);

    expect(evolved).toEqual([]);
  });

  it('通貨報酬は記憶のかけらへ実際に加算される', () => {
    const state = makeState();
    state.stats.memoryFragmentsCollected = 7;

    applyCapsule(state, { type: 'currency', amount: 10, title: '記憶のかけら +10' });

    expect(state.stats.memoryFragmentsCollected).toBe(17);
  });
});
