import { readFileSync } from 'node:fs';

const queuePath = 'data/character-assets/manifests/core5-era-setting-board-execution-queue.v1.json';
const queue = JSON.parse(readFileSync(queuePath, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(queue.counts?.total === 10, 'Core5 setting-board queue must contain 10 entries');
assert(Array.isArray(queue.entries) && queue.entries.length === 10, 'Core5 setting-board queue entries must be 10');

const expectedEnvironmentPanels = [
  'E01-establishing-system-view',
  'E02-system-comparison-strip',
  'E03-material-prop-detail',
  'E04-human-use-and-friction',
  'E05-source-open-boundary',
];
const expectedHouseholdPanels = [
  'P01-six-population-lenses',
  'P02-household-system-variation',
  'P03-ordinary-task-distribution',
  'P04-system-access-differences',
  'P05-not-literal-family-boundary',
];

let environmentCount = 0;
let householdCount = 0;
for (const entry of queue.entries) {
  const board = JSON.parse(readFileSync(entry.plannedEditableBoardPath, 'utf8'));
  assert(board.assetId === entry.assetId, `${entry.assetId}: board assetId mismatch`);
  assert(board.characterId === entry.characterId, `${entry.assetId}: characterId mismatch`);
  assert(board.boardType === entry.boardType, `${entry.assetId}: boardType mismatch`);
  assert(board.status === 'EDITABLE_SETTING_BOARD_SPEC_AUTHORED_HUMAN_REVIEW_REQUIRED_NO_RASTER', `${entry.assetId}: authored status drift`);
  assert(board.imageGenerationAuthorized === false, `${entry.assetId}: image generation must remain blocked`);
  assert(board.humanReviewRequired === true, `${entry.assetId}: Human review must remain required`);
  assert(board.masterApproval === false, `${entry.assetId}: board may not self-approve as Master`);
  assert(board.runtimeApproval === false, `${entry.assetId}: board may not self-approve for runtime`);
  assert(Array.isArray(board.panels) && board.panels.length === 5, `${entry.assetId}: exactly five panels required`);

  const panelIds = board.panels.map((panel: any) => panel.id);
  const expected = entry.boardType === 'ENVIRONMENT' ? expectedEnvironmentPanels : expectedHouseholdPanels;
  assert(JSON.stringify(panelIds) === JSON.stringify(expected), `${entry.assetId}: panel contract mismatch`);
  assert(JSON.stringify(entry.requiredPanelIds) === JSON.stringify(expected), `${entry.assetId}: queue panel contract mismatch`);

  if (entry.characterId === 'yui') {
    assert(board.exactYearState === '2026_CURRENT', `${entry.assetId}: Yui must preserve 2026_CURRENT`);
  } else {
    assert(board.exactYearState === 'OPEN', `${entry.assetId}: exact year must remain OPEN`);
  }

  if (entry.boardType === 'ENVIRONMENT') {
    environmentCount += 1;
  } else {
    householdCount += 1;
    assert(board.literalFamilyCanonCreated === false, `${entry.assetId}: household board may not create literal family canon`);
    const boundary = board.panels.find((panel: any) => panel.id === 'P05-not-literal-family-boundary');
    assert(typeof boundary?.content === 'string' && boundary.content.length > 20, `${entry.assetId}: literal-family boundary note required`);
  }
}

assert(environmentCount === 5, `expected 5 environment boards, got ${environmentCount}`);
assert(householdCount === 5, `expected 5 household boards, got ${householdCount}`);

console.log(JSON.stringify({
  status: 'PASS',
  total: queue.entries.length,
  environment: environmentCount,
  populationHousehold: householdCount,
  imageGenerationAuthorized: false,
  humanReviewRequired: true,
}, null, 2));
