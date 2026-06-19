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

export function projectileTrail(scene: Phaser.Scene, kind: ProjectileVisualKind, x: number, y: number, angle: number): void {
  switch (projectileFeedbackFamily(kind)) {
    case 'lamp': {
      const glow = scene.add.circle(x, y, 6, COLORS.lantern, 0.34).setDepth(TRAIL_DEPTH);
      scene.tweens.add({ targets: glow, scale: 1.9, alpha: 0, duration: 250, ease: 'Quad.easeOut', onComplete: () => glow.destroy() });
      break;
    }
    case 'paper_cut': {
      const cut = scene.add.rectangle(x - Math.cos(angle) * 6, y - Math.sin(angle) * 6, 18, 2, COLORS.paperScrap, 0.62)
        .setDepth(TRAIL_DEPTH)
        .setRotation(angle + Math.PI * 0.12);
      scene.tweens.add({ targets: cut, alpha: 0, scaleX: 0.35, duration: 210, ease: 'Quad.easeOut', onComplete: () => cut.destroy() });
      break;
    }
    case 'glass': {
      const glint = scene.add.circle(x, y, 4.6, COLORS.glass, 0.48).setDepth(TRAIL_DEPTH);
      glint.setStrokeStyle(1, 0xffffff, 0.45);
      scene.tweens.add({ targets: glint, y: y - 4, scale: 0.45, alpha: 0, duration: 290, ease: 'Quad.easeOut', onComplete: () => glint.destroy() });
      break;
    }
    case 'paper_wind': {
      const wind = scene.add.rectangle(x - Math.cos(angle) * 10, y - Math.sin(angle) * 10, 24, 1.8, COLORS.paperScrap, 0.54)
        .setDepth(TRAIL_DEPTH)
        .setRotation(angle);
      scene.tweens.add({ targets: wind, x: wind.x - Math.cos(angle) * 10, y: wind.y - Math.sin(angle) * 10, alpha: 0, duration: 220, ease: 'Quad.easeOut', onComplete: () => wind.destroy() });
      break;
    }
    case 'graphite':
    default: {
      const dash = scene.add.rectangle(x - Math.cos(angle) * 7, y - Math.sin(angle) * 7, 12, 2.4, COLORS.graphite, 0.58)
        .setDepth(TRAIL_DEPTH)
        .setRotation(angle);
      scene.tweens.add({ targets: dash, alpha: 0, scaleX: 0.45, duration: 230, ease: 'Quad.easeOut', onComplete: () => dash.destroy() });
      break;
    }
  }
}

