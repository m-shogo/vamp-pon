import { describe, it, expect } from 'vitest';
import type { RuntimeState } from '../../runtime';
import { resolveWeapon, num } from '../../domain/weaponEffect';
import { weaponById } from '../../data/weapons';
import { applyChoice, generateChoices } from '../levelup';
import { applyReadyEvolutions } from '../capsule';

function makeState(partial: {
  weapons?: RuntimeState['inventory']['weapons'];
  passives?: RuntimeState['inventory']['passives'];
  rareItems?: RuntimeState['inventory']['rareItems'];
  evolvedWeaponIds?: RuntimeState['inventory']['evolvedWeaponIds'];
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
      rareItems: partial.rareItems ?? [],
      evolvedWeaponIds: partial.evolvedWeaponIds ?? [],
      weaponSlots: 5,
      passiveSlots: 5,
      rareItemSlots: 2,
    },
    stats: { evolutions: [] },
  } as unknown as RuntimeState;
}

describe('resolveWeapon', () => {
  it('夜の鉛筆 Lv5 でダメージ/弾数/貫通/CTが畳み込まれる', () => {
    const eff = resolveWeapon(weaponById.get('night_pencil')!, 5);
    expect(num(eff, 'damage')).toBe(21);
    expect(num(eff, 'projectiles')).toBe(2);
    expect(num(eff, 'pierce')).toBe(1);
    expect(num(eff, 'cooldown')).toBeCloseTo(0.675, 5);
  });

  it('ビー玉 Lv5 で反射/弾速/弾数/持続が畳み込まれる', () => {
    const eff = resolveWeapon(weaponById.get('marble')!, 5);
    expect(num(eff, 'bounces')).toBe(2);
    expect(num(eff, 'speed')).toBeCloseTo(1.4375, 5);
    expect(num(eff, 'projectiles')).toBe(2);
    expect(num(eff, 'damage')).toBe(19);
    expect(num(eff, 'duration')).toBeCloseTo(3.36, 5);
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

  it('合体進化武器はかなり強い範囲DoTとして解決できる', () => {
    const eff = resolveWeapon(weaponById.get('dawn_ink_lamp')!, 1);
    expect(eff.type).toBe('ground_area');
    expect(num(eff, 'damagePerSecond')).toBe(28);
    expect(num(eff, 'duration')).toBeCloseTo(6.5, 5);
    expect(num(eff, 'radius')).toBe(128);
    expect(num(eff, 'cooldown')).toBeCloseTo(1.15, 5);
    expect(num(eff, 'maxAreas')).toBe(3);
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
    applyChoice(state, { type: 'weapon_new', itemId: 'marble', title: 'ビー玉', description: '' });
    expect(state.inventory.weapons.some((w) => w.id === 'marble')).toBe(true);
  });

  it('武器強化でレベルが上がる', () => {
    const state = makeState({});
    applyChoice(state, { type: 'weapon_upgrade', itemId: 'night_pencil', nextLevel: 2, title: '', description: '' });
    expect(state.inventory.weapons.find((w) => w.id === 'night_pencil')?.level).toBe(2);
  });

  it('新パッシブが派生ステータスへ反映される', () => {
    const state = makeState({});
    applyChoice(state, { type: 'passive_new', itemId: 'travel_badge', title: '', description: '' });
    expect(state.inventory.passives.some((p) => p.id === 'travel_badge')).toBe(true);
    expect(state.player.might).toBeCloseTo(1.05, 5);
  });

  it('新レアアイテムを2枠まで所持できる', () => {
    const state = makeState({});
    applyChoice(state, { type: 'rare_new', itemId: 'name_tag', title: '', description: '' });
    expect(state.inventory.rareItems.some((item) => item.id === 'name_tag')).toBe(true);
  });
});

describe('所持条件起点の進化', () => {
  // 進化条件は固定Lv5ではなく、武器定義の maxLevel に連動する。
  // weapons.ts で maxLevel を 5→7→… と動かしてもテストはそのまま追従する。
  const pencilMax = weaponById.get('night_pencil')!.maxLevel;
  const inkMax = weaponById.get('black_ink_bottle')!.maxLevel;
  const lampMax = weaponById.get('streetlamp_ring')!.maxLevel;

  it('進化で元武器が進化武器に置き換わる', () => {
    const state = makeState({ weapons: [{ id: 'night_pencil', level: pencilMax, cooldownRemaining: 0 }], passives: [{ id: 'moonlight_bookmark', level: 1 }] });
    const evolved = applyReadyEvolutions(state);
    expect(evolved).toEqual(['unfinished_line']);

    expect(state.inventory.weapons.some((w) => w.id === 'night_pencil')).toBe(false);
    expect(state.inventory.weapons.find((w) => w.id === 'unfinished_line')).toBeDefined();
    expect(state.inventory.evolvedWeaponIds).toContain('unfinished_line');
    expect(state.stats.evolutions).toContain('unfinished_line');
  });

  it('黒インク小瓶と街灯の輪が両方 maxLevel なら1枠の合体進化になる', () => {
    const state = makeState({ weapons: [{ id: 'black_ink_bottle', level: inkMax, cooldownRemaining: 0 }, { id: 'streetlamp_ring', level: lampMax, cooldownRemaining: 0 }] });
    const evolved = applyReadyEvolutions(state);
    expect(evolved).toEqual(['dawn_ink_lamp']);

    expect(state.inventory.weapons).toHaveLength(1);
    expect(state.inventory.weapons[0]?.id).toBe('dawn_ink_lamp');
    expect(state.inventory.evolvedWeaponIds).toContain('dawn_ink_lamp');
    expect(state.stats.evolutions).toContain('dawn_ink_lamp');
  });

  it('武器が maxLevel でレアアイテムを持つと合体進化し、レアアイテムを消費する', () => {
    const state = makeState({ weapons: [{ id: 'night_pencil', level: pencilMax, cooldownRemaining: 0 }], rareItems: [{ id: 'name_tag' }] });
    const evolved = applyReadyEvolutions(state);
    expect(evolved).toEqual(['unforgotten_name']);

    expect(state.inventory.weapons[0]?.id).toBe('unforgotten_name');
    expect(state.inventory.rareItems).toHaveLength(0);
  });

  it('レアアイテムなしではレア合体武器にならない', () => {
    const state = makeState({ weapons: [{ id: 'night_pencil', level: pencilMax, cooldownRemaining: 0 }] });
    const evolved = applyReadyEvolutions(state);
    expect(evolved).not.toContain('unforgotten_name');
  });

  it('maxLevel 未満（Lv5）では進化条件を満たさない（maxLevel=7想定）', () => {
    expect(pencilMax).toBeGreaterThan(5);
    const state = makeState({ weapons: [{ id: 'night_pencil', level: 5, cooldownRemaining: 0 }], passives: [{ id: 'moonlight_bookmark', level: 1 }] });
    const evolved = applyReadyEvolutions(state);
    expect(evolved).toEqual([]);
    expect(state.inventory.weapons[0]?.id).toBe('night_pencil');
  });

  it('武器 maxLevel を動かしても、Lv = 現行 maxLevel なら必ず進化する', () => {
    // requiredWeaponLevel の固定値（5）ではなく weaponById.maxLevel に連動している証拠。
    const state = makeState({ weapons: [{ id: 'night_pencil', level: pencilMax, cooldownRemaining: 0 }], rareItems: [{ id: 'name_tag' }] });
    const evolved = applyReadyEvolutions(state);
    expect(evolved).toEqual(['unforgotten_name']);
  });

  it('進化後は進化元の夜の鉛筆が新武器候補に戻らない', () => {
    const state = makeState({
      weapons: [{ id: 'unfinished_line', level: 1, cooldownRemaining: 0 }],
      evolvedWeaponIds: ['unfinished_line'],
    });
    const choices = generateChoices(state);
    expect(choices.some((c) => c.type === 'weapon_new' && c.itemId === 'night_pencil')).toBe(false);
  });
});

describe('進化後武器のレベルアップ', () => {
  it('進化後武器が Lv1 で入り、強化候補として現れる', () => {
    const state = makeState({
      weapons: [{ id: 'unfinished_line', level: 1, cooldownRemaining: 0 }],
      evolvedWeaponIds: ['unfinished_line'],
    });
    // 何度か引いて、強化候補プールに含まれることを統計的に確認する。
    let appeared = false;
    for (let i = 0; i < 40; i += 1) {
      const choices = generateChoices(state);
      if (choices.some((c) => c.type === 'weapon_upgrade' && c.itemId === 'unfinished_line')) {
        appeared = true;
        break;
      }
    }
    expect(appeared).toBe(true);
  });

  it('進化後武器が現行 maxLevel に達したら強化候補から除外される', () => {
    const evolvedMax = weaponById.get('unfinished_line')!.maxLevel;
    expect(evolvedMax).toBeGreaterThan(1);
    const state = makeState({
      weapons: [{ id: 'unfinished_line', level: evolvedMax, cooldownRemaining: 0 }],
      evolvedWeaponIds: ['unfinished_line'],
    });
    for (let i = 0; i < 30; i += 1) {
      const choices = generateChoices(state);
      expect(choices.some((c) => c.type === 'weapon_upgrade' && c.itemId === 'unfinished_line')).toBe(false);
    }
  });

  it('武器枠が満杯でも所持武器に強化余地があれば weapon_upgrade が出る', () => {
    const state = makeState({
      weapons: [
        { id: 'night_pencil', level: 2, cooldownRemaining: 0 },
        { id: 'marble', level: 1, cooldownRemaining: 0 },
        { id: 'moon_bookmark', level: 1, cooldownRemaining: 0 },
        { id: 'black_ink_bottle', level: 1, cooldownRemaining: 0 },
        { id: 'stardust_shot', level: 1, cooldownRemaining: 0 },
      ],
    });
    let appeared = false;
    for (let i = 0; i < 30; i += 1) {
      const choices = generateChoices(state);
      if (choices.some((c) => c.type === 'weapon_upgrade')) {
        appeared = true;
        break;
      }
    }
    expect(appeared).toBe(true);
  });
});
