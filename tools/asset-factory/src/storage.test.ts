import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { LibraryEntry, AssetManifest, ReviewStatus, QualityScore } from './types';
import {
  filterLibrary, sortLibrary,
  type LibraryFilter, type LibrarySortKey,
} from './storage';

import type { ManualIssue } from './types';

function makeEntry(overrides: {
  id?: string; displayName?: string; type?: string; reviewStatus?: ReviewStatus;
  qualityScore?: QualityScore; tags?: string[]; notes?: string; reviewNotes?: string;
  sourceFileName?: string; updatedAt?: string; createdAt?: string;
  manualIssues?: ManualIssue[];
} = {}): LibraryEntry {
  const type = (overrides.type || 'enemy') as LibraryEntry['manifest']['type'];
  const manifest = {
    id: overrides.id || 'test-id',
    displayName: overrides.displayName || 'Test',
    type,
    sourceFileName: overrides.sourceFileName || 'test.png',
    tags: overrides.tags || [],
    notes: overrides.notes || '',
  } as AssetManifest;
  return {
    manifest,
    reviewStatus: overrides.reviewStatus || 'unchecked',
    qualityScore: overrides.qualityScore || 3,
    reviewNotes: overrides.reviewNotes || '',
    manualIssues: overrides.manualIssues || [],
    createdAt: overrides.createdAt || '2025-06-01T00:00:00Z',
    updatedAt: overrides.updatedAt || '2025-06-01T00:00:00Z',
  };
}

const ALL_FILTER: LibraryFilter = { assetType: 'all', reviewStatus: 'all', minScore: 1, search: '' };

describe('filterLibrary', () => {
  const entries = [
    makeEntry({ id: 'e1', type: 'enemy', reviewStatus: 'approved', qualityScore: 5, displayName: 'オンブ' }),
    makeEntry({ id: 'e2', type: 'weapon', reviewStatus: 'candidate', qualityScore: 3, displayName: 'ランタン' }),
    makeEntry({ id: 'e3', type: 'item', reviewStatus: 'needs-regeneration', qualityScore: 2, displayName: '靴' }),
    makeEntry({ id: 'e4', type: 'enemy', reviewStatus: 'rejected', qualityScore: 1, displayName: '傘オンブ', tags: ['special'] }),
    makeEntry({ id: 'e5', type: 'cutin', reviewStatus: 'approved', qualityScore: 4, displayName: 'ユイカットイン' }),
  ];

  it('all filter returns everything', () => {
    expect(filterLibrary(entries, ALL_FILTER)).toHaveLength(5);
  });

  it('filters by assetType', () => {
    const result = filterLibrary(entries, { ...ALL_FILTER, assetType: 'enemy' });
    expect(result).toHaveLength(2);
    expect(result.every(e => e.manifest.type === 'enemy')).toBe(true);
  });

  it('filters by reviewStatus', () => {
    const result = filterLibrary(entries, { ...ALL_FILTER, reviewStatus: 'approved' });
    expect(result).toHaveLength(2);
  });

  it('filters by minScore', () => {
    const result = filterLibrary(entries, { ...ALL_FILTER, minScore: 4 });
    expect(result).toHaveLength(2);
    expect(result.every(e => e.qualityScore >= 4)).toBe(true);
  });

  it('filters by search text (displayName)', () => {
    const result = filterLibrary(entries, { ...ALL_FILTER, search: 'オンブ' });
    expect(result).toHaveLength(2);
  });

  it('filters by search text (tags)', () => {
    const result = filterLibrary(entries, { ...ALL_FILTER, search: 'special' });
    expect(result).toHaveLength(1);
    expect(result[0].manifest.id).toBe('e4');
  });

  it('combines multiple filters', () => {
    const result = filterLibrary(entries, { assetType: 'enemy', reviewStatus: 'approved', minScore: 4, search: '' });
    expect(result).toHaveLength(1);
    expect(result[0].manifest.id).toBe('e1');
  });

  it('returns empty when nothing matches', () => {
    const result = filterLibrary(entries, { ...ALL_FILTER, search: 'nonexistent-xyz' });
    expect(result).toHaveLength(0);
  });

  it('search is case-insensitive', () => {
    const result = filterLibrary(entries, { ...ALL_FILTER, search: 'SPECIAL' });
    expect(result).toHaveLength(1);
  });
});

