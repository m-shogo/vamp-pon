import Phaser from 'phaser';
import type { EvolutionKind, LevelUpChoice, CapsuleReward, RewardRarity } from '../domain/types';
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
  LEVEL_UP_CARD_HEIGHT,
  LEVEL_UP_CARD_WIDTH,
  LEVEL_UP_FOOTER_HINT_Y,
  LEVEL_UP_REROLL_Y,
  REPLACE_ACTION_Y,
  REPLACE_ROW_HEIGHT,
  REPLACE_ROW_WIDTH,
  levelUpCardCenters,
  replaceRowCenters,
  wrapUiText,
} from './itemSelectionLayout';
import { PixelGlyphText, UI_FONT, drawPixelPanel } from './pixelUi';

const D = VIEW_DEPTH.overlay;
const DETAIL_ICON_SIZE = 60;
const LIST_ICON_SIZE = 45;

type IconRef = {
  category: InventoryIconCategory;
  itemId: string;
};

export class Overlays {
  private current: Phaser.GameObjects.Container | null = null;

  constructor(private scene: Phaser.Scene) {}

  private dim(alpha = 0.72): Phaser.GameObjects.Container {
    this.clear();
    const c = this.scene.add.container(0, 0).setDepth(D);
    const bg = this.scene.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      COLORS.overlay,
      alpha,
    ).setInteractive();
    c.add(bg);
    this.current = c;
    return c;
  }

  clear(): void {
    this.current?.destroy(true);
    this.current = null;
  }

  private text(
    x: number,
    y: number,
    value: string,
    size: number,
    color: string,
    origin = 0.5,
    bold = false,
  ): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, value, {
      fontFamily: UI_FONT,
      fontSize: `${size}px`,
      color,
      align: 'center',
      fontStyle: bold ? 'bold' : 'normal',
      resolution: 1,
      padding: { left: 1, right: 1, top: 1, bottom: 1 },
    }).setOrigin(origin, 0.5);
  }

  private panel(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: number,
    edge: number,
    accent = edge,
    cut = 6,
    border = 2,
    dots = false,
  ): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    drawPixelPanel(graphics, x, y, width, height, {
      fill,
      edge,
      accent,
      cut,
      border,
      dots,
    });
    return graphics;
  }

  private screenPanel(top = 28, bottom = 824): Phaser.GameObjects.Graphics {
    const height = bottom - top;
    return this.panel(
      GAME_WIDTH / 2,
      top + height / 2,
      GAME_WIDTH - 24,
      height,
      0x171328,
      0x665d80,
      0xb8a06a,
      10,
      2,
      false,
    );
  }

  private inventoryChip(
    cx: number,
    cy: number,
    width: number,
    label: string,
    value: string,
    accent: number,
  ): Phaser.GameObjects.Container {
    const chip = this.scene.add.container(cx, cy);
    chip.add(this.panel(0, 0, width, 28, 0x241e38, accent, accent, 4, 1));
    const labelText = this.scene.add.text(-width / 2 + 8, 0, label, {
      fontFamily: UI_FONT,
      fontSize: '10px',
      color: '#d8cfe8',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0, 0.5);
    const valuePixels = new PixelGlyphText(
      this.scene,
      width / 2 - 8,
      -4,
      1,
      0xf3ead2,
      'right',
      1,
    ).setText(value);
    chip.add([labelText, valuePixels.container]);
    return chip;
  }

  showReady(onStart: () => void): void {
    const c = this.dim(0.58);
    c.add(this.panel(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 12, 350, 340, 0x171328, 0x665d80, 0xffce7a, 10, 3));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 94, 'Vamp Pon', 36, '#f3ead2', 0.5, true));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 44, '夜の街で、忘れ物を集めて', 13, '#d9cfbd'));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 22, '朝まで生きのびる。', 13, '#d9cfbd'));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 38, '移動　どこでもドラッグ / WASD・矢印', 12, '#c9bfae'));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 64, '必殺技　右上のドットアイコン', 12, '#c9bfae'));
    c.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 126, 200, 52, 'はじめる', () => {
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
    const c = this.dim(0.86);
    c.add(this.screenPanel());
    c.add(this.text(GAME_WIDTH / 2, 58, '記憶が少し戻った', 23, '#f3ead2', 0.5, true));
    c.add(this.text(GAME_WIDTH / 2, 82, 'ひとつ選んで、夜を進む', 11, '#d8cfe8'));

    c.add(this.inventoryChip(70, 113, 106, '武器', `${state.inventory.weapons.length}/${state.inventory.weaponSlots}`, 0x7ea5c2));
    c.add(this.inventoryChip(195, 113, 112, '忘れ物', `${state.inventory.passives.length}/${state.inventory.passiveSlots}`, 0xa98bc2));
    c.add(this.inventoryChip(320, 113, 106, 'レア', `${state.inventory.rareItems.length}/${state.inventory.rareItemSlots}`, 0xd2ae62));

    const centers = levelUpCardCenters(choices.length);
    choices.forEach((choice, index) => {
      c.add(this.levelUpCard(
        GAME_WIDTH / 2,
        centers[index],
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
    c.add(this.text(
      GAME_WIDTH / 2,
      LEVEL_UP_FOOTER_HINT_Y,
      '枠が満杯の道具は、選んだあと入れ替えできます',
      11,
      '#d9cfbd',
    ));
    const reroll = this.button(
      GAME_WIDTH / 2,
      LEVEL_UP_REROLL_Y,
      206,
      42,
      remaining > 0 ? `候補を入れ替える  ${remaining}/3` : '候補入れ替え  0/3',
      () => {
        if (state.levelUpRerollsRemaining <= 0) return;
        this.clear();
        onReroll();
      },
    );
    reroll.setAlpha(remaining > 0 ? 1 : 0.45);
    c.add(reroll);
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
    const title = isWeapon
      ? '外す武器を選ぶ'
      : isRare
        ? '外すレアアイテムを選ぶ'
        : '外す忘れ物を選ぶ';

    const c = this.dim(0.88);
    c.add(this.screenPanel());
    c.add(this.text(GAME_WIDTH / 2, 54, title, 23, '#f3ead2', 0.5, true));
    c.add(this.text(GAME_WIDTH / 2, 78, '新しい道具と交換します', 11, '#d8cfe8'));

    const incoming = this.scene.add.container(GAME_WIDTH / 2, 124);
    incoming.add(this.panel(0, 0, REPLACE_ROW_WIDTH, 68, 0x2b243d, 0xd2ae62, 0xffd45e, 6, 2));
    const incomingRef = iconRefForChoice(choice);
    if (incomingRef) {
      this.addInventoryIcon(
        incoming,
        incomingRef,
        -REPLACE_ROW_WIDTH / 2 + 42,
        0,
        DETAIL_ICON_SIZE,
        64,
        60,
        0xd2ae62,
      );
    }
    incoming.add(this.scene.add.text(-REPLACE_ROW_WIDTH / 2 + 82, -13, '入れる', {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: '#d8cfe8',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0, 0.5));
    incoming.add(this.scene.add.text(
      -REPLACE_ROW_WIDTH / 2 + 82,
      11,
      wrapUiText(choice.title.replace(/^入替: /, '').replace(/^✦ /, ''), 18, 1),
      {
        fontFamily: UI_FONT,
        fontSize: '14px',
        color: '#ffe9a8',
        fontStyle: 'bold',
        resolution: 1,
      },
    ).setOrigin(0, 0.5));
    c.add(incoming);

    const centers = replaceRowCenters(items.length);
    items.forEach((item, index) => {
      const label = isWeapon
        ? weaponById.get(item.id)?.name ?? item.id
        : isRare
          ? rareItemById.get(item.id)?.name ?? item.id
          : passiveById.get(item.id)?.name ?? item.id;
      const suffix = isRare ? '' : ` Lv.${'level' in item ? item.level : ''}`;
      c.add(this.replaceRow(
        GAME_WIDTH / 2,
        centers[index],
        REPLACE_ROW_WIDTH,
        REPLACE_ROW_HEIGHT,
        { category: category ?? 'passive', itemId: item.id },
        `${label}${suffix}`,
        () => {
          this.clear();
          onReplace(item.id);
        },
      ));
    });

    c.add(this.text(GAME_WIDTH / 2, 720, '外した道具は、この夜では戻りません', 11, '#d9cfbd'));
    c.add(this.button(GAME_WIDTH / 2 - 82, REPLACE_ACTION_Y, 144, 40, '戻る', () => {
      this.clear();
      onCancel();
    }));
    c.add(this.button(GAME_WIDTH / 2 + 82, REPLACE_ACTION_Y, 144, 40, '受け取らない', () => {
      this.clear();
      onDecline();
    }));
  }

  private replaceRow(
    cx: number,
    cy: number,
    width: number,
    height: number,
    iconRef: IconRef,
    label: string,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const row = this.scene.add.container(cx, cy);
    row.add(this.panel(0, 0, width, height, 0xe8dcc0, 0x7a6a50, 0xb8a06a, 5, 2));
    const hit = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.001)
      .setInteractive({ useHandCursor: true });
    hit.on('pointerdown', onClick);
    row.add(hit);
    this.addInventoryIcon(row, iconRef, -width / 2 + 32, 0, LIST_ICON_SIZE, 50, 50, 0x7a6a50);
    row.add(this.scene.add.text(-width / 2 + 66, 0, wrapUiText(label, 19, 1), {
      fontFamily: UI_FONT,
      fontSize: '15px',
      color: '#2b2531',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0, 0.5));
    row.add(this.scene.add.text(width / 2 - 18, 0, '交換', {
      fontFamily: UI_FONT,
      fontSize: '10px',
      color: '#765d30',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(1, 0.5));
    return row;
  }

  /** VisualGallery 用: 実物のレベルアップカードを1枚だけ生成する（操作なし）。 */
  previewCard(
    cx: number,
    cy: number,
    width: number,
    height: number,
    choice: LevelUpChoice,
  ): Phaser.GameObjects.Container {
    return this.levelUpCard(cx, cy, width, height, choice, () => {});
  }

  private levelUpCard(
    cx: number,
    cy: number,
    width: number,
    height: number,
    choice: LevelUpChoice,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const card = this.scene.add.container(cx, cy);
    const rarity = choice.rarity ?? 'normal';
    const edge = rarityColor(rarity);
    card.add(this.panel(
      0,
      0,
      width,
      height,
      cardFillFor(rarity),
      edge,
      edge,
      rarity === 'rare' ? 10 : 8,
      rarity === 'rare' ? 3 : 2,
    ));
    const hit = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.001)
      .setInteractive({ useHandCursor: true });
    hit.on('pointerdown', onClick);
    card.add(hit);

    const iconRef = iconRefForChoice(choice);
    const iconX = -width / 2 + 46;
    if (iconRef) {
      this.addInventoryIcon(card, iconRef, iconX, 0, DETAIL_ICON_SIZE, 76, 108, edge);
    } else {
      this.addFallbackIcon(card, iconX, 0, '＋', 76, 108, edge);
    }

    // アイコン領域と本文を分ける縦線。本文の背後には線・点を置かない。
    card.add(this.scene.add.rectangle(-width / 2 + 88, 0, 2, height - 24, edge, 0.28));

    const textX = -width / 2 + 100;
    const lore = 'lore' in choice && choice.lore ? choice.lore : '';
    card.add(this.scene.add.text(textX, -54, wrapUiText(choice.title.replace(/^✦ /, ''), 18, 1), {
      fontFamily: UI_FONT,
      fontSize: '15px',
      color: '#2b2531',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0, 0));
    card.add(this.scene.add.text(textX, -31, `${rankFor(rarity)} / ${tagFor(choice)}`, {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: rarity === 'normal' ? '#715f46' : '#855920',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0, 0));
    card.add(this.scene.add.text(textX, -5, wrapUiText(choice.description, 19, 2), {
      fontFamily: UI_FONT,
      fontSize: '12px',
      color: '#332d35',
      align: 'left',
      lineSpacing: 3,
      resolution: 1,
    }).setOrigin(0, 0));
    if (lore) {
      card.add(this.scene.add.text(textX, 42, wrapUiText(lore, 24, 1), {
        fontFamily: UI_FONT,
        fontSize: '9px',
        color: '#715f46',
        fontStyle: 'italic',
        resolution: 1,
      }).setOrigin(0, 0));
    }
    card.add(this.scene.add.text(width / 2 - 16, height / 2 - 13, '選ぶ', {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: '#765d30',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(1, 0.5));
    return card;
  }

  showCapsule(_state: RuntimeState, reward: CapsuleReward, onClose: () => void): void {
    const isEvolution = reward.type === 'evolution';
    const accent = isEvolution ? EVOLUTION_ACCENT[reward.evolutionKind].main : 0x7ea5c2;
    const panelHeight = isEvolution ? 330 : 260;
    const c = this.dim(isEvolution ? 0.86 : 0.76);
    c.add(this.panel(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      330,
      panelHeight,
      0x171328,
      accent,
      isEvolution ? 0xffd45e : 0xb9d3e6,
      12,
      3,
    ));

    const title = isEvolution
      ? evolutionKindLabel(reward.evolutionKind)
      : reward.type === 'currency'
        ? '名前が戻った'
        : '道具が少し戻った';
    const subtitle = isEvolution ? evolutionKindSubtitle(reward.evolutionKind) : '記憶カプセル';
    const rewardRef = iconRefForReward(reward);

    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - panelHeight / 2 + 34, title, 23, '#fff0b0', 0.5, true));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - panelHeight / 2 + 66, subtitle, 12, '#d8cfe8'));

    if (rewardRef) {
      this.addInventoryIcon(
        c,
        rewardRef,
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 - 24,
        DETAIL_ICON_SIZE,
        92,
        92,
        accent,
      );
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 48, reward.title, isEvolution ? 21 : 18, '#ffe9a8', 0.5, true));
    } else {
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 2, reward.title, 18, '#ffe9a8', 0.5, true));
    }

    const lore = isEvolution ? reward.lore : '';
    if (lore) {
      c.add(this.text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 92,
        wrapUiText(lore, 34, 2),
        11,
        '#d9cfbd',
      ));
    }

    const close = () => {
      this.clear();
      onClose();
    };
    const bg = c.list[0] as Phaser.GameObjects.Rectangle;
    bg.on('pointerdown', close);
    this.scene.time.delayedCall(isEvolution ? 1900 : 1100, () => {
      if (this.current === c) close();
    });
  }

  showResult(state: RuntimeState, cleared: boolean, log: PlayLog, onRestart: () => void): void {
    const c = this.dim(0.82);
    c.add(this.panel(GAME_WIDTH / 2, 410, 350, 690, 0x171328, 0x665d80, cleared ? 0xffce7a : 0xaa6f8b, 10, 3));
    const stats = state.stats;
    const survived = Math.floor(stats.survivedSec);
    const mm = Math.floor(survived / 60).toString().padStart(2, '0');
    const ss = (survived % 60).toString().padStart(2, '0');
    c.add(this.text(GAME_WIDTH / 2, 110, cleared ? '朝まで残った' : '夜に飲まれた', 28, '#f3ead2', 0.5, true));
    const lines = [
      `生存時間   ${mm}:${ss}`,
      `倒した影   ${stats.kills}`,
      `集めた欠片 ${stats.memoryFragmentsCollected}`,
      `到達Lv     ${state.player.level}`,
      `カプセル   ${stats.capsulesOpened}`,
      `必殺技     ${stats.ultimateUses}回`,
    ];
    c.add(this.scene.add.text(GAME_WIDTH / 2, 240, lines.join('\n'), {
      fontFamily: UI_FONT,
      fontSize: '16px',
      color: '#f3ead2',
      align: 'center',
      lineSpacing: 8,
      resolution: 1,
    }).setOrigin(0.5));
    const evolutionNames = stats.evolutions.map((id) => evolutionResultLabel(id)).join(' / ');
    if (evolutionNames) c.add(this.text(GAME_WIDTH / 2, 360, `変化: ${evolutionNames}`, 14, '#ffe9a8'));
    c.add(this.text(
      GAME_WIDTH / 2,
      404,
      cleared ? '黒いインクの下に、まだ道が残っている。' : 'まだ、戻せていない名前がある。',
      12,
      '#d9cfbd',
    ));
    const formatSeconds = (value: number | null) => (value === null ? '--' : `${value.toFixed(1)}s`);
    const eliteMark = (value: boolean) => (value ? '○' : '×');
    const logLines = [
      `初撃破 ${formatSeconds(log.firstKillSec)}   Lv2 ${formatSeconds(log.level2Sec)}`,
      `初被弾 ${formatSeconds(log.firstDamageSec)}   初カプセル ${formatSeconds(log.firstCapsuleSec)}`,
      `エリート撃破 3分${eliteMark(log.elite3mKilled)} 5分${eliteMark(log.elite5mKilled)} 7分${eliteMark(log.elite7mKilled)}`,
    ];
    c.add(this.scene.add.text(GAME_WIDTH / 2, 470, logLines.join('\n'), {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#9fe0a0',
      align: 'center',
      lineSpacing: 6,
      resolution: 1,
    }).setOrigin(0.5));
    c.add(this.text(GAME_WIDTH / 2, 524, '詳細ログはブラウザのコンソールに出力', 10, '#8fa08f'));
    c.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT - 90, 200, 52, 'もう一度', () => {
      this.clear();
      onRestart();
    }));
  }

  showPause(onResume: () => void): void {
    const c = this.dim(0.68);
    c.add(this.panel(GAME_WIDTH / 2, GAME_HEIGHT / 2, 280, 190, 0x171328, 0x665d80, 0xffce7a, 8, 3));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 42, 'やすみ中', 24, '#f3ead2', 0.5, true));
    c.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 32, 200, 52, 'つづける', () => {
      this.clear();
      onResume();
    }));
  }

  private addInventoryIcon(
    container: Phaser.GameObjects.Container,
    ref: IconRef,
    x: number,
    y: number,
    imageSize: number,
    panelWidth: number,
    panelHeight: number,
    edge: number,
  ): void {
    container.add(this.panel(
      x,
      y,
      panelWidth,
      panelHeight,
      iconPanelColor(ref.category),
      edge,
      iconAccentColor(ref.category),
      6,
      2,
    ));

    const texture = resolveInventoryIconTexture(this.scene.textures, ref.category, ref.itemId);
    if (texture) {
      container.add(this.scene.add.image(x, y, texture).setDisplaySize(imageSize, imageSize));
      return;
    }

    const fallback = getInventoryIconRequirement(ref.category, ref.itemId)?.fallbackGlyph ?? '?';
    container.add(this.scene.add.text(x, y, fallback, {
      fontFamily: UI_FONT,
      fontSize: `${Math.max(18, imageSize * 0.42)}px`,
      color: '#f3ead2',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0.5));
  }

  private addFallbackIcon(
    container: Phaser.GameObjects.Container,
    x: number,
    y: number,
    glyph: string,
    panelWidth: number,
    panelHeight: number,
    edge: number,
  ): void {
    container.add(this.panel(x, y, panelWidth, panelHeight, 0x24352d, edge, 0xffce7a, 6, 2));
    container.add(this.scene.add.text(x, y, glyph, {
      fontFamily: UI_FONT,
      fontSize: '30px',
      color: '#f3ead2',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0.5));
  }

  private button(
    cx: number,
    cy: number,
    width: number,
    height: number,
    label: string,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const button = this.scene.add.container(cx, cy);
    button.add(this.panel(0, 0, width, height, 0xe8dcc0, 0x7a6a50, 0xffce7a, 6, 2));
    const hit = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.001)
      .setInteractive({ useHandCursor: true });
    hit.on('pointerdown', onClick);
    button.add(hit);
    button.add(this.scene.add.text(0, 0, label, {
      fontFamily: UI_FONT,
      fontSize: label.length > 5 ? '15px' : '18px',
      color: '#2b2531',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0.5));
    return button;
  }
}

function categoryForChoice(choice: LevelUpChoice): InventoryIconCategory | null {
  if (choice.type === 'weapon_new' || choice.type === 'weapon_upgrade') return 'weapon';
  if (choice.type === 'passive_new' || choice.type === 'passive_upgrade') return 'passive';
  if (choice.type === 'rare_new') return 'rare';
  return null;
}

function iconRefForChoice(choice: LevelUpChoice): IconRef | null {
  const category = categoryForChoice(choice);
  return category && 'itemId' in choice ? { category, itemId: choice.itemId } : null;
}

function iconRefForReward(reward: CapsuleReward): IconRef | null {
  if (reward.type === 'evolution') return { category: 'weapon', itemId: reward.evolvedWeaponId };
  if (reward.type === 'weapon_upgrade') return { category: 'weapon', itemId: reward.itemId };
  if (reward.type === 'passive_upgrade') return { category: 'passive', itemId: reward.itemId };
  return null;
}

function iconPanelColor(category: InventoryIconCategory): number {
  switch (category) {
    case 'weapon': return 0x18263f;
    case 'passive': return 0x2b203d;
    case 'rare': return 0x3a2f20;
  }
}

function iconAccentColor(category: InventoryIconCategory): number {
  switch (category) {
    case 'weapon': return 0x7ea5c2;
    case 'passive': return 0xa98bc2;
    case 'rare': return 0xd2ae62;
  }
}

function cardFillFor(rarity: RewardRarity): number {
  switch (rarity) {
    case 'rare': return 0xf0dfad;
    case 'good': return 0xe8dfc9;
    case 'normal': return 0xe8dcc0;
  }
}

function evolutionKindLabel(kind: EvolutionKind): string {
  switch (kind) {
    case 'upgrade': return '強化進化';
    case 'fusion': return '合体';
    case 'awakening': return '覚醒';
  }
}

function evolutionKindSubtitle(kind: EvolutionKind): string {
  switch (kind) {
    case 'upgrade': return '武器と忘れ物がつながった';
    case 'fusion': return 'ふたつの武器がひとつになった';
    case 'awakening': return 'レアな忘れ物で目覚めた';
  }
}

function evolutionResultLabel(evolvedWeaponId: string): string {
  const evolution = evolutions.find((item) => item.evolvedWeaponId === evolvedWeaponId);
  const name = weaponById.get(evolvedWeaponId)?.name ?? evolvedWeaponId;
  return evolution ? `${evolutionKindLabel(evolution.kind)}:${name}` : name;
}

function tagFor(choice: LevelUpChoice): string {
  switch (choice.type) {
    case 'weapon_new': return '新しい道具';
    case 'passive_new': return '忘れ物';
    case 'rare_new': return 'レアアイテム';
    case 'weapon_upgrade':
    case 'passive_upgrade': return '強化';
    case 'heal': return 'ひとやすみ';
  }
}

function rankFor(rarity: RewardRarity): string {
  switch (rarity) {
    case 'rare': return '大当たり';
    case 'good': return '良い';
    case 'normal': return 'ふつう';
  }
}

function rarityColor(rarity: RewardRarity): number {
  switch (rarity) {
    case 'rare': return 0xc69734;
    case 'good': return 0x718d9e;
    case 'normal': return 0x7a6a50;
  }
}
