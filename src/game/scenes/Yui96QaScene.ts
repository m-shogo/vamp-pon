import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, COLORS } from '../domain/constants';
import { createBackground } from '../ui/background';
import { FONT } from '../ui/visualDesign';
import {
  YUI_EXPRESSION_RAGE_SHEET,
  requestYuiExpressionRageSheet,
} from '../assets/yuiExpressionRageSheet';
import {
  YUI_BASIC_48_KEYS,
  YUI_EXPRESSION_RAGE_48_KEYS,
  yui96Cells,
  yuiEquipmentQaNote,
  type Yui96Cell,
} from '../assets/yui96QaCatalog';

const BASIC_SHEET = {
  id: 'yui_basic_48_sheet_qa',
  path: 'assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png',
  frameWidth: 180,
  frameHeight: 180,
  endFrame: 47,
} as const;

const BASIC_CELLS = yui96Cells(YUI_BASIC_48_KEYS);
const EXTRA_CELLS = yui96Cells(YUI_EXPRESSION_RAGE_48_KEYS);
const PAGE_SIZE = 24;

const QA_PAGES = [
  { title: '基本48  1–24', textureKey: BASIC_SHEET.id, cells: BASIC_CELLS, start: 0, extra: false },
  { title: '基本48  25–48', textureKey: BASIC_SHEET.id, cells: BASIC_CELLS, start: 24, extra: false },
  { title: '表情・暴走48  1–24', textureKey: YUI_EXPRESSION_RAGE_SHEET.id, cells: EXTRA_CELLS, start: 0, extra: true },
  { title: '表情・暴走48  25–48', textureKey: YUI_EXPRESSION_RAGE_SHEET.id, cells: EXTRA_CELLS, start: 24, extra: true },
] as const;

