import { ACHIEVEMENT_DEFS } from './achievements.ts';
import { allLightsCompletionDraftSpecification } from './allLightsCompletion.ts';
import { title1CombatItemSelectionSummary } from './combatItemSelectionSource.ts';
import { currentCharacterCombatKitEntries } from './currentCharacterCombatKitSource.ts';
import {
  CURRENT_RELATIONSHIP_CHARACTER_IDS,
  currentRelationshipInventory,
} from './currentRelationshipInventory.ts';
import { enemyAttributeIdentities } from './enemyAttributeIdentitySource.ts';
import {
  allLightsCompletionDesign,
  characterObjectLineages,
} from './namedObjectRegistry.ts';
import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';
import { title1UnlockLearningProgressionEntries } from './title1UnlockLearningProgressionSource.ts';
import { weaponTransformationSelectionSummary } from './weaponTransformationSelectionSource.ts';

export type Title1CompletionLayer = 'STORY_COMPLETE' | 'GAME_COMPLETE' | 'MASTERY' | 'ALL_LIGHTS_100';

export type Title1EndingRequirementPolicy = {
  contentEndAnchorStageId: string;
  anchorStatus: 'CONTENT_END_ANCHOR_NOT_RUNTIME_TRIGGER';
  requiresAllLights: false;
  requiresAllAchievements: false;
  requiresAllCombatItems: false;
  requiresAllTransformations: false;
  requiresAllNightRecordsRead: false;
  requiresChallenge100Percent: false;
  requiresFutureTitleContent: false;
  mysteriesMayRemainOpen: true;
  runtimeGateFrozen: false;
};

export type AllLightsGroupSemantic = {
  groupId: string;
  displayName: string;
  designTargetCount: number;
  denominatorSource: string;
  contentMeaning: string;
  currentContentCount: number | null;
  currentCountSource: string;
  exactRuntimeDenominatorFrozen: false;
};

const allLightsGroupMeaning: Readonly<Record<string, { contentMeaning: string; currentContentCount: number | null; currentCountSource: string }>> = {
  night_roads: {
    contentMeaning: 'Series1 Stage20の夜路・route・boss・special clear群。',
    currentContentCount: series1StageCampaignContentEntries.length,
    currentCountSource: 'series1StageCampaignContentEntries',
  },
  keepers: {
    contentMeaning: 'Current21 Characterそれぞれのmeaningful play / safe return / Dawn proof群。',
    currentContentCount: currentCharacterCombatKitEntries.length,
    currentCountSource: 'currentCharacterCombatKitEntries',
  },
  item_lineages: {
    contentMeaning: 'Current21 Characterのnamed-object lineage。Combat Item18の個数ではない。',
    currentContentCount: characterObjectLineages.length,
    currentCountSource: 'characterObjectLineages',
  },
  kagemono: {
    contentMeaning: 'Current48 Kagemonoの観察・ほどき・connection群。',
    currentContentCount: enemyAttributeIdentities.length,
    currentCountSource: 'enemyAttributeIdentities',
  },
  bonds: {
    contentMeaning: 'Current21を一人ずつ関係の中で灯すBond proof群。relationship arc全24件を分母にする意味ではない。',
    currentContentCount: CURRENT_RELATIONSHIP_CHARACTER_IDS.length,
    currentCountSource: 'CURRENT_RELATIONSHIP_CHARACTER_IDS',
  },
  night_margin: {
    contentMeaning: '秘密route・optional observation・小さなseries anomalyを束ねる余白。exact node数はruntime freeze前に確定しない。',
    currentContentCount: null,
    currentCountSource: 'DESIGN_PLACEHOLDER_ONLY',
  },
};

export const title1StoryCompletePolicy: Title1EndingRequirementPolicy = {
  contentEndAnchorStageId: series1StageCampaignContentEntries.at(-1)?.stageId ?? '',
  anchorStatus: 'CONTENT_END_ANCHOR_NOT_RUNTIME_TRIGGER',
  requiresAllLights: false,
  requiresAllAchievements: false,
  requiresAllCombatItems: false,
  requiresAllTransformations: false,
  requiresAllNightRecordsRead: false,
  requiresChallenge100Percent: false,
  requiresFutureTitleContent: false,
  mysteriesMayRemainOpen: true,
  runtimeGateFrozen: false,
};

