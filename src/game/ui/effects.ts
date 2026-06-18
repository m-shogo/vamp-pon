import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import type { EvolutionKind } from '../domain/types';
import { VIEW_DEPTH } from './factory';
import { EVOLUTION_ACCENT, FONT } from './visualDesign';
import { evolutionPresentation } from './evolutionPresentation';

function toCss(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}

/** 影が消えるときの黒インクの飛沫。短命の縮小フェード。 */
export function inkPuff(scene: Phaser.Scene, x: number, y: number, radius: number, elite = false): void {
  const color = elite ? COLORS.enemyEliteEdge : COLORS.enemyInkEdge;
  const puff = scene.add.circle(x, y, radius * 0.9, color, 0.5).setDepth(VIEW_DEPTH.enemy - 1);
  scene.tweens.add({
    targets: puff,
    scale: elite ? 1.8 : 1.4,
    alpha: 0,
    duration: elite ? 320 : 200,
    ease: 'Quad.easeOut',
    onComplete: () => puff.destroy(),
  });
}

/** 欠片を拾った瞬間の小さな金の弾け。 */
export function collectSpark(scene: Phaser.Scene, x: number, y: number): void {
  const spark = scene.add.circle(x, y, 5, COLORS.fragmentGlow, 0.8).setDepth(VIEW_DEPTH.pickup + 1);
  scene.tweens.add({
    targets: spark,
    scale: 1.8,
    alpha: 0,
    duration: 160,
    ease: 'Quad.easeOut',
    onComplete: () => spark.destroy(),
  });
}

