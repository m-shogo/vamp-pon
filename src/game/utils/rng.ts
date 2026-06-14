import type { DirectionWeights } from '../domain/types';

export function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randInt(min: number, max: number): number {
  return Math.floor(randRange(min, max + 1));
}

/** 重み付き抽選。entriesは [item, weight] の配列。 */
export function weightedPick<T>(entries: Array<[T, number]>): T | null {
  const total = entries.reduce((sum, [, w]) => sum + Math.max(0, w), 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (const [item, weight] of entries) {
    roll -= Math.max(0, weight);
    if (roll <= 0) return item;
  }
  return entries[entries.length - 1]?.[0] ?? null;
}

/** directionWeightsから方向キーを1つ選ぶ。 */
export function pickDirection(weights: DirectionWeights): keyof DirectionWeights {
  const entries = Object.entries(weights) as Array<[keyof DirectionWeights, number]>;
  const picked = weightedPick(entries.map(([k, w]) => [k, w] as [keyof DirectionWeights, number]));
  return picked ?? 'around';
}

/** 配列から重複なしでn個を選ぶ（破壊しない）。 */
export function sampleWithoutReplacement<T>(items: T[], n: number): T[] {
  const pool = [...items];
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const idx = randInt(0, pool.length - 1);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}
