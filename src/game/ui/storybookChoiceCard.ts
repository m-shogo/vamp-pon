import Phaser from 'phaser';
import type { LevelUpChoice, RewardRarity } from '../domain/types';
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
  const accent = rarityAccent(choice.rarity ?? 'normal', palette.accent);
  const graphics = scene.add.graphics();
  drawPaperCard(graphics, 0, 0, width, height, accent, palette.paper);
  graphics.fillStyle(accent, 0.92).fillRect(-width / 2 + 5, -height / 2 + 5, 5, height - 10);
  card.add(graphics);

  const hit = scene.add.rectangle(0, 0, width, height, 0x000000, 0.001)
    .setInteractive({ useHandCursor: true });
  hit.on('pointerdown', onClick);
  card.add(hit);

  const title = choice.title.replace(/^✦ /, '').replace(/^入替: /, '');
  if (width >= 250) {
    addHorizontalContent(scene, card, width, height, choice, title, palette.label, accent);
  } else {
    addVerticalContent(scene, card, width, height, choice, title, palette.label, accent);
  }

  return card;
}

function addHorizontalContent(
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  width: number,
  height: number,
  choice: LevelUpChoice,
  title: string,
  categoryLabel: string,
  accent: number,
): void {
  const left = -width / 2;
  const iconX = left + 54;
  addChoiceIcon(scene, card, choice, iconX, 0, 76);

  card.add(scene.add.text(left + 103, -height / 2 + 13, wrapUiText(title, 20, 2), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '15px',
    color: STORYBOOK_UI.textDark,
    fontStyle: 'bold',
    align: 'left',
    lineSpacing: 2,
    resolution: 2,
    wordWrap: { width: width - 132 },
    stroke: '#f4ead4',
    strokeThickness: 1,
  }).setOrigin(0, 0));

  card.add(scene.add.text(width / 2 - 14, -height / 2 + 14, categoryLabel, {
    fontFamily: STORYBOOK_FONT,
    fontSize: '10px',
    color: colorString(accent),
    fontStyle: 'bold',
    resolution: 2,
    backgroundColor: '#f4ead4',
    padding: { left: 4, right: 4, top: 2, bottom: 2 },
  }).setOrigin(1, 0));

  card.add(scene.add.text(left + 103, 9, wrapUiText(choice.description, 24, 3), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '12px',
    color: '#302932',
    fontStyle: 'bold',
    align: 'left',
    lineSpacing: 4,
    resolution: 2,
    wordWrap: { width: width - 126 },
    backgroundColor: '#f4ead4',
    padding: { left: 4, right: 4, top: 3, bottom: 3 },
  }).setOrigin(0, 0));
}

function addVerticalContent(
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  width: number,
  height: number,
  choice: LevelUpChoice,
  title: string,
  categoryLabel: string,
  accent: number,
): void {
  card.add(scene.add.text(0, -height / 2 + 18, wrapUiText(title, 10, 2), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '14px',
    color: STORYBOOK_UI.textDark,
    fontStyle: 'bold',
    align: 'center',
    lineSpacing: 2,
    resolution: 2,
    wordWrap: { width: width - 18 },
    stroke: '#f4ead4',
    strokeThickness: 1,
  }).setOrigin(0.5, 0));

  card.add(scene.add.text(0, -height / 2 + 58, categoryLabel, {
    fontFamily: STORYBOOK_FONT,
    fontSize: '10px',
    color: colorString(accent),
    fontStyle: 'bold',
    resolution: 2,
    backgroundColor: '#f4ead4',
    padding: { left: 4, right: 4, top: 1, bottom: 1 },
  }).setOrigin(0.5));

  const iconY = -18;
  addChoiceIcon(scene, card, choice, 0, iconY, 72);

  card.add(scene.add.text(0, 36, wrapUiText(choice.description, 11, 4), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '12px',
    color: '#302932',
    fontStyle: 'bold',
    align: 'center',
    lineSpacing: 4,
    resolution: 2,
    wordWrap: { width: width - 16 },
    backgroundColor: '#f4ead4',
    padding: { left: 3, right: 3, top: 3, bottom: 3 },
  }).setOrigin(0.5, 0));
}

function addChoiceIcon(
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  choice: LevelUpChoice,
  x: number,
  y: number,
  size: number,
): void {
  const iconRef = iconRefForChoice(choice);
  if (iconRef) {
    const texture = resolveInventoryIconTexture(scene.textures, iconRef.category, iconRef.itemId);
    if (texture) {
      card.add(scene.add.image(x, y, texture).setDisplaySize(size, size));
    } else {
      card.add(scene.add.text(x, y, getInventoryIconRequirement(iconRef.category, iconRef.itemId)?.fallbackGlyph ?? '?', {
        fontFamily: STORYBOOK_FONT,
        fontSize: `${Math.round(size * 0.42)}px`,
        color: STORYBOOK_UI.textDark,
        fontStyle: 'bold',
        resolution: 2,
      }).setOrigin(0.5));
    }
    return;
  }

  const icon = scene.add.graphics();
  drawHeart(icon, x, y, Math.round(size * 0.34));
  card.add(icon);
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

function rarityAccent(rarity: RewardRarity, categoryAccent: number): number {
  if (rarity === 'rare') return STORYBOOK_UI.rare;
  if (rarity === 'good') return 0xd4b060;
  return categoryAccent;
}

function colorString(color: number): string {
  return '#' + color.toString(16).padStart(6, '0');
}
