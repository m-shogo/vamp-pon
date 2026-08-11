export const CURRENT_RUNTIME_WEAPON_EFFECT_TYPES = [
  'projectile',
  'radial_random_projectile',
  'bouncing_projectile',
  'ground_area',
  'orbit',
] as const;

export type CurrentRuntimeWeaponEffectType = (typeof CURRENT_RUNTIME_WEAPON_EFFECT_TYPES)[number];

const currentRuntimeWeaponEffectTypeSet = new Set<string>(CURRENT_RUNTIME_WEAPON_EFFECT_TYPES);

export function isCurrentRuntimeWeaponEffectType(value: unknown): value is CurrentRuntimeWeaponEffectType {
  return typeof value === 'string' && currentRuntimeWeaponEffectTypeSet.has(value);
}

/**
 * Current Web runtime capability boundary.
 *
 * Candidate Base Weapon archetypes must not be mapped onto an existing effect type merely to
 * make them appear implemented. Add a new runtime hook + tests first, then extend this list.
 */
export function assertCurrentRuntimeWeaponEffectType(
  value: unknown,
  context: string,
): asserts value is CurrentRuntimeWeaponEffectType {
  if (!isCurrentRuntimeWeaponEffectType(value)) {
    throw new Error(`unsupported current runtime weapon effect type for ${context}: ${String(value)}`);
  }
}
