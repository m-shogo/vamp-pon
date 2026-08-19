import { readFileSync } from 'node:fs';
import { CHARACTER_REALITY_ROOTS } from '../../src/game/data/characterRealityRootRegistry.ts';
import { STORY_WORLD_MASTER_SOURCE } from '../../src/game/data/storyWorldMasterSource.ts';

const ENV_PATH = 'data/visual/core5-reality-era-environment-authoring-brief-v1.json';
const HOUSEHOLD_PATH = 'data/visual/core5-era-population-household-authoring-brief-v1.json';
const ERA_LIFE_PATH = 'data/visual/core5-era-life-design-master-v1.json';

const env = JSON.parse(readFileSync(ENV_PATH, 'utf8'));
const household = JSON.parse(readFileSync(HOUSEHOLD_PATH, 'utf8'));
const eraLife = JSON.parse(readFileSync(ERA_LIFE_PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const core5Ids = [...STORY_WORLD_MASTER_SOURCE.era.core5CharacterIds];
const expectedIds = new Set(core5Ids);
const expectedPopulationLenses = [...STORY_WORLD_MASTER_SOURCE.generationAndHousehold.requiredPopulationLenses];
const eraLifeById = new Map((eraLife.characters ?? []).map((entry: any) => [entry.id, entry]));
const rootById = new Map(CHARACTER_REALITY_ROOTS.map((entry) => [entry.id, entry]));

assert(core5Ids.length === 5, `Current Story World Core5 count must be 5, got ${core5Ids.length}`);
assert(env.status === 'SOURCE_GROUNDED_AUTHORING_BRIEF_VISUAL_BOARD_PENDING', 'environment brief state drift');
assert(household.status === 'SOURCE_GROUNDED_AUTHORING_BRIEF_VISUAL_BOARD_PENDING', 'household brief state drift');
assert(env.imageGenerationAuthorized === false && household.imageGenerationAuthorized === false, 'Core5 briefs may not authorize image generation');
assert(env.humanReviewRequired === true && household.humanReviewRequired === true, 'Core5 briefs require Human review');
assert(env.expectedVisualBoardCount === 5 && household.expectedVisualBoardCount === 5, 'Core5 visual-board target count must remain 5 + 5');
assert(env.globalRules?.eraDifferenceMustNotBeClothingOnly === true, 'environment brief must forbid clothing-only era distinction');
assert(env.globalRules?.oneCharacterDoesNotRepresentWholeEra === true, 'environment brief must forbid one-character-is-whole-era shorthand');
assert(env.globalRules?.exactYearsFrozen === false, 'environment brief must preserve open exact years');
assert(Array.isArray(env.globalAntiShortcuts) && env.globalAntiShortcuts.includes('era_difference_must_not_be_clothing_only'), 'environment anti-shortcut missing');

const envIds = (env.boards ?? []).map((entry: any) => entry.characterId);
const householdIds = (household.boards ?? []).map((entry: any) => entry.characterId);
assert(envIds.length === 5 && new Set(envIds).size === 5, 'environment brief must contain exactly five unique Core5 boards');
assert(householdIds.length === 5 && new Set(householdIds).size === 5, 'household brief must contain exactly five unique Core5 boards');
assert(envIds.every((id: string) => expectedIds.has(id as any)), 'environment brief contains non-Core5 character');
assert(householdIds.every((id: string) => expectedIds.has(id as any)), 'household brief contains non-Core5 character');
assert(core5Ids.every((id) => envIds.includes(id) && householdIds.includes(id)), 'both Core5 briefs must cover the complete Current Core5 set');

for (const board of env.boards as any[]) {
  const root = rootById.get(board.characterId) as any;
  const era = eraLifeById.get(board.characterId) as any;
  assert(root, `${board.characterId}: Reality Root source missing`);
  assert(era, `${board.characterId}: era-life source missing`);
  assert(board.realityRoot?.value === root.root, `${board.characterId}: Reality Root value drift`);
  assert(board.realityRoot?.status === root.status, `${board.characterId}: Reality Root authority status drift`);
  assert(board.incidentArea === root.incidentArea, `${board.characterId}: incidentArea drift`);
  assert(board.mobility === root.mobility, `${board.characterId}: mobility drift`);
  assert(board.eraBand === era.eraBand, `${board.characterId}: eraBand drift`);
  assert(Array.isArray(board.mustShowAxes) && board.mustShowAxes.length >= 5, `${board.characterId}: at least five ordinary-life axes required`);
  const ordinaryAxes = new Set(Object.keys(era.ordinarySystems ?? {}));
  for (const axis of board.mustShowAxes) assert(ordinaryAxes.has(axis), `${board.characterId}: unsupported ordinary-life axis ${axis}`);
  assert(Array.isArray(board.environmentEvidenceTargets) && board.environmentEvidenceTargets.length >= 5, `${board.characterId}: environment evidence targets too thin`);
  assert(Array.isArray(board.researchRequiredBeforeVisualBoardApproval) && board.researchRequiredBeforeVisualBoardApproval.length >= 2, `${board.characterId}: research gate missing`);
  assert(Array.isArray(board.openFields) && board.openFields.length >= 4, `${board.characterId}: OPEN fields must remain explicit`);
  assert(board.visualBoardState === 'SOURCE_GROUNDED_BRIEF_VISUAL_BOARD_PENDING', `${board.characterId}: board may not claim authored visual`);
  assert(board.imageGenerationAuthorized === false, `${board.characterId}: image generation must remain blocked`);
  assert(board.humanReviewRequired === true, `${board.characterId}: Human review required`);
  if (board.characterId === 'yui') {
    assert(board.exactYear === 2026, 'Yui environment brief must preserve Current 2026 source');
    assert(board.realityRoot.status === 'DECIDED', 'Yui Reality Root must remain DECIDED');
  } else {
    assert(board.exactYear === 'OPEN', `${board.characterId}: exact year must remain OPEN`);
    assert(board.realityRoot.status === 'CURRENT_DERIVED', `${board.characterId}: Reality Root may not be promoted beyond CURRENT_DERIVED`);
  }
}

assert(household.globalRules?.worldAxis === STORY_WORLD_MASTER_SOURCE.generationAndHousehold.worldAxis, 'household world axis drift');
assert(household.globalRules?.onePersonRepresentsWholeEra === false, 'household brief must preserve onePersonRepresentsWholeEra=false');
assert(household.globalRules?.oneHouseholdTypeRepresentsWholeEra === false, 'household brief must preserve household diversity');
assert(household.globalRules?.populationLensesAreNotLiteralCharacterFamilyMembers === true, 'population lenses must not create literal family Canon');
assert(household.globalRules?.exactCore5FamilyMembersFrozen === false, 'exact Core5 family members must remain OPEN');
for (const key of ['fatherEqualsWorkOnly','motherEqualsHouseworkOnly','grandparentEqualsWisdomOnly','auntUncleEqualsComicReliefOnly','childEqualsPureTruthOnly']) {
  assert(household.globalRules?.[key] === false, `household stereotype guard drift: ${key}`);
}
assert(JSON.stringify(household.requiredPopulationLenses) === JSON.stringify(expectedPopulationLenses), 'top-level population lenses must match Story World master');

for (const board of household.boards as any[]) {
  const root = rootById.get(board.characterId) as any;
  const era = eraLifeById.get(board.characterId) as any;
  assert(root && era, `${board.characterId}: source missing`);
  assert(board.realityRoot?.value === root.root, `${board.characterId}: household Reality Root value drift`);
  assert(board.realityRoot?.status === root.status, `${board.characterId}: household Reality Root status drift`);
  assert(board.eraBand === era.eraBand, `${board.characterId}: household eraBand drift`);
  assert(JSON.stringify(board.populationLenses) === JSON.stringify(expectedPopulationLenses), `${board.characterId}: all six population lenses required in source order`);
  assert(Array.isArray(board.ordinaryLifeEvidenceTargets) && board.ordinaryLifeEvidenceTargets.length >= 5, `${board.characterId}: household evidence targets too thin`);
  assert(Array.isArray(board.researchRequiredBeforeVisualBoardApproval) && board.researchRequiredBeforeVisualBoardApproval.length >= 2, `${board.characterId}: household research gate missing`);
  assert(Array.isArray(board.openFields) && board.openFields.some((field: string) => field.includes('exact family members')), `${board.characterId}: exact family members must stay explicitly OPEN`);
  assert(board.literalFamilyCanonCreatedByThisBoard === false, `${board.characterId}: population board may not create literal family Canon`);
  assert(board.exactFamilyMembersFrozen === false, `${board.characterId}: exact family members must remain unfrozen`);
  assert(board.visualBoardState === 'SOURCE_GROUNDED_BRIEF_VISUAL_BOARD_PENDING', `${board.characterId}: household board may not claim authored visual`);
  assert(board.imageGenerationAuthorized === false && board.humanReviewRequired === true, `${board.characterId}: image/Human gate drift`);
  if (board.characterId === 'yui') {
    assert(board.exactYear === 2026 && board.realityRoot.status === 'DECIDED', 'Yui household source boundary drift');
  } else {
    assert(board.exactYear === 'OPEN', `${board.characterId}: household exact year must remain OPEN`);
    assert(board.realityRoot.status === 'CURRENT_DERIVED', `${board.characterId}: household root may not auto-promote`);
  }
}

for (const completion of [env.completionBoundary, household.completionBoundary]) {
  assert(completion?.authoringBriefImplemented === true, 'authoring brief completion flag missing');
  assert(completion?.visualBoardsAuthored === false, 'brief may not claim visual boards authored');
  assert(completion?.visualBoardsHumanApproved === false, 'brief may not claim Human approval');
  assert(completion?.rasterMastersGenerated === false, 'brief may not claim generated raster Masters');
  assert(completion?.mayPromoteStoryCanon === false && completion?.mayPromoteRuntime === false, 'brief may not grant Story/runtime authority');
}

console.log(JSON.stringify({
  status: 'PASS',
  core5Ids,
  environmentBriefs: envIds.length,
  populationHouseholdBriefs: householdIds.length,
  populationLensCount: expectedPopulationLenses.length,
  exactYearOpenExceptYui2026: true,
  exactFamilyMembersFrozen: false,
  visualBoardsAuthored: false,
  imageGenerationAuthorized: false,
  humanReviewRequired: true
}, null, 2));
