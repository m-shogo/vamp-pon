import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const json = (path: string) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const sha = (path: string) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 human selection check failed: ${message}`); };
const decision = json('docs/design-targets/generated/unity-u48/human-selection-decision.json');
const summary = json('docs/design-targets/generated/unity-u48/human-approval-summary.json');
const index = json('docs/design-targets/generated/unity-u48/human-approval-index.json');
const manifest = json('docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json');
const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');

check(decision.schemaVersion === 1 && decision.decisionText === 'AI推奨46件をすべて人間承認として採用する。', 'decision text');
check(decision.decisionSource === 'user-provided-human-decision' && decision.decisionScope === 'U48-production-asset-selection' && decision.supersedableBeforeReleaseCandidate === true, 'decision provenance/scope');
check(decision.selectionCount === 46 && decision.recommendationMatchCount === 46 && decision.selections.length === 46, '46 selections/recommendations');
for (const key of ['missingSelectionCount','duplicateSelectionCount','unknownAssetGroupCount','unknownCandidateLetterCount']) check(decision[key] === 0, `${key} zero`);
check(new Set(decision.selections.map((value: any) => value.assetGroup)).size === 46, 'unique groups');
check(new Set(decision.selections.map((value: any) => value.selectedCandidateId)).size === 46, 'unique selected candidate IDs');
for (const selection of decision.selections) {
  check(['A','B','C','D'].includes(selection.selectedLetter) && selection.recommendationMatched === true && selection.selectedCandidateId === selection.recommendedCandidateId, `${selection.assetGroup} recommendation mapping`);
  check(existsSync(resolve(root, selection.sourcePath)) && sha(selection.sourcePath) === selection.sourceSha256, `${selection.assetGroup} source SHA`);
  check(selection.automaticQaStatus === 'PASS' && selection.liveQaStatus === 'PASS' && selection.stale === false, `${selection.assetGroup} QA/live/stale`);
  const group = manifest.assetGroups.find((value: any) => value.assetKey === selection.assetGroup);
  const indexGroup = index.groups.find((value: any) => value.assetGroup === selection.assetGroup);
  check(group?.humanApprovedCandidateId === selection.selectedCandidateId && group.approvalStatus === 'human-approved', `${selection.assetGroup} group approval`);
  check(indexGroup?.approvedCandidateId === selection.selectedCandidateId, `${selection.assetGroup} index approval`);
  for (const candidate of group.candidates) {
    const selected = candidate.candidateId === selection.selectedCandidateId;
    check(candidate.approvedAsFinal === selected && (!candidate.runtimeApproved || selected), `${candidate.candidateId} final/runtime boundary`);
    check(candidate.humanReviewStatus === (selected ? 'approved' : 'not-selected'), `${candidate.candidateId} review status`);
  }
}
check(manifest.humanApprovedCount === 46 && manifest.approvedAsFinalCount === 46 && [0,46].includes(manifest.runtimeApprovedCount), 'manifest approval counts');
check(summary.humanApprovedCandidateCount === 46 && summary.nonSelectedApprovedAsFinalCount === 0 && [0,46].includes(summary.runtimeApprovedCount), 'summary boundary');
check(typeof readiness.approvedProductionAssetSetAvailable === 'boolean' && typeof readiness.productionVisualAssetProviderConnected === 'boolean', 'production connection state explicit');
console.log(`U48 human selection check passed: 46/46 AI recommendations adopted by user; approvedAsFinal=46, runtimeApproved=${manifest.runtimeApprovedCount}.`);
