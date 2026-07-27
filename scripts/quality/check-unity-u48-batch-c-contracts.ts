import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path));
const json = (path: string) => JSON.parse(read(path).toString());
const sha256 = (path: string) => createHash('sha256').update(read(path)).digest('hex');
const check = (value: unknown, message: string) => { if (!value) throw new Error(`U48 Batch C contract check failed: ${message}`); };
const sourceHead = 'eba336591d6414465a87cbe72db69715d7517d61';
const groups = [
  'hud-top-status-frame', 'hud-hp-frame', 'hud-timer-frame', 'hud-inventory-weapon-slot',
  'hud-inventory-passive-slot', 'hud-rare-slot', 'hud-kokuyou-gauge-frame',
  'levelup-card-background', 'levelup-icon-frame', 'levelup-title-area', 'levelup-description-area',
  'levelup-selection-feedback', 'levelup-decline-button',
  'replacement-modal-background', 'replacement-incoming-candidate-panel', 'replacement-owned-slot-row',
  'replacement-selected-slot-state', 'replacement-confirm-button', 'replacement-cancel-button',
  'result-main-panel', 'result-summary-header', 'result-inventory-row', 'result-evolution-awakening-row',
  'result-retry-button', 'result-return-button',
  'stage-select-stage-card', 'stage-select-locked-unlocked-state', 'stage-select-primary-button',
  'stage-select-title-frame', 'stage-select-metadata-row',
];

const comparison = json('docs/design-targets/generated/unity-u48/approval-pack/ui-comparison-contracts.json');
const audit = json('docs/design-targets/generated/unity-u48/batch-c/runtime-baseline-audit.json');
const golden = json('docs/design-targets/generated/unity-u48/batch-c/golden-references.json');
const contracts = json('docs/design-targets/generated/unity-u48/batch-c/generation-contracts.json');
const recipes = json('docs/design-targets/generated/unity-u48/batch-c/generation-recipes.json');
const readiness = json('docs/design-targets/generated/unity-u48/readiness.json');
const finalized = readiness.u48Completed === true && readiness.runtimeVisualReady === true;
const mutableHistoricalReference = (path: string) => finalized && (path === 'docs/181-current-production-canon.md' || path.startsWith('docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/'));
const goldenReferenceHashes = new Map<string, string>();

check(comparison.activeComparisonGroupCount === 30 && comparison.comparisonGroups.length === 30, '30 comparison units');
check(JSON.stringify(comparison.comparisonGroups.map((value: { assetGroup: string }) => value.assetGroup)) === JSON.stringify(groups), 'exact ordered groups');
check(comparison.deprecatedGroups.length === 5 && comparison.deprecatedGroups.every((value: { historyStatus: string }) => value.historyStatus === 'split-required-resolved'), 'mixed group history retained as resolved');
for (const entry of comparison.comparisonGroups) {
  const contract = entry.comparisonContract;
  check(contract.samePurpose && contract.sameLogicalSize && contract.sameRuntimePosition && contract.sameTextSafeArea, `${entry.assetGroup} same-purpose geometry`);
  check(contract.sameInteractionOwner && contract.sameContentContract && contract.sameTapTargetContract, `${entry.assetGroup} ownership/content/tap contract`);
  check(Array.isArray(contract.sameRequiredStates) && contract.sameRequiredStates.length > 0, `${entry.assetGroup} states`);
}

