import Phaser from 'phaser';
import { core5PrototypeCharacterById, core5PrototypeCharacters, type Core5PrototypeCharacter, type Core5PrototypeCharacterId } from '../assets/core5PrototypeCharacters';
import { GAME_HEIGHT, GAME_WIDTH, COLORS } from '../domain/constants';
import { FONT } from './visualDesign';

type CellDef = {
  index: number;
  row: number;
  column: number;
  key: string;
  description: string;
};

export const CORE5_SHEET_COLUMNS = 8;
export const CORE5_SHEET_ROWS = 6;
export const CORE5_LOGICAL_CELL_SIZE = 52;

export const CORE5_SHEET_CELLS: CellDef[] = [
  { index: 0, row: 1, column: 1, key: 'idle_front', description: 'Front idle pose' },
  { index: 1, row: 1, column: 2, key: 'idle_front_blink', description: 'Front idle alternate blink frame' },
  { index: 2, row: 1, column: 3, key: 'idle_left', description: 'Left-facing idle pose' },
  { index: 3, row: 1, column: 4, key: 'idle_right', description: 'Right-facing idle pose' },
  { index: 4, row: 1, column: 5, key: 'idle_back', description: 'Back-facing idle pose' },
  { index: 5, row: 1, column: 6, key: 'ready_front', description: 'Front ready pose with vessel visible' },
  { index: 6, row: 1, column: 7, key: 'ready_left', description: 'Left ready pose' },
  { index: 7, row: 1, column: 8, key: 'ready_right', description: 'Right ready pose' },
  { index: 8, row: 2, column: 1, key: 'walk_front_a', description: 'Front walk frame A' },
  { index: 9, row: 2, column: 2, key: 'walk_front_b', description: 'Front walk frame B' },
  { index: 10, row: 2, column: 3, key: 'walk_left_a', description: 'Left walk frame A' },
  { index: 11, row: 2, column: 4, key: 'walk_left_b', description: 'Left walk frame B' },
  { index: 12, row: 2, column: 5, key: 'walk_right_a', description: 'Right walk frame A' },
  { index: 13, row: 2, column: 6, key: 'walk_right_b', description: 'Right walk frame B' },
  { index: 14, row: 2, column: 7, key: 'walk_back_a', description: 'Back walk frame A' },
  { index: 15, row: 2, column: 8, key: 'walk_back_b', description: 'Back walk frame B' },
  { index: 16, row: 3, column: 1, key: 'cast_front', description: 'Front cast frame' },
  { index: 17, row: 3, column: 2, key: 'cast_left', description: 'Left cast frame' },
  { index: 18, row: 3, column: 3, key: 'cast_right', description: 'Right cast frame' },
  { index: 19, row: 3, column: 4, key: 'cast_back', description: 'Back cast frame' },
  { index: 20, row: 3, column: 5, key: 'attack_front', description: 'Front attack frame' },
  { index: 21, row: 3, column: 6, key: 'attack_left', description: 'Left attack frame' },
  { index: 22, row: 3, column: 7, key: 'attack_right', description: 'Right attack frame' },
  { index: 23, row: 3, column: 8, key: 'attack_back', description: 'Back attack frame' },
  { index: 24, row: 4, column: 1, key: 'hurt_front', description: 'Front hurt frame' },
  { index: 25, row: 4, column: 2, key: 'hurt_left', description: 'Left hurt frame' },
  { index: 26, row: 4, column: 3, key: 'hurt_right', description: 'Right hurt frame' },
  { index: 27, row: 4, column: 4, key: 'hurt_back', description: 'Back hurt frame' },
  { index: 28, row: 4, column: 5, key: 'recoil_front', description: 'Front recoil frame' },
  { index: 29, row: 4, column: 6, key: 'recoil_left', description: 'Left recoil frame' },
  { index: 30, row: 4, column: 7, key: 'recoil_right', description: 'Right recoil frame' },
  { index: 31, row: 4, column: 8, key: 'recoil_back', description: 'Back recoil frame' },
  { index: 32, row: 5, column: 1, key: 'special_normal', description: 'Normal special frame' },
  { index: 33, row: 5, column: 2, key: 'special_black', description: 'Black/corrupted special frame' },
  { index: 34, row: 5, column: 3, key: 'pickup', description: 'Pickup interaction frame' },
  { index: 35, row: 5, column: 4, key: 'interact', description: 'Inspect/use item frame' },
  { index: 36, row: 5, column: 5, key: 'downed', description: 'Downed/defeated frame' },
  { index: 37, row: 5, column: 6, key: 'rest', description: 'Sit/rest frame' },
  { index: 38, row: 5, column: 7, key: 'emote_happy', description: 'Happy emote frame' },
  { index: 39, row: 5, column: 8, key: 'emote_surprised', description: 'Surprised emote frame' },
  { index: 40, row: 6, column: 1, key: 'portrait_neutral', description: 'Neutral portrait icon' },
  { index: 41, row: 6, column: 2, key: 'portrait_alt', description: 'Alternate portrait icon' },
  { index: 42, row: 6, column: 3, key: 'vessel_icon', description: 'Main vessel icon' },
  { index: 43, row: 6, column: 4, key: 'secondary_item_icon', description: 'Secondary item icon' },
  { index: 44, row: 6, column: 5, key: 'crest_normal', description: 'Normal crest icon' },
  { index: 45, row: 6, column: 6, key: 'crest_black', description: 'Black/corrupted crest icon' },
  { index: 46, row: 6, column: 7, key: 'memory_item_icon', description: 'Memory item icon' },
  { index: 47, row: 6, column: 8, key: 'effect_icon', description: 'Signature effect icon' },
];

