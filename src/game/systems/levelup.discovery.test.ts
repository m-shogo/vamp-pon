import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RuntimeState } from '../runtime';
import { generateChoices } from './levelup';

function makeEarlyState(): RuntimeState {
  return {
    characterId: 'yui',
    player: {
      hp: 100,
      maxHp: 100,
      level: 2,
      baseMoveSpeed: 160,
      moveSpeed: 160,
      might: 1,
      magnetMultiplier: 1,
      xpMultiplier: 1,
      cooldownMultiplier: 1,
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
      evolutions: [],
    },
  } as RuntimeState;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('early level discovery', () => {
  it('乱数が回復とレアへ偏っても新規武器か忘れ物を最低1つ含める', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const choices = generateChoices(makeEarlyState());

    expect(choices).toHaveLength(3);
    expect(choices.some((choice) => choice.type === 'weapon_new' || choice.type === 'passive_new')).toBe(true);
  });
});
