export type Id = string;

export type Vec2 = {
  x: number;
  y: number;
};

export type GameStatus = 'ready' | 'playing' | 'levelUp' | 'capsule' | 'paused' | 'cleared' | 'gameOver';

export type RewardRarity = 'normal' | 'good' | 'rare';

export type EvolutionKind = 'upgrade' | 'fusion' | 'awakening';

export type EffectDefinition = Record<string, unknown> & {
  type?: string;
};

export type WeaponLevelDefinition = {
  level: number;
  effect: EffectDefinition;
  label: string;
};

export type WeaponDefinition = {
  id: Id;
  name: string;
  category: 'weapon';
  maxLevel: number;
  tags: string[];
  description: string;
  lore?: string;
  levels: WeaponLevelDefinition[];
};

export type PassiveLevelDefinition = {
  level: number;
  value: number;
  label: string;
};

export type PassiveDefinition = {
  id: Id;
  name: string;
  category: 'passive';
  maxLevel: number;
  stat:
    | 'magnetMultiplier'
    | 'mightMultiplier'
    | 'xpMultiplier'
    | 'moveSpeedMultiplier'
    | 'cooldownMultiplier';
  description: string;
  lore?: string;
  levels: PassiveLevelDefinition[];
};

export type RareItemDefinition = {
  id: Id;
  name: string;
  category: 'rare_item';
  tags: string[];
  description: string;
  lore?: string;
};

export type CharacterBaseStats = {
  hp: number;
  moveSpeed: number;
  might: number;
  cooldownMultiplier: number;
  magnetMultiplier: number;
  xpMultiplier: number;
};

export type CharacterUltimateDefinition = {
  id: Id;
  name: string;
  chargeSeconds: number;
  trigger: 'manual' | 'auto';
  effect: EffectDefinition;
  description: string;
  lore?: string;
};

export type CharacterDefinition = {
  id: Id;
  name: string;
  title: string;
  role: string;
  initialWeaponId: Id;
  baseStats: CharacterBaseStats;
  ultimate: CharacterUltimateDefinition;
  description: string;
  lore?: string;
};

export type EnemyBehavior =
  | 'chase'
  | 'slow_chase'
  | 'offset_chase'
  | 'swarm_chase'
  | 'elite_chase'
  | 'charger'
  | 'orbit_chase'
  | 'coward';

/**
 * ステージ設計用の敵ロール。
 * HP倍率だけで難しくせず、役割の組み合わせで8分のテンポを作る。
 */
export type EnemyRole =
  | 'pressure'
  | 'charger'
  | 'flank'
  | 'supply'
  | 'swarm'
  | 'elite';

/** 描画モチーフ。敵の名前/挙動を変えても描画部が壊れないよう、見た目は visualKind で決める。 */
export type EnemyVisualKind = 'ink_blob' | 'paper_scrap' | 'signpost' | 'capsule' | 'haze' | 'label_elite';

export type EnemyDefinition = {
  id: Id;
  name: string;
  hp: number;
  moveSpeed: number;
  contactDamage: number;
  xpDrop: number;
  tags: string[];
  behavior: EnemyBehavior;
  /** ステージ構成で使う役割。Stageが増えても enemyId 直書きに寄せすぎないための分類。 */
  roles: EnemyRole[];
  /** 将来のステージレシピから参照する行動・攻撃・特殊能力の登録ID。 */
  patternIds?: Id[];
  visualKind: EnemyVisualKind;
  description: string;
  lore?: string;
  drops?: Array<{ type: 'memory_capsule'; chance: number }>;
};

export type RuntimeWeapon = {
  id: Id;
  level: number;
  cooldownRemaining: number;
};

export type RuntimePassive = {
  id: Id;
  level: number;
};

export type RuntimeRareItem = {
  id: Id;
};

export type InventoryRuntime = {
  weapons: RuntimeWeapon[];
  passives: RuntimePassive[];
  rareItems: RuntimeRareItem[];
  evolvedWeaponIds: Id[];
  weaponSlots: number;
  passiveSlots: number;
  rareItemSlots: number;
};

export type PlayerRuntime = {
  characterId: Id;
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  xpToNext: number;
  ultimateCharge: number;
  ultimateReady: boolean;
};

export type RunStats = {
  kills: number;
  elitesKilled: number;
  xpCollected: number;
  memoryFragmentsCollected: number;
  capsulesOpened: number;
  evolutions: Id[];
  ultimateUses: number;
  pairUltimateUses: number;
  berserkUses: number;
  damageTaken: number;
  levelUps: number;
  survivedSec: number;
  newCodexEntries: Id[];
  unlockedAchievements: Id[];
};

export type DirectionWeights = Partial<Record<'bottom' | 'top' | 'left' | 'right' | 'around', number>>;

export type WaveSpawnDefinition = {
  enemyId: Id;
  /** ステージレシピ上で期待する敵パターン。未指定なら enemy.patternIds を使う。 */
  patternId?: Id;
  spawnRatePerSecond?: number;
  spawnCount?: number;
  maxAlive?: number;
  /** 終盤ボス役など、特定出現枠のHP倍率。未指定は1。 */
  hpMultiplier?: number;
  directionWeights: DirectionWeights;
};

export type WaveDefinition = {
  start: number;
  end: number;
  note: string;
  spawns: WaveSpawnDefinition[];
};

export type EvolutionDefinition = {
  id: Id;
  kind: EvolutionKind;
  name: string;
  fromWeaponId: Id;
  /**
   * 設計上の下限（互換用）。実際の進化条件は from/required 武器の maxLevel に連動する。
   * weapons.ts で maxLevel を 5→7→… と動かしても破綻しないよう、未指定でも構わない。
   */
  requiredWeaponLevel?: number;
  requiredWeaponId?: Id;
  requiredWeaponLevel2?: number;
  requiredPassiveId?: Id;
  requiredPassiveLevel?: number;
  requiredRareItemId?: Id;
  consumedWeaponIds?: Id[];
  consumedRareItemIds?: Id[];
  evolvedWeaponId: Id;
  title?: string;
  description?: string;
  lore?: string;
};

export type LevelUpChoice =
  | {
    type: 'weapon_new';
    itemId: Id;
    title: string;
    description: string;
    lore?: string;
    rarity?: RewardRarity;
    initialLevel?: number;
  }
  | {
    type: 'weapon_upgrade';
    itemId: Id;
    nextLevel: number;
    title: string;
    description: string;
    lore?: string;
    rarity?: RewardRarity;
  }
  | {
    type: 'passive_new';
    itemId: Id;
    title: string;
    description: string;
    lore?: string;
    rarity?: RewardRarity;
    initialLevel?: number;
  }
  | {
    type: 'passive_upgrade';
    itemId: Id;
    nextLevel: number;
    title: string;
    description: string;
    lore?: string;
    rarity?: RewardRarity;
  }
  | {
    type: 'rare_new';
    itemId: Id;
    title: string;
    description: string;
    lore?: string;
    rarity?: RewardRarity;
  }
  | {
    type: 'heal';
    amount: number;
    title: string;
    description: string;
    lore?: string;
    rarity?: RewardRarity;
  };

export type CapsuleReward =
  | {
    type: 'evolution';
    evolutionId: Id;
    evolutionKind: EvolutionKind;
    evolvedWeaponId: Id;
    title: string;
    lore?: string;
  }
  | {
    type: 'weapon_upgrade' | 'passive_upgrade';
    itemId: Id;
    nextLevel: number;
    title: string;
  }
  | {
    type: 'currency';
    amount: number;
    title: string;
  };
