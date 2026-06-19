import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { createBackground } from '../ui/background';
import {
  CHARACTER_CUTIN_TEXTURE,
  playCharacterCutin,
  resolveCutinVisual,
  type CharacterCutinMode,
} from '../ui/characterCutin';
import { FONT } from '../ui/visualDesign';

export function isCharacterCutinQaUrl(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  const params = new URLSearchParams(search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  return scene === 'cutin-qa';
}

export class CharacterCutinQaScene extends Phaser.Scene {
  private statusText?: Phaser.GameObjects.Text;

  constructor() {
    super('CharacterCutinQaScene');
  }

  create(): void {
    createBackground(this);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101124, 0.82);
    this.add.text(GAME_WIDTH / 2, 32, 'ユイ カットイン QA', {
      fontFamily: FONT,
      fontSize: '19px',
      color: '#fff2c7',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    this.add.text(GAME_WIDTH / 2, 72, [
      '画像未納時は既存ユイフレームへfallback',
      'production texture登録後は自動で画像版へ切替',
    ], {
      fontFamily: FONT,
      fontSize: '11px',
      color: '#cfe6f0',
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5, 0);

    this.addFallbackPreview(105, 165, '通常fallback', 0xead9a6, 0xd9b65f, '#352c20');
    this.addFallbackPreview(285, 165, '黒耀化fallback', 0x17101f, 0xcaa6d1, '#f4d9fa');

    this.addButton(195, 270, '通常必殺を再生', 'ultimate');
    this.addButton(195, 380, '黒耀化を再生', 'berserk');

    this.statusText = this.add.text(26, 492, '', {
      fontFamily: FONT,
      fontSize: '11px',
      color: '#e7dfcf',
      lineSpacing: 7,
      wordWrap: { width: 338 },
    });
    this.renderStatus();

    this.add.text(GAME_WIDTH / 2, 760, '?scene=cutin-qa', {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#9eb3c5',
    }).setOrigin(0.5, 0);
  }

  private addFallbackPreview(x: number, y: number, label: string, fill: number, stroke: number, color: string): void {
    const card = this.add.rectangle(x, y, 144, 58, fill, 0.9);
    card.setStrokeStyle(2, stroke, 0.9);
    this.add.text(x, y - 11, label, {
      fontFamily: FONT,
      fontSize: '10px',
      color,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(x, y + 9, '未納時の色分け', {
      fontFamily: FONT,
      fontSize: '9px',
      color,
    }).setOrigin(0.5);
  }

  private addButton(x: number, y: number, label: string, mode: CharacterCutinMode): void {
    const button = this.add.rectangle(x, y, 248, 64, mode === 'berserk' ? 0x38203f : 0xead9a6, 1)
      .setInteractive({ useHandCursor: true });
    button.setStrokeStyle(2, mode === 'berserk' ? 0xcaa6d1 : 0x6b5634, 1);
    button.on('pointerdown', () => {
      playCharacterCutin(this, mode);
      this.renderStatus();
    });
    this.add.text(x, y, label, {
      fontFamily: FONT,
      fontSize: '14px',
      color: mode === 'berserk' ? '#f4d9fa' : '#352c20',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private renderStatus(): void {
    const ultimate = resolveCutinVisual(this, 'ultimate');
    const berserk = resolveCutinVisual(this, 'berserk');
    this.statusText?.setText([
      '現在の解決結果',
      `通常必殺: ${formatVisual(ultimate)}`,
      `黒耀化: ${formatVisual(berserk)}`,
      '',
      `production ultimate: ${this.textures.exists(CHARACTER_CUTIN_TEXTURE.ultimate) ? 'loaded' : 'not loaded'}`,
      `production black: ${this.textures.exists(CHARACTER_CUTIN_TEXTURE.berserk) ? 'loaded' : 'not loaded'}`,
      '',
      'fallback色:',
      '・通常必殺 = 暖色紙パネル',
      '・黒耀化 = 紫黒パネル',
      '',
      '確認:',
      '・敵や弾を長時間隠さない',
      '・通常必殺と黒耀化の色と意味が混ざらない',
      '・終了後に表示物が残らない',
    ]);
  }
}

function formatVisual(visual: { textureKey: string; frame?: number } | null): string {
  if (!visual) return '図形fallback';
  return `${visual.textureKey}${visual.frame == null ? '' : ` frame ${visual.frame}`}`;
}
