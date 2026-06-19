import type Phaser from 'phaser';
import type {
  Id,
  GameStatus,
  EnemyBehavior,
  InventoryRuntime,
  RunStats,
  LevelUpChoice,
  CapsuleReward,
} from './domain/types';
import type { AreaVisualKind, ProjectileVisualKind } from './domain/weaponVisual';

/** すべてのエンティティ表示はContainerに統一する（扱いを単純化）。 */
export type View = Phaser.GameObjects.Container;

export type EnemyRuntime = {
  iid: number;
  defId: Id;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  moveSpeed: number;
  contactDamage: number;
  xpDrop: number;
  radius: number;
  behavior: EnemyBehavior;
  isElite: boolean;
  capsuleDropChance: number;
  offsetSign: number;
  flashRemaining: number;
  view: View;
  hpBar: Phaser.GameObjects.Graphics | null;
  dead: boolean;
};

export type ProjectileRuntime = {
  iid: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  hitsLeft: number;
  bouncesLeft: number;
  lifeRemaining: number;
  visualKind: ProjectileVisualKind;
  trailAccum: number;
  hitSet: Set<number>;
  view: View;
  dead: boolean;
};

export type GroundAreaRuntime = {
  iid: number;
  x: number;
  y: number;
  radius: number;
  dps: number;
  remaining: number;
  tickAccum: number;
  areaKind: AreaVisualKind;
  view: View;
  dead: boolean;
};

export type PickupRuntime = {
  iid: number;
  x: number;
  y: number;
  kind: 'fragment' | 'heal';
  xp: number;
  heal: number;
  magnetized: boolean;
  view: View;
  dead: boolean;
};

export type CapsuleRuntime = {
  iid: number;
  x: number;
  y: number;
  view: View;
  dead: boolean;
};

export type OrbiterRuntime = {
  angle: number;
  view: View;
};

export type PlayerState = {
  characterId: Id;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  baseMoveSpeed: number;
  moveSpeed: number;
  radius: number;
  invulnRemaining: number;
  level: number;
  xp: number;
  xpToNext: number;
  // 派生ステータス（パッシブ反映後）
  might: number;
  magnetMultiplier: number;
  xpMultiplier: number;
  cooldownMultiplier: number;
  flashRemaining: number;
};

export type UltimateState = {
  chargeSeconds: number;
  charge: number;
  ready: boolean;
  activeRemaining: number;
};

export type BerserkState = {
  maxCharge: number;
  charge: number;
  ready: boolean;
  durationSec: number;
  activeRemaining: number;
  fatigueRemaining: number;
};

/** 1プレイの計測値。プレイログ（docs/balance-log）の素データ。 */
export type RunTelemetry = {
  firstKillSec: number | null;
  level2Sec: number | null;
  firstDamageSec: number | null;
  firstCapsuleSec: number | null;
  /** エリート撃破の経過秒（複数体） */
  eliteKillSecs: number[];
};

export function createTelemetry(): RunTelemetry {
  return {
    firstKillSec: null,
    level2Sec: null,
    firstDamageSec: null,
    firstCapsuleSec: null,
    eliteKillSecs: [],
  };
}

export type RuntimeState = {
  status: GameStatus;
  runId: string;
  stageNumber: number;
  elapsedSec: number;
  durationSec: number;
  characterId: Id;
  player: PlayerState;
  playerView: View;
  inventory: InventoryRuntime;
  enemies: EnemyRuntime[];
  projectiles: ProjectileRuntime[];
  areas: GroundAreaRuntime[];
  pickups: PickupRuntime[];
  capsules: CapsuleRuntime[];
  orbiters: OrbiterRuntime[];
  orbitAngle: number;
  orbitHitCooldowns: Map<number, number>;
  stats: RunStats;
  telemetry: RunTelemetry;
  ultimate: UltimateState;
  berserk: BerserkState;
  pendingChoices: LevelUpChoice[];
  pendingCapsule: CapsuleReward | null;
  levelUpRerollsRemaining: number;
  nextIid: number;
  debug: boolean;
  inputVec: { x: number; y: number };
  ultimateRequested: boolean;
  berserkRequested: boolean;
};

export function nextIid(state: RuntimeState): number {
  state.nextIid += 1;
  return state.nextIid;
}

export function createRunStats(): RunStats {
  return {
    kills: 0,
    elitesKilled: 0,
    xpCollected: 0,
    memoryFragmentsCollected: 0,
    capsulesOpened: 0,
    evolutions: [],
    ultimateUses: 0,
    damageTaken: 0,
    levelUps: 0,
    survivedSec: 0,
    newCodexEntries: [],
    unlockedAchievements: [],
  };
}
