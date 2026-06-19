import type { RuntimeState } from '../runtime';

// ---------------------------------------------------------------------------
// 探索深度（旧「難易度」概念の置き換え）。表示は浅層 / 中層 / 深層。
// ---------------------------------------------------------------------------
export type ExplorationDepthId = 'shallow' | 'middle' | 'deep';

export type UpgradeId =
  | 'maxHp'
  | 'might'
  | 'moveSpeed'
  | 'xpGain'
  | 'magnet'
  | 'shardGain'
  | 'damageReduction'
  | 'ultimateCharge'
  | 'noBerserkBonus';

type CharacterProgress = { level: number; xp: number; totalXp: number };

export type PlayerProfile = {
  version: 1;
  /** 黒曜片（永続強化通貨）の所持数。 */
  currency: number;
  totalCurrencyEarned: number;
  selectedStage: number;
  selectedDepth: ExplorationDepthId;
  unlockedStages: number[];
  /** クリア記録。`stageClear:1` / `s1:shallow` のように記録する。 */
  clears: Record<string, true>;
  characterProgress: Record<string, CharacterProgress>;
  upgrades: Record<UpgradeId, number>;
  codex: Record<string, true>;
  achievements: Record<string, true>;
  prestige: { count: number; essence: number };
};

export type RunSettlement = {
  /** 今回のランで獲得した黒曜片。 */
  shardsEarned: number;
  /** 精算後の所持黒曜片。 */
  shardTotal: number;
  /** 倍率適用前の素点（floor 済み）。 */
  baseShards: number;
  depthMultiplier: number;
  shardGainMultiplier: number;
  noBerserkMultiplier: number;
  noBerserk: boolean;
  firstClearBonus: number;
  firstDepthClearBonus: number;
  characterXpEarned: number;
  characterLevelBefore: number;
  characterLevelAfter: number;
  characterXpInLevel: number;
  characterXpToNext: number;
  unlockedStage?: number;
};

export type ExplorationDepthConfig = {
  id: ExplorationDepthId;
  label: string;
  shortLabel: string;
  tint: number;
  enemyHp: number;
  enemyDamage: number;
  enemySpeed: number;
  spawnRate: number;
  spawnCount: number;
  maxAlive: number;
  xp: number;
  reward: number;
};

// プロンプト指定の倍率表。深層でも敵速度は上げすぎず、HPと敵数で圧を出す。
export const EXPLORATION_DEPTHS: Record<ExplorationDepthId, ExplorationDepthConfig> = {
  shallow: {
    id: 'shallow', label: '浅層', shortLabel: '浅', tint: 0x9bd7ff,
    enemyHp: 1, enemyDamage: 1, enemySpeed: 1, spawnRate: 1, spawnCount: 1, maxAlive: 1, xp: 1, reward: 1,
  },
  middle: {
    id: 'middle', label: '中層', shortLabel: '中', tint: 0xb99cff,
    enemyHp: 1.35, enemyDamage: 1.2, enemySpeed: 1.08, spawnRate: 1.18, spawnCount: 1.12, maxAlive: 1.15, xp: 1.35, reward: 1.35,
  },
  deep: {
    id: 'deep', label: '深層', shortLabel: '深', tint: 0xff9bd2,
    enemyHp: 1.8, enemyDamage: 1.45, enemySpeed: 1.13, spawnRate: 1.32, spawnCount: 1.2, maxAlive: 1.3, xp: 1.8, reward: 2,
  },
};

export const EXPLORATION_DEPTH_ORDER: ExplorationDepthId[] = ['shallow', 'middle', 'deep'];

export type UpgradeGroup = '攻撃' | '生存' | '回収' | '稼ぎ' | '黒曜化';

export type UpgradeDefinition = {
  id: UpgradeId;
  name: string;
  group: UpgradeGroup;
  maxLevel: number;
  baseCost: number;
  /** 1レベルあたりの効果量（割合）。表示にも使う。 */
  valuePerLevel: number;
  /** 効果が「減らす」方向か（被ダメ軽減用）。 */
  negative?: boolean;
  description: string;
};

