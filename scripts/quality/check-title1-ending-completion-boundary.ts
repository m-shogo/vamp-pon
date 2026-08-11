import { readFileSync } from 'node:fs';

import { ACHIEVEMENT_DEFS } from '../../src/game/data/achievements.ts';
import { allLightsCompletionDraftSpecification } from '../../src/game/data/allLightsCompletion.ts';
import { title1CombatItemSelectionSummary } from '../../src/game/data/combatItemSelectionSource.ts';
import { currentCharacterCombatKitEntries } from '../../src/game/data/currentCharacterCombatKitSource.ts';
import {
  CURRENT_RELATIONSHIP_CHARACTER_IDS,
  currentRelationshipInventory,
} from '../../src/game/data/currentRelationshipInventory.ts';
import { enemyAttributeIdentities } from '../../src/game/data/enemyAttributeIdentitySource.ts';
import { allLightsCompletionDesign, characterObjectLineages } from '../../src/game/data/namedObjectRegistry.ts';
import { series1StageCampaignContentEntries } from '../../src/game/data/series1StageCampaignContentSource.ts';
import { title1UnlockLearningProgressionEntries } from '../../src/game/data/title1UnlockLearningProgressionSource.ts';
import { weaponTransformationSelectionSummary } from '../../src/game/data/weaponTransformationSelectionSource.ts';
import {
  title1AchievementBoundary,
  title1AllLightsBoundary,
  title1AllLightsGroupSemantics,
  title1CompletionCrossMasterSnapshot,
  title1CompletionLayerPolicy,
  title1StoryCompletePolicy,
} from '../../src/game/data/title1EndingCompletionBoundarySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(series1StageCampaignContentEntries.length === 20, 'Series1 Stage content must remain 20');
assert(series1StageCampaignContentEntries.at(-1)?.stageId === 'dawn_return_square', 'Stage20 content end anchor must remain dawn_return_square');
assert(title1UnlockLearningProgressionEntries.length === 20, 'unlock learning progression must remain aligned to Stage20');
assert(title1StoryCompletePolicy.contentEndAnchorStageId === 'dawn_return_square', 'Story Complete content anchor must be Stage20 dawn_return_square');
assert(title1StoryCompletePolicy.anchorStatus === 'CONTENT_END_ANCHOR_NOT_RUNTIME_TRIGGER', 'content ending anchor must not pretend runtime gate is frozen');
assert(!title1StoryCompletePolicy.runtimeGateFrozen, 'exact runtime Happy End gate must remain unfrozen in this content policy');
assert(title1StoryCompletePolicy.mysteriesMayRemainOpen, 'Happy End must not require every mystery to be solved');

for (const [key, required] of Object.entries({
  requiresAllLights: title1StoryCompletePolicy.requiresAllLights,
  requiresAllAchievements: title1StoryCompletePolicy.requiresAllAchievements,
  requiresAllCombatItems: title1StoryCompletePolicy.requiresAllCombatItems,
  requiresAllTransformations: title1StoryCompletePolicy.requiresAllTransformations,
  requiresAllNightRecordsRead: title1StoryCompletePolicy.requiresAllNightRecordsRead,
  requiresChallenge100Percent: title1StoryCompletePolicy.requiresChallenge100Percent,
  requiresFutureTitleContent: title1StoryCompletePolicy.requiresFutureTitleContent,
})) {
  assert(required === false, `Story Complete must not gate on ${key}`);
}

