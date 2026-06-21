import Phaser from 'phaser';

const STICK_MAX = 46;
const STICK_DEADZONE = 6;

/**
 * 仮想スティック。
 * 画面のどこをドラッグしても移動できる透明入力。
 * 操作表示は出さない（スマホ縦画面のプレイ領域を邪魔しないため）。
 * 必殺技は HUD 右上の丸アイコンへ分離する。
 */
export class VirtualStick {
  private activePointerId: number | null = null;
  private originX = 0;
  private originY = 0;
  private vec = { x: 0, y: 0 };

  constructor(private scene: Phaser.Scene) {
    scene.input.addPointer(2);

    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.onUp, this);
  }

  private onDown(pointer: Phaser.Input.Pointer): void {
    if (this.activePointerId !== null) return;
    this.activePointerId = pointer.id;
    this.originX = pointer.x;
    this.originY = pointer.y;
    this.vec = { x: 0, y: 0 };
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.activePointerId) return;
    let dx = pointer.x - this.originX;
    let dy = pointer.y - this.originY;
    const len = Math.hypot(dx, dy);

    if (len <= STICK_DEADZONE) {
      this.vec = { x: 0, y: 0 };
      return;
    }

    if (len > STICK_MAX) {
      dx = (dx / len) * STICK_MAX;
      dy = (dy / len) * STICK_MAX;
    }

    // 方向のみ採用（強度最大扱い）。どこから触っても同じ速度で動ける。
    const n = Math.hypot(dx, dy) || 1;
    this.vec = { x: dx / n, y: dy / n };
  }

  private onUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.activePointerId) return;
    this.activePointerId = null;
    this.vec = { x: 0, y: 0 };
  }

  getVector(): { x: number; y: number } {
    return this.vec;
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.onUp, this);
  }
}
