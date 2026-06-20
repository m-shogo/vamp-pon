import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDefaultProfile, loadProfile, saveProfile, selectSubCharacter } from './profile';

describe('profile sub character selection', () => {
  afterEach(() => {
    window.localStorage.clear();
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
