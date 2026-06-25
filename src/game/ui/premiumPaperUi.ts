import Phaser from 'phaser';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI } from './storybookUi';

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

  const highlightAlpha = muted ? 0.08 : 0.34;
  const shadowAlpha = muted ? 0.12 : 0.28;
  g.fillStyle(STORYBOOK_UI.paperLight, highlightAlpha).fillRect(left + 12, top + 10, width - 24, 2);
  g.fillStyle(STORYBOOK_UI.paperShadow, shadowAlpha).fillRect(left + 12, bottom - 12, width - 24, 2);

  g.lineStyle(1, muted ? STORYBOOK_UI.gold : STORYBOOK_UI.paperEdge, muted ? 0.09 : 0.12);
  g.lineBetween(left + 16, top + Math.max(18, Math.floor(height * 0.32)), right - 24, top + Math.max(19, Math.floor(height * 0.32)));
  if (height >= 42) {
    g.lineBetween(left + 22, bottom - Math.max(20, Math.floor(height * 0.26)), right - 32, bottom - Math.max(21, Math.floor(height * 0.26)));
  }

  g.fillStyle(accent, selected ? 0.18 : 0.1);
  g.fillCircle(left + 12, top + 12, selected ? 4 : 3);
  g.fillStyle(STORYBOOK_UI.paperEdge, muted ? 0.08 : 0.1);
  g.fillRect(right - 17, bottom - 12, 8, 2);
  g.fillRect(left + 13, bottom - 13, 5, 1);

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
    fontFamily: STORYBOOK_FONT,
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

export function drawLargeNotebookPage(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { accent?: number; alpha?: number } = {},
): Phaser.GameObjects.Graphics {
  const accent = options.accent ?? STORYBOOK_UI.gold;
  const alpha = options.alpha ?? 1;
  const left = Math.round(x - width / 2);
  const top = Math.round(y - height / 2);
  const chip = 8;
  const points: Phaser.Math.Vector2[] = [
    new Phaser.Math.Vector2(left + chip, top),
    new Phaser.Math.Vector2(left + width - 2, top + 2),
    new Phaser.Math.Vector2(left + width, top + height - chip),
    new Phaser.Math.Vector2(left + width - chip, top + height),
    new Phaser.Math.Vector2(left + 2, top + height - 2),
    new Phaser.Math.Vector2(left, top + chip),
  ];
  g.fillStyle(STORYBOOK_UI.inkBlack, 0.38 * alpha).fillPoints(
    points.map((p) => new Phaser.Math.Vector2(p.x + 4, p.y + 5)), true,
  );
  g.fillStyle(STORYBOOK_UI.paperBeige, alpha).fillPoints(points, true);
  g.lineStyle(2, STORYBOOK_UI.paperEdge, 0.9 * alpha).strokePoints(points, true);
  g.lineStyle(1, accent, 0.4 * alpha).strokeRect(left + 8, top + 8, width - 16, height - 16);
  g.fillStyle(STORYBOOK_UI.paperLight, 0.32 * alpha).fillRect(left + 12, top + 12, width - 24, 2);
  g.fillStyle(STORYBOOK_UI.paperShadow, 0.24 * alpha).fillRect(left + 12, top + height - 14, width - 24, 2);
  const lineSpacing = 28;
  const lineStartY = top + 42;
  const lineEndY = top + height - 30;
  g.lineStyle(1, STORYBOOK_UI.paperEdge, 0.08 * alpha);
  for (let ly = lineStartY; ly < lineEndY; ly += lineSpacing) {
    g.lineBetween(left + 24, ly, left + width - 24, ly);
  }
  g.fillStyle(STORYBOOK_UI.paperEdge, 0.06 * alpha);
  g.fillRect(left + 32, top + 16, 1, height - 32);
  return g;
}