assert(allLightsCompletionDesign.groups.length === 6, `All Lights design must remain six groups, got ${allLightsCompletionDesign.groups.length}`);
assert(allLightsCompletionDesign.runtimeFrozen === false, 'All Lights design denominator must not be runtime-frozen yet');
assert(allLightsCompletionDraftSpecification.runtimeFrozen === false, 'All Lights draft specification must remain locked/unfrozen');
assert(allLightsCompletionDraftSpecification.groups.every((group) => group.requiredIds.length === 0), 'draft All Lights runtime denominator must not silently gain IDs');
assert(title1AllLightsBoundary.groupCount === 6, 'All Lights boundary must expose six design groups');
assert(title1AllLightsBoundary.designTargetTotal === 132, `All Lights design target total should remain 132, got ${title1AllLightsBoundary.designTargetTotal}`);
assert(title1AllLightsBoundary.rewardId === 'all-lights-morning', 'All Lights reward ID drift');
assert(title1AllLightsBoundary.rewardDisplayName === '全灯の朝', 'All Lights reward display name drift');
assert(!title1AllLightsBoundary.designRuntimeFrozen && !title1AllLightsBoundary.draftRuntimeFrozen, 'All Lights must remain design-only denominator');
assert(!title1AllLightsBoundary.exactRuntimeDenominatorFrozen, 'exact All Lights runtime denominator must remain unfrozen');
assert(!title1AllLightsBoundary.requiredForStoryComplete, 'All Lights must not gate Story Complete');
assert(!title1AllLightsBoundary.requiredForCredits, 'All Lights must not gate credits');
assert(title1AllLightsBoundary.optionalPostgameCelebration, 'All Lights must remain optional postgame celebration');
assert(!title1AllLightsBoundary.readingEveryTextRequired, 'All Lights must not require reading every text');
assert(!title1AllLightsBoundary.everyConversationReadRequired, 'All Lights must not require every conversation read');
assert(!title1AllLightsBoundary.dailyWeeklyActivityRequired, 'All Lights must not require daily/weekly activity');
assert(!title1AllLightsBoundary.limitedEventRequired, 'All Lights must not require limited-time events');
assert(!title1AllLightsBoundary.runtimeAutoFreezeAllowed, 'content policy must not auto-freeze All Lights denominator');

const expectedGroupTargets: Readonly<Record<string, number>> = {
  night_roads: 20,
  keepers: 21,
  item_lineages: 21,
  kagemono: 48,
  bonds: 21,
  night_margin: 1,
};
const semanticsById = new Map(title1AllLightsGroupSemantics.map((entry) => [entry.groupId, entry]));
for (const [groupId, count] of Object.entries(expectedGroupTargets)) {
  const semantic = semanticsById.get(groupId);
  assert(semantic, `missing All Lights semantic group: ${groupId}`);
  assert(semantic.designTargetCount === count, `${groupId} design target drift: ${semantic.designTargetCount}`);
  assert(!semantic.exactRuntimeDenominatorFrozen, `${groupId} must not claim exact runtime denominator`);
}

assert(semanticsById.get('night_roads')?.currentContentCount === series1StageCampaignContentEntries.length, 'night_roads should track Stage20 content count');
assert(semanticsById.get('keepers')?.currentContentCount === currentCharacterCombatKitEntries.length, 'keepers should track Current21');
assert(semanticsById.get('item_lineages')?.currentContentCount === characterObjectLineages.length, 'item_lineages should track Character named-object lineages');
assert(semanticsById.get('kagemono')?.currentContentCount === enemyAttributeIdentities.length, 'kagemono should track Enemy48');
assert(semanticsById.get('bonds')?.currentContentCount === CURRENT_RELATIONSHIP_CHARACTER_IDS.length, 'bonds should track Current21 bond proof count');
assert(semanticsById.get('night_margin')?.currentContentCount === null, 'night_margin exact node denominator must remain open');

assert(currentCharacterCombatKitEntries.length === 21, 'Current21 drift');
assert(characterObjectLineages.length === 21, 'Character item-lineage count must remain 21');
assert(enemyAttributeIdentities.length === 48, 'Enemy48 drift');
assert(CURRENT_RELATIONSHIP_CHARACTER_IDS.length === 21, 'Current21 relationship character coverage drift');
assert(currentRelationshipInventory.length === 24, 'relationship arc inventory should remain 24 while bond completion target remains per Current21');
assert(title1CombatItemSelectionSummary.selectedCount === 18, 'Combat Item candidate placement must remain 18');
assert(weaponTransformationSelectionSummary.selectedCount === 29, 'Title1 selected Transformation count must remain 29');
assert(weaponTransformationSelectionSummary.heldCount === 9, 'Title1 held Transformation count must remain 9');
assert(semanticsById.get('item_lineages')?.currentContentCount !== title1CombatItemSelectionSummary.selectedCount, 'item_lineages must not be reinterpreted as Combat Item18');
assert(semanticsById.get('bonds')?.currentContentCount !== currentRelationshipInventory.length, 'bond denominator must not silently become all relationship arcs');

assert(ACHIEVEMENT_DEFS.length === 14, `legacy runtime Achievement catalog drift: ${ACHIEVEMENT_DEFS.length}`);
assert(title1AchievementBoundary.currentRuntimeAchievementCount === 14, 'Achievement boundary must acknowledge current runtime14');
assert(title1AchievementBoundary.authorityStatus === 'LEGACY_RUNTIME_CATALOG_NOT_STAGE20_COMPLETION_AUTHORITY', 'legacy Achievement catalog must not be mislabeled Stage20 authority');
assert(!title1AchievementBoundary.requiredForStoryComplete, 'Achievements must not gate Story Complete');
assert(!title1AchievementBoundary.rewardActsAsStoryGate, 'Achievement reward must not act as story gate');
assert(!title1AchievementBoundary.stage20CoverageClaimed, 'legacy Achievement14 must not claim Stage20 editorial coverage');

