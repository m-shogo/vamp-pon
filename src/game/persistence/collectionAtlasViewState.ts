const COLLECTION_ATLAS_VIEW_STATE_KEY = 'vampPon.collectionAtlasViewState.v1';

export type CollectionAtlasViewState = {
  seenCompletedCellIds: string[];
  lastOpenedAt?: number;
};

function uniqueStringIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0)));
}

function normalizeCollectionAtlasViewState(value: unknown): CollectionAtlasViewState {
  if (!value || typeof value !== 'object') return { seenCompletedCellIds: [] };
  const candidate = value as Partial<CollectionAtlasViewState>;
  const lastOpenedAt = Number(candidate.lastOpenedAt);
  return {
    seenCompletedCellIds: uniqueStringIds(candidate.seenCompletedCellIds),
    ...(Number.isFinite(lastOpenedAt) && lastOpenedAt >= 0 ? { lastOpenedAt } : {}),
  };
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadCollectionAtlasViewState(): CollectionAtlasViewState {
  const storage = getStorage();
  if (!storage) return { seenCompletedCellIds: [] };
  try {
    const raw = storage.getItem(COLLECTION_ATLAS_VIEW_STATE_KEY);
    return normalizeCollectionAtlasViewState(raw ? JSON.parse(raw) : null);
  } catch {
    return { seenCompletedCellIds: [] };
  }
}

export function saveCollectionAtlasViewState(state: CollectionAtlasViewState): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(COLLECTION_ATLAS_VIEW_STATE_KEY, JSON.stringify(normalizeCollectionAtlasViewState(state)));
  } catch {
    // Private mode/quota failures must not block the collection atlas.
  }
}

export function findNewCompletedCellIds(completedCellIds: string[], seenCompletedCellIds: string[]): string[] {
  const seen = new Set(uniqueStringIds(seenCompletedCellIds));
  return uniqueStringIds(completedCellIds).filter((id) => !seen.has(id));
}

export function markCompletedCellsSeen(completedCellIds: string[]): void {
  const current = loadCollectionAtlasViewState();
  saveCollectionAtlasViewState({
    seenCompletedCellIds: uniqueStringIds([...current.seenCompletedCellIds, ...completedCellIds]),
    lastOpenedAt: Date.now(),
  });
}

export function collectionAtlasViewStateStorageKey(): string {
  return COLLECTION_ATLAS_VIEW_STATE_KEY;
}
