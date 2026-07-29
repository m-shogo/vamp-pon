export const APP_PREFERENCE_STORAGE_KEY = 'yorunoShirube.appPreferences.v1';

export type AppPreferences = {
  schemaVersion: 1;
  bgmVolume: number;
  seVolume: number;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
};

export const DEFAULT_APP_PREFERENCES: Readonly<AppPreferences> = Object.freeze({
  schemaVersion: 1,
  bgmVolume: 1,
  seVolume: 1,
  hapticsEnabled: true,
  reducedMotion: false,
});

type AppPreferenceListener = (preferences: Readonly<AppPreferences>) => void;

function appPreferenceStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  return typeof globalThis.localStorage !== 'undefined' ? globalThis.localStorage : null;
}

function clampMultiplier(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.min(1, value))
    : fallback;
}

export function normalizeAppPreferences(raw: unknown): AppPreferences {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_APP_PREFERENCES };
  const value = raw as Partial<AppPreferences>;
  return {
    schemaVersion: 1,
    bgmVolume: clampMultiplier(value.bgmVolume, DEFAULT_APP_PREFERENCES.bgmVolume),
    seVolume: clampMultiplier(value.seVolume, DEFAULT_APP_PREFERENCES.seVolume),
    hapticsEnabled: typeof value.hapticsEnabled === 'boolean'
      ? value.hapticsEnabled
      : DEFAULT_APP_PREFERENCES.hapticsEnabled,
    reducedMotion: typeof value.reducedMotion === 'boolean'
      ? value.reducedMotion
      : DEFAULT_APP_PREFERENCES.reducedMotion,
  };
}

export class AppPreferenceOwner {
  private current: AppPreferences;
  private readonly listeners = new Set<AppPreferenceListener>();

  constructor(private readonly storage: Storage | null = appPreferenceStorage()) {
    this.current = this.read();
  }

  get(): Readonly<AppPreferences> {
    return this.current;
  }

  update(patch: Partial<Omit<AppPreferences, 'schemaVersion'>>): Readonly<AppPreferences> {
    this.current = normalizeAppPreferences({ ...this.current, ...patch });
    this.persist();
    for (const listener of this.listeners) listener(this.current);
    return this.current;
  }

  subscribe(listener: AppPreferenceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private read(): AppPreferences {
    try {
      return normalizeAppPreferences(JSON.parse(this.storage?.getItem(APP_PREFERENCE_STORAGE_KEY) ?? 'null'));
    } catch {
      return { ...DEFAULT_APP_PREFERENCES };
    }
  }

  private persist(): void {
    try {
      this.storage?.setItem(APP_PREFERENCE_STORAGE_KEY, JSON.stringify(this.current));
    } catch {
      // App preferences are best-effort and must never block play.
    }
  }
}

export const APP_PREFERENCES = new AppPreferenceOwner();

export function requestAppHaptic(milliseconds: number): boolean {
  if (!APP_PREFERENCES.get().hapticsEnabled || typeof navigator === 'undefined') return false;
  return navigator.vibrate?.(Math.max(0, Math.floor(milliseconds))) ?? false;
}

export function reducedMotionEnabled(): boolean {
  return APP_PREFERENCES.get().reducedMotion;
}
