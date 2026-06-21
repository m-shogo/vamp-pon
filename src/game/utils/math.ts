import type { Vec2 } from '../domain/types';

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}

export function distanceSq(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

/** 単位ベクトル化。長さ0なら {0,0}。 */
export function normalize(x: number, y: number): Vec2 {
  const len = Math.hypot(x, y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function randomAngle(): number {
  return Math.random() * Math.PI * 2;
}

export function angleToVec(angle: number): Vec2 {
  return { x: Math.cos(angle), y: Math.sin(angle) };
}
