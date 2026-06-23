import Phaser from 'phaser';
import { STORYBOOK_UI } from './storybookUi';

export function drawInkVignette(
  g: Phaser.GameObjects.Graphics,
  width: number,
  height: number,
  options: { alpha?: number; depthInk?: boolean } = {},
): Phaser.GameObjects.Graphics {
  const alpha = options.alpha ?? 0.34;
  g.fillStyle(0x030512, alpha).fillRect(0, 0, width, 34);
  g.fillStyle(0x030512, alpha * 0.8).fillRect(0, height - 42, width, 42);
  g.fillStyle(0x030512, alpha * 0.72).fillRect(0, 0, 18, height);
  g.fillStyle(0x030512, alpha * 0.72).fillRect(width - 18, 0, 18, height);

  if (options.depthInk ?? true) {
    g.fillStyle(0x050717, alpha * 0.9);
    g.fillCircle(4, 120, 42);
    g.fillCircle(width - 2, 232, 54);
    g.fillCircle(8, height - 152, 48);
    g.fillStyle(0x191126, alpha * 0.38);
    g.fillCircle(width - 16, height - 92, 34);
  }
  return g;
}

export function drawPaperScrap(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number = STORYBOOK_UI.paperLight,
  alpha: number = 0.1,
): Phaser.GameObjects.Graphics {
  const left = Math.round(x - width / 2);
  const top = Math.round(y - height / 2);
  const chip = Math.max(2, Math.round(Math.min(width, height) * 0.18));
  const points: Phaser.Math.Vector2[] = [
    new Phaser.Math.Vector2(left + chip, top),
    new Phaser.Math.Vector2(left + width, top + 1),
    new Phaser.Math.Vector2(left + width - 1, top + height - chip),
    new Phaser.Math.Vector2(left + width - chip, top + height),
    new Phaser.Math.Vector2(left, top + height - 1),
    new Phaser.Math.Vector2(left + 1, top + chip),
  ];
  g.fillStyle(color, alpha).fillPoints(points, true);
  return g;
}

export function drawPremiumPaperCard(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    accent?: number;
    paper?: number;
    shadowAlpha?: number;
    selected?: boolean;
    muted?: boolean;
  } = {},
): Phaser.GameObjects.Graphics {
  const accent = options.accent ?? STORYBOOK_UI.gold;
  const paper = options.paper ?? STORYBOOK_UI.paperLight;
  const selected = options.selected ?? false;
  const muted = options.muted ?? false;
  const left = Math.round(x - width / 2);
  const top = Math.round(y - height / 2);
  const right = left + width;
  const bottom = top + height;
  const chip = 6;
  const points: Phaser.Math.Vector2[] = [
    new Phaser.Math.Vector2(left + chip, top),
    new Phaser.Math.Vector2(right - 2, top + 2),
    new Phaser.Math.Vector2(right, bottom - chip),
    new Phaser.Math.Vector2(right - chip, bottom),
    new Phaser.Math.Vector2(left + 2, bottom - 2),
    new Phaser.Math.Vector2(left, top + chip),
  ];

  g.fillStyle(0x050817, options.shadowAlpha ?? 0.34).fillPoints(points.map((p) => new Phaser.Math.Vector2(p.x + 3, p.y + 4)), true);
  g.fillStyle(muted ? 0x2b2840 : paper, muted ? 0.94 : 1).fillPoints(points, true);
  g.lineStyle(selected ? 2 : 1, selected ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperEdge, selected ? 0.98 : 0.86).strokePoints(points, true);
  g.lineStyle(1, accent, selected ? 0.82 : 0.46).strokeRect(left + 7, top + 7, width - 14, height - 14);

  g.fillStyle(STORYBOOK_UI.paperLight, muted ? 0.08 : 0.34).fillRect(left + 12, top + 10, width - 24, 2);
  g.fillStyle(STORYBOOK_UI.paperShadow, muted ? 0.12 : 0.28).fillRect(left + 12, bottom - 12, width - 24, 2);

  if (selected) {
    g.lineStyle(2, STORYBOOK_UI.goldLight, 0.16).strokeRect(left - 3, top - 3, width + 6, height + 6);
    g.fillStyle(STORYBOOK_UI.goldLight, 0.16).fillCircle(left + 14, top + 13, 5);
    g.fillStyle(STORYBOOK_UI.goldLight, 0.14).fillCircle(right - 14, bottom - 13, 4);
  }

  return g;
}

