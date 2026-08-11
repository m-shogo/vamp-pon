import { readFileSync } from 'node:fs';

import { ACHIEVEMENT_DEFS } from '../../src/game/data/achievements.ts';
import { forgottenStreetNightBoard } from '../../src/game/data/collectionProgress.ts';
import { collectionSections } from '../../src/game/data/collectionSections.ts';
import { series1StageCampaignContentEntries } from '../../src/game/data/series1StageCampaignContentSource.ts';
import { title1CombatItemPlacements } from '../../src/game/data/combatItemSelectionSource.ts';
import { selectedTitle1WeaponTransformations } from '../../src/game/data/weaponTransformationSelectionSource.ts';
import {
  title1AchievementRewardCollectionEntries,
  title1AchievementRewardCollectionSummary,
} from '../../src/game/data/title1AchievementRewardCollectionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sameOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

const stageIds = series1StageCampaignContentEntries.map((entry) => entry.stageId);
const rewardStageIds = title1AchievementRewardCollectionEntries.map((entry) => entry.stageId);
const allCollectionSectionIds = new Set(collectionSections.map((entry) => entry.id));
const revealedCollectionSections = new Set(title1AchievementRewardCollectionEntries.flatMap((entry) => entry.collectionReveal));

assert(series1StageCampaignContentEntries.length === 20, 'Series1 Stage authority must remain 20');
assert(title1AchievementRewardCollectionEntries.length === 20, 'reward collection master must cover all 20 stages');
assert(sameOrder(stageIds, rewardStageIds), 'reward collection master must preserve exact Stage1-20 order');
assert(new Set(rewardStageIds).size === 20, 'each Stage must appear exactly once');

assert(ACHIEVEMENT_DEFS.length === 14, `legacy runtime Achievement authority drifted from 14 to ${ACHIEVEMENT_DEFS.length}`);
assert(new Set(ACHIEVEMENT_DEFS.map((entry) => entry.id)).size === ACHIEVEMENT_DEFS.length, 'legacy Achievement IDs must remain unique');
assert(ACHIEVEMENT_DEFS.every((entry) => entry.reward > 0), 'legacy runtime Achievements should keep positive one-shot reward values');
assert(forgottenStreetNightBoard.cells.length === 25, `Forgotten Street board must remain 25 cells, got ${forgottenStreetNightBoard.cells.length}`);
assert(new Set(forgottenStreetNightBoard.cells.map((entry) => entry.id)).size === 25, 'Forgotten Street board cell IDs must remain unique');
assert(collectionSections.length === 6, `Collection section authority must remain 6, got ${collectionSections.length}`);

assert(title1CombatItemPlacements.length === 18, `Combat Item placement upstream must remain 18, got ${title1CombatItemPlacements.length}`);
assert(selectedTitle1WeaponTransformations.length === 29, `Title1 selected Transformation upstream must remain 29, got ${selectedTitle1WeaponTransformations.length}`);
assert(title1AchievementRewardCollectionSummary.legacyRuntimeAchievementCount === 14, 'summary must bind legacy Achievement14');
assert(title1AchievementRewardCollectionSummary.legacyForgottenStreetBoardCellCount === 25, 'summary must bind Stage1 board25');
assert(title1AchievementRewardCollectionSummary.placedCombatItemCount === 18, 'summary must bind Combat Item18');
assert(title1AchievementRewardCollectionSummary.selectedTransformationCount === 29, 'summary must bind selected Transformation29');

for (const sectionId of allCollectionSectionIds) {
  assert(revealedCollectionSections.has(sectionId), `Title1 reward loop never exposes Collection section: ${sectionId}`);
}

const kindCounts = Object.fromEntries(
  ['NATURAL', 'TARGETED', 'MASTERY', 'SECRET'].map((kind) => [
    kind,
    title1AchievementRewardCollectionEntries.filter((entry) => entry.milestoneKind === kind).length,
  ]),
);
assert(kindCounts.NATURAL === 8, `expected 8 NATURAL milestones, got ${kindCounts.NATURAL}`);
assert(kindCounts.TARGETED === 7, `expected 7 TARGETED milestones, got ${kindCounts.TARGETED}`);
assert(kindCounts.MASTERY === 4, `expected 4 MASTERY milestones, got ${kindCounts.MASTERY}`);
assert(kindCounts.SECRET === 1, `expected 1 SECRET milestone, got ${kindCounts.SECRET}`);

