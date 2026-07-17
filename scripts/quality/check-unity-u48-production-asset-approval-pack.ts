import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path));
const json = (path: string) => JSON.parse(read(path).toString());
const sha256 = (path: string) => createHash('sha256').update(read(path)).digest('hex');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 approval pack check failed: ${message}`); };

const batchAKeys = ['player-yui', 'enemy-onbu', 'stage1-background', 'pickup-exp', 'pickup-healing', 'common-projectile', 'hit-effect', 'enemy-death-effect', 'movement-trail'];
const batchBKeys = ['ground-area-black-ink-bottle', 'ground-area-streetlamp-ring', 'ground-area-dawn-ink-lamp', 'kokuyou-charging', 'kokuyou-ready', 'kokuyou-active', 'kokuyou-recovery'];
const batchCKeys = json('docs/design-targets/generated/unity-u48/batch-c/capture-matrix.json').groups.map((value: { assetGroup: string }) => value.assetGroup);
const expectedKeys = [...batchAKeys, ...batchBKeys, ...batchCKeys];
const manifest = json('docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json');
const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');
const humanIndex = json('docs/design-targets/generated/unity-u48/human-approval-index.json');
const guide = read('docs/unity-u48-production-asset-human-approval-guide-2026-07-17.md').toString();
const runtimeManifest = json('unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/runtime-dot-manifest.json');
const provider = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs').toString();
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const sourceHeadIsAuditedAncestor = (() => {
  if (!/^[0-9a-f]{40}$/.test(manifest.sourceHead)) return false;
  try { execFileSync('git', ['merge-base', '--is-ancestor', manifest.sourceHead, head], { cwd: root, stdio: 'ignore' }); return true; } catch { return false; }
})();

check(manifest.schemaVersion === 1 && manifest.assetGroups.length === 46, 'schema and 46 review-ready groups');
check(JSON.stringify(manifest.assetGroups.map((group: { assetKey: string }) => group.assetKey)) === JSON.stringify(expectedKeys), 'exact ordered Batch A/B/C groups');
check(sourceHeadIsAuditedAncestor, 'sourceHead must be an audited ancestor of current HEAD');
check(manifest.packStatus === 'AWAITING_HUMAN_ASSET_APPROVAL' && manifest.productionAssetApprovalPackReady === true && manifest.candidateSpecificLivePreviewReady === true, 'Full Approval Pack awaits human approval');
check(manifest.approvedAsFinalCount === 0 && manifest.runtimeApprovedCount === 0 && manifest.humanApprovedCount === 0, 'approval counts remain zero');
check(manifest.productionProviderModified === false && manifest.staleEvidenceCount === 0, 'provider unchanged and evidence current');
check(manifest.blockers.some((value: { reason: string }) => value.reason === 'HUMAN_ASSET_APPROVAL_REQUIRED'), 'human approval blocker');

const ids = new Set<string>(); let candidateCount = 0;
for (const group of manifest.assetGroups) {
  check(group.candidates.length === 4 && group.candidateGenerationBlocked === false && group.candidateGenerationBlockReason === null, `${group.assetKey} four review-ready candidates`);
  check(existsSync(resolve(root, group.contactSheetPath)) && sha256(group.contactSheetPath) === group.contactSheetSha256, `${group.assetKey} contact sheet`);
  check(existsSync(resolve(root, group.runtimeBaselinePreview)) && sha256(group.runtimeBaselinePreview) === group.runtimeBaselineSha256 && group.runtimeBaselineIsCandidateSpecific === true, `${group.assetKey} candidate-specific baseline`);
  check(group.recommendedCandidateId && group.candidates.some((candidate: { candidateId: string }) => candidate.candidateId === group.recommendedCandidateId), `${group.assetKey} recommendation belongs to group`);
  check(group.humanApprovedCandidateId === null && group.approvalStatus === 'pending-human-review', `${group.assetKey} human approval pending`);
  for (const candidate of group.candidates) {
    candidateCount += 1; check(!ids.has(candidate.candidateId), `duplicate candidate ID ${candidate.candidateId}`); ids.add(candidate.candidateId);
    check(existsSync(resolve(root, candidate.sourcePath)) && sha256(candidate.sourcePath) === candidate.sourceSha256, `${candidate.candidateId} source/hash`);
    check(candidate.generationLineage && ['complete', 'reconstructed-partial', 'partial'].includes(candidate.generationLineage.status), `${candidate.candidateId} lineage recorded`);
    check(['PASS', 'WARNING'].includes(candidate.automaticQa?.status), `${candidate.candidateId} QA status`);
    check(['standard', 'compact', 'large'].every(viewport => existsSync(resolve(root, candidate.gameplayPreview[viewport]))), `${candidate.candidateId} candidate-specific viewports`);
    check(candidate.gameplaySizeReviewReady === true && Number.isInteger(candidate.recommendedRank) && candidate.recommendedRank >= 1 && candidate.recommendedRank <= 4, `${candidate.candidateId} review/ranking`);
    check(candidate.approvedAsFinal === false && candidate.runtimeApproved === false && candidate.humanReviewStatus === 'pending', `${candidate.candidateId} approval boundary`);
  }
}
check(candidateCount === 184 && manifest.summary.assetGroupCount === 46 && manifest.summary.uniqueCandidateRecordCount === 184, '46 groups / 184 candidates summary');
check(manifest.summary.groupsBelowFourCandidates === 0 && manifest.summary.blockedGroupCount === 0, 'no stale candidate shortages or mixed-kit blockers');

check(humanIndex.schemaVersion === 1 && humanIndex.groupCount === 46 && humanIndex.groups.length === 46 && humanIndex.humanReviewStatus === 'pending' && humanIndex.recommendationIsApproval === false, 'human approval index boundary/count');
for (const value of humanIndex.groups) {
  const group = manifest.assetGroups.find((item: { assetKey: string }) => item.assetKey === value.assetGroup);
  check(group && value.candidateOptions.length === 4 && JSON.stringify(value.candidateOptions.map((item: { letter: string }) => item.letter)) === '["A","B","C","D"]', `${value.assetGroup} human options`);
  check(value.recommendedCandidateId === group.recommendedCandidateId && value.candidateOptions.some((item: { letter: string; candidateId: string }) => item.letter === value.recommendedLetter && item.candidateId === value.recommendedCandidateId), `${value.assetGroup} human recommendation mapping`);
  check(value.contactSheetPath === group.contactSheetPath && value.approvedCandidateId === null && typeof value.keyRisk === 'string' && value.keyRisk.length > 0, `${value.assetGroup} human pending/risk`);
  check(guide.includes(`${value.assetGroup}: ${value.recommendedLetter}`) && value.candidateOptions.every((item: { candidateId: string }) => guide.includes(item.candidateId)), `${value.assetGroup} guide response and full IDs`);
}

check(readiness.batchAStage1GameplayCoreApprovalReady === true && readiness.batchBGroundAreaKokuyouApprovalReady === true && readiness.batchCUiComponentsApprovalReady === true && readiness.productionAssetApprovalPackReady === true, 'Batch A/B/C and Full Approval Pack ready for review');
for (const key of ['approvedProductionAssetSetAvailable', 'productionVisualAssetProviderConnected', 'runtimeVisualReady', 'simulatorReady', 'physicalDeviceReady', 'audioReady', 'hapticReady', 'performanceReady', 'rcReady', 'productionApproved']) check(readiness[key] === false, `${key} remains false`);
check(readiness.status === 'AWAITING_HUMAN_ASSET_APPROVAL' && readiness.completionBlocked === true && readiness.blockReason === 'HUMAN_ASSET_APPROVAL_REQUIRED', 'U48 human-approval state');
check(runtimeManifest.approvedAsFinal === false && runtimeManifest.runtimeApproved === false, 'runtime manifest remains candidate');
check(provider.includes('ApprovalLevel => AssetApprovalLevel.Candidate') && provider.includes('IsProductionApproved => false'), 'production provider remains unapproved');
check(!execFileSync('git', ['diff', manifest.sourceHead, '--', 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs'], { cwd: root, encoding: 'utf8' }), 'Production Provider diff zero');
for (const script of ['unity:u48-batch-a-review-ready:check', 'unity:u48-batch-b-review-ready:check', 'unity:u48-batch-c-review-ready:check']) execFileSync('pnpm', [script], { cwd: root, stdio: 'ignore' });
console.log('Unity U48 Full Approval Pack check passed: 46 groups, 184 candidates, Batch A/B/C review-ready, human approval pending, production provider disconnected.');
