import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RuntimeState } from '../runtime';
import { applyChoice, generateChoices, retiredWeaponIds } from './levelup';

function makeState(weaponId = 'unfinished_line'): RuntimeState {
  return {
    characterId: 'yui',
    player: {
      hp: 100,
      maxHp: 100,
      baseMoveSpeed: 160,
      moveSpeed: 160,
      might: 1,
      magnetMultiplier: 1,
      xpMultiplier: 1,
      cooldownMultiplier: 1,
    },
    inventory: {
      weapons: [{ id: weaponId, level: 1, cooldownRemaining: 0 }],
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

describe('levelup evolution guards', () => {
  it('現在所持している進化武器から元武器を退役扱いにする', () => {
    const state = makeState('unfinished_line');
    expect(retiredWeaponIds(state).has('night_pencil')).toBe(true);
  });

  it('古い選択肢を適用しても進化後の元武器は復活しない', () => {
    const state = makeState('unfinished_line');
    applyChoice(state, {
      type: 'weapon_new',
      itemId: 'night_pencil',
      title: '夜の鉛筆',
      description: '古い選択肢',
    });
    expect(state.inventory.weapons.some((weapon) => weapon.id === 'night_pencil')).toBe(false);
  });

  it('覚醒後は消費済みレアアイテムを古い選択肢から再取得できない', () => {
    const state = makeState('unforgotten_name');
    applyChoice(state, {
      type: 'rare_new',
      itemId: 'name_tag',
      title: '誰かの名前札',
      description: '古い選択肢',
    });
    expect(state.inventory.rareItems.some((item) => item.id === 'name_tag')).toBe(false);
  });

  it('dawn_ticket は通常レベルアップ候補にも古いrare選択肢適用にも入れない', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = makeState('unfinished_line');
    for (let i = 0; i < 20; i += 1) {
      const choices = generateChoices(state);
      expect(choices.some((choice) => choice.type === 'rare_new' && choice.itemId === 'dawn_ticket')).toBe(false);
    }

    applyChoice(state, {
      type: 'rare_new',
      itemId: 'dawn_ticket',
      title: '夜明けの切符',
      description: '古い選択肢',
    });
    expect(state.inventory.rareItems.some((item) => item.id === 'dawn_ticket')).toBe(false);
  });

  it('レアリティは色メタデータで表し、星や禁止ラベルを文章へ入れない', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = makeState('unfinished_line');
    const choices = generateChoices(state);
    const visibleText = choices.map((choice) => `${choice.title} ${choice.description}`).join('\n');

    expect(choices.every((choice) => choice.rarity != null)).toBe(true);
    expect(visibleText).not.toMatch(/★|大当たり|良い拾い物|ふつう/);
  });
});
