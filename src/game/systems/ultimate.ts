import type Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { characterById } from '../data/characters';
import { enemyById } from '../data/enemies';
import { COLORS } from '../domain/constants';
import { distance } from '../utils/math';
import { damageEnemy } from './enemies';
import { spawnFragment } from './pickups';
import { ultimateFlash } from '../ui/effects';
import { playCharacterCutin } from '../ui/characterCutin';
import { updatePlayerVisual } from '../ui/playerVisual';
import { requestYuiExpressionRageSheet } from '../assets/yuiExpressionRageSheet';

const ULTIMATE_POSE_SEC = 0.48;

/** 必殺技ゲージの充填と発動。黒耀ゲージとは完全に独立。 */
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

function activateUltimate(scene: Phaser.Scene, state: RuntimeState): void {
  const char = characterById.get(state.characterId);
  if (!char) return;
  const eff = char.ultimate.effect;
  const p = state.player;

  for (const frag of state.pickups) {
    frag.magnetized = true;
  }

  for (const e of state.enemies) {
    if (e.dead) continue;
    const def = enemyById.get(e.defId);
    const isSmall = def?.tags.includes('small') ?? false;
    if (eff.smallEnemyOnly && !isSmall) continue;
    if (distance(e.x, e.y, p.x, p.y) <= eff.radius) {
      const willDie = e.hp <= eff.damage;
      damageEnemy(scene, state, e, eff.damage);
      if (willDie && eff.dropBonus) {
        spawnFragment(scene, state, e.x, e.y, eff.dropBonus);
      }
    }
  }

  ultimateFlash(scene);
  playCharacterCutin(scene, 'ultimate');
  const ring = scene.add.circle(p.x, p.y, eff.radius, COLORS.ultReady, 0.3).setDepth(35);
  ring.setScale(0.1);
  scene.tweens.add({
    targets: ring,
    scale: 1,
    alpha: 0,
    duration: 420,
    onComplete: () => ring.destroy(),
  });
}
