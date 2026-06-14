import { describe, it, expect } from 'vitest';
import { weapons, weaponById } from '../../data/weapons';
import { weaponRenderInfo, type ProjectileVisualKind, type AreaVisualKind } from '../weaponVisual';

const PROJECTILE_KINDS: ProjectileVisualKind[] = [
  'pencil', 'pencil_line', 'name_line', 'star', 'paper_lantern', 'blade',
  'envelope_blade', 'glass_marble', 'lens_marble', 'paper_airplane', 'big_plane',
];
const AREA_KINDS: AreaVisualKind[] = ['ink', 'lamp', 'dawn'];

describe('weaponRenderInfo', () => {
  it('全武器が描画モードと有効な見た目kindを持つ', () => {
    for (const def of weapons) {
      const info = weaponRenderInfo(def);
      if (info.mode === 'area') {
        expect(AREA_KINDS).toContain(info.areaKind);
      } else if (info.mode === 'orbit') {
        // orbit は kind を持たない（しおりの固定描画）
        expect(info.mode).toBe('orbit');
      } else {
        expect(PROJECTILE_KINDS).toContain(info.projectileKind);
      }
    }
  });

  it('進化後武器は専用の見た目kindに対応している', () => {
    const expected: Record<string, ProjectileVisualKind | AreaVisualKind> = {
      unfinished_line: 'pencil_line',
      north_star_lantern: 'paper_lantern',
      dawn_ink_lamp: 'dawn',
      unforgotten_name: 'name_line',
      memory_marble: 'lens_marble',
      addressless_blade: 'envelope_blade',
      tailwind_plane: 'big_plane',
    };
    for (const [id, kind] of Object.entries(expected)) {
      const def = weaponById.get(id);
      expect(def, `${id} が存在する`).toBeDefined();
      const info = weaponRenderInfo(def!);
      const actual = info.mode === 'area' ? info.areaKind : info.mode === 'orbit' ? 'orbit' : info.projectileKind;
      expect(actual, `${id} の見た目`).toBe(kind);
    }
  });

  it('基本武器どうしの弾kindが重複しすぎない（最低5種は別物）', () => {
    const base = weapons.filter((w) => !w.tags.includes('evolved'));
    const kinds = new Set(
      base.map((w) => {
        const info = weaponRenderInfo(w);
        return info.mode === 'area' ? `area:${info.areaKind}` : info.mode === 'orbit' ? 'orbit' : `proj:${info.projectileKind}`;
      }),
    );
    expect(kinds.size).toBeGreaterThanOrEqual(5);
  });
});