export function isYui96QaUrl(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  const params = new URLSearchParams(search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  return scene === 'yui96-qa';
}

export function yui96QaPageFromUrl(search = typeof window === 'undefined' ? '' : window.location.search): number {
  const value = Number(new URLSearchParams(search).get('page'));
  if (!Number.isInteger(value)) return 0;
  return Phaser.Math.Clamp(value, 0, QA_PAGES.length - 1);
}

export class Yui96QaScene extends Phaser.Scene {
  private page = 0;
  private pageRoot?: Phaser.GameObjects.Container;
  private extraLoading = false;
  private extraLoadError = '';
  private extraLoadMs: number | null = null;
  private extraResourceCountBefore = 0;
  private extraResourceCountAfter = 0;

  constructor() {
    super('Yui96QaScene');
  }

  init(): void {
    this.page = yui96QaPageFromUrl();
  }

  preload(): void {
    if (!this.textures.exists(BASIC_SHEET.id)) {
      this.load.spritesheet(BASIC_SHEET.id, BASIC_SHEET.path, {
        frameWidth: BASIC_SHEET.frameWidth,
        frameHeight: BASIC_SHEET.frameHeight,
        endFrame: BASIC_SHEET.endFrame,
      });
    }
  }

  create(): void {
    createBackground(this);
    this.input.keyboard?.on('keydown-LEFT', () => this.go(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.go(1));
    this.input.keyboard?.on('keydown-SPACE', () => this.loadExtraSheet());
    this.render();
  }

  private go(delta: number): void {
    this.page = (this.page + delta + QA_PAGES.length) % QA_PAGES.length;
    this.render();
  }

  private render(): void {
    this.pageRoot?.destroy(true);
    this.pageRoot = this.add.container(0, 0).setDepth(50);

    const page = QA_PAGES[this.page];
    this.addToRoot(
      this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101124, 0.78),
    );
    this.addToRoot(
      this.add.text(GAME_WIDTH / 2, 12, 'ユイ96セル QA', {
        fontFamily: FONT,
        fontSize: '17px',
        color: '#fff2c7',
        fontStyle: 'bold',
      }).setOrigin(0.5, 0),
    );
    this.addToRoot(
      this.add.text(GAME_WIDTH / 2, 35, `${this.page + 1}/${QA_PAGES.length}  ${page.title}`, {
        fontFamily: FONT,
        fontSize: '12px',
        color: '#cfe6f0',
      }).setOrigin(0.5, 0),
    );

    if (page.extra && !this.textures.exists(page.textureKey)) {
      this.renderExtraLoadGate();
    } else {
      this.renderGrid(page.textureKey, page.cells, page.start);
    }

    this.renderFooter();
  }

  private renderGrid(textureKey: string, cells: readonly Yui96Cell[], start: number): void {
    const visibleCells = cells.slice(start, start + PAGE_SIZE);
    const xPositions = [49, 146, 243, 340];
    const startY = 92;
    const rowGap = 109;

    visibleCells.forEach((cell, localIndex) => {
      const column = localIndex % 4;
      const row = Math.floor(localIndex / 4);
      const x = xPositions[column];
      const y = startY + row * rowGap;

      const box = this.add.rectangle(x, y + 18, 88, 100, COLORS.cardBg, 0.92);
      box.setStrokeStyle(1, COLORS.cardEdge, 0.95);
      this.addToRoot(box);

      const image = this.add
        .image(x, y, textureKey, cell.index)
        .setDisplaySize(70, 70)
        .setInteractive({ useHandCursor: true });
      image.on('pointerdown', () => this.openZoom(textureKey, cell));
      this.addToRoot(image);

      this.addToRoot(
        this.add.text(x, y + 39, `R${cell.row}C${cell.column}  #${String(cell.index).padStart(2, '0')}`, {
          fontFamily: FONT,
          fontSize: '8px',
          color: '#ffe9a8',
        }).setOrigin(0.5, 0),
      );
      this.addToRoot(
        this.add.text(x, y + 50, compactKey(cell.key), {
          fontFamily: FONT,
          fontSize: '7px',
          color: '#d5d1c5',
          align: 'center',
          wordWrap: { width: 84 },
        }).setOrigin(0.5, 0),
      );
    });
  }

  private renderExtraLoadGate(): void {
    const requestCount = resourceRequestCount(YUI_EXPRESSION_RAGE_SHEET.path);
    const status = this.extraLoading
      ? '読み込み中…'
      : this.extraLoadError
        ? `失敗: ${this.extraLoadError}`
        : '追加48セルは通常起動では未読込';

    this.addToRoot(
      this.add.text(GAME_WIDTH / 2, 128, [
        status,
        '',
        'ここで初めて追加spritesheetを要求します。',
        '通常起動の48個別PNGロードを増やしません。',
        '',
        `Resource Timing上の取得回数: ${requestCount}`,
        this.extraLoadMs == null ? '' : `直近ロード時間: ${Math.round(this.extraLoadMs)}ms`,
      ].filter(Boolean), {
        fontFamily: FONT,
        fontSize: '12px',
        color: '#e7dfcf',
        align: 'center',
        lineSpacing: 8,
      }).setOrigin(0.5, 0),
    );

    const button = this.add.rectangle(GAME_WIDTH / 2, 360, 230, 58, 0xead9a6, this.extraLoading ? 0.45 : 1);
    button.setStrokeStyle(2, 0x6b5634, 1);
    if (!this.extraLoading) {
      button.setInteractive({ useHandCursor: true });
      button.on('pointerdown', () => this.loadExtraSheet());
    }
    this.addToRoot(button);
    this.addToRoot(
      this.add.text(GAME_WIDTH / 2, 360, this.extraLoading ? 'LOADING' : '追加48セルを読み込む', {
        fontFamily: FONT,
        fontSize: '13px',
        color: '#352c20',
        fontStyle: 'bold',
      }).setOrigin(0.5),
    );

    this.addToRoot(
      this.add.text(GAME_WIDTH / 2, 430, [
        '確認基準',
        '・同一Sceneで取得は1回だけ',
        '・読込前は通常ユイへフォールバック',
        '・失敗してもゲーム全体を止めない',
        '・スマホで大きな停止がない',
      ], {
        fontFamily: FONT,
        fontSize: '11px',
        color: '#ffe9a8',
        align: 'left',
        lineSpacing: 7,
      }).setOrigin(0.5, 0),
    );
  }

  private loadExtraSheet(): void {
    if (this.extraLoading || this.textures.exists(YUI_EXPRESSION_RAGE_SHEET.id)) {
      this.render();
      return;
    }

    this.extraLoading = true;
    this.extraLoadError = '';
    const startedAt = performance.now();
    this.extraResourceCountBefore = resourceRequestCount(YUI_EXPRESSION_RAGE_SHEET.path);

    const onError = (file: { key?: string; src?: string }): void => {
      if (file.key !== YUI_EXPRESSION_RAGE_SHEET.id) return;
      this.extraLoadError = file.src ?? 'loaderror';
    };

    this.load.on('loaderror', onError);
    this.load.once('complete', () => {
      this.load.off('loaderror', onError);
      this.extraLoading = false;
      this.extraLoadMs = performance.now() - startedAt;
      this.extraResourceCountAfter = resourceRequestCount(YUI_EXPRESSION_RAGE_SHEET.path);
      if (!this.textures.exists(YUI_EXPRESSION_RAGE_SHEET.id) && !this.extraLoadError) {
        this.extraLoadError = 'texture未登録';
      }
      this.render();
    });

    requestYuiExpressionRageSheet(this);
    this.render();
  }

  private openZoom(textureKey: string, cell: Yui96Cell): void {
    const overlay = this.add.container(0, 0).setDepth(200);
    const shade = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x090a12, 0.94)
      .setInteractive({ useHandCursor: true });
    overlay.add(shade);

    const panel = this.add.rectangle(GAME_WIDTH / 2, 395, 362, 720, 0x17182b, 1);
    panel.setStrokeStyle(2, 0xd4c18d, 1);
    overlay.add(panel);

    overlay.add(
      this.add.text(GAME_WIDTH / 2, 58, `R${cell.row}C${cell.column}  #${cell.index}\n${cell.key}`, {
        fontFamily: FONT,
        fontSize: '15px',
        color: '#fff2c7',
        align: 'center',
      }).setOrigin(0.5, 0),
    );

    overlay.add(this.add.image(GAME_WIDTH / 2, 275, textureKey, cell.index).setDisplaySize(300, 300));
    overlay.add(this.add.text(70, 472, 'ゲーム表示 76px', {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#cfe6f0',
    }).setOrigin(0.5, 0));
    overlay.add(this.add.image(70, 535, textureKey, cell.index).setDisplaySize(76, 76));

    overlay.add(
      this.add.text(126, 486, yuiEquipmentQaNote(cell), {
        fontFamily: FONT,
        fontSize: '11px',
        color: '#ffe9a8',
        wordWrap: { width: 220 },
        lineSpacing: 6,
      }).setOrigin(0, 0),
    );

    overlay.add(
      this.add.text(GAME_WIDTH / 2, 635, '問題は R行C列 で記録し、このセルだけ直接修正', {
        fontFamily: FONT,
        fontSize: '10px',
        color: '#d5d1c5',
        align: 'center',
        wordWrap: { width: 330 },
      }).setOrigin(0.5, 0),
    );
    overlay.add(
      this.add.text(GAME_WIDTH / 2, 744, 'タップして閉じる', {
        fontFamily: FONT,
        fontSize: '11px',
        color: '#cfe6f0',
      }).setOrigin(0.5),
    );

    shade.on('pointerdown', () => overlay.destroy(true));
  }

  private renderFooter(): void {
    const page = QA_PAGES[this.page];
    const extraStatus = page.extra
      ? this.textures.exists(YUI_EXPRESSION_RAGE_SHEET.id)
        ? `追加sheet: loaded / requests ${this.extraResourceCountBefore}→${this.extraResourceCountAfter || resourceRequestCount(YUI_EXPRESSION_RAGE_SHEET.path)}`
        : '追加sheet: not loaded'
      : 'セルをタップで300px＋76px比較';

    this.addToRoot(
      this.add.text(GAME_WIDTH / 2, 758, extraStatus, {
        fontFamily: FONT,
        fontSize: '9px',
        color: '#cfe6f0',
      }).setOrigin(0.5, 0),
    );

    this.addButton(38, 806, '◀', () => this.go(-1));
    this.addButton(GAME_WIDTH - 38, 806, '▶', () => this.go(1));
    this.addToRoot(
      this.add.text(GAME_WIDTH / 2, 800, '← → / swipe代わりにボタン', {
        fontFamily: FONT,
        fontSize: '10px',
        color: '#d5d1c5',
      }).setOrigin(0.5, 0),
    );
  }

  private addButton(x: number, y: number, label: string, action: () => void): void {
    const button = this.add.circle(x, y, 22, 0xead9a6, 1).setInteractive({ useHandCursor: true });
    button.setStrokeStyle(2, 0x6b5634, 1);
    button.on('pointerdown', action);
    this.addToRoot(button);
    this.addToRoot(
      this.add.text(x, y, label, {
        fontFamily: FONT,
        fontSize: '18px',
        color: '#352c20',
        fontStyle: 'bold',
      }).setOrigin(0.5),
    );
  }

  private addToRoot<T extends Phaser.GameObjects.GameObject>(item: T): T {
    this.pageRoot?.add(item);
    return item;
  }
}

function compactKey(key: string): string {
  return key
    .replace('portrait_', 'prt_')
    .replace('ultimate_', 'ult_')
    .replace('secondary_', '2nd_')
    .replace('memory_', 'mem_');
}

function resourceRequestCount(path: string): number {
  if (typeof performance === 'undefined' || typeof performance.getEntriesByType !== 'function') return 0;
  return performance
    .getEntriesByType('resource')
    .filter((entry) => entry.name.includes(path))
    .length;
}
