import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { createBackground } from '../ui/background';
import { eliteDefeatBeat } from '../ui/eliteDefeatBeat';
import { FONT } from '../ui/visualDesign';

export function isEliteDefeatBeatQaUrl(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  const params = new URLSearchParams(search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  return scene === 'elite-beat-qa';
}

export class EliteDefeatBeatQaScene extends Phaser.Scene {
  constructor() {
    super('EliteDefeatBeatQaScene');
  }

  create(): void {
    createBackground(this);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101124, 0.72);

    this.add.text(GAME_WIDTH / 2, 28, 'エリート撃破ビート QA', {
      fontFamily: FONT,
      fontSize: '18px',
      color: '#fff2c7',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    this.add.text(GAME_WIDTH / 2, 64, [
      'ゲーム時間・敵速度・ドロップは変えない',
      '短い視覚的な静寂と報酬感だけを確認',
    ], {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#cfe6f0',
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5, 0);

    this.addTrigger(195, 280, '中央', 195, 400);
    this.addTrigger(88, 390, '左上端', 18, 110);
    this.addTrigger(302, 390, '右上端', GAME_WIDTH - 18, 110);
    this.addTrigger(88, 500, '左下端', 18, GAME_HEIGHT - 80);
    this.addTrigger(302, 500, '右下端', GAME_WIDTH - 18, GAME_HEIGHT - 80);

    this.add.text(GAME_WIDTH / 2, 640, [
      '確認項目',
      '・文字が画面外へ切れない',
      '・敵や弾を長時間隠さない',
      '・演出後にオブジェクトが残らない',
      '・通常雑魚撃破には発火しない',
    ], {
      fontFamily: FONT,
      fontSize: '11px',
      color: '#e7dfcf',
      align: 'left',
      lineSpacing: 7,
    }).setOrigin(0.5, 0);

    this.add.text(GAME_WIDTH / 2, 795, '?scene=elite-beat-qa', {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#9eb3c5',
    }).setOrigin(0.5, 0);
  }

  private addTrigger(buttonX: number, buttonY: number, label: string, effectX: number, effectY: number): void {
    const button = this.add.rectangle(buttonX, buttonY, 118, 54, 0xead9a6, 1)
      .setInteractive({ useHandCursor: true });
    button.setStrokeStyle(2, 0x6b5634, 1);
    button.on('pointerdown', () => eliteDefeatBeat(this, effectX, effectY));
    this.add.text(buttonX, buttonY, label, {
      fontFamily: FONT,
      fontSize: '12px',
      color: '#352c20',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }
}
