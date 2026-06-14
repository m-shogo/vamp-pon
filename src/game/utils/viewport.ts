import type { DirectionWeights, Vec2 } from '../domain/types';
import { GAME_WIDTH, GAME_HEIGHT, SPAWN } from '../domain/constants';
import { distance } from './math';
import { pickDirection, randRange } from './rng';

/**
 * 画面外スポーン座標を返す。
 * directionWeightsで湧く辺を決め、画面外 margin 分だけ外側に出す。
 * プレイヤーから minPlayerDist 以内には出さない（理不尽被弾防止）。
 */
export function pickSpawnPosition(weights: DirectionWeights, player: Vec2): Vec2 {
  const margin = randRange(SPAWN.offscreenMin, SPAWN.offscreenMax);
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const dir = pickDirection(weights);
    const pos = spawnOnEdge(dir, margin);
    if (distance(pos.x, pos.y, player.x, player.y) >= SPAWN.minPlayerDist) {
      return pos;
    }
  }
  // フォールバック: 画面下中央外側
  return { x: GAME_WIDTH / 2, y: GAME_HEIGHT + margin };
}

function spawnOnEdge(dir: keyof DirectionWeights, margin: number): Vec2 {
  switch (dir) {
    case 'bottom':
      return { x: randRange(0, GAME_WIDTH), y: GAME_HEIGHT + margin };
    case 'top':
      return { x: randRange(0, GAME_WIDTH), y: -margin };
    case 'left':
      return { x: -margin, y: randRange(0, GAME_HEIGHT) };
    case 'right':
      return { x: GAME_WIDTH + margin, y: randRange(0, GAME_HEIGHT) };
    case 'around':
    default: {
      const side = Math.floor(randRange(0, 4));
      if (side === 0) return { x: randRange(0, GAME_WIDTH), y: GAME_HEIGHT + margin };
      if (side === 1) return { x: randRange(0, GAME_WIDTH), y: -margin };
      if (side === 2) return { x: -margin, y: randRange(0, GAME_HEIGHT) };
      return { x: GAME_WIDTH + margin, y: randRange(0, GAME_HEIGHT) };
    }
  }
}

/** 弾やオブジェクトが画面外に十分出たか（cull用）。 */
export function isFarOffscreen(x: number, y: number, pad = 60): boolean {
  return x < -pad || x > GAME_WIDTH + pad || y < -pad || y > GAME_HEIGHT + pad;
}
