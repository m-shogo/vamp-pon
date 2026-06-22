import { describe, it, expect } from 'vitest';
import type { RuntimeState } from '../../runtime';
import { xpToNext } from '../../domain/balance';
import { retiredWeaponIds, generateChoices } from '../levelup';
import { applyReadyEvolutions } from '../capsule';
import { weaponById } from '../../data/weapons';
import { evolutions } from '../../data/evolutions';

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

describe('Stage1 序盤テンポ', () => {
  it('Lv2到達に必要なXPは5（20-40秒以内に到達する想定）', () => {
    expect(xpToNext(1)).toBe(5);
  });

  it('Lv1-5のXP合計が序盤ペース（40未満）に収まる', () => {
    let total = 0;
    for (let lv = 1; lv <= 4; lv++) total += xpToNext(lv);
    expect(total).toBeLessThan(40);
  });

  it('XPカーブは単調増加で急激なジャンプがない', () => {
    for (let lv = 1; lv <= 20; lv++) {
      const curr = xpToNext(lv);
      const next = xpToNext(lv + 1);
      expect(next).toBeGreaterThan(curr);
      expect(next - curr).toBeLessThanOrEqual(5);
    }
  });
});

describe('進化後の元武器再出現防止', () => {
  const pencilMax = weaponById.get('night_pencil')!.maxLevel;

  it('upgrade進化後、元武器がretiredWeaponIdsに入る', () => {
    const state = makeState({
      weapons: [{ id: 'unfinished_line', level: 1, cooldownRemaining: 0 }],
      evolvedWeaponIds: ['unfinished_line'],
    });
    const retired = retiredWeaponIds(state);
    expect(retired.has('night_pencil')).toBe(true);
  });

  it('fusion進化後、消費された両武器がretiredWeaponIdsに入る', () => {
    const state = makeState({
      weapons: [{ id: 'dawn_ink_lamp', level: 1, cooldownRemaining: 0 }],
      evolvedWeaponIds: ['dawn_ink_lamp'],
    });
    const retired = retiredWeaponIds(state);
    expect(retired.has('black_ink_bottle')).toBe(true);
    expect(retired.has('streetlamp_ring')).toBe(true);
  });

  it('retired武器はgenerateChoicesの新武器候補に出ない', () => {
    const state = makeState({
      weapons: [{ id: 'unfinished_line', level: 1, cooldownRemaining: 0 }],
      evolvedWeaponIds: ['unfinished_line'],
    });
    for (let i = 0; i < 30; i++) {
      const choices = generateChoices(state);
      const nightPencil = choices.find(
        (c) => c.type === 'weapon_new' && c.itemId === 'night_pencil',
      );
      expect(nightPencil).toBeUndefined();
    }
  });

  it('awakening進化後、対応するレアアイテムがgenerateChoicesに出ない', () => {
    const state = makeState({
      weapons: [{ id: 'unforgotten_name', level: 1, cooldownRemaining: 0 }],
      evolvedWeaponIds: ['unforgotten_name'],
    });
    for (let i = 0; i < 30; i++) {
      const choices = generateChoices(state);
      const nameTag = choices.find(
        (c) => c.type === 'rare_new' && c.itemId === 'name_tag',
      );
      expect(nameTag).toBeUndefined();
    }
  });

  it('未進化の状態ではretiredWeaponIdsは空', () => {
    const state = makeState({});
    const retired = retiredWeaponIds(state);
    expect(retired.size).toBe(0);
  });
});

describe('進化定義の整合性', () => {
  it('全進化のfromWeaponIdが武器マスターに存在する', () => {
    for (const evo of evolutions) {
      expect(weaponById.has(evo.fromWeaponId)).toBe(true);
    }
  });

  it('全進化のevolvedWeaponIdが武器マスターに存在する', () => {
    for (const evo of evolutions) {
      expect(weaponById.has(evo.evolvedWeaponId)).toBe(true);
    }
  });

  it('fusion進化のrequiredWeaponIdが武器マスターに存在する', () => {
    for (const evo of evolutions) {
      if (evo.kind === 'fusion' && evo.requiredWeaponId) {
        expect(weaponById.has(evo.requiredWeaponId)).toBe(true);
      }
    }
  });

  it('進化先武器IDに重複がない', () => {
    const ids = evolutions.map((e) => e.evolvedWeaponId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
