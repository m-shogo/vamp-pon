import Phaser from 'phaser';
import { COLORS } from '../domain/constants';
import type { EvolutionKind } from '../domain/types';

/**
 * Vamp Pon ビジュアルトークン。
 * 紙片・絵本風ドット / 夜の街。色・形・glowをここに集約し、
 * effects/factory/overlays に派手な値を直書きしない。
 *
 * 禁止: ネオン / SFビーム / 魔法陣 / ギラ星 / 光量だけで強さを出す。
 * 原則: 控えめなstroke、低いglow、モチーフ（紙・インク・灯り・地図）で意味を出す。
 */

/** stroke 太さの基準。 */
export const STROKE = { thin: 1, base: 2, bold: 3 } as const;

/** glow の透明度上限。これを超えて光らせない。 */
export const GLOW_ALPHA_MAX = 0.35;

/** 進化種別ごとの見た目アクセント（派手さではなくモチーフ差で分ける）。 */
export const EVOLUTION_ACCENT: Record<EvolutionKind, { main: number; sub: number; rings: number }> = {
  // 強化進化: 元武器の延長。控えめな暖色。リング1本。
  upgrade: { main: COLORS.lantern, sub: COLORS.fragmentGlow, rings: 1 },
  // 合体: 2モチーフ。黒インク + 朝の灯り。リング2本。
  fusion: { main: COLORS.dawnWarm, sub: COLORS.ink, rings: 2 },
  // 覚醒: レアの意味が宿る。紙寄りの淡い菫 + 金。やや神秘。リング2本。
  awakening: { main: 0xc7aee0, sub: COLORS.fragment, rings: 2 },
};

export const FONT = '"Hiragino Sans", "Yu Gothic", sans-serif';

/* ------------------------------------------------------------------ *
 * 紙片・絵本風のモチーフ部品。
 * 各ヘルパーは (0,0) を中心に GameObject(s) を生成して返す。
 * 呼び出し側が Container に add して配置する。
 * ------------------------------------------------------------------ */

/** 淡い紙片（背景の散り紙 / カード装飾）。 */
export function createPaperScrap(
  scene: Phaser.Scene,
  size: number,
  color = COLORS.paperScrap,
  alpha = 0.7,
): Phaser.GameObjects.Rectangle {
  const r = scene.add.rectangle(0, 0, size, size * 0.72, color, alpha);
  r.setStrokeStyle(STROKE.thin, COLORS.cardEdge, alpha * 0.5);
  r.setAngle((Math.random() - 0.5) * 40);
  return r;
}

/** 黒インクのにじみ（敵の下/弾の染み）。複数円で不規則に。 */
export function createInkBlot(
  scene: Phaser.Scene,
  radius: number,
  color = COLORS.inkPuddle,
  alpha = 0.55,
): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  c.add(scene.add.ellipse(0, 0, radius * 2.1, radius * 1.5, color, alpha));
  for (let i = 0; i < 4; i += 1) {
    const a = (i / 4) * Math.PI * 2 + Math.random();
    const d = radius * (0.7 + Math.random() * 0.5);
    c.add(scene.add.circle(Math.cos(a) * d, Math.sin(a) * d * 0.7, radius * (0.3 + Math.random() * 0.3), color, alpha));
  }
  return c;
}

/** 地図帳の細い線（つながりを表す）。 */
export function createMapLine(scene: Phaser.Scene, length: number): Phaser.GameObjects.Rectangle {
  const line = scene.add.rectangle(0, 0, length, STROKE.thin, COLORS.mapLine, 0.7);
  return line;
}

/** 小さな街灯/ランタンの丸い灯り（glow控えめ）。 */
export function createSmallLampGlow(scene: Phaser.Scene, radius: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  c.add(scene.add.circle(0, 0, radius, COLORS.lantern, GLOW_ALPHA_MAX * 0.5));
  c.add(scene.add.circle(0, 0, radius * 0.5, COLORS.lantern, GLOW_ALPHA_MAX));
  return c;
}

/** 名前札（短冊）のしるし。覚醒「消えない名前」用。 */
export function createNameTagMark(scene: Phaser.Scene, h: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const tag = scene.add.rectangle(0, 0, h * 0.5, h, COLORS.cardBg, 0.96);
  tag.setStrokeStyle(STROKE.thin, COLORS.cardEdge, 1);
  const ink = scene.add.rectangle(0, 0, h * 0.22, h * 0.6, COLORS.enemyInk, 0.9);
  c.add([tag, ink]);
  return c;
}

/** ひび割れたレンズのしるし。覚醒「追憶のビー玉」用。 */
export function createCrackedLensMark(scene: Phaser.Scene, radius: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const crack1 = scene.add.rectangle(0, 0, radius * 1.8, STROKE.thin, COLORS.cardText, 0.8).setAngle(28);
  const crack2 = scene.add.rectangle(radius * 0.3, 0, radius * 1.0, STROKE.thin, COLORS.cardText, 0.7).setAngle(-50);
  c.add([crack1, crack2]);
  return c;
}

/** 封筒の切れ目のしるし。覚醒「宛先のない刃」用。 */
export function createEnvelopeMark(scene: Phaser.Scene, size: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const flapL = scene.add.triangle(0, 0, -size, -size * 0.5, 0, 0, -size, size * 0.5, COLORS.cardEdge, 0.85);
  const flapR = scene.add.triangle(0, 0, size, -size * 0.5, 0, 0, size, size * 0.5, COLORS.cardBg, 0.95);
  c.add([flapL, flapR]);
  return c;
}

/** 風のしるし（控えめな線）。覚醒「追い風の紙ひこうき」用。 */
export function createWindMark(scene: Phaser.Scene, length: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  c.add(scene.add.rectangle(0, -2, length, STROKE.thin, COLORS.paperScrap, 0.55));
  c.add(scene.add.rectangle(-length * 0.1, 2, length * 0.7, STROKE.thin, COLORS.paperScrap, 0.4));
  return c;
}
