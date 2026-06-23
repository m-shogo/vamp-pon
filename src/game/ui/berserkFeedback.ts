import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { playCharacterCutin } from './characterCutin';

const ACTIVE_EDGE_ALPHA = 0.28;
const FATIGUE_MAX_ALPHA = 0.22;
const AFTERIMAGE_DURATION_MS = 220;
const AFTERIMAGE_OFFSET_PX = 6;
const FATIGUE_DURATION_SEC = 0.8;
const COOLDOWN_RESET_EPSILON = 0.08;

/**
 * Converts berserk state transitions into lightweight screen feedback.
 * Gameplay values and collision remain unchanged.
 */
export class BerserkFeedback {
  private readonly scene: Phaser.Scene;
  private readonly activeVeil: Phaser.GameObjects.Rectangle;
  private readonly fatigueVeil: Phaser.GameObjects.Rectangle;
  private readonly edgeTop: Phaser.GameObjects.Rectangle;
  private readonly edgeBottom: Phaser.GameObjects.Rectangle;
  private readonly edgeLeft: Phaser.GameObjects.Rectangle;
  private readonly edgeRight: Phaser.GameObjects.Rectangle;
  private readonly lanternCore: Phaser.GameObjects.Arc;
  private readonly lanternHalo: Phaser.GameObjects.Arc;
  private readonly lastCooldownByWeaponId = new Map<string, number>();
  private wasActive = false;
  private destroyed = false;
  private dotAccumulator = 0;
  private lastElapsedSec = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const depth = VIEW_DEPTH.overlay - 18;

