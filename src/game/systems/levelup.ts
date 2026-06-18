import type { EvolutionDefinition, LevelUpChoice, RewardRarity } from '../domain/types';
import type { RuntimeState } from '../runtime';
import { weapons, weaponById, evolvedWeaponIds } from '../data/weapons';
import { passives, passiveById } from '../data/passives';
import { rareItems } from '../data/rareItems';
import { evolutions } from '../data/evolutions';
import { LEVEL_UP } from '../domain/constants';
import { LEVELUP_WEIGHTS } from '../domain/balance';
import { recomputePlayerStats } from './passives';
import { weightedPick, sampleWithoutReplacement } from '../utils/rng';

export type Category = 'weapon_upgrade' | 'weapon_new' | 'passive_upgrade' | 'passive_new' | 'rare_new' | 'heal';

function rollRarity(): RewardRarity {
  const r = Math.random();
  if (r < 0.06) return 'rare';
  if (r < 0.24) return 'good';
  return 'normal';
}

function rarityStep(rarity: RewardRarity): number {
  switch (rarity) {
    case 'rare': return 3;
    case 'good': return 2;
    case 'normal': return 1;
  }
}

function completedEvolutionOutputIds(state: RuntimeState): Set<string> {
  const completed = new Set(state.inventory.evolvedWeaponIds);
  for (const weapon of state.inventory.weapons) {
    if (evolvedWeaponIds.has(weapon.id)) completed.add(weapon.id);
  }
  for (const weaponId of state.stats?.evolutions ?? []) {
    if (evolvedWeaponIds.has(weaponId)) completed.add(weaponId);
  }
  return completed;
}

/** 進化・合体・覚醒後に再登場させない元武器ID。 */
export function retiredWeaponIds(state: RuntimeState): Set<string> {
  const retired = new Set<string>();
  const evolved = completedEvolutionOutputIds(state);
  for (const evo of evolutions) {
    if (!evolved.has(evo.evolvedWeaponId)) continue;
    retired.add(evo.fromWeaponId);
    for (const id of evo.consumedWeaponIds ?? []) retired.add(id);
  }
  return retired;
}

function blockedRareItemIds(state: RuntimeState, retiredWeapons: Set<string>): Set<string> {
  const blocked = new Set<string>();
  const evolved = completedEvolutionOutputIds(state);

  for (const evo of evolutions) {
    if (evo.kind !== 'awakening' || !evo.requiredRareItemId) continue;

    // 覚醒済みなら、その覚醒レアアイテムは再登場させない。
    if (evolved.has(evo.evolvedWeaponId)) {
      blocked.add(evo.requiredRareItemId);
      continue;
    }

    // 強化進化・覚醒などで元武器が退役済みなら、もう覚醒できないので出さない。
    if (retiredWeapons.has(evo.fromWeaponId)) {
      blocked.add(evo.requiredRareItemId);
    }
  }

  return blocked;
}

function decorateChoice(choice: LevelUpChoice): LevelUpChoice {
  if (choice.type === 'rare_new') {
    return { ...choice, rarity: 'rare' };
  }

  const rarity = rollRarity();

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
      title: `${def.name} Lv.${nextLevel}`,
      description: rarity === 'normal' ? (lvl?.label ?? choice.description) : `Lv.${nextLevel}まで一気に強化 / ${lvl?.label ?? '強化'}`,
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
      title: `${def.name} Lv.${nextLevel}`,
      description: rarity === 'normal' ? (lvl?.label ?? choice.description) : `Lv.${nextLevel}まで一気に強化 / ${lvl?.label ?? '強化'}`,
    };
  }

  if (choice.type === 'weapon_new') {
    const def = weaponById.get(choice.itemId);
    const initialLevel = Math.min(def?.maxLevel ?? 1, rarityStep(rarity));
    return {
      ...choice,
      rarity,
      initialLevel,
      title: `${choice.title}${initialLevel > 1 ? ` Lv.${initialLevel}` : ''}`,
      description: initialLevel > 1 ? `最初から Lv.${initialLevel} で手に入る。` : choice.description,
    };
  }

  if (choice.type === 'passive_new') {
    const def = passiveById.get(choice.itemId);
    const initialLevel = Math.min(def?.maxLevel ?? 1, rarityStep(rarity));
    return {
      ...choice,
      rarity,
      initialLevel,
      title: `${choice.title}${initialLevel > 1 ? ` Lv.${initialLevel}` : ''}`,
      description: initialLevel > 1 ? `最初から Lv.${initialLevel} で手に入る。` : choice.description,
    };
  }

  const healMultiplier = rarity === 'rare' ? 2.25 : rarity === 'good' ? 1.5 : 1;
  const amount = Math.round(choice.amount * healMultiplier);
  return {
    ...choice,
    rarity,
    amount,
    title: choice.title,
    description: `HP +${amount}`,
  };
}

