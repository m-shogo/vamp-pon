import type { RuntimeState } from '../runtime';
import { clamp } from '../utils/math';
import { GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';

/** プレイヤーを入力方向へ移動し、画面内に制限する。 */
export function updateMovement(state: RuntimeState, dt: number): void {
  const p = state.player;
  p.x += state.inputVec.x * p.moveSpeed * dt;
  p.y += state.inputVec.y * p.moveSpeed * dt;
  p.x = clamp(p.x, p.radius, GAME_WIDTH - p.radius);
  p.y = clamp(p.y, p.radius, GAME_HEIGHT - p.radius);
  state.playerView.setPosition(p.x, p.y);
}
