import { assetFactoryPromptCatalog, type AssetFactoryPromptRecord } from './assetFactoryCatalog.ts';
import { assetGenerationContractByKey, type AlphaPolicy } from './assetGenerationPolicy.ts';
import { commercialProductionProfileById, commercialProductionProfiles } from './commercialProductionProfile.ts';
import { enemyVisualSharedSourceById } from './enemyVisualSharedSource.ts';
import { itemVisualSharedSourceById } from './itemVisualSharedSource.ts';
import { namedObjectVisualSharedSourceEntries } from './namedObjectVisualSharedSource.ts';
import { rewardSharedSourceEntries } from './progressionRewardSharedSource.ts';
import { stageVisualSharedSourceById, stageVisualSharedSourceEntries } from './stageVisualSharedSource.ts';
import { starBeastVisualSharedSourceEntries } from './starBeastVisualSharedSource.ts';
import { weaponVisualSharedSourceEntries } from './weaponVisualSharedSource.ts';

export type SharedSourceGenerationHandoffKind =
  | 'character-reference-handoff'
  | 'starbeast-reference-handoff'
  | 'enemy-reference-handoff'
  | 'weapon-reference-handoff'
  | 'item-reference-handoff'
  | 'namedobject-reference-handoff'
  | 'stage-keyart-handoff'
  | 'stage-background-handoff'
  | 'reward-icon-handoff'
  | 'toumon-reference-handoff'
  | 'web-hero-handoff'
  | 'unity-runtime-asset-handoff';

export type CandidateGenerationReadiness = 'READY_FOR_CANDIDATE' | 'BLOCKED';
export type TransparentRequirement = AlphaPolicy;

export type SharedSourceGenerationHandoff = {
  handoffId: string;
  handoffVersion: 1;
  kind: SharedSourceGenerationHandoffKind;
  sourceCategory: string;
  sourceId: string;
  displayName: string;
  authorityFacts: readonly string[];
  requiredFacts: readonly string[];
  allowedInterpretation: readonly string[];
  forbiddenInterpretation: readonly string[];
  negativeHints: readonly string[];
  target: {
    sizeSpec: string;
    aspectRatio: string;
    transparentRequirement: TransparentRequirement;
    safeCrop: readonly string[];
    mobileRequirements: readonly string[];
  };
  usage: {
    web: readonly string[];
    unity: readonly string[];
    promo: readonly string[];
    goods: readonly string[];
  };
  approval: {
    sourceReadiness: CandidateGenerationReadiness;
    blockedReasons: readonly string[];
    humanApprovalRequired: true;
    oneShotFinalForbidden: true;
    approvedReferenceDefault: false;
    approvedWebDefault: false;
    approvedUnityDefault: false;
    productionReadyDefault: false;
    runtimeApprovedDefault: false;
  };
  existingAssetFactory?: {
    promptCatalogKey: string;
    contractId: string;
    outputPathHint: string;
    promptSeed: string;
    negativePromptSeed: string;
    reviewChecklist: readonly string[];
  };
};

function gcd(a: number, b: number): number {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left || 1;
}

