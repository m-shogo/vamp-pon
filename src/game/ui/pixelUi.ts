import Phaser from 'phaser';
import { BODY_FONT } from './fonts';

export const UI_FONT = BODY_FONT;

export type PixelPanelOptions = {
  fill: number;
  edge: number;
  accent?: number;
  alpha?: number;
  border?: number;
  cut?: number;
  dots?: boolean;
};

export function drawPixelPanel(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  options: PixelPanelOptions,
): Phaser.GameObjects.Graphics {
  const border = Math.max(1, Math.floor(options.border ?? 2));
  const cut = Math.max(border + 1, Math.floor(options.cut ?? 5));
  const alpha = options.alpha ?? 1;

  fillCutRect(graphics, x, y, width, height, cut, options.edge, alpha);
  fillCutRect(
    graphics,
    x,
    y,
    Math.max(1, width - border * 2),
    Math.max(1, height - border * 2),
    Math.max(1, cut - border),
    options.fill,
    alpha,
  );

  if (options.accent !== undefined) {
    graphics.fillStyle(options.accent, 0.9);
    const halfW = width / 2;
    const halfH = height / 2;
    const dot = 2;
    graphics.fillRect(Math.round(x - halfW + cut + 1), Math.round(y - halfH + 2), dot, dot);
    graphics.fillRect(Math.round(x + halfW - cut - 3), Math.round(y - halfH + 2), dot, dot);
    graphics.fillRect(Math.round(x - halfW + cut + 1), Math.round(y + halfH - 4), dot, dot);
    graphics.fillRect(Math.round(x + halfW - cut - 3), Math.round(y + halfH - 4), dot, dot);
  }

  if (options.dots) {
    graphics.fillStyle(options.edge, 0.45);
    graphics.fillRect(Math.round(x - width / 2 + 4), Math.round(y), 2, 2);
    graphics.fillRect(Math.round(x + width / 2 - 6), Math.round(y), 2, 2);
  }

  return graphics;
}

export function drawPixelBar(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  ratio: number,
  back: number,
  fill: number,
  segment = 6,
): Phaser.GameObjects.Graphics {
  const safeRatio = Phaser.Math.Clamp(ratio, 0, 1);
  graphics.fillStyle(back, 0.96).fillRect(x, y, width, height);
  const innerX = x + 2;
  const innerY = y + 2;
  const innerW = Math.max(0, width - 4);
  const innerH = Math.max(1, height - 4);
  const segmentGap = 1;
  const segmentWidth = Math.max(1, Math.floor((innerW - (segment - 1) * segmentGap) / segment));
  const activeWidth = innerW * safeRatio;
  graphics.fillStyle(fill, 1);
  let cursor = innerX;
  for (let index = 0; index < segment; index += 1) {
    const remaining = activeWidth - (cursor - innerX);
    if (remaining <= 0) break;
    const drawWidth = Math.min(segmentWidth, remaining);
    graphics.fillRect(Math.round(cursor), innerY, Math.max(1, Math.round(drawWidth)), innerH);
    cursor += segmentWidth + segmentGap;
  }
  return graphics;
}

type PixelAlign = 'left' | 'center' | 'right';

const GLYPHS: Record<string, string[]> = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  ':': ['00000', '00100', '00100', '00000', '00100', '00100', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '%': ['11001', '11010', '00100', '01000', '10110', '00110', '00000'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  'A': ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  'D': ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  'E': ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  'H': ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  'K': ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  'L': ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  'O': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  'P': ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  'R': ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  'T': ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  'V': ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  'Y': ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

export class PixelGlyphText {
  readonly container: Phaser.GameObjects.Container;
  private graphics: Phaser.GameObjects.Graphics;
  private value = '';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private blockSize: number,
    private color: number,
    private align: PixelAlign = 'left',
    private characterGap = 1,
  ) {
    this.container = scene.add.container(x, y);
    this.graphics = scene.add.graphics();
    this.container.add(this.graphics);
  }

  setText(value: string): this {
    const normalized = value.toUpperCase();
    if (normalized === this.value) return this;
    this.value = normalized;
    this.redraw();
    return this;
  }

  setColor(color: number): this {
    if (this.color === color) return this;
    this.color = color;
    this.redraw();
    return this;
  }

  setVisible(visible: boolean): this {
    this.container.setVisible(visible);
    return this;
  }

  setDepth(depth: number): this {
    this.container.setDepth(depth);
    return this;
  }

  setPosition(x: number, y: number): this {
    this.container.setPosition(x, y);
    return this;
  }

  destroy(): void {
    this.container.destroy(true);
  }

  private redraw(): void {
    this.graphics.clear();
    this.graphics.fillStyle(this.color, 1);
    const glyphWidth = 5 * this.blockSize;
    const gap = this.characterGap * this.blockSize;
    const totalWidth = this.value.length > 0
      ? this.value.length * glyphWidth + (this.value.length - 1) * gap
      : 0;
    let startX = 0;
    if (this.align === 'center') startX = -totalWidth / 2;
    if (this.align === 'right') startX = -totalWidth;

    Array.from(this.value).forEach((character, index) => {
      const rows = GLYPHS[character] ?? GLYPHS[' '];
      const glyphX = startX + index * (glyphWidth + gap);
      rows.forEach((row, rowIndex) => {
        Array.from(row).forEach((pixel, columnIndex) => {
          if (pixel !== '1') return;
          this.graphics.fillRect(
            Math.round(glyphX + columnIndex * this.blockSize),
            rowIndex * this.blockSize,
            this.blockSize,
            this.blockSize,
          );
        });
      });
    });
  }
}

function fillCutRect(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  cut: number,
  color: number,
  alpha: number,
): void {
  graphics.fillStyle(color, alpha);
  graphics.fillRect(Math.round(x - width / 2 + cut), Math.round(y - height / 2), Math.max(1, Math.round(width - cut * 2)), Math.round(height));
  graphics.fillRect(Math.round(x - width / 2), Math.round(y - height / 2 + cut), Math.round(width), Math.max(1, Math.round(height - cut * 2)));
}
