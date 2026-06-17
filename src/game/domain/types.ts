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

export type EnemyBehavior =
  | 'chase'
  | 'slow_chase'
  | 'offset_chase'
  | 'swarm_chase'
  | 'elite_chase'
  | 'charger'
  | 'orbit_chase'
  | 'coward';

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
  damageTaken: number;
  levelUps: number;
  survivedSec: number;
  newCodexEntries: Id[];
  unlockedAchievements: Id[];
};

export type DirectionWeights = Partial<Record<'bottom' | 'top' | 'left' | 'right' | 'around', number>>;

export type WaveSpawnDefinition = {
  enemyId: Id;
  spawnRatePerSecond?: number;
  spawnCount?: number;
  maxAlive?: number;
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
  requiredWeaponLevel: number;
  requiredPassiveId?: Id;
  requiredRareItemId?: Id;
  requiredWeaponId?: Id;
  requiredWeaponLevel2?: number;
  consumedWeaponIds?: Id[];
  consumedRareItemIds?: Id[];
  evolvedWeaponId: Id;
  title: string;
  lore: string;
};

export type LevelUpChoice =
  | { type: 'weapon_new'; itemId: Id; title: string; description: string; lore?: string; rarity?: RewardRarity; initialLevel?: number }
  | { type: 'weapon_upgrade'; itemId: Id; nextLevel: number; title: string; description: string; lore?: string; rarity?: RewardRarity }
  | { type: 'passive_new'; itemId: Id; title: string; description: string; lore?: string; rarity?: RewardRarity; initialLevel?: number }
  | { type: 'passive_upgrade'; itemId: Id; nextLevel: number; title: string; description: string; lore?: string; rarity?: RewardRarity }
  | { type: 'rare_new'; itemId: Id; title: string; description: string; lore?: string; rarity?: RewardRarity }
  | { type: 'heal'; amount: number; title: string; description: string; lore?: string; rarity?: RewardRarity };

export type CapsuleReward =
  | { type: 'evolution'; evolutionId: Id; evolutionKind: EvolutionKind; evolvedWeaponId: Id; title: string; lore: string }
  | { type: 'weapon_upgrade' | 'passive_upgrade'; itemId: Id; nextLevel: number; title: string }
  | { type: 'currency'; amount: number; title: string };

export type UltimateEffect = {
  type: 'pull_and_convert' | string;
  radius: number;
  duration: number;
  damage: number;
  smallEnemyOnly?: boolean;
  dropBonus?: number;
};

export type UltimateDefinition = {
  id: Id;
  name: string;
  chargeSeconds: number;
  trigger: 'manual';
  effect: UltimateEffect;
  description: string;
  lore: string;
};

export type CharacterBaseStats = {
  hp: number;
  moveSpeed: number;
  might: number;
  cooldownMultiplier: number;
  magnetMultiplier: number;
  xpMultiplier: number;
};

export type CharacterDefinition = {
  id: Id;
  name: string;
  title: string;
  role: string;
  initialWeaponId: Id;
  baseStats: CharacterBaseStats;
  ultimate: UltimateDefinition;
  description: string;
  lore?: string;
};
