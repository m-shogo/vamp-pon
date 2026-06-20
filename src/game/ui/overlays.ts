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
  STORYBOOK_TITLE_FONT,
  STORYBOOK_UI,
  drawPaperCard,
  drawStorybookPanel,
  storybookCategoryPalette,
} from './storybookUi';

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
    const root = this.dim(0.8);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 360, 760, STORYBOOK_UI.nightPanel, cleared ? STORYBOOK_UI.gold : STORYBOOK_UI.special, 0.98);
    root.add(panel);
    const stats = state.stats;
    const survived = Math.floor(stats.survivedSec);
    const mm = Math.floor(survived / 60).toString().padStart(2, '0');
    const ss = (survived % 60).toString().padStart(2, '0');

    // ヘッダー
    const titleText = cleared ? '夜明け' : '夜に飲まれた';
    const titlePrefix = cleared ? '◆' : '◇'; // 絵文字依存を避け、装飾は記号で
    root.add(this.text(GAME_WIDTH / 2, 86, `${titlePrefix} ${titleText}`, 26, STORYBOOK_UI.textLight, true));
    root.add(this.text(GAME_WIDTH / 2, 116, `生存 ${mm}:${ss}　Lv.${state.player.level}`, 13, STORYBOOK_UI.goldLight, true));

    // 「主要結果カード」: 紙パネル上に行ごとに アイコン色 + ラベル + 値
    const cardX = GAME_WIDTH / 2;
    const cardTopY = 144;
    const cardHeight = 232;
    const cardGraphics = this.scene.add.graphics();
    drawPaperCard(
      cardGraphics,
      cardX - 158,
      cardTopY,
      316,
      cardHeight,
      cleared ? STORYBOOK_UI.gold : STORYBOOK_UI.special,
      STORYBOOK_UI.paper,
    );
    root.add(cardGraphics);

    const levelUpText = settlement.characterLevelAfter > settlement.characterLevelBefore
      ? ` (Lv ${settlement.characterLevelBefore}→${settlement.characterLevelAfter})`
      : '';
    const rows: Array<{ icon: number; label: string; value: string }> = [
      { icon: 0xb8e0ff, label: '生存時間', value: `${mm}:${ss}` },
      { icon: 0xffd693, label: '灯度（Lv）', value: `Lv.${state.player.level}` },
      { icon: 0xc7b0ff, label: 'ほどいた影', value: `${stats.kills}` },
      { icon: 0xfff1c8, label: '記憶のかけら', value: `${stats.memoryFragmentsCollected}` },
      { icon: 0xffc1a8, label: 'カプセル', value: `${stats.capsulesOpened}` },
      { icon: 0xf5d58a, label: '黒曜片', value: `+${settlement.currencyEarned}　(所持 ${ownedCurrency})` },
      { icon: 0xa6e3a1, label: 'キャラEXP', value: `+${settlement.characterXpEarned}${levelUpText}` },
    ];

    rows.forEach((row, i) => {
      const y = cardTopY + 22 + i * 30;
      // 行頭の色丸（簡易アイコン代わり。絵文字依存を避ける）
      root.add(this.scene.add.circle(cardX - 142, y, 6, row.icon, 0.95));
      // 行頭の縦罫（読みやすさのための装飾）
      const labelText = this.scene.add.text(cardX - 128, y, row.label, {
        fontFamily: STORYBOOK_FONT,
        fontSize: '13px',
        color: STORYBOOK_UI.textDark,
        fontStyle: 'bold',
        resolution: 2,
      }).setOrigin(0, 0.5);
      root.add(labelText);
      const valueText = this.scene.add.text(cardX + 138, y, row.value, {
        fontFamily: STORYBOOK_FONT,
        fontSize: '15px',
        color: STORYBOOK_UI.textDark,
        fontStyle: 'bold',
        resolution: 2,
      }).setOrigin(1, 0.5);
      root.add(valueText);
    });

    // 進化/合体行（あれば）
    const evolutionLabels = stats.evolutions.map((id) => evolutionResultLabel(id));
    if (evolutionLabels.length > 0) {
      const visible = evolutionLabels.slice(0, 2).join(' / ');
      const more = evolutionLabels.length > 2 ? `　ほか ${evolutionLabels.length - 2}件` : '';
      root.add(this.text(GAME_WIDTH / 2, cardTopY + cardHeight + 18, `◇ 進化/合体　${visible}${more}`, 12, STORYBOOK_UI.goldLight, true));
    }

    // ひとこと
    const messageY = cardTopY + cardHeight + (evolutionLabels.length > 0 ? 44 : 22);
    root.add(this.text(GAME_WIDTH / 2, messageY, cleared ? '黒いインクの下に、まだ道が残っている。' : 'まだ、戻せていない名前がある。', 12, STORYBOOK_UI.textMuted));

    // 細かい時刻ログ（小さめ・緑）— 2行に分けて読みやすく
    const timeLineY = messageY + 28;
    root.add(this.text(GAME_WIDTH / 2, timeLineY, `初撃破 ${formatSeconds(log.firstKillSec)}　Lv2 ${formatSeconds(log.level2Sec)}`, 11, '#9fe0a0'));
    root.add(this.text(GAME_WIDTH / 2, timeLineY + 16, `初被弾 ${formatSeconds(log.firstDamageSec)}　初カプセル ${formatSeconds(log.firstCapsuleSec)}`, 11, '#9fe0a0'));

    // ボタン（2列×2段、押しやすいサイズ）
    const btnYTop = GAME_HEIGHT - 142;
    const btnYBot = GAME_HEIGHT - 84;
    root.add(this.button(GAME_WIDTH / 2 - 86, btnYTop, 156, 46, 'もう一度', () => {
      this.clear();
      onRestart();
    }));
    root.add(this.button(GAME_WIDTH / 2 + 86, btnYTop, 156, 46, 'ステージ選択', () => {
      this.clear();
      onStageSelect();
    }, true));
    root.add(this.button(GAME_WIDTH / 2 - 86, btnYBot, 156, 42, '成長へ', () => {
      this.clear();
      onGrowth();
    }, true));
    root.add(this.button(GAME_WIDTH / 2 + 86, btnYBot, 156, 42, 'TOPへ', () => {
      this.clear();
      onTop();
    }, true));
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

    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 138, 'やすみ中', 26, STORYBOOK_UI.textLight, true));
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 104, '夜路から、いったん戻れる', 12, STORYBOOK_UI.textMuted));

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

function colorString(color: string | number): string {
  return typeof color === 'number' ? '#' + color.toString(16).padStart(6, '0') : color;
}
