import { GLOW_ALPHA_MAX } from '../ui/visualDesign.ts';
import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export type WorldEffectId =
  | 'NORMAL_ATTACK'
  | 'CRITICAL'
  | 'LEVEL_UP'
  | 'WEAPON_EVOLUTION'
  | 'TOUMON'
  | 'KOKUYOU'
  | 'DAWN'
  | 'HEAL'
  | 'PICKUP'
  | 'BOSS_ENTRY'
  | 'BOSS_DEATH'
  | 'CLEAR'
  | 'REWARD_UNLOCK';

export type HapticSemantic =
  | 'H0_NONE'
  | 'H1_MICRO_CANDIDATE'
  | 'H2_LIGHT_MEDIUM_CURRENT_DIRECTION'
  | 'H3_STRONG_CURRENT_DIRECTION'
  | 'H4_SPECIAL_CURRENT_DIRECTION'
  | 'NO_DEFAULT_UNTIL_DEVICE_REVIEW';

export type WorldEffectSharedSourceEntry = {
  id: WorldEffectId;
  semanticAuthority: 'CURRENT_DIRECTION_ADAPTER';
  shape: string;
  color: string;
  duration: string;
  particleBehavior: string;
  screenShakeRule: string;
  flashRule: string;
  mobileReadability: string;
  photosensitiveSafety: string;
  audioHook: string;
  hapticHook: HapticSemantic;
  reducedMotionRule: string;
  reducedFlashRule: string;
  avoid: readonly string[];
  authoritySources: readonly ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'];
  runtimeReady: false;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
};

const COMMON_AVOID = [
  'neon cyan/purple AI glow',
  'giant blurred glow',
  'glassmorphism or SaaS gradient',
  'generic magic circle or runes',
  'screen-filling particle fog',
  'full-screen white flash as strength shorthand',
  'continuous camera shake',
  'critical information communicated only by audio or haptic',
] as const;

const PHOTOSENSITIVE_BASE = 'No strobe loop. Never rely on repeated full-screen luminance changes. Keep effect local, preserve a reduced-flash path, and pair meaning with stable shape/value cues.';
const REDUCED_MOTION_BASE = 'Shorten or remove secondary particles, camera movement and drift while preserving the primary semantic shape.';
const REDUCED_FLASH_BASE = 'Remove transient brightness pulse first; preserve the event through shape, outline, material change and native UI state.';

