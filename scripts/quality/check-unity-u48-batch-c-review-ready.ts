import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { normalizeU47SimulatorEvidenceSource } from '../unity/u47-simulator-evidence-sources.ts';

const root = resolve(import.meta.dirname, '../..');
const evidence = 'docs/design-targets/generated/unity-u48/batch-c';
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));
const hash = (path: string) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 Batch C review-ready check failed: ${message}`); };

const matrix = json(`${evidence}/capture-matrix.json`); const audit = json(`${evidence}/capture-readiness-audit.json`);
const contracts = json(`${evidence}/generation-contracts.json`); const golden = json(`${evidence}/golden-references.json`);
const qa = json(`${evidence}/automatic-qa.json`); const build = json(`${evidence}/candidate-build-manifest.json`);
const manifest = json(`${evidence}/capture-manifest.json`); const recommendations = json(`${evidence}/ai-recommendations.json`);
const verification = json(`${evidence}/verification-summary.json`); const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');
const groups = matrix.groups.map((value: { assetGroup: string }) => value.assetGroup);
const finalized = readiness.u48Completed === true;
const goldenReferenceValid = (reference: { path: string; sha256: string }) => existsSync(resolve(root, reference.path)) && (hash(reference.path) === reference.sha256 || (finalized && (reference.path === 'docs/181-current-production-canon.md' || reference.path.startsWith('docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/'))));

check(matrix.schemaVersion === 1 && matrix.groups.length === 30 && new Set(groups).size === 30, '30 capture-matrix groups');
check(audit.schemaVersion === 3 && audit.captureReadiness === 'READY' && audit.blockedRequiredStates.length === 0, 'schema v3 five-screen readiness');
check(Object.keys(audit.screenReadiness).length === 5 && Object.values(audit.screenReadiness).every((value: any) => value.status === 'READY' && value.captureReadiness === 'READY'), 'all five screens READY');
check(contracts.assetGroupCount === 30 && contracts.candidateCount === 120 && contracts.contracts.length === 120 && build.outputCount === 120, '30 groups and 120 generation outputs');
check(golden.entries.length === 30 && new Set(golden.entries.map((value: { assetGroup: string }) => value.assetGroup)).size === 30, '30 Golden References');
for (const value of golden.entries) {
  check(groups.includes(value.assetGroup) && value.goldenReferenceStatus === 'composite', `${value.assetGroup} composite Golden Reference`);
  check(value.references.length > 0 && value.references.every(goldenReferenceValid), `${value.assetGroup} Golden hashes`);
  check(value.humanApprovedGoldenReference === false && value.approvedForRuntime === false, `${value.assetGroup} Golden approval boundary`);
}
check(new Set(contracts.contracts.map((value: { candidateId: string }) => value.candidateId)).size === 120, 'unique candidate IDs');
check(new Set(contracts.contracts.map((value: { outputSha256: string }) => value.outputSha256)).size === 120, 'unique candidate content hashes');
const guids = new Set<string>();
for (const group of groups) check(contracts.contracts.filter((value: { assetGroup: string }) => value.assetGroup === group).length === 4, `${group} has four equivalent candidates`);
for (const value of contracts.contracts) {
  check(existsSync(resolve(root, value.outputPath)) && existsSync(resolve(root, `${value.outputPath}.meta`)), `${value.candidateId} source/meta`);
  check(hash(value.outputPath) === value.outputSha256 && ['complete', 'reconstructed-partial'].includes(value.lineageStatus), `${value.candidateId} hash/lineage`);
  check(existsSync(resolve(root, value.promptPath)) && existsSync(resolve(root, value.recipePath)), `${value.candidateId} prompt/recipe`);
  const guid = read(`${value.outputPath}.meta`).match(/^guid: (.+)$/m)?.[1]; check(guid && !guids.has(guid), `${value.candidateId} unique GUID`); guids.add(guid!);
  check(value.approvedAsFinal === false && value.runtimeApproved === false && value.humanReviewStatus === 'pending' && value.humanApprovedCandidateId === null && value.approvalStatus === 'pending-human-review', `${value.candidateId} approval boundary`);
}
check(qa.entries.length === 120 && qa.summary.PASS === 120 && qa.summary.WARNING === 0 && qa.summary.FAIL === 0 && qa.duplicateContentHashCount === 0 && qa.duplicateGuidCount === 0, 'automatic QA clean');
for (const value of qa.entries) check(value.qa.nineSlice.passed && value.qa.text.passed && value.qa.layout.passed && value.qa.layout.safeArea && value.qa.interaction.passed, `${value.candidateId} automatic 9-slice/text/layout/tap QA`);

check(manifest.schemaVersion === 1 && manifest.assetGroupCount === 30 && manifest.candidateCount === 120 && manifest.completeCandidateCount === 120, 'capture manifest candidates complete');
check(manifest.expectedCaptureCount === 564 && manifest.actualCaptureCount === 564 && manifest.minimumViewportCaptureCount === 360, '564 live captures and minimum viewport coverage');
check(manifest.viewportCounts.compact === 120 && manifest.viewportCounts.standard === 324 && manifest.viewportCounts.large === 120 && manifest.requiredStateEvidenceCount === 324, 'viewport and required-state counts');
for (const key of ['duplicateScreenshotHashCount', 'duplicateEntryCount', 'staleCount', 'standardFileResizeReuseCount', 'uiContractChangedCount', 'textSafeAreaFailureCount', 'nineSliceFailureCount', 'tapTargetFailureCount', 'safeAreaFailureCount', 'cleanupFailureCount', 'unhandledExceptionCount', 'assertionFailureCount']) check(manifest[key] === 0, `${key} is zero`);
check(manifest.productionProviderChanged === false && manifest.previewBuildOnly === true, 'preview-only production-provider boundary');
check(manifest.candidateRuns.length === 120 && manifest.candidateRuns.every((value: { captureCompleted: boolean; cleanupCompleted: boolean; runtimeContractUnchanged: boolean; unhandledExceptionCount: number; assertionFailureCount: number }) => value.captureCompleted && value.cleanupCompleted && value.runtimeContractUnchanged && value.unhandledExceptionCount === 0 && value.assertionFailureCount === 0), '120 clean completion sentinels');
for (const entry of manifest.entries) {
  check(hash(entry.screenshotPath) === entry.screenshotSha256 && hash(entry.componentCropPath) === entry.componentCropSha256 && hash(entry.runtimeResultPath) === entry.runtimeResultSha256 && hash(entry.sourceAssetPath) === entry.sourceAssetSha256, `${entry.candidateId}/${entry.viewport}/${entry.uiState} hashes`);
  check(entry.evidenceType === 'candidate-specific-live-runtime' && entry.liveRuntime && entry.liveRender && entry.layoutFixture === false, `${entry.candidateId}/${entry.uiState} production-live evidence`);
  check(entry.uiContractUnchanged && entry.textSafeAreaPassed && entry.nineSlicePassed && entry.tapTargetPassed && entry.safeAreaPassed && !entry.standardFileResizeReuse && entry.previewCleanupPassed && !entry.stale, `${entry.candidateId}/${entry.uiState} live QA`);
  check(entry.unhandledExceptionCount === 0 && entry.assertionFailureCount === 0 && entry.width >= 360, `${entry.candidateId}/${entry.uiState} runtime cleanliness/viewport`);
}
for (const group of matrix.groups) for (const candidateId of group.candidateIds) {
  const entries = manifest.entries.filter((value: { candidateId: string }) => value.candidateId === candidateId);
  check(['compact', 'standard', 'large'].every(viewport => entries.some((value: { viewport: string }) => value.viewport === viewport)), `${candidateId} three viewports`);
  check(group.requiredStandardStates.every((state: string) => entries.some((value: { viewport: string; uiState: string }) => value.viewport === 'standard' && value.uiState === state)), `${candidateId} required states`);
}

check(recommendations.recommendationIsApproval === false && recommendations.humanReviewStatus === 'pending' && recommendations.approvedAsFinal === false && recommendations.runtimeApproved === false && recommendations.humanApprovedCandidateId === null, 'AI recommendation boundary');
check(recommendations.entries.length === 30 && recommendations.screenSystems.length === 5, '30 component and five system recommendations');
for (const value of recommendations.entries) {
  check(groups.includes(value.assetGroup) && value.rankedCandidateIds.length === 4 && new Set(value.rankedCandidateIds).size === 4 && value.recommendedCandidateId === value.rankedCandidateIds[0], `${value.assetGroup} ranking`);
  check(value.recommendationIsApproval === false && !value.approvedAsFinal && !value.runtimeApproved && value.humanReviewStatus === 'pending' && value.humanApprovedCandidateId === null && value.approvalStatus === 'pending-human-review', `${value.assetGroup} human boundary`);
  check(existsSync(resolve(root, value.contactSheetPath)) && hash(value.contactSheetPath) === value.contactSheetSha256, `${value.assetGroup} component sheet`);
}
for (const value of recommendations.screenSystems) check(value.rankedSystemLetters.length === 4 && new Set(value.rankedSystemLetters).size === 4 && value.recommendedSystemLetter === value.rankedSystemLetters[0] && existsSync(resolve(root, value.path)) && hash(value.path) === value.sha256 && value.humanReviewStatus === 'pending', `${value.screen} system sheet/ranking`);
check(verification.sourceHead === manifest.sourceHead && verification.results.candidateSpecificLiveCapture === 'PASS_564' && verification.results.liveQa.PASS === 564 && verification.results.liveQa.WARNING === 0 && verification.results.liveQa.FAIL === 0, 'verification summary');
check(readiness.batchAStage1GameplayCoreApprovalReady === true && readiness.batchBGroundAreaKokuyouApprovalReady === true && readiness.batchCUiComponentsApprovalReady === true, 'Batch A/B/C review readiness');
check(typeof readiness.productionAssetApprovalPackReady === 'boolean', 'approval pack readiness is explicit');
for (const key of ['approvedProductionAssetSetAvailable', 'productionVisualAssetProviderConnected', 'runtimeVisualReady', 'simulatorReady']) check(readiness[key] === finalized, `${key} matches phase state`);
for (const key of ['physicalDeviceReady', 'audioReady', 'hapticReady', 'performanceReady', 'rcReady', 'productionApproved']) check(readiness[key] === false, `${key} remains false`);
check(finalized ? readiness.status === 'U48_COMPLETED_PRODUCTION_VISUAL_RUNTIME_READY' && readiness.completionBlocked === false : ['IN_PROGRESS_BLOCKED', 'AWAITING_HUMAN_ASSET_APPROVAL'].includes(readiness.status) && readiness.completionBlocked === true, 'U48 readiness state');

const protectedPaths = ['unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs', 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/GameplayServices.cs', 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', 'docs/design-targets/generated/unity-u48/batch-a', 'docs/design-targets/generated/unity-u48/batch-b'];
const phaseProtectedPaths = finalized ? protectedPaths.filter(path => path !== 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs' && path !== 'docs/design-targets/generated/unity-u48/batch-a') : protectedPaths;
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
const strictPhaseProtectedPaths = phaseProtectedPaths.filter(path => path !== coordinatorPath);
check(!execFileSync('git', ['diff', manifest.sourceHead, '--', ...strictPhaseProtectedPaths], { cwd: root, encoding: 'utf8' }), 'phase-protected U47 gameplay and Batch inputs unchanged');
check(normalizeU47SimulatorEvidenceSource(coordinatorPath, readFileSync(resolve(root, coordinatorPath))).equals(execFileSync('git', ['show', `${manifest.sourceHead}:${coordinatorPath}`], { cwd: root })), 'Stage1 gameplay unchanged except exact U49 feedback hooks');
for (const script of ['unity:u47-gameplay-data-runtime:check', 'unity:u47-capture-catalog:check', 'unity:u47-simulator-manifest:check', 'unity:u48-batch-a-review-ready:check', 'unity:u48-batch-b-review-ready:check', 'unity:u48-stage-select-runtime:check', 'unity:u48-replacement-interaction:check']) execFileSync('pnpm', [script], { cwd: root, stdio: 'ignore' });
console.log(`U48 Batch C review-ready check passed: 30 groups, 120 unique candidates, 564 clean live captures, 30 component sheets and 5 system sheets; finalized=${finalized}.`);
