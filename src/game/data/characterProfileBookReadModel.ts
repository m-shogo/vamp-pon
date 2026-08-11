import {
  CHARACTER_AUTHOR_DB_COVERAGE,
  CHARACTER_AUTHOR_DB_RULES,
  type CharacterRosterLayer,
} from './characterAuthorDbCoverageManifest.ts';

export const CHARACTER_PROFILE_BOOK_RULES = {
  authority: 'docs/character-profile-book-read-model-v1.md',
  status: 'AUTHORING_READ_MODEL_CURRENT_NO_RUNTIME_PROMOTION',
  authorFacingOnly: true,
  separateWebConsumerAllowed: true,
  gameRuntimeConsumerAllowed: false,
  duplicatesStoryAuthority: false,
  sectionCountRequired: 6,
  dimensionCountRequired: 21,
  characterCountRequired: 36,
  everyDimensionAssignedExactlyOnce: true,
  sourceStatusMustRemainVisible: true,
  rosterLayerMustRemainVisible: true,
  stableProfileIdMustRemainVisible: true,
  authorIdIsRouteSlug: true,
  stableProfileAliasIsRouteSlug: false,
  spoilerSafePublicProjectionDefined: false,
  missingDataMayRenderAsFalse: false,
  authorReservoirMayRenderAsCanon: false,
  future15MayRenderAsCurrent21: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type CharacterProfileBookDimensionKey = keyof (typeof CHARACTER_AUTHOR_DB_COVERAGE)[number]['coverage'];
export type CharacterProfileBookSectionId =
  | 'identity-authority'
  | 'ordinary-life'
  | 'social-boundaries'
  | 'expression-voice'
  | 'learning-memory'
  | 'material-trace';

export type CharacterProfileBookSectionDefinition = Readonly<{
  id: CharacterProfileBookSectionId;
  label: string;
  shortLabel: string;
  purpose: string;
  dimensions: readonly CharacterProfileBookDimensionKey[];
}>;

export const CHARACTER_PROFILE_BOOK_SECTIONS: readonly CharacterProfileBookSectionDefinition[] = [
  {
    id: 'identity-authority',
    label: 'Identity & Authority',
    shortLabel: 'Identity',
    purpose: 'Who this person is in the authority stack, when they belong, and which visual identity fields are authoritative versus candidate.',
    dimensions: ['realityRoot','seasonArchitecture','themeColor','physicalIdentityAuthority'],
  },
  {
    id: 'ordinary-life',
    label: 'Ordinary Life',
    shortLabel: 'Life',
    purpose: 'How the character exists when no major plot event is happening: place, senses, money, play, rest, and ordinary routine.',
    dimensions: ['ordinaryLife','livingPlace','environmentSensory','everydayEconomy','leisurePlay','restDailyRhythm'],
  },
  {
    id: 'social-boundaries',
    label: 'Social & Boundaries',
    shortLabel: 'Social',
    purpose: 'How the character approaches people, commitments, shared space, and interpersonal boundaries without converting them into relationship scores.',
    dimensions: ['socialChemistry','decisionCommitment','sharedSpaceEtiquette'],
  },
  {
    id: 'expression-voice',
    label: 'Expression & Voice',
    shortLabel: 'Voice',
    purpose: 'How personality becomes observable through behavior, communication, humor, address forms, pauses, silence, and vocal rhythm without freezing final dialogue or casting.',
    dimensions: ['behaviorIdentity','communicationHabit','humorTeasing','addressNamingRegister','voiceProsody'],
  },
  {
    id: 'learning-memory',
    label: 'Learning & Memory',
    shortLabel: 'Mind',
    purpose: 'How the character learns, asks for help, remembers, forgets, compares recollections, and handles uncertainty without intelligence or truth ranking.',
    dimensions: ['competenceLearning','memoryRemembering'],
  },
  {
    id: 'material-trace',
    label: 'Material Trace',
    shortLabel: 'Trace',
    purpose: 'What lived objects and traces can make the character legible in scenes without turning possessions into Canon biography.',
    dimensions: ['livedArtifact'],
  },
] as const;

export type CharacterProfileBookSectionCoverage = Readonly<{
  sectionId: CharacterProfileBookSectionId;
  label: string;
  coveredDimensionCount: number;
  totalDimensionCount: number;
  fullyCovered: boolean;
  dimensions: readonly Readonly<{
    key: CharacterProfileBookDimensionKey;
    covered: boolean;
    sourceStatus: string;
  }>[];
}>;

export type CharacterProfileBookIndexEntry = Readonly<{
  routeSlug: string;
  authorId: string;
  stableProfileId: string;
  name: string;
  rosterLayer: CharacterRosterLayer;
  totalDimensionCount: number;
  coveredDimensionCount: number;
  fullyCovered: boolean;
  sections: readonly CharacterProfileBookSectionCoverage[];
}>;

export const CHARACTER_PROFILE_BOOK_INDEX: readonly CharacterProfileBookIndexEntry[] = CHARACTER_AUTHOR_DB_COVERAGE.map((entry) => {
  const sections = CHARACTER_PROFILE_BOOK_SECTIONS.map((section) => {
    const dimensions = section.dimensions.map((key) => ({
      key,
      covered: Boolean(entry.coverage[key]),
      sourceStatus: String(entry.sourceStatus[key]),
    }));
    return {
      sectionId: section.id,
      label: section.label,
      coveredDimensionCount: dimensions.filter((dimension) => dimension.covered).length,
      totalDimensionCount: dimensions.length,
      fullyCovered: dimensions.every((dimension) => dimension.covered),
      dimensions,
    } as const;
  });

  const allDimensions = sections.flatMap((section) => section.dimensions);
  return {
    routeSlug: entry.authorId,
    authorId: entry.authorId,
    stableProfileId: entry.stableProfileId,
    name: entry.name,
    rosterLayer: entry.rosterLayer,
    totalDimensionCount: allDimensions.length,
    coveredDimensionCount: allDimensions.filter((dimension) => dimension.covered).length,
    fullyCovered: allDimensions.every((dimension) => dimension.covered),
    sections,
  } as const;
});

export const characterProfileBookReadModelSummary = {
  sectionCount: CHARACTER_PROFILE_BOOK_SECTIONS.length,
  assignedDimensionCount: CHARACTER_PROFILE_BOOK_SECTIONS.reduce((sum, section) => sum + section.dimensions.length, 0),
  uniqueDimensionCount: new Set(CHARACTER_PROFILE_BOOK_SECTIONS.flatMap((section) => section.dimensions)).size,
  characterCount: CHARACTER_PROFILE_BOOK_INDEX.length,
  current21Count: CHARACTER_PROFILE_BOOK_INDEX.filter((entry) => entry.rosterLayer === 'CURRENT21').length,
  future15Count: CHARACTER_PROFILE_BOOK_INDEX.filter((entry) => entry.rosterLayer === 'FUTURE15').length,
  fullyCoveredCharacterCount: CHARACTER_PROFILE_BOOK_INDEX.filter((entry) => entry.fullyCovered).length,
  uniqueRouteSlugCount: new Set(CHARACTER_PROFILE_BOOK_INDEX.map((entry) => entry.routeSlug)).size,
  uniqueStableProfileIdCount: new Set(CHARACTER_PROFILE_BOOK_INDEX.map((entry) => entry.stableProfileId)).size,
  sourceCoverageDimensions: CHARACTER_AUTHOR_DB_RULES.coverageDimensionCountRequired,
  runtimeAutoPromotionAllowed: false,
} as const;
