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

export const WORLD_EFFECT_GENERATION_IDS: readonly WorldEffectId[] = [
  'NORMAL_ATTACK',
  'CRITICAL',
  'LEVEL_UP',
  'WEAPON_EVOLUTION',
  'TOUMON',
  'KOKUYOU',
  'DAWN',
  'HEAL',
  'PICKUP',
  'BOSS_ENTRY',
  'BOSS_DEATH',
  'CLEAR',
  'REWARD_UNLOCK',
] as const;

export type WorldEffectAssetStrategy =
  | 'PROCEDURAL_ONLY'
  | 'NATIVE_UI_FIRST'
  | 'HYBRID_TEXTURE_REFERENCE'
  | 'BLOCKED';

export type WorldEffectGenerationHandoff = {
  id: WorldEffectId;
  handoffId: string;
  handoffVersion: 1;
  sourceAuthority: 'src/game/data/worldEffectSharedSource.ts';
  sourceEntryRequired: true;
  assetStrategy: WorldEffectAssetStrategy;
  imageCandidateGenerationAllowed: boolean;
  imageCandidateCount: 0 | 4;
  generatedTextureLanes: readonly string[];
  generationDirection: readonly string[];
  promptSeed: string | null;
  negativePromptSeed: string;
  referenceTarget: {
    sizeSpec: string;
    alphaPolicy: 'required' | 'not-applicable';
    runtimeDirectUseForbidden: true;
    runtimeOutputRule: string;
  };
  unityImplementation: readonly string[];
  webImplementation: readonly string[];
  qa: {
    humanComparisonRequired: boolean;
    gameplaySizeReviewRequired: true;
    deviceCreativeApprovalRequired: true;
    photosensitiveQaRequired: true;
    reducedMotionQaRequired: true;
    reducedFlashQaRequired: true;
    performanceReviewRequired: true;
  };
  approval: {
    sourceReady: true;
    generatedCandidateDefault: false;
    approvedReferenceDefault: false;
    approvedWebDefault: false;
    approvedUnityDefault: false;
    runtimeApprovedDefault: false;
    oneShotFinalForbidden: true;
  };
  blockedReason: string | null;
};

type StrategyRule = {
  strategy: WorldEffectAssetStrategy;
  lanes?: readonly string[];
  direction: readonly string[];
  blockedReason?: string;
  unity: readonly string[];
  web: readonly string[];
};

