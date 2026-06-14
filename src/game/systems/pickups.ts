import type Phaser from 'phaser';
import type { RuntimeState, PickupRuntime, CapsuleRuntime } from '../runtime';
import { nextIid } from '../runtime';
import { PICKUP, GAME_STATUS } from '../domain/constants';
import { distance, normalize } from '../utils/math';
import { addXp } from './xp';
import { generateCapsuleReward } from './capsule';
import { createPickupView, createCapsuleView } from '../ui/factory';

const CAPSULE_RADIUS = 14;

export function spawnFragment(scene: Phaser.Scene, state: RuntimeState, x: number, y: number, xp: number): void {
  const view = createPickupView(scene);
  view.setPosition(x, y);
  const p: PickupRuntime = {
    iid: nextIid(state),
    x,
    y,
    xp,
    magnetized: false,
    view,
    dead: false,
  };
  state.pickups.push(p);
}

export function spawnCapsule(scene: Phaser.Scene, state: RuntimeState, x: number, y: number): void {
  const view = createCapsuleView(scene);
  view.setPosition(x, y);
  const c: CapsuleRuntime = {
    iid: nextIid(state),
    x,
    y,
    view,
    dead: false,
  };
  state.capsules.push(c);
}

/** 欠片の吸引・取得とカプセル取得を処理する。 */
export function updatePickups(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  const p = state.player;
  const magnetRange = PICKUP.magnetRange * p.magnetMultiplier;

  for (const frag of state.pickups) {
    if (frag.dead) continue;
    const d = distance(frag.x, frag.y, p.x, p.y);
    if (d <= PICKUP.collectRadius) {
      addXp(state, frag.xp);
      state.stats.memoryFragmentsCollected += 1;
      frag.dead = true;
      frag.view.destroy();
      continue;
    }
    if (frag.magnetized || d <= magnetRange) {
      frag.magnetized = true;
      const dir = normalize(p.x - frag.x, p.y - frag.y);
      frag.x += dir.x * PICKUP.magnetSpeed * dt;
      frag.y += dir.y * PICKUP.magnetSpeed * dt;
      frag.view.setPosition(frag.x, frag.y);
    }
  }
  state.pickups = state.pickups.filter((f) => !f.dead);

  // カプセル取得
  for (const cap of state.capsules) {
    if (cap.dead) continue;
    const d = distance(cap.x, cap.y, p.x, p.y);
    if (d <= p.radius + CAPSULE_RADIUS) {
      cap.dead = true;
      cap.view.destroy();
      state.pendingCapsule = generateCapsuleReward(state);
      state.status = GAME_STATUS.CAPSULE;
      break;
    }
  }
  state.capsules = state.capsules.filter((c) => !c.dead);
  void scene;
}
