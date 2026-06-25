import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../domain/constants';
import { BODY_FONT } from '../ui/fonts';

const SCENE_KEY = 'SpriteInspectorScene';
const URL_KEY = 'spriteinspector';

export function isSpriteInspectorUrl(): boolean {
  const p = new URLSearchParams(window.location.search);
  return p.get('scene') === URL_KEY || p.get('debug') === URL_KEY;
}

type BgMode = 'dark' | 'checker';

const COLS = 8;
const ROWS = 6;
const CELL = 180;
const SHEET_W = COLS * CELL;
const SHEET_H = ROWS * CELL;

const GRID_PAD = 6;
const GRID_TOP = 80;
const GRID_LEFT = GRID_PAD;
const FIT_W = GAME_WIDTH - GRID_PAD * 2;
const FIT_H = 420;
const SCALE = Math.min(FIT_W / SHEET_W, FIT_H / SHEET_H);

const CELL_DISPLAY = CELL * SCALE;

const ANIM_TOP = GRID_TOP + ROWS * CELL_DISPLAY + 16;
const ANIM_SIZE = 140;

type CellBbox = { x: number; y: number; w: number; h: number } | null;

export class SpriteInspectorScene extends Phaser.Scene {
  private sheetKey = '';
  private sheetPath = '';
  private bgMode: BgMode = 'dark';
  private showBbox = true;
  private showAnchor = true;
  private fps = 8;
  private playing = true;
  private selectedClipIndex = 0;
  private clips: { name: string; frames: number[] }[] = [];
  private bboxes: CellBbox[] = [];

