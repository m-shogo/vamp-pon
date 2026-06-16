import Phaser from 'phaser';
import type { LevelUpChoice } from '../domain/types';
import {
  getInventoryIconRequirement,
  resolveInventoryIconTexture,
  type InventoryIconCategory,
} from '../assets/inventoryIcons';
import { wrapUiText } from './itemSelectionLayout';
import {
  STORYBOOK_FONT,
  STORYBOOK_UI,
  drawHeart,
  drawPaperCard,
  drawRarityStars,
  drawStar,
  storybookCategoryPalette,
} from './storybookUi';

export function createStorybookChoiceCard(
  scene: Phaser.Scene,
  cx: number,
  cy: number,
  width: number,
  height: number,
  choice: LevelUpChoice,
  onClick: () => void,
): Phaser.GameObjects.Container {
  const card = scene.add.container(cx, cy);
  const category = categoryForChoice(choice);
  const palette = storybookCategoryPalette(category);
  const rarity = choice.rarity ?? 'normal';
  const graphics = scene.add.graphics();
  drawPaperCard(graphics, 0, 0, width, height, palette.accent, palette.paper);
  drawStar(graphics, -width / 2 + 15, -height / 2 + 14, 11, palette.accent, STORYBOOK_UI.paperEdge, 1);
  drawRarityStars(graphics, -22, height / 2 - 18, rarity);
  card.add(graphics);

  const hit = scene.add.rectangle(0, 0, width, height, 0x000000, 0.001)
    .setInteractive({ useHandCursor: true });
  hit.on('pointerdown', onClick);
  card.add(hit);

  const title = choice.title.replace(/^✦ /, '').replace(/^入替: /, '');
  card.add(scene.add.text(0, -height / 2 + 25, wrapUiText(title, 10, 2), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '13px',
    color: STORYBOOK_UI.textDark,
    fontStyle: 'bold',
    align: 'center',
    lineSpacing: 1,
    resolution: 1,
    wordWrap: { width: width - 20 },
  }).setOrigin(0.5, 0));

  card.add(scene.add.text(0, -height / 2 + 63, palette.label, {
    fontFamily: STORYBOOK_FONT,
    fontSize: '9px',
    color: colorString(palette.accent),
    fontStyle: 'bold',
    resolution: 1,
  }).setOrigin(0.5));

  const iconY = -23;
  const iconRef = iconRefForChoice(choice);
  if (iconRef) {
    const texture = resolveInventoryIconTexture(scene.textures, iconRef.category, iconRef.itemId);
    if (texture) {
      card.add(scene.add.image(0, iconY, texture).setDisplaySize(82, 82));
    } else {
      card.add(scene.add.text(0, iconY, getInventoryIconRequirement(iconRef.category, iconRef.itemId)?.fallbackGlyph ?? '?', {
        fontFamily: STORYBOOK_FONT,
        fontSize: '32px',
        color: STORYBOOK_UI.textDark,
        fontStyle: 'bold',
      }).setOrigin(0.5));
    }
  } else {
    const icon = scene.add.graphics();
    drawHeart(icon, 0, iconY, 26);
    card.add(icon);
  }

  const description = wrapUiText(choice.description, 10, 4);
  card.add(scene.add.text(0, 38, description, {
    fontFamily: STORYBOOK_FONT,
    fontSize: '11px',
    color: STORYBOOK_UI.textDark,
    fontStyle: 'bold',
    align: 'center',
    lineSpacing: 3,
    resolution: 1,
    wordWrap: { width: width - 18 },
  }).setOrigin(0.5, 0));

  return card;
}

export function categoryForChoice(choice: LevelUpChoice): InventoryIconCategory | 'heal' {
  if (choice.type === 'weapon_new' || choice.type === 'weapon_upgrade') return 'weapon';
  if (choice.type === 'passive_new' || choice.type === 'passive_upgrade') return 'passive';
  if (choice.type === 'rare_new') return 'rare';
  return 'heal';
}

function iconRefForChoice(choice: LevelUpChoice): { category: InventoryIconCategory; itemId: string } | null {
  const category = categoryForChoice(choice);
  if (category === 'heal' || !('itemId' in choice)) return null;
  return { category, itemId: choice.itemId };
}

function colorString(color: number): string {
  return '#' + color.toString(16).padStart(6, '0');
}
