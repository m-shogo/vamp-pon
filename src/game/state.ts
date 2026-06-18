import type Phaser from 'phaser';
import type { Id } from './domain/types';
import type { RuntimeState } from './runtime';
import { createRunStats, createTelemetry } from './runtime';
import { characterById, DEFAULT_CHARACTER_ID } from './data/characters';
import { DEFAULT_GAME_CONFIG, GAME_STATUS, GAME_WIDTH, GAME_HEIGHT, PLAYER_DEFAULTS, LEVEL_UP } from './domain/constants';
import { xpToNext } from './domain/balance';
import { createPlayerView } from './ui/factory';
import { recomputePlayerStats } from './systems/passives';
import { YUI_FRAME_IDS } from './assets/playerFrames';
import { attachCore5PlayerView } from './ui/playerVisual';
import { BERSERK_DURATION_SEC, BERSERK_MAX_CHARGE } from './systems/berserk';

export function createInitialState(scene: Phaser.Scene, characterId: Id = DEFAULT_CHARACTER_ID): RuntimeState {
  const char = characterById.get(characterId) ?? characterById.get(DEFAULT_CHARACTER_ID)!;
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

  const state: RuntimeState = {
    status: GAME_STATUS.READY,
    runId: `r${Date.now().toString(36)}`,
    elapsedSec: 0,
    durationSec: DEFAULT_GAME_CONFIG.durationSec,
    characterId: char.id,
    playerView,
    player: {
      characterId: char.id,
      x: px,
      y: py,
      hp: char.baseStats.hp,
      maxHp: char.baseStats.hp,
      baseMoveSpeed: char.baseStats.moveSpeed,
      moveSpeed: char.baseStats.moveSpeed,
      radius: PLAYER_DEFAULTS.radius,
      invulnRemaining: 0,
      level: 1,
      xp: 0,
      xpToNext: xpToNext(1),
      might: char.baseStats.might,
      magnetMultiplier: char.baseStats.magnetMultiplier,
      xpMultiplier: char.baseStats.xpMultiplier,
      cooldownMultiplier: char.baseStats.cooldownMultiplier,
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
      chargeSeconds: char.ultimate.chargeSeconds,
      charge: 0,
      ready: false,
      activeRemaining: 0,
    },
    berserk: {
      maxCharge: BERSERK_MAX_CHARGE,
      charge: 0,
      ready: false,
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
