import {
  COMBAT_ATTRIBUTES,
  attributeReactions,
  statusDefinitions,
} from './combatAffinitySource.ts';
import { baseWeaponSelectionSummary } from './baseWeaponSelectionSource.ts';
import { title1CombatItemSelectionSummary } from './combatItemSelectionSource.ts';
import { currentCharacterCombatKitEntries } from './currentCharacterCombatKitSource.ts';
import { current21YatsukageRelationshipSummary } from './current21YatsukageRelationshipSource.ts';
import { currentGroupInteractionSummary } from './currentGroupInteractionSource.ts';
import { currentRelationshipInventory } from './currentRelationshipInventory.ts';
import { enemyAttributeIdentities } from './enemyAttributeIdentitySource.ts';
import { pairwiseBondTrioBattleSummary } from './pairwiseBondTrioBattleSource.ts';
import { relationshipStageIntermissionSummary } from './relationshipStageIntermissionSource.ts';
import { currentRelationshipSpeechProgressionSummary } from './relationshipSpeechProgressionSource.ts';
import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';
import { spotlightEnemyCharacterSummary } from './spotlightEnemyCharacterSource.ts';
import { spotlightEnemyStoryFragmentSummary } from './spotlightEnemyStoryFragmentSource.ts';
import { trioBattleInteractionPolicySummary } from './trioBattleInteractionPolicySource.ts';
import {
  title1AchievementBoundary,
  title1AllLightsBoundary,
  title1StoryCompletePolicy,
} from './title1EndingCompletionBoundarySource.ts';
import {
  TITLE1_COLLECTION_SECTION_IDS,
  title1AchievementRewardCollectionSummary,
} from './title1AchievementRewardCollectionSource.ts';
import { title1UnlockLearningProgressionSummary } from './title1UnlockLearningProgressionSource.ts';
import { weaponTransformationSelectionSummary } from './weaponTransformationSelectionSource.ts';
import { yatsukageCollectionPresentationSummary } from './yatsukageCollectionPresentationSource.ts';
import { yatsukageEncounterMemorySummary } from './yatsukageEncounterMemorySource.ts';
import { yatsukageIdentitySummary } from './yatsukageIdentitySource.ts';
import { yatsukagePairDynamicsSummary } from './yatsukagePairDynamicsSource.ts';

export const title1ContentMasterAuthorities = {
  combatAffinity: 'src/game/data/combatAffinitySource.ts',
  stage20: 'src/game/data/series1StageCampaignContentSource.ts',
  current21CombatKit: 'src/game/data/currentCharacterCombatKitSource.ts',
  enemy48: 'src/game/data/enemyAttributeIdentitySource.ts',
  enemyEncounter: 'src/game/data/enemyEncounterSynergySource.ts',
  relationship: 'src/game/data/currentRelationshipInventory.ts',
  relationshipSpeech: 'src/game/data/relationshipSpeechProgressionSource.ts',
  groupInteraction: 'src/game/data/currentGroupInteractionSource.ts',
  relationshipIntermission: 'src/game/data/relationshipStageIntermissionSource.ts',
  pairwiseBondTrioBattle: 'src/game/data/pairwiseBondTrioBattleSource.ts',
  trioBattleInteraction: 'src/game/data/trioBattleInteractionPolicySource.ts',
  spotlightEnemyCharacter: 'src/game/data/spotlightEnemyCharacterSource.ts',
  spotlightEnemyStoryFragment: 'src/game/data/spotlightEnemyStoryFragmentSource.ts',
  yatsukageIdentity: 'src/game/data/yatsukageIdentitySource.ts',
  yatsukageCollectionPresentation: 'src/game/data/yatsukageCollectionPresentationSource.ts',
  current21YatsukageRelationship: 'src/game/data/current21YatsukageRelationshipSource.ts',
  yatsukageEncounterMemory: 'src/game/data/yatsukageEncounterMemorySource.ts',
  yatsukagePairDynamics: 'src/game/data/yatsukagePairDynamicsSource.ts',
  baseWeapon: 'src/game/data/baseWeaponSelectionSource.ts',
  combatItem: 'src/game/data/combatItemSelectionSource.ts',
  transformation: 'src/game/data/weaponTransformationSelectionSource.ts',
  unlockLearning: 'src/game/data/title1UnlockLearningProgressionSource.ts',
  endingCompletion: 'src/game/data/title1EndingCompletionBoundarySource.ts',
  achievementRewardCollection: 'src/game/data/title1AchievementRewardCollectionSource.ts',
} as const;

