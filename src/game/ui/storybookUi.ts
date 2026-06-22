import Phaser from 'phaser';
import type { InventoryIconCategory } from '../assets/inventoryIcons';
import { BODY_FONT, NUMBER_FONT, TITLE_FONT } from './fonts';

export const STORYBOOK_FONT = BODY_FONT;
export const STORYBOOK_TITLE_FONT = TITLE_FONT;
export const STORYBOOK_NUMBER_FONT = NUMBER_FONT;

type StorybookUiTokens = {
  night: number;
  nightPanel: number;
  gold: number;
  goldLight: number;
  paper: number;
  paperLight: number;
  paperShadow: number;
  paperEdge: number;
  textDark: string;
  textSoft: string;
  textLight: string;
  textMuted: string;
  hp: number;
  hpBack: number;
  xp: number;
  weapon: number;
  passive: number;
  rare: number;
  special: number;
};

export const STORYBOOK_UI: StorybookUiTokens = {
  night: 0x0b1022,
  nightPanel: 0x10162d,
  gold: 0xd2a45c,
  goldLight: 0xf4d69a,
  paper: 0xe8d8b8,
  paperLight: 0xf4ead4,
  paperShadow: 0xc3aa85,
  paperEdge: 0x6c5747,
  textDark: '#2e2730',
  textSoft: '#6c5d52',
  textLight: '#f4e8cf',
  textMuted: '#cabda8',
  hp: 0xe56f7c,
  hpBack: 0x5b3442,
  xp: 0x9c74c5,
  weapon: 0xd7a65b,
  passive: 0xa98bd2,
  rare: 0x79bea9,
  special: 0xd9879b,
};

export function storybookCategoryPalette(category: InventoryIconCategory | 'heal') {
  switch (category) {
    case 'weapon': return { accent: STORYBOOK_UI.weapon, paper: 0xead9b8, label: '武器' };
    case 'passive': return { accent: STORYBOOK_UI.passive, paper: 0xe5d9bd, label: '忘れ物' };
    case 'rare': return { accent: STORYBOOK_UI.rare, paper: 0xe4dbc0, label: 'レア' };
    case 'heal': return { accent: STORYBOOK_UI.special, paper: 0xebd9c0, label: '回復' };
  }
}

export function drawStorybookPanel(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: number = STORYBOOK_UI.nightPanel,
  edge: number = STORYBOOK_UI.gold,
  alpha: number = 0.92,
): Phaser.GameObjects.Graphics {
  const left = Math.round(x - width / 2);
  const top = Math.round(y - height / 2);
  g.fillStyle(0x050817, 0.45).fillRect(left + 2, top + 3, width, height);
  g.fillStyle(fill, alpha).fillRect(left, top, width, height);
  g.lineStyle(1, edge, 0.92).strokeRect(left, top, width, height);
  g.lineStyle(1, edge, 0.22).strokeRect(left + 5, top + 5, width - 10, height - 10);
  g.fillStyle(edge, 0.8);
  const right = left + width;
  const bottom = top + height;
  const marks: Array<[number, number, number, number]> = [
    [left + 4, top + 4, 10, 1], [left + 4, top + 4, 1, 10],
    [right - 14, top + 4, 10, 1], [right - 5, top + 4, 1, 10],
    [left + 4, bottom - 5, 10, 1], [left + 4, bottom - 14, 1, 10],
    [right - 14, bottom - 5, 10, 1], [right - 5, bottom - 14, 1, 10],
  ];
  for (const [cx, cy, w, h] of marks) g.fillRect(cx, cy, w, h);
  return g;
}

