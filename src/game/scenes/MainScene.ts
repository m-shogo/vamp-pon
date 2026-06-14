import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { createInitialState } from '../state';
import { GAME_STATUS } from '../domain/constants';
import { createBackground } from '../ui/background';
import { Hud } from '../ui/hud';
import { Overlays } from '../ui/overlays';
import { VirtualStick } from '../ui/virtualStick';
import { setupKeyboard, updateInput, type KeyboardKeys } from '../systems/input';
import { updateMovement } from '../systems/movement';
import { SpawnSystem } from '../systems/spawn';
import { updateEnemies } from '../systems/enemies';
import { updateWeapons } from '../systems/weapons';
import { updatePickups } from '../systems/pickups';
import { updateUltimate } from '../systems/ultimate';
import { hasPendingLevelUp, advanceLevel } from '../systems/xp';
import { generateChoices, applyChoice } from '../systems/levelup';
import { applyCapsule } from '../systems/capsule';
import { buildPlayLog } from '../domain/playLog';

export class MainScene extends Phaser.Scene {
  private state!: RuntimeState;
  private hud!: Hud;
  private overlays!: Overlays;
  private stick!: VirtualStick;
  private keys: KeyboardKeys | null = null;
  private spawnSystem!: SpawnSystem;
  private onBlur = (): void => this.tryAutoPause();
  private onVisibility = (): void => {
    if (document.hidden) this.tryAutoPause();
  };

  constructor() {
    super('MainScene');
  }

  create(): void {
    createBackground(this);
    this.state = createInitialState(this);
    this.hud = new Hud(this);
    this.overlays = new Overlays(this);
    this.spawnSystem = new SpawnSystem();
    this.keys = setupKeyboard(this);
    this.stick = new VirtualStick(this, () => {
      // PLAYING中のみ必殺技を受け付ける（レベルアップ/カプセル中の右半分タップで暴発しない）
      if (this.state.status === GAME_STATUS.PLAYING) {
        this.state.ultimateRequested = true;
      }
    });

    window.addEventListener('blur', this.onBlur);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('blur', this.onBlur);
      document.removeEventListener('visibilitychange', this.onVisibility);
      this.stick.destroy();
    });

    this.overlays.showReady(() => {
      this.state.status = GAME_STATUS.PLAYING;
    });

    this.hud.update(this.state);
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

      this.resolveTransitions();
    }

    this.hud.update(state);
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
        state.stats.capsulesOpened += 1;
        state.pendingCapsule = null;
        state.status = GAME_STATUS.PLAYING;
      });
      return;
    }

    if (hasPendingLevelUp(state)) {
      advanceLevel(state);
      if (state.player.level === 2 && state.telemetry.level2Sec === null) {
        state.telemetry.level2Sec = state.elapsedSec;
      }
      const choices = generateChoices(state);
      state.pendingChoices = choices;
      state.status = GAME_STATUS.LEVELUP;
      this.overlays.showLevelUp(state, choices, (choice) => {
        applyChoice(state, choice);
        state.pendingChoices = [];
        state.status = GAME_STATUS.PLAYING;
      });
      return;
    }

    if (state.elapsedSec >= state.durationSec) {
      this.enterResult(true);
    }
  }

  private enterResult(cleared: boolean): void {
    const state = this.state;
    state.status = cleared ? GAME_STATUS.CLEARED : GAME_STATUS.GAMEOVER;
    state.stats.survivedSec = state.elapsedSec;
    const log = buildPlayLog(state, cleared);
    // コンソールに1行JSONで出す（コピーして docs/balance-log へ）
    // eslint-disable-next-line no-console
    console.log('[vamp-pon playlog]', JSON.stringify(log));
    this.overlays.showResult(state, cleared, log, () => {
      this.scene.restart();
    });
  }
}
