import Phaser from 'phaser';
import type { EvolutionKind, LevelUpChoice } from '../domain/types';
import type { RuntimeState } from '../runtime';
import { createInitialState } from '../state';
import { GAME_STATUS } from '../domain/constants';
import { createBackground, createStageBackground, getRequestedStageNumber, stageBackgroundTextureKey } from '../ui/background';
import { loadBackgroundManifest, getBackgroundByStageNumber, loadBackgroundMeta } from '../assets/backgroundManifest';
import { Hud } from '../ui/hud';
import { Overlays } from '../ui/overlays';
import { VirtualStick } from '../ui/virtualStick';
import { evolutionBurst } from '../ui/effects';
import { weaponById } from '../data/weapons';
import { setupKeyboard, updateInput, type KeyboardKeys } from '../systems/input';
import { updateMovement } from '../systems/movement';
import { SpawnSystem } from '../systems/spawn';
import { updateEnemies } from '../systems/enemies';
import { updateWeapons } from '../systems/weapons';
import { updatePickups } from '../systems/pickups';
import { updateUltimate } from '../systems/ultimate';
import { updateBerserk } from '../systems/berserk';
import { hasPendingLevelUp, advanceLevel } from '../systems/xp';
import { generateChoices, applyChoice } from '../systems/levelup';
import { applyCapsule, generateEvolutionReward } from '../systems/capsule';
import { buildPlayLog } from '../domain/playLog';

const PLAYTEST_SNAPSHOT_INTERVAL_MS = 250;

declare global {
  interface Window {
    __VAMP_PON_DEBUG_SNAPSHOT__?: {
      elapsedSec: number;
      status: RuntimeState['status'];
      hp: number;
      level: number;
      kills: number;
      fragments: number;
      capsulesOpened: number;
      damageTaken: number;
      enemiesById: Record<string, number>;
      firstCapsuleSec: number | null;
      eliteKillSecs: number[];
    };
  }
}

export class MainScene extends Phaser.Scene {
  private state!: RuntimeState;
  private hud!: Hud;
  private overlays!: Overlays;
  private stick!: VirtualStick;
  private keys: KeyboardKeys | null = null;
  private spawnSystem!: SpawnSystem;
  private playtestSnapshotEnabled = false;
  private lastDebugSnapshotAtMs = Number.NEGATIVE_INFINITY;
  private lastDebugSnapshotJson = '';
  private onBlur = (): void => this.tryAutoPause();
  private onVisibility = (): void => {
    if (document.hidden) this.tryAutoPause();
  };

  constructor() {
    super('MainScene');
  }

