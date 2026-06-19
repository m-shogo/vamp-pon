import { describe, expect, it } from 'vitest';
import { YUI_FRAME_IDS } from '../../assets/playerFrames';
import { YUI_EXPRESSION_RAGE_SHEET, YUI_RAGE_SHEET_FRAME } from '../../assets/yuiExpressionRageSheet';
import { resolveFacing, resolveYuiFrame, resolveYuiVisualFrame } from '../playerVisual';

const visualBase = {
  facing: 'front' as const,
  moving: false,
  walkFrame: 0 as const,
  hurt: false,
  ultimate: false,
  berserkCharge: 0,
  berserkMaxCharge: 100,
  berserkReady: false,
  berserkDurationSec: 8,
  berserkActiveRemaining: 0,
  berserkFatigueRemaining: 0,
};

describe('resolveFacing', () => {
  it('無入力では現在方向を維持する', () => {
    expect(resolveFacing('left', 0, 0)).toBe('left');
  });

  it('横入力が強い時は左右を選ぶ', () => {
    expect(resolveFacing('front', -1, 0.2)).toBe('left');
    expect(resolveFacing('front', 1, 0.2)).toBe('right');
  });

  it('縦入力が強い時は上下を前後へ対応させる', () => {
    expect(resolveFacing('front', 0.1, -1)).toBe('back');
    expect(resolveFacing('back', 0.1, 1)).toBe('front');
  });
});

describe('resolveYuiFrame', () => {
  it('停止時は向き別idleを返す', () => {
    expect(resolveYuiFrame({
      facing: 'right', moving: false, walkFrame: 0, hurt: false, ultimate: false,
    })).toBe(YUI_FRAME_IDS.idle.right);
  });

  it('移動時は向き別walkのA/Bを返す', () => {
    expect(resolveYuiFrame({
      facing: 'left', moving: true, walkFrame: 0, hurt: false, ultimate: false,
    })).toBe(YUI_FRAME_IDS.walk.left[0]);
    expect(resolveYuiFrame({
      facing: 'right', moving: true, walkFrame: 0, hurt: false, ultimate: false,
    })).toBe(YUI_FRAME_IDS.walk.right[0]);
    expect(resolveYuiFrame({
      facing: 'back', moving: true, walkFrame: 0, hurt: false, ultimate: false,
    })).toBe(YUI_FRAME_IDS.walk.back[0]);
    expect(resolveYuiFrame({
      facing: 'back', moving: true, walkFrame: 1, hurt: false, ultimate: false,
    })).toBe(YUI_FRAME_IDS.walk.back[1]);
  });

  it('被弾はidleとwalkより優先される', () => {
    expect(resolveYuiFrame({
      facing: 'left', moving: true, walkFrame: 1, hurt: true, ultimate: false,
    })).toBe(YUI_FRAME_IDS.hurt.left);
  });

  it('奥義はすべての通常表示状態より優先される', () => {
    expect(resolveYuiFrame({
      facing: 'front', moving: true, walkFrame: 1, hurt: true, ultimate: true,
    })).toBe(YUI_FRAME_IDS.ultimate);
  });
});

describe('resolveYuiVisualFrame', () => {
  it('暴走ゲージ段階をsheet frameへ対応させる', () => {
    expect(resolveYuiVisualFrame({ ...visualBase, berserkCharge: 25 })).toEqual({
      textureKey: YUI_EXPRESSION_RAGE_SHEET.id,
      frame: YUI_RAGE_SHEET_FRAME.charge25,
    });
    expect(resolveYuiVisualFrame({ ...visualBase, berserkCharge: 75 })).toEqual({
      textureKey: YUI_EXPRESSION_RAGE_SHEET.id,
      frame: YUI_RAGE_SHEET_FRAME.charge75,
    });
  });

  it('発動直後はうずくまりから変身ピークへ進む', () => {
    expect(resolveYuiVisualFrame({ ...visualBase, berserkActiveRemaining: 7.9 })).toMatchObject({
      frame: YUI_RAGE_SHEET_FRAME.triggerCrouch,
    });
    expect(resolveYuiVisualFrame({ ...visualBase, berserkActiveRemaining: 7.7 })).toMatchObject({
      frame: YUI_RAGE_SHEET_FRAME.transformPeak,
    });
  });

  it('暴走移動は向き別A/B frameを返す', () => {
    expect(resolveYuiVisualFrame({
      ...visualBase,
      facing: 'left',
      moving: true,
      walkFrame: 1,
      berserkActiveRemaining: 6,
    })).toEqual({
      textureKey: YUI_EXPRESSION_RAGE_SHEET.id,
      frame: YUI_RAGE_SHEET_FRAME.walk.left[1],
    });
    expect(resolveYuiVisualFrame({
      ...visualBase,
      facing: 'right',
      moving: true,
      walkFrame: 1,
      berserkActiveRemaining: 6,
    })).toEqual({
      textureKey: YUI_EXPRESSION_RAGE_SHEET.id,
      frame: YUI_RAGE_SHEET_FRAME.walk.right[1],
    });
  });

  it('終了直前と疲労を専用frameへ対応させる', () => {
    expect(resolveYuiVisualFrame({ ...visualBase, berserkActiveRemaining: 0.4 })).toMatchObject({
      frame: YUI_RAGE_SHEET_FRAME.collapse,
    });
    expect(resolveYuiVisualFrame({ ...visualBase, berserkFatigueRemaining: 0.5 })).toMatchObject({
      frame: YUI_RAGE_SHEET_FRAME.recoverySlow,
    });
  });
});
