import type { RuntimeState } from '../runtime';
import { clamp } from '../utils/math';
import { GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { berserkMoveMultiplier } from './berserk';

/** プレイヤーを入力方向へ移動し、画面内に制限する。 */
export function updateMovement(state: RuntimeState, dt: number): void {
  const p = state.player;
  const speed = p.moveSpeed * berserkMoveMultiplier(state);
  p.x += state.inputVec.x * speed * dt;
  p.y += state.inputVec.y * speed * dt;
  p.x = clamp(p.x, p.radius, GAME_WIDTH - p.radius);
  p.y = clamp(p.y, p.radius, GAME_HEIGHT - p.radius);
  state.playerView.setPosition(p.x, p.y);
}
