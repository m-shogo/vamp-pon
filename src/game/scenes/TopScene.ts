import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { forgottenStreetNightBoard } from '../data/collectionProgress';
import { loadCollectionProgress } from '../persistence/collection';
import { loadProfile } from '../persistence/profile';
import { attachPressFeedback } from '../ui/pressFeedback';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI, drawPaperCard, drawStorybookPanel } from '../ui/storybookUi';

export class TopScene extends Phaser.Scene {
  private notice: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('TopScene');
  }

  create(): void {
    const profile = loadProfile();
    const collection = loadCollectionProgress();
    const boardCount = collection.nightBoard.completedCellIds.length;
    const boardTotal = forgottenStreetNightBoard.cells.length;
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1d1a34, 1);
    const panel = this.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 348, 700, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.98);

    this.text(GAME_WIDTH / 2, 118, 'VAMP PON', 34, STORYBOOK_UI.textLight, true, true);
    this.text(GAME_WIDTH / 2, 164, `黒曜片 ${profile.currency}`, 15, STORYBOOK_UI.goldLight, true);
    this.text(GAME_WIDTH / 2, 210, '夜をほどく準備をする', 13, STORYBOOK_UI.textMuted);

    this.button(GAME_WIDTH / 2, 306, 220, 52, 'はじめる', () => {
      this.scene.start('StageSelectScene', { mode: 'stage' });
    });
    this.button(GAME_WIDTH / 2, 374, 220, 52, '成長', () => {
      this.scene.start('StageSelectScene', { mode: 'growth' });
    }, true);
    this.button(GAME_WIDTH / 2, 442, 220, 52, `忘れ物帳 ${boardCount}/${boardTotal}`, () => {
      this.scene.start('CollectionScene');
    }, boardCount === 0);
    this.button(GAME_WIDTH / 2, 510, 220, 52, '設定', () => this.showNotice('設定は準備中です'), true);

    this.notice = this.text(GAME_WIDTH / 2, 590, '', 13, STORYBOOK_UI.textMuted);
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

  private button(x: number, y: number, width: number, height: number, label: string, onClick: () => void, muted = false): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    if (muted) drawStorybookPanel(fill, 0, 0, width, height, 0x25213d, 0x6f6590, 0.9);
    else drawPaperCard(fill, 0, 0, width, height, STORYBOOK_UI.gold, STORYBOOK_UI.paperLight);
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this, hit, c, {
      x,
      y,
      width,
      height,
      accent: muted ? 0x6f6590 : STORYBOOK_UI.goldLight,
      depth: 1000,
      strong: true,
      shake: !muted,
    });
    hit.on('pointerdown', onClick);
    c.add([fill, this.text(0, 0, label, 15, muted ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textDark, true), hit]);
    return c;
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
