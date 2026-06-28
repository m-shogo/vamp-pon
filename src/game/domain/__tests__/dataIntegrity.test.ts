import { describe, it, expect } from 'vitest';
import { weapons, weaponById } from '../../data/weapons';
import { passives, passiveById } from '../../data/passives';
import { rareItems, rareItemById } from '../../data/rareItems';
import { enemies, enemyById } from '../../data/enemies';
import { buildArchetypes } from '../../data/buildArchetypes';
import { ENEMY_PATTERNS } from '../../data/enemyPatterns';
import { stageRecipes, waves } from '../../data/waves';
import { evolutions } from '../../data/evolutions';
import { characters } from '../../data/characters';
import { enemyConsistencyError } from '../enemyRules';

const PASSIVE_STATS = new Set(['magnetMultiplier', 'mightMultiplier', 'xpMultiplier', 'moveSpeedMultiplier', 'cooldownMultiplier']);
const BEHAVIORS = new Set(['chase', 'slow_chase', 'offset_chase', 'swarm_chase', 'elite_chase', 'charger', 'orbit_chase', 'coward']);
const ENEMY_ROLES = new Set(['pressure', 'charger', 'flank', 'supply', 'swarm', 'elite']);
const VISUAL_KINDS = new Set(['ink_blob', 'paper_scrap', 'signpost', 'capsule', 'haze', 'label_elite']);
const DIRECTIONS = new Set(['bottom', 'top', 'left', 'right', 'around']);
const EVOLUTION_KINDS = new Set(['upgrade', 'fusion', 'awakening']);
const RARE_ITEM_ROLES = new Set(['awakening_material', 'survival_revival']);

const ENEMY_PATTERN_IDS = new Set(Object.keys(ENEMY_PATTERNS));

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
  it('id が一意で、role が有効値', () => {
    expect(new Set(rareItems.map((item) => item.id)).size).toBe(rareItems.length);
    for (const item of rareItems) {
      expect(item.category).toBe('rare_item');
      expect(RARE_ITEM_ROLES.has(item.role)).toBe(true);
    }
  });

  it('覚醒素材は覚醒条件にだけ使われる', () => {
    const awakeningRareIds = new Set(
      evolutions
        .filter((evo) => evo.kind === 'awakening')
        .map((evo) => evo.requiredRareItemId)
        .filter((id): id is string => id != null),
    );

    for (const item of rareItems.filter((rare) => rare.role === 'awakening_material')) {
      expect(item.tags).toContain('awakening');
      expect(awakeningRareIds.has(item.id)).toBe(true);
    }
  });

  it('覚醒条件で使うレアアイテムは必ず覚醒素材である', () => {
    for (const evo of evolutions.filter((item) => item.kind === 'awakening')) {
      expect(evo.requiredRareItemId).toBeDefined();
      const rare = rareItemById.get(evo.requiredRareItemId!);
      expect(rare?.role).toBe('awakening_material');
    }
  });

  it('survival_revival role のレアは覚醒条件に使われない', () => {
    const evolutionRareIds = new Set(
      evolutions.flatMap((evo) => [
        evo.requiredRareItemId,
        ...(evo.consumedRareItemIds ?? []),
      ]).filter((id): id is string => id != null),
    );

    for (const item of rareItems.filter((rare) => rare.role === 'survival_revival')) {
      expect(evolutionRareIds.has(item.id), item.id).toBe(false);
    }
  });

  it('dawn_ticket は復帰レアで、覚醒素材タグを持たず、覚醒条件に出ない', () => {
    const dawnTicket = rareItemById.get('dawn_ticket');
    expect(dawnTicket?.role).toBe('survival_revival');
    expect(dawnTicket?.tags).not.toContain('awakening');

    for (const evo of evolutions) {
      expect(evo.requiredRareItemId).not.toBe('dawn_ticket');
      expect(evo.consumedRareItemIds ?? []).not.toContain('dawn_ticket');
    }
  });

  it('rare item の ticket tag は復帰レア用途だけで使う', () => {
    for (const item of rareItems.filter((rare) => rare.tags.includes('ticket'))) {
      expect(item.role).toBe('survival_revival');
    }
  });
});

describe('buildArchetypes データ', () => {
  it('参照する武器/パッシブが実在し、方針として空ではない', () => {
    for (const archetype of buildArchetypes) {
      expect(archetype.weaponIds.length).toBeGreaterThan(0);
      expect(archetype.passiveIds.length).toBeGreaterThan(0);
      for (const id of archetype.weaponIds) expect(weaponById.has(id)).toBe(true);
      for (const id of archetype.passiveIds) expect(passiveById.has(id)).toBe(true);
      expect(archetype.playHint.length).toBeGreaterThan(0);
    }
  });
});

