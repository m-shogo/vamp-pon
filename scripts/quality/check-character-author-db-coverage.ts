import fs from 'node:fs';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const requiredSourcePaths = [
  'docs/00-current-story-world-master.md',
  'docs/character-author-db-schema-and-coverage-v1.md',
  'docs/character-author-db-environment-coverage-extension-v1.md',
  'docs/character-author-db-life-coverage-extension-v1.md',
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
  'src/game/data/seasonArchitecture.ts',
] as const;

for (const path of requiredSourcePaths) assert(fs.existsSync(path), `missing Character Author DB prerequisite source: ${path}`);

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
assert(CHARACTER_AUTHOR_DB_RULES.coverageDimensionCountRequired === 13, 'Author DB coverage dimension target must be 13');
assert(CHARACTER_AUTHOR_DB_RULES.coverageExtensionAuthority === 'docs/character-author-db-environment-coverage-extension-v1.md', 'Environment coverage extension authority drift');
assert(CHARACTER_AUTHOR_DB_RULES.lifeCoverageExtensionAuthority === 'docs/character-author-db-life-coverage-extension-v1.md', 'Life coverage extension authority drift');
assert(CHARACTER_AUTHOR_DB_RULES.sourceStatusMustRemainVisible, 'source status must remain visible');
assert(CHARACTER_AUTHOR_DB_RULES.currentAndCandidateMayNotBeFlattened, 'Current and Candidate may not be flattened');
assert(CHARACTER_AUTHOR_DB_RULES.aliasMapMayNotRenameStableIds, 'alias map may not rename stable IDs');
assert(!CHARACTER_AUTHOR_DB_RULES.aliasMapIsMigrationInstruction, 'alias map may not be migration instruction');
assert(!CHARACTER_AUTHOR_DB_RULES.future15CoveragePromotesRoster, 'Future15 coverage may not promote roster');
assert(!CHARACTER_AUTHOR_DB_RULES.candidateCoveragePromotesCanon, 'Candidate coverage may not promote Canon');
assert(CHARACTER_AUTHOR_DB_RULES.missingOptionalFieldMayBeUnknown, 'missing optional field must be allowed as unknown');
assert(!CHARACTER_AUTHOR_DB_RULES.missingOptionalFieldMeansFalse, 'missing optional field may not mean false');
assert(!CHARACTER_AUTHOR_DB_RULES.environmentPreferenceMayInferDiagnosis, 'Environment/Sensory may not infer diagnosis');
assert(!CHARACTER_AUTHOR_DB_RULES.competenceMayInferIntelligenceOrRuntimeStat, 'Competence/Learning may not infer intelligence/runtime stat');
assert(!CHARACTER_AUTHOR_DB_RULES.communicationReplyTimingMayInferAffection, 'Communication reply timing may not infer affection');
assert(!CHARACTER_AUTHOR_DB_RULES.economyHabitMayInferIncomeClassOrMorality, 'Economy habit may not infer income/class/morality');
assert(!CHARACTER_AUTHOR_DB_RULES.runtimeGameReadsAuthorDbAutomatically, 'runtime may not automatically read Author DB');
assert(!CHARACTER_AUTHOR_DB_RULES.runtimeAutoPromotionAllowed, 'Author DB may not auto-promote runtime');

assert(CHARACTER_AUTHOR_DB_IDENTITIES.length === 36, 'Author DB identities must cover 36');
assert(characterAuthorDbCoverageSummary.characterCount === 36, 'Author DB coverage must cover 36');
assert(characterAuthorDbCoverageSummary.coverageDimensionCount === 13, 'Author DB summary dimension count must be 13');
assert(characterAuthorDbCoverageSummary.uniqueAuthorIds === 36, 'author IDs must be unique');
assert(characterAuthorDbCoverageSummary.uniqueStableProfileIds === 36, 'stable profile IDs must be unique');
assert(characterAuthorDbCoverageSummary.current21Count === 21, 'Current21 count drift');
assert(characterAuthorDbCoverageSummary.future15Count === 15, 'Future15 count drift');
assert(characterAuthorDbCoverageSummary.aliasCount === 5, `expected exactly 5 explicit stable-ID aliases, got ${characterAuthorDbCoverageSummary.aliasCount}`);
assert(characterAuthorDbCoverageSummary.fullyCoveredCount === 36, `all 36 should be discoverable across current 13 dimensions, got ${characterAuthorDbCoverageSummary.fullyCoveredCount}`);

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
  ['Physical Identity authority', characterAuthorDbCoverageSummary.physicalIdentityAuthorityCoverage],
] as const) assert(count === 36, `${label} coverage drift: ${count}`);