const STRATEGY_BY_ID: Record<WorldEffectId, StrategyRule> = {
  NORMAL_ATTACK: {
    strategy: 'PROCEDURAL_ONLY',
    direction: ['Weapon identity wins over a universal effect atlas.', 'Use the owning Weapon Shared Source plus the NORMAL_ATTACK semantic source entry.'],
    unity: ['Build direction/impact with particles, trails, material parameters and weapon-native source assets.', 'Do not create one universal attack atlas.'],
    web: ['Derive a lighter surface-specific effect from the same semantic authority.'],
  },
  CRITICAL: {
    strategy: 'PROCEDURAL_ONLY',
    direction: ['Critical is an accent on the normal impact language, not a replacement effect family.'],
    unity: ['Use one crisp procedural offset/cut accent; keep rapid critical chains fatigue-safe.'],
    web: ['Preserve shape/value distinction with reduced density; flash is never required for meaning.'],
  },
  LEVEL_UP: {
    strategy: 'NATIVE_UI_FIRST',
    direction: ['Native card/page hierarchy and readable text are primary.'],
    unity: ['Use native UI plus minimal procedural paper/light accents; never bake labels or rarity text into generated pixels.'],
    web: ['Keep card content native HTML/text; decoration remains separate.'],
  },
  WEAPON_EVOLUTION: {
    strategy: 'HYBRID_TEXTURE_REFERENCE',
    lanes: ['convergence-paper-fragment', 'completion-release-smear'],
    direction: ['Generate isolated paper/ink material references only.', 'Before→after weapon silhouette comes from Weapon Shared Source, never from the VFX texture candidate.'],
    unity: ['Rebuild approved references into runtime particle/atlas assets; preserve Weapon evolution lineage procedurally.'],
    web: ['Compose a separate Web transition after reference approval; do not ship the Unity runtime atlas as Web final art.'],
  },
  TOUMON: {
    strategy: 'BLOCKED',
    blockedReason: 'FINAL_TOUMON_VECTOR_NOT_DRAWN',
    direction: ['Do not generate Toumon geometry or a substitute zodiac/animal glyph.'],
    unity: ['After final vector approval only, add a small procedural recognition light/settle around the approved vector.'],
    web: ['Use approved native/vector Toumon only after final vector authority exists.'],
  },
  KOKUYOU: {
    strategy: 'HYBRID_TEXTURE_REFERENCE',
    lanes: ['ink-pressure-edge', 'ink-slash-edge', 'layer-peel-fragment'],
    direction: ['Generate isolated black-ink material edges/fragments only.', 'Ready→Activate→Recovery timing remains runtime-authored.', 'Never generate Character or Toumon silhouettes into the texture.'],
    unity: ['Use approved texture references as small material inputs; author three-phase timing, density and recovery in runtime.'],
    web: ['Compose a reduced-density derivative; never use a universal evil-purple transformation overlay.'],
  },
  DAWN: {
    strategy: 'PROCEDURAL_ONLY',
    direction: ['Dawn means night layers opening/thinning, not a generated sunrise illustration or whiteout.'],
    unity: ['Implement palette/value/material transitions and particle reduction; No generated sunrise background is required.'],
    web: ['Use native/CSS/surface-specific compositing while preserving the no-whiteout semantic.'],
  },
  HEAL: {
    strategy: 'PROCEDURAL_ONLY',
    direction: ['Small repaired-line/paper-seam confirmation only; health state remains native.'],
    unity: ['Use a compact procedural repaired-line cue; do not create a generic green healing atlas.'],
    web: ['Use native state update plus a minimal line/seam cue if needed.'],
  },
  PICKUP: {
    strategy: 'PROCEDURAL_ONLY',
    direction: ['Pickup object identity remains visible; trail/ripple is secondary.'],
    unity: ['Use item-native silhouette plus a compact procedural pull trail; simplify automatically at high density.'],
    web: ['Use a compact surface-specific pull/fade treatment; no loot beam texture.'],
  },
  BOSS_ENTRY: {
    strategy: 'PROCEDURAL_ONLY',
    direction: ['Entry language comes from the specific Stage/Boss relation, not a universal boss overlay.'],
    unity: ['Build motif gathering and silhouette establishment with runtime materials/particles; no universal red-flash/smoke atlas.'],
    web: ['If shown, derive from the specific boss/stage source rather than a trailer template.'],
  },
  BOSS_DEATH: {
    strategy: 'HYBRID_TEXTURE_REFERENCE',
    lanes: ['ink-unbind-edge', 'paper-fiber-tear', 'released-clue-soft-trace'],
    direction: ['Generate isolated unbinding/tear material references only.', 'Ordered unbinding and released-clue persistence remain runtime-authored.', 'Never turn the event into an explosion/confetti texture pack.'],
    unity: ['Rebuild approved material references into runtime assets after device/performance review.'],
    web: ['Compose a separate surface derivative when needed; Unity atlas is not final Web/promotional art.'],
  },
  CLEAR: {
    strategy: 'NATIVE_UI_FIRST',
    direction: ['Combat density clears first; result/page/seal state stays native.', 'Dawn is a separate semantic event.'],
    unity: ['Use native result presentation; do not duplicate Dawn as victory fireworks.'],
    web: ['Use native result layout; generated decoration is not required for clear-state legibility.'],
  },
  REWARD_UNLOCK: {
    strategy: 'NATIVE_UI_FIRST',
    direction: ['Reward data and reward icon authority remain separate from VFX.', 'Optional paper/seal release is secondary.'],
    unity: ['Reward title/value remain native. Reward icon artwork authority is separate and must not be generated through this VFX lane.'],
    web: ['Keep reward data native; no loot-box opening or baked reward card.'],
  },
};

const COMMON_NEGATIVE = [
  'no readable text, letters, numbers, logo or watermark',
  'no full-screen composition',
  'no final Toumon geometry',
  'no generic RPG magic circle or runes',
  'no cyan-purple neon AI glow',
  'no glossy 3D particle pack look',
  'no whiteout or strobe sequence',
  'no continuous camera shake shorthand',
] as const;

