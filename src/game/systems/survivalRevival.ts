import type { RareItemDefinition } from '../domain/types';
import { GAME_STATUS, PLAYER_DEFAULTS } from '../domain/constants';
import type { RuntimeState } from '../runtime';
import { rareItemById } from '../data/rareItems';

export const SURVIVAL_REVIVAL_HP_RATIO = 0.3;
export const SURVIVAL_REVIVAL_INVULN_SEC = 1.25;

export type SurvivalRevivalResult = {
  itemId: string;
  hpRestored: number;
};

type RareRegistry = Pick<Map<string, RareItemDefinition>, 'get'>;

function survivalRevivalDef(
  state: RuntimeState,
  registry: RareRegistry,
): { id: string; def: RareItemDefinition } | null {
  for (const item of state.inventory.rareItems) {
    const def = registry.get(item.id);
    if (def?.role === 'survival_revival') return { id: item.id, def };
  }
  return null;
}

/**
 * Consumes a survival revival rare item and restores the player.
 *
 * This hook is only for the HP0 pre-GAMEOVER path. Do not use it to rewind a
 * state that has already committed GAMEOVER/result transitions.
 */
export function tryConsumeSurvivalRevival(
  state: RuntimeState,
  registry: RareRegistry = rareItemById,
): SurvivalRevivalResult | null {
  const revival = survivalRevivalDef(state, registry);
  if (!revival) return null;

  const player = state.player;
  const hpRestored = Math.max(1, Math.ceil(player.maxHp * SURVIVAL_REVIVAL_HP_RATIO));
  state.inventory.rareItems = state.inventory.rareItems.filter((item) => item.id !== revival.id);
  player.hp = Math.min(player.maxHp, hpRestored);
  player.invulnRemaining = Math.max(player.invulnRemaining, SURVIVAL_REVIVAL_INVULN_SEC);
  player.flashRemaining = Math.max(player.flashRemaining, PLAYER_DEFAULTS.invulnSec);
  state.status = GAME_STATUS.PLAYING;

  return {
    itemId: revival.id,
    hpRestored: player.hp,
  };
}
