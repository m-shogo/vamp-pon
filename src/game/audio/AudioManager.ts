import Phaser from 'phaser';
import { GAME_FEEL_CONFIG } from '../config/GameFeelConfig';

export type SeKey =
  | 'ui_select' | 'ui_confirm' | 'ui_cancel' | 'ui_open' | 'ui_close'
  | 'hit' | 'enemy_death' | 'enemy_death_elite' | 'player_damage'
  | 'heal_pickup' | 'exp_pickup' | 'capsule_open'
  | 'levelup' | 'choice_select' | 'evolution' | 'stage_unlock'
  | 'result_count' | 'currency_gain'
  | 'boss_warning' | 'boss_hit' | 'boss_defeat'
  | 'berserk_ready' | 'berserk_start' | 'berserk_end'
  | 'ultimate_ready' | 'ultimate_fire' | 'ultimate_cut_in'
  | 'result_clear' | 'result_defeat';

export type BgmKey = 'bgm_top' | 'bgm_stage1' | 'bgm_stage2' | 'bgm_result' | 'bgm_growth';
export type AudioCategory = 'bgm' | 'ui' | 'combat' | 'reward' | 'boss' | 'berserk' | 'ultimate' | 'result';

export type AudioAssetSpec = {
  key: SeKey | BgmKey;
  kind: 'se' | 'bgm';
  category: AudioCategory;
  recommendedVolume: number;
  description: string;
};

export type AudioManifestEntry = { key: string; url: string };
export type AudioManifest = { version?: number; assets?: AudioManifestEntry[]; optionalKeys?: string[] };

const specs = (
  category: AudioCategory,
  recommendedVolume: number,
  entries: ReadonlyArray<readonly [SeKey | BgmKey, string]>,
): AudioAssetSpec[] => entries.map(([key, description]) => ({
  key,
  kind: category === 'bgm' ? 'bgm' : 'se',
  category,
  recommendedVolume,
  description,
}));

export const AUDIO_ASSET_SPECS: readonly AudioAssetSpec[] = [
  ...specs('bgm', 0.34, [
    ['bgm_top', 'TOP/menu BGM'], ['bgm_stage1', 'Stage1 BGM'], ['bgm_stage2', 'Stage2 BGM'],
    ['bgm_result', 'Result BGM'], ['bgm_growth', '成長/収集画面 BGM'],
  ]),
  ...specs('ui', 0.42, [
    ['ui_select', 'カーソル/軽い選択'], ['ui_confirm', '決定'], ['ui_cancel', 'キャンセル'],
    ['ui_open', 'パネルを開く'], ['ui_close', 'パネルを閉じる'],
  ]),
  ...specs('combat', 0.38, [
    ['hit', '通常ヒット'], ['enemy_death', '通常敵撃破'], ['enemy_death_elite', 'エリート撃破'],
    ['player_damage', 'プレイヤー被弾'], ['heal_pickup', '回復取得'], ['exp_pickup', 'EXP取得'],
    ['capsule_open', 'カプセル開封'],
  ]),
  ...specs('reward', 0.55, [
    ['levelup', 'レベルアップ'], ['choice_select', 'レベルアップ選択決定'], ['evolution', '進化/合体'],
    ['stage_unlock', 'ステージ解放'], ['result_count', 'Resultカウント'], ['currency_gain', '通貨獲得'],
  ]),
  ...specs('boss', 0.64, [
    ['boss_warning', 'ボス警告'], ['boss_hit', 'ボスへの強打'], ['boss_defeat', 'ボス撃破'],
  ]),
  ...specs('berserk', 0.58, [
    ['berserk_ready', '黒曜準備完了'], ['berserk_start', '黒曜開始'], ['berserk_end', '黒曜終了'],
  ]),
  ...specs('ultimate', 0.62, [
    ['ultimate_ready', '必殺準備完了'], ['ultimate_fire', '必殺発動'], ['ultimate_cut_in', '必殺カットイン'],
  ]),
  ...specs('result', 0.58, [
    ['result_clear', 'クリア遷移'], ['result_defeat', '敗北遷移'],
  ]),
] as const;

type AudioVolumes = { master: number; bgm: number; se: number; muted: boolean };
export type PlaySeOptions = {
  volume?: number;
  rate?: number;
  detune?: number;
  cooldownMs?: number;
  priority?: number;
};

