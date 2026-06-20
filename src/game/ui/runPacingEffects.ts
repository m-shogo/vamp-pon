import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { GAME_HEIGHT, GAME_STATUS, GAME_WIDTH } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI } from './storybookUi';

export const ELITE_WARNING_STARTS = [150, 300, 420] as const;
export const ELITE_WARNING_LEAD_SEC = 2.5;
export const FINAL_COUNTDOWN_SEC = 10;

export function finalCountdownValue(elapsedSec: number, durationSec: number): number | null {
  const remaining = Math.ceil(durationSec - elapsedSec);
  if (remaining <= 0 || remaining > FINAL_COUNTDOWN_SEC) return null;
  return remaining;
}

export class RunPacingEffects {
  private finalTint: Phaser.GameObjects.Rectangle;
  private countdownText: Phaser.GameObjects.Text;
  private firedEliteWarnings = new Set<number>();
  private lastCountdownValue: number | null = null;

  constructor(private scene: Phaser.Scene) {
    this.finalTint = scene.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x160f27,
      0,
    ).setDepth(VIEW_DEPTH.hud - 2).setVisible(false);

    this.countdownText = scene.add.text(GAME_WIDTH / 2, 92, '', {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '24px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      stroke: '#080b18',
      strokeThickness: 4,
      resolution: 2,
      align: 'center',
    }).setOrigin(0.5).setDepth(VIEW_DEPTH.hud + 4).setVisible(false);
  }

  update(state: RuntimeState): void {
    if (state.status !== GAME_STATUS.PLAYING) {
      this.finalTint.setVisible(false).setAlpha(0);
      this.countdownText.setVisible(false);
      this.lastCountdownValue = null;
      return;
    }

    this.updateEliteWarnings(state.elapsedSec);
    this.updateFinalCountdown(state.elapsedSec, state.durationSec);
  }

  private updateEliteWarnings(elapsedSec: number): void {
    ELITE_WARNING_STARTS.forEach((start, index) => {
      if (this.firedEliteWarnings.has(start)) return;
      if (elapsedSec < start - ELITE_WARNING_LEAD_SEC) return;
      if (elapsedSec >= start) return;
      this.firedEliteWarnings.add(start);
      this.showEliteWarning(index + 1);
    });
  }

  private showEliteWarning(sequence: number): void {
    const depth = VIEW_DEPTH.overlay - 18;
    const banner = this.scene.add.rectangle(
      GAME_WIDTH / 2,
      154,
      GAME_WIDTH - 38,
      54,
      0x100b1d,
      0.84,
    ).setDepth(depth).setAlpha(0);
    banner.setStrokeStyle(2, 0x9a6f9f, 0.9);

    const title = this.scene.add.text(GAME_WIDTH / 2, 146, '黒ラベルの影', {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '18px',
      color: '#f2d8ee',
      fontStyle: 'bold',
      stroke: '#080612',
      strokeThickness: 4,
      resolution: 2,
    }).setOrigin(0.5).setDepth(depth + 1).setAlpha(0);

    const sub = this.scene.add.text(GAME_WIDTH / 2, 169, `第${sequence}の強敵が近い`, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: '#c7b8cf',
      fontStyle: 'bold',
      stroke: '#080612',
      strokeThickness: 2,
      resolution: 2,
    }).setOrigin(0.5).setDepth(depth + 1).setAlpha(0);

    this.scene.cameras.main.shake(120, 0.0025);
    this.scene.tweens.add({
      targets: [banner, title, sub],
      alpha: 1,
      duration: 150,
      ease: 'Quad.easeOut',
      yoyo: true,
      hold: 920,
      onComplete: () => {
        banner.destroy();
        title.destroy();
        sub.destroy();
      },
    });
  }

  private updateFinalCountdown(elapsedSec: number, durationSec: number): void {
    const value = finalCountdownValue(elapsedSec, durationSec);
    if (value === null) {
      this.finalTint.setVisible(false).setAlpha(0);
      this.countdownText.setVisible(false);
      this.lastCountdownValue = null;
      return;
    }

    const pulse = 0.055 + (Math.sin(this.scene.time.now * 0.012) + 1) * 0.0275;
    this.finalTint.setVisible(true).setAlpha(pulse);
    this.countdownText.setVisible(true).setText(String(value));

    if (this.lastCountdownValue !== value) {
      this.lastCountdownValue = value;
      this.countdownText.setScale(1.22).setAlpha(1);
      this.scene.tweens.add({
        targets: this.countdownText,
        scale: 1,
        duration: 210,
        ease: 'Back.easeOut',
      });
      if (value <= 3) this.scene.cameras.main.shake(70, 0.0018);
    }
  }

  playClearTransition(onComplete: () => void): void {
    this.finalTint.setVisible(false).setAlpha(0);
    this.countdownText.setVisible(false);

    const depth = VIEW_DEPTH.overlay + 10;
    const wash = this.scene.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0xf4d7a2,
      0,
    ).setDepth(depth).setInteractive();

    const glow = this.scene.add.circle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 52,
      34,
      0xffefbd,
      0.2,
    ).setDepth(depth + 1).setScale(0.3);

    const title = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 54, '朝が来た', {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '30px',
      color: '#4b3b45',
      fontStyle: 'bold',
      stroke: '#fff0c9',
      strokeThickness: 5,
      resolution: 2,
    }).setOrigin(0.5).setDepth(depth + 2).setAlpha(0);

    const scraps = Array.from({ length: 8 }, (_, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const scrap = this.scene.add.rectangle(
        GAME_WIDTH / 2 + side * (28 + (index % 4) * 18),
        GAME_HEIGHT / 2 + 80 + (index % 3) * 8,
        10 + (index % 3) * 3,
        7,
        index % 2 === 0 ? 0xe7d4b1 : 0xb9aac8,
        0.8,
      ).setDepth(depth + 2).setAngle(side * (8 + index * 3));
      return scrap;
    });

    this.scene.cameras.main.flash(520, 255, 239, 194, false);
    this.scene.tweens.add({
      targets: wash,
      alpha: 0.88,
      duration: 720,
      ease: 'Quad.easeInOut',
    });
    this.scene.tweens.add({
      targets: glow,
      scale: 6.5,
      alpha: 0.08,
      duration: 920,
      ease: 'Cubic.easeOut',
    });
    this.scene.tweens.add({
      targets: title,
      alpha: 1,
      y: title.y - 12,
      duration: 500,
      ease: 'Quad.easeOut',
    });
    scraps.forEach((scrap, index) => {
      this.scene.tweens.add({
        targets: scrap,
        y: scrap.y - 90 - index * 4,
        x: scrap.x + (index % 2 === 0 ? -18 : 18),
        alpha: 0,
        duration: 780 + index * 24,
        ease: 'Quad.easeOut',
      });
    });

    this.scene.time.delayedCall(1050, () => {
      wash.destroy();
      glow.destroy();
      title.destroy();
      scraps.forEach((scrap) => scrap.destroy());
      onComplete();
    });
  }

  destroy(): void {
    this.finalTint.destroy();
    this.countdownText.destroy();
  }
}
