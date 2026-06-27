import { describe, expect, it, vi } from 'vitest';
import { GAME_STATUS } from '../domain/constants';
import type { RuntimeState } from '../runtime';

vi.mock('../audio/AudioManager', () => ({
  getAudioManager: () => ({
    playSe: vi.fn(),
  }),
}));

vi.mock('../effects/EffectManager', () => ({
  getEffectManager: () => ({
    playerDamage: vi.fn(),
    playerDamageView: vi.fn(),
  }),
}));

vi.mock('../ui/effects', () => ({
  capsuleRewardBurst: vi.fn(),
  inkPuff: vi.fn(),
  shakeOnHit: vi.fn(),
}));

vi.mock('../persistence/profile', () => ({
  depthForState: () => ({ enemyHp: 1, enemySpeed: 1, enemyDamage: 1, xp: 1 }),
  profileBonuses: () => ({ damageTakenMultiplier: 1 }),
}));

import { applyPlayerDamage } from './enemies';

function makeState(partial: Partial<RuntimeState> = {}): RuntimeState {
  return {
    status: GAME_STATUS.PLAYING,
    elapsedSec: 12,
    player: {
      hp: 10,
      maxHp: 100,
      invulnRemaining: 0,
      flashRemaining: 0,
      x: 160,
      y: 240,
      radius: 6,
    },
    inventory: {
      rareItems: [{ id: 'dawn_ticket' }],
    },
    stats: {
      damageTaken: 0,
    },
    telemetry: {
      firstDamageSec: null,
    },
    berserk: {
      activeRemaining: 4,
      fatigueRemaining: 0,
    },
    ...partial,
  } as RuntimeState;
}

describe('applyPlayerDamage survival revival hook', () => {
  it('HP0直前にdawn_ticketを消費し、GAMEOVERにせず復帰する', () => {
    const state = makeState();

    applyPlayerDamage({} as Phaser.Scene, state, 999);

    expect(state.status).toBe(GAME_STATUS.PLAYING);
    expect(state.player.hp).toBe(30);
    expect(state.player.invulnRemaining).toBe(1.25);
    expect(state.inventory.rareItems).toEqual([]);
    expect(state.telemetry.firstDamageSec).toBe(12);
    expect(state.berserk.activeRemaining).toBe(4);
    expect(state.berserk.fatigueRemaining).toBe(0);
  });

  it('dawn_ticket未所持ならGAMEOVERになる', () => {
    const state = makeState({
      inventory: { rareItems: [] },
    } as Partial<RuntimeState>);

    applyPlayerDamage({} as Phaser.Scene, state, 999);

    expect(state.status).toBe(GAME_STATUS.GAMEOVER);
    expect(state.player.hp).toBe(0);
  });
});