const AUDIO_MANIFEST_URL = '/assets/audio/audio-manifest.json';
const KNOWN_AUDIO_KEYS = new Set<string>(AUDIO_ASSET_SPECS.map((spec) => spec.key));
const STORAGE_KEY = 'vampPon.audio.v1';
const MIN_INTERVAL_MS: Partial<Record<SeKey, number>> = {
  hit: 55,
  enemy_death: 80,
  enemy_death_elite: 120,
  exp_pickup: 55,
  result_count: 90,
  player_damage: 160,
  boss_hit: 100,
  boss_warning: 900,
};

const DUCK_ON_SE: Partial<Record<SeKey, { duration: number; amount: number }>> = {
  levelup: { duration: 420, amount: 0.26 },
  evolution: { duration: 620, amount: 0.4 },
  boss_warning: { duration: 600, amount: 0.32 },
  boss_defeat: { duration: 800, amount: 0.5 },
  berserk_start: { duration: 520, amount: 0.3 },
  ultimate_fire: { duration: 440, amount: 0.34 },
  result_clear: { duration: 900, amount: 0.48 },
  result_defeat: { duration: 650, amount: 0.56 },
};

export function bgmKeyForStage(stageNumber: number): BgmKey {
  return stageNumber === 2 ? 'bgm_stage2' : 'bgm_stage1';
}

export function selectPreloadableAudioAssets(manifest: AudioManifest): AudioManifestEntry[] {
  const seenKeys = new Set<string>();
  const seenUrls = new Set<string>();
  const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
  return assets.filter((asset) => {
    if (!KNOWN_AUDIO_KEYS.has(asset.key) || typeof asset.url !== 'string' || asset.url.trim().length === 0) return false;
    if (seenKeys.has(asset.key) || seenUrls.has(asset.url)) return false;
    seenKeys.add(asset.key);
    seenUrls.add(asset.url);
    return true;
  });
}

export function isCooldownReady(lastPlayedAt: number | undefined, now: number, cooldownMs: number): boolean {
  return now - (lastPlayedAt ?? Number.NEGATIVE_INFINITY) >= Math.max(0, cooldownMs);
}

export class AudioManager {
  private scene: Phaser.Scene | null = null;
  private volumes: AudioVolumes = { ...GAME_FEEL_CONFIG.audioVolumeDefaults, muted: false };
  private volumesLoaded = false;
  private lastPlayedAt = new Map<SeKey, number>();
  private bgm: Phaser.Sound.BaseSound | null = null;
  private bgmKey: BgmKey | null = null;
  private userActivated = false;
  private unlockHandler: (() => void) | null = null;
  private pendingBgm: { key: BgmKey; options?: { volume?: number; loop?: boolean; fadeMs?: number } } | null = null;
  private warnedMissing = new Set<string>();
  private audioContext: AudioContext | null = null;
  private expLadder = 0;
  private lastExpAtMs = Number.NEGATIVE_INFINITY;
  private lastPriority = 0;
  private lastPriorityAt = Number.NEGATIVE_INFINITY;

