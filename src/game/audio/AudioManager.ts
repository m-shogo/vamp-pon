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

export type AudioAssetSpec = {
  key: string;
  kind: 'se' | 'bgm';
  durationSec?: [number, number];
  description: string;
};

type AudioManifestEntry = {
  key: string;
  url: string;
};

type AudioManifest = {
  version?: number;
  assets?: AudioManifestEntry[];
};

export const AUDIO_ASSET_SPECS: readonly AudioAssetSpec[] = [
  { key: 'se_hit', kind: 'se', durationSec: [0.04, 0.08], description: '敵に当たった瞬間。短く紙とインクが弾ける音。' },
  { key: 'se_enemyDeath', kind: 'se', durationSec: [0.08, 0.18], description: '影がほどける音。連続killでrateを少し上げる。' },
  { key: 'se_expCollect', kind: 'se', durationSec: [0.03, 0.08], description: '記憶片の取得。pitch ladder向け。' },
  { key: 'se_levelUp', kind: 'se', durationSec: [0.5, 1.0], description: 'ご褒美感のあるランタン/紙片の上昇音。BGM duck対象。' },
  { key: 'se_evolution', kind: 'se', durationSec: [0.8, 1.4], description: '進化専用。紙片が集まって光る音。BGM duck対象。' },
  { key: 'se_heal', kind: 'se', durationSec: [0.1, 0.25], description: '柔らかい回復音。' },
  { key: 'se_playerDamage', kind: 'se', durationSec: [0.1, 0.25], description: '被弾。痛いが耳に刺さらない低い紙擦れ。' },
  { key: 'se_ultimate', kind: 'se', durationSec: [0.5, 1.2], description: '必殺。横方向の光と同期。BGM duck対象。' },
  { key: 'se_blackMode', kind: 'se', durationSec: [0.5, 1.2], description: '黒耀化。黒炎の脈動。BGM duck対象。' },
  { key: 'se_bossWarning', kind: 'se', durationSec: [0.5, 1.0], description: 'ボス警告。短い低域と紙の震え。' },
  { key: 'se_clear', kind: 'se', durationSec: [0.6, 1.2], description: 'クリア/朝演出。BGM duck対象。' },
  { key: 'se_select', kind: 'se', durationSec: [0.05, 0.1], description: 'カード選択/ボタン押下。軽い紙の捲れ音。' },
  { key: 'se_reroll', kind: 'se', durationSec: [0.08, 0.15], description: 'リロール。紙を払う短い音。' },
  { key: 'bgm_stage1', kind: 'bgm', description: 'Stage1通常BGM。ループ前提。' },
  { key: 'bgm_boss', kind: 'bgm', description: 'ボス/オンブロBGM。ループ前提。' },
  { key: 'bgm_clear', kind: 'bgm', description: '朝/リザルト寄りBGM。ループまたは短尺。' },
] as const;

type AudioVolumes = {
  master: number;
  bgm: number;
  se: number;
  muted: boolean;
};

const AUDIO_MANIFEST_URL = '/assets/audio/audio-manifest.json';
const KNOWN_AUDIO_KEYS = new Set(AUDIO_ASSET_SPECS.map((spec) => spec.key));
const STORAGE_KEY = 'vampPon.audio.v1';
const MIN_INTERVAL_MS: Partial<Record<SeKey, number>> = {
  hit: 42,
  enemyDeath: 56,
  expCollect: 38,
  playerDamage: 140,
  bossWarning: 900,
};

const DUCK_ON_SE: Partial<Record<SeKey, { duration: number; amount: number }>> = {
  levelUp: { duration: 420, amount: 0.28 },
  evolution: { duration: 620, amount: 0.42 },
  ultimate: { duration: 420, amount: 0.34 },
  blackMode: { duration: 520, amount: 0.32 },
  clear: { duration: 900, amount: 0.48 },
};

export class AudioManager {
  private scene: Phaser.Scene | null = null;
  private volumes: AudioVolumes = { ...GAME_FEEL_CONFIG.audioVolumeDefaults, muted: false };
  private lastPlayedAt = new Map<SeKey, number>();
  private bgm: Phaser.Sound.BaseSound | null = null;
  private unlocked = false;
  private unlockHandler: (() => void) | null = null;
  private warnedMissing = new Set<string>();
  private audioContext: AudioContext | null = null;
  private expLadder = 0;
  private lastExpAtMs = Number.NEGATIVE_INFINITY;

  init(scene: Phaser.Scene): void {
    this.scene = scene;
    this.volumes = this.loadVolumes();
  }

