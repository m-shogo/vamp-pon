import type { CapsuleReward, EvolutionDefinition } from '../domain/types';
import type { RuntimeState } from '../runtime';
import { evolutions, requiredMainWeaponLevel, requiredSecondaryWeaponLevel } from '../data/evolutions';
import { weaponById } from '../data/weapons';
import { passiveById } from '../data/passives';
import { recomputePlayerStats } from './passives';
import { sampleWithoutReplacement } from '../utils/rng';

export function generateEvolutionReward(state: RuntimeState): CapsuleReward | null {
  for (const evo of evolutions) {
    if (canEvolve(state, evo)) {
      return {
        type: 'evolution',
        evolutionId: evo.id,
        evolutionKind: evo.kind,
        evolvedWeaponId: evo.evolvedWeaponId,
        title: evo.name,
        lore: evo.lore,
      };
    }
  }
  return null;
}

/** 記憶カプセルの報酬を決める（docs/81-9 優先順位）。 */
export function generateCapsuleReward(state: RuntimeState): CapsuleReward {
  const inv = state.inventory;

  // 進化武器も maxLevel 未満なら強化できるようにし、後半「捨てるばっか」を緩和する。
  const upgradableWeapons = inv.weapons.filter((w) => {
    const def = weaponById.get(w.id);
    return def && w.level < def.maxLevel;
  });
  const upgradablePassives = inv.passives.filter((p) => {
    const def = passiveById.get(p.id);
    return def && p.level < def.maxLevel;
  });

  const candidates: CapsuleReward[] = [];
  for (const w of upgradableWeapons) {
    const def = weaponById.get(w.id)!;
    candidates.push({
      type: 'weapon_upgrade',
      itemId: w.id,
      nextLevel: w.level + 1,
      title: `${def.name} Lv.${w.level + 1}`,
    });
  }
  for (const p of upgradablePassives) {
    const def = passiveById.get(p.id)!;
    candidates.push({
      type: 'passive_upgrade',
      itemId: p.id,
      nextLevel: p.level + 1,
      title: `${def.name} Lv.${p.level + 1}`,
    });
  }

  if (candidates.length > 0) return sampleWithoutReplacement(candidates, 1)[0];

  return { type: 'currency', amount: 10, title: '記憶のかけら +10' };
}

function hasCompletedEvolution(state: RuntimeState, evo: EvolutionDefinition): boolean {
  return state.inventory.evolvedWeaponIds.includes(evo.evolvedWeaponId)
    || state.inventory.weapons.some((weapon) => weapon.id === evo.evolvedWeaponId)
    || (state.stats?.evolutions ?? []).includes(evo.evolvedWeaponId);
}

function canEvolve(state: RuntimeState, evo: EvolutionDefinition): boolean {
  const inv = state.inventory;
  if (hasCompletedEvolution(state, evo)) return false;

  const main = inv.weapons.find((it) => it.id === evo.fromWeaponId);
  if (!main || main.level < requiredMainWeaponLevel(evo)) return false;

  if (evo.requiredPassiveId && !inv.passives.some((p) => p.id === evo.requiredPassiveId)) return false;
  if (evo.requiredRareItemId && !inv.rareItems.some((item) => item.id === evo.requiredRareItemId)) return false;

  if (evo.requiredWeaponId) {
    const second = inv.weapons.find((it) => it.id === evo.requiredWeaponId);
    if (!second || second.level < requiredSecondaryWeaponLevel(evo)) return false;
  }

  return true;
}

export function applyReadyEvolutions(state: RuntimeState): string[] {
  const evolved: string[] = [];
  for (const evo of evolutions) {
    if (!canEvolve(state, evo)) continue;
    replaceWeaponWithEvolution(state, evo.id, evo.evolvedWeaponId);
    evolved.push(evo.evolvedWeaponId);
  }
  if (evolved.length > 0) recomputePlayerStats(state);
  return evolved;
}

/** カプセル報酬を適用する。 */
export function applyCapsule(state: RuntimeState, reward: CapsuleReward): void {
  const inv = state.inventory;
  switch (reward.type) {
    case 'evolution':
      replaceWeaponWithEvolution(state, reward.evolutionId, reward.evolvedWeaponId);
      break;
    case 'weapon_upgrade': {
      const w = inv.weapons.find((it) => it.id === reward.itemId);
      if (w) w.level = reward.nextLevel;
      break;
    }
    case 'passive_upgrade': {
      const p = inv.passives.find((it) => it.id === reward.itemId);
      if (p) p.level = reward.nextLevel;
      break;
    }
    case 'currency':
      state.stats.memoryFragmentsCollected += reward.amount;
      break;
  }
  recomputePlayerStats(state);
}

function replaceWeaponWithEvolution(state: RuntimeState, evolutionId: string, evolvedWeaponId: string): void {
  const evo = evolutions.find((e) => e.id === evolutionId);
  if (!evo) return;

  const removedIds = new Set(evo.consumedWeaponIds ?? [evo.fromWeaponId]);
  const nextWeapons = [];
  let replaced = false;

  for (const w of state.inventory.weapons) {
    if (w.id === evo.fromWeaponId && !replaced) {
      nextWeapons.push({ id: evolvedWeaponId, level: 1, cooldownRemaining: 0 });
      replaced = true;
      continue;
    }
    if (removedIds.has(w.id)) continue;
    nextWeapons.push(w);
  }

  if (!replaced) return;
  state.inventory.weapons = nextWeapons;

  const consumedRareIds = new Set(evo.consumedRareItemIds ?? (evo.requiredRareItemId ? [evo.requiredRareItemId] : []));
  if (consumedRareIds.size > 0) {
    state.inventory.rareItems = state.inventory.rareItems.filter((item) => !consumedRareIds.has(item.id));
  }

  if (!state.inventory.evolvedWeaponIds.includes(evolvedWeaponId)) {
    state.inventory.evolvedWeaponIds.push(evolvedWeaponId);
  }
  if (state.stats?.evolutions && !state.stats.evolutions.includes(evolvedWeaponId)) {
    state.stats.evolutions.push(evolvedWeaponId);
  }
}
