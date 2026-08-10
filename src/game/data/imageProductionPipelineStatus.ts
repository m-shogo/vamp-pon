import { dawnProofSharedSourceSummary } from './dawnProofSharedSource.ts';
import { namedObjectGeometryReviewSummary } from './namedObjectGeometryReview.ts';
import { referenceCandidateReviewLedgerSummary } from './referenceCandidateReviewLedger.ts';
import { referenceFirstBulkGenerationQueueSummary } from './referenceFirstBulkGenerationQueue.ts';
import { runtimeDerivativeQueueSummary } from './runtimeDerivativeQueue.ts';
import { sharedSourceReadinessSummary } from './sharedSourceReadinessMatrix.ts';
import { worldEffectGenerationHandoffSummary } from './worldEffectGenerationHandoff.ts';
import { worldRouteCandidateApprovalSummary } from './worldRouteCandidateApproval.ts';

export type ImageProductionPipelineStageId =
  | 'REFERENCE_CANDIDATE_GENERATION'
  | 'REFERENCE_HUMAN_REVIEW'
  | 'RUNTIME_DERIVATIVE_GENERATION'
  | 'WORLD_EFFECT_TEXTURE_REFERENCE'
  | 'NAMED_OBJECT_GEOMETRY_REVIEW'
  | 'ROUTE_STATION_CANDIDATE_AUTHORITY'
  | 'DAWN_PROOF_DATA';

export type ImageProductionPipelineStageState =
  | 'READY_TO_EXECUTE'
  | 'READY_LIMITED_SCOPE'
  | 'BLOCKED_BY_PREVIOUS_STAGE'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'FRAMEWORK_READY_NO_CANDIDATES'
  | 'DATA_READY_NO_ART';

export type ImageProductionPipelineStage = {
  id: ImageProductionPipelineStageId;
  order: number;
  state: ImageProductionPipelineStageState;
  authorityReady: boolean;
  automaticExecutionAllowed: boolean;
  currentCount: number;
  targetCount: number;
  description: string;
  blockingReasons: readonly string[];
  nextAction: string;
  sourcePaths: readonly string[];
};

const referenceQueueReady =
  referenceFirstBulkGenerationQueueSummary.totalQueuedReferences > 0 &&
  referenceFirstBulkGenerationQueueSummary.generatedCandidateCountDefault === 0 &&
  referenceFirstBulkGenerationQueueSummary.approvedReferenceCountDefault === 0;

