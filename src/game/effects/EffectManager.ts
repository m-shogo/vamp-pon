import Phaser from 'phaser';
import { GAME_FEEL_CONFIG, loadGameFeelSettings } from '../config/GameFeelConfig';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { VIEW_DEPTH } from '../ui/factory';

type EffectOptions = {
  elite?: boolean;
  label?: string;
  strong?: boolean;
  combo?: number;
  target?: { x: number; y: number };
};

export class EffectManager {
  private activeParticles = 0;
  private hitStopUntilMs = 0;
  private hitStopTimer: ReturnType<typeof setTimeout> | null = null;
  private comboCount = 0;
  private lastKillAtMs = Number.NEGATIVE_INFINITY;

  constructor(private scene: Phaser.Scene) {}

  init(scene: Phaser.Scene): void {
    this.scene = scene;
  }

  hit(x: number, y: number, options?: EffectOptions): void {
    this.hitBurst(x, y, options);
  }

  enemyDeath(x: number, y: number, options?: EffectOptions): void {
    this.enemyDeathBurst(x, y, options);
  }

  expCollect(x: number, y: number, targetX: number, targetY: number): void {
    this.expVacuum(x, y, targetX, targetY);
  }

  levelUp(x: number, y: number, options?: EffectOptions): void {
    this.levelUpBurst(x, y, options);
  }

