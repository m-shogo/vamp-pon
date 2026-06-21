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

export type ChargerPhase = 'windup' | 'dash' | 'recovery';

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

export function chargerPhaseFor(input: Pick<BehaviorInput, 'iid' | 'elapsedSec'>): ChargerPhase {
  const phase = (input.elapsedSec + (input.iid % 7) * 0.17) % 3.2;
  if (phase < 1.15) return 'windup';
  if (phase < 1.75) return 'dash';
  return 'recovery';
}

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
    case 'charger': {
      // 予兆→突進→硬直の周期。硬くせず、避ける気持ちよさを作る。
      const phase = chargerPhaseFor(input);
      if (phase === 'windup') {
        speedFactor = 0.34;
      } else if (phase === 'dash') {
        speedFactor = 2.65;
      } else {
        speedFactor = 0.18;
      }
      break;
    }
    case 'orbit_chase': {
      // 近距離で円を描き、真正面から来るだけの単調さを崩す。
      const perp = { x: -dir.y, y: dir.x };
      const orbitBias = input.dist < 190 ? 1.25 : 0.45;
      dir = normalize(dir.x * 0.55 + perp.x * input.offsetSign * orbitBias, dir.y * 0.55 + perp.y * input.offsetSign * orbitBias);
      speedFactor = input.dist < 120 ? 0.78 : 1.05;
      break;
    }
    case 'coward':
      // 近づくと逃げる。倒すために追う/位置取りする小目標を作る。
      if (input.dist < 155) {
        dir = normalize(-input.dx, -input.dy);
        speedFactor = 1.25;
      } else if (input.dist > 230) {
        speedFactor = 0.7;
      } else {
        const perp = { x: -dir.y, y: dir.x };
        dir = normalize(perp.x * input.offsetSign, perp.y * input.offsetSign);
        speedFactor = 0.85;
      }
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
