import fs from 'node:fs';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const requiredSourcePaths = [
  'docs/00-current-story-world-master.md',
  'docs/character-author-db-schema-and-coverage-v1.md',
  'docs/character-author-db-environment-coverage-extension-v1.md',
  'docs/character-author-db-life-coverage-extension-v1.md',
  'docs/character-author-db-experience-coverage-extension-v1.md',
  'docs/character-author-db-boundary-rhythm-coverage-extension-v1.md',
  'src/game/data/characterAuthorDbCoverageManifest.ts',
  'src/game/data/characterRealityRootRegistry.ts',
  'src/game/data/characterOrdinaryLifeReservoir.ts',
  'src/game/data/current21SocialChemistryReservoir.ts',
  'src/game/data/future15SocialChemistryReservoir.ts',
  'src/game/data/characterBehaviorIdentityReservoir.ts',
  'src/game/data/characterLivedArtifactReservoir.ts',
  'src/game/data/characterThemeColorReservoir.ts',
  'src/game/data/realityRootLivingPlaceReservoir.ts',
  'src/game/data/characterEnvironmentSensoryReservoir.ts',
  'src/game/data/characterCompetenceLearningReservoir.ts',
  'src/game/data/characterCommunicationHabitReservoir.ts',
  'src/game/data/characterEverydayEconomyReservoir.ts',
  'src/game/data/characterLeisurePlayReservoir.ts',
  'src/game/data/characterHumorTeasingReservoir.ts',
  'src/game/data/characterDecisionCommitmentReservoir.ts',
  'src/game/data/characterSharedSpaceEtiquetteReservoir.ts',
  'src/game/data/characterRestDailyRhythmReservoir.ts',
  'src/game/data/seasonArchitecture.ts',
] as const;
for (const path of requiredSourcePaths) {
  assert(fs.existsSync(path), `missing Character Author DB prerequisite source: ${path}`);
}

const {
  CHARACTER_AUTHOR_DB_RULES,
  CHARACTER_AUTHOR_DB_IDENTITIES,
  CHARACTER_AUTHOR_DB_COVERAGE,
  characterAuthorDbCoverageSummary,
} = await import('../../src/game/data/characterAuthorDbCoverageManifest.ts');

assert(CHARACTER_AUTHOR_DB_RULES.status === 'AUTHOR_DB_INDEX_CURRENT_STRUCTURE_RESERVOIR_CONTENT', 'Author DB index status drift');
assert(CHARACTER_AUTHOR_DB_RULES.characterCountRequired === 36, 'Author DB character target drift');
assert(CHARACTER_AUTHOR_DB_RULES.current21Required === 21, 'Author DB Current21 target drift');
assert(CHARACTER_AUTHOR_DB_RULES.future15Required === 15, 'Author DB Future15 target drift');
assert(CHARACTER_AUTHOR_DB_RULES.coverageDimensionCountRequired === 18, 'Author DB dimension target must be 18');
assert(CHARACTER_AUTHOR_DB_RULES.experienceCoverageExtensionAuthority === 'docs/character-author-db-experience-coverage-extension-v1.md', 'Experience extension authority drift');
assert(CHARACTER_AUTHOR_DB_RULES.boundaryRhythmCoverageExtensionAuthority === 'docs/character-author-db-boundary-rhythm-coverage-extension-v1.md', 'Boundary/Rhythm extension authority drift');
assert(CHARACTER_AUTHOR_DB_RULES.sourceStatusMustRemainVisible, 'source status must remain visible');
assert(CHARACTER_AUTHOR_DB_RULES.currentAndCandidateMayNotBeFlattened, 'Current and Candidate may not be flattened');
assert(CHARACTER_AUTHOR_DB_RULES.aliasMapMayNotRenameStableIds, 'alias map may not rename stable IDs');
assert(!CHARACTER_AUTHOR_DB_RULES.aliasMapIsMigrationInstruction, 'alias map may not be migration instruction');
assert(!CHARACTER_AUTHOR_DB_RULES.future15CoveragePromotesRoster, 'Future15 coverage may not promote roster');
assert(!CHARACTER_AUTHOR_DB_RULES.candidateCoveragePromotesCanon, 'Candidate coverage may not promote Canon');
assert(CHARACTER_AUTHOR_DB_RULES.missingOptionalFieldMayBeUnknown, 'missing optional fields must be allowed to remain unknown');
assert(!CHARACTER_AUTHOR_DB_RULES.missingOptionalFieldMeansFalse, 'missing optional field may not mean false');
assert(!CHARACTER_AUTHOR_DB_RULES.environmentPreferenceMayInferDiagnosis, 'environment may not infer diagnosis');
assert(!CHARACTER_AUTHOR_DB_RULES.competenceMayInferIntelligenceOrRuntimeStat, 'competence may not infer intelligence/runtime stat');
assert(!CHARACTER_AUTHOR_DB_RULES.communicationReplyTimingMayInferAffection, 'communication may not infer affection');
assert(!CHARACTER_AUTHOR_DB_RULES.economyHabitMayInferIncomeClassOrMorality, 'economy may not infer class/morality');
assert(!CHARACTER_AUTHOR_DB_RULES.leisureMayInferOccupationOrPersonalityScore, 'leisure may not infer occupation/personality score');
assert(!CHARACTER_AUTHOR_DB_RULES.humorTeasingMayInferAffectionOrProtectedTraitPermission, 'humor may not infer affection/protected-trait permission');
assert(!CHARACTER_AUTHOR_DB_RULES.decisionCommitmentMayInferLeadershipMoralityOrAffection, 'decision/commitment may not infer leadership/morality/affection');
assert(!CHARACTER_AUTHOR_DB_RULES.sharedSpaceMayInferGenderClassMoralityOrAccessSideSeat, 'shared-space may not infer gender/class/morality/access side-seat');
assert(!CHARACTER_AUTHOR_DB_RULES.restDailyRhythmMayInferDiagnosisOrProductivityWorth, 'rest/rhythm may not infer diagnosis/productivity worth');
assert(!CHARACTER_AUTHOR_DB_RULES.runtimeGameReadsAuthorDbAutomatically, 'runtime may not automatically read Author DB');
assert(!CHARACTER_AUTHOR_DB_RULES.runtimeAutoPromotionAllowed, 'Author DB may not auto-promote runtime');

