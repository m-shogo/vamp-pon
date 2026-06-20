import type { Id } from '../domain/types';
import { plannedCharacterSeeds } from '../data/characterRelationshipDesign';
import { getBondEntry, subCharacterEffectForBond, type BondProgressState } from './bondProgress';

export type SubCharacterBattleBonuses = {
  hpMultiplier: number;
  moveSpeedMultiplier: number;
  xpMultiplier: number;
  cooldownMultiplier: number;
  ultimateChargeMultiplier: number;
  healingMultiplier: number;
  effectId?: Id;
  bondLevel: number;
};

export const EMPTY_SUB_CHARACTER_BONUSES: SubCharacterBattleBonuses = {
  hpMultiplier: 1,
  moveSpeedMultiplier: 1,
  xpMultiplier: 1,
  cooldownMultiplier: 1,
  ultimateChargeMultiplier: 1,
  healingMultiplier: 1,
  effectId: undefined,
  bondLevel: 0,
};

export function subCharacterSeedById(characterId: Id) {
  return plannedCharacterSeeds.find((seed) => seed.id === characterId) ?? null;
}

export function subCharacterBattleBonuses(
  mainCharacterId: Id,
  subCharacterId: Id | undefined,
  bondProgress: BondProgressState,
): SubCharacterBattleBonuses {
  if (!subCharacterId || subCharacterId === mainCharacterId) return EMPTY_SUB_CHARACTER_BONUSES;

  const seed = subCharacterSeedById(subCharacterId);
  if (!seed) return EMPTY_SUB_CHARACTER_BONUSES;

  const entry = getBondEntry(bondProgress, mainCharacterId, subCharacterId);
  const effect = subCharacterEffectForBond(seed.defaultSubEffectId, entry.level);
  if (!effect) return EMPTY_SUB_CHARACTER_BONUSES;

  const bonuses: SubCharacterBattleBonuses = {
    ...EMPTY_SUB_CHARACTER_BONUSES,
    effectId: effect.id,
    bondLevel: entry.level,
  };

  switch (effect.stat) {
    case 'hp':
      bonuses.hpMultiplier = 1 + effect.value;
      break;
    case 'moveSpeed':
      bonuses.moveSpeedMultiplier = 1 + effect.value;
      break;
    case 'xpMultiplier':
      bonuses.xpMultiplier = 1 + effect.value;
      break;
    case 'cooldownMultiplier':
      bonuses.cooldownMultiplier = Math.max(0.75, 1 + effect.value);
      break;
    case 'ultimateCharge':
      bonuses.ultimateChargeMultiplier = 1 + effect.value;
      break;
    case 'healing':
      bonuses.healingMultiplier = 1 + effect.value;
      break;
  }

  return bonuses;
}
