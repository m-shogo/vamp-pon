import type Phaser from 'phaser';
import { COLORS } from '../domain/constants';
import type { AreaVisualKind, ProjectileVisualKind } from '../domain/weaponVisual';
import {
  areaFeedbackFamily,
  projectileFeedbackFamily,
  projectileHitLabel,
} from '../domain/weaponFeedbackRules';
import { VIEW_DEPTH } from './factory';
import { FONT } from './visualDesign';

const TRAIL_DEPTH = VIEW_DEPTH.projectile - 1;
const HIT_DEPTH = VIEW_DEPTH.projectile + 2;
const AREA_DEPTH = VIEW_DEPTH.area + 2;

function flashDot(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const dot = scene.add.circle(x, y, 3.8, color, 0.95).setDepth(HIT_DEPTH + 3);
  scene.tweens.add({ targets: dot, scale: 2.2, alpha: 0, duration: 160, ease: 'Quad.easeOut', onComplete: () => dot.destroy() });
}

export function projectileTrail(scene: Phaser.Scene, kind: ProjectileVisualKind, x: number, y: number, angle: number): void {
  switch (projectileFeedbackFamily(kind)) {
    case 'lamp': {
      const glow = scene.add.circle(x, y, 7.2, COLORS.lantern, 0.42).setDepth(TRAIL_DEPTH);
      scene.tweens.add({ targets: glow, scale: 2.05, alpha: 0, duration: 270, ease: 'Quad.easeOut', onComplete: () => glow.destroy() });
      break;
    }
    case 'paper_cut': {
      const cut = scene.add.rectangle(x - Math.cos(angle) * 6, y - Math.sin(angle) * 6, 23, 2.5, COLORS.paperScrap, 0.74)
        .setDepth(TRAIL_DEPTH)
        .setRotation(angle + Math.PI * 0.12);
      scene.tweens.add({ targets: cut, alpha: 0, scaleX: 0.35, duration: 230, ease: 'Quad.easeOut', onComplete: () => cut.destroy() });
      break;
    }
    case 'glass': {
      const glint = scene.add.circle(x, y, 5.6, COLORS.glass, 0.6).setDepth(TRAIL_DEPTH);
      glint.setStrokeStyle(1, 0xffffff, 0.55);
      scene.tweens.add({ targets: glint, y: y - 4, scale: 0.45, alpha: 0, duration: 310, ease: 'Quad.easeOut', onComplete: () => glint.destroy() });
      break;
    }
    case 'paper_wind': {
      const wind = scene.add.rectangle(x - Math.cos(angle) * 10, y - Math.sin(angle) * 10, 30, 2.2, COLORS.paperScrap, 0.66)
        .setDepth(TRAIL_DEPTH)
        .setRotation(angle);
      scene.tweens.add({ targets: wind, x: wind.x - Math.cos(angle) * 12, y: wind.y - Math.sin(angle) * 12, alpha: 0, duration: 240, ease: 'Quad.easeOut', onComplete: () => wind.destroy() });
      break;
    }
    case 'graphite':
    default: {
      const dash = scene.add.rectangle(x - Math.cos(angle) * 7, y - Math.sin(angle) * 7, 16, 3, COLORS.graphite, 0.7)
        .setDepth(TRAIL_DEPTH)
        .setRotation(angle);
      scene.tweens.add({ targets: dash, alpha: 0, scaleX: 0.45, duration: 250, ease: 'Quad.easeOut', onComplete: () => dash.destroy() });
      break;
    }
  }
}

