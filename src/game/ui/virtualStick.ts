import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../domain/constants';
import { VIEW_DEPTH } from './factory';

const STICK_MAX = 46;

/**
 * 仮想スティック。画面左半分をドラッグで方向入力。
 * 画面右半分のタップは必殺技リクエスト（onUltimate）。
 */
export class VirtualStick {
  private base: Phaser.GameObjects.Container;
  private knob: Phaser.GameObjects.Arc;
  private activePointerId: number | null = null;
  private originX = 0;
  private originY = 0;
  private vec = { x: 0, y: 0 };

  constructor(
    private scene: Phaser.Scene,
    private onUltimate: () => void,
  ) {
    scene.input.addPointer(2);

    this.base = scene.add.container(0, 0);
    const ring = scene.add.circle(0, 0, STICK_MAX, COLORS.uiText, 0.08);
    ring.setStrokeStyle(2, COLORS.uiText, 0.25);
    this.knob = scene.add.circle(0, 0, 20, COLORS.uiText, 0.25);
    this.base.add([ring, this.knob]);
    this.base.setDepth(VIEW_DEPTH.hud);
    this.base.setVisible(false);
    this.base.setScrollFactor(0);

    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.onUp, this);
  }

  private onDown(pointer: Phaser.Input.Pointer): void {
    // ワールド座標ではなくスクリーン座標で判定（カメラ固定なので一致）
    if (pointer.x > GAME_WIDTH / 2) {
      this.onUltimate();
      return;
    }
    if (this.activePointerId !== null) return;
    this.activePointerId = pointer.id;
    this.originX = pointer.x;
    this.originY = pointer.y;
    this.base.setPosition(pointer.x, pointer.y);
    this.knob.setPosition(0, 0);
    this.base.setVisible(true);
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.activePointerId) return;
    let dx = pointer.x - this.originX;
    let dy = pointer.y - this.originY;
    const len = Math.hypot(dx, dy);
    if (len > STICK_MAX) {
      dx = (dx / len) * STICK_MAX;
      dy = (dy / len) * STICK_MAX;
    }
    this.knob.setPosition(dx, dy);
    if (len > 6) {
      const n = Math.max(len, 1);
      this.vec = { x: dx / Math.min(n, STICK_MAX), y: dy / Math.min(n, STICK_MAX) };
      // 方向のみ採用（強度最大扱い: docs/80）
      const nn = Math.hypot(this.vec.x, this.vec.y) || 1;
      this.vec = { x: this.vec.x / nn, y: this.vec.y / nn };
    } else {
      this.vec = { x: 0, y: 0 };
    }
  }

  private onUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.activePointerId) return;
    this.activePointerId = null;
    this.vec = { x: 0, y: 0 };
    this.base.setVisible(false);
  }

  getVector(): { x: number; y: number } {
    return this.vec;
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.onUp, this);
    this.base.destroy();
  }
}
