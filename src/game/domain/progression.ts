import type { Id, RunStats } from './types';

export type DifficultyId = 'easy' | 'normal' | 'hard';

export type DifficultyConfig = {
  id: DifficultyId;
  label: string;
  description: string;
  enemyHpMultiplier: number;
  enemyDamageMultiplier: number;
  enemySpeedMultiplier: number;
  spawnRateMultiplier: number;
  maxAliveMultiplier: number;
  xpMultiplier: number;
  shardMultiplier: number;
};

export type PermanentUpgradeId = 'maxHp' | 'might' | 'moveSpeed' | 'xpGain' | 'magnet' | 'shardGain' | 'cooldown' | 'reroll';

export type PermanentUpgradeDefinition = {
  id: PermanentUpgradeId;
  label: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  costStep: number;
  valuePerLevel: number;
  unit: '%' | '回';
};

export type CharacterProgress = {
  level: number;
  xp: number;
  totalXp: number;
};

export type ClearRecord = {
  cleared: boolean;
  bestSurvivedSec: number;
  bestKills: number;
  noBerserkClear: boolean;
};

export type SaveData = {
  version: 1;
  totalRuns: number;
  obsidianShards: number;
  totalObsidianShards: number;
  unlockedStages: number[];
  unlockedDifficulties: DifficultyId[];
  clearRecords: Record<string, ClearRecord>;
  permanentUpgrades: Record<PermanentUpgradeId, number>;
  characters: Record<Id, CharacterProgress>;
  codex: { enemies: Id[]; weapons: Id[]; evolutions: Id[] };
  achievements: Id[];
  prestige: { count: number; bonusMultiplier: number };
  updatedAt: string;
};

export type RunRewardBreakdown = {
  baseShards: number;
  survivalShards: number;
  killShards: number;
  clearBonus: number;
  difficultyBonus: number;
  noBerserkBonus: number;
  upgradeBonus: number;
  totalShards: number;
  characterXp: number;
  characterLevelBefore: number;
  characterLevelAfter: number;
  characterXpBefore: number;
  characterXpAfter: number;
};

const STORAGE_KEY = 'vampPon.save.v1';

export const DIFFICULTIES: Record<DifficultyId, DifficultyConfig> = {
  easy: { id: 'easy', label: 'EASY', description: '標準。まず気持ちよくクリアする夜。', enemyHpMultiplier: 1, enemyDamageMultiplier: 1, enemySpeedMultiplier: 1, spawnRateMultiplier: 1, maxAliveMultiplier: 1, xpMultiplier: 1, shardMultiplier: 1 },
  normal: { id: 'normal', label: 'NORMAL', description: '敵が濃くなる。経験値と黒曜片も増える。', enemyHpMultiplier: 1.28, enemyDamageMultiplier: 1.16, enemySpeedMultiplier: 1.04, spawnRateMultiplier: 1.16, maxAliveMultiplier: 1.14, xpMultiplier: 1.25, shardMultiplier: 1.35 },
  hard: { id: 'hard', label: 'HARD', description: '育成前提。密度は高いが報酬も大きい。', enemyHpMultiplier: 1.72, enemyDamageMultiplier: 1.42, enemySpeedMultiplier: 1.08, spawnRateMultiplier: 1.34, maxAliveMultiplier: 1.28, xpMultiplier: 1.55, shardMultiplier: 2 },
};

export const PERMANENT_UPGRADES: PermanentUpgradeDefinition[] = [
  { id: 'maxHp', label: '灯の器', description: '最大HPアップ。事故死が減る', maxLevel: 20, baseCost: 40, costStep: 18, valuePerLevel: 0.025, unit: '%' },
  { id: 'might', label: '小さな火力', description: '与ダメージアップ。敵が溶けやすい', maxLevel: 20, baseCost: 55, costStep: 24, valuePerLevel: 0.02, unit: '%' },
  { id: 'moveSpeed', label: '夜道の足取り', description: '移動速度アップ。回避と回収が快適', maxLevel: 15, baseCost: 45, costStep: 22, valuePerLevel: 0.015, unit: '%' },
  { id: 'xpGain', label: '記憶の吸収', description: 'ラン中の経験値アップ。序盤が気持ちよくなる', maxLevel: 20, baseCost: 50, costStep: 24, valuePerLevel: 0.025, unit: '%' },
  { id: 'magnet', label: '欠片の呼び声', description: '吸引範囲アップ。拾う快感を伸ばす', maxLevel: 15, baseCost: 38, costStep: 18, valuePerLevel: 0.025, unit: '%' },
  { id: 'shardGain', label: '黒曜の目利き', description: '黒曜片アップ。周回が報われる', maxLevel: 20, baseCost: 65, costStep: 32, valuePerLevel: 0.025, unit: '%' },
  { id: 'cooldown', label: '手数の記憶', description: '武器クールダウン短縮。弾幕が濃くなる', maxLevel: 15, baseCost: 58, costStep: 28, valuePerLevel: 0.012, unit: '%' },
  { id: 'reroll', label: '選び直しの栞', description: 'レベルアップ入替回数アップ', maxLevel: 5, baseCost: 120, costStep: 90, valuePerLevel: 1, unit: '回' },
];