export function drawLanternFocus(
  scene: Phaser.Scene,
  x: number,
  y: number,
  options: { radius?: number; depth?: number; alpha?: number } = {},
): Phaser.GameObjects.Container {
  const radius = options.radius ?? 84;
  const depth = options.depth ?? 1;
  const alpha = options.alpha ?? 0.18;
  const c = scene.add.container(x, y).setDepth(depth);
  const outer = scene.add.circle(0, 0, radius, STORYBOOK_UI.goldLight, alpha).setBlendMode('ADD');
  const mid = scene.add.circle(0, 0, radius * 0.48, STORYBOOK_UI.gold, alpha * 1.2).setBlendMode('ADD');
  const core = scene.add.circle(0, 0, Math.max(5, radius * 0.08), 0xfff0bd, alpha * 2.3).setBlendMode('ADD');
  c.add([outer, mid, core]);
  scene.tweens.add({
    targets: [outer, mid],
    alpha: { from: alpha * 0.72, to: alpha * 1.18 },
    scale: { from: 0.96, to: 1.04 },
    duration: 2200,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
  return c;
}

export function drawNewSparkBadge(
  scene: Phaser.Scene,
  x: number,
  y: number,
  count: number,
  options: { depth?: number; label?: string } = {},
): Phaser.GameObjects.Container {
  const depth = options.depth ?? 20;
  const c = scene.add.container(x, y).setDepth(depth);
  const glow = scene.add.circle(0, 0, 13, STORYBOOK_UI.goldLight, 0.16).setBlendMode('ADD');
  const core = scene.add.circle(0, 0, 5, STORYBOOK_UI.goldLight, 0.96).setBlendMode('ADD');
  const tag = scene.add.rectangle(17, -6, 24, 14, STORYBOOK_UI.nightPanel, 0.88);
  tag.setStrokeStyle(1, STORYBOOK_UI.gold, 0.72);
  const text = scene.add.text(17, -6, options.label ?? `${count}`, {
    fontFamily: 'sans-serif',
    fontSize: '10px',
    color: STORYBOOK_UI.textLight,
    fontStyle: 'bold',
    resolution: 2,
  }).setOrigin(0.5);
  c.add([glow, core, tag, text]);
  scene.tweens.add({
    targets: [glow, core],
    alpha: { from: 0.55, to: 1 },
    scale: { from: 0.9, to: 1.12 },
    duration: 980,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
  return c;
}

export function drawMapThreads(
  g: Phaser.GameObjects.Graphics,
  cx: number,
  y: number,
  width: number,
  alpha: number = 0.18,
): Phaser.GameObjects.Graphics {
  const left = Math.round(cx - width / 2);
  const right = Math.round(cx + width / 2);
  g.lineStyle(1, STORYBOOK_UI.gold, alpha);
  g.beginPath();
  g.moveTo(left, y);
  g.lineTo(left + width * 0.23, y - 8);
  g.lineTo(left + width * 0.52, y + 4);
  g.lineTo(left + width * 0.76, y - 6);
  g.lineTo(right, y + 2);
  g.strokePath();
  g.fillStyle(STORYBOOK_UI.goldLight, alpha * 1.4);
  g.fillCircle(left + width * 0.23, y - 8, 2);
  g.fillCircle(left + width * 0.52, y + 4, 2);
  g.fillCircle(left + width * 0.76, y - 6, 2);
  return g;
}
