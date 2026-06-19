import Phaser from 'phaser';
import type { LevelUpChoice, RewardRarity } from '../domain/types';
import {
  getInventoryIconRequirement,
  resolveInventoryIconTexture,
  type InventoryIconCategory,
} from '../assets/inventoryIcons';
import { VIEW_DEPTH } from './factory';
import { wrapUiText } from './itemSelectionLayout';
import { attachPressFeedback } from './pressFeedback';
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
  attachPressFeedback(scene, hit, card, {
    x: cx,
    y: cy,
    width,
    height,
    accent,
    depth: VIEW_DEPTH.overlay + 14,
    strong: choice.rarity === 'rare' || choice.type === 'rare_new',
    shake: choice.rarity === 'rare' || choice.type === 'rare_new',
  });
  hit.on('pointerdown', onClick);
  card.add(hit);

  const title = choice.title.replace(/^✦ /, '').replace(/^入替: /, '');
  const badge = `${palette.label} / ${effectTag(choice)}`;
  if (width >= 250) {
    addHorizontalContent(scene, card, width, height, choice, title, badge, accent);
  } else {
    addVerticalContent(scene, card, width, height, choice, title, badge, accent);
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
  badge: string,
  accent: number,
): void {
  const left = -width / 2;
  const iconX = left + 54;
  addChoiceIcon(scene, card, choice, iconX, -3, 74);
  addBadge(scene, card, iconX, height / 2 - 14, badge, accent);

  const textX = left + 103;
  const textWidth = width - 142;
  card.add(scene.add.text(textX, -height / 2 + 13, wrapUiText(title, 20, 2), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '15px',
    color: STORYBOOK_UI.textDark,
    fontStyle: 'bold',
    align: 'left',
    lineSpacing: 2,
    resolution: 2,
    wordWrap: { width: textWidth, useAdvancedWrap: true },
    stroke: '#f4ead4',
    strokeThickness: 1,
  }).setOrigin(0, 0));

  const description = scene.add.text(textX, 8, wrapUiText(choice.description, 20, 4), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '11px',
    color: '#302932',
    fontStyle: 'bold',
    align: 'left',
    lineSpacing: 3,
    resolution: 2,
    wordWrap: { width: textWidth - 8, useAdvancedWrap: true },
    backgroundColor: '#f4ead4',
    padding: { left: 4, right: 4, top: 3, bottom: 3 },
    fixedWidth: textWidth,
  }).setOrigin(0, 0);
  description.setCrop(0, 0, textWidth, 66);
  card.add(description);
}

function addVerticalContent(
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  width: number,
  height: number,
  choice: LevelUpChoice,
  title: string,
  badge: string,
  accent: number,
): void {
  card.add(scene.add.text(0, -height / 2 + 16, wrapUiText(title, 10, 2), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '14px',
    color: STORYBOOK_UI.textDark,
    fontStyle: 'bold',
    align: 'center',
    lineSpacing: 2,
    resolution: 2,
    wordWrap: { width: width - 18, useAdvancedWrap: true },
    stroke: '#f4ead4',
    strokeThickness: 1,
  }).setOrigin(0.5, 0));

  const iconY = -15;
  addChoiceIcon(scene, card, choice, 0, iconY, 70);
  addBadge(scene, card, 0, 20, badge, accent);

  const description = scene.add.text(0, 34, wrapUiText(choice.description, 10, 5), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '11px',
    color: '#302932',
    fontStyle: 'bold',
    align: 'center',
    lineSpacing: 3,
    resolution: 2,
    wordWrap: { width: width - 20, useAdvancedWrap: true },
    backgroundColor: '#f4ead4',
    padding: { left: 3, right: 3, top: 3, bottom: 3 },
    fixedWidth: width - 18,
  }).setOrigin(0.5, 0);
  description.setCrop(0, 0, width - 18, 72);
  card.add(description);
}

function addBadge(
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  x: number,
  y: number,
  label: string,
  accent: number,
): void {
  card.add(scene.add.text(x, y, label, {
    fontFamily: STORYBOOK_FONT,
    fontSize: '9px',
    color: '#fff8e7',
    fontStyle: 'bold',
    resolution: 2,
    backgroundColor: colorString(accent),
    padding: { left: 4, right: 4, top: 2, bottom: 2 },
    stroke: '#080b18',
    strokeThickness: 1,
  }).setOrigin(0.5));
}

function effectTag(choice: LevelUpChoice): string {
  switch (choice.type) {
    case 'weapon_new':
    case 'passive_new':
      return choice.initialLevel && choice.initialLevel > 1 ? `新規 Lv.${choice.initialLevel}` : '新規';
    case 'weapon_upgrade':
    case 'passive_upgrade':
      return `Lv.${choice.nextLevel}へ`;
    case 'rare_new':
      return 'レア枠';
    case 'heal':
      return `HP+${choice.amount}`;
  }
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