check(audit.sourceHead === sourceHead && audit.assetGroupCount === 30 && audit.entries.length === 30, 'runtime audit header');
check(JSON.stringify(audit.entries.map((value: { assetGroup: string }) => value.assetGroup)) === JSON.stringify(groups), 'audit exact groups');
for (const entry of audit.entries) {
  check(entry.runtimeOwner && existsSync(resolve(root, entry.runtimeOwner)), `${entry.assetGroup} runtime owner`);
  check(entry.runtimeComponent && entry.renderMode === 'ScreenSpaceOverlay/uGUI', `${entry.assetGroup} runtime component/render mode`);
  check(entry.rectTransform && entry.canvasScalerContract.referenceResolution.join(',') === '390,844', `${entry.assetGroup} responsive audit`);
  check(entry.safeAreaOwner && entry.interactionOwner && Array.isArray(entry.currentStates), `${entry.assetGroup} ownership audit`);
  if (entry.currentAssetPath) {
    check(existsSync(resolve(root, entry.currentAssetPath)), `${entry.assetGroup} current asset exists`);
    const actualCurrentHash = sha256(entry.currentAssetPath);
    check(actualCurrentHash === entry.currentSha256, `${entry.assetGroup} current asset hash expected=${entry.currentSha256} actual=${actualCurrentHash}`);
    check(typeof entry.currentGuid === 'string' && entry.currentGuid.length === 32, `${entry.assetGroup} current GUID`);
  }
}

check(golden.sourceHead === sourceHead && golden.entries.length === 30, 'Golden Reference header');
for (const entry of golden.entries) {
  check(groups.includes(entry.assetGroup), `${entry.assetGroup} golden group`);
  check(['complete', 'composite', 'missing'].includes(entry.goldenReferenceStatus), `${entry.assetGroup} honest status`);
  check(entry.references.length >= 5, `${entry.assetGroup} reference set`);
  for (const reference of entry.references) {
    check(existsSync(resolve(root, reference.path)), `${entry.assetGroup} reference exists: ${reference.path}`);
    if (!mutableHistoricalReference(reference.path)) {
      const actualReferenceHash = sha256(reference.path);
      check(actualReferenceHash === reference.sha256, `${entry.assetGroup} reference hash: ${reference.path} expected=${reference.sha256} actual=${actualReferenceHash}`);
    }
    const previousHash = goldenReferenceHashes.get(reference.path);
    check(previousHash === undefined || previousHash === reference.sha256, `${entry.assetGroup} shared reference snapshot hash`);
    goldenReferenceHashes.set(reference.path, reference.sha256);
  }
  check(entry.humanApprovedGoldenReference === false && entry.approvedForRuntime === false, `${entry.assetGroup} golden approval boundary`);
}

check(contracts.sourceHead === sourceHead && contracts.assetGroupCount === 30 && contracts.candidateCount === 120 && contracts.contracts.length === 120, 'Generation Contract header');
check(recipes.sourceHead === sourceHead && recipes.recipes.length === 120, 'recipe header');
const recipeIds = new Set(recipes.recipes.map((value: { recipeId: string }) => value.recipeId));
const ids = new Set<string>();
for (const group of groups) check(contracts.contracts.filter((value: { assetGroup: string }) => value.assetGroup === group).length === 4, `${group} has four candidates`);
for (const contract of contracts.contracts) {
  check(!ids.has(contract.candidateId), `${contract.candidateId} unique ID`); ids.add(contract.candidateId);
  check(groups.includes(contract.assetGroup), `${contract.candidateId} group`);
  check(contract.goldenReferencePaths.length >= 5 && contract.goldenReferencePaths.length === contract.goldenReferenceSha256.length, `${contract.candidateId} golden hashes`);
  contract.goldenReferencePaths.forEach((path: string, index: number) => {
    const expectedHash = contract.goldenReferenceSha256[index];
    check(goldenReferenceHashes.get(path) === expectedHash, `${contract.candidateId} golden snapshot hash ${index}`);
    if (!mutableHistoricalReference(path)) {
      const actualGoldenHash = sha256(path);
      check(actualGoldenHash === expectedHash, `${contract.candidateId} golden hash ${index} path=${path} expected=${expectedHash} actual=${actualGoldenHash}`);
    }
  });
  check(contract.parentSourcePaths.length > 0 && contract.parentSourcePaths.length === contract.parentSourceSha256.length, `${contract.candidateId} parent sources`);
  contract.parentSourcePaths.forEach((path: string, index: number) => {
    const expectedHash = contract.parentSourceSha256[index];
    if (mutableHistoricalReference(path)) check(goldenReferenceHashes.get(path) === expectedHash, `${contract.candidateId} parent snapshot hash ${index}`);
    else {
      const actualParentHash = sha256(path);
      check(actualParentHash === expectedHash, `${contract.candidateId} parent hash ${index} path=${path} expected=${expectedHash} actual=${actualParentHash}`);
    }
  });
  check(contract.generationTool === 'scripts/unity/build-u48-batch-c-candidates.py' && contract.generationToolVersion === '1', `${contract.candidateId} generator contract`);
  check(contract.recipePath.endsWith('/batch-c/generation-recipes.json') && recipeIds.has(contract.recipeId), `${contract.candidateId} recipe`);
  check(existsSync(resolve(root, contract.promptPath)) && sha256(contract.promptPath) === contract.promptSha256, `${contract.candidateId} prompt`);
  const imp = contract.targetImportContract;
  check(imp.format === 'PNG RGBA' && imp.filterMode === 'Bilinear' && imp.compression === 'None' && imp.mipmap === false && imp.imageType === 'Sliced' && imp.pixelsPerUnit === 100, `${contract.candidateId} import contract`);
  check(imp.border.every((value: number) => value > 0) && imp.border[0] + imp.border[1] < imp.sourcePixelSize[0] && imp.border[2] + imp.border[3] < imp.sourcePixelSize[1], `${contract.candidateId} safe border`);
  check(contract.runtimeContract.previewOnly && contract.runtimeContract.uiLogicUnchanged && contract.runtimeContract.gameplayStateUnchanged && contract.runtimeContract.productionProviderUnchanged, `${contract.candidateId} runtime boundary`);
  check(contract.humanReviewStatus === 'pending' && contract.humanApprovedCandidateId === null && contract.approvedAsFinal === false && contract.runtimeApproved === false, `${contract.candidateId} approval boundary`);
  if (contract.outputSha256 === null) check(contract.createdAtUtc === null && contract.lineageStatus === 'unknown', `${contract.candidateId} honest pending lineage`);
}

