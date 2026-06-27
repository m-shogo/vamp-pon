import { describe, expect, it } from 'vitest';
import type { RareItemDefinition } from '../domain/types';
import { GAME_STATUS } from '../domain/constants';
import type { RuntimeState } from '../runtime';
import {
  SURVIVAL_REVIVAL_HP_RATIO,
  SURVIVAL_REVIVAL_INVULN_SEC,
  tryConsumeSurvivalRevival,
} from './survivalRevival';

const dawnTicket: RareItemDefinition = {
  id: 'dawn_ticket',
  name: '夜明けの切符',
  category: 'rare_item',
  role: 'survival_revival',
  tags: ['revival', 'dawn', 'ticket'],
  description: '倒れた時、一度だけ夜明けへ戻る。',
};

function makeState(partial: Partial<RuntimeState> = {}): RuntimeState {
  return {
    status: GAME_STATUS.PLAYING,
    player: {
      hp: 0,
      maxHp: 110,
      invulnRemaining: 0,
      flashRemaining: 0,
    },
    inventory: {
      rareItems: [],
    },
    berserk: {
      activeRemaining: 0,
      fatigueRemaining: 0,
    },
    ...partial,
  } as RuntimeState;
}

describe('tryConsumeSurvivalRevival', () => {
  it('survival_revival role のレアを消費し、最大HP30%で復帰する', () => {
    const state = makeState({
      inventory: { rareItems: [{ id: 'dawn_ticket' }] },
    } as Partial<RuntimeState>);
    const result = tryConsumeSurvivalRevival(state, new Map([[dawnTicket.id, dawnTicket]]));

    expect(result).toEqual({ itemId: 'dawn_ticket', hpRestored: Math.ceil(110 * SURVIVAL_REVIVAL_HP_RATIO) });
    expect(state.player.hp).toBe(33);
    expect(state.player.invulnRemaining).toBe(SURVIVAL_REVIVAL_INVULN_SEC);
    expect(state.inventory.rareItems).toEqual([]);
    expect(state.status).toBe(GAME_STATUS.PLAYING);
  });

  it('同じ survival_revival レアを複数持つ場合はまとめて消費する', () => {
    const state = makeState({
      inventory: {
        rareItems: [
          { id: 'dawn_ticket' },
          { id: 'dawn_ticket' },
        ],
      },
    } as Partial<RuntimeState>);

    const result = tryConsumeSurvivalRevival(state, new Map([[dawnTicket.id, dawnTicket]]));

    expect(result?.itemId).toBe('dawn_ticket');
    expect(state.inventory.rareItems).toEqual([]);
    expect(state.status).toBe(GAME_STATUS.PLAYING);
  });

  it('未所持なら何もしない', () => {
    const state = makeState();
    const result = tryConsumeSurvivalRevival(state, new Map([[dawnTicket.id, dawnTicket]]));

    expect(result).toBeNull();
    expect(state.player.hp).toBe(0);
    expect(state.inventory.rareItems).toEqual([]);
  });

  it('awakening_material role のレアは復帰に使わない', () => {
    const nameTag: RareItemDefinition = {
      ...dawnTicket,
      id: 'name_tag',
      role: 'awakening_material',
    };
    const state = makeState({
      inventory: { rareItems: [{ id: 'name_tag' }] },
    } as Partial<RuntimeState>);
    const result = tryConsumeSurvivalRevival(state, new Map([[nameTag.id, nameTag]]));

    expect(result).toBeNull();
    expect(state.player.hp).toBe(0);
    expect(state.inventory.rareItems).toEqual([{ id: 'name_tag' }]);
  });

  it('黒曜化中でも復帰は黒曜stateを壊さない', () => {
    const state = makeState({
      inventory: { rareItems: [{ id: 'dawn_ticket' }] },
      berserk: { activeRemaining: 5, fatigueRemaining: 0 },
    } as Partial<RuntimeState>);

    tryConsumeSurvivalRevival(state, new Map([[dawnTicket.id, dawnTicket]]));

    expect(state.berserk.activeRemaining).toBe(5);
    expect(state.berserk.fatigueRemaining).toBe(0);
  });
});
