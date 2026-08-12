export const CONSTELLATION_HISTORY_RESEARCH_RULES = {
  authority: 'docs/research/constellation-history-usable-v1.md',
  status: 'RESEARCH_EVIDENCE_NON_CANON',
  officialModernConstellationCount: 88,
  modernNameSetStandardizedBeforePostwarCore5Lane: true,
  tomoriVsYuiOfficial88SetDiffersByEra: false,
  obsoleteConstellationMayBeShownAsTomoriEraOfficialSet: false,
  obsoleteConstellationMayAppearInOlderInheritedAtlas: true,
  obsoleteNameMaySurviveInModernDerivedName: true,
  dreamMayLayerHistoricalAtlasEvidence: true,
  dreamLayerMakesHistoricalClaimAutomaticallyCanon: false,
  futureOfficialSetChangeMayBeAssumedFromHistory: false,
  merchandiseIdentityShouldDependOnObsoleteSetByDefault: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type ConstellationHistoryEvidenceKind =
  | 'MODERN_STANDARDIZATION'
  | 'OBSOLETE_CONSTELLATION'
  | 'SURVIVING_NAME_FOSSIL'
  | 'LATER_INTRODUCED_ACCEPTED_CONSTELLATION'
  | 'LARGE_HISTORIC_CONSTELLATION_RESTRUCTURED';

export type ConstellationHistoryEvidence = Readonly<{
  id: string;
  kind: ConstellationHistoryEvidenceKind;
  label: string;
  approximateDate: string;
  modernStatus: string;
  historicalUse: string;
  yorunoUse: string;
  core5Constraint: string;
  sourceAnchors: readonly string[];
}>;

export const CONSTELLATION_HISTORY_EVIDENCE: readonly ConstellationHistoryEvidence[] = [
  {
    id: 'iau-88-standardization',
    kind: 'MODERN_STANDARDIZATION',
    label: 'IAU 88 constellations / modern standardization',
    approximateDate: '1922_NAMES_AND_ABBREVIATIONS_DIRECTION / 1928_BOUNDARIES_ADOPTED / 1930_DELporte_PUBLICATION',
    modernStatus: 'CURRENT_MODERN_REFERENCE_FRAME',
    historicalUse: 'The modern 88-constellation framework was standardized before the post-1945 Core5 reality lane.',
    yorunoUse: 'Use as a guard against a false Tomori-vs-Yui official-list difference. The clue must come from an older source layer, cultural star lore, or another historically valid difference.',
    core5Constraint: 'TOMORI_POSTWAR_AND_YUI_PRESENT_DO_NOT_GET_DIFFERENT_IAU_88_LISTS_BY_DEFAULT',
    sourceAnchors: ['IAU_CONSTELLATIONS_PUBLIC_HISTORY', 'DELporte_1930_DÉLIMITATION_SCIENTIFIQUE_DES_CONSTELLATIONS'],
  },
  {
    id: 'quadrans-muralis',
    kind: 'SURVIVING_NAME_FOSSIL',
    label: 'Quadrans Muralis',
    approximateDate: 'LATE_18TH_CENTURY_CONSTELLATION / ABSENT_FROM_MODERN_88',
    modernStatus: 'OBSOLETE_CONSTELLATION_NAME_SURVIVES_IN_QUADRANTID_METEOR_SHOWER',
    historicalUse: 'A former constellation near the modern Boötes/Draco region disappeared from the official modern set, while the Quadrantid meteor-shower name preserves the older constellation name.',
    yorunoUse: 'Strongest clean history clue: a modern character can know “Quadrantids” while an archival atlas reveals the missing constellation behind the name.',
    core5Constraint: 'DO_NOT_CLAIM_QUADRANS_MURALIS_WAS_OFFICIAL_IN_POSTWAR_TOMORI_REALITY',
    sourceAnchors: ['HISTORICAL_ATLAS_EVIDENCE', 'MODERN_METEOR_SHOWER_NAMING_REFERENCE'],
  },
  {
    id: 'argo-navis',
    kind: 'LARGE_HISTORIC_CONSTELLATION_RESTRUCTURED',
    label: 'Argo Navis',
    approximateDate: 'ANCIENT_CONSTELLATION / EARLY_MODERN_RESTRUCTURING / ABSENT_AS_ONE_OF_MODERN_88',
    modernStatus: 'HISTORIC_LARGE_CONSTELLATION_NO_LONGER_ONE_MODERN_CONSTELLATION',
    historicalUse: 'The ancient ship constellation was later represented through modern southern constellations including Carina, Puppis, and Vela rather than one IAU constellation called Argo Navis.',
    yorunoUse: 'Good motif for “one remembered shape becoming several accepted shapes” without requiring stars themselves to disappear.',
    core5Constraint: 'USE_AS_HISTORICAL_ATLAS_OR_SHAPE_HISTORY_NOT_POSTWAR_LIST_CHANGE',
    sourceAnchors: ['PTOLEMAIC_CONSTELLATION_HISTORY', 'LACAILLE_SOUTHERN_SKY_HISTORY', 'IAU_88_REFERENCE'],
  },
  {
    id: 'antinous',
    kind: 'OBSOLETE_CONSTELLATION',
    label: 'Antinous',
    approximateDate: 'ANCIENT_FIGURE_WITH_EARLY_MODERN_CONSTELLATION_USAGE / ABSENT_FROM_MODERN_88',
    modernStatus: 'NOT_ONE_OF_MODERN_88 / STARS_ASSOCIATED_WITH_AQUILA_REGION',
    historicalUse: 'Antinous was represented beside or within Aquila in historical constellation traditions and atlases but is not one of the modern 88.',
    yorunoUse: 'Useful for an archival marginal figure whose identity is absorbed into a larger accepted constellation.',
    core5Constraint: 'ARCHIVAL_LAYER_ONLY_UNLESS_SEPARATE_CULTURAL_SOURCE_IS_ESTABLISHED',
    sourceAnchors: ['HISTORICAL_CONSTELLATION_ATLAS', 'IAU_88_REFERENCE'],
  },
  {
    id: 'felis',
    kind: 'OBSOLETE_CONSTELLATION',
    label: 'Felis',
    approximateDate: 'LATE_18TH_CENTURY / ABSENT_FROM_MODERN_88',
    modernStatus: 'OBSOLETE',
    historicalUse: 'A cat constellation appeared in late-18th/19th-century constellation material but was not retained in the modern 88.',
    yorunoUse: 'Memorable merchandising-friendly archival symbol, but should be a hidden/obsolete layer rather than a modern official zodiac identity.',
    core5Constraint: 'DO_NOT_ASSIGN_AS_POSTWAR_OFFICIAL_CONSTELLATION',
    sourceAnchors: ['HISTORICAL_ATLAS_EVIDENCE', 'IAU_88_REFERENCE'],
  },
  {
    id: 'machina-electrica',
    kind: 'OBSOLETE_CONSTELLATION',
    label: 'Machina Electrica',
    approximateDate: 'AROUND_1800 / ABSENT_FROM_MODERN_88',
    modernStatus: 'OBSOLETE',
    historicalUse: 'Early-modern/Enlightenment-era atlases could turn contemporary technology into constellation imagery; this one was not retained in the modern 88.',
    yorunoUse: 'Excellent bridge to Asa/Noa/Rum themes: technology becoming mythic sky imagery is historically precedented, without claiming the future keeps this constellation.',
    core5Constraint: 'HISTORICAL_PARALLEL_NOT_FUTURE_CANON',
    sourceAnchors: ['BODE_URANOGRAPHIA_1801_ATLAS', 'IAU_88_REFERENCE'],
  },
  {
    id: 'officina-typographica',
    kind: 'OBSOLETE_CONSTELLATION',
    label: 'Officina Typographica',
    approximateDate: 'LATE_18TH_TO_EARLY_19TH_CENTURY / ABSENT_FROM_MODERN_88',
    modernStatus: 'OBSOLETE',
    historicalUse: 'Printing technology was commemorated in a historical constellation concept that did not survive modern standardization.',
    yorunoUse: 'Useful for Shiro/archive themes: media technology can leave a temporary sky taxonomy and then vanish from the official map.',
    core5Constraint: 'ARCHIVAL_EVIDENCE_ONLY',
    sourceAnchors: ['HISTORICAL_ATLAS_EVIDENCE', 'IAU_88_REFERENCE'],
  },
  {
    id: 'robur-carolinum',
    kind: 'OBSOLETE_CONSTELLATION',
    label: 'Robur Carolinum',
    approximateDate: 'LATE_17TH_CENTURY / ABSENT_FROM_MODERN_88',
    modernStatus: 'OBSOLETE',
    historicalUse: 'A politically commemorative constellation demonstrates that constellation naming could reflect patrons and historical power rather than timeless natural divisions.',
    yorunoUse: 'Good evidence for “the sky map is also a human document,” supporting themes of authority and memory without inventing astronomy.',
    core5Constraint: 'DO_NOT_TREAT_HISTORICAL_NAME_AS_NEUTRAL_ETERNAL_TRUTH',
    sourceAnchors: ['HALLEY_HISTORICAL_CONSTELLATION_CONTEXT', 'IAU_88_REFERENCE'],
  },
  {
    id: 'plancius-southern-set',
    kind: 'LATER_INTRODUCED_ACCEPTED_CONSTELLATION',
    label: 'Late-16th-century southern constellations associated with Plancius / Keyser / de Houtman observations',
    approximateDate: 'LATE_16TH_CENTURY',
    modernStatus: 'MULTIPLE_MEMBERS_RETAINED_IN_MODERN_88',
    historicalUse: 'Several now-standard southern constellations entered European star mapping after voyages and southern-sky observations, showing that the accepted constellation repertoire was historically enlarged.',
    yorunoUse: 'Supports a “not yet on this map / later normal” clue if the story ever reaches a sufficiently early historical source layer.',
    core5Constraint: 'TOO_EARLY_TO_CREATE_OFFICIAL_LIST_DIFFERENCE_BETWEEN_POSTWAR_TOMORI_AND_PRESENT_YUI',
    sourceAnchors: ['EARLY_MODERN_SOUTHERN_SKY_HISTORY', 'IAU_88_REFERENCE'],
  },
  {
    id: 'lacaille-instrument-set',
    kind: 'LATER_INTRODUCED_ACCEPTED_CONSTELLATION',
    label: 'Lacaille southern/instrument constellations',
    approximateDate: 'MID_18TH_CENTURY',
    modernStatus: 'MULTIPLE_MEMBERS_RETAINED_IN_MODERN_88',
    historicalUse: 'Lacaille introduced several southern and scientific-instrument constellations, many of which remain in the modern 88.',
    yorunoUse: 'Strong historical precedent for a culture/era projecting contemporary tools into the sky; useful thematic mirror for future technology without auto-inventing future constellations.',
    core5Constraint: 'HISTORICAL_PRECEDENT_ONLY_FOR_CURRENT_CORE5_TIMELINE',
    sourceAnchors: ['LACAILLE_SOUTHERN_SKY_HISTORY', 'IAU_88_REFERENCE'],
  },
] as const;

export const CONSTELLATION_HISTORY_YORUNO_CANDIDATES = [
  {
    id: 'quadrantid-ghost-name-clue',
    status: 'RESEARCH_BACKED_CANDIDATE_NOT_CANON',
    strength: 'VERY_HIGH',
    premise: 'Quadrantids preserve the name of obsolete Quadrans Muralis, letting a modern term point backward to a constellation no longer in the official set.',
    safeForCurrentCore5Eras: true,
    requiresPre1930CharacterEra: false,
  },
  {
    id: 'old-atlas-inherited-layer',
    status: 'RESEARCH_BACKED_CANDIDATE_NOT_CANON',
    strength: 'VERY_HIGH',
    premise: 'Tomori or another postwar character can possess/inherit an older atlas showing obsolete constellations; the difference belongs to the object’s publication era, not Tomori’s contemporary official sky.',
    safeForCurrentCore5Eras: true,
    requiresPre1930CharacterEra: false,
  },
  {
    id: 'argo-one-to-many-shape-clue',
    status: 'RESEARCH_BACKED_CANDIDATE_NOT_CANON',
    strength: 'HIGH',
    premise: 'Argo Navis provides a real precedent for one historical constellation identity becoming several modern constellation identities.',
    safeForCurrentCore5Eras: true,
    requiresPre1930CharacterEra: false,
  },
  {
    id: 'technology-becomes-sky-taxonomy',
    status: 'RESEARCH_BACKED_CANDIDATE_NOT_CANON',
    strength: 'HIGH',
    premise: 'Historical technological constellations such as Machina Electrica / Officina Typographica support a recurring motif that humans project contemporary technology into the sky.',
    safeForCurrentCore5Eras: true,
    requiresPre1930CharacterEra: false,
  },
  {
    id: 'official-list-difference-tomori-yui',
    status: 'REJECT_AS_HISTORICALLY_FALSE_FOR_CURRENT_ERA_BANDS',
    strength: 'BLOCKED',
    premise: 'Postwar Tomori and present Yui should not be given different official IAU 88 constellation inventories merely because decades differ.',
    safeForCurrentCore5Eras: false,
    requiresPre1930CharacterEra: true,
  },
] as const;

export const constellationHistoryResearchSummary = {
  evidenceRows: CONSTELLATION_HISTORY_EVIDENCE.length,
  candidateRows: CONSTELLATION_HISTORY_YORUNO_CANDIDATES.length,
  veryHighCandidates: CONSTELLATION_HISTORY_YORUNO_CANDIDATES.filter((entry) => entry.strength === 'VERY_HIGH').length,
  blockedCandidates: CONSTELLATION_HISTORY_YORUNO_CANDIDATES.filter((entry) => entry.strength === 'BLOCKED').length,
  tomoriVsYuiOfficial88SetDiffersByEra: false,
  runtimeAutoPromotionAllowed: false,
} as const;