export function drawWaxSeal(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  radius: number,
  options: { color?: number; alpha?: number; notches?: number } = {},
): Phaser.GameObjects.Graphics {
  const color = options.color ?? STORYBOOK_UI.dustyRose;
  const alpha = options.alpha ?? 1;
  const notches = options.notches ?? 12;
  g.fillStyle(STORYBOOK_UI.inkBlack, 0.3 * alpha);
  g.fillCircle(x + 2, y + 3, radius);
  const points: Phaser.Math.Vector2[] = [];
  for (let i = 0; i < notches; i++) {
    const angle = (i / notches) * Math.PI * 2;
    const r = radius + (i % 2 === 0 ? 3 : -1);
    points.push(new Phaser.Math.Vector2(
      x + Math.cos(angle) * r,
      y + Math.sin(angle) * r,
    ));
  }
  g.fillStyle(color, alpha).fillPoints(points, true);
  g.fillStyle(0x000000, 0.12 * alpha).fillCircle(x, y, radius * 0.92);
  g.fillStyle(color, 0.95 * alpha).fillCircle(x, y, radius * 0.82);
  g.lineStyle(2, 0x000000, 0.18 * alpha);
  g.strokeCircle(x, y, radius * 0.6);
  g.fillStyle(STORYBOOK_UI.paperLight, 0.15 * alpha);
  g.fillCircle(x - radius * 0.2, y - radius * 0.25, radius * 0.18);
  return g;
}

