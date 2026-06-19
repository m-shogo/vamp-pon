import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { createBackground } from '../ui/background';
import { FONT } from '../ui/visualDesign';
import {
  resolveYuiVisualFrame,
  type YuiVisualFrameState,
} from '../ui/playerVisual';
import {
  YUI_EXPRESSION_RAGE_SHEET,
} from '../assets/yuiExpressionRageSheet';
import {
  YUI_EXPRESSION_RAGE_48_KEYS,
  yui96Cells,
  yuiEquipmentQaNote,
} from '../assets/yui96QaCatalog';

const EXTRA_CELLS = yui96Cells(YUI_EXPRESSION_RAGE_48_KEYS);
const STEP_MS = 850;

const BASE_STATE: YuiVisualFrameState = {
  facing: 'front',
  moving: false,
  walkFrame: 0,
  hurt: false,
  ultimate: false,
  berserkCharge: 0,
  berserkMaxCharge: 100,
  berserkReady: false,
  berserkDurationSec: 8,
  berserkActiveRemaining: 0,
  berserkFatigueRemaining: 0,
};

const STEPS: Array<{ label: string; state: YuiVisualFrameState }> = [
  { label: '通常待機', state: { ...BASE_STATE } },
  { label: '黒耀充填 25%', state: { ...BASE_STATE, berserkCharge: 25 } },
  { label: '黒耀充填 50%', state: { ...BASE_STATE, berserkCharge: 50 } },
  { label: '黒耀充填 75%', state: { ...BASE_STATE, berserkCharge: 75 } },
  { label: '黒耀化可能・震え', state: { ...BASE_STATE, berserkCharge: 100, berserkReady: true } },
  { label: '黒灯化・うずくまり', state: { ...BASE_STATE, berserkActiveRemaining: 7.9 } },
  { label: '黒灯化ピーク', state: { ...BASE_STATE, berserkActiveRemaining: 7.7 } },
  { label: '黒灯待機 A', state: { ...BASE_STATE, berserkActiveRemaining: 6.8, walkFrame: 0 } },
  { label: '黒灯待機 B', state: { ...BASE_STATE, berserkActiveRemaining: 6.1, walkFrame: 1 } },
  { label: '黒灯・前移動 A', state: { ...BASE_STATE, moving: true, walkFrame: 0, berserkActiveRemaining: 5.5 } },
  { label: '黒灯・前移動 B', state: { ...BASE_STATE, moving: true, walkFrame: 1, berserkActiveRemaining: 5 } },
  { label: '黒灯・左移動', state: { ...BASE_STATE, facing: 'left', moving: true, walkFrame: 0, berserkActiveRemaining: 4.5 } },
  { label: '黒灯・右移動', state: { ...BASE_STATE, facing: 'right', moving: true, walkFrame: 1, berserkActiveRemaining: 4 } },
  { label: '黒灯・背面移動', state: { ...BASE_STATE, facing: 'back', moving: true, walkFrame: 0, berserkActiveRemaining: 3.5 } },
  { label: '黒灯中の被弾', state: { ...BASE_STATE, hurt: true, berserkActiveRemaining: 2.8 } },
  { label: '黒灯崩落', state: { ...BASE_STATE, berserkActiveRemaining: 0.4 } },
  { label: '黒耀ゲージ切れ', state: { ...BASE_STATE, berserkActiveRemaining: 0.15 } },
  { label: '黒耀反動', state: { ...BASE_STATE, berserkFatigueRemaining: 0.6 } },
  { label: '通常へ復帰', state: { ...BASE_STATE } },
];