export const title1AllLightsGroupSemantics: readonly AllLightsGroupSemantic[] = allLightsCompletionDesign.groups.map((group) => {
  const semantic = allLightsGroupMeaning[group.id];
  if (!semantic) throw new Error(`missing All Lights group semantic: ${group.id}`);
  return {
    groupId: group.id,
    displayName: group.displayName,
    designTargetCount: group.designTargetCount,
    denominatorSource: group.denominatorSource,
    ...semantic,
    exactRuntimeDenominatorFrozen: false,
  };
});

export const title1CompletionLayerPolicy = {
  STORY_COMPLETE: {
    label: 'Story Complete',
    meaning: 'Main Happy End。作品の感情決着。100%収集や全謎解明を要求しない。',
    blocksCredits: false,
    optionalAfterStory: false,
  },
  GAME_COMPLETE: {
    label: 'Game Complete',
    meaning: 'Main Stage / system / core buildを十分遊んだ状態。Story Completeとは別の遊び込み層。',
    blocksCredits: false,
    optionalAfterStory: true,
  },
  MASTERY: {
    label: 'Mastery',
    meaning: 'Character / Pair / Challengeを深く遊ぶ層。Main powerやHappy Endを閉じ込めない。',
    blocksCredits: false,
    optionalAfterStory: true,
  },
  ALL_LIGHTS_100: {
    label: '100% / 全灯',
    meaning: 'launch scopeの有限な記憶のしるしとnamed-object connectionを全て灯した後の最大級の祝福。',
    blocksCredits: false,
    optionalAfterStory: true,
  },
} as const satisfies Record<Title1CompletionLayer, {
  label: string;
  meaning: string;
  blocksCredits: boolean;
  optionalAfterStory: boolean;
}>;

export const title1AchievementBoundary = {
  currentRuntimeAchievementCount: ACHIEVEMENT_DEFS.length,
  authorityStatus: 'LEGACY_RUNTIME_CATALOG_NOT_STAGE20_COMPLETION_AUTHORITY' as const,
  requiredForStoryComplete: false,
  rewardActsAsStoryGate: false,
  stage20CoverageClaimed: false,
  expansionMayBeAddedLater: true,
} as const;

export const title1AllLightsBoundary = {
  rewardId: allLightsCompletionDesign.rewardId,
  rewardDisplayName: allLightsCompletionDesign.rewardDisplayName,
  groupCount: allLightsCompletionDesign.groups.length,
  designTargetTotal: allLightsCompletionDesign.groups.reduce((sum, group) => sum + group.designTargetCount, 0),
  designRuntimeFrozen: allLightsCompletionDesign.runtimeFrozen,
  draftRuntimeFrozen: allLightsCompletionDraftSpecification.runtimeFrozen,
  exactRuntimeDenominatorFrozen: false,
  requiredForStoryComplete: false,
  requiredForCredits: false,
  optionalPostgameCelebration: true,
  readingEveryTextRequired: false,
  everyConversationReadRequired: false,
  dailyWeeklyActivityRequired: false,
  limitedEventRequired: false,
  runtimeAutoFreezeAllowed: false,
} as const;

export const title1CompletionCrossMasterSnapshot = {
  stageCount: series1StageCampaignContentEntries.length,
  finalStageId: series1StageCampaignContentEntries.at(-1)?.stageId ?? null,
  unlockLearningStageCount: title1UnlockLearningProgressionEntries.length,
  currentCharacterCount: currentCharacterCombatKitEntries.length,
  enemyCount: enemyAttributeIdentities.length,
  characterObjectLineageCount: characterObjectLineages.length,
  relationshipArcCount: currentRelationshipInventory.length,
  bondProofCharacterCount: CURRENT_RELATIONSHIP_CHARACTER_IDS.length,
  combatItemCandidateCount: title1CombatItemSelectionSummary.selectedCount,
  transformationSelectedCount: weaponTransformationSelectionSummary.selectedCount,
  transformationHeldCount: weaponTransformationSelectionSummary.heldCount,
  runtimeAchievementCount: ACHIEVEMENT_DEFS.length,
  storyCompleteRequiresCombatItem18: false,
  storyCompleteRequiresTransformation29: false,
  itemLineageDenominatorUsesCombatItem18: false,
  bondDenominatorUsesRelationshipArc24: false,
  futureContentRequiredForStoryComplete: false,
} as const;
