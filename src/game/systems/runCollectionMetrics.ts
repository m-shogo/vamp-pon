import type { Id, RunStats } from '../domain/types';

type CollectionRunStats = RunStats & {
  enemySeen?: Record<Id, true>;
  enemyDefeats?: Record<Id, number>;
  healsCollected?: number;
};

function collectionStats(stats: RunStats): Required<Pick<CollectionRunStats, 'enemySeen' | 'enemyDefeats'>> & { healsCollected: number } {
  const extended = stats as CollectionRunStats;
  extended.enemySeen ??= {};
  extended.enemyDefeats ??= {};
  extended.healsCollected ??= 0;
  return {
    enemySeen: extended.enemySeen,
    enemyDefeats: extended.enemyDefeats,
    healsCollected: extended.healsCollected,
  };
}

export function recordEnemySeen(stats: RunStats, enemyId: Id): void {
  collectionStats(stats).enemySeen[enemyId] = true;
}

export function recordEnemyDefeated(stats: RunStats, enemyId: Id): void {
  const c = collectionStats(stats);
  c.enemySeen[enemyId] = true;
  c.enemyDefeats[enemyId] = (c.enemyDefeats[enemyId] ?? 0) + 1;
}

export function recordHealCollected(stats: RunStats): void {
  const extended = stats as CollectionRunStats;
  extended.healsCollected = (extended.healsCollected ?? 0) + 1;
}

export function getSeenEnemyIds(stats: RunStats): Id[] {
  return Object.keys((stats as CollectionRunStats).enemySeen ?? {});
}

export function getEnemyDefeats(stats: RunStats): Record<Id, number> {
  return { ...((stats as CollectionRunStats).enemyDefeats ?? {}) };
}

export function getHealsCollected(stats: RunStats): number {
  return Math.max(0, Math.floor((stats as CollectionRunStats).healsCollected ?? 0));
}
