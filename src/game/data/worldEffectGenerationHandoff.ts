import {
  worldEffectSharedSourceById,
  worldEffectSharedSourceEntries,
  type WorldEffectId,
  type WorldEffectSharedSourceEntry,
} from './worldEffectSharedSource.ts';

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
  assetStrategy: WorldEffectAssetStrategy;
  imageCandidateGenerationAllowed: boolean;
  imageCandidateCount: 0 | 4;
  generatedTextureLanes: readonly string[];
  promptSeed: string | null;
  negativePromptSeed: string;
  referenceTarget: {
    sizeSpec: string;
    alphaPolicy: 'required' | 'forbidden' | 'not-applicable';
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
  blockedReason?: string;
  unity: readonly string[];
  web: readonly string[];
};

const STRATEGY_BY_ID: Record<WorldEffectId, StrategyRule> = {
  NORMAL_ATTACK: {
    strategy: 'PROCEDURAL_ONLY',
    unity: [
      'Build direction/impact from the owning Weapon Shared Source and Unity particles/trails/shader parameters.',
      'Do not create one universal attack atlas that erases weapon identity.',
    ],
    web: ['Derive a lighter Web-demo effect from the same semantic event; do not reuse a Unity capture as a baked Web asset.'],
  },
  CRITICAL: {
    strategy: 'PROCEDURAL_ONLY',
    unity: [
      'Add one crisp offset cut/cross-hatch accent to the normal impact using procedural geometry/material parameters.',
      'Keep rapid critical chains fatigue-safe; no universal starburst texture.',
    ],
    web: ['Use the same shape/value distinction with reduced density; flash is optional and never required for meaning.'],
  },
  LEVEL_UP: {
    strategy: 'NATIVE_UI_FIRST',
    unity: [
      'Native card/page UI and text remain the primary presentation.',
      'Use only minimal procedural paper flecks/light around the reveal; generated pixels must not contain labels or rarity text.',
    ],
    web: ['Keep card content as native HTML/text; any decorative paper/light treatment is separate and optional.'],
  },
  WEAPON_EVOLUTION: {
    strategy: 'HYBRID_TEXTURE_REFERENCE',
    lanes: ['convergence-paper-fragment', 'completion-release-smear'],
    unity: [
      'Generated texture candidates may supply small paper/ink fragment motifs only after comparison review.',
      'The before→after weapon silhouette/evolution lineage comes from Weapon Shared Source, not from generated VFX.',
      'Runtime atlas/particles are rebuilt from approved reference textures and profiled on device.',
    ],
    web: ['Use separately composed Web transition after reference approval; never export the Unity runtime atlas as the Web final.'],
  },
  TOUMON: {
    strategy: 'BLOCKED',
    blockedReason: 'FINAL_TOUMON_VECTOR_NOT_DRAWN',
    unity: [
      'No generated Toumon geometry or substitute glyph.',
      'After final vector approval, only a small procedural recognition light/settle may be layered around the approved vector.',
    ],
    web: ['Use approved native/vector Toumon only after final vector authority exists; no AI-generated stand-in.'],
  },
  KOKUYOU: {
    strategy: 'HYBRID_TEXTURE_REFERENCE',
    lanes: ['ink-pressure-edge', 'ink-slash-edge', 'layer-peel-fragment'],
    unity: [
      'Generated candidates are texture/material references for ink pressure/slash/peel only.',
      'Three-phase Ready→Activate→Recovery timing stays procedural/runtime-authored.',
      'Do not generate Character/Toumon silhouettes into the effect texture.',
    ],
    web: ['Compose a reduced-density Web derivative from approved ink textures; no universal evil-purple transformation overlay.'],
  },
  DAWN: {
    strategy: 'PROCEDURAL_ONLY',
    unity: [
      'Implement night-layer opening through palette/value/material transitions and particle reduction.',
      'No generated sunrise background, whiteout card, or victory-ray overlay is required.',
    ],
    web: ['Use CSS/native compositing or surface-specific layers; preserve the no-whiteout semantic.'],
  },
  HEAL: {
    strategy: 'PROCEDURAL_ONLY',
    unity: ['Use a small repaired-line/paper-seam trace and native health-state change; do not create a generic green healing atlas.'],
    web: ['Use native state update plus a minimal line/seam cue if needed.'],
  },
  PICKUP: {
    strategy: 'PROCEDURAL_ONLY',
    unity: ['Use item-native silhouette plus a compact procedural pull trail/ripple; high-density pickup paths simplify automatically.'],
    web: ['Use a compact surface-specific pull/fade treatment; no loot beam texture.'],
  },
  BOSS_ENTRY: {
    strategy: 'PROCEDURAL_ONLY',
    unity: [
      'Build entry from Stage/Boss source motifs and runtime material/particle gathering.',
      'Do not create one universal boss-entry smoke/red-flash atlas.',
    ],
    web: ['If represented in Web demo, derive from the specific boss/stage source rather than a universal trailer overlay.'],
  },
  BOSS_DEATH: {
    strategy: 'HYBRID_TEXTURE_REFERENCE',
    lanes: ['ink-unbind-edge', 'paper-fiber-tear', 'released-clue-soft-trace'],
    unity: [
      'Generated candidates may supply unbinding/tear material references only.',
      'Ordered unbinding timing and released-clue persistence remain runtime-authored.',
      'Runtime output is rebuilt/packed after reference approval and performance review.',
    ],
    web: ['Use a separately composed derivative if needed; do not reuse the Unity atlas as a final promotional/Web image.'],
  },
  CLEAR: {
    strategy: 'NATIVE_UI_FIRST',
    unity: [
      'Combat density clears first; result/page/seal state is native UI.',
      'Dawn is a separate semantic event and must not be duplicated as victory fireworks.',
    ],
    web: ['Use native result layout; generated decoration is not needed for clear-state legibility.'],
  },
  REWARD_UNLOCK: {
    strategy: 'NATIVE_UI_FIRST',
    unity: [
      'Reward title/value/icon remain native/runtime data.',
      'Reward icon artwork authority is separate and currently blocked; do not generate it through this VFX lane.',
      'Optional paper/seal release is procedural and secondary.',
    ],
    web: ['Keep reward data native; no loot-box opening or baked reward card.'],
  },
};

