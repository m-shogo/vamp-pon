export const S2_ANTAGONIST_SCENE_CHEMISTRY_RULES = {
  authority: 'docs/s2-antagonist-scene-chemistry-candidate-v1.md',
  status: 'CANDIDATE_NOT_CANON',
  finalFirstAppearanceOrderFrozen: false,
  exactAllianceOutcomesFrozen: false,
  exactFamilyRelationsFrozen: false,
  exactRomanceRelationsFrozen: false,
  exactRealityOriginsFrozen: false,
  exactCountriesFrozen: false,
  exactNationalitiesFrozen: false,
  exactLanguagesFrozen: false,
  exactOccupationsFrozen: false,
  exactGenderIdentitiesFrozen: false,
  s1JapanIncidentRequiresJapaneseOrigin: false,
  overseasOrMultiCountryRootsAllowedInS2: true,
  originMustComeFromLifeHistoryNotAppearance: true,
  runtimeAutoPromotionAllowed: false,
} as const;

export type Core5Id = 'yui' | 'asa' | 'nagi' | 'michiru' | 'tomori';

export const S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES = [
  { id: 's2_isana', callName: 'イサナ', core5: ['michiru', 'yui'] as const, first: 'michiru' as Core5Id, scene: 'S2-SCENE-ISANA-MAP-FLOW', party: 'S2-PARTY-ISANA-TABLE-FLOW', fracture: 'S2-FRACTURE-ISANA-ACCEPTABLE-LOSS', tell: 'S2-TELL-ISANA-FOLDED-MAP', humanHook: 'S2-HOOK-ISANA-QUEUE-JAM', formerS1: 'ナシロ', lifeShape: 'LARGE_CITY_AND_PERIPHERAL_TOWN_ACROSS_MORE_THAN_ONE_COUNTRY' },
  { id: 's2_kanna', callName: 'カンナ', core5: ['tomori', 'asa'] as const, first: 'tomori' as Core5Id, scene: 'S2-SCENE-KANNA-STOREHOUSE-REPAIR', party: 'S2-PARTY-KANNA-SALVAGE', fracture: 'S2-FRACTURE-KANNA-BEYOND-REPAIR', tell: 'S2-TELL-KANNA-REJECTED-BOX', humanHook: 'S2-HOOK-KANNA-TOOL-TAP', formerS1: 'ツグリ', lifeShape: 'PORT_OR_MANUFACTURING_TOWN_WITH_LONG_TERM_JAPAN_COMMUNITY' },
  { id: 's2_nanase', callName: 'ナナセ', core5: ['michiru', 'nagi'] as const, first: 'nagi' as Core5Id, scene: 'S2-SCENE-NANASE-RETURN-ROUTE', party: 'S2-PARTY-NANASE-CLEAR-AISLE', fracture: 'S2-FRACTURE-NANASE-AVAILABLE-ROUTE', tell: 'S2-TELL-NANASE-BACK-TO-EXIT', humanHook: 'S2-HOOK-NANASE-WAY-HOME', formerS1: 'ミチグレ', lifeShape: 'TRANSIT_DEPENDENT_CHILDHOOD_ACROSS_MULTIPLE_REGIONS_OR_COUNTRIES' },
  { id: 's2_yoshino', callName: 'ヨシノ', core5: ['tomori', 'yui'] as const, first: 'yui' as Core5Id, scene: 'S2-SCENE-YOSHINO-WATER-RESERVE', party: 'S2-PARTY-YOSHINO-TOMORROW-PORTION', fracture: 'S2-FRACTURE-YOSHINO-PRESENT-HARDSHIP', tell: 'S2-TELL-YOSHINO-OBJECT-APOLOGY', humanHook: 'S2-HOOK-YOSHINO-LAST-PORTION', formerS1: 'アサトジ', lifeShape: 'RIVER_OR_AGRICULTURAL_REGION_HISTORY_WITH_LATER_JAPAN_LIFE' },
  { id: 's2_kei', callName: 'ケイ', core5: ['asa', 'yui'] as const, first: 'asa' as Core5Id, scene: 'S2-SCENE-KEI-CARE-QUEUE', party: 'S2-PARTY-KEI-ASK-BEFORE-PORTION', fracture: 'S2-FRACTURE-KEI-RETURN-ON-TIME', tell: 'S2-TELL-KEI-LAST-REQUESTS', humanHook: 'S2-HOOK-KEI-OTHER-THING', formerS1: 'ペタ', lifeShape: 'LIVED_BETWEEN_SOCIAL_SYSTEMS_WITH_DIFFERENT_ACCESS_RULES' },
  { id: 's2_sae', callName: 'サエ', core5: ['asa', 'tomori'] as const, first: 'tomori' as Core5Id, scene: 'S2-SCENE-SAE-COMMUNAL-KITCHEN', party: 'S2-PARTY-SAE-CLEANUP-ROLES', fracture: 'S2-FRACTURE-SAE-DUTY-LEDGER', tell: 'S2-TELL-SAE-REFUSES-HELP', humanHook: 'S2-HOOK-SAE-LAST-TIME', formerS1: 'ユラネ', lifeShape: 'MULTILINGUAL_OR_MULTI_COUNTRY_NONFAMILY_HOUSEHOLD_NETWORK' },
  { id: 's2_haruma', callName: 'ハルマ', core5: ['nagi', 'michiru'] as const, first: 'michiru' as Core5Id, scene: 'S2-SCENE-HARUMA-MAINTENANCE-ROTATION', party: 'S2-PARTY-HARUMA-CHAIRS', fracture: 'S2-FRACTURE-HARUMA-REST-AS-RESOURCE', tell: 'S2-TELL-HARUMA-OWN-OVERTIME', humanHook: 'S2-HOOK-HARUMA-CUP-SOUND', formerS1: 'ハクマ', lifeShape: 'PORT_INDUSTRIAL_OR_LOGISTICS_CITIES_ACROSS_MULTIPLE_COUNTRIES' },
  { id: 's2_minori', callName: 'ミノリ', core5: ['tomori', 'yui'] as const, first: 'yui' as Core5Id, scene: 'S2-SCENE-MINORI-DEPOT-SUBSTITUTE', party: 'S2-PARTY-MINORI-EIGHT-PORTIONS', fracture: 'S2-FRACTURE-MINORI-NEXT-RUN-THREE-TIMES', tell: 'S2-TELL-MINORI-STOPS-EATING', humanHook: 'S2-HOOK-MINORI-FORGETS-OWN-WANT', formerS1: 'オリネ', lifeShape: 'ISLAND_OR_COASTAL_SUPPLY_NETWORK_WITH_LATER_JAPAN_CONNECTION' },
] as const;