  async preloadAudioAssets(scene: Phaser.Scene): Promise<number> {
    let manifest: AudioManifest;
    try {
      const res = await fetch(AUDIO_MANIFEST_URL, { cache: 'no-store' });
      if (!res.ok) return 0;
      manifest = await res.json() as AudioManifest;
    } catch { return 0; }

    const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
    let queued = 0;
    for (const asset of assets) {
      if (!KNOWN_AUDIO_KEYS.has(asset.key) || typeof asset.url !== 'string' || asset.url.length === 0) continue;
      if (scene.cache.audio.exists(asset.key)) continue;
      scene.load.audio(asset.key, asset.url);
      queued += 1;
    }
    return queued;
  }

  unlockOnFirstInput(): void {
    if (!this.scene || this.unlocked || this.unlockHandler) return;
    const scene = this.scene;
    this.unlockHandler = () => {
      this.unlocked = true;
      if ('unlock' in scene.sound && typeof scene.sound.unlock === 'function') scene.sound.unlock();
      this.ensureAudioContext()?.resume?.();
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
    const duck = DUCK_ON_SE[key];
    if (duck) this.duckBgm(duck.duration, duck.amount);

    const soundKey = soundKeyForSe(key);
    if (!this.scene.cache.audio.exists(soundKey)) {
      this.warnMissingOnce(soundKey);
      this.playFallbackSe(key, options);
      return;
    }

    this.scene.sound.play(soundKey, {
      volume: this.resolveSeVolume(options?.volume),
      rate: options?.rate,
      detune: options?.detune,
    });
  }

  playExpCollect(): void {
    if (!this.scene) return;
    const now = this.scene.time.now;
    this.expLadder = now - this.lastExpAtMs < 420 ? Math.min(this.expLadder + 1, 7) : 0;
    this.lastExpAtMs = now;
    this.playSe('expCollect', {
      volume: 0.28,
      rate: 1 + this.expLadder * 0.035 + Math.random() * 0.04,
      detune: this.expLadder * 18,
    });
  }

  playEnemyDeath(comboCount = 1, elite = false): void {
    this.playSe('enemyDeath', {
      volume: elite ? 0.88 : 0.52,
      rate: (elite ? 0.9 : 0.98) + Math.min(comboCount, 20) * 0.006 + Math.random() * 0.04,
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

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!this.audioContext) this.audioContext = new AudioContextClass();
    return this.audioContext;
  }

  private playFallbackSe(key: SeKey, options?: { volume?: number; rate?: number; detune?: number }): void {
    const ctx = this.ensureAudioContext();
    if (!ctx || ctx.state === 'suspended') return;
    const spec = fallbackSpecFor(key);
    if (!spec) return;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    const rate = options?.rate ?? 1;
    const detune = options?.detune ?? 0;
    const volume = this.resolveSeVolume(options?.volume ?? spec.volume);
    osc.type = spec.type;
    osc.frequency.setValueAtTime(spec.frequency * rate, now);
    osc.detune.setValueAtTime(detune, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + spec.duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + spec.duration + 0.02);
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

function soundKeyForSe(key: SeKey): string {
  return `se_${key}`;
}

function clampVolume(value: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function fallbackSpecFor(key: SeKey): { frequency: number; duration: number; volume: number; type: OscillatorType } | null {
  switch (key) {
    case 'hit': return { frequency: 210, duration: 0.045, volume: 0.05, type: 'triangle' };
    case 'enemyDeath': return { frequency: 130, duration: 0.12, volume: 0.09, type: 'sawtooth' };
    case 'expCollect': return { frequency: 720, duration: 0.055, volume: 0.04, type: 'sine' };
    case 'levelUp': return { frequency: 520, duration: 0.45, volume: 0.08, type: 'triangle' };
    case 'evolution': return { frequency: 390, duration: 0.72, volume: 0.08, type: 'triangle' };
    case 'heal': return { frequency: 610, duration: 0.14, volume: 0.05, type: 'sine' };
    case 'playerDamage': return { frequency: 95, duration: 0.16, volume: 0.08, type: 'sawtooth' };
    case 'ultimate': return { frequency: 260, duration: 0.56, volume: 0.08, type: 'triangle' };
    case 'blackMode': return { frequency: 150, duration: 0.62, volume: 0.08, type: 'sawtooth' };
    case 'bossWarning': return { frequency: 180, duration: 0.65, volume: 0.08, type: 'square' };
    case 'clear': return { frequency: 660, duration: 0.7, volume: 0.08, type: 'triangle' };
    case 'select':
    case 'reroll':
      return { frequency: key === 'select' ? 420 : 360, duration: 0.08, volume: 0.04, type: 'sine' };
  }
}

const MANAGERS = new WeakMap<Phaser.Scene, AudioManager>();

export function getAudioManager(scene: Phaser.Scene): AudioManager {
  let manager = MANAGERS.get(scene);
  if (!manager) {
    manager = new AudioManager();
    MANAGERS.set(scene, manager);
  }
  manager.init(scene);
  return manager;
}
