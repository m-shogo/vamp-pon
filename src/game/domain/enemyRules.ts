import type { EnemyBehavior, EnemyDefinition } from './types';
import { clamp, normalize } from '../utils/math';

/**
 * 敵まわりの純ロジック（Phaser非依存・テスト可能）。
 * 描画やゲームループから切り離し、挙動の数値を1か所に集める。
 */

/** memory_capsule のドロップ確率を 0〜1 に丸めて返す。 */
export function capsuleDropChanceFor(def: EnemyDefinition): number {
  const raw = def.drops?.find((d) => d.type === 'memory_capsule')?.chance ?? 0;
  return clamp(raw, 0, 1);
}

export type BehaviorStep = {
  dirX: number;
  dirY: number;
  speedFactor: number;
};

export type BehaviorInput = {
  behavior: EnemyBehavior;
  /** プレイヤー - 敵 のベクトル成分 */
  dx: number;
  dy: number;
  dist: number;
  offsetSign: number;
  iid: number;
  elapsedSec: number;
};

/** behavior ごとの進行方向（正規化済み）と速度倍率を返す。 */
export function computeBehaviorStep(input: BehaviorInput): BehaviorStep {
  let dir = normalize(input.dx, input.dy);
  let speedFactor = 1;

  switch (input.behavior) {
    case 'offset_chase':
      // 少し横にずれながら回り込む
      if (input.dist > 80) {
        const perp = { x: -dir.y, y: dir.x };
        dir = normalize(dir.x + perp.x * input.offsetSign * 0.6, dir.y + perp.y * input.offsetSign * 0.6);
      }
      break;
    case 'slow_chase':
      // 近いと少し減速（硬いが詰めは遅い）
      if (input.dist < 70) speedFactor = 0.5;
      break;
    case 'swarm_chase': {
      // 直線でなく少しばらけて群れる
      const wob = Math.sin(input.elapsedSec * 2 + input.iid) * 0.5 * input.offsetSign;
      const perp = { x: -dir.y, y: dir.x };
      dir = normalize(dir.x + perp.x * wob, dir.y + perp.y * wob);
      break;
    }
    case 'elite_chase':
      // 遠いと押し込む（止まらない圧）
      if (input.dist > 220) speedFactor = 1.25;
      break;
    case 'chase':
    default:
      break;
  }

  return { dirX: dir.x, dirY: dir.y, speedFactor };
}

/**
 * 敵定義の整合性チェック。問題があれば説明文字列、なければ null。
 * 「ロジック上のエリート(tags) と 見た目のエリート(visualKind) のズレ」を検出する。
 */
export function enemyConsistencyError(def: EnemyDefinition): string | null {
  const isEliteTag = def.tags.includes('elite');
  const isEliteVisual = def.visualKind === 'label_elite';
  if (isEliteTag !== isEliteVisual) {
    return `${def.id}: tags.elite=${isEliteTag} だが visualKind==='label_elite'=${isEliteVisual}（不一致）`;
  }
  return null;
}