  create(): void {
    this.setupBackground();
    this.state = createInitialState(this);
    this.playtestSnapshotEnabled = new URLSearchParams(window.location.search).get('playtest') === 'true';
    this.hud = new Hud(
      this,
      () => {
        if (this.state.status === GAME_STATUS.PLAYING) this.state.ultimateRequested = true;
      },
      () => {
        if (this.state.status === GAME_STATUS.PLAYING) this.state.berserkRequested = true;
      },
      () => this.tryAutoPause(),
    );
    this.overlays = new Overlays(this);
    this.spawnSystem = new SpawnSystem();
    this.keys = setupKeyboard(this);
    this.stick = new VirtualStick(this);

    window.addEventListener('blur', this.onBlur);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('blur', this.onBlur);
      document.removeEventListener('visibilitychange', this.onVisibility);
      this.clearDebugSnapshot();
      this.stick.destroy();
      this.hud.destroy();
    });

    this.overlays.showReady(() => {
      this.state.status = GAME_STATUS.PLAYING;
    });

    this.hud.update(this.state);
    this.updateDebugSnapshot(true);
  }

  private setupBackground(): void {
    const stageNum = getRequestedStageNumber() ?? 1;
    loadBackgroundManifest().then((manifest) => {
      if (!manifest) { createBackground(this); return; }
      const entry = getBackgroundByStageNumber(manifest, stageNum);
      if (!entry) { createBackground(this); return; }
      if (!entry.enabledForRuntime) { createBackground(this); return; }
      const key = stageBackgroundTextureKey(entry);
      if (!this.textures.exists(key)) { createBackground(this); return; }
      loadBackgroundMeta(entry.id).then((meta) => {
        createStageBackground(this, key, meta);
      });
    });
  }

  private tryAutoPause(): void {
    if (this.state.status !== GAME_STATUS.PLAYING) return;
    this.state.status = GAME_STATUS.PAUSED;
    this.overlays.showPause(() => {
      this.state.status = GAME_STATUS.PLAYING;
    });
  }

  update(_time: number, delta: number): void {
    const dt = Math.min(delta / 1000, 0.05);
    const state = this.state;

    if (state.status === GAME_STATUS.PLAYING) {
      state.elapsedSec += dt;
      updateInput(state, this.keys, this.stick.getVector());
      updateMovement(state, dt);
      this.spawnSystem.update(this, state, dt);
      updateEnemies(this, state, dt);
      updateWeapons(this, state, dt);
      updatePickups(this, state, dt);
      updateUltimate(this, state, dt);
      updateBerserk(state, dt);
      this.resolveTransitions();
    }

    this.hud.update(state);
    this.updateDebugSnapshot();
  }

  private updateDebugSnapshot(force = false): void {
    if (!this.state.debug && !this.playtestSnapshotEnabled) {
      this.clearDebugSnapshot();
      return;
    }

    const now = this.time.now;
    if (!force && now - this.lastDebugSnapshotAtMs < PLAYTEST_SNAPSHOT_INTERVAL_MS) return;
    this.lastDebugSnapshotAtMs = now;

    const enemiesById: Record<string, number> = {};
    for (const enemy of this.state.enemies) {
      enemiesById[enemy.defId] = (enemiesById[enemy.defId] ?? 0) + 1;
    }
    const snapshot = {
      elapsedSec: this.state.elapsedSec,
      status: this.state.status,
      hp: this.state.player.hp,
      level: this.state.player.level,
      kills: this.state.stats.kills,
      fragments: this.state.stats.memoryFragmentsCollected,
      capsulesOpened: this.state.stats.capsulesOpened,
      damageTaken: this.state.stats.damageTaken,
      enemiesById,
      firstCapsuleSec: this.state.telemetry.firstCapsuleSec,
      eliteKillSecs: [...this.state.telemetry.eliteKillSecs],
    };
    window.__VAMP_PON_DEBUG_SNAPSHOT__ = snapshot;

    const json = JSON.stringify(snapshot);
    if (json === this.lastDebugSnapshotJson) return;
    this.lastDebugSnapshotJson = json;
    document.documentElement.dataset.vampPonDebugSnapshot = json;
  }

  private clearDebugSnapshot(): void {
    delete window.__VAMP_PON_DEBUG_SNAPSHOT__;
    delete document.documentElement.dataset.vampPonDebugSnapshot;
    this.lastDebugSnapshotAtMs = Number.NEGATIVE_INFINITY;
    this.lastDebugSnapshotJson = '';
  }

  private needsReplace(choice: LevelUpChoice): boolean {
    const inv = this.state.inventory;
    return (
      (choice.type === 'weapon_new' && inv.weapons.length >= inv.weaponSlots) ||
      (choice.type === 'passive_new' && inv.passives.length >= inv.passiveSlots) ||
      (choice.type === 'rare_new' && inv.rareItems.length >= inv.rareItemSlots)
    );
  }

  private maybeQueueEvolution(): boolean {
    const reward = generateEvolutionReward(this.state);
    if (!reward) return false;
    this.state.pendingCapsule = reward;
    this.state.status = GAME_STATUS.CAPSULE;
    return true;
  }

  private finishLevelUp(choice: LevelUpChoice): void {
    const state = this.state;
    applyChoice(state, choice);
    state.pendingChoices = [];
    state.status = GAME_STATUS.PLAYING;
    if (this.maybeQueueEvolution()) this.resolveTransitions();
  }

  private declineLevelUpChoice(): void {
    this.state.pendingChoices = [];
    this.state.status = GAME_STATUS.PLAYING;
  }

  private replaceAndPick(choice: LevelUpChoice, removeId: string): void {
    const state = this.state;
    if (choice.type === 'weapon_new') {
      state.inventory.weapons = state.inventory.weapons.filter((w) => w.id !== removeId);
    } else if (choice.type === 'passive_new') {
      state.inventory.passives = state.inventory.passives.filter((p) => p.id !== removeId);
    } else if (choice.type === 'rare_new') {
      state.inventory.rareItems = state.inventory.rareItems.filter((item) => item.id !== removeId);
    }
    this.finishLevelUp(choice);
  }

  private showLevelUpChoices(choices: LevelUpChoice[]): void {
    const state = this.state;
    state.pendingChoices = choices;
    this.overlays.showLevelUp(
      state,
      choices,
      (choice) => {
        if (this.needsReplace(choice)) {
          this.overlays.showReplaceItem(
            state,
            choice,
            (removeId) => this.replaceAndPick(choice, removeId),
            () => this.showLevelUpChoices(state.pendingChoices),
            () => this.declineLevelUpChoice(),
          );
          return;
        }
        this.finishLevelUp(choice);
      },
      () => {
        if (state.levelUpRerollsRemaining <= 0) return;
        state.levelUpRerollsRemaining -= 1;
        this.showLevelUpChoices(generateChoices(state));
      },
    );
  }

  private resolveTransitions(): void {
    const state = this.state;

    if (state.status === GAME_STATUS.GAMEOVER) {
      this.enterResult(false);
      return;
    }

    if (state.status === GAME_STATUS.CAPSULE && state.pendingCapsule) {
      const reward = state.pendingCapsule;
      this.overlays.showCapsule(state, reward, () => {
        applyCapsule(state, reward);
        if (reward.type === 'evolution') {
          const name = weaponById.get(reward.evolvedWeaponId)?.name ?? reward.title;
          evolutionBurst(this, state.player.x, state.player.y, `${evolutionKindLabel(reward.evolutionKind)}: ${name}`, reward.evolutionKind);
        }
        state.stats.capsulesOpened += 1;
        state.pendingCapsule = null;
        state.status = GAME_STATUS.PLAYING;
      });
      return;
    }

    if (hasPendingLevelUp(state)) {
      advanceLevel(state);
      if (state.player.level === 2 && state.telemetry.level2Sec === null) state.telemetry.level2Sec = state.elapsedSec;
      state.status = GAME_STATUS.LEVELUP;
      this.showLevelUpChoices(generateChoices(state));
      return;
    }

    if (state.elapsedSec >= state.durationSec) this.enterResult(true);
  }

  private enterResult(cleared: boolean): void {
    const state = this.state;
    state.status = cleared ? GAME_STATUS.CLEARED : GAME_STATUS.GAMEOVER;
    state.stats.survivedSec = state.elapsedSec;
    const log = buildPlayLog(state, cleared);
    // eslint-disable-next-line no-console
    console.log('[vamp-pon playlog]', JSON.stringify(log));
    this.overlays.showResult(state, cleared, log, () => {
      this.scene.restart();
    });
  }
}

function evolutionKindLabel(kind: EvolutionKind): string {
  switch (kind) {
    case 'upgrade': return '強化進化';
    case 'fusion': return '合体';
    case 'awakening': return '覚醒';
  }
}