assert(!characterAuthorDbCoverageSummary.future15PromotedByManifest, 'manifest may not promote Future15');
assert(!characterAuthorDbCoverageSummary.candidatePromotedByManifest, 'manifest may not promote Candidate to Canon');
assert(!characterAuthorDbCoverageSummary.runtimeAutoPromotionAllowed, 'manifest summary may not auto-promote runtime');

const aliasExpected = new Map([
  ['yuubi', 'yubi'], ['kaname', 'kage1'], ['kasumi', 'kage2'], ['toki', 'kage3'], ['tsumugi', 'kage4'],
]);
for (const identity of CHARACTER_AUTHOR_DB_IDENTITIES) {
  const expected = aliasExpected.get(identity.authorId);
  if (expected) assert(identity.stableProfileId === expected, `stable alias drift: ${identity.authorId}`);
  else assert(identity.authorId === identity.stableProfileId, `unexpected alias introduced: ${identity.authorId}->${identity.stableProfileId}`);
}

for (const entry of CHARACTER_AUTHOR_DB_COVERAGE) {
  assert(Object.keys(entry.coverage).length === 13, `Author DB coverage dimension count drift for ${entry.authorId}`);
  assert(Object.values(entry.coverage).every(Boolean), `Author DB source coverage incomplete: ${entry.authorId}`);
  assert(!Object.values(entry.sourceStatus).includes('MISSING'), `Author DB source status missing: ${entry.authorId}`);
  assert(entry.sourceStatus.environmentSensory === 'AUTHOR_RESERVOIR_NON_CANON_NO_DIAGNOSIS_INFERENCE', `Environment status drift: ${entry.authorId}`);
  assert(entry.sourceStatus.competenceLearning === 'AUTHOR_RESERVOIR_NON_CANON_NO_INTELLIGENCE_RANKING', `Competence status drift: ${entry.authorId}`);
  assert(entry.sourceStatus.communicationHabit === 'AUTHOR_RESERVOIR_NON_CANON_ERA_TECH_AWARE_NO_AFFECTION_SCORING', `Communication status drift: ${entry.authorId}`);
  assert(entry.sourceStatus.everydayEconomy === 'AUTHOR_RESERVOIR_NON_CANON_NO_INCOME_CLASS_FREEZE', `Economy status drift: ${entry.authorId}`);
  if (entry.rosterLayer === 'FUTURE15') {
    assert(entry.sourceStatus.seasonArchitecture === 'FUTURE15_ASSIGNMENT_NO_PROMOTION', `Future15 season status drift: ${entry.authorId}`);
    assert(entry.sourceStatus.socialChemistry === 'FUTURE15_AUTHOR_RESERVOIR_NOT_CURRENT21', `Future15 social status drift: ${entry.authorId}`);
  }
}

const baseDoc = fs.readFileSync('docs/character-author-db-schema-and-coverage-v1.md', 'utf8');
assert(baseDoc.includes('36 / 36 discoverable across all 9 dimensions'), 'historical 9-dimension record missing');
assert(baseDoc.includes('Alias mapはrename migration命令ではない'), 'stable ID alias guard missing');
assert(baseDoc.includes('OPEN != false'), 'Unknown/Open semantics guard missing');

const environmentDoc = fs.readFileSync('docs/character-author-db-environment-coverage-extension-v1.md', 'utf8');
assert(environmentDoc.includes('36 / 36 discoverable across all 10 dimensions'), 'historical 10-dimension environment record missing');

const lifeDoc = fs.readFileSync('docs/character-author-db-life-coverage-extension-v1.md', 'utf8');
for (const token of [
  'CURRENT AUTHOR-DB COVERAGE EXTENSION / 13 DIMENSIONS / STATUS INHERITED / NO CANON FLATTENING',
  '36 / 36 discoverable across all 13 dimensions',
  'AUTHOR_RESERVOIR_NON_CANON_NO_INTELLIGENCE_RANKING',
  'AUTHOR_RESERVOIR_NON_CANON_ERA_TECH_AWARE_NO_AFFECTION_SCORING',
  'AUTHOR_RESERVOIR_NON_CANON_NO_INCOME_CLASS_FREEZE',
  '情報を増やすほど、Characterを一つの性格ラベルへ圧縮しない。',
]) assert(lifeDoc.includes(token), `Author DB life extension guard missing: ${token}`);

console.log(JSON.stringify({
  characters: 36,
  current21: 21,
  future15: 15,
  explicitAliases: 5,
  coverageDimensions: 13,
  fullyCoveredAcross13Dimensions: characterAuthorDbCoverageSummary.fullyCoveredCount,
  competenceLearning: characterAuthorDbCoverageSummary.competenceLearningCoverage,
  communicationHabit: characterAuthorDbCoverageSummary.communicationHabitCoverage,
  everydayEconomy: characterAuthorDbCoverageSummary.everydayEconomyCoverage,
  future15Promoted: false,
  candidatePromoted: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
