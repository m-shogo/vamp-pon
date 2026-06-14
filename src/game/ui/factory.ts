import Phaser from 'phaser';
import { COLORS, ENEMY_RADIUS, PICKUP } from '../domain/constants';
import type { EnemyDefinition } from '../domain/types';
import { STROKE, GLOW_ALPHA_MAX } from './visualDesign';

/** 敵タグから当たり/見た目半径を決める。 */
export function enemyRadiusFor(def: EnemyDefinition): number {
  if (def.tags.includes('elite')) return ENEMY_RADIUS.elite;
  if (def.tags.includes('small')) return ENEMY_RADIUS.small;
  return ENEMY_RADIUS.medium;
}

const DEPTH = {
  background: 0,
  area: 5,
  capsule: 8,
  pickup: 10,
  enemy: 20,
  projectile: 25,
  orbiter: 28,
  player: 30,
  hud: 100,
  overlay: 200,
};

export const VIEW_DEPTH = DEPTH;

/**
 * プレイヤー（ユイ）: フードの小さな主人公 + 手元の小さなランタン。
 * 参考: style_sprite-sheet_01 / style_gameplay_02。暗い背景でも輪郭が読める。
 */
export function createPlayerView(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const c = scene.add.container(x, y);
  // 足元の暖かい光
  const glow = scene.add.circle(0, 4, 24, COLORS.playerGlow, GLOW_ALPHA_MAX * 0.5);
  // ワンピース（裾広がりの台形を三角で近似）
  const dress = scene.add.triangle(0, 5, -10, 10, 10, 10, 0, -8, COLORS.player, 1);
  dress.setStrokeStyle(STROKE.base, COLORS.cardEdge, 0.8);
  // フード/頭
  const hood = scene.add.circle(0, -8, 8, COLORS.playerHood, 1);
  hood.setStrokeStyle(STROKE.base, 0x46527e, 1);
  const face = scene.add.circle(0, -5, 4.5, COLORS.player, 1);
  // 手元のランタン
  const lanternGlow = scene.add.circle(10, 6, 8, COLORS.lantern, GLOW_ALPHA_MAX);
  const lantern = scene.add.circle(10, 6, 3.2, COLORS.lantern, 1);
  lantern.setStrokeStyle(STROKE.thin, 0xb88a3a, 1);
  c.add([glow, dress, hood, face, lanternGlow, lantern]);
  c.setDepth(DEPTH.player);
  return c;
}

