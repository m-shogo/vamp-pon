import type Phaser from 'phaser';
import type { RuntimeState, PickupRuntime, CapsuleRuntime } from '../runtime';
import { nextIid } from '../runtime';
import { PICKUP, GAME_STATUS } from '../domain/constants';
import { distance, normalize } from '../utils/math';
import { addXp } from './xp';
import { generateCapsuleReward } from './capsule';
import { createPickupView, createHealPickupView, createCapsuleView } from '../ui/factory';
import { collectSpark } from '../ui/effects';

const CAPSULE_RADIUS = 14;

export function spawnFragment(scene: Phaser.Scene, state: RuntimeState, x: number, y: number, xp: number): void {
  const view = createPickupView(scene);
  view.setPosition(x, y);
  const p: PickupRuntime = {
    iid: nextIid(state),
    x,
    y,
    kind: 'fragment',
    xp,
    heal: 0,
    magnetized: false,
    view,
    dead: false,
  };
  state.pickups.push(p);
}

export function spawnHealPickup(scene: Phaser.Scene, state: RuntimeState, x: number, y: number, heal: number): void {
  const view = createHealPickupView(scene);
  view.setPosition(x, y);
  const p: PickupRuntime = {
    iid: nextIid(state),
    x,
    y,
    kind: 'heal',
    xp: 0,
    heal,
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

/** 欠片は吸引、回復は任意タイミングで拾う。カプセル取得も処理する。 */
export function updatePickups(scene: Phaser.Scene, state: RuntimeState, dt: number): void {
  const p = state.player;
  const magnetRange = PICKUP.magnetRange * p.magnetMultiplier;

  for (const pickup of state.pickups) {
    if (pickup.dead) continue;
    const d = distance(pickup.x, pickup.y, p.x, p.y);

    if (pickup.kind === 'heal') {
      // 回復は「あとで拾う」判断ができるように吸引しない。
      // HP満タン時に触れても消費しない。
      if (p.hp < p.maxHp && d <= PICKUP.collectRadius) {
        p.hp = Math.min(p.maxHp, p.hp + pickup.heal);
        pickup.dead = true;
        pickup.view.destroy();
        collectSpark(scene, p.x, p.y);
      }
      continue;
    }

    if (d <= PICKUP.collectRadius) {
      addXp(state, pickup.xp);
      state.stats.memoryFragmentsCollected += 1;
      pickup.dead = true;
      pickup.view.destroy();
      collectSpark(scene, p.x, p.y);
      continue;
    }
    if (pickup.magnetized || d <= magnetRange) {
      pickup.magnetized = true;
      const dir = normalize(p.x - pickup.x, p.y - pickup.y);
      pickup.x += dir.x * PICKUP.magnetSpeed * dt;
      pickup.y += dir.y * PICKUP.magnetSpeed * dt;
      pickup.view.setPosition(pickup.x, pickup.y);
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
      if (state.telemetry.firstCapsuleSec === null) state.telemetry.firstCapsuleSec = state.elapsedSec;
      state.pendingCapsule = generateCapsuleReward(state);
      state.status = GAME_STATUS.CAPSULE;
      break;
    }
  }
  state.capsules = state.capsules.filter((c) => !c.dead);
}
