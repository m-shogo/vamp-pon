import Phaser from 'phaser';
import type { EvolutionKind } from '../domain/types';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';

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

/** 進化成立直後の「変わった」感を出す画面演出。 */
export function evolutionBurst(scene: Phaser.Scene, x: number, y: number, label: string, kind: EvolutionKind = 'upgrade'): void {
  const depth = VIEW_DEPTH.overlay - 5;
  const isFusion = kind === 'fusion';
  const isAwakening = kind === 'awakening';
  const primary = isAwakening ? 0xfff1b0 : isFusion ? 0xffd45e : COLORS.ultReady;
  const secondary = isAwakening ? 0xff8fd6 : isFusion ? COLORS.ultFill : COLORS.ultFill;
  const flashAlpha = isAwakening ? 0.34 : isFusion ? 0.28 : 0.16;

  scene.cameras.main.flash(isAwakening ? 520 : isFusion ? 440 : 360, 255, 241, 176, false);
  scene.cameras.main.shake(isAwakening ? 360 : isFusion ? 300 : 220, isAwakening ? 0.009 : isFusion ? 0.007 : 0.004);

  const flash = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, primary, flashAlpha).setDepth(depth);
  const objects: Phaser.GameObjects.GameObject[] = [flash];

  if (isFusion) {
    const left = scene.add.circle(x - 54, y, 26, 0x241f3a, 0.72).setDepth(depth + 1);
    left.setStrokeStyle(5, primary, 0.95);
    const right = scene.add.circle(x + 54, y, 26, COLORS.lantern, 0.42).setDepth(depth + 1);
    right.setStrokeStyle(5, secondary, 0.95);
    const core = scene.add.star(x, y, 8, 16, 44, primary, 0.56).setDepth(depth + 2);
    const slashA = scene.add.rectangle(x, y, 190, 8, primary, 0.5).setAngle(28).setDepth(depth + 2);
    const slashB = scene.add.rectangle(x, y, 190, 8, secondary, 0.42).setAngle(-28).setDepth(depth + 2);
    const ring = scene.add.circle(x, y, 48, primary, 0.08).setDepth(depth + 1);
    ring.setStrokeStyle(7, primary, 0.95);
    objects.push(left, right, core, slashA, slashB, ring);
    scene.tweens.add({ targets: [left, right], x, duration: 260, ease: 'Cubic.easeIn' });
    scene.tweens.add({ targets: [core, slashA, slashB, ring], scale: 4.2, alpha: 0, delay: 180, duration: 820, ease: 'Cubic.easeOut' });
  } else if (isAwakening) {
    const halo = scene.add.star(x, y, 12, 34, 74, primary, 0.36).setDepth(depth + 1);
    const core = scene.add.star(x, y, 8, 14, 34, secondary, 0.82).setDepth(depth + 2);
    const vertical = scene.add.rectangle(x, y, 7, 220, primary, 0.42).setDepth(depth + 1);
    const horizontal = scene.add.rectangle(x, y, 220, 7, secondary, 0.36).setDepth(depth + 1);
    const ring = scene.add.circle(x, y, 42, secondary, 0.08).setDepth(depth + 1);
    ring.setStrokeStyle(6, secondary, 0.92);
    objects.push(halo, core, vertical, horizontal, ring);
    scene.tweens.add({ targets: [halo, core], angle: 220, scale: 3.5, alpha: 0, duration: 980, ease: 'Cubic.easeOut' });
    scene.tweens.add({ targets: [vertical, horizontal, ring], scale: 4.8, alpha: 0, duration: 980, ease: 'Cubic.easeOut' });
  } else {
    const ring = scene.add.circle(x, y, 36, primary, 0.12).setDepth(depth + 1);
    ring.setStrokeStyle(5, primary, 0.9);
    const ring2 = scene.add.circle(x, y, 18, secondary, 0.14).setDepth(depth + 1);
    ring2.setStrokeStyle(3, secondary, 0.8);
    objects.push(ring, ring2);
    scene.tweens.add({
      targets: [ring, ring2],
      scale: 5.2,
      alpha: 0,
      duration: 760,
      ease: 'Cubic.easeOut',
    });
  }

  const text = scene.add
    .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - (isAwakening || isFusion ? 116 : 92), label, {
      fontFamily: '"Hiragino Sans", "Yu Gothic", sans-serif',
      fontSize: isAwakening || isFusion ? '30px' : '24px',
      color: isAwakening ? '#fff7cf' : '#fff1b0',
      fontStyle: 'bold',
      stroke: '#241f3a',
      strokeThickness: isAwakening || isFusion ? 6 : 4,
    })
    .setOrigin(0.5)
    .setDepth(depth + 3);
  objects.push(text);

  scene.tweens.add({
    targets: flash,
    alpha: 0,
    duration: isAwakening || isFusion ? 720 : 520,
    ease: 'Quad.easeOut',
    onComplete: () => flash.destroy(),
  });
  scene.tweens.add({
    targets: text,
    y: text.y - 34,
    alpha: 0,
    duration: isAwakening || isFusion ? 1320 : 1100,
    ease: 'Quad.easeOut',
    onComplete: () => text.destroy(),
  });

  scene.time.delayedCall(1500, () => {
    for (const obj of objects) {
      if (obj.active) obj.destroy();
    }
  });
}
