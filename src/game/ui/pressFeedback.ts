import Phaser from 'phaser';
import { VIEW_DEPTH } from './factory';

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
  setScale: (x: number, y?: number) => PressVisual;
  setAlpha?: (alpha: number) => PressVisual;
};

function vibrate(ms: number): void {
  if (typeof navigator === 'undefined') return;
  navigator.vibrate?.(ms);
}

function pressBurst(scene: Phaser.Scene, x: number, y: number, width: number, height: number, accent: number, depth: number, strong: boolean): void {
  const ringRadius = Math.max(width, height) * (strong ? 0.5 : 0.43);
  const ring = scene.add.circle(x, y, ringRadius, accent, strong ? 0.12 : 0.08).setDepth(depth).setBlendMode('ADD');
  ring.setStrokeStyle(strong ? 4 : 3, accent, strong ? 0.88 : 0.62);
  scene.tweens.add({
    targets: ring,
    scale: strong ? 1.55 : 1.32,
    alpha: 0,
    duration: strong ? 280 : 220,
    ease: 'Cubic.easeOut',
    onComplete: () => ring.destroy(),
  });

  const sparkCount = strong ? 8 : 5;
  for (let i = 0; i < sparkCount; i += 1) {
    const angle = (Math.PI * 2 * i) / sparkCount;
    const spark = scene.add.rectangle(x, y, strong ? 9 : 7, strong ? 2.4 : 2, accent, strong ? 0.82 : 0.62)
      .setDepth(depth + 1)
      .setBlendMode('ADD')
      .setRotation(angle);
    scene.tweens.add({
      targets: spark,
      x: x + Math.cos(angle) * (strong ? 42 : 30),
      y: y + Math.sin(angle) * (strong ? 32 : 22),
      alpha: 0,
      scaleX: 0.35,
      duration: strong ? 260 : 210,
      ease: 'Quad.easeOut',
      onComplete: () => spark.destroy(),
    });
  }
}

/**
 * UIを押した瞬間に、縮み→戻り・光のリング・小さな振動を入れる共通フィードバック。
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
      duration: 120,
      ease: 'Back.easeOut',
    });
  };

  hit.on(Phaser.Input.Events.POINTER_OVER, () => {
    scene.tweens.killTweensOf(visual);
    scene.tweens.add({
      targets: visual,
      scaleX: baseScaleX * 1.025,
      scaleY: baseScaleY * 1.025,
      duration: 90,
      ease: 'Quad.easeOut',
    });
  });

  hit.on(Phaser.Input.Events.POINTER_OUT, settle);
  hit.on(Phaser.Input.Events.POINTER_UP, settle);
  hit.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, settle);

  hit.on(Phaser.Input.Events.POINTER_DOWN, () => {
    scene.tweens.killTweensOf(visual);
    scene.tweens.add({
      targets: visual,
      scaleX: baseScaleX * (strong ? 0.91 : 0.94),
      scaleY: baseScaleY * (strong ? 0.91 : 0.94),
      duration: 54,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
    pressBurst(scene, x, y, width, height, accent, depth, strong);
    vibrate(strong ? 14 : 8);
    if (options.shake) scene.cameras.main.shake(strong ? 70 : 45, strong ? 0.0018 : 0.0011);
  });
}
