import type { LevelUpChoice } from '../domain/types';
import type { RuntimeState } from '../runtime';
import { weapons, weaponById, evolvedWeaponIds } from '../data/weapons';
import { passives, passiveById } from '../data/passives';
import { LEVEL_UP } from '../domain/constants';
import { LEVELUP_WEIGHTS } from '../domain/balance';
import { recomputePlayerStats } from './passives';
import { weightedPick, sampleWithoutReplacement } from '../utils/rng';

type Category = 'weapon_upgrade' | 'weapon_new' | 'passive_upgrade' | 'passive_new' | 'heal';

/** レベルアップ3択を生成する（docs/81-8, docs/82-4 準拠）。 */
export function generateChoices(state: RuntimeState): LevelUpChoice[] {
  const inv = state.inventory;
  const ownedWeaponIds = new Set(inv.weapons.map((w) => w.id));
  const ownedPassiveIds = new Set(inv.passives.map((p) => p.id));

  const weaponUpgrades: LevelUpChoice[] = inv.weapons
    .filter((w) => {
      const def = weaponById.get(w.id);
      return def && w.level < def.maxLevel && !evolvedWeaponIds.has(w.id);
    })
    .map((w) => {
      const def = weaponById.get(w.id)!;
      const nextLevel = w.level + 1;
      const lvl = def.levels[nextLevel - 1];
      return {
        type: 'weapon_upgrade' as const,
        itemId: w.id,
        nextLevel,
        title: `${def.name} Lv.${nextLevel}`,
        description: lvl?.label ?? '強化',
        lore: def.lore,
      };
    });

  const weaponNews: LevelUpChoice[] =
    inv.weapons.length < inv.weaponSlots
      ? weapons
          .filter((def) => !evolvedWeaponIds.has(def.id) && !ownedWeaponIds.has(def.id))
          .map((def) => ({
            type: 'weapon_new' as const,
            itemId: def.id,
            title: def.name,
            description: def.description,
            lore: def.lore,
          }))
      : [];

  const passiveUpgrades: LevelUpChoice[] = inv.passives
    .filter((p) => {
      const def = passiveById.get(p.id);
      return def && p.level < def.maxLevel;
    })
    .map((p) => {
      const def = passiveById.get(p.id)!;
      const nextLevel = p.level + 1;
      const lvl = def.levels[nextLevel - 1];
      return {
        type: 'passive_upgrade' as const,
        itemId: p.id,
        nextLevel,
        title: `${def.name} Lv.${nextLevel}`,
        description: lvl?.label ?? '強化',
        lore: def.lore,
      };
    });

  const passiveNews: LevelUpChoice[] =
    inv.passives.length < inv.passiveSlots
      ? passives
          .filter((def) => !ownedPassiveIds.has(def.id))
          .map((def) => ({
            type: 'passive_new' as const,
            itemId: def.id,
            title: def.name,
            description: def.description,
            lore: def.lore,
          }))
      : [];

  const pools: Record<Exclude<Category, 'heal'>, LevelUpChoice[]> = {
    weapon_upgrade: weaponUpgrades,
    weapon_new: weaponNews,
    passive_upgrade: passiveUpgrades,
    passive_new: passiveNews,
  };

  const hpRatio = state.player.hp / state.player.maxHp;
  const baseWeights = hpRatio <= LEVEL_UP.lowHpRatio ? LEVELUP_WEIGHTS.lowHp : LEVELUP_WEIGHTS.normal;

  const chosen: LevelUpChoice[] = [];
  const usedItemIds = new Set<string>();
  let healUsed = false;

  while (chosen.length < LEVEL_UP.choices) {
    const entries: Array<[Category, number]> = [];
    (Object.keys(pools) as Array<Exclude<Category, 'heal'>>).forEach((cat) => {
      const available = pools[cat].filter((c) => 'itemId' in c && !usedItemIds.has(c.itemId));
      if (available.length > 0) entries.push([cat, baseWeights[cat]]);
    });
    if (!healUsed) {
      // HP満タンなら回復の優先度を下げる
      const healWeight = hpRatio >= 1 ? Math.max(1, Math.round(baseWeights.heal * 0.2)) : baseWeights.heal;
      entries.push(['heal', healWeight]);
    }
    if (entries.length === 0) break;

    const cat = weightedPick(entries);
    if (!cat) break;

    if (cat === 'heal') {
      chosen.push({
        type: 'heal',
        amount: LEVEL_UP.healAmount,
        title: '少し休む',
        description: `HP +${LEVEL_UP.healAmount}`,
        lore: 'まだ、戻せる名前がある。',
      });
      healUsed = true;
      continue;
    }

    const available = pools[cat].filter((c) => 'itemId' in c && !usedItemIds.has((c as { itemId: string }).itemId));
    const picked = sampleWithoutReplacement(available, 1)[0];
    if (picked && 'itemId' in picked) {
      chosen.push(picked);
      usedItemIds.add(picked.itemId);
    }
  }

  // 3つ未満なら回復で補う（docs/80-9）
  while (chosen.length < LEVEL_UP.choices) {
    chosen.push({
      type: 'heal',
      amount: LEVEL_UP.healAmount,
      title: '少し休む',
      description: `HP +${LEVEL_UP.healAmount}`,
      lore: 'まだ、戻せる名前がある。',
    });
  }

  return chosen;
}

/** 選択を適用する。パッシブ反映後に派生ステータスを再計算する。 */
export function applyChoice(state: RuntimeState, choice: LevelUpChoice): void {
  const inv = state.inventory;
  switch (choice.type) {
    case 'weapon_new':
      if (!inv.weapons.some((w) => w.id === choice.itemId) && inv.weapons.length < inv.weaponSlots) {
        inv.weapons.push({ id: choice.itemId, level: 1, cooldownRemaining: 0 });
      }
      break;
    case 'weapon_upgrade': {
      const w = inv.weapons.find((it) => it.id === choice.itemId);
      if (w) w.level = choice.nextLevel;
      break;
    }
    case 'passive_new':
      if (!inv.passives.some((p) => p.id === choice.itemId) && inv.passives.length < inv.passiveSlots) {
        inv.passives.push({ id: choice.itemId, level: 1 });
      }
      break;
    case 'passive_upgrade': {
      const p = inv.passives.find((it) => it.id === choice.itemId);
      if (p) p.level = choice.nextLevel;
      break;
    }
    case 'heal':
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + choice.amount);
      break;
  }
  recomputePlayerStats(state);
}
