import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDefaultProfile, loadProfile, saveProfile, selectSubCharacter } from './profile';

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => Array.from(data.keys())[index] ?? null,
    removeItem: (key) => data.delete(key),
    setItem: (key, value) => data.set(key, value),
  };
}

vi.stubGlobal('localStorage', createMemoryStorage());

describe('profile sub character selection', () => {
  afterEach(() => {
    globalThis.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('デフォルトではサブキャラ未選択', () => {
    expect(createDefaultProfile().selectedSubCharacterId).toBeUndefined();
  });

  it('実装済みキャラだけ保存する', () => {
    selectSubCharacter('yui', 'asa');
    expect(loadProfile().selectedSubCharacterId).toBe('yui');
  });

  it('未実装キャラは保存しない', () => {
    selectSubCharacter('asa', 'yui');
    expect(loadProfile().selectedSubCharacterId).toBeUndefined();
  });

  it('メインキャラと同じなら保存しない', () => {
    selectSubCharacter('yui', 'yui');
    expect(loadProfile().selectedSubCharacterId).toBeUndefined();
  });

  it('空文字や未指定なら選択解除', () => {
    saveProfile({ ...createDefaultProfile(), selectedSubCharacterId: 'yui' });
    selectSubCharacter('   ', 'asa');
    expect(loadProfile().selectedSubCharacterId).toBeUndefined();
    selectSubCharacter(undefined, 'asa');
    expect(loadProfile().selectedSubCharacterId).toBeUndefined();
  });
});