describe('sortLibrary', () => {
  const entries = [
    makeEntry({ id: 'a', qualityScore: 3, updatedAt: '2025-06-03T00:00:00Z', createdAt: '2025-06-01T00:00:00Z', displayName: 'Ccc', type: 'weapon' }),
    makeEntry({ id: 'b', qualityScore: 5, updatedAt: '2025-06-01T00:00:00Z', createdAt: '2025-06-03T00:00:00Z', displayName: 'Aaa', type: 'enemy' }),
    makeEntry({ id: 'c', qualityScore: 1, updatedAt: '2025-06-02T00:00:00Z', createdAt: '2025-06-02T00:00:00Z', displayName: 'Bbb', type: 'item' }),
  ];

  it('sorts by updatedAt-desc', () => {
    const result = sortLibrary(entries, 'updatedAt-desc');
    expect(result.map(e => e.manifest.id)).toEqual(['a', 'c', 'b']);
  });

  it('sorts by updatedAt-asc', () => {
    const result = sortLibrary(entries, 'updatedAt-asc');
    expect(result.map(e => e.manifest.id)).toEqual(['b', 'c', 'a']);
  });

  it('sorts by createdAt-desc', () => {
    const result = sortLibrary(entries, 'createdAt-desc');
    expect(result.map(e => e.manifest.id)).toEqual(['b', 'c', 'a']);
  });

  it('sorts by qualityScore-desc', () => {
    const result = sortLibrary(entries, 'qualityScore-desc');
    expect(result.map(e => e.manifest.id)).toEqual(['b', 'a', 'c']);
  });

  it('sorts by qualityScore-asc', () => {
    const result = sortLibrary(entries, 'qualityScore-asc');
    expect(result.map(e => e.manifest.id)).toEqual(['c', 'a', 'b']);
  });

  it('sorts by type', () => {
    const result = sortLibrary(entries, 'type');
    expect(result.map(e => e.manifest.type)).toEqual(['enemy', 'item', 'weapon']);
  });

  it('sorts by displayName', () => {
    const result = sortLibrary(entries, 'displayName');
    expect(result.map(e => e.manifest.displayName)).toEqual(['Aaa', 'Bbb', 'Ccc']);
  });

  it('does not mutate original array', () => {
    const original = [...entries];
    sortLibrary(entries, 'qualityScore-desc');
    expect(entries.map(e => e.manifest.id)).toEqual(original.map(e => e.manifest.id));
  });
});

