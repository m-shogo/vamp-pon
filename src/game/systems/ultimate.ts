import type Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { characterById } from '../data/characters';
import { enemyById } from '../data/enemies';
import { COLORS } from '../domain/constants';
import { num, type EffectValues } from '../domain/weaponEffect';
import { distance } from '../utils/math';
import { damageEnemy } from './enemies';
import { spawnFragment } from './pickups';
import { ultimateFlash } from '../ui/effects';
import { playCharacterCutin } from '../ui/characterCutin';
import { updatePlayerVisual } from '../ui/playerVisual';
import { requestYuiExpressionRageSheet } from '../assets/yuiExpressionRageSheet';
import { getAudioManager } from '../audio/AudioManager';
import { getEffectManager } from '../effects/EffectManager';
import { loadBondProgress } from '../persistence/bonds';
import { getBondEntry, pairUltimateForBond } from './bondProgress';

const ULTIMATE_POSE_SEC = 0.48;

/** 必殺技ゲージの充填と発動。黒曜ゲージとは完全に独立。 */
export function updateUltimate(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  const ult = state.ultimate;

  if (state.characterId === 'yui' && (state.berserk?.charge ?? 0) > 0) {
    requestYuiExpressionRageSheet(scene);
  }

  if (ult.activeRemaining > 0) {
    ult.activeRemaining = Math.max(0, ult.activeRemaining - dt);
  }

  if (!ult.ready) {
    ult.charge += dt;
    if (ult.charge >= ult.chargeSeconds) {
      ult.charge = ult.chargeSeconds;
      ult.ready = true;
    }
  }

  if (state.ultimateRequested) {
    state.ultimateRequested = false;
    const berserkActive = (state.berserk?.activeRemaining ?? 0) > 0;
    if (ult.ready && !berserkActive) {
      activateUltimate(scene, state);
      ult.ready = false;
      ult.charge = 0;
      ult.activeRemaining = ULTIMATE_POSE_SEC;
      state.stats.ultimateUses += 1;
    }
  }

  updatePlayerVisual(state);
}

function currentPairUltimate(state: RuntimeState) {
  if (!state.subCharacterId || state.subCharacterId === state.characterId) return null;
  const bondProgress = loadBondProgress();
  const entry = getBondEntry(bondProgress, state.characterId, state.subCharacterId);
  return pairUltimateForBond(state.characterId, state.subCharacterId, entry.level);
}

function activateUltimate(scene: Phaser.Scene, state: RuntimeState): void {
  const char = characterById.get(state.characterId);
  if (!char) return;
  const eff = char.ultimate.effect as EffectValues;
  const pairUltimate = currentPairUltimate(state);
  const p = state.player;
  const radius = num(eff, 'radius', 240) * (pairUltimate ? 1.18 : 1);
  const damage = num(eff, 'damage', 18) * (pairUltimate ? 1.25 : 1);
  const dropBonus = num(eff, 'dropBonus', 0) + (pairUltimate ? 2 : 0);

  if (pairUltimate) state.stats.pairUltimateUses += 1;

  for (const frag of state.pickups) {
    frag.magnetized = true;
  }

  for (const e of state.enemies) {
    if (e.dead) continue;
    const def = enemyById.get(e.defId);
    const isSmall = def?.tags.includes('small') ?? false;
    if (eff.smallEnemyOnly === true && !isSmall) continue;
    if (distance(e.x, e.y, p.x, p.y) <= radius) {
      const willDie = e.hp <= damage;
      damageEnemy(scene, state, e, damage);
      if (willDie && dropBonus > 0) {
        spawnFragment(scene, state, e.x, e.y, dropBonus);
      }
    }
  }

  ultimateFlash(scene);
  getAudioManager(scene).playSe('ultimate_cut_in', { volume: pairUltimate ? 0.7 : 0.58, priority: 2 });
  scene.time.delayedCall(55, () => {
    getAudioManager(scene).playSe('ultimate_fire', { volume: pairUltimate ? 0.78 : 0.66, priority: 3 });
  });
  getAudioManager(scene).duckBgm(pairUltimate ? 480 : 360, pairUltimate ? 0.28 : 0.35);
  getEffectManager(scene).ultimateFlash();
  playCharacterCutin(scene, 'ultimate');
  const ring = scene.add.circle(p.x, p.y, radius, pairUltimate ? STORYBOOK_PAIR_ULTIMATE_COLOR : COLORS.ultReady, pairUltimate ? 0.42 : 0.3).setDepth(35);
  ring.setScale(0.1);
  scene.tweens.add({
    targets: ring,
    scale: 1,
    alpha: 0,
    duration: pairUltimate ? 520 : 420,
    onComplete: () => ring.destroy(),
  });
}

const STORYBOOK_PAIR_ULTIMATE_COLOR = 0xf7c86a;