describe('enemies データ', () => {
  it('behavior / roles / visualKind が有効、tagsとvisualKindが整合', () => {
    for (const e of enemies) {
      expect(BEHAVIORS.has(e.behavior)).toBe(true);
      expect(e.roles.length).toBeGreaterThan(0);
      for (const role of e.roles) expect(ENEMY_ROLES.has(role)).toBe(true);
      expect(VISUAL_KINDS.has(e.visualKind)).toBe(true);
      expect(enemyConsistencyError(e)).toBeNull();
    }
  });

  it('patternIds が登録済みパターンを参照している', () => {
    for (const e of enemies) {
      expect(e.patternIds?.length ?? 0).toBeGreaterThan(0);
      for (const patternId of e.patternIds ?? []) {
        expect(ENEMY_PATTERN_IDS.has(patternId)).toBe(true);
      }
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
        if (hasRate) expect(s.spawnRatePerSecond).toBeGreaterThan(0);
        if (hasCount) expect(s.spawnCount).toBeGreaterThan(0);
        if (s.maxAlive != null) expect(s.maxAlive).toBeGreaterThan(0);
        const dirs = Object.keys(s.directionWeights);
        expect(dirs.length).toBeGreaterThan(0);
        for (const d of dirs) expect(DIRECTIONS.has(d)).toBe(true);
      }
    }
  });

  it('spawn の patternId が登録済みで、敵の patternIds と整合する', () => {
    for (const w of waves) {
      for (const s of w.spawns) {
        expect(s.patternId).toBeDefined();
        expect(ENEMY_PATTERN_IDS.has(s.patternId ?? '')).toBe(true);
        expect(enemyById.get(s.enemyId)?.patternIds).toContain(s.patternId);
      }
    }
  });

  it('時系列順で、定常waveは意図せず重複しない', () => {
    for (let i = 1; i < waves.length; i += 1) {
      expect(waves[i].start).toBeGreaterThanOrEqual(waves[i - 1].start);
      expect(waves[i].start).toBeGreaterThanOrEqual(waves[i - 1].end);
    }
  });

  it('0〜150秒で基本・charger・orbit・黒カプセルが登場する', () => {
    const earlyEnemyIds = new Set(
      waves
        .filter((w) => w.start < 150 && w.end > 0)
        .flatMap((w) => w.spawns.map((s) => s.enemyId)),
    );
    expect(earlyEnemyIds.has('ink_shadow')).toBe(true);
    expect(earlyEnemyIds.has('paper_scrap_shadow')).toBe(true);
    expect(earlyEnemyIds.has('lost_direction')).toBe(true);
    expect(earlyEnemyIds.has('black_capsule')).toBe(true);
  });

  it('エリート（黒ラベルの影）が 150/300/420 付近に出現する', () => {
    const eliteWaves = waves.filter((w) => w.spawns.some((s) => s.enemyId === 'black_label_shadow'));
    const starts = eliteWaves.map((w) => w.start);
    expect(starts).toContain(150);
    expect(starts).toContain(300);
    expect(starts).toContain(420);
  });
});

describe('stageRecipes データ', () => {
  it('stageNumber が一意で、wave の patternId が allowedPatternIds に含まれる', () => {
    expect(new Set(stageRecipes.map((recipe) => recipe.stageNumber)).size).toBe(stageRecipes.length);
    for (const recipe of stageRecipes) {
      expect(recipe.allowedPatternIds.length).toBeGreaterThan(0);
      for (const patternId of recipe.allowedPatternIds) expect(ENEMY_PATTERN_IDS.has(patternId)).toBe(true);
      for (const wave of recipe.waves) {
        for (const spawn of wave.spawns) {
          expect(recipe.allowedPatternIds).toContain(spawn.patternId);
        }
      }
    }
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

  it('requiredWeaponLevel が指定されている場合 from武器の maxLevel を超えない（実条件は maxLevel に連動）', () => {
    for (const evo of evolutions) {
      const fromMax = weaponById.get(evo.fromWeaponId)?.maxLevel ?? 0;
      if (evo.requiredWeaponLevel !== undefined) {
        expect(evo.requiredWeaponLevel).toBeLessThanOrEqual(fromMax);
      }
      if (evo.requiredWeaponId && evo.requiredWeaponLevel2 !== undefined) {
        const secMax = weaponById.get(evo.requiredWeaponId)?.maxLevel ?? 0;
        expect(evo.requiredWeaponLevel2).toBeLessThanOrEqual(secMax);
      }
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
