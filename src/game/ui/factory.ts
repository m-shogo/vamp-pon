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
  const kind = def.visualKind;
  const isElite = kind === 'label_elite';
  const fill = isElite ? COLORS.enemyElite : COLORS.enemyInk;
  const edge = isElite ? COLORS.enemyEliteEdge : COLORS.enemyInkEdge;
  const baseAlpha = kind === 'haze' ? 0.6 : 1;

  const blob = scene.add.circle(0, 0, radius, fill, baseAlpha);
  blob.setStrokeStyle(2, edge, 0.9);

  const behind: Phaser.GameObjects.GameObject[] = [];
  const front: Phaser.GameObjects.GameObject[] = [];
  let eyeHigh = false;

  switch (kind) {
    case 'paper_scrap': {
      const scrap = scene.add.rectangle(radius * 0.4, -radius * 0.5, radius * 0.8, radius * 0.6, COLORS.backgroundTile, 0.9);
      scrap.setStrokeStyle(1, COLORS.cardEdge, 0.6);
      scrap.setAngle(20);
      front.push(scrap);
      break;
    }
    case 'signpost': {
      const post = scene.add.rectangle(0, -radius - 4, 2, 8, COLORS.cardEdge, 0.8);
      const arrow = scene.add.triangle(radius * 0.2, -radius - 6, 0, 0, 8, 4, 0, 8, COLORS.cardBg, 0.9);
      front.push(post, arrow);
      break;
    }
    case 'capsule': {
      const ring = scene.add.ellipse(0, 0, radius * 1.4, radius * 2.0, edge, 0);
      ring.setStrokeStyle(2, edge, 0.5);
      const cork = scene.add.rectangle(0, -radius, radius * 0.7, 5, COLORS.lantern, 0.9);
      behind.push(ring);
      front.push(cork);
      break;
    }
    case 'haze': {
      behind.push(
        scene.add.circle(-radius * 0.5, radius * 0.3, radius * 0.7, fill, 0.3),
        scene.add.circle(radius * 0.5, radius * 0.2, radius * 0.7, fill, 0.3),
        scene.add.circle(0, -radius * 0.4, radius * 0.6, fill, 0.3),
      );
      break;
    }
    case 'label_elite': {
      const ring = scene.add.circle(0, 0, radius + 3, edge, 0);
      ring.setStrokeStyle(2, edge, 0.5);
      const label = scene.add.rectangle(0, radius * 0.1, radius * 1.5, radius * 0.5, 0x0a0712, 0.95);
      label.setStrokeStyle(1, COLORS.enemyEliteEdge, 0.7);
      behind.push(ring);
      front.push(label);
      eyeHigh = true;
      break;
    }
    case 'ink_blob':
    default:
      break;
  }

  const eyeY = eyeHigh ? -radius * 0.4 : -radius * 0.15;
  const eyeDx = radius * 0.35;
  const eyeR = Math.max(1.5, radius * 0.13);
  const eyeL = scene.add.circle(-eyeDx, eyeY, eyeR, COLORS.enemyEye);
  const eyeRr = scene.add.circle(eyeDx, eyeY, eyeR, COLORS.enemyEye);

  c.add([...behind, blob, ...front, eyeL, eyeRr]);
  c.setDepth(DEPTH.enemy);
  c.setData('blob', blob);
  c.setData('baseFill', fill);
  c.setData('baseAlpha', baseAlpha);
  return c;
}

export type ProjectileVisualKind = 'pencil' | 'star' | 'blade' | 'paper_airplane' | 'evolved_line' | 'lantern_star';
export type AreaVisualKind = 'ink' | 'lamp' | 'dawn';