    this.activeVeil = scene.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x080711, 0)
      .setDepth(depth)
      .setScrollFactor(0);
    this.fatigueVeil = scene.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x8e8796, 0)
      .setDepth(depth + 1)
      .setScrollFactor(0);

    this.edgeTop = scene.add.rectangle(GAME_WIDTH / 2, 12, GAME_WIDTH, 24, 0x07050e, 0).setDepth(depth + 2).setScrollFactor(0);
    this.edgeBottom = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 12, GAME_WIDTH, 24, 0x07050e, 0).setDepth(depth + 2).setScrollFactor(0);
    this.edgeLeft = scene.add.rectangle(9, GAME_HEIGHT / 2, 18, GAME_HEIGHT, 0x07050e, 0).setDepth(depth + 2).setScrollFactor(0);
    this.edgeRight = scene.add.rectangle(GAME_WIDTH - 9, GAME_HEIGHT / 2, 18, GAME_HEIGHT, 0x07050e, 0).setDepth(depth + 2).setScrollFactor(0);

    this.lanternHalo = scene.add.circle(0, 0, 34, 0xffd28a, 0)
      .setDepth(VIEW_DEPTH.player - 2)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.lanternCore = scene.add.circle(0, 0, 8, 0xfff0bd, 0)
      .setDepth(VIEW_DEPTH.player + 1)
      .setBlendMode(Phaser.BlendModes.ADD);
  }

  update(state: RuntimeState): void {
    if (this.destroyed) return;
    const dt = state.elapsedSec - this.lastElapsedSec;
    this.lastElapsedSec = state.elapsedSec;
    const active = state.berserk.activeRemaining > 0;
    const fatigued = state.berserk.fatigueRemaining > 0;
    const weaponFired = this.detectWeaponCooldownReset(state);

    if (active && !this.wasActive) this.onBerserkStart(state);
    if (!active && this.wasActive) {
      if (fatigued) this.onFatigueStart(state);
      this.onBerserkEnd(state);
    }
    if (active && weaponFired) this.spawnAttackAfterimage(state);
    this.wasActive = active;

    if (active) {
      const pulse = 0.5 + 0.5 * Math.sin(state.elapsedSec * 10);
      const lanternPulse = 0.55 + 0.45 * Math.sin(state.elapsedSec * 7.2);
      this.activeVeil.setAlpha(0.045 + pulse * 0.035);
      this.setEdgeAlpha(ACTIVE_EDGE_ALPHA * (0.72 + pulse * 0.28));
      this.lanternHalo
        .setPosition(state.player.x, state.player.y)
        .setScale(0.82 + lanternPulse * 0.24)
        .setAlpha(0.08 + lanternPulse * 0.08);
      this.lanternCore
        .setPosition(state.player.x, state.player.y)
        .setScale(0.8 + lanternPulse * 0.28)
        .setAlpha(0.18 + lanternPulse * 0.2);

      this.dotAccumulator += dt * 3.2;
      if (this.dotAccumulator >= 1) {
        this.dotAccumulator -= 1;
        const angle = Math.random() * Math.PI * 2;
        const dist = 18 + Math.random() * 14;
        const warm = Math.random() < 0.22;
        const dot = this.scene.add.circle(
          state.player.x + Math.cos(angle) * dist,
          state.player.y + Math.sin(angle) * dist,
          warm ? 1.2 + Math.random() * 1.1 : 1.8 + Math.random() * 1.5,
          warm ? 0xffd28a : 0x0a0712,
          warm ? 0.48 : 0.56,
        ).setDepth(warm ? VIEW_DEPTH.player + 1 : VIEW_DEPTH.player - 1);
        if (warm) dot.setBlendMode(Phaser.BlendModes.ADD);
        this.scene.tweens.add({
          targets: dot,
          y: dot.y - 12 - Math.random() * 12,
          alpha: 0,
          scale: warm ? 0.55 : 0.3,
          duration: 320 + Math.random() * 220,
          ease: 'Quad.easeOut',
          onComplete: () => dot.destroy(),
        });
      }
    } else {
      this.activeVeil.setAlpha(0);
      this.setEdgeAlpha(0);
      this.lanternHalo.setAlpha(0);
      this.lanternCore.setAlpha(0);
    }

    if (fatigued) {
      const ratio = state.berserk.fatigueRemaining / FATIGUE_DURATION_SEC;
      const breath = 0.75 + 0.25 * Math.sin(state.elapsedSec * 8);
      this.fatigueVeil.setAlpha(FATIGUE_MAX_ALPHA * Math.min(1, ratio) * breath);
    } else {
      this.fatigueVeil.setAlpha(0);
    }
  }

  spawnAttackAfterimage(state: RuntimeState): void {
    if (this.destroyed || state.berserk.activeRemaining <= 0) return;
    const sprite = state.playerView.getData('playerSprite') as Phaser.GameObjects.Image | undefined;
    if (!sprite || !sprite.texture?.key) return;

    const directionX = state.inputVec.x === 0 ? 0 : Math.sign(state.inputVec.x);
    const directionY = state.inputVec.y === 0 ? 0 : Math.sign(state.inputVec.y);
    const image = this.scene.add
      .image(
        state.player.x - directionX * AFTERIMAGE_OFFSET_PX,
        state.player.y - directionY * AFTERIMAGE_OFFSET_PX,
        sprite.texture.key,
        sprite.frame.name,
      )
      .setOrigin(sprite.originX, sprite.originY)
      .setDisplaySize(sprite.displayWidth, sprite.displayHeight)
      .setAlpha(0.34)
      .setTint(0x17101f)
      .setDepth(state.playerView.depth - 1);

    this.scene.tweens.add({
      targets: image,
      alpha: 0,
      scaleX: image.scaleX * 1.08,
      scaleY: image.scaleY * 1.08,
      duration: AFTERIMAGE_DURATION_MS,
      ease: 'Quad.easeOut',
      onComplete: () => image.destroy(),
    });
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.lastCooldownByWeaponId.clear();
    this.activeVeil.destroy();
    this.fatigueVeil.destroy();
    this.edgeTop.destroy();
    this.edgeBottom.destroy();
    this.edgeLeft.destroy();
    this.edgeRight.destroy();
    this.lanternHalo.destroy();
    this.lanternCore.destroy();
  }

  private detectWeaponCooldownReset(state: RuntimeState): boolean {
    let fired = false;
    const liveIds = new Set<string>();

    for (const weapon of state.inventory.weapons) {
      liveIds.add(weapon.id);
      const previous = this.lastCooldownByWeaponId.get(weapon.id);
      if (previous != null && weapon.cooldownRemaining > previous + COOLDOWN_RESET_EPSILON) {
        fired = true;
      }
      this.lastCooldownByWeaponId.set(weapon.id, weapon.cooldownRemaining);
    }

    for (const weaponId of this.lastCooldownByWeaponId.keys()) {
      if (!liveIds.has(weaponId)) this.lastCooldownByWeaponId.delete(weaponId);
    }
    return fired;
  }

  private onBerserkStart(state: RuntimeState): void {
    this.scene.cameras.main.flash(190, 20, 12, 28, false);
    this.scene.cameras.main.shake(170, 0.0038);
    playCharacterCutin(this.scene, 'berserk');
    this.spawnInkRing(state.player.x, state.player.y, 0x24162f, 360);
    this.spawnInkRing(state.player.x, state.player.y, 0xb94b91, 520);
    this.spawnInkRing(state.player.x, state.player.y, 0xffd28a, 440, 0.5);
    this.spawnBlackFlame(state.player.x, state.player.y);
  }

  private onBerserkEnd(state: RuntimeState): void {
    this.scene.cameras.main.flash(120, 240, 235, 220, false);
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      const particle = this.scene.add.circle(
        state.player.x,
        state.player.y,
        i % 2 === 0 ? 2.7 : 2.1,
        i % 2 === 0 ? 0xfff4dc : 0xffd28a,
        i % 2 === 0 ? 0.74 : 0.52,
      ).setDepth(VIEW_DEPTH.player + 1).setBlendMode('ADD');
      this.scene.tweens.add({
        targets: particle,
        x: state.player.x + Math.cos(angle) * 54,
        y: state.player.y + Math.sin(angle) * 42,
        alpha: 0,
        scale: 0.3,
        duration: 400,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
    const purifyRing = this.scene.add.circle(state.player.x, state.player.y, 16, 0xfff4dc, 0.05)
      .setDepth(VIEW_DEPTH.player + 1);
    purifyRing.setStrokeStyle(2, 0xfff4dc, 0.6);
    this.scene.tweens.add({
      targets: purifyRing,
      scale: 3.7,
      alpha: 0,
      duration: 480,
      ease: 'Cubic.easeOut',
      onComplete: () => purifyRing.destroy(),
    });
  }

  private onFatigueStart(state: RuntimeState): void {
    this.scene.cameras.main.shake(90, 0.0015);
    this.spawnInkRing(state.player.x, state.player.y, 0x8d8394, 430);
  }

  private spawnInkRing(x: number, y: number, color: number, duration: number, alphaScale = 1): void {
    const ring = this.scene.add.circle(x, y, 28, color, 0.04 * alphaScale).setDepth(VIEW_DEPTH.player - 1);
    ring.setStrokeStyle(3, color, 0.72 * alphaScale);
    if (color === 0xffd28a) ring.setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({
      targets: ring,
      scale: 3.2,
      alpha: 0,
      duration,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy(),
    });
  }

  private spawnBlackFlame(x: number, y: number): void {
    for (let i = 0; i < 14; i += 1) {
      const angle = (Math.PI * 2 * i) / 14;
      const warm = i % 7 === 0;
      const flame = this.scene.add
        .ellipse(x, y, warm ? 5 : 7, warm ? 11 : 14, warm ? 0xffd28a : i % 3 === 0 ? 0xb94b91 : 0x09040d, warm ? 0.44 : i % 3 === 0 ? 0.62 : 0.78)
        .setDepth(warm ? VIEW_DEPTH.player + 1 : VIEW_DEPTH.player - 1)
        .setAngle(Phaser.Math.RadToDeg(angle));
      if (i % 3 === 0 || warm) flame.setBlendMode('ADD');
      this.scene.tweens.add({
        targets: flame,
        x: x + Math.cos(angle) * (38 + (i % 4) * 8),
        y: y + Math.sin(angle) * (28 + (i % 5) * 7) - 10,
        scaleX: 0.35,
        scaleY: 1.5,
        alpha: 0,
        duration: 540,
        ease: 'Cubic.easeOut',
        onComplete: () => flame.destroy(),
      });
    }
  }

  private setEdgeAlpha(alpha: number): void {
    this.edgeTop.setAlpha(alpha);
    this.edgeBottom.setAlpha(alpha);
    this.edgeLeft.setAlpha(alpha);
    this.edgeRight.setAlpha(alpha);
  }
}