export class Core5SpriteSheetPreview {
  private root: Phaser.GameObjects.Container;
  private selectedCharacter: Core5PrototypeCharacter;
  private selectedCellIndex = 0;
  private zoom: 4 | 8 = 4;

  constructor(private scene: Phaser.Scene, selectedId: Core5PrototypeCharacterId = 'yui') {
    this.root = scene.add.container(0, 0);
    this.selectedCharacter = core5PrototypeCharacterById.get(selectedId) ?? core5PrototypeCharacters[0];
  }

  destroy(): void {
    this.root.destroy();
  }

  render(): void {
    this.root.removeAll(true);
    this.drawHeader();
    this.drawCharacterTabs();
    this.drawSheet();
    this.drawSelectedCellPreview();
    this.drawFooterNotes();
  }

  private drawHeader(): void {
    this.root.add(
      this.scene.add.text(GAME_WIDTH / 2, 16, 'Core5 52px sprite sheet preview', {
        fontFamily: FONT,
        fontSize: '15px',
        color: '#f3ead2',
      }).setOrigin(0.5, 0),
    );
    this.root.add(
      this.scene.add.text(GAME_WIDTH / 2, 36, 'prototype-reference / sprite-sheet-candidate only. production sprite は未使用。', {
        fontFamily: FONT,
        fontSize: '9px',
        color: '#ffe9a8',
      }).setOrigin(0.5, 0),
    );
  }

