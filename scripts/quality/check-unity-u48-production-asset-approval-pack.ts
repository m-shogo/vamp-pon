import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path));
const json = (path: string) => JSON.parse(read(path).toString());
const sha256 = (path: string) => createHash('sha256').update(read(path)).digest('hex');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 approval pack check failed: ${message}`); };

const expectedKeys = [
  'player-yui', 'enemy-onbu', 'stage1-background', 'pickup-exp', 'pickup-healing',
  'common-projectile', 'hit-effect', 'enemy-death-effect', 'movement-trail',
  'ground-area-black-ink-bottle', 'ground-area-streetlamp-ring', 'ground-area-dawn-ink-lamp',
  'kokuyou-charging', 'kokuyou-ready', 'kokuyou-active', 'kokuyou-recovery',
  'ui-hud-inventory-frame', 'ui-levelup-card', 'ui-replacement-modal', 'ui-result-kit', 'ui-stage-select-kit',
];

const manifest = json('docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json');
const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');
const runtimeManifest = json('unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/runtime-dot-manifest.json');
const provider = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs').toString();
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const sourceHeadIsAuditedAncestor = (() => {
  if (!/^[0-9a-f]{40}$/.test(manifest.sourceHead)) return false;
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', manifest.sourceHead, head], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

check(manifest.schemaVersion === 1 && manifest.assetGroups.length === 21, 'schema and Priority A group count');
check(JSON.stringify(manifest.assetGroups.map((group: { assetKey: string }) => group.assetKey)) === JSON.stringify(expectedKeys), 'exact ordered Priority A groups');
check(sourceHeadIsAuditedAncestor, 'sourceHead must be an audited ancestor of the current commit');
check(manifest.packStatus === 'IN_PROGRESS_BLOCKED' && manifest.productionAssetApprovalPackReady === false, 'pack remains blocked');
check(manifest.candidateSpecificLivePreviewReady === false, 'candidate-specific live preview is not faked');
check(manifest.approvedAsFinalCount === 0 && manifest.runtimeApprovedCount === 0 && manifest.humanApprovedCount === 0, 'approval counts remain zero');
check(manifest.productionProviderModified === false, 'production provider modification remains false');
check(manifest.staleEvidenceCount === 0, 'pack source and evidence hashes are current');

const ids = new Set<string>();
let candidateCount = 0;
let shortageCount = 0;
let blockedGroupCount = 0;
for (const group of manifest.assetGroups) {
  check(existsSync(resolve(root, group.contactSheetPath)), `${group.assetKey} contact sheet`);
  check(sha256(group.contactSheetPath) === group.contactSheetSha256, `${group.assetKey} contact sheet hash`);
  check(existsSync(resolve(root, group.runtimeBaselinePreview)), `${group.assetKey} runtime baseline`);
  check(sha256(group.runtimeBaselinePreview) === group.runtimeBaselineSha256, `${group.assetKey} runtime baseline hash`);
  check(group.runtimeBaselineIsCandidateSpecific === false, `${group.assetKey} baseline is not candidate-specific`);
  check(group.humanApprovedCandidateId === null && group.approvalStatus === 'pending-human-review', `${group.assetKey} human approval pending`);
  if (group.candidates.length < 4) {
    shortageCount += 1;
  }
  if (group.candidateGenerationBlocked) blockedGroupCount += 1;
  if (group.candidateGenerationBlocked) check(typeof group.candidateGenerationBlockReason === 'string', `${group.assetKey} candidate blocker reason`);
  for (const candidate of group.candidates) {
    candidateCount += 1;
    check(!ids.has(candidate.candidateId), `duplicate candidate ID ${candidate.candidateId}`);
    ids.add(candidate.candidateId);
    check(existsSync(resolve(root, candidate.sourcePath)), `${candidate.candidateId} source exists`);
    check(sha256(candidate.sourcePath) === candidate.sourceSha256, `${candidate.candidateId} source hash`);
    check(candidate.generationLineage && typeof candidate.generationLineage.status === 'string', `${candidate.candidateId} lineage recorded`);
    check(['PASS', 'FAIL', 'WARNING'].includes(candidate.automaticQa?.status), `${candidate.candidateId} QA status`);
    check(candidate.gameplayPreview?.scope === 'existing-runtime-baseline-not-candidate-live', `${candidate.candidateId} preview scope honest`);
    check(existsSync(resolve(root, candidate.gameplayPreview.standard)), `${candidate.candidateId} Standard baseline exists`);
    check(candidate.gameplaySizeReviewReady === false, `${candidate.candidateId} gameplay review not promoted`);
    check(candidate.approvedAsFinal === false && candidate.runtimeApproved === false && candidate.humanReviewStatus === 'pending', `${candidate.candidateId} approval flags`);
  }
}

check(candidateCount > 0 && shortageCount === 13 && blockedGroupCount === 16, 'inventory has exact candidate shortages and non-equivalent kit blockers');
check(manifest.summary.assetGroupCount === 21 && manifest.summary.uniqueCandidateRecordCount === candidateCount && manifest.summary.groupsBelowFourCandidates === shortageCount && manifest.summary.blockedGroupCount === blockedGroupCount, 'manifest summary counts');
check(manifest.blockers.some((blocker: { reason: string }) => blocker.reason.includes('candidate-specific live previews')), 'live-preview blocker');
check(manifest.blockers.some((blocker: { reason: string }) => blocker.reason.includes('lineage')), 'lineage blocker');
check(readiness.productionAssetAuditReady === true && readiness.productionAssetApprovalPackReady === false, 'audit ready and pack incomplete are distinct');
check(readiness.status === 'IN_PROGRESS_BLOCKED' && readiness.approvedProductionAssetSetAvailable === false, 'U48 remains blocked without approved set');
check(readiness.runtimeVisualReady === false && readiness.productionApproved === false, 'runtime and product readiness remain false');
check(runtimeManifest.approvedAsFinal === false && runtimeManifest.runtimeApproved === false, 'runtime manifest remains candidate');
check(provider.includes('ApprovalLevel => AssetApprovalLevel.Candidate') && provider.includes('IsProductionApproved => false'), 'production provider remains unapproved');

console.log(`Unity U48 approval pack integrity check passed: 21 groups, ${candidateCount} unique candidate records, ${shortageCount} groups below four candidates and ${blockedGroupCount} blocked groups total; live review, human approval, and production readiness remain blocked.`);
