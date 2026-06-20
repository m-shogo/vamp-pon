export type ParticleQuality = 'low' | 'normal' | 'high';

export type FpsTargets = {
  ideal: number;
  target: number;
  improveBelow: number;
  ngBelow: number;
};

export type GameFeelRuntimeSettings = {
  particleQuality: ParticleQuality;
  damageNumbers: boolean;
  lowSpecMode: boolean;
  screenShake: boolean;
  maxEnemiesScale: number;
};

export type EnemyCap = { soft: number; hard: number; multiplier: number };

export type GameFeelConfig = {
  enemyDensityMultiplierByTime: { startSec: number; multiplier: number }[];
  maxEnemiesSoftCap: number;
  maxEnemiesHardCap: number;
  spawnIntervalMin: number;
  spawnIntervalMax: number;
  expGemValueScale: number;
  earlyLevelTargetSec: { level2Min: number; level2Max: number; level3Min: number; level3Max: number };
  particleQuality: ParticleQuality;
  maxParticles: number;
  maxDamageNumbers: number;
  hitStopMs: { hit: number; levelUp: number; evolution: number };
  screenShakeIntensity: { hit: number; playerDamage: number; levelUp: number; evolution: number };
  audioVolumeDefaults: { master: number; bgm: number; se: number };
  lowSpecMode: boolean;
  fpsTargets: FpsTargets;
};

const SETTINGS_STORAGE_KEY = 'vampPon.gameFeel.settings.v1';

export const GAME_FEEL_CONFIG: GameFeelConfig = {
  enemyDensityMultiplierByTime: [
    { startSec: 0, multiplier: 1.5 },
    { startSec: 60, multiplier: 2.0 },
    { startSec: 180, multiplier: 2.5 },
    { startSec: 420, multiplier: 3.0 },
  ],
  maxEnemiesSoftCap: 118,
  maxEnemiesHardCap: 140,
  spawnIntervalMin: 0.12,
  spawnIntervalMax: 1.1,
  expGemValueScale: 0.72,
  earlyLevelTargetSec: {
    level2Min: 30,
    level2Max: 50,
    level3Min: 70,
    level3Max: 90,
  },
  particleQuality: 'normal',
  maxParticles: 130,
  maxDamageNumbers: 28,
  hitStopMs: {
    hit: 12,
    levelUp: 90,
    evolution: 140,
  },
  screenShakeIntensity: {
    hit: 0.0015,
    playerDamage: 0.006,
    levelUp: 0.0025,
    evolution: 0.0045,
  },
  audioVolumeDefaults: {
    master: 0.82,
    bgm: 0.42,
    se: 0.74,
  },
  lowSpecMode: false,
  fpsTargets: {
    ideal: 60,
    target: 55,
    improveBelow: 50,
    ngBelow: 40,
  },
};

export function enemyDensityMultiplierForTime(elapsedSec: number): number {
  let multiplier = GAME_FEEL_CONFIG.enemyDensityMultiplierByTime[0]?.multiplier ?? 1;
  for (const point of GAME_FEEL_CONFIG.enemyDensityMultiplierByTime) {
    if (elapsedSec >= point.startSec) multiplier = point.multiplier;
  }
  return multiplier;
}

export function loadGameFeelSettings(): GameFeelRuntimeSettings {
  const defaults: GameFeelRuntimeSettings = {
    particleQuality: GAME_FEEL_CONFIG.particleQuality,
    damageNumbers: true,
    lowSpecMode: GAME_FEEL_CONFIG.lowSpecMode,
    screenShake: true,
    maxEnemiesScale: 1,
  };
  if (typeof window === 'undefined') return defaults;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<GameFeelRuntimeSettings>;
    return {
      particleQuality: parsed.particleQuality === 'low' || parsed.particleQuality === 'normal' || parsed.particleQuality === 'high'
        ? parsed.particleQuality
        : defaults.particleQuality,
      damageNumbers: typeof parsed.damageNumbers === 'boolean' ? parsed.damageNumbers : defaults.damageNumbers,
      lowSpecMode: typeof parsed.lowSpecMode === 'boolean' ? parsed.lowSpecMode : defaults.lowSpecMode,
      screenShake: typeof parsed.screenShake === 'boolean' ? parsed.screenShake : defaults.screenShake,
      maxEnemiesScale: typeof parsed.maxEnemiesScale === 'number' && Number.isFinite(parsed.maxEnemiesScale)
        ? Math.max(0.7, Math.min(1.2, parsed.maxEnemiesScale))
        : defaults.maxEnemiesScale,
    };
  } catch {
    return defaults;
  }
}

export function saveGameFeelSettings(settings: GameFeelRuntimeSettings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage may be blocked; settings are optional.
  }
}

export function maxEnemiesForElapsed(elapsedSec: number, absoluteHardCap = Number.POSITIVE_INFINITY): EnemyCap {
  const settings = loadGameFeelSettings();
  const density = enemyDensityMultiplierForTime(elapsedSec);
  const specScale = settings.lowSpecMode ? 0.72 : settings.maxEnemiesScale;
  const rawSoft = Math.max(36, Math.floor(GAME_FEEL_CONFIG.maxEnemiesSoftCap * Math.min(1, density / 2.5) * specScale));
  const configuredHard = Math.max(rawSoft + 8, Math.floor(GAME_FEEL_CONFIG.maxEnemiesHardCap * specScale));
  const hard = Math.max(1, Math.min(configuredHard, absoluteHardCap));
  return { soft: Math.min(rawSoft, hard), hard, multiplier: density };
}
