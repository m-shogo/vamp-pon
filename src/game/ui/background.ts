import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';

/** 夜の街の床（紙片風）。視認性優先で薄く描く。 */
export function createBackground(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  c.setDepth(VIEW_DEPTH.background);

  const base = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.background);
  c.add(base);

  const g = scene.add.graphics();
  // 薄いタイルの格子
  g.lineStyle(1, COLORS.backgroundTile, 0.5);
  const step = 56;
  for (let x = 0; x <= GAME_WIDTH; x += step) g.lineBetween(x, 0, x, GAME_HEIGHT);
  for (let y = 0; y <= GAME_HEIGHT; y += step) g.lineBetween(0, y, GAME_WIDTH, y);

  // 散らばった紙片（控えめ）
  for (let i = 0; i < 26; i += 1) {
    const x = Math.random() * GAME_WIDTH;
    const y = Math.random() * GAME_HEIGHT;
    const s = 4 + Math.random() * 6;
    g.fillStyle(COLORS.backgroundTile, 0.6).fillRect(x, y, s, s * 0.7);
  }
  c.add(g);

  // 隅の街灯の淡い光
  const lampSpots = [
    { x: 30, y: 90 },
    { x: GAME_WIDTH - 30, y: 230 },
    { x: 40, y: GAME_HEIGHT - 160 },
  ];
  for (const spot of lampSpots) {
    const glow = scene.add.circle(spot.x, spot.y, 40, COLORS.lantern, 0.05);
    c.add(glow);
  }

  return c;
}
