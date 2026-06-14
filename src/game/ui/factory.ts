import Phaser from 'phaser';
import { COLORS, ENEMY_RADIUS, PICKUP } from '../domain/constants';
import type { EnemyDefinition } from '../domain/types';

/** 敵タグから当たり/見た目半径を決める。 */
export function enemyRadiusFor(def: EnemyDefinition): number {
  if (def.tags.includes('elite')) return ENEMY_RADIUS.elite;
  if (def.tags.includes('small')) return ENEMY_RADIUS.small;
  return ENEMY_RADIUS.medium;
}

const DEPTH = {
  background: 0,
  area: 5,
  capsule: 8,
  pickup: 10,
  enemy: 20,
  projectile: 25,
  orbiter: 28,
  player: 30,
  hud: 100,
  overlay: 200,
};

export const VIEW_DEPTH = DEPTH;

/** プレイヤー（ユイ）: ランタン持ちの小さな影。暖色で光る。 */
export function createPlayerView(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const c = scene.add.container(x, y);
  const glow = scene.add.circle(0, 0, 26, COLORS.playerGlow, 0.18);
  const body = scene.add.circle(0, 2, 13, COLORS.player);
  body.setStrokeStyle(2, COLORS.lantern, 0.9);
  const hood = scene.add.circle(0, -6, 8, 0x6b5b8a);
  const lantern = scene.add.circle(9, 6, 4, COLORS.lantern);
  const lanternGlow = scene.add.circle(9, 6, 9, COLORS.lantern, 0.25);
  c.add([glow, lanternGlow, body, hood, lantern]);
  c.setDepth(DEPTH.player);
  return c;
}

/** 敵: 黒インクの影 + 白い目。種類で色/大きさが変わる。 */
export function createEnemyView(
  scene: Phaser.Scene,
  def: EnemyDefinition,
  radius: number,
): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const isElite = def.tags.includes('elite');
  const fill = isElite ? COLORS.enemyElite : COLORS.enemyInk;
  const edge = isElite ? COLORS.enemyEliteEdge : COLORS.enemyInkEdge;

  const blob = scene.add.circle(0, 0, radius, fill);
  blob.setStrokeStyle(2, edge, 0.9);

  // 紙くず/もや/標識など、タグで少し形を変えて識別性を上げる
  const extras: Phaser.GameObjects.GameObject[] = [];
  if (def.tags.includes('swarm')) {
    blob.setFillStyle(fill, 0.7);
  }
  if (def.tags.includes('tank') || isElite) {
    const ring = scene.add.circle(0, 0, radius + 3, edge, 0.0);
    ring.setStrokeStyle(2, edge, 0.5);
    extras.push(ring);
  }

  const eyeY = -radius * 0.15;
  const eyeDx = radius * 0.35;
  const eyeR = Math.max(1.5, radius * 0.13);
  const eyeL = scene.add.circle(-eyeDx, eyeY, eyeR, COLORS.enemyEye);
  const eyeRr = scene.add.circle(eyeDx, eyeY, eyeR, COLORS.enemyEye);

  c.add([blob, ...extras, eyeL, eyeRr]);
  c.setDepth(DEPTH.enemy);
  c.setData('blob', blob);
  return c;
}

/** 鉛筆弾など射出弾。 */
export function createProjectileView(
  scene: Phaser.Scene,
  kind: 'pencil' | 'star',
  radius: number,
): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  if (kind === 'star') {
    const dot = scene.add.star(0, 0, 4, radius * 0.5, radius, COLORS.projectileStar);
    const glow = scene.add.circle(0, 0, radius + 2, COLORS.projectileStar, 0.3);
    c.add([glow, dot]);
  } else {
    const glow = scene.add.circle(0, 0, radius + 2, COLORS.projectile, 0.3);
    const dot = scene.add.circle(0, 0, radius, COLORS.projectile);
    c.add([glow, dot]);
  }
  c.setDepth(DEPTH.projectile);
  return c;
}

/** ビー玉（反射弾）。 */
export function createMarbleView(scene: Phaser.Scene, radius: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const glow = scene.add.circle(0, 0, radius + 2, COLORS.capsule, 0.25);
  const ball = scene.add.circle(0, 0, radius, COLORS.capsule, 0.85);
  ball.setStrokeStyle(1.5, 0xffffff, 0.7);
  c.add([glow, ball]);
  c.setDepth(DEPTH.projectile);
  return c;
}

/** 地面のインクだまり（DoT）。 */
export function createAreaView(scene: Phaser.Scene, radius: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const pool = scene.add.circle(0, 0, radius, COLORS.ink, 0.55);
  pool.setStrokeStyle(2, COLORS.enemyInkEdge, 0.4);
  c.add([pool]);
  c.setDepth(DEPTH.area);
  return c;
}

/** 月のしおり（オービター）。 */
export function createOrbiterView(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const glow = scene.add.circle(0, 0, 9, COLORS.lantern, 0.25);
  const mark = scene.add.rectangle(0, 0, 8, 12, COLORS.cardBg);
  mark.setStrokeStyle(1.5, COLORS.lantern, 0.9);
  c.add([glow, mark]);
  c.setDepth(DEPTH.orbiter);
  return c;
}

/** 記憶の欠片。 */
export function createPickupView(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const glow = scene.add.circle(0, 0, PICKUP.visualSize, COLORS.fragmentGlow, 0.3);
  const star = scene.add.star(0, 0, 4, PICKUP.visualSize * 0.4, PICKUP.visualSize * 0.85, COLORS.fragment);
  c.add([glow, star]);
  c.setDepth(DEPTH.pickup);
  return c;
}

/** 記憶カプセル。 */
export function createCapsuleView(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const glow = scene.add.circle(0, 0, 16, COLORS.capsule, 0.35);
  const bottle = scene.add.rectangle(0, 0, 14, 20, COLORS.capsule, 0.85);
  bottle.setStrokeStyle(2, 0xffffff, 0.7);
  const cork = scene.add.rectangle(0, -12, 8, 5, COLORS.lantern);
  const spark = scene.add.star(0, 1, 4, 2, 5, COLORS.fragmentGlow);
  c.add([glow, bottle, cork, spark]);
  c.setDepth(DEPTH.capsule);
  return c;
}
