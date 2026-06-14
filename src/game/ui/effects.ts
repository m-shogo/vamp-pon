import Phaser from 'phaser';
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
export function evolutionBurst(scene: Phaser.Scene, x: number, y: number, label: string): void {
  scene.cameras.main.flash(360, 255, 241, 176, false);
  scene.cameras.main.shake(220, 0.004);

  const depth = VIEW_DEPTH.overlay - 5;
  const flash = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.ultReady, 0.16).setDepth(depth);
  const ring = scene.add.circle(x, y, 36, COLORS.ultReady, 0.12).setDepth(depth + 1);
  ring.setStrokeStyle(5, COLORS.ultReady, 0.9);
  const ring2 = scene.add.circle(x, y, 18, COLORS.ultFill, 0.14).setDepth(depth + 1);
  ring2.setStrokeStyle(3, COLORS.ultFill, 0.8);
  const text = scene.add
    .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 92, label, {
      fontFamily: '"Hiragino Sans", "Yu Gothic", sans-serif',
      fontSize: '24px',
      color: '#fff1b0',
      fontStyle: 'bold',
      stroke: '#241f3a',
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setDepth(depth + 2);

  scene.tweens.add({
    targets: flash,
    alpha: 0,
    duration: 520,
    ease: 'Quad.easeOut',
    onComplete: () => flash.destroy(),
  });
  scene.tweens.add({
    targets: [ring, ring2],
    scale: 5.2,
    alpha: 0,
    duration: 760,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      ring.destroy();
      ring2.destroy();
    },
  });
  scene.tweens.add({
    targets: text,
    y: text.y - 26,
    alpha: 0,
    duration: 1100,
    ease: 'Quad.easeOut',
    onComplete: () => text.destroy(),
  });
}
