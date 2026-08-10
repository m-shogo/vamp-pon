import { worldRouteSymbolSharedSourceSummary } from './worldRouteSymbolSharedSource.ts';

export type WorldRouteCandidateKind =
  | 'ROUTE_INSTANCE'
  | 'STATION_INSTANCE'
  | 'TICKET_INSTANCE'
  | 'STAMP_INSTANCE'
  | 'WORLD_SYMBOL_VECTOR';

export type WorldRouteCandidateStatus =
  | 'DRAFT_CANDIDATE'
  | 'REVIEW_REQUIRED'
  | 'REJECTED'
  | 'APPROVED_FOR_AUTHORITY_PROPOSAL';

export type WorldRouteReviewGateId =
  | 'ORIGINALITY'
  | 'NO_REAL_RAILWAY_IDENTITY'
  | 'NO_STAGE_NUMBER_DERIVATION'
  | 'NATIVE_TEXT_SEPARATION'
  | 'TOUMON_SEPARATION'
  | 'SPOILER_BOUNDARY'
  | 'ROUTE_SEMANTICS'
  | 'SMALL_SCALE_READABILITY'
  | 'SURFACE_SEPARATION'
  | 'HUMAN_APPROVAL';

export type WorldRouteCandidateProposal = {
  proposalId: string;
  kind: WorldRouteCandidateKind;
  status: WorldRouteCandidateStatus;
  candidateOnly: true;
  currentAuthorityMutationAllowed: false;
  sourceAuthority: readonly string[];
  relatedProductionStageIds: readonly string[];
  candidateData: {
    proposedStableId: string;
    proposedDisplayName: string | null;
    proposedShortCode: string | null;
    proposedRouteId: string | null;
    localMotifSource: string | null;
    notes: readonly string[];
  };
  derivationGuard: {
    derivedFromLegacyRuntimeStageNumber: false;
    derivedFromProductionStageNumber: false;
    copiedFromRealRailwayIdentity: false;
    characterToumonUsedAsWorldIdentity: false;
    generatedReadableTextBakedIntoArt: false;
  };
  review: {
    requiredGates: readonly WorldRouteReviewGateId[];
    passedGates: readonly WorldRouteReviewGateId[];
    humanReviewerRecorded: boolean;
    comparisonEvidenceRecorded: boolean;
    originalitySearchRecorded: boolean;
    smallScaleProofRecorded: boolean;
    spoilerReviewRecorded: boolean;
  };
  promotion: {
    eligibleForAuthorityProposal: boolean;
    promotedToCurrentAuthority: false;
    separatePromotionCommitRequired: true;
    currentInstanceCountMayChangeInThisProposalFile: false;
  };
};

export const WORLD_ROUTE_CANDIDATE_REQUIRED_GATES: readonly WorldRouteReviewGateId[] = [
  'ORIGINALITY',
  'NO_REAL_RAILWAY_IDENTITY',
  'NO_STAGE_NUMBER_DERIVATION',
  'NATIVE_TEXT_SEPARATION',
  'TOUMON_SEPARATION',
  'SPOILER_BOUNDARY',
  'ROUTE_SEMANTICS',
  'SMALL_SCALE_READABILITY',
  'SURFACE_SEPARATION',
  'HUMAN_APPROVAL',
] as const;

/**
 * Candidate queue intentionally starts empty.
 *
 * P19 creates the review/promotion contract only. It does not invent a route,
 * station name, station code, ticket, stamp, or final world-symbol vector.
 * New proposals may be added only as Candidate records and cannot mutate
 * Current instance counts from this file.
 */
export const worldRouteCandidateProposals: readonly WorldRouteCandidateProposal[] = [] as const;

export const worldRouteCandidateProposalById = new Map(
  worldRouteCandidateProposals.map((proposal) => [proposal.proposalId, proposal]),
);

export function evaluateWorldRouteCandidateProposal(proposal: WorldRouteCandidateProposal) {
  const passed = new Set(proposal.review.passedGates);
  const allRequiredGatesPassed = WORLD_ROUTE_CANDIDATE_REQUIRED_GATES.every((gate) => passed.has(gate));
  const evidenceComplete =
    proposal.review.humanReviewerRecorded &&
    proposal.review.comparisonEvidenceRecorded &&
    proposal.review.originalitySearchRecorded &&
    proposal.review.smallScaleProofRecorded &&
    proposal.review.spoilerReviewRecorded;
  const derivationClean =
    !proposal.derivationGuard.derivedFromLegacyRuntimeStageNumber &&
    !proposal.derivationGuard.derivedFromProductionStageNumber &&
    !proposal.derivationGuard.copiedFromRealRailwayIdentity &&
    !proposal.derivationGuard.characterToumonUsedAsWorldIdentity &&
    !proposal.derivationGuard.generatedReadableTextBakedIntoArt;

  return {
    allRequiredGatesPassed,
    evidenceComplete,
    derivationClean,
    eligibleForAuthorityProposal:
      proposal.status === 'APPROVED_FOR_AUTHORITY_PROPOSAL' &&
      allRequiredGatesPassed &&
      evidenceComplete &&
      derivationClean &&
      proposal.review.humanReviewerRecorded,
    mayMutateCurrentAuthority: false,
  } as const;
}

export const worldRouteCandidateApprovalSummary = {
  proposalCount: worldRouteCandidateProposals.length,
  authorityProposalEligibleCount: worldRouteCandidateProposals.filter(
    (proposal) => evaluateWorldRouteCandidateProposal(proposal).eligibleForAuthorityProposal,
  ).length,
  promotedCurrentCount: worldRouteCandidateProposals.filter(
    (proposal) => proposal.promotion.promotedToCurrentAuthority,
  ).length,
  currentRouteInstanceCount: worldRouteSymbolSharedSourceSummary.routeInstanceCount,
  currentStationInstanceCount: worldRouteSymbolSharedSourceSummary.stationInstanceCount,
  currentTicketInstanceCount: worldRouteSymbolSharedSourceSummary.ticketInstanceCount,
  currentFinalVectorApproved: worldRouteSymbolSharedSourceSummary.finalVectorApproved,
  candidateFrameworkReady: true,
  currentAuthorityMutationFromCandidateFileAllowed: false,
} as const;
