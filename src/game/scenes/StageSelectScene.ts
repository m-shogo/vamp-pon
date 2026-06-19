import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import {
  buyUpgrade,
  characterXpToNext,
  EXPLORATION_DEPTHS,
  loadProfile,
  resetUpgrades,
  selectRun,
  UPGRADE_DEFS,
  upgradeCost,
  upgradeRefundValue,
  type ExplorationDepthId,
  type PlayerProfile,
  type UpgradeId,
} from '../persistence/profile';
import { characters } from '../data/characters';
import { STORYBOOK_FONT, STORYBOOK_UI, drawStorybookPanel } from '../ui/storybookUi';

type StageSelectMode = 'stage' | 'growth';

const DEPTH_ORDER: ExplorationDepthId[] = ['shallow', 'middle', 'deep'];
const UPGRADE_ORDER: UpgradeId[] = [
  'maxHp',
  'might',
  'moveSpeed',
  'xpGain',
  'magnet',
  'currencyGain',
  'damageReduction',
  'ultimateCharge',
  'noBerserkBonus',
];

export function isRunStartUrl(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  return new URLSearchParams(search).get('play') === '1';
}

export class StageSelectScene extends Phaser.Scene {
  private root: Phaser.GameObjects.Container | null = null;
  private confirmingReset = false;
  private mode: StageSelectMode = 'stage';

  constructor() {
    super('StageSelectScene');
  }

  init(data?: { mode?: StageSelectMode }): void {
    this.mode = data?.mode ?? 'stage';
    this.confirmingReset = false;
  }

  create(): void {
    this.render();
  }

