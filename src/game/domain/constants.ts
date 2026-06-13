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

export const DEFAULT_GAME_CONFIG = {
  orientation: 'portrait',
  logicalWidth: 390,
  logicalHeight: 844,
  durationSec: 480,
  maxEnemies: 140,
  maxPickups: 250,
  maxProjectiles: 120,
  weaponSlots: 4,
  passiveSlots: 4,
} as const;

export const PLAYER_DEFAULTS = {
  hp: 100,
  moveSpeed: 100,
  xpToNext: 14,
} as const;

export const LEVEL_UP = {
  choices: 3,
  lowHpRatio: 0.35,
  healAmount: 20,
} as const;