/** 黒カプセル撃破時の報酬感。ドロップの有無とは別に、追って倒した手応えを短く出す。 */
export function capsuleRewardBurst(scene: Phaser.Scene, x: number, y: number): void {
  const depth = VIEW_DEPTH.pickup + 3;
  const ring = scene.add.circle(x, y, 12, COLORS.fragmentGlow, 0.08).setDepth(depth);
  ring.setStrokeStyle(2, COLORS.fragmentGlow, 0.82);
  const glint = scene.add.circle(x, y, 4, COLORS.lantern, 0.9).setDepth(depth + 1);
  const text = scene.add.text(x, y - 12, '+記憶', {
    fontFamily: FONT,
    fontSize: '11px',
    color: '#ffe7a8',
    fontStyle: 'bold',
    stroke: '#080914',
    strokeThickness: 3,
    resolution: 2,
  }).setOrigin(0.5).setDepth(depth + 2);

  scene.tweens.add({ targets: ring, scale: 2.4, alpha: 0, duration: 360, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
  scene.tweens.add({ targets: glint, y: y - 8, scale: 0.4, alpha: 0, duration: 300, ease: 'Quad.easeOut', onComplete: () => glint.destroy() });
  scene.tweens.add({ targets: text, y: text.y - 18, alpha: 0, duration: 620, ease: 'Quad.easeOut', onComplete: () => text.destroy() });
}

/** 被弾時の画面シェイク（控えめ）。 */
export function shakeOnHit(scene: Phaser.Scene): void {
  scene.cameras.main.shake(110, 0.006);
}

/** 必殺技発動時の暖色フラッシュ。 */
export function ultimateFlash(scene: Phaser.Scene): void {
  scene.cameras.main.flash(240, 255, 235, 170, false);
}

function addEvolutionMotif(
  scene: Phaser.Scene,
  x: number,
  y: number,
  depth: number,
  kind: EvolutionKind,
): void {
  const presentation = evolutionPresentation(kind);
  const accent = EVOLUTION_ACCENT[kind];

  if (presentation.motif === 'paper-rise') {
    const scraps = [-1.5, -0.5, 0.5, 1.5].map((offset, index) => {
      const scrap = scene.add.rectangle(
        x + offset * 14,
        y + 12 + Math.abs(offset) * 3,
        10 + index % 2 * 3,
        7,
        COLORS.paperScrap,
        0.78,
      ).setDepth(depth).setAngle(offset * 12);
      scene.tweens.add({
        targets: scrap,
        x: scrap.x + offset * 12,
        y: scrap.y - 42 - index * 3,
        angle: scrap.angle + offset * 16,
        alpha: 0,
        duration: 720,
        ease: 'Quad.easeOut',
        onComplete: () => scrap.destroy(),
      });
      return scrap;
    });
    void scraps;
    return;
  }

  if (presentation.motif === 'ink-lamp-merge') {
    const ink = scene.add.ellipse(x - 34, y, 24, 17, COLORS.ink, 0.76).setDepth(depth);
    const lamp = scene.add.circle(x + 34, y, 10, COLORS.lantern, 0.9).setDepth(depth + 1);
    const bridge = scene.add.rectangle(x, y, 54, 2, accent.main, 0.48).setDepth(depth);
    scene.tweens.add({
      targets: [ink, lamp],
      x,
      scale: 0.7,
      duration: 360,
      ease: 'Quad.easeIn',
      onComplete: () => {
        ink.destroy();
        lamp.destroy();
      },
    });
    scene.tweens.add({
      targets: bridge,
      scaleX: 0.12,
      alpha: 0,
      duration: 430,
      ease: 'Quad.easeIn',
      onComplete: () => bridge.destroy(),
    });
    return;
  }

  const seal = scene.add.rectangle(x, y + 18, 18, 48, COLORS.paperScrap, 0.9).setDepth(depth);
  seal.setStrokeStyle(2, accent.main, 0.9);
  const inkMark = scene.add.rectangle(x, y + 18, 4, 29, accent.sub, 0.82).setDepth(depth + 1);
  scene.tweens.add({
    targets: [seal, inkMark],
    y: y - 10,
    scaleY: 1.25,
    alpha: 0,
    duration: 920,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      seal.destroy();
      inkMark.destroy();
    },
  });
}

/**
 * 進化成立直後の「変わった」感を出す画面演出。
 * 種別ごとの意味を、光量ではなく紙・インク・灯り・記憶札のモチーフ差で伝える。
 */
export function evolutionBurst(scene: Phaser.Scene, x: number, y: number, label: string, kind: EvolutionKind = 'upgrade'): void {
  const accent = EVOLUTION_ACCENT[kind];
  const presentation = evolutionPresentation(kind);
  const [red, green, blue] = presentation.flashRgb;
  scene.cameras.main.flash(presentation.strong ? 420 : 320, red, green, blue, false);
  scene.cameras.main.shake(presentation.strong ? 260 : 200, presentation.strong ? 0.005 : 0.003);

  const depth = VIEW_DEPTH.overlay - 5;
  const flash = scene.add.rectangle(
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2,
    GAME_WIDTH,
    GAME_HEIGHT,
    accent.main,
    presentation.strong ? 0.16 : 0.12,
  ).setDepth(depth);

  const rings: Phaser.GameObjects.Arc[] = [];
  const mainRing = scene.add.circle(x, y, 34, accent.main, 0.08).setDepth(depth + 1);
  mainRing.setStrokeStyle(4, accent.main, 0.85);
  rings.push(mainRing);
  if (accent.rings >= 2) {
    const subRing = scene.add.circle(x, y, 18, accent.sub, 0.1).setDepth(depth + 1);
    subRing.setStrokeStyle(3, accent.sub, 0.7);
    rings.push(subRing);
  }

  addEvolutionMotif(scene, x, y, depth + 2, kind);

  const text = scene.add
    .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - (presentation.strong ? 110 : 92), label, {
      fontFamily: FONT,
      fontSize: presentation.strong ? '26px' : '23px',
      color: toCss(accent.main),
      fontStyle: 'bold',
      stroke: '#1b1730',
      strokeThickness: presentation.strong ? 5 : 4,
      align: 'center',
      resolution: 2,
    })
    .setOrigin(0.5)
    .setDepth(depth + 3);

  const subtitle = scene.add.text(GAME_WIDTH / 2, text.y + 38, presentation.subtitle, {
    fontFamily: FONT,
    fontSize: '12px',
    color: '#f4ead4',
    fontStyle: 'bold',
    stroke: '#1b1730',
    strokeThickness: 3,
    align: 'center',
    resolution: 2,
  }).setOrigin(0.5).setDepth(depth + 3);

  scene.tweens.add({ targets: flash, alpha: 0, duration: 480, ease: 'Quad.easeOut', onComplete: () => flash.destroy() });
  scene.tweens.add({
    targets: rings,
    scale: presentation.strong ? 5.4 : 5.0,
    alpha: 0,
    duration: presentation.strong ? 820 : 720,
    ease: 'Cubic.easeOut',
    onComplete: () => rings.forEach((ring) => ring.destroy()),
  });
  scene.tweens.add({
    targets: [text, subtitle],
    y: '-=26',
    alpha: 0,
    duration: presentation.durationMs,
    ease: 'Quad.easeOut',
    onComplete: () => {
      text.destroy();
      subtitle.destroy();
    },
  });
}
