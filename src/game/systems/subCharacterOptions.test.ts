import { describe, expect, it } from 'vitest';
import { buildSubCharacterOptions, isValidSubCharacterSelection } from './subCharacterOptions';

describe('subCharacterOptions', () => {
  it('メインキャラ本人を候補から除外する', () => {
    const options = buildSubCharacterOptions({ mainCharacterId: 'yui' });
    expect(options.some((option) => option.characterId === 'yui')).toBe(false);
  });

  it('未実装キャラを準備中として表示できる', () => {
    const options = buildSubCharacterOptions({ mainCharacterId: 'yui' });
    const asa = options.find((option) => option.characterId === 'asa');
    expect(asa?.enabled).toBe(false);
    expect(asa?.reason).toBe('準備中');
  });

  it('実装済みIDを渡すと選択可能にできる', () => {
    const options = buildSubCharacterOptions({
      mainCharacterId: 'yui',
      selectedSubCharacterId: 'asa',
      implementedCharacterIds: ['yui', 'asa'],
    });
    const asa = options.find((option) => option.characterId === 'asa');
    expect(asa?.enabled).toBe(true);
    expect(asa?.selected).toBe(true);
  });

  it('showPlannedCharacters=falseなら実装済みだけ返す', () => {
    const options = buildSubCharacterOptions({
      mainCharacterId: 'yui',
      implementedCharacterIds: ['yui', 'asa'],
      showPlannedCharacters: false,
    });
    expect(options.map((option) => option.characterId)).toEqual(['asa']);
  });

  it('有効なサブキャラ選択だけtrueにする', () => {
    expect(isValidSubCharacterSelection('yui', undefined, ['yui', 'asa'])).toBe(false);
    expect(isValidSubCharacterSelection('yui', 'yui', ['yui', 'asa'])).toBe(false);
    expect(isValidSubCharacterSelection('yui', 'asa', ['yui', 'asa'])).toBe(true);
    expect(isValidSubCharacterSelection('yui', 'nagi', ['yui', 'asa'])).toBe(false);
  });
});
