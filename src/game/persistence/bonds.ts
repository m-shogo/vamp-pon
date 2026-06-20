import {
  addBondPoints,
  applyBondRunResult,
  bondLevelForPoints,
  emptyBondProgressState,
  type BondProgressEntry,
  type BondProgressState,
  type BondRunResult,
} from '../systems/bondProgress';

const STORAGE_KEY = 'vampPon.bondProgress.v1';

type PersistedBondProgress = BondProgressState & { version: 1 };

function normalizeBondEntry(pairKey: string, raw: unknown): BondProgressEntry {
  const obj = raw && typeof raw === 'object' ? raw as Partial<BondProgressEntry> : {};
  const points = Math.max(0, Math.floor(Number(obj.points ?? 0)));
  return {
    pairKey,
    points,
    level: bondLevelForPoints(points),
    seenTalkIds: Array.from(new Set(Array.isArray(obj.seenTalkIds) ? obj.seenTalkIds.filter((id): id is string => typeof id === 'string') : [])),
  };
}

export function createDefaultBondProgress(): PersistedBondProgress {
  return { version: 1, ...emptyBondProgressState() };
}

export function normalizeBondProgress(raw: unknown): PersistedBondProgress {
  const base = createDefaultBondProgress();
  if (!raw || typeof raw !== 'object') return base;
  const obj = raw as Partial<PersistedBondProgress>;
  const pairs: BondProgressState['pairs'] = {};
  const rawPairs = obj.pairs && typeof obj.pairs === 'object' ? obj.pairs : {};
  for (const [key, value] of Object.entries(rawPairs)) pairs[key] = normalizeBondEntry(key, value);
  return { version: 1, pairs };
}

export function loadBondProgress(): PersistedBondProgress {
  if (typeof window === 'undefined') return createDefaultBondProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normalizeBondProgress(raw ? JSON.parse(raw) : null);
  } catch {
    return createDefaultBondProgress();
  }
}

export function saveBondProgress(progress: BondProgressState): PersistedBondProgress {
  const normalized = normalizeBondProgress({ version: 1, ...progress });
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function addSavedBondPoints(a: string, b: string, points: number): PersistedBondProgress {
  return saveBondProgress(addBondPoints(loadBondProgress(), a, b, points));
}

export function settleSavedBondRun(result: BondRunResult): PersistedBondProgress {
  return saveBondProgress(applyBondRunResult(loadBondProgress(), result));
}
