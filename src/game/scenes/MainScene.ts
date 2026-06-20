import Phaser from 'phaser';
import type { EvolutionKind, LevelUpChoice } from '../domain/types';
import type { RuntimeState } from '../runtime';
import { createInitialState, isBerserkQaAutoRequested } from '../state';
import { GAME_STATUS, GAME_WIDTH } from '../domain/constants';
import { createBackground, createStageBackground, getRequestedStageNumber, stageBackgroundTextureKey } from '../ui/background';
import { loadBackgroundManifest, getBackgroundByStageNumber, loadBackgroundMeta } from '../assets/backgroundManifest';
import { Hud } from '../ui/hud';
import { Overlays } from '../ui/overlays';
import { VirtualStick } from '../ui/virtualStick';
import { evolutionBurst } from '../ui/effects';
import { RunPacingEffects } from '../ui/runPacingEffects';
import { BerserkFeedback } from '../ui/berserkFeedback';
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
import { applyCapsule } from '../systems/capsule';
import { buildPlayLog } from '../domain/playLog';
import { loadProfile, settleRunProgress } from '../persistence/profile';
import { settleCollectionProgress, type CollectionSettlement } from '../systems/collectionProgress';
import { STORYBOOK_FONT } from '../ui/storybookUi';

const PLAYTEST_SNAPSHOT_INTERVAL_MS = 250;
const SPEED_OPTIONS = [1, 1.3, 1.5] as const;

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
      speedMultiplier: number;
    };
  }
}

export class MainScene extends Phaser.Scene {
  private state!: RuntimeState;
  private hud!: Hud;
  private overlays!: Overlays;
  private stick!: VirtualStick;
  private pacingEffects!: RunPacingEffects;
  private berserkFeedback!: BerserkFeedback;
  private keys: KeyboardKeys | null = null;
  private spawnSystem!: SpawnSystem;
  private playtestSnapshotEnabled = false;
  private lastDebugSnapshotAtMs = Number.NEGATIVE_INFINITY;
  private lastDebugSnapshotJson = '';
  private stageNumber = 1;
  private resultEntered = false;
  private onBlur = (): void => this.tryAutoPause();
  private onVisibility = (): void => {
    if (document.hidden) this.tryAutoPause();
  };

  constructor() {
    super('MainScene');
  }

  create(): void {
    this.resultEntered = false;
    this.setupBackground();
    this.state = createInitialState(this);
    this.stageNumber = this.state.stageNumber;
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
      () => {
        this.state.speedMultiplier = nextSpeedMultiplier(this.state.speedMultiplier);
      },
    );
    this.overlays = new Overlays(this);
    this.spawnSystem = new SpawnSystem();
    this.keys = setupKeyboard(this);
    this.stick = new VirtualStick(this);
    this.pacingEffects = new RunPacingEffects(this);
    this.berserkFeedback = new BerserkFeedback(this);