function aspectRatioFromSizeSpec(sizeSpec: string): string {
  const match = sizeSpec.match(/(\d{2,5})\s*[x×]\s*(\d{2,5})/i);
  if (!match) return 'SOURCE_SPEC';
  const width = Number(match[1]);
  const height = Number(match[2]);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

function approval(sourceReadiness: CandidateGenerationReadiness, blockedReasons: readonly string[] = []) {
  return {
    sourceReadiness,
    blockedReasons,
    humanApprovalRequired: true as const,
    oneShotFinalForbidden: true as const,
    approvedReferenceDefault: false as const,
    approvedWebDefault: false as const,
    approvedUnityDefault: false as const,
    productionReadyDefault: false as const,
    runtimeApprovedDefault: false as const,
  };
}

const COMMON_FORBIDDEN = [
  'baked readable text, letters, numbers, logo or watermark',
  'generic neon cyan/purple AI palette, glassmorphism or giant blurred glow',
  'one-shot final generation or automatic final/runtime approval',
  'inventing Canon facts, relations, IDs, Toumon geometry or spoilers that are absent from authority facts',
  'using a Web composition as a Unity runtime asset without a separate runtime approval path',
] as const;

const COMMON_NEGATIVE = [
  'no text, letters, numbers, logo, watermark',
  'no generic SaaS/AI neon gradient',
  'no glossy plastic 3D normalization',
  'no unapproved Toumon/zodiac/railway logo',
] as const;

function factoryHandoffKind(record: AssetFactoryPromptRecord): SharedSourceGenerationHandoffKind {
  if (record.contentType === 'character') {
    return record.kind === 'character_reference' ? 'character-reference-handoff' : 'unity-runtime-asset-handoff';
  }
  if (record.contentType === 'enemy') {
    return record.kind === 'reference' ? 'enemy-reference-handoff' : 'unity-runtime-asset-handoff';
  }
  if (record.contentType === 'item') {
    return record.kind === 'card_512' ? 'item-reference-handoff' : 'unity-runtime-asset-handoff';
  }
  if (record.kind === 'background_390x844' || record.kind === 'parallax_layer_pack') return 'stage-background-handoff';
  return 'unity-runtime-asset-handoff';
}

function factoryReadiness(record: AssetFactoryPromptRecord): { readiness: CandidateGenerationReadiness; blockedReasons: string[] } {
  if (record.contentType === 'character') {
    const profile = commercialProductionProfileById.get(record.sourceId);
    if (!profile) return { readiness: 'BLOCKED', blockedReasons: ['NO_CURRENT_COMMERCIAL_SHARED_SOURCE_PROFILE'] };
    if (!profile.launchEligible) return { readiness: 'BLOCKED', blockedReasons: ['OFFICIAL_RESERVE_NOT_LAUNCH_ELIGIBLE'] };
    return { readiness: 'READY_FOR_CANDIDATE', blockedReasons: [] };
  }
  if (record.contentType === 'enemy') {
    return enemyVisualSharedSourceById.has(record.sourceId)
      ? { readiness: 'READY_FOR_CANDIDATE', blockedReasons: [] }
      : { readiness: 'BLOCKED', blockedReasons: ['ENEMY_SHARED_SOURCE_MISSING'] };
  }
  if (record.contentType === 'item') {
    return itemVisualSharedSourceById.has(record.sourceId)
      ? { readiness: 'READY_FOR_CANDIDATE', blockedReasons: [] }
      : { readiness: 'BLOCKED', blockedReasons: ['ITEM_SHARED_SOURCE_MISSING'] };
  }
  return stageVisualSharedSourceById.has(record.sourceId)
    ? { readiness: 'READY_FOR_CANDIDATE', blockedReasons: [] }
    : { readiness: 'BLOCKED', blockedReasons: ['STAGE_SHARED_SOURCE_MISSING'] };
}

function factoryAuthorityFacts(record: AssetFactoryPromptRecord): string[] {
  if (record.contentType === 'character') {
    const profile = commercialProductionProfileById.get(record.sourceId);
    return [
      `existing Asset Factory sourceId=${record.sourceId}; kind=${record.kind}`,
      `displayName=${record.displayName}`,
      profile ? `commercial scope=${profile.scope}; launchEligible=${profile.launchEligible}` : 'commercial profile missing',
      profile ? `plush/identity recognition hook=${profile.plushReadability.recognitionHook}` : 'recognition hook unavailable',
    ];
  }
  if (record.contentType === 'enemy') {
    const source = enemyVisualSharedSourceById.get(record.sourceId);
    return source
      ? [
          `Enemy id=${source.id}; family=${source.enemyFamily}; class=${source.enemyClass}`,
          `silhouette=${source.visualSilhouette}`,
          `shape=${source.primaryShapeLanguage}`,
          `palette=${source.primaryColor} + ${source.accentColor}`,
          `stageAffinity=${source.stageAffinity.join(', ')}`,
        ]
      : [`Enemy Shared Source missing for ${record.sourceId}`];
  }
  if (record.contentType === 'item') {
    const source = itemVisualSharedSourceById.get(record.sourceId);
    return source
      ? [
          `Item id=${source.id}; class=${source.itemClass}; rarity=${source.rarityTier}`,
          `silhouette=${source.silhouette}`,
          `shape=${source.shapeLanguage}`,
          `material=${source.material}`,
          `relations namedObject=${source.namedObjectRelationIds.join(', ') || 'none'}; character=${source.characterRelationIds.join(', ') || 'none'}`,
        ]
      : [`Item Shared Source missing for ${record.sourceId}`];
  }
  const source = stageVisualSharedSourceById.get(record.sourceId);
  return source
    ? [
        `Stage id=${source.id}; theme=${source.stageTheme}`,
        `landmarks=${source.landmark1} / ${source.landmark2} / ${source.landmark3}`,
        `light=${source.lightLanguage}`,
        `colorScript=${source.colorScript.join(' -> ')}`,
        `route/station instance authority remains pending; do not bake generated route/station text`,
      ]
    : [`Stage Shared Source missing for ${record.sourceId}`];
}

function factorySafeCrop(record: AssetFactoryPromptRecord, edgeContactForbidden: boolean): string[] {
  const rules = ['preserve the primary identity silhouette inside the contracted output bounds'];
  if (edgeContactForbidden) rules.push('subject must not touch output edges; preserve transparent/trim safety');
  if (record.contentType === 'stage') rules.push('keep the central mobile combat field quiet enough for player/enemy/projectile readability');
  if (record.contentType === 'character') rules.push('face/hair/fixed equipment remain inside safe crop; do not crop identity-critical equipment');
  return rules;
}

export const assetFactorySharedSourceHandoffs: readonly SharedSourceGenerationHandoff[] = assetFactoryPromptCatalog.map((record) => {
  const contract = assetGenerationContractByKey.get(record.key);
  if (!contract) throw new Error(`Missing AssetGenerationContract for ${record.key}`);
  const readiness = factoryReadiness(record);
  return {
    handoffId: `shared-handoff:${record.key}:v1`,
    handoffVersion: 1,
    kind: factoryHandoffKind(record),
    sourceCategory: record.contentType,
    sourceId: record.sourceId,
    displayName: record.displayName,
    authorityFacts: factoryAuthorityFacts(record),
    requiredFacts: [record.prompt, ...contract.styleLock.requiredTraits],
    allowedInterpretation: [
      'composition, pose and secondary material detail may vary only within the existing prompt/Shared Source identity',
      'candidate variation is expected; choose by comparison review rather than one-shot final selection',
    ],
    forbiddenInterpretation: [...COMMON_FORBIDDEN, ...contract.styleLock.forbiddenTraits],
    negativeHints: [record.negativePrompt, ...COMMON_NEGATIVE],
    target: {
      sizeSpec: contract.sizeSpec,
      aspectRatio: aspectRatioFromSizeSpec(contract.sizeSpec),
      transparentRequirement: contract.outputLock.alphaPolicy,
      safeCrop: factorySafeCrop(record, contract.outputLock.edgeContactForbidden),
      mobileRequirements: [
        'judge at 390x844 mobile context or the explicit icon/sprite display size',
        'native UI text/labels stay separate from generated pixels',
        ...(contract.qaPolicy.unityGameplaySizeReviewRequired ? ['Unity gameplay-size human review is required before runtime approval'] : []),
      ],
    },
    usage: {
      web: record.kind.includes('reference') || record.kind.includes('card') || record.kind.includes('thumbnail') ? ['reference/DB derivative only after APPROVED_WEB'] : [],
      unity: ['contracted Asset Factory output only after APPROVED_UNITY/runtime QA'],
      promo: ['derivative only after identity/reference approval; do not promote runtime sprite automatically'],
      goods: ['identity reference only; real SKU/premium replica approval remains separate'],
    },
    approval: approval(readiness.readiness, readiness.blockedReasons),
    existingAssetFactory: {
      promptCatalogKey: record.key,
      contractId: contract.contractId,
      outputPathHint: contract.outputPathHint,
      promptSeed: record.prompt,
      negativePromptSeed: record.negativePrompt,
      reviewChecklist: record.reviewChecklist,
    },
  };
});

function directHandoff(
  handoffId: string,
  kind: SharedSourceGenerationHandoffKind,
  sourceCategory: string,
  sourceId: string,
  displayName: string,
  authorityFacts: readonly string[],
  requiredFacts: readonly string[],
  allowedInterpretation: readonly string[],
  forbiddenInterpretation: readonly string[],
  negativeHints: readonly string[],
  target: SharedSourceGenerationHandoff['target'],
  usage: SharedSourceGenerationHandoff['usage'],
  readiness: CandidateGenerationReadiness,
  blockedReasons: readonly string[] = [],
): SharedSourceGenerationHandoff {
  return {
    handoffId,
    handoffVersion: 1,
    kind,
    sourceCategory,
    sourceId,
    displayName,
    authorityFacts,
    requiredFacts,
    allowedInterpretation,
    forbiddenInterpretation: [...COMMON_FORBIDDEN, ...forbiddenInterpretation],
    negativeHints: [...COMMON_NEGATIVE, ...negativeHints],
    target,
    usage,
    approval: approval(readiness, blockedReasons),
  };
}

export const starBeastGenerationHandoffs: readonly SharedSourceGenerationHandoff[] = starBeastVisualSharedSourceEntries.map((source) => {
  const blockedReasons = source.launchEligible ? [] : ['OFFICIAL_RESERVE_NOT_LAUNCH_ELIGIBLE'];
  return directHandoff(
    `shared-handoff:star-beast:${source.characterId}:reference:v1`,
    'starbeast-reference-handoff',
    'star_beasts',
    source.id,
    `${source.characterDisplayName} — ${source.species}`,
    [
      `characterId=${source.characterId}; scope=${source.scope}; launchEligible=${source.launchEligible}`,
      `constellation=${source.favoriteConstellation}; species=${source.species}`,
      `themeHex=${source.themeHex}`,
      `duplicate rule=${source.duplicateConstellationDifference}`,
    ],
    [source.generationBriefSeed, source.frontSilhouette, source.sideSilhouette, source.materialFeel, source.oneColorRule, source.plushSewingRule],
    ['pose/expression may vary within species/body/recognition rules', 'show front/side/rest identity clearly enough for later sprite/plush/icon derivatives'],
    [...source.avoid, 'Toumon on body before final vector approval'],
    source.negativePromptHints,
    {
      sizeSpec: '2048x2048 MASTER_REFERENCE',
      aspectRatio: '1:1',
      transparentRequirement: 'allowed',
      safeCrop: ['full body and recognition hook stay inside central safe area', 'leave breathing room for front/side reference layout'],
      mobileRequirements: ['species silhouette must survive 32px icon/plush comparison', 'do not depend on tiny fur/feather detail'],
    },
    { web: ['Star Beast index/card after APPROVED_WEB'], unity: ['reference only until dedicated runtime contract'], promo: ['reference derivative after approval'], goods: ['plush/one-color reference after separate goods review'] },
    blockedReasons.length === 0 ? 'READY_FOR_CANDIDATE' : 'BLOCKED',
    blockedReasons,
  );
});

export const weaponGenerationHandoffs: readonly SharedSourceGenerationHandoff[] = weaponVisualSharedSourceEntries.map((source) => directHandoff(
  `shared-handoff:weapon:${source.id}:reference:v1`,
  'weapon-reference-handoff',
  'weapons',
  source.id,
  source.displayName,
  [
    `weaponClass=${source.weaponClass}; formKind=${source.formKind}; baseFormId=${source.baseFormId}`,
    `themeHex=${source.themeHex}; accentHex=${source.accentHex}`,
    `namedObjectRelation=${source.namedObjectRelationIds.join(', ') || 'none'}`,
  ],
  [source.generationBriefSeed, source.shapeLanguage, source.silhouette, source.material, source.iconRule],
  ['view angle/material wear may vary while everyday-object lineage remains explicit', 'show base/evolved relation where the form is not BASE'],
  [...source.avoid, 'new evolution form not present in evolutions.ts'],
  source.negativePromptHints,
  {
    sizeSpec: '2048x2048 TRANSPARENT_OBJECT_MASTER',
    aspectRatio: '1:1',
    transparentRequirement: 'required',
    safeCrop: ['entire object and identity-critical notch/edge stay off canvas boundaries'],
    mobileRequirements: [source.smallScaleReadability, 'must support later 16–64px icon derivative without changing identity'],
  },
  { web: ['Weapon DB/reference after APPROVED_WEB'], unity: ['reference only until sprite/icon/VFX runtime contract'], promo: ['reference derivative after approval'], goods: source.goodsPotential },
  'READY_FOR_CANDIDATE',
));

export const stageKeyArtGenerationHandoffs: readonly SharedSourceGenerationHandoff[] = stageVisualSharedSourceEntries.map((source) => directHandoff(
  `shared-handoff:stage:${source.id}:keyart:v1`,
  'stage-keyart-handoff',
  'stages',
  source.id,
  source.displayName,
  [
    `stageTheme=${source.stageTheme}`,
    `landmarks=${source.landmark1} / ${source.landmark2} / ${source.landmark3}`,
    `colorScript=${source.colorScript.join(' -> ')}`,
    `spoilerTier=${source.spoilerTier}`,
    'route/station/stamp instance authority remains unresolved; do not invent readable station identity',
  ],
  [source.generationBriefSeed, source.terrainLanguage, source.architectureLanguage, source.lightLanguage],
  ['camera angle/foreground balance may vary if the three landmark hierarchy and stage mood survive', 'derive separate Web/Loading/Unity crops after reference approval rather than using one PNG everywhere'],
  source.avoid,
  source.negativePromptHints,
  {
    sizeSpec: '2048x2048 or 2560x1440 STAGE_KEY_ART',
    aspectRatio: '1:1 or 16:9',
    transparentRequirement: 'forbidden',
    safeCrop: ['dominant landmark stays away from crop edges', 'preserve a shared mobile/desktop center-safe focal region'],
    mobileRequirements: ['key art must be reducible to Stage card/mobile header', 'do not bake readable signage or UI'],
  },
  { web: ['Stage index/header after APPROVED_WEB'], unity: ['reference only; use dedicated background/parallax contracts for runtime'], promo: ['poster/social derivative after spoiler approval'], goods: source.goodsPotential },
  'READY_FOR_CANDIDATE',
));

export const namedObjectGenerationHandoffs: readonly SharedSourceGenerationHandoff[] = namedObjectVisualSharedSourceEntries.map((source) => directHandoff(
  `shared-handoff:named-object:${source.ownerId}:reference:v1`,
  'namedobject-reference-handoff',
  'named_objects',
  source.sourceNamedObjectId,
  source.displayName,
  [
    `owner=${source.ownerDisplayName}/${source.ownerId}; namingStatus=${source.namingStatus}`,
    `geometryAuthority=${source.geometryAuthority}`,
    `commercial entry=${source.commercialEntryForm}; collector=${source.commercialCollectorForm}`,
    `functionalReplicaAllowed=${source.functionalReplicaAllowed}; premiumReplicaAllowed=${source.premiumReplicaAllowed}`,
  ],
  [source.generationBriefSeed, source.frontSilhouette, source.backSilhouette, source.sideSilhouette, source.scale, source.material, source.wearMarks, source.repairMarks],
  ['NONE until candidate three-view geometry receives explicit visual approval; material study may be reviewed without Canon promotion'],
  source.avoid,
  source.negativePromptHints,
  {
    sizeSpec: '2048x2048 THREE_VIEW_REFERENCE_CANDIDATE',
    aspectRatio: '1:1',
    transparentRequirement: 'required',
    safeCrop: ['front/back/side views fully inside canvas', 'wear/repair marks remain visible but no readable text is invented'],
    mobileRequirements: ['one object silhouette must later survive icon scale', 'three-view sheet itself is reference, not runtime UI'],
  },
  { web: ['HOLD until geometry approval'], unity: ['HOLD until geometry approval and dedicated runtime contract'], promo: ['HOLD'], goods: ['HOLD; functional/premium replica remain fail-closed'] },
  'BLOCKED',
  ['CANDIDATE_OBJECT_GEOMETRY_REQUIRES_EXPLICIT_VISUAL_APPROVAL'],
));

export const rewardGenerationHandoffs: readonly SharedSourceGenerationHandoff[] = rewardSharedSourceEntries.map((source) => directHandoff(
  `shared-handoff:reward:${source.id}:icon:v1`,
  'reward-icon-handoff',
  'rewards',
  source.id,
  source.displayName,
  [
    `rewardType=${source.rewardType}; sourceType=${source.sourceType}; sourceId=${source.sourceId}`,
    `previewSafe=${source.previewSafe}; spoilerTier=${source.spoilerTier}`,
    `runtimeReady=${source.runtimeReady}`,
  ],
  [source.iconRule, source.presentationRule, source.generationBriefSeed],
  ['NONE until reward icon/presentation grammar is separately approved; existing runtime currency identity must be reused where required'],
  ['generic treasure chest/gem/orb/medal invention', 'spoiler reveal beyond previewSafe boundary'],
  ['no new currency icon when existing runtime meta-currency is authoritative'],
  {
    sizeSpec: '512x512 ICON_MASTER',
    aspectRatio: '1:1',
    transparentRequirement: 'required',
    safeCrop: ['reward silhouette centered with enough edge breathing room for 16–64px derivatives'],
    mobileRequirements: ['reward type must survive 16–32px', 'condition mark and reward icon remain distinct'],
  },
  { web: ['HOLD until icon grammar approval'], unity: ['HOLD until icon grammar/runtime mapping approval'], promo: [], goods: source.goodsPotential },
  'BLOCKED',
  ['REWARD_ICON_VISUAL_AUTHORITY_NOT_APPROVED'],
));

export const toumonGenerationHandoffs: readonly SharedSourceGenerationHandoff[] = commercialProductionProfiles.map((profile) => directHandoff(
  `shared-handoff:toumon:${profile.characterId}:reference:v1`,
  'toumon-reference-handoff',
  'toumon',
  profile.characterId,
  `${profile.displayName} Toumon`,
  [`characterId=${profile.characterId}; scope=${profile.scope}`, 'simple sigil semantics exist, exact final vector geometry does not'],
  ['Use the separate Toumon authority only after a final vector master is explicitly approved.'],
  ['NONE: this handoff is an explicit generation stop, not a request to invent geometry'],
  ['AI-generated final Toumon geometry', 'literal animal', 'Named Object pictogram', 'zodiac glyph', 'crown/wings/shield'],
  ['do not generate final Toumon shape'],
  {
    sizeSpec: 'VECTOR_MASTER_PENDING',
    aspectRatio: 'SOURCE_SPEC',
    transparentRequirement: 'required',
    safeCrop: ['not applicable until vector authority exists'],
    mobileRequirements: ['future final geometry must survive 16px and one-color use'],
  },
  { web: ['HOLD'], unity: ['HOLD'], promo: ['HOLD'], goods: ['HOLD until final vector/embroidery proof'] },
  'BLOCKED',
  ['FINAL_TOUMON_VECTOR_NOT_DRAWN'],
));

export const webHeroGenerationTemplate = directHandoff(
  'shared-handoff:web:hero:template:v1',
  'web-hero-handoff',
  'web',
  'web-hero-template',
  'Web Hero Template',
  ['Shared Source identity must come from already approved Character/Stage/Star Beast references; this template owns no Canon identity'],
  ['desktop target 2560x1440', 'mobile-safe derivative 1440x2560', 'native page title/text stays outside generated pixels'],
  ['composition, crop and atmospheric layering may vary after identity references are approved'],
  ['using unapproved Candidate/Reserve art as Current hero', 'baking page title/logo into generated image'],
  ['no readable text', 'no giant SaaS gradient/glow'],
  {
    sizeSpec: '2560x1440 DESKTOP + 1440x2560 MOBILE_SAFE',
    aspectRatio: '16:9 + 9:16',
    transparentRequirement: 'forbidden',
    safeCrop: ['primary identity/focal motif stays in shared center-safe region', 'reserve native title/logo safe area'],
    mobileRequirements: ['390x844 crop must preserve main identity', 'no critical subject at extreme desktop edges'],
  },
  { web: ['hero only after APPROVED_WEB'], unity: [], promo: ['separate derivative after approval'], goods: [] },
  'BLOCKED',
  ['REQUIRES_APPROVED_REFERENCE_SET_AND_PAGE_COMPOSITION_AUTHORITY'],
);

export const sharedSourceGenerationHandoffs: readonly SharedSourceGenerationHandoff[] = [
  ...assetFactorySharedSourceHandoffs,
  ...starBeastGenerationHandoffs,
  ...weaponGenerationHandoffs,
  ...stageKeyArtGenerationHandoffs,
  ...namedObjectGenerationHandoffs,
  ...rewardGenerationHandoffs,
  ...toumonGenerationHandoffs,
  webHeroGenerationTemplate,
];

export const sharedSourceGenerationHandoffById = new Map(sharedSourceGenerationHandoffs.map((entry) => [entry.handoffId, entry]));

export const sharedSourceGenerationHandoffSummary = {
  assetFactoryLinked: assetFactorySharedSourceHandoffs.length,
  starBeast: starBeastGenerationHandoffs.length,
  weapon: weaponGenerationHandoffs.length,
  stageKeyArt: stageKeyArtGenerationHandoffs.length,
  namedObject: namedObjectGenerationHandoffs.length,
  reward: rewardGenerationHandoffs.length,
  toumon: toumonGenerationHandoffs.length,
  webHeroTemplate: 1,
  total: sharedSourceGenerationHandoffs.length,
  readyForCandidate: sharedSourceGenerationHandoffs.filter((entry) => entry.approval.sourceReadiness === 'READY_FOR_CANDIDATE').length,
  blocked: sharedSourceGenerationHandoffs.filter((entry) => entry.approval.sourceReadiness === 'BLOCKED').length,
  approvedReferenceDefaultCount: 0,
  approvedWebDefaultCount: 0,
  approvedUnityDefaultCount: 0,
  productionReadyDefaultCount: 0,
  runtimeApprovedDefaultCount: 0,
} as const;