/** 敵: 黒インクの影 + 白い目 + 足元のインク溜まり。visualKindで形が変わる。 */
export function createEnemyView(
  scene: Phaser.Scene,
  def: EnemyDefinition,
  radius: number,
): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const kind = def.visualKind;
  const isElite = kind === 'label_elite';
  const fill = isElite ? COLORS.enemyElite : COLORS.enemyInk;
  const edge = isElite ? COLORS.enemyEliteEdge : COLORS.enemyInkEdge;
  const baseAlpha = kind === 'haze' ? 0.55 : 1;

  // 足元のインク溜まり（にじみ）
  const puddle = scene.add.ellipse(0, radius * 0.6, radius * 2.3, radius * 1.1, COLORS.inkPuddle, 0.6);

  // 本体（黒インクのしずく。上が細く下が丸いインクらしさ）
  const blob = scene.add.circle(0, 0, radius, fill, baseAlpha);
  blob.setStrokeStyle(STROKE.base, edge, 0.85);
  // インクのにじみ突起
  const bumpL = scene.add.circle(-radius * 0.55, radius * 0.4, radius * 0.4, fill, baseAlpha);
  const bumpR = scene.add.circle(radius * 0.55, radius * 0.4, radius * 0.4, fill, baseAlpha);

  const behind: Phaser.GameObjects.GameObject[] = [puddle];
  const front: Phaser.GameObjects.GameObject[] = [];
  let eyeHigh = false;

  switch (kind) {
    case 'paper_scrap': {
      // 紙くずが刺さった影
      const scrap = scene.add.rectangle(radius * 0.5, -radius * 0.6, radius * 0.85, radius * 0.6, COLORS.paperScrap, 0.92);
      scrap.setStrokeStyle(STROKE.thin, COLORS.cardEdge, 0.7);
      scrap.setAngle(24);
      const scrap2 = scene.add.rectangle(-radius * 0.5, -radius * 0.4, radius * 0.55, radius * 0.42, COLORS.paperScrap, 0.7);
      scrap2.setAngle(-18);
      front.push(scrap2, scrap);
      break;
    }
    case 'signpost': {
      // 小さな道しるべの影
      const post = scene.add.rectangle(0, -radius - 5, STROKE.bold, 12, COLORS.cardEdge, 0.9);
      const arm = scene.add.triangle(radius * 0.2, -radius - 8, 0, 0, 9, 4, 0, 8, COLORS.cardBg, 0.92);
      const arm2 = scene.add.triangle(-radius * 0.2, -radius - 2, 0, 0, -9, 4, 0, 8, COLORS.paperScrap, 0.8);
      front.push(post, arm, arm2);
      break;
    }
    case 'capsule': {
      // 忘れ物（カプセル/小瓶）を抱えた硬い影
      const ring = scene.add.ellipse(0, 0, radius * 1.5, radius * 2.0, edge, 0);
      ring.setStrokeStyle(STROKE.base, edge, 0.5);
      const cork = scene.add.rectangle(0, -radius, radius * 0.7, 5, COLORS.lantern, 0.9);
      behind.push(ring);
      front.push(cork);
      break;
    }
    case 'haze': {
      // にじんだ薄い影
      behind.push(
        scene.add.circle(-radius * 0.5, radius * 0.3, radius * 0.75, fill, 0.28),
        scene.add.circle(radius * 0.5, radius * 0.2, radius * 0.75, fill, 0.28),
        scene.add.circle(0, -radius * 0.4, radius * 0.65, fill, 0.28),
      );
      break;
    }
    case 'label_elite': {
      // 黒いラベル/封印紙を持つ影
      const ring = scene.add.circle(0, 0, radius + 3, edge, 0);
      ring.setStrokeStyle(STROKE.base, edge, 0.5);
      const label = scene.add.rectangle(0, radius * 0.1, radius * 1.5, radius * 0.55, COLORS.cardBg, 0.95);
      label.setStrokeStyle(STROKE.thin, COLORS.cardEdge, 0.9);
      // 名前を塗りつぶした黒線
      const strike = scene.add.rectangle(0, radius * 0.1, radius * 1.2, radius * 0.18, COLORS.enemyInk, 0.95);
      behind.push(ring);
      front.push(label, strike);
      eyeHigh = true;
      break;
    }
    case 'ink_blob':
    default:
      break;
  }

  // 白い目
  const eyeY = eyeHigh ? -radius * 0.45 : -radius * 0.12;
  const eyeDx = radius * 0.34;
  const eyeR = Math.max(1.6, radius * 0.14);
  const eyeL = scene.add.circle(-eyeDx, eyeY, eyeR, COLORS.enemyEye);
  const eyeRr = scene.add.circle(eyeDx, eyeY, eyeR, COLORS.enemyEye);

  c.add([...behind, bumpL, bumpR, blob, ...front, eyeL, eyeRr]);
  c.setDepth(DEPTH.enemy);
  c.setData('blob', blob);
  c.setData('baseFill', fill);
  c.setData('baseAlpha', baseAlpha);
  return c;
}

export type ProjectileVisualKind =
  | 'pencil'
  | 'pencil_line'
  | 'name_line'
  | 'star'
  | 'paper_lantern'
  | 'blade'
  | 'envelope_blade'
  | 'glass_marble'
  | 'lens_marble'
  | 'paper_airplane'
  | 'big_plane';

export type AreaVisualKind = 'ink' | 'lamp' | 'dawn';

/**
 * 弾の見た目。武器の意味が一目で分かるモチーフ。
 * 紙・インク・灯り・ガラスで作る。レーザー/ビーム/ギラ星は禁止。
 */
