import type Phaser from 'phaser';
import type { RuntimeState, PickupRuntime, CapsuleRuntime } from '../runtime';
import { nextIid } from '../runtime';
import { PICKUP, GAME_STATUS } from '../domain/constants';
import { distance, normalize } from '../utils/math';
import { addXp } from './xp';
import { generateCapsuleReward } from './capsule';
import { createPickupView, createHealPickupView, createCapsuleView } from '../ui/factory';
import { collectSpark } from '../ui/effects';
import { recordHealCollected } from './runCollectionMetrics';
import { getAudioManager } from '../audio/AudioManager';
import { getEffectManager } from '../effects/EffectManager';

const CAPSULE_RADIUS = 14;
const CLOSE_MAGNET_RANGE_RATIO = 0.55;
const CLOSE_MAGNET_SPEED_MULTIPLIER = 1.18;
const XP_DENSE_PICKUP_COUNT = 70;
const XP_VERY_DENSE_PICKUP_COUNT = 120;
const XP_BASE_SCALE = 0.72;
const XP_ATTRACTING_SCALE = 0.76;
const XP_FAR_DENSE_SCALE = 0.66;
const XP_FAR_VERY_DENSE_SCALE = 0.62;
const XP_FAR_DENSE_ALPHA = 0.76;
const XP_FAR_VERY_DENSE_ALPHA = 0.64;
const XP_VISIBILITY_SCALE_DELAY_MS = 130;

export function spawnFragment(scene: Phaser.Scene, state: RuntimeState, x: number, y: number, xp: number): void {
  const view = createPickupView(scene);
  view.setPosition(x, y);
  view.setScale(XP_BASE_SCALE);
  view.setData('xpSpawnedAtMs', scene.time.now);
  scene.tweens.add({
    targets: view,
    y: y - 8,
    scale: 1.08,
    duration: 90,
    yoyo: true,
    ease: 'Quad.easeOut',
  });
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
  const activeXpPickups = state.pickups.filter((pickup) => !pickup.dead && pickup.kind === 'fragment').length;

  for (const pickup of state.pickups) {
    if (pickup.dead) continue;
    const d = distance(pickup.x, pickup.y, p.x, p.y);

    if (pickup.kind === 'heal') {
      // 回復は「あとで拾う」判断ができるように吸引しない。
      // HP満タン時に触れても消費しない。
      if (p.hp < p.maxHp && d <= PICKUP.collectRadius) {
        p.hp = Math.min(p.maxHp, p.hp + pickup.heal);
        recordHealCollected(state.stats);
        pickup.dead = true;
        pickup.view.destroy();
        getAudioManager(scene).playSe('heal_pickup', { volume: 0.55 });
        getEffectManager(scene).heal(p.x, p.y);
        collectSpark(scene, p.x, p.y);
      }
      continue;
    }

    if (d <= PICKUP.collectRadius) {
      addXp(state, pickup.xp);
      state.stats.memoryFragmentsCollected += 1;
      pickup.dead = true;
      pickup.view.destroy();
      getAudioManager(scene).playExpCollect();
      getEffectManager(scene).expCollect(pickup.x, pickup.y, p.x, p.y);
      collectSpark(scene, p.x, p.y);
      continue;
    }
    if (pickup.magnetized || d <= magnetRange) {
      pickup.magnetized = true;
      const dir = normalize(p.x - pickup.x, p.y - pickup.y);
      const speedMultiplier = d <= magnetRange * CLOSE_MAGNET_RANGE_RATIO ? CLOSE_MAGNET_SPEED_MULTIPLIER : 1;
      pickup.x += dir.x * PICKUP.magnetSpeed * speedMultiplier * dt;
      pickup.y += dir.y * PICKUP.magnetSpeed * speedMultiplier * dt;
      pickup.view.setPosition(pickup.x, pickup.y);
    }
    updateXpPickupVisibility(scene, pickup, d, magnetRange, activeXpPickups);
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
      getAudioManager(scene).playSe('capsule_open', { volume: 0.58, priority: 1 });
      break;
    }
  }
  state.capsules = state.capsules.filter((c) => !c.dead);
}

function updateXpPickupVisibility(
  scene: Phaser.Scene,
  pickup: PickupRuntime,
  distanceToPlayer: number,
  magnetRange: number,
  activeXpPickups: number,
): void {
  if (pickup.kind !== 'fragment') return;

  const far = !pickup.magnetized && distanceToPlayer > magnetRange;
  const veryDense = activeXpPickups >= XP_VERY_DENSE_PICKUP_COUNT;
  const dense = activeXpPickups >= XP_DENSE_PICKUP_COUNT;

  const spawnedAtMs = pickup.view.getData('xpSpawnedAtMs') as number | undefined;
  const canAdjustScale = spawnedAtMs == null || scene.time.now - spawnedAtMs >= XP_VISIBILITY_SCALE_DELAY_MS;

  if (far && veryDense) {
    pickup.view.setAlpha(XP_FAR_VERY_DENSE_ALPHA);
    if (canAdjustScale) pickup.view.setScale(XP_FAR_VERY_DENSE_SCALE);
    return;
  }
  if (far && dense) {
    pickup.view.setAlpha(XP_FAR_DENSE_ALPHA);
    if (canAdjustScale) pickup.view.setScale(XP_FAR_DENSE_SCALE);
    return;
  }

  pickup.view.setAlpha(1);
  if (canAdjustScale) pickup.view.setScale(pickup.magnetized ? XP_ATTRACTING_SCALE : XP_BASE_SCALE);
}
