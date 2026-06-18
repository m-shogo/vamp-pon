import { describe, expect, it } from 'vitest';
import { YUI_GAMEPLAY_FRAME_ASSETS } from '../playerFrames';
import { YUI_EXPRESSION_RAGE_SHEET, isYuiExpressionRageDeferredAsset } from '../yuiExpressionRageSheet';

describe('yuiExpressionRageSheet', () => {
  it('keeps normal gameplay frames in the boot set', () => {
    expect(isYuiExpressionRageDeferredAsset(YUI_GAMEPLAY_FRAME_ASSETS[0].id)).toBe(false);
  });

  it('defines a 48-frame 180px sheet', () => {
    expect(YUI_EXPRESSION_RAGE_SHEET.frameWidth).toBe(180);
    expect(YUI_EXPRESSION_RAGE_SHEET.frameHeight).toBe(180);
    expect(YUI_EXPRESSION_RAGE_SHEET.endFrame).toBe(47);
  });
});
