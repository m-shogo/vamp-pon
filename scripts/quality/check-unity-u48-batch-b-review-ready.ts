import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));
const hash = (path: string) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 Batch B review-ready check failed: ${message}`); };
const groups = ['ground-area-black-ink-bottle', 'ground-area-streetlamp-ring', 'ground-area-dawn-ink-lamp', 'kokuyou-charging', 'kokuyou-ready', 'kokuyou-active', 'kokuyou-recovery'];
const ground = new Map([
  ['ground-area-black-ink-bottle', { id: 'black_ink_bottle', radius: .52, dps: 8, ticks: 9, duration: 2.3 }],
  ['ground-area-streetlamp-ring', { id: 'streetlamp_ring', radius: .64, dps: 6, ticks: 13, duration: 3.2 }],
  ['ground-area-dawn-ink-lamp', { id: 'dawn_ink_lamp', radius: 1.28, dps: 28, ticks: 25, duration: 6.5 }],
]);
const evidence = 'docs/design-targets/generated/unity-u48/batch-b';
const golden = json(`${evidence}/golden-references.json`); const contracts = json(`${evidence}/generation-contracts.json`); const qa = json(`${evidence}/automatic-qa.json`);
const build = json(`${evidence}/candidate-build-manifest.json`); const manifest = json(`${evidence}/capture-manifest.json`); const recommendations = json(`${evidence}/ai-recommendations.json`);
const sequences = json(`${evidence}/phase-sequence-manifest.json`); const verification = json(`${evidence}/verification-summary.json`); const approval = json('docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json'); const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');

check(golden.entries.length === 7 && new Set(golden.entries.map((value: { assetGroup: string }) => value.assetGroup)).size === 7, 'seven Golden Reference contracts');
for (const value of golden.entries) {
  check(groups.includes(value.assetGroup) && ['complete', 'composite', 'missing'].includes(value.goldenReferenceStatus), `${value.assetGroup} Golden status`);
  check(value.references.length > 0 && value.references.every((reference: { path: string; sha256: string }) => existsSync(resolve(root, reference.path)) && hash(reference.path) === reference.sha256), `${value.assetGroup} Golden hashes`);
  check(value.approvedForRuntime === false && value.humanApprovedGoldenReference === false, `${value.assetGroup} Golden approval boundary`);
}
check(contracts.contracts.length === 28 && build.outputCount === 28, '28 generation contracts and outputs');
check(new Set(contracts.contracts.map((value: { candidateId: string }) => value.candidateId)).size === 28, 'candidate IDs unique');
check(new Set(contracts.contracts.map((value: { outputSha256: string }) => value.outputSha256)).size === 28, 'candidate content hashes unique');
for (const group of groups) check(contracts.contracts.filter((value: { assetGroup: string }) => value.assetGroup === group).length === 4, `${group} has four candidates`);
const guids = new Set<string>();
for (const value of contracts.contracts) {
  check(existsSync(resolve(root, value.outputPath)) && existsSync(resolve(root, `${value.outputPath}.meta`)), `${value.candidateId} source/meta`);
  check(hash(value.outputPath) === value.outputSha256 && ['complete', 'reconstructed-partial'].includes(value.lineageStatus), `${value.candidateId} hash/lineage`);
  const guid = read(`${value.outputPath}.meta`).match(/^guid: (.+)$/m)?.[1]; check(guid && !guids.has(guid), `${value.candidateId} unique GUID`); guids.add(guid!);
  check(existsSync(resolve(root, value.promptPath)) && existsSync(resolve(root, value.recipePath)), `${value.candidateId} prompt/recipe`);
}
check(qa.entries.length === 28 && qa.summary.PASS === 28 && qa.summary.WARNING === 0 && qa.summary.FAIL === 0 && qa.duplicateContentHashCount === 0 && qa.duplicateGuidCount === 0, 'automatic QA clean');

check(manifest.schemaVersion === 2 && manifest.assetGroupCount === 7 && manifest.candidateCount === 28 && manifest.entryCount === 448 && manifest.candidateRunCount === 28, 'capture manifest counts');
check(manifest.viewportCounts.standard === 392 && manifest.viewportCounts.compact === 28 && manifest.viewportCounts.large === 28 && manifest.highDensityCaptureCount === 28, 'live viewport/density counts');
check(manifest.duplicateScreenshotHashCount === 0 && manifest.standardFileResizeReuseCount === 0 && manifest.phaseStateDirectWriteCount === 0 && manifest.actualU47RuntimeRouteCount === 448, 'unique live routes without resize/direct writes');
check(manifest.gameplayContractChangedCount === 0 && manifest.resultTransitionCount === 0 && manifest.revivalTriggerCount === 0 && manifest.cleanStartFailureCount === 0 && manifest.cleanupFailureCount === 0, 'clean runtime contract and session boundaries');
check(manifest.productionProviderChanged === false && manifest.previewBuildOnly === true && manifest.privateDeviceIdentifierRecorded === false, 'preview/production boundary');
for (const run of manifest.candidateRuns) {
  check(run.passed && run.processRestarted && run.verificationReinitializeExecuted && run.startStageCommandExecuted && run.fullHpBeforeCharge && run.productionCapacityRestored, `${run.candidateId} clean start`);
  check(run.finalAppFlowState === 'Playing' && run.finalKokuyouPhase === 'normal' && run.resultTransitionCount === 0 && run.revivalTriggerCount === 0 && run.cleanupCompleted, `${run.candidateId} final sentinel`);
  check(hash(run.cleanStartPath) === run.cleanStartSha256 && hash(run.summaryPath) === run.summarySha256, `${run.candidateId} sentinel hashes`);
}
for (const entry of manifest.entries) {
  check(hash(entry.screenshotPath) === entry.screenshotSha256 && hash(entry.runtimeResultPath) === entry.runtimeResultSha256 && hash(entry.sourceAssetPath) === entry.sourceAssetSha256, `${entry.candidateId}/${entry.captureKind} hashes`);
  check(entry.liveRender && entry.actualU47RuntimeRoute && !entry.phaseStateDirectWriteUsed && !entry.standardFileResizeReuse && entry.gameplayContractUnchanged && entry.previewCleanupPassed, `${entry.candidateId}/${entry.captureKind} route contract`);
  check(entry.unhandledExceptionCount === 0 && entry.assertionFailureCount === 0, `${entry.candidateId}/${entry.captureKind} runtime cleanliness`);
}
for (const [group, expected] of ground) {
  for (const candidate of contracts.contracts.filter((value: { assetGroup: string }) => value.assetGroup === group)) {
    const result = json(manifest.entries.find((value: { candidateId: string; captureKind: string }) => value.candidateId === candidate.candidateId && value.captureKind === 'despawn-after').runtimeResultPath);
    check(result.definitionId === expected.id && result.gameplayValues.radius === expected.radius && result.gameplayValues.damagePerSecond === expected.dps && result.gameplayValues.interval === .25 && result.gameplayValues.finalTickCount === expected.ticks && result.gameplayValues.duration === expected.duration, `${candidate.candidateId} U47 ground contract`);
    check(result.runtimeChecks.duplicateExecutorCount === 0 && result.runtimeChecks.inventoryUnchanged && result.runtimeChecks.pickupCallbackCount === 0 && result.gameplayValues.sortingOrder === 8, `${candidate.candidateId} ground isolation`);
  }
}
for (const candidate of contracts.contracts.filter((value: { assetGroup: string }) => value.assetGroup.startsWith('kokuyou-'))) {
  const active = json(manifest.entries.find((value: { candidateId: string; captureKind: string }) => value.candidateId === candidate.candidateId && value.captureKind === 'active-start').runtimeResultPath);
  const restored = json(manifest.entries.find((value: { candidateId: string; captureKind: string }) => value.candidateId === candidate.candidateId && value.captureKind === 'normal-restored').runtimeResultPath);
  check(JSON.stringify(active.runtimeChecks.damageSequence) === '[25,25,25,25]' && JSON.stringify(active.runtimeChecks.hpSequence) === '[110,85,60,35,10]' && JSON.stringify(active.runtimeChecks.chargeSequence) === '[0,25,50,75,100]', `${candidate.candidateId} sublethal charge`);
  check(JSON.stringify(active.phaseTransitionOrder) === '["Idle","Charging","Ready","Activating","Active"]' && active.runtimeChecks.activationCount === 1 && active.runtimeChecks.duplicateActivationCount === 0, `${candidate.candidateId} manual activation`);
  check(active.gameplayValues.maxGauge === 100 && active.gameplayValues.activeMultiplier === 1.5 && active.gameplayValues.activeDuration === 8 && active.gameplayValues.recoverySlowMultiplier === .75 && active.gameplayValues.recoveryDuration === 2, `${candidate.candidateId} Kokuyou values`);
  check(restored.finalNormalState === true && restored.runtimeState === 'kokuyou-idle' && restored.runtimeChecks.resultTransitionCount === 0 && restored.runtimeChecks.revivalTriggerCount === 0, `${candidate.candidateId} normal restored`);
}
check(recommendations.recommendationIsApproval === false && recommendations.humanReviewStatus === 'pending' && recommendations.entries.length === 7, 'AI recommendation boundary/count');
for (const value of recommendations.entries) {
  check(groups.includes(value.assetGroup) && value.rankedCandidateIds.length === 4 && new Set(value.rankedCandidateIds).size === 4 && value.recommendedCandidateId === value.rankedCandidateIds[0], `${value.assetGroup} ranking`);
  check(!value.approvedAsFinal && !value.runtimeApproved && value.humanReviewStatus === 'pending' && value.humanApprovedCandidateId === null && value.approvalStatus === 'pending-human-review', `${value.assetGroup} human boundary`);
  check(hash(value.contactSheetPath) === value.contactSheetSha256, `${value.assetGroup} contact sheet`);
}
check(sequences.systems.length === 4 && sequences.systems.every((value: { path: string; sha256: string; humanReviewStatus: string }) => hash(value.path) === value.sha256 && value.humanReviewStatus === 'pending'), 'four Kokuyou system sheets');
for (const group of groups) {
  const value = approval.assetGroups.find((item: { assetKey: string }) => item.assetKey === group); check(value && value.candidates.length === 4 && !value.candidateGenerationBlocked && value.approvalStatus === 'pending-human-review' && value.humanApprovedCandidateId === null, `${group} approval record`);
  check(value.candidates.every((candidate: { approvedAsFinal: boolean; runtimeApproved: boolean; humanReviewStatus: string }) => !candidate.approvedAsFinal && !candidate.runtimeApproved && candidate.humanReviewStatus === 'pending'), `${group} candidate approvals blocked`);
}
check(readiness.batchAStage1GameplayCoreApprovalReady === true && readiness.batchBGroundAreaKokuyouApprovalReady === true, 'limited Batch A/B readiness');
check(readiness.productionAssetApprovalPackReady === approval.productionAssetApprovalPackReady, 'approval pack readiness agrees');
for (const key of ['approvedProductionAssetSetAvailable', 'productionVisualAssetProviderConnected', 'runtimeVisualReady', 'simulatorReady', 'physicalDeviceReady', 'audioReady', 'hapticReady', 'performanceReady', 'rcReady', 'productionApproved']) check(readiness[key] === false, `${key} remains false`);
check(['IN_PROGRESS_BLOCKED', 'AWAITING_HUMAN_ASSET_APPROVAL'].includes(readiness.status) && readiness.completionBlocked === true, 'U48 remains blocked');
check(verification.sourceHead === manifest.sourceHead && verification.results.candidateSpecificLiveCapture === 'PASS_448' && verification.results.staleEvidenceCount === 0, 'verification summary');
const productionDiff = execFileSync('git', ['diff', manifest.sourceHead, '--', 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs'], { cwd: root, encoding: 'utf8' });
const u47Diff = execFileSync('git', ['diff', manifest.sourceHead, '--', 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/GameplayServices.cs', 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/State/RunGameplayState.cs'], { cwd: root, encoding: 'utf8' });
const batchADiff = execFileSync('git', ['diff', manifest.sourceHead, '--', 'unity/VampPonUnity/Assets/_Project/Art/Candidates/U48/BatchA', 'docs/design-targets/generated/unity-u48/batch-a'], { cwd: root, encoding: 'utf8' });
check(!productionDiff && !u47Diff && !batchADiff, 'Production Provider, U47 gameplay contract, and Batch A unchanged');
const bridge = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U48BatchBPreviewCaptureBridge.cs');
check(!bridge.includes('dawn_ticket') && !/Kokuyou\.(Phase|Gauge)\s*=/.test(bridge) && !/CurrentHp\s*=/.test(bridge), 'no revival/direct state/HP mutation');
console.log('U48 Batch B review-ready check passed: 7 groups, 28 unique candidates, 448 clean live captures, 7 contact sheets and 4 phase sheets; human/production approval remains blocked.');
