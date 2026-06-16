import Phaser from 'phaser';
import { core5PrototypeCharacterById, core5PrototypeCharacters, type Core5PrototypeCharacter, type Core5PrototypeCharacterId } from '../assets/core5PrototypeCharacters';
import { GAME_HEIGHT, GAME_WIDTH, COLORS } from '../domain/constants';
import { FONT } from './visualDesign';

const REJECTED_REASON = 'current uploaded boards are visually misaligned and must not be sliced as a uniform 8x6 sprite sheet';

export class Core5SpriteSheetPreview {
  private root: Phaser.GameObjects.Container;
  private selectedCharacter: Core5PrototypeCharacter;

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
    this.drawRawReferenceBoard();
    this.drawDecisionPanel();
    this.drawFooterNotes();
  }

  private drawHeader(): void {
    this.root.add(
      this.scene.add.text(GAME_WIDTH / 2, 14, 'Core5 raw reference board review', {
        fontFamily: FONT,
        fontSize: '15px',
        color: '#f3ead2',
      }).setOrigin(0.5, 0),
    );
    this.root.add(
      this.scene.add.text(GAME_WIDTH / 2, 35, 'not a slicable sprite sheet / production sprite は未使用', {
        fontFamily: FONT,
        fontSize: '9px',
        color: '#ffbd4e',
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
        this.syncCharacterToUrl(character.id);
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

  private drawRawReferenceBoard(): void {
    const imageId = this.selectedImageId();
    const hasImage = this.scene.textures.exists(imageId);
    const x = 18;
    const y = 112;
    const w = GAME_WIDTH - 36;
    const h = 280;

    this.root.add(this.scene.add.text(18, 98, `${this.selectedCharacter.name}: ${this.selectedCharacter.role} / ${this.selectedCharacter.motif}`, {
      fontFamily: FONT,
      fontSize: '9px',
      color: '#cfe6f0',
    }).setOrigin(0, 0));

    const box = this.scene.add.rectangle(x, y, w, h, COLORS.cardBg, 0.86).setOrigin(0, 0);
    box.setStrokeStyle(1, COLORS.cardEdge, 1);
    this.root.add(box);

    if (!hasImage) {
      this.root.add(this.scene.add.text(GAME_WIDTH / 2, y + h / 2 - 18, 'reference board image not loaded', {
        fontFamily: FONT,
        fontSize: '13px',
        color: '#ffbd4e',
      }).setOrigin(0.5, 0));
      this.root.add(this.scene.add.text(GAME_WIDTH / 2, y + h / 2 + 4, this.selectedCharacter.originalPath, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#cfc6b0',
        wordWrap: { width: w - 24 },
        align: 'center',
      }).setOrigin(0.5, 0));
      return;
    }

    const source = this.sourceSize(imageId);
    const fit = Math.min((w - 16) / source.width, (h - 16) / source.height);
    const displayW = Math.max(1, Math.round(source.width * fit));
    const displayH = Math.max(1, Math.round(source.height * fit));
    const image = this.scene.add.image(x + w / 2, y + h / 2, imageId).setDisplaySize(displayW, displayH);
    this.root.add(image);

    this.root.add(this.scene.add.text(18, y + h + 5, `source ${source.width}x${source.height} / raw-board only / no crop export`, {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#9db7df',
    }).setOrigin(0, 0));
  }

  private drawDecisionPanel(): void {
    const y = 420;
    const panel = this.scene.add.rectangle(18, y, GAME_WIDTH - 36, 166, COLORS.cardBg, 0.88).setOrigin(0, 0);
    panel.setStrokeStyle(1, 0xffbd4e, 0.85);
    this.root.add(panel);

    this.root.add(this.scene.add.text(30, y + 14, 'Decision: reject as sprite sheet', {
      fontFamily: FONT,
      fontSize: '15px',
      color: '#ffbd4e',
    }).setOrigin(0, 0));

    this.root.add(this.scene.add.text(30, y + 39, [
      `Reason: ${REJECTED_REASON}.`,
      'Do not tune ox/oy. Do not normalize this board into production frames.',
      'Use these files only as character design reference.',
      'Next asset must be regenerated/exported as exact 8 columns × 6 rows with uniform cells.',
    ], {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#f3ead2',
      lineSpacing: 5,
      wordWrap: { width: GAME_WIDTH - 60 },
    }).setOrigin(0, 0));

    this.root.add(this.scene.add.text(30, y + 129, 'Recommended target: 74px source cell, 592×444 PNG, transparent gutters, no labels/text.', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#ffe9a8',
      wordWrap: { width: GAME_WIDTH - 60 },
    }).setOrigin(0, 0));
  }

  private drawFooterNotes(): void {
    this.root.add(
      this.scene.add.text(18, GAME_HEIGHT - 92, [
        'Flow: current board → reference only → regenerate exact 8x6 sheet → Aseprite crop review → promotion別工程',
        'URL: ?debug=core5sprites&protoCharacter=yui|asa|nagi|michiru|tomori',
        'player production sprite / gameplay constants は差し替えない。',
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

  private sourceSize(imageId: string): { width: number; height: number } {
    return this.scene.textures.get(imageId).getSourceImage() as { width: number; height: number };
  }

  private syncCharacterToUrl(id: Core5PrototypeCharacterId): void {
    const params = new URLSearchParams(window.location.search);
    params.set('debug', 'core5sprites');
    params.set('protoCharacter', id);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }
}
