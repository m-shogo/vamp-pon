import { CORE5_ERA_ASSIGNMENTS, CORE5_ERA_CANON } from './core5EraCanon.ts';
import { STORY_WORLD_MASTER_SOURCE } from './storyWorldMasterSource.ts';

export const STORY_TEMPORAL_MAP_RULES = {
  authority: 'docs/story-temporal-map-read-model-v1.md',
  status: 'AUTHORING_READ_MODEL_FIVE_REALITY_ERA_LANES_PLUS_DREAM_OVERLAY',
  authorFacingOnly: true,
  laneCountRequired: 5,
  laneOrderIsChronologicalDirection: true,
  exactYearsFrozen: false,
  roughHistoricalBandsAreExactAuthority: false,
  realHistoricalIncidentMayBeRenamedAndCopied: false,
  fictionalIncidentsMustRemainEraSpecific: true,
  presentEraIsDefaultCorrectSide: false,
  futureEraIsHumanUpgrade: false,
  dreamLayerIsPhysicalChronologicalEra: false,
  dreamExplicitTimeTagsStrong: false,
  wakingReturnsToSingleSharedPresent: false,
  constellationSameAcrossErasRequired: false,
  skyOverlayMayShowHistoricalConstellationDifference: true,
  finalConstellationChangeCauseFrozenHere: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type StoryTemporalLane = Readonly<{
  order: number;
  laneId: string;
  characterId: string;
  characterName: string;
  routeSlug: string;
  eraLabel: string;
  roughHistoricalBand: string;
  exactYearFrozen: false;
  narrativeRole: string;
  species: 'HUMAN';
  primaryPressure: string;
  coreBridge: string;
  fictionalIncidentLane: string;
  forbiddenAutoCanon: readonly string[];
}>;

export const STORY_TEMPORAL_MAP_LANES: readonly StoryTemporalLane[] = CORE5_ERA_ASSIGNMENTS.map((entry, index) => ({
  order: index + 1,
  laneId: entry.realityEra,
  characterId: entry.characterId,
  characterName: entry.name,
  routeSlug: entry.characterId,
  eraLabel: entry.eraLabel,
  roughHistoricalBand: entry.roughHistoricalBand,
  exactYearFrozen: entry.exactYearFrozen,
  narrativeRole: entry.narrativeRole,
  species: entry.species,
  primaryPressure: entry.primaryPressure,
  coreBridge: entry.coreBridge,
  fictionalIncidentLane: entry.fictionalIncidentLane,
  forbiddenAutoCanon: entry.forbiddenAutoCanon,
}));

export const STORY_TEMPORAL_MAP_DREAM_OVERLAY = {
  layerType: STORY_WORLD_MASTER_SOURCE.yoruNoShirube.layerType,
  sharedDreamLike: STORY_WORLD_MASTER_SOURCE.yoruNoShirube.sharedDreamLike,
  physicalMorningExists: STORY_WORLD_MASTER_SOURCE.yoruNoShirube.physicalMorningExists,
  returnMode: STORY_WORLD_MASTER_SOURCE.yoruNoShirube.returnMode,
  normalWakingExplicitMemoryLoss: STORY_WORLD_MASTER_SOURCE.yoruNoShirube.normalWakingExplicitMemoryLoss,
  normalWakingImplicitLearningCanRemain: STORY_WORLD_MASTER_SOURCE.yoruNoShirube.normalWakingImplicitLearningCanRemain,
  resolutionWakingMemoryRecoveryDirection: STORY_WORLD_MASTER_SOURCE.yoruNoShirube.resolutionWakingMemoryRecoveryDirection,
  explicitTimeTagsWeakInDream: STORY_WORLD_MASTER_SOURCE.era.explicitTimeTagsWeakInDream,
  isPhysicalChronologicalEra: false,
} as const;

export const STORY_TEMPORAL_MAP_SKY_OVERLAY = {
  starsVisible: STORY_WORLD_MASTER_SOURCE.sky.starsVisible,
  starsCoreVisualIdentity: STORY_WORLD_MASTER_SOURCE.sky.starsCoreVisualIdentity,
  constellationSameAcrossErasRequired: STORY_WORLD_MASTER_SOURCE.sky.constellationSameAcrossErasRequired,
  lostOldConstellationsAllowed: STORY_WORLD_MASTER_SOURCE.sky.lostOldConstellationsAllowed,
  newlyCreatedLaterConstellationsAllowed: STORY_WORLD_MASTER_SOURCE.sky.newlyCreatedLaterConstellationsAllowed,
  finalConstellationChangeCauseFrozen: STORY_WORLD_MASTER_SOURCE.sky.finalConstellationChangeCauseFrozen,
  realAstronomyIsDreamAbsoluteConstraint: STORY_WORLD_MASTER_SOURCE.sky.realAstronomyIsDreamAbsoluteConstraint,
} as const;

export const storyTemporalMapSummary = {
  laneCount: STORY_TEMPORAL_MAP_LANES.length,
  uniqueLaneCount: new Set(STORY_TEMPORAL_MAP_LANES.map((lane) => lane.laneId)).size,
  uniqueLeadCount: new Set(STORY_TEMPORAL_MAP_LANES.map((lane) => lane.characterId)).size,
  exactYearFrozenCount: STORY_TEMPORAL_MAP_LANES.filter((lane) => lane.exactYearFrozen).length,
  presentLaneCount: STORY_TEMPORAL_MAP_LANES.filter((lane) => lane.laneId === 'PRESENT_DAY_JAPAN').length,
  futureLaneCount: STORY_TEMPORAL_MAP_LANES.filter((lane) => lane.laneId === 'FAR_FUTURE_HUMAN_ANDROID_ROBOT_AVATAR_SOCIETY').length,
  humanLeadCount: STORY_TEMPORAL_MAP_LANES.filter((lane) => lane.species === 'HUMAN').length,
  core5SourceUniqueEraCount: new Set(CORE5_ERA_ASSIGNMENTS.map((entry) => entry.realityEra)).size,
  core5ExactYearsFrozen: CORE5_ERA_CANON.exactYearsFrozen,
  dreamIsChronologicalEra: false,
  constellationSameAcrossErasRequired: STORY_TEMPORAL_MAP_SKY_OVERLAY.constellationSameAcrossErasRequired,
  runtimeAutoPromotionAllowed: false,
} as const;
