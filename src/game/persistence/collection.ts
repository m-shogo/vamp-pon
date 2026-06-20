import {
  FORGOTTEN_STREET_BOARD_ID,
  type CollectionProgressSaveData,
} from '../data/collectionProgress';

const STORAGE_KEY = 'vampPon.collection.v1';

export function createDefaultCollectionProgress(): CollectionProgressSaveData {
  return {
    seenEnemyIds: [],
    defeatedEnemyCounts: {},
    calmedBossIds: [],
    discoveredLostItemIds: [],
    unlockedMemoryTextIds: [],
    nightBoard: {
      completedCellIds: [],
      claimedCellIds: [],
      revealedCellIds: [
        'fs_001_release_ink_shadow',
        'fs_006_clear_depth_1',
        'fs_011_level_pencil_5',
        'fs_016_first_lost_item',
      ],
      hintedCellIds: [],
    },
  };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((item): item is string => typeof item === 'string')));
}

function normalizeCountRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {};
  const result: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const n = Math.max(0, Math.floor(Number(raw ?? 0)));
    if (key && Number.isFinite(n) && n > 0) result[key] = n;
  }
  return result;
}

export function normalizeCollectionProgress(raw: unknown): CollectionProgressSaveData {
  const base = createDefaultCollectionProgress();
  if (!raw || typeof raw !== 'object') return base;
  const obj = raw as Partial<CollectionProgressSaveData>;
  const board = obj.nightBoard ?? base.nightBoard;
  return {
    seenEnemyIds: normalizeStringArray(obj.seenEnemyIds),
    defeatedEnemyCounts: normalizeCountRecord(obj.defeatedEnemyCounts),
    calmedBossIds: normalizeStringArray(obj.calmedBossIds),
    discoveredLostItemIds: normalizeStringArray(obj.discoveredLostItemIds),
    unlockedMemoryTextIds: normalizeStringArray(obj.unlockedMemoryTextIds),
    nightBoard: {
      completedCellIds: normalizeStringArray(board.completedCellIds),
      claimedCellIds: normalizeStringArray(board.claimedCellIds),
      revealedCellIds: Array.from(new Set([
        ...base.nightBoard.revealedCellIds,
        ...normalizeStringArray(board.revealedCellIds),
      ])),
      hintedCellIds: normalizeStringArray(board.hintedCellIds),
    },
  };
}

export function loadCollectionProgress(): CollectionProgressSaveData {
  if (typeof window === 'undefined') return createDefaultCollectionProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normalizeCollectionProgress(raw ? JSON.parse(raw) : null);
  } catch {
    return createDefaultCollectionProgress();
  }
}

export function saveCollectionProgress(progress: CollectionProgressSaveData): CollectionProgressSaveData {
  const normalized = normalizeCollectionProgress(progress);
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function collectionStorageDebugKey(): string {
  return `${STORAGE_KEY}:${FORGOTTEN_STREET_BOARD_ID}`;
}