export const imageProductionPipelineStages: readonly ImageProductionPipelineStage[] = [
  {
    id: 'REFERENCE_CANDIDATE_GENERATION',
    order: 1,
    state: 'READY_TO_EXECUTE',
    authorityReady: referenceQueueReady,
    automaticExecutionAllowed: false,
    currentCount: referenceFirstBulkGenerationQueueSummary.generatedCandidateCountDefault,
    targetCount: referenceFirstBulkGenerationQueueSummary.totalQueuedReferences,
    description: 'Generate exactly four reference candidates for each queued Enemy/Boss/Weapon/Item reference. Runtime derivatives are excluded.',
    blockingReasons: [],
    nextAction: 'Run the deterministic 168-reference queue in a deliberate batch session, record generator/prompt/reference/source hashes, and stage exactly four distinct candidates per reference.',
    sourcePaths: [
      'src/game/data/referenceFirstBulkGenerationQueue.ts',
      'src/game/data/sharedSourceGenerationHandoff.ts',
    ],
  },
  {
    id: 'REFERENCE_HUMAN_REVIEW',
    order: 2,
    state: 'BLOCKED_BY_PREVIOUS_STAGE',
    authorityReady: true,
    automaticExecutionAllowed: false,
    currentCount: referenceCandidateReviewLedgerSummary.approvedReferenceCount,
    targetCount: referenceCandidateReviewLedgerSummary.totalRecords,
    description: 'Compare four staged candidates, select one, and record human QA before APPROVED_REFERENCE.',
    blockingReasons: ['All 168 records are currently NOT_GENERATED, so no candidate set is available for human comparison yet.'],
    nextAction: 'After candidate staging, advance each record through HUMAN_REVIEW_REQUIRED; never treat generation as approval.',
    sourcePaths: [
      'src/game/data/referenceCandidateReviewLedger.ts',
      'src/game/data/referenceFirstBulkGenerationQueue.ts',
    ],
  },
  {
    id: 'RUNTIME_DERIVATIVE_GENERATION',
    order: 3,
    state: 'BLOCKED_BY_PREVIOUS_STAGE',
    authorityReady: true,
    automaticExecutionAllowed: false,
    currentCount: runtimeDerivativeQueueSummary.queuedDerivativeCount,
    targetCount: runtimeDerivativeQueueSummary.approvedReferenceCount,
    description: 'Create Unity/runtime-specific derivatives only from valid APPROVED_REFERENCE records and existing runtime contracts.',
    blockingReasons: ['Approved reference count is currently zero.', 'Weapon references still require a dedicated runtime derivative contract before they can enter this queue.'],
    nextAction: 'Do not generate runtime derivatives until valid reference approvals exist; when they do, queue only existing Unity/runtime contracts and surface missing Weapon contracts explicitly.',
    sourcePaths: [
      'src/game/data/runtimeDerivativeQueue.ts',
      'src/game/data/referenceCandidateReviewLedger.ts',
      'src/game/data/assetGenerationPolicy.ts',
    ],
  },
  {
    id: 'WORLD_EFFECT_TEXTURE_REFERENCE',
    order: 4,
    state: 'READY_LIMITED_SCOPE',
    authorityReady: true,
    automaticExecutionAllowed: false,
    currentCount: 0,
    targetCount: worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents.length,
    description: 'Generate isolated texture/material reference candidates only for the three approved World Effect texture lanes; all other effects remain procedural/native-UI or blocked.',
    blockingReasons: ['Device creative approval and runtime rebuild/packing are separate later gates.', 'Toumon effect geometry remains blocked.'],
    nextAction: 'When batching image work, generate only WEAPON_EVOLUTION, KOKUYOU, and BOSS_DEATH texture-reference candidates; do not create generic full-screen VFX packs.',
    sourcePaths: [
      'src/game/data/worldEffectGenerationHandoff.ts',
      'src/game/data/worldEffectSharedSource.ts',
    ],
  },
  {
    id: 'NAMED_OBJECT_GEOMETRY_REVIEW',
    order: 5,
    state: 'HUMAN_REVIEW_REQUIRED',
    authorityReady: true,
    automaticExecutionAllowed: false,
    currentCount: namedObjectGeometryReviewSummary.referenceProposalEligibleCount,
    targetCount: namedObjectGeometryReviewSummary.candidateGeometryCount,
    description: 'Review 21 existing CANDIDATE_OBJECT_GEOMETRY records before any Named Object reference generation or replica work.',
    blockingReasons: ['All 21 candidate geometries remain REVIEW_REQUIRED.', 'Current geometry approval, reference generation readiness, and replica permissions are all zero.'],
    nextAction: 'Perform three-view/scale/material/wear/repair/handling/storage/spoiler/replica/owner review with explicit human evidence; promotion remains a separate commit.',
    sourcePaths: [
      'src/game/data/namedObjectGeometryReview.ts',
      'src/game/data/namedObjectVisualSharedSource.ts',
    ],
  },
  {
    id: 'ROUTE_STATION_CANDIDATE_AUTHORITY',
    order: 6,
    state: 'FRAMEWORK_READY_NO_CANDIDATES',
    authorityReady: worldRouteCandidateApprovalSummary.candidateFrameworkReady,
    automaticExecutionAllowed: false,
    currentCount: worldRouteCandidateApprovalSummary.proposalCount,
    targetCount: 0,
    description: 'The fail-closed review framework exists, but no route/station/ticket/stamp/vector candidate has been proposed or promoted.',
    blockingReasons: ['Current route/station/ticket instance counts remain zero.', 'Final world-symbol vector approval remains false.'],
    nextAction: 'Only create proposals when original world authority is intentionally authored; then require all ten review gates and a separate promotion commit.',
    sourcePaths: [
      'src/game/data/worldRouteCandidateApproval.ts',
      'src/game/data/worldRouteSymbolSharedSource.ts',
    ],
  },
  {
    id: 'DAWN_PROOF_DATA',
    order: 7,
    state: 'DATA_READY_NO_ART',
    authorityReady: true,
    automaticExecutionAllowed: false,
    currentCount: dawnProofSharedSourceSummary.directDawnProofCount,
    targetCount: dawnProofSharedSourceSummary.sourceBoardCellCount,
    description: 'Seven direct Stage1 gameplay Dawn proofs are normalized from explicit 夜明けする conditions; they are not narrative morning scenes or art approvals.',
    blockingReasons: ['Coverage is Stage1 direct-clear only.', 'Page-art generation remains disabled.', 'Narrative morning scenes and ending authority are not inferred.'],
    nextAction: 'Extend proof data only from explicit Current clear sources; keep visual page production separate until a page/layout contract is approved.',
    sourcePaths: [
      'src/game/data/dawnProofSharedSource.ts',
      'src/game/data/nightRecordBookSharedSource.ts',
    ],
  },
] as const;

export const imageProductionPipelineStageById = new Map(
  imageProductionPipelineStages.map((stage) => [stage.id, stage]),
);

export const imageProductionPipelineSummary = {
  stageCount: imageProductionPipelineStages.length,
  referenceQueueTotal: referenceFirstBulkGenerationQueueSummary.totalQueuedReferences,
  referenceQueueByCategory: {
    enemy: referenceFirstBulkGenerationQueueSummary.enemyReferences,
    boss: referenceFirstBulkGenerationQueueSummary.bossReferences,
    weapon: referenceFirstBulkGenerationQueueSummary.weaponReferences,
    item: referenceFirstBulkGenerationQueueSummary.itemReferences,
  },
  referenceGeneratedRecordCount:
    referenceCandidateReviewLedgerSummary.totalRecords - referenceCandidateReviewLedgerSummary.notGeneratedCount,
  referenceReviewRecords: referenceCandidateReviewLedgerSummary.totalRecords,
  referenceApprovedCount: referenceCandidateReviewLedgerSummary.approvedReferenceCount,
  runtimeDerivativeQueuedCount: runtimeDerivativeQueueSummary.queuedDerivativeCount,
  runtimeMissingContractCount: runtimeDerivativeQueueSummary.missingRuntimeContractCount,
  worldEffectTextureEventCount: worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents.length,
  namedObjectReviewRequiredCount: namedObjectGeometryReviewSummary.reviewRequiredCount,
  routeCandidateProposalCount: worldRouteCandidateApprovalSummary.proposalCount,
  dawnProofCount: dawnProofSharedSourceSummary.directDawnProofCount,
  bulkReadyCategories: sharedSourceReadinessSummary.bulkGenerationCategories,
  automaticImageGenerationNow: false,
  generatedDoesNotMeanApproved: true,
  WebUnitySurfaceSeparationRequired: true,
  humanApprovalCannotBeInferred: true,
} as const;