describe('localStorage-dependent functions', () => {
  const mockStorage = new Map<string, string>();

  beforeEach(() => {
    mockStorage.clear();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage.get(key) ?? null,
      setItem: (key: string, value: string) => mockStorage.set(key, value),
      removeItem: (key: string) => mockStorage.delete(key),
    });
  });

  it('importLibraryJSON applies migrateEntry', async () => {
    const { importLibraryJSON, loadLibrary } = await import('./storage');
    const oldEntries = [
      { manifest: { id: 'old', displayName: 'Old', type: 'enemy', sourceFileName: 'old.png', tags: [], notes: '' }, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    ];
    importLibraryJSON(JSON.stringify(oldEntries));
    const loaded = loadLibrary();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].reviewStatus).toBe('unchecked');
    expect(loaded[0].qualityScore).toBe(3);
    expect(loaded[0].reviewNotes).toBe('');
  });

  it('buildApprovedManifestsExport returns only approved manifests', async () => {
    const { saveLibrary, buildApprovedManifestsExport } = await import('./storage');
    saveLibrary([
      makeEntry({ id: 'a1', reviewStatus: 'approved' }),
      makeEntry({ id: 'a2', reviewStatus: 'candidate' }),
      makeEntry({ id: 'a3', reviewStatus: 'approved' }),
    ]);
    const result = JSON.parse(buildApprovedManifestsExport());
    expect(result).toHaveLength(2);
    expect(result.map((m: AssetManifest) => m.id)).toEqual(['a1', 'a3']);
  });

  it('buildUnityHandoffExport has correct structure', async () => {
    const { saveLibrary, buildUnityHandoffExport } = await import('./storage');
    saveLibrary([
      makeEntry({ id: 'u1', type: 'enemy', reviewStatus: 'approved', qualityScore: 4 }),
      makeEntry({ id: 'u2', type: 'weapon', reviewStatus: 'approved', qualityScore: 5 }),
      makeEntry({ id: 'u3', type: 'enemy', reviewStatus: 'rejected' }),
    ]);
    const result = JSON.parse(buildUnityHandoffExport());
    expect(result.tool).toBe('vamp-pon-asset-factory');
    expect(result.purpose).toBe('unity-handoff');
    expect(result.counts.total).toBe(2);
    expect(result.counts.enemy).toBe(1);
    expect(result.counts.weapon).toBe(1);
    expect(result.assets).toHaveLength(2);
    expect(result.exportedAt).toBeTruthy();
  });

  it('buildRegenerationQueueExport returns only needs-regeneration', async () => {
    const { saveLibrary, buildRegenerationQueueExport } = await import('./storage');
    saveLibrary([
      makeEntry({ id: 'r1', reviewStatus: 'needs-regeneration', reviewNotes: 'edge touch' }),
      makeEntry({ id: 'r2', reviewStatus: 'approved' }),
      makeEntry({ id: 'r3', reviewStatus: 'needs-regeneration', reviewNotes: 'too small' }),
    ]);
    const result = JSON.parse(buildRegenerationQueueExport());
    expect(result).toHaveLength(2);
    expect(result.map((e: { id: string }) => e.id)).toEqual(['r1', 'r3']);
  });

  it('buildRegenerationQueueExport includes manualIssues', async () => {
    const { saveLibrary, buildRegenerationQueueExport } = await import('./storage');
    saveLibrary([
      makeEntry({ id: 'rq1', reviewStatus: 'needs-regeneration', manualIssues: ['white-background', 'white-fringe'] }),
    ]);
    const result = JSON.parse(buildRegenerationQueueExport());
    expect(result).toHaveLength(1);
    expect(result[0].manualIssues).toEqual(['white-background', 'white-fringe']);
  });

  it('buildUnityHandoffExport includes manualIssues', async () => {
    const { saveLibrary, buildUnityHandoffExport } = await import('./storage');
    saveLibrary([
      makeEntry({ id: 'uh1', reviewStatus: 'approved', manualIssues: ['identity-drift'] }),
      makeEntry({ id: 'uh2', reviewStatus: 'approved', manualIssues: [] }),
    ]);
    const result = JSON.parse(buildUnityHandoffExport());
    expect(result.assets).toHaveLength(2);
    expect(result.assets[0].manualIssues).toEqual(['identity-drift']);
    expect(result.assets[1].manualIssues).toEqual([]);
  });

  it('importLibraryJSON migration sets manualIssues to empty array', async () => {
    const { importLibraryJSON, loadLibrary } = await import('./storage');
    const oldEntries = [
      { manifest: { id: 'mi-old', displayName: 'Old', type: 'enemy', sourceFileName: 'old.png', tags: [], notes: '' }, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    ];
    importLibraryJSON(JSON.stringify(oldEntries));
    const loaded = loadLibrary();
    expect(loaded[0].manualIssues).toEqual([]);
  });

  it('approved entry with manualIssues is exported with issues preserved', async () => {
    const { saveLibrary, buildUnityHandoffExport, buildApprovedManifestsExport } = await import('./storage');
    const issues: ManualIssue[] = ['lantern-missing', 'bag-position-wrong'];
    saveLibrary([
      makeEntry({ id: 'ap-mi', reviewStatus: 'approved', qualityScore: 3, manualIssues: issues }),
    ]);
    const handoff = JSON.parse(buildUnityHandoffExport());
    expect(handoff.assets[0].manualIssues).toEqual(issues);
    const manifests = JSON.parse(buildApprovedManifestsExport());
    expect(manifests).toHaveLength(1);
  });
});