assert(CHARACTER_AUTHOR_DB_IDENTITIES.length === 36, 'Author DB identities must cover 36');
assert(characterAuthorDbCoverageSummary.characterCount === 36, 'Author DB coverage must cover 36');
assert(characterAuthorDbCoverageSummary.coverageDimensionCount === 18, 'Author DB summary dimension count must be 18');
assert(characterAuthorDbCoverageSummary.uniqueAuthorIds === 36, 'author IDs must be unique');
assert(characterAuthorDbCoverageSummary.uniqueStableProfileIds === 36, 'stable profile IDs must be unique');
assert(characterAuthorDbCoverageSummary.current21Count === 21, 'Current21 count drift');
assert(characterAuthorDbCoverageSummary.future15Count === 15, 'Future15 count drift');
assert(characterAuthorDbCoverageSummary.aliasCount === 5, 'explicit alias count drift');
assert(characterAuthorDbCoverageSummary.fullyCoveredCount === 36, `all 36 should be discoverable across 18 dimensions, got ${characterAuthorDbCoverageSummary.fullyCoveredCount}`);

for (const [label, count] of [
  ['Reality Root', characterAuthorDbCoverageSummary.realityRootCoverage],
  ['Season', characterAuthorDbCoverageSummary.seasonCoverage],
  ['Ordinary Life', characterAuthorDbCoverageSummary.ordinaryLifeCoverage],
  ['Social Chemistry', characterAuthorDbCoverageSummary.socialChemistryCoverage],
  ['Behavior Identity', characterAuthorDbCoverageSummary.behaviorIdentityCoverage],
  ['Lived Artifact', characterAuthorDbCoverageSummary.livedArtifactCoverage],
  ['Theme Color', characterAuthorDbCoverageSummary.themeColorCoverage],
  ['Living Place', characterAuthorDbCoverageSummary.livingPlaceCoverage],
  ['Environment/Sensory', characterAuthorDbCoverageSummary.environmentSensoryCoverage],
  ['Competence/Learning', characterAuthorDbCoverageSummary.competenceLearningCoverage],
  ['Communication Habit', characterAuthorDbCoverageSummary.communicationHabitCoverage],
  ['Everyday Economy', characterAuthorDbCoverageSummary.everydayEconomyCoverage],
  ['Leisure/Play', characterAuthorDbCoverageSummary.leisurePlayCoverage],
  ['Humor/Teasing', characterAuthorDbCoverageSummary.humorTeasingCoverage],
  ['Decision/Commitment', characterAuthorDbCoverageSummary.decisionCommitmentCoverage],
  ['Shared-space Etiquette', characterAuthorDbCoverageSummary.sharedSpaceEtiquetteCoverage],
  ['Rest/Daily Rhythm', characterAuthorDbCoverageSummary.restDailyRhythmCoverage],
  ['Physical Identity', characterAuthorDbCoverageSummary.physicalIdentityAuthorityCoverage],
] as const) {
  assert(count === 36, `${label} coverage drift: ${count}`);
}

assert(!characterAuthorDbCoverageSummary.future15PromotedByManifest, 'manifest may not promote Future15');
assert(!characterAuthorDbCoverageSummary.candidatePromotedByManifest, 'manifest may not promote Candidate to Canon');
assert(!characterAuthorDbCoverageSummary.runtimeAutoPromotionAllowed, 'manifest summary may not auto-promote runtime');

