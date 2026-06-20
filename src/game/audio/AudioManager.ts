import Phaser from 'phaser';
import { GAME_FEEL_CONFIG } from '../config/GameFeelConfig';

export type SeKey =
  | 'hit'
  | 'enemyDeath'
  | 'expCollect'
  | 'levelUp'
  | 'evolution'
  | 'heal'
  | 'playerDamage'
  | 'select'
  | 'reroll'
  | 'ultimate'
  | 'blackMode'
  | 'bossWarning'
  | 'clear';

type AudioVolumes = {
  master: number;
  bgm: number;
  se: number;
  muted: boolean;
};

const STORAGE_KEY = 'vampPon.audio.v1';
const MIN_INTERVAL_MS: Partial<Record<SeKey, number>> = {
  hit: 42,
  enemyDeath: 56,
  expCollect: 38,
  playerDamage: 140,
  bossWarning: 900,
};

export class AudioManager {
  private scene: Phaser.Scene | null = null;
  private volumes: AudioVolumes = { ...GAME_FEEL_CONFIG.audioVolumeDefaults, muted: false };
  private lastPlayedAt = new Map<SeKey, number>();
  private bgm: Phaser.Sound.BaseSound | null = null;
  private unlocked = false;
  private unlockHandler: (() => void) | null = null;
  private warnedMissing = new Set<string>();

  init(scene: Phaser.Scene): void {
    this.scene = scene;
    this.volumes = this.loadVolumes();
  }

  unlockOnFirstInput(): void {
    if (!this.scene || this.unlocked || this.unlockHandler) return;
    const scene = this.scene;
    this.unlockHandler = () => {
      this.unlocked = true;
      if ('unlock' in scene.sound && typeof scene.sound.unlock === 'function') scene.sound.unlock();
      if (this.unlockHandler) scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.unlockHandler);
      this.unlockHandler = null;
    };
    scene.input.once(Phaser.Input.Events.POINTER_DOWN, this.unlockHandler);
  }

  playSe(key: SeKey, options?: { volume?: number; rate?: number; detune?: number }): void {
    if (!this.scene || this.volumes.muted) return;
    const now = this.scene.time.now;
    const minInterval = MIN_INTERVAL_MS[key] ?? 0;
    const last = this.lastPlayedAt.get(key) ?? Number.NEGATIVE_INFINITY;
    if (now - last < minInterval) return;
    this.lastPlayedAt.set(key, now);

    const soundKey = `se_${key}`;
    if (!this.scene.cache.audio.exists(soundKey)) {
      this.warnMissingOnce(soundKey);
      return;
    }

    this.scene.sound.play(soundKey, {
      volume: this.resolveSeVolume(options?.volume),
      rate: options?.rate,
      detune: options?.detune,
    });
  }

  playBgm(key: string, options?: { volume?: number; loop?: boolean }): void {
    if (!this.scene || this.volumes.muted) return;
    if (!this.scene.cache.audio.exists(key)) {
      this.warnMissingOnce(key);
      return;
    }
    this.stopBgm();
    this.bgm = this.scene.sound.add(key, {
      loop: options?.loop ?? true,
      volume: this.resolveBgmVolume(options?.volume),
    });
    this.bgm.play();
  }

  stopBgm(options?: { fadeMs?: number }): void {
    if (!this.scene || !this.bgm) return;
    const bgm = this.bgm;
    this.bgm = null;
    if (options?.fadeMs && options.fadeMs > 0 && 'setVolume' in bgm) {
      this.scene.tweens.add({
        targets: bgm,
        volume: 0,
        duration: options.fadeMs,
        onComplete: () => bgm.destroy(),
      });
      return;
    }
    bgm.stop();
    bgm.destroy();
  }

  fadeBgm(toVolume: number, duration: number): void {
    if (!this.scene || !this.bgm || !('setVolume' in this.bgm)) return;
    this.scene.tweens.add({
      targets: this.bgm,
      volume: this.resolveBgmVolume(toVolume),
      duration,
    });
  }

  duckBgm(duration: number, amount: number): void {
    if (!this.scene || !this.bgm || !('setVolume' in this.bgm)) return;
    const base = this.resolveBgmVolume();
    this.scene.tweens.add({
      targets: this.bgm,
      volume: base * Math.max(0, 1 - amount),
      duration: Math.max(30, duration * 0.35),
      yoyo: true,
    });
  }

  setMasterVolume(value: number): void {
    this.volumes.master = clampVolume(value);
    this.saveVolumes();
  }

  setBgmVolume(value: number): void {
    this.volumes.bgm = clampVolume(value);
    this.saveVolumes();
    const bgm = this.bgm as (Phaser.Sound.BaseSound & { setVolume?: (volume: number) => void }) | null;
    if (bgm?.setVolume) bgm.setVolume(this.resolveBgmVolume());
  }

  setSeVolume(value: number): void {
    this.volumes.se = clampVolume(value);
    this.saveVolumes();
  }

  mute(): void {
    this.volumes.muted = true;
    this.saveVolumes();
    const sound = this.scene?.sound as (Phaser.Sound.BaseSoundManager & { setMute?: (muted: boolean) => void }) | undefined;
    if (sound?.setMute) sound.setMute(true);
  }

  unmute(): void {
    this.volumes.muted = false;
    this.saveVolumes();
    const sound = this.scene?.sound as (Phaser.Sound.BaseSoundManager & { setMute?: (muted: boolean) => void }) | undefined;
    if (sound?.setMute) sound.setMute(false);
  }

  destroy(): void {
    this.stopBgm();
    if (this.scene && this.unlockHandler) this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.unlockHandler);
    this.unlockHandler = null;
    this.scene = null;
  }

  private resolveSeVolume(volume = 1): number {
    return clampVolume(volume) * this.volumes.se * this.volumes.master;
  }

  private resolveBgmVolume(volume = 1): number {
    return clampVolume(volume) * this.volumes.bgm * this.volumes.master;
  }

  private loadVolumes(): AudioVolumes {
    if (typeof window === 'undefined') return { ...GAME_FEEL_CONFIG.audioVolumeDefaults, muted: false };
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<AudioVolumes>;
      return {
        master: typeof parsed.master === 'number' ? clampVolume(parsed.master) : GAME_FEEL_CONFIG.audioVolumeDefaults.master,
        bgm: typeof parsed.bgm === 'number' ? clampVolume(parsed.bgm) : GAME_FEEL_CONFIG.audioVolumeDefaults.bgm,
        se: typeof parsed.se === 'number' ? clampVolume(parsed.se) : GAME_FEEL_CONFIG.audioVolumeDefaults.se,
        muted: parsed.muted === true,
      };
    } catch {
      return { ...GAME_FEEL_CONFIG.audioVolumeDefaults, muted: false };
    }
  }

  private saveVolumes(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.volumes));
    } catch {
      // Audio settings are nice-to-have only.
    }
  }

  private warnMissingOnce(key: string): void {
    if (this.warnedMissing.has(key)) return;
    this.warnedMissing.add(key);
    // eslint-disable-next-line no-console
    console.debug(`[vamp-pon audio] missing optional sound: ${key}`);
  }
}

function clampVolume(value: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

const MANAGERS = new WeakMap<Phaser.Scene, AudioManager>();

export function getAudioManager(scene: Phaser.Scene): AudioManager {
  let manager = MANAGERS.get(scene);
  if (!manager) {
    manager = new AudioManager();
    manager.init(scene);
    MANAGERS.set(scene, manager);
  }
  return manager;
}
