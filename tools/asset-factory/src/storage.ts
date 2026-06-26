import type { LibraryEntry, AssetManifest, InspectResult, AssetType, ReviewStatus, QualityScore } from './types';

const STORAGE_KEY = 'vamp-pon-asset-factory-library';

function migrateEntry(e: LibraryEntry): LibraryEntry {
  if (!e.reviewStatus) e.reviewStatus = 'unchecked';
  if (!e.qualityScore) e.qualityScore = 3;
  if (e.reviewNotes === undefined) e.reviewNotes = '';
  return e;
}

export function loadLibrary(): LibraryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as LibraryEntry[]).map(migrateEntry);
  } catch {
    return [];
  }
}

export function saveLibrary(entries: LibraryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addEntry(
  manifest: AssetManifest,
  inspectResult?: InspectResult,
  prompt?: string,
  reviewStatus: ReviewStatus = 'unchecked',
  qualityScore: QualityScore = 3,
  reviewNotes = '',
): LibraryEntry {
  const entries = loadLibrary();
  const now = new Date().toISOString();
  const entry: LibraryEntry = { manifest, inspectResult, prompt, reviewStatus, qualityScore, reviewNotes, createdAt: now, updatedAt: now };
  entries.push(entry);
  saveLibrary(entries);
  return entry;
}

export function updateEntry(index: number, partial: Partial<LibraryEntry>): void {
  const entries = loadLibrary();
  if (index < 0 || index >= entries.length) return;
  Object.assign(entries[index], partial, { updatedAt: new Date().toISOString() });
  saveLibrary(entries);
}

export function deleteEntry(index: number): void {
  const entries = loadLibrary();
  if (index < 0 || index >= entries.length) return;
  entries.splice(index, 1);
  saveLibrary(entries);
}

export function duplicateEntry(index: number): void {
  const entries = loadLibrary();
  if (index < 0 || index >= entries.length) return;
  const copy = JSON.parse(JSON.stringify(entries[index])) as LibraryEntry;
  copy.manifest.id = copy.manifest.id + '-copy';
  copy.manifest.displayName = copy.manifest.displayName + ' (copy)';
  copy.createdAt = new Date().toISOString();
  copy.updatedAt = new Date().toISOString();
  entries.push(copy);
  saveLibrary(entries);
}

export function exportLibraryJSON(): string {
  return JSON.stringify(loadLibrary(), null, 2);
}

export function importLibraryJSON(json: string): number {
  const imported = JSON.parse(json) as LibraryEntry[];
  if (!Array.isArray(imported)) throw new Error('Invalid library JSON');
  const existing = loadLibrary();
  existing.push(...imported.map(migrateEntry));
  saveLibrary(existing);
  return imported.length;
}

// --- Filter & Sort ---

export type LibraryFilter = {
  assetType: AssetType | 'all';
  reviewStatus: ReviewStatus | 'all';
  minScore: number;
  search: string;
};

export type LibrarySortKey = 'updatedAt-desc' | 'updatedAt-asc' | 'createdAt-desc' | 'createdAt-asc'
  | 'qualityScore-desc' | 'qualityScore-asc' | 'type' | 'displayName';

export function filterLibrary(entries: LibraryEntry[], filter: LibraryFilter): LibraryEntry[] {
  return entries.filter(e => {
    if (filter.assetType !== 'all' && e.manifest.type !== filter.assetType) return false;
    if (filter.reviewStatus !== 'all' && e.reviewStatus !== filter.reviewStatus) return false;
    if (e.qualityScore < filter.minScore) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const hay = [
        e.manifest.id, e.manifest.displayName, e.manifest.sourceFileName,
        (e.manifest.tags || []).join(' '), e.manifest.notes || '', e.reviewNotes || '',
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortLibrary(entries: LibraryEntry[], key: LibrarySortKey): LibraryEntry[] {
  const sorted = [...entries];
  switch (key) {
    case 'updatedAt-desc': return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case 'updatedAt-asc': return sorted.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    case 'createdAt-desc': return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'createdAt-asc': return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case 'qualityScore-desc': return sorted.sort((a, b) => b.qualityScore - a.qualityScore);
    case 'qualityScore-asc': return sorted.sort((a, b) => a.qualityScore - b.qualityScore);
    case 'type': return sorted.sort((a, b) => a.manifest.type.localeCompare(b.manifest.type));
    case 'displayName': return sorted.sort((a, b) => (a.manifest.displayName || '').localeCompare(b.manifest.displayName || ''));
    default: return sorted;
  }
}

export function getApprovedEntries(): LibraryEntry[] {
  return loadLibrary().filter(e => e.reviewStatus === 'approved');
}

export function buildApprovedManifestsExport(): string {
  const manifests = getApprovedEntries().map(e => e.manifest);
  return JSON.stringify(manifests, null, 2);
}

export function buildUnityHandoffExport(): string {
  const approved = getApprovedEntries();
  const counts: Record<string, number> = { total: approved.length, character: 0, enemy: 0, weapon: 0, item: 0, background: 0, cutin: 0 };
  for (const e of approved) counts[e.manifest.type] = (counts[e.manifest.type] || 0) + 1;
  const assets = approved.map(e => ({
    id: e.manifest.id,
    displayName: e.manifest.displayName,
    type: e.manifest.type,
    sourceFileName: e.manifest.sourceFileName,
    qualityScore: e.qualityScore,
    reviewNotes: e.reviewNotes,
    manifest: e.manifest,
  }));
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    tool: 'vamp-pon-asset-factory',
    purpose: 'unity-handoff',
    counts,
    assets,
  }, null, 2);
}

export function buildRegenerationQueueExport(): string {
  const queue = loadLibrary().filter(e => e.reviewStatus === 'needs-regeneration');
  const items = queue.map(e => ({
    id: e.manifest.id,
    displayName: e.manifest.displayName,
    type: e.manifest.type,
    sourceFileName: e.manifest.sourceFileName,
    qualityScore: e.qualityScore,
    reviewNotes: e.reviewNotes,
    manifest: e.manifest,
    warnings: e.inspectResult?.warnings || [],
    prompt: e.prompt || null,
  }));
  return JSON.stringify(items, null, 2);
}