function buildPrompt(id: WorldEffectId, rule: StrategyRule): string {
  return [
    `ヨルノシルベ / ${id} VFX texture reference candidate.`,
    'Before generation, load and obey the matching entry from src/game/data/worldEffectSharedSource.ts.',
    `Generate only isolated texture/material motifs for: ${(rule.lanes ?? []).join(', ')}.`,
    ...rule.direction,
    'Transparent background, textless, logo-free, no UI frame, no complete screen composition.',
    'This is a reference texture candidate, not a final Unity atlas and not a one-shot final.',
  ].join('\n');
}

function buildHandoff(id: WorldEffectId): WorldEffectGenerationHandoff {
  const rule = STRATEGY_BY_ID[id];
  const lanes = rule.lanes ?? [];
  const imageAllowed = rule.strategy === 'HYBRID_TEXTURE_REFERENCE';
  return {
    id,
    handoffId: `world-effect-handoff:${id.toLowerCase()}:v1`,
    handoffVersion: 1,
    sourceAuthority: 'src/game/data/worldEffectSharedSource.ts',
    sourceEntryRequired: true,
    assetStrategy: rule.strategy,
    imageCandidateGenerationAllowed: imageAllowed,
    imageCandidateCount: imageAllowed ? 4 : 0,
    generatedTextureLanes: lanes,
    generationDirection: rule.direction,
    promptSeed: imageAllowed ? buildPrompt(id, rule) : null,
    negativePromptSeed: COMMON_NEGATIVE.join(', '),
    referenceTarget: {
      sizeSpec: imageAllowed ? '1024x1024 TRANSPARENT RGBA REFERENCE_MASTER' : 'NO_GENERATED_IMAGE_TARGET',
      alphaPolicy: imageAllowed ? 'required' : 'not-applicable',
      runtimeDirectUseForbidden: true,
      runtimeOutputRule: imageAllowed
        ? 'Approved references must be rebuilt/cropped/packed for the concrete Unity renderer; never ship the 1024 reference master directly.'
        : 'Implement from the semantic authority using native UI, particles, trails, shader/material parameters, or source-specific approved assets.',
    },
    unityImplementation: rule.unity,
    webImplementation: rule.web,
    qa: {
      humanComparisonRequired: imageAllowed,
      gameplaySizeReviewRequired: true,
      deviceCreativeApprovalRequired: true,
      photosensitiveQaRequired: true,
      reducedMotionQaRequired: true,
      reducedFlashQaRequired: true,
      performanceReviewRequired: true,
    },
    approval: {
      sourceReady: true,
      generatedCandidateDefault: false,
      approvedReferenceDefault: false,
      approvedWebDefault: false,
      approvedUnityDefault: false,
      runtimeApprovedDefault: false,
      oneShotFinalForbidden: true,
    },
    blockedReason: rule.blockedReason ?? null,
  };
}

export const worldEffectGenerationHandoffs: readonly WorldEffectGenerationHandoff[] = WORLD_EFFECT_GENERATION_IDS.map(buildHandoff);
export const worldEffectGenerationHandoffById = new Map(worldEffectGenerationHandoffs.map((entry) => [entry.id, entry]));

export const worldEffectGenerationHandoffSummary = {
  total: worldEffectGenerationHandoffs.length,
  generatedTextureCandidateEvents: worldEffectGenerationHandoffs.filter((entry) => entry.imageCandidateGenerationAllowed).map((entry) => entry.id),
  proceduralOnlyEvents: worldEffectGenerationHandoffs.filter((entry) => entry.assetStrategy === 'PROCEDURAL_ONLY').map((entry) => entry.id),
  nativeUiFirstEvents: worldEffectGenerationHandoffs.filter((entry) => entry.assetStrategy === 'NATIVE_UI_FIRST').map((entry) => entry.id),
  blockedEvents: worldEffectGenerationHandoffs.filter((entry) => entry.assetStrategy === 'BLOCKED').map((entry) => entry.id),
  semanticAuthorityLoadedAtGeneration: true,
  deviceCreativeApprovalReady: false,
  runtimeApprovedDefault: false,
} as const;
