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
  rareItemSlots: 2,
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

/**
 * 色（紙片・絵本風 / 夜の街）。参考画像 assets/concept-design 基準。
 * 詳細な意味づけは docs/visual-direction.md / src/game/ui/visualDesign.ts。
 */
export const COLORS = {
  // 背景（藍紫の夜）
  background: 0x2a2747,
  backgroundEdge: 0x1d1a34,
  backgroundTile: 0x332f54,
  paperScrap: 0xb8aecb,
  mapLine: 0x4a4570,
  // プレイヤー（フード＋ランタン）
  player: 0xe9e2d0,
  playerHood: 0x5b6aa6,
  playerGlow: 0xffce7a,
  lantern: 0xffce7a,
  // 敵（黒インク影＋白目）
  enemyInk: 0x171328,
  enemyInkEdge: 0x3a3358,
  enemyEye: 0xf5f3ff,
  enemyElite: 0x140f22,
  enemyEliteEdge: 0x6b4f8a,
  inkPuddle: 0x1b1730,
  // 拾得物
  fragment: 0xffd45e,
  fragmentGlow: 0xfff0b0,
  capsule: 0xcfe6f0,
  healPaper: 0xf3e9cf,
  healMark: 0xd98a6a,
  // 武器/弾
  projectile: 0xf3e9cf,
  projectileStar: 0xffe08a,
  graphite: 0x4a4566,
  glass: 0xcfe6f0,
  ink: 0x1b1730,
  dawnWarm: 0xf6d9a8,
  dawnPink: 0xf3c9a0,
  // UI
  hpFill: 0xe0564f,
  hpBack: 0x3a2230,
  xpFill: 0x9b7fc0,
  xpBack: 0x2a2745,
  ultFill: 0xb9d3e6,
  ultReady: 0xfff0b0,
  cardBg: 0xf3e9cf,
  cardEdge: 0xb8a06a,
  cardText: 0x4a3f2a,
  overlay: 0x120f24,
  uiText: 0xf3ead2,
} as const;
