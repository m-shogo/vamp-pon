import Phaser from 'phaser';
import type { EvolutionKind, LevelUpChoice, CapsuleReward } from '../domain/types';
import type { RuntimeState } from '../runtime';
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
import { createStorybookChoiceCard, categoryForChoice as storybookCategoryForChoice } from './storybookChoiceCard';
import {
  STORYBOOK_FONT,
  STORYBOOK_UI,
  drawPaperCard,
  drawStorybookPanel,
  storybookCategoryPalette,
} from './storybookUi';
import {
  EXPLORATION_DEPTHS,
  EXPLORATION_DEPTH_ORDER,
  UPGRADE_DEFS,
  UPGRADE_ORDER,
  getUpgradeLevel,
  upgradeCost,
  getUpgradeRefundAmount,
  spendUpgrade,
  resetUpgrades,
  loadProfile,
  depthClearKey,
  type ExplorationDepthId,
  type RunSettlement,
} from '../persistence/profile';

const D = VIEW_DEPTH.overlay;
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
      resolution: 2,
      lineSpacing: 3,
      padding: { left: 2, right: 2, top: 2, bottom: 2 },
      stroke: color === STORYBOOK_UI.textDark ? '#f4ead4' : '#080b18',
      strokeThickness: bold ? 1 : 0,
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

  /** ステージと探索深度を選ぶ画面。スマホ縦 390x844 前提。 */
  showStageSelect(opts: {
    maxStages: number;
    onStart: (stage: number, depth: ExplorationDepthId) => void;
    onOpenLab: () => void;
  }): void {
    const maxStages = Math.max(1, opts.maxStages);
    const initial = loadProfile();
    let stage = Math.min(maxStages, Math.max(1, initial.selectedStage));
    let depth: ExplorationDepthId = initial.selectedDepth;

    const render = (): void => {
      const profile = loadProfile();
      const unlocked = new Set(profile.unlockedStages);
      if (!unlocked.has(stage)) stage = 1;
      const root = this.dim(0.74);
      const panel = this.scene.add.graphics();
      drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 16, GAME_HEIGHT - 36, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.97);
      root.add(panel);

      root.add(this.text(GAME_WIDTH / 2, 60, '夜の探索', 26, STORYBOOK_UI.textLight, true));
      root.add(this.text(GAME_WIDTH / 2, 94, `黒曜片  ◆ ${profile.currency}`, 14, STORYBOOK_UI.goldLight, true));

      // ステージ一覧
      root.add(this.text(GAME_WIDTH / 2, 132, 'ステージ', 12, STORYBOOK_UI.textMuted, true));
      const listTop = 162;
      for (let i = 0; i < maxStages; i += 1) {
        const s = i + 1;
        const y = listTop + i * 58;
        const isUnlocked = unlocked.has(s);
        const selected = s === stage && isUnlocked;
        const clears = EXPLORATION_DEPTH_ORDER
          .map((d) => (profile.clears[depthClearKey(s, d)] ? EXPLORATION_DEPTHS[d].shortLabel : '・'))
          .join('');
        const sub = isUnlocked ? `踏破 ${clears}` : '未解放';
        root.add(this.optionCard(
          GAME_WIDTH / 2, y, GAME_WIDTH - 56, 50,
          `Stage ${s}`, sub, selected, isUnlocked,
          () => { if (isUnlocked) { stage = s; render(); } },
        ));
      }

      // 探索深度
      const depthY = listTop + maxStages * 58 + 26;
      root.add(this.text(GAME_WIDTH / 2, depthY - 26, '探索深度', 12, STORYBOOK_UI.textMuted, true));
      const cellW = (GAME_WIDTH - 56) / 3;
      EXPLORATION_DEPTH_ORDER.forEach((d, idx) => {
        const cfg = EXPLORATION_DEPTHS[d];
        const x = 28 + cellW * idx + cellW / 2;
        root.add(this.optionCard(
          x, depthY + 16, cellW - 8, 56,
          cfg.label, `報酬 ×${cfg.reward}`, d === depth, true,
          () => { depth = d; render(); },
        ));
      });

      const cur = EXPLORATION_DEPTHS[depth];
      root.add(this.text(GAME_WIDTH / 2, depthY + 64, `報酬 ×${cur.reward}　経験値 ×${cur.xp}　敵HP ×${cur.enemyHp}`, 11, STORYBOOK_UI.textMuted));

      root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT - 150, 200, 50, '夜へ進む', () => {
        this.clear();
        opts.onStart(stage, depth);
      }));
      root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT - 90, 184, 42, '黒曜研究所へ', () => {
        this.clear();
        opts.onOpenLab();
      }, true));
    };

    render();
  }

  /** 黒曜研究所：黒曜片で永続強化を買う／リセットする。 */
  showLab(onBack: () => void): void {
    let confirmingReset = false;

    const render = (): void => {
      const profile = loadProfile();
      const root = this.dim(0.78);
      const panel = this.scene.add.graphics();
      drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 16, GAME_HEIGHT - 36, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.97);
      root.add(panel);

      root.add(this.text(GAME_WIDTH / 2, 52, '黒曜研究所', 24, STORYBOOK_UI.textLight, true));
      root.add(this.text(GAME_WIDTH / 2, 82, `黒曜片  ◆ ${profile.currency}`, 14, STORYBOOK_UI.goldLight, true));

      const listTop = 116;
      const rowH = 60;
      UPGRADE_ORDER.forEach((id, idx) => {
        const def = UPGRADE_DEFS[id];
        const level = getUpgradeLevel(id, profile);
        const maxed = level >= def.maxLevel;
        const cost = maxed ? Infinity : upgradeCost(id, level);
        const pct = Math.round(def.valuePerLevel * 1000) / 10;
        const sign = def.negative ? '-' : '+';
        const effect = `Lvごと ${sign}${pct}%`;
        const y = listTop + idx * rowH;
        root.add(this.upgradeRow({
          y, name: def.name, level, maxLevel: def.maxLevel, effect,
          cost, maxed, affordable: Number.isFinite(cost) && profile.currency >= cost,
          onBuy: () => {
            if (maxed) return;
            spendUpgrade(id);
            render();
          },
        }));
      });

      root.add(this.button(GAME_WIDTH / 2 - 92, GAME_HEIGHT - 70, 168, 44, '戻る', () => {
        this.clear();
        onBack();
      }));
      root.add(this.button(GAME_WIDTH / 2 + 92, GAME_HEIGHT - 70, 168, 44, 'リセット', () => {
        confirmingReset = true;
        renderResetConfirm();
      }, true));
    };

    const renderResetConfirm = (): void => {
      if (!confirmingReset) return;
      const profile = loadProfile();
      const refund = getUpgradeRefundAmount(profile);
      const root = this.dim(0.82);
      const panel = this.scene.add.graphics();
      drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 300, 240, STORYBOOK_UI.nightPanel, STORYBOOK_UI.special, 0.98);
      root.add(panel);
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 78, '強化をリセット', 20, STORYBOOK_UI.textLight, true));
      root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, `黒曜片を全額 (◆ ${refund}) 返還します。\nいつでも振り直せます。`, 12, STORYBOOK_UI.textMuted));
      root.add(this.button(GAME_WIDTH / 2 - 78, GAME_HEIGHT / 2 + 56, 140, 44, 'やめる', () => {
        confirmingReset = false;
        render();
      }));
      root.add(this.button(GAME_WIDTH / 2 + 78, GAME_HEIGHT / 2 + 56, 140, 44, '返還する', () => {
        resetUpgrades();
        confirmingReset = false;
        render();
      }, true));
    };

    render();
  }

  private optionCard(
    x: number, y: number, width: number, height: number,
    label: string, sub: string, selected: boolean, enabled: boolean,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const card = this.scene.add.container(x, y);
    const accent = selected ? STORYBOOK_UI.gold : enabled ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperShadow;
    const graphics = this.scene.add.graphics();
    drawPaperCard(graphics, 0, 0, width, height, accent, STORYBOOK_UI.paper);
    card.add(graphics);
    if (selected) {
      const ring = this.scene.add.graphics();
      ring.lineStyle(3, STORYBOOK_UI.gold, 1).strokeRoundedRect(-width / 2 - 2, -height / 2 - 2, width + 4, height + 4, 10);
      card.add(ring);
    }
    card.setAlpha(enabled ? 1 : 0.55);
    const hit = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: enabled });
    if (enabled) {
      attachPressFeedback(this.scene, hit, card, { x, y, width, height, accent, depth: D + 8 });
      hit.on('pointerdown', onClick);
    }
    card.add(hit);
    card.add(this.scene.add.text(0, sub ? -9 : 0, label, {
      fontFamily: STORYBOOK_FONT, fontSize: '15px', color: STORYBOOK_UI.textDark, fontStyle: 'bold', resolution: 2,
    }).setOrigin(0.5));
    if (sub) {
      card.add(this.scene.add.text(0, 13, sub, {
        fontFamily: STORYBOOK_FONT, fontSize: '10px', color: STORYBOOK_UI.textSoft, fontStyle: 'bold', resolution: 2,
      }).setOrigin(0.5));
    }
    return card;
  }

  private upgradeRow(opts: {
    y: number; name: string; level: number; maxLevel: number; effect: string;
    cost: number; maxed: boolean; affordable: boolean; onBuy: () => void;
  }): Phaser.GameObjects.Container {
    const { y } = opts;
    const width = GAME_WIDTH - 40;
    const row = this.scene.add.container(GAME_WIDTH / 2, y);
    const graphics = this.scene.add.graphics();
    drawPaperCard(graphics, 0, 0, width, 52, opts.maxed ? STORYBOOK_UI.goldLight : STORYBOOK_UI.gold, STORYBOOK_UI.paper);
    row.add(graphics);
    const leftX = -width / 2 + 14;
    row.add(this.scene.add.text(leftX, -12, opts.name, {
      fontFamily: STORYBOOK_FONT, fontSize: '14px', color: STORYBOOK_UI.textDark, fontStyle: 'bold', resolution: 2,
    }).setOrigin(0, 0.5));
    row.add(this.scene.add.text(leftX, 11, `${opts.effect}　Lv ${opts.level}/${opts.maxLevel}`, {
      fontFamily: STORYBOOK_FONT, fontSize: '10px', color: STORYBOOK_UI.textSoft, fontStyle: 'bold', resolution: 2,
    }).setOrigin(0, 0.5));

    if (opts.maxed) {
      row.add(this.scene.add.text(width / 2 - 16, 0, 'MAX', {
        fontFamily: STORYBOOK_FONT, fontSize: '13px', color: colorString(STORYBOOK_UI.gold), fontStyle: 'bold', resolution: 2,
        stroke: '#080b18', strokeThickness: 2,
      }).setOrigin(1, 0.5));
      return row;
    }

    const buy = this.scene.add.container(width / 2 - 44, 0);
    const buyG = this.scene.add.graphics();
    drawPaperCard(buyG, 0, 0, 72, 40, opts.affordable ? STORYBOOK_UI.gold : STORYBOOK_UI.paperShadow, STORYBOOK_UI.paper);
    buy.add(buyG);
    buy.add(this.scene.add.text(0, -7, '強化', {
      fontFamily: STORYBOOK_FONT, fontSize: '11px', color: STORYBOOK_UI.textDark, fontStyle: 'bold', resolution: 2,
    }).setOrigin(0.5));
    buy.add(this.scene.add.text(0, 9, `◆ ${opts.cost}`, {
      fontFamily: STORYBOOK_FONT, fontSize: '10px', color: STORYBOOK_UI.textSoft, fontStyle: 'bold', resolution: 2,
    }).setOrigin(0.5));
    buy.setAlpha(opts.affordable ? 1 : 0.5);
    const hit = this.scene.add.rectangle(0, 0, 72, 40, 0x000000, 0.001).setInteractive({ useHandCursor: opts.affordable });
    if (opts.affordable) {
      attachPressFeedback(this.scene, hit, buy, { x: GAME_WIDTH / 2 + width / 2 - 44, y, width: 72, height: 40, accent: STORYBOOK_UI.gold, depth: D + 10 });
      hit.on('pointerdown', opts.onBuy);
    }
    buy.add(hit);
    row.add(buy);
    return row;
  }

  showLevelUp(
    state: RuntimeState,
    choices: LevelUpChoice[],
    onPick: (choice: LevelUpChoice) => void,
    onReroll: () => void,
  ): void {
    const root = this.dim(0.3);
    const dock = this.scene.add.graphics();
    drawStorybookPanel(
      dock,
      GAME_WIDTH / 2,
      (LEVEL_UP_PANEL_TOP + GAME_HEIGHT) / 2,
      GAME_WIDTH - 8,
      GAME_HEIGHT - LEVEL_UP_PANEL_TOP - 4,
      STORYBOOK_UI.nightPanel,
      STORYBOOK_UI.gold,
      0.97,
    );
    root.add(dock);

    root.add(this.text(GAME_WIDTH / 2, LEVEL_UP_HEADER_Y, 'ひとつ選ぶ', 20, STORYBOOK_UI.textLight, true));
    root.add(this.text(
      GAME_WIDTH / 2,
      LEVEL_UP_HEADER_Y + 25,
      `武器 ${state.inventory.weapons.length}/${state.inventory.weaponSlots}　忘れ物 ${state.inventory.passives.length}/${state.inventory.passiveSlots}　レア ${state.inventory.rareItems.length}/${state.inventory.rareItemSlots}`,
      10,
      STORYBOOK_UI.textMuted,
      true,
    ));

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
      ));
    });

    const remaining = state.levelUpRerollsRemaining;
    const reroll = this.button(
      GAME_WIDTH - 57,
      LEVEL_UP_REROLL_Y,
      100,
      30,
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
      fontFamily: STORYBOOK_FONT,
      fontSize: '13px',
      color: STORYBOOK_UI.textSoft,
      fontStyle: 'bold',
      resolution: 2,
      backgroundColor: '#f4ead4',
      padding: { left: 6, right: 6, top: 2, bottom: 2 },
    }).setOrigin(0.5));
    card.add(this.scene.add.text(0, 46, wrapUiText(reward.title, 16, 2), {
      fontFamily: STORYBOOK_FONT,
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
      fontFamily: STORYBOOK_FONT,
      fontSize: '18px',
      color: colorString(accent.main),
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      stroke: '#080b18',
      strokeThickness: 4,
    }).setOrigin(0.5));
    root.add(this.text(GAME_WIDTH / 2, 103, '武器が重なり、新しい形になった', 12, STORYBOOK_UI.textMuted, true));

    const resultCard = this.scene.add.container(GAME_WIDTH / 2, 400).setScale(0.86).setAlpha(0);
    const paper = this.scene.add.graphics();
    drawPaperCard(paper, 0, 0, 300, 430, accent.main, STORYBOOK_UI.paper);
    resultCard.add(paper);
    this.addInventoryIcon(resultCard, { category: 'weapon', itemId: reward.evolvedWeaponId }, 0, -128, 112, accent.main);

    resultCard.add(this.scene.add.text(0, -40, wrapUiText(weapon?.name ?? reward.title, 14, 2), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '24px',
      color: STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      lineSpacing: 3,
      backgroundColor: '#f4ead4',
      padding: { left: 8, right: 8, top: 4, bottom: 4 },
    }).setOrigin(0.5));

    resultCard.add(this.scene.add.text(0, 36, wrapUiText(weapon?.description ?? reward.title, 22, 4), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '13px',
      color: '#4a3b2a',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      lineSpacing: 4,
      padding: { left: 8, right: 8, top: 4, bottom: 4 },
    }).setOrigin(0.5, 0));

    resultCard.add(this.scene.add.text(0, 146, wrapUiText(reward.lore || weapon?.lore || '新しい記憶のかたち。', 24, 3), {
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

  showResult(opts: {
    state: RuntimeState;
    cleared: boolean;
    settlement: RunSettlement;
    onRetry: () => void;
    onStageSelect: () => void;
    onLab: () => void;
  }): void {
    const { state, cleared, settlement } = opts;
    const root = this.dim(0.82);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 16, GAME_HEIGHT - 36, STORYBOOK_UI.nightPanel, cleared ? STORYBOOK_UI.gold : STORYBOOK_UI.special, 0.98);
    root.add(panel);

    const stats = state.stats;
    const survived = Math.floor(stats.survivedSec);
    const mm = Math.floor(survived / 60).toString().padStart(2, '0');
    const ss = (survived % 60).toString().padStart(2, '0');
    const depthLabel = EXPLORATION_DEPTHS[state.explorationDepth].label;
    const cx = GAME_WIDTH / 2;

    root.add(this.text(cx, 50, cleared ? '朝まで残った' : '夜に飲まれた', 24, STORYBOOK_UI.textLight, true));
    root.add(this.text(cx, 80, `Stage ${state.stageNumber}・${depthLabel}　生存 ${mm}:${ss}　ランLv.${state.player.level}`, 12, STORYBOOK_UI.goldLight, true));

    // ラン実績
    root.add(this.text(cx, 132,
      `倒した影 ${stats.kills}　集めた欠片 ${stats.memoryFragmentsCollected}\nカプセル ${stats.capsulesOpened}　必殺 ${stats.ultimateUses}回　黒曜化 ${stats.berserkUses}回`,
      12, STORYBOOK_UI.textLight));

    // 黒曜片
    let y = 196;
    const shardPanel = this.scene.add.graphics();
    drawStorybookPanel(shardPanel, cx, y + 28, GAME_WIDTH - 56, 78, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.5);
    root.add(shardPanel);
    root.add(this.text(cx, y, `黒曜片  +${settlement.shardsEarned}`, 22, STORYBOOK_UI.goldLight, true));
    root.add(this.text(cx, y + 30, `所持 ◆ ${settlement.shardTotal}`, 13, STORYBOOK_UI.textMuted, true));
    root.add(this.text(cx, y + 50, this.bonusLine(state, settlement), 10, '#9fe0a0'));

    // キャラ成長
    y = 300;
    const levelUpText = settlement.characterLevelAfter > settlement.characterLevelBefore
      ? `キャラLv  Lv.${settlement.characterLevelBefore} → Lv.${settlement.characterLevelAfter}`
      : `キャラLv  Lv.${settlement.characterLevelAfter}`;
    root.add(this.text(cx, y, `キャラEXP  +${settlement.characterXpEarned}`, 15, STORYBOOK_UI.textLight, true));
    root.add(this.text(cx, y + 24, levelUpText, 14, settlement.characterLevelAfter > settlement.characterLevelBefore ? STORYBOOK_UI.goldLight : STORYBOOK_UI.textMuted, true));
    if (settlement.characterXpToNext > 0) {
      root.add(this.text(cx, y + 44, `次のLvまで ${settlement.characterXpInLevel}/${settlement.characterXpToNext}`, 10, STORYBOOK_UI.textMuted));
    }

    if (settlement.unlockedStage) {
      root.add(this.text(cx, 372, `Stage ${settlement.unlockedStage} を解放した`, 13, STORYBOOK_UI.goldLight, true));
    }

    const evolutionNames = stats.evolutions.map((id) => evolutionResultLabel(id)).join(' / ');
    if (evolutionNames) root.add(this.text(cx, 404, `変化  ${evolutionNames}`, 11, STORYBOOK_UI.goldLight));

    root.add(this.text(cx, 446, cleared ? '黒いインクの下に、まだ道が残っている。' : 'まだ、戻せていない名前がある。', 11, STORYBOOK_UI.textMuted));

    // 操作ボタン
    root.add(this.button(cx, GAME_HEIGHT - 188, 220, 50, 'もう一度', () => {
      this.clear();
      opts.onRetry();
    }));
    root.add(this.button(cx, GAME_HEIGHT - 128, 200, 44, 'ステージ選択へ', () => {
      this.clear();
      opts.onStageSelect();
    }, true));
    root.add(this.button(cx, GAME_HEIGHT - 76, 200, 44, '黒曜研究所へ', () => {
      this.clear();
      opts.onLab();
    }, true));
  }

  private bonusLine(state: RuntimeState, s: RunSettlement): string {
    const parts: string[] = [`探索×${round2(s.depthMultiplier)}`];
    if (s.shardGainMultiplier > 1.0001) parts.push(`黒曜片×${round2(s.shardGainMultiplier)}`);
    if (s.noBerserk) parts.push(`黒曜化未使用×${round2(s.noBerserkMultiplier)}`);
    if (s.firstClearBonus > 0) parts.push(`初クリア+${s.firstClearBonus}`);
    if (s.firstDepthClearBonus > 0) parts.push(`初${EXPLORATION_DEPTHS[state.explorationDepth].label}+${s.firstDepthClearBonus}`);
    return parts.join('  ');
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
    attachPressFeedback(this.scene, hit, row, { x, y, width, height, accent: palette.accent, depth: D + 8 });
    hit.on('pointerdown', onClick);
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
    hit.on('pointerdown', onClick);
    button.add(hit);
    button.add(this.scene.add.text(0, 0, label, {
      fontFamily: STORYBOOK_FONT,
      fontSize: `${height <= 30 ? 11 : 15}px`,
      color: dark ? STORYBOOK_UI.textLight : STORYBOOK_UI.textDark,
      fontStyle: 'bold',
      resolution: 2,
      stroke: dark ? '#080b18' : '#f4ead4',
      strokeThickness: 1,
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

function colorString(color: number): string {
  return '#' + color.toString(16).padStart(6, '0');
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
