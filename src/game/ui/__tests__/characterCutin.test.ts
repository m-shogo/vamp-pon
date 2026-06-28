import { describe, expect, it } from 'vitest';
import { YUI_FRAME_IDS } from '../../assets/playerFrames';
import { YUI_EXPRESSION_RAGE_SHEET } from '../../assets/yuiExpressionRageSheet';
import { CHARACTER_CUTIN_TEXTURE, resolveCutinCopy, resolveCutinVisual } from '../characterCutin';

function fakeScene(existing: string[]) {
  const keys = new Set(existing);
  return {
    textures: {
      exists: (key: string) => keys.has(key),
    },
  } as never;
}

describe('character cutin visual fallback', () => {
  it('prefers production cutin textures when registered', () => {
    expect(resolveCutinVisual(fakeScene([CHARACTER_CUTIN_TEXTURE.ultimate]), 'ultimate')).toEqual({
      textureKey: CHARACTER_CUTIN_TEXTURE.ultimate,
    });
    expect(resolveCutinVisual(fakeScene([CHARACTER_CUTIN_TEXTURE.berserk]), 'berserk')).toEqual({
      textureKey: CHARACTER_CUTIN_TEXTURE.berserk,
    });
  });

  it('uses the black cutin sheet cell for berserk before a production cutin exists', () => {
    expect(resolveCutinVisual(fakeScene([YUI_EXPRESSION_RAGE_SHEET.id]), 'berserk')).toEqual({
      textureKey: YUI_EXPRESSION_RAGE_SHEET.id,
      frame: 15,
    });
  });

  it('falls back through ultimate, idle, and null safely', () => {
    expect(resolveCutinVisual(fakeScene([YUI_FRAME_IDS.ultimate]), 'ultimate')).toEqual({
      textureKey: YUI_FRAME_IDS.ultimate,
    });
    expect(resolveCutinVisual(fakeScene([YUI_FRAME_IDS.idle.front]), 'ultimate')).toEqual({
      textureKey: YUI_FRAME_IDS.idle.front,
    });
    expect(resolveCutinVisual(fakeScene([]), 'ultimate')).toBeNull();
  });
});

describe('character cutin copy fallback', () => {
  it('resolves yui ultimate and berserk copy without empty labels', () => {
    for (const mode of ['ultimate', 'berserk'] as const) {
      const copy = resolveCutinCopy(mode, 'yui');

      expect(copy.label).toBeTruthy();
      expect(copy.title).toBeTruthy();
      expect(copy.subtitle).toBeTruthy();
    }
  });

  it('falls back safely for unknown character ids', () => {
    const ultimate = resolveCutinCopy('ultimate', 'missing_character');
    const berserk = resolveCutinCopy('berserk', 'missing_character');

    expect(ultimate.label).toBeTruthy();
    expect(ultimate.title).toBeTruthy();
    expect(ultimate.subtitle).toBeTruthy();
    expect(berserk.label).toBeTruthy();
    expect(berserk.title).toBeTruthy();
    expect(berserk.subtitle).toBeTruthy();
  });
});