function promptSeed(source: WorldEffectSharedSourceEntry, lanes: readonly string[]): string {
  return [
    `ヨルノシルベ / ${source.id} VFX texture reference candidate.`,
    `Generate only isolated texture/material motifs for: ${lanes.join(', ')}.`,
    `Shape authority: ${source.shape}`,
    `Color authority: ${source.color}`,
    `Particle/material behavior: ${source.particleBehavior}`,
    `Mobile readability: ${source.mobileReadability}`,
    `Safety: ${source.photosensitiveSafety}`,
    'Transparent background, textless, logo-free, no UI frame, no complete screen composition.',
    'This is a reference texture candidate, not a final Unity atlas and not a one-shot final.',
  ].join('\n');
}

function negativePromptSeed(source: WorldEffectSharedSourceEntry): string {
  return [
    ...source.avoid,
    'no readable text, letters, numbers, logo or watermark',
    'no full-screen composition',
    'no final Toumon geometry',
    'no generic RPG magic circle',
    'no cyan-purple neon AI glow',
    'no glossy 3D particle pack look',
    'no whiteout or strobe sequence',
  ].join(', ');
}

function buildHandoff(source: WorldEffectSharedSourceEntry): WorldEffectGenerationHandoff {
  const rule = STRATEGY_BY_ID[source.id];
  const lanes = rule.lanes ?? [];
  const imageAllowed = rule.strategy === 'HYBRID_TEXTURE_REFERENCE';
  return {
    id: source.id,
    handoffId: `world-effect-handoff:${source.id.toLowerCase()}:v1`,
    handoffVersion: 1,
    sourceAuthority: 'src/game/data/worldEffectSharedSource.ts',
    assetStrategy: rule.strategy,
    imageCandidateGenerationAllowed: imageAllowed,
    imageCandidateCount: imageAllowed ? 4 : 0,
    generatedTextureLanes: lanes,
    promptSeed: imageAllowed ? promptSeed(source, lanes) : null,
    negativePromptSeed: negativePromptSeed(source),
    referenceTarget: {
      sizeSpec: imageAllowed ? '1024x1024 TRANSPARENT RGBA REFERENCE_MASTER' : 'NO_GENERATED_IMAGE_TARGET',
      alphaPolicy: imageAllowed ? 'required' : 'not-applicable',
      runtimeDirectUseForbidden: true,
      runtimeOutputRule: imageAllowed
        ? 'Approved reference textures must be rebuilt/cropped/packed for the concrete Unity renderer; never ship the 1024 reference master directly.'
        : 'Implement from semantic/runtime source using native UI, particles, trails, shader/material parameters, or source-specific assets.',
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

export const worldEffectGenerationHandoffs: readonly WorldEffectGenerationHandoff[] = worldEffectSharedSourceEntries.map(buildHandoff);
export const worldEffectGenerationHandoffById = new Map(worldEffectGenerationHandoffs.map((entry) => [entry.id, entry]));

export const worldEffectGenerationHandoffSummary = {
  total: worldEffectGenerationHandoffs.length,
  generatedTextureCandidateEvents: worldEffectGenerationHandoffs.filter((entry) => entry.imageCandidateGenerationAllowed).map((entry) => entry.id),
  proceduralOnlyEvents: worldEffectGenerationHandoffs.filter((entry) => entry.assetStrategy === 'PROCEDURAL_ONLY').map((entry) => entry.id),
  nativeUiFirstEvents: worldEffectGenerationHandoffs.filter((entry) => entry.assetStrategy === 'NATIVE_UI_FIRST').map((entry) => entry.id),
  blockedEvents: worldEffectGenerationHandoffs.filter((entry) => entry.assetStrategy === 'BLOCKED').map((entry) => entry.id),
  deviceCreativeApprovalReady: false,
  runtimeApprovedDefault: false,
} as const;

for (const source of worldEffectSharedSourceEntries) {
  if (!worldEffectSharedSourceById.has(source.id)) throw new Error(`World Effect authority map missing ${source.id}`);
}
