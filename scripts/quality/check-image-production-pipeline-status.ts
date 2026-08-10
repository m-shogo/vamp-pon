import { existsSync } from 'node:fs';

import { dawnProofSharedSourceSummary } from '../../src/game/data/dawnProofSharedSource.ts';
import {
  imageProductionPipelineStageById,
  imageProductionPipelineStages,
  imageProductionPipelineSummary,
} from '../../src/game/data/imageProductionPipelineStatus.ts';
import { namedObjectGeometryReviewSummary } from '../../src/game/data/namedObjectGeometryReview.ts';
import { referenceCandidateReviewLedgerSummary } from '../../src/game/data/referenceCandidateReviewLedger.ts';
import { referenceFirstBulkGenerationQueueSummary } from '../../src/game/data/referenceFirstBulkGenerationQueue.ts';
import { runtimeDerivativeQueueSummary } from '../../src/game/data/runtimeDerivativeQueue.ts';
import { sharedSourceReadinessSummary } from '../../src/game/data/sharedSourceReadinessMatrix.ts';
import { worldEffectGenerationHandoffSummary } from '../../src/game/data/worldEffectGenerationHandoff.ts';
import { worldRouteCandidateApprovalSummary } from '../../src/game/data/worldRouteCandidateApproval.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Image Production Pipeline Status] ${message}`);
}

const expectedStageIds = [
  'REFERENCE_CANDIDATE_GENERATION',
  'REFERENCE_HUMAN_REVIEW',
  'RUNTIME_DERIVATIVE_GENERATION',
  'WORLD_EFFECT_TEXTURE_REFERENCE',
  'NAMED_OBJECT_GEOMETRY_REVIEW',
  'ROUTE_STATION_CANDIDATE_AUTHORITY',
  'DAWN_PROOF_DATA',
];
assert(imageProductionPipelineStages.length === expectedStageIds.length, 'pipeline stage count drift');
assert(JSON.stringify(imageProductionPipelineStages.map((stage) => stage.id)) === JSON.stringify(expectedStageIds), 'pipeline stage ID/order drift');
assert(new Set(imageProductionPipelineStages.map((stage) => stage.id)).size === expectedStageIds.length, 'duplicate pipeline stage ID');

for (const [index, stage] of imageProductionPipelineStages.entries()) {
  assert(stage.order === index + 1, `${stage.id}: order drift`);
  assert(stage.authorityReady === true, `${stage.id}: authority unexpectedly not ready`);
  assert(stage.automaticExecutionAllowed === false, `${stage.id}: automatic execution must remain opt-in`);
  assert(stage.description.length > 40, `${stage.id}: description too weak`);
  assert(stage.nextAction.length > 40, `${stage.id}: next action too weak`);
  assert(stage.sourcePaths.length > 0, `${stage.id}: source paths missing`);
  for (const path of stage.sourcePaths) assert(existsSync(path), `${stage.id}: source path missing: ${path}`);
}

assert(referenceFirstBulkGenerationQueueSummary.totalQueuedReferences === 168, 'reference queue total drift');
assert(referenceFirstBulkGenerationQueueSummary.enemyReferences === 45, 'Enemy reference queue drift');
assert(referenceFirstBulkGenerationQueueSummary.bossReferences === 3, 'Boss reference queue drift');
assert(referenceFirstBulkGenerationQueueSummary.weaponReferences === 15, 'Weapon reference queue drift');
assert(referenceFirstBulkGenerationQueueSummary.itemReferences === 105, 'Item reference queue drift');
assert(referenceCandidateReviewLedgerSummary.totalRecords === 168, 'reference review record count drift');
assert(referenceCandidateReviewLedgerSummary.notGeneratedCount === 168, 'Current reference records should remain NOT_GENERATED');
assert(referenceCandidateReviewLedgerSummary.totalCandidateArtifacts === 0, 'candidate artifacts inferred');
assert(referenceCandidateReviewLedgerSummary.approvedReferenceCount === 0, 'reference approval inferred');
assert(runtimeDerivativeQueueSummary.approvedReferenceCount === 0, 'runtime derivative approved-reference count drift');
assert(runtimeDerivativeQueueSummary.queuedDerivativeCount === 0, 'runtime derivative queue inferred');
assert(runtimeDerivativeQueueSummary.missingRuntimeContractCount === 0, 'missing runtime contract should remain zero before approvals');
assert(namedObjectGeometryReviewSummary.candidateGeometryCount === 21, 'Named Object candidate geometry count drift');
assert(namedObjectGeometryReviewSummary.reviewRequiredCount === 21, 'Named Object review-required count drift');
assert(worldRouteCandidateApprovalSummary.proposalCount === 0, 'route/station proposal inferred');
assert(worldRouteCandidateApprovalSummary.currentRouteInstanceCount === 0, 'route instance inferred');
assert(worldRouteCandidateApprovalSummary.currentStationInstanceCount === 0, 'station instance inferred');
assert(worldRouteCandidateApprovalSummary.currentTicketInstanceCount === 0, 'ticket instance inferred');
assert(worldRouteCandidateApprovalSummary.currentFinalVectorApproved === false, 'world-symbol vector approval inferred');
assert(dawnProofSharedSourceSummary.directDawnProofCount === 7, 'Dawn proof count drift');
assert(dawnProofSharedSourceSummary.sourceBoardCellCount === 25, 'Dawn proof source-board count drift');
assert(JSON.stringify(worldEffectGenerationHandoffSummary.generatedTextureCandidateEvents) === JSON.stringify(['WEAPON_EVOLUTION', 'KOKUYOU', 'BOSS_DEATH']), 'World Effect texture-reference lane drift');
assert(JSON.stringify(sharedSourceReadinessSummary.bulkGenerationCategories) === JSON.stringify(['Enemies', 'Bosses', 'Weapons', 'Items']), 'bulk-ready category drift');

