import Phaser from 'phaser';
import { GAME_WIDTH } from '../domain/constants';
import { STORYBOOK_FONT } from './storybookUi';

const HINT_DEPTH = 180;
const HINT_DURATION_MS = 3200;
const FADE_IN_MS = 240;
const FADE_OUT_MS = 400;

export class MicroHintDisplay {
  private current: Phaser.GameObjects.Container | null = null;
  private timer: Phaser.Time.TimerEvent | null = null;

  constructor(private scene: Phaser.Scene) {}

  show(message: string, y = 130): void {
    this.dismiss();
    const root = this.scene.add.container(GAME_WIDTH / 2, y).setDepth(HINT_DEPTH).setAlpha(0);

    const text = this.scene.add.text(0, 0, message, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: '#f7edcf',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      lineSpacing: 3,
      padding: { left: 12, right: 12, top: 6, bottom: 6 },
    }).setOrigin(0.5);
    text.setStroke('#1a1638', 3);

    const bg = this.scene.add.rectangle(0, 0, text.width + 24, text.height + 12, 0x1a1638, 0.82);
    bg.setStrokeStyle(1, 0xf5d58a, 0.5);

    root.add([bg, text]);
    this.current = root;

    this.scene.tweens.add({
      targets: root,
      alpha: 1,
      y: y - 4,
      duration: FADE_IN_MS,
      ease: 'Quad.easeOut',
    });

    this.timer = this.scene.time.delayedCall(HINT_DURATION_MS, () => {
      this.timer = null;
      if (this.current !== root) return;
      this.scene.tweens.add({
        targets: root,
        alpha: 0,
        duration: FADE_OUT_MS,
        ease: 'Quad.easeIn',
        onComplete: () => {
          root.destroy(true);
          if (this.current === root) this.current = null;
        },
      });
    });
  }

  dismiss(): void {
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }
    if (this.current) {
      this.scene.tweens.killTweensOf(this.current);
      this.current.destroy(true);
      this.current = null;
    }
  }

  destroy(): void {
    this.dismiss();
  }
}
