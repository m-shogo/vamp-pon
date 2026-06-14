import type { GameStatus } from './types';

export const GAME_STATUS: Record<Uppercase<GameStatus>, GameStatus> = {
  READY: 'ready',
  PLAYING: 'playing',
  LEVELUP: 'levelUp',
  CAPSULE: 'capsule',
  PAUSED: 'paused',
  CLEARED: 'cleared',
  GAMEOVER: 'gameOver',
};

export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;

export const DEFAULT_GAME_CONFIG = {
  orientation: 'portrait',
  logicalWidth: GAME_WIDTH,
  logicalHeight: GAME_HEIGHT,
  durationSec: 480,
  maxEnemies: 140,
  maxPickups: 250,
  maxProjectiles: 140,
  weaponSlots: 5,
  passiveSlots: 5,
} as const;

export const PLAYER_DEFAULTS = {
  hp: 110,
  moveSpeed: 115,
  radius: 15,
  visualSize: 36,
  invulnSec: 0.75,
} as const;

export const LEVEL_UP = {
  choices: 3,
  lowHpRatio: 0.35,
  healAmount: 28,
  rerollsPerRun: 3,
} as const;

/** スポーン関連（utils/viewport が参照）。 */
export const SPAWN = {
  offscreenMin: 40,
  offscreenMax: 80,
  minPlayerDist: 145,
} as const;

/** 記憶の欠片（pickups）。 */
export const PICKUP = {
  collectRadius: 22,
  magnetRange: 95,
  magnetSpeed: 280,
  visualSize: 11,
} as const;

/** 弾の共通設定。 */
export const PROJECTILE = {
  nightPencilSpeed: 340,
  radius: 5,
  lifeSec: 3.2,
} as const;

/** 必殺技（ユイ: 消えない名前）。 */
export const ULTIMATE = {
  chargeSeconds: 60,
} as const;

/** エンティティ当たり半径の基準（タグ別の見た目/判定）。 */
export const ENEMY_RADIUS = {
  small: 15,
  medium: 18,
  elite: 30,
} as const;

/** 色（紙片・絵本風 / 夜の街）。 */
export const COLORS = {
  background: 0x1d2236,
  backgroundTile: 0x30364f,
  player: 0xf4d9a6,
  playerGlow: 0xffce7a,
  lantern: 0xffd166,
  enemyInk: 0x26243a,
  enemyInkEdge: 0x5d5a86,
  enemyEye: 0xf5f3ff,
  enemyElite: 0x3a2540,
  enemyEliteEdge: 0x9b5fb0,
  fragment: 0xffd45e,
  fragmentGlow: 0xfff1b0,
  capsule: 0xbfe6ff,
  projectile: 0xfff0c2,
  projectileStar: 0xffe08a,
  ink: 0x241f3a,
  hpFill: 0xe06b6b,
  hpBack: 0x3a2230,
  xpFill: 0xffd45e,
  xpBack: 0x2a2740,
  ultFill: 0x8fd0ff,
  ultReady: 0xfff1b0,
  cardBg: 0xf3ead2,
  cardEdge: 0xc9b894,
  cardText: 0x3a3326,
  overlay: 0x0a0916,
  uiText: 0xf3ead2,
} as const;