    window.addEventListener('blur', this.onBlur);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('blur', this.onBlur);
      document.removeEventListener('visibilitychange', this.onVisibility);
      this.clearDebugSnapshot();
      this.berserkFeedback.destroy();
      this.pacingEffects.destroy();
      this.stick.destroy();
      this.hud.destroy();
    });

    this.overlays.showReady(() => {
      this.state.status = GAME_STATUS.PLAYING;
      if (isBerserkQaAutoRequested()) this.state.berserkRequested = true;
    });

    this.hud.update(this.state);
    this.pacingEffects.update(this.state);
    this.berserkFeedback.update(this.state);
    this.updateDebugSnapshot(true);
  }

  private setupBackground(): void {
    this.stageNumber = getRequestedStageNumber() ?? 1;
    loadBackgroundManifest().then((manifest) => {
      if (!manifest) { createBackground(this); return; }
      const entry = getBackgroundByStageNumber(manifest, this.stageNumber);
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
    const baseDt = Math.min(delta / 1000, 0.05);
    const state = this.state;
    const dt = baseDt * state.speedMultiplier;

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
      this.berserkFeedback.update(state);
      this.resolveTransitions();
    }

    this.hud.update(state);
    this.pacingEffects.update(state);
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
      speedMultiplier: this.state.speedMultiplier,
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

  private finishLevelUp(choice: LevelUpChoice): void {
    const state = this.state;
    const previousEvolutions = new Set(state.stats.evolutions);
    applyChoice(state, choice);
    for (const evolvedWeaponId of state.stats.evolutions) {
      if (previousEvolutions.has(evolvedWeaponId)) continue;
      const name = weaponById.get(evolvedWeaponId)?.name ?? evolvedWeaponId;
      evolutionBurst(this, state.player.x, state.player.y, `進化: ${name}`, 'upgrade');
    }
    state.pendingChoices = [];
    state.status = GAME_STATUS.PLAYING;
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
    if (this.resultEntered) return;
    this.resultEntered = true;
    const state = this.state;
    state.status = cleared ? GAME_STATUS.CLEARED : GAME_STATUS.GAMEOVER;
    state.stats.survivedSec = state.elapsedSec;
    const log = buildPlayLog(state, cleared);
    const settlement = settleRunProgress(state, cleared);
    const collectionSettlement = settleCollectionProgress(state, cleared);
    // eslint-disable-next-line no-console
    console.log('[vamp-pon playlog]', JSON.stringify({ ...log, settlement, collectionSettlement }));

    const showResult = () => {
      this.overlays.showResult(
        state,
        cleared,
        log,
        settlement,
        loadProfile().currency,
        () => {
          this.scene.restart();
        },
        () => this.goToTop(),
        () => this.goToMenu('growth'),
        () => this.goToMenu('stage'),
      );
      this.showCollectionResultBadge(collectionSettlement);
    };

    if (cleared) {
      this.pacingEffects.playClearTransition(showResult);
    } else {
      showResult();
    }
  }

  private showCollectionResultBadge(settlement: CollectionSettlement): void {
    if (settlement.newlyCompleted.length === 0) return;
    const root = this.add.container(GAME_WIDTH / 2, 604).setDepth(10000);
    const bg = this.add.rectangle(0, 0, 312, 86, 0x121426, 0.94);
    bg.setStrokeStyle(1, 0xf5d58a, 0.92);
    const titles = settlement.newlyCompleted.slice(0, 3).map((cell) => `■ ${cell.title}`).join('\n');
    const more = settlement.newlyCompleted.length > 3 ? `\nほか ${settlement.newlyCompleted.length - 3}マス` : '';
    const reward = settlement.lightCoinReward > 0 ? `　黒曜片 +${settlement.lightCoinReward}` : '';
    const text = this.add.text(0, 0, `夜明け盤 +${settlement.newlyCompleted.length}${reward}\n${titles}${more}`, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: '#f7edcf',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      lineSpacing: 3,
      stroke: '#080b18',
      strokeThickness: 2,
    }).setOrigin(0.5);
    root.add([bg, text]);
    root.setScale(0.96);
    root.setAlpha(0);
    this.tweens.add({ targets: root, alpha: 1, scale: 1, duration: 180, ease: 'Back.easeOut' });
  }

  private goToTop(): void {
    this.replaceMenuUrl();
    this.scene.start('TopScene');
  }

  private goToMenu(mode: 'stage' | 'growth'): void {
    this.replaceMenuUrl();
    this.scene.start('StageSelectScene', { mode });
  }

  private replaceMenuUrl(): void {
    const params = new URLSearchParams(window.location.search);
    params.delete('play');
    params.delete('scene');
    params.delete('qa');
    params.delete('qaBerserk');
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }
}

function nextSpeedMultiplier(current: number): number {
  const index = SPEED_OPTIONS.findIndex((value) => Math.abs(value - current) < 0.01);
  return SPEED_OPTIONS[(index + 1) % SPEED_OPTIONS.length];
}

function evolutionKindLabel(kind: EvolutionKind): string {
  switch (kind) {
    case 'upgrade': return '強化進化';
    case 'fusion': return '合体';
    case 'awakening': return '覚醒';
  }
}
