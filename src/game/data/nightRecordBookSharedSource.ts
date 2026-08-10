import {
  COMMERCIAL_PRODUCTION_PROFILE_POLICY,
  commercialProductionProfiles,
} from './commercialProductionProfile.ts';
import { forgottenStreetNightBoardCells } from './collectionProgress.ts';
import { namedObjectVisualSharedSourceEntries } from './namedObjectVisualSharedSource.ts';
import { starBeastVisualSharedSourceEntries } from './starBeastVisualSharedSource.ts';
import { worldRouteSymbolSharedSourceSummary } from './worldRouteSymbolSharedSource.ts';

export type NightRecordBookSectionId =
  | 'PEOPLE'
  | 'STAR_BEAST'
  | 'OBJECT'
  | 'ROUTE'
  | 'RELATION'
  | 'DAWN';

export type NightRecordBookCoverage =
  | 'CURRENT_MACHINE'
  | 'PARTIAL_MACHINE'
  | 'SCHEMA_ONLY'
  | 'LOCKED_DRAFT';

export type NightRecordBookSectionSource = {
  id: NightRecordBookSectionId;
  order: 1 | 2 | 3 | 4 | 5 | 6;
  displayName: string;
  meaning: string;
  coverage: NightRecordBookCoverage;
  machineEntryCount: number;
  sourcePaths: readonly string[];
  publicPresentationRule: string;
  spoilerRule: string;
  emptyStateRule: string;
  candidateGenerationAllowed: false;
  physicalPurchaseRequired: false;
  trueEndRequired: false;
  nextGate: string;
};

export const NIGHT_RECORD_BOOK_SECTION_IDS: readonly NightRecordBookSectionId[] = [
  'PEOPLE',
  'STAR_BEAST',
  'OBJECT',
  'ROUTE',
  'RELATION',
  'DAWN',
] as const;

const launchProfiles = commercialProductionProfiles.filter((profile) => profile.launchEligible);
const reserveProfiles = commercialProductionProfiles.filter((profile) => !profile.launchEligible);
const launchStarBeasts = starBeastVisualSharedSourceEntries.filter((entry) => entry.launchEligible);
const reserveStarBeasts = starBeastVisualSharedSourceEntries.filter((entry) => !entry.launchEligible);

/**
 * `RELATION` has a deliberately partial machine snapshot at the moment.
 * The human-readable CURRENT hub lists 24 strong arcs, while the machine map
 * currently serializes 12 currentArcs. The quality checker verifies both counts.
 */
export const NIGHT_RECORD_RELATION_MACHINE_COUNT = 12 as const;
export const NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT = 24 as const;

/**
 * `DAWN` intentionally has no normalized record-entry list yet.
 * Stage1's 25-cell board is source material, not 25 Dawn records.
 */
export const NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT = 0 as const;

