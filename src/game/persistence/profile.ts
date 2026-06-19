import type { RuntimeState } from '../runtime';

export type ExplorationDepthId = 'shallow' | 'middle' | 'deep';
export type UpgradeId =
  | 'maxHp'
  | 'might'
  | 'moveSpeed'
  | 'xpGain'
  | 'magnet'
  | 'currencyGain'
  | 'damageReduction'
  | 'ultimateCharge'
  | 'noBerserkBonus';

type CharacterProgress = { level: number; xp: number; totalXp: number };

export type PlayerProfile = {
  version: 1;
  currency: number;
  totalCurrencyEarned: number;
  selectedStage: number;
  selectedDepth: ExplorationDepthId;
  unlockedStages: number[];
  clears: Record<string, true>;
  characterProgress: Record<string, CharacterProgress>;
  upgrades: Record<UpgradeId, number>;
  codex: Record<string, true>;
  achievements: Record<string, true>;
  prestige: { count: number; essence: number };
};

export type RunSettlement = {
  currencyEarned: number;
  characterXpEarned: number;
  characterLevelBefore: number;
  characterLevelAfter: number;
  depthBonus: number;
  noBerserkBonus: number;
  firstClearBonus: number;
  unlockedStage?: number;
};

export const EXPLORATION_DEPTHS: Record<ExplorationDepthId, {
  id: ExplorationDepthId;
  label: string;
  tint: number;
  enemyHp: number;
  enemyDamage: number;
  enemySpeed: number;
  spawnRate: number;
  spawnCount: number;
  maxAlive: number;
  xp: number;
  reward: number;
}> = {
  shallow: {
    id: 'shallow',
    label: '浅層',
    tint: 0x9bd7ff,
    enemyHp: 1,
    enemyDamage: 1,
    enemySpeed: 1,
    spawnRate: 1,
    spawnCount: 1,
    maxAlive: 1,
    xp: 1,
    reward: 1,
  },
  middle: {
    id: 'middle',
    label: '中層',
    tint: 0xb99cff,
    enemyHp: 1.32,
    enemyDamage: 1.18,
    enemySpeed: 1.04,
    spawnRate: 1.18,
    spawnCount: 1.15,
    maxAlive: 1.14,
    xp: 1.28,
    reward: 1.38,
  },
  deep: {
    id: 'deep',
    label: '深層',
    tint: 0xff9bd2,
    enemyHp: 1.72,
    enemyDamage: 1.42,
    enemySpeed: 1.08,
    spawnRate: 1.34,
    spawnCount: 1.28,
    maxAlive: 1.25,
    xp: 1.62,
    reward: 2,
  },
};

export const UPGRADE_DEFS: Record<UpgradeId, {
  id: UpgradeId;
  name: string;
  group: '攻撃' | '生存' | '回収' | '稼ぎ' | '黒曜化';
  maxLevel: number;
  baseCost: number;
  costStep: number;
  description: string;
}> = {
  maxHp: { id: 'maxHp', name: '丈夫な灯芯', group: '生存', maxLevel: 20, baseCost: 35, costStep: 1.23, description: '最大HPが少しずつ増える' },
  might: { id: 'might', name: '夜を払う力', group: '攻撃', maxLevel: 20, baseCost: 45, costStep: 1.25, description: '武器の威力が上がる' },
  moveSpeed: { id: 'moveSpeed', name: '軽い靴音', group: '生存', maxLevel: 12, baseCost: 40, costStep: 1.24, description: '移動速度が上がる' },
  xpGain: { id: 'xpGain', name: '記憶の吸い込み', group: '回収', maxLevel: 16, baseCost: 50, costStep: 1.27, description: 'ラン中の経験値が増える' },
  magnet: { id: 'magnet', name: '迷子の呼び声', group: '回収', maxLevel: 14, baseCost: 38, costStep: 1.23, description: '欠片の吸引範囲が広がる' },
  currencyGain: { id: 'currencyGain', name: '黒曜片の目印', group: '稼ぎ', maxLevel: 18, baseCost: 55, costStep: 1.28, description: '黒曜片の獲得量が増える' },
  damageReduction: { id: 'damageReduction', name: 'にじまない紙片', group: '生存', maxLevel: 14, baseCost: 58, costStep: 1.29, description: '受けるダメージを減らす' },
  ultimateCharge: { id: 'ultimateCharge', name: '灯りの呼吸', group: '攻撃', maxLevel: 12, baseCost: 60, costStep: 1.28, description: '必殺ゲージが早くたまる' },
  noBerserkBonus: { id: 'noBerserkBonus', name: '黒に頼らない道', group: '黒曜化', maxLevel: 10, baseCost: 70, costStep: 1.3, description: '黒曜化未使用の報酬倍率が増える' },
};