  init(scene: Phaser.Scene): void {
    if (this.scene !== scene && this.scene && this.unlockHandler) {
      this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.unlockHandler);
      this.unlockHandler = null;
    }
    this.scene = scene;
    if (!this.volumesLoaded) {
      this.volumes = this.loadVolumes();
      this.volumesLoaded = true;
    }
    const sound = scene.sound as Phaser.Sound.BaseSoundManager & { setMute?: (muted: boolean) => void };
    sound.setMute?.(this.volumes.muted);
  }

  async preloadAudioAssets(scene: Phaser.Scene): Promise<number> {
    let manifest: AudioManifest;
    try {
      const res = await fetch(AUDIO_MANIFEST_URL, { cache: 'no-store' });
      if (!res.ok) return 0;
      manifest = await res.json() as AudioManifest;
    } catch { return 0; }

    let queued = 0;
    for (const asset of selectPreloadableAudioAssets(manifest)) {
      if (scene.cache.audio.exists(asset.key)) continue;
      scene.load.audio(asset.key, asset.url);
      queued += 1;
    }
    return queued;
  }

  unlockOnFirstInput(): void {
    if (!this.scene || this.userActivated || this.unlockHandler) return;
    const scene = this.scene;
    this.unlockHandler = () => {
      this.userActivated = true;
      if ('unlock' in scene.sound && typeof scene.sound.unlock === 'function') scene.sound.unlock();
      void this.ensureAudioContext()?.resume?.();
      if (this.unlockHandler) scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.unlockHandler);
      this.unlockHandler = null;
      const pending = this.pendingBgm;
      this.pendingBgm = null;
      if (pending) this.playBgm(pending.key, pending.options);
    };
    scene.input.once(Phaser.Input.Events.POINTER_DOWN, this.unlockHandler);
  }

  playSe(key: SeKey, options?: PlaySeOptions): void {
    if (!this.scene || this.volumes.muted || !this.userActivated) return;
    const now = this.scene.time.now;
    const cooldown = options?.cooldownMs ?? MIN_INTERVAL_MS[key] ?? 0;
    if (!isCooldownReady(this.lastPlayedAt.get(key), now, cooldown)) return;
    const priority = options?.priority ?? 0;
    if (priority < this.lastPriority && now - this.lastPriorityAt < 80) return;
    this.lastPlayedAt.set(key, now);
    if (priority > 0) {
      this.lastPriority = priority;
      this.lastPriorityAt = now;
    } else if (now - this.lastPriorityAt >= 80) {
      this.lastPriority = 0;
    }
    const duck = DUCK_ON_SE[key];
    if (duck) this.duckBgm(duck.duration, duck.amount);

    if (!this.scene.cache.audio.exists(key)) {
      this.warnMissingOnce(key);
      this.playFallbackSe(key, options);
      return;
    }
    this.scene.sound.play(key, {
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
    this.playSe('exp_pickup', {
      volume: 0.24,
      rate: 1 + this.expLadder * 0.035 + Math.random() * 0.04,
      detune: this.expLadder * 18,
    });
  }

  playEnemyDeath(comboCount = 1, elite = false): void {
    this.playSe(elite ? 'enemy_death_elite' : 'enemy_death', {
      volume: elite ? 0.7 : 0.4,
      rate: (elite ? 0.9 : 0.98) + Math.min(comboCount, 20) * 0.006 + Math.random() * 0.04,
      priority: elite ? 2 : 0,
    });
  }

  playBgm(key: BgmKey, options?: { volume?: number; loop?: boolean; fadeMs?: number }): boolean {
    if (!this.scene) return false;
    if (!this.scene.cache.audio.exists(key)) {
      this.warnMissingOnce(key);
      return false;
    }
    if (this.volumes.muted || !this.userActivated) {
      this.pendingBgm = { key, options };
      return true;
    }
    if (this.bgm?.isPlaying && this.bgmKey === key) return true;
    this.stopBgm({ fadeMs: options?.fadeMs });
    const fadeMs = options?.fadeMs ?? 0;
    const targetVolume = this.resolveBgmVolume(options?.volume ?? 1);
    this.bgmKey = key;
    this.bgm = this.scene.sound.add(key, {
      loop: options?.loop ?? true,
      volume: fadeMs > 0 ? 0 : targetVolume,
    });
    this.bgm.play();
    if (fadeMs > 0 && 'setVolume' in this.bgm) {
      this.scene.tweens.add({ targets: this.bgm, volume: targetVolume, duration: fadeMs });
    }
    return true;
  }

  stopBgm(options?: { fadeMs?: number }): void {
    this.pendingBgm = null;
    if (!this.scene || !this.bgm) return;
    const bgm = this.bgm;
    this.bgm = null;
    this.bgmKey = null;
    if (options?.fadeMs && options.fadeMs > 0 && 'setVolume' in bgm) {
      this.scene.tweens.add({
        targets: bgm, volume: 0, duration: options.fadeMs,
        onComplete: () => bgm.destroy(),
      });
      return;
    }
    bgm.stop();
    bgm.destroy();
  }

  fadeBgm(toVolume: number, duration: number): void {
    if (!this.scene || !this.bgm || !('setVolume' in this.bgm)) return;
    this.scene.tweens.add({ targets: this.bgm, volume: this.resolveBgmVolume(toVolume), duration });
  }

  duckBgm(duration: number, amount: number): void {
    if (!this.scene || !this.bgm || !('setVolume' in this.bgm)) return;
    const base = this.resolveBgmVolume();
    this.scene.tweens.killTweensOf(this.bgm);
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
    const bgm = this.bgm as (Phaser.Sound.BaseSound & { setVolume?: (volume: number) => void }) | null;
    bgm?.setVolume?.(this.resolveBgmVolume());
  }
  setBgmVolume(value: number): void {
    this.volumes.bgm = clampVolume(value);
    this.saveVolumes();
    const bgm = this.bgm as (Phaser.Sound.BaseSound & { setVolume?: (volume: number) => void }) | null;
    bgm?.setVolume?.(this.resolveBgmVolume());
  }
  setSeVolume(value: number): void { this.volumes.se = clampVolume(value); this.saveVolumes(); }
  mute(): void {
    this.volumes.muted = true;
    this.saveVolumes();
    const sound = this.scene?.sound as (Phaser.Sound.BaseSoundManager & { setMute?: (muted: boolean) => void }) | undefined;
    sound?.setMute?.(true);
  }
  unmute(): void {
    this.volumes.muted = false;
    this.saveVolumes();
    const sound = this.scene?.sound as (Phaser.Sound.BaseSoundManager & { setMute?: (muted: boolean) => void }) | undefined;
    sound?.setMute?.(false);
    const pending = this.pendingBgm;
    if (pending && this.userActivated) {
      this.pendingBgm = null;
      this.playBgm(pending.key, pending.options);
    }
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

  private playFallbackSe(key: SeKey, options?: PlaySeOptions): void {
    const ctx = this.ensureAudioContext();
    if (!ctx || ctx.state === 'suspended') return;
    const spec = fallbackSpecFor(key);
    if (!spec) return;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    const volume = this.resolveSeVolume(options?.volume ?? spec.volume);
    osc.type = spec.type;
    osc.frequency.setValueAtTime(spec.frequency * (options?.rate ?? 1), now);
    osc.detune.setValueAtTime(options?.detune ?? 0, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + spec.duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + spec.duration + 0.02);
  }

  private resolveSeVolume(volume = 1): number { return clampVolume(volume) * this.volumes.se * this.volumes.master; }
  private resolveBgmVolume(volume = 1): number { return clampVolume(volume) * this.volumes.bgm * this.volumes.master; }

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
    } catch { return { ...GAME_FEEL_CONFIG.audioVolumeDefaults, muted: false }; }
  }

  private saveVolumes(): void {
    if (typeof window === 'undefined') return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.volumes)); } catch { /* optional setting */ }
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

