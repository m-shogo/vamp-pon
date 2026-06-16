import { describe, expect, it } from 'vitest';
import {
  LEVEL_UP_CARD_HEIGHT,
  LEVEL_UP_CARD_TOP,
  LEVEL_UP_FOOTER_HINT_Y,
  LEVEL_UP_REROLL_Y,
  REPLACE_ACTION_Y,
  REPLACE_ROW_HEIGHT,
  REPLACE_ROW_TOP,
  levelUpCardCenters,
  replaceRowCenters,
  wrapUiText,
} from '../itemSelectionLayout';

describe('item selection layout', () => {
  it('3枚のレベルアップカードがヘッダーとフッターの間に収まる', () => {
    const centers = levelUpCardCenters(3);
    expect(centers).toHaveLength(3);
    expect(centers[0] - LEVEL_UP_CARD_HEIGHT / 2).toBe(LEVEL_UP_CARD_TOP);
    expect(centers[2] + LEVEL_UP_CARD_HEIGHT / 2).toBeLessThan(LEVEL_UP_FOOTER_HINT_Y - 20);
    expect(LEVEL_UP_FOOTER_HINT_Y).toBeLessThan(LEVEL_UP_REROLL_Y);
  });

  it('最大5件の入れ替え候補が操作ボタンより上に収まる', () => {
    const centers = replaceRowCenters(5);
    expect(centers).toHaveLength(5);
    expect(centers[0] - REPLACE_ROW_HEIGHT / 2).toBe(REPLACE_ROW_TOP);
    expect(centers[4] + REPLACE_ROW_HEIGHT / 2).toBeLessThan(REPLACE_ACTION_Y - 80);
  });

  it('長文を最大行数へ収め、末尾を省略する', () => {
    const wrapped = wrapUiText('これは非常に長いアイテム説明でカードの外にはみ出してはいけません', 10, 2);
    const lines = wrapped.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0].length).toBeLessThanOrEqual(10);
    expect(lines[1].length).toBeLessThanOrEqual(10);
    expect(lines[1].endsWith('…')).toBe(true);
  });

  it('短文は不要な改行や省略を加えない', () => {
    expect(wrapUiText('短い説明', 10, 2)).toBe('短い説明');
  });
});
