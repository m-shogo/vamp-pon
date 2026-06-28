import Phaser from 'phaser';
import type { EvolutionKind, LevelUpChoice, CapsuleReward } from '../domain/types';
import type { RuntimeState } from '../runtime';
import type { PlayLog } from '../domain/playLog';
import type { RunSettlement } from '../persistence/profile';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { EVOLUTION_ACCENT } from './visualDesign';
import { weaponById } from '../data/weapons';
import { passiveById } from '../data/passives';
import { rareItemById } from '../data/rareItems';
import { evolutions } from '../data/evolutions';
import { recipeForStage } from '../data/waves';
import {
  getInventoryIconRequirement,
  resolveInventoryIconTexture,
  type InventoryIconCategory,
} from '../assets/inventoryIcons';
import {
  LEVEL_UP_CARD_HEIGHT,
  LEVEL_UP_CARD_TOP,
  LEVEL_UP_CARD_WIDTH,
  LEVEL_UP_HEADER_Y,
  LEVEL_UP_PANEL_TOP,
  LEVEL_UP_REROLL_Y,
  REPLACE_ACTION_Y,
  REPLACE_ROW_HEIGHT,
  REPLACE_ROW_WIDTH,
  levelUpCardPositions,
  replaceRowCenters,
  wrapUiText,
} from './itemSelectionLayout';
import { attachPressFeedback } from './pressFeedback';
import { createStorybookChoiceCard, categoryForChoice as storybookCategoryForChoice, type ChoiceSelectionLock } from './storybookChoiceCard';
import {
  STORYBOOK_FONT,
  STORYBOOK_TITLE_FONT,
  STORYBOOK_UI,
  drawPaperCard,
  drawStorybookPanel,
  storybookCategoryPalette,
} from './storybookUi';
import {
  drawDawnGlow,
  drawInkDivider,
  drawLargeNotebookPage,
  drawPrimaryPaperCta,
  drawRankSeal,
  drawRewardIconCard,
  drawSecondaryPaperButton,
} from './premiumPaperUi';
import { getAudioManager } from '../audio/AudioManager';

const D = VIEW_DEPTH.overlay;
const LIST_ICON_SIZE = 46;

type IconRef = { category: InventoryIconCategory; itemId: string };

export class Overlays {
  private current: Phaser.GameObjects.Container | null = null;

  constructor(private scene: Phaser.Scene) {}

  clear(): void {
    if (this.current) {
      this.killTweensRecursive(this.current);
      this.current.destroy(true);
    }
    this.current = null;
  }

  private killTweensRecursive(object: Phaser.GameObjects.GameObject): void {
    this.scene.tweens.killTweensOf(object);
    const list = (object as Phaser.GameObjects.Container).list;
    if (!Array.isArray(list)) return;
    for (const child of list) {
      this.killTweensRecursive(child as Phaser.GameObjects.GameObject);
    }
  }

