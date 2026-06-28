import Phaser from 'phaser';
import { GAME_FEEL_CONFIG, loadGameFeelSettings } from '../config/GameFeelConfig';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { VIEW_DEPTH } from '../ui/factory';

type EffectOptions = {
  elite?: boolean;
  defId?: string;
  label?: string;
  strong?: boolean;
  combo?: number;
  target?: { x: number; y: number };
  black?: boolean;
};

export class EffectManager {
  private activeParticles = 0;
  private hitStopUntilMs = 0;
  private hitStopTimer: ReturnType<typeof setTimeout> | null = null;
  private comboCount = 0;
  private lastKillAtMs = Number.NEGATIVE_INFINITY;
  private comboHudText: Phaser.GameObjects.Text | null = null;
  private comboHideTimer: Phaser.Time.TimerEvent | null = null;
  private expAbsorbWindowCount = 0;
  private lastExpAbsorbAtMs = Number.NEGATIVE_INFINITY;
  private lastExpMassBurstAtMs = Number.NEGATIVE_INFINITY;

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

  survivalRevival(x: number, y: number, options?: { itemId?: string; hpRestored?: number }): void {
    this.screenFlashSoft(0xffd79a, 0.1, 160);
    this.ring(x, y + 7, 20, COLORS.dawnWarm, 2, 2.7, 680);
    this.ring(x, y + 7, 11, 0xfff3cf, 2, 3.4, 620);
    this.glowPop(x, y + 4, 28, COLORS.dawnWarm, 0.16, 560);

    const label = options?.itemId === 'dawn_ticket' ? '夜明けへ戻る' : '復帰';
    const text = this.scene.add.text(x, y - 38, label, {
      fontFamily: 'serif',
      fontSize: '14px',
      color: '#fff4d2',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(VIEW_DEPTH.overlay + 3);
    text.setStroke('#5a3520', 4);

    const hpText = this.scene.add.text(x, y - 20, `HP +${options?.hpRestored ?? ''}`, {
      fontFamily: 'serif',
      fontSize: '12px',
      color: '#ffe0a8',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(VIEW_DEPTH.overlay + 3);
    hpText.setStroke('#5a3520', 3);

    this.scene.tweens.add({
      targets: [text, hpText],
      y: '-=22',
      alpha: 0,
      duration: 760,
      ease: 'Quad.easeOut',
      onComplete: () => {
        text.destroy();
        hpText.destroy();
      },
    });

    if (!this.canEmit(6)) return;
    for (let i = 0; i < this.qualityCount(6); i += 1) {
      this.particle(x, y + 5, i % 2 === 0 ? COLORS.dawnWarm : 0xfff7df, 1.8, 420, -Math.PI / 2 + (Math.random() - 0.5) * 1.2, 16 + Math.random() * 18);
    }
  }

  playerDamage(): void {
    this.hitStop(GAME_FEEL_CONFIG.hitStopMs.playerDamage);
    const flash = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xd94545, 0.16)
      .setDepth(VIEW_DEPTH.overlay - 8);
    this.scene.tweens.add({ targets: flash, alpha: 0, duration: 180, onComplete: () => flash.destroy() });
    this.screenShake('playerDamage');
  }

  playerDamageView(view: Phaser.GameObjects.Container, options?: { sourceX?: number; sourceY?: number; strong?: boolean }): void {
    const sourceX = options?.sourceX ?? view.x - 1;
    const sourceY = options?.sourceY ?? view.y;
    const dx = view.x - sourceX;
    const dy = view.y - sourceY;
    const len = Math.max(1, Math.hypot(dx, dy));
    const ox = (dx / len) * (options?.strong ? 9 : 6);
    const oy = (dy / len) * (options?.strong ? 9 : 6);
    const sprite = view.list.find((child) => child instanceof Phaser.GameObjects.Image) as Phaser.GameObjects.Image | undefined;
    const originalTint = sprite?.tintTopLeft;
    sprite?.setTint(0xffffff);
    view.setAlpha(1);
    view.setScale(1.1);
    this.scene.tweens.add({
      targets: view,
      x: view.x + ox,
      y: view.y + oy,
      scale: 1,
      duration: 64,
      ease: 'Quad.easeOut',
      onComplete: () => {
        if (sprite) {
          if (originalTint && originalTint !== 0xffffff) sprite.setTint(originalTint);
          else sprite.clearTint();
        }
      },
    });
    if (options?.strong) this.cameraShakeSmall(1.25);
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

  enemyHitView(
    view: Phaser.GameObjects.Container,
    x: number,
    y: number,
    sourceX: number,
    sourceY: number,
    options?: EffectOptions,
  ): void {
    const elite = options?.elite === true;
    const dx = x - sourceX;
    const dy = y - sourceY;
    const len = Math.max(1, Math.hypot(dx, dy));
    const knockback = elite ? 3 : 5;
    this.scene.tweens.killTweensOf(view);
    view.setScale(elite ? 1.16 : 1.14);
    view.setAlpha(1);
    this.scene.tweens.add({
      targets: view,
      x: x + (dx / len) * knockback,
      y: y + (dy / len) * knockback,
      scale: 1,
      duration: 60,
      ease: 'Quad.easeOut',
      onComplete: () => view.setPosition(x, y),
    });

    const sprite = view.list.find((child) => child instanceof Phaser.GameObjects.Image) as Phaser.GameObjects.Image | undefined;
    const blob = view.getData('blob') as Phaser.GameObjects.Arc | undefined;
    sprite?.setTint(elite ? 0xd7ccff : 0xfff2d4);
    blob?.setFillStyle(0xffffff, 1);
    this.scene.time.delayedCall(55, () => {
      sprite?.clearTint();
      blob?.setFillStyle(elite ? COLORS.enemyElite : COLORS.enemyInk, 1);
    });
  }

  enemyDeathBurst(x: number, y: number, options?: EffectOptions): void {
    const elite = options?.elite === true;
    const combo = options?.combo ?? this.registerKillCombo();
    this.hitStop(this.deathHitStopMs(combo, options));
    const inkCountBase = this.enemyDeathInkCount(options?.defId, elite);
    const memoryCountBase = elite ? GAME_FEEL_CONFIG.juice.enemyDeathMemoryParticles.elite : GAME_FEEL_CONFIG.juice.enemyDeathMemoryParticles.normal;
    const particleBudget = inkCountBase + memoryCountBase + 5;
    if (this.canEmit(particleBudget)) {
      const inkCount = this.qualityCount(inkCountBase);
      const memoryCount = this.qualityCount(memoryCountBase);
      const scrapCount = this.qualityCount(elite ? 5 : 3);
      for (let i = 0; i < inkCount; i += 1) {
        const color = options?.black ? 0x0b0711 : elite ? COLORS.enemyEliteEdge : COLORS.enemyInkEdge;
        this.particle(x, y, color, 2.3 + Math.random() * 2.8, 200 + Math.random() * 150, Math.random() * Math.PI * 2, 18 + Math.random() * 36);
      }
      for (let i = 0; i < memoryCount; i += 1) {
        this.particle(x, y, 0xfff6df, 1.8 + Math.random() * 1.6, 160 + Math.random() * 90, -Math.PI / 2 + (Math.random() - 0.5) * 1.8, 16 + Math.random() * 28);
      }
      for (let i = 0; i < scrapCount; i += 1) {
        this.paperScrap(x, y, elite);
      }
    }
    this.glowPop(x, y, elite ? 24 : 17, elite ? 0xffd8a0 : COLORS.fragmentGlow, elite ? 0.24 : 0.18, elite ? 280 : 210);
    this.shadowDissolve(x, y, elite);
    if (elite || options?.defId === 'black_label_shadow') this.cameraShakeSmall(options?.defId === 'black_label_shadow' ? 1.85 : 1.5);
    if (options?.black) this.blackAfterimage(x, y);
    this.comboFeedback(combo);
  }

  enemyDeathView(view: Phaser.GameObjects.Container, options?: EffectOptions): void {
    this.scene.tweens.killTweensOf(view);
    view.setScale(options?.elite ? 1.16 : 1.1);
    this.scene.tweens.add({
      targets: view,
      scale: 0.8,
      alpha: 0,
      duration: GAME_FEEL_CONFIG.juice.enemyDeathFadeMs,
      ease: 'Quad.easeIn',
      onComplete: () => view.destroy(),
    });
  }

  expVacuum(x: number, y: number, targetX: number, targetY: number): void {
    const settings = loadGameFeelSettings();
    if (!this.canEmit(settings.lowSpecMode ? 1 : 3)) return;
    const dot = this.scene.add.circle(x, y, 3.3, COLORS.fragmentGlow, 0.82).setDepth(VIEW_DEPTH.pickup + 3);
    const midX = (x + targetX) / 2 + (Math.random() < 0.5 ? -1 : 1) * (12 + Math.random() * 18);
    const midY = (y + targetY) / 2 - 14 - Math.random() * 18;
    this.activeParticles += 1;
    if (!settings.lowSpecMode) {
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
    this.registerExpAbsorb();
    this.glowPop(x, y, 10, COLORS.fragmentGlow, 0.32, Math.max(170, GAME_FEEL_CONFIG.juice.expAbsorbPopMs));
    const ring = this.scene.add.circle(x, y, 9, 0xffffff, 0.05)
      .setDepth(VIEW_DEPTH.pickup + 4)
      .setBlendMode(Phaser.BlendModes.ADD);
    ring.setStrokeStyle(2, 0xffffff, 0.82);
    this.scene.tweens.add({ targets: ring, scale: 2.35, alpha: 0, duration: 175, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
    if (!loadGameFeelSettings().lowSpecMode && this.canEmit(5)) {
      for (let i = 0; i < 5; i += 1) {
        this.particle(x, y, 0xfff7e8, 1.9, 105 + Math.random() * 45, Math.random() * Math.PI * 2, 10 + Math.random() * 14);
      }
    }
  }

  expMassBurst(x = GAME_WIDTH / 2, y = GAME_HEIGHT / 2): void {
    this.screenFlashSoft(0xfff7df, 0.08, 120);
    this.ring(x, y, 34, COLORS.fragmentGlow, 2, 2.8, 340);
    if (!this.canEmit(8)) return;
    for (let i = 0; i < this.qualityCount(8); i += 1) {
      this.particle(x, y, i % 2 === 0 ? COLORS.fragmentGlow : 0xffffff, 1.8, 180, (Math.PI * 2 * i) / 8, 26);
    }
  }

  rarePickup(x: number, y: number, options?: { legend?: boolean; label?: string }): void {
    const legend = options?.legend === true;
    if (legend) this.screenFlashSoft(0xffffff, 0.18, 140);
    if (legend) this.screenFlashSoft(0xf5d58a, 0.18, 240);
    this.ring(x, y, legend ? 34 : 26, 0xf5d58a, legend ? 4 : 3, legend ? 4 : 3.2, legend ? 620 : 460);
    this.glowPop(x, y, legend ? 34 : 24, 0xf5d58a, legend ? 0.26 : 0.18, legend ? 520 : 360);
    const label = this.scene.add.text(x, y - 34, options?.label ?? (legend ? 'LEGEND' : 'RARE'), {
      fontFamily: 'serif',
      fontSize: legend ? '20px' : '16px',
      color: legend ? '#fff8e7' : '#ffe3a8',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(VIEW_DEPTH.overlay + 3);
    label.setStroke('#5f4320', 4);
    this.scene.tweens.add({ targets: label, y: label.y - 22, alpha: 0, scale: legend ? 1.18 : 1.08, duration: 620, ease: 'Back.easeOut', onComplete: () => label.destroy() });
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
    this.screenFlashSoft(0xffffff, 0.32, 180);
    this.screenFlashSoft(0xffe6a8, 0.14, 320);
    this.radialGlow(x, y, options?.label ?? 'Lv Up', COLORS.fragmentGlow, 36, 560);
    this.levelUpArrival(x, y);
    this.ring(x, y, 22, 0xfff0b0, 3, 3.2, 580);
    this.levelNumberPop(options?.label ?? 'Lv Up');
    if (this.canEmit(16)) {
      for (let i = 0; i < this.qualityCount(14); i += 1) {
        this.particle(x, y, i % 3 === 0 ? 0xffffff : COLORS.fragmentGlow, 2 + Math.random() * 2, 280 + Math.random() * 130, (Math.PI * 2 * i) / 14, 26 + Math.random() * 30);
      }
    }
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
    this.hitStop(GAME_FEEL_CONFIG.hitStopMs.ultimate);
    const shade = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x050713, 0.26)
      .setDepth(VIEW_DEPTH.overlay - 15);
    this.scene.tweens.add({ targets: shade, alpha: 0, duration: GAME_FEEL_CONFIG.juice.ultimateDimmingMs + 150, ease: 'Quad.easeOut', onComplete: () => shade.destroy() });
    this.edgeVignette(460, 0.24);
    const beam = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, 34, COLORS.fragmentGlow, 0.2)
      .setDepth(VIEW_DEPTH.overlay - 10)
      .setBlendMode(Phaser.BlendModes.ADD);
    const ink = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 18, GAME_WIDTH, 18, COLORS.ink, 0.14)
      .setDepth(VIEW_DEPTH.overlay - 11);
    this.scene.tweens.add({ targets: [beam, ink], x: GAME_WIDTH / 2 + 42, alpha: 0, duration: 210, ease: 'Quad.easeOut', timeScale: 1.5, onComplete: () => { beam.destroy(); ink.destroy(); this.screenFlashSoft(0xffffff, 0.18, 140); } });
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
    this.edgeVignette(520, 0.28);
  }

  blackAuraRelease(x: number, y: number): void {
    this.hitStop(GAME_FEEL_CONFIG.hitStopMs.berserkRelease);
    this.screenFlashSoft(0xffffff, 0.18, 180);
    if (this.canEmit(10)) {
      for (let i = 0; i < this.qualityCount(10); i += 1) {
        this.particle(x, y, 0xfff4dc, 2.2, 260 + Math.random() * 120, -Math.PI / 2 + (Math.random() - 0.5) * Math.PI, 20 + Math.random() * 30);
      }
    }
  }

  clearDawn(): void {
    const warm = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.dawnWarm, 0)
      .setDepth(VIEW_DEPTH.overlay - 17)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({
      targets: warm,
      alpha: { from: 0, to: 0.24 },
      duration: GAME_FEEL_CONFIG.juice.clearWarmthMs,
      yoyo: true,
      hold: 260,
      ease: 'Sine.easeInOut',
      onComplete: () => warm.destroy(),
    });
    if (this.canEmit(18)) {
      for (let i = 0; i < this.qualityCount(18); i += 1) {
        const x = 20 + Math.random() * (GAME_WIDTH - 40);
        const y = GAME_HEIGHT + Math.random() * 90;
        const dot = this.scene.add.circle(x, y, 1.8 + Math.random() * 2, i % 4 === 0 ? 0xffffff : COLORS.dawnWarm, 0.42)
          .setDepth(VIEW_DEPTH.overlay - 16)
          .setBlendMode(Phaser.BlendModes.ADD);
        this.activeParticles += 1;
        this.scene.tweens.add({
          targets: dot,
          y: y - 260 - Math.random() * 160,
          x: x + (Math.random() - 0.5) * 38,
          alpha: 0,
          duration: 980 + Math.random() * 520,
          ease: 'Sine.easeOut',
          onComplete: () => {
            dot.destroy();
            this.activeParticles = Math.max(0, this.activeParticles - 1);
          },
        });
      }
    }
  }

  dangerPulse(hpRatio: number): void {
    if (hpRatio > 0.3) return;
    const alpha = hpRatio <= 0.16 ? 0.16 : 0.1;
    this.edgeVignette(280, alpha, 0x4d1420);
  }

  hitStop(ms: number): void {
    if (ms <= 0) return;
    const now = this.sceneNowMs();
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
    this.screenFlashSoft(0x1b1024, 0.28, 180);
    this.cameraShakeSmall(1.35);
    const top = this.scene.add.rectangle(GAME_WIDTH / 2, 112, GAME_WIDTH, 34, 0x050309, 0.82)
      .setDepth(VIEW_DEPTH.overlay + 3);
    const bottom = this.scene.add.rectangle(GAME_WIDTH / 2, 182, GAME_WIDTH, 34, 0x050309, 0.82)
      .setDepth(VIEW_DEPTH.overlay + 3);
    const text = this.scene.add.text(GAME_WIDTH / 2, 146, options?.label ?? '黒い気配', {
      fontFamily: 'serif',
      fontSize: '22px',
      color: '#ffe7a8',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(VIEW_DEPTH.overlay + 4);
    text.setStroke('#130814', 5);
    this.scene.tweens.add({
      targets: [top, bottom, text],
      alpha: { from: 1, to: 0.22 },
      duration: 180,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        top.destroy();
        bottom.destroy();
        text.destroy();
      },
    });
  }

  count(): number {
    return this.activeParticles;
  }

  combo(): number {
    return this.sceneNowMs() - this.lastKillAtMs <= 2000 ? this.comboCount : 0;
  }

  destroy(): void {
    if (this.hitStopTimer) clearTimeout(this.hitStopTimer);
    this.comboHideTimer?.remove(false);
    this.comboHideTimer = null;
    this.hitStopTimer = null;
    this.hitStopUntilMs = 0;
    this.scene.time.timeScale = 1;
    this.activeParticles = 0;
    this.comboHudText?.destroy();
    this.comboHudText = null;
    this.comboCount = 0;
    this.lastKillAtMs = Number.NEGATIVE_INFINITY;
    this.expAbsorbWindowCount = 0;
    this.lastExpAbsorbAtMs = Number.NEGATIVE_INFINITY;
    this.lastExpMassBurstAtMs = Number.NEGATIVE_INFINITY;
  }

  private scheduleHitStopRelease(): void {
    const remainingMs = Math.max(0, this.hitStopUntilMs - this.sceneNowMs());
    this.hitStopTimer = setTimeout(() => {
      this.hitStopTimer = null;
      const nextRemainingMs = this.hitStopUntilMs - this.sceneNowMs();
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
    const now = this.sceneNowMs();
    this.comboCount = now - this.lastKillAtMs <= 2000 ? this.comboCount + 1 : 1;
    this.lastKillAtMs = now;
    return this.comboCount;
  }

  private sceneNowMs(): number {
    return this.scene.time.now;
  }

  comboFeedback(combo: number): void {
    if (combo >= 2) this.updateComboHud(combo);
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

  private updateComboHud(combo: number): void {
    const strong = combo >= 20;
    const huge = combo >= 50;
    if (!this.comboHudText) {
      this.comboHudText = this.scene.add.text(GAME_WIDTH - 16, 98, '', {
        fontFamily: 'serif',
        fontSize: '15px',
        color: '#f7edcf',
        fontStyle: 'bold',
        align: 'right',
        resolution: 2,
      }).setOrigin(1, 0.5).setDepth(VIEW_DEPTH.hud + 18);
      this.comboHudText.setStroke('#0b0f1e', 4);
    }
    this.comboHudText
      .setText(`${combo} CHAIN`)
      .setColor(huge ? '#fff7dc' : strong ? '#ffe2a8' : '#f7edcf')
      .setAlpha(1)
      .setScale(1 + Math.min(combo, 60) * 0.004);
    this.scene.tweens.killTweensOf(this.comboHudText);
    this.scene.tweens.add({
      targets: this.comboHudText,
      scale: this.comboHudText.scale + (huge ? 0.18 : strong ? 0.11 : 0.06),
      duration: 90,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
    this.comboHideTimer?.remove(false);
    this.comboHideTimer = this.scene.time.delayedCall(1250, () => {
      this.comboHideTimer = null;
      if (!this.comboHudText) return;
      this.scene.tweens.add({ targets: this.comboHudText, alpha: 0, duration: 220 });
    });
    if (huge) this.expMassBurst(GAME_WIDTH - 72, 108);
  }

  screenFlashSoft(color: number, alpha: number, duration: number): void {
    const flash = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, color, alpha)
      .setDepth(VIEW_DEPTH.overlay - 16)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({ targets: flash, alpha: 0, duration, ease: 'Quad.easeOut', onComplete: () => flash.destroy() });
  }

  private edgeVignette(duration: number, alpha = 0.18, color: number = COLORS.ink): void {
    const top = this.scene.add.rectangle(GAME_WIDTH / 2, 18, GAME_WIDTH, 36, color, alpha).setDepth(VIEW_DEPTH.overlay - 9);
    const bottom = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 18, GAME_WIDTH, 36, color, alpha).setDepth(VIEW_DEPTH.overlay - 9);
    const left = this.scene.add.rectangle(8, GAME_HEIGHT / 2, 16, GAME_HEIGHT, color, alpha * 0.75).setDepth(VIEW_DEPTH.overlay - 9);
    const right = this.scene.add.rectangle(GAME_WIDTH - 8, GAME_HEIGHT / 2, 16, GAME_HEIGHT, color, alpha * 0.75).setDepth(VIEW_DEPTH.overlay - 9);
    this.scene.tweens.add({ targets: [top, bottom, left, right], alpha: 0, duration, onComplete: () => { top.destroy(); bottom.destroy(); left.destroy(); right.destroy(); } });
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

  private levelUpArrival(x: number, y: number): void {
    this.glowPop(x, y + 8, 18, 0xfff1b8, 0.2, 380);
    this.ring(x, y + 8, 13, 0xfff7df, 2, 2.45, 430);
    this.ring(x, y + 8, 7, COLORS.fragmentGlow, 2, 3.1, 360);
    if (loadGameFeelSettings().lowSpecMode || !this.canEmit(6)) return;
    for (let i = 0; i < 6; i += 1) {
      this.particle(x, y + 6, i % 2 === 0 ? 0xfff7df : COLORS.fragmentGlow, 1.8, 360, -Math.PI / 2 + (Math.random() - 0.5) * 1.1, 18 + Math.random() * 18);
    }
  }

  private paperScrap(x: number, y: number, elite: boolean): void {
    const scrap = this.scene.add.rectangle(x, y, elite ? 8 : 6, elite ? 5 : 4, COLORS.paperScrap, elite ? 0.82 : 0.68)
      .setDepth(VIEW_DEPTH.enemy + 2)
      .setAngle(Math.random() * 180);
    scrap.setStrokeStyle(1, elite ? 0xffe0aa : 0xf2d39a, elite ? 0.42 : 0.3);
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

  private shadowDissolve(x: number, y: number, elite: boolean): void {
    const shade = this.scene.add.ellipse(x, y + 2, elite ? 32 : 24, elite ? 22 : 16, 0x080611, elite ? 0.3 : 0.22)
      .setDepth(VIEW_DEPTH.enemy - 1);
    this.scene.tweens.add({
      targets: shade,
      scaleX: elite ? 1.65 : 1.45,
      scaleY: 0.55,
      alpha: 0,
      duration: elite ? 340 : 260,
      ease: 'Quad.easeOut',
      onComplete: () => shade.destroy(),
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

  private enemyDeathInkCount(defId: string | undefined, elite: boolean): number {
    if (defId === 'black_label_shadow') return GAME_FEEL_CONFIG.juice.enemyDeathInkParticles.omburo;
    if (defId) return GAME_FEEL_CONFIG.juice.enemyDeathInkParticles.ombu;
    return elite ? GAME_FEEL_CONFIG.juice.enemyDeathInkParticles.elite : GAME_FEEL_CONFIG.juice.enemyDeathInkParticles.normal;
  }

  private deathHitStopMs(combo: number, options?: EffectOptions): number {
    if (options?.defId === 'black_label_shadow') return GAME_FEEL_CONFIG.hitStopMs.death;
    if (options?.elite) return Math.min(GAME_FEEL_CONFIG.hitStopMs.death, 70);
    if (combo >= 50 && combo % 50 === 0) return GAME_FEEL_CONFIG.hitStopMs.death;
    if (combo >= 20 && combo % 20 === 0) return 64;
    if (combo >= 10 && combo % 10 === 0) return 44;
    return 16;
  }

  private levelNumberPop(label: string): void {
    const text = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 76, label, {
      fontFamily: 'serif',
      fontSize: '30px',
      color: '#fff8e7',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(VIEW_DEPTH.overlay + 2);
    text.setStroke('#6c5230', 5);
    text.setScale(0.7);
    this.scene.tweens.add({
      targets: text,
      y: text.y - 28,
      scale: 1.18,
      alpha: 0,
      duration: 680,
      ease: 'Back.easeOut',
      onComplete: () => text.destroy(),
    });
  }

  private blackAfterimage(x: number, y: number): void {
    const shade = this.scene.add.ellipse(x, y, 34, 24, 0x050309, 0.26)
      .setDepth(VIEW_DEPTH.enemy - 1);
    this.scene.tweens.add({
      targets: shade,
      scaleX: 1.5,
      scaleY: 0.7,
      alpha: 0,
      duration: 260,
      ease: 'Quad.easeOut',
      onComplete: () => shade.destroy(),
    });
  }

  private registerExpAbsorb(): void {
    const now = this.sceneNowMs();
    this.expAbsorbWindowCount = now - this.lastExpAbsorbAtMs < 900 ? this.expAbsorbWindowCount + 1 : 1;
    this.lastExpAbsorbAtMs = now;
    if (this.expAbsorbWindowCount < 50) return;
    if (now - this.lastExpMassBurstAtMs < 900) return;
    this.lastExpMassBurstAtMs = now;
    this.expMassBurst();
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
