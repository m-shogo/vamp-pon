import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDefaultOnboarding,
  loadOnboarding,
  saveOnboarding,
  markSeen,
  resetOnboarding,
  onboardingStorageKey,
} from './onboarding';

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

describe('onboarding persistence', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { localStorage: createMemoryStorage() });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('デフォルトは全フラグfalse', () => {
    const state = createDefaultOnboarding();
    expect(Object.values(state).every((v) => v === false)).toBe(true);
  });

  it('保存・読み込みが往復する', () => {
    const state = createDefaultOnboarding();
    state.topIntroSeen = true;
    saveOnboarding(state);
    const loaded = loadOnboarding();
    expect(loaded.topIntroSeen).toBe(true);
    expect(loaded.stageSelectIntroSeen).toBe(false);
  });

  it('壊れたJSONでもデフォルトで起動する', () => {
    window.localStorage.setItem(onboardingStorageKey(), '{ broken');
    const loaded = loadOnboarding();
    expect(loaded).toEqual(createDefaultOnboarding());
  });

  it('未知フィールドがあっても落ちない', () => {
    window.localStorage.setItem(onboardingStorageKey(), JSON.stringify({
      topIntroSeen: true,
      unknownField: 'hello',
      futureFlag: true,
    }));
    const loaded = loadOnboarding();
    expect(loaded.topIntroSeen).toBe(true);
    expect(loaded.stageSelectIntroSeen).toBe(false);
    expect((loaded as Record<string, unknown>).unknownField).toBeUndefined();
  });

  it('markSeenは対象フラグだけtrueにする', () => {
    markSeen('levelUpHintSeen');
    const loaded = loadOnboarding();
    expect(loaded.levelUpHintSeen).toBe(true);
    expect(loaded.topIntroSeen).toBe(false);
    expect(loaded.healHintSeen).toBe(false);
  });

  it('resetOnboardingはonboardingだけ消す', () => {
    saveOnboarding({ ...createDefaultOnboarding(), topIntroSeen: true });
    window.localStorage.setItem('vampPon.playerProfile.v1', '{"currency":999}');
    resetOnboarding();
    expect(loadOnboarding()).toEqual(createDefaultOnboarding());
    expect(window.localStorage.getItem('vampPon.playerProfile.v1')).toBe('{"currency":999}');
  });

  it('windowなしで落ちない', () => {
    vi.unstubAllGlobals();
    vi.stubGlobal('window', undefined);
    expect(loadOnboarding()).toEqual(createDefaultOnboarding());
    expect(() => markSeen('topIntroSeen')).not.toThrow();
    expect(() => resetOnboarding()).not.toThrow();
  });
});