export function defaultSaveData(): SaveData {
  return {
    version: 1,
    totalRuns: 0,
    obsidianShards: 0,
    totalObsidianShards: 0,
    unlockedStages: [1],
    unlockedDifficulties: ['easy'],
    clearRecords: {},
    permanentUpgrades: { maxHp: 0, might: 0, moveSpeed: 0, xpGain: 0, magnet: 0, shardGain: 0, cooldown: 0, reroll: 0 },
    characters: {},
    codex: { enemies: [], weapons: [], evolutions: [] },
    achievements: [],
    prestige: { count: 0, bonusMultiplier: 1 },
    updatedAt: new Date().toISOString(),
  };
}

export function loadSaveData(): SaveData {
  if (typeof window === 'undefined') return defaultSaveData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSaveData();
    return normalizeSaveData(JSON.parse(raw));
  } catch {
    return defaultSaveData();
  }
}

export function saveSaveData(save: SaveData): void {
  if (typeof window === 'undefined') return;
  const next = { ...save, updatedAt: new Date().toISOString() } satisfies SaveData;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function resetSaveData(): SaveData {
  const save = defaultSaveData();
  saveSaveData(save);
  return save;
}

export function clearRecordKey(stageNumber: number, difficulty: DifficultyId): string {
  return `stage${stageNumber}:${difficulty}`;
}

export function difficultyFromSearch(search = typeof window === 'undefined' ? '' : window.location.search): DifficultyId {
  const params = new URLSearchParams(search);
  const raw = params.get('difficulty') as DifficultyId | null;
  return raw && raw in DIFFICULTIES ? raw : 'easy';
}

export function getUpgradeLevel(save: SaveData, id: PermanentUpgradeId): number {
  return save.permanentUpgrades[id] ?? 0;
}

export function upgradeMultiplier(save: SaveData, id: PermanentUpgradeId): number {
  const def = PERMANENT_UPGRADES.find((u) => u.id === id);
  if (!def) return 1;
  return 1 + getUpgradeLevel(save, id) * def.valuePerLevel;
}

export function cooldownMultiplierFromSave(save: SaveData): number {
  const def = PERMANENT_UPGRADES.find((u) => u.id === 'cooldown')!;
  return Math.max(0.75, 1 - getUpgradeLevel(save, 'cooldown') * def.valuePerLevel);
}

export function upgradeCost(id: PermanentUpgradeId, currentLevel: number): number {
  const def = PERMANENT_UPGRADES.find((u) => u.id === id);
  if (!def || currentLevel >= def.maxLevel) return Infinity;
  return Math.floor(def.baseCost + currentLevel * def.costStep + currentLevel * currentLevel * def.costStep * 0.18);
}

export function buyPermanentUpgrade(id: PermanentUpgradeId): SaveData {
  const save = loadSaveData();
  const current = getUpgradeLevel(save, id);
  const cost = upgradeCost(id, current);
  if (!Number.isFinite(cost) || save.obsidianShards < cost) return save;
  save.obsidianShards -= cost;
  save.permanentUpgrades[id] = current + 1;
  saveSaveData(save);
  return save;
}

export function resetPermanentUpgrades(): SaveData {
  const save = loadSaveData();
  let refund = 0;
  for (const def of PERMANENT_UPGRADES) {
    const level = getUpgradeLevel(save, def.id);
    for (let i = 0; i < level; i += 1) refund += upgradeCost(def.id, i);
    save.permanentUpgrades[def.id] = 0;
  }
  save.obsidianShards += refund;
  saveSaveData(save);
  return save;
}

export function characterXpToNext(level: number): number {
  return Math.floor(80 + level * level * 28 + level * 22);
}

export function getCharacterProgress(save: SaveData, characterId: Id): CharacterProgress {
  return save.characters[characterId] ?? { level: 1, xp: 0, totalXp: 0 };
}

export function characterLevelMultiplier(level: number): number {
  return 1 + Math.max(0, level - 1) * 0.006;
}

export function settleRunRewards(input: {
  save: SaveData;
  stageNumber: number;
  difficulty: DifficultyId;
  characterId: Id;
  cleared: boolean;
  stats: RunStats;
}): { save: SaveData; rewards: RunRewardBreakdown } {
  const { save, stageNumber, difficulty, characterId, cleared, stats } = input;
  const diff = DIFFICULTIES[difficulty];
  const noBerserk = cleared && stats.ultimateUses >= 0 && !usedBerserkFromStats(stats);
  const survivalShards = Math.floor(Math.min(stats.survivedSec, 480) / 12);
  const killShards = Math.floor(stats.kills / 9);
  const baseShards = 8;
  const clearBonus = cleared ? 70 + stageNumber * 15 : 0;
  const beforeShardBonus = baseShards + survivalShards + killShards + clearBonus;
  const difficultyBonus = diff.shardMultiplier;
  const noBerserkBonus = noBerserk ? 1.2 : 1;
  const upgradeBonus = upgradeMultiplier(save, 'shardGain');
  const totalShards = Math.max(1, Math.floor(beforeShardBonus * difficultyBonus * noBerserkBonus * upgradeBonus));

  const characterXp = Math.max(1, Math.floor((stats.xpCollected * 0.34 + stats.kills * 1.6 + stats.survivedSec * 0.55 + (cleared ? 180 : 0)) * diff.xpMultiplier));
  const progressBefore = getCharacterProgress(save, characterId);
  let level = progressBefore.level;
  let xp = progressBefore.xp + characterXp;
  const characterXpBefore = progressBefore.xp;
  while (xp >= characterXpToNext(level)) {
    xp -= characterXpToNext(level);
    level += 1;
  }

  save.totalRuns += 1;
  save.obsidianShards += totalShards;
  save.totalObsidianShards += totalShards;
  save.characters[characterId] = { level, xp, totalXp: progressBefore.totalXp + characterXp };
  save.unlockedStages = uniqueNumbers([...save.unlockedStages, stageNumber, cleared ? stageNumber + 1 : stageNumber]).filter((n) => n >= 1 && n <= 5);
  if (cleared && difficulty === 'easy') save.unlockedDifficulties = uniqueDifficulties([...save.unlockedDifficulties, 'normal']);
  if (cleared && difficulty === 'normal') save.unlockedDifficulties = uniqueDifficulties([...save.unlockedDifficulties, 'hard']);

  const key = clearRecordKey(stageNumber, difficulty);
  const prev = save.clearRecords[key];
  save.clearRecords[key] = {
    cleared: cleared || prev?.cleared === true,
    bestSurvivedSec: Math.max(prev?.bestSurvivedSec ?? 0, stats.survivedSec),
    bestKills: Math.max(prev?.bestKills ?? 0, stats.kills),
    noBerserkClear: noBerserk || prev?.noBerserkClear === true,
  };

  for (const id of stats.evolutions) if (!save.codex.evolutions.includes(id)) save.codex.evolutions.push(id);
  if (cleared && !save.achievements.includes(`clear:${stageNumber}:${difficulty}`)) save.achievements.push(`clear:${stageNumber}:${difficulty}`);
  if (noBerserk && !save.achievements.includes(`no-berserk:${stageNumber}:${difficulty}`)) save.achievements.push(`no-berserk:${stageNumber}:${difficulty}`);

  saveSaveData(save);

  return {
    save,
    rewards: {
      baseShards,
      survivalShards,
      killShards,
      clearBonus,
      difficultyBonus,
      noBerserkBonus,
      upgradeBonus,
      totalShards,
      characterXp,
      characterLevelBefore: progressBefore.level,
      characterLevelAfter: level,
      characterXpBefore,
      characterXpAfter: xp,
    },
  };
}

function normalizeSaveData(raw: Partial<SaveData>): SaveData {
  const base = defaultSaveData();
  return {
    ...base,
    ...raw,
    unlockedStages: uniqueNumbers(raw.unlockedStages ?? base.unlockedStages),
    unlockedDifficulties: uniqueDifficulties(raw.unlockedDifficulties ?? base.unlockedDifficulties),
    permanentUpgrades: { ...base.permanentUpgrades, ...(raw.permanentUpgrades ?? {}) },
    characters: raw.characters ?? base.characters,
    clearRecords: raw.clearRecords ?? base.clearRecords,
    codex: { ...base.codex, ...(raw.codex ?? {}) },
    achievements: raw.achievements ?? base.achievements,
    prestige: raw.prestige ?? base.prestige,
  };
}

function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values.map((n) => Math.floor(n)).filter(Number.isFinite))].sort((a, b) => a - b);
}

function uniqueDifficulties(values: DifficultyId[]): DifficultyId[] {
  return (['easy', 'normal', 'hard'] as DifficultyId[]).filter((id) => values.includes(id));
}

function usedBerserkFromStats(stats: RunStats): boolean {
  return 'berserkUses' in stats && Number((stats as unknown as { berserkUses?: number }).berserkUses ?? 0) > 0;
}
