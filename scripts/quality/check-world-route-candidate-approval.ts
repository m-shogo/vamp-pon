import { readFileSync } from 'node:fs';

import {
  WORLD_ROUTE_CANDIDATE_REQUIRED_GATES,
  evaluateWorldRouteCandidateProposal,
  worldRouteCandidateApprovalSummary,
  worldRouteCandidateProposals,
  type WorldRouteCandidateProposal,
} from '../../src/game/data/worldRouteCandidateApproval.ts';
import { worldRouteSymbolSharedSourceSummary } from '../../src/game/data/worldRouteSymbolSharedSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[World Route Candidate Approval] ${message}`);
}

assert(worldRouteCandidateProposals.length === 0, 'P19 must not invent route/station/ticket/stamp/vector candidates');
assert(worldRouteCandidateApprovalSummary.proposalCount === 0, 'candidate summary count drift');
assert(worldRouteCandidateApprovalSummary.authorityProposalEligibleCount === 0, 'authority proposal inferred');
assert(worldRouteCandidateApprovalSummary.promotedCurrentCount === 0, 'Current promotion inferred');
assert(worldRouteCandidateApprovalSummary.currentRouteInstanceCount === 0, 'Current route instance must remain zero');
assert(worldRouteCandidateApprovalSummary.currentStationInstanceCount === 0, 'Current station instance must remain zero');
assert(worldRouteCandidateApprovalSummary.currentTicketInstanceCount === 0, 'Current ticket instance must remain zero');
assert(worldRouteCandidateApprovalSummary.currentFinalVectorApproved === false, 'final world vector approval inferred');
assert(worldRouteCandidateApprovalSummary.candidateFrameworkReady === true, 'candidate framework readiness drift');
assert(worldRouteCandidateApprovalSummary.eligibilityIsDerivedOnly === true, 'candidate cannot self-declare authority eligibility');
assert(worldRouteCandidateApprovalSummary.currentAuthorityMutationFromCandidateFileAllowed === false, 'candidate file must not mutate Current authority');
assert(worldRouteSymbolSharedSourceSummary.routeInstanceCount === 0, 'route Shared Source instance drift');
assert(worldRouteSymbolSharedSourceSummary.stationInstanceCount === 0, 'station Shared Source instance drift');
assert(worldRouteSymbolSharedSourceSummary.ticketInstanceCount === 0, 'ticket Shared Source instance drift');
assert(worldRouteSymbolSharedSourceSummary.finalVectorApproved === false, 'world symbol vector authority drift');

const expectedGates = [
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
];
assert(JSON.stringify(WORLD_ROUTE_CANDIDATE_REQUIRED_GATES) === JSON.stringify(expectedGates), 'required gate set/order drift');

const baseFixture: WorldRouteCandidateProposal = {
  proposalId: '__fixture_station_candidate__',
  kind: 'STATION_INSTANCE',
  status: 'APPROVED_FOR_AUTHORITY_PROPOSAL',
  candidateOnly: true,
  currentAuthorityMutationAllowed: false,
  sourceAuthority: ['__test_fixture_only__'],
  relatedProductionStageIds: [],
  candidateData: {
    proposedStableId: '__fixture_station__',
    proposedDisplayName: null,
    proposedShortCode: null,
    proposedRouteId: null,
    localMotifSource: null,
    notes: ['test fixture; never Current authority'],
  },
  derivationGuard: {
    derivedFromLegacyRuntimeStageNumber: false,
    derivedFromProductionStageNumber: false,
    copiedFromRealRailwayIdentity: false,
    characterToumonUsedAsWorldIdentity: false,
    generatedReadableTextBakedIntoArt: false,
  },
  review: {
    requiredGates: WORLD_ROUTE_CANDIDATE_REQUIRED_GATES,
    passedGates: WORLD_ROUTE_CANDIDATE_REQUIRED_GATES,
    humanReviewerRecorded: true,
    comparisonEvidenceRecorded: true,
    originalitySearchRecorded: true,
    smallScaleProofRecorded: true,
    spoilerReviewRecorded: true,
  },
  promotion: {
    promotedToCurrentAuthority: false,
    separatePromotionCommitRequired: true,
    currentInstanceCountMayChangeInThisProposalFile: false,
  },
};

const valid = evaluateWorldRouteCandidateProposal(baseFixture);
assert(valid.allRequiredGatesPassed === true, 'full-gate fixture should pass gate coverage');
assert(valid.evidenceComplete === true, 'full-gate fixture should pass evidence coverage');
assert(valid.derivationClean === true, 'clean fixture should pass derivation checks');
assert(valid.eligibleForAuthorityProposal === true, 'full review fixture should become authority-proposal eligible');
assert(valid.mayMutateCurrentAuthority === false, 'even approved proposal must not mutate Current authority directly');

const missingHuman = evaluateWorldRouteCandidateProposal({ ...baseFixture, review: { ...baseFixture.review, humanReviewerRecorded: false } });
assert(missingHuman.eligibleForAuthorityProposal === false, 'human approval cannot be optional');
const copiedRailway = evaluateWorldRouteCandidateProposal({ ...baseFixture, derivationGuard: { ...baseFixture.derivationGuard, copiedFromRealRailwayIdentity: true } });
assert(copiedRailway.eligibleForAuthorityProposal === false, 'real railway identity copy must block proposal eligibility');
const stageNumberDerived = evaluateWorldRouteCandidateProposal({ ...baseFixture, derivationGuard: { ...baseFixture.derivationGuard, derivedFromProductionStageNumber: true } });
assert(stageNumberDerived.eligibleForAuthorityProposal === false, 'production Stage number derivation must block proposal eligibility');
const missingGate = evaluateWorldRouteCandidateProposal({
  ...baseFixture,
  review: { ...baseFixture.review, passedGates: WORLD_ROUTE_CANDIDATE_REQUIRED_GATES.filter((gate) => gate !== 'SPOILER_BOUNDARY') },
});
assert(missingGate.eligibleForAuthorityProposal === false, 'missing one required gate must block proposal eligibility');

const source = readFileSync('src/game/data/worldRouteSymbolSharedSource.ts', 'utf8');
assert(source.includes("authorityStatus: 'SCHEMA_ONLY_NO_STATION_INSTANCES'"), 'station schema-only boundary missing');
assert(source.includes("authorityStatus: 'SCHEMA_ONLY_NO_TICKET_INSTANCES'"), 'ticket schema-only boundary missing');
assert(source.includes("authorityStatus: 'SCHEMA_ONLY_NO_ROUTE_INSTANCES'"), 'route schema-only boundary missing');
assert(source.includes('do not derive codes from current Stage numbers'), 'Stage-number station-code guard missing');
assert(source.includes('real railway company logo or station mark imitation'), 'real railway identity guard missing');

console.log('World Route Candidate Approval: PASS (Current instances=0, proposals=0, gates=10, derivedEligibility=true, directCurrentMutation=false)');
