import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  collectionAtlasViewStateStorageKey,
  findNewCompletedCellIds,
  loadCollectionAtlasViewState,
  markCompletedCellsSeen,
  saveCollectionAtlasViewState,
} from './collectionAtlasViewState';

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => Array.from(data.keys())[index] ?? null,
    removeItem: (key) => data.delete(key),
    setItem: (key, value) => data.set(key, value),
  };
}

describe('collectionAtlasViewState', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { localStorage: createMemoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('初回はcompletedをすべて新規として返し、重複は除く', () => {
    expect(findNewCompletedCellIds(['a', 'a', 'b'], [])).toEqual(['a', 'b']);
  });

  it('seen済みを除き、増えたIDだけを返す', () => {
    expect(findNewCompletedCellIds(['a', 'b', 'c'], ['a', 'b'])).toEqual(['c']);
  });

  it('壊れたlocalStorageは空の閲覧状態へ戻す', () => {
    window.localStorage.setItem(collectionAtlasViewStateStorageKey(), '{ broken json');
    expect(loadCollectionAtlasViewState()).toEqual({ seenCompletedCellIds: [] });
  });

  it('保存時に重複IDと不正な時刻を正規化する', () => {
    saveCollectionAtlasViewState({ seenCompletedCellIds: ['a', 'a', 'b'], lastOpenedAt: Number.NaN });
    expect(loadCollectionAtlasViewState()).toEqual({ seenCompletedCellIds: ['a', 'b'] });
  });

  it('mark後は新規completedが空になり、以前のseenも保持する', () => {
    saveCollectionAtlasViewState({ seenCompletedCellIds: ['old'] });
    vi.spyOn(Date, 'now').mockReturnValue(1234);
    markCompletedCellsSeen(['new', 'new']);
    const state = loadCollectionAtlasViewState();
    expect(state).toEqual({ seenCompletedCellIds: ['old', 'new'], lastOpenedAt: 1234 });
    expect(findNewCompletedCellIds(['new'], state.seenCompletedCellIds)).toEqual([]);
  });

  it('windowが無い環境でも空の状態を返して保存で落ちない', () => {
    vi.unstubAllGlobals();
    expect(loadCollectionAtlasViewState()).toEqual({ seenCompletedCellIds: [] });
    expect(() => markCompletedCellsSeen(['a'])).not.toThrow();
  });
});
