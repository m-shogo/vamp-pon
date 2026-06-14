import Phaser from 'phaser';
import { COLORS } from '../domain/constants';
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