export function createProjectileView(
  scene: Phaser.Scene,
  kind: ProjectileVisualKind,
  radius: number,
): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);

  switch (kind) {
    case 'pencil': {
      // 紙に書いた短い濃い線（鉛筆）
      const mark = scene.add.rectangle(0, 0, radius * 3.0, radius * 1.0, COLORS.projectile, 0.98);
      const lead = scene.add.triangle(radius * 1.5, 0, 0, -radius * 0.6, radius * 0.9, 0, 0, radius * 0.6, COLORS.graphite, 1);
      c.add([mark, lead]);
      break;
    }
    case 'pencil_line': {
      // 未完成の一行: 長い掠れた鉛筆の一行（ビームではない）
      const line = scene.add.rectangle(0, 0, radius * 7.2, radius * 1.1, COLORS.projectile, 0.97);
      const dash1 = scene.add.rectangle(-radius * 1.6, 0, radius * 1.6, radius * 1.1, COLORS.graphite, 0.5);
      const dash2 = scene.add.rectangle(radius * 1.2, 0, radius * 1.0, radius * 1.1, COLORS.graphite, 0.35);
      const lead = scene.add.triangle(radius * 3.6, 0, 0, -radius * 0.8, radius * 1.2, 0, 0, radius * 0.8, COLORS.graphite, 1);
      c.add([line, dash1, dash2, lead]);
      break;
    }
    case 'name_line': {
      // 消えない名前: 鉛筆の線 + 末尾の名前札（短冊）
      const line = scene.add.rectangle(0, 0, radius * 5.4, radius * 1.05, COLORS.projectile, 0.97);
      const ink = scene.add.rectangle(-radius * 0.6, 0, radius * 3.0, radius * 0.4, COLORS.enemyInk, 0.85);
      const tag = scene.add.rectangle(-radius * 3.0, 0, radius * 1.2, radius * 2.0, COLORS.cardBg, 0.95);
      tag.setStrokeStyle(STROKE.thin, COLORS.cardEdge, 1);
      const lead = scene.add.triangle(radius * 2.7, 0, 0, -radius * 0.8, radius * 1.1, 0, 0, radius * 0.8, COLORS.graphite, 1);
      c.add([tag, line, ink, lead]);
      break;
    }
    case 'star': {
      // 星くず: 小さな金の光（控えめ）
      const glow = scene.add.circle(0, 0, radius + 3, COLORS.fragmentGlow, GLOW_ALPHA_MAX);
      const star = scene.add.star(0, 0, 4, radius * 0.45, radius + 1, COLORS.fragment, 1);
      c.add([glow, star]);
      break;
    }
    case 'paper_lantern': {
      // 北極星のランタン: 小さな紙ランタンの灯り + 地図の点
      const glow = scene.add.circle(0, 0, radius + 4, COLORS.lantern, GLOW_ALPHA_MAX);
      const lamp = scene.add.circle(0, 0, radius * 0.85, COLORS.lantern, 1);
      lamp.setStrokeStyle(STROKE.thin, 0xb88a3a, 1);
      const dot = scene.add.circle(0, 0, radius * 0.3, COLORS.fragmentGlow, 1);
      c.add([glow, lamp, dot]);
      break;
    }
    case 'blade': {
      // 絵はがきカッター: 薄い紙片、端だけ鋭い
      const card = scene.add.rectangle(0, 0, radius * 4.2, radius * 1.5, COLORS.cardBg, 0.96);
      card.setStrokeStyle(STROKE.thin, COLORS.cardEdge, 0.9);
      const edge = scene.add.rectangle(radius * 1.6, 0, radius * 1.2, radius * 1.5, COLORS.fragment, 0.85);
      c.add([card, edge]);
      break;
    }
    case 'envelope_blade': {
      // 宛先のない刃: 封の切れ目が紙刃に
      const card = scene.add.rectangle(0, 0, radius * 4.0, radius * 1.6, COLORS.cardBg, 0.96);
      card.setStrokeStyle(STROKE.thin, COLORS.cardEdge, 1);
      const flap = scene.add.triangle(-radius * 0.6, 0, -radius * 1.6, -radius * 0.8, radius * 0.6, 0, -radius * 1.6, radius * 0.8, COLORS.cardEdge, 0.7);
      const edge = scene.add.rectangle(radius * 1.5, 0, radius * 1.0, radius * 1.6, COLORS.fragment, 0.8);
      c.add([card, flap, edge]);
      break;
    }
    case 'glass_marble': {
      const glow = scene.add.circle(0, 0, radius + 2, COLORS.glass, GLOW_ALPHA_MAX * 0.7);
      const ball = scene.add.circle(0, 0, radius, COLORS.glass, 0.9);
      ball.setStrokeStyle(STROKE.thin, 0xffffff, 0.6);
      const hi = scene.add.circle(-radius * 0.3, -radius * 0.3, radius * 0.28, 0xffffff, 0.8);
      c.add([glow, ball, hi]);
      break;
    }
    case 'lens_marble': {
      // 追憶のビー玉: 大きめガラス + ひび + 中に景色の色
      const glow = scene.add.circle(0, 0, radius + 4, COLORS.glass, GLOW_ALPHA_MAX * 0.7);
      const ball = scene.add.circle(0, 0, radius * 1.4, COLORS.glass, 0.85);
      ball.setStrokeStyle(STROKE.base, 0xffffff, 0.6);
      const tint = scene.add.circle(radius * 0.2, radius * 0.2, radius * 0.6, COLORS.dawnPink, 0.4);
      const crack1 = scene.add.rectangle(0, 0, radius * 2.4, STROKE.thin, COLORS.cardText, 0.7).setAngle(30);
      const crack2 = scene.add.rectangle(radius * 0.3, 0, radius * 1.4, STROKE.thin, COLORS.cardText, 0.6).setAngle(-48);
      c.add([glow, ball, tint, crack1, crack2]);
      break;
    }
    case 'paper_airplane': {
      const glow = scene.add.triangle(0, 0, -radius * 1.8, radius * 1.1, radius * 2.2, 0, -radius * 1.8, -radius * 1.1, COLORS.paperScrap, GLOW_ALPHA_MAX * 0.5);
      const plane = scene.add.triangle(0, 0, -radius * 1.6, radius, radius * 2.1, 0, -radius * 1.6, -radius, COLORS.cardBg, 0.96);
      plane.setStrokeStyle(STROKE.thin, COLORS.cardEdge, 0.9);
      const fold = scene.add.rectangle(-radius * 0.1, 0, radius * 2.6, STROKE.thin, COLORS.cardEdge, 0.9);
      c.add([glow, plane, fold]);
      break;
    }
    case 'big_plane': {
      // 追い風の紙ひこうき: 大きめ + 折り目 + 風線
      const wind = scene.add.rectangle(-radius * 2.6, 0, radius * 3.0, STROKE.thin, COLORS.paperScrap, 0.4);
      const plane = scene.add.triangle(0, 0, -radius * 2.2, radius * 1.4, radius * 3.0, 0, -radius * 2.2, -radius * 1.4, COLORS.cardBg, 0.97);
      plane.setStrokeStyle(STROKE.base, COLORS.cardEdge, 0.95);
      const fold = scene.add.rectangle(0, 0, radius * 3.6, STROKE.thin, COLORS.cardEdge, 1);
      const fold2 = scene.add.rectangle(-radius * 0.6, radius * 0.5, radius * 1.8, STROKE.thin, COLORS.cardEdge, 0.6);
      c.add([wind, plane, fold, fold2]);
      break;
    }
  }
  c.setDepth(DEPTH.projectile);
  return c;
}

