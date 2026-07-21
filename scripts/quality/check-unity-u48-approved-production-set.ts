import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const json = (path: string) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const sha = (path: string) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const text = (path: string) => readFileSync(resolve(root, path), 'utf8');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 approved production set check failed: ${message}`); };
const approved = json('docs/design-targets/generated/unity-u48/approved-production-set.json');
const decision = json('docs/design-targets/generated/unity-u48/human-selection-decision.json');
const audit = json('docs/design-targets/generated/unity-u48/production-promotion-audit.json');
check(approved.schemaVersion === 1 && approved.assetGroupCount === 46 && approved.selectedCandidateCount === 46 && approved.entries.length === 46, '46 approved entries');
check(approved.gameplayGroupCount === 16 && approved.uiGroupCount === 30, '16 gameplay / 30 UI');
check(new Set(approved.entries.map((value: any) => value.assetGroup)).size === 46 && new Set(approved.entries.map((value: any) => value.productionPath)).size === 46, 'unique group/destination');
check(new Set(approved.entries.map((value: any) => value.productionGuid)).size === 46, 'unique production GUIDs');
for (const entry of approved.entries) {
  const selection = decision.selections.find((value: any) => value.assetGroup === entry.assetGroup);
  check(selection?.selectedCandidateId === entry.candidateId && selection.sourceSha256 === entry.candidateSourceSha256, `${entry.assetGroup} selected source identity`);
  check(!entry.productionPath.includes('/Candidates/') && !/[a-d]-(runtime|readability|paper|production|silhouette|lantern)/.test(entry.productionPath), `${entry.assetGroup} stable production path`);
  check(existsSync(resolve(root, entry.candidateSourcePath)) && existsSync(resolve(root, entry.productionPath)), `${entry.assetGroup} source/destination`);
  check(sha(entry.candidateSourcePath) === entry.candidateSourceSha256 && sha(entry.productionPath) === entry.productionSha256 && entry.productionSha256 === entry.candidateSourceSha256, `${entry.assetGroup} binary identity`);
  const sourceMeta = text(entry.candidateSourcePath + '.meta').replace(/^guid: .*$/m, 'guid: <normalized>');
  const productionMeta = text(entry.productionPath + '.meta').replace(/^guid: .*$/m, 'guid: <normalized>');
  check(sourceMeta === productionMeta && entry.productionGuid !== entry.candidateGuid && text(entry.productionPath + '.meta').includes(`guid: ${entry.productionGuid}`), `${entry.assetGroup} importer/GUID`);
  check(entry.humanApproved === true && entry.approvedAsFinal === true && typeof entry.runtimeApproved === 'boolean' && typeof entry.productionConnected === 'boolean', `${entry.assetGroup} promotion boundary`);
  check(entry.importContract && entry.runtimeProviderKey === entry.assetGroup, `${entry.assetGroup} import/provider contract`);
}
check(audit.candidateSourcesImmutable === true && audit.candidateGuidReused === false && audit.productionPathDependsOnCandidateId === false, 'promotion strategy boundary');
check([0,46].includes(approved.runtimeApprovedCount) && [0,46].includes(approved.productionConnectedCount), 'all-or-none runtime/connection counts');
console.log(`U48 approved production set check passed: 46 stable copies, source/destination SHA match, 46 unique production GUIDs, connected=${approved.productionConnectedCount}, runtimeApproved=${approved.runtimeApprovedCount}.`);