export const worldEffectSharedSourceEntries: readonly WorldEffectSharedSourceEntry[] = [
  {
    id: 'NORMAL_ATTACK', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'weapon-native line, paper edge, object arc or ink trace; weapon identity wins over a universal effect',
    color: 'weapon/source palette with practical paper/ink/light values; glow remains subordinate',
    duration: 'very short, fatigue-safe for repeated fire',
    particleBehavior: '0-3 local fragments or one short trail; high-rate weapons reduce secondary particles further',
    screenShakeRule: 'NONE by default',
    flashRule: 'NONE by default; no per-hit flash loop',
    mobileReadability: 'primary attack direction and hit area readable without particle density at 390x844',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'short, soft, pitch/variation friendly; avoid machine-gun fatigue',
    hapticHook: 'H0_NONE',
    reducedMotionRule: REDUCED_MOTION_BASE, reducedFlashRule: REDUCED_FLASH_BASE,
    avoid: COMMON_AVOID,
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'CRITICAL', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'normal impact shape plus one crisp offset paper-cut/cross-hatch accent; not a new attack language',
    color: 'same attack palette with one restrained warm/high-value accent',
    duration: 'short single accent, clearly above normal hit but below LevelUp/Evolution',
    particleBehavior: 'one compact directional burst; never radial confetti',
    screenShakeRule: 'MICRO_CANDIDATE only if gameplay testing proves value',
    flashRule: 'single local pulse candidate; never full screen',
    mobileReadability: 'critical state must remain readable by shape/number/native UI even with flash disabled',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'one slightly sharper attack-layer accent; do not multiply loudness with rapid crit chains',
    hapticHook: 'NO_DEFAULT_UNTIL_DEVICE_REVIEW',
    reducedMotionRule: REDUCED_MOTION_BASE, reducedFlashRule: REDUCED_FLASH_BASE,
    avoid: [...COMMON_AVOID, 'casino jackpot critical effect', 'giant starburst'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'LEVEL_UP', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'paper opens, small light cue, card reveal, selection, paper confirm, then return to battle',
    color: 'paper cream + lantern warmth; rare may add one restrained seal-like accent',
    duration: 'UI-sequence driven; each reveal cue short and battle return immediate after confirmation',
    particleBehavior: 'minimal paper flecks around reveal only',
    screenShakeRule: 'NONE',
    flashRule: 'no full-screen flash; small local light cue only',
    mobileReadability: 'card content/native text is primary; VFX never covers option text',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'paper open/light cue → short reveal → paper confirm → battle return',
    hapticHook: 'H2_LIGHT_MEDIUM_CURRENT_DIRECTION',
    reducedMotionRule: 'replace paper opening motion with short opacity/position settle while preserving selection order', reducedFlashRule: REDUCED_FLASH_BASE,
    avoid: [...COMMON_AVOID, 'loot-box reveal', 'slot-machine rarity burst'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'WEAPON_EVOLUTION', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'base-object traces converge, visibly transform, then settle into the approved evolved-object lineage',
    color: 'upgrade/fusion/awakening accents derive from existing EVOLUTION_ACCENT tokens and source weapon palette',
    duration: 'clearly above LevelUp but intentionally short enough to return attention to the new weapon sound/behavior',
    particleBehavior: 'convergence first, one completion release, then stop; no endless aura',
    screenShakeRule: 'one restrained completion impulse candidate only after device review',
    flashRule: 'one local completion pulse, never full-screen white',
    mobileReadability: 'before→after silhouette must remain legible behind/without particles',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'convergence → transformation → completion; no casino jackpot, EDM drop or long fanfare',
    hapticHook: 'H3_STRONG_CURRENT_DIRECTION',
    reducedMotionRule: 'use a short cross-state morph/outline swap without particle convergence', reducedFlashRule: REDUCED_FLASH_BASE,
    avoid: [...COMMON_AVOID, 'casino jackpot', 'huge EDM drop', 'long fanfare'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'TOUMON', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'Character Toumon semantic event placeholder only; exact geometry comes only from final approved Toumon vector master',
    color: 'one-color Character/theme usage according to Toumon authority; no rainbow/neon aura',
    duration: 'short recognition cue; geometry should be readable before any secondary light',
    particleBehavior: 'none or tiny paper/ink settling only',
    screenShakeRule: 'NONE',
    flashRule: 'NONE by default',
    mobileReadability: '16px semantic identity must not depend on VFX; effect cannot fix weak Toumon geometry',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'small paper/seal/identity cue candidate; not a Character theme takeover',
    hapticHook: 'H1_MICRO_CANDIDATE',
    reducedMotionRule: 'static Toumon/native state only', reducedFlashRule: 'no flash required',
    avoid: [...COMMON_AVOID, 'AI-generated final Toumon geometry', 'literal animal/zodiac glyph substitute'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'KOKUYOU', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'three-phase pressure language: Ready tension/ink pressure → Activate ink slash + lantern core → Recovery layers exhale/peel away',
    color: 'black ink + restrained Character/source light; never evil-purple transformation shorthand',
    duration: 'phase-based and gameplay-authored; activation itself stays brief',
    particleBehavior: 'ink pressure gathers locally, one slash/release, then high-frequency detail removes during recovery',
    screenShakeRule: 'one restrained activation impulse candidate; no continuous shake',
    flashRule: 'brief duck/silence/light contrast instead of white flash',
    mobileReadability: 'state must read from stable silhouette/material and native HUD, not only particles',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'Ready tension/ink pressure → brief silence/duck → ink slash + lantern core + low impact → recovery exhale',
    hapticHook: 'H3_STRONG_CURRENT_DIRECTION',
    reducedMotionRule: 'use ink boundary/value state changes and omit secondary pressure particles', reducedFlashRule: 'use audio duck + stable material contrast; no brightness pulse',
    avoid: [...COMMON_AVOID, 'evil transformation sound/look', 'demon aura', 'everything automatically Kokuyou'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'DAWN', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'night layers open and thin out; warm route/air space appears without erasing paper, repair or memory traces',
    color: 'night-to-warm-dawn progression using restrained paper/lantern values, not white-out gold',
    duration: 'major completion breath with room after battle noise drops; openness matters more than loudness',
    particleBehavior: 'particles reduce rather than multiply; a few slow paper/light traces may drift outward',
    screenShakeRule: 'NONE or one very soft completion settle after device review',
    flashRule: 'NO WHITEOUT; dawn is a value/color opening, not a flash event',
    mobileReadability: 'clear state remains visible through stable palette/UI even with all animation disabled',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'battle layers withdraw → dawn air → warm harmonic resolution with breathing room',
    hapticHook: 'H4_SPECIAL_CURRENT_DIRECTION',
    reducedMotionRule: 'crossfade stable night/dawn values with no drifting particles', reducedFlashRule: 'identical semantic path; DAWN never needs a flash',
    avoid: [...COMMON_AVOID, 'literal sunrise rays everywhere', 'victory whiteout', 'largest/loudest effect simply because it is Dawn'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'HEAL', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'small repaired line, paper seam or warm return trace around the affected target; no medical cross required',
    color: 'paper/lantern/source-safe warm value; do not default to neon green',
    duration: 'short confirmation only',
    particleBehavior: '0-3 inward/settling traces rather than upward sparkle fountain',
    screenShakeRule: 'NONE',
    flashRule: 'NONE',
    mobileReadability: 'health/state UI change is primary; VFX is secondary confirmation',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'soft paper/wood/glass confirmation candidate; no potion glug by default',
    hapticHook: 'H0_NONE',
    reducedMotionRule: 'static repaired-line cue or omit VFX', reducedFlashRule: 'no flash required',
    avoid: [...COMMON_AVOID, 'generic green plus', 'healing fountain sparkle'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'PICKUP', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'compact item/memory trace pulls toward player; pickup object silhouette remains identifiable',
    color: 'item/source palette with tiny muted glass/wood/paper highlight',
    duration: 'very short and streak-safe',
    particleBehavior: 'one compact trail or ripple; repeated pickups simplify further',
    screenShakeRule: 'NONE',
    flashRule: 'NONE for normal pickup; rare variation may use one local accent only',
    mobileReadability: 'collection direction/read remains visible at high pickup density without overlaying combat center',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'small pitch-up muted glass/wood/paper hybrid; pitch ladder may reset; never default coin sound',
    hapticHook: 'H0_NONE',
    reducedMotionRule: 'short direct pull or immediate disappear + native counter update', reducedFlashRule: 'normal pickup has no flash',
    avoid: [...COMMON_AVOID, 'coin sound/coin burst', 'loot beam'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'BOSS_ENTRY', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'stage motif over-fixes into the Great Shadow/Boss silhouette; environment relation explains scale before particles',
    color: 'stage/boss source palette with black-ink fixation; no universal boss-red overlay',
    duration: 'readable staged entry with a deliberate quiet/low-density moment before combat resumes',
    particleBehavior: 'scene motif gathers inward; stop once boss silhouette is established',
    screenShakeRule: 'NO_DEFAULT_UNTIL_DEVICE_REVIEW',
    flashRule: 'no full-screen flash; use contrast/quiet/state transition',
    mobileReadability: 'boss silhouette/tell remains visible and HUD remains legible throughout entry',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'intentional silence/low density may precede phase entry; motif-driven low layer without trailer boom',
    hapticHook: 'NO_DEFAULT_UNTIL_DEVICE_REVIEW',
    reducedMotionRule: 'short environment value change + boss silhouette reveal', reducedFlashRule: REDUCED_FLASH_BASE,
    avoid: [...COMMON_AVOID, 'trailer bass boom', 'universal red boss flash', 'screen-filling smoke'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'BOSS_DEATH', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'large wrong reading stops enforcing itself, then ink/paper layers unbind in sequence and the released clue remains longest',
    color: 'boss/stage palette relaxes from black fixation toward ordinary clue/material and dawn-safe values',
    duration: 'longer than normal enemy defeat, but sequence ends before result presentation begins',
    particleBehavior: 'ordered unbinding/tearing; fewer larger readable layers rather than explosion confetti',
    screenShakeRule: 'one restrained final release candidate after device review',
    flashRule: 'no death explosion white flash',
    mobileReadability: 'released clue/object trace survives after secondary particles stop',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'ink tear + paper fiber + memory tone with more low-end/decay than normal enemy; not explosion',
    hapticHook: 'H3_STRONG_CURRENT_DIRECTION',
    reducedMotionRule: 'collapse to two/three stable material states and keep released clue', reducedFlashRule: 'no flash required',
    avoid: [...COMMON_AVOID, 'boss explosion', 'confetti shower', 'generic treasure fountain'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'CLEAR', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'combat density clears, page/result layer opens, seal/state confirms, rewards follow; Dawn remains a separate semantic effect when applicable',
    color: 'paper/result values with restrained lantern/dawn relation',
    duration: 'result-sequence driven; leave breathing room between combat end and reward list',
    particleBehavior: 'reduce combat particles first; at most a few paper traces during page/seal transition',
    screenShakeRule: 'NONE',
    flashRule: 'NONE',
    mobileReadability: 'result text/rewards remain native and unobscured; clear state does not rely on animation',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'combat noise reduces → dawn air/page → seal → rewards; morning is open, not simply loud',
    hapticHook: 'NO_DEFAULT_UNTIL_DEVICE_REVIEW',
    reducedMotionRule: 'direct stable transition to result page with short opacity settle', reducedFlashRule: 'no flash required',
    avoid: [...COMMON_AVOID, 'victory fireworks', 'duplicate Dawn spectacle'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
  {
    id: 'REWARD_UNLOCK', semanticAuthority: 'CURRENT_DIRECTION_ADAPTER',
    shape: 'small archive/page reveal plus reward-native icon; source condition mark and reward icon stay visually distinct',
    color: 'paper + reward/source accent; rarity never comes only from gold glow',
    duration: 'short confirmation; no long interrupt for common rewards',
    particleBehavior: 'one seal/paper release candidate, then stop',
    screenShakeRule: 'NONE',
    flashRule: 'NONE by default',
    mobileReadability: 'reward title/value/native UI is primary and must remain readable with VFX disabled',
    photosensitiveSafety: PHOTOSENSITIVE_BASE,
    audioHook: 'paper/seal confirmation; irreversible/important unlock may be more distinct but not louder by default',
    hapticHook: 'H1_MICRO_CANDIDATE',
    reducedMotionRule: 'native reward row appears with static seal/state change', reducedFlashRule: 'no flash required',
    avoid: [...COMMON_AVOID, 'loot-box opening', 'gold rarity explosion', 'generic treasure chest'],
    authoritySources: ['src/game/ui/visualDesign.ts', 'docs/AUDIO-HAPTIC-DIRECTION.md'], runtimeReady: false, artworkReady: false, artworkState: 'NOT_GENERATED',
  },
] as const;

export const worldEffectSharedSourceById = new Map(worldEffectSharedSourceEntries.map((entry) => [entry.id, entry]));

export const worldEffectSharedSourceSummary = {
  total: worldEffectSharedSourceEntries.length,
  glowAlphaMax: GLOW_ALPHA_MAX,
  runtimeReady: false,
  deviceCreativeApprovalReady: false,
  artworkReady: false,
} as const;