  private gridContainer!: Phaser.GameObjects.Container;
  private uiContainer!: Phaser.GameObjects.Container;
  private animContainer!: Phaser.GameObjects.Container;
  private animSprite?: Phaser.GameObjects.Sprite;
  private fpsLabel?: Phaser.GameObjects.Text;
  private clipLabel?: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEY);
  }

  init(): void {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('sheet') ?? '';
    const character = params.get('character') ?? 'yui';

    if (file) {
      this.sheetPath = file;
      this.sheetKey = `inspector_${file.replace(/[^a-zA-Z0-9]/g, '_')}`;
    } else {
      this.sheetKey = `inspector_${character}`;
      this.sheetPath = `assets/prototypes/sprite-sheets/core5-original/${character}-sprite-sheet-v1.png`;
    }

    this.clips = [
      { name: 'idle_down', frames: [0, 1, 2, 3] },
      { name: 'walk_down', frames: [4, 5, 6, 7] },
      { name: 'idle_right', frames: [8, 9, 10, 11] },
      { name: 'walk_right', frames: [12, 13, 14, 15] },
      { name: 'idle_up', frames: [16, 17, 18, 19] },
      { name: 'walk_up', frames: [20, 21, 22, 23] },
      { name: 'attack_down', frames: [24, 25, 26, 27] },
      { name: 'attack_right', frames: [28, 29, 30, 31] },
      { name: 'attack_up', frames: [32, 33, 34, 35] },
      { name: 'row5_a', frames: [36, 37, 38, 39] },
      { name: 'special', frames: [40, 41, 42, 43, 44, 45, 46, 47] },
    ];

    this.loadMetadataClips(character);
  }

  private loadMetadataClips(character: string): void {
    try {
      const metaPath = `/data/spritesheet-metadata/${character}-sprite-sheet-v1.json`;
      fetch(metaPath)
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => {
          if (json?.clips && Array.isArray(json.clips)) {
            this.clips = json.clips.map((c: { name: string; frames: number[]; fps?: number }) => ({
              name: c.name,
              frames: c.frames,
            }));
            if (json.clips[0]?.fps) this.fps = json.clips[0].fps;
            this.rebuildClipButtons();
            this.playClip(0);
          }
        })
        .catch(() => {});
    } catch {
      // metadata optional
    }
  }

  preload(): void {
    if (!this.textures.exists(this.sheetKey)) {
      this.load.spritesheet(this.sheetKey, this.sheetPath, {
        frameWidth: CELL,
        frameHeight: CELL,
      });
    }
  }

  create(): void {
    this.gridContainer = this.add.container(0, 0);
    this.uiContainer = this.add.container(0, 0);
    this.animContainer = this.add.container(0, 0);

    this.drawBackground();
    this.drawHeader();
    this.drawGrid();
    this.computeBboxes();
    this.drawBboxOverlays();
    this.drawAnimArea();
    this.drawControls();
    this.playClip(0);
    this.setupKeys();
  }

  private drawBackground(): void {
    if (this.bgMode === 'dark') {
      this.cameras.main.setBackgroundColor(0x1d1a34);
    } else {
      this.cameras.main.setBackgroundColor(0x888888);
      for (let y = 0; y < GAME_HEIGHT; y += 16) {
        for (let x = 0; x < GAME_WIDTH; x += 16) {
          const odd = ((x / 16 + y / 16) % 2) === 0;
          this.gridContainer.add(
            this.add.rectangle(x + 8, y + 8, 16, 16, odd ? 0xaaaaaa : 0x666666).setDepth(-1),
          );
        }
      }
    }
  }

  private drawHeader(): void {
    this.uiContainer.add(
      this.add.text(GAME_WIDTH / 2, 10, 'Sprite Inspector', {
        fontFamily: BODY_FONT,
        fontSize: '14px',
        color: '#f3ead2',
      }).setOrigin(0.5, 0),
    );
    this.uiContainer.add(
      this.add.text(GAME_WIDTH / 2, 28, this.sheetPath, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#9db7df',
      }).setOrigin(0.5, 0),
    );
    this.uiContainer.add(
      this.add.text(GAME_WIDTH / 2, 40, `${COLS}x${ROWS} / ${CELL}px cells / ${COLS * ROWS} frames`, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#cfc6b0',
      }).setOrigin(0.5, 0),
    );
  }

  private drawGrid(): void {
    if (!this.textures.exists(this.sheetKey)) {
      this.uiContainer.add(
        this.add.text(GAME_WIDTH / 2, GRID_TOP + FIT_H / 2, 'Sheet not found:\n' + this.sheetPath, {
          fontFamily: BODY_FONT,
          fontSize: '12px',
          color: '#ffbd4e',
          align: 'center',
        }).setOrigin(0.5, 0.5),
      );
      return;
    }

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const frameIndex = r * COLS + c;
        const x = GRID_LEFT + c * CELL_DISPLAY + CELL_DISPLAY / 2;
        const y = GRID_TOP + r * CELL_DISPLAY + CELL_DISPLAY / 2;

        const border = this.add.rectangle(x, y, CELL_DISPLAY - 1, CELL_DISPLAY - 1);
        border.setStrokeStyle(0.5, 0x4a4570, 0.6);
        border.setFillStyle(0x000000, 0);
        this.gridContainer.add(border);

        const frame = this.add.image(x, y, this.sheetKey, frameIndex);
        frame.setDisplaySize(CELL_DISPLAY - 2, CELL_DISPLAY - 2);
        this.gridContainer.add(frame);

        const label = this.add.text(x - CELL_DISPLAY / 2 + 2, y - CELL_DISPLAY / 2 + 1, `${frameIndex}`, {
          fontFamily: 'monospace',
          fontSize: '7px',
          color: '#9db7df',
        });
        this.gridContainer.add(label);
      }
    }
  }

  private computeBboxes(): void {
    this.bboxes = [];
    if (!this.textures.exists(this.sheetKey)) {
      for (let i = 0; i < COLS * ROWS; i++) this.bboxes.push(null);
      return;
    }

    const tex = this.textures.get(this.sheetKey);
    const source = tex.getSourceImage() as HTMLImageElement | HTMLCanvasElement;

    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(source as CanvasImageSource, 0, 0);

    const cellW = source.width / COLS;
    const cellH = source.height / ROWS;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const imgData = ctx.getImageData(c * cellW, r * cellH, cellW, cellH);
        const data = imgData.data;
        let minX = cellW, minY = cellH, maxX = -1, maxY = -1;

        for (let py = 0; py < cellH; py++) {
          for (let px = 0; px < cellW; px++) {
            const alpha = data[(py * cellW + px) * 4 + 3];
            if (alpha > 0) {
              if (px < minX) minX = px;
              if (px > maxX) maxX = px;
              if (py < minY) minY = py;
              if (py > maxY) maxY = py;
            }
          }
        }

        if (maxX < 0) {
          this.bboxes.push(null);
        } else {
          this.bboxes.push({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
        }
      }
    }
  }

  private drawBboxOverlays(): void {
    if (!this.showBbox && !this.showAnchor) return;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        const bb = this.bboxes[idx];
        if (!bb) continue;

        const cellScreenX = GRID_LEFT + c * CELL_DISPLAY;
        const cellScreenY = GRID_TOP + r * CELL_DISPLAY;
        const s = CELL_DISPLAY / CELL;

        if (this.showBbox) {
          const rect = this.add.rectangle(
            cellScreenX + bb.x * s + (bb.w * s) / 2,
            cellScreenY + bb.y * s + (bb.h * s) / 2,
            bb.w * s,
            bb.h * s,
          );
          rect.setStrokeStyle(1, 0x00ff88, 0.7);
          rect.setFillStyle(0x00ff88, 0.08);
          this.gridContainer.add(rect);
        }

        if (this.showAnchor) {
          const cx = cellScreenX + (bb.x + bb.w / 2) * s;
          const cy = cellScreenY + (bb.y + bb.h) * s;
          this.gridContainer.add(this.add.circle(cx, cy, 2, 0xff4444, 0.9));
        }
      }
    }
  }

  private drawAnimArea(): void {
    const boxX = GAME_WIDTH / 2 - ANIM_SIZE / 2 - 10;
    const boxW = ANIM_SIZE + 20;
    const boxH = ANIM_SIZE + 30;

    this.animContainer.add(
      this.add.rectangle(GAME_WIDTH / 2, ANIM_TOP + boxH / 2, boxW, boxH, COLORS.cardBg, 0.12)
        .setStrokeStyle(1, COLORS.cardEdge, 0.5),
    );

    this.clipLabel = this.add.text(GAME_WIDTH / 2, ANIM_TOP + 4, '', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#ffe9a8',
    }).setOrigin(0.5, 0);
    this.animContainer.add(this.clipLabel);

    if (this.textures.exists(this.sheetKey)) {
      this.animSprite = this.add.sprite(GAME_WIDTH / 2, ANIM_TOP + 18 + ANIM_SIZE / 2, this.sheetKey, 0);
      this.animSprite.setDisplaySize(ANIM_SIZE, ANIM_SIZE);
      this.animContainer.add(this.animSprite);
    }
  }

  private drawControls(): void {
    let y = ANIM_TOP + ANIM_SIZE + 46;

    this.fpsLabel = this.add.text(GAME_WIDTH / 2, y, `FPS: ${this.fps}`, {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#f3ead2',
    }).setOrigin(0.5, 0);
    this.uiContainer.add(this.fpsLabel);

    const btnStyle = { fontFamily: BODY_FONT, fontSize: '10px', color: '#35291e', backgroundColor: '#f1d58a', padding: { x: 6, y: 3 } };

    const fpsDown = this.add.text(GAME_WIDTH / 2 - 60, y, '- fps', btnStyle).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    fpsDown.on('pointerdown', () => { this.fps = Math.max(1, this.fps - 1); this.fpsLabel!.setText(`FPS: ${this.fps}`); this.playClip(this.selectedClipIndex); });
    this.uiContainer.add(fpsDown);

    const fpsUp = this.add.text(GAME_WIDTH / 2 + 60, y, '+ fps', btnStyle).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    fpsUp.on('pointerdown', () => { this.fps = Math.min(30, this.fps + 1); this.fpsLabel!.setText(`FPS: ${this.fps}`); this.playClip(this.selectedClipIndex); });
    this.uiContainer.add(fpsUp);

    y += 22;

    const bgBtn = this.add.text(GAME_WIDTH / 2 - 70, y, 'BG切替', btnStyle).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    bgBtn.on('pointerdown', () => { this.bgMode = this.bgMode === 'dark' ? 'checker' : 'dark'; this.scene.restart(); });
    this.uiContainer.add(bgBtn);

    const bboxBtn = this.add.text(GAME_WIDTH / 2, y, `bbox: ${this.showBbox ? 'ON' : 'OFF'}`, btnStyle).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    bboxBtn.on('pointerdown', () => { this.showBbox = !this.showBbox; this.scene.restart(); });
    this.uiContainer.add(bboxBtn);

    const anchorBtn = this.add.text(GAME_WIDTH / 2 + 70, y, `anchor: ${this.showAnchor ? 'ON' : 'OFF'}`, btnStyle).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    anchorBtn.on('pointerdown', () => { this.showAnchor = !this.showAnchor; this.scene.restart(); });
    this.uiContainer.add(anchorBtn);

    y += 24;
    this.drawClipButtons(y);
  }

  private drawClipButtons(startY: number): void {
    const btnStyle = { fontFamily: 'monospace', fontSize: '8px', color: '#f3ead2', backgroundColor: '#3a3358', padding: { x: 4, y: 2 } };
    const activeStyle = { fontFamily: 'monospace', fontSize: '8px', color: '#35291e', backgroundColor: '#ffce7a', padding: { x: 4, y: 2 } };

    const perRow = 3;
    this.clips.forEach((clip, i) => {
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      const x = 30 + col * 120;
      const y = startY + row * 20;
      const style = i === this.selectedClipIndex ? activeStyle : btnStyle;
      const btn = this.add.text(x, y, clip.name, style).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => this.playClip(i));
      this.uiContainer.add(btn);
    });
  }

  private rebuildClipButtons(): void {
    // Clip buttons are rebuilt on scene restart or metadata load
  }

  private playClip(index: number): void {
    this.selectedClipIndex = index;
    const clip = this.clips[index];
    if (!clip || !this.animSprite) return;

    this.clipLabel?.setText(`${clip.name} [${clip.frames.join(',')}]`);

    const animKey = `${this.sheetKey}_clip_${index}`;
    if (!this.anims.exists(animKey)) {
      this.anims.create({
        key: animKey,
        frames: clip.frames.map((f) => ({ key: this.sheetKey, frame: f })),
        frameRate: this.fps,
        repeat: -1,
      });
    } else {
      const anim = this.anims.get(animKey);
      if (anim) anim.frameRate = this.fps;
    }

    this.animSprite.play(animKey);
  }

  private setupKeys(): void {
    const kb = this.input.keyboard;
    if (!kb) return;
    kb.on('keydown-B', () => { this.showBbox = !this.showBbox; this.scene.restart(); });
    kb.on('keydown-A', () => { this.showAnchor = !this.showAnchor; this.scene.restart(); });
    kb.on('keydown-D', () => { this.bgMode = this.bgMode === 'dark' ? 'checker' : 'dark'; this.scene.restart(); });
    kb.on('keydown-LEFT', () => { if (this.selectedClipIndex > 0) this.playClip(this.selectedClipIndex - 1); });
    kb.on('keydown-RIGHT', () => { if (this.selectedClipIndex < this.clips.length - 1) this.playClip(this.selectedClipIndex + 1); });
    kb.on('keydown-UP', () => { this.fps = Math.min(30, this.fps + 1); this.fpsLabel?.setText(`FPS: ${this.fps}`); this.playClip(this.selectedClipIndex); });
    kb.on('keydown-DOWN', () => { this.fps = Math.max(1, this.fps - 1); this.fpsLabel?.setText(`FPS: ${this.fps}`); this.playClip(this.selectedClipIndex); });
  }
}
