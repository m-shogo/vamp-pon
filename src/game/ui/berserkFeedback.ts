import type Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { VIEW_DEPTH } from './factory';

const ACTIVE_EDGE_ALPHA = 0.16;
const FATIGUE_MAX_ALPHA = 0.2;
const AFTERIMAGE_DURATION_MS = 180;
const AFTERIMAGE_OFFSET_PX = 5;
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
  private readonly lastCooldownByWeaponId = new Map<string, number>();
  private wasActive = false;
  private destroyed = false;

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

    this.edgeTop = scene.add.rectangle(GAME_WIDTH / 2, 10, GAME_WIDTH, 20, 0x07050e, 0).setDepth(depth + 2).setScrollFactor(0);
    this.edgeBottom = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 10, GAME_WIDTH, 20, 0x07050e, 0).setDepth(depth + 2).setScrollFactor(0);
    this.edgeLeft = scene.add.rectangle(8, GAME_HEIGHT / 2, 16, GAME_HEIGHT, 0x07050e, 0).setDepth(depth + 2).setScrollFactor(0);
    this.edgeRight = scene.add.rectangle(GAME_WIDTH - 8, GAME_HEIGHT / 2, 16, GAME_HEIGHT, 0x07050e, 0).setDepth(depth + 2).setScrollFactor(0);
  }

  update(state: RuntimeState): void {
    if (this.destroyed) return;
    const active = state.berserk.activeRemaining > 0;
    const fatigued = state.berserk.fatigueRemaining > 0;
    const weaponFired = this.detectWeaponCooldownReset(state);

    if (active && !this.wasActive) this.onBerserkStart(state);
    if (!active && this.wasActive && fatigued) this.onFatigueStart(state);
    if (active && weaponFired) this.spawnAttackAfterimage(state);
    this.wasActive = active;

    if (active) {
      const pulse = 0.5 + 0.5 * Math.sin(state.elapsedSec * 10);
      this.activeVeil.setAlpha(0.035 + pulse * 0.025);
      this.setEdgeAlpha(ACTIVE_EDGE_ALPHA * (0.72 + pulse * 0.28));
    } else {
      this.activeVeil.setAlpha(0);
      this.setEdgeAlpha(0);
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
      .setAlpha(0.28)
      .setTint(0x17101f)
      .setDepth(state.playerView.depth - 1);

    this.scene.tweens.add({
      targets: image,
      alpha: 0,
      scaleX: image.scaleX * 1.06,
      scaleY: image.scaleY * 1.06,
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
    this.scene.cameras.main.flash(180, 20, 12, 28, false);
    this.scene.cameras.main.shake(160, 0.0035);
    this.spawnInkRing(state.player.x, state.player.y, 0x24162f, 360);
  }

  private onFatigueStart(state: RuntimeState): void {
    this.scene.cameras.main.shake(90, 0.0015);
    this.spawnInkRing(state.player.x, state.player.y, 0x8d8394, 430);
  }

  private spawnInkRing(x: number, y: number, color: number, duration: number): void {
    const ring = this.scene.add.circle(x, y, 28, color, 0.04).setDepth(VIEW_DEPTH.player - 1);
    ring.setStrokeStyle(3, color, 0.72);
    this.scene.tweens.add({
      targets: ring,
      scale: 3.2,
      alpha: 0,
      duration,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy(),
    });
  }

  private setEdgeAlpha(alpha: number): void {
    this.edgeTop.setAlpha(alpha);
    this.edgeBottom.setAlpha(alpha);
    this.edgeLeft.setAlpha(alpha);
    this.edgeRight.setAlpha(alpha);
  }
}