export const UPGRADE_DEFS: Record<UpgradeId, UpgradeDefinition> = {
  maxHp: { id: 'maxHp', name: '丈夫な灯芯', group: '生存', maxLevel: 20, baseCost: 35, valuePerLevel: 0.04, description: '最大HPが増える。事故死が減る' },
  might: { id: 'might', name: '夜を払う力', group: '攻撃', maxLevel: 20, baseCost: 45, valuePerLevel: 0.03, description: '与ダメージが上がる。敵が溶けやすい' },
  moveSpeed: { id: 'moveSpeed', name: '軽い靴音', group: '生存', maxLevel: 15, baseCost: 35, valuePerLevel: 0.015, description: '移動速度が上がる。回避と回収が快適' },
  xpGain: { id: 'xpGain', name: '記憶の吸い込み', group: '回収', maxLevel: 20, baseCost: 45, valuePerLevel: 0.03, description: 'ラン中の経験値が増える' },
  magnet: { id: 'magnet', name: '迷子の呼び声', group: '回収', maxLevel: 15, baseCost: 30, valuePerLevel: 0.04, description: '欠片の吸引範囲が広がる' },
  shardGain: { id: 'shardGain', name: '黒曜片の目印', group: '稼ぎ', maxLevel: 20, baseCost: 55, valuePerLevel: 0.04, description: '黒曜片の獲得量が増える' },
  damageReduction: { id: 'damageReduction', name: 'にじまない紙片', group: '生存', maxLevel: 15, baseCost: 60, valuePerLevel: 0.02, negative: true, description: '受けるダメージを減らす（最大30%）' },
  ultimateCharge: { id: 'ultimateCharge', name: '灯りの呼吸', group: '攻撃', maxLevel: 15, baseCost: 45, valuePerLevel: 0.03, description: '必殺ゲージが早くたまる' },
  noBerserkBonus: { id: 'noBerserkBonus', name: '黒に頼らない道', group: '黒曜化', maxLevel: 10, baseCost: 70, valuePerLevel: 0.02, description: '黒曜化を使わずに終えた時の報酬倍率が増える' },
};

export const UPGRADE_ORDER: UpgradeId[] = [
  'maxHp', 'might', 'moveSpeed', 'xpGain', 'magnet', 'shardGain', 'damageReduction', 'ultimateCharge', 'noBerserkBonus',
];

// 被ダメ軽減の下限（=最大軽減30%）。
const DAMAGE_REDUCTION_FLOOR = 0.7;
// 黒曜化未使用ボーナスの基礎倍率。
const NO_BERSERK_BASE = 1.2;
const CHARACTER_LEVEL_CAP = 50;

const STORAGE_KEY = 'vamp-pon:profile:v1';
const LEGACY_STORAGE_KEYS = ['vampPon.playerProfile.v1'];

function emptyUpgrades(): Record<UpgradeId, number> {
  return {
    maxHp: 0, might: 0, moveSpeed: 0, xpGain: 0, magnet: 0,
    shardGain: 0, damageReduction: 0, ultimateCharge: 0, noBerserkBonus: 0,
  };
}

