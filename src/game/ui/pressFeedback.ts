import Phaser from 'phaser';
import { VIEW_DEPTH } from './factory';
import { reducedMotionEnabled, requestAppHaptic } from '../persistence/appPreferences';

export type PressFeedbackOptions = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  accent?: number;
  depth?: number;
  strong?: boolean;
  shake?: boolean;
};

type InteractiveObject = Phaser.GameObjects.GameObject & Phaser.Events.EventEmitter;
type PressVisual = Phaser.GameObjects.GameObject & {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  setScale: (x: number, y?: number) => PressVisual;
  setAlpha?: (alpha: number) => PressVisual;
};

function pressBurst(scene: Phaser.Scene, x: number, y: number, width: number, height: number, accent: number, depth: number, strong: boolean): void {
  if (reducedMotionEnabled()) {
    const halo = scene.add.circle(x, y, Math.max(width, height) * 0.34, accent, strong ? 0.12 : 0.08).setDepth(depth);
    scene.time.delayedCall(80, () => halo.destroy());
    return;
  }
  const ringRadius = Math.max(width, height) * (strong ? 0.5 : 0.43);
  const ring = scene.add.circle(x, y, ringRadius, accent, strong ? 0.1 : 0.06).setDepth(depth).setBlendMode('ADD');
  ring.setStrokeStyle(strong ? 3 : 2, accent, strong ? 0.74 : 0.48);
  scene.tweens.add({
    targets: ring,
    scale: strong ? 1.42 : 1.24,
    alpha: 0,
    duration: strong ? 240 : 190,
    ease: 'Cubic.easeOut',
    onComplete: () => ring.destroy(),
  });

  const sparkCount = strong ? 7 : 4;
  for (let i = 0; i < sparkCount; i += 1) {
    const angle = (Math.PI * 2 * i) / sparkCount;
    const spark = scene.add.rectangle(x, y, strong ? 8 : 6, strong ? 2.2 : 1.8, accent, strong ? 0.74 : 0.52)
      .setDepth(depth + 1)
      .setBlendMode('ADD')
      .setRotation(angle);
    scene.tweens.add({
      targets: spark,
      x: x + Math.cos(angle) * (strong ? 34 : 24),
      y: y + Math.sin(angle) * (strong ? 26 : 18),
      alpha: 0,
      scaleX: 0.35,
      duration: strong ? 230 : 180,
      ease: 'Quad.easeOut',
      onComplete: () => spark.destroy(),
    });
  }
}

/**
 * UIを押した瞬間に、紙片が沈むような縮み・戻り・小さな灯りを入れる共通フィードバック。
 * ゲーム数値には触らず、入力レスポンスの気持ちよさだけを上げる。
 */
export function attachPressFeedback(
  scene: Phaser.Scene,
  hit: InteractiveObject,
  visual: PressVisual,
  options: PressFeedbackOptions = {},
): void {
  const baseScaleX = visual.scaleX;
  const baseScaleY = visual.scaleY;
  const baseY = visual.y;
  const accent = options.accent ?? 0xffd77a;
  const width = options.width ?? 96;
  const height = options.height ?? 42;
  const depth = options.depth ?? VIEW_DEPTH.overlay + 12;
  const strong = options.strong ?? false;
  const x = options.x ?? visual.x;
  const y = options.y ?? visual.y;

  const settle = (): void => {
    scene.tweens.killTweensOf(visual);
    scene.tweens.add({
      targets: visual,
      scaleX: baseScaleX,
      scaleY: baseScaleY,
      y: baseY,
      duration: 130,
      ease: 'Back.easeOut',
    });
  };

  hit.on(Phaser.Input.Events.POINTER_OVER, () => {
    scene.tweens.killTweensOf(visual);
    scene.tweens.add({
      targets: visual,
      scaleX: baseScaleX * 1.018,
      scaleY: baseScaleY * 1.018,
      y: baseY - 0.5,
      duration: 90,
      ease: 'Quad.easeOut',
    });
  });

  hit.on(Phaser.Input.Events.POINTER_OUT, settle);
  hit.on(Phaser.Input.Events.POINTER_UP, settle);
  hit.on('pointerupoutside', settle);

  hit.on(Phaser.Input.Events.POINTER_DOWN, () => {
    scene.tweens.killTweensOf(visual);
    scene.tweens.add({
      targets: visual,
      scaleX: baseScaleX * (strong ? 0.94 : 0.965),
      scaleY: baseScaleY * (strong ? 0.92 : 0.955),
      y: baseY + (strong ? 2 : 1),
      duration: 56,
      ease: 'Quad.easeOut',
    });
    pressBurst(scene, x, y, width, height, accent, depth, strong);
    requestAppHaptic(strong ? 12 : 6);
    if (options.shake && !reducedMotionEnabled()) {
      scene.cameras.main.shake(strong ? 50 : 32, strong ? 0.0013 : 0.0008);
    }
  });
}
