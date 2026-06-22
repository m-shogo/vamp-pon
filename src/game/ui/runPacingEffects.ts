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
  private finalPushShown = false;
  private lastStandShown = false;
  private stageNumber = 1;

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
      resolution: 2,
      align: 'center',
    }).setOrigin(0.5).setDepth(VIEW_DEPTH.hud + 4).setVisible(false);
  }

  setStage(stageNumber: number): void {
    this.stageNumber = stageNumber;
  }

  update(state: RuntimeState): void {
    if (state.status !== GAME_STATUS.PLAYING) {
      this.finalTint.setVisible(false).setAlpha(0);
      this.countdownText.setVisible(false);
      this.lastCountdownValue = null;
      return;
    }

    this.updateEliteWarnings(state.elapsedSec);
    this.updateLastStand(state.elapsedSec, state.durationSec);
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

    const warningTitle = this.stageNumber === 2 ? '雨影の気配' : '黒ラベルの影';
    const title = this.scene.add.text(GAME_WIDTH / 2, 146, warningTitle, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '18px',
      color: '#f2d8ee',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(depth + 1).setAlpha(0);

    const sub = this.scene.add.text(GAME_WIDTH / 2, 169, `第${sequence}の強敵が近い`, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: '#c7b8cf',
      fontStyle: 'bold',
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

  private updateLastStand(elapsedSec: number, durationSec: number): void {
    if (this.lastStandShown) return;
    const remaining = durationSec - elapsedSec;
    if (remaining > 30 || remaining <= FINAL_COUNTDOWN_SEC) return;
    this.lastStandShown = true;
    this.showLastStandBanner();
  }

  private showLastStandBanner(): void {
    const depth = VIEW_DEPTH.hud + 5;
    const cx = GAME_WIDTH / 2;

    const scraps: Phaser.GameObjects.Rectangle[] = [];
    for (let i = 0; i < 8; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (GAME_WIDTH / 2 + 20 + (i % 3) * 10);
      const y = 80 + (i % 4) * 160;
      const size = 6 + (i % 3) * 3;
      const scrap = this.scene.add.rectangle(cx + x, y, size, size * 0.6, 0x1a1428, 0.7)
        .setDepth(depth - 1).setAlpha(0).setAngle(side * (10 + i * 8));
      scraps.push(scrap);
      this.scene.tweens.add({
        targets: scrap,
        alpha: 0.6,
        x: cx + x * 0.3,
        angle: scrap.angle + side * 40,
        duration: 600 + i * 40,
        delay: i * 30,
        ease: 'Quad.easeOut',
      });
      this.scene.tweens.add({
        targets: scrap,
        alpha: 0,
        duration: 400,
        delay: 800 + i * 30,
        ease: 'Quad.easeIn',
        onComplete: () => scrap.destroy(),
      });
    }

    const lastStandLabel = this.stageNumber === 2 ? '雨が強まる' : '影が集まる';
    const banner = this.scene.add.text(cx, 148, lastStandLabel, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '18px',
      color: '#c4b8d8',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0816',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(depth).setAlpha(0);

    this.scene.cameras.main.shake(80, 0.0015);
    this.scene.tweens.add({
      targets: banner, alpha: 1, duration: 220, ease: 'Quad.easeOut',
      yoyo: true, hold: 700,
      onComplete: () => banner.destroy(),
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
      if (value === FINAL_COUNTDOWN_SEC && !this.finalPushShown) {
        this.finalPushShown = true;
        this.showFinalPushBanner();
      }
    }
  }

  private showFinalPushBanner(): void {
    const depth = VIEW_DEPTH.hud + 5;
    const finalLabel = this.stageNumber === 2 ? '雨が止む前に' : '夜明け前の闇';
    const banner = this.scene.add.text(GAME_WIDTH / 2, 128, finalLabel, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '20px',
      color: '#d4c8e6',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0816',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(depth).setAlpha(0);
    this.scene.cameras.main.shake(100, 0.002);
    this.scene.tweens.add({
      targets: banner, alpha: 1, duration: 200, ease: 'Quad.easeOut',
      yoyo: true, hold: 800,
      onComplete: () => banner.destroy(),
    });
  }

  playClearTransition(onComplete: () => void): void {
    this.finalTint.setVisible(false).setAlpha(0);
    this.countdownText.setVisible(false);

    const depth = VIEW_DEPTH.overlay + 10;
    const cx = GAME_WIDTH / 2;
    const sunCenterY = GAME_HEIGHT - 96; // 画面下から昇る太陽の最終位置（やや下寄り）
    const trash: Array<Phaser.GameObjects.GameObject> = [];

    // 1) 夜色→朝色の wash。完全白飛びさせず、薄桃・金色・白橙を重ねる。
    const nightFade = this.scene.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1d1a34, 0)
      .setDepth(depth).setInteractive();
    trash.push(nightFade);
    const warmWash = this.scene.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xfbd9a5, 0)
      .setDepth(depth + 1);
    trash.push(warmWash);
    const peachWash = this.scene.add.rectangle(cx, GAME_HEIGHT / 2 - 40, GAME_WIDTH, GAME_HEIGHT * 0.7, 0xffc7a8, 0)
      .setDepth(depth + 2);
    trash.push(peachWash);

    // 2) 遠景の山シルエット（簡易ポリゴン）。明るい朝色の手前に紫の山。
    const mountain = this.scene.add.graphics().setDepth(depth + 3).setAlpha(0);
    mountain.fillStyle(0x4a3b6a, 0.92);
    mountain.beginPath();
    mountain.moveTo(0, GAME_HEIGHT);
    mountain.lineTo(0, GAME_HEIGHT - 110);
    mountain.lineTo(GAME_WIDTH * 0.18, GAME_HEIGHT - 170);
    mountain.lineTo(GAME_WIDTH * 0.32, GAME_HEIGHT - 130);
    mountain.lineTo(GAME_WIDTH * 0.5, GAME_HEIGHT - 220); // 主峰（富士山っぽい）
    mountain.lineTo(GAME_WIDTH * 0.68, GAME_HEIGHT - 130);
    mountain.lineTo(GAME_WIDTH * 0.82, GAME_HEIGHT - 175);
    mountain.lineTo(GAME_WIDTH, GAME_HEIGHT - 120);
    mountain.lineTo(GAME_WIDTH, GAME_HEIGHT);
    mountain.closePath();
    mountain.fillPath();
    // 主峰の雪冠
    mountain.fillStyle(0xf3eadb, 0.85);
    mountain.beginPath();
    mountain.moveTo(GAME_WIDTH * 0.43, GAME_HEIGHT - 175);
    mountain.lineTo(GAME_WIDTH * 0.5, GAME_HEIGHT - 220);
    mountain.lineTo(GAME_WIDTH * 0.57, GAME_HEIGHT - 175);
    mountain.lineTo(GAME_WIDTH * 0.53, GAME_HEIGHT - 188);
    mountain.lineTo(GAME_WIDTH * 0.5, GAME_HEIGHT - 200);
    mountain.lineTo(GAME_WIDTH * 0.47, GAME_HEIGHT - 188);
    mountain.closePath();
    mountain.fillPath();
    trash.push(mountain);

    // 3) 放射状の朝日レイ（細長い矩形を山頂中心から12方向）
    const rayCount = 12;
    const rays: Phaser.GameObjects.Rectangle[] = [];
    for (let i = 0; i < rayCount; i += 1) {
      const angleDeg = -180 + (180 / rayCount) * (i + 0.5); // 上半分のみ
      const ray = this.scene.add.rectangle(cx, sunCenterY, 4, 0, 0xfff1c8, 0.55)
        .setOrigin(0.5, 1)
        .setAngle(angleDeg)
        .setDepth(depth + 4)
        .setAlpha(0);
      rays.push(ray);
      trash.push(ray);
    }

    // 4) 太陽本体（下から昇る）。中心と外側の二重円で柔らかさを出す。
    const sunHalo = this.scene.add.circle(cx, GAME_HEIGHT + 120, 180, 0xffe1a8, 0.18)
      .setDepth(depth + 5);
    trash.push(sunHalo);
    const sun = this.scene.add.circle(cx, GAME_HEIGHT + 80, 56, 0xfff3c2, 0.96)
      .setDepth(depth + 6);
    trash.push(sun);

    // 5) 紙片/記憶片が上方向へ舞う（10枚、左右にばらつき、ゆっくり上昇）
    const scraps = Array.from({ length: 10 }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const startX = cx + side * (24 + (i % 5) * 30) + (Math.random() - 0.5) * 18;
      const startY = GAME_HEIGHT - 40 + (i % 3) * 16;
      const color = [0xfff1c8, 0xffd9b0, 0xb9aac8, 0xffe7d2][i % 4];
      const scrap = this.scene.add.rectangle(
        startX,
        startY,
        9 + (i % 3) * 4,
        6 + (i % 2) * 3,
        color,
        0.92,
      ).setDepth(depth + 7).setAngle(side * (6 + i * 4));
      trash.push(scrap);
      return scrap;
    });

    // 6) 「朝が来た」タイトル — もとより大きく、少し長く出す
    const title = this.scene.add.text(cx, GAME_HEIGHT / 2 - 70, '朝が来た', {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '44px',
      color: '#3a2840',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(depth + 8).setAlpha(0).setScale(0.85);
    trash.push(title);

    // === Tween 進行 ===
    // 控えめなフラッシュ
    this.scene.cameras.main.flash(360, 255, 240, 210, false);

    // 夜の暗膜を薄める（残像として薄く）
    this.scene.tweens.add({ targets: nightFade, alpha: 0.35, duration: 280, ease: 'Quad.easeOut' });
    // 暖色ウォッシュが入る
    this.scene.tweens.add({ targets: warmWash, alpha: 0.85, duration: 720, ease: 'Quad.easeInOut' });
    this.scene.tweens.add({ targets: peachWash, alpha: 0.55, duration: 820, delay: 80, ease: 'Quad.easeInOut' });
    // 山シルエットが浮かぶ
    this.scene.tweens.add({ targets: mountain, alpha: 1, duration: 520, delay: 200, ease: 'Quad.easeOut' });

    // 太陽が下から昇る（halo→本体の順）
    this.scene.tweens.add({
      targets: sunHalo,
      y: sunCenterY,
      scale: 1.35,
      alpha: 0.45,
      duration: 1100,
      ease: 'Cubic.easeOut',
    });
    this.scene.tweens.add({
      targets: sun,
      y: sunCenterY,
      scale: 1.2,
      duration: 1100,
      ease: 'Cubic.easeOut',
      delay: 60,
    });

    // 朝日レイが伸びる（少しずつ delay をずらして「ぱぁっ」と広がる感）
    rays.forEach((ray, i) => {
      this.scene.tweens.add({
        targets: ray,
        alpha: 0.7,
        height: 520 + (i % 3) * 30,
        duration: 720,
        delay: 360 + i * 22,
        ease: 'Quad.easeOut',
      });
      this.scene.tweens.add({
        targets: ray,
        alpha: 0.15,
        duration: 480,
        delay: 1080 + i * 16,
        ease: 'Quad.easeIn',
      });
    });

    // 紙片が上昇
    scraps.forEach((scrap, i) => {
      this.scene.tweens.add({
        targets: scrap,
        y: scrap.y - 280 - (i % 4) * 30,
        x: scrap.x + (i % 2 === 0 ? -22 : 22) + (Math.random() - 0.5) * 14,
        angle: scrap.angle + (i % 2 === 0 ? -120 : 120),
        alpha: 0,
        duration: 1100 + i * 28,
        delay: 240 + i * 30,
        ease: 'Quad.easeOut',
      });
    });

    // タイトル: フェードイン + 軽くスケール
    this.scene.tweens.add({
      targets: title,
      alpha: 1,
      scale: 1,
      y: title.y - 8,
      duration: 520,
      delay: 320,
      ease: 'Back.easeOut',
    });

    // 1.45 秒で演出を抜けて、リザルトに譲る
    this.scene.time.delayedCall(1450, () => {
      // 退場：暖色ウォッシュを少し残し、タイトルだけスッと薄まる
      this.scene.tweens.add({ targets: title, alpha: 0, duration: 220, ease: 'Quad.easeIn' });
      this.scene.time.delayedCall(220, () => {
        for (const obj of trash) obj.destroy();
        onComplete();
      });
    });
  }

  playDefeatTransition(onComplete: () => void): void {
    this.finalTint.setVisible(false).setAlpha(0);
    this.countdownText.setVisible(false);

    const depth = VIEW_DEPTH.overlay + 10;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const trash: Array<Phaser.GameObjects.GameObject> = [];

    const inkWash = this.scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x0a0812, 0)
      .setDepth(depth).setInteractive();
    trash.push(inkWash);

    const inkPool = this.scene.add.ellipse(cx, GAME_HEIGHT + 60, GAME_WIDTH * 1.4, 320, 0x07050e, 0)
      .setDepth(depth + 1);
    trash.push(inkPool);

    const scraps = Array.from({ length: 6 }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const startX = cx + side * (30 + (i % 3) * 40) + (Math.random() - 0.5) * 20;
      const startY = cy - 60 + (i % 3) * 30;
      const color = [0xb8aecb, 0x9a92b0, 0x7a7394, 0xd4cce6][i % 4];
      const scrap = this.scene.add.rectangle(startX, startY, 10 + (i % 3) * 3, 7 + (i % 2) * 2, color, 0)
        .setDepth(depth + 2).setAngle(side * (8 + i * 6));
      trash.push(scrap);
      return scrap;
    });

    const title = this.scene.add.text(cx, cy - 40, '夜に沈む', {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '36px',
      color: '#c8bfda',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(depth + 4).setAlpha(0).setScale(0.9);
    trash.push(title);

    const subtitle = this.scene.add.text(cx, cy + 8, 'けれど、持ち帰れるものがある', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '13px',
      color: '#8b82a0',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(depth + 4).setAlpha(0);
    trash.push(subtitle);

    this.scene.cameras.main.shake(200, 0.004);

    this.scene.tweens.add({ targets: inkWash, alpha: 0.7, duration: 520, ease: 'Quad.easeIn' });
    this.scene.tweens.add({
      targets: inkPool, y: GAME_HEIGHT - 80, alpha: 0.85, duration: 680, ease: 'Quad.easeOut',
    });

    scraps.forEach((scrap, i) => {
      this.scene.tweens.add({
        targets: scrap,
        alpha: 0.7,
        y: scrap.y + 80 + (i % 3) * 20,
        angle: scrap.angle + (i % 2 === 0 ? -30 : 30),
        duration: 600 + i * 40,
        delay: 100 + i * 50,
        ease: 'Quad.easeIn',
      });
      this.scene.tweens.add({
        targets: scrap,
        alpha: 0,
        duration: 300,
        delay: 700 + i * 40,
        ease: 'Quad.easeIn',
      });
    });

    this.scene.tweens.add({
      targets: title, alpha: 1, scale: 1, y: title.y - 6, duration: 420, delay: 260, ease: 'Back.easeOut',
    });
    this.scene.tweens.add({
      targets: subtitle, alpha: 0.8, duration: 380, delay: 480, ease: 'Quad.easeOut',
    });

    this.scene.time.delayedCall(1200, () => {
      this.scene.tweens.add({ targets: [title, subtitle], alpha: 0, duration: 200, ease: 'Quad.easeIn' });
      this.scene.time.delayedCall(200, () => {
        for (const obj of trash) obj.destroy();
        onComplete();
      });
    });
  }

  destroy(): void {
    this.finalTint.destroy();
    this.countdownText.destroy();
  }
}
