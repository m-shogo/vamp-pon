import type { LibraryEntry, AssetManifest, InspectResult, ReviewStatus, QualityScore } from './types';

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
  existing.push(...imported);
  saveLibrary(existing);
  return imported.length;
}
