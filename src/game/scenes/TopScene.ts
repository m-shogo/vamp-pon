import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { forgottenStreetNightBoard } from '../data/collectionProgress';
import { loadCollectionProgress } from '../persistence/collection';
import { loadProfile } from '../persistence/profile';
import { attachPressFeedback } from '../ui/pressFeedback';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI, drawPaperCard, drawStorybookPanel } from '../ui/storybookUi';
import { getAudioManager } from '../audio/AudioManager';

const PARTICLE_DEPTH = 2;
const UI_DEPTH = 10;

export class TopScene extends Phaser.Scene {
  private notice: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('TopScene');
  }

  shutdown(): void {
    this.tweens.killAll();
  }

  create(): void {
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    const audio = getAudioManager(this);
    audio.unlockOnFirstInput();
    audio.playBgm('bgm_top', { volume: 0.32, fadeMs: 280 });
    const profile = loadProfile();
    const collection = loadCollectionProgress();
    const boardCount = collection.nightBoard.completedCellIds.length;
    const boardTotal = forgottenStreetNightBoard.cells.length;

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x12101e, 1);
    this.addBackgroundAtmosphere();

    const panel = this.add.graphics().setDepth(UI_DEPTH);
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 356, 720, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.96);

    this.addTitleDecoration();

    const titleText = this.text(GAME_WIDTH / 2, 108, 'VAMP PON', 44, STORYBOOK_UI.textLight, true, true).setDepth(UI_DEPTH + 2);
    this.tweens.add({ targets: titleText, y: titleText.y - 3, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const subtitleText = this.text(GAME_WIDTH / 2, 156, '忘れた名前を、夜から拾う', 14, STORYBOOK_UI.goldLight, true).setDepth(UI_DEPTH + 1);
    subtitleText.setAlpha(0);
    this.tweens.add({ targets: subtitleText, alpha: 1, duration: 800, delay: 300, ease: 'Quad.easeOut' });

    this.text(GAME_WIDTH / 2, 192, `黒曜片 ${profile.currency}`, 16, STORYBOOK_UI.goldLight, true).setDepth(UI_DEPTH + 1);

    const mainBtn = this.button(GAME_WIDTH / 2, 292, 260, 62, '夜へ出る', () => {
      this.scene.start('StageSelectScene', { mode: 'stage' });
    }, false, true);
    mainBtn.setDepth(UI_DEPTH + 3);

    const growthBtn = this.button(GAME_WIDTH / 2, 376, 220, 48, '成長', () => {
      this.scene.start('StageSelectScene', { mode: 'growth' });
    }, true);
    growthBtn.setDepth(UI_DEPTH + 2);

    const collBtn = this.button(GAME_WIDTH / 2, 440, 220, 48, `忘れ物帳 ${boardCount}/${boardTotal}`, () => {
      this.scene.start('CollectionScene');
    }, boardCount === 0);
    collBtn.setDepth(UI_DEPTH + 2);

    const settingsBtn = this.button(GAME_WIDTH / 2, 504, 180, 42, '設定', () => this.showNotice('設定は準備中です'), true);
    settingsBtn.setDepth(UI_DEPTH + 2);

    this.notice = this.text(GAME_WIDTH / 2, 580, '', 13, STORYBOOK_UI.textMuted).setDepth(UI_DEPTH + 1);

    this.addBottomDecoration();
  }

  private addBackgroundAtmosphere(): void {
    for (let i = 0; i < 18; i += 1) {
      const x = 20 + Math.random() * (GAME_WIDTH - 40);
      const y = 60 + Math.random() * (GAME_HEIGHT - 120);
      const size = 1.2 + Math.random() * 2.2;
      const dot = this.add.circle(x, y, size, COLORS.lantern, 0.06 + Math.random() * 0.1)
        .setDepth(PARTICLE_DEPTH);
      this.tweens.add({
        targets: dot,
        y: y - 30 - Math.random() * 60,
        alpha: 0,
        duration: 4000 + Math.random() * 3000,
        delay: Math.random() * 3000,
        repeat: -1,
        onRepeat: () => {
          dot.setPosition(20 + Math.random() * (GAME_WIDTH - 40), GAME_HEIGHT * 0.7 + Math.random() * (GAME_HEIGHT * 0.3));
          dot.setAlpha(0.06 + Math.random() * 0.1);
        },
      });
    }

    for (let i = 0; i < 6; i += 1) {
      const x = 30 + Math.random() * (GAME_WIDTH - 60);
      const y = 140 + Math.random() * 500;
      const size = 4 + Math.random() * 7;
      const scrap = this.add.rectangle(x, y, size, size * 0.7, COLORS.paperScrap, 0.04 + Math.random() * 0.04)
        .setAngle(Math.random() * 360)
        .setDepth(PARTICLE_DEPTH);
      this.tweens.add({
        targets: scrap,
        y: scrap.y - 20 - Math.random() * 30,
        angle: scrap.angle + (Math.random() < 0.5 ? -1 : 1) * (15 + Math.random() * 30),
        duration: 6000 + Math.random() * 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private addTitleDecoration(): void {
    const depth = UI_DEPTH + 1;
    const g = this.add.graphics().setDepth(depth);

    g.lineStyle(1, STORYBOOK_UI.gold, 0.28);
    g.strokeRect(GAME_WIDTH / 2 - 130, 72, 260, 2);
    g.strokeRect(GAME_WIDTH / 2 - 110, 162, 220, 1);

    const lampGlow = this.add.circle(GAME_WIDTH / 2, 58, 8, COLORS.lantern, 0.18).setDepth(depth);
    const lampCore = this.add.circle(GAME_WIDTH / 2, 58, 3, COLORS.lantern, 0.52).setDepth(depth);
    this.tweens.add({
      targets: lampGlow,
      alpha: { from: 0.12, to: 0.26 },
      scale: { from: 0.9, to: 1.15 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    void lampCore;

    [-1, 1].forEach((side) => {
      const x = GAME_WIDTH / 2 + side * 138;
      const inkDot = this.add.circle(x, 118, 4, COLORS.ink, 0.32).setDepth(depth);
      void inkDot;
    });
  }

  private addBottomDecoration(): void {
    const depth = UI_DEPTH + 1;
    const g = this.add.graphics().setDepth(depth);
    g.lineStyle(1, STORYBOOK_UI.gold, 0.16);
    g.strokeRect(GAME_WIDTH / 2 - 80, 550, 160, 1);

    const mapLine = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, 140, 1, COLORS.mapLine, 0.18)
      .setDepth(depth);
    void mapLine;
  }

  private showNotice(value: string): void {
    this.notice?.setText(value);
  }

  private text(x: number, y: number, value: string, size: number, color: string | number, bold = false, title = false): Phaser.GameObjects.Text {
    return this.add.text(x, y, value, {
      fontFamily: title ? STORYBOOK_TITLE_FONT : STORYBOOK_FONT,
      fontSize: `${size}px`,
      color: colorString(color),
      fontStyle: bold ? 'bold' : 'normal',
      align: 'center',
      resolution: 2,
      lineSpacing: 3,
    }).setOrigin(0.5);
  }

  private button(x: number, y: number, width: number, height: number, label: string, onClick: () => void, muted = false, primary = false): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    if (primary) {
      drawPaperCard(fill, 0, 0, width, height, STORYBOOK_UI.gold, STORYBOOK_UI.paperLight);
      fill.lineStyle(2, STORYBOOK_UI.goldLight, 0.5);
      fill.strokeRoundedRect(-width / 2 + 6, -height / 2 + 6, width - 12, height - 12, 5);
    } else if (muted) {
      drawStorybookPanel(fill, 0, 0, width, height, 0x25213d, 0x6f6590, 0.9);
    } else {
      drawPaperCard(fill, 0, 0, width, height, STORYBOOK_UI.gold, STORYBOOK_UI.paperLight);
    }
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this, hit, c, {
      x,
      y,
      width,
      height,
      accent: muted ? 0x6f6590 : STORYBOOK_UI.goldLight,
      depth: 1000,
      strong: primary || height >= 46,
      shake: primary || (!muted && height >= 46),
    });
    hit.on('pointerdown', () => {
      getAudioManager(this).playSe(primary ? 'ui_confirm' : 'ui_select', { volume: primary ? 0.48 : 0.36 });
      onClick();
    });
    const fontSize = primary ? 20 : 15;
    const labelText = this.text(0, 0, label, fontSize, muted ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textDark, true);
    c.add([fill, labelText, hit]);
    return c;
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
