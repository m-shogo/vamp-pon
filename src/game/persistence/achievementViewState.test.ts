import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadAchievementViewState,
  saveAchievementViewState,
  findNewAchievementIds,
  markAchievementsSeen,
  achievementViewStateStorageKey,
} from './achievementViewState';

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => Array.from(data.keys())[index] ?? null,
    removeItem: (key) => { data.delete(key); },
    setItem: (key, value) => data.set(key, value),
  };
}

describe('achievementViewState persistence', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { localStorage: createMemoryStorage() });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('デフォルトは空配列', () => {
    const state = loadAchievementViewState();
    expect(state.seenAchievementIds).toEqual([]);
  });

  it('保存・読み込みが往復する', () => {
    saveAchievementViewState({ seenAchievementIds: ['a', 'b'] });
    const loaded = loadAchievementViewState();
    expect(loaded.seenAchievementIds).toEqual(['a', 'b']);
  });

  it('壊れたJSONでもデフォルトで起動する', () => {
    window.localStorage.setItem(achievementViewStateStorageKey(), '{ broken');
    const loaded = loadAchievementViewState();
    expect(loaded.seenAchievementIds).toEqual([]);
  });

  it('重複IDは排除される', () => {
    saveAchievementViewState({ seenAchievementIds: ['a', 'b', 'a', 'b', 'c'] });
    const loaded = loadAchievementViewState();
    expect(loaded.seenAchievementIds).toEqual(['a', 'b', 'c']);
  });

  it('未知フィールドがあっても落ちない', () => {
    window.localStorage.setItem(achievementViewStateStorageKey(), JSON.stringify({
      seenAchievementIds: ['x'],
      unknownField: 'hello',
    }));
    const loaded = loadAchievementViewState();
    expect(loaded.seenAchievementIds).toEqual(['x']);
  });

  it('findNewAchievementIdsが正しい', () => {
    expect(findNewAchievementIds(['a', 'b', 'c'], ['a'])).toEqual(['b', 'c']);
    expect(findNewAchievementIds(['a'], ['a', 'b'])).toEqual([]);
    expect(findNewAchievementIds([], ['a'])).toEqual([]);
  });

  it('markAchievementsSeenで新着が消える', () => {
    markAchievementsSeen(['a', 'b']);
    expect(findNewAchievementIds(['a', 'b', 'c'], loadAchievementViewState().seenAchievementIds)).toEqual(['c']);
    markAchievementsSeen(['c']);
    expect(findNewAchievementIds(['a', 'b', 'c'], loadAchievementViewState().seenAchievementIds)).toEqual([]);
  });

  it('windowなしで落ちない', () => {
    vi.unstubAllGlobals();
    vi.stubGlobal('window', undefined);
    expect(loadAchievementViewState()).toEqual({ seenAchievementIds: [] });
    expect(() => markAchievementsSeen(['a'])).not.toThrow();
  });
});
