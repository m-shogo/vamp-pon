import { describe, expect, it } from 'vitest';
import { pairKey } from '../data/characterRelationshipDesign';
import type { BondProgressState } from './bondProgress';
import { bondTalkUnlocks, nextUnreadBondTalkId } from './bondTalkUnlocks';

describe('bondTalkUnlocks', () => {
  it('同一キャラなら会話を返さない', () => {
    expect(bondTalkUnlocks('yui', 'yui', { pairs: {} })).toEqual([]);
  });

  it('Lv1なら日常会話1だけ解放する', () => {
    const progress: BondProgressState = {
      pairs: {
        [pairKey('yui', 'asa')]: {
          pairKey: pairKey('yui', 'asa'),
          points: 0,
          level: 1,
          seenTalkIds: [],
        },
      },
    };
    const talks = bondTalkUnlocks('yui', 'asa', progress);
    expect(talks.map((talk) => talk.unlocked)).toEqual([true, false, false]);
    expect(talks[0].important).toBe(true);
    expect(nextUnreadBondTalkId('yui', 'asa', progress)).toBe(talks[0].id);
  });

  it('既読なら次の未読を返す', () => {
    const key = pairKey('yui', 'asa');
    const progress: BondProgressState = {
      pairs: {
        [key]: {
          pairKey: key,
          points: 80,
          level: 3,
          seenTalkIds: [`${key}:talk:1`],
        },
      },
    };
    expect(nextUnreadBondTalkId('yui', 'asa', progress)).toBe(`${key}:talk:2`);
  });

  it('Lv5なら特別編まで解放する', () => {
    const progress: BondProgressState = {
      pairs: {
        [pairKey('michiru', 'nagi')]: {
          pairKey: pairKey('michiru', 'nagi'),
          points: 250,
          level: 5,
          seenTalkIds: [],
        },
      },
    };
    expect(bondTalkUnlocks('michiru', 'nagi', progress).map((talk) => talk.unlocked)).toEqual([true, true, true]);
  });
});
