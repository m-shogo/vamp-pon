import type Phaser from 'phaser';
import type { RuntimeState } from '../runtime';

export const BERSERK_MAX_CHARGE = 100;
export const BERSERK_DURATION_SEC = 8;
export const BERSERK_CHARGE_PER_DAMAGE = 2;
export const BERSERK_DAMAGE_MULTIPLIER = 1.5;
export const BERSERK_FATIGUE_SEC = 0.8;
export const BERSERK_FATIGUE_MOVE_MULTIPLIER = 0.58;

export function isBerserkActive(state: RuntimeState): boolean {
  return (state.berserk?.activeRemaining ?? 0) > 0;
}

export function isBerserkFatigued(state: RuntimeState): boolean {
  return (state.berserk?.fatigueRemaining ?? 0) > 0;
}

export function chargeBerserkFromDamage(state: RuntimeState, damageTaken: number): void {
  const berserk = state.berserk;
  if (!berserk || damageTaken <= 0 || isBerserkActive(state) || berserk.ready) return;
  berserk.charge = Math.min(berserk.maxCharge, berserk.charge + damageTaken * BERSERK_CHARGE_PER_DAMAGE);
  berserk.ready = berserk.charge >= berserk.maxCharge;
}

export function updateBerserk(state: RuntimeState, dt: number, _scene?: Phaser.Scene): boolean {
  const berserk = state.berserk;
  if (!berserk) {
    state.berserkRequested = false;
    return false;
  }

  if (berserk.activeRemaining > 0) {
    const before = berserk.activeRemaining;
    berserk.activeRemaining = Math.max(0, berserk.activeRemaining - dt);
    if (before > 0 && berserk.activeRemaining === 0) {
      berserk.charge = 0;
      berserk.ready = false;
      berserk.fatigueRemaining = BERSERK_FATIGUE_SEC;
    }
  } else if (berserk.fatigueRemaining > 0) {
    berserk.fatigueRemaining = Math.max(0, berserk.fatigueRemaining - dt);
  }

  if (!state.berserkRequested) return false;
  state.berserkRequested = false;

  if (!berserk.ready || berserk.activeRemaining > 0 || berserk.fatigueRemaining > 0 || state.ultimate.activeRemaining > 0) return false;
  berserk.ready = false;
  berserk.fatigueRemaining = 0;
  berserk.activeRemaining = berserk.durationSec;
  if (state.stats) state.stats.berserkUses += 1;
  return true;
}

export function berserkDamageMultiplier(state: RuntimeState): number {
  return isBerserkActive(state) ? BERSERK_DAMAGE_MULTIPLIER : 1;
}

export function berserkMoveMultiplier(state: RuntimeState): number {
  return isBerserkFatigued(state) ? BERSERK_FATIGUE_MOVE_MULTIPLIER : 1;
}
