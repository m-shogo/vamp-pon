import { CHARACTER_REALITY_ROOTS, REALITY_ROOT_RULES } from './characterRealityRootRegistry.ts';
import { CHARACTER_AUTHOR_DB_COVERAGE } from './characterAuthorDbCoverageManifest.ts';

export const CHARACTER_REALITY_ROOT_MAP_RULES = {
  authority: 'docs/character-reality-root-map-read-model-v1.md',
  status: 'AUTHORING_READ_MODEL_36_REALITY_ROOTS_REGION_LEVEL_NO_EXACT_HOME_PIN',
  authorFacingOnly: true,
  characterCountRequired: 36,
  current21Required: 21,
  future15Required: 15,
  sourceStatusMustRemainVisible: true,
  rootAndIncidentAreaMustRemainDistinct: true,
  mobilityMustRemainVisible: true,
  dialectVisibilityMayBeShownAsMetadata: true,
  dialectMayDefinePersonality: false,
  rootMayDefinePersonality: false,
  skinToneMayInferOrigin: false,
  incidentAreaMayReplaceRoot: false,
  exactHomeCoordinatesFrozen: false,
  exactHomePinAllowed: false,
  regionLevelMapAllowed: true,
  futureAbstractLocationForcedOntoJapanMap: false,
  openLocationForcedOntoMap: false,
  pilgrimageRecommendationGeneratedAutomatically: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type RealityRootMapPlacementKind = 'REAL_JAPAN_REGION' | 'FUTURE_ABSTRACT' | 'OPEN_UNMAPPED';
export type RealityRootMapPinPolicy = 'REGION_LEVEL_ONLY' | 'ABSTRACT_FUTURE_LANE' | 'NO_PIN_OPEN';

export type CharacterRealityRootMapEntry = Readonly<{
  authorId: string;
  routeSlug: string;
  stableProfileId: string;
  name: string;
  rosterLayer: 'CURRENT21' | 'FUTURE15';
  root: string;
  incidentArea: string;
  mobility: string;
  dialectVisibility: string;
  sourceStatus: string;
  placementKind: RealityRootMapPlacementKind;
  pinPolicy: RealityRootMapPinPolicy;
  exactCoordinates: null;
}>;

const profileByAuthorId = new Map(CHARACTER_AUTHOR_DB_COVERAGE.map((entry) => [entry.authorId, entry]));

const classifyPlacement = (root: string): Readonly<{
  placementKind: RealityRootMapPlacementKind;
  pinPolicy: RealityRootMapPinPolicy;
}> => {
  if (root.includes('Far Future')) {
    return { placementKind: 'FUTURE_ABSTRACT', pinPolicy: 'ABSTRACT_FUTURE_LANE' };
  }
  if (root.includes('Open')) {
    return { placementKind: 'OPEN_UNMAPPED', pinPolicy: 'NO_PIN_OPEN' };
  }
  return { placementKind: 'REAL_JAPAN_REGION', pinPolicy: 'REGION_LEVEL_ONLY' };
};

export const CHARACTER_REALITY_ROOT_MAP_ENTRIES: readonly CharacterRealityRootMapEntry[] = CHARACTER_REALITY_ROOTS.map((rootEntry) => {
  const profile = profileByAuthorId.get(rootEntry.id);
  if (!profile) throw new Error(`Reality Root map profile missing: ${rootEntry.id}`);
  const placement = classifyPlacement(rootEntry.root);
  return {
    authorId: profile.authorId,
    routeSlug: profile.authorId,
    stableProfileId: profile.stableProfileId,
    name: profile.name,
    rosterLayer: profile.rosterLayer,
    root: rootEntry.root,
    incidentArea: rootEntry.incidentArea,
    mobility: rootEntry.mobility,
    dialectVisibility: rootEntry.dialect,
    sourceStatus: rootEntry.status,
    ...placement,
    exactCoordinates: null,
  } as const;
});

export const CHARACTER_REALITY_ROOT_MAP_GROUPS = {
  realJapanRegion: CHARACTER_REALITY_ROOT_MAP_ENTRIES.filter((entry) => entry.placementKind === 'REAL_JAPAN_REGION'),
  futureAbstract: CHARACTER_REALITY_ROOT_MAP_ENTRIES.filter((entry) => entry.placementKind === 'FUTURE_ABSTRACT'),
  openUnmapped: CHARACTER_REALITY_ROOT_MAP_ENTRIES.filter((entry) => entry.placementKind === 'OPEN_UNMAPPED'),
} as const;

export const characterRealityRootMapSummary = {
  characterCount: CHARACTER_REALITY_ROOT_MAP_ENTRIES.length,
  uniqueAuthorIdCount: new Set(CHARACTER_REALITY_ROOT_MAP_ENTRIES.map((entry) => entry.authorId)).size,
  uniqueStableProfileIdCount: new Set(CHARACTER_REALITY_ROOT_MAP_ENTRIES.map((entry) => entry.stableProfileId)).size,
  uniqueRouteSlugCount: new Set(CHARACTER_REALITY_ROOT_MAP_ENTRIES.map((entry) => entry.routeSlug)).size,
  current21Count: CHARACTER_REALITY_ROOT_MAP_ENTRIES.filter((entry) => entry.rosterLayer === 'CURRENT21').length,
  future15Count: CHARACTER_REALITY_ROOT_MAP_ENTRIES.filter((entry) => entry.rosterLayer === 'FUTURE15').length,
  realJapanRegionCount: CHARACTER_REALITY_ROOT_MAP_GROUPS.realJapanRegion.length,
  futureAbstractCount: CHARACTER_REALITY_ROOT_MAP_GROUPS.futureAbstract.length,
  openUnmappedCount: CHARACTER_REALITY_ROOT_MAP_GROUPS.openUnmapped.length,
  exactCoordinateCount: CHARACTER_REALITY_ROOT_MAP_ENTRIES.filter((entry) => entry.exactCoordinates !== null).length,
  runtimeAutoPromotionAllowed: false,
  sourceRuntimeAutoPromotionAllowed: REALITY_ROOT_RULES.runtimeAutoPromotionAllowed,
} as const;