function evolutionKindHint(kind: EvolutionDefinition['kind']): string {
  if (kind === 'fusion') return '合体候補';
  if (kind === 'awakening') return '覚醒候補';
  return '進化候補';
}

function ownedWeaponLevel(state: RuntimeState, id: string): number {
  return state.inventory.weapons.find((weapon) => weapon.id === id)?.level ?? 0;
}

function ownsPassive(state: RuntimeState, id?: string): boolean {
  return !id || state.inventory.passives.some((passive) => passive.id === id);
}

function ownsRare(state: RuntimeState, id?: string): boolean {
  return !id || state.inventory.rareItems.some((rare) => rare.id === id);
}

function evolutionReadyAfterChoice(state: RuntimeState, evo: EvolutionDefinition, choice: LevelUpChoice): boolean {
  const mainLevel = choice.type === 'weapon_upgrade' && choice.itemId === evo.fromWeaponId
    ? choice.nextLevel
    : ownedWeaponLevel(state, evo.fromWeaponId);
  if (mainLevel < evo.requiredWeaponLevel) return false;

  if (evo.requiredWeaponId) {
    const requiredLevel = choice.type === 'weapon_upgrade' && choice.itemId === evo.requiredWeaponId
      ? choice.nextLevel
      : ownedWeaponLevel(state, evo.requiredWeaponId);
    if (requiredLevel < (evo.requiredWeaponLevel2 ?? 1)) return false;
  }

  if (!ownsPassive(state, evo.requiredPassiveId)) return false;
  if (!ownsRare(state, evo.requiredRareItemId)) return false;
  return true;
}

function relevantEvolutions(state: RuntimeState, itemId: string): EvolutionDefinition[] {
  const completed = completedEvolutionOutputIds(state);
  return evolutions.filter((evo) => {
    if (completed.has(evo.evolvedWeaponId)) return false;
    return evo.fromWeaponId === itemId
      || evo.requiredWeaponId === itemId
      || evo.requiredPassiveId === itemId
      || evo.requiredRareItemId === itemId;
  });
}

function evolutionHintForChoice(state: RuntimeState, choice: LevelUpChoice): string | null {
  if (!('itemId' in choice)) return null;
  const relevant = relevantEvolutions(state, choice.itemId);
  if (relevant.length === 0) return null;

  const ready = relevant.find((evo) => evolutionReadyAfterChoice(state, evo, choice));
  if (ready) return `次のカプセルで${evolutionKindLabel(ready.kind)}可`;

  const ownedMain = relevant.find((evo) => {
    const mainLevel = evo.fromWeaponId === choice.itemId && choice.type === 'weapon_upgrade'
      ? choice.nextLevel
      : ownedWeaponLevel(state, evo.fromWeaponId);
    return mainLevel >= Math.max(1, evo.requiredWeaponLevel - 1);
  });
  const evo = ownedMain ?? relevant[0];
  return `${evolutionKindHint(evo.kind)}: ${evo.name}`;
}

function evolutionKindLabel(kind: EvolutionDefinition['kind']): string {
  if (kind === 'fusion') return '合体';
  if (kind === 'awakening') return '覚醒';
  return '進化';
}

function enrichChoiceDescription(state: RuntimeState, choice: LevelUpChoice): LevelUpChoice {
  const hint = evolutionHintForChoice(state, choice);
  if (!hint) return choice;
  if (choice.description.includes(hint)) return choice;
  return { ...choice, description: `${choice.description} / ${hint}` };
}

