import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { PLAYER_FACING_COPY } from '../data/playerFacingCopy';
import { APP_PREFERENCES, type AppPreferences } from '../persistence/appPreferences';
import { getAudioManager } from '../audio/AudioManager';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI } from '../ui/storybookUi';
import { attachPressFeedback } from '../ui/pressFeedback';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create(): void {
    getAudioManager(this).unlockOnFirstInput();
    this.render();
  }

  private render(): void {
    this.children.removeAll(true);
    const preferences = APP_PREFERENCES.get();
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, STORYBOOK_UI.deepNight);
    this.add.rectangle(GAME_WIDTH / 2, 404, 350, 720, STORYBOOK_UI.paperLight, 0.98)
      .setStrokeStyle(2, STORYBOOK_UI.gold, 0.5);
    this.label(GAME_WIDTH / 2, 76, PLAYER_FACING_COPY.navigation.settings, 28, STORYBOOK_UI.textDark, true);
    this.label(GAME_WIDTH / 2, 108, '今の体験を、端末に合わせる', 12, STORYBOOK_UI.textSoft);
    this.label(52, 160, '音', 16, STORYBOOK_UI.textDark, true).setOrigin(0, 0.5);
    this.rangeRow(214, 'BGM', preferences.bgmVolume, (value) => this.updateVolume('bgmVolume', value));
    this.rangeRow(304, 'SE', preferences.seVolume, (value) => this.updateVolume('seVolume', value));
    this.label(52, 382, '操作・演出', 16, STORYBOOK_UI.textDark, true).setOrigin(0, 0.5);
    this.toggleRow(444, '振動', preferences.hapticsEnabled, () => {
      APP_PREFERENCES.update({ hapticsEnabled: !preferences.hapticsEnabled });
      this.render();
    });
    this.toggleRow(534, '演出を控えめに', preferences.reducedMotion, () => {
      APP_PREFERENCES.update({ reducedMotion: !preferences.reducedMotion });
      this.render();
    });
    this.label(GAME_WIDTH / 2, 606, '音や振動を切っても、重要な状態は画面に残ります。', 11, STORYBOOK_UI.textSoft);
    this.button(GAME_WIDTH / 2, 718, 240, 52, '戻る', () => this.scene.start('TopScene'));
  }

  private updateVolume(id: 'bgmVolume' | 'seVolume', value: number): void {
    APP_PREFERENCES.update({ [id]: value });
    const audio = getAudioManager(this);
    if (id === 'bgmVolume') audio.setBgmVolume(value);
    else {
      audio.setSeVolume(value);
      audio.playSe('ui_select', { volume: 0.6 });
    }
    this.render();
  }

  private rangeRow(y: number, label: string, value: number, onChange: (value: number) => void): void {
    this.label(58, y - 24, label, 15, STORYBOOK_UI.textDark, true).setOrigin(0, 0.5);
    this.label(320, y - 24, `${Math.round(value * 100)}%`, 13, STORYBOOK_UI.textDark, true);
    const left = 76;
    const width = 238;
    const track = this.add.rectangle(left + width / 2, y + 14, width, 12, STORYBOOK_UI.paperDark, 0.22)
      .setStrokeStyle(1, STORYBOOK_UI.paperDark, 0.45)
      .setInteractive({ useHandCursor: true });
    this.add.rectangle(left + (width * value) / 2, y + 14, width * value, 10, STORYBOOK_UI.warmAmber, 0.9);
    this.add.circle(left + width * value, y + 14, 13, STORYBOOK_UI.lanternCore)
      .setStrokeStyle(2, STORYBOOK_UI.paperDark, 0.7);
    const apply = (pointer: Phaser.Input.Pointer): void => {
      const next = Math.round(Math.max(0, Math.min(1, (pointer.x - left) / width)) * 20) / 20;
      onChange(next);
    };
    track.on(Phaser.Input.Events.POINTER_DOWN, apply);
    track.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) apply(pointer);
    });
  }

  private toggleRow(y: number, label: string, enabled: boolean, onToggle: () => void): void {
    this.label(58, y, label, 15, STORYBOOK_UI.textDark, true).setOrigin(0, 0.5);
    const button = this.add.rectangle(280, y, 88, 48, enabled ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.paperDark, enabled ? 0.92 : 0.28)
      .setStrokeStyle(2, STORYBOOK_UI.paperDark, 0.6)
      .setInteractive({ useHandCursor: true });
    this.label(280, y, enabled ? 'ON' : 'OFF', 14, enabled ? STORYBOOK_UI.inkBlack : STORYBOOK_UI.textDark, true);
    button.on(Phaser.Input.Events.POINTER_UP, onToggle);
    attachPressFeedback(this, button, button, { width: 88, height: 48, x: 280, y });
  }

  private button(x: number, y: number, width: number, height: number, text: string, action: () => void): Phaser.GameObjects.Rectangle {
    const button = this.add.rectangle(x, y, width, height, STORYBOOK_UI.warmAmber, 0.95)
      .setStrokeStyle(2, STORYBOOK_UI.paperDark, 0.7)
      .setInteractive({ useHandCursor: true });
    this.label(x, y, text, 16, STORYBOOK_UI.inkBlack, true);
    button.on(Phaser.Input.Events.POINTER_UP, action);
    attachPressFeedback(this, button, button, { width, height, x, y, strong: true });
    return button;
  }

  private label(x: number, y: number, value: string, size: number, color: string | number, bold = false): Phaser.GameObjects.Text {
    return this.add.text(x, y, value, {
      fontFamily: bold ? STORYBOOK_TITLE_FONT : STORYBOOK_FONT,
      fontSize: `${size}px`,
      color: typeof color === 'number' ? `#${color.toString(16).padStart(6, '0')}` : color,
      fontStyle: bold ? 'bold' : 'normal',
      align: 'center',
      wordWrap: { width: 300 },
      resolution: 2,
    }).setOrigin(0.5);
  }
}
