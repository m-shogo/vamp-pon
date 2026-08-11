import type { StatusKind } from '../data/combatAffinitySource.ts';

export type RuntimeStatusInstance = {
  kind: StatusKind;
  remainingSec: number;
  stacks: number;
  magnitude: number;
};

export type RuntimeStatusState = {
  active: Partial<Record<StatusKind, RuntimeStatusInstance>>;
  cooldowns: Partial<Record<StatusKind, number>>;
};

export type StatusStackMode = 'REPLACE' | 'REFRESH' | 'ADD_CAPPED';
export type StatusMagnitudeMode = 'REPLACE' | 'MAX' | 'ADD_CAPPED';

/**
 * Cross-runtime semantic policy authority for Status application mechanics.
 *
 * Runtime mechanics only. All balance values are supplied by the caller.
 * This kernel intentionally owns no BURN duration, CHILL ratio, Boss modifier, etc.
 * Unity may keep its own C# lifecycle container, but application semantics must not
 * silently diverge from these explicit stack/magnitude/cooldown policies.
 */
export type RuntimeStatusApplicationPolicy = {
  durationSec: number;
  stacksPerApplication: number;
  stackMode: StatusStackMode;
  maxStacks: number;
  magnitude: number;
  magnitudeMode: StatusMagnitudeMode;
  maxMagnitude: number;
  internalCooldownSec: number;
  respectInternalCooldown: boolean;
};

export type RuntimeStatusApplicationResult = {
  state: RuntimeStatusState;
  applied: boolean;
  reason: 'APPLIED' | 'INTERNAL_COOLDOWN';
  instance: RuntimeStatusInstance | null;
};

export function createRuntimeStatusState(): RuntimeStatusState {
  return { active: {}, cooldowns: {} };
}

function finiteNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite non-negative number, got ${value}`);
  }
}

export function assertRuntimeStatusApplicationPolicy(policy: RuntimeStatusApplicationPolicy): void {
  if (!Number.isFinite(policy.durationSec) || policy.durationSec <= 0) {
    throw new Error(`durationSec must be a finite positive number, got ${policy.durationSec}`);
  }
  if (!Number.isInteger(policy.stacksPerApplication) || policy.stacksPerApplication <= 0) {
    throw new Error(`stacksPerApplication must be a positive integer, got ${policy.stacksPerApplication}`);
  }
  if (!Number.isInteger(policy.maxStacks) || policy.maxStacks <= 0) {
    throw new Error(`maxStacks must be a positive integer, got ${policy.maxStacks}`);
  }
  if (policy.stacksPerApplication > policy.maxStacks) {
    throw new Error('stacksPerApplication must not exceed maxStacks');
  }
  finiteNonNegative(policy.magnitude, 'magnitude');
  finiteNonNegative(policy.maxMagnitude, 'maxMagnitude');
  if (policy.magnitude > policy.maxMagnitude) {
    throw new Error('magnitude must not exceed maxMagnitude');
  }
  finiteNonNegative(policy.internalCooldownSec, 'internalCooldownSec');
}

function resolveStacks(
  current: RuntimeStatusInstance | undefined,
  policy: RuntimeStatusApplicationPolicy,
): number {
  if (!current || policy.stackMode === 'REPLACE') {
    return policy.stacksPerApplication;
  }
  if (policy.stackMode === 'REFRESH') {
    return current.stacks;
  }
  return Math.min(policy.maxStacks, current.stacks + policy.stacksPerApplication);
}

function resolveMagnitude(
  current: RuntimeStatusInstance | undefined,
  policy: RuntimeStatusApplicationPolicy,
): number {
  if (!current || policy.magnitudeMode === 'REPLACE') {
    return policy.magnitude;
  }
  if (policy.magnitudeMode === 'MAX') {
    return Math.max(current.magnitude, policy.magnitude);
  }
  return Math.min(policy.maxMagnitude, current.magnitude + policy.magnitude);
}

export function applyRuntimeStatus(
  state: RuntimeStatusState,
  kind: StatusKind,
  policy: RuntimeStatusApplicationPolicy,
): RuntimeStatusApplicationResult {
  assertRuntimeStatusApplicationPolicy(policy);

  const cooldown = state.cooldowns[kind] ?? 0;
  if (policy.respectInternalCooldown && cooldown > 0) {
    return {
      state,
      applied: false,
      reason: 'INTERNAL_COOLDOWN',
      instance: state.active[kind] ?? null,
    };
  }

  const current = state.active[kind];
  const instance: RuntimeStatusInstance = {
    kind,
    remainingSec: policy.durationSec,
    stacks: resolveStacks(current, policy),
    magnitude: resolveMagnitude(current, policy),
  };

  return {
    state: {
      active: { ...state.active, [kind]: instance },
      cooldowns: policy.internalCooldownSec > 0
        ? { ...state.cooldowns, [kind]: policy.internalCooldownSec }
        : { ...state.cooldowns },
    },
    applied: true,
    reason: 'APPLIED',
    instance,
  };
}

export function tickRuntimeStatuses(state: RuntimeStatusState, dtSec: number): RuntimeStatusState {
  finiteNonNegative(dtSec, 'dtSec');
  if (dtSec === 0) return state;

  const active: RuntimeStatusState['active'] = {};
  for (const [kind, instance] of Object.entries(state.active) as Array<[StatusKind, RuntimeStatusInstance]>) {
    const remainingSec = Math.max(0, instance.remainingSec - dtSec);
    if (remainingSec > 0) {
      active[kind] = { ...instance, remainingSec };
    }
  }

  const cooldowns: RuntimeStatusState['cooldowns'] = {};
  for (const [kind, remaining] of Object.entries(state.cooldowns) as Array<[StatusKind, number]>) {
    const next = Math.max(0, remaining - dtSec);
    if (next > 0) cooldowns[kind] = next;
  }

  return { active, cooldowns };
}

export function clearRuntimeStatus(state: RuntimeStatusState, kind: StatusKind): RuntimeStatusState {
  if (state.active[kind] == null) return state;
  const active = { ...state.active };
  delete active[kind];
  return { active, cooldowns: { ...state.cooldowns } };
}
