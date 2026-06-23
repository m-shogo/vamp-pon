const STORAGE_KEY = 'vampPon.achievementViewState.v1';

export type AchievementViewState = {
  seenAchievementIds: string[];
};

function uniqueStringIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0)));
}

function normalize(value: unknown): AchievementViewState {
  if (!value || typeof value !== 'object') return { seenAchievementIds: [] };
  const candidate = value as Partial<AchievementViewState>;
  return { seenAchievementIds: uniqueStringIds(candidate.seenAchievementIds) };
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadAchievementViewState(): AchievementViewState {
  const storage = getStorage();
  if (!storage) return { seenAchievementIds: [] };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return normalize(raw ? JSON.parse(raw) : null);
  } catch {
    return { seenAchievementIds: [] };
  }
}

export function saveAchievementViewState(state: AchievementViewState): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(normalize(state)));
  } catch {
    // quota/private-mode failures must not block gameplay
  }
}

export function findNewAchievementIds(achievedIds: string[], seenIds: string[]): string[] {
  const seen = new Set(uniqueStringIds(seenIds));
  return uniqueStringIds(achievedIds).filter((id) => !seen.has(id));
}

export function markAchievementsSeen(ids: string[]): void {
  const current = loadAchievementViewState();
  saveAchievementViewState({
    seenAchievementIds: uniqueStringIds([...current.seenAchievementIds, ...ids]),
  });
}

export function achievementViewStateStorageKey(): string {
  return STORAGE_KEY;
}