export function isYuiRageCycleQaUrl(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  const params = new URLSearchParams(search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  return scene === 'yui-rage-cycle';
}

export class YuiRageCycleQaScene extends Phaser.Scene {
  private stepIndex = 0;
  private paused = false;
  private timer?: Phaser.Time.TimerEvent;
  private sprite?: Phaser.GameObjects.Image;
  private largeSprite?: Phaser.GameObjects.Image;
  private stateText?: Phaser.GameObjects.Text;
  private frameText?: Phaser.GameObjects.Text;
  private noteText?: Phaser.GameObjects.Text;
  private pauseText?: Phaser.GameObjects.Text;

  constructor() {
    super('YuiRageCycleQaScene');
  }

  preload(): void {
    if (!this.textures.exists(YUI_EXPRESSION_RAGE_SHEET.id)) {
      this.load.spritesheet(YUI_EXPRESSION_RAGE_SHEET.id, YUI_EXPRESSION_RAGE_SHEET.path, {
        frameWidth: YUI_EXPRESSION_RAGE_SHEET.frameWidth,
        frameHeight: YUI_EXPRESSION_RAGE_SHEET.frameHeight,
        endFrame: YUI_EXPRESSION_RAGE_SHEET.endFrame,
      });
    }
  }

  create(): void {
    createBackground(this);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101124, 0.86);

    this.add.text(GAME_WIDTH / 2, 20, 'ユイ黒灯化 Runtime遷移 QA', {
      fontFamily: FONT,
      fontSize: '17px',
      color: '#fff2c7',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);
    this.add.text(GAME_WIDTH / 2, 48, 'resolveYuiVisualFrame の実際の選択結果', {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#cfe6f0',
    }).setOrigin(0.5, 0);

    this.add.rectangle(GAME_WIDTH / 2, 260, 286, 286, 0x080914, 0.28)
      .setStrokeStyle(1, 0xfff2c7, 0.18);
    this.largeSprite = this.add.image(GAME_WIDTH / 2, 260, 'yui_idle').setDisplaySize(260, 260).setAlpha(0.84);

    this.add.rectangle(74, 485, 92, 118, 0x080914, 0.58)
      .setStrokeStyle(1, 0xfff2c7, 0.24);
    this.sprite = this.add.image(74, 485, 'yui_idle').setDisplaySize(76, 76);
    this.add.text(74, 535, 'ゲーム表示 76px', {
      fontFamily: FONT,
      fontSize: '9px',
      color: '#fff2c7',
      backgroundColor: '#080914',
      padding: { left: 3, right: 3, top: 2, bottom: 2 },
    }).setOrigin(0.5, 0);

    this.stateText = this.add.text(GAME_WIDTH / 2, 405, '', {
      fontFamily: FONT,
      fontSize: '16px',
      color: '#ffe9a8',
      fontStyle: 'bold',
      backgroundColor: '#080914',
      padding: { left: 6, right: 6, top: 3, bottom: 3 },
    }).setOrigin(0.5, 0);
    this.frameText = this.add.text(128, 464, '', {
      fontFamily: FONT,
      fontSize: '11px',
      color: '#e7dfcf',
      backgroundColor: '#080914',
      padding: { left: 6, right: 6, top: 4, bottom: 4 },
      lineSpacing: 5,
    }).setOrigin(0, 0);
    this.noteText = this.add.text(24, 584, '', {
      fontFamily: FONT,
      fontSize: '11px',
      color: '#ffe9a8',
      wordWrap: { width: 342 },
      align: 'center',
      backgroundColor: '#080914',
      padding: { left: 6, right: 6, top: 5, bottom: 5 },
      lineSpacing: 6,
    }).setOrigin(0, 0);

    this.addControl(54, 742, '◀', () => this.move(-1));
    this.addControl(GAME_WIDTH - 54, 742, '▶', () => this.move(1));
    this.addControl(GAME_WIDTH / 2, 742, '停止', () => this.togglePause(), 90);
    this.pauseText = this.add.text(GAME_WIDTH / 2, 787, '', {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#d5d1c5',
    }).setOrigin(0.5, 0);

    this.input.keyboard?.on('keydown-LEFT', () => this.move(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.move(1));
    this.input.keyboard?.on('keydown-SPACE', () => this.togglePause());

    this.timer = this.time.addEvent({
      delay: STEP_MS,
      loop: true,
      callback: () => {
        if (!this.paused) this.move(1);
      },
    });
    this.renderStep();
  }

  private move(delta: number): void {
    this.stepIndex = (this.stepIndex + delta + STEPS.length) % STEPS.length;
    this.renderStep();
  }

  private togglePause(): void {
    this.paused = !this.paused;
    this.renderStep();
  }

  private renderStep(): void {
    const step = STEPS[this.stepIndex];
    const selection = resolveYuiVisualFrame(step.state);
    const textureExists = this.textures.exists(selection.textureKey);
    const textureKey = textureExists ? selection.textureKey : 'yui_idle';
    const frame = textureExists ? selection.frame : undefined;

    this.sprite?.setTexture(textureKey, frame);
    this.largeSprite?.setTexture(textureKey, frame);
    this.stateText?.setText(`${this.stepIndex + 1}/${STEPS.length}  ${step.label}`);

    const rageCell = selection.textureKey === YUI_EXPRESSION_RAGE_SHEET.id && selection.frame != null
      ? EXTRA_CELLS[selection.frame]
      : undefined;
    const frameLabel = rageCell
      ? `R${rageCell.row}C${rageCell.column}  #${rageCell.index}\n${rageCell.key}`
      : `texture: ${selection.textureKey}\nframe: ${selection.frame ?? 'individual PNG'}`;
    this.frameText?.setText(frameLabel);
    this.noteText?.setText(rageCell
      ? yuiEquipmentQaNote(rageCell)
      : '通常ユイとの顔・頭身・フード・ランタン位置の連続性を確認');
    this.pauseText?.setText(this.paused
      ? '停止中。左右キーで1段階ずつ確認 / SPACEで再開'
      : `${STEP_MS}msごとに自動再生 / SPACEで停止`);
  }

  private addControl(x: number, y: number, label: string, action: () => void, width = 58): void {
    const button = this.add.rectangle(x, y, width, 48, 0xead9a6, 1).setInteractive({ useHandCursor: true });
    button.setStrokeStyle(2, 0x6b5634, 1);
    button.on('pointerdown', action);
    this.add.text(x, y, label, {
      fontFamily: FONT,
      fontSize: label.length > 1 ? '12px' : '18px',
      color: '#352c20',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }
}