export const S2_ANTAGONIST_INTERNAL_RELATIONSHIP_ARCS = [
  { id: 'S2-REL-ISANA-KANNA', members: ['s2_isana', 's2_kanna'] as const, resolutionFrozen: false },
  { id: 'S2-REL-NANASE-KEI', members: ['s2_nanase', 's2_kei'] as const, resolutionFrozen: false },
  { id: 'S2-REL-YOSHINO-HARUMA', members: ['s2_yoshino', 's2_haruma'] as const, resolutionFrozen: false },
  { id: 'S2-REL-KEI-SAE', members: ['s2_kei', 's2_sae'] as const, resolutionFrozen: false },
  { id: 'S2-REL-KANNA-MINORI', members: ['s2_kanna', 's2_minori'] as const, resolutionFrozen: false },
  { id: 'S2-REL-SAE-HARUMA', members: ['s2_sae', 's2_haruma'] as const, resolutionFrozen: false },
] as const;

export const s2AntagonistSceneChemistrySummary = {
  candidateCount: S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.length,
  uniqueIdCount: new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.map((entry) => entry.id)).size,
  uniqueSceneCount: new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.map((entry) => entry.scene)).size,
  uniquePartyCount: new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.map((entry) => entry.party)).size,
  coveredCore5Count: new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.flatMap((entry) => entry.core5)).size,
  uniqueFormerS1Count: new Set(S2_ANTAGONIST_SCENE_CHEMISTRY_CANDIDATES.map((entry) => entry.formerS1)).size,
  internalRelationshipArcCount: S2_ANTAGONIST_INTERNAL_RELATIONSHIP_ARCS.length,
  runtimeAutoPromotionAllowed: false,
} as const;
