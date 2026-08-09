import { describe, expect, it, vi } from 'vitest';
import {
  APP_PREFERENCE_STORAGE_KEY,
  AppPreferenceOwner,
  DEFAULT_APP_PREFERENCES,
  normalizeAppPreferences,
} from './appPreferences';

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

describe('AppPreferenceOwner', () => {
  it('4項目をversioned APP_PREFERENCEとして保存・復元する', () => {
    const storage = memoryStorage();
    const owner = new AppPreferenceOwner(storage);
    owner.update({ bgmVolume: 0.35, seVolume: 0, hapticsEnabled: false, reducedMotion: true });
    const restored = new AppPreferenceOwner(storage);
    expect(restored.get()).toEqual({
      schemaVersion: 1,
      bgmVolume: 0.35,
      seVolume: 0,
      hapticsEnabled: false,
      reducedMotion: true,
    });
    expect(storage.getItem(APP_PREFERENCE_STORAGE_KEY)).not.toBeNull();
  });

  it('unknown fieldを無視し、壊れたrangeだけを安全なdefaultへ戻す', () => {
    expect(normalizeAppPreferences({
      schemaVersion: 99,
      bgmVolume: 4,
      seVolume: Number.NaN,
      hapticsEnabled: false,
      reducedMotion: true,
      futureSetting: 'preserve-compatible',
    })).toEqual({
      schemaVersion: 1,
      bgmVolume: 1,
      seVolume: 1,
      hapticsEnabled: false,
      reducedMotion: true,
    });
  });

  it('gameplay profileとは別keyであり、progress reset相当の削除で消えない', () => {
    const storage = memoryStorage();
    const owner = new AppPreferenceOwner(storage);
    owner.update({ reducedMotion: true });
    storage.setItem('vampPon.playerProfile.v1', '{"currency":10}');
    storage.removeItem('vampPon.playerProfile.v1');
    expect(new AppPreferenceOwner(storage).get().reducedMotion).toBe(true);
    expect(DEFAULT_APP_PREFERENCES).toMatchObject({
      bgmVolume: 1,
      seVolume: 1,
      hapticsEnabled: true,
      reducedMotion: false,
    });
  });

  it('保存不可でもthrowせず、変更通知を1ownerから送る', () => {
    const storage = memoryStorage();
    storage.setItem = vi.fn(() => { throw new Error('quota'); });
    const owner = new AppPreferenceOwner(storage);
    const listener = vi.fn();
    owner.subscribe(listener);
    expect(() => owner.update({ seVolume: 0.5 })).not.toThrow();
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ seVolume: 0.5 }));
  });
});