const STORAGE_KEY = 'vampPon.playerProfile.v1';
const CHARACTER_XP_BASE = 80;
const CHARACTER_XP_STEP = 34;

function emptyUpgrades(): Record<UpgradeId, number> {
  return {
    maxHp: 0,
    might: 0,
    moveSpeed: 0,
    xpGain: 0,
    magnet: 0,
    currencyGain: 0,
    damageReduction: 0,
    ultimateCharge: 0,
    noBerserkBonus: 0,
  };
}

export function createDefaultProfile(): PlayerProfile {
  return {
    version: 1,
    currency: 0,
    totalCurrencyEarned: 0,
    selectedStage: 1,
    selectedDepth: 'shallow',
    unlockedStages: [1],
    clears: {},
    characterProgress: { yui: { level: 1, xp: 0, totalXp: 0 } },
    upgrades: emptyUpgrades(),
    codex: {},
    achievements: {},
    prestige: { count: 0, essence: 0 },
  };
}

function normalizeProfile(raw: unknown): PlayerProfile {
  const base = createDefaultProfile();
  if (!raw || typeof raw !== 'object') return base;
  const obj = raw as Partial<PlayerProfile>;
  return {
    ...base,
    ...obj,
    currency: Math.max(0, Math.floor(Number(obj.currency ?? 0))),
    totalCurrencyEarned: Math.max(0, Math.floor(Number(obj.totalCurrencyEarned ?? 0))),
    selectedStage: Math.max(1, Math.floor(Number(obj.selectedStage ?? 1))),
    selectedDepth: obj.selectedDepth && EXPLORATION_DEPTHS[obj.selectedDepth] ? obj.selectedDepth : 'shallow',
    unlockedStages: Array.from(new Set([1, ...(obj.unlockedStages ?? [])])).filter((n) => Number.isFinite(n) && n >= 1).sort((a, b) => a - b),
    clears: obj.clears ?? {},
    characterProgress: { ...base.characterProgress, ...(obj.characterProgress ?? {}) },
    upgrades: { ...base.upgrades, ...(obj.upgrades ?? {}) },
    codex: obj.codex ?? {},
    achievements: obj.achievements ?? {},
    prestige: obj.prestige ?? base.prestige,
  };
}

export function loadProfile(): PlayerProfile {
  if (typeof window === 'undefined') return createDefaultProfile();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normalizeProfile(raw ? JSON.parse(raw) : null);
  } catch {
    return createDefaultProfile();
  }
}

