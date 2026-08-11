import {
  COMBAT_ATTRIBUTES,
  attributeReactions,
  statusDefinitions,
} from './combatAffinitySource.ts';
import { baseWeaponSelectionSummary } from './baseWeaponSelectionSource.ts';
import { title1CombatItemSelectionSummary } from './combatItemSelectionSource.ts';
import { currentCharacterCombatKitEntries } from './currentCharacterCombatKitSource.ts';
import { currentRelationshipInventory } from './currentRelationshipInventory.ts';
import { enemyAttributeIdentities } from './enemyAttributeIdentitySource.ts';
import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';
import {
  title1AchievementBoundary,
  title1AllLightsBoundary,
  title1StoryCompletePolicy,
} from './title1EndingCompletionBoundarySource.ts';
import { title1UnlockLearningProgressionSummary } from './title1UnlockLearningProgressionSource.ts';
import { weaponTransformationSelectionSummary } from './weaponTransformationSelectionSource.ts';

export const title1ContentMasterAuthorities = {
  combatAffinity: 'src/game/data/combatAffinitySource.ts',
  stage20: 'src/game/data/series1StageCampaignContentSource.ts',
  current21CombatKit: 'src/game/data/currentCharacterCombatKitSource.ts',
  enemy48: 'src/game/data/enemyAttributeIdentitySource.ts',
  enemyEncounter: 'src/game/data/enemyEncounterSynergySource.ts',
  relationship: 'src/game/data/currentRelationshipInventory.ts',
  baseWeapon: 'src/game/data/baseWeaponSelectionSource.ts',
  combatItem: 'src/game/data/combatItemSelectionSource.ts',
  transformation: 'src/game/data/weaponTransformationSelectionSource.ts',
  unlockLearning: 'src/game/data/title1UnlockLearningProgressionSource.ts',
  endingCompletion: 'src/game/data/title1EndingCompletionBoundarySource.ts',
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
  },
  enemies: {
    currentCount: enemyAttributeIdentities.length,
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
    contentMasterMayFreezeRuntimeCompletionByItself: false,
  },
} as const;

export const title1ContentMasterOpenImplementationGates = [
  'selected Base Weapon runtime hooks + numerical tuning',
  'Combat Item PASSIVE/FIELD_ITEM/RARE_SUPPORT runtime schemas and spawn/offer rules',
  'Fusion/Synthesis/Awakening runtime triggers and inventory mutation',
  'exact Story Complete runtime trigger',
  'finite All Lights runtime denominator + save migration',
  'Stage20-scale Achievement editorial expansion/migration',
  'mobile visual QA / performance / playtest',
] as const;
