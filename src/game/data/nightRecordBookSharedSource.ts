import {
  COMMERCIAL_PRODUCTION_PROFILE_POLICY,
  commercialProductionProfiles,
} from './commercialProductionProfile.ts';
import { currentRelationshipInventory, currentRelationshipInventorySummary } from './currentRelationshipInventory.ts';
import { dawnProofSharedSourceSummary } from './dawnProofSharedSource.ts';
import { namedObjectVisualSharedSourceEntries } from './namedObjectVisualSharedSource.ts';
import { starBeastVisualSharedSourceEntries } from './starBeastVisualSharedSource.ts';
import { worldRouteSymbolSharedSourceSummary } from './worldRouteSymbolSharedSource.ts';

export type NightRecordBookSectionId = 'PEOPLE' | 'STAR_BEAST' | 'OBJECT' | 'ROUTE' | 'RELATION' | 'DAWN';
export type NightRecordBookCoverage = 'CURRENT_MACHINE' | 'PARTIAL_MACHINE' | 'SCHEMA_ONLY' | 'LOCKED_DRAFT';

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
  'PEOPLE', 'STAR_BEAST', 'OBJECT', 'ROUTE', 'RELATION', 'DAWN',
] as const;

const launchProfiles = commercialProductionProfiles.filter((profile) => profile.launchEligible);
const reserveProfiles = commercialProductionProfiles.filter((profile) => !profile.launchEligible);
const launchStarBeasts = starBeastVisualSharedSourceEntries.filter((entry) => entry.launchEligible);
const reserveStarBeasts = starBeastVisualSharedSourceEntries.filter((entry) => !entry.launchEligible);

export const NIGHT_RECORD_RELATION_COVERAGE_COUNT = currentRelationshipInventory.length;
export const NIGHT_RECORD_RELATION_DETAILED_MACHINE_COUNT = currentRelationshipInventorySummary.detailedMachineArcs;
export const NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT = 24 as const;

/**
 * Only direct Stage1 conditions whose source text explicitly says `夜明けする`
 * are normalized. This is not a conversion of the full 25-cell board and does
 * not authorize narrative morning scenes or ending interpretation.
 */
export const NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT = dawnProofSharedSourceSummary.directDawnProofCount;

