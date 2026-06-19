import type { RuntimeState } from '../runtime';
import { characterById } from '../data/characters';
import { passiveById } from '../data/passives';
import { characterLevelBonus, loadProfile, profileBonuses } from '../persistence/profile';

/** インベントリのパッシブとキャラ基礎値から派生ステータスを再計算する。 */
export function recomputePlayerStats(state: RuntimeState): void {
  const char = characterById.get(state.characterId);
  if (!char) return;
  const base = char.baseStats;
  const profile = loadProfile();
  const permanent = profileBonuses(profile);
  const characterBonus = characterLevelBonus(state.characterId, profile);

  let might = base.might * permanent.mightMultiplier * characterBonus.mightMultiplier;
  let magnet = base.magnetMultiplier * permanent.magnetMultiplier;
  let xpMul = base.xpMultiplier * permanent.xpMultiplier;
  let cooldown = base.cooldownMultiplier;
  let moveMul = permanent.moveSpeedMultiplier;

  for (const owned of state.inventory.passives) {
    const def = passiveById.get(owned.id);
    if (!def) continue;
    const lvl = def.levels[owned.level - 1];
    if (!lvl) continue;
    switch (def.stat) {
      case 'mightMultiplier':
        might *= lvl.value;
        break;
      case 'magnetMultiplier':
        magnet *= lvl.value;
        break;
      case 'xpMultiplier':
        xpMul *= lvl.value;
        break;
      case 'cooldownMultiplier':
        cooldown *= lvl.value;
        break;
      case 'moveSpeedMultiplier':
        moveMul *= lvl.value;
        break;
    }
  }

  state.player.might = might;
  state.player.magnetMultiplier = magnet;
  state.player.xpMultiplier = xpMul;
  state.player.cooldownMultiplier = cooldown;
  state.player.moveSpeed = state.player.baseMoveSpeed * moveMul;
}