export function projectileHitFeedback(scene: Phaser.Scene, kind: ProjectileVisualKind, x: number, y: number, angle: number): void {
  const family = projectileFeedbackFamily(kind);
  const label = projectileHitLabel(kind);

  if (family === 'graphite') {
    flashDot(scene, x, y, COLORS.projectile);
    const lineA = scene.add.rectangle(x, y, 34, 3.2, COLORS.graphite, 0.98).setDepth(HIT_DEPTH).setRotation(angle + 0.5);
    const lineB = scene.add.rectangle(x, y, 24, 2.6, COLORS.projectile, 0.86).setDepth(HIT_DEPTH).setRotation(angle - 0.45);
    scene.tweens.add({ targets: [lineA, lineB], alpha: 0, scaleX: 1.9, duration: 300, ease: 'Quad.easeOut', onComplete: () => { lineA.destroy(); lineB.destroy(); } });
    return;
  }

  if (family === 'lamp') {
    flashDot(scene, x, y, COLORS.fragmentGlow);
    const ring = scene.add.circle(x, y, 12, COLORS.lantern, 0.22).setDepth(HIT_DEPTH);
    ring.setStrokeStyle(4, COLORS.fragmentGlow, 0.96);
    const dot = scene.add.circle(x, y, 5, COLORS.fragmentGlow, 1).setDepth(HIT_DEPTH + 1);
    scene.tweens.add({ targets: ring, scale: 2.4, alpha: 0, duration: 360, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
    scene.tweens.add({ targets: dot, y: y - 11, alpha: 0, duration: 320, ease: 'Quad.easeOut', onComplete: () => dot.destroy() });
    return;
  }

  if (family === 'paper_cut') {
    flashDot(scene, x, y, COLORS.fragment);
    const slash = scene.add.rectangle(x, y, 46, 5, COLORS.paperScrap, 1).setDepth(HIT_DEPTH).setRotation(angle + Math.PI / 2);
    const edge = scene.add.rectangle(x, y, 30, 2, COLORS.fragment, 0.98).setDepth(HIT_DEPTH + 1).setRotation(angle + Math.PI / 2);
    scene.tweens.add({ targets: [slash, edge], alpha: 0, scaleX: 1.75, duration: 290, ease: 'Quad.easeOut', onComplete: () => { slash.destroy(); edge.destroy(); } });
    return;
  }

  if (family === 'glass') {
    flashDot(scene, x, y, COLORS.glass);
    const ring = scene.add.circle(x, y, 11, COLORS.glass, 0.22).setDepth(HIT_DEPTH);
    ring.setStrokeStyle(4, 0xffffff, 0.86);
    const crack1 = scene.add.rectangle(x, y, 32, 1.8, COLORS.cardText, 0.9).setDepth(HIT_DEPTH + 1).setRotation(angle + 0.8);
    const crack2 = scene.add.rectangle(x, y, 22, 1.7, COLORS.cardText, 0.82).setDepth(HIT_DEPTH + 1).setRotation(angle - 0.55);
    scene.tweens.add({ targets: [ring, crack1, crack2], alpha: 0, scale: 2, duration: 350, ease: 'Quad.easeOut', onComplete: () => { ring.destroy(); crack1.destroy(); crack2.destroy(); } });
    return;
  }

  flashDot(scene, x, y, COLORS.paperScrap);
  const wind = scene.add.rectangle(x, y, 52, 3.2, COLORS.paperScrap, 0.9).setDepth(HIT_DEPTH).setRotation(angle);
  const puff = scene.add.circle(x, y, 13, COLORS.paperScrap, 0.28).setDepth(HIT_DEPTH - 1);
  scene.tweens.add({ targets: wind, x: x + Math.cos(angle) * 20, y: y + Math.sin(angle) * 20, alpha: 0, duration: 300, ease: 'Quad.easeOut', onComplete: () => wind.destroy() });
  scene.tweens.add({ targets: puff, scale: 2.25, alpha: 0, duration: 340, ease: 'Quad.easeOut', onComplete: () => puff.destroy() });

  const text = scene.add.text(x, y - 12, label, {
    fontFamily: FONT,
    fontSize: '10px',
    color: '#ffe7a8',
    stroke: '#080914',
    strokeThickness: 4,
    resolution: 2,
  }).setOrigin(0.5).setDepth(HIT_DEPTH + 2);
  scene.tweens.add({ targets: text, y: y - 28, alpha: 0, duration: 340, ease: 'Quad.easeOut', onComplete: () => text.destroy() });
}

export function projectileBounceFeedback(scene: Phaser.Scene, kind: ProjectileVisualKind, x: number, y: number): void {
  const family = projectileFeedbackFamily(kind);
  const color = family === 'glass' ? COLORS.glass : family === 'paper_wind' ? COLORS.paperScrap : COLORS.fragmentGlow;
  flashDot(scene, x, y, color);
  const ring = scene.add.circle(x, y, family === 'glass' ? 13 : 10, color, 0.24).setDepth(HIT_DEPTH);
  ring.setStrokeStyle(4, color, family === 'glass' ? 0.96 : 0.78);
  scene.tweens.add({ targets: ring, scale: family === 'glass' ? 2.6 : 2.1, alpha: 0, duration: 340, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
}

export function areaTickFeedback(scene: Phaser.Scene, kind: AreaVisualKind, x: number, y: number, radius: number): void {
  switch (areaFeedbackFamily(kind)) {
    case 'lamp_ring': {
      const ring = scene.add.circle(x, y, radius * 0.6, COLORS.lantern, 0.09).setDepth(AREA_DEPTH);
      ring.setStrokeStyle(3, COLORS.lantern, 0.42);
      scene.tweens.add({ targets: ring, scale: 1.5, alpha: 0, duration: 300, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
      break;
    }
    case 'dawn_mix': {
      const ring = scene.add.circle(x, y, radius * 0.52, COLORS.dawnPink, 0.09).setDepth(AREA_DEPTH);
      ring.setStrokeStyle(3, COLORS.fragmentGlow, 0.42);
      scene.tweens.add({ targets: ring, scale: 1.58, alpha: 0, duration: 320, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
      break;
    }
    case 'ink_pool':
    default: {
      const blot = scene.add.ellipse(x, y, radius * 1.1, radius * 0.5, COLORS.ink, 0.16).setDepth(AREA_DEPTH);
      scene.tweens.add({ targets: blot, scaleX: 1.38, scaleY: 1.16, alpha: 0, duration: 310, ease: 'Quad.easeOut', onComplete: () => blot.destroy() });
      break;
    }
  }
}

export function orbiterHitFeedback(scene: Phaser.Scene, x: number, y: number, angle: number): void {
  flashDot(scene, x, y, COLORS.fragmentGlow);
  const card = scene.add.rectangle(x, y, 30, 8, COLORS.paperScrap, 0.95).setDepth(HIT_DEPTH).setRotation(angle + Math.PI / 2);
  const glow = scene.add.circle(x, y, 10, COLORS.fragmentGlow, 0.36).setDepth(HIT_DEPTH - 1);
  scene.tweens.add({ targets: card, alpha: 0, scaleX: 2, duration: 260, ease: 'Quad.easeOut', onComplete: () => card.destroy() });
  scene.tweens.add({ targets: glow, scale: 2.2, alpha: 0, duration: 300, ease: 'Quad.easeOut', onComplete: () => glow.destroy() });
}
