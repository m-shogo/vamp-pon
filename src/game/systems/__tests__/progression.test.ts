import { describe, it, expect } from 'vitest';
import type { RuntimeState } from '../../runtime';
import { resolveWeapon, num } from '../../domain/weaponEffect';
import { weaponById } from '../../data/weapons';
import { applyChoice } from '../levelup';
import { generateCapsuleReward, applyCapsule } from '../capsule';

function makeState(partial: {
  weapons?: RuntimeState['inventory']['weapons'];
  passives?: RuntimeState['inventory']['passives'];
}): RuntimeState {
  return {
    characterId: 'yui',
    player: {
      characterId: 'yui',
      hp: 100,
      maxHp: 100,
      might: 1,
      magnetMultiplier: 1,
      xpMultiplier: 1,
      cooldownMultiplier: 1,
      baseMoveSpeed: 100,
      moveSpeed: 100,
    },
    inventory: {
      weapons: partial.weapons ?? [{ id: 'night_pencil', level: 1, cooldownRemaining: 0 }],
      passives: partial.passives ?? [],
      evolvedWeaponIds: [],
      weaponSlots: 5,
      passiveSlots: 5,
    },
    stats: { evolutions: [] },
  } as unknown as RuntimeState;
}

describe('resolveWeapon', () => {
  it('夜の鉛筆 Lv5 でダメージ/弾数/貫通/CTが畳み込まれる', () => {
    const eff = resolveWeapon(weaponById.get('night_pencil')!, 5);
    expect(num(eff, 'damage')).toBe(21); // 16 + 5
    expect(num(eff, 'projectiles')).toBe(2); // 1 + 1
    expect(num(eff, 'pierce')).toBe(1); // 0 + 1
    expect(num(eff, 'cooldown')).toBeCloseTo(0.675, 5); // 0.9 * 0.75
  });

  it('ビー玉 Lv5 で反射/弾速/弾数/持続が畳み込まれる', () => {
    const eff = resolveWeapon(weaponById.get('marble')!, 5);
    expect(num(eff, 'bounces')).toBe(2); // 1 + 1
    expect(num(eff, 'speed')).toBeCloseTo(1.4375, 5); // 1.15 * 1.25
    expect(num(eff, 'projectiles')).toBe(2); // 1 + 1
    expect(num(eff, 'damage')).toBe(19); // 12 + 7
    expect(num(eff, 'duration')).toBeCloseTo(3.36, 5); // 2.8 * 1.2
  });

  it('追加武器も既存タイプで解決できる', () => {
    const blade = resolveWeapon(weaponById.get('postcard_blade')!, 5);
    expect(blade.type).toBe('projectile');
    expect(num(blade, 'projectiles')).toBe(3);
    expect(num(blade, 'pierce')).toBe(2);

    const plane = resolveWeapon(weaponById.get('paper_airplane')!, 5);
    expect(plane.type).toBe('bouncing_projectile');
    expect(num(plane, 'projectiles')).toBe(3);
    expect(num(plane, 'bounces')).toBe(4);

    const lamp = resolveWeapon(weaponById.get('streetlamp_ring')!, 5);
    expect(lamp.type).toBe('ground_area');
    expect(num(lamp, 'maxAreas')).toBe(2);
  });

  it('Lv1では基本効果のみ', () => {
    const eff = resolveWeapon(weaponById.get('night_pencil')!, 1);
    expect(num(eff, 'damage')).toBe(16);
    expect(num(eff, 'projectiles')).toBe(1);
  });
});

describe('applyChoice', () => {
  it('新武器を所持に加える', () => {
    const state = makeState({});
    applyChoice(state, {
      type: 'weapon_new',
      itemId: 'marble',
      title: 'ビー玉',
      description: '',
    });
    expect(state.inventory.weapons.some((w) => w.id === 'marble')).toBe(true);
  });

  it('武器強化でレベルが上がる', () => {
    const state = makeState({});
    applyChoice(state, {
      type: 'weapon_upgrade',
      itemId: 'night_pencil',
      nextLevel: 2,
      title: '',
      description: '',
    });
    expect(state.inventory.weapons.find((w) => w.id === 'night_pencil')?.level).toBe(2);
  });

  it('新パッシブが派生ステータスへ反映される', () => {
    const state = makeState({});
    applyChoice(state, {
      type: 'passive_new',
      itemId: 'travel_badge',
      title: '',
      description: '',
    });
    expect(state.inventory.passives.some((p) => p.id === 'travel_badge')).toBe(true);
    expect(state.player.might).toBeCloseTo(1.05, 5);
  });
});

describe('applyCapsule 進化', () => {
  it('進化で元武器が進化武器に置き換わる', () => {
    const state = makeState({
      weapons: [{ id: 'night_pencil', level: 5, cooldownRemaining: 0 }],
      passives: [{ id: 'moonlight_bookmark', level: 1 }],
    });
    const reward = generateCapsuleReward(state);
    expect(reward.type).toBe('evolution');
    applyCapsule(state, reward);

    expect(state.inventory.weapons.some((w) => w.id === 'night_pencil')).toBe(false);
    const evolved = state.inventory.weapons.find((w) => w.id === 'unfinished_line');
    expect(evolved).toBeDefined();
    expect(evolved?.level).toBe(1);
    expect(state.inventory.evolvedWeaponIds).toContain('unfinished_line');
    expect(state.stats.evolutions).toContain('unfinished_line');
  });
});
