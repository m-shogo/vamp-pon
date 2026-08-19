import { readFileSync } from 'node:fs';

const CONTRACT_PATH = 'data/visual/core5-era-setting-board-production-contract-v1.json';
const ENV_PATH = 'data/visual/core5-reality-era-environment-authoring-brief-v1.json';
const HOUSEHOLD_PATH = 'data/visual/core5-era-population-household-authoring-brief-v1.json';

const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8'));
const env = JSON.parse(readFileSync(ENV_PATH, 'utf8'));
const household = JSON.parse(readFileSync(HOUSEHOLD_PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const expectedIds = ['yui','asa','nagi','michiru','tomori'];
assert(contract.schemaVersion === 1, 'Core5 setting-board contract schemaVersion drift');
assert(contract.status === 'CURRENT_EDITABLE_SETTING_BOARD_CONTRACT_NO_IMAGE_GENERATION', 'Core5 setting-board contract must remain non-generating');
assert(contract.boardFamilies?.environment?.count === 5, 'environment setting-board count must remain 5');
assert(contract.boardFamilies?.populationHousehold?.count === 5, 'population/household setting-board count must remain 5');
assert(JSON.stringify(contract.boardFamilies.environment.subjectIds) === JSON.stringify(expectedIds), 'environment board subject order drift');
assert(JSON.stringify(contract.boardFamilies.populationHousehold.subjectIds) === JSON.stringify(expectedIds), 'population/household board subject order drift');

const envPanelIds = (contract.boardFamilies.environment.requiredPanels ?? []).map((entry: any) => entry.id);
for (const id of ['E01-establishing-system-view','E02-system-comparison-strip','E03-material-prop-detail','E04-human-use-and-friction','E05-source-open-boundary']) {
  assert(envPanelIds.includes(id), `environment required panel missing: ${id}`);
}
const popPanelIds = (contract.boardFamilies.populationHousehold.requiredPanels ?? []).map((entry: any) => entry.id);
for (const id of ['P01-six-population-lenses','P02-household-system-variation','P03-ordinary-task-distribution','P04-system-access-differences','P05-not-literal-family-boundary']) {
  assert(popPanelIds.includes(id), `population/household required panel missing: ${id}`);
}

const comparison = contract.boardFamilies.environment.requiredPanels.find((entry: any) => entry.id === 'E02-system-comparison-strip');
for (const axis of ['communication','transportNavigation','shoppingAvailability','repairReplacement','privacyRecords']) {
  assert(comparison?.requiredAxes?.includes(axis), `environment system comparison axis missing: ${axis}`);
}
const lensPanel = contract.boardFamilies.populationHousehold.requiredPanels.find((entry: any) => entry.id === 'P01-six-population-lenses');
assert(lensPanel?.requiredLensCount === 6, 'population lineup must retain all six lenses');

for (const shortcut of ['single_mood_painting_only','era_explained_by_costume_only','one_character_is_whole_era']) {
  assert(contract.boardFamilies.environment.forbiddenCompositionShortcuts?.includes(shortcut), `environment anti-shortcut missing: ${shortcut}`);
}
for (const shortcut of ['family_photo_implies_literal_character_family','one_household_is_whole_era','everyone_has_same_device_access_income_or_lifestyle']) {
  assert(contract.boardFamilies.populationHousehold.forbiddenCompositionShortcuts?.includes(shortcut), `population anti-shortcut missing: ${shortcut}`);
}

assert(contract.sharedProductionRules?.editableFirst === true, 'setting-board production must be editable-first');
assert(contract.sharedProductionRules?.flattenedRasterIsAuthority === false, 'flattened raster may not become setting-board authority');
assert(contract.sharedProductionRules?.nativeTextRequiredForLabelsAndOpenFields === true, 'labels/OPEN fields must remain native editable text');
assert(contract.sharedProductionRules?.generatedImageMayOnlyBeCandidateEvidence === true, 'generated image may only be candidate evidence');
assert(contract.sharedProductionRules?.generatedImageCreatesHistoricalFact === false, 'generated image may not create historical fact');
assert(contract.sharedProductionRules?.generatedImageCreatesHouseholdCanon === false, 'generated image may not create household Canon');
assert(contract.sharedProductionRules?.generatedImageCreatesCharacterFamilyCanon === false, 'generated image may not create Character family Canon');
assert(contract.sharedProductionRules?.generatedImageCreatesStoryCanon === false, 'generated image may not create Story Canon');
assert(contract.sharedProductionRules?.humanReviewRequired === true, 'setting boards must remain Human-review gated');
assert(contract.sharedProductionRules?.imageGenerationAuthorized === false, 'setting-board contract may not authorize image generation');

assert(env.boards?.length === contract.boardFamilies.environment.count, 'environment brief count/contract count mismatch');
assert(household.boards?.length === contract.boardFamilies.populationHousehold.count, 'household brief count/contract count mismatch');
assert(contract.completionGate?.requiredFinalSettingBoardCount === 10, 'required setting-board total must remain 10');
assert(contract.completionGate?.settingBoardsAuthored === 0, 'contract may not claim setting boards authored yet');
assert(contract.completionGate?.settingBoardsHumanApproved === 0, 'contract may not claim Human approval yet');
assert(contract.completionGate?.rasterAuthorityBoards === 0, 'no raster setting-board authority exists yet');
assert(contract.completionGate?.imageGenerationAuthorized === false, 'completion gate may not authorize image generation');
assert(contract.completionGate?.mayPromoteCanon === false && contract.completionGate?.mayPromoteRuntime === false, 'setting-board contract may not promote Canon/runtime');

console.log(JSON.stringify({
  status: 'PASS',
  contractId: contract.id,
  environmentBoardsRequired: contract.boardFamilies.environment.count,
  populationHouseholdBoardsRequired: contract.boardFamilies.populationHousehold.count,
  requiredPanelRolesPerBoardFamily: { environment: envPanelIds.length, populationHousehold: popPanelIds.length },
  settingBoardsAuthored: contract.completionGate.settingBoardsAuthored,
  imageGenerationAuthorized: contract.completionGate.imageGenerationAuthorized,
  humanReviewRequired: contract.sharedProductionRules.humanReviewRequired,
}, null, 2));
