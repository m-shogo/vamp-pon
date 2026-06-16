import Phaser from 'phaser';
import type { EvolutionKind, LevelUpChoice, CapsuleReward } from '../domain/types';
import type { RuntimeState } from '../runtime';
import type { PlayLog } from '../domain/playLog';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { EVOLUTION_ACCENT } from './visualDesign';
import { weaponById } from '../data/weapons';
import { passiveById } from '../data/passives';
import { rareItemById } from '../data/rareItems';
import { evolutions } from '../data/evolutions';
import {
  getInventoryIconRequirement,
  resolveInventoryIconTexture,
  type InventoryIconCategory,
} from '../assets/inventoryIcons';
import {
  LEVEL_UP_CARD_CENTER_Y,
  LEVEL_UP_CARD_HEIGHT,
  LEVEL_UP_CARD_WIDTH,
  LEVEL_UP_HEADER_Y,
  LEVEL_UP_PANEL_TOP,
  LEVEL_UP_REROLL_Y,
  REPLACE_ACTION_Y,
  REPLACE_ROW_HEIGHT,
  REPLACE_ROW_WIDTH,
  levelUpCardCenters,
  replaceRowCenters,
  wrapUiText,
} from './itemSelectionLayout';
import { createStorybookChoiceCard, categoryForChoice as storybookCategoryForChoice } from './storybookChoiceCard';
import {
  STORYBOOK_FONT,
  STORYBOOK_UI,
  drawPaperCard,
  drawRarityStars,
  drawStorybookPanel,
  storybookCategoryPalette,
} from './storybookUi';

const D = VIEW_DEPTH.overlay;
const DETAIL_ICON_SIZE = 88;
const LIST_ICON_SIZE = 46;

type IconRef = { category: InventoryIconCategory; itemId: string };

export class Overlays {
  private current: Phaser.GameObjects.Container | null = null;

  constructor(private scene: Phaser.Scene) {}

