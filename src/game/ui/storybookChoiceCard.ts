import Phaser from 'phaser';
import type { LevelUpChoice, RewardRarity } from '../domain/types';
import { archetypesForItem } from '../data/buildArchetypes';
import { GAME_FEEL_CONFIG } from '../config/GameFeelConfig';
import { getEffectManager } from '../effects/EffectManager';
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
  if (choice.rarity === 'rare' || choice.type === 'rare_new') {
    const glow = scene.add.graphics();
    glow.lineStyle(3, STORYBOOK_UI.goldLight, 0.46);
    glow.strokeRoundedRect(-width / 2 + 4, -height / 2 + 4, width - 8, height - 8, 9);
    glow.lineStyle(1, 0xffffff, 0.24);
    glow.strokeRoundedRect(-width / 2 + 10, -height / 2 + 10, width - 20, height - 20, 7);
    card.add(glow);
    scene.tweens.add({
      targets: glow,
      alpha: { from: 0.5, to: 1 },
      duration: 780,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

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
  hit.on('pointerdown', () => {
    scene.tweens.killTweensOf(card);
    scene.tweens.add({
      targets: card,
      scale: choice.rarity === 'rare' || choice.type === 'rare_new' ? 1.08 : 1.04,
      duration: 78,
      yoyo: true,
      ease: 'Quad.easeOut',
      onComplete: onClick,
    });
  });
  card.add(hit);

  const title = choice.title.replace(/^✦ /, '').replace(/^入替: /, '');
  const badge = `${palette.label} / ${effectTag(choice)}`;
  addRarityTab(scene, card, width, height, choice.rarity ?? 'normal', accent);
  if (width >= 250) {
    addHorizontalContent(scene, card, width, height, choice, title, badge, accent);
  } else {
    addVerticalContent(scene, card, width, height, choice, title, badge, accent);
  }

  card.setY(cy + 26);
  card.setAlpha(0);
  scene.tweens.add({
    targets: card,
    y: cy,
    alpha: 1,
    duration: GAME_FEEL_CONFIG.juice.levelUpCardRiseMs,
    ease: 'Back.easeOut',
    onComplete: () => getEffectManager(scene).rewardCardPop(card, { strong: choice.rarity === 'rare' || choice.type === 'rare_new' }),
  });

  return card;
}

function addRarityTab(
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  width: number,
  height: number,
  rarity: RewardRarity,
  accent: number,
): void {
  if (rarity === 'normal') return;
  const label = rarity === 'rare' ? 'RARE' : 'GOOD';
  const tab = scene.add.text(width / 2 - 43, -height / 2 + 13, label, {
    fontFamily: STORYBOOK_FONT,
    fontSize: '9px',
    color: '#fff8e7',
    fontStyle: 'bold',
    resolution: 2,
    backgroundColor: colorString(accent),
    padding: { left: 5, right: 5, top: 2, bottom: 2 },
  }).setOrigin(0.5);
  card.add(tab);
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
  }).setOrigin(0, 0));

  const archetype = buildArchetypeLabel(choice);
  if (archetype) {
    card.add(scene.add.text(textX, -height / 2 + 48, archetype, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: '#fff8e7',
      fontStyle: 'bold',
      resolution: 2,
      backgroundColor: colorString(accent),
      padding: { left: 5, right: 5, top: 2, bottom: 2 },
    }).setOrigin(0, 0));
  }

  const description = scene.add.text(textX, archetype ? 66 : 8, wrapUiText(choice.description, 24, archetype ? 2 : 3), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '12px',
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
  description.setCrop(0, 0, textWidth, archetype ? 50 : 68);
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
  }).setOrigin(0.5, 0));

  const iconY = -15;
  addChoiceIcon(scene, card, choice, 0, iconY, 70);
  addBadge(scene, card, 0, 20, badge, accent);

  const archetype = buildArchetypeLabel(choice);
  if (archetype) {
    card.add(scene.add.text(0, 34, archetype, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '9px',
      color: '#fff8e7',
      fontStyle: 'bold',
      resolution: 2,
      backgroundColor: colorString(accent),
      padding: { left: 4, right: 4, top: 1, bottom: 1 },
    }).setOrigin(0.5, 0));
  }

  const description = scene.add.text(0, archetype ? 52 : 34, wrapUiText(choice.description, 12, archetype ? 3 : 4), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '12px',
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
  description.setCrop(0, 0, width - 18, archetype ? 54 : 72);
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

function buildArchetypeLabel(choice: LevelUpChoice): string | null {
  if (!('itemId' in choice)) return null;
  const archetype = archetypesForItem(choice.itemId)[0];
  return archetype ? `方針: ${archetype.name}` : null;
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
        color: colorString(rarityAccent(choice.rarity ?? 'normal', storybookCategoryPalette(iconRef.category).accent)),
        fontStyle: 'bold',
        resolution: 2,
      }).setOrigin(0.5));
    }
    return;
  }

  if (choice.type === 'heal') {
    const g = scene.add.graphics();
    drawHeart(g, x, y, size * 0.48);
    card.add(g);
  }
}

function iconRefForChoice(choice: LevelUpChoice): { category: InventoryIconCategory; itemId: string } | null {
  switch (choice.type) {
    case 'weapon_new':
    case 'weapon_upgrade': return { category: 'weapon', itemId: choice.itemId };
    case 'passive_new':
    case 'passive_upgrade': return { category: 'passive', itemId: choice.itemId };
    case 'rare_new': return { category: 'rare', itemId: choice.itemId };
    case 'heal': return null;
  }
}

export function categoryForChoice(choice: LevelUpChoice): InventoryIconCategory | 'heal' {
  switch (choice.type) {
    case 'weapon_new':
    case 'weapon_upgrade': return 'weapon';
    case 'passive_new':
    case 'passive_upgrade': return 'passive';
    case 'rare_new': return 'rare';
    case 'heal': return 'heal';
  }
}

function rarityAccent(rarity: RewardRarity, fallback: number): number {
  switch (rarity) {
    case 'rare': return STORYBOOK_UI.gold;
    case 'good': return 0xcaa36f;
    default: return fallback;
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
