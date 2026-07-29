import Phaser from 'phaser';
import type { EvolutionKind, LevelUpChoice } from '../domain/types';
import type { RuntimeState } from '../runtime';
import { createInitialState, isBerserkQaAutoRequested, isDawnTicketQaRequested } from '../state';
import { DEFAULT_GAME_CONFIG, GAME_STATUS, GAME_WIDTH, PICKUP } from '../domain/constants';
import { createBackground, createStageBackground, getRequestedStageNumber, stageBackgroundTextureKey } from '../ui/background';
import { loadBackgroundManifest, getBackgroundByStageNumber, loadBackgroundMeta } from '../assets/backgroundManifest';
import { Hud } from '../ui/hud';
import { Overlays } from '../ui/overlays';
import { VirtualStick } from '../ui/virtualStick';
import { evolutionBurst } from '../ui/effects';
import { RunPacingEffects } from '../ui/runPacingEffects';
import { StageAtmosphere } from '../ui/stageAtmosphere';
import { BerserkFeedback } from '../ui/berserkFeedback';
import { bgmKeyForStage, getAudioManager, type AudioManager } from '../audio/AudioManager';
import { getEffectManager, type EffectManager } from '../effects/EffectManager';
import { maxEnemiesForElapsed } from '../config/GameFeelConfig';
import { weaponById } from '../data/weapons';
import { setupKeyboard, updateInput, type KeyboardKeys } from '../systems/input';
import { updateMovement } from '../systems/movement';
import { SpawnSystem } from '../systems/spawn';
import { applyPlayerDamage, updateEnemies } from '../systems/enemies';
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
import { isRunStartUrl } from '../utils/runStartUrl';
import { loadOnboarding, markSeen } from '../persistence/onboarding';
import { MicroHintDisplay } from '../ui/microHint';

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
      activeXpPickups: number;
      attractingXpPickups: number;
      nearbyXpPickups: number;
      farXpPickups: number;
      collectedFragments: number;
      capsulesOpened: number;
      damageTaken: number;
      rareItems: string[];
      pendingChoices: Array<{ type: string; itemId?: string; title: string }>;
      invulnRemaining: number;
      berserkActiveRemaining: number;
      berserkFatigueRemaining: number;
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
  private atmosphere: StageAtmosphere | null = null;
  private berserkFeedback!: BerserkFeedback;
  private audio!: AudioManager;
  private effects!: EffectManager;
  private keys: KeyboardKeys | null = null;
  private spawnSystem!: SpawnSystem;
  private playtestSnapshotEnabled = false;
  private lastDebugSnapshotAtMs = Number.NEGATIVE_INFINITY;
  private lastDebugSnapshotJson = '';
  private stageNumber = 1;
  private resultEntered = false;
  private ultimateWasReady = false;
  private berserkWasReady = false;
  private microHint!: MicroHintDisplay;
  private onboardingFlags!: ReturnType<typeof loadOnboarding>;
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
    if (isDawnTicketQaRequested()) {
      this.input.keyboard?.on('keydown-K', () => {
        if (this.state.status !== GAME_STATUS.PLAYING) return;
        applyPlayerDamage(this, this.state, this.state.player.maxHp);
        if (this.state.status === GAME_STATUS.GAMEOVER) this.resolveTransitions();
      });
    }
    this.stick = new VirtualStick(this);
    this.audio = getAudioManager(this);
    this.audio.unlockOnFirstInput();
    this.audio.playBgm(bgmKeyForStage(this.stageNumber), { volume: 0.36, fadeMs: 320 });
    this.ultimateWasReady = this.state.ultimate.ready;
    this.berserkWasReady = this.state.berserk.ready;
    this.effects = getEffectManager(this);
    this.pacingEffects = new RunPacingEffects(this);
    this.pacingEffects.setStage(this.stageNumber);
    this.atmosphere = new StageAtmosphere(this, this.stageNumber);
    this.berserkFeedback = new BerserkFeedback(this);
    this.microHint = new MicroHintDisplay(this);
    this.onboardingFlags = loadOnboarding();

    window.addEventListener('blur', this.onBlur);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('blur', this.onBlur);
      document.removeEventListener('visibilitychange', this.onVisibility);
      this.clearDebugSnapshot();
      this.berserkFeedback.destroy();
      this.audio.destroy();
      this.effects.destroy();
      this.pacingEffects.destroy();
      this.atmosphere?.destroy();
      this.microHint.destroy();
      this.stick.destroy();
      this.hud.destroy();
    });

    const startRun = () => {
      this.state.status = GAME_STATUS.PLAYING;
      if (isBerserkQaAutoRequested()) this.state.berserkRequested = true;
    };
    if (isRunStartUrl()) {
      startRun();
    } else {
      const firstRun = !this.onboardingFlags.readyHintSeen;
      if (firstRun) markSeen('readyHintSeen');
      this.overlays.showReady(startRun, this.stageNumber, firstRun);
    }

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
    this.tweens.pauseAll();
    this.overlays.showPause(
      () => {
        this.tweens.resumeAll();
        this.state.status = GAME_STATUS.PLAYING;
      },
      () => this.leavePausedScene(() => this.goToTop()),
      () => this.leavePausedScene(() => this.goToMenu('stage')),
      () => this.leavePausedScene(() => this.goToMenu('growth')),
    );
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
      if (!this.onboardingFlags.eliteHintSeen && state.enemies.some((e) => e.isElite)) {
        this.microHint.show('強敵出現！倒すとカプセルを落とす');
        this.onboardingFlags.eliteHintSeen = true;
        markSeen('eliteHintSeen');
      }
      updateEnemies(this, state, dt);
      updateWeapons(this, state, dt);
      const hpBefore = state.player.hp;
      updatePickups(this, state, dt);
      if (state.player.hp > hpBefore && !this.onboardingFlags.healHintSeen) {
        this.microHint.show('回復アイテムでHPが回復した');
        this.onboardingFlags.healHintSeen = true;
        markSeen('healHintSeen');
      }
      updateUltimate(this, state, dt);
      if (state.ultimate.ready && !this.ultimateWasReady) {
        this.audio.playSe('ultimate_ready', { volume: 0.5, priority: 1 });
        if (!this.onboardingFlags.ultimateHintSeen) {
          this.microHint.show('必殺技が使える！右下のボタンをタップ');
          this.onboardingFlags.ultimateHintSeen = true;
          markSeen('ultimateHintSeen');
        }
      }
      const wasBerserkActive = state.berserk.activeRemaining > 0;
      const berserkActivated = updateBerserk(state, dt, this);
      if (berserkActivated) {
        this.audio.playSe('berserk_start', { volume: 0.68, priority: 3 });
        this.effects.blackAura(state.playerView);
      }
      if (wasBerserkActive && state.berserk.activeRemaining <= 0 && state.berserk.fatigueRemaining > 0) {
        this.audio.playSe('berserk_end', { volume: 0.48, priority: 1 });
        this.effects.blackAuraRelease(state.player.x, state.player.y);
      }
      if (state.berserk.ready && !this.berserkWasReady) {
        this.audio.playSe('berserk_ready', { volume: 0.48, priority: 1 });
        if (!this.onboardingFlags.berserkHintSeen) {
          this.microHint.show('暴走が使える！左下のボタンをタップ');
          this.onboardingFlags.berserkHintSeen = true;
          markSeen('berserkHintSeen');
        }
      }
      this.ultimateWasReady = state.ultimate.ready;
      this.berserkWasReady = state.berserk.ready;
      this.berserkFeedback.update(state);
      this.resolveTransitions();
    }

    this.hud.update(state);
    this.effects.dangerPulse(state.status === GAME_STATUS.PLAYING ? state.player.hp / state.player.maxHp : 1);
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
    const magnetRange = PICKUP.magnetRange * this.state.player.magnetMultiplier;
    let activeXpPickups = 0;
    let attractingXpPickups = 0;
    let nearbyXpPickups = 0;
    let farXpPickups = 0;
    for (const pickup of this.state.pickups) {
      if (pickup.dead || pickup.kind !== 'fragment') continue;
      activeXpPickups += 1;
      if (pickup.magnetized) attractingXpPickups += 1;
      const dx = pickup.x - this.state.player.x;
      const dy = pickup.y - this.state.player.y;
      if (Math.hypot(dx, dy) <= magnetRange) nearbyXpPickups += 1;
      else farXpPickups += 1;
    }
    const snapshot = {
      elapsedSec: this.state.elapsedSec,
      status: this.state.status,
      hp: this.state.player.hp,
      level: this.state.player.level,
      kills: this.state.stats.kills,
      fragments: this.state.stats.memoryFragmentsCollected,
      activeXpPickups,
      attractingXpPickups,
      nearbyXpPickups,
      farXpPickups,
      collectedFragments: this.state.stats.memoryFragmentsCollected,
      capsulesOpened: this.state.stats.capsulesOpened,
      damageTaken: this.state.stats.damageTaken,
      rareItems: this.state.inventory.rareItems.map((item) => item.id),
      pendingChoices: this.state.pendingChoices.map((choice) => ({
        type: choice.type,
        itemId: 'itemId' in choice ? choice.itemId : undefined,
        title: choice.title,
      })),
      invulnRemaining: this.state.player.invulnRemaining,
      berserkActiveRemaining: this.state.berserk.activeRemaining,
      berserkFatigueRemaining: this.state.berserk.fatigueRemaining,
      enemiesById,
      firstCapsuleSec: this.state.telemetry.firstCapsuleSec,
      eliteKillSecs: [...this.state.telemetry.eliteKillSecs],
      level2Sec: this.state.telemetry.level2Sec,
      level3Sec: this.state.telemetry.level3Sec,
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
    if (choice.type === 'rare_new') {
      this.audio.playSe('levelup', { volume: 0.5, rate: 1.08 });
      this.effects.rarePickup(state.player.x, state.player.y, { label: 'RARE' });
    }
    for (const evolvedWeaponId of state.stats.evolutions) {
      if (previousEvolutions.has(evolvedWeaponId)) continue;
      const name = weaponById.get(evolvedWeaponId)?.name ?? evolvedWeaponId;
      this.audio.playSe('evolution', { volume: 0.92 });
      this.audio.duckBgm(520, 0.45);
      this.effects.evolution(state.player.x, state.player.y, { label: `進化: ${name}` });
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
      if (!this.onboardingFlags.capsuleHintSeen) {
        this.onboardingFlags.capsuleHintSeen = true;
        markSeen('capsuleHintSeen');
      }
      this.overlays.showCapsule(state, reward, () => {
        applyCapsule(state, reward);
        if (reward.type === 'evolution') {
          const name = weaponById.get(reward.evolvedWeaponId)?.name ?? reward.title;
          this.audio.playSe('evolution', { volume: 0.92 });
          this.effects.evolution(state.player.x, state.player.y, { label: `${evolutionKindLabel(reward.evolutionKind)}: ${name}` });
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
      if (state.player.level === 3 && state.telemetry.level3Sec === null) state.telemetry.level3Sec = state.elapsedSec;
      this.audio.playSe('levelup', { volume: 0.62, priority: 2 });
      this.effects.levelUp(state.player.x, state.player.y, { label: `Lv.${state.player.level}` });
      if (!this.onboardingFlags.levelUpHintSeen) {
        this.microHint.show('武器や忘れ物を選んで強化しよう');
        this.onboardingFlags.levelUpHintSeen = true;
        markSeen('levelUpHintSeen');
      }
      state.status = GAME_STATUS.LEVELUP;
      this.showLevelUpChoices(generateChoices(state));
      return;
    }

    if (state.elapsedSec >= state.durationSec) this.enterResult(true);
  }

  public gameFeelDebug(): { particleCount: number; waveMultiplier: number; currentMaxEnemies: number; comboCount: number; xpPerMin: number } {
    const caps = maxEnemiesForElapsed(this.state.elapsedSec, DEFAULT_GAME_CONFIG.maxEnemies);
    return {
      particleCount: this.effects.count(),
      waveMultiplier: caps.multiplier,
      currentMaxEnemies: caps.hard,
      comboCount: this.effects.combo(),
      xpPerMin: this.state.elapsedSec > 0 ? this.state.stats.xpCollected / (this.state.elapsedSec / 60) : 0,
    };
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

    if (!this.onboardingFlags.resultHintSeen) {
      this.onboardingFlags.resultHintSeen = true;
      markSeen('resultHintSeen');
    }

    const showResult = () => {
      if (!this.audio.playBgm('bgm_result', { volume: 0.3, fadeMs: 420 })) {
        this.audio.fadeBgm(0.16, 420);
      }
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
      this.audio.playSe('result_clear', { volume: 0.58, priority: 3 });
      this.effects.clearDawn();
      this.pacingEffects.playClearTransition(showResult);
    } else {
      this.audio.playSe('result_defeat', { volume: 0.5, priority: 3 });
      this.pacingEffects.playDefeatTransition(showResult);
    }
  }

  private showCollectionResultBadge(settlement: CollectionSettlement): void {
    if (settlement.newlyCompleted.length === 0) return;
    const root = this.add.container(GAME_WIDTH / 2, 44).setDepth(10000);
    const bg = this.add.rectangle(0, 0, 292, 34, 0x121426, 0.94);
    bg.setStrokeStyle(1, 0xf5d58a, 0.92);
    const more = settlement.newlyCompleted.length > 1 ? ` / ほか${settlement.newlyCompleted.length - 1}マス` : '';
    const reward = settlement.lightCoinReward > 0 ? `　黒曜片 +${settlement.lightCoinReward}` : '';
    const text = this.add.text(0, 0, `夜明け盤 +${settlement.newlyCompleted.length}${reward}${more}`, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: '#f7edcf',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
    }).setOrigin(0.5);
    root.add([bg, text]);
    root.setScale(0.96);
    root.setAlpha(0);
    this.tweens.add({ targets: root, alpha: 1, scale: 1, duration: 180, delay: 1000, ease: 'Back.easeOut' });
    this.tweens.add({ targets: root, alpha: 0, duration: 400, delay: 5000, ease: 'Quad.easeIn' });
  }

  private goToTop(): void {
    this.replaceMenuUrl();
    this.scene.start('TopScene');
  }

  private leavePausedScene(go: () => void): void {
    this.tweens.resumeAll();
    go();
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
