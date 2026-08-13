import { readFileSync } from 'node:fs';

const QUEUE_PATH = 'data/character-assets/manifests/core5-era-setting-board-execution-queue.v1.json';
const FIXED_PATH = 'data/character-assets/manifests/visual-pre-game-fixed-master-rows.v1.json';
const CONTRACT_PATH = 'data/visual/core5-era-setting-board-production-contract-v1.json';
const EVIDENCE_PATH = 'data/visual/core5-era-setting-board-evidence-packets-v1.json';

const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
const fixed = JSON.parse(readFileSync(FIXED_PATH, 'utf8'));
const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8'));
const evidence = JSON.parse(readFileSync(EVIDENCE_PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const fixedById = new Map((fixed.masters ?? []).map((entry: any) => [entry.assetId, entry]));
const evidenceIds = new Set((evidence.packets ?? []).map((entry: any) => entry.characterId));
const envPanels = contract.boardFamilies.environment.requiredPanels.map((entry: any) => entry.id);
const popPanels = contract.boardFamilies.populationHousehold.requiredPanels.map((entry: any) => entry.id);

assert(queue.schemaVersion === 1, 'Core5 execution queue schemaVersion drift');
assert(queue.status === 'BRIEF_AND_EVIDENCE_READY_SETTING_BOARDS_NOT_AUTHORED', 'Core5 execution queue must remain pre-authoring');
assert(queue.counts?.environment === 5 && queue.counts?.populationHousehold === 5 && queue.counts?.total === 10, 'Core5 execution queue count drift');
assert(queue.counts?.briefReady === 10 && queue.counts?.evidenceReady === 10, 'all ten Core5 entries must remain brief/evidence ready');
assert(queue.counts?.editableBoardAuthored === 0 && queue.counts?.humanApproved === 0 && queue.counts?.rasterAuthority === 0, 'Core5 queue may not claim authored/approved/raster boards yet');

for (const [key, expected] of Object.entries({
  reuseExistingStableAssetIds: true,
  newDuplicateAssetIdAllowed: false,
  briefOrEvidencePacketCountsAsCompletedBoard: false,
  settingBoardMustFollowProductionContract: true,
  exactOpenFieldsMayNotBeInvented: true,
  generatedImageMayOnlyBeCandidateEvidence: true,
  generatedImageCreatesStoryCanon: false,
  generatedImageCreatesCharacterFamilyCanon: false,
  humanReviewRequired: true,
  imageGenerationAuthorized: false,
})) {
  assert(queue.globalRules?.[key] === expected, `Core5 execution queue global rule drift: ${key}`);
}

assert(Array.isArray(queue.entries) && queue.entries.length === 10, 'Core5 execution queue must have exactly ten entries');
const ids = queue.entries.map((entry: any) => entry.assetId);
assert(new Set(ids).size === 10, 'Core5 execution queue asset IDs must be unique');
const paths = queue.entries.map((entry: any) => entry.plannedEditableBoardPath);
assert(new Set(paths).size === 10, 'Core5 planned editable board paths must be unique');

for (const entry of queue.entries as any[]) {
  const fixedRow = fixedById.get(entry.assetId) as any;
  assert(fixedRow, `${entry.assetId}: stable fixed Master row missing`);
  assert(fixedRow.familyId === entry.familyId, `${entry.assetId}: familyId drift from fixed registry`);
  assert(fixedRow.generationAllowed === false, `${entry.assetId}: fixed registry generation must remain blocked`);
  assert(evidenceIds.has(entry.characterId), `${entry.assetId}: character evidence packet missing`);
  assert(entry.currentState === 'BRIEF_EVIDENCE_READY_SETTING_BOARD_NOT_AUTHORED', `${entry.assetId}: may not claim authored board`);
  assert(entry.imageGenerationAuthorized === false, `${entry.assetId}: queue may not authorize image generation`);
  assert(entry.humanReviewRequired === true, `${entry.assetId}: Human review gate missing`);
  assert(typeof entry.plannedEditableBoardPath === 'string' && entry.plannedEditableBoardPath.endsWith(`${entry.assetId}.json`), `${entry.assetId}: editable board path must preserve stable Asset ID`);
  if (entry.characterId === 'yui') {
    assert(entry.exactYearState === '2026_CURRENT', `${entry.assetId}: Yui must preserve 2026 Current state`);
  } else {
    assert(entry.exactYearState === 'OPEN', `${entry.assetId}: exact year must remain OPEN`);
  }
  if (entry.boardType === 'ENVIRONMENT') {
    assert(entry.familyId === 'core5-reality-era-environment-reference-master', `${entry.assetId}: environment family mismatch`);
    assert(JSON.stringify(entry.requiredPanelIds) === JSON.stringify(envPanels), `${entry.assetId}: environment panel contract drift`);
  } else {
    assert(entry.boardType === 'POPULATION_HOUSEHOLD', `${entry.assetId}: unsupported board type`);
    assert(entry.familyId === 'core5-era-population-household-reference-master', `${entry.assetId}: population/household family mismatch`);
    assert(entry.literalFamilyCanonCreated === false, `${entry.assetId}: population board may not create literal family Canon`);
    assert(JSON.stringify(entry.requiredPanelIds) === JSON.stringify(popPanels), `${entry.assetId}: population panel contract drift`);
  }
}

const queueEnvironmentIds = queue.entries.filter((entry: any) => entry.boardType === 'ENVIRONMENT').map((entry: any) => entry.assetId);
const queuePopulationIds = queue.entries.filter((entry: any) => entry.boardType === 'POPULATION_HOUSEHOLD').map((entry: any) => entry.assetId);
const fixedEnvironmentIds = fixed.masters.filter((entry: any) => entry.familyId === 'core5-reality-era-environment-reference-master').map((entry: any) => entry.assetId);
const fixedPopulationIds = fixed.masters.filter((entry: any) => entry.familyId === 'core5-era-population-household-reference-master').map((entry: any) => entry.assetId);
assert(JSON.stringify([...queueEnvironmentIds].sort()) === JSON.stringify([...fixedEnvironmentIds].sort()), 'environment queue must reuse exactly the five fixed stable IDs');
assert(JSON.stringify([...queuePopulationIds].sort()) === JSON.stringify([...fixedPopulationIds].sort()), 'population queue must reuse exactly the five fixed stable IDs');

assert(queue.nextGate?.action === 'AUTHOR_EDITABLE_SETTING_BOARD_FROM_CURRENT_BRIEF_CONTRACT_AND_EVIDENCE', 'Core5 next gate drift');
assert(queue.nextGate?.mayUseGeneratedCandidateEvidence === true, 'candidate evidence may remain available for later authoring');
assert(queue.nextGate?.mayTreatGeneratedCandidateAsAuthority === false, 'generated candidate may never become authority automatically');
assert(queue.nextGate?.mustPreserveStableAssetId === true, 'Core5 board authoring must preserve stable Asset IDs');
assert(queue.nextGate?.mustKeepOpenFieldsVisible === true, 'Core5 board authoring must keep OPEN fields visible');
assert(queue.nextGate?.humanReviewRequiredBeforeMasterApproval === true, 'Core5 board Master approval must require Human review');
assert(queue.nextGate?.imageGenerationAuthorizedByQueue === false, 'Core5 execution queue may not authorize image generation');

console.log(JSON.stringify({
  status: 'PASS',
  queueId: queue.queueId,
  environmentEntries: queueEnvironmentIds.length,
  populationHouseholdEntries: queuePopulationIds.length,
  stableIdsReused: 10,
  duplicateAssetIds: 0,
  editableBoardsAuthored: queue.counts.editableBoardAuthored,
  humanApproved: queue.counts.humanApproved,
  imageGenerationAuthorized: false,
}, null, 2));
