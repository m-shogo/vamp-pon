import { describe, expect, it } from 'vitest';
import { YUI_FRAME_IDS } from '../../assets/playerFrames';
import { resolveFacing, resolveYuiFrame } from '../playerVisual';

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
      facing: 'right',
      moving: false,
      walkFrame: 0,
      hurt: false,
      ultimate: false,
    })).toBe(YUI_FRAME_IDS.idle.right);
  });

  it('移動時は向き別walkのA/Bを返す', () => {
    expect(resolveYuiFrame({
      facing: 'back',
      moving: true,
      walkFrame: 0,
      hurt: false,
      ultimate: false,
    })).toBe(YUI_FRAME_IDS.walk.back[0]);
    expect(resolveYuiFrame({
      facing: 'back',
      moving: true,
      walkFrame: 1,
      hurt: false,
      ultimate: false,
    })).toBe(YUI_FRAME_IDS.walk.back[1]);
  });

  it('被弾はidleとwalkより優先される', () => {
    expect(resolveYuiFrame({
      facing: 'left',
      moving: true,
      walkFrame: 1,
      hurt: true,
      ultimate: false,
    })).toBe(YUI_FRAME_IDS.hurt.left);
  });

  it('奥義はすべての表示状態より優先される', () => {
    expect(resolveYuiFrame({
      facing: 'front',
      moving: true,
      walkFrame: 1,
      hurt: true,
      ultimate: true,
    })).toBe(YUI_FRAME_IDS.ultimate);
  });
});