export function getDefaultProfile(): PlayerProfile {
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

/** 後方互換のための別名。 */
export const createDefaultProfile = getDefaultProfile;

function normalizeUpgrades(raw: unknown): Record<UpgradeId, number> {
  const base = emptyUpgrades();
  if (!raw || typeof raw !== 'object') return base;
  const obj = raw as Record<string, unknown>;
  // 旧キー currencyGain -> shardGain への移行。
  if (obj.currencyGain != null && obj.shardGain == null) obj.shardGain = obj.currencyGain;
  for (const id of UPGRADE_ORDER) {
    const value = Number(obj[id] ?? 0);
    base[id] = Number.isFinite(value) ? Math.max(0, Math.min(UPGRADE_DEFS[id].maxLevel, Math.floor(value))) : 0;
  }
  return base;
}

function normalizeProfile(raw: unknown): PlayerProfile {
  const base = getDefaultProfile();
  if (!raw || typeof raw !== 'object') return base;
  const obj = raw as Partial<PlayerProfile> & Record<string, unknown>;
  return {
    ...base,
    ...obj,
    version: 1,
    currency: Math.max(0, Math.floor(Number(obj.currency ?? 0)) || 0),
    totalCurrencyEarned: Math.max(0, Math.floor(Number(obj.totalCurrencyEarned ?? 0)) || 0),
    selectedStage: Math.max(1, Math.floor(Number(obj.selectedStage ?? 1)) || 1),
    selectedDepth: obj.selectedDepth && EXPLORATION_DEPTHS[obj.selectedDepth as ExplorationDepthId] ? (obj.selectedDepth as ExplorationDepthId) : 'shallow',
    unlockedStages: Array.from(new Set([1, ...(Array.isArray(obj.unlockedStages) ? obj.unlockedStages : [])]))
      .filter((n) => Number.isFinite(n) && n >= 1)
      .sort((a, b) => a - b),
    clears: isPlainObject(obj.clears) ? (obj.clears as Record<string, true>) : {},
    characterProgress: { ...base.characterProgress, ...(isPlainObject(obj.characterProgress) ? (obj.characterProgress as Record<string, CharacterProgress>) : {}) },
    upgrades: normalizeUpgrades(obj.upgrades),
    codex: isPlainObject(obj.codex) ? (obj.codex as Record<string, true>) : {},
    achievements: isPlainObject(obj.achievements) ? (obj.achievements as Record<string, true>) : {},
    prestige: isPlainObject(obj.prestige) ? { count: Math.max(0, Math.floor(Number((obj.prestige as { count?: number }).count ?? 0)) || 0), essence: Math.max(0, Math.floor(Number((obj.prestige as { essence?: number }).essence ?? 0)) || 0) } : base.prestige,
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readRaw(): string | null {
  if (typeof window === 'undefined') return null;
  const current = window.localStorage.getItem(STORAGE_KEY);
  if (current != null) return current;
  for (const legacy of LEGACY_STORAGE_KEYS) {
    const value = window.localStorage.getItem(legacy);
    if (value != null) return value;
  }
  return null;
}

export function loadProfile(): PlayerProfile {
  try {
    const raw = readRaw();
    return normalizeProfile(raw ? JSON.parse(raw) : null);
  } catch {
    // 壊れた localStorage でもゲームが起動できるよう、必ずデフォルトへフォールバック。
    return getDefaultProfile();
  }
}

export function saveProfile(profile: PlayerProfile): PlayerProfile {
  const normalized = normalizeProfile(profile);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch {
      // 保存に失敗してもゲーム進行は止めない。
    }
  }
  return normalized;
}

export function selectRun(stage: number, depth: ExplorationDepthId): PlayerProfile {
  const profile = loadProfile();
  profile.selectedStage = Math.max(1, Math.floor(stage));
  profile.selectedDepth = EXPLORATION_DEPTHS[depth] ? depth : 'shallow';
  return saveProfile(profile);
}

export function depthForState(state: Pick<RuntimeState, 'explorationDepth'>): ExplorationDepthConfig {
  return EXPLORATION_DEPTHS[state.explorationDepth] ?? EXPLORATION_DEPTHS.shallow;
}

// ---------------------------------------------------------------------------
// キャラレベル
// ---------------------------------------------------------------------------
/** 現在レベルから次レベルまでに必要なキャラ経験値。Lv1→2 は 100。 */
export function characterXpToNext(level: number): number {
  return Math.floor(100 * Math.pow(Math.max(1, level), 1.35));
}

export function getCharacterProgress(profile: PlayerProfile, characterId: string): CharacterProgress {
  return profile.characterProgress[characterId] ?? { level: 1, xp: 0, totalXp: 0 };
}

/** キャラレベルによる小さな永続補正。強くなりすぎないよう控えめ。 */
export function characterLevelBonus(characterId: string, profile = loadProfile()) {
  const progress = getCharacterProgress(profile, characterId);
  const level = progress.level;
  return {
    level,
    hpFlat: Math.max(0, level - 1) * 1, // Lvごと +1
    mightMultiplier: 1 + Math.floor(level / 5) * 0.01, // 5Lvごと +1%
    magnetMultiplier: 1 + Math.floor(level / 10) * 0.02, // 10Lvごと +2%
    moveSpeedMultiplier: 1 + Math.floor(level / 10) * 0.01, // 10Lvごと +1%
  };
}

// ---------------------------------------------------------------------------
// 永続強化
// ---------------------------------------------------------------------------
export function getUpgradeLevel(id: UpgradeId, profile = loadProfile()): number {
  return Math.max(0, Math.min(UPGRADE_DEFS[id].maxLevel, profile.upgrades[id] ?? 0));
}

/** 序盤は軽く、後半は重く。level は現在レベル（0始まり）。 */
export function upgradeCost(id: UpgradeId, level: number): number {
  const def = UPGRADE_DEFS[id];
  if (level >= def.maxLevel) return Infinity;
  return Math.round((def.baseCost * Math.pow(level + 1, 1.55)) / 5) * 5;
}

export function getUpgradeRefundAmount(profile = loadProfile()): number {
  let total = 0;
  for (const id of UPGRADE_ORDER) {
    const level = getUpgradeLevel(id, profile);
    for (let i = 0; i < level; i += 1) total += upgradeCost(id, i);
  }
  return total;
}

/** 黒曜片を消費して 1 レベル強化する。買えない場合は profile をそのまま返す。 */
export function spendUpgrade(id: UpgradeId, inputProfile?: PlayerProfile): PlayerProfile {
  const profile = inputProfile ? normalizeProfile(inputProfile) : loadProfile();
  const current = getUpgradeLevel(id, profile);
  if (current >= UPGRADE_DEFS[id].maxLevel) return saveProfile(profile);
  const cost = upgradeCost(id, current);
  if (!Number.isFinite(cost) || profile.currency < cost) return saveProfile(profile);
  profile.currency -= cost;
  profile.upgrades[id] = current + 1;
  return saveProfile(profile);
}

/** 全強化をリセットし、消費した黒曜片を 100% 返還する。 */
export function resetUpgrades(inputProfile?: PlayerProfile): PlayerProfile {
  const profile = inputProfile ? normalizeProfile(inputProfile) : loadProfile();
  profile.currency += getUpgradeRefundAmount(profile);
  profile.upgrades = emptyUpgrades();
  return saveProfile(profile);
}

/** 永続強化＋キャラレベルから、ラン開始時に適用する各種倍率を計算する。 */
export function profileBonuses(profile = loadProfile()) {
  const lvl = (id: UpgradeId) => getUpgradeLevel(id, profile);
  return {
    maxHpMultiplier: 1 + lvl('maxHp') * UPGRADE_DEFS.maxHp.valuePerLevel,
    mightMultiplier: 1 + lvl('might') * UPGRADE_DEFS.might.valuePerLevel,
    moveSpeedMultiplier: 1 + lvl('moveSpeed') * UPGRADE_DEFS.moveSpeed.valuePerLevel,
    xpMultiplier: 1 + lvl('xpGain') * UPGRADE_DEFS.xpGain.valuePerLevel,
    magnetMultiplier: 1 + lvl('magnet') * UPGRADE_DEFS.magnet.valuePerLevel,
    shardMultiplier: 1 + lvl('shardGain') * UPGRADE_DEFS.shardGain.valuePerLevel,
    damageTakenMultiplier: Math.max(DAMAGE_REDUCTION_FLOOR, 1 - lvl('damageReduction') * UPGRADE_DEFS.damageReduction.valuePerLevel),
    ultimateChargeMultiplier: 1 + lvl('ultimateCharge') * UPGRADE_DEFS.ultimateCharge.valuePerLevel,
    noBerserkMultiplier: NO_BERSERK_BASE + lvl('noBerserkBonus') * UPGRADE_DEFS.noBerserkBonus.valuePerLevel,
  };
}

// ---------------------------------------------------------------------------
// リザルト精算
// ---------------------------------------------------------------------------
export function stageClearKey(stage: number): string {
  return `stageClear:${stage}`;
}

export function depthClearKey(stage: number, depth: ExplorationDepthId): string {
  return `s${stage}:${depth}`;
}

/** 1ランの結果をプロフィールへ精算し、獲得内訳を返す。保存も行う。 */
export function settleRun(state: RuntimeState, cleared: boolean, inputProfile?: PlayerProfile): RunSettlement {
  const profile = inputProfile ? normalizeProfile(inputProfile) : loadProfile();
  const depth = depthForState(state);
  const stats = state.stats;
  const bonuses = profileBonuses(profile);

  const depthKey = depthClearKey(state.stageNumber, state.explorationDepth);
  const stageKey = stageClearKey(state.stageNumber);
  const firstClear = cleared && !profile.clears[stageKey];
  const firstDepthClear = cleared && !profile.clears[depthKey];
  const noBerserk = stats.berserkUses === 0;

  // 黒曜片
  const baseRaw =
    stats.survivedSec * 0.25 +
    stats.kills * 0.35 +
    stats.memoryFragmentsCollected * 0.12 +
    stats.capsulesOpened * 8 +
    (cleared ? 120 : 0);
  const baseShards = Math.floor(baseRaw);
  const depthMultiplier = depth.reward;
  const shardGainMultiplier = bonuses.shardMultiplier;
  const noBerserkMultiplier = noBerserk ? bonuses.noBerserkMultiplier : 1;
  const firstClearBonus = firstClear ? 100 : 0;
  const firstDepthClearBonus = firstDepthClear ? 80 : 0;
  let shardsEarned = Math.floor(baseShards * depthMultiplier * shardGainMultiplier * noBerserkMultiplier) + firstClearBonus + firstDepthClearBonus;
  // 最低保証
  const floorShards = cleared ? 150 : stats.survivedSec >= 60 ? 10 : 1;
  shardsEarned = Math.max(floorShards, shardsEarned);

  // キャラ経験値
  const characterXpEarned = Math.max(
    1,
    Math.floor((stats.survivedSec * 0.4 + stats.kills * 0.5 + state.player.level * 8 + (cleared ? 180 : 0)) * depth.xp),
  );
  const progress = getCharacterProgress(profile, state.characterId);
  const characterLevelBefore = progress.level;
  let level = progress.level;
  let xp = progress.xp + characterXpEarned;
  while (level < CHARACTER_LEVEL_CAP && xp >= characterXpToNext(level)) {
    xp -= characterXpToNext(level);
    level += 1;
  }
  if (level >= CHARACTER_LEVEL_CAP) xp = 0;
  profile.characterProgress[state.characterId] = { level, xp, totalXp: progress.totalXp + characterXpEarned };

  // 通貨
  profile.currency += shardsEarned;
  profile.totalCurrencyEarned += shardsEarned;

  // 解放・記録
  let unlockedStage: number | undefined;
  if (cleared) {
    profile.clears[stageKey] = true;
    profile.clears[depthKey] = true;
    const next = Math.min(state.stageNumber + 1, 99);
    if (!profile.unlockedStages.includes(next)) {
      profile.unlockedStages.push(next);
      profile.unlockedStages.sort((a, b) => a - b);
      unlockedStage = next;
    }
  }

  // 図鑑・実績（領域だけ最低限埋める）
  profile.codex[`stage:${state.stageNumber}`] = true;
  profile.codex[`depth:${state.explorationDepth}`] = true;
  for (const id of stats.evolutions) profile.codex[`evolution:${id}`] = true;
  if (cleared) profile.achievements[`clear:${depthKey}`] = true;
  if (cleared && noBerserk) profile.achievements[`no-berserk:${depthKey}`] = true;

  saveProfile(profile);

  return {
    shardsEarned,
    shardTotal: profile.currency,
    baseShards,
    depthMultiplier,
    shardGainMultiplier,
    noBerserkMultiplier,
    noBerserk,
    firstClearBonus,
    firstDepthClearBonus,
    characterXpEarned,
    characterLevelBefore,
    characterLevelAfter: level,
    characterXpInLevel: xp,
    characterXpToNext: level >= CHARACTER_LEVEL_CAP ? 0 : characterXpToNext(level),
    unlockedStage,
  };
}
