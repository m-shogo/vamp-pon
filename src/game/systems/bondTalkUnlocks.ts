import type { Id } from '../domain/types';
import { importantPairBlueprints, pairKey, plannedCharacterSeeds } from '../data/characterRelationshipDesign';
import { getBondEntry, hasBondUnlock, type BondProgressState } from './bondProgress';

export type BondTalkUnlock = {
  id: Id;
  title: string;
  required: 'daily_talk_1' | 'daily_talk_2' | 'special_episode';
  unlocked: boolean;
  seen: boolean;
  important: boolean;
};

function nameOf(id: Id): string {
  return plannedCharacterSeeds.find((seed) => seed.id === id)?.name ?? id;
}

export function bondTalkUnlocks(a: Id, b: Id, progress: BondProgressState): BondTalkUnlock[] {
  if (!a || !b || a === b) return [];
  const key = pairKey(a, b);
  const entry = getBondEntry(progress, a, b);
  const important = importantPairBlueprints.find((pair) => pairKey(pair.pair[0], pair.pair[1]) === key);
  const baseTitle = important?.title ?? `${nameOf(a)}と${nameOf(b)}の日常`;
  const talks: Array<Omit<BondTalkUnlock, 'unlocked' | 'seen'>> = [
    { id: `${key}:talk:1`, title: baseTitle, required: 'daily_talk_1', important: Boolean(important) },
    { id: `${key}:talk:2`, title: `${baseTitle} その後`, required: 'daily_talk_2', important: Boolean(important) },
    { id: `${key}:episode:1`, title: `${baseTitle} 特別編`, required: 'special_episode', important: Boolean(important) },
  ];
  return talks.map((talk) => ({
    ...talk,
    unlocked: hasBondUnlock(entry, talk.required),
    seen: entry.seenTalkIds.includes(talk.id),
  }));
}

export function nextUnreadBondTalkId(a: Id, b: Id, progress: BondProgressState): Id | null {
  return bondTalkUnlocks(a, b, progress).find((talk) => talk.unlocked && !talk.seen)?.id ?? null;
}
