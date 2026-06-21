import type { WeaponDefinition } from './types';

export type EffectValues = Record<string, number | string | boolean>;

/**
 * 武器のレベル効果を畳み込んで具体値を得る（純関数）。
 * level1 を基点に、`*Add` は加算、`*Multiplier` は乗算で重ねる。
 */
export function resolveWeapon(def: WeaponDefinition, level: number): EffectValues {
  const base: EffectValues = { ...def.levels[0].effect } as EffectValues;
  for (let l = 2; l <= level; l += 1) {
    const eff = def.levels[l - 1]?.effect;
    if (!eff) continue;
    for (const [k, v] of Object.entries(eff)) {
      if (k === 'type' || k === 'targeting' || k === 'evolved') {
        base[k] = v as string | boolean;
        continue;
      }
      if (k.endsWith('Add')) {
        const bk = k.slice(0, -3);
        base[bk] = ((base[bk] as number) ?? 0) + (v as number);
      } else if (k.endsWith('Multiplier')) {
        const bk = k.slice(0, -'Multiplier'.length);
        base[bk] = ((base[bk] as number) ?? 1) * (v as number);
      } else {
        base[k] = v as number | string | boolean;
      }
    }
  }
  return base;
}

export function num(eff: EffectValues, key: string, fallback = 0): number {
  const v = eff[key];
  return typeof v === 'number' ? v : fallback;
}
