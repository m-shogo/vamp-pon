import type { LevelUpChoice, RewardRarity } from '../domain/types';
import type { RuntimeState } from '../runtime';
import { weapons, weaponById, evolvedWeaponIds } from '../data/weapons';
import { passives, passiveById } from '../data/passives';
import { LEVEL_UP } from '../domain/constants';
import { LEVELUP_WEIGHTS } from '../domain/balance';
import { recomputePlayerStats } from './passives';
import { weightedPick, sampleWithoutReplacement } from '../utils/rng';

export type Category = 'weapon_upgrade' | 'weapon_new' | 'passive_upgrade' | 'passive_new' | 'heal';

function rollRarity(): RewardRarity {
  const r = Math.random();
  if (r < 0.06) return 'rare';
  if (r < 0.24) return 'good';
  return 'normal';
}

function rarityPrefix(rarity: RewardRarity): string {
  switch (rarity) {
    case 'rare':
      return '★★★ ';
    case 'good':
      return '★★ ';
    case 'normal':
      return '';
  }
}

function rarityText(rarity: RewardRarity): string {
  switch (rarity) {
    case 'rare':
      return '大当たり';
    case 'good':
      return '良い拾い物';
    case 'normal':
      return 'ふつう';
  }
}

function rarityStep(rarity: RewardRarity): number {
  switch (rarity) {
    case 'rare':
      return 3;
    case 'good':
      return 2;
    case 'normal':
      return 1;
  }
}

function decorateChoice(choice: LevelUpChoice): LevelUpChoice {
  const rarity = rollRarity();
  const prefix = rarityPrefix(rarity);
  const rank = rarityText(rarity);

  if (choice.type === 'weapon_upgrade') {
    const def = weaponById.get(choice.itemId);
    if (!def) return { ...choice, rarity };
    const step = rarityStep(rarity);
    const nextLevel = Math.min(def.maxLevel, choice.nextLevel + step - 1);
    const lvl = def.levels[nextLevel - 1];
    return {
      ...choice,
      rarity,
      nextLevel,
      title: `${prefix}${def.name} Lv.${nextLevel}`,
      description: rarity === 'normal' ? (lvl?.label ?? choice.description) : `${rank}: 一気に Lv.${nextLevel} / ${lvl?.label ?? '強化'}`,
    };
  }

  if (choice.type === 'passive_upgrade') {
    const def = passiveById.get(choice.itemId);
    if (!def) return { ...choice, rarity };
    const step = rarityStep(rarity);
    const nextLevel = Math.min(def.maxLevel, choice.nextLevel + step - 1);
    const lvl = def.levels[nextLevel - 1];
    return {
      ...choice,
      rarity,
      nextLevel,
      title: `${prefix}${def.name} Lv.${nextLevel}`,
      description: rarity === 'normal' ? (lvl?.label ?? choice.description) : `${rank}: 一気に Lv.${nextLevel} / ${lvl?.label ?? '強化'}`,
    };
  }

  if (choice.type === 'weapon_new') {
    const def = weaponById.get(choice.itemId);
    const initialLevel = Math.min(def?.maxLevel ?? 1, rarityStep(rarity));
    return {
      ...choice,
      rarity,
      initialLevel,
      title: `${prefix}${choice.title}${initialLevel > 1 ? ` Lv.${initialLevel}` : ''}`,
      description: initialLevel > 1 ? `${rank}: 最初から Lv.${initialLevel} で手に入る。` : choice.description,
    };
  }

  if (choice.type === 'passive_new') {
    const def = passiveById.get(choice.itemId);
    const initialLevel = Math.min(def?.maxLevel ?? 1, rarityStep(rarity));
    return {
      ...choice,
      rarity,
      initialLevel,
      title: `${prefix}${choice.title}${initialLevel > 1 ? ` Lv.${initialLevel}` : ''}`,
      description: initialLevel > 1 ? `${rank}: 最初から Lv.${initialLevel} で手に入る。` : choice.description,
    };
  }

  const healMultiplier = rarity === 'rare' ? 2.25 : rarity === 'good' ? 1.5 : 1;
  const amount = Math.round(choice.amount * healMultiplier);
  return {
    ...choice,
    rarity,
    amount,
    title: `${prefix}${choice.title}`,
    description: rarity === 'normal' ? `HP +${amount}` : `${rank}: HP +${amount}`,
  };
}

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
      chosen.push(
        decorateChoice({
          type: 'heal',
          amount: LEVEL_UP.healAmount,
          title: '少し休む',
          description: `HP +${LEVEL_UP.healAmount}`,
          lore: 'まだ、戻せる名前がある。',
        }),
      );
      healUsed = true;
      continue;
    }

    const available = pools[cat].filter((c) => 'itemId' in c && !usedItemIds.has((c as { itemId: string }).itemId));
    const picked = sampleWithoutReplacement(available, 1)[0];
    if (picked && 'itemId' in picked) {
      const decorated = decorateChoice(picked);
      chosen.push(decorated);
      usedItemIds.add(picked.itemId);
    }
  }

  // 3つ未満なら回復で補う（docs/80-9）
  while (chosen.length < LEVEL_UP.choices) {
    chosen.push(
      decorateChoice({
        type: 'heal',
        amount: LEVEL_UP.healAmount,
        title: '少し休む',
        description: `HP +${LEVEL_UP.healAmount}`,
        lore: 'まだ、戻せる名前がある。',
      }),
    );
  }

  return chosen;
}

/** 選択を適用する。パッシブ反映後に派生ステータスを再計算する。 */
export function applyChoice(state: RuntimeState, choice: LevelUpChoice): void {
  const inv = state.inventory;
  switch (choice.type) {
    case 'weapon_new':
      if (!inv.weapons.some((w) => w.id === choice.itemId) && inv.weapons.length < inv.weaponSlots) {
        inv.weapons.push({ id: choice.itemId, level: choice.initialLevel ?? 1, cooldownRemaining: 0 });
      }
      break;
    case 'weapon_upgrade': {
      const w = inv.weapons.find((it) => it.id === choice.itemId);
      if (w) w.level = choice.nextLevel;
      break;
    }
    case 'passive_new':
      if (!inv.passives.some((p) => p.id === choice.itemId) && inv.passives.length < inv.passiveSlots) {
        inv.passives.push({ id: choice.itemId, level: choice.initialLevel ?? 1 });
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