const referenceGeneration = imageProductionPipelineStageById.get('REFERENCE_CANDIDATE_GENERATION');
assert(referenceGeneration?.state === 'READY_TO_EXECUTE', 'reference generation should currently be READY_TO_EXECUTE');
assert(referenceGeneration.currentCount === 0 && referenceGeneration.targetCount === 168, 'reference generation progress drift');
assert(referenceGeneration.blockingReasons.length === 0, 'reference generation should have no authority blocker');

const referenceReview = imageProductionPipelineStageById.get('REFERENCE_HUMAN_REVIEW');
assert(referenceReview?.state === 'BLOCKED_BY_PREVIOUS_STAGE', 'reference review should wait for candidate generation');
assert(referenceReview.currentCount === 0 && referenceReview.targetCount === 168, 'reference review progress drift');
assert(referenceReview.blockingReasons.some((reason) => /NOT_GENERATED/.test(reason)), 'reference review generation blocker missing');

const runtime = imageProductionPipelineStageById.get('RUNTIME_DERIVATIVE_GENERATION');
assert(runtime?.state === 'BLOCKED_BY_PREVIOUS_STAGE', 'runtime derivatives should wait for reference approval');
assert(runtime.currentCount === 0 && runtime.targetCount === 0, 'runtime derivative current progress drift');
assert(runtime.blockingReasons.some((reason) => /Approved reference count is currently zero/.test(reason)), 'runtime reference-approval blocker missing');
assert(runtime.sourcePaths.includes('src/game/data/runtimeDerivativeQueue.ts'), 'runtime derivative source missing');

const worldEffect = imageProductionPipelineStageById.get('WORLD_EFFECT_TEXTURE_REFERENCE');
assert(worldEffect?.state === 'READY_LIMITED_SCOPE', 'World Effect texture references should be limited-scope ready');
assert(worldEffect.currentCount === 0 && worldEffect.targetCount === 3, 'World Effect texture-reference progress drift');
assert(/WEAPON_EVOLUTION, KOKUYOU, and BOSS_DEATH/.test(worldEffect.nextAction), 'World Effect allowed event list missing');

const namedObject = imageProductionPipelineStageById.get('NAMED_OBJECT_GEOMETRY_REVIEW');
assert(namedObject?.state === 'HUMAN_REVIEW_REQUIRED', 'Named Object geometry should require human review');
assert(namedObject.currentCount === 0 && namedObject.targetCount === 21, 'Named Object review progress drift');

const route = imageProductionPipelineStageById.get('ROUTE_STATION_CANDIDATE_AUTHORITY');
assert(route?.state === 'FRAMEWORK_READY_NO_CANDIDATES', 'route/station should remain framework-only');
assert(route.currentCount === 0 && route.targetCount === 0, 'route proposal progress drift');

const dawn = imageProductionPipelineStageById.get('DAWN_PROOF_DATA');
assert(dawn?.state === 'DATA_READY_NO_ART', 'Dawn proof should remain data-ready/no-art');
assert(dawn.currentCount === 7 && dawn.targetCount === 25, 'Dawn proof progress drift');

assert(imageProductionPipelineSummary.stageCount === 7, 'pipeline summary stage count drift');
assert(imageProductionPipelineSummary.referenceQueueTotal === 168, 'pipeline summary reference total drift');
assert(imageProductionPipelineSummary.referenceQueueByCategory.enemy === 45, 'pipeline Enemy summary drift');
assert(imageProductionPipelineSummary.referenceQueueByCategory.boss === 3, 'pipeline Boss summary drift');
assert(imageProductionPipelineSummary.referenceQueueByCategory.weapon === 15, 'pipeline Weapon summary drift');
assert(imageProductionPipelineSummary.referenceQueueByCategory.item === 105, 'pipeline Item summary drift');
assert(imageProductionPipelineSummary.referenceGeneratedRecordCount === 0, 'pipeline generated reference count drift');
assert(imageProductionPipelineSummary.referenceReviewRecords === 168, 'pipeline review record count drift');
assert(imageProductionPipelineSummary.referenceApprovedCount === 0, 'pipeline approved reference count drift');
assert(imageProductionPipelineSummary.runtimeDerivativeQueuedCount === 0, 'pipeline runtime derivative count drift');
assert(imageProductionPipelineSummary.runtimeMissingContractCount === 0, 'pipeline runtime missing-contract count drift');
assert(imageProductionPipelineSummary.worldEffectTextureEventCount === 3, 'pipeline World Effect lane count drift');
assert(imageProductionPipelineSummary.namedObjectReviewRequiredCount === 21, 'pipeline Named Object pending count drift');
assert(imageProductionPipelineSummary.routeCandidateProposalCount === 0, 'pipeline route proposal count drift');
assert(imageProductionPipelineSummary.dawnProofCount === 7, 'pipeline Dawn proof count drift');
assert(imageProductionPipelineSummary.automaticImageGenerationNow === false, 'pipeline must not auto-execute image generation');
assert(imageProductionPipelineSummary.generatedDoesNotMeanApproved === true, 'generated/approved separation missing');
assert(imageProductionPipelineSummary.WebUnitySurfaceSeparationRequired === true, 'Web/Unity surface separation missing');
assert(imageProductionPipelineSummary.humanApprovalCannotBeInferred === true, 'human approval inference guard missing');

console.log('Image Production Pipeline Status: PASS (references=168, generated=0, approved=0, runtime=0, VFX=3, namedObjectReview=21, route=0, dawn=7)');
