import type Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { FONT } from './visualDesign';

const FLECK_COUNT = 7;

/**
 * エリート撃破直後の短い「静寂→報酬」ビート。
 * ゲーム時間・敵速度・ドロップ・当たり判定は変えず、視覚演出だけを追加する。
 */
export function eliteDefeatBeat(scene: Phaser.Scene, x: number, y: number): void {
  const worldDepth = VIEW_DEPTH.pickup + 4;
  const overlayDepth = VIEW_DEPTH.overlay - 12;
  const labelX = clamp(x, 86, GAME_WIDTH - 86);
  const labelY = clamp(y - 48, 92, GAME_HEIGHT - 156);

  scene.cameras.main.shake(95, 0.0015);

  const quietVeil = scene.add
    .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xeee1bd, 0.075)
    .setDepth(overlayDepth)
    .setScrollFactor(0);
  const ring = scene.add.circle(x, y, 24, COLORS.fragmentGlow, 0.045).setDepth(worldDepth);
  ring.setStrokeStyle(3, COLORS.fragmentGlow, 0.72);
  const innerRing = scene.add.circle(x, y, 12, COLORS.paperScrap, 0.06).setDepth(worldDepth + 1);
  innerRing.setStrokeStyle(2, COLORS.paperScrap, 0.62);

  const label = scene.add.text(labelX, labelY, '記憶がほどけた', {
    fontFamily: FONT,
    fontSize: '13px',
    color: '#ffe7a8',
    fontStyle: 'bold',
    resolution: 2,
  }).setOrigin(0.5).setDepth(overlayDepth + 1);

  for (let index = 0; index < FLECK_COUNT; index += 1) {
    const angle = (index / FLECK_COUNT) * Math.PI * 2 + 0.22;
    const distance = 30 + (index % 3) * 8;
    const fleck = scene.add.rectangle(
      x + Math.cos(angle) * 7,
      y + Math.sin(angle) * 7,
      7 + index % 2 * 3,
      4 + index % 3,
      index % 2 === 0 ? COLORS.paperScrap : COLORS.fragmentGlow,
      0.72,
    ).setDepth(worldDepth + 2).setAngle(index * 19);

    scene.tweens.add({
      targets: fleck,
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance - 8,
      angle: fleck.angle + 35 + index * 7,
      alpha: 0,
      duration: 420 + index * 18,
      ease: 'Quad.easeOut',
      onComplete: () => fleck.destroy(),
    });
  }

  scene.tweens.add({
    targets: quietVeil,
    alpha: 0,
    duration: 190,
    ease: 'Quad.easeOut',
    onComplete: () => quietVeil.destroy(),
  });
  scene.tweens.add({
    targets: ring,
    scale: 3.8,
    alpha: 0,
    duration: 520,
    ease: 'Cubic.easeOut',
    onComplete: () => ring.destroy(),
  });
  scene.tweens.add({
    targets: innerRing,
    scale: 2.3,
    alpha: 0,
    duration: 360,
    ease: 'Quad.easeOut',
    onComplete: () => innerRing.destroy(),
  });
  scene.tweens.add({
    targets: label,
    y: label.y - 16,
    alpha: 0,
    delay: 120,
    duration: 560,
    ease: 'Quad.easeOut',
    onComplete: () => label.destroy(),
  });
}

export function eliteDefeatLabelPosition(x: number, y: number): { x: number; y: number } {
  return {
    x: clamp(x, 86, GAME_WIDTH - 86),
    y: clamp(y - 48, 92, GAME_HEIGHT - 156),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
