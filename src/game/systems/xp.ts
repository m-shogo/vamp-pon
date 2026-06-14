import type { RuntimeState } from '../runtime';
import { xpToNext } from '../domain/balance';

/** 欠片取得などでXPを加算する（xpMultiplierを反映）。 */
export function addXp(state: RuntimeState, rawAmount: number): void {
  state.player.xp += rawAmount * state.player.xpMultiplier;
  state.stats.xpCollected += rawAmount;
}

export function hasPendingLevelUp(state: RuntimeState): boolean {
  return state.player.xp >= state.player.xpToNext;
}

/** 1レベル分を消費して昇格する。残りXPは持ち越す。 */
export function advanceLevel(state: RuntimeState): void {
  state.player.xp -= state.player.xpToNext;
  if (state.player.xp < 0) state.player.xp = 0;
  state.player.level += 1;
  state.player.xpToNext = xpToNext(state.player.level);
  state.stats.levelUps += 1;
}
