import type { Id } from '../domain/types';
import { plannedCharacterSeeds } from '../data/characterRelationshipDesign';
import {
  getBondEntry,
  pairUltimateForBond,
  pointsToNextBondLevel,
  subCharacterEffectForBond,
  unlocksForBondLevel,
  type BondProgressState,
  type BondUnlockKind,
  type CalculatedSubCharacterEffect,
} from './bondProgress';

export type BondSummary = {
  mainCharacterId: Id;
  subCharacterId?: Id;
  subCharacterName?: string;
  points: number;
  level: number;
  pointsToNextLevel: number | null;
  unlocks: BondUnlockKind[];
  subEffect: CalculatedSubCharacterEffect | null;
  pairUltimate: {
    id: Id;
    name: string;
    ready: boolean;
    requiredBondLevel: number;
    effectSummary: string;
  } | null;
};

export function bondSummaryForPair(
  mainCharacterId: Id,
  subCharacterId: Id | undefined,
  progress: BondProgressState,
): BondSummary {
  if (!subCharacterId || subCharacterId === mainCharacterId) {
    return {
      mainCharacterId,
      subCharacterId: undefined,
      points: 0,
      level: 0,
      pointsToNextLevel: null,
      unlocks: [],
      subEffect: null,
      pairUltimate: null,
    };
  }

  const entry = getBondEntry(progress, mainCharacterId, subCharacterId);
  const seed = plannedCharacterSeeds.find((item) => item.id === subCharacterId);
  const subEffect = seed ? subCharacterEffectForBond(seed.defaultSubEffectId, entry.level) : null;
  const ultimate = pairUltimateForBond(mainCharacterId, subCharacterId, entry.level);
  const lockedUltimate = pairUltimateForBond(mainCharacterId, subCharacterId, 4);
  const ultimateTemplate = ultimate ?? lockedUltimate;

  return {
    mainCharacterId,
    subCharacterId,
    subCharacterName: seed?.name,
    points: entry.points,
    level: entry.level,
    pointsToNextLevel: pointsToNextBondLevel(entry.points),
    unlocks: unlocksForBondLevel(entry.level),
    subEffect,
    pairUltimate: ultimateTemplate
      ? {
          id: ultimateTemplate.id,
          name: ultimateTemplate.name,
          ready: Boolean(ultimate),
          requiredBondLevel: ultimateTemplate.requiredBondLevel,
          effectSummary: ultimateTemplate.effectSummary,
        }
      : null,
  };
}

export function bondLevelLabel(level: number): string {
  if (level <= 0) return '未同行';
  if (level >= 5) return 'Lv5 / 最大';
  return `Lv${level}`;
}