export const nightRecordBookSections: readonly NightRecordBookSectionSource[] = [
  {
    id: 'PEOPLE', order: 1, displayName: 'PEOPLE',
    meaning: 'Character / Toumon entry point. Character identity is primary while Toumon final geometry remains separately gated.',
    coverage: 'CURRENT_MACHINE', machineEntryCount: commercialProductionProfiles.length,
    sourcePaths: ['src/game/data/commercialProductionProfile.ts', 'src/game/data/characterCommercialIdentity.ts', 'src/game/data/toumonSimpleSigilCanon.ts'],
    publicPresentationRule: 'Launch surfaces may expose Current20; Official Reserve remains a distinct non-launch scope and is never blended into the launch set.',
    spoilerRule: 'Use public-safe identity/profile facts only; do not expose Main Mystery or unrevealed relation truth through collection completion.',
    emptyStateRule: 'A missing or hidden entry is a valid unknown/Reserve state, not evidence of death, disappearance, or a secret unlock.',
    candidateGenerationAllowed: false, physicalPurchaseRequired: false, trueEndRequired: false,
    nextGate: 'Approve per-Character reference art and final Toumon vectors independently before richer visual pages.',
  },
  {
    id: 'STAR_BEAST', order: 2, displayName: 'STAR BEAST',
    meaning: 'Independent mascot / constellation entry point. Star Beast is not a Character accessory layer.',
    coverage: 'CURRENT_MACHINE', machineEntryCount: starBeastVisualSharedSourceEntries.length,
    sourcePaths: ['src/game/data/starBeastVisualSharedSource.ts', 'src/game/data/commercialProductionProfile.ts'],
    publicPresentationRule: 'Current20 may be shown on launch surfaces after reference approval; Ren/Official Reserve remains separate.',
    spoilerRule: 'Species, recognition, and safe relation hooks may be shown; duplicate constellations do not imply identical individuals or hidden causality.',
    emptyStateRule: 'Unapproved art uses a neutral data/placeholder state; never substitute another Character mascot or a generated zodiac glyph.',
    candidateGenerationAllowed: false, physicalPurchaseRequired: false, trueEndRequired: false,
    nextGate: 'Human-compare Current20 Star Beast references while keeping Reserve, runtime, and plush approvals separate.',
  },
  {
    id: 'OBJECT', order: 3, displayName: 'OBJECT',
    meaning: 'Named Object / provenance / repair-history entry point.',
    coverage: 'PARTIAL_MACHINE', machineEntryCount: namedObjectVisualSharedSourceEntries.length,
    sourcePaths: ['src/game/data/namedObjectRegistry.ts', 'src/game/data/namedObjectVisualSharedSource.ts'],
    publicPresentationRule: 'Stable object IDs, names, and lineage may drive read-only pages; candidate three-view geometry cannot be presented as approved art.',
    spoilerRule: 'Ownership/history follows Current authority only. Candidate lineage, hidden contents, and Main Mystery implications stay gated.',
    emptyStateRule: 'If approved reference art is absent, show provenance-safe metadata/unknown visual state rather than inventing a cleaned premium replica.',
    candidateGenerationAllowed: false, physicalPurchaseRequired: false, trueEndRequired: false,
    nextGate: 'Explicitly approve candidate three-view geometry before reference generation or replica-grade presentation.',
  },
  {
    id: 'ROUTE', order: 4, displayName: 'ROUTE',
    meaning: 'Night Station / route / ticket / place entry point.',
    coverage: 'SCHEMA_ONLY', machineEntryCount: worldRouteSymbolSharedSourceSummary.routeInstanceCount,
    sourcePaths: ['src/game/data/worldRouteSymbolSharedSource.ts', 'src/game/data/stageVisualSharedSource.ts'],
    publicPresentationRule: 'The section exists structurally, but route/station/ticket instances stay empty until explicit original-world authority is approved.',
    spoilerRule: 'Do not infer station names or codes from Stage numbers; secret tickets never print unrevealed truth.',
    emptyStateRule: 'An empty ROUTE section is valid Current state. Do not fill it with fake station codes, real railway motifs, or generated readable signs.',
    candidateGenerationAllowed: false, physicalPurchaseRequired: false, trueEndRequired: false,
    nextGate: 'Approve route/station instances and exact original vector vocabulary before route, ticket, or stamp visual production.',
  },
  {
    id: 'RELATION', order: 5, displayName: 'RELATION',
    meaning: 'Pair / handoff / relationship-growth entry point. Trust, family, friendship, and romance remain different valid relation types.',
    coverage: 'CURRENT_MACHINE', machineEntryCount: NIGHT_RECORD_RELATION_COVERAGE_COUNT,
    sourcePaths: ['src/game/data/currentRelationshipInventory.ts', 'docs/RELATIONSHIPS.md', 'docs/design-targets/generated/character-relationship-arc-map-v1.json', 'docs/character-relationship-arc-book-v1.md', 'docs/BOND.md'],
    publicPresentationRule: 'All 24 Current coverage arcs are machine-readable for inventory/presentation. Only 12 have detailed machine payloads; coverage-only arcs stay visibly lower-detail.',
    spoilerRule: 'Current fact vs Candidate event/history remains explicit. Popularity cannot retcon relation type, romance, blood relation, exact era, or Main Mystery facts.',
    emptyStateRule: 'Missing detailed payload means COVERAGE-ONLY SOURCE, not “no relationship”. Do not fabricate scene facts or auto-generate pair cards from commercial lists.',
    candidateGenerationAllowed: false, physicalPurchaseRequired: false, trueEndRequired: false,
    nextGate: 'Expand detailed payloads only when status and Candidate boundaries are explicitly encoded; inventory coverage is already complete.',
  },
  {
    id: 'DAWN', order: 6, displayName: 'DAWN',
    meaning: 'Gameplay Dawn proof entry point. A proof records an explicit clear condition without inventing a narrative morning scene or ending meaning.',
    coverage: 'PARTIAL_MACHINE', machineEntryCount: NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT,
    sourcePaths: ['src/game/data/dawnProofSharedSource.ts', 'src/game/data/collectionProgress.ts', 'src/game/data/allLightsCompletion.ts', 'src/game/data/progressionRewardSharedSource.ts'],
    publicPresentationRule: 'Stage1 exposes only direct Night Board conditions whose Current source explicitly says 夜明けする. These are lightweight proof records, not generated story scenes.',
    spoilerRule: 'Secret-cell titles remain hidden until reveal. All Lights remains runtimeFrozen=false, is not True End, and cannot expose hidden ending truth.',
    emptyStateRule: 'Missing proof coverage for other boards/stages means NOT NORMALIZED YET; never synthesize a Dawn scene or infer production Stage identity from condition prose.',
    candidateGenerationAllowed: false, physicalPurchaseRequired: false, trueEndRequired: false,
    nextGate: 'Extend proof records only from explicit Current clear sources, then separately define a page/layout contract before any Dawn art production.',
  },
] as const;

