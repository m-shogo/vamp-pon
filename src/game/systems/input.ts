import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { normalize } from '../utils/math';

export type KeyboardKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
};

export function setupKeyboard(scene: Phaser.Scene): KeyboardKeys | null {
  const kb = scene.input.keyboard;
  if (!kb) return null;
  return {
    up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
    down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
    left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
    right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
    w: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    a: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    s: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    d: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
  };
}

/** キーボードとスティックを合成し、正規化した方向を state.inputVec に書き込む。 */
export function updateInput(
  state: RuntimeState,
  keys: KeyboardKeys | null,
  stickVec: { x: number; y: number },
): void {
  let x = stickVec.x;
  let y = stickVec.y;

  if (keys) {
    if (keys.left.isDown || keys.a.isDown) x -= 1;
    if (keys.right.isDown || keys.d.isDown) x += 1;
    if (keys.up.isDown || keys.w.isDown) y -= 1;
    if (keys.down.isDown || keys.s.isDown) y += 1;
  }

  const n = normalize(x, y);
  state.inputVec.x = n.x;
  state.inputVec.y = n.y;
}