const aliasExpected = new Map([
  ['yuubi','yubi'],
  ['kaname','kage1'],
  ['kasumi','kage2'],
  ['toki','kage3'],
  ['tsumugi','kage4'],
]);
for (const identity of CHARACTER_AUTHOR_DB_IDENTITIES) {
  const expected = aliasExpected.get(identity.authorId);
  if (expected) assert(identity.stableProfileId === expected, `stable alias drift: ${identity.authorId}`);
  else assert(identity.authorId === identity.stableProfileId, `unexpected alias: ${identity.authorId}->${identity.stableProfileId}`);
}

for (const entry of CHARACTER_AUTHOR_DB_COVERAGE) {
  assert(Object.keys(entry.coverage).length === 18, `coverage dimension count drift for ${entry.authorId}`);
  assert(Object.values(entry.coverage).every(Boolean), `source coverage incomplete: ${entry.authorId}`);
  assert(!Object.values(entry.sourceStatus).includes('MISSING'), `source status missing: ${entry.authorId}`);
  assert(entry.sourceStatus.leisurePlay === 'AUTHOR_RESERVOIR_NON_CANON_ERA_TECH_AWARE_NO_HOBBY_STEREOTYPE', `Leisure status drift: ${entry.authorId}`);
  assert(entry.sourceStatus.humorTeasing === 'AUTHOR_RESERVOIR_NON_CANON_NO_PROTECTED_TRAIT_PUNCHLINE_DEFAULT', `Humor status drift: ${entry.authorId}`);
  assert(entry.sourceStatus.decisionCommitment === 'AUTHOR_RESERVOIR_NON_CANON_NO_LOYALTY_MORALITY_SCORE', `Decision status drift: ${entry.authorId}`);
  assert(entry.sourceStatus.sharedSpaceEtiquette === 'AUTHOR_RESERVOIR_NON_CANON_NO_DOMESTIC_GENDER_ROLE_NO_ACCESS_SIDE_SEAT', `Shared-space status drift: ${entry.authorId}`);
  assert(entry.sourceStatus.restDailyRhythm === 'AUTHOR_RESERVOIR_NON_CANON_NO_DIAGNOSIS_NO_PRODUCTIVITY_WORTH_SCORE', `Rest/rhythm status drift: ${entry.authorId}`);
  if (entry.rosterLayer === 'FUTURE15') {
    assert(entry.sourceStatus.seasonArchitecture === 'FUTURE15_ASSIGNMENT_NO_PROMOTION', `Future15 season drift: ${entry.authorId}`);
  }
}

const baseDoc = fs.readFileSync('docs/character-author-db-schema-and-coverage-v1.md','utf8');
assert(baseDoc.includes('36 / 36 discoverable across all 9 dimensions'), 'historical 9-dimension record missing');
assert(baseDoc.includes('OPEN != false'), 'Open semantics missing');

const envDoc = fs.readFileSync('docs/character-author-db-environment-coverage-extension-v1.md','utf8');
assert(envDoc.includes('36 / 36 discoverable across all 10 dimensions'), 'historical 10-dimension record missing');

const lifeDoc = fs.readFileSync('docs/character-author-db-life-coverage-extension-v1.md','utf8');
assert(lifeDoc.includes('36 / 36 discoverable across all 13 dimensions'), 'historical 13-dimension record missing');

const experienceDoc = fs.readFileSync('docs/character-author-db-experience-coverage-extension-v1.md','utf8');
assert(experienceDoc.includes('36 / 36 discoverable across all 15 dimensions'), 'historical 15-dimension record missing');

const boundaryRhythmDoc = fs.readFileSync('docs/character-author-db-boundary-rhythm-coverage-extension-v1.md','utf8');
for (const token of [
  'CURRENT AUTHOR-DB COVERAGE EXTENSION / 18 DIMENSIONS / STATUS INHERITED / NO CANON FLATTENING',
  '36 / 36 discoverable across all 18 dimensions',
  'AUTHOR_RESERVOIR_NON_CANON_NO_LOYALTY_MORALITY_SCORE',
  'AUTHOR_RESERVOIR_NON_CANON_NO_DOMESTIC_GENDER_ROLE_NO_ACCESS_SIDE_SEAT',
  'AUTHOR_RESERVOIR_NON_CANON_NO_DIAGNOSIS_NO_PRODUCTIVITY_WORTH_SCORE',
  'Characterの境界は「何を拒むか」だけではなく、決め直す・一緒に過ごす・休む時に相手と自分をどう扱うかで見える。',
]) {
  assert(boundaryRhythmDoc.includes(token), `Boundary/Rhythm extension guard missing: ${token}`);
}

console.log(JSON.stringify({
  characters: 36,
  current21: 21,
  future15: 15,
  coverageDimensions: 18,
  fullyCoveredAcross18Dimensions: 36,
  decisionCommitment: characterAuthorDbCoverageSummary.decisionCommitmentCoverage,
  sharedSpaceEtiquette: characterAuthorDbCoverageSummary.sharedSpaceEtiquetteCoverage,
  restDailyRhythm: characterAuthorDbCoverageSummary.restDailyRhythmCoverage,
  future15Promoted: false,
  candidatePromoted: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