export const nightRecordBookSectionById = new Map(nightRecordBookSections.map((section) => [section.id, section]));

export const nightRecordBookSharedSourceSummary = {
  sectionCount: nightRecordBookSections.length,
  sectionIds: nightRecordBookSections.map((section) => section.id),
  people: { total: commercialProductionProfiles.length, launchEligible: launchProfiles.length, reserve: reserveProfiles.length, reserveIds: reserveProfiles.map((profile) => profile.characterId) },
  starBeasts: { total: starBeastVisualSharedSourceEntries.length, launchEligible: launchStarBeasts.length, reserve: reserveStarBeasts.length, reserveIds: reserveStarBeasts.map((entry) => entry.characterId) },
  objects: { total: namedObjectVisualSharedSourceEntries.length, visualGeometryApproved: false },
  route: {
    routeInstances: worldRouteSymbolSharedSourceSummary.routeInstanceCount,
    stationInstances: worldRouteSymbolSharedSourceSummary.stationInstanceCount,
    ticketInstances: worldRouteSymbolSharedSourceSummary.ticketInstanceCount,
    finalVectorApproved: worldRouteSymbolSharedSourceSummary.finalVectorApproved,
  },
  relation: {
    machineCoverageArcs: NIGHT_RECORD_RELATION_COVERAGE_COUNT,
    detailedMachineArcs: NIGHT_RECORD_RELATION_DETAILED_MACHINE_COUNT,
    humanCurrentStrongInventory: NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT,
    machineCoverageComplete: NIGHT_RECORD_RELATION_COVERAGE_COUNT === NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT,
    detailedCoverageComplete: NIGHT_RECORD_RELATION_DETAILED_MACHINE_COUNT === NIGHT_RECORD_RELATION_HUMAN_CURRENT_COUNT,
  },
  dawn: {
    normalizedEntries: NIGHT_RECORD_DAWN_NORMALIZED_ENTRY_COUNT,
    stage1BoardSourceCellCount: dawnProofSharedSourceSummary.sourceBoardCellCount,
    standardClearProofs: dawnProofSharedSourceSummary.standardClearCount,
    constraintClearProofs: dawnProofSharedSourceSummary.constraintClearCount,
    masteryClearProofs: dawnProofSharedSourceSummary.masteryClearCount,
    secretClearProofs: dawnProofSharedSourceSummary.secretClearCount,
    narrativeScenesInferred: dawnProofSharedSourceSummary.allRecordsNarrativeSceneInferred,
    allLightsRuntimeFrozen: false,
  },
  collectionHubName: COMMERCIAL_PRODUCTION_PROFILE_POLICY.collectionHub,
  canBulkGeneratePagesNow: false,
  physicalPurchaseRequired: false,
  trueEndRequired: false,
  sectionExpansionApproved: false,
} as const;
