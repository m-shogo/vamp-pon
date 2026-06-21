import type Phaser from 'phaser';
import {
  getInventoryIconRequirement,
  resolveInventoryIconTexture,
  type InventoryIconCategory,
} from '../assets/inventoryIcons';
import { drawPixelPanel } from './pixelUi';
import { STORYBOOK_FONT, storybookCategoryPalette } from './storybookUi';

export type InventorySlotItem = {
  category: InventoryIconCategory;
  itemId: string;
  level?: number;
};

export class InventorySlotView {
  readonly container: Phaser.GameObjects.Container;

  private frame: Phaser.GameObjects.Graphics;
  private iconImage: Phaser.GameObjects.Image | null = null;
  private fallbackText: Phaser.GameObjects.Text;
  private emptyMark: Phaser.GameObjects.Graphics;
  private levelBadge: Phaser.GameObjects.Graphics;
  private levelText: Phaser.GameObjects.Text;
  private currentKey = '';

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    private size: number,
    depth: number,
    category: InventoryIconCategory,
  ) {
    this.container = scene.add.container(x, y).setDepth(depth);
    const palette = storybookCategoryPalette(category);

    this.frame = scene.add.graphics();
    drawPixelPanel(this.frame, 0, 0, size + 5, size + 5, {
      fill: 0x0d1329,
      edge: palette.accent,
      accent: palette.accent,
      alpha: 0.96,
      cut: 4,
      border: 1,
    });

    this.emptyMark = scene.add.graphics();
    this.emptyMark.fillStyle(palette.accent, 0.66);
    this.emptyMark.fillRect(-1, -5, 2, 10);
    this.emptyMark.fillRect(-5, -1, 10, 2);
    this.emptyMark.fillStyle(0xf3ead2, 0.72);
    this.emptyMark.fillRect(-1, -1, 2, 2);

    this.fallbackText = scene.add
      .text(0, -1, '', {
        fontFamily: STORYBOOK_FONT,
        fontSize: `${Math.max(12, size * 0.43)}px`,
        color: '#f3ead2',
        fontStyle: 'bold',
        resolution: 2,
      })
      .setOrigin(0.5)
      .setVisible(false);

    const badgeSize = size <= 26 ? 14 : 16;
    const badgeX = size / 2 - badgeSize / 2 + 2;
    const badgeY = size / 2 - badgeSize / 2 + 2;
    this.levelBadge = scene.add.graphics().setVisible(false);
    drawPixelPanel(
      this.levelBadge,
      badgeX,
      badgeY,
      badgeSize,
      badgeSize,
      { fill: 0x080b18, edge: palette.accent, accent: palette.accent, cut: 3, border: 1 },
    );

    this.levelText = scene.add.text(badgeX, badgeY, '', {
      fontFamily: STORYBOOK_FONT,
      fontSize: `${size <= 26 ? 11 : 12}px`,
      color: '#fff5d9',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setVisible(false);

    this.container.add([
      this.frame,
      this.emptyMark,
      this.fallbackText,
      this.levelBadge,
      this.levelText,
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
        this.iconImage = this.scene.add.image(0, -1, texture);
        this.container.addAt(this.iconImage, 1);
      } else if (this.iconImage.texture.key !== texture) {
        this.iconImage.setTexture(texture);
      }
      const displaySize = Math.max(22, this.size - 4);
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
    this.container.setName(hasLevel ? `${requirement?.name ?? item.itemId} Lv.${item.level}` : requirement?.name ?? item.itemId);
  }

  setVisible(visible: boolean): void {
    this.container.setVisible(visible);
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
