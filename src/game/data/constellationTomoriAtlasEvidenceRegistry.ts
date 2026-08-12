export const TOMORI_OLD_ATLAS_RESEARCH_RULES = {
  status: 'RESEARCH_NON_CANON',
  authority: 'docs/research/tomori-old-atlas-evidence-v1.md',
  evidenceCountRequired: 4,
  tomoriOwnershipMayBeInferred: false,
  exactArtifactProvenanceMayBeInferred: false,
  quadransPresenceInJapanese1924ChartConfirmed: false,
  tomoriYuiOfficialConstellationListDifferenceAllowed: false,
  inheritedOldAtlasStoryHookStatus: 'AUTHOR_CANDIDATE_REQUIRES_MORE_EVIDENCE',
  runtimeAutoPromotionAllowed: false,
} as const;

export type TomoriAtlasEvidenceStatus =
  | 'VERIFIED_RESEARCH'
  | 'VERIFIED_BIBLIOGRAPHIC_CONTENT_OPEN';

export type TomoriAtlasEvidence = Readonly<{
  id: string;
  status: TomoriAtlasEvidenceStatus;
  sourceClass: 'IAU_OFFICIAL' | 'NASA_OFFICIAL' | 'NDL_BIBLIOGRAPHIC';
  sourceUrl: string;
  sourceDateOrPublication: string;
  verifiedClaim: string;
  doesNotProve: string;
  storyUse: string;
  nextEvidenceNeeded: string;
}>;

export const TOMORI_OLD_ATLAS_EVIDENCE: readonly TomoriAtlasEvidence[] = [
  {
    id: 'iau-modern-88-1922',
    status: 'VERIFIED_RESEARCH',
    sourceClass: 'IAU_OFFICIAL',
    sourceUrl: 'https://www.iau.org/Iau/Science/What-we-do/The-Constellations.aspx',
    sourceDateOrPublication: 'IAU first General Assembly, Rome, 1922',
    verifiedClaim: 'IAU agreed an internationally recognized list of 88 constellations in 1922; these are the modern 88 still recognized today.',
    doesNotProve: 'This does not prove what any one Japanese household atlas contained, nor that every popular publication immediately used identical diagrams.',
    storyUse: 'Reject Tomori official constellation set != Yui official constellation set. Any obsolete-constellation clue for Tomori must come from an older/inherited archival source, not his era official set.',
    nextEvidenceNeeded: 'None for the 1922 official-list guard; use a separate material-provenance source for Tomori atlas ownership.',
  },
  {
    id: 'nasa-quadrans-quadrantids-name-fossil',
    status: 'VERIFIED_RESEARCH',
    sourceClass: 'NASA_OFFICIAL',
    sourceUrl: 'https://science.nasa.gov/solar-system/meteors-meteorites/quadrantids/',
    sourceDateOrPublication: 'NASA Science page, updated 2025-04-03',
    verifiedClaim: 'Quadrans Muralis was created by Jérôme Lalande in 1795, was omitted from the IAU modern list in 1922, while the Quadrantids meteor-shower name preserves the old constellation name.',
    doesNotProve: 'The name fossil does not prove a Character owned a Quadrans Muralis atlas, and it does not assign zodiac, Star Beast, fate, morality, or enemy identity.',
    storyUse: 'Strong historical basis for the “shape disappears, name remains” clue and for a later payoff in which a modern meteor-shower name points backward to an obsolete constellation.',
    nextEvidenceNeeded: 'For Tomori-specific use, establish a plausible physical document route into his possession and inspect that exact document for Quadrans Muralis.',
  },
  {
    id: 'ndl-seiza-no-zu-1924',
    status: 'VERIFIED_BIBLIOGRAPHIC_CONTENT_OPEN',
    sourceClass: 'NDL_BIBLIOGRAPHIC',
    sourceUrl: 'https://ndlsearch.ndl.go.jp/books/R100000039-I14488756',
    sourceDateOrPublication: '古川竜城 編『星座の図』新光社, 1924 (大正13), 8p + 図版12枚',
    verifiedClaim: 'A Japanese star-chart publication titled 星座の図 was published in Tokyo in 1924 and survives as an openly viewable NDL digital item with twelve plates.',
    doesNotProve: 'Its bibliographic record alone does not prove Quadrans Muralis appears in the plates. Because publication is after the 1922 IAU list decision, obsolete-constellation content must be inspected rather than assumed.',
    storyUse: 'Evidence that compact illustrated star-chart material existed in prewar Japan and could physically survive into a postwar household, supporting the material form of an inherited-atlas clue without selecting the exact artifact yet.',
    nextEvidenceNeeded: 'Inspect all twelve plates and explanatory pages. If Quadrans Muralis is absent, retain only as material-culture context and search earlier/imported atlases.',
  },
  {
    id: 'ndl-tenkai-periodical-from-1920',
    status: 'VERIFIED_BIBLIOGRAPHIC_CONTENT_OPEN',
    sourceClass: 'NDL_BIBLIOGRAPHIC',
    sourceUrl: 'https://ndlsearch.ndl.go.jp/books/R100000039-I3220153',
    sourceDateOrPublication: '『天界 = The heavens』刊行巻次: 第1巻第1号 (大正9年11月号)-',
    verifiedClaim: 'NDL bibliographic metadata records the Japanese astronomy periodical 天界 as beginning with volume 1 issue 1 in November 1920, showing an amateur/popular astronomy publication culture before the IAU 1922 constellation list.',
    doesNotProve: 'A later catalog entry does not prove a specific early issue discussed Quadrans Muralis, nor that Tomori or his family subscribed to or read the periodical.',
    storyUse: 'Supports the plausibility of prewar astronomy reading communities and a route by which older astronomical vocabulary or foreign-chart knowledge could circulate in Japan.',
    nextEvidenceNeeded: 'Locate and inspect relevant 1920s issues or indexes for obsolete-constellation terminology, star-chart references, or imported-atlas discussion before using a specific magazine clue.',
  },
];

export const TOMORI_OLD_ATLAS_RESEARCH_SUMMARY = {
  evidenceCount: TOMORI_OLD_ATLAS_EVIDENCE.length,
  verifiedResearchCount: TOMORI_OLD_ATLAS_EVIDENCE.filter((entry) => entry.status === 'VERIFIED_RESEARCH').length,
  bibliographicContentOpenCount: TOMORI_OLD_ATLAS_EVIDENCE.filter((entry) => entry.status === 'VERIFIED_BIBLIOGRAPHIC_CONTENT_OPEN').length,
  tomoriSpecificArtifactConfirmed: false,
  quadransInJapaneseCandidateConfirmed: false,
  recommendedStoryState: 'KEEP_TOMORI_INHERITED_OLD_ATLAS_AS_AUTHOR_CANDIDATE',
} as const;
