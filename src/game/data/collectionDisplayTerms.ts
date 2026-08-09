export const LEGACY_KEEPER_HEADER = '灯名・黒曜・朝明・欠けた心を、絵札として残す頁。';
export const CURRENT_KEEPER_HEADER = '灯名・黒耀化・朝明・欠けた心を、絵札として残す頁。';

export function normalizeCollectionDisplayTerm(value: string): string {
  return value === LEGACY_KEEPER_HEADER ? CURRENT_KEEPER_HEADER : value;
}
