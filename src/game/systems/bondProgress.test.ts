import { describe, expect, it } from 'vitest';
import {
  addBondPoints,
  applyBondEvent,
  bondLevelForPoints,
  emptyBondProgressState,
  getBondEntry,
  markBondTalkSeen,
  pointsToNextBondLevel,
} from './bondProgress';

describe('bondProgress', () => {
  it('ポイントから好感度Lvを計算する', () => {
    expect(bondLevelForPoints(0)).toBe(1);
    expect(bondLevelForPoints(29)).toBe(1);
    expect(bondLevelForPoints(30)).toBe(2);
    expect(bondLevelForPoints(80)).toBe(3);
    expect(bondLevelForPoints(150)).toBe(4);
    expect(bondLevelForPoints(250)).toBe(5);
  });

  it('次Lvまでの必要ポイントを返す', () => {
    expect(pointsToNextBondLevel(0)).toBe(30);
    expect(pointsToNextBondLevel(30)).toBe(50);
    expect(pointsToNextBondLevel(249)).toBe(1);
    expect(pointsToNextBondLevel(250)).toBeNull();
  });

  it('ペアキーは左右順に依存せず、同じペアへ加算される', () => {
    const state = emptyBondProgressState();
    const next = addBondPoints(state, 'yui', 'asa', 20);
    const final = addBondPoints(next, 'asa', 'yui', 15);
    expect(getBondEntry(final, 'yui', 'asa').points).toBe(35);
    expect(getBondEntry(final, 'yui', 'asa').level).toBe(2);
  });

  it('イベント種別ごとに好感度を加算する', () => {
    const state = applyBondEvent(emptyBondProgressState(), 'yui', 'asa', 'stage_clear');
    expect(getBondEntry(state, 'yui', 'asa').points).toBe(8);
  });

  it('同一キャラ同士には加算しない', () => {
    const state = addBondPoints(emptyBondProgressState(), 'yui', 'yui', 999);
    expect(Object.keys(state.pairs)).toHaveLength(0);
  });

  it('会話既読は重複登録しない', () => {
    const state = markBondTalkSeen(emptyBondProgressState(), 'yui', 'asa', 'talk-1');
    const next = markBondTalkSeen(state, 'asa', 'yui', 'talk-1');
    expect(getBondEntry(next, 'yui', 'asa').seenTalkIds).toEqual(['talk-1']);
  });
});
