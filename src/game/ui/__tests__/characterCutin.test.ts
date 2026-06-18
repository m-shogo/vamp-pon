import { describe, expect, it } from 'vitest';
import { YUI_FRAME_IDS } from '../../assets/playerFrames';
import { YUI_EXPRESSION_RAGE_SHEET } from '../../assets/yuiExpressionRageSheet';
import { CHARACTER_CUTIN_TEXTURE, resolveCutinVisual } from '../characterCutin';

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