export function saveProfile(profile: PlayerProfile): PlayerProfile {
  const normalized = normalizeProfile(profile);
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function selectRun(stage: number, depth: ExplorationDepthId): PlayerProfile {
  const profile = loadProfile();
  profile.selectedStage = Math.max(1, Math.floor(stage));
  profile.selectedDepth = depth;
  return saveProfile(profile);
}

export function depthForState(state: Pick<RuntimeState, 'explorationDepth'>): typeof EXPLORATION_DEPTHS[ExplorationDepthId] {
  return EXPLORATION_DEPTHS[state.explorationDepth ?? 'shallow'];
}

export function characterXpToNext(level: number): number {
  return CHARACTER_XP_BASE + (level - 1) * CHARACTER_XP_STEP;
}

export function upgradeCost(id: UpgradeId, level: number): number {
  const def = UPGRADE_DEFS[id];
  return Math.floor(def.baseCost * Math.pow(def.costStep, Math.max(0, level)) / 5) * 5;
}

export function getUpgradeLevel(id: UpgradeId, profile = loadProfile()): number {
  return Math.max(0, Math.min(UPGRADE_DEFS[id].maxLevel, profile.upgrades[id] ?? 0));
}

export function upgradeRefundValue(profile = loadProfile()): number {
  let total = 0;
  for (const id of Object.keys(UPGRADE_DEFS) as UpgradeId[]) {
    const level = getUpgradeLevel(id, profile);
    for (let i = 0; i < level; i += 1) total += upgradeCost(id, i);
  }
  return total;
}

export function buyUpgrade(id: UpgradeId): PlayerProfile {
  const profile = loadProfile();
  const current = getUpgradeLevel(id, profile);
  if (current >= UPGRADE_DEFS[id].maxLevel) return profile;
  const cost = upgradeCost(id, current);
  if (profile.currency < cost) return profile;
  profile.currency -= cost;
  profile.upgrades[id] = current + 1;
  return saveProfile(profile);
}

export function resetUpgrades(): PlayerProfile {
  const profile = loadProfile();
  profile.currency += upgradeRefundValue(profile);
  profile.upgrades = emptyUpgrades();
  return saveProfile(profile);
}

export function profileBonuses(profile = loadProfile()) {
  const up = (id: UpgradeId) => getUpgradeLevel(id, profile);
  return {
    maxHpMultiplier: 1 + up('maxHp') * 0.025,
    mightMultiplier: 1 + up('might') * 0.025,
    moveSpeedMultiplier: 1 + up('moveSpeed') * 0.018,
    xpMultiplier: 1 + up('xpGain') * 0.035,
    magnetMultiplier: 1 + up('magnet') * 0.045,
    currencyMultiplier: 1 + up('currencyGain') * 0.04,
    damageTakenMultiplier: Math.max(0.72, 1 - up('damageReduction') * 0.018),
    ultimateChargeMultiplier: 1 + up('ultimateCharge') * 0.035,
    noBerserkMultiplier: 1.2 + up('noBerserkBonus') * 0.025,
  };
}

export function characterLevelBonus(characterId: string, profile = loadProfile()) {
  const progress = profile.characterProgress[characterId] ?? { level: 1, xp: 0, totalXp: 0 };
  const over = Math.max(0, progress.level - 1);
  return {
    level: progress.level,
    hpFlat: over * 2,
    mightMultiplier: 1 + over * 0.006,
  };
}

export function settleRunProgress(state: RuntimeState, cleared: boolean): RunSettlement {
  const profile = loadProfile();
  const depth = EXPLORATION_DEPTHS[state.explorationDepth];
  const key = `s${state.stageNumber}:${state.explorationDepth}`;
  const firstClear = cleared && !profile.clears[key];
  const noBerserk = state.stats.berserkUses === 0;
  const bonuses = profileBonuses(profile);
  const baseCurrency =
    state.stats.kills * 0.35 +
    state.stats.memoryFragmentsCollected * 0.7 +
    state.stats.capsulesOpened * 10 +
    state.stats.evolutions.length * 18 +
    state.player.level * 4 +
    state.stats.survivedSec * 0.08 +
    (cleared ? 90 : 0);
  const noBerserkBonus = noBerserk ? bonuses.noBerserkMultiplier : 1;
  const firstClearBonus = firstClear ? 1.75 : 1;
  const currencyEarned = Math.max(1, Math.floor(baseCurrency * depth.reward * bonuses.currencyMultiplier * noBerserkBonus * firstClearBonus));
  const characterXpEarned = Math.max(1, Math.floor((state.stats.survivedSec * 0.6 + state.stats.kills * 0.8 + (cleared ? 120 : 0)) * depth.reward));

  const progress = profile.characterProgress[state.characterId] ?? { level: 1, xp: 0, totalXp: 0 };
  const before = progress.level;
  progress.xp += characterXpEarned;
  progress.totalXp += characterXpEarned;
  while (progress.xp >= characterXpToNext(progress.level)) {
    progress.xp -= characterXpToNext(progress.level);
    progress.level += 1;
  }
  profile.characterProgress[state.characterId] = progress;
  profile.currency += currencyEarned;
  profile.totalCurrencyEarned += currencyEarned;

  let unlockedStage: number | undefined;
  if (cleared) {
    profile.clears[key] = true;
    const next = Math.min(state.stageNumber + 1, 99);
    if (!profile.unlockedStages.includes(next)) {
      profile.unlockedStages.push(next);
      profile.unlockedStages.sort((a, b) => a - b);
      unlockedStage = next;
    }
  }

  profile.codex[`stage:${state.stageNumber}`] = true;
  profile.codex[`depth:${state.explorationDepth}`] = true;
  if (cleared) profile.achievements[`clear:${key}`] = true;
  if (noBerserk && cleared) profile.achievements[`no-berserk:${key}`] = true;
  saveProfile(profile);

  return {
    currencyEarned,
    characterXpEarned,
    characterLevelBefore: before,
    characterLevelAfter: progress.level,
    depthBonus: depth.reward,
    noBerserkBonus,
    firstClearBonus,
    unlockedStage,
  };
}
