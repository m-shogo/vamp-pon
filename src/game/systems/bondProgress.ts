import type { Id } from '../domain/types';
import {
  genericAffinityRules,
  importantPairBlueprints,
  pairKey,
  pairUltimateTemplates,
  subCharacterEffectTemplates,
  type PairUltimateTemplate,
  type SubCharacterEffectTemplate,
} from '../data/characterRelationshipDesign';

export type BondEventKind = 'sortie' | 'stage_clear' | 'boss_defeat' | 'pair_ultimate' | 'daily_talk';

export type BondUnlockKind = 'daily_talk_1' | 'sub_effect_plus' | 'daily_talk_2' | 'pair_ultimate' | 'special_episode';

export type BondProgressEntry = {
  pairKey: string;
  points: number;
  level: number;
  seenTalkIds: string[];
};

export type BondProgressState = {
  pairs: Record<string, BondProgressEntry>;
};

export type BondRunResult = {
  mainCharacterId: Id;
  subCharacterId?: Id;
  cleared: boolean;
  bossDefeated: boolean;
  pairUltimateUses: number;
  dailyTalkSeenIds: string[];
};

export type CalculatedSubCharacterEffect = SubCharacterEffectTemplate & {
  value: number;
};

export const BOND_LEVEL_THRESHOLDS = [0, 0, 30, 80, 150, 250] as const;

export const BOND_EVENT_POINTS: Record<BondEventKind, number> = {
  sortie: 4,
  stage_clear: 8,
  boss_defeat: 14,
  pair_ultimate: 10,
  daily_talk: 6,
};

export const BOND_UNLOCKS_BY_LEVEL: Record<number, BondUnlockKind[]> = {
  1: ['daily_talk_1'],
  2: ['sub_effect_plus'],
  3: ['daily_talk_2'],
  4: ['pair_ultimate'],
  5: ['special_episode'],
};

export function emptyBondProgressState(): BondProgressState {
  return { pairs: {} };
}

export function bondLevelForPoints(points: number): number {
  const safePoints = Math.max(0, Math.floor(Number.isFinite(points) ? points : 0));
  let level = 1;
  for (let candidate = 2; candidate <= 5; candidate += 1) {
    if (safePoints >= BOND_LEVEL_THRESHOLDS[candidate]) level = candidate;
  }
  return level;
}

export function pointsToNextBondLevel(points: number): number | null {
  const level = bondLevelForPoints(points);
  if (level >= 5) return null;
  return Math.max(0, BOND_LEVEL_THRESHOLDS[level + 1] - Math.max(0, Math.floor(points)));
}

export function unlocksForBondLevel(level: number): BondUnlockKind[] {
  const safeLevel = Math.max(1, Math.min(5, Math.floor(level)));
  const unlocks: BondUnlockKind[] = [];
  for (let current = 1; current <= safeLevel; current += 1) unlocks.push(...(BOND_UNLOCKS_BY_LEVEL[current] ?? []));
  return unlocks;
}

export function hasBondUnlock(entry: BondProgressEntry, unlock: BondUnlockKind): boolean {
  return unlocksForBondLevel(entry.level).includes(unlock);
}

export function getBondEntry(state: BondProgressState, a: Id, b: Id): BondProgressEntry {
  const key = pairKey(a, b);
  const existing = state.pairs[key];
  if (existing) return existing;
  return {
    pairKey: key,
    points: 0,
    level: 1,
    seenTalkIds: [],
  };
}

export function addBondPoints(
  state: BondProgressState,
  a: Id,
  b: Id,
  points: number,
): BondProgressState {
  if (a === b) return state;

  const key = pairKey(a, b);
  const current = getBondEntry(state, a, b);
  const nextPoints = Math.max(0, current.points + Math.max(0, Math.floor(points)));
  const nextEntry: BondProgressEntry = {
    ...current,
    pairKey: key,
    points: nextPoints,
    level: bondLevelForPoints(nextPoints),
  };

  return {
    ...state,
    pairs: {
      ...state.pairs,
      [key]: nextEntry,
    },
  };
}

export function applyBondEvent(
  state: BondProgressState,
  a: Id,
  b: Id,
  event: BondEventKind,
): BondProgressState {
  return addBondPoints(state, a, b, BOND_EVENT_POINTS[event]);
}

export function applyBondRunResult(state: BondProgressState, result: BondRunResult): BondProgressState {
  if (!result.subCharacterId || result.mainCharacterId === result.subCharacterId) return state;
  let next = applyBondEvent(state, result.mainCharacterId, result.subCharacterId, 'sortie');
  if (result.cleared) next = applyBondEvent(next, result.mainCharacterId, result.subCharacterId, 'stage_clear');
  if (result.bossDefeated) next = applyBondEvent(next, result.mainCharacterId, result.subCharacterId, 'boss_defeat');
  for (let i = 0; i < Math.max(0, Math.floor(result.pairUltimateUses)); i += 1) {
    next = applyBondEvent(next, result.mainCharacterId, result.subCharacterId, 'pair_ultimate');
  }
  for (const talkId of result.dailyTalkSeenIds) {
    next = applyBondEvent(next, result.mainCharacterId, result.subCharacterId, 'daily_talk');
    next = markBondTalkSeen(next, result.mainCharacterId, result.subCharacterId, talkId);
  }
  return next;
}

export function markBondTalkSeen(
  state: BondProgressState,
  a: Id,
  b: Id,
  talkId: string,
): BondProgressState {
  const key = pairKey(a, b);
  const current = getBondEntry(state, a, b);
  if (current.seenTalkIds.includes(talkId)) return state;

  return {
    ...state,
    pairs: {
      ...state.pairs,
      [key]: {
        ...current,
        seenTalkIds: [...current.seenTalkIds, talkId],
      },
    },
  };
}

export function subCharacterEffectForBond(
  effectId: Id,
  bondLevel: number,
): CalculatedSubCharacterEffect | null {
  const template = subCharacterEffectTemplates.find((effect) => effect.id === effectId);
  if (!template) return null;
  const levelBonus = Math.max(0, Math.min(4, Math.floor(bondLevel) - 1));
  return {
    ...template,
    value: Number((template.baseValue + template.perBondLevel * levelBonus).toFixed(4)),
  };
}

export function genericAffinityRuleIdsForTags(tags: string[]): Id[] {
  const set = new Set(tags);
  return genericAffinityRules
    .filter((rule) => set.has(rule.tags[0]) && set.has(rule.tags[1]))
    .map((rule) => rule.id);
}

export function pairUltimateForBond(
  a: Id,
  b: Id,
  bondLevel: number,
): PairUltimateTemplate | null {
  if (bondLevel < 4) return null;
  const key = pairKey(a, b);
  const important = importantPairBlueprints.find((pair) => pairKey(pair.pair[0], pair.pair[1]) === key);
  if (important) {
    return pairUltimateTemplates.find((ultimate) => ultimate.id === important.uniqueUltimateId) ?? null;
  }
  return pairUltimateTemplates.find((ultimate) => ultimate.kind === 'generic') ?? null;
}