const protectedPaths = [
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/GameplayServices.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/State/RunGameplayState.cs',
  'docs/design-targets/generated/unity-u48/batch-a',
  'docs/design-targets/generated/unity-u48/batch-b',
];
const postU48FeedbackPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
for (const path of finalized ? protectedPaths.filter(path =>
  path !== 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs'
  && path !== postU48FeedbackPath
  && path !== 'docs/design-targets/generated/unity-u48/batch-a'
) : protectedPaths) {
  try { execFileSync('git', ['diff', '--quiet', sourceHead, '--', path], { cwd: root }); }
  catch { check(false, `protected path changed from Batch C baseline: ${path}`); }
}
if (finalized) {
  const feedbackDiff = execFileSync('git', ['diff', '--unified=0', sourceHead, '--', postU48FeedbackPath], { cwd: root, encoding: 'utf8' });
  const addedFeedbackLines = feedbackDiff.split('\n').filter(line => line.startsWith('+') && !line.startsWith('+++'));
  const removedFeedbackLines = feedbackDiff.split('\n').filter(line => line.startsWith('-') && !line.startsWith('---'));
  check(addedFeedbackLines.length === 3 && removedFeedbackLines.length === 3, 'post-U48 gameplay coordinator change is limited to three U49 feedback hooks');
  check(addedFeedbackLines.every(line => line.includes('U43RuntimeFeedbackBridge.Instance?')), 'post-U48 gameplay coordinator additions are only U49 feedback hooks');
  check(!feedbackDiff.includes('RuntimeVisualAssetProvider') && !feedbackDiff.includes('U48ProductionVisualCatalog'), 'post-U48 feedback hooks do not alter visual ownership');
  const provider = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/RuntimeVisualAssetProvider.cs').toString();
  check(provider.includes('AssetApprovalLevel.Production') && provider.includes('U48ProductionVisualCatalog.LoadRequired()'), 'post-approval production provider');
}

console.log(`U48 Batch C contract check passed: 30 same-purpose UI groups, 120 candidate contracts, composite Golden References, phase=${finalized ? 'finalized-production' : 'batch-c-isolated'}.`);
