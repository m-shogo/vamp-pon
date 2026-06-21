import { describe, it, expect } from 'vitest';
import type { EnemyBehavior, EnemyDefinition } from '../types';
import { capsuleDropChanceFor, chargerPhaseFor, computeBehaviorStep, enemyConsistencyError } from '../enemyRules';
import { enemies } from '../../data/enemies';

function makeEnemy(partial: Partial<EnemyDefinition>): EnemyDefinition {
  return {
    id: 'test',
    name: 'テスト',
    hp: 10,
    moveSpeed: 50,
    contactDamage: 5,
    xpDrop: 1,
    tags: [],
    behavior: 'chase',
    visualKind: 'ink_blob',
    description: '',
    ...partial,
  };
}

describe('enemyConsistencyError', () => {
  it('全ての本番敵データが整合している', () => {
    const errors = enemies.map(enemyConsistencyError).filter(Boolean);
    expect(errors).toEqual([]);
  });

  it('elite タグだけで visualKind が通常なら検出する', () => {
    const def = makeEnemy({ tags: ['elite'], visualKind: 'ink_blob' });
    expect(enemyConsistencyError(def)).not.toBeNull();
  });

  it('label_elite なのに elite タグが無ければ検出する', () => {
    const def = makeEnemy({ tags: ['medium'], visualKind: 'label_elite' });
    expect(enemyConsistencyError(def)).not.toBeNull();
  });

  it('整合していれば null', () => {
    const ok = makeEnemy({ tags: ['elite'], visualKind: 'label_elite' });
    expect(enemyConsistencyError(ok)).toBeNull();
  });
});

describe('capsuleDropChanceFor', () => {
  it('drops が無ければ 0', () => {
    expect(capsuleDropChanceFor(makeEnemy({}))).toBe(0);
  });

  it('1.0 はそのまま', () => {
    expect(capsuleDropChanceFor(makeEnemy({ drops: [{ type: 'memory_capsule', chance: 1 }] }))).toBe(1);
  });

  it('1 を超えたら 1 に丸める', () => {
    expect(capsuleDropChanceFor(makeEnemy({ drops: [{ type: 'memory_capsule', chance: 1.2 }] }))).toBe(1);
  });

  it('負値は 0 に丸める', () => {
    expect(capsuleDropChanceFor(makeEnemy({ drops: [{ type: 'memory_capsule', chance: -0.1 }] }))).toBe(0);
  });
});

describe('computeBehaviorStep', () => {
  const base = { dx: 100, dy: 0, dist: 100, offsetSign: 1, iid: 1, elapsedSec: 0 };

  it('chase はプレイヤー方向の単位ベクトル / 倍率1', () => {
    const s = computeBehaviorStep({ ...base, behavior: 'chase' });
    expect(s.dirX).toBeCloseTo(1, 5);
    expect(s.dirY).toBeCloseTo(0, 5);
    expect(s.speedFactor).toBe(1);
  });

  it('slow_chase は近距離で減速', () => {
    expect(computeBehaviorStep({ ...base, dist: 50, behavior: 'slow_chase' }).speedFactor).toBe(0.5);
    expect(computeBehaviorStep({ ...base, dist: 100, behavior: 'slow_chase' }).speedFactor).toBe(1);
  });

  it('elite_chase は遠距離で加速', () => {
    expect(computeBehaviorStep({ ...base, dist: 300, behavior: 'elite_chase' }).speedFactor).toBe(1.25);
    expect(computeBehaviorStep({ ...base, dist: 100, behavior: 'elite_chase' }).speedFactor).toBe(1);
  });

  it('charger は予兆・突進・硬直の速度差を持つ', () => {
    expect(computeBehaviorStep({ ...base, elapsedSec: 0, behavior: 'charger' }).speedFactor).toBeLessThan(0.5);
    expect(computeBehaviorStep({ ...base, elapsedSec: 1.3, behavior: 'charger' }).speedFactor).toBeGreaterThan(2);
    expect(computeBehaviorStep({ ...base, elapsedSec: 2.1, behavior: 'charger' }).speedFactor).toBeLessThan(0.3);
  });

  it('charger phase は windup / dash / recovery の境界を返す', () => {
    expect(chargerPhaseFor({ iid: 0, elapsedSec: 0 })).toBe('windup');
    expect(chargerPhaseFor({ iid: 0, elapsedSec: 1.149 })).toBe('windup');
    expect(chargerPhaseFor({ iid: 0, elapsedSec: 1.15 })).toBe('dash');
    expect(chargerPhaseFor({ iid: 0, elapsedSec: 1.749 })).toBe('dash');
    expect(chargerPhaseFor({ iid: 0, elapsedSec: 1.75 })).toBe('recovery');
  });

  it('charger は dash 中だけ高倍率、recovery は反撃可能な低倍率', () => {
    const windup = computeBehaviorStep({ ...base, elapsedSec: 0.5, behavior: 'charger' });
    const dash = computeBehaviorStep({ ...base, elapsedSec: 1.3, behavior: 'charger' });
    const recovery = computeBehaviorStep({ ...base, elapsedSec: 2.4, behavior: 'charger' });
    expect(windup.speedFactor).toBeCloseTo(0.34);
    expect(dash.speedFactor).toBeCloseTo(2.65);
    expect(recovery.speedFactor).toBeCloseTo(0.18);
  });

  it('orbit_chase は近距離で横方向成分を強める', () => {
    const s = computeBehaviorStep({ ...base, dist: 100, behavior: 'orbit_chase' });
    expect(Math.abs(s.dirY)).toBeGreaterThan(0.5);
  });

  it('coward は近距離でプレイヤーから逃げる', () => {
    const s = computeBehaviorStep({ ...base, dist: 80, behavior: 'coward' });
    expect(s.dirX).toBeLessThan(0);
  });

  it('方向ベクトルは常に正規化されている', () => {
    const behaviors: EnemyBehavior[] = [
      'chase',
      'offset_chase',
      'swarm_chase',
      'slow_chase',
      'elite_chase',
      'charger',
      'orbit_chase',
      'coward',
    ];
    for (const behavior of behaviors) {
      const s = computeBehaviorStep({ ...base, dx: 30, dy: 40, dist: 50, behavior });
      const len = Math.hypot(s.dirX, s.dirY);
      expect(len).toBeCloseTo(1, 5);
    }
  });
});