/** 鉛筆弾など射出弾。武器ごとに一目で別物に見える記号を持たせる。 */
export function createProjectileView(
  scene: Phaser.Scene,
  kind: ProjectileVisualKind,
  radius: number,
): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  if (kind === 'lantern_star') {
    const aura = scene.add.circle(0, 0, radius + 16, COLORS.ultReady, 0.2);
    const glow = scene.add.circle(0, 0, radius + 10, COLORS.lantern, 0.58);
    const dot = scene.add.star(0, 0, 7, radius * 0.85, radius + 7, COLORS.ultReady, 0.98);
    const core = scene.add.circle(0, 0, radius * 0.82, COLORS.lantern, 1);
    c.add([aura, glow, dot, core]);
  } else if (kind === 'evolved_line') {
    const backGlow = scene.add.rectangle(0, 0, radius * 13.5, radius * 3.1, COLORS.ultFill, 0.22);
    const glow = scene.add.rectangle(0, 0, radius * 12.2, radius * 2.2, 0xbfe6ff, 0.34);
    const line = scene.add.rectangle(0, 0, radius * 11.0, radius * 1.16, 0xf3ead2, 0.99);
    line.setStrokeStyle(2, COLORS.ultFill, 1);
    const ink = scene.add.rectangle(0, radius * 1.18, radius * 8.4, radius * 0.44, COLORS.ultFill, 0.86);
    const head = scene.add.triangle(radius * 5.8, 0, 0, -radius * 1.5, radius * 2.4, 0, 0, radius * 1.5, COLORS.ultReady, 0.95);
    c.add([backGlow, glow, line, ink, head]);
  } else if (kind === 'star') {
    const dot = scene.add.star(0, 0, 4, radius * 0.5, radius + 1, COLORS.projectileStar);
    const glow = scene.add.circle(0, 0, radius + 4, COLORS.projectileStar, 0.45);
    c.add([glow, dot]);
  } else if (kind === 'blade') {
    const glow = scene.add.rectangle(0, 0, radius * 4.4, radius * 1.4, 0xfff1b0, 0.28);
    glow.setAngle(-18);
    const blade = scene.add.rectangle(0, 0, radius * 4.6, radius * 0.9, 0xf3ead2, 0.96);
    blade.setStrokeStyle(1, 0xffd45e, 0.9);
    blade.setAngle(-18);
    const cut = scene.add.rectangle(radius * 1.4, -radius * 0.6, radius * 1.8, radius * 0.22, 0xffd45e, 0.85);
    cut.setAngle(-18);
    c.add([glow, blade, cut]);
  } else if (kind === 'paper_airplane') {
    const glow = scene.add.triangle(0, 0, -radius * 1.8, radius * 1.1, radius * 2.2, 0, -radius * 1.8, -radius * 1.1, 0xbfe6ff, 0.28);
    const plane = scene.add.triangle(0, 0, -radius * 1.6, radius, radius * 2.1, 0, -radius * 1.6, -radius, 0xf3ead2, 0.95);
    plane.setStrokeStyle(1, 0xbfe6ff, 0.9);
    const fold = scene.add.line(0, 0, -radius * 1.2, 0, radius * 1.4, 0, 0xbfe6ff, 0.9);
    c.add([glow, plane, fold]);
  } else {
    const glow = scene.add.circle(0, 0, radius + 3, COLORS.projectile, 0.38);
    const dot = scene.add.rectangle(0, 0, radius * 2.8, radius * 1.1, COLORS.projectile, 0.95);
    dot.setStrokeStyle(1, 0xffd166, 0.8);
    dot.setAngle(-12);
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

/** 地面のインクだまり/街灯の輪（DoT）。 */
export function createAreaView(scene: Phaser.Scene, radius: number, kind: AreaVisualKind = 'ink'): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  if (kind === 'dawn') {
    const outer = scene.add.circle(0, 0, radius + 34, COLORS.ultReady, 0.22);
    outer.setStrokeStyle(3, COLORS.ultReady, 0.45);
    const ink = scene.add.circle(0, 0, radius, COLORS.ink, 0.42);
    ink.setStrokeStyle(4, COLORS.enemyInkEdge, 0.72);
    const ring = scene.add.circle(0, 0, radius * 0.9, COLORS.lantern, 0.24);
    ring.setStrokeStyle(8, COLORS.ultReady, 1);
    const innerRing = scene.add.circle(0, 0, radius * 0.54, COLORS.ultFill, 0.2);
    innerRing.setStrokeStyle(5, COLORS.ultFill, 0.82);
    const core = scene.add.star(0, 0, 8, Math.max(14, radius * 0.12), Math.max(36, radius * 0.3), COLORS.ultReady, 0.5);
    const cross1 = scene.add.rectangle(0, 0, radius * 1.72, 7, COLORS.ultReady, 0.48);
    const cross2 = scene.add.rectangle(0, 0, radius * 1.72, 7, COLORS.ultFill, 0.42);
    cross2.setAngle(90);
    const slash = scene.add.rectangle(0, 0, radius * 1.35, 5, 0xf3ead2, 0.32);
    slash.setAngle(45);
    c.add([outer, ink, ring, innerRing, core, cross1, cross2, slash]);
  } else if (kind === 'lamp') {
    const glow = scene.add.circle(0, 0, radius + 8, COLORS.lantern, 0.1);
    const ring = scene.add.circle(0, 0, radius, COLORS.lantern, 0.18);
    ring.setStrokeStyle(3, COLORS.lantern, 0.65);
    const inner = scene.add.circle(0, 0, Math.max(8, radius * 0.38), COLORS.projectileStar, 0.12);
    c.add([glow, ring, inner]);
  } else {
    const pool = scene.add.circle(0, 0, radius, COLORS.ink, 0.55);
    pool.setStrokeStyle(2, COLORS.enemyInkEdge, 0.4);
    c.add([pool]);
  }
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

/** 回復ドロップ。 */
export function createHealPickupView(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const glow = scene.add.circle(0, 0, PICKUP.visualSize + 5, 0xa8ffd2, 0.28);
  const paper = scene.add.rectangle(0, 0, 15, 15, 0xf3ead2, 0.95);
  paper.setStrokeStyle(2, 0xa8ffd2, 0.9);
  paper.setAngle(8);
  const vertical = scene.add.rectangle(0, 0, 4, 12, 0x62d690, 0.95);
  const horizontal = scene.add.rectangle(0, 0, 12, 4, 0x62d690, 0.95);
  c.add([glow, paper, vertical, horizontal]);
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
