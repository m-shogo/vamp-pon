import { describe, expect, it } from 'vitest';
import type { RuntimeState } from '../runtime';
import {
  BERSERK_DAMAGE_MULTIPLIER,
  BERSERK_DURATION_SEC,
  BERSERK_MAX_CHARGE,
  berserkDamageMultiplier,
  chargeBerserkFromDamage,
  updateBerserk,
} from './berserk';

function makeState(): RuntimeState {
  return {
    berserk: {
      maxCharge: BERSERK_MAX_CHARGE,
      charge: 0,
      ready: false,
      durationSec: BERSERK_DURATION_SEC,
      activeRemaining: 0,
    },
    ultimate: {
      chargeSeconds: 20,
      charge: 7,
      ready: false,
      activeRemaining: 0,
    },
    berserkRequested: false,
  } as RuntimeState;
}

describe('berserk state', () => {
  it('被ダメージだけで増え、時間経過では増えない', () => {
    const state = makeState();
    chargeBerserkFromDamage(state, 20);
    expect(state.berserk.charge).toBe(40);
    updateBerserk(state, 5);
    expect(state.berserk.charge).toBe(40);
    expect(state.berserk.ready).toBe(false);
  });

  it('満タンで独立発動し、必殺技ゲージを変更しない', () => {
    const state = makeState();
    chargeBerserkFromDamage(state, 50);
    expect(state.berserk.ready).toBe(true);
    state.berserkRequested = true;
    updateBerserk(state, 0);
    expect(state.berserk.activeRemaining).toBe(BERSERK_DURATION_SEC);
    expect(state.berserk.ready).toBe(false);
    expect(state.ultimate.charge).toBe(7);
  });

  it('発動中は与ダメージが1.5倍になり、終了後にゲージが0へ戻る', () => {
    const state = makeState();
    state.berserk.charge = BERSERK_MAX_CHARGE;
    state.berserk.ready = true;
    state.berserkRequested = true;
    updateBerserk(state, 0);
    expect(berserkDamageMultiplier(state)).toBe(BERSERK_DAMAGE_MULTIPLIER);
    updateBerserk(state, BERSERK_DURATION_SEC);
    expect(state.berserk.activeRemaining).toBe(0);
    expect(state.berserk.charge).toBe(0);
    expect(berserkDamageMultiplier(state)).toBe(1);
  });

  it('必殺技の短い発動中は暴走を開始しない', () => {
    const state = makeState();
    state.berserk.charge = BERSERK_MAX_CHARGE;
    state.berserk.ready = true;
    state.berserkRequested = true;
    state.ultimate.activeRemaining = 0.2;
    updateBerserk(state, 0);
    expect(state.berserk.activeRemaining).toBe(0);
    expect(state.berserk.ready).toBe(true);
  });
});
