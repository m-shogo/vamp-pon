import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { COLLECTION_LABELS, forgottenStreetNightBoard } from '../data/collectionProgress';
import type { NightBoardCell, NightBoardCellKind } from '../data/collectionProgress';
import { enemies } from '../data/enemies';
import { loadCollectionProgress } from '../persistence/collection';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI, drawFragment, drawStar, drawStorybookPanel } from '../ui/storybookUi';

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
    this.addSoftAtlasGlow(root);
    const panel = this.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 370, 810, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.98);
    root.add(panel);

    root.add(this.text(GAME_WIDTH / 2, 34, COLLECTION_LABELS.book, 26, STORYBOOK_UI.textLight, true, true));
    root.add(this.text(GAME_WIDTH / 2, 66, `${forgottenStreetNightBoard.name}　${completed.size}/${forgottenStreetNightBoard.cells.length}`, 13, STORYBOOK_UI.goldLight, true));
    root.add(this.text(GAME_WIDTH / 2, 96, '絵札を灯すほど、となりの夜明けが見えていく', 12, STORYBOOK_UI.textMuted));

    this.renderBoard(root, completed, revealed, hinted);

    const detailPanel = this.add.graphics();
    drawStorybookPanel(detailPanel, GAME_WIDTH / 2, 470, 330, 96, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.86);
    root.add(detailPanel);
    this.detailText = this.add.text(
      GAME_WIDTH / 2,
      430,
      '夜明け星図の絵札を押すと、条件と報酬が見えます。',
      {
        fontFamily: STORYBOOK_FONT,
        fontSize: '13px',
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

  private addSoftAtlasGlow(root: Phaser.GameObjects.Container): void {
    const glow = this.add.graphics();
    glow.fillStyle(0xf4d69a, 0.04).fillCircle(GAME_WIDTH / 2, 240, 180);
    glow.fillStyle(0x8d76c9, 0.035).fillCircle(GAME_WIDTH / 2 + 40, 380, 150);
    root.add(glow);
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

    const lineLayer = this.add.graphics();
    lineLayer.lineStyle(1, STORYBOOK_UI.gold, 0.16);
    for (const cell of forgottenStreetNightBoard.cells) {
      for (const parentId of cell.revealBy ?? []) {
        const parent = forgottenStreetNightBoard.cells.find((candidate) => candidate.id === parentId);
        if (!parent) continue;
        const fromX = startX + parent.x * (cellSize + gap);
        const fromY = startY + parent.y * (cellSize + gap);
        const toX = startX + cell.x * (cellSize + gap);
        const toY = startY + cell.y * (cellSize + gap);
        lineLayer.lineBetween(fromX, fromY, toX, toY);
      }
    }
    root.add(lineLayer);

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
    root.add(this.text(GAME_WIDTH / 2, 552, COLLECTION_LABELS.bestiary, 14, STORYBOOK_UI.textLight, true));
    const seen = new Set(seenEnemyIds);
    const known = enemies.filter((enemy) => seen.has(enemy.id) || (defeatedEnemyCounts[enemy.id] ?? 0) > 0);
    const visible = known.slice(0, 4);
    const more = known.length - visible.length;
    const rows = visible.map((enemy) => `${enemy.name} ×${defeatedEnemyCounts[enemy.id] ?? 0}`);
    if (more > 0) rows.push(`…ほか ${more}種`);
    const text = rows.length > 0
      ? rows.join('\n')
      : 'まだカゲモノは記されていません。\n夜路で出会うと、ここに残ります。';
    const summary = this.text(GAME_WIDTH / 2, 600, text, 13, rows.length > 0 ? STORYBOOK_UI.goldLight : STORYBOOK_UI.textMuted, rows.length > 0);
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
    const accent = kindAccent(cell.kind);
    const fillColor = state === 'completed'
      ? 0xcaa25a
      : state === 'revealed'
        ? kindFill(cell.kind)
        : state === 'hinted'
          ? 0x26213f
          : 0x151326;
    const strokeColor = state === 'completed'
      ? 0xf5d58a
      : state === 'revealed'
        ? accent
        : state === 'hinted'
          ? 0x6f6590
          : 0x34304c;

    const rect = this.add.rectangle(0, 0, size, size, fillColor, state === 'hidden' ? 0.78 : 0.95);
    rect.setStrokeStyle(state === 'completed' ? 2 : 1, strokeColor, 0.95);
    const art = this.add.graphics();
    this.drawCellMotif(art, cell, state, size, accent);
    const hit = this.add.rectangle(0, 0, size, size, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => this.showCellDetail(cell, state));

    const labelText = state === 'hidden'
      ? ''
      : state === 'hinted'
        ? '？'
        : shortCellLabel(cell.title);
    const label = this.add.text(0, size / 2 - 14, labelText, {
      fontFamily: STORYBOOK_FONT,
      fontSize: state === 'completed' ? '9px' : '8px',
      color: state === 'completed' ? '#241b27' : '#f7edcf',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      wordWrap: { width: size - 8 },
      lineSpacing: 1,
    }).setOrigin(0.5);

    c.add([rect, art, label, hit]);
    return c;
  }

  private drawCellMotif(
    g: Phaser.GameObjects.Graphics,
    cell: NightBoardCell,
    state: 'hidden' | 'hinted' | 'revealed' | 'completed',
    size: number,
    accent: number,
  ): void {
    if (state === 'hidden') {
      g.fillStyle(0x0b1022, 0.4).fillCircle(0, 0, 11);
      g.lineStyle(1, 0x50476d, 0.5).strokeCircle(0, 0, 13);
      return;
    }

    if (state === 'hinted') {
      g.lineStyle(1, STORYBOOK_UI.gold, 0.45).strokeCircle(0, -3, 12);
      g.fillStyle(STORYBOOK_UI.gold, 0.24).fillCircle(0, -3, 8);
      return;
    }

    if (state === 'completed') {
      drawStar(g, 0, -6, 13, STORYBOOK_UI.goldLight, STORYBOOK_UI.paperEdge, 1);
      g.fillStyle(0xffffff, 0.55).fillRect(-1, -15, 2, 8);
      return;
    }

    switch (cell.kind) {
      case 'natural':
        drawFragment(g, 0, -5, 11);
        break;
      case 'targeted':
        g.lineStyle(2, accent, 0.9).strokeCircle(0, -5, 12);
        g.lineStyle(1, STORYBOOK_UI.goldLight, 0.75).lineBetween(-10, -5, 10, -5).lineBetween(0, -15, 0, 5);
        break;
      case 'mastery':
        drawStar(g, 0, -5, 12, accent, STORYBOOK_UI.goldLight, 0.9);
        g.lineStyle(1, STORYBOOK_UI.goldLight, 0.45).strokeCircle(0, -5, 17);
        break;
      case 'secret':
        g.fillStyle(accent, 0.84).fillTriangle(0, -20, 14, -5, 0, 10).fillTriangle(0, -20, -14, -5, 0, 10);
        g.lineStyle(1, STORYBOOK_UI.goldLight, 0.55).strokeCircle(0, -5, 15);
        break;
    }
  }

  private showCellDetail(cell: NightBoardCell, state: 'hidden' | 'hinted' | 'revealed' | 'completed'): void {
    if (!this.detailText) return;
    if (state === 'hidden') {
      this.detailText.setText('まだ暗くて絵札が見えません。となりの札を灯すと、輪郭が浮かびます。');
      return;
    }
    if (state === 'hinted') {
      this.detailText.setText(`${cell.hiddenTitle ?? '？？？'}\n${cell.hint ?? 'もう少し記録を集めると条件が見える。'}`);
      return;
    }
    const reward = rewardLabel(cell);
    this.detailText.setText(`${state === 'completed' ? '灯った絵札' : 'まだ灯っていない絵札'}：${cell.title}\n${cell.condition}${reward ? `\n報酬：${reward}` : ''}`);
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
    const fill = this.add.rectangle(0, 0, width, height, muted ? 0x3c355f : 0xb8954e, muted ? 0.82 : 0.95);
    fill.setStrokeStyle(1, muted ? 0x6f6590 : 0xf5d58a, 0.9);
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', onClick);
    c.add([fill, this.text(0, 0, label, 13, muted ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textDark, true), hit]);
    return c;
  }
}

function kindAccent(kind: NightBoardCellKind): number {
  switch (kind) {
    case 'natural': return STORYBOOK_UI.goldLight;
    case 'targeted': return 0x9fd4ff;
    case 'mastery': return 0xd89cff;
    case 'secret': return 0xffb7c8;
  }
}

function kindFill(kind: NightBoardCellKind): number {
  switch (kind) {
    case 'natural': return 0x3c355f;
    case 'targeted': return 0x263a58;
    case 'mastery': return 0x3b2a58;
    case 'secret': return 0x563047;
  }
}

function shortCellLabel(value: string): string {
  if (value.length <= 4) return value;
  if (value.includes('夜明け')) return '夜明け';
  if (value.includes('朝')) return '朝';
  if (value.includes('灯')) return '灯り';
  if (value.includes('ほどく')) return 'ほどく';
  if (value.includes('鎮める')) return '鎮める';
  if (value.includes('記録')) return '記録';
  if (value.includes('拾う')) return '拾う';
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