export function projectileHitFeedback(scene: Phaser.Scene, kind: ProjectileVisualKind, x: number, y: number, angle: number): void {
  const family = projectileFeedbackFamily(kind);
  const label = projectileHitLabel(kind);

  if (family === 'graphite') {
    const lineA = scene.add.rectangle(x, y, 28, 2.8, COLORS.graphite, 0.92).setDepth(HIT_DEPTH).setRotation(angle + 0.5);
    const lineB = scene.add.rectangle(x, y, 20, 2.3, COLORS.projectile, 0.76).setDepth(HIT_DEPTH).setRotation(angle - 0.45);
    scene.tweens.add({ targets: [lineA, lineB], alpha: 0, scaleX: 1.75, duration: 280, ease: 'Quad.easeOut', onComplete: () => { lineA.destroy(); lineB.destroy(); } });
    return;
  }

  if (family === 'lamp') {
    const ring = scene.add.circle(x, y, 10, COLORS.lantern, 0.16).setDepth(HIT_DEPTH);
    ring.setStrokeStyle(3, COLORS.fragmentGlow, 0.88);
    const dot = scene.add.circle(x, y, 4.2, COLORS.fragmentGlow, 0.95).setDepth(HIT_DEPTH + 1);
    scene.tweens.add({ targets: ring, scale: 2.25, alpha: 0, duration: 340, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
    scene.tweens.add({ targets: dot, y: y - 10, alpha: 0, duration: 300, ease: 'Quad.easeOut', onComplete: () => dot.destroy() });
    return;
  }

  if (family === 'paper_cut') {
    const slash = scene.add.rectangle(x, y, 38, 4, COLORS.paperScrap, 0.95).setDepth(HIT_DEPTH).setRotation(angle + Math.PI / 2);
    const edge = scene.add.rectangle(x, y, 24, 1.7, COLORS.fragment, 0.92).setDepth(HIT_DEPTH + 1).setRotation(angle + Math.PI / 2);
    scene.tweens.add({ targets: [slash, edge], alpha: 0, scaleX: 1.6, duration: 270, ease: 'Quad.easeOut', onComplete: () => { slash.destroy(); edge.destroy(); } });
    return;
  }

  if (family === 'glass') {
    const ring = scene.add.circle(x, y, 9, COLORS.glass, 0.15).setDepth(HIT_DEPTH);
    ring.setStrokeStyle(3, 0xffffff, 0.75);
    const crack1 = scene.add.rectangle(x, y, 26, 1.5, COLORS.cardText, 0.78).setDepth(HIT_DEPTH + 1).setRotation(angle + 0.8);
    const crack2 = scene.add.rectangle(x, y, 18, 1.4, COLORS.cardText, 0.7).setDepth(HIT_DEPTH + 1).setRotation(angle - 0.55);
    scene.tweens.add({ targets: [ring, crack1, crack2], alpha: 0, scale: 1.85, duration: 330, ease: 'Quad.easeOut', onComplete: () => { ring.destroy(); crack1.destroy(); crack2.destroy(); } });
    return;
  }

  const wind = scene.add.rectangle(x, y, 44, 2.6, COLORS.paperScrap, 0.76).setDepth(HIT_DEPTH).setRotation(angle);
  const puff = scene.add.circle(x, y, 10, COLORS.paperScrap, 0.2).setDepth(HIT_DEPTH - 1);
  scene.tweens.add({ targets: wind, x: x + Math.cos(angle) * 18, y: y + Math.sin(angle) * 18, alpha: 0, duration: 280, ease: 'Quad.easeOut', onComplete: () => wind.destroy() });
  scene.tweens.add({ targets: puff, scale: 2.15, alpha: 0, duration: 320, ease: 'Quad.easeOut', onComplete: () => puff.destroy() });

  const text = scene.add.text(x, y - 12, label, {
    fontFamily: FONT,
    fontSize: '9px',
    color: '#ffe7a8',
    stroke: '#080914',
    strokeThickness: 3,
    resolution: 2,
  }).setOrigin(0.5).setDepth(HIT_DEPTH + 2);
  scene.tweens.add({ targets: text, y: y - 26, alpha: 0, duration: 320, ease: 'Quad.easeOut', onComplete: () => text.destroy() });
}

export function projectileBounceFeedback(scene: Phaser.Scene, kind: ProjectileVisualKind, x: number, y: number): void {
  const family = projectileFeedbackFamily(kind);
  const color = family === 'glass' ? COLORS.glass : family === 'paper_wind' ? COLORS.paperScrap : COLORS.fragmentGlow;
  const ring = scene.add.circle(x, y, family === 'glass' ? 11 : 8, color, 0.16).setDepth(HIT_DEPTH);
  ring.setStrokeStyle(3, color, family === 'glass' ? 0.86 : 0.68);
  scene.tweens.add({ targets: ring, scale: family === 'glass' ? 2.45 : 1.95, alpha: 0, duration: 320, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
}

export function areaTickFeedback(scene: Phaser.Scene, kind: AreaVisualKind, x: number, y: number, radius: number): void {
  switch (areaFeedbackFamily(kind)) {
    case 'lamp_ring': {
      const ring = scene.add.circle(x, y, radius * 0.56, COLORS.lantern, 0.065).setDepth(AREA_DEPTH);
      ring.setStrokeStyle(2, COLORS.lantern, 0.34);
      scene.tweens.add({ targets: ring, scale: 1.46, alpha: 0, duration: 280, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
      break;
    }
    case 'dawn_mix': {
      const ring = scene.add.circle(x, y, radius * 0.48, COLORS.dawnPink, 0.065).setDepth(AREA_DEPTH);
      ring.setStrokeStyle(2, COLORS.fragmentGlow, 0.34);
      scene.tweens.add({ targets: ring, scale: 1.55, alpha: 0, duration: 300, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
      break;
    }
    case 'ink_pool':
    default: {
      const blot = scene.add.ellipse(x, y, radius * 1.02, radius * 0.44, COLORS.ink, 0.12).setDepth(AREA_DEPTH);
      scene.tweens.add({ targets: blot, scaleX: 1.32, scaleY: 1.12, alpha: 0, duration: 290, ease: 'Quad.easeOut', onComplete: () => blot.destroy() });
      break;
    }
  }
}

export function orbiterHitFeedback(scene: Phaser.Scene, x: number, y: number, angle: number): void {
  const card = scene.add.rectangle(x, y, 24, 7, COLORS.paperScrap, 0.86).setDepth(HIT_DEPTH).setRotation(angle + Math.PI / 2);
  const glow = scene.add.circle(x, y, 8, COLORS.fragmentGlow, 0.28).setDepth(HIT_DEPTH - 1);
  scene.tweens.add({ targets: card, alpha: 0, scaleX: 1.8, duration: 240, ease: 'Quad.easeOut', onComplete: () => card.destroy() });
  scene.tweens.add({ targets: glow, scale: 2.05, alpha: 0, duration: 280, ease: 'Quad.easeOut', onComplete: () => glow.destroy() });
}
