import { describe, expect, it } from 'vitest';

import { statusDefinitions, type StatusKind } from '../../data/combatAffinitySource';
import {
  applyRuntimeStatus,
  clearRuntimeStatus,
  createRuntimeStatusState,
  tickRuntimeStatuses,
  type RuntimeStatusApplicationPolicy,
} from '../statusRuntime';

const basePolicy: RuntimeStatusApplicationPolicy = {
  durationSec: 2,
  stacksPerApplication: 1,
  stackMode: 'REPLACE',
  maxStacks: 1,
  magnitude: 0.25,
  magnitudeMode: 'REPLACE',
  maxMagnitude: 1,
  internalCooldownSec: 0,
  respectInternalCooldown: false,
};

describe('status runtime kernel', () => {
  it('starts empty and applies a caller-supplied policy without owning balance defaults', () => {
    const initial = createRuntimeStatusState();
    const result = applyRuntimeStatus(initial, 'BURN', basePolicy);

    expect(result.applied).toBe(true);
    expect(result.instance).toEqual({ kind: 'BURN', remainingSec: 2, stacks: 1, magnitude: 0.25 });
    expect(initial.active.BURN).toBeUndefined();
  });

  it('accepts all 16 current content Status kinds without adding per-status balance defaults', () => {
    const kinds = Object.keys(statusDefinitions) as StatusKind[];
    expect(kinds).toHaveLength(16);

    let state = createRuntimeStatusState();
    for (const kind of kinds) {
      state = applyRuntimeStatus(state, kind, basePolicy).state;
    }
    expect(Object.keys(state.active).sort()).toEqual([...kinds].sort());
  });

  it('supports refresh without adding stacks', () => {
    const first = applyRuntimeStatus(createRuntimeStatusState(), 'MARKED', {
      ...basePolicy,
      durationSec: 3,
      stackMode: 'ADD_CAPPED',
      maxStacks: 4,
    }).state;
    const stacked = applyRuntimeStatus(first, 'MARKED', {
      ...basePolicy,
      durationSec: 3,
      stackMode: 'ADD_CAPPED',
      maxStacks: 4,
    }).state;
    const elapsed = tickRuntimeStatuses(stacked, 2);
    const refreshed = applyRuntimeStatus(elapsed, 'MARKED', {
      ...basePolicy,
      durationSec: 5,
      stackMode: 'REFRESH',
      maxStacks: 4,
    });

    expect(refreshed.instance?.stacks).toBe(2);
    expect(refreshed.instance?.remainingSec).toBe(5);
  });

  it('caps additive stacks and additive magnitude using caller policy', () => {
    let state = createRuntimeStatusState();
    const policy: RuntimeStatusApplicationPolicy = {
      ...basePolicy,
      stackMode: 'ADD_CAPPED',
      maxStacks: 3,
      magnitude: 0.2,
      magnitudeMode: 'ADD_CAPPED',
      maxMagnitude: 0.5,
    };

    state = applyRuntimeStatus(state, 'CONDUCTIVE', policy).state;
    state = applyRuntimeStatus(state, 'CONDUCTIVE', policy).state;
    state = applyRuntimeStatus(state, 'CONDUCTIVE', policy).state;
    state = applyRuntimeStatus(state, 'CONDUCTIVE', policy).state;

    expect(state.active.CONDUCTIVE?.stacks).toBe(3);
    expect(state.active.CONDUCTIVE?.magnitude).toBe(0.5);
  });

  it('keeps internal cooldown after the active status expires', () => {
    const applied = applyRuntimeStatus(createRuntimeStatusState(), 'FREEZE', {
      ...basePolicy,
      durationSec: 1,
      internalCooldownSec: 3,
      respectInternalCooldown: true,
    }).state;
    const afterExpiry = tickRuntimeStatuses(applied, 1.25);

    expect(afterExpiry.active.FREEZE).toBeUndefined();
    expect(afterExpiry.cooldowns.FREEZE).toBeCloseTo(1.75);
    const blocked = applyRuntimeStatus(afterExpiry, 'FREEZE', {
      ...basePolicy,
      durationSec: 1,
      internalCooldownSec: 3,
      respectInternalCooldown: true,
    });
    expect(blocked.applied).toBe(false);
    expect(blocked.reason).toBe('INTERNAL_COOLDOWN');
  });

  it('expires active statuses and cooldowns independently', () => {
    const state = applyRuntimeStatus(createRuntimeStatusState(), 'CHILL', {
      ...basePolicy,
      durationSec: 4,
      internalCooldownSec: 1,
    }).state;
    const ticked = tickRuntimeStatuses(state, 2);

    expect(ticked.active.CHILL?.remainingSec).toBe(2);
    expect(ticked.cooldowns.CHILL).toBeUndefined();
  });

  it('clears an active status without erasing its independent cooldown ledger', () => {
    const state = applyRuntimeStatus(createRuntimeStatusState(), 'SLEEP', {
      ...basePolicy,
      internalCooldownSec: 2,
    }).state;
    const cleared = clearRuntimeStatus(state, 'SLEEP');

    expect(cleared.active.SLEEP).toBeUndefined();
    expect(cleared.cooldowns.SLEEP).toBe(2);
  });

  it('rejects invalid numeric policy instead of inventing fallbacks', () => {
    expect(() => applyRuntimeStatus(createRuntimeStatusState(), 'BURN', {
      ...basePolicy,
      durationSec: 0,
    })).toThrow('durationSec must be a finite positive number');
    expect(() => applyRuntimeStatus(createRuntimeStatusState(), 'MARKED', {
      ...basePolicy,
      stacksPerApplication: 2,
      maxStacks: 1,
    })).toThrow('stacksPerApplication must not exceed maxStacks');
  });
});
