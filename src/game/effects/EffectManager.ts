import Phaser from 'phaser';
import { GAME_FEEL_CONFIG, loadGameFeelSettings } from '../config/GameFeelConfig';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { VIEW_DEPTH } from '../ui/factory';

type EffectOptions = {
  elite?: boolean;
  label?: string;
  strong?: boolean;
};

export class EffectManager {
  private activeParticles = 0;

  constructor(private scene: Phaser.Scene) {}

  hit(x: number, y: number, options?: EffectOptions): void {
    if (!this.canEmit(3)) return;
    const color = options?.elite ? COLORS.enemyEliteEdge : COLORS.fragmentGlow;
    for (let i = 0; i < 3; i += 1) {
      this.particle(x, y, color, 2 + i, 110 + i * 18, Math.random() * Math.PI * 2, 12 + i * 4);
    }
  }

  enemyDeath(x: number, y: number, options?: EffectOptions): void {
    if (!this.canEmit(options?.elite ? 12 : 7)) return;
    const count = this.qualityCount(options?.elite ? 12 : 7);
    for (let i = 0; i < count; i += 1) {
      const color = i % 3 === 0 ? COLORS.paperScrap : COLORS.enemyInkEdge;
      this.particle(x, y, color, i % 3 === 0 ? 2.4 : 3.4, 220 + Math.random() * 120, Math.random() * Math.PI * 2, 22 + Math.random() * 22);
    }
  }

  expCollect(x: number, y: number, targetX: number, targetY: number): void {
    if (!this.canEmit(1)) return;
    const dot = this.scene.add.circle(x, y, 3, COLORS.fragmentGlow, 0.75).setDepth(VIEW_DEPTH.pickup + 2);
    this.activeParticles += 1;
    this.scene.tweens.add({
      targets: dot,
      x: targetX,
      y: targetY,
      scale: 0.35,
      alpha: 0,
      duration: 130,
      ease: 'Quad.easeIn',
      onComplete: () => {
        dot.destroy();
        this.activeParticles = Math.max(0, this.activeParticles - 1);
      },
    });
  }

  levelUp(x: number, y: number, options?: EffectOptions): void {
    this.hitStop(GAME_FEEL_CONFIG.hitStopMs.levelUp);
    this.screenShake('levelUp');
    this.radialGlow(x, y, options?.label ?? 'Lv Up', COLORS.fragmentGlow, 34, 560);
  }

  evolution(x: number, y: number, options?: EffectOptions): void {
    this.hitStop(GAME_FEEL_CONFIG.hitStopMs.evolution);
    this.screenShake('evolution');
    this.radialGlow(x, y, options?.label ?? '進化', COLORS.lantern, 48, 760);
  }

  heal(x: number, y: number): void {
    this.radialGlow(x, y, '+HP', COLORS.healPaper, 20, 420);
  }

  playerDamage(): void {
    const flash = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xd94545, 0.16)
      .setDepth(VIEW_DEPTH.overlay - 8);
    this.scene.tweens.add({ targets: flash, alpha: 0, duration: 180, onComplete: () => flash.destroy() });
    this.screenShake('playerDamage');
  }

  screenShake(kind: keyof typeof GAME_FEEL_CONFIG.screenShakeIntensity): void {
    if (!loadGameFeelSettings().screenShake) return;
    const intensity = GAME_FEEL_CONFIG.screenShakeIntensity[kind] ?? 0.002;
    this.scene.cameras.main.shake(kind === 'playerDamage' ? 110 : 150, intensity);
  }

  hitStop(ms: number): void {
    if (ms <= 0) return;
    this.scene.time.timeScale = 0.18;
    this.scene.time.delayedCall(ms, () => {
      this.scene.time.timeScale = 1;
    });
  }

  ultimateFlash(): void {
    const beam = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, 38, COLORS.fragmentGlow, 0.22)
      .setDepth(VIEW_DEPTH.overlay - 10);
    this.scene.tweens.add({ targets: beam, scaleX: 1.08, alpha: 0, duration: 260, onComplete: () => beam.destroy() });
  }

  blackAura(target: Phaser.GameObjects.GameObject): void {
    const targetWithPosition = target as unknown as Phaser.GameObjects.Components.Transform;
    const ring = this.scene.add.circle(targetWithPosition.x, targetWithPosition.y, 26, COLORS.ink, 0.18)
      .setDepth(VIEW_DEPTH.player - 1);
    ring.setStrokeStyle(2, 0x090711, 0.62);
    this.scene.tweens.add({
      targets: ring,
      scale: 1.6,
      alpha: 0,
      duration: 360,
      onComplete: () => ring.destroy(),
    });
  }

  bossWarning(options?: EffectOptions): void {
    const text = this.scene.add.text(GAME_WIDTH / 2, 146, options?.label ?? '黒い気配', {
      fontFamily: 'serif',
      fontSize: '20px',
      color: '#ffe7a8',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(VIEW_DEPTH.overlay + 4);
    this.scene.tweens.add({
      targets: text,
      alpha: { from: 1, to: 0.22 },
      duration: 180,
      yoyo: true,
      repeat: 2,
      onComplete: () => text.destroy(),
    });
  }

  count(): number {
    return this.activeParticles;
  }

  private radialGlow(x: number, y: number, label: string, color: number, radius: number, duration: number): void {
    const depth = VIEW_DEPTH.overlay - 12;
    const ring = this.scene.add.circle(x, y, radius, color, 0.1).setDepth(depth);
    ring.setStrokeStyle(3, color, 0.8);
    const text = this.scene.add.text(x, y - radius - 10, label, {
      fontFamily: 'serif',
      fontSize: '16px',
      color: '#fff0c8',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(depth + 1);
    this.scene.tweens.add({ targets: ring, scale: 2.5, alpha: 0, duration, ease: 'Cubic.easeOut', onComplete: () => ring.destroy() });
    this.scene.tweens.add({ targets: text, y: text.y - 22, alpha: 0, duration, ease: 'Quad.easeOut', onComplete: () => text.destroy() });
  }

  private particle(x: number, y: number, color: number, radius: number, duration: number, angle: number, distance: number): void {
    const dot = this.scene.add.circle(x, y, radius, color, 0.82).setDepth(VIEW_DEPTH.enemy + 2);
    this.activeParticles += 1;
    this.scene.tweens.add({
      targets: dot,
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      scale: 0.25,
      alpha: 0,
      duration,
      ease: 'Quad.easeOut',
      onComplete: () => {
        dot.destroy();
        this.activeParticles = Math.max(0, this.activeParticles - 1);
      },
    });
  }

  private qualityCount(count: number): number {
    const quality = loadGameFeelSettings().particleQuality;
    if (quality === 'low') return Math.max(1, Math.floor(count * 0.45));
    if (quality === 'high') return Math.ceil(count * 1.25);
    return count;
  }

  private canEmit(nextCount: number): boolean {
    const max = loadGameFeelSettings().lowSpecMode
      ? Math.floor(GAME_FEEL_CONFIG.maxParticles * 0.55)
      : GAME_FEEL_CONFIG.maxParticles;
    return this.activeParticles + nextCount <= max;
  }
}

const MANAGERS = new WeakMap<Phaser.Scene, EffectManager>();

export function getEffectManager(scene: Phaser.Scene): EffectManager {
  let manager = MANAGERS.get(scene);
  if (!manager) {
    manager = new EffectManager(scene);
    MANAGERS.set(scene, manager);
  }
  return manager;
}
