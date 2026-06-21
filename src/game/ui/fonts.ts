export const BODY_FONT = '"VampPon UI", "M PLUS Rounded 1c", system-ui, sans-serif';
export const TITLE_FONT = '"VampPon Title", "VampPon UI", "M PLUS Rounded 1c", system-ui, sans-serif';
export const NUMBER_FONT = BODY_FONT;

export async function loadGameFonts(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`400 16px ${BODY_FONT}`),
      document.fonts.load(`500 16px ${BODY_FONT}`),
      document.fonts.load(`700 16px ${BODY_FONT}`),
      document.fonts.load(`700 24px ${TITLE_FONT}`),
      document.fonts.load(`700 14px ${NUMBER_FONT}`),
    ]);
  } catch {
    // フォント読み込みは可読性改善用。失敗してもゲーム起動は止めない。
  }
}