export const nightRecordBookSections: readonly NightRecordBookSectionSource[] = [
  {
    id: 'PEOPLE',
    order: 1,
    displayName: 'PEOPLE',
    meaning: 'Character / Toumon entry point. Character identity is primary; Toumon final geometry remains separately gated.',
    coverage: 'CURRENT_MACHINE',
    machineEntryCount: commercialProductionProfiles.length,
    sourcePaths: [
      'src/game/data/commercialProductionProfile.ts',
      'src/game/data/characterCommercialIdentity.ts',
      'src/game/data/toumonSimpleSigilCanon.ts',
    ],
    publicPresentationRule: 'Launch surfaces may expose Current20; Official Reserve remains a distinct non-launch scope and is never blended into the launch set.',
    spoilerRule: 'Use public-safe identity/profile facts only; do not expose Main Mystery or unrevealed relation truth through collection completion.',
    emptyStateRule: 'A missing/hidden entry is a valid unknown/Reserve state, not evidence of death, disappearance or secret unlock.',
    candidateGenerationAllowed: false,
    physicalPurchaseRequired: false,
    trueEndRequired: false,
    nextGate: 'Approve per-Character reference art and final Toumon vectors independently before richer visual pages.',
  },
  {
    id: 'STAR_BEAST',
    order: 2,
    displayName: 'STAR BEAST',
    meaning: 'Independent mascot / constellation entry point. Star Beast is not a Character accessory layer.',
    coverage: 'CURRENT_MACHINE',
    machineEntryCount: starBeastVisualSharedSourceEntries.length,
    sourcePaths: [
      'src/game/data/starBeastVisualSharedSource.ts',
      'src/game/data/commercialProductionProfile.ts',
    ],
    publicPresentationRule: 'Current20 may be shown on launch surfaces after reference approval; Ren/Official Reserve remains separate.',
    spoilerRule: 'Species, recognition and safe relation hooks may be shown; do not turn duplicate constellations into identical individuals or reveal hidden story causality.',
    emptyStateRule: 'Unapproved art uses a neutral data/placeholder state; never substitute another Character mascot or generated zodiac glyph.',
    candidateGenerationAllowed: false,
    physicalPurchaseRequired: false,
    trueEndRequired: false,
    nextGate: 'Human compare Current20 Star Beast reference candidates; keep Reserve and runtime/plush approvals separate.',
  },
  {
    id: 'OBJECT',
    order: 3,
    displayName: 'OBJECT',
    meaning: 'Named Object / provenance / repair-history entry point.',
    coverage: 'PARTIAL_MACHINE',
    machineEntryCount: namedObjectVisualSharedSourceEntries.length,
    sourcePaths: [
      'src/game/data/namedObjectRegistry.ts',
      'src/game/data/namedObjectVisualSharedSource.ts',
    ],
    publicPresentationRule: 'Stable object IDs/name/lineage may drive read-only pages; candidate three-view geometry cannot be presented as approved object art.',
    spoilerRule: 'Ownership/history follows Current authority only. Candidate lineage, hidden contents and Main Mystery implications stay gated.',
    emptyStateRule: 'If approved reference art is absent, show provenance-safe metadata/unknown visual state rather than inventing a cleaned premium replica.',
    candidateGenerationAllowed: false,
    physicalPurchaseRequired: false,
    trueEndRequired: false,
    nextGate: 'Explicitly approve candidate three-view geometry before reference generation or replica-grade presentation.',
  },
  {
    id: 'ROUTE',
    order: 4,
    displayName: 'ROUTE',
    meaning: 'Night Station / route / ticket / place entry point.',
    coverage: 'SCHEMA_ONLY',
    machineEntryCount: worldRouteSymbolSharedSourceSummary.routeInstanceCount,
    sourcePaths: [
      'src/game/data/worldRouteSymbolSharedSource.ts',
      'src/game/data/stageVisualSharedSource.ts',
    ],
    publicPresentationRule: 'The section exists structurally, but route/station/ticket instances stay empty until explicit original world authority is approved.',
    spoilerRule: 'Do not infer station names/codes from Stage numbers; secret tickets never print unrevealed truth.',
    emptyStateRule: 'An empty ROUTE section is valid Current state. Do not fill it with fake station codes, real railway motifs or generated readable signs.',
    candidateGenerationAllowed: false,
    physicalPurchaseRequired: false,
    trueEndRequired: false,
    nextGate: 'Approve route/station instances and exact original vector vocabulary before route/ticket/stamp visual production.',
  },
  {
    id: 'RELATION',
    order: 5,
    displayName: 'RELATION',
    meaning: 'Pair / handoff / relationship-growth entry point. Trust, family, friendship and romance remain different valid relation types.',
    coverage: 'PARTIAL_MACHINE',
    machineEntryCount: NIGHT_RECORD_RELATION_MACHINE_COUNT,
    sourcePaths: [
      'docs/RELATIONSHIPS.md',
      'docs/design-targets/generated/character-relationship-arc-map-v1.json',
      'docs/character-relationship-arc-book-v1.md',
      'docs/BOND.md',
    ],
    publicPresentationRule: 'Only machine-supported Current arcs may be rendered automatically today; the 24-arc human inventory is broader and must not be silently fabricated into machine entries.',
    spoilerRule: 'Current fact vs Candidate event/history remains explicit. Popularity cannot retcon relation type, romance, blood relation, exact era or Main Mystery facts.',
    emptyStateRule: 'Missing machine coverage means PARTIAL SOURCE, not “no relationship”. Do not auto-generate pair cards from commercial partner lists.',
    candidateGenerationAllowed: false,
    physicalPurchaseRequired: false,
    trueEndRequired: false,
    nextGate: 'Refresh the machine relationship map from the Current hub while preserving each arc status and Candidate boundaries.',
  },
  {
    id: 'DAWN',
    order: 6,
    displayName: 'DAWN',
    meaning: 'Cleared scene / morning proof entry point. Morning proof records what changed without turning collection into ending morality.',
    coverage: 'LOCKED_DRAFT',
    machineEntryCount: NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT,
    sourcePaths: [
      'src/game/data/collectionProgress.ts',
      'src/game/data/allLightsCompletion.ts',
      'src/game/data/progressionRewardSharedSource.ts',
    ],
    publicPresentationRule: 'Stage1 board and completion sources may inform future morning-proof records, but no normalized DAWN entry list exists yet.',
    spoilerRule: 'All Lights / 全灯の朝 remains a completion reward concept with runtimeFrozen=false; it is not True End and cannot expose hidden ending truth.',
    emptyStateRule: 'Zero normalized DAWN entries is valid until a stable proof-record schema exists. Do not convert every clear/achievement into a Dawn scene automatically.',
    candidateGenerationAllowed: false,
    physicalPurchaseRequired: false,
    trueEndRequired: false,
    nextGate: 'Define a read-only morning-proof record schema from approved clear/state sources before visual page generation.',
  },
] as const;

