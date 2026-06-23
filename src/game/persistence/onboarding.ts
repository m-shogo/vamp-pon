const STORAGE_KEY = 'vampPon.onboarding.v1';

export type OnboardingState = {
  topIntroSeen: boolean;
  stageSelectIntroSeen: boolean;
  growthIntroSeen: boolean;
  readyHintSeen: boolean;
  levelUpHintSeen: boolean;
  healHintSeen: boolean;
  capsuleHintSeen: boolean;
  eliteHintSeen: boolean;
  ultimateHintSeen: boolean;
  berserkHintSeen: boolean;
  resultHintSeen: boolean;
};

export function createDefaultOnboarding(): OnboardingState {
  return {
    topIntroSeen: false,
    stageSelectIntroSeen: false,
    growthIntroSeen: false,
    readyHintSeen: false,
    levelUpHintSeen: false,
    healHintSeen: false,
    capsuleHintSeen: false,
    eliteHintSeen: false,
    ultimateHintSeen: false,
    berserkHintSeen: false,
    resultHintSeen: false,
  };
}

function normalizeOnboarding(raw: unknown): OnboardingState {
  const base = createDefaultOnboarding();
  if (!raw || typeof raw !== 'object') return base;
  const obj = raw as Partial<OnboardingState>;
  const result = { ...base };
  for (const key of Object.keys(base) as (keyof OnboardingState)[]) {
    if (typeof obj[key] === 'boolean') result[key] = obj[key]!;
  }
  return result;
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadOnboarding(): OnboardingState {
  const storage = getStorage();
  if (!storage) return createDefaultOnboarding();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return normalizeOnboarding(raw ? JSON.parse(raw) : null);
  } catch {
    return createDefaultOnboarding();
  }
}

export function saveOnboarding(state: OnboardingState): OnboardingState {
  const normalized = normalizeOnboarding(state);
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // quota/private-mode failures must not block gameplay
  }
  return normalized;
}

export function markSeen(key: keyof OnboardingState): void {
  const state = loadOnboarding();
  state[key] = true;
  saveOnboarding(state);
}

export function resetOnboarding(): void {
  try {
    getStorage()?.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function onboardingStorageKey(): string {
  return STORAGE_KEY;
}