export function drawPaperCard(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  accent: number,
  paper: number = STORYBOOK_UI.paper,
): Phaser.GameObjects.Graphics {
  const left = Math.round(x - width / 2);
  const top = Math.round(y - height / 2);
  g.fillStyle(0x050817, 0.32).fillRect(left + 3, top + 4, width, height);
  g.fillStyle(paper, 1).fillRect(left, top, width, height);
  g.lineStyle(2, STORYBOOK_UI.paperEdge, 0.95).strokeRect(left, top, width, height);
  g.lineStyle(1, accent, 0.78).strokeRect(left + 5, top + 5, width - 10, height - 10);
  g.fillStyle(STORYBOOK_UI.paperLight, 0.42).fillRect(left + 8, top + 9, width - 16, 2);
  g.fillStyle(STORYBOOK_UI.paperShadow, 0.35).fillRect(left + 8, top + height - 11, width - 16, 2);
  return g;
}

export function drawStar(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  fill: number,
  edge: number = STORYBOOK_UI.paperEdge,
  alpha: number = 1,
): Phaser.GameObjects.Graphics {
  const s = Math.max(4, Math.round(size));
  const points: Phaser.Math.Vector2[] = [
    new Phaser.Math.Vector2(x, y - s),
    new Phaser.Math.Vector2(x + s * 0.34, y - s * 0.35),
    new Phaser.Math.Vector2(x + s, y),
    new Phaser.Math.Vector2(x + s * 0.34, y + s * 0.35),
    new Phaser.Math.Vector2(x, y + s),
    new Phaser.Math.Vector2(x - s * 0.34, y + s * 0.35),
    new Phaser.Math.Vector2(x - s, y),
    new Phaser.Math.Vector2(x - s * 0.34, y - s * 0.35),
  ];
  g.fillStyle(fill, alpha).fillPoints(points, true);
  g.lineStyle(1, edge, alpha).strokePoints(points, true);
  return g;
}

export function drawHeart(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number = 18): Phaser.GameObjects.Graphics {
  const u = Math.max(2, Math.round(size / 5));
  const ox = Math.round(x - u * 2.5);
  const oy = Math.round(y - u * 2);
  const cells: Array<[number, number]> = [[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[1,3],[2,3],[3,3],[2,4]];
  g.fillStyle(STORYBOOK_UI.hp, 1);
  for (const [cx, cy] of cells) g.fillRect(ox + cx * u, oy + cy * u, u, u);
  g.fillStyle(0xffb0b7, 0.85).fillRect(ox + u, oy + u, u, u);
  return g;
}

export function drawFragment(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number = 10): Phaser.GameObjects.Graphics {
  drawStar(g, x, y, size, STORYBOOK_UI.goldLight, STORYBOOK_UI.gold, 1);
  g.fillStyle(0xffffff, 0.9).fillRect(Math.round(x - 1), Math.round(y - 3), 2, 5);
  return g;
}

export function drawPause(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number = 34): Phaser.GameObjects.Graphics {
  const half = Math.round(size / 2);
  g.fillStyle(STORYBOOK_UI.nightPanel, 0.94).fillRect(x - half, y - half, size, size);
  g.lineStyle(1, STORYBOOK_UI.gold, 0.92).strokeRect(x - half, y - half, size, size);
  g.fillStyle(STORYBOOK_UI.paperLight, 1);
  const w = Math.max(3, Math.round(size * 0.17));
  const h = Math.max(10, Math.round(size * 0.48));
  g.fillRect(Math.round(x - w - 2), Math.round(y - h / 2), w, h);
  g.fillRect(Math.round(x + 2), Math.round(y - h / 2), w, h);
  return g;
}

export function drawBar(g: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, ratio: number, back: number, fill: number): Phaser.GameObjects.Graphics {
  const r = Phaser.Math.Clamp(ratio, 0, 1);
  g.fillStyle(0x080b19, 0.8).fillRect(x, y, width, height);
  g.fillStyle(back, 1).fillRect(x + 1, y + 1, width - 2, height - 2);
  g.fillStyle(fill, 1).fillRect(x + 2, y + 2, Math.max(0, Math.round((width - 4) * r)), height - 4);
  g.fillStyle(0xffffff, 0.28).fillRect(x + 3, y + 2, Math.max(0, Math.round((width - 6) * r)), 1);
  return g;
}