  clear(): void {
    this.current?.destroy(true);
    this.current = null;
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
    color: string,
    bold = false,
  ): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, value, {
      fontFamily: STORYBOOK_FONT,
      fontSize: `${size}px`,
      color,
      fontStyle: bold ? 'bold' : 'normal',
      align: 'center',
      resolution: 1,
      lineSpacing: 2,
      padding: { left: 1, right: 1, top: 1, bottom: 1 },
    }).setOrigin(0.5);
  }

  showReady(onStart: () => void): void {
    const root = this.dim(0.62);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 344, 326, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.96);
    root.add(panel);
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 110, 'ヴァンサバ 改', 31, STORYBOOK_UI.textLight, true));
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70, '影を払い、記憶を拾い、朝まで残る', 12, STORYBOOK_UI.textMuted));
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 12, '夜の街で忘れ物を集める。', 13, STORYBOOK_UI.textLight));
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 16, '移動は画面をドラッグ。必殺は右下。', 12, STORYBOOK_UI.textMuted));
    root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 94, 180, 46, '夜へ進む', () => {
      this.clear();
      onStart();
    }));
  }

  showLevelUp(
    state: RuntimeState,
    choices: LevelUpChoice[],
    onPick: (choice: LevelUpChoice) => void,
    onReroll: () => void,
  ): void {
    const root = this.dim(0.24);
    const dock = this.scene.add.graphics();
    drawStorybookPanel(
      dock,
      GAME_WIDTH / 2,
      (LEVEL_UP_PANEL_TOP + GAME_HEIGHT) / 2,
      GAME_WIDTH - 8,
      GAME_HEIGHT - LEVEL_UP_PANEL_TOP - 4,
      STORYBOOK_UI.nightPanel,
      STORYBOOK_UI.gold,
      0.94,
    );
    root.add(dock);

    root.add(this.text(GAME_WIDTH / 2, LEVEL_UP_HEADER_Y, 'ひとつ選ぶ', 18, STORYBOOK_UI.textLight, true));
    root.add(this.text(
      GAME_WIDTH / 2,
      LEVEL_UP_HEADER_Y + 23,
      `武器 ${state.inventory.weapons.length}/${state.inventory.weaponSlots}　忘れ物 ${state.inventory.passives.length}/${state.inventory.passiveSlots}　レア ${state.inventory.rareItems.length}/${state.inventory.rareItemSlots}`,
      9,
      STORYBOOK_UI.textMuted,
      true,
    ));

    const xCenters = levelUpCardCenters(choices.length, GAME_WIDTH);
    choices.slice(0, 3).forEach((choice, index) => {
      root.add(createStorybookChoiceCard(
        this.scene,
        xCenters[index],
        LEVEL_UP_CARD_CENTER_Y,
        LEVEL_UP_CARD_WIDTH,
        LEVEL_UP_CARD_HEIGHT,
        choice,
        () => {
          this.clear();
          onPick(choice);
        },
      ));
    });

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
    const evolution = reward.type === 'evolution';
    const root = this.dim(evolution ? 0.68 : 0.58);
    const category: InventoryIconCategory = reward.type === 'passive_upgrade' ? 'passive' : 'weapon';
    const palette = storybookCategoryPalette(category);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 300, 390, STORYBOOK_UI.nightPanel, evolution ? EVOLUTION_ACCENT[reward.evolutionKind].main : palette.accent, 0.97);
    root.add(panel);

    const card = this.scene.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 14);
    const paper = this.scene.add.graphics();
    drawPaperCard(paper, 0, 0, 210, 290, palette.accent, palette.paper);
    card.add(paper);
    const ref = iconRefForReward(reward);
    if (ref) this.addInventoryIcon(card, ref, 0, -30, 104, palette.accent);
    card.add(this.scene.add.text(0, -126, evolution ? evolutionKindLabel(reward.evolutionKind) : '記憶カプセル', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: STORYBOOK_UI.textSoft,
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0.5));
    card.add(this.scene.add.text(0, 48, wrapUiText(reward.title, 15, 2), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '18px',
      color: STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      align: 'center',
      resolution: 1,
    }).setOrigin(0.5));
    if (reward.type === 'evolution' && reward.lore) {
      card.add(this.scene.add.text(0, 90, wrapUiText(reward.lore, 18, 3), {
        fontFamily: STORYBOOK_FONT,
        fontSize: '10px',
        color: STORYBOOK_UI.textSoft,
        align: 'center',
        lineSpacing: 2,
        resolution: 1,
      }).setOrigin(0.5, 0));
    }
    root.add(card);

    const close = () => {
      this.clear();
      onClose();
    };
    (root.list[0] as Phaser.GameObjects.Rectangle).on('pointerdown', close);
    this.scene.time.delayedCall(evolution ? 1900 : 1200, () => {
      if (this.current === root) close();
    });
  }

  showResult(state: RuntimeState, cleared: boolean, log: PlayLog, onRestart: () => void): void {
    const root = this.dim(0.78);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 348, 680, STORYBOOK_UI.nightPanel, cleared ? STORYBOOK_UI.gold : STORYBOOK_UI.special, 0.98);
    root.add(panel);
    const stats = state.stats;
    const survived = Math.floor(stats.survivedSec);
    const mm = Math.floor(survived / 60).toString().padStart(2, '0');
    const ss = (survived % 60).toString().padStart(2, '0');
    root.add(this.text(GAME_WIDTH / 2, 118, cleared ? '朝まで残った' : '夜に飲まれた', 26, STORYBOOK_UI.textLight, true));
    root.add(this.text(GAME_WIDTH / 2, 170, `生存 ${mm}:${ss}　Lv.${state.player.level}`, 16, STORYBOOK_UI.goldLight, true));
    root.add(this.text(GAME_WIDTH / 2, 228, `倒した影　${stats.kills}\n集めた欠片　${stats.memoryFragmentsCollected}\nカプセル　${stats.capsulesOpened}\n必殺技　${stats.ultimateUses}回`, 15, STORYBOOK_UI.textLight));
    const evolutionNames = stats.evolutions.map((id) => evolutionResultLabel(id)).join(' / ');
    if (evolutionNames) root.add(this.text(GAME_WIDTH / 2, 350, `変化\n${evolutionNames}`, 12, STORYBOOK_UI.goldLight));
    root.add(this.text(GAME_WIDTH / 2, 470, cleared ? '黒いインクの下に、まだ道が残っている。' : 'まだ、戻せていない名前がある。', 12, STORYBOOK_UI.textMuted));
    root.add(this.text(GAME_WIDTH / 2, 530, `初撃破 ${formatSeconds(log.firstKillSec)}　Lv2 ${formatSeconds(log.level2Sec)}\n初被弾 ${formatSeconds(log.firstDamageSec)}　初カプセル ${formatSeconds(log.firstCapsuleSec)}`, 10, '#9fe0a0'));
    root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT - 100, 190, 48, 'もう一度', () => {
      this.clear();
      onRestart();
    }));
  }

  showPause(onResume: () => void): void {
    const root = this.dim(0.66);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 280, 190, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.98);
    root.add(panel);
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 42, 'やすみ中', 24, STORYBOOK_UI.textLight, true));
    root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35, 180, 46, 'つづける', () => {
      this.clear();
      onResume();
    }));
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
    hit.on('pointerdown', onClick);
    row.add(hit);
    this.addInventoryIcon(row, ref, -width / 2 + 34, 0, LIST_ICON_SIZE, palette.accent);
    row.add(this.scene.add.text(-width / 2 + 67, 0, wrapUiText(label, 18, 1), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '14px',
      color: STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0, 0.5));
    row.add(this.scene.add.text(width / 2 - 15, 0, '交換', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '9px',
      color: STORYBOOK_UI.textSoft,
      fontStyle: 'bold',
      resolution: 1,
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
    }).setOrigin(0.5));
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
    hit.on('pointerdown', onClick);
    button.add(hit);
    button.add(this.scene.add.text(0, 0, label, {
      fontFamily: STORYBOOK_FONT,
      fontSize: `${height <= 30 ? 10 : 15}px`,
      color: dark ? STORYBOOK_UI.textLight : STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      resolution: 1,
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

function colorString(color: number): string {
  return '#' + color.toString(16).padStart(6, '0');
}