/** 地面のインクだまり / 街灯の輪 / 夜明けの輪。 */
export function createAreaView(scene: Phaser.Scene, radius: number, kind: AreaVisualKind = 'ink'): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  if (kind === 'dawn') {
    // 合体: 黒インクの染み + 街灯の丸い光 + 朝色（魔法陣にしない）
    const ink = scene.add.ellipse(0, 0, radius * 2.0, radius * 1.7, COLORS.ink, 0.5);
    ink.setStrokeStyle(STROKE.bold, COLORS.enemyInkEdge, 0.5);
    const dawnFill = scene.add.circle(0, 0, radius * 0.85, COLORS.dawnPink, 0.16);
    const lampRing = scene.add.circle(0, 0, radius * 0.9, COLORS.lantern, 0.1);
    lampRing.setStrokeStyle(5, COLORS.dawnWarm, 0.7);
    const inner = scene.add.circle(0, 0, radius * 0.4, COLORS.lantern, GLOW_ALPHA_MAX * 0.5);
    // にじみの突起
    const splash: Phaser.GameObjects.GameObject[] = [];
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2 + 0.4;
      splash.push(scene.add.circle(Math.cos(a) * radius * 0.95, Math.sin(a) * radius * 0.8, radius * 0.22, COLORS.ink, 0.45));
    }
    c.add([ink, ...splash, dawnFill, lampRing, inner]);
  } else if (kind === 'lamp') {
    // 街灯の輪: 紙に落ちた丸い暖光（ネオンにしない）
    const glow = scene.add.circle(0, 0, radius + 6, COLORS.lantern, 0.08);
    const pool = scene.add.circle(0, 0, radius, COLORS.lantern, 0.14);
    pool.setStrokeStyle(STROKE.bold, COLORS.lantern, 0.5);
    const inner = scene.add.circle(0, 0, radius * 0.45, COLORS.dawnWarm, 0.1);
    c.add([glow, pool, inner]);
  } else {
    // 黒インクの染み（紙に染みた感じ）
    const pool = scene.add.ellipse(0, 0, radius * 2.0, radius * 1.7, COLORS.ink, 0.55);
    pool.setStrokeStyle(STROKE.base, COLORS.enemyInkEdge, 0.4);
    const splash: Phaser.GameObjects.GameObject[] = [];
    for (let i = 0; i < 4; i += 1) {
      const a = (i / 4) * Math.PI * 2 + 0.6;
      splash.push(scene.add.circle(Math.cos(a) * radius * 0.9, Math.sin(a) * radius * 0.75, radius * 0.24, COLORS.ink, 0.5));
    }
    c.add([pool, ...splash]);
  }
  c.setDepth(DEPTH.area);
  return c;
}