export const title1ContentMasterIntegritySnapshot = {
  title: 'ヨルノシルベ1',
  authorityStatus: 'CONTENT_MASTER_INTEGRATED_RUNTIME_PROMOTION_GATED' as const,
  stages: {
    count: series1StageCampaignContentEntries.length,
    firstStageId: series1StageCampaignContentEntries.at(0)?.stageId ?? null,
    finalStageId: series1StageCampaignContentEntries.at(-1)?.stageId ?? null,
  },
  characters: {
    currentCount: currentCharacterCombatKitEntries.length,
    relationshipArcCount: currentRelationshipInventory.length,
    relationshipSpeechDirectedTrackCount: currentRelationshipSpeechProgressionSummary.directedTrackCount,
    groupInteractionSceneCount: currentGroupInteractionSummary.sceneCount,
    groupIntermissionPlacementCount: relationshipStageIntermissionSummary.placementCount,
    allPairBondLaneCount: pairwiseBondTrioBattleSummary.allPairCount,
    directedAffinityLaneCount: pairwiseBondTrioBattleSummary.directedAffinityLaneCount,
    possibleTrioCombinationCount: pairwiseBondTrioBattleSummary.possibleTrioCombinationCount,
    storedTrioBondExists: pairwiseBondTrioBattleSummary.storedTrioBondExists,
    trioPresentationShapeCount: trioBattleInteractionPolicySummary.derivedPresentationShapeCount,
  },
  enemies: {
    currentCount: enemyAttributeIdentities.length,
    spotlightCount: spotlightEnemyCharacterSummary.spotlightCount,
    spotlightStoryFragmentCount: spotlightEnemyStoryFragmentSummary.fragmentCount,
    spotlightFragmentsOptional: spotlightEnemyStoryFragmentSummary.optionalReading,
    yatsukageFormalName: yatsukageIdentitySummary.formalName,
    yatsukageShortName: yatsukageIdentitySummary.shortName,
    yatsukageCallNameCount: yatsukageIdentitySummary.uniqueCallNameCount,
    yatsukagePresentationPhaseCount: yatsukageCollectionPresentationSummary.presentationPhaseCount,
    yatsukageTrueNameClaimedCount: yatsukageCollectionPresentationSummary.trueNameClaimedCount,
    current21RelationCount: current21YatsukageRelationshipSummary.relationCount,
    current21FeaturedRelationCount: current21YatsukageRelationshipSummary.featuredArcCount,
    current21BaselineRelationCount: current21YatsukageRelationshipSummary.baselineReactionCount,
    encounterMemoryPhaseCount: yatsukageEncounterMemorySummary.phaseCount,
    encounterMemoryCombatClearProgressValue: yatsukageEncounterMemorySummary.combatClearProgressValue,
    encounterMemoryRuntimeImplemented: yatsukageEncounterMemorySummary.runtimeImplemented,
    yatsukagePairCount: yatsukagePairDynamicsSummary.authoredPairCount,
    yatsukageFeaturedPairCount: yatsukagePairDynamicsSummary.featuredPairCount,
    yatsukagePairCollisionKindCount: yatsukagePairDynamicsSummary.collisionKindCount,
  },
  combatVocabulary: {
    attributeCountIncludingNeutral: COMBAT_ATTRIBUTES.length,
    baseAttributeCount: COMBAT_ATTRIBUTES.filter((attribute) => attribute !== 'NEUTRAL').length,
    statusCount: Object.keys(statusDefinitions).length,
    initialReactionCount: attributeReactions.length,
  },
  baseWeapons: {
    currentCount: baseWeaponSelectionSummary.currentBaseFamilyCount,
    selectedCandidateCount: baseWeaponSelectionSummary.selectedCandidateCount,
    heldCandidateCount: baseWeaponSelectionSummary.heldCandidateCount,
    plannedTitle1FamilyCount: baseWeaponSelectionSummary.plannedTitle1BaseFamilyCount,
    candidateStarterHeldCount: baseWeaponSelectionSummary.candidateStartersHeldCount,
  },
  combatItems: {
    candidateAuthorityCount: title1CombatItemSelectionSummary.candidateAuthorityCount,
    selectedPlacementCount: title1CombatItemSelectionSummary.selectedCount,
    passiveCount: title1CombatItemSelectionSummary.passiveCount,
    fieldItemCount: title1CombatItemSelectionSummary.fieldDropCount,
    rareSupportCount: title1CombatItemSelectionSummary.rareSupportCount,
    latestIntroductionStage: title1CombatItemSelectionSummary.latestPlacementStage,
  },
  transformations: {
    authorityCount: weaponTransformationSelectionSummary.authorityCount,
    selectedCount: weaponTransformationSelectionSummary.selectedCount,
    heldCount: weaponTransformationSelectionSummary.heldCount,
    selectedFusionCount: weaponTransformationSelectionSummary.selectedFusionCount,
    selectedSynthesisCount: weaponTransformationSelectionSummary.selectedSynthesisCount,
    selectedAwakeningCount: weaponTransformationSelectionSummary.selectedAwakeningCount,
    currentKitLinkedAwakeningHeldCount: weaponTransformationSelectionSummary.currentKitLinkedAwakeningHeldIds.length,
  },
  learning: {
    stageCount: title1UnlockLearningProgressionSummary.stageCount,
    firstStageAttributeCount: title1UnlockLearningProgressionSummary.firstStageAttributeCount,
    allBaseAttributesByStage: title1UnlockLearningProgressionSummary.allBaseAttributesIntroducedByStage,
    allInitialReactionsByStage: title1UnlockLearningProgressionSummary.allInitialReactionsIntroducedByStage,
  },
  rewardCollection: {
    stageMilestoneCount: title1AchievementRewardCollectionSummary.stageCount,
    legacyRuntimeAchievementCount: title1AchievementRewardCollectionSummary.legacyRuntimeAchievementCount,
    legacyStage1BoardCellCount: title1AchievementRewardCollectionSummary.legacyForgottenStreetBoardCellCount,
    collectionSectionCount: TITLE1_COLLECTION_SECTION_IDS.length,
    placedCombatItemCount: title1AchievementRewardCollectionSummary.placedCombatItemCount,
    selectedTransformationCount: title1AchievementRewardCollectionSummary.selectedTransformationCount,
    repeatableCurrencyRewards: title1AchievementRewardCollectionSummary.repeatableCurrencyRewards,
    clearRequiresFullCollection: title1AchievementRewardCollectionSummary.clearRequiresFullCollection,
    readingRequiredForPower: title1AchievementRewardCollectionSummary.readingRequiredForPower,
    runtimeAutoPromotionAllowed: title1AchievementRewardCollectionSummary.runtimeAutoPromotionAllowed,
  },
  ending: {
    contentEndAnchorStageId: title1StoryCompletePolicy.contentEndAnchorStageId,
    runtimeGateFrozen: title1StoryCompletePolicy.runtimeGateFrozen,
    allLightsRequiredForStoryComplete: title1StoryCompletePolicy.requiresAllLights,
    allAchievementsRequiredForStoryComplete: title1StoryCompletePolicy.requiresAllAchievements,
    allCombatItemsRequiredForStoryComplete: title1StoryCompletePolicy.requiresAllCombatItems,
    allTransformationsRequiredForStoryComplete: title1StoryCompletePolicy.requiresAllTransformations,
    futureContentRequiredForStoryComplete: title1StoryCompletePolicy.requiresFutureTitleContent,
  },
  completion: {
    allLightsGroupCount: title1AllLightsBoundary.groupCount,
    allLightsDesignTargetTotal: title1AllLightsBoundary.designTargetTotal,
    allLightsRuntimeFrozen: title1AllLightsBoundary.draftRuntimeFrozen,
    allLightsOptionalPostgame: title1AllLightsBoundary.optionalPostgameCelebration,
    runtimeAchievementCount: title1AchievementBoundary.currentRuntimeAchievementCount,
    legacyAchievementCatalogClaimsStage20Coverage: title1AchievementBoundary.stage20CoverageClaimed,
  },
  promotionBoundary: {
    baseWeaponRuntimeAutoPromotionAllowed: baseWeaponSelectionSummary.runtimeAutoPromotionAllowed,
    combatItemRuntimeAutoPromotionAllowed: title1CombatItemSelectionSummary.runtimeAutoPromotionAllowed,
    transformationRuntimeAutoPromotionAllowed: weaponTransformationSelectionSummary.runtimeAutoPromotionAllowed,
    rewardCollectionRuntimeAutoPromotionAllowed: title1AchievementRewardCollectionSummary.runtimeAutoPromotionAllowed,
    relationshipSpeechRuntimeAutoPromotionAllowed: currentRelationshipSpeechProgressionSummary.runtimeAutoPromotionAllowed,
    groupIntermissionRuntimeAutoPromotionAllowed: relationshipStageIntermissionSummary.runtimeAutoPromotionAllowed,
    pairwiseBondRuntimeAutoPromotionAllowed: pairwiseBondTrioBattleSummary.runtimeAutoPromotionAllowed,
    trioInteractionRuntimeAutoPromotionAllowed: trioBattleInteractionPolicySummary.runtimeAutoPromotionAllowed,
    spotlightEnemyRuntimeAutoPromotionAllowed: spotlightEnemyCharacterSummary.runtimeAutoPromotionAllowed,
    spotlightStoryRuntimeAutoPromotionAllowed: spotlightEnemyStoryFragmentSummary.runtimeAutoPromotionAllowed,
    yatsukageIdentityRuntimeAutoPromotionAllowed: yatsukageIdentitySummary.runtimeAutoPromotionAllowed,
    yatsukageCollectionRuntimeAutoPromotionAllowed: yatsukageCollectionPresentationSummary.runtimeAutoPromotionAllowed,
    yatsukageCurrent21RelationRuntimeAutoPromotionAllowed: current21YatsukageRelationshipSummary.runtimeAutoPromotionAllowed,
    yatsukageEncounterMemoryRuntimeAutoPromotionAllowed: yatsukageEncounterMemorySummary.runtimeAutoPromotionAllowed,
    yatsukagePairDynamicsRuntimeAutoPromotionAllowed: yatsukagePairDynamicsSummary.runtimeAutoPromotionAllowed,
    contentMasterMayFreezeRuntimeCompletionByItself: false,
  },
} as const;

export const title1ContentMasterOpenImplementationGates = [
  'selected Base Weapon runtime hooks + numerical tuning',
  'Combat Item PASSIVE/FIELD_ITEM/RARE_SUPPORT runtime schemas and spawn/offer rules',
  'Fusion/Synthesis/Awakening runtime triggers and inventory mutation',
  'achievement/reward one-shot claim ledger + duplicate reward migration',
  'exact Story Complete runtime trigger',
  'finite All Lights runtime denominator + save migration',
  'Stage20-scale Achievement editorial expansion/migration',
  'relationship speech semantic-to-runtime Bond gates + support/result voice selection',
  'Current21 all210 pair Bond + 420 directed Affinity save schema/event ledger/migration',
  'three-Character selection UI + pair Assist arbitration + trio banter spotlight runtime',
  '八影 x Current21 encounter-history ledger + speaker arbitration + bestiary relation snippets',
  '八影 relation memory append-only ledger + phase cache + seen-line speaker history runtime',
  '八影 pair co-appearance admission + simultaneous telegraph readability + mobile performance evidence',
  'spotlight enemy bestiary fragment unlock/presentation + visual recognition validation',
  'mobile visual QA / performance / playtest',
] as const;
