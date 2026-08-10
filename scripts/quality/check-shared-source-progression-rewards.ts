import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { ACHIEVEMENT_DEFS } from '../../src/game/data/achievements.ts';
import { allLightsCompletionDraftSpecification } from '../../src/game/data/allLightsCompletion.ts';
import {
  FORGOTTEN_STREET_BOARD_ID,
  forgottenStreetNightBoardCells,
} from '../../src/game/data/collectionProgress.ts';
import { allLightsCompletionDesign } from '../../src/game/data/namedObjectRegistry.ts';
import {
  CLEAR_GETTER_VISUAL_RULES,
  achievementSharedSourceEntries,
  clearGetterSharedSourceEntries,
  progressionRewardSharedSourceSummary,
  rewardSharedSourceEntries,
  unlockableSharedSourceEntries,
} from '../../src/game/data/progressionRewardSharedSource.ts';
import { stageRecipes } from '../../src/game/data/waves.ts';

function fail(message: string): never {
  throw new Error(`[Shared Source Progression Rewards] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function assertPath(path: string, owner: string): void {
  assert(existsSync(resolve(path)), `${owner}: missing authority path ${path}`);
}

assert(FORGOTTEN_STREET_BOARD_ID === 'forgotten_street_night_board', 'Stage1 board ID drift');
assert(forgottenStreetNightBoardCells.length === 25, `Stage1 Clear Getter source count drift: ${forgottenStreetNightBoardCells.length}`);
assert(clearGetterSharedSourceEntries.length === forgottenStreetNightBoardCells.length, 'Clear Getter adapter coverage drift');
assert(new Set(clearGetterSharedSourceEntries.map((entry) => entry.id)).size === clearGetterSharedSourceEntries.length, 'duplicate Clear Getter Shared Source id');
assert(
  JSON.stringify(clearGetterSharedSourceEntries.map((entry) => entry.id)) === JSON.stringify(forgottenStreetNightBoardCells.map((entry) => entry.id)),
  'Clear Getter Shared Source must preserve source cell ID/order',
);
assert(Object.keys(CLEAR_GETTER_VISUAL_RULES).sort().join(',') === ['mastery', 'natural', 'secret', 'targeted'].sort().join(','), 'Clear Getter kind visual rule coverage drift');

for (const [index, entry] of clearGetterSharedSourceEntries.entries()) {
  const source = forgottenStreetNightBoardCells[index];
  assert(entry.idOrigin === 'SOURCE_ID', `${entry.id}: Clear Getter id must be source-owned`);
  assert(entry.displayName === source.title, `${entry.id}: title authority drift`);
  assert(entry.category === source.kind, `${entry.id}: cell kind authority drift`);
  assert(entry.conditionSummary === source.condition, `${entry.id}: condition authority drift`);
  assert(entry.boardId === source.boardId, `${entry.id}: board relation drift`);
  assert(entry.progressType === 'BOOLEAN_COMPLETION' && entry.progressTarget === 1, `${entry.id}: board runtime is boolean completion`);
  assert(entry.rewardId === `clear-getter-reward:${entry.id}`, `${entry.id}: deterministic reward adapter ID drift`);
  assert(entry.visualAuthority === 'CANDIDATE_VISUAL_GRAMMAR', `${entry.id}: unapproved visual grammar promoted`);
  assert(entry.referenceGenerationReady === false, `${entry.id}: candidate mark must not become generation-ready`);
  assert(entry.runtimeReady === true, `${entry.id}: existing Stage1 cell should stay runtime-backed`);
  assert(entry.artworkReady === false && entry.artworkState === 'NOT_GENERATED', `${entry.id}: artwork readiness inferred`);
  assert(entry.stageRelationIds.length === 0, `${entry.id}: stable production Stage relation must not be guessed from legacy board text`);
  assert(entry.relationStatus === 'SOURCE_TEXT_ONLY_PENDING_STABLE_ID_LINKS', `${entry.id}: relation boundary drift`);
  assert(!/toumon itself/i.test(entry.iconShapeRule), `${entry.id}: icon rule should describe own candidate mark, not Toumon`);
  assert(/Toumon/i.test(entry.generationBriefSeed), `${entry.id}: Toumon separation warning missing`);
  if (source.kind === 'secret') {
    assert(entry.hiddenUntilUnlocked === true, `${entry.id}: secret must remain hidden`);
    assert(entry.spoilerTier === 'DEEP_SPOILER', `${entry.id}: secret spoiler tier drift`);
  }
}

assert(achievementSharedSourceEntries.length === ACHIEVEMENT_DEFS.length, `Achievement coverage drift: ${achievementSharedSourceEntries.length}/${ACHIEVEMENT_DEFS.length}`);
assert(new Set(achievementSharedSourceEntries.map((entry) => entry.id)).size === achievementSharedSourceEntries.length, 'duplicate Achievement Shared Source id');
assert(
  JSON.stringify(achievementSharedSourceEntries.map((entry) => entry.id)) === JSON.stringify(ACHIEVEMENT_DEFS.map((entry) => entry.id)),
  'Achievement Shared Source must preserve runtime ID/order',
);
for (const [index, entry] of achievementSharedSourceEntries.entries()) {
  const source = ACHIEVEMENT_DEFS[index];
  assert(entry.displayName === source.title, `${entry.id}: achievement title authority drift`);
  assert(entry.conditionSummary === source.description, `${entry.id}: achievement condition authority drift`);
  assert(entry.category === source.category, `${entry.id}: achievement category authority drift`);
  assert(entry.rewardId === `achievement-reward:${entry.id}`, `${entry.id}: achievement reward adapter ID drift`);
  assert(entry.runtimeReady === true, `${entry.id}: runtime achievement adapter lost readiness`);
  assert(entry.referenceGenerationReady === false, `${entry.id}: candidate achievement mark promoted without approval`);
  assert(entry.relationStatus === 'RUNTIME_STAGE_NUMBER_TO_PRODUCTION_STAGE_ID_UNRESOLVED', `${entry.id}: runtime/production Stage mapping silently asserted`);
  assert(entry.stageRelationIds.length === 0, `${entry.id}: production Stage relation must remain empty until migration authority exists`);
}

const expectedRewardCount = forgottenStreetNightBoardCells.length + ACHIEVEMENT_DEFS.length + 1;
assert(rewardSharedSourceEntries.length === expectedRewardCount, `Reward coverage drift: ${rewardSharedSourceEntries.length}/${expectedRewardCount}`);
assert(new Set(rewardSharedSourceEntries.map((entry) => entry.id)).size === rewardSharedSourceEntries.length, 'duplicate Reward Shared Source id');

for (const reward of rewardSharedSourceEntries) {
  assert(reward.referenceGenerationReady === false, `${reward.id}: reward presentation promoted without approved visual authority`);
  assert(reward.artworkReady === false && reward.artworkState === 'NOT_GENERATED', `${reward.id}: reward artwork inferred`);
  assert(reward.relationStatus === 'SOURCE_EXPLICIT_ONLY', `${reward.id}: reward relation must stay source-explicit`);
  for (const path of reward.authoritySources) assertPath(path, reward.id);
}

for (const source of forgottenStreetNightBoardCells) {
  const reward = rewardSharedSourceEntries.find((entry) => entry.id === `clear-getter-reward:${source.id}`);
  assert(reward, `${source.id}: missing normalized Clear Getter reward`);
  assert(reward.sourceId === source.id, `${source.id}: reward source relation drift`);
  assert(reward.amount === source.reward.amount, `${source.id}: reward amount drift`);
  assert(reward.payloadId === source.reward.memoryTextId, `${source.id}: reward payload drift`);
  assert(reward.runtimeReady === true, `${source.id}: Stage1 board reward should stay runtime-backed`);
}

for (const source of ACHIEVEMENT_DEFS) {
  const reward = rewardSharedSourceEntries.find((entry) => entry.id === `achievement-reward:${source.id}`);
  assert(reward, `${source.id}: missing normalized Achievement reward`);
  assert(reward.rewardType === 'RUNTIME_META_CURRENCY', `${source.id}: achievement reward type drift`);
  assert(reward.amount === source.reward, `${source.id}: achievement numeric reward drift`);
  assert(reward.runtimeReady === true, `${source.id}: achievement reward should stay runtime-backed`);
  assert(/existing meta-currency/i.test(reward.iconRule), `${source.id}: separate currency icon must not be invented`);
}

const allLightsReward = rewardSharedSourceEntries.find((entry) => entry.id === allLightsCompletionDesign.rewardId);
assert(allLightsReward, 'All Lights reward Shared Source missing');
assert(allLightsCompletionDesign.runtimeFrozen === false, 'All Lights design denominator unexpectedly frozen');
assert(allLightsCompletionDraftSpecification.runtimeFrozen === false, 'All Lights runtime draft unexpectedly frozen');
assert(allLightsReward.runtimeReady === false, 'All Lights reward must remain runtime blocked');
assert(allLightsReward.previewSafe === false, 'All Lights reward must remain spoiler-safe by default');
assert(allLightsReward.referenceGenerationReady === false, 'All Lights final reward art must remain held');
assert(/True End/i.test(allLightsReward.presentationRule), 'All Lights not-True-End boundary missing');

const expectedUnlockables = stageRecipes.filter((recipe) => recipe.stageNumber > 1);
assert(unlockableSharedSourceEntries.length === expectedUnlockables.length, `runtime Stage unlock coverage drift: ${unlockableSharedSourceEntries.length}/${expectedUnlockables.length}`);
for (const [index, unlockable] of unlockableSharedSourceEntries.entries()) {
  const source = expectedUnlockables[index];
  assert(unlockable.runtimeStageNumber === source.stageNumber, `${unlockable.id}: runtime Stage number drift`);
  assert(unlockable.runtimeStageRecipeId === source.id, `${unlockable.id}: Stage recipe ID drift`);
  assert(unlockable.productionStageRelation === 'UNRESOLVED_LEGACY_RUNTIME_SLOT', `${unlockable.id}: legacy runtime Stage silently mapped to production Stage`);
  assert(unlockable.referenceGenerationReady === false, `${unlockable.id}: unresolved Stage slot must not generate canonical key art`);
  assert(unlockable.runtimeReady === true, `${unlockable.id}: stage recipe unlock should remain runtime-backed`);
  for (const path of unlockable.authoritySources) assertPath(path, unlockable.id);
}

assert(progressionRewardSharedSourceSummary.clearGetterCells === 25, 'summary Clear Getter count drift');
assert(progressionRewardSharedSourceSummary.achievements === ACHIEVEMENT_DEFS.length, 'summary Achievement count drift');
assert(progressionRewardSharedSourceSummary.rewards === expectedRewardCount, 'summary Reward count drift');
assert(progressionRewardSharedSourceSummary.allLightsRuntimeFrozen === false, 'summary All Lights runtime state drift');
assert(progressionRewardSharedSourceSummary.candidateVisualGrammarApproved === false, 'candidate visual grammar approval inferred');

console.log(
  `Shared Source Progression Rewards: PASS (` +
    `clearGetter=${clearGetterSharedSourceEntries.length}, achievements=${achievementSharedSourceEntries.length}, ` +
    `rewards=${rewardSharedSourceEntries.length}, runtimeStageUnlocks=${unlockableSharedSourceEntries.length}, allLights=fail-closed)`,
);
