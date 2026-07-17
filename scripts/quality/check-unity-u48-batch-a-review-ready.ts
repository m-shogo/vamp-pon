import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));
const hash = (path: string) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 Batch A review-ready check failed: ${message}`); };
const groups = ['player-yui', 'enemy-onbu', 'stage1-background', 'exp-pickup', 'healing-pickup', 'common-projectile', 'hit-effect', 'enemy-death-effect', 'movement-trail'];
const contracts = json('docs/design-targets/generated/unity-u48/batch-a/generation-contracts.json');
const golden = json('docs/design-targets/generated/unity-u48/batch-a/golden-references.json');
const qa = json('docs/design-targets/generated/unity-u48/batch-a/automatic-qa.json');
const manifest = json('docs/design-targets/generated/unity-u48/batch-a/capture-manifest.json');
const recommendations = json('docs/design-targets/generated/unity-u48/batch-a/ai-recommendations.json');
const approval = json('docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json');
const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');
const verification = json('docs/design-targets/generated/unity-u48/batch-a/verification-summary.json');

check(golden.assetGroupCount === 9 && new Set(golden.entries.map((value: { assetGroup: string }) => value.assetGroup)).size === 9, 'nine Golden Reference contracts');
for (const value of golden.entries) {
  check(groups.includes(value.assetGroup) && ['complete', 'composite', 'missing'].includes(value.goldenReferenceStatus), `${value.assetGroup} Golden status`);
  check(value.references.length > 0 && value.references.every((reference: { path: string; sha256: string }) => existsSync(resolve(root, reference.path)) && hash(reference.path) === reference.sha256), `${value.assetGroup} Golden hashes`);
  check(value.approvedForRuntime === false && value.humanApprovedGoldenReference === false, `${value.assetGroup} Golden approval boundary`);
}
check(contracts.contracts.length === 36, '36 generation contracts');
check(new Set(contracts.contracts.map((value: { candidateId: string }) => value.candidateId)).size === 36, 'candidate IDs unique');
check(new Set(contracts.contracts.map((value: { outputSha256: string }) => value.outputSha256)).size === 36, 'candidate content hashes unique');
for (const group of groups) check(contracts.contracts.filter((value: { assetGroup: string }) => value.assetGroup === group).length === 4, `${group} has four candidates`);
for (const value of contracts.contracts) {
  check(existsSync(resolve(root, value.outputPath)) && existsSync(resolve(root, `${value.outputPath}.meta`)), `${value.candidateId} source and meta`);
  check(hash(value.outputPath) === value.outputSha256 && ['complete', 'reconstructed-partial'].includes(value.lineageStatus), `${value.candidateId} lineage and hash`);
  check(value.humanReviewStatus === 'pending' && value.approvedAsFinal === false && value.runtimeApproved === false, `${value.candidateId} remains unapproved`);
}
check(qa.candidateCount === 36 && qa.summary.PASS === 36 && qa.summary.WARNING === 0 && qa.summary.FAIL === 0, 'automatic QA 36 PASS');
check(qa.duplicateContentHashCount === 0 && qa.duplicateGuidCount === 0, 'no duplicate content or GUID');
check(manifest.assetGroupCount === 9 && manifest.candidateCount === 36 && manifest.entryCount === 280, 'capture manifest scope');
check(manifest.viewportCounts.standard === 208 && manifest.viewportCounts.compact === 36 && manifest.viewportCounts.large === 36 && manifest.highDensityCaptureCount === 28, 'capture scenario counts');
check(manifest.duplicateScreenshotHashCount === 0 && manifest.standardFileResizeReuseCount === 0 && manifest.privateDeviceIdentifierRecorded === false, 'capture uniqueness and privacy');
execFileSync('git', ['merge-base', '--is-ancestor', manifest.sourceHead, 'HEAD'], { cwd: root });
const captureIds = new Set<string>();
for (const value of manifest.entries) {
  const id = `${value.candidateId}:${value.viewport}:${value.captureKind}`;
  check(!captureIds.has(id), `duplicate capture identity ${id}`); captureIds.add(id);
  check(groups.includes(value.assetGroup), `${id} group`);
  check(existsSync(resolve(root, value.screenshotPath)) && statSync(resolve(root, value.screenshotPath)).size > 0 && hash(value.screenshotPath) === value.screenshotSha256, `${id} screenshot`);
  check(existsSync(resolve(root, value.runtimeResultPath)), `${id} runtime result`);
  const runtime = json(value.runtimeResultPath);
  check(runtime.assetGroup === value.assetGroup && runtime.candidateId === value.candidateId && runtime.viewport === value.viewport && runtime.captureKind === value.captureKind, `${id} runtime metadata`);
  check(value.liveRender === true && value.standardFileResizeReuse === false && value.verificationPresentationOnly === true, `${id} live semantics`);
  check(value.previewCleanupPassed === true && value.unhandledExceptionCount === 0 && value.assertionFailureCount === 0, `${id} clean runtime`);
  check(hash(value.sourceAssetPath) === value.sourceAssetSha256, `${id} source hash`);
  const expected = value.viewport === 'compact' ? [360, 800] : value.viewport === 'large' ? [430, 932] : [390, 844];
  check(value.width === expected[0] && value.height === expected[1], `${id} viewport dimensions`);
}
for (const contract of contracts.contracts) {
  const entries = manifest.entries.filter((value: { candidateId: string }) => value.candidateId === contract.candidateId);
  check(entries.some((value: { viewport: string }) => value.viewport === 'standard') && entries.some((value: { viewport: string }) => value.viewport === 'compact') && entries.some((value: { viewport: string }) => value.viewport === 'large'), `${contract.candidateId} three viewports`);
  if (!['player-yui', 'enemy-onbu'].includes(contract.assetGroup)) check(entries.some((value: { captureKind: string }) => value.captureKind === 'high-density'), `${contract.candidateId} density capture`);
}
check(recommendations.entries.length === 9 && recommendations.recommendationIsApproval === false && recommendations.humanReviewStatus === 'pending', 'nine non-approving AI recommendations');
for (const value of recommendations.entries) {
  check(groups.includes(value.assetGroup) && value.rankedCandidateIds.length === 4 && new Set(value.rankedCandidateIds).size === 4, `${value.assetGroup} rank completeness`);
  check(value.recommendedCandidateId === value.rankedCandidateIds[0], `${value.assetGroup} recommendation`);
  check(value.humanApprovedCandidateId === null && value.approvedAsFinal === false && value.runtimeApproved === false, `${value.assetGroup} human boundary`);
  check(existsSync(resolve(root, value.contactSheetPath)) && hash(value.contactSheetPath) === value.contactSheetSha256, `${value.assetGroup} contact sheet`);
}
const approvalKey = (group: string) => group === 'exp-pickup' ? 'pickup-exp' : group === 'healing-pickup' ? 'pickup-healing' : group;
for (const group of groups) {
  const value = approval.assetGroups.find((entry: { assetKey: string }) => entry.assetKey === approvalKey(group));
  check(value.candidates.length === 4 && value.recommendedCandidateId && value.candidateGenerationBlocked === false, `${group} approval records`);
  check(value.humanApprovedCandidateId === null && value.approvalStatus === 'pending-human-review', `${group} approval pending`);
  check(value.candidates.every((candidate: { approvedAsFinal: boolean; runtimeApproved: boolean; humanReviewStatus: string }) => !candidate.approvedAsFinal && !candidate.runtimeApproved && candidate.humanReviewStatus === 'pending'), `${group} candidate boundary`);
}
check(typeof approval.productionAssetApprovalPackReady === 'boolean' && approval.approvedAsFinalCount === 0 && approval.runtimeApprovedCount === 0 && approval.humanApprovedCount === 0, 'approval counts remain blocked');
check(readiness.batchAStage1GameplayCoreApprovalReady === true, 'limited Batch A readiness');
check(readiness.productionAssetApprovalPackReady === approval.productionAssetApprovalPackReady, 'approval pack readiness agrees');
for (const key of ['approvedProductionAssetSetAvailable', 'runtimeVisualReady', 'simulatorReady', 'physicalDeviceReady', 'audioReady', 'hapticReady', 'performanceReady', 'rcReady', 'productionApproved']) check(readiness[key] === false, `${key} remains false`);
check(['IN_PROGRESS_BLOCKED', 'AWAITING_HUMAN_ASSET_APPROVAL'].includes(readiness.status) && readiness.completionBlocked === true, 'U48 remains blocked');
check(verification.sourceHead === manifest.sourceHead && verification.results.candidateSpecificLiveCapture === 'PASS_280', 'verification summary source and captures');
check(verification.results.unhandledExceptionCount === 0 && verification.results.assertionFailureCount === 0 && verification.results.staleEvidenceCount === 0, 'verification summary runtime cleanliness');
check(verification.approvalBoundary.batchAStage1GameplayCoreApprovalReady === true && verification.approvalBoundary.productionAssetApprovalPackReady === false && verification.approvalBoundary.simulatorReady === false && verification.approvalBoundary.u48Status === 'IN_PROGRESS_BLOCKED', 'verification summary readiness boundary');
const productionDiff = execFileSync('git', ['diff', manifest.sourceHead, '--', 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs'], { cwd: root, encoding: 'utf8' });
check(productionDiff.length === 0 && manifest.productionProviderChanged === false && approval.productionProviderModified === false, 'production provider unchanged');
console.log('U48 Batch A review-ready check passed: 9 groups, 36 unique candidates, 280 candidate-specific live captures, 9 contact sheets, AI recommendations only, human/production approval still blocked.');
