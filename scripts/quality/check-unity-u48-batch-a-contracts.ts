import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path));
const json = (path: string) => JSON.parse(read(path).toString());
const sha256 = (path: string) => createHash('sha256').update(read(path)).digest('hex');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 Batch A contract check failed: ${message}`); };
const groups = ['player-yui', 'enemy-onbu', 'stage1-background', 'exp-pickup', 'healing-pickup', 'common-projectile', 'hit-effect', 'enemy-death-effect', 'movement-trail'];
const sourceHead = '192471e044124885e432d6ecc4166ccfdf8134e8';
const golden = json('docs/design-targets/generated/unity-u48/batch-a/golden-references.json');
const contracts = json('docs/design-targets/generated/unity-u48/batch-a/generation-contracts.json');
const recipes = json('docs/design-targets/generated/unity-u48/batch-a/generation-recipes.json');
const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');
const finalized = readiness.u48Completed === true && readiness.runtimeVisualReady === true;
const mutableHistoricalReference = (path: string) => finalized && path.startsWith('docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/');
const goldenReferenceHashes = new Map<string, string>();

check(golden.schemaVersion === 1 && golden.sourceHead === sourceHead && golden.assetGroupCount === 9 && golden.entries.length === 9, 'golden reference header');
check(contracts.schemaVersion === 1 && contracts.sourceHead === sourceHead && contracts.assetGroupCount === 9 && contracts.candidateCount === 36 && contracts.contracts.length === 36, 'generation contract header');
check(recipes.schemaVersion === 1 && recipes.sourceHead === sourceHead && recipes.toolVersion === '1' && recipes.recipes.length === 36, 'recipe header');
check(JSON.stringify(golden.entries.map((value: { assetGroup: string }) => value.assetGroup)) === JSON.stringify(groups), 'exact ordered Batch A groups');
for (const entry of golden.entries) {
  check(['complete', 'composite', 'missing'].includes(entry.goldenReferenceStatus), `${entry.assetGroup} golden status`);
  check(entry.references.length >= 3, `${entry.assetGroup} reference contract`);
  for (const reference of entry.references) {
    check(existsSync(resolve(root, reference.path)), `${entry.assetGroup} reference exists: ${reference.path}`);
    if (!mutableHistoricalReference(reference.path)) check(sha256(reference.path) === reference.sha256, `${entry.assetGroup} reference hash: ${reference.path}`);
    const previousHash = goldenReferenceHashes.get(reference.path);
    check(previousHash === undefined || previousHash === reference.sha256, `${entry.assetGroup} shared reference snapshot hash`);
    goldenReferenceHashes.set(reference.path, reference.sha256);
    check(['shape', 'color', 'texture', 'animation', 'runtime-size', 'worldbuilding'].includes(reference.role), `${entry.assetGroup} reference role`);
  }
  check(entry.approvedForRuntime === false && entry.humanApprovedGoldenReference === false, `${entry.assetGroup} reference/runtime boundary`);
  if (entry.goldenReferenceStatus === 'missing') check(entry.approvedForReference === false, `${entry.assetGroup} missing reference is not approved`);
}

const ids = new Set<string>();
const recipeIds = new Set(recipes.recipes.map((value: { recipeId: string }) => value.recipeId));
for (const group of groups) check(contracts.contracts.filter((value: { assetGroup: string }) => value.assetGroup === group).length === 4, `${group} has four planned candidates`);
for (const contract of contracts.contracts) {
  check(!ids.has(contract.candidateId), `candidate ID unique: ${contract.candidateId}`);
  ids.add(contract.candidateId);
  check(groups.includes(contract.assetGroup), `${contract.candidateId} group`);
  check(['existing', 'generated-from-master', 'procedural-authored', 'reconstructed'].includes(contract.sourceType), `${contract.candidateId} source type`);
  check(contract.goldenReferencePaths.length === contract.goldenReferenceSha256.length && contract.goldenReferencePaths.length >= 3, `${contract.candidateId} golden hashes`);
  for (let index = 0; index < contract.goldenReferencePaths.length; index += 1) {
    const path = contract.goldenReferencePaths[index];
    const expectedHash = contract.goldenReferenceSha256[index];
    check(goldenReferenceHashes.get(path) === expectedHash, `${contract.candidateId} golden snapshot hash ${index}`);
    if (!mutableHistoricalReference(path)) check(sha256(path) === expectedHash, `${contract.candidateId} golden hash ${index}`);
  }
  check(contract.parentSourcePaths.length > 0 && contract.parentSourcePaths.length === contract.parentSourceSha256.length, `${contract.candidateId} parents`);
  for (let index = 0; index < contract.parentSourcePaths.length; index += 1) check(sha256(contract.parentSourcePaths[index]) === contract.parentSourceSha256[index], `${contract.candidateId} parent hash ${index}`);
  check(contract.generationTool === 'scripts/unity/build-u48-batch-a-candidates.py' && contract.generationToolVersion === '1' && existsSync(resolve(root, contract.generationTool)), `${contract.candidateId} generator`);
  check(contract.recipePath === 'docs/design-targets/generated/unity-u48/batch-a/generation-recipes.json' && recipeIds.has(contract.recipeId), `${contract.candidateId} recipe`);
  check(existsSync(resolve(root, contract.promptPath)) && sha256(contract.promptPath) === contract.promptSha256, `${contract.candidateId} prompt`);
  check(contract.targetImportContract.format === 'PNG RGBA' && contract.targetImportContract.filterMode === 'Point' && contract.targetImportContract.compression === 'None' && contract.targetImportContract.mipmap === false, `${contract.candidateId} import contract`);
  check(contract.runtimeContract.worldSizeUnchanged === true && contract.runtimeContract.gameplayValuesUnchanged === true, `${contract.candidateId} gameplay contract`);
  check(contract.humanReviewStatus === 'pending' && contract.approvedAsFinal === false && contract.runtimeApproved === false, `${contract.candidateId} approval boundary`);
  if (contract.outputSha256 === null) {
    check(contract.createdAtUtc === null && contract.lineageStatus === 'unknown', `${contract.candidateId} pending lineage is honest`);
  } else {
    check(existsSync(resolve(root, contract.outputPath)) && sha256(contract.outputPath) === contract.outputSha256, `${contract.candidateId} output hash`);
    check(existsSync(resolve(root, `${contract.outputPath}.meta`)), `${contract.candidateId} Unity meta`);
    check(typeof contract.createdAtUtc === 'string' && ['complete', 'reconstructed-partial'].includes(contract.lineageStatus), `${contract.candidateId} generated lineage`);
  }
}

const providerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs';
const baselineProvider = execFileSync('git', ['show', `${sourceHead}:${providerPath}`], { cwd: root });
const baselineProviderHash = createHash('sha256').update(baselineProvider).digest('hex');
if (finalized) {
  const provider = read(providerPath).toString();
  check(baselineProviderHash !== sha256(providerPath) && provider.includes('AssetApprovalLevel.Production') && provider.includes('U48ProductionVisualCatalog.LoadRequired()'), 'post-approval production provider');
} else {
  check(baselineProviderHash === sha256(providerPath), 'production provider unchanged from Batch A baseline');
}
console.log(`U48 Batch A contract check passed: 9 Golden Reference contracts, 36 pre-generation candidate contracts, deterministic recipes, phase=${finalized ? 'finalized-production' : 'batch-a-isolated'}.`);
