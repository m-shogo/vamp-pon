import type Phaser from 'phaser';
import {
  getInventoryIconRequirement,
  resolveInventoryIconTexture,
  type InventoryIconCategory,
} from '../assets/inventoryIcons';

const FONT = '"Hiragino Sans", "Yu Gothic", sans-serif';

export type InventorySlotItem = {
  category: InventoryIconCategory;
  itemId: string;
  level?: number;
};

export class InventorySlotView {
  readonly container: Phaser.GameObjects.Container;

  private iconImage: Phaser.GameObjects.Image | null = null;
  private fallbackText: Phaser.GameObjects.Text;
  private emptyMark: Phaser.GameObjects.Text;
  private levelBadge: Phaser.GameObjects.Arc;
  private levelText: Phaser.GameObjects.Text;
  private currentKey = '';

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    private size: number,
    depth: number,
  ) {
    this.container = scene.add.container(x, y).setDepth(depth);
    this.emptyMark = scene.add
      .text(0, 0, '·', { fontFamily: FONT, fontSize: `${Math.max(11, size * 0.4)}px`, color: '#6e6680' })
      .setOrigin(0.5);
    this.fallbackText = scene.add
      .text(0, 0, '', {
        fontFamily: FONT,
        fontSize: `${Math.max(12, size * 0.45)}px`,
        color: '#f3ead2',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setVisible(false);
    this.levelBadge = scene.add
      .circle(size * 0.34, size * 0.31, Math.max(7, size * 0.2), 0x120f24, 0.98)
      .setStrokeStyle(1, 0xf3ead2, 0.9)
      .setVisible(false);
    this.levelText = scene.add
      .text(size * 0.34, size * 0.31, '', {
        fontFamily: FONT,
        fontSize: `${Math.max(8, size * 0.25)}px`,
        color: '#f3ead2',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.container.add([this.emptyMark, this.fallbackText, this.levelBadge, this.levelText]);
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
      // 180px原本を30pxへ1/6整数縮小。レア枠も同じ視認サイズへ揃える。
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