const laneCounts = title1AchievementRewardCollectionSummary.rewardLaneCounts as Record<string, number>;
assert(laneCounts.RECORD_ONLY === 2, `expected 2 record-only rewards, got ${laneCounts.RECORD_ONLY}`);
assert(laneCounts.LIGHT_COIN === 7, `expected 7 light-coin lanes, got ${laneCounts.LIGHT_COIN}`);
assert(laneCounts.TRAVEL_PREP === 3, `expected 3 travel-prep lanes, got ${laneCounts.TRAVEL_PREP}`);
assert(laneCounts.MEMORY_TEXT === 4, `expected 4 memory-text lanes, got ${laneCounts.MEMORY_TEXT}`);
assert(laneCounts.COSMETIC === 3, `expected 3 cosmetic lanes, got ${laneCounts.COSMETIC}`);
assert(laneCounts.SOUND === 1, `expected 1 sound lane, got ${laneCounts.SOUND}`);

for (const entry of title1AchievementRewardCollectionEntries) {
  assert(entry.title.trim().length >= 4, `${entry.stageId} milestone title is too vague`);
  assert(entry.condition.trim().length >= 12, `${entry.stageId} needs a concrete milestone condition`);
  assert(entry.nextRunPrompt.trim().length >= 20, `${entry.stageId} needs a concrete next-run prompt`);
  assert(entry.antiGrindGuard.trim().length >= 18, `${entry.stageId} needs an anti-grind guard`);
  assert(!entry.repeatableCurrencyReward, `${entry.stageId} must not become repeatable currency farm`);
  assert(!entry.readingRequiredForPower, `${entry.stageId} must not gate power behind reading`);
  assert(!entry.fullCollectionRequiredForClear, `${entry.stageId} must not require full Collection for clear`);
  assert(entry.runtimeStatus === 'CONTENT_SOURCE_ONLY', `${entry.stageId} reward master must stay content-only`);
  assert(!entry.runtimeAutoPromotionAllowed, `${entry.stageId} must not auto-promote runtime rewards`);
  assert(entry.rewardBudget !== 'LARGE', `${entry.stageId} content plan must not introduce a large raw reward before economy tuning`);
  for (const section of entry.collectionReveal) {
    assert(allCollectionSectionIds.has(section), `${entry.stageId} references unknown Collection section ${section}`);
  }
}

const stage1 = title1AchievementRewardCollectionEntries[0];
assert(stage1?.antiGrindGuard.includes('二重claim'), 'Stage1 must explicitly prevent duplicate reward claims with legacy Achievement/board systems');
const stage16 = title1AchievementRewardCollectionEntries[15];
assert(stage16?.antiGrindGuard.includes('出禁'), 'Stage16 must keep DARK friction from becoming a Character ban');
const stage20 = title1AchievementRewardCollectionEntries.at(-1);
assert(stage20?.rewardLane === 'COSMETIC', 'Stage20 Happy End reward should be non-power cosmetic in the content plan');
assert(stage20?.condition.includes('Happy End'), 'Stage20 milestone must represent Title1 Happy End');
assert(stage20?.antiGrindGuard.includes('Challenge100%'), 'Stage20 must not require completionist grind');
assert(!title1AchievementRewardCollectionSummary.clearRequiresFullCollection, 'Title1 clear must not require full collection');
assert(!title1AchievementRewardCollectionSummary.readingRequiredForPower, 'reading must stay optional for gameplay power');
assert(title1AchievementRewardCollectionSummary.repeatableCurrencyRewards === 0, 'repeatable currency milestone rewards must stay zero');
assert(!title1AchievementRewardCollectionSummary.runtimeAutoPromotionAllowed, 'content master must not auto-promote runtime');

const doc = readFileSync(new URL('../../docs/title1-achievement-reward-collection-source-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Stage1-20',
  'ACHIEVEMENT_DEFS',
  '25セル',
  'Stage → 達成 → 報酬 → 図鑑/星図 → 次runの別回答',
  'repeatable currency farm',
  'Combat Item 18',
  'Transformation Selected29 / Hold9',
  'Happy End',
  'runtimeAutoPromotionAllowed = false',
]) {
  assert(doc.includes(token), `achievement/reward/collection doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  stages: title1AchievementRewardCollectionSummary.stageCount,
  legacyAchievements: title1AchievementRewardCollectionSummary.legacyRuntimeAchievementCount,
  legacyStage1BoardCells: title1AchievementRewardCollectionSummary.legacyForgottenStreetBoardCellCount,
  collectionSections: title1AchievementRewardCollectionSummary.collectionSectionCount,
  combatItems: title1AchievementRewardCollectionSummary.placedCombatItemCount,
  selectedTransformations: title1AchievementRewardCollectionSummary.selectedTransformationCount,
  milestoneKindCounts: kindCounts,
  rewardLaneCounts: laneCounts,
  repeatableCurrencyRewards: 0,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