assert(title1CompletionLayerPolicy.STORY_COMPLETE.optionalAfterStory === false, 'Story Complete is the story completion layer itself');
assert(title1CompletionLayerPolicy.GAME_COMPLETE.optionalAfterStory, 'Game Complete should be optional after story');
assert(title1CompletionLayerPolicy.MASTERY.optionalAfterStory, 'Mastery should be optional after story');
assert(title1CompletionLayerPolicy.ALL_LIGHTS_100.optionalAfterStory, 'All Lights should be optional after story');
for (const layer of Object.values(title1CompletionLayerPolicy)) {
  assert(!layer.blocksCredits, `${layer.label} must not independently block credits in this content policy`);
  assert(layer.meaning.length >= 30, `${layer.label} needs explicit meaning`);
}

assert(title1CompletionCrossMasterSnapshot.stageCount === 20, 'cross-master Stage count drift');
assert(title1CompletionCrossMasterSnapshot.currentCharacterCount === 21, 'cross-master Character count drift');
assert(title1CompletionCrossMasterSnapshot.enemyCount === 48, 'cross-master Enemy count drift');
assert(title1CompletionCrossMasterSnapshot.characterObjectLineageCount === 21, 'cross-master lineage count drift');
assert(title1CompletionCrossMasterSnapshot.relationshipArcCount === 24, 'cross-master relationship arc count drift');
assert(title1CompletionCrossMasterSnapshot.bondProofCharacterCount === 21, 'cross-master bond proof count drift');
assert(title1CompletionCrossMasterSnapshot.combatItemCandidateCount === 18, 'cross-master Combat Item count drift');
assert(title1CompletionCrossMasterSnapshot.transformationSelectedCount === 29, 'cross-master Transformation selected count drift');
assert(title1CompletionCrossMasterSnapshot.transformationHeldCount === 9, 'cross-master Transformation hold count drift');
assert(!title1CompletionCrossMasterSnapshot.storyCompleteRequiresCombatItem18, 'Combat Item18 cannot gate Story Complete');
assert(!title1CompletionCrossMasterSnapshot.storyCompleteRequiresTransformation29, 'Transformation29 cannot gate Story Complete');
assert(!title1CompletionCrossMasterSnapshot.itemLineageDenominatorUsesCombatItem18, 'item lineage denominator must not use Combat Item18');
assert(!title1CompletionCrossMasterSnapshot.bondDenominatorUsesRelationshipArc24, 'bond denominator must not use all 24 relationship arcs');
assert(!title1CompletionCrossMasterSnapshot.futureContentRequiredForStoryComplete, 'Future content must not gate Title1 Story Complete');

const doc = readFileSync(new URL('../../docs/title1-ending-completion-boundary-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Story Complete',
  'Game Complete',
  'Mastery',
  '100% / 全灯',
  '全灯の朝',
  '20 / 21 / 21 / 48 / 21 / 1',
  'Combat Item18ではない',
  'Relationship Arc24ではない',
  'Achievement14',
  'runtimeFrozen=false',
  'Happy End',
  'Future15',
]) {
  assert(doc.includes(token), `Ending/completion boundary doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  storyEndAnchor: title1StoryCompletePolicy.contentEndAnchorStageId,
  allLights: {
    groups: title1AllLightsBoundary.groupCount,
    designTargetTotal: title1AllLightsBoundary.designTargetTotal,
    runtimeFrozen: false,
    requiredForStoryComplete: false,
  },
  contentCounts: {
    stages: title1CompletionCrossMasterSnapshot.stageCount,
    characters: title1CompletionCrossMasterSnapshot.currentCharacterCount,
    itemLineages: title1CompletionCrossMasterSnapshot.characterObjectLineageCount,
    enemies: title1CompletionCrossMasterSnapshot.enemyCount,
    relationshipArcs: title1CompletionCrossMasterSnapshot.relationshipArcCount,
    bondProofCharacters: title1CompletionCrossMasterSnapshot.bondProofCharacterCount,
    combatItems: title1CompletionCrossMasterSnapshot.combatItemCandidateCount,
    transformationsSelected: title1CompletionCrossMasterSnapshot.transformationSelectedCount,
  },
  legacyAchievements: title1AchievementBoundary.currentRuntimeAchievementCount,
}, null, 2));
