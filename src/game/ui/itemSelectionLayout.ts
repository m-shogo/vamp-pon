export const LEVEL_UP_PANEL_TOP = 300;
export const LEVEL_UP_HEADER_Y = 326;
export const LEVEL_UP_CARD_WIDTH = 114;
export const LEVEL_UP_CARD_HEIGHT = 280;
export const LEVEL_UP_CARD_GAP = 8;
export const LEVEL_UP_CARD_TOP = 386;
export const LEVEL_UP_REROLL_Y = 354;

export const REPLACE_ROW_WIDTH = 318;
export const REPLACE_ROW_HEIGHT = 62;
export const REPLACE_ROW_GAP = 8;
export const REPLACE_ROW_TOP = 166;
export const REPLACE_ACTION_Y = 778;

export type LevelUpCardPosition = { x: number; y: number };

export function levelUpCardPositions(choiceCount: number, screenWidth = 390): LevelUpCardPosition[] {
  const count = Math.max(0, Math.min(3, choiceCount));
  const totalW = count * LEVEL_UP_CARD_WIDTH + (count - 1) * LEVEL_UP_CARD_GAP;
  const startX = (screenWidth - totalW) / 2 + LEVEL_UP_CARD_WIDTH / 2;
  return Array.from({ length: count }, (_, index) => ({
    x: startX + index * (LEVEL_UP_CARD_WIDTH + LEVEL_UP_CARD_GAP),
    y: LEVEL_UP_CARD_TOP + LEVEL_UP_CARD_HEIGHT / 2,
  }));
}

/** 既存の参照用。横位置は全カードで画面中央。 */
export function levelUpCardCenters(choiceCount: number, screenWidth = 390): number[] {
  return levelUpCardPositions(choiceCount, screenWidth).map((position) => position.x);
}

export function replaceRowCenters(itemCount: number): number[] {
  return Array.from(
    { length: Math.max(0, itemCount) },
    (_, index) => REPLACE_ROW_TOP + REPLACE_ROW_HEIGHT / 2 + index * (REPLACE_ROW_HEIGHT + REPLACE_ROW_GAP),
  );
}

/** 日本語を含むUI文を固定行数へ収め、カード内テキストの重なりを防ぐ。 */
export function wrapUiText(text: string, charsPerLine: number, maxLines: number): string {
  const normalized = text
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized || charsPerLine <= 0 || maxLines <= 0) return '';

  const characters = Array.from(normalized);
  const lines: string[] = [];
  let offset = 0;

  while (offset < characters.length && lines.length < maxLines) {
    const remainingLines = maxLines - lines.length;
    const remainingCharacters = characters.length - offset;
    const take = remainingLines === 1 && remainingCharacters > charsPerLine
      ? Math.max(1, charsPerLine - 1)
      : Math.min(charsPerLine, remainingCharacters);
    let end = offset + take;
    if (end < characters.length && remainingLines > 1) {
      const preferred = findPreferredBreak(characters, offset, end, Math.max(4, Math.floor(charsPerLine * 0.55)));
      if (preferred > offset) end = preferred;
    }
    let line = characters.slice(offset, end).join('').trim();
    offset = end;
    while (characters[offset] === ' ') offset += 1;
    if (lines.length === maxLines - 1 && offset < characters.length) line += '…';
    lines.push(line);
  }

  return lines.join('\n');
}

function findPreferredBreak(characters: string[], start: number, hardEnd: number, minWidth: number): number {
  for (let i = hardEnd; i > start + minWidth; i -= 1) {
    const prev = characters[i - 1];
    const current = characters[i];
    if (prev === ' ' || prev === '。' || prev === '、' || prev === '／' || prev === '/') return i;
    if (current === ' ' || current === '。' || current === '、') return i + 1;
  }
  return hardEnd;
}