  evolution(x: number, y: number, options?: EffectOptions): void {
    this.evolutionBurst(x, y, options);
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

  hitBurst(x: number, y: number, options?: EffectOptions): void {
    if (!this.canEmit(options?.elite ? 6 : 4)) return;
    const elite = options?.elite === true;
    const inkColor = elite ? COLORS.enemyEliteEdge : COLORS.enemyInkEdge;
    const lightColor = elite ? 0xcab8ff : COLORS.fragmentGlow;
    const inkCount = this.qualityCount(elite ? 5 : 3);
    for (let i = 0; i < inkCount; i += 1) {
      this.particle(x, y, inkColor, elite ? 3.2 : 2.4, 120 + Math.random() * 50, Math.random() * Math.PI * 2, 10 + Math.random() * 16);
    }
    this.particle(x, y, lightColor, elite ? 2.8 : 2.1, 95, -Math.PI / 2 + Math.random() * 0.5, 8);
    if (options?.strong) this.cameraShakeSmall(elite ? 1.2 : 0.8);
  }

  enemyDeathBurst(x: number, y: number, options?: EffectOptions): void {
    const elite = options?.elite === true;
    const combo = options?.combo ?? this.registerKillCombo();
    const particleBudget = elite ? 20 : 14;
    if (this.canEmit(particleBudget)) {
      const inkCount = this.qualityCount(elite ? 14 : 9);
      const scrapCount = this.qualityCount(elite ? 5 : 3);
      for (let i = 0; i < inkCount; i += 1) {
        this.particle(x, y, elite ? COLORS.enemyEliteEdge : COLORS.enemyInkEdge, 2.4 + Math.random() * 2.4, 230 + Math.random() * 140, Math.random() * Math.PI * 2, 18 + Math.random() * 32);
      }
      for (let i = 0; i < scrapCount; i += 1) {
        this.paperScrap(x, y, elite);
      }
    }
    this.glowPop(x, y, elite ? 24 : 17, elite ? 0xffd8a0 : COLORS.fragmentGlow, elite ? 0.24 : 0.18, elite ? 280 : 210);
    if (elite) this.cameraShakeSmall(1.5);
    this.comboFeedback(combo);
  }

  expVacuum(x: number, y: number, targetX: number, targetY: number): void {
    if (!this.canEmit(loadGameFeelSettings().lowSpecMode ? 1 : 3)) return;
    const dot = this.scene.add.circle(x, y, 3.3, COLORS.fragmentGlow, 0.82).setDepth(VIEW_DEPTH.pickup + 3);
    const midX = (x + targetX) / 2 + (Math.random() < 0.5 ? -1 : 1) * (12 + Math.random() * 18);
    const midY = (y + targetY) / 2 - 14 - Math.random() * 18;
    this.activeParticles += 1;
    if (!loadGameFeelSettings().lowSpecMode) {
      this.trailDot(x, y, 0);
      this.scene.time.delayedCall(55, () => this.trailDot(midX, midY, 1));
    }
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 190,
      ease: 'Cubic.easeIn',
      onUpdate: (tween) => {
        const t = tween.getValue() ?? 1;
        const inv = 1 - t;
        dot.setPosition(
          inv * inv * x + 2 * inv * t * midX + t * t * targetX,
          inv * inv * y + 2 * inv * t * midY + t * t * targetY,
        );
        dot.setScale(1 - t * 0.62);
      },
      onComplete: () => {
        dot.destroy();
        this.activeParticles = Math.max(0, this.activeParticles - 1);
        this.expAbsorbPop(targetX, targetY);
      },
    });
  }

  expAbsorbPop(x: number, y: number): void {
    this.glowPop(x, y, 7, COLORS.fragmentGlow, 0.24, 130);
  }

  rewardCardPop(target: Phaser.GameObjects.GameObject, options?: { strong?: boolean }): void {
    const transform = target as unknown as Phaser.GameObjects.Components.Transform & { setScale: (scale: number) => void };
    const strong = options?.strong === true;
    transform.setScale(strong ? 0.84 : 0.9);
    this.scene.tweens.add({
      targets: target,
      scale: strong ? 1.04 : 1,
      duration: strong ? 220 : 180,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: target,
          scale: 1,
          duration: strong ? 90 : 70,
          ease: 'Quad.easeOut',
        });
      },
    });
  }

  levelUpBurst(x: number, y: number, options?: EffectOptions): void {
    this.hitStop(GAME_FEEL_CONFIG.hitStopMs.levelUp);
    this.screenShake('levelUp');
    this.screenFlashSoft(0xffe6a8, 0.12, 300);
    this.radialGlow(x, y, options?.label ?? 'Lv Up', COLORS.fragmentGlow, 36, 560);
    this.ring(x, y, 22, 0xfff0b0, 3, 3.2, 580);
  }

  evolutionBurst(x: number, y: number, options?: EffectOptions): void {
    this.hitStop(GAME_FEEL_CONFIG.hitStopMs.evolution);
    this.screenShake('evolution');
    this.screenFlashSoft(0x110b1f, 0.22, 340);
    this.radialGlow(x, y, options?.label ?? '進化', COLORS.lantern, 48, 760);
    this.ring(x, y, 30, COLORS.lantern, 4, 3.9, 760);
    this.ring(x, y, 18, COLORS.fragmentGlow, 2, 4.8, 680);
    for (let i = 0; i < this.qualityCount(7); i += 1) {
      this.horizontalScrapFlow(y - 18 + i * 6);
    }
  }

  ultimateSweep(): void {
    const beam = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, 34, COLORS.fragmentGlow, 0.2)
      .setDepth(VIEW_DEPTH.overlay - 10)
      .setBlendMode(Phaser.BlendModes.ADD);
    const ink = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 18, GAME_WIDTH, 18, COLORS.ink, 0.14)
      .setDepth(VIEW_DEPTH.overlay - 11);
    this.scene.tweens.add({ targets: [beam, ink], x: GAME_WIDTH / 2 + 28, alpha: 0, duration: 300, ease: 'Quad.easeOut', onComplete: () => { beam.destroy(); ink.destroy(); } });
  }

  blackAuraPulse(target: Phaser.GameObjects.GameObject): void {
    const targetWithPosition = target as unknown as Phaser.GameObjects.Components.Transform;
    for (let i = 0; i < 3; i += 1) {
      this.scene.time.delayedCall(i * 115, () => {
        this.ring(targetWithPosition.x, targetWithPosition.y, 24 + i * 5, COLORS.ink, 2, 1.8, 430);
        for (let j = 0; j < this.qualityCount(3); j += 1) {
          this.particle(targetWithPosition.x, targetWithPosition.y, COLORS.enemyInkEdge, 2.5, 300, Math.random() * Math.PI * 2, 18 + Math.random() * 18);
        }
      });
    }
    this.edgeVignette(360);
  }

  hitStop(ms: number): void {
    if (ms <= 0) return;
    const now = Date.now();
    this.hitStopUntilMs = Math.max(this.hitStopUntilMs, now + ms);
    this.scene.time.timeScale = 0.18;
    if (!this.hitStopTimer) this.scheduleHitStopRelease();
  }

  ultimateFlash(): void {
    this.ultimateSweep();
  }

  blackAura(target: Phaser.GameObjects.GameObject): void {
    this.blackAuraPulse(target);
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

  combo(): number {
    return Date.now() - this.lastKillAtMs <= 2000 ? this.comboCount : 0;
  }

  destroy(): void {
    if (this.hitStopTimer) clearTimeout(this.hitStopTimer);
    this.hitStopTimer = null;
    this.hitStopUntilMs = 0;
    this.scene.time.timeScale = 1;
    this.activeParticles = 0;
  }

  private scheduleHitStopRelease(): void {
    const remainingMs = Math.max(0, this.hitStopUntilMs - Date.now());
    this.hitStopTimer = setTimeout(() => {
      this.hitStopTimer = null;
      const nextRemainingMs = this.hitStopUntilMs - Date.now();
      if (nextRemainingMs > 1) {
        this.scheduleHitStopRelease();
        return;
      }
      this.hitStopUntilMs = 0;
      this.scene.time.timeScale = 1;
    }, remainingMs);
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

  private registerKillCombo(): number {
    const now = Date.now();
    this.comboCount = now - this.lastKillAtMs <= 2000 ? this.comboCount + 1 : 1;
    this.lastKillAtMs = now;
    return this.comboCount;
  }

  comboFeedback(combo: number): void {
    if (combo < 5 || combo % 5 !== 0) return;
    const strong = combo >= 20;
    const text = this.scene.add.text(GAME_WIDTH - 72, 110, `${combo} combo`, {
      fontFamily: 'serif',
      fontSize: strong ? '18px' : combo >= 10 ? '15px' : '13px',
      color: strong ? '#ffe2a8' : '#f7edcf',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(VIEW_DEPTH.hud + 12);
    this.scene.tweens.add({
      targets: text,
      y: text.y - 18,
      scale: strong ? 1.18 : 1.05,
      alpha: 0,
      duration: strong ? 720 : 520,
      ease: 'Back.easeOut',
      onComplete: () => text.destroy(),
    });
  }

  screenFlashSoft(color: number, alpha: number, duration: number): void {
    const flash = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, color, alpha)
      .setDepth(VIEW_DEPTH.overlay - 16)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({ targets: flash, alpha: 0, duration, ease: 'Quad.easeOut', onComplete: () => flash.destroy() });
  }

  private edgeVignette(duration: number): void {
    const top = this.scene.add.rectangle(GAME_WIDTH / 2, 18, GAME_WIDTH, 36, COLORS.ink, 0.18).setDepth(VIEW_DEPTH.overlay - 9);
    const bottom = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 18, GAME_WIDTH, 36, COLORS.ink, 0.18).setDepth(VIEW_DEPTH.overlay - 9);
    this.scene.tweens.add({ targets: [top, bottom], alpha: 0, duration, onComplete: () => { top.destroy(); bottom.destroy(); } });
  }

  cameraShakeSmall(scale = 1): void {
    if (!loadGameFeelSettings().screenShake) return;
    this.scene.cameras.main.shake(85, GAME_FEEL_CONFIG.screenShakeIntensity.hit * scale);
  }

  private glowPop(x: number, y: number, radius: number, color: number, alpha: number, duration: number): void {
    const glow = this.scene.add.circle(x, y, radius, color, alpha)
      .setDepth(VIEW_DEPTH.pickup + 2)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({ targets: glow, scale: 1.9, alpha: 0, duration, ease: 'Quad.easeOut', onComplete: () => glow.destroy() });
  }

  private ring(x: number, y: number, radius: number, color: number, width: number, scale: number, duration: number): void {
    const ring = this.scene.add.circle(x, y, radius, color, 0.04).setDepth(VIEW_DEPTH.overlay - 13);
    ring.setStrokeStyle(width, color, 0.72);
    ring.setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({ targets: ring, scale, alpha: 0, duration, ease: 'Cubic.easeOut', onComplete: () => ring.destroy() });
  }

  private paperScrap(x: number, y: number, elite: boolean): void {
    const scrap = this.scene.add.rectangle(x, y, elite ? 8 : 6, elite ? 5 : 4, COLORS.paperScrap, elite ? 0.82 : 0.68)
      .setDepth(VIEW_DEPTH.enemy + 2)
      .setAngle(Math.random() * 180);
    this.activeParticles += 1;
    const angle = -Math.PI * 0.75 + Math.random() * Math.PI * 1.5;
    this.scene.tweens.add({
      targets: scrap,
      x: x + Math.cos(angle) * (18 + Math.random() * 24),
      y: y + Math.sin(angle) * (14 + Math.random() * 28),
      angle: scrap.angle + (Math.random() < 0.5 ? -1 : 1) * (45 + Math.random() * 80),
      alpha: 0,
      duration: 320 + Math.random() * 220,
      ease: 'Quad.easeOut',
      onComplete: () => {
        scrap.destroy();
        this.activeParticles = Math.max(0, this.activeParticles - 1);
      },
    });
  }

  private horizontalScrapFlow(y: number): void {
    const leftToRight = Math.random() < 0.5;
    const x = leftToRight ? -18 : GAME_WIDTH + 18;
    const scrap = this.scene.add.rectangle(x, y, 14, 4, COLORS.paperScrap, 0.52)
      .setDepth(VIEW_DEPTH.overlay - 12)
      .setAngle(leftToRight ? 6 : -6);
    this.activeParticles += 1;
    this.scene.tweens.add({
      targets: scrap,
      x: leftToRight ? GAME_WIDTH + 28 : -28,
      alpha: 0,
      duration: 520 + Math.random() * 180,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        scrap.destroy();
        this.activeParticles = Math.max(0, this.activeParticles - 1);
      },
    });
  }

  private trailDot(x: number, y: number, index: number): void {
    const dot = this.scene.add.circle(x, y, index === 0 ? 2.2 : 2.8, COLORS.fragmentGlow, index === 0 ? 0.16 : 0.22)
      .setDepth(VIEW_DEPTH.pickup + 1)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.activeParticles += 1;
    this.scene.tweens.add({
      targets: dot,
      scale: 0.4,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        dot.destroy();
        this.activeParticles = Math.max(0, this.activeParticles - 1);
      },
    });
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
  } else {
    manager.init(scene);
  }
  return manager;
}
