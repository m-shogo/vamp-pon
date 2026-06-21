import type Phaser from 'phaser';
import type { Id } from './domain/types';
import type { RuntimeState } from './runtime';
import { createRunStats, createTelemetry } from './runtime';
import { characterById, DEFAULT_CHARACTER_ID } from './data/characters';
import { DEFAULT_GAME_CONFIG, GAME_STATUS, GAME_WIDTH, GAME_HEIGHT, PLAYER_DEFAULTS, LEVEL_UP } from './domain/constants';
import { xpToNext } from './domain/balance';
import { createPlayerView } from './ui/factory';
import { recomputePlayerStats } from './systems/passives';
import { subCharacterBattleBonuses } from './systems/subCharacterEffects';
import { YUI_FRAME_IDS } from './assets/playerFrames';
import { attachCore5PlayerView } from './ui/playerVisual';
import { BERSERK_DURATION_SEC, BERSERK_MAX_CHARGE } from './systems/berserk';
import { loadBondProgress } from './persistence/bonds';
import { characterLevelBonus, loadProfile, profileBonuses } from './persistence/profile';

export function requestedStageNumber(search = typeof window === 'undefined' ? '' : window.location.search): number {
  const params = new URLSearchParams(search);
  const raw = params.get('stage');
  const value = raw ? Number(raw) : loadProfile().selectedStage;
  return Number.isFinite(value) && value >= 1 && value <= 99 ? Math.floor(value) : 1;
}

export function isBerserkQaReadyRequested(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  const params = new URLSearchParams(search);
  const qa = params.get('qa') ?? params.get('debug') ?? '';
  const qaBerserk = params.get('qaBerserk') ?? '';
  return qa === 'berserk-ready' || qa === 'berserk-auto' || qaBerserk === 'ready' || qaBerserk === 'auto';
}

export function isBerserkQaAutoRequested(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  const params = new URLSearchParams(search);
  const qa = params.get('qa') ?? '';
  const qaBerserk = params.get('qaBerserk') ?? '';
  return qa === 'berserk-auto' || qaBerserk === 'auto';
}

export function isQuickClearQaRequested(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  const params = new URLSearchParams(search);
  return params.get('qa') === 'quick-clear' || params.get('qaClear') === 'quick';
}

export function createInitialState(scene: Phaser.Scene, characterId: Id = DEFAULT_CHARACTER_ID): RuntimeState {
  const profile = loadProfile();
  const bonuses = profileBonuses(profile);
  const char = characterById.get(characterId) ?? characterById.get(DEFAULT_CHARACTER_ID)!;
  const subCharacterId = profile.selectedSubCharacterId && profile.selectedSubCharacterId !== char.id
    ? profile.selectedSubCharacterId
    : undefined;
  const subBonuses = subCharacterBattleBonuses(char.id, subCharacterId, loadBondProgress());
  const charBonus = characterLevelBonus(char.id, profile);
  const px = GAME_WIDTH / 2;
  const py = GAME_HEIGHT / 2;
  const core5Texture = YUI_FRAME_IDS.idle.front;
  const useCore5Yui = char.id === 'yui' && scene.textures.exists(core5Texture);
  const playerView = createPlayerView(scene, px, py, {
    textureId: useCore5Yui ? core5Texture : 'yui_idle',
  });
  if (useCore5Yui) attachCore5PlayerView(playerView);

  const params = new URLSearchParams(window.location.search);
  const debug = params.get('debug') === 'true';
  const debugHitCircle = playerView.getData('debugHitCircle') as Phaser.GameObjects.Arc | undefined;
  debugHitCircle?.setVisible(debug);
  const qaBerserkReady = isBerserkQaReadyRequested();
  const qaQuickClear = isQuickClearQaRequested();
  const stageNumber = requestedStageNumber();
  const baseHp = Math.floor((char.baseStats.hp * bonuses.maxHpMultiplier + charBonus.hpFlat) * subBonuses.hpMultiplier);
  const baseMoveSpeed = char.baseStats.moveSpeed * bonuses.moveSpeedMultiplier * subBonuses.moveSpeedMultiplier;

  const state: RuntimeState = {
    status: GAME_STATUS.READY,
    runId: `r${Date.now().toString(36)}`,
    stageNumber,
    explorationDepth: profile.selectedDepth,
    speedMultiplier: 1,
    elapsedSec: 0,
    durationSec: qaQuickClear ? 15 : DEFAULT_GAME_CONFIG.durationSec,
    characterId: char.id,
    subCharacterId,
    playerView,
    player: {
      characterId: char.id,
      x: px,
      y: py,
      hp: baseHp,
      maxHp: baseHp,
      baseMoveSpeed,
      moveSpeed: baseMoveSpeed,
      radius: PLAYER_DEFAULTS.radius,
      invulnRemaining: 0,
      level: 1,
      xp: 0,
      xpToNext: xpToNext(1),
      might: char.baseStats.might * bonuses.mightMultiplier * charBonus.mightMultiplier,
      magnetMultiplier: char.baseStats.magnetMultiplier * bonuses.magnetMultiplier,
      xpMultiplier: char.baseStats.xpMultiplier * bonuses.xpMultiplier * subBonuses.xpMultiplier,
      cooldownMultiplier: char.baseStats.cooldownMultiplier * subBonuses.cooldownMultiplier,
      flashRemaining: 0,
    },
    inventory: {
      weapons: [{ id: char.initialWeaponId, level: 1, cooldownRemaining: 0 }],
      passives: [],
      rareItems: [],
      evolvedWeaponIds: [],
      weaponSlots: DEFAULT_GAME_CONFIG.weaponSlots,
      passiveSlots: DEFAULT_GAME_CONFIG.passiveSlots,
      rareItemSlots: DEFAULT_GAME_CONFIG.rareItemSlots,
    },
    enemies: [],
    projectiles: [],
    areas: [],
    pickups: [],
    capsules: [],
    orbiters: [],
    orbitAngle: 0,
    orbitHitCooldowns: new Map(),
    stats: createRunStats(),
    telemetry: createTelemetry(),
    ultimate: {
      chargeSeconds: char.ultimate.chargeSeconds / (bonuses.ultimateChargeMultiplier * subBonuses.ultimateChargeMultiplier),
      charge: 0,
      ready: false,
      activeRemaining: 0,
    },
    berserk: {
      maxCharge: BERSERK_MAX_CHARGE,
      charge: qaBerserkReady ? BERSERK_MAX_CHARGE : 0,
      ready: qaBerserkReady,
      durationSec: BERSERK_DURATION_SEC,
      activeRemaining: 0,
      fatigueRemaining: 0,
    },
    pendingChoices: [],
    pendingCapsule: null,
    levelUpRerollsRemaining: LEVEL_UP.rerollsPerRun,
    nextIid: 0,
    debug,
    inputVec: { x: 0, y: 0 },
    ultimateRequested: false,
    berserkRequested: false,
  };

  recomputePlayerStats(state);
  return state;
}
