export const CONSTELLATION_STORY_CLUE_RULES = {
  authority: 'docs/constellation-story-clue-reservoir-v1.md',
  researchAuthority: 'docs/research/constellation-history-usable-v1.md',
  status: 'AUTHOR_RESERVOIR_RESEARCH_BACKED_NON_CANON',
  clueCountRequired: 8,
  historicallyFalseTomoriYuiOfficialListDiffAllowed: false,
  clueMayRewriteCore5EraAutomatically: false,
  clueMayPromoteObsoleteConstellationToModernOfficial: false,
  obsoleteMeansEvil: false,
  characterMerchIdentityDependsOnObsoleteSetByDefault: false,
  dreamCanUseArchiveLayerWithoutRealityRetcon: true,
  runtimeAutoPromotionAllowed: false,
} as const;

export type ConstellationClueStrength = 'S' | 'A' | 'B';
export type ConstellationClueMechanism =
  | 'NAME_FOSSIL'
  | 'ARCHIVAL_ATLAS'
  | 'ONE_TO_MANY_RESTRUCTURE'
  | 'TECHNOLOGY_PROJECTED_TO_SKY'
  | 'AUTHORITY_NAMING_HISTORY'
  | 'ABSORBED_FIGURE'
  | 'OBSOLETE_VISUAL_ARCHIVE'
  | 'LATER_ACCEPTED_SET_HISTORY';

export type ConstellationStoryClueCandidate = Readonly<{
  id: string;
  status: 'AUTHOR_CANDIDATE_NON_CANON';
  strength: ConstellationClueStrength;
  mechanism: ConstellationClueMechanism;
  historicalAnchorIds: readonly string[];
  characterHooks: readonly string[];
  eraMechanism: string;
  sceneSeed: string;
  mysteryUse: string;
  requiredEvidenceBeforeCanon: readonly string[];
  merchPolicy: string;
  bossSideUse: string;
  forbiddenShortcut: string;
}>;