  private drawCharacterTabs(): void {
    const startX = 38;
    core5PrototypeCharacters.forEach((character, index) => {
      const x = startX + index * 78;
      const active = character.id === this.selectedCharacter.id;
      const bg = this.scene.add.rectangle(x, 72, 68, 30, active ? 0xf1d58a : COLORS.cardBg, active ? 0.95 : 0.85)
        .setInteractive({ useHandCursor: true });
      bg.setStrokeStyle(1, active ? 0xffffff : COLORS.cardEdge, 1);
      bg.on('pointerdown', () => {
        this.selectedCharacter = character;
        this.selectedCellIndex = 0;
        this.render();
      });
      this.root.add(bg);
      this.root.add(this.scene.add.text(x, 64, character.name, {
        fontFamily: FONT,
        fontSize: '10px',
        color: active ? '#35291e' : '#f3ead2',
      }).setOrigin(0.5, 0));
      this.root.add(this.scene.add.text(x, 78, character.id, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: active ? '#5b3f21' : '#9db7df',
      }).setOrigin(0.5, 0));
    });
  }

  private drawSheet(): void {
    const imageId = this.selectedImageId();
    const hasImage = this.scene.textures.exists(imageId);
    const sheetX = 18;
    const sheetY = 112;
    const sheetW = GAME_WIDTH - 36;
    const sheetH = Math.round(sheetW * CORE5_SHEET_ROWS / CORE5_SHEET_COLUMNS);

    this.root.add(this.scene.add.text(18, 98, `${this.selectedCharacter.name}: ${this.selectedCharacter.role} / ${this.selectedCharacter.motif}`, {
      fontFamily: FONT,
      fontSize: '9px',
      color: '#cfe6f0',
    }).setOrigin(0, 0));

    if (hasImage) {
      const sheet = this.scene.add.image(sheetX, sheetY, imageId).setOrigin(0, 0).setDisplaySize(sheetW, sheetH);
      sheet.setInteractive({ useHandCursor: true });
      sheet.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const localX = Phaser.Math.Clamp(pointer.x - sheetX, 0, sheetW - 1);
        const localY = Phaser.Math.Clamp(pointer.y - sheetY, 0, sheetH - 1);
        const col = Math.floor(localX / (sheetW / CORE5_SHEET_COLUMNS));
        const row = Math.floor(localY / (sheetH / CORE5_SHEET_ROWS));
        this.selectedCellIndex = row * CORE5_SHEET_COLUMNS + col;
        this.render();
      });
      this.root.add(sheet);
    } else {
      const box = this.scene.add.rectangle(sheetX, sheetY, sheetW, sheetH, COLORS.cardBg, 0.9).setOrigin(0, 0);
      box.setStrokeStyle(1, COLORS.cardEdge, 1);
      this.root.add(box);
      this.root.add(this.scene.add.text(GAME_WIDTH / 2, sheetY + sheetH / 2 - 18, 'sprite sheet image not loaded', {
        fontFamily: FONT,
        fontSize: '13px',
        color: '#ffbd4e',
      }).setOrigin(0.5, 0));
      this.root.add(this.scene.add.text(GAME_WIDTH / 2, sheetY + sheetH / 2 + 2, this.selectedCharacter.originalPath, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#cfc6b0',
        wordWrap: { width: sheetW - 24 },
        align: 'center',
      }).setOrigin(0.5, 0));
    }

    const g = this.scene.add.graphics();
    g.lineStyle(1, 0xf3ead2, 0.55);
    for (let col = 0; col <= CORE5_SHEET_COLUMNS; col += 1) {
      const x = sheetX + col * (sheetW / CORE5_SHEET_COLUMNS);
      g.lineBetween(x, sheetY, x, sheetY + sheetH);
    }
    for (let row = 0; row <= CORE5_SHEET_ROWS; row += 1) {
      const y = sheetY + row * (sheetH / CORE5_SHEET_ROWS);
      g.lineBetween(sheetX, y, sheetX + sheetW, y);
    }
    const selected = CORE5_SHEET_CELLS[this.selectedCellIndex];
    const sx = sheetX + (selected.column - 1) * (sheetW / CORE5_SHEET_COLUMNS);
    const sy = sheetY + (selected.row - 1) * (sheetH / CORE5_SHEET_ROWS);
    g.lineStyle(3, 0xffe58f, 0.95);
    g.strokeRect(sx, sy, sheetW / CORE5_SHEET_COLUMNS, sheetH / CORE5_SHEET_ROWS);
    this.root.add(g);

    for (const cell of CORE5_SHEET_CELLS) {
      const x = sheetX + (cell.column - 1) * (sheetW / CORE5_SHEET_COLUMNS) + 2;
      const y = sheetY + (cell.row - 1) * (sheetH / CORE5_SHEET_ROWS) + 2;
      this.root.add(this.scene.add.text(x, y, `${cell.index}:${cell.key.replace(/_/g, ' ').slice(0, 9)}`, {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: cell.index === this.selectedCellIndex ? '#fff1a8' : '#f3ead2',
      }).setOrigin(0, 0));
    }
  }

  private drawSelectedCellPreview(): void {
    const imageId = this.selectedImageId();
    const cell = CORE5_SHEET_CELLS[this.selectedCellIndex];
    const y = 404;
    this.root.add(this.scene.add.text(18, y, `selected ${cell.index}: ${cell.key}`, {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#ffe9a8',
    }).setOrigin(0, 0));
    this.root.add(this.scene.add.text(18, y + 17, cell.description, {
      fontFamily: FONT,
      fontSize: '9px',
      color: '#cfc6b0',
      wordWrap: { width: 200 },
    }).setOrigin(0, 0));

    const hasImage = this.scene.textures.exists(imageId);
    const previewSize = CORE5_LOGICAL_CELL_SIZE * this.zoom;
    const previewX = 280;
    const previewY = 430;
    const previewBg = this.scene.add.rectangle(previewX, previewY, Math.min(previewSize, 220), Math.min(previewSize, 220), COLORS.cardBg, 0.8);
    previewBg.setStrokeStyle(1, COLORS.cardEdge, 1);
    previewBg.setInteractive({ useHandCursor: true });
    previewBg.on('pointerdown', () => {
      this.zoom = this.zoom === 4 ? 8 : 4;
      this.render();
    });
    this.root.add(previewBg);

    if (hasImage) {
      const source = this.scene.textures.get(imageId).getSourceImage() as { width: number; height: number };
      const cellW = source.width / CORE5_SHEET_COLUMNS;
      const cellH = source.height / CORE5_SHEET_ROWS;
      const image = this.scene.add.image(previewX, previewY, imageId)
        .setCrop((cell.column - 1) * cellW, (cell.row - 1) * cellH, cellW, cellH)
        .setDisplaySize(previewSize, previewSize);
      this.root.add(image);
    } else {
      this.root.add(this.scene.add.text(previewX, previewY - 10, 'no image', {
        fontFamily: FONT,
        fontSize: '12px',
        color: '#ffbd4e',
      }).setOrigin(0.5, 0));
    }

    this.root.add(this.scene.add.text(previewX, previewY + Math.min(previewSize, 220) / 2 + 10, `${this.zoom}x preview（tap to toggle）`, {
      fontFamily: FONT,
      fontSize: '9px',
      color: '#9db7df',
    }).setOrigin(0.5, 0));
  }

  private drawFooterNotes(): void {
    this.root.add(
      this.scene.add.text(18, GAME_HEIGHT - 98, [
        'Flow: generated sheet → normalizer overlay → debug gallery → Aseprite補正 → promotion別工程',
        '表示は original/normalized のうち読み込めた方を使用。player production sprite は差し替えない。',
        'URL: ?debug=core5sprites&protoCharacter=yui|asa|nagi|michiru|tomori',
      ], {
        fontFamily: FONT,
        fontSize: '9px',
        color: '#cfc6b0',
        lineSpacing: 3,
        wordWrap: { width: GAME_WIDTH - 36 },
      }).setOrigin(0, 0),
    );
  }

  private selectedImageId(): string {
    if (this.scene.textures.exists(this.selectedCharacter.normalizedImageId)) return this.selectedCharacter.normalizedImageId;
    return this.selectedCharacter.imageId;
  }
}
