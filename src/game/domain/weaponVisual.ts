import type { WeaponDefinition } from './types';

/**
 * 武器の見た目（弾/範囲）の種別。Phaser非依存。factory が描画に使い、
 * VisualGallery / テストが「全武器に見た目があるか」を検査できるようにここに置く。
 */
export type ProjectileVisualKind =
  | 'pencil'
  | 'pencil_line'
  | 'name_line'
  | 'star'
  | 'paper_lantern'
  | 'blade'
  | 'envelope_blade'
  | 'glass_marble'
  | 'lens_marble'
  | 'paper_airplane'
  | 'big_plane';

export type AreaVisualKind = 'ink' | 'lamp' | 'dawn';

/** 射出/拡散弾の見た目（projectile / radial_random_projectile）。 */
export function projectileKindForWeapon(weaponId: string): ProjectileVisualKind {
  switch (weaponId) {
    case 'unfinished_line': return 'pencil_line';
    case 'unforgotten_name': return 'name_line';
    case 'stardust_shot': return 'star';
    case 'north_star_lantern': return 'paper_lantern';
    case 'postcard_blade': return 'blade';
    case 'addressless_blade': return 'envelope_blade';
    case 'night_pencil':
    default: return 'pencil';
  }
}

/** 反射弾の見た目（bouncing_projectile）。 */
export function bouncingKindForWeapon(weaponId: string): ProjectileVisualKind {
  switch (weaponId) {
    case 'paper_airplane': return 'paper_airplane';
    case 'tailwind_plane': return 'big_plane';
    case 'memory_marble': return 'lens_marble';
    case 'marble':
    default: return 'glass_marble';
  }
}

/** 地面範囲の見た目（ground_area）。 */
export function areaKindForWeapon(weaponId: string): AreaVisualKind {
  switch (weaponId) {
    case 'dawn_ink_lamp': return 'dawn';
    case 'streetlamp_ring': return 'lamp';
    default: return 'ink';
  }
}

export type WeaponRenderMode = 'projectile' | 'radial' | 'bounce' | 'area' | 'orbit';

export type WeaponRenderInfo =
  | { mode: 'projectile' | 'radial' | 'bounce'; projectileKind: ProjectileVisualKind }
  | { mode: 'area'; areaKind: AreaVisualKind }
  | { mode: 'orbit' };

/** 武器定義から、どう描画されるか（モードと見た目kind）を返す。 */
export function weaponRenderInfo(def: WeaponDefinition): WeaponRenderInfo {
  const type = def.levels[0]?.effect.type as string | undefined;
  switch (type) {
    case 'projectile':
      return { mode: 'projectile', projectileKind: projectileKindForWeapon(def.id) };
    case 'radial_random_projectile':
      return { mode: 'radial', projectileKind: projectileKindForWeapon(def.id) };
    case 'bouncing_projectile':
      return { mode: 'bounce', projectileKind: bouncingKindForWeapon(def.id) };
    case 'ground_area':
      return { mode: 'area', areaKind: areaKindForWeapon(def.id) };
    case 'orbit':
      return { mode: 'orbit' };
    default:
      return { mode: 'projectile', projectileKind: 'pencil' };
  }
}