export const CONSTELLATION_STORY_CLUE_CANDIDATES: readonly ConstellationStoryClueCandidate[] = [
  {
    id: 'quadrantid-name-fossil',
    status: 'AUTHOR_CANDIDATE_NON_CANON',
    strength: 'S',
    mechanism: 'NAME_FOSSIL',
    historicalAnchorIds: ['quadrans-muralis'],
    characterHooks: ['shiro','yui','nagi'],
    eraMechanism: 'Modern vocabulary preserves a name from an obsolete constellation without requiring a pre-1930 character reality.',
    sceneSeed: 'A modern character says “しぶんぎ座流星群”; Shiro or another archive-minded character later finds Quadrans Muralis drawn as an actual constellation in an old atlas.',
    mysteryUse: 'A name can survive after the accepted shape disappears: memory fossil rather than timeline contradiction.',
    requiredEvidenceBeforeCanon: ['source-specific Quadrans Muralis creation/atlas note','modern Quadrantids naming authority','Japanese naming check for しぶんぎ座流星群'],
    merchPolicy: 'Do not make Quadrans Muralis a main Character modern constellation identity; use clue/archive iconography.',
    bossSideUse: 'Strong candidate for an 外典星座/Archive-side individual because modern language already preserves its ghost name.',
    forbiddenShortcut: 'Do not say Tomori personally lived under a different official postwar constellation list.',
  },
  {
    id: 'tomori-inherited-old-atlas',
    status: 'AUTHOR_CANDIDATE_NON_CANON',
    strength: 'S',
    mechanism: 'ARCHIVAL_ATLAS',
    historicalAnchorIds: ['quadrans-muralis','felis','machina-electrica','officina-typographica'],
    characterHooks: ['tomori','shiro'],
    eraMechanism: 'The historical difference belongs to the atlas publication era, not Tomori’s postwar contemporary official constellation set.',
    sceneSeed: 'A repaired or inherited star atlas in Tomori’s ordinary-life material contains figures missing from a modern star guide; wear, notes, or repaired binding makes the object part of his lived history.',
    mysteryUse: 'The book becomes a physical bridge: old sky taxonomy survives in an object after the official map changes.',
    requiredEvidenceBeforeCanon: ['choose exact atlas/publication era','confirm selected obsolete figures actually appear in that source','check plausibility of the book reaching postwar Japan'],
    merchPolicy: 'Excellent prop/Archive-page collectible; keep the main Tomori star identity independent from obsolete figures.',
    bossSideUse: 'The atlas can serve as the discovery surface for several 外典星座 without making Tomori their owner.',
    forbiddenShortcut: 'Do not invent an exact antique edition or provenance until source/availability research is complete.',
  },
  {
    id: 'argo-one-to-many',
    status: 'AUTHOR_CANDIDATE_NON_CANON',
    strength: 'A',
    mechanism: 'ONE_TO_MANY_RESTRUCTURE',
    historicalAnchorIds: ['argo-navis'],
    characterHooks: ['rum','noa','kai','nao','asa'],
    eraMechanism: 'A historical constellation identity can be resegmented without the underlying stars disappearing.',
    sceneSeed: 'A diagram overlays Argo Navis with modern Carina/Puppis/Vela boundaries; different characters disagree whether the old “one ship” or later parts are the more truthful identity.',
    mysteryUse: 'Strong thematic mirror for copies, instances, twins, and one identity becoming multiple recognized units.',
    requiredEvidenceBeforeCanon: ['source note for Argo historical treatment','modern IAU region mapping review','avoid saying Pyxis is simply a direct IAU fragment of Argo without source nuance'],
    merchPolicy: 'Use as diagram/motif, not a forced Character zodiac assignment.',
    bossSideUse: 'Could inspire a multi-phase or multi-entity Archive boss, but gameplay/design needs separate approval.',
    forbiddenShortcut: 'Do not equate splitting with loss of personhood or make Robot/twin identity conclusions automatic.',
  },
  {
    id: 'machina-electrica-era-mirror',
    status: 'AUTHOR_CANDIDATE_NON_CANON',
    strength: 'A',
    mechanism: 'TECHNOLOGY_PROJECTED_TO_SKY',
    historicalAnchorIds: ['machina-electrica'],
    characterHooks: ['asa','noa','rum'],
    eraMechanism: 'Historical people projected contemporary technology into constellation imagery, so future technology is not uniquely “unnatural”.',
    sceneSeed: 'Asa sees a historical electric-machine constellation and realizes an old atlas can look more technologically self-conscious than a modern myth-only stereotype suggests.',
    mysteryUse: 'Shows every era writes itself into the sky; future society is not an alien break from Human symbolic behavior.',
    requiredEvidenceBeforeCanon: ['verify exact historical atlas placement/date','verify creator/source attribution','review Japanese translation/display name'],
    merchPolicy: 'Archive emblem or research-card motif; do not auto-assign to Asa/Noa/Rum.',
    bossSideUse: 'Strong obsolete-technology Archive figure; avoid appliance/Robot dehumanization.',
    forbiddenShortcut: 'Do not make artificial characters “belong” to machine constellations because of their bodies.',
  },
  {
    id: 'officina-typographica-record-medium',
    status: 'AUTHOR_CANDIDATE_NON_CANON',
    strength: 'A',
    mechanism: 'TECHNOLOGY_PROJECTED_TO_SKY',
    historicalAnchorIds: ['officina-typographica'],
    characterHooks: ['shiro','kuroori'],
    eraMechanism: 'A media/record technology can be commemorated in a sky figure and later disappear from the accepted map.',
    sceneSeed: 'Shiro finds a printing-workshop sky figure in an old plate beside records whose own catalog labels have changed; “preserving information” and “preserving classification” separate.',
    mysteryUse: 'Record media are not eternal truth: archives preserve traces while their indexing systems can vanish.',
    requiredEvidenceBeforeCanon: ['verify exact historical source/creator','confirm imagery and placement','review whether “printing office/workshop” Japanese wording fits chosen source'],
    merchPolicy: 'Ideal Lorebook/archive insignia; low priority for main Character merchandise.',
    bossSideUse: 'Could become an archive-themed 外典星座 or environmental symbol rather than a combatant.',
    forbiddenShortcut: 'Do not imply written record is false merely because classification changes.',
  },
  {
    id: 'robur-authority-sky-map',
    status: 'AUTHOR_CANDIDATE_NON_CANON',
    strength: 'A',
    mechanism: 'AUTHORITY_NAMING_HISTORY',
    historicalAnchorIds: ['robur-carolinum'],
    characterHooks: ['nagi','kuroori','ren'],
    eraMechanism: 'Historical constellation naming can reflect patronage/power, demonstrating that a sky map is also a Human authority document.',
    sceneSeed: 'Two atlases disagree not because stars moved but because names/figures reflect different authority histories; Ren treats that as evidence about the map-maker, not the stars.',
    mysteryUse: 'Useful meta-theme for Canon/Candidate/Authority: official naming and existence are related but not identical concepts.',
    requiredEvidenceBeforeCanon: ['verify Halley/Charles II context and atlas history','separate naming motive from later-obsolete status','avoid partisan historical simplification'],
    merchPolicy: 'Research/Archive layer only unless later story role earns more prominence.',
    bossSideUse: 'Good conceptual leader/authority motif, but “political name = villain” is prohibited.',
    forbiddenShortcut: 'Do not turn historical patronage into simple proof that all official constellations are arbitrary or corrupt.',
  },
  {
    id: 'antinous-absorbed-name',
    status: 'AUTHOR_CANDIDATE_NON_CANON',
    strength: 'B',
    mechanism: 'ABSORBED_FIGURE',
    historicalAnchorIds: ['antinous'],
    characterHooks: ['tobari','nemu','chloe'],
    eraMechanism: 'A historical figure-name can disappear as a standalone constellation while the stars remain in a larger accepted region.',
    sceneSeed: 'An old figure is visible in the same star field where a modern guide gives only the larger constellation name.',
    mysteryUse: 'Supports “the person-name can vanish without the physical lights vanishing” but requires careful cultural-history treatment.',
    requiredEvidenceBeforeCanon: ['specific atlas/tradition verification','myth/history review','sensitivity review of Antinous historical context'],
    merchPolicy: 'Avoid casual mascotization; Archive research only until cultural context is reviewed.',
    bossSideUse: 'Possible solemn Archive figure; not a generic enemy skin.',
    forbiddenShortcut: 'Do not use Antinous only as aesthetic tragedy stripped of historical/cultural context.',
  },
  {
    id: 'felis-secret-archive',
    status: 'AUTHOR_CANDIDATE_NON_CANON',
    strength: 'B',
    mechanism: 'OBSOLETE_VISUAL_ARCHIVE',
    historicalAnchorIds: ['felis'],
    characterHooks: ['yomo','kuu','koyori'],
    eraMechanism: 'A visually memorable obsolete animal constellation can appear in an archive without becoming a modern official identity.',
    sceneSeed: 'A cat figure appears only when comparing an older atlas layer; Yomo reacts as a cat, not as if the constellation were “his”.',
    mysteryUse: 'Good low-stakes entry clue teaching the audience that old atlases contain figures absent from modern 88.',
    requiredEvidenceBeforeCanon: ['verify creator/date/source-specific Felis evidence','confirm selected atlas image rights/usage path if reproduced','avoid animal-character ownership shorthand'],
    merchPolicy: 'Secret sticker/Archive collectible can work; do not make Yomo main zodiac Felis by default.',
    bossSideUse: 'Visually strong low-tier 外典星座 candidate, but species similarity does not establish relationship to Yomo.',
    forbiddenShortcut: 'cat character != cat constellation owner; obsolete != evil.',
  },
] as const;

export const constellationStoryClueSummary = {
  clueCount: CONSTELLATION_STORY_CLUE_CANDIDATES.length,
  sTierCount: CONSTELLATION_STORY_CLUE_CANDIDATES.filter((entry) => entry.strength === 'S').length,
  aTierCount: CONSTELLATION_STORY_CLUE_CANDIDATES.filter((entry) => entry.strength === 'A').length,
  bTierCount: CONSTELLATION_STORY_CLUE_CANDIDATES.filter((entry) => entry.strength === 'B').length,
  uniqueIds: new Set(CONSTELLATION_STORY_CLUE_CANDIDATES.map((entry) => entry.id)).size,
  runtimeAutoPromotionAllowed: false,
} as const;
