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
  STORYBOOK_TITLE_FONT,
  STORYBOOK_UI,
  drawHeart,
  storybookCategoryPalette,
} from './storybookUi';
import { drawInkDivider, drawLanternFocus, drawPremiumPaperCard, drawWaxSeal } from './premiumPaperUi';

export type ChoiceSelectionLock = { locked: boolean };

export function createStorybookChoiceCard(
  scene: Phaser.Scene,
  cx: number,
  cy: number,
  width: number,
  height: number,
  choice: LevelUpChoice,
  onClick: () => void,
  selectionLock?: ChoiceSelectionLock,
): Phaser.GameObjects.Container {
  const card = scene.add.container(cx, cy);
  const category = categoryForChoice(choice);
  const palette = storybookCategoryPalette(category);
  const accent = rarityAccent(choice.rarity ?? 'normal', palette.accent);
  const isSpecial = choice.rarity === 'rare' || choice.type === 'rare_new';
  const isGood = choice.rarity === 'good';
  const graphics = scene.add.graphics();
  if (isSpecial) {
    graphics.fillStyle(STORYBOOK_UI.lanternCore, 0.1).fillRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
    graphics.lineStyle(2, STORYBOOK_UI.lanternCore, 0.32).strokeRect(-width / 2 - 3, -height / 2 - 3, width + 6, height + 6);
  }
  drawPremiumPaperCard(graphics, 0, 0, width, height, {
    accent,
    paper: palette.paper,
    selected: isSpecial || isGood,
    shadowAlpha: isSpecial ? 0.42 : 0.32,
  });
  graphics.fillStyle(accent, isSpecial ? 0.8 : 0.5).fillRect(-width / 2 + 8, -height / 2 + 16, 3, height - 32);
  graphics.fillStyle(STORYBOOK_UI.paperShadow, 0.16).fillCircle(width / 2 - 14, height / 2 - 13, 5);
  card.add(graphics);

  if (isSpecial) {
    const glowFocus = drawLanternFocus(scene, 0, 0, { radius: Math.max(width, height) * 0.38, depth: VIEW_DEPTH.overlay + 9, alpha: 0.04 });
    glowFocus.setBlendMode('ADD');
    card.addAt(glowFocus, 0);

    const glow = scene.add.graphics();
    glow.lineStyle(2, STORYBOOK_UI.warmAmber, 0.35);
    glow.strokeRect(-width / 2 + 4, -height / 2 + 4, width - 8, height - 8);
    glow.lineStyle(1, STORYBOOK_UI.lanternCore, 0.15);
    glow.strokeRect(-width / 2 + 10, -height / 2 + 10, width - 20, height - 20);
    card.add(glow);
    scene.tweens.add({
      targets: glow,
      alpha: { from: 0.5, to: 0.9 },
      duration: 1200,
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
    strong: isSpecial,
    shake: isSpecial,
  });
  hit.on('pointerdown', () => {
    if (selectionLock?.locked) return;
    if (selectionLock) selectionLock.locked = true;
    hit.disableInteractive();
    scene.tweens.killTweensOf(card);

    const siblings = card.parentContainer?.list.filter(
      (child) => child !== card && child instanceof Phaser.GameObjects.Container,
    ) ?? [];
    for (const sibling of siblings) {
      disableInteractiveRecursive(sibling as Phaser.GameObjects.Container);
      scene.tweens.add({ targets: sibling, alpha: 0.3, scale: 0.94, y: (sibling as Phaser.GameObjects.Container).y + 8, duration: 160, ease: 'Quad.easeOut' });
    }

    const confirmRing = scene.add.circle(0, 0, Math.max(width, height) * 0.5, isSpecial ? STORYBOOK_UI.goldLight : STORYBOOK_UI.gold, 0.06);
    confirmRing.setStrokeStyle(isSpecial ? 3 : 2, isSpecial ? STORYBOOK_UI.goldLight : STORYBOOK_UI.gold, 0.7);
    confirmRing.setBlendMode('ADD');
    card.add(confirmRing);
    scene.tweens.add({ targets: confirmRing, scale: 1.6, alpha: 0, duration: 300, ease: 'Cubic.easeOut', onComplete: () => confirmRing.destroy() });

    scene.tweens.add({
      targets: card,
      scale: isSpecial ? 1.06 : 1.03,
      duration: 140,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.time.delayedCall(60, onClick);
      },
    });
  });
  card.add(hit);

  const title = choice.title.replace(/^✦ /, '').replace(/^入替: /, '');
  const badge = effectTag(choice);
  if (height < width) {
    addHorizontalContent(scene, card, width, height, choice, title, badge, accent);
  } else {
    addVerticalContent(scene, card, width, height, choice, title, badge, accent);
  }
  addRarityTab(scene, card, width, height, choice.rarity ?? 'normal', accent, height < width ? 'horizontal' : 'vertical');

  const cardIndex = (scene as { _levelUpCardIndex?: number })._levelUpCardIndex ?? 0;
  (scene as { _levelUpCardIndex?: number })._levelUpCardIndex = cardIndex + 1;
  const staggerDelay = cardIndex * 80;

  card.setY(cy + 36);
  card.setAlpha(0);
  card.setScale(0.88);
  scene.tweens.add({
    targets: card,
    y: cy,
    alpha: 1,
    scale: 1,
    duration: GAME_FEEL_CONFIG.juice.levelUpCardRiseMs + 60,
    delay: staggerDelay,
    ease: 'Back.easeOut',
    onComplete: () => getEffectManager(scene).rewardCardPop(card, { strong: isSpecial }),
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
  layout: 'horizontal' | 'vertical',
): void {
  const label = rarity === 'rare' ? 'Rare' : rarity === 'good' ? 'Good' : 'Normal';
  const tabColor = rarity === 'rare' ? STORYBOOK_UI.deepNight : rarity === 'good' ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.mutedTeal;
  const tabBg = scene.add.graphics();
  const tabW = Math.min(width - 10, rarity === 'rare' && layout === 'vertical' ? 88 : layout === 'horizontal' ? 62 : 72);
  const tabH = rarity === 'rare' && layout === 'vertical' ? 28 : layout === 'horizontal' ? 20 : 24;
  const tabX = layout === 'horizontal' ? -width / 2 + 54 : 0;
  const tabY = -height / 2 + (layout === 'horizontal' ? 8 : rarity === 'rare' ? -14 : -12);
  tabBg.fillStyle(STORYBOOK_UI.inkBlack, 0.24).fillRect(tabX - tabW / 2 + 2, tabY + 2, tabW, tabH);
  tabBg.fillStyle(tabColor, 0.92).fillRect(tabX - tabW / 2, tabY, tabW, tabH);
  tabBg.lineStyle(rarity === 'rare' ? 2 : 1, rarity === 'rare' ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperEdge, rarity === 'rare' ? 0.88 : 0.62).strokeRect(tabX - tabW / 2, tabY, tabW, tabH);
  tabBg.lineStyle(1, rarity === 'rare' ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.paperLight, rarity === 'rare' ? 0.42 : 0.18).lineBetween(tabX - tabW / 2 + 6, tabY + 4, tabX + tabW / 2 - 6, tabY + 4);
  if (rarity === 'rare') {
    tabBg.fillStyle(STORYBOOK_UI.goldLight, 0.22).fillTriangle(tabX - tabW / 2, tabY + tabH, tabX - tabW / 2 - 9, tabY + tabH - 8, tabX - tabW / 2, tabY + tabH - 16);
    tabBg.fillTriangle(tabX + tabW / 2, tabY + tabH, tabX + tabW / 2 + 9, tabY + tabH - 8, tabX + tabW / 2, tabY + tabH - 16);
  }
  card.add(tabBg);
  const tab = scene.add.text(tabX, tabY + tabH / 2, label, {
    fontFamily: STORYBOOK_TITLE_FONT,
    fontSize: rarity === 'rare' && layout === 'vertical' ? '13px' : layout === 'horizontal' ? '10px' : '11px',
    color: rarity === 'rare' ? '#ffe7ae' : '#fff8e7',
    fontStyle: 'bold',
    resolution: 2,
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
  addIconFrame(scene, card, iconX, -3, 82, 82, accent, choice.rarity === 'rare' || choice.type === 'rare_new');
  addChoiceIcon(scene, card, choice, iconX, -3, 68);
  addBadge(scene, card, iconX, height / 2 - 14, badge, accent);

  const textX = left + 103;
  const textWidth = width - 142;
  const textParts = splitChoiceDescription(choice.description);
  const titleDivider = scene.add.graphics();
  drawInkDivider(titleDivider, textX + textWidth / 2, -height / 2 + 43, textWidth - 8, { color: STORYBOOK_UI.paperDark, alpha: 0.16 });
  card.add(titleDivider);
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

  const descY = archetype ? -height / 2 + 68 : -height / 2 + 48;
  const descLines = textParts.hint ? 1 : archetype ? 2 : 3;
  const description = scene.add.text(textX, descY, wrapUiText(textParts.description, 24, descLines), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '11px',
    color: '#302932',
    fontStyle: 'bold',
    align: 'left',
    lineSpacing: 2,
    resolution: 2,
    wordWrap: { width: textWidth - 8, useAdvancedWrap: true },
    backgroundColor: '#f4ead4',
    padding: { left: 4, right: 4, top: 2, bottom: 2 },
    fixedWidth: textWidth,
  }).setOrigin(0, 0);
  card.add(description);

  if (textParts.hint) {
    addHintPill(scene, card, textX, height / 2 - 29, textParts.hint, accent, textWidth);
  }
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
  const isRare = choice.rarity === 'rare' || choice.type === 'rare_new';
  const textParts = splitChoiceDescription(choice.description);
  const iconSize = Math.min(60, width - 30);
  const iconY = -height / 2 + 72;
  addIconFrame(scene, card, 0, iconY, Math.min(82, width - 22), 82, accent, isRare);
  addChoiceIcon(scene, card, choice, 0, iconY, iconSize);

  const innerG = scene.add.graphics();
  innerG.lineStyle(1, STORYBOOK_UI.paperEdge, 0.12);
  innerG.lineBetween(-width / 2 + 12, iconY + iconSize / 2 + 8, width / 2 - 12, iconY + iconSize / 2 + 8);
  card.add(innerG);

  const titleY = iconY + iconSize / 2 + 20;
  card.add(scene.add.text(0, titleY, wrapUiText(title, 8, 2), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '13px',
    color: STORYBOOK_UI.textDark,
    fontStyle: 'bold',
    align: 'center',
    lineSpacing: 2,
    resolution: 2,
    wordWrap: { width: width - 16, useAdvancedWrap: true },
  }).setOrigin(0.5, 0));

  const descY = titleY + 36;
  const description = scene.add.text(0, descY, wrapUiText(textParts.description, 9, textParts.hint ? 2 : 3), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '10px',
    color: STORYBOOK_UI.textSoft,
    align: 'center',
    lineSpacing: 3,
    resolution: 2,
    wordWrap: { width: width - 18, useAdvancedWrap: true },
  }).setOrigin(0.5, 0);
  card.add(description);

  const statY = height / 2 - 22;
  if (textParts.hint) {
    addHintPill(scene, card, -width / 2 + 10, statY - 25, compactChoiceHint(textParts.hint), accent, width - 20);
  }
  addBadge(scene, card, 0, statY, badge, accent);

  if (isRare) {
    const sealG = scene.add.graphics();
    drawWaxSeal(sealG, width / 2 - 14, height / 2 - 14, 12, { color: STORYBOOK_UI.dustyRose, alpha: 0.8 });
    card.add(sealG);
  }
}

type ChoiceDescriptionParts = {
  description: string;
  hint: string | null;
};

function splitChoiceDescription(description: string): ChoiceDescriptionParts {
  const normalized = description.replace(/\s*\/\s*/g, ' / ').trim();
  const hintPattern = / \/ (選ぶと(?:進化|合体|覚醒)可|(?:進化候補|合体候補|覚醒候補): .+)$/;
  const match = normalized.match(hintPattern);
  if (!match || match.index == null) return { description: normalized, hint: null };
  const body = normalized.slice(0, match.index).trim();
  return {
    description: body || normalized,
    hint: match[1],
  };
}

function compactChoiceHint(hint: string): string {
  const ready = hint.match(/^選ぶと(進化|合体|覚醒)可$/);
  if (ready) return `選ぶと${ready[1]}`;

  const candidate = hint.match(/^(進化候補|合体候補|覚醒候補):/);
  if (candidate) return candidate[1];

  return hint;
}

function addHintPill(
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  x: number,
  y: number,
  label: string,
  accent: number,
  maxWidth: number,
): void {
  const text = scene.add.text(x, y, wrapUiText(label, Math.max(7, Math.floor(maxWidth / 11)), 1), {
    fontFamily: STORYBOOK_FONT,
    fontSize: '9px',
    color: '#fff8e7',
    fontStyle: 'bold',
    resolution: 2,
    backgroundColor: colorString(accent),
    padding: { left: 5, right: 5, top: 2, bottom: 2 },
    fixedWidth: maxWidth,
  }).setOrigin(0, 0);
  card.add(text);
}

function addBadge(
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  x: number,
  y: number,
  label: string,
  accent: number,
): void {
  const badge = scene.add.container(x, y);
  const bg = scene.add.graphics();
  const width = Math.max(52, label.length * 8 + 14);
  drawPremiumPaperCard(bg, 0, 0, width, 18, { accent, paper: STORYBOOK_UI.paperBeige, selected: false, shadowAlpha: 0.1 });
  const text = scene.add.text(0, 0, label, {
    fontFamily: STORYBOOK_FONT,
    fontSize: '9px',
    color: colorString(STORYBOOK_UI.textDark),
    fontStyle: 'bold',
    resolution: 2,
  }).setOrigin(0.5);
  badge.add([bg, text]);
  card.add(badge);
}

function addIconFrame(
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  x: number,
  y: number,
  width: number,
  height: number,
  accent: number,
  warmGlow = false,
): void {
  const frame = scene.add.graphics();
  if (warmGlow) {
    frame.fillStyle(STORYBOOK_UI.lanternCore, 0.08).fillRect(x - width / 2 - 4, y - height / 2 - 4, width + 8, height + 8);
  }
  frame.fillStyle(STORYBOOK_UI.deepNight, 0.86).fillRect(x - width / 2, y - height / 2, width, height);
  frame.lineStyle(2, warmGlow ? STORYBOOK_UI.lanternCore : accent, warmGlow ? 0.72 : 0.52).strokeRect(x - width / 2, y - height / 2, width, height);
  frame.lineStyle(1, STORYBOOK_UI.paperLight, 0.18).strokeRect(x - width / 2 + 5, y - height / 2 + 5, width - 10, height - 10);
  frame.fillStyle(STORYBOOK_UI.inkBlack, 0.12).fillCircle(x + width / 2 - 10, y - height / 2 + 10, 4);
  frame.fillStyle(accent, warmGlow ? 0.18 : 0.1).fillCircle(x - width / 2 + 12, y + height / 2 - 12, 4);
  card.add(frame);
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
    case 'rare': return STORYBOOK_UI.warmAmber;
    case 'good': return STORYBOOK_UI.gold;
    default: return fallback;
  }
}

function disableInteractiveRecursive(container: Phaser.GameObjects.Container): void {
  for (const child of container.list) {
    if ('disableInteractive' in child && typeof child.disableInteractive === 'function') {
      (child as Phaser.GameObjects.GameObject).disableInteractive();
    }
    if (child instanceof Phaser.GameObjects.Container) {
      disableInteractiveRecursive(child);
    }
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
