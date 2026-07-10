import type { AssetFactoryContentType, AssetFactoryPromptRecord } from './assetFactoryCatalog.ts';
import { assetFactoryPromptCatalog } from './assetFactoryCatalog.ts';

export const ASSET_GENERATION_CONTRACT_SCHEMA_VERSION = 1 as const;
export const ASSET_GENERATION_POLICY_VERSION = '2026-07-10-v1' as const;

export type AssetApprovalState = 'candidate' | 'reviewed' | 'approved-final' | 'rejected';
export type AlphaPolicy = 'required' | 'forbidden' | 'allowed';

export type AssetGenerationContract = {
  contractId: string;
  contractVersion: number;
  policyVersion: string;
  promptCatalogKey: string;
  contentType: AssetFactoryContentType;
  sourceId: string;
  displayName: string;
  kind: string;
  outputPathHint: string;
  sizeSpec: string;
  styleLock: {
    requiredTraits: string[];
    forbiddenTraits: string[];
    palette: Record<string, string>;
  };
  referencePolicy: {
    requiredReferenceSetIds: string[];
    identityReferenceSetId: string;
    minimumReferenceSetsForCandidate: number;
    minimumReferenceSetsForFinal: number;
    finalApprovalBlockedWithoutIdentityReference: true;
  };
  generationPolicy: {
    candidateCount: 4;
    oneShotFinalForbidden: true;
    generatorNameRequired: true;
    generatorVersionRequired: true;
    promptHashRequired: true;
    referenceHashRequired: true;
    seedMustBeRecordedWhenSupported: true;
    regenerateFromSameContractOnly: true;
  };
  outputLock: {
    alphaPolicy: AlphaPolicy;
    bakedTextForbidden: true;
    bakedLogoForbidden: true;
    edgeContactForbidden: boolean;
    outputPathMustMatchHint: true;
  };
  qaPolicy: {
    automaticChecks: string[];
    humanChecks: string[];
    comparisonSheetRequired: true;
    unityGameplaySizeReviewRequired: boolean;
  };
  approvalPolicy: {
    defaultState: 'candidate';
    humanApprovalRequired: true;
    approvedAsFinalDefault: false;
    runtimeApprovedDefault: false;
    finalRequiresGoldenReference: true;
    finalRequiresLineageManifest: true;
    finalRequiresQaPass: true;
  };
};

export const GLOBAL_ASSET_STYLE_LOCK = {
  requiredTraits: [
    'ヨルノシルベの紙片・絵本風ドット感',
    '黒インク、夜、記憶、小さな暖色光',
    '390x844のスマホ実寸で読めるシルエット',
    '暗いが怖すぎず、静かな通常画面',
    'matte paper and ink texture; no glossy plastic',
    'textless production asset',
  ],
  forbiddenTraits: [
    '文字、数字、ロゴ、透かしの焼き込み',
    '別ゲームに見える高彩度ネオン配色',
    '写実的な人間、写真、3D glossy plastic',
    '幼児頭身、過度に大きい目、baby-like表現',
    '白背景、市松模様、白フリンジ',
    'UI全画面を1枚画像へ焼き込むこと',
    '既存キャラの髪型、持ち物、左右配置、頭身の無断変更',
  ],
  palette: {
    quietNight: '#080708',
    blackInk: '#050405',
    paperBase: '#D6C29A',
    paperEdge: '#785734',
    lantern: '#FFA13D',
    morningAfter: '#E6C48C',
    rareAccent: '#D49348',
    kokuyouAccent: '#6F466F',
  },
} as const;

const TYPE_REQUIRED_TRAITS: Record<AssetFactoryContentType, string[]> = {
  character: [
    'character identity, hairstyle, silhouette and fixed equipment remain consistent',
    'head-to-body ratio and face treatment remain consistent with identity reference',
    'left/right placement of held items and bags remains locked',
  ],
  enemy: [
    'enemy family silhouette and appendage rules remain consistent',
    'stage readability and threat tier remain recognizable at gameplay size',
    'enemy does not inherit player-character facial proportions',
  ],
  item: [
    'one primary object only, readable at icon size',
    'rarity frame and labels are not baked into the artwork',
    'motif and function remain recognizable without text',
  ],
  stage: [
    'gameplay readability takes priority over illustration detail',
    'safe combat space and contrast remain available',
    'no character, logo or readable signage is baked in unless explicitly contracted',
  ],
};