  private dim(alpha: number): Phaser.GameObjects.Container {
    this.clear();
    const root = this.scene.add.container(0, 0).setDepth(D);
    const background = this.scene.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      COLORS.overlay,
      alpha,
    ).setInteractive();
    root.add(background);
    this.current = root;
    return root;
  }

  private text(
    x: number,
    y: number,
    value: string,
    size: number,
    color: string | number,
    bold = false,
  ): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, value, {
      fontFamily: bold && size >= 18 ? STORYBOOK_TITLE_FONT : STORYBOOK_FONT,
      fontSize: `${size}px`,
      color: colorString(color),
      fontStyle: bold ? 'bold' : 'normal',
      align: 'center',
      resolution: 2,
      lineSpacing: 3,
      padding: { left: 2, right: 2, top: 2, bottom: 2 },
    }).setOrigin(0.5);
  }

  showReady(onStart: () => void, stageNumber = 1, firstRun = false): void {
    const root = this.dim(0.62);
    const panel = this.scene.add.graphics();
    const isStage2 = stageNumber === 2;
    const panelH = firstRun ? 380 : 326;
    const panelBorder = isStage2 ? 0x7a9ec4 : STORYBOOK_UI.gold;
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 344, panelH, STORYBOOK_UI.nightPanel, panelBorder, 0.96);
    root.add(panel);
    if (isStage2) {
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 110, '二夜目', 28, 0x8bb8d8, true));
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70, '雨ににじむ地図帳', 14, 0x9ab0cc, true));
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 12, '道の線が、少しだけずれている。', 13, STORYBOOK_UI.textLight));
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 16, '移動はドラッグ。必殺は右下。', 12, STORYBOOK_UI.textMuted));
      root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 94, 180, 46, '雨の路地へ', () => {
        this.clear();
        onStart();
      }));
    } else {
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 110, 'VAMP PON', 31, STORYBOOK_UI.textLight, true));
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70, '忘れた名前を、夜から拾う', 12, STORYBOOK_UI.textMuted));
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 12, '影を払い、記憶のかけらを集める。', 13, STORYBOOK_UI.textLight));
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 16, '移動はドラッグ。必殺は右下。', 12, STORYBOOK_UI.textMuted));
      if (firstRun) {
        root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 42, '武器は自動で発射。EXPを拾ってレベルアップ。', 11, STORYBOOK_UI.goldLight));
        root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, 'やられても黒曜片は持ち帰れる。', 11, STORYBOOK_UI.goldLight));
      }
      root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + (firstRun ? 114 : 94), 180, 46, '夜へ進む', () => {
        this.clear();
        onStart();
      }));
    }
  }

  showLevelUp(
    state: RuntimeState,
    choices: LevelUpChoice[],
    onPick: (choice: LevelUpChoice) => void,
    onReroll: () => void,
  ): void {
    const root = this.dim(0.3);
    const dock = this.scene.add.graphics();
    drawLargeNotebookPage(
      dock,
      GAME_WIDTH / 2,
      (LEVEL_UP_PANEL_TOP + GAME_HEIGHT) / 2,
      GAME_WIDTH - 12,
      GAME_HEIGHT - LEVEL_UP_PANEL_TOP - 8,
      { accent: STORYBOOK_UI.warmAmber, alpha: 0.97 },
    );
    root.add(dock);

    (this.scene as { _levelUpCardIndex?: number })._levelUpCardIndex = 0;
    const bannerG = this.scene.add.graphics();
    drawLargeNotebookPage(bannerG, GAME_WIDTH / 2, LEVEL_UP_HEADER_Y + 2, 286, 66, {
      accent: STORYBOOK_UI.warmAmber,
      alpha: 0.96,
    });
    root.add(bannerG);
    const headerG = this.scene.add.graphics();
    drawInkDivider(headerG, GAME_WIDTH / 2, LEVEL_UP_HEADER_Y + 24, 206, { color: STORYBOOK_UI.paperDark, alpha: 0.2 });
    root.add(headerG);
    root.add(this.text(GAME_WIDTH / 2, LEVEL_UP_HEADER_Y - 10, 'Level Up', 22, STORYBOOK_UI.textDark, true));
    root.add(this.text(GAME_WIDTH / 2, LEVEL_UP_HEADER_Y + 10, 'Choose a memory to strengthen', 10, STORYBOOK_UI.textSoft, true));
    root.add(this.text(
      GAME_WIDTH / 2,
      LEVEL_UP_HEADER_Y + 30,
      `武器 ${state.inventory.weapons.length}/${state.inventory.weaponSlots}　忘れ物 ${state.inventory.passives.length}/${state.inventory.passiveSlots}　レア ${state.inventory.rareItems.length}/${state.inventory.rareItemSlots}`,
      9,
      STORYBOOK_UI.textSoft,
    ));

    const lock: ChoiceSelectionLock = { locked: false };
    const positions = levelUpCardPositions(choices.length, GAME_WIDTH);
    choices.slice(0, 3).forEach((choice, index) => {
      const position = positions[index];
      root.add(createStorybookChoiceCard(
        this.scene,
        position.x,
        position.y,
        LEVEL_UP_CARD_WIDTH,
        LEVEL_UP_CARD_HEIGHT,
        choice,
        () => {
          this.clear();
          onPick(choice);
        },
        lock,
      ));
    });

    const hintY = LEVEL_UP_CARD_TOP + LEVEL_UP_CARD_HEIGHT + 16;
    root.add(this.text(GAME_WIDTH / 2, hintY, 'カードをタップして選ぶ', 10, STORYBOOK_UI.textSoft));

    const ownedY = hintY + 22;
    const ownedG = this.scene.add.graphics();
    drawSecondaryPaperButton(ownedG, GAME_WIDTH / 2, ownedY + 6, 168, 24, { accent: STORYBOOK_UI.paperDark });
    ownedG.setAlpha(0.82);
    root.add(ownedG);
    root.add(this.text(GAME_WIDTH / 2, ownedY + 6, `Owned  記憶片 ${state.stats.memoryFragmentsCollected}`, 10, STORYBOOK_UI.textLight, true));

    const remaining = state.levelUpRerollsRemaining;
    const reroll = this.button(
      GAME_WIDTH - 57,
      LEVEL_UP_REROLL_Y,
      100,
      28,
      remaining > 0 ? `入替 ${remaining}/3` : '入替 0/3',
      () => {
        if (remaining <= 0) return;
        this.clear();
        onReroll();
      },
      true,
    );
    reroll.setAlpha(remaining > 0 ? 1 : 0.45);
    root.add(reroll);
  }

  showReplaceItem(
    state: RuntimeState,
    choice: LevelUpChoice,
    onReplace: (removeId: string) => void,
    onCancel: () => void,
    onDecline: () => void,
  ): void {
    const category = categoryForChoice(choice);
    const isWeapon = category === 'weapon';
    const isRare = category === 'rare';
    const items = isWeapon
      ? state.inventory.weapons
      : isRare
        ? state.inventory.rareItems
        : state.inventory.passives;
    const title = isWeapon ? '外す武器を選ぶ' : isRare ? '外すレアを選ぶ' : '外す忘れ物を選ぶ';

    const root = this.dim(0.74);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 366, 790, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.97);
    root.add(panel);
    root.add(this.text(GAME_WIDTH / 2, 36, title, 21, STORYBOOK_UI.textLight, true));
    root.add(this.text(GAME_WIDTH / 2, 62, '新しい道具と交換します', 11, STORYBOOK_UI.textMuted));

    const incoming = createStorybookChoiceCard(this.scene, GAME_WIDTH / 2, 178, 148, 206, choice, () => {});
    root.add(incoming);

    const centers = replaceRowCenters(items.length).map((y) => y + 200);
    items.forEach((item, index) => {
      const label = isWeapon
        ? weaponById.get(item.id)?.name ?? item.id
        : isRare
          ? rareItemById.get(item.id)?.name ?? item.id
          : passiveById.get(item.id)?.name ?? item.id;
      const level = isRare ? '' : ` Lv.${'level' in item ? item.level : ''}`;
      root.add(this.replaceRow(
        GAME_WIDTH / 2,
        centers[index],
        REPLACE_ROW_WIDTH,
        REPLACE_ROW_HEIGHT,
        { category: category ?? 'passive', itemId: item.id },
        label + level,
        () => {
          this.clear();
          onReplace(item.id);
        },
      ));
    });

    root.add(this.button(GAME_WIDTH / 2 - 82, REPLACE_ACTION_Y, 144, 40, '戻る', () => {
      this.clear();
      onCancel();
    }));
    root.add(this.button(GAME_WIDTH / 2 + 82, REPLACE_ACTION_Y, 144, 40, '受け取らない', () => {
      this.clear();
      onDecline();
    }));
  }

  previewCard(
    cx: number,
    cy: number,
    width: number,
    height: number,
    choice: LevelUpChoice,
  ): Phaser.GameObjects.Container {
    return createStorybookChoiceCard(this.scene, cx, cy, width, height, choice, () => {});
  }

  showCapsule(_state: RuntimeState, reward: CapsuleReward, onClose: () => void): void {
    if (reward.type === 'evolution') {
      this.showEvolutionReward(reward, onClose);
      return;
    }

    const root = this.dim(0.62);
    const category: InventoryIconCategory = reward.type === 'passive_upgrade' ? 'passive' : 'weapon';
    const palette = storybookCategoryPalette(category);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 320, 430, STORYBOOK_UI.nightPanel, palette.accent, 0.98);
    root.add(panel);

    const card = this.scene.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 8);
    const paper = this.scene.add.graphics();
    drawPaperCard(paper, 0, 0, 238, 330, palette.accent, palette.paper);
    card.add(paper);
    const ref = iconRefForReward(reward);
    if (ref) this.addInventoryIcon(card, ref, 0, -45, 100, palette.accent);
    card.add(this.scene.add.text(0, -145, '記憶カプセル', {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '13px',
      color: STORYBOOK_UI.textSoft,
      fontStyle: 'bold',
      resolution: 2,
      backgroundColor: '#f4ead4',
      padding: { left: 6, right: 6, top: 2, bottom: 2 },
    }).setOrigin(0.5));
    card.add(this.scene.add.text(0, 46, wrapUiText(reward.title, 16, 2), {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '20px',
      color: STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      lineSpacing: 3,
      backgroundColor: '#f4ead4',
      padding: { left: 7, right: 7, top: 4, bottom: 4 },
    }).setOrigin(0.5));
    root.add(card);

    const close = () => {
      this.clear();
      onClose();
    };
    (root.list[0] as Phaser.GameObjects.Rectangle).on('pointerdown', close);
    this.scene.time.delayedCall(1500, () => {
      if (this.current === root) close();
    });
  }

  private showEvolutionReward(reward: Extract<CapsuleReward, { type: 'evolution' }>, onClose: () => void): void {
    const weapon = weaponById.get(reward.evolvedWeaponId);
    const accent = EVOLUTION_ACCENT[reward.evolutionKind];
    const root = this.dim(0.82);
    this.addEvolutionRewardAtmosphere(root, reward);

    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 366, 704, STORYBOOK_UI.nightPanel, accent.main, 0.98);
    root.add(panel);

    root.add(this.scene.add.text(GAME_WIDTH / 2, 72, evolutionActionLabel(reward.evolutionKind), {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '18px',
      color: colorString(accent.main),
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
    }).setOrigin(0.5));
    root.add(this.text(GAME_WIDTH / 2, 103, '武器が重なり、新しい形になった', 12, STORYBOOK_UI.textMuted, true));

    const resultCard = this.scene.add.container(GAME_WIDTH / 2, 400).setScale(0.86).setAlpha(0);
    const paper = this.scene.add.graphics();
    drawPaperCard(paper, 0, 0, 300, 430, accent.main, STORYBOOK_UI.paper);
    resultCard.add(paper);
    this.addInventoryIcon(resultCard, { category: 'weapon', itemId: reward.evolvedWeaponId }, 0, -128, 112, accent.main);

    resultCard.add(this.scene.add.text(0, -40, wrapUiText(weapon?.name ?? reward.title, 14, 2), {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '24px',
      color: STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      lineSpacing: 3,
      backgroundColor: '#f4ead4',
      padding: { left: 8, right: 8, top: 4, bottom: 4 },
    }).setOrigin(0.5));

    resultCard.add(this.scene.add.text(0, 36, wrapUiText(weapon?.description ?? reward.title, 24, 4), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '13px',
      color: '#4a3b2a',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      lineSpacing: 4,
      padding: { left: 8, right: 8, top: 4, bottom: 4 },
    }).setOrigin(0.5, 0));

    resultCard.add(this.scene.add.text(0, 146, wrapUiText(reward.lore || weapon?.lore || '新しい記憶のかたち。', 26, 3), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '11px',
      color: STORYBOOK_UI.textSoft,
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      lineSpacing: 4,
      backgroundColor: '#f4ead4',
      padding: { left: 6, right: 6, top: 4, bottom: 4 },
    }).setOrigin(0.5, 0));

    root.add(resultCard);
    this.scene.tweens.add({ targets: resultCard, scale: 1, alpha: 1, delay: 520, duration: 340, ease: 'Back.easeOut' });

    const closeButton = this.button(GAME_WIDTH / 2, GAME_HEIGHT - 80, 206, 48, '閉じる', () => {
      this.clear();
      onClose();
    });
    closeButton.setAlpha(0);
    root.add(closeButton);
    this.scene.tweens.add({ targets: closeButton, alpha: 1, delay: 900, duration: 260, ease: 'Quad.easeOut' });
  }

  private addEvolutionRewardAtmosphere(root: Phaser.GameObjects.Container, reward: Extract<CapsuleReward, { type: 'evolution' }>): void {
    const kind = reward.evolutionKind;
    const accent = EVOLUTION_ACCENT[kind];
    const main = accent.main;
    const sub = accent.sub;
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2 - 28;
    this.scene.cameras.main.flash(kind === 'fusion' ? 520 : 430, 255, kind === 'awakening' ? 235 : 218, kind === 'fusion' ? 160 : 230, false);
    this.scene.cameras.main.shake(kind === 'fusion' ? 340 : 280, kind === 'upgrade' ? 0.004 : 0.006);

    for (let i = 0; i < 4; i += 1) {
      const flash = this.scene.add.rectangle(centerX, centerY, GAME_WIDTH + 120, 34 - i * 4, i % 2 === 0 ? main : sub, 0.22 - i * 0.025)
        .setAngle(-18 + i * 8)
        .setBlendMode('ADD');
      root.add(flash);
      this.scene.tweens.add({ targets: flash, scaleX: 1.8, alpha: 0, delay: 80 + i * 40, duration: 680, ease: 'Cubic.easeOut' });
    }

    const leftCore = this.scene.add.circle(centerX - 92, centerY + 12, 22, kind === 'fusion' ? COLORS.ink : COLORS.paperScrap, 0.86).setBlendMode('ADD');
    const rightCore = this.scene.add.circle(centerX + 92, centerY + 12, 22, kind === 'fusion' ? COLORS.lantern : sub, 0.86).setBlendMode('ADD');
    const bridge = this.scene.add.rectangle(centerX, centerY + 12, 180, 4, main, 0.68).setBlendMode('ADD');
    root.add([leftCore, rightCore, bridge]);
    this.scene.tweens.add({ targets: leftCore, x: centerX - 8, scale: 0.62, duration: 380, ease: 'Cubic.easeIn' });
    this.scene.tweens.add({ targets: rightCore, x: centerX + 8, scale: 0.62, duration: 380, ease: 'Cubic.easeIn' });
    this.scene.tweens.add({ targets: bridge, scaleX: 0.12, alpha: 0, duration: 420, ease: 'Cubic.easeIn' });
    this.scene.time.delayedCall(420, () => {
      leftCore.destroy();
      rightCore.destroy();
      bridge.destroy();
      if (this.current === root) this.addEvolutionExplosion(root, centerX, centerY + 12, main, sub, kind);
    });

    for (let i = 0; i < 26; i += 1) {
      const angle = (Math.PI * 2 * i) / 26;
      const particle = i % 3 === 0
        ? this.scene.add.rectangle(centerX, centerY + 12, 9, 5, COLORS.paperScrap, 0.82)
        : this.scene.add.circle(centerX, centerY + 12, 2.8 + (i % 3), i % 2 === 0 ? main : sub, 0.86).setBlendMode('ADD');
      particle.setRotation(angle);
      root.add(particle);
      this.scene.tweens.add({
        targets: particle,
        x: centerX + Math.cos(angle) * (110 + (i % 5) * 18),
        y: centerY + 12 + Math.sin(angle) * (86 + (i % 4) * 16),
        angle: particle.angle + 140,
        alpha: 0,
        delay: 420 + i * 8,
        duration: 780,
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  private addEvolutionExplosion(root: Phaser.GameObjects.Container, x: number, y: number, main: number, sub: number, kind: EvolutionKind): void {
    const burst = this.scene.add.circle(x, y, 18, main, 0.2).setBlendMode('ADD');
    burst.setStrokeStyle(5, kind === 'fusion' ? 0xffffff : sub, 0.95);
    const shock = this.scene.add.circle(x, y, 42, sub, 0.04).setBlendMode('ADD');
    shock.setStrokeStyle(4, main, 0.62);
    root.add([burst, shock]);
    this.scene.tweens.add({ targets: burst, scale: 7.5, alpha: 0, duration: 620, ease: 'Cubic.easeOut', onComplete: () => burst.destroy() });
    this.scene.tweens.add({ targets: shock, scale: 4.2, alpha: 0, duration: 820, ease: 'Cubic.easeOut', onComplete: () => shock.destroy() });
  }

  showResult(
    state: RuntimeState,
    cleared: boolean,
    log: PlayLog,
    settlement: RunSettlement,
    ownedCurrency: number,
    onRestart: () => void,
    onTop: () => void,
    onGrowth: () => void,
    onStageSelect: () => void,
  ): void {
    const root = this.dim(cleared ? 0.72 : 0.86);
    if (cleared) {
      const dawn = drawDawnGlow(this.scene, GAME_WIDTH, { y: 40, height: 180, alpha: 0.08 });
      root.add(dawn);
    }

    const stats = state.stats;
    const survived = Math.floor(stats.survivedSec);
    const mm = Math.floor(survived / 60).toString().padStart(2, '0');
    const ss = (survived % 60).toString().padStart(2, '0');
    const rank = resultRank(cleared, state.player.level, stats.kills, stats.evolutions.length);

    const pageW = 360;
    const pageH = 620;
    const pageX = GAME_WIDTH / 2;
    const pageY = 50 + pageH / 2;
    const pageG = this.scene.add.graphics();
    drawLargeNotebookPage(pageG, pageX, pageY, pageW, pageH, {
      accent: cleared ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.dustyRose,
    });
    pageG.setAlpha(0);
    root.add(pageG);
    this.scene.tweens.add({ targets: pageG, alpha: 1, duration: 300, ease: 'Quad.easeOut' });

    const titleText = cleared ? '夜明け' : '夜に飲まれた';
    const titleSize = cleared ? 30 : 24;
    const titleColor = cleared ? STORYBOOK_UI.textDark : STORYBOOK_UI.textDark;
    const resultTitle = this.text(pageX, 88, titleText, titleSize, titleColor, true);
    resultTitle.setScale(0.7).setAlpha(0);
    root.add(resultTitle);
    this.scene.tweens.add({ targets: resultTitle, scale: 1, alpha: 1, duration: 400, delay: 100, ease: 'Back.easeOut' });

    root.add(this.text(pageX, 120, `生存 ${mm}:${ss}　Lv.${state.player.level}`, 13, STORYBOOK_UI.textSoft, true));

    const sealContainer = drawRankSeal(this.scene, pageX + pageW / 2 - 42, 106, rank, { radius: 32, depth: D + 2 });
    sealContainer.setScale(0).setAlpha(0);
    root.add(sealContainer);
    this.scene.tweens.add({ targets: sealContainer, scale: 1, alpha: 1, duration: 380, delay: 300, ease: 'Back.easeOut' });

    const divG = this.scene.add.graphics();
    drawInkDivider(divG, pageX, 142, pageW - 60);
    root.add(divG);

    const levelUpText = settlement.characterLevelAfter > settlement.characterLevelBefore
      ? ` (Lv ${settlement.characterLevelBefore}→${settlement.characterLevelAfter})`
      : '';

    root.add(this.text(pageX, 162, '夜の記録', 13, STORYBOOK_UI.textSoft, true));
    const statChipW = 146;
    root.add(this.resultStatChip(pageX - 78, 198, statChipW, 46, STORYBOOK_UI.mutedTeal, '生存', `${mm}:${ss}`));
    root.add(this.resultStatChip(pageX + 78, 198, statChipW, 46, STORYBOOK_UI.warmAmber, '灯度', `Lv.${state.player.level}`));
    root.add(this.resultStatChip(pageX - 78, 250, statChipW, 46, STORYBOOK_UI.dustyRose, 'ほどいた影', `${stats.kills}`));
    root.add(this.resultStatChip(pageX + 78, 250, statChipW, 46, STORYBOOK_UI.lanternCore, '記憶片', `${stats.memoryFragmentsCollected}`));

    const rewardDiv = this.scene.add.graphics();
    drawInkDivider(rewardDiv, pageX, 292, pageW - 96, { color: STORYBOOK_UI.paperDark, alpha: 0.22 });
    root.add(rewardDiv);
    root.add(this.text(pageX, 312, 'Rewards', 14, STORYBOOK_UI.textDark, true));
    root.add(this.resultRewardCard(
      pageX - 112,
      360,
      96,
      72,
      STORYBOOK_UI.warmAmber,
      '黒曜片',
      `+${settlement.currencyEarned}`,
      settlement.currencyEarned,
      (value) => `+${value}`,
      520,
      'currency_gain',
    ));
    root.add(this.resultRewardCard(
      pageX,
      360,
      96,
      72,
      STORYBOOK_UI.mutedTeal,
      'キャラEXP',
      `+${settlement.characterXpEarned}${levelUpText}`,
      settlement.characterXpEarned,
      (value) => `+${value}${levelUpText}`,
      640,
      'result_count',
    ));
    root.add(this.resultRewardCard(
      pageX + 112,
      360,
      96,
      72,
      STORYBOOK_UI.dawnPeach,
      'カプセル',
      `${stats.capsulesOpened}`,
      stats.capsulesOpened,
      undefined,
      760,
      'result_count',
    ));

    let infoY = 430;
    const recordDiv = this.scene.add.graphics();
    drawInkDivider(recordDiv, pageX, infoY - 20, pageW - 92, { color: STORYBOOK_UI.paperDark, alpha: 0.2 });
    root.add(recordDiv);
    root.add(this.text(pageX, infoY - 2, 'New Records', 13, STORYBOOK_UI.textDark, true));
    infoY += 26;

    root.add(this.resultRecordRow(pageX, infoY, 292, STORYBOOK_UI.mutedTeal, '初撃破', formatSeconds(log.firstKillSec), log.firstKillSec != null));
    infoY += 34;
    root.add(this.resultRecordRow(pageX, infoY, 292, STORYBOOK_UI.warmAmber, 'Lv2到達', formatSeconds(log.level2Sec), log.level2Sec != null));
    infoY += 34;
    root.add(this.resultRecordRow(pageX, infoY, 292, STORYBOOK_UI.dustyRose, '初被弾 / 初カプセル', `${formatSeconds(log.firstDamageSec)} / ${formatSeconds(log.firstCapsuleSec)}`, log.firstDamageSec != null || log.firstCapsuleSec != null));
    infoY += 38;

    if (stats.elitesKilled > 0) {
      const eliteLabel = state.stageNumber === 2
        ? `雨影をほどいた ×${stats.elitesKilled}`
        : `大きな影を越えた ×${stats.elitesKilled}`;
      root.add(this.resultRecordRow(pageX, infoY, 292, STORYBOOK_UI.dustyRose, 'Elite', eliteLabel, true));
      infoY += 34;
    }

    const motivationMessage = resultMotivation(cleared, rank, state.player.level, state.stageNumber);
    const hasNewAch = settlement.newAchievements.length > 0;
    const hasAchReward = settlement.achievementReward > 0;
    const bonusParts: string[] = [];
    if (settlement.stageBonus > 1) bonusParts.push(`夜道×${settlement.stageBonus.toFixed(1)}`);
    if (settlement.depthBonus > 1) bonusParts.push(`深度×${settlement.depthBonus.toFixed(1)}`);
    if (settlement.noBerserkBonus > 1) bonusParts.push(`黒曜なし×${settlement.noBerserkBonus.toFixed(2)}`);
    if (settlement.firstClearBonus > 1) bonusParts.push(`初回×${settlement.firstClearBonus.toFixed(2)}`);

    const summaryLines: string[] = [motivationMessage];
    if (bonusParts.length > 0) {
      summaryLines.push(`Bonus: ${bonusParts.map((part) => part.split('×')[0]).join(' / ')}`);
    }

    const evolutionLabels = stats.evolutions.map((id) => evolutionResultLabel(id));
    if (evolutionLabels.length > 0) {
      const visible = evolutionLabels.slice(0, 2).join(' / ');
      const more = evolutionLabels.length > 2 ? `　ほか ${evolutionLabels.length - 2}件` : '';
      summaryLines.push(`進化/合体: ${visible}${more}`);
    }

    if (settlement.unlockedStage != null) {
      const recipe = recipeForStage(settlement.unlockedStage);
      summaryLines.push(`新しい夜が開いた — ${recipe.name}`);
      this.scene.time.delayedCall(1200, () => {
        getAudioManager(this.scene).playSe('stage_unlock', { volume: 0.6, priority: 2 });
      });
    }
    if (hasNewAch || hasAchReward) {
      const parts: string[] = [];
      if (hasNewAch) parts.push(`実績 +${settlement.newAchievements.length}`);
      if (hasAchReward) parts.push(`報酬 +${settlement.achievementReward}`);
      summaryLines.push(`記録に追加: ${parts.join('　')}`);
      if (hasAchReward) {
        this.scene.time.delayedCall(900, () => {
          getAudioManager(this.scene).playSe('currency_gain', { volume: 0.36, priority: 1 });
        });
      }
    }

    const summaryG = this.scene.add.graphics();
    drawSecondaryPaperButton(summaryG, pageX, 596, 306, 76, { accent: cleared ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.dustyRose });
    summaryG.fillStyle(STORYBOOK_UI.paperLight, 0.04).fillRect(pageX - 144, 562, 288, 2);
    root.add(summaryG);
    summaryLines.slice(0, 4).forEach((line, index) => {
      const compactLine = line.length > 32 ? `${line.slice(0, 31)}…` : line;
      root.add(this.text(
        pageX,
        570 + index * 16,
        compactLine,
        index === 0 ? 10 : 9,
        index === 0 ? STORYBOOK_UI.textLight : STORYBOOK_UI.textMuted,
        index === 0,
      ));
    });

    const growthLabel = hasAchReward ? '黒曜片を使う' : '成長へ';
    const btnY1 = GAME_HEIGHT - 160;
    const btnY2 = GAME_HEIGHT - 108;
    const btnY3 = GAME_HEIGHT - 62;
    if (cleared) {
      root.add(this.resultPrimaryButton(pageX, btnY1, 280, 46, growthLabel, () => {
        this.clear();
        onGrowth();
      }));
      root.add(this.button(pageX, btnY2, 240, 40, 'もう一度探索', () => {
        this.clear();
        onRestart();
      }));
      root.add(this.button(pageX - 78, btnY3, 140, 34, 'ステージ選択', () => {
        this.clear();
        onStageSelect();
      }, true));
      root.add(this.button(pageX + 78, btnY3, 140, 34, 'TOPへ', () => {
        this.clear();
        onTop();
      }, true));
    } else {
      root.add(this.resultPrimaryButton(pageX, btnY1, 280, 46, growthLabel, () => {
        this.clear();
        onGrowth();
      }));
      root.add(this.button(pageX, btnY2, 240, 40, 'もう一度挑戦', () => {
        this.clear();
        onRestart();
      }));
      root.add(this.button(pageX - 78, btnY3, 140, 34, 'ステージ選択', () => {
        this.clear();
        onStageSelect();
      }, true));
      root.add(this.button(pageX + 78, btnY3, 140, 34, 'TOPへ', () => {
        this.clear();
        onTop();
      }, true));
    }
    root.setAlpha(0);
    this.scene.tweens.add({ targets: root, alpha: 1, duration: 180, ease: 'Quad.easeOut' });
  }

  showPause(
    onResume: () => void,
    onTop?: () => void,
    onStage?: () => void,
    onGrowth?: () => void,
  ): void {
    const root = this.dim(0.72);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 312, 380, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.98);
    root.add(panel);

    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 138, 'ひと休み', 26, STORYBOOK_UI.textLight, true));
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 104, '夜路は逃げない', 12, STORYBOOK_UI.textMuted));

    // 一番大きい「つづける」を中央に。
    root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 42, 240, 52, 'つづける', () => {
      this.clear();
      onResume();
    }));

    // 下に Home 系を縦並びで3つ。誤タップを避けつつ、押しやすいサイズ。
    if (onStage) {
      root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 24, 240, 42, 'ステージ選択へ', () => {
        this.clear();
        onStage();
      }, true));
    }
    if (onGrowth) {
      root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 76, 240, 42, '成長へ', () => {
        this.clear();
        onGrowth();
      }, true));
    }
    if (onTop) {
      root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 128, 240, 42, 'TOPへ戻る', () => {
        this.clear();
        onTop();
      }, true));
    }
  }

  private replaceRow(
    x: number,
    y: number,
    width: number,
    height: number,
    ref: IconRef,
    label: string,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const row = this.scene.add.container(x, y);
    const palette = storybookCategoryPalette(ref.category);
    const graphics = this.scene.add.graphics();
    drawPaperCard(graphics, 0, 0, width, height, palette.accent, palette.paper);
    row.add(graphics);
    const hit = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this.scene, hit, row, { x, y, width, height, accent: palette.accent, depth: D + 8 });
    hit.on('pointerdown', () => {
      getAudioManager(this.scene).playSe('choice_select', { volume: 0.44, priority: 1 });
      onClick();
    });
    row.add(hit);
    this.addInventoryIcon(row, ref, -width / 2 + 34, 0, LIST_ICON_SIZE, palette.accent);
    row.add(this.scene.add.text(-width / 2 + 67, 0, wrapUiText(label, 18, 1), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '14px',
      color: STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      resolution: 2,
      backgroundColor: '#f4ead4',
      padding: { left: 4, right: 4, top: 2, bottom: 2 },
    }).setOrigin(0, 0.5));
    row.add(this.scene.add.text(width / 2 - 15, 0, '交換', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: STORYBOOK_UI.textSoft,
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(1, 0.5));
    return row;
  }

  private addInventoryIcon(
    container: Phaser.GameObjects.Container,
    ref: IconRef,
    x: number,
    y: number,
    size: number,
    accent: number,
  ): void {
    const texture = resolveInventoryIconTexture(this.scene.textures, ref.category, ref.itemId);
    if (texture) {
      container.add(this.scene.add.image(x, y, texture).setDisplaySize(size, size));
      return;
    }
    container.add(this.scene.add.text(x, y, getInventoryIconRequirement(ref.category, ref.itemId)?.fallbackGlyph ?? '?', {
      fontFamily: STORYBOOK_FONT,
      fontSize: `${Math.round(size * 0.42)}px`,
      color: colorString(accent),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5));
  }

  private resultStatChip(
    x: number,
    y: number,
    width: number,
    height: number,
    accent: number,
    label: string,
    value: string,
  ): Phaser.GameObjects.Container {
    const c = this.scene.add.container(x, y);
    const g = this.scene.add.graphics();
    drawSecondaryPaperButton(g, 0, 0, width, height, { accent });
    g.fillStyle(accent, 0.1).fillCircle(-width / 2 + 16, 0, 7);
    g.fillStyle(STORYBOOK_UI.paperLight, 0.08).fillRect(-width / 2 + 34, -height / 2 + 8, width - 48, 2);
    c.add(g);
    c.add(this.scene.add.text(-width / 2 + 32, -8, label, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '9px',
      color: colorString(STORYBOOK_UI.textMuted),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0, 0.5));
    c.add(this.scene.add.text(width / 2 - 12, 9, value, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '15px',
      color: colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(1, 0.5));
    return c;
  }

  private resultRewardCard(
    x: number,
    y: number,
    width: number,
    height: number,
    accent: number,
    label: string,
    value: string,
    countTo?: number,
    format?: (value: number) => string,
    delay = 500,
    sound: 'currency_gain' | 'result_count' = 'result_count',
  ): Phaser.GameObjects.Container {
    const c = this.scene.add.container(x, y);
    const g = this.scene.add.graphics();
    drawRewardIconCard(g, 0, 0, Math.min(width, height));
    g.fillStyle(accent, 0.11).fillRect(-width / 2 + 6, height / 2 - 20, width - 12, 14);
    g.fillStyle(accent, 0.16).fillCircle(0, -18, 10);
    g.lineStyle(1, accent, 0.48).strokeCircle(0, -18, 14);
    c.add(g);

    c.add(this.scene.add.text(0, 8, label, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '9px',
      color: colorString(STORYBOOK_UI.textSoft),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5));
    const valueText = this.scene.add.text(0, 26, countTo == null ? value : (format ? format(0) : '0'), {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '13px',
      color: colorString(STORYBOOK_UI.textDark),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5);
    c.add(valueText);

    if (countTo != null) {
      this.scene.time.delayedCall(delay, () => {
        getAudioManager(this.scene).playSe(sound, { volume: sound === 'currency_gain' ? 0.46 : 0.3 });
        this.countUpText(valueText, countTo, format);
      });
    }
    return c;
  }

  private resultRecordRow(
    x: number,
    y: number,
    width: number,
    accent: number,
    label: string,
    value: string,
    checked: boolean,
  ): Phaser.GameObjects.Container {
    const c = this.scene.add.container(x, y);
    const g = this.scene.add.graphics();
    drawSecondaryPaperButton(g, 0, 0, width, 26, { accent });
    g.fillStyle(accent, checked ? 0.18 : 0.08).fillRect(-width / 2 + 6, -8, 20, 16);
    c.add(g);
    c.add(this.scene.add.text(-width / 2 + 16, 0, checked ? '✓' : '•', {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '13px',
      color: colorString(checked ? STORYBOOK_UI.goldLight : STORYBOOK_UI.textMuted),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5));
    c.add(this.scene.add.text(-width / 2 + 36, 0, label, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: colorString(STORYBOOK_UI.textMuted),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0, 0.5));
    c.add(this.scene.add.text(width / 2 - 12, 0, value, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(1, 0.5));
    return c;
  }

  private countUpText(
    target: Phaser.GameObjects.Text,
    to: number,
    format: (value: number) => string = (value) => String(value),
  ): void {
    const counter = { value: 0 };
    this.scene.tweens.add({
      targets: counter,
      value: Math.max(0, to),
      duration: 420,
      ease: 'Cubic.easeOut',
      onUpdate: () => target.setText(format(Math.round(counter.value))),
      onComplete: () => target.setText(format(to)),
    });
  }

  private resultPrimaryButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const btn = this.scene.add.container(x, y);
    const g = this.scene.add.graphics();
    drawPrimaryPaperCta(g, 0, 0, width, height);
    btn.add(g);
    const hit = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this.scene, hit, btn, { x, y, width, height, accent: STORYBOOK_UI.warmAmber, depth: D + 10, strong: true, shake: true });
    hit.on('pointerdown', () => {
      getAudioManager(this.scene).playSe('ui_confirm', { volume: 0.48 });
      onClick();
    });
    btn.add(hit);
    btn.add(this.scene.add.text(0, 0, label, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '16px',
      color: STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5));
    return btn;
  }

  private button(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    onClick: () => void,
    dark = false,
  ): Phaser.GameObjects.Container {
    const button = this.scene.add.container(x, y);
    const graphics = this.scene.add.graphics();
    if (dark) drawStorybookPanel(graphics, 0, 0, width, height, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.96);
    else drawPaperCard(graphics, 0, 0, width, height, STORYBOOK_UI.gold, STORYBOOK_UI.paper);
    button.add(graphics);
    const hit = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this.scene, hit, button, {
      x,
      y,
      width,
      height,
      accent: dark ? STORYBOOK_UI.goldLight : STORYBOOK_UI.gold,
      depth: D + 10,
      strong: height >= 44,
      shake: height >= 44,
    });
    hit.on('pointerdown', () => {
      getAudioManager(this.scene).playSe(dark ? 'ui_select' : 'ui_confirm', { volume: dark ? 0.34 : 0.44 });
      onClick();
    });
    button.add(hit);
    button.add(this.scene.add.text(0, 0, label, {
      fontFamily: STORYBOOK_FONT,
      fontSize: `${height <= 30 ? 11 : 15}px`,
      color: dark ? STORYBOOK_UI.textLight : STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5));
    return button;
  }
}

function categoryForChoice(choice: LevelUpChoice): InventoryIconCategory | null {
  const category = storybookCategoryForChoice(choice);
  return category === 'heal' ? null : category;
}

function iconRefForReward(reward: CapsuleReward): IconRef | null {
  if (reward.type === 'evolution') return { category: 'weapon', itemId: reward.evolvedWeaponId };
  if (reward.type === 'weapon_upgrade') return { category: 'weapon', itemId: reward.itemId };
  if (reward.type === 'passive_upgrade') return { category: 'passive', itemId: reward.itemId };
  return null;
}

function evolutionActionLabel(kind: EvolutionKind): string {
  if (kind === 'upgrade') return '武器進化';
  if (kind === 'fusion') return '武器合体';
  return '覚醒合成';
}

function evolutionKindLabel(kind: EvolutionKind): string {
  if (kind === 'upgrade') return '強化進化';
  if (kind === 'fusion') return '合体';
  return '覚醒';
}

function evolutionResultLabel(evolvedWeaponId: string): string {
  const evolution = evolutions.find((item) => item.evolvedWeaponId === evolvedWeaponId);
  const name = weaponById.get(evolvedWeaponId)?.name ?? evolvedWeaponId;
  return evolution ? `${evolutionKindLabel(evolution.kind)}:${name}` : name;
}

function formatSeconds(value: number | null): string {
  return value === null ? '--' : `${value.toFixed(1)}s`;
}

function resultMotivation(cleared: boolean, rank: string, level: number, stageNumber = 1): string {
  if (stageNumber === 2) {
    if (cleared) {
      if (rank === 'S') return '雨ににじんだ線が、すべて戻った。';
      if (rank === 'A') return '雨ににじんだ線が、少しだけ戻った。';
      return '地図の線が読めるようになった。次の夜路へ。';
    }
    if (level >= 4) return '地図は濡れている。でも、まだ読める線がある。';
    if (level >= 2) return '雨はまだ止まない。でも、灯りは残っている。';
    return 'にじんだ地図を、もう一度開こう。';
  }
  if (cleared) {
    if (rank === 'S') return '完璧な夜明け。すべての灯りが集まった。';
    if (rank === 'A') return '強い夜明け。まだ拾える灯りがある。';
    return '夜を越えた。次はもう少し深くまで。';
  }
  if (level >= 4) return 'もう少しで夜明けだった。持ち帰った灯りで強くなれる。';
  if (level >= 2) return 'まだ夜は深い。でも、黒曜片は残っている。';
  return 'まだ、戻せていない名前がある。灯りを集めよう。';
}

function resultRank(cleared: boolean, level: number, kills: number, evolutions: number): string {
  if (cleared && (evolutions >= 1 || level >= 10 || kills >= 180)) return 'S';
  if (cleared || level >= 7 || kills >= 120) return 'A';
  if (level >= 4 || kills >= 60) return 'B';
  return 'C';
}

function colorString(color: string | number): string {
  return typeof color === 'number' ? '#' + color.toString(16).padStart(6, '0') : color;
}
