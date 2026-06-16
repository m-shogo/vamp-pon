import type Phaser from 'phaser';
import {
  getInventoryIconRequirement,
  resolveInventoryIconTexture,
  type InventoryIconCategory,
} from '../assets/inventoryIcons';
import { PixelGlyphText, UI_FONT, drawPixelPanel } from './pixelUi';

export type InventorySlotItem = {
  category: InventoryIconCategory;
  itemId: string;
  level?: number;
};

export class InventorySlotView {
  readonly container: Phaser.GameObjects.Container;

  private iconImage: Phaser.GameObjects.Image | null = null;
  private fallbackText: Phaser.GameObjects.Text;
  private emptyMark: Phaser.GameObjects.Graphics;
  private levelBadge: Phaser.GameObjects.Graphics;
  private levelText: PixelGlyphText;
  private currentKey = '';

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    private size: number,
    depth: number,
  ) {
    this.container = scene.add.container(x, y).setDepth(depth);

    this.emptyMark = scene.add.graphics();
    this.emptyMark.fillStyle(0x6e6680, 0.72);
    this.emptyMark.fillRect(-1, -5, 2, 10);
    this.emptyMark.fillRect(-5, -1, 10, 2);
    this.emptyMark.fillStyle(0xb8aecb, 0.72);
    this.emptyMark.fillRect(-1, -1, 2, 2);

    this.fallbackText = scene.add
      .text(0, 0, '', {
        fontFamily: UI_FONT,
        fontSize: `${Math.max(12, size * 0.45)}px`,
        color: '#f3ead2',
        fontStyle: 'bold',
        resolution: 1,
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.levelBadge = scene.add.graphics().setVisible(false);
    drawPixelPanel(
      this.levelBadge,
      size * 0.34,
      size * 0.31,
      14,
      12,
      { fill: 0x120f24, edge: 0xf3ead2, accent: 0xffd45e, cut: 3, border: 1 },
    );

    this.levelText = new PixelGlyphText(scene, size * 0.34, size * 0.31 - 4, 1, 0xf3ead2, 'center', 1);
    this.levelText.setVisible(false);

    this.container.add([
      this.emptyMark,
      this.fallbackText,
      this.levelBadge,
      this.levelText.container,
    ]);
  }

  update(item: InventorySlotItem | null): void {
    const key = item ? `${item.category}:${item.itemId}:${item.level ?? 0}` : 'empty';
    if (key === this.currentKey) return;
    this.currentKey = key;

    if (!item) {
      this.iconImage?.setVisible(false);
      this.fallbackText.setVisible(false);
      this.emptyMark.setVisible(true);
      this.levelBadge.setVisible(false);
      this.levelText.setVisible(false);
      this.container.setName('empty inventory slot');
      return;
    }

    const requirement = getInventoryIconRequirement(item.category, item.itemId);
    const texture = resolveInventoryIconTexture(this.scene.textures, item.category, item.itemId);
    this.emptyMark.setVisible(false);

    if (texture) {
      if (!this.iconImage) {
        this.iconImage = this.scene.add.image(0, 0, texture);
        this.container.addAt(this.iconImage, 0);
      } else if (this.iconImage.texture.key !== texture) {
        this.iconImage.setTexture(texture);
      }
      const displaySize = Math.max(30, this.size);
      this.iconImage.setDisplaySize(displaySize, displaySize).setVisible(true);
      this.fallbackText.setVisible(false);
    } else {
      this.iconImage?.setVisible(false);
      this.fallbackText
        .setText(requirement?.fallbackGlyph ?? '?')
        .setVisible(true);
    }

    const hasLevel = typeof item.level === 'number' && item.level > 0;
    this.levelBadge.setVisible(hasLevel);
    this.levelText.setText(hasLevel ? String(item.level) : '').setVisible(hasLevel);
    this.container.setName(requirement?.name ?? item.itemId);
  }

  setVisible(visible: boolean): void {
    this.container.setVisible(visible);
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