const TYPE_HUMAN_CHECKS: Record<AssetFactoryContentType, string[]> = {
  character: ['identity drift', 'proportion drift', 'hair and fixed-equipment drift', 'left/right placement'],
  enemy: ['family silhouette drift', 'appendage drift', 'threat readability', 'player/enemy visual confusion'],
  item: ['single-object readability', 'icon-scale readability', 'baked rarity/UI frame', 'motif drift'],
  stage: ['combat-space readability', 'foreground obstruction', 'palette drift', 'unwanted characters or text'],
};

function identityReferenceSetId(record: AssetFactoryPromptRecord): string {
  return `${record.contentType}:${record.sourceId}:identity-v1`;
}

function alphaPolicy(record: AssetFactoryPromptRecord): AlphaPolicy {
  const normalized = `${record.kind} ${record.sizeSpec}`.toLowerCase();
  if (normalized.includes('transparent') || normalized.includes('rgba') || normalized.includes('icon') || normalized.includes('cutin')) {
    return 'required';
  }
  if (record.contentType === 'stage' || normalized.includes('background')) return 'forbidden';
  return 'allowed';
}

function edgeContactForbidden(record: AssetFactoryPromptRecord): boolean {
  const normalized = `${record.kind} ${record.sizeSpec}`.toLowerCase();
  return normalized.includes('sprite') || normalized.includes('icon') || normalized.includes('transparent');
}

function automaticChecks(record: AssetFactoryPromptRecord): string[] {
  const checks = [
    'output file exists and path follows outputPathHint',
    'dimensions and format satisfy sizeSpec',
    'prompt hash and contract version are recorded',
    'generator name/version and source commit are recorded',
    'reference set IDs and available reference hashes are recorded',
    'no asset may default to approved-final or runtime-approved',
  ];
  if (alphaPolicy(record) === 'required') checks.push('alpha channel exists and background is transparent');
  if (alphaPolicy(record) === 'forbidden') checks.push('background asset is opaque and has no accidental transparency holes');
  if (edgeContactForbidden(record)) checks.push('subject does not touch output edges');
  return checks;
}

export function buildAssetGenerationContract(record: AssetFactoryPromptRecord): AssetGenerationContract {
  const identitySetId = identityReferenceSetId(record);
  return {
    contractId: `asset-contract:${record.key}:v1`,
    contractVersion: ASSET_GENERATION_CONTRACT_SCHEMA_VERSION,
    policyVersion: ASSET_GENERATION_POLICY_VERSION,
    promptCatalogKey: record.key,
    contentType: record.contentType,
    sourceId: record.sourceId,
    displayName: record.displayName,
    kind: record.kind,
    outputPathHint: record.outputPathHint,
    sizeSpec: record.sizeSpec,
    styleLock: {
      requiredTraits: [...GLOBAL_ASSET_STYLE_LOCK.requiredTraits, ...TYPE_REQUIRED_TRAITS[record.contentType]],
      forbiddenTraits: [...GLOBAL_ASSET_STYLE_LOCK.forbiddenTraits],
      palette: { ...GLOBAL_ASSET_STYLE_LOCK.palette },
    },
    referencePolicy: {
      requiredReferenceSetIds: ['global:visual-style-v1', identitySetId],
      identityReferenceSetId: identitySetId,
      minimumReferenceSetsForCandidate: 1,
      minimumReferenceSetsForFinal: 2,
      finalApprovalBlockedWithoutIdentityReference: true,
    },
    generationPolicy: {
      candidateCount: 4,
      oneShotFinalForbidden: true,
      generatorNameRequired: true,
      generatorVersionRequired: true,
      promptHashRequired: true,
      referenceHashRequired: true,
      seedMustBeRecordedWhenSupported: true,
      regenerateFromSameContractOnly: true,
    },
    outputLock: {
      alphaPolicy: alphaPolicy(record),
      bakedTextForbidden: true,
      bakedLogoForbidden: true,
      edgeContactForbidden: edgeContactForbidden(record),
      outputPathMustMatchHint: true,
    },
    qaPolicy: {
      automaticChecks: automaticChecks(record),
      humanChecks: [...TYPE_HUMAN_CHECKS[record.contentType], ...record.reviewChecklist],
      comparisonSheetRequired: true,
      unityGameplaySizeReviewRequired: record.contentType !== 'stage' || record.kind.includes('background'),
    },
    approvalPolicy: {
      defaultState: 'candidate',
      humanApprovalRequired: true,
      approvedAsFinalDefault: false,
      runtimeApprovedDefault: false,
      finalRequiresGoldenReference: true,
      finalRequiresLineageManifest: true,
      finalRequiresQaPass: true,
    },
  };
}

export const assetGenerationContracts = assetFactoryPromptCatalog.map(buildAssetGenerationContract);
export const assetGenerationContractByKey = new Map(
  assetGenerationContracts.map((contract) => [contract.promptCatalogKey, contract]),
);
