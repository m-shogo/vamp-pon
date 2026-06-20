import type { Id } from '../domain/types';
import { pairKey } from '../data/characterRelationshipDesign';

export type BondEventKind = 'sortie' | 'stage_clear' | 'boss_defeat' | 'pair_ultimate' | 'daily_talk';

export type BondProgressEntry = {
  pairKey: string;
  points: number;
  level: number;
  seenTalkIds: string[];
};

export type BondProgressState = {
  pairs: Record<string, BondProgressEntry>;
};

export const BOND_LEVEL_THRESHOLDS = [0, 0, 30, 80, 150, 250] as const;

export const BOND_EVENT_POINTS: Record<BondEventKind, number> = {
  sortie: 4,
  stage_clear: 8,
  boss_defeat: 14,
  pair_ultimate: 10,
  daily_talk: 6,
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