export const nightRecordBookSectionById = new Map(nightRecordBookSections.map((section) => [section.id, section]));

export const nightRecordBookSharedSourceSummary = {
  sectionCount: nightRecordBookSections.length,
  sectionIds: nightRecordBookSections.map((section) => section.id),
  people: {
    total: commercialProductionProfiles.length,
    launchEligible: launchProfiles.length,
    reserve: reserveProfiles.length,
    reserveIds: reserveProfiles.map((profile) => profile.characterId),
  },
  starBeasts: {
    total: starBeastVisualSharedSourceEntries.length,
    launchEligible: launchStarBeasts.length,
    reserve: reserveStarBeasts.length,
    reserveIds: reserveStarBeasts.map((entry) => entry.characterId),
  },
  objects: {
    total: namedObjectVisualSharedSourceEntries.length,
    visualGeometryApproved: false,
  },
  route: {
    routeInstances: worldRouteSymbolSharedSourceSummary.routeInstanceCount,
    stationInstances: worldRouteSymbolSharedSourceSummary.stationInstanceCount,
    ticketInstances: worldRouteSymbolSharedSourceSummary.ticketInstanceCount,
    finalVectorApproved: worldRouteSymbolSharedSourceSummary.finalVectorApproved,
  },
  relation: {
    machineCurrentArcs: NIGHT_RECORD_RELATION_MACHINE_COUNT,
    humanCurrentStrongInventory: NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT,
    machineCoverageComplete: false,
  },
  dawn: {
    normalizedEntries: NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT,
    stage1BoardSourceCellCount: forgottenStreetNightBoardCells.length,
    allLightsRuntimeFrozen: false,
  },
  collectionHubName: COMMERCIAL_PRODUCTION_PROFILE_POLICY.collectionHub,
  canBulkGeneratePagesNow: false,
  physicalPurchaseRequired: false,
  trueEndRequired: false,
  sectionExpansionApproved: false,
} as const;
