import { describe, expect, it } from 'vitest';

import { selectedTitle1BaseWeaponCandidates } from '../../data/baseWeaponSelectionSource';
import { weapons } from '../../data/weapons';
import { resolveWeapon } from '../weaponEffect';
import {
  CURRENT_RUNTIME_WEAPON_EFFECT_TYPES,
  assertCurrentRuntimeWeaponEffectType,
  isCurrentRuntimeWeaponEffectType,
} from '../weaponRuntimeCapabilities';

describe('current weapon runtime capability contract', () => {
  it('keeps the current live effect surface explicit and small', () => {
    expect(CURRENT_RUNTIME_WEAPON_EFFECT_TYPES).toEqual([
      'projectile',
      'radial_random_projectile',
      'bouncing_projectile',
      'ground_area',
      'orbit',
    ]);
  });

  it('all current live weapons resolve to a supported runtime effect at every level', () => {
    for (const weapon of weapons) {
      for (let level = 1; level <= weapon.maxLevel; level += 1) {
        const resolved = resolveWeapon(weapon, level);
        expect(
          isCurrentRuntimeWeaponEffectType(resolved.type),
          `${weapon.id} Lv${level} resolved unsupported effect type ${String(resolved.type)}`,
        ).toBe(true);
      }
    }
  });

  it('fails closed for an unknown effect type instead of silently treating it as implemented', () => {
    expect(() => assertCurrentRuntimeWeaponEffectType('candidate_magic_hook', 'test weapon')).toThrow(
      'unsupported current runtime weapon effect type',
    );
  });

  it('does not silently promote Selected16 candidate Base Weapons into the live runtime catalog', () => {
    const liveIds = new Set(weapons.map((weapon) => weapon.id));
    const accidentallyLive = selectedTitle1BaseWeaponCandidates
      .map((weapon) => weapon.weaponId)
      .filter((id) => liveIds.has(id));

    expect(accidentallyLive).toEqual([]);
  });
});
