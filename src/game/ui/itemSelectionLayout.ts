export const LEVEL_UP_PANEL_TOP = 520;
export const LEVEL_UP_HEADER_Y = 544;
export const LEVEL_UP_CARD_WIDTH = 116;
export const LEVEL_UP_CARD_HEIGHT = 252;
export const LEVEL_UP_CARD_GAP = 6;
export const LEVEL_UP_CARD_CENTER_Y = 704;
export const LEVEL_UP_REROLL_Y = 510;

export const REPLACE_ROW_WIDTH = 318;
export const REPLACE_ROW_HEIGHT = 62;
export const REPLACE_ROW_GAP = 8;
export const REPLACE_ROW_TOP = 166;
export const REPLACE_ACTION_Y = 778;

export function levelUpCardCenters(choiceCount: number, screenWidth = 390): number[] {
  const count = Math.max(0, Math.min(3, choiceCount));
  const totalWidth = count * LEVEL_UP_CARD_WIDTH + Math.max(0, count - 1) * LEVEL_UP_CARD_GAP;
  const start = (screenWidth - totalWidth) / 2 + LEVEL_UP_CARD_WIDTH / 2;
  return Array.from({ length: count }, (_, index) => start + index * (LEVEL_UP_CARD_WIDTH + LEVEL_UP_CARD_GAP));
}

export function replaceRowCenters(itemCount: number): number[] {
  return Array.from(
    { length: Math.max(0, itemCount) },
    (_, index) => REPLACE_ROW_TOP + REPLACE_ROW_HEIGHT / 2 + index * (REPLACE_ROW_HEIGHT + REPLACE_ROW_GAP),
  );
}

/** 日本語を含むUI文を固定行数へ収め、カード内テキストの重なりを防ぐ。 */
export function wrapUiText(text: string, charsPerLine: number, maxLines: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
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
    let line = characters.slice(offset, offset + take).join('');
    offset += take;
    if (lines.length === maxLines - 1 && offset < characters.length) line += '…';
    lines.push(line);
  }

  return lines.join('\n');
}