export function drawRankSeal(
  scene: Phaser.Scene,
  x: number,
  y: number,
  rank: string,
  options: { radius?: number; depth?: number } = {},
): Phaser.GameObjects.Container {
  const radius = options.radius ?? 34;
  const depth = options.depth ?? 10;
  const sealColor = rank === 'S' ? 0xc9874a : rank === 'A' ? STORYBOOK_UI.dustyRose : rank === 'B' ? STORYBOOK_UI.mutedTeal : STORYBOOK_UI.paperDark;
  const textColor = rank === 'S' ? STORYBOOK_UI.lanternCore : rank === 'A' ? STORYBOOK_UI.paperLight : rank === 'B' ? STORYBOOK_UI.paperLight : STORYBOOK_UI.paperBeige;
  const c = scene.add.container(x, y).setDepth(depth);
  const sealG = scene.add.graphics();
  drawWaxSeal(sealG, 0, 0, radius, { color: sealColor });
  c.add(sealG);
  const rankText = scene.add.text(0, -1, rank, {
    fontFamily: STORYBOOK_TITLE_FONT,
    fontSize: `${Math.round(radius * 0.9)}px`,
    color: '#' + textColor.toString(16).padStart(6, '0'),
    fontStyle: 'bold',
    resolution: 2,
  }).setOrigin(0.5);
  c.add(rankText);
  if (rank === 'S' || rank === 'A') {
    const glow = scene.add.circle(0, 0, radius + 10, STORYBOOK_UI.warmAmber, 0.1).setBlendMode('ADD');
    c.addAt(glow, 0);
    scene.tweens.add({
      targets: glow,
      alpha: { from: 0.06, to: 0.16 },
      scale: { from: 0.95, to: 1.08 },
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
  return c;
}

export function drawDawnGlow(
  scene: Phaser.Scene,
  width: number,
  options: { y?: number; height?: number; alpha?: number; depth?: number } = {},
): Phaser.GameObjects.Container {
  const y = options.y ?? 60;
  const height = options.height ?? 200;
  const alpha = options.alpha ?? 0.06;
  const depth = options.depth ?? 0;
  const c = scene.add.container(0, 0).setDepth(depth);
  const warm = scene.add.rectangle(width / 2, y, width, height, STORYBOOK_UI.dawnPeach, alpha).setBlendMode('ADD');
  const core = scene.add.rectangle(width / 2, y - 20, width * 0.6, height * 0.4, STORYBOOK_UI.lanternCore, alpha * 0.6).setBlendMode('ADD');
  c.add([warm, core]);
  scene.tweens.add({
    targets: warm,
    alpha: { from: alpha * 0.6, to: alpha * 1.3 },
    duration: 2800,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
  scene.tweens.add({
    targets: core,
    alpha: { from: alpha * 0.3, to: alpha * 0.8 },
    duration: 3200,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
  return c;
}

export function drawRewardIconCard(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  options: { accent?: number; alpha?: number } = {},
): Phaser.GameObjects.Graphics {
  const accent = options.accent ?? STORYBOOK_UI.gold;
  const alpha = options.alpha ?? 1;
  const half = Math.round(size / 2);
  const left = x - half;
  const top = y - half;
  g.fillStyle(STORYBOOK_UI.inkBlack, 0.2 * alpha).fillRect(left + 2, top + 3, size, size);
  g.fillStyle(STORYBOOK_UI.paperBeige, 0.95 * alpha).fillRect(left, top, size, size);
  g.lineStyle(1, STORYBOOK_UI.paperEdge, 0.7 * alpha).strokeRect(left, top, size, size);
  g.lineStyle(1, accent, 0.35 * alpha).strokeRect(left + 3, top + 3, size - 6, size - 6);
  return g;
}

export function drawPrimaryPaperCta(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { accent?: number; paper?: number } = {},
): Phaser.GameObjects.Graphics {
  const accent = options.accent ?? STORYBOOK_UI.warmAmber;
  const paper = options.paper ?? STORYBOOK_UI.paperBeige;
  const left = Math.round(x - width / 2);
  const top = Math.round(y - height / 2);
  g.fillStyle(STORYBOOK_UI.inkBlack, 0.32).fillRect(left + 3, top + 4, width, height);
  g.fillStyle(paper, 1).fillRect(left, top, width, height);
  g.fillStyle(accent, 0.18).fillRect(left, top, width, height);
  g.lineStyle(2, STORYBOOK_UI.paperEdge, 0.92).strokeRect(left, top, width, height);
  g.lineStyle(1, accent, 0.72).strokeRect(left + 4, top + 4, width - 8, height - 8);
  g.fillStyle(STORYBOOK_UI.paperLight, 0.3).fillRect(left + 6, top + 5, width - 12, 2);
  g.fillStyle(accent, 0.14).fillCircle(left + 10, top + height / 2, 3);
  g.fillStyle(accent, 0.14).fillCircle(left + width - 10, top + height / 2, 3);
  return g;
}

export function drawSecondaryPaperButton(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { accent?: number } = {},
): Phaser.GameObjects.Graphics {
  const accent = options.accent ?? STORYBOOK_UI.gold;
  const left = Math.round(x - width / 2);
  const top = Math.round(y - height / 2);
  g.fillStyle(STORYBOOK_UI.deepNight, 0.92).fillRect(left, top, width, height);
  g.lineStyle(1, accent, 0.6).strokeRect(left, top, width, height);
  g.lineStyle(1, accent, 0.18).strokeRect(left + 3, top + 3, width - 6, height - 6);
  return g;
}

export function drawInkDivider(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  options: { color?: number; alpha?: number } = {},
): Phaser.GameObjects.Graphics {
  const color = options.color ?? STORYBOOK_UI.paperEdge;
  const alpha = options.alpha ?? 0.3;
  const left = Math.round(x - width / 2);
  g.lineStyle(1, color, alpha);
  g.lineBetween(left, y, left + width, y);
  g.fillStyle(color, alpha * 0.6);
  g.fillCircle(x, y, 2);
  g.fillCircle(left + 8, y, 1);
  g.fillCircle(left + width - 8, y, 1);
  return g;
}

export function drawStarMapBackdrop(
  g: Phaser.GameObjects.Graphics,
  width: number,
  height: number,
  options: { alpha?: number; density?: number } = {},
): Phaser.GameObjects.Graphics {
  const alpha = options.alpha ?? 0.12;
  const density = options.density ?? 30;
  g.lineStyle(1, STORYBOOK_UI.paperEdge, alpha * 0.5);
  const seed = 42;
  for (let i = 0; i < density; i++) {
    const sx = ((seed * (i + 1) * 7) % width);
    const sy = ((seed * (i + 1) * 13) % height);
    g.fillStyle(STORYBOOK_UI.paperLight, alpha * (0.4 + (i % 3) * 0.2));
    g.fillCircle(sx, sy, 1 + (i % 3) * 0.5);
    if (i > 0 && i % 4 === 0) {
      const px = ((seed * i * 7) % width);
      const py = ((seed * i * 13) % height);
      g.lineStyle(1, STORYBOOK_UI.paperEdge, alpha * 0.2);
      g.lineBetween(px, py, sx, sy);
    }
  }
  return g;
}
