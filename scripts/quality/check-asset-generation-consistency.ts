import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { assetFactoryPromptByKey, assetFactoryPromptCatalog } from '../../src/game/data/assetFactoryCatalog.ts';
import { assetGenerationContracts } from '../../src/game/data/assetGenerationPolicy.ts';
import { goldenReferenceSets } from '../../src/game/data/goldenReferenceRegistry.ts';

const failures: string[] = [];
const fullContractPath = 'data/asset-factory/generation-contracts.json';
const contractSummaryPath = 'data/asset-factory/generation-contracts.summary.json';

function check(label: string, ok: boolean) {
  if (!ok) failures.push(label);
}

function read(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

const requiredFiles = [
  'src/game/data/assetGenerationPolicy.ts',
  'src/game/data/goldenReferenceRegistry.ts',
  'src/game/data/assetGenerationPolicy.test.ts',
  'scripts/asset-factory/export-generation-contracts.ts',
  'scripts/asset-factory/create-lineage-record.ts',
  'data/asset-factory/generation-lineage.template.json',
  contractSummaryPath,
  'data/asset-factory/golden-reference-registry.json',
  'docs/asset-generation-consistency-system-v1.md',
  'docs/design-targets/generated/asset-generation-consistency/readiness.json',
];
for (const path of requiredFiles) check(`required file exists: ${path}`, existsSync(path));

check('one contract per prompt record', assetGenerationContracts.length === assetFactoryPromptCatalog.length);
check(
  'contract prompt keys are unique',
  new Set(assetGenerationContracts.map((contract) => contract.promptCatalogKey)).size === assetGenerationContracts.length,
);
check(
  'contract ids are unique',
  new Set(assetGenerationContracts.map((contract) => contract.contractId)).size === assetGenerationContracts.length,
);

for (const contract of assetGenerationContracts) {
  check(`${contract.promptCatalogKey}: four candidates required`, contract.generationPolicy.candidateCount === 4);
  check(`${contract.promptCatalogKey}: one-shot final forbidden`, contract.generationPolicy.oneShotFinalForbidden === true);
  check(`${contract.promptCatalogKey}: prompt hash required`, contract.generationPolicy.promptHashRequired === true);
  check(`${contract.promptCatalogKey}: reference hash required`, contract.generationPolicy.referenceHashRequired === true);
  check(`${contract.promptCatalogKey}: generator version required`, contract.generationPolicy.generatorVersionRequired === true);
  check(`${contract.promptCatalogKey}: identity reference blocks final`, contract.referencePolicy.finalApprovalBlockedWithoutIdentityReference === true);
  check(`${contract.promptCatalogKey}: comparison sheet required`, contract.qaPolicy.comparisonSheetRequired === true);
  check(`${contract.promptCatalogKey}: candidate default`, contract.approvalPolicy.defaultState === 'candidate');
  check(`${contract.promptCatalogKey}: final default false`, contract.approvalPolicy.approvedAsFinalDefault === false);
  check(`${contract.promptCatalogKey}: runtime default false`, contract.approvalPolicy.runtimeApprovedDefault === false);
  check(`${contract.promptCatalogKey}: lineage required`, contract.approvalPolicy.finalRequiresLineageManifest === true);
  check(`${contract.promptCatalogKey}: QA required`, contract.approvalPolicy.finalRequiresQaPass === true);
  check(`${contract.promptCatalogKey}: text forbidden`, contract.outputLock.bakedTextForbidden === true);
  check(`${contract.promptCatalogKey}: logo forbidden`, contract.outputLock.bakedLogoForbidden === true);
  check(`${contract.promptCatalogKey}: global reference included`, contract.referencePolicy.requiredReferenceSetIds.includes('global:visual-style-v1'));
  check(`${contract.promptCatalogKey}: output under prototypes`, contract.outputPathHint.startsWith('public/assets/prototypes/'));
}

check('golden reference ids unique', new Set(goldenReferenceSets.map((set) => set.id)).size === goldenReferenceSets.length);
const globalReference = goldenReferenceSets.find((set) => set.id === 'global:visual-style-v1');
check('global visual reference exists', Boolean(globalReference));
check('global visual reference approved for style', globalReference?.status === 'approved-style-reference');

const exportedContracts = assetGenerationContracts.map((contract) => {
  const prompt = assetFactoryPromptByKey.get(contract.promptCatalogKey);
  if (!prompt) return null;
  const promptMaterial = [
    prompt.key,
    prompt.sizeSpec,
    prompt.prompt,
    prompt.negativePrompt,
    ...prompt.reviewChecklist,
  ].join('\n---\n');
  return {
    ...contract,
    promptHashAlgorithm: 'sha256',
    promptHash: createHash('sha256').update(promptMaterial, 'utf8').digest('hex'),
  };
});
check('all contract exports resolve prompts', exportedContracts.every(Boolean));
const validExportedContracts = exportedContracts.filter((contract) => contract !== null);
const expectedCounts = Object.fromEntries(
  [...new Set(assetGenerationContracts.map((contract) => contract.contentType))]
    .sort()
    .map((contentType) => [
      contentType,
      assetGenerationContracts.filter((contract) => contract.contentType === contentType).length,
    ]),
);
const contractSummary = JSON.parse(read(contractSummaryPath) || '{}') as Record<string, any>;
check('contract summary schema v1', contractSummary.schemaVersion === 1);
check('contract summary count matches source', contractSummary.contractCount === assetGenerationContracts.length);
check('contract summary category counts match source', JSON.stringify(contractSummary.contractCountsByContentType) === JSON.stringify(expectedCounts));
check(
  'contract summary policy versions match source',
  JSON.stringify(contractSummary.policyVersions) === JSON.stringify([...new Set(assetGenerationContracts.map((contract) => contract.policyVersion))].sort()),
);
check(
  'contract summary set hash matches derived exports',
  contractSummary.contractSetHash === createHash('sha256').update(JSON.stringify(validExportedContracts), 'utf8').digest('hex'),
);
check('contract summary source commit recorded', /^[0-9a-f]{40}$/.test(String(contractSummary.sourceCommit)));
check('contract summary remains lightweight', statSync(contractSummaryPath).size < 4096);

const trackedFull = spawnSync('git', ['ls-files', '--', fullContractPath], { encoding: 'utf8' });
check('full contract JSON is not Git tracked', trackedFull.status === 0 && trackedFull.stdout.trim() === '');
const trackedSummary = spawnSync('git', ['ls-files', '--', contractSummaryPath], { encoding: 'utf8' });
check('contract summary JSON is Git tracked', trackedSummary.status === 0 && trackedSummary.stdout.trim() === contractSummaryPath);
const ignoredFull = spawnSync('git', ['check-ignore', '-q', fullContractPath]);
check('full contract JSON is ignored', ignoredFull.status === 0);

for (const set of goldenReferenceSets) {
  check(`${set.id}: immutable without version bump`, set.immutableUntilVersionBump === true);
  check(`${set.id}: has reference asset or document`, set.assets.length + set.documents.length > 0);
  for (const asset of set.assets) {
    check(`${set.id}: reference asset exists: ${asset.path}`, existsSync(asset.path));
    check(`${set.id}: runtime approval remains false`, asset.approvedForRuntime === false);
  }
  for (const document of set.documents) {
    check(`${set.id}: reference document exists: ${document}`, existsSync(document));
  }
}

const registrySnapshot = JSON.parse(read('data/asset-factory/golden-reference-registry.json') || '{}') as Record<string, any>;
check('registry snapshot schema v1', registrySnapshot.schemaVersion === 1);
check('registry snapshot count matches source', registrySnapshot.referenceSetCount === goldenReferenceSets.length);
check(
  'registry snapshot never grants runtime approval',
  Array.isArray(registrySnapshot.referenceSets)
    && registrySnapshot.referenceSets.every((set: any) => set.assets.every((asset: any) => asset.approvedForRuntime === false)),
);

const lineageTemplate = JSON.parse(read('data/asset-factory/generation-lineage.template.json') || '{}') as Record<string, any>;
check('lineage template candidate default', lineageTemplate.review?.status === 'candidate');
check('lineage template final false', lineageTemplate.approval?.approvedAsFinal === false);
check('lineage template runtime false', lineageTemplate.approval?.runtimeApproved === false);
check('lineage template final blocked', lineageTemplate.approval?.finalApprovalBlocked === true);
check('lineage template four candidates', lineageTemplate.candidateBatchPolicy?.requiredCandidateCount === 4);
check('lineage template comparison required', lineageTemplate.candidateBatchPolicy?.comparisonSheetRequired === true);

const lineageCli = read('scripts/asset-factory/create-lineage-record.ts');
for (const blocker of ['automatic QA has not passed', 'human review has not passed', 'four-candidate comparison sheet has not been recorded']) {
  check(`lineage CLI initial blocker exists: ${blocker}`, lineageCli.includes(blocker));
}
check('lineage CLI cannot approve final', !lineageCli.includes("approvedAsFinal: true"));
check('lineage CLI cannot approve runtime', !lineageCli.includes("runtimeApproved: true"));

const toolTypes = read('tools/asset-factory/src/types.ts');
for (const issue of ['identity-drift', 'proportion-drift', 'palette-drift', 'reference-missing', 'prompt-lineage-missing', 'unapproved-runtime-use']) {
  check(`Asset Factory manual issue exists: ${issue}`, toolTypes.includes(`'${issue}'`));
}
for (const field of ['contractId', 'promptHash', 'generatorVersion', 'referenceSetIds', 'lineageManifestPath', 'approvedAsFinal', 'runtimeApproved']) {
  check(`Asset Factory generation tracking field exists: ${field}`, toolTypes.includes(field));
}

const packageJson = read('package.json');
check('contract export package script exists', packageJson.includes('asset-factory:contracts:export'));
check('lineage create package script exists', packageJson.includes('asset-factory:lineage:create'));
check('generation consistency checker package script exists', packageJson.includes('asset-generation:check'));
check('assets verify includes generation guard', packageJson.includes('pnpm asset-generation:check'));

const exportScript = read('scripts/asset-factory/export-generation-contracts.ts');
check('contract export supports summary only', exportScript.includes('--summary-only'));
check('contract export supports custom full output', exportScript.includes('--output'));
check('contract export writes lightweight summary', exportScript.includes('generation-contracts.summary.json'));
check('full contract remains locally reproducible', exportScript.includes('contracts: exportedContracts'));

const docs = read('docs/asset-generation-consistency-system-v1.md');
for (const term of ['Asset Generation Contract', 'Golden Reference Registry', 'Generation Lineage', '4候補', 'approvedAsFinal=false', 'runtimeApproved=false', 'generation-contracts.summary.json']) {
  check(`consistency docs include: ${term}`, docs.includes(term));
}
check('README links consistency system', read('README.md').includes('docs/asset-generation-consistency-system-v1.md'));
check('production canon links consistency system', read('docs/181-current-production-canon.md').includes('docs/asset-generation-consistency-system-v1.md'));
check('catalog docs link consistency system', read('docs/185-asset-factory-catalog.md').includes('docs/asset-generation-consistency-system-v1.md'));

const readiness = JSON.parse(read('docs/design-targets/generated/asset-generation-consistency/readiness.json') || '{}') as Record<string, any>;
for (const field of [
  'repositoryFoundationReady',
  'assetGenerationContractReady',
  'generationContractsFullExportReproducible',
  'generationContractsSummaryReady',
  'generationContractsSummaryGitTracked',
  'goldenReferenceRegistryReady',
  'generationLineageCliReady',
  'fourCandidatePolicyReady',
  'candidateFinalRuntimeBoundaryReady',
  'staticCheckerReady',
]) {
  check(`readiness true: ${field}`, readiness[field] === true);
}
check('readiness records full JSON not tracked', readiness.generationContractsFullJsonGitTracked === false);
for (const field of [
  'allIdentityGoldenReferencesRegistered',
  'comparisonSheetAutomationReady',
  'visualSimilarityAutomationReady',
  'legacyAssetLineageBackfillReady',
  'generatedAssetApprovedAsFinal',
  'generatedAssetRuntimeApproved',
  'candidateAssetsApprovedAsFinal',
  'rcReady',
  'productionApproved',
]) {
  check(`readiness remains false: ${field}`, readiness[field] === false);
}

if (failures.length > 0) {
  console.error('Asset generation consistency check failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Asset generation consistency check passed: ${assetGenerationContracts.length} contracts, ${goldenReferenceSets.length} golden reference sets, lineage/final approval boundaries guarded.`);