  private render(): void {
    this.root?.destroy(true);
    const profile = loadProfile();
    const root = this.add.container(0, 0);
    this.root = root;

    root.add(this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1d1a34, 1));
    const panel = this.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 370, 810, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.98);
    root.add(panel);

    root.add(this.text(GAME_WIDTH / 2, 34, this.mode === 'growth' ? '黒曜研究所' : 'ステージ選択', 25, STORYBOOK_UI.textLight, true));
    root.add(this.text(GAME_WIDTH / 2, 64, `黒曜片 ${profile.currency}`, 16, STORYBOOK_UI.goldLight, true));

    if (this.mode === 'stage') {
      this.renderStageBlock(root, profile);
      this.renderDepthBlock(root, profile);
      this.renderCharacterBlock(root, profile);
      root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT - 98, 210, 42, '探索を始める', () => this.startRun(profile)));
      root.add(this.button(GAME_WIDTH / 2 - 82, GAME_HEIGHT - 38, 136, 38, 'TOPへ', () => this.scene.start('TopScene'), true));
      root.add(this.button(GAME_WIDTH / 2 + 82, GAME_HEIGHT - 38, 136, 38, '成長へ', () => {
        this.mode = 'growth';
        this.render();
      }, true));
    } else {
      this.renderCharacterBlock(root, profile);
      this.renderUpgradeBlock(root, profile);
      root.add(this.button(GAME_WIDTH / 2 - 82, GAME_HEIGHT - 38, 136, 38, 'TOPへ', () => this.scene.start('TopScene'), true));
      root.add(this.button(GAME_WIDTH / 2 + 82, GAME_HEIGHT - 38, 136, 38, '選択へ', () => {
        this.mode = 'stage';
        this.render();
      }, true));
    }

    if (this.confirmingReset) this.renderResetConfirm(root, profile);
  }

  private renderResetConfirm(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const refund = upgradeRefundValue(profile);
    // 背面クリックを塞ぐ全画面ディム。
    root.add(this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05060f, 0.72).setInteractive());
    const panel = this.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 300, 220, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.99);
    root.add(panel);
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 66, '強化をリセット', 20, STORYBOOK_UI.textLight, true));
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 22, `黒曜片 ${refund} を全額返還します。\nいつでも振り直せます。`, 12, STORYBOOK_UI.textMuted));
    root.add(this.button(GAME_WIDTH / 2 - 76, GAME_HEIGHT / 2 + 52, 136, 42, 'やめる', () => {
      this.confirmingReset = false;
      this.render();
    }, true));
    root.add(this.button(GAME_WIDTH / 2 + 76, GAME_HEIGHT / 2 + 52, 136, 42, '返還する', () => {
      resetUpgrades();
      this.confirmingReset = false;
      this.render();
    }));
  }

  private renderStageBlock(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    root.add(this.text(62, 102, 'ステージ', 15, STORYBOOK_UI.textLight, true).setOrigin(0, 0.5));
    const stages = profile.unlockedStages.slice(0, 5);
    stages.forEach((stage, index) => {
      const x = 62 + index * 54;
      const selected = stage === profile.selectedStage;
      root.add(this.button(x, 136, 44, 34, `${stage}`, () => {
        selectRun(stage, profile.selectedDepth);
        this.render();
      }, !selected));
    });
  }

  private renderDepthBlock(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    root.add(this.text(62, 184, '探索深度', 15, STORYBOOK_UI.textLight, true).setOrigin(0, 0.5));
    DEPTH_ORDER.forEach((depthId, index) => {
      const depth = EXPLORATION_DEPTHS[depthId];
      const selected = depthId === profile.selectedDepth;
      const x = 82 + index * 112;
      const btn = this.button(x, 222, 88, 40, depth.label, () => {
        selectRun(profile.selectedStage, depthId);
        this.render();
      }, !selected);
      btn.getByName('fill')?.setData('tint', depth.tint);
      root.add(btn);
      root.add(this.text(x, 254, `報酬×${depth.reward.toFixed(1)}`, 10, colorString(depth.tint), true));
    });
  }

  private renderCharacterBlock(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const char = characters[0];
    const progress = profile.characterProgress[char.id] ?? { level: 1, xp: 0, totalXp: 0 };
    const need = characterXpToNext(progress.level);
    root.add(this.text(62, 304, 'キャラ成長', 15, STORYBOOK_UI.textLight, true).setOrigin(0, 0.5));
    root.add(this.text(GAME_WIDTH / 2, 334, `${char.name} Lv.${progress.level}　${progress.xp}/${need}`, 14, STORYBOOK_UI.goldLight, true));
    root.add(this.text(GAME_WIDTH / 2, 360, '使うほど少しずつHPと攻撃が伸びる', 11, STORYBOOK_UI.textMuted));
  }

  private renderUpgradeBlock(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    root.add(this.text(62, 404, '黒曜研究所', 16, STORYBOOK_UI.textLight, true).setOrigin(0, 0.5));
    root.add(this.button(GAME_WIDTH - 90, 404, 106, 30, 'リセット', () => {
      this.confirmingReset = true;
      this.render();
    }, true));

    UPGRADE_ORDER.forEach((id, index) => {
      const def = UPGRADE_DEFS[id];
      const level = profile.upgrades[id] ?? 0;
      const maxed = level >= def.maxLevel;
      const cost = upgradeCost(id, level);
      const y = 446 + index * 39;
      root.add(this.text(58, y - 7, `${def.name} Lv.${level}/${def.maxLevel}`, 12, STORYBOOK_UI.textLight, true).setOrigin(0, 0.5));
      root.add(this.text(58, y + 10, def.description, 11, STORYBOOK_UI.textMuted).setOrigin(0, 0.5));
      const label = maxed ? '最大' : `${cost}`;
      const canBuy = !maxed && profile.currency >= cost;
      const b = this.button(GAME_WIDTH - 74, y, 74, 28, label, () => {
        buyUpgrade(id);
        this.render();
      }, !canBuy);
      b.setAlpha(canBuy || maxed ? 1 : 0.45);
      root.add(b);
    });
  }

  private startRun(profile: PlayerProfile): void {
    const saved = selectRun(profile.selectedStage, profile.selectedDepth);
    const params = new URLSearchParams(window.location.search);
    params.set('play', '1');
    params.set('stage', String(saved.selectedStage));
    params.delete('scene');
    window.location.search = params.toString();
  }

  private text(x: number, y: number, value: string, size: number, color: string | number, bold = false): Phaser.GameObjects.Text {
    return this.add.text(x, y, value, {
      fontFamily: STORYBOOK_FONT,
      fontSize: `${size}px`,
      color: colorString(color),
      fontStyle: bold ? 'bold' : 'normal',
      align: 'center',
      resolution: 2,
      lineSpacing: 3,
      stroke: '#080b18',
      strokeThickness: bold ? 1 : 0,
    }).setOrigin(0.5);
  }

  private button(x: number, y: number, width: number, height: number, label: string, onClick: () => void, muted = false): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.rectangle(0, 0, width, height, muted ? 0x3c355f : 0xb8954e, muted ? 0.82 : 0.95).setName('fill');
    fill.setStrokeStyle(1, muted ? 0x6f6590 : 0xf5d58a, 0.9);
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', onClick);
    c.add([fill, this.text(0, 0, label, 12, muted ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textDark, true), hit]);
    return c;
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