export function generateChoices(state: RuntimeState): LevelUpChoice[] {
  const inv = state.inventory;
  const ownedWeaponIds = new Set(inv.weapons.map((w) => w.id));
  const ownedPassiveIds = new Set(inv.passives.map((p) => p.id));
  const ownedRareItemIds = new Set(inv.rareItems.map((item) => item.id));
  const retiredWeapons = retiredWeaponIds(state);
  const blockedRareItems = blockedRareItemIds(state, retiredWeapons);
  const weaponFull = inv.weapons.length >= inv.weaponSlots;
  const passiveFull = inv.passives.length >= inv.passiveSlots;
  const rareFull = inv.rareItems.length >= inv.rareItemSlots;

  const weaponUpgrades: LevelUpChoice[] = inv.weapons
    .filter((w) => {
      const def = weaponById.get(w.id);
      return def && w.level < def.maxLevel && !evolvedWeaponIds.has(w.id);
    })
    .map((w) => {
      const def = weaponById.get(w.id)!;
      const nextLevel = w.level + 1;
      const lvl = def.levels[nextLevel - 1];
      return { type: 'weapon_upgrade' as const, itemId: w.id, nextLevel, title: `${def.name} Lv.${nextLevel}`, description: lvl?.label ?? '強化', lore: def.lore };
    });

  const weaponNews: LevelUpChoice[] = weapons
    .filter((def) => !evolvedWeaponIds.has(def.id) && !ownedWeaponIds.has(def.id) && !retiredWeapons.has(def.id))
    .map((def) => ({ type: 'weapon_new' as const, itemId: def.id, title: weaponFull ? `入替: ${def.name}` : def.name, description: weaponFull ? `${def.description} / 武器が満杯。` : def.description, lore: def.lore }));

  const passiveUpgrades: LevelUpChoice[] = inv.passives
    .filter((p) => {
      const def = passiveById.get(p.id);
      return def && p.level < def.maxLevel;
    })
    .map((p) => {
      const def = passiveById.get(p.id)!;
      const nextLevel = p.level + 1;
      const lvl = def.levels[nextLevel - 1];
      return { type: 'passive_upgrade' as const, itemId: p.id, nextLevel, title: `${def.name} Lv.${nextLevel}`, description: lvl?.label ?? '強化', lore: def.lore };
    });

  const passiveNews: LevelUpChoice[] = passives
    .filter((def) => !ownedPassiveIds.has(def.id))
    .map((def) => ({ type: 'passive_new' as const, itemId: def.id, title: passiveFull ? `入替: ${def.name}` : def.name, description: passiveFull ? `${def.description} / アイテムが満杯。` : def.description, lore: def.lore }));

  const rareNews: LevelUpChoice[] = rareItems
    .filter((def) => !ownedRareItemIds.has(def.id) && !blockedRareItems.has(def.id))
    .map((def) => ({ type: 'rare_new' as const, itemId: def.id, title: rareFull ? `入替: ${def.name}` : def.name, description: rareFull ? `${def.description} / レア枠が満杯。` : def.description, lore: def.lore }));

  const pools: Record<Exclude<Category, 'heal'>, LevelUpChoice[]> = {
    weapon_upgrade: weaponUpgrades,
    weapon_new: weaponNews,
    passive_upgrade: passiveUpgrades,
    passive_new: passiveNews,
    rare_new: rareNews,
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
      const healWeight = hpRatio >= 1 ? Math.max(1, Math.round(baseWeights.heal * 0.2)) : baseWeights.heal;
      entries.push(['heal', healWeight]);
    }
    if (entries.length === 0) break;

    const cat = weightedPick(entries);
    if (!cat) break;

    if (cat === 'heal') {
      chosen.push(decorateChoice({ type: 'heal', amount: LEVEL_UP.healAmount, title: '少し休む', description: `HP +${LEVEL_UP.healAmount}`, lore: 'まだ、戻せる名前がある。' }));
      healUsed = true;
      continue;
    }

    const available = pools[cat].filter((c) => 'itemId' in c && !usedItemIds.has((c as { itemId: string }).itemId));
    const picked = sampleWithoutReplacement(available, 1)[0];
    if (picked && 'itemId' in picked) {
      const decorated = enrichChoiceDescription(state, decorateChoice(picked));
      chosen.push(decorated);
      usedItemIds.add(picked.itemId);
    }
  }

  while (chosen.length < LEVEL_UP.choices) {
    chosen.push(decorateChoice({ type: 'heal', amount: LEVEL_UP.healAmount, title: '少し休む', description: `HP +${LEVEL_UP.healAmount}`, lore: 'まだ、戻せる名前がある。' }));
  }

  return chosen;
}

export function applyChoice(state: RuntimeState, choice: LevelUpChoice): void {
  const inv = state.inventory;
  switch (choice.type) {
    case 'weapon_new': {
      const retired = retiredWeaponIds(state);
      if (
        !evolvedWeaponIds.has(choice.itemId)
        && !retired.has(choice.itemId)
        && !inv.weapons.some((w) => w.id === choice.itemId)
        && inv.weapons.length < inv.weaponSlots
      ) {
        inv.weapons.push({ id: choice.itemId, level: choice.initialLevel ?? 1, cooldownRemaining: 0 });
      }
      break;
    }
    case 'weapon_upgrade': {
      const w = inv.weapons.find((it) => it.id === choice.itemId);
      if (w) w.level = choice.nextLevel;
      break;
    }
    case 'passive_new':
      if (!inv.passives.some((p) => p.id === choice.itemId) && inv.passives.length < inv.passiveSlots) inv.passives.push({ id: choice.itemId, level: choice.initialLevel ?? 1 });
      break;
    case 'passive_upgrade': {
      const p = inv.passives.find((it) => it.id === choice.itemId);
      if (p) p.level = choice.nextLevel;
      break;
    }
    case 'rare_new': {
      const blocked = blockedRareItemIds(state, retiredWeaponIds(state));
      if (!blocked.has(choice.itemId) && !inv.rareItems.some((item) => item.id === choice.itemId) && inv.rareItems.length < inv.rareItemSlots) {
        inv.rareItems.push({ id: choice.itemId });
      }
      break;
    }
    case 'heal':
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + choice.amount);
      break;
  }
  recomputePlayerStats(state);
}
