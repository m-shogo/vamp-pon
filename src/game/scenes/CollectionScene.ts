import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { forgottenStreetNightBoard } from '../data/collectionProgress';
import type { NightBoardCell } from '../data/collectionProgress';
import { enemies } from '../data/enemies';
import { loadCollectionProgress } from '../persistence/collection';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI, drawStorybookPanel } from '../ui/storybookUi';

export class CollectionScene extends Phaser.Scene {
  private root: Phaser.GameObjects.Container | null = null;
  private detailText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('CollectionScene');
  }

  create(): void {
    this.render();
  }

  private render(): void {
    this.root?.destroy(true);
    const progress = loadCollectionProgress();
    const completed = new Set(progress.nightBoard.completedCellIds);
    const revealed = new Set(progress.nightBoard.revealedCellIds);
    const hinted = new Set(progress.nightBoard.hintedCellIds);
    const root = this.add.container(0, 0);
    this.root = root;

    root.add(this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1d1a34, 1));
    const panel = this.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 370, 810, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.98);
    root.add(panel);

    root.add(this.text(GAME_WIDTH / 2, 34, '忘れ物帳', 26, STORYBOOK_UI.textLight, true, true));
    root.add(this.text(GAME_WIDTH / 2, 66, `${forgottenStreetNightBoard.name}　${completed.size}/${forgottenStreetNightBoard.cells.length}`, 13, STORYBOOK_UI.goldLight, true));
    root.add(this.text(GAME_WIDTH / 2, 96, 'マスを埋めると、となりの記録が見えていく', 11, STORYBOOK_UI.textMuted));

    this.renderBoard(root, completed, revealed, hinted);

    // 詳細枠（紙片風の小パネル）。マス選択時にここへテキストが入る。
    const detailPanel = this.add.graphics();
    drawStorybookPanel(detailPanel, GAME_WIDTH / 2, 470, 330, 96, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.86);
    root.add(detailPanel);
    this.detailText = this.add.text(
      GAME_WIDTH / 2,
      430,
      '夜明け盤のマスを押すと、条件と報酬が見えます。',
      {
        fontFamily: STORYBOOK_FONT,
        fontSize: '12px',
        color: colorString(STORYBOOK_UI.textMuted),
        align: 'center',
        resolution: 2,
        lineSpacing: 4,
        wordWrap: { width: 308 },
      },
    ).setOrigin(0.5, 0);
    root.add(this.detailText);

    this.renderBestiarySummary(root, progress.seenEnemyIds, progress.defeatedEnemyCounts);

    root.add(this.text(GAME_WIDTH / 2, 712, `カゲモノ ${progress.seenEnemyIds.length}種発見　記憶文 ${progress.unlockedMemoryTextIds.length}`, 12, STORYBOOK_UI.goldLight, true));
    root.add(this.button(GAME_WIDTH / 2 - 86, GAME_HEIGHT - 46, 148, 44, 'TOPへ', () => this.scene.start('TopScene'), true));
    root.add(this.button(GAME_WIDTH / 2 + 86, GAME_HEIGHT - 46, 148, 44, '夜へ', () => this.scene.start('StageSelectScene', { mode: 'stage' })));
  }

  private renderBoard(
    root: Phaser.GameObjects.Container,
    completed: Set<string>,
    revealed: Set<string>,
    hinted: Set<string>,
  ): void {
    const cellSize = 48;
    const gap = 8;
    const startX = GAME_WIDTH / 2 - ((cellSize + gap) * forgottenStreetNightBoard.width - gap) / 2 + cellSize / 2;
    const startY = 152;

    for (const cell of forgottenStreetNightBoard.cells) {
      const state = completed.has(cell.id)
        ? 'completed'
        : revealed.has(cell.id)
          ? 'revealed'
          : hinted.has(cell.id)
            ? 'hinted'
            : 'hidden';
      const x = startX + cell.x * (cellSize + gap);
      const y = startY + cell.y * (cellSize + gap);
      root.add(this.boardCell(x, y, cellSize, cell, state));
    }
  }

  private renderBestiarySummary(root: Phaser.GameObjects.Container, seenEnemyIds: string[], defeatedEnemyCounts: Record<string, number>): void {
    root.add(this.text(GAME_WIDTH / 2, 552, 'カゲモノ図鑑', 14, STORYBOOK_UI.textLight, true));
    const seen = new Set(seenEnemyIds);
    const known = enemies.filter((enemy) => seen.has(enemy.id) || (defeatedEnemyCounts[enemy.id] ?? 0) > 0);
    const visible = known.slice(0, 4);
    const more = known.length - visible.length;
    const rows = visible.map((enemy) => `${enemy.name} ×${defeatedEnemyCounts[enemy.id] ?? 0}`);
    if (more > 0) rows.push(`…ほか ${more}種`);
    const text = rows.length > 0
      ? rows.join('\n')
      : 'まだカゲモノは記されていません。\n夜路で出会うと、ここに残ります。';
    const summary = this.text(GAME_WIDTH / 2, 600, text, 12, rows.length > 0 ? STORYBOOK_UI.goldLight : STORYBOOK_UI.textMuted, rows.length > 0);
    summary.setWordWrapWidth(306);
    root.add(summary);
  }

  private boardCell(
    x: number,
    y: number,
    size: number,
    cell: NightBoardCell,
    state: 'hidden' | 'hinted' | 'revealed' | 'completed',
  ): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fillColor = state === 'completed'
      ? 0xb8954e
      : state === 'revealed'
        ? 0x3c355f
        : state === 'hinted'
          ? 0x26213f
          : 0x151326;
    const strokeColor = state === 'completed'
      ? 0xf5d58a
      : state === 'revealed'
        ? 0x9184bd
        : state === 'hinted'
          ? 0x6f6590
          : 0x34304c;
    const rect = this.add.rectangle(0, 0, size, size, fillColor, state === 'hidden' ? 0.78 : 0.94);
    rect.setStrokeStyle(1, strokeColor, 0.95);
    const hit = this.add.rectangle(0, 0, size, size, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => this.showCellDetail(cell, state));

    const mark = state === 'completed'
      ? '✓'
      : state === 'revealed'
        ? shortCellLabel(cell.title)
        : state === 'hinted'
          ? '？'
          : '';
    const label = this.add.text(0, 0, mark, {
      fontFamily: state === 'completed' ? STORYBOOK_TITLE_FONT : STORYBOOK_FONT,
      fontSize: state === 'revealed' ? '9px' : '20px',
      color: state === 'completed' ? '#1f1a2f' : '#f7edcf',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      wordWrap: { width: size - 8 },
      lineSpacing: 1,
    }).setOrigin(0.5);
    c.add([rect, label, hit]);
    return c;
  }

  private showCellDetail(cell: NightBoardCell, state: 'hidden' | 'hinted' | 'revealed' | 'completed'): void {
    if (!this.detailText) return;
    if (state === 'hidden') {
      this.detailText.setText('まだ暗くて読めません。近くのマスを埋めると見えてきます。');
      return;
    }
    if (state === 'hinted') {
      this.detailText.setText(`${cell.hiddenTitle ?? '？？？'}\n${cell.hint ?? 'もう少し記録を集めると条件が見える。'}`);
      return;
    }
    const reward = rewardLabel(cell);
    this.detailText.setText(`${state === 'completed' ? '記録済み' : '未達成'}：${cell.title}\n${cell.condition}${reward ? `\n報酬：${reward}` : ''}`);
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
      stroke: '#080b18',
      strokeThickness: bold ? 1 : 0,
    }).setOrigin(0.5);
  }

  private button(x: number, y: number, width: number, height: number, label: string, onClick: () => void, muted = false): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.rectangle(0, 0, width, height, muted ? 0x3c355f : 0xb8954e, muted ? 0.82 : 0.95);
    fill.setStrokeStyle(1, muted ? 0x6f6590 : 0xf5d58a, 0.9);
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', onClick);
    c.add([fill, this.text(0, 0, label, 12, muted ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textDark, true), hit]);
    return c;
  }
}

function shortCellLabel(value: string): string {
  if (value.length <= 4) return value;
  if (value.includes('夜明け')) return '夜明け';
  if (value.includes('灯')) return '灯り';
  if (value.includes('ほどく')) return 'ほどく';
  if (value.includes('鎮める')) return '鎮める';
  return value.slice(0, 3);
}

function rewardLabel(cell: NightBoardCell): string {
  switch (cell.reward.type) {
    case 'light_coin': return `黒曜片 +${cell.reward.amount ?? 0}`;
    case 'travel_prep': return `旅支度 +${cell.reward.amount ?? 0}`;
    case 'memory_text': return '記憶文';
    case 'cosmetic': return '見た目';
    case 'sound': return '音';
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
