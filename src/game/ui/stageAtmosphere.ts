import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { loadGameFeelSettings } from '../config/GameFeelConfig';

const RAIN_DEPTH = VIEW_DEPTH.background + 1;

export class StageAtmosphere {
  private container: Phaser.GameObjects.Container;
  private tweens: Phaser.Tweens.Tween[] = [];

  constructor(private scene: Phaser.Scene, stageNumber: number) {
    this.container = scene.add.container(0, 0).setDepth(RAIN_DEPTH);
    if (stageNumber === 2) this.buildStage2();
  }

  private buildStage2(): void {
    const low = loadGameFeelSettings().lowSpecMode;
    this.addRainOverlay(low);
    this.addInkStreaks(low);
    this.addReflectionDots(low);
    this.addWetTint();
  }

  private addRainOverlay(low: boolean): void {
    const count = low ? 10 : 22;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * (GAME_WIDTH + 60) - 30;
      const y = -20 - Math.random() * GAME_HEIGHT;
      const len = 18 + Math.random() * 24;
      const line = this.scene.add.rectangle(x, y, 1, len, 0x8ba8d0, 0.06 + Math.random() * 0.04)
        .setAngle(-8);
      this.container.add(line);
      const t = this.scene.tweens.add({
        targets: line,
        y: GAME_HEIGHT + 40,
        x: x - 14,
        duration: 2200 + Math.random() * 1400,
        delay: Math.random() * 2000,
        repeat: -1,
        onRepeat: () => {
          line.setPosition(Math.random() * (GAME_WIDTH + 60) - 30, -20 - Math.random() * 60);
        },
      });
      this.tweens.push(t);
    }
  }

  private addInkStreaks(low: boolean): void {
    const count = low ? 3 : 6;
    const g = this.scene.add.graphics();
    for (let i = 0; i < count; i++) {
      const x = 20 + Math.random() * (GAME_WIDTH - 40);
      const h = 80 + Math.random() * 160;
      const y = Math.random() * GAME_HEIGHT;
      g.fillStyle(0x1a1832, 0.04 + Math.random() * 0.03);
      g.fillRect(x, y, 2 + Math.random() * 2, h);
    }
    this.container.add(g);
  }

  private addReflectionDots(low: boolean): void {
    const count = low ? 3 : 7;
    for (let i = 0; i < count; i++) {
      const x = 20 + Math.random() * (GAME_WIDTH - 40);
      const y = GAME_HEIGHT * 0.6 + Math.random() * (GAME_HEIGHT * 0.35);
      const dot = this.scene.add.circle(x, y, 2 + Math.random() * 2, 0x7a9ec4, 0.05);
      this.container.add(dot);
      const t = this.scene.tweens.add({
        targets: dot,
        alpha: { from: 0.03, to: 0.09 },
        scale: { from: 0.8, to: 1.3 },
        duration: 1800 + Math.random() * 1200,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 1500,
      });
      this.tweens.push(t);
    }
  }

  private addWetTint(): void {
    const tint = this.scene.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x1a2040, 0.06,
    );
    this.container.add(tint);
  }

  destroy(): void {
    for (const t of this.tweens) t.destroy();
    this.tweens.length = 0;
    this.container.destroy(true);
  }
}