declare global { interface Window { webkitAudioContext?: typeof AudioContext } }

function fallbackSpecFor(key: SeKey): { frequency: number; duration: number; volume: number; type: OscillatorType } {
  if (key === 'hit' || key === 'boss_hit') return { frequency: key === 'boss_hit' ? 150 : 210, duration: 0.045, volume: 0.04, type: 'triangle' };
  if (key === 'enemy_death' || key === 'enemy_death_elite' || key === 'boss_defeat') return { frequency: key === 'boss_defeat' ? 100 : 130, duration: key === 'boss_defeat' ? 0.5 : 0.12, volume: 0.07, type: 'sawtooth' };
  if (key === 'exp_pickup' || key === 'result_count' || key === 'currency_gain') return { frequency: 720, duration: 0.055, volume: 0.035, type: 'sine' };
  if (key === 'player_damage' || key === 'result_defeat') return { frequency: 95, duration: 0.16, volume: 0.07, type: 'sawtooth' };
  if (key === 'boss_warning' || key.startsWith('berserk_')) return { frequency: 170, duration: 0.42, volume: 0.065, type: 'square' };
  if (key.startsWith('ultimate_')) return { frequency: 260, duration: 0.5, volume: 0.07, type: 'triangle' };
  if (key === 'levelup' || key === 'evolution' || key === 'stage_unlock' || key === 'result_clear') return { frequency: 560, duration: 0.42, volume: 0.065, type: 'triangle' };
  if (key === 'heal_pickup') return { frequency: 610, duration: 0.14, volume: 0.045, type: 'sine' };
  return { frequency: key === 'ui_cancel' ? 330 : 420, duration: 0.08, volume: 0.035, type: 'sine' };
}

const MANAGER = new AudioManager();

export function getAudioManager(scene: Phaser.Scene): AudioManager {
  MANAGER.init(scene);
  return MANAGER;
}
