import { assetGenerationContractByKey } from './assetGenerationPolicy.ts';
import {
  evaluateReferenceCandidateReview,
  referenceCandidateReviewLedger,
  type ReferenceCandidateReviewRecord,
} from './referenceCandidateReviewLedger.ts';
import {
  assetFactorySharedSourceHandoffs,
  type SharedSourceGenerationHandoff,
} from './sharedSourceGenerationHandoff.ts';

export type RuntimeDerivativeSourceCategory = 'enemies' | 'bosses' | 'weapons' | 'items';

export type RuntimeDerivativeQueueEntry = {
  derivativeQueueId: string;
  referenceQueueId: string;
  referenceHandoffId: string;
  approvedReferenceCandidateId: string;
  derivativeHandoffId: string;
  sourceCategory: RuntimeDerivativeSourceCategory;
  sourceId: string;
  displayName: string;
  derivativePromptCatalogKey: string;
  derivativeContractId: string;
  derivativeOutputPathHint: string;
  candidateCount: 4;
  executionState: 'QUEUED_NOT_GENERATED';
  gate: {
    approvedReferenceRequired: true;
    approvedReferenceValidated: true;
    humanComparisonRequired: true;
    gameplaySizeQaRequired: true;
    separateUnityApprovalRequired: true;
    runtimeApprovalRequiredAfterUnityQa: true;
    WebDerivativeAllowedFromThisQueue: false;
    oneShotFinalForbidden: true;
  };
  approval: {
    approvedUnityDefault: false;
    runtimeApprovedDefault: false;
    approvedWebDefault: false;
  };
};

export type RuntimeDerivativeMissingContract = {
  referenceQueueId: string;
  referenceHandoffId: string;
  sourceCategory: RuntimeDerivativeSourceCategory;
  sourceId: string;
  displayName: string;
  reason: 'NO_DEDICATED_RUNTIME_DERIVATIVE_CONTRACT';
  mayInventRuntimeContract: false;
};

export type RuntimeDerivativeBuildResult = {
  queue: readonly RuntimeDerivativeQueueEntry[];
  missingContracts: readonly RuntimeDerivativeMissingContract[];
  approvedReferenceCount: number;
};

function expectedFactoryCategory(category: RuntimeDerivativeSourceCategory): 'enemy' | 'item' | null {
  if (category === 'enemies' || category === 'bosses') return 'enemy';
  if (category === 'items') return 'item';
  return null;
}

function runtimeHandoffsForReference(record: ReferenceCandidateReviewRecord): readonly SharedSourceGenerationHandoff[] {
  const factoryCategory = expectedFactoryCategory(record.sourceCategory);
  if (factoryCategory === null) return [];
  return assetFactorySharedSourceHandoffs.filter(
    (handoff) =>
      handoff.kind === 'unity-runtime-asset-handoff' &&
      handoff.sourceCategory === factoryCategory &&
      handoff.sourceId === record.sourceId,
  );
}

function runtimeEntry(
  record: ReferenceCandidateReviewRecord,
  handoff: SharedSourceGenerationHandoff,
  approvedReferenceCandidateId: string,
  sequence: number,
): RuntimeDerivativeQueueEntry {
  const existing = handoff.existingAssetFactory;
  if (!existing) throw new Error(`Runtime derivative handoff lacks Asset Factory relation: ${handoff.handoffId}`);
  const contract = assetGenerationContractByKey.get(existing.promptCatalogKey);
  if (!contract) throw new Error(`Runtime derivative contract missing: ${existing.promptCatalogKey}`);
  return {
    derivativeQueueId: `runtime-derivative:${sequence.toString().padStart(5, '0')}:${handoff.handoffId}`,
    referenceQueueId: record.queueId,
    referenceHandoffId: record.handoffId,
    approvedReferenceCandidateId,
    derivativeHandoffId: handoff.handoffId,
    sourceCategory: record.sourceCategory,
    sourceId: record.sourceId,
    displayName: record.displayName,
    derivativePromptCatalogKey: existing.promptCatalogKey,
    derivativeContractId: contract.contractId,
    derivativeOutputPathHint: contract.outputPathHint,
    candidateCount: contract.generationPolicy.candidateCount,
    executionState: 'QUEUED_NOT_GENERATED',
    gate: {
      approvedReferenceRequired: true,
      approvedReferenceValidated: true,
      humanComparisonRequired: true,
      gameplaySizeQaRequired: true,
      separateUnityApprovalRequired: true,
      runtimeApprovalRequiredAfterUnityQa: true,
      WebDerivativeAllowedFromThisQueue: false,
      oneShotFinalForbidden: true,
    },
    approval: {
      approvedUnityDefault: false,
      runtimeApprovedDefault: false,
      approvedWebDefault: false,
    },
  };
}

export function buildRuntimeDerivativeQueue(
  reviewRecords: readonly ReferenceCandidateReviewRecord[] = referenceCandidateReviewLedger,
): RuntimeDerivativeBuildResult {
  const queue: RuntimeDerivativeQueueEntry[] = [];
  const missingContracts: RuntimeDerivativeMissingContract[] = [];
  let approvedReferenceCount = 0;
  let sequence = 1;

  for (const record of reviewRecords) {
    const evaluation = evaluateReferenceCandidateReview(record);
    if (!evaluation.approvedReferenceValid || !evaluation.runtimeDerivativeQueueAllowed) continue;
    approvedReferenceCount += 1;
    const selectedCandidateId = record.selectedCandidateId;
    if (selectedCandidateId === null) throw new Error(`Approved reference lacks selected candidate: ${record.queueId}`);

    const derivatives = runtimeHandoffsForReference(record);
    if (derivatives.length === 0) {
      missingContracts.push({
        referenceQueueId: record.queueId,
        referenceHandoffId: record.handoffId,
        sourceCategory: record.sourceCategory,
        sourceId: record.sourceId,
        displayName: record.displayName,
        reason: 'NO_DEDICATED_RUNTIME_DERIVATIVE_CONTRACT',
        mayInventRuntimeContract: false,
      });
      continue;
    }

    for (const derivative of derivatives) {
      queue.push(runtimeEntry(record, derivative, selectedCandidateId, sequence));
      sequence += 1;
    }
  }

  return { queue, missingContracts, approvedReferenceCount };
}

export const runtimeDerivativeBuildResult = buildRuntimeDerivativeQueue();
export const runtimeDerivativeQueue = runtimeDerivativeBuildResult.queue;
export const runtimeDerivativeMissingContracts = runtimeDerivativeBuildResult.missingContracts;

export const runtimeDerivativeQueueSummary = {
  approvedReferenceCount: runtimeDerivativeBuildResult.approvedReferenceCount,
  queuedDerivativeCount: runtimeDerivativeQueue.length,
  missingRuntimeContractCount: runtimeDerivativeMissingContracts.length,
  executionGeneratedCountDefault: 0,
  approvedUnityCountDefault: 0,
  runtimeApprovedCountDefault: 0,
  approvedWebCountDefault: 0,
  referenceApprovalRequired: true,
  WebSurfaceExcluded: true,
  oneShotFinalForbidden: true,
} as const;
