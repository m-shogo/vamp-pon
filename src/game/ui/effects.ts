import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import type { EvolutionKind } from '../domain/types';
import { VIEW_DEPTH } from './factory';
import { EVOLUTION_ACCENT, FONT } from './visualDesign';

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

/** 被弾時の画面シェイク（控えめ）。 */
export function shakeOnHit(scene: Phaser.Scene): void {
  scene.cameras.main.shake(110, 0.006);
}

/** 必殺技発動時の暖色フラッシュ。 */
export function ultimateFlash(scene: Phaser.Scene): void {
  scene.cameras.main.flash(240, 255, 235, 170, false);
}

/**
 * 進化成立直後の「変わった」感を出す画面演出。
 * 派手さではなく、進化種別（強化進化/合体/覚醒）のモチーフ差で特別感を出す。
 * - upgrade  : 暖色のリング1本（控えめ）
 * - fusion   : 黒インク + 朝の灯りの2モチーフ（リング2本）
 * - awakening: 淡い菫 + 金（やや神秘・リング2本）
 * 禁止: スラッシュ/十字/星バースト/ネオン。
 */
export function evolutionBurst(scene: Phaser.Scene, x: number, y: number, label: string, kind: EvolutionKind = 'upgrade'): void {
  const accent = EVOLUTION_ACCENT[kind];
  const strong = kind !== 'upgrade';
  scene.cameras.main.flash(strong ? 420 : 320, 255, 240, 176, false);
  scene.cameras.main.shake(strong ? 260 : 200, strong ? 0.005 : 0.003);

  const depth = VIEW_DEPTH.overlay - 5;
  const flash = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, accent.main, strong ? 0.16 : 0.12).setDepth(depth);

  const rings: Phaser.GameObjects.Arc[] = [];
  const mainRing = scene.add.circle(x, y, 34, accent.main, 0.08).setDepth(depth + 1);
  mainRing.setStrokeStyle(4, accent.main, 0.85);
  rings.push(mainRing);
  if (accent.rings >= 2) {
    const subRing = scene.add.circle(x, y, 18, accent.sub, 0.1).setDepth(depth + 1);
    subRing.setStrokeStyle(3, accent.sub, 0.7);
    rings.push(subRing);
  }

  const text = scene.add
    .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - (strong ? 110 : 92), label, {
      fontFamily: FONT,
      fontSize: strong ? '26px' : '23px',
      color: toCss(accent.main),
      fontStyle: 'bold',
      stroke: '#1b1730',
      strokeThickness: strong ? 5 : 4,
    })
    .setOrigin(0.5)
    .setDepth(depth + 3);

  scene.tweens.add({ targets: flash, alpha: 0, duration: 480, ease: 'Quad.easeOut', onComplete: () => flash.destroy() });
  scene.tweens.add({
    targets: rings,
    scale: strong ? 5.4 : 5.0,
    alpha: 0,
    duration: strong ? 820 : 720,
    ease: 'Cubic.easeOut',
    onComplete: () => rings.forEach((r) => r.destroy()),
  });
  scene.tweens.add({ targets: text, y: text.y - 26, alpha: 0, duration: strong ? 1300 : 1100, ease: 'Quad.easeOut', onComplete: () => text.destroy() });
}
