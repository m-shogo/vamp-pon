import { describe, it, expect } from 'vitest';
import { weapons, weaponById } from '../../data/weapons';
import { passives, passiveById } from '../../data/passives';
import { rareItems, rareItemById } from '../../data/rareItems';
import { enemies, enemyById } from '../../data/enemies';
import { waves } from '../../data/waves';
import { evolutions } from '../../data/evolutions';
import { characters } from '../../data/characters';
import { enemyConsistencyError } from '../enemyRules';

const PASSIVE_STATS = new Set(['magnetMultiplier', 'mightMultiplier', 'xpMultiplier', 'moveSpeedMultiplier', 'cooldownMultiplier']);
const BEHAVIORS = new Set(['chase', 'slow_chase', 'offset_chase', 'swarm_chase', 'elite_chase']);
const VISUAL_KINDS = new Set(['ink_blob', 'paper_scrap', 'signpost', 'capsule', 'haze', 'label_elite']);
const DIRECTIONS = new Set(['bottom', 'top', 'left', 'right', 'around']);
const EVOLUTION_KINDS = new Set(['upgrade', 'fusion', 'awakening']);

describe('weapons データ', () => {
  it('levels が 1..maxLevel まで連番で揃っている', () => {
    for (const w of weapons) {
      expect(w.levels).toHaveLength(w.maxLevel);
      w.levels.forEach((lvl, i) => expect(lvl.level).toBe(i + 1));
    }
  });

  it('level1 に effect.type がある', () => {
    for (const w of weapons) expect(typeof w.levels[0].effect.type).toBe('string');
  });

  it('id が一意', () => {
    expect(new Set(weapons.map((w) => w.id)).size).toBe(weapons.length);
  });
});

describe('passives データ', () => {
  it('levels が 1..maxLevel まで連番、stat が有効', () => {
    for (const p of passives) {
      expect(p.levels).toHaveLength(p.maxLevel);
      p.levels.forEach((lvl, i) => expect(lvl.level).toBe(i + 1));
      expect(PASSIVE_STATS.has(p.stat)).toBe(true);
    }
  });
});

describe('rareItems データ', () => {
  it('id が一意で、レベルを持たない', () => {
    expect(new Set(rareItems.map((item) => item.id)).size).toBe(rareItems.length);
    for (const item of rareItems) expect(item.category).toBe('rare_item');
  });
});

describe('enemies データ', () => {
  it('behavior / visualKind が有効、tagsとvisualKindが整合', () => {
    for (const e of enemies) {
      expect(BEHAVIORS.has(e.behavior)).toBe(true);
      expect(VISUAL_KINDS.has(e.visualKind)).toBe(true);
      expect(enemyConsistencyError(e)).toBeNull();
    }
  });
});

describe('waves データ', () => {
  it('start < end、spawnは enemyId 実在・rate と count は排他・方向は有効', () => {
    for (const w of waves) {
      expect(w.start).toBeLessThan(w.end);
      for (const s of w.spawns) {
        expect(enemyById.has(s.enemyId)).toBe(true);
        const hasRate = s.spawnRatePerSecond != null;
        const hasCount = s.spawnCount != null;
        expect(hasRate !== hasCount).toBe(true);
        const dirs = Object.keys(s.directionWeights);
        expect(dirs.length).toBeGreaterThan(0);
        for (const d of dirs) expect(DIRECTIONS.has(d)).toBe(true);
      }
    }
  });

  it('エリート（黒ラベルの影）が 180/300/420 付近に出現する', () => {
    const eliteWaves = waves.filter((w) => w.spawns.some((s) => s.enemyId === 'black_label_shadow'));
    const starts = eliteWaves.map((w) => w.start);
    expect(starts).toContain(180);
    expect(starts).toContain(300);
    expect(starts).toContain(420);
  });
});

describe('evolutions データ', () => {
  it('参照する武器/条件/進化先が実在し、進化先は evolved タグ', () => {
    for (const evo of evolutions) {
      expect(EVOLUTION_KINDS.has(evo.kind)).toBe(true);
      expect(weaponById.has(evo.fromWeaponId)).toBe(true);
      if (evo.requiredPassiveId) expect(passiveById.has(evo.requiredPassiveId)).toBe(true);
      if (evo.requiredRareItemId) expect(rareItemById.has(evo.requiredRareItemId)).toBe(true);
      if (evo.requiredWeaponId) expect(weaponById.has(evo.requiredWeaponId)).toBe(true);
      for (const id of evo.consumedWeaponIds ?? []) expect(weaponById.has(id)).toBe(true);
      for (const id of evo.consumedRareItemIds ?? []) expect(rareItemById.has(id)).toBe(true);
      const evolved = weaponById.get(evo.evolvedWeaponId);
      expect(evolved).toBeDefined();
      expect(evolved?.tags).toContain('evolved');
    }
  });

  it('強化進化/合体/覚醒の条件が混ざっていない', () => {
    for (const evo of evolutions) {
      if (evo.kind === 'upgrade') {
        expect(evo.requiredPassiveId).toBeDefined();
        expect(evo.requiredWeaponId).toBeUndefined();
        expect(evo.requiredRareItemId).toBeUndefined();
      }
      if (evo.kind === 'fusion') {
        expect(evo.requiredWeaponId).toBeDefined();
        expect(evo.requiredRareItemId).toBeUndefined();
      }
      if (evo.kind === 'awakening') {
        expect(evo.requiredRareItemId).toBeDefined();
        expect(evo.requiredWeaponId).toBeUndefined();
      }
    }
  });
});

describe('characters データ', () => {
  it('initialWeaponId が実在する', () => {
    for (const c of characters) expect(weaponById.has(c.initialWeaponId)).toBe(true);
  });
});
