import { readFileSync } from 'node:fs';

const PATH = 'data/character-assets/manifests/visual-existing-top-loading-reuse-audit.v1.json';
const audit = JSON.parse(readFileSync(PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(audit.schemaVersion === 1, 'TOP/Loading reuse audit schemaVersion must remain 1');
assert(audit.status === 'OBSERVED_CURRENT_MAIN_REUSE_AUDIT_NO_AUTOMATIC_REGENERATION', 'reuse audit may not authorize regeneration');
assert(audit.observedMain?.mustRevalidateBeforeReplacementOrMerge === true, 'observed main snapshot must be revalidated before replacement/merge');
assert(audit.rules?.existingDoesNotMeanApprovedFinal === true, 'existing asset may not imply final approval');
assert(audit.rules?.pendingReviewDoesNotMeanMissingImage === true, 'pending review may not be miscounted as missing image');
assert(audit.rules?.doNotRegenerateExistingSourceWithoutExplicitReplacementDecision === true, 'existing source must not be blindly regenerated');
assert(audit.rules?.runtimeCaptureIsEvidenceNotGeneratedKeyArt === true, 'runtime capture must stay evidence-only');
assert(audit.rules?.binaryReplacementRequiresNewHashAndReviewInvalidation === true, 'replacement must invalidate hash-bound review evidence');

assert(audit.counts?.loadingCommittedSourceArt === 4, 'Loading committed source count drift');
assert(audit.counts?.topV3RegisteredFinalCandidate === 1, 'TOP V3 candidate count drift');
assert(audit.counts?.topV2LayerKitSourceAssets === 17, 'TOP V2 layer kit count drift');
assert(audit.counts?.topV2LiveOrMotionRelevantInputsUnderV3Authority === 10, 'TOP V3 live input classification drift');
assert(audit.counts?.topV2ProvenanceOrFallbackOnlyInputs === 7, 'TOP provenance/fallback count drift');
assert(audit.counts?.currentRuntimeEvidenceScreenshotsRequired === 15, 'runtime evidence screenshot count drift');

const loadingAssets = audit.loadingSeasonal?.assets ?? [];
assert(loadingAssets.length === 4, 'Loading asset list must contain four seasons');
assert(new Set(loadingAssets.map((asset: any) => asset.assetId)).size === 4, 'Loading asset IDs must be unique');
assert(new Set(loadingAssets.map((asset: any) => asset.sha256)).size === 4, 'Loading source hashes must be unique');
for (const asset of loadingAssets) {
  assert(asset.state === 'EXISTS_COMMITTED_SOURCE_REUSE', `${asset.assetId}: Loading source must be reuse-classified`);
  assert(/^[a-f0-9]{64}$/.test(asset.sha256), `${asset.assetId}: invalid SHA-256 snapshot`);
}
assert(audit.loadingSeasonal?.generationNeed === 'NO_REGEN_UNLESS_EXPLICIT_REPLACEMENT_DECISION', 'Loading may not enter default regen queue');

const top = audit.topV3FinalCandidate;
assert(top?.candidateGenerated === true, 'observed TOP V3 candidate must remain recorded as generated in this snapshot');
assert(top?.approvedAsFinal === false, 'TOP V3 snapshot may not claim final approval');
assert(top?.runtimeApproved === false, 'TOP V3 snapshot may not claim runtime approval');
assert(top?.finalApprovalBlocked === true, 'TOP V3 final approval must remain blocked in observed snapshot');
assert(top?.generationNeed === 'REVIEW_EXISTING_CANDIDATE_FIRST_DO_NOT_REGENERATE_BY_DEFAULT', 'TOP V3 must be reviewed before replacement generation');
assert(/^[a-f0-9]{64}$/.test(top?.sha256 ?? ''), 'TOP V3 candidate SHA-256 snapshot invalid');

const layerAssets = audit.topV2LayerKit?.assets ?? [];
assert(layerAssets.length === 17, 'TOP V2 layer kit must list 17 source assets');
assert(new Set(layerAssets.map((asset: any) => asset.file)).size === 17, 'TOP V2 layer filenames must be unique');
const live = layerAssets.filter((asset: any) => String(asset.currentV3Role).startsWith('LIVE_'));
const fallback = layerAssets.filter((asset: any) => String(asset.currentV3Role).includes('PROVENANCE_OR_FALLBACK'));
assert(live.length === 10, `expected 10 live V3 layer inputs, got ${live.length}`);
assert(fallback.length === 7, `expected 7 provenance/fallback inputs, got ${fallback.length}`);

assert(audit.runtimeEvidence?.classification === 'CAPTURE_REQUIRED_NOT_IMAGE_GENERATION', 'runtime screenshots must not become generation rows');
assert(audit.runtimeEvidence?.expectedCaptureCount === 15, 'runtime capture expected count drift');
assert(audit.productionDecision?.loadingNewGenerationBacklogRows === 0, 'Loading existing art may not create generation rows by default');
assert(audit.productionDecision?.topV3NewGenerationBacklogRowsNow === 0, 'existing TOP candidate may not create replacement generation row by default');
assert(audit.productionDecision?.topLayerReplacementRowsNow === 0, 'TOP layer kit may not create replacement rows without review');
assert(audit.productionDecision?.runtimeCaptureGenerationRows === 0, 'runtime evidence screenshots may not inflate generation backlog');

console.log(JSON.stringify({
  status: 'PASS',
  auditId: audit.auditId,
  loadingReuseAssets: loadingAssets.length,
  topCandidateReuseReview: 1,
  topLayerSources: layerAssets.length,
  liveV3Inputs: live.length,
  provenanceFallbackInputs: fallback.length,
  evidenceScreenshotsNotGenerationRows: audit.runtimeEvidence.expectedCaptureCount,
}, null, 2));