/** 月のしおり（オービター）: 紙のしおり。 */
export function createOrbiterView(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const glow = scene.add.circle(0, 0, 9, COLORS.lantern, GLOW_ALPHA_MAX * 0.6);
  const mark = scene.add.rectangle(0, 0, 8, 14, COLORS.cardBg, 1);
  mark.setStrokeStyle(STROKE.thin, COLORS.cardEdge, 1);
  // しおりの先の切れ込み（V）と月のしるし
  const notch = scene.add.triangle(0, 7, -4, 0, 4, 0, 0, 4, COLORS.background, 1);
  const moon = scene.add.circle(0, -3, 2.2, COLORS.lantern, 0.9);
  c.add([glow, mark, notch, moon]);
  c.setDepth(DEPTH.orbiter);
  return c;
}

/** 記憶の欠片: 金の星 + 柔らかい光（参考: item_memory-fragment）。 */
export function createPickupView(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const glow = scene.add.circle(0, 0, PICKUP.visualSize, COLORS.fragmentGlow, GLOW_ALPHA_MAX);
  const star = scene.add.star(0, 0, 5, PICKUP.visualSize * 0.36, PICKUP.visualSize * 0.8, COLORS.fragment, 1);
  star.setStrokeStyle(STROKE.thin, 0xffe9a8, 0.8);
  c.add([glow, star]);
  c.setDepth(DEPTH.pickup);
  return c;
}

/** 回復ドロップ: 朝色の絆創膏/包帯紙（緑の十字にしない）。 */
export function createHealPickupView(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const glow = scene.add.circle(0, 0, PICKUP.visualSize + 4, COLORS.dawnWarm, GLOW_ALPHA_MAX);
  // 包帯紙（細長い紙）を斜めに重ねる
  const strip = scene.add.rectangle(0, 0, 18, 9, COLORS.healPaper, 0.97);
  strip.setStrokeStyle(STROKE.thin, COLORS.healMark, 0.9);
  strip.setAngle(20);
  // 留めのステッチ
  const stitch1 = scene.add.rectangle(-3, 0, STROKE.thin, 7, COLORS.healMark, 0.8).setAngle(20);
  const stitch2 = scene.add.rectangle(3, 0, STROKE.thin, 7, COLORS.healMark, 0.8).setAngle(20);
  c.add([glow, strip, stitch1, stitch2]);
  c.setDepth(DEPTH.pickup);
  return c;
}

/** 記憶カプセル: コルク付きの小瓶の中に小さな星が光る（参考: item_memory-fragment）。 */
export function createCapsuleView(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const glow = scene.add.circle(0, 2, 16, COLORS.fragmentGlow, GLOW_ALPHA_MAX);
  // ガラス瓶
  const body = scene.add.rectangle(0, 2, 14, 19, COLORS.glass, 0.5);
  body.setStrokeStyle(STROKE.base, 0xffffff, 0.7);
  const shoulder = scene.add.rectangle(0, -7, 9, 4, COLORS.glass, 0.5);
  shoulder.setStrokeStyle(STROKE.thin, 0xffffff, 0.6);
  // コルク
  const cork = scene.add.rectangle(0, -12, 8, 5, 0xb88a4a, 1);
  // 中の星
  const star = scene.add.star(0, 3, 5, 2.5, 6, COLORS.fragment, 1);
  c.add([glow, body, shoulder, cork, star]);
  c.setDepth(DEPTH.capsule);
  return c;
}
