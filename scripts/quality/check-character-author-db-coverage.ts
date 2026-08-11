import fs from 'node:fs';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const requiredSourcePaths=[
  'docs/00-current-story-world-master.md','docs/character-author-db-schema-and-coverage-v1.md','docs/character-author-db-environment-coverage-extension-v1.md',
  'docs/character-author-db-life-coverage-extension-v1.md','docs/character-author-db-experience-coverage-extension-v1.md',
  'docs/character-author-db-boundary-rhythm-coverage-extension-v1.md','docs/character-author-db-memory-coverage-extension-v1.md',
  'docs/character-author-db-language-voice-coverage-extension-v1.md','src/game/data/characterAuthorDbCoverageManifest.ts',
  'src/game/data/characterRealityRootRegistry.ts','src/game/data/characterOrdinaryLifeReservoir.ts','src/game/data/current21SocialChemistryReservoir.ts',
  'src/game/data/future15SocialChemistryReservoir.ts','src/game/data/characterBehaviorIdentityReservoir.ts','src/game/data/characterLivedArtifactReservoir.ts',
  'src/game/data/characterThemeColorReservoir.ts','src/game/data/realityRootLivingPlaceReservoir.ts','src/game/data/characterEnvironmentSensoryReservoir.ts',
  'src/game/data/characterCompetenceLearningReservoir.ts','src/game/data/characterCommunicationHabitReservoir.ts','src/game/data/characterEverydayEconomyReservoir.ts',
  'src/game/data/characterLeisurePlayReservoir.ts','src/game/data/characterHumorTeasingReservoir.ts','src/game/data/characterDecisionCommitmentReservoir.ts',
  'src/game/data/characterSharedSpaceEtiquetteReservoir.ts','src/game/data/characterRestDailyRhythmReservoir.ts','src/game/data/characterMemoryRememberingReservoir.ts',
  'src/game/data/characterAddressNamingRegisterReservoir.ts','src/game/data/characterVoiceProsodyReservoir.ts','src/game/data/seasonArchitecture.ts',
] as const;
for(const path of requiredSourcePaths) assert(fs.existsSync(path),`missing Character Author DB prerequisite source: ${path}`);

const {CHARACTER_AUTHOR_DB_RULES,CHARACTER_AUTHOR_DB_IDENTITIES,CHARACTER_AUTHOR_DB_COVERAGE,characterAuthorDbCoverageSummary}=await import('../../src/game/data/characterAuthorDbCoverageManifest.ts');

assert(CHARACTER_AUTHOR_DB_RULES.status==='AUTHOR_DB_INDEX_CURRENT_STRUCTURE_RESERVOIR_CONTENT','Author DB index status drift');
assert(CHARACTER_AUTHOR_DB_RULES.characterCountRequired===36,'Author DB character target drift');
assert(CHARACTER_AUTHOR_DB_RULES.current21Required===21,'Author DB Current21 target drift');
assert(CHARACTER_AUTHOR_DB_RULES.future15Required===15,'Author DB Future15 target drift');
assert(CHARACTER_AUTHOR_DB_RULES.coverageDimensionCountRequired===21,'Author DB dimension target must be 21');
assert(CHARACTER_AUTHOR_DB_RULES.languageVoiceCoverageExtensionAuthority==='docs/character-author-db-language-voice-coverage-extension-v1.md','Language/Voice extension authority drift');
assert(CHARACTER_AUTHOR_DB_RULES.sourceStatusMustRemainVisible,'source status must remain visible');
assert(CHARACTER_AUTHOR_DB_RULES.currentAndCandidateMayNotBeFlattened,'Current and Candidate may not be flattened');
assert(CHARACTER_AUTHOR_DB_RULES.aliasMapMayNotRenameStableIds,'alias map may not rename stable IDs');
assert(!CHARACTER_AUTHOR_DB_RULES.aliasMapIsMigrationInstruction,'alias map may not be migration instruction');
assert(!CHARACTER_AUTHOR_DB_RULES.future15CoveragePromotesRoster,'Future15 coverage may not promote roster');
assert(!CHARACTER_AUTHOR_DB_RULES.candidateCoveragePromotesCanon,'Candidate coverage may not promote Canon');
assert(CHARACTER_AUTHOR_DB_RULES.missingOptionalFieldMayBeUnknown,'missing optional field must be allowed unknown');
assert(!CHARACTER_AUTHOR_DB_RULES.missingOptionalFieldMeansFalse,'missing optional field may not mean false');
for(const [key,value] of Object.entries({
  environmentPreferenceMayInferDiagnosis:CHARACTER_AUTHOR_DB_RULES.environmentPreferenceMayInferDiagnosis,
  competenceMayInferIntelligenceOrRuntimeStat:CHARACTER_AUTHOR_DB_RULES.competenceMayInferIntelligenceOrRuntimeStat,
  communicationReplyTimingMayInferAffection:CHARACTER_AUTHOR_DB_RULES.communicationReplyTimingMayInferAffection,
  economyHabitMayInferIncomeClassOrMorality:CHARACTER_AUTHOR_DB_RULES.economyHabitMayInferIncomeClassOrMorality,
  leisureMayInferOccupationOrPersonalityScore:CHARACTER_AUTHOR_DB_RULES.leisureMayInferOccupationOrPersonalityScore,
  humorTeasingMayInferAffectionOrProtectedTraitPermission:CHARACTER_AUTHOR_DB_RULES.humorTeasingMayInferAffectionOrProtectedTraitPermission,
  decisionCommitmentMayInferLeadershipMoralityOrAffection:CHARACTER_AUTHOR_DB_RULES.decisionCommitmentMayInferLeadershipMoralityOrAffection,
  sharedSpaceMayInferGenderClassMoralityOrAccessSideSeat:CHARACTER_AUTHOR_DB_RULES.sharedSpaceMayInferGenderClassMoralityOrAccessSideSeat,
  restDailyRhythmMayInferDiagnosisOrProductivityWorth:CHARACTER_AUTHOR_DB_RULES.restDailyRhythmMayInferDiagnosisOrProductivityWorth,
  memoryRememberingMayInferMoralityIntelligenceDiagnosisOrObjectiveTruth:CHARACTER_AUTHOR_DB_RULES.memoryRememberingMayInferMoralityIntelligenceDiagnosisOrObjectiveTruth,
  addressNamingMayInferAffectionGenderOriginOrStableAlias:CHARACTER_AUTHOR_DB_RULES.addressNamingMayInferAffectionGenderOriginOrStableAlias,
  voiceProsodyMayInferGenderBodyAgeOriginDisabilityOrCasting:CHARACTER_AUTHOR_DB_RULES.voiceProsodyMayInferGenderBodyAgeOriginDisabilityOrCasting,
})) assert(value===false,`Author DB inference boundary drift: ${key}`);
assert(!CHARACTER_AUTHOR_DB_RULES.runtimeGameReadsAuthorDbAutomatically,'runtime may not automatically read Author DB');
assert(!CHARACTER_AUTHOR_DB_RULES.runtimeAutoPromotionAllowed,'Author DB may not auto-promote runtime');

assert(CHARACTER_AUTHOR_DB_IDENTITIES.length===36,'Author DB identities must cover 36');
assert(characterAuthorDbCoverageSummary.characterCount===36,'Author DB coverage must cover 36');
assert(characterAuthorDbCoverageSummary.coverageDimensionCount===21,'Author DB summary dimension count must be 21');
assert(characterAuthorDbCoverageSummary.uniqueAuthorIds===36,'author IDs must be unique');
assert(characterAuthorDbCoverageSummary.uniqueStableProfileIds===36,'stable profile IDs must be unique');
assert(characterAuthorDbCoverageSummary.current21Count===21,'Current21 count drift');
assert(characterAuthorDbCoverageSummary.future15Count===15,'Future15 count drift');
assert(characterAuthorDbCoverageSummary.aliasCount===5,'explicit alias count drift');
assert(characterAuthorDbCoverageSummary.fullyCoveredCount===36,`all 36 should be discoverable across 21 dimensions, got ${characterAuthorDbCoverageSummary.fullyCoveredCount}`);

for(const [label,count] of [
  ['Reality Root',characterAuthorDbCoverageSummary.realityRootCoverage],['Season',characterAuthorDbCoverageSummary.seasonCoverage],['Ordinary Life',characterAuthorDbCoverageSummary.ordinaryLifeCoverage],
  ['Social Chemistry',characterAuthorDbCoverageSummary.socialChemistryCoverage],['Behavior Identity',characterAuthorDbCoverageSummary.behaviorIdentityCoverage],['Lived Artifact',characterAuthorDbCoverageSummary.livedArtifactCoverage],
  ['Theme Color',characterAuthorDbCoverageSummary.themeColorCoverage],['Living Place',characterAuthorDbCoverageSummary.livingPlaceCoverage],['Environment/Sensory',characterAuthorDbCoverageSummary.environmentSensoryCoverage],
  ['Competence/Learning',characterAuthorDbCoverageSummary.competenceLearningCoverage],['Communication Habit',characterAuthorDbCoverageSummary.communicationHabitCoverage],['Everyday Economy',characterAuthorDbCoverageSummary.everydayEconomyCoverage],
  ['Leisure/Play',characterAuthorDbCoverageSummary.leisurePlayCoverage],['Humor/Teasing',characterAuthorDbCoverageSummary.humorTeasingCoverage],['Decision/Commitment',characterAuthorDbCoverageSummary.decisionCommitmentCoverage],
  ['Shared-space Etiquette',characterAuthorDbCoverageSummary.sharedSpaceEtiquetteCoverage],['Rest/Daily Rhythm',characterAuthorDbCoverageSummary.restDailyRhythmCoverage],['Memory/Remembering',characterAuthorDbCoverageSummary.memoryRememberingCoverage],
  ['Address/Naming/Register',characterAuthorDbCoverageSummary.addressNamingRegisterCoverage],['Voice/Prosody',characterAuthorDbCoverageSummary.voiceProsodyCoverage],['Physical Identity',characterAuthorDbCoverageSummary.physicalIdentityAuthorityCoverage],
] as const) assert(count===36,`${label} coverage drift: ${count}`);

assert(!characterAuthorDbCoverageSummary.future15PromotedByManifest,'manifest may not promote Future15');
assert(!characterAuthorDbCoverageSummary.candidatePromotedByManifest,'manifest may not promote Candidate to Canon');
assert(!characterAuthorDbCoverageSummary.runtimeAutoPromotionAllowed,'manifest summary may not auto-promote runtime');

const aliases=new Map([['yuubi','yubi'],['kaname','kage1'],['kasumi','kage2'],['toki','kage3'],['tsumugi','kage4']]);
for(const identity of CHARACTER_AUTHOR_DB_IDENTITIES){const expected=aliases.get(identity.authorId);if(expected)assert(identity.stableProfileId===expected,`stable alias drift: ${identity.authorId}`);else assert(identity.authorId===identity.stableProfileId,`unexpected alias: ${identity.authorId}->${identity.stableProfileId}`);}
for(const entry of CHARACTER_AUTHOR_DB_COVERAGE){
  assert(Object.keys(entry.coverage).length===21,`coverage dimension count drift for ${entry.authorId}`);
  assert(Object.values(entry.coverage).every(Boolean),`source coverage incomplete: ${entry.authorId}`);
  assert(!Object.values(entry.sourceStatus).includes('MISSING'),`source status missing: ${entry.authorId}`);
  assert(entry.sourceStatus.addressNamingRegister==='AUTHOR_RESERVOIR_NON_CANON_EXACT_WORDING_OPEN_NO_NAME_FORM_AFFECTION_SCORE',`Address status drift: ${entry.authorId}`);
  assert(entry.sourceStatus.voiceProsody==='AUTHOR_RESERVOIR_NON_CANON_NO_CASTING_FREEZE_NO_BODY_GENDER_VOICE_STEREOTYPE',`Voice status drift: ${entry.authorId}`);
  if(entry.rosterLayer==='FUTURE15')assert(entry.sourceStatus.seasonArchitecture==='FUTURE15_ASSIGNMENT_NO_PROMOTION',`Future15 season drift: ${entry.authorId}`);
}

for(const [path,token] of [
  ['docs/character-author-db-schema-and-coverage-v1.md','36 / 36 discoverable across all 9 dimensions'],
  ['docs/character-author-db-environment-coverage-extension-v1.md','36 / 36 discoverable across all 10 dimensions'],
  ['docs/character-author-db-life-coverage-extension-v1.md','36 / 36 discoverable across all 13 dimensions'],
  ['docs/character-author-db-experience-coverage-extension-v1.md','36 / 36 discoverable across all 15 dimensions'],
  ['docs/character-author-db-boundary-rhythm-coverage-extension-v1.md','36 / 36 discoverable across all 18 dimensions'],
  ['docs/character-author-db-memory-coverage-extension-v1.md','36 / 36 discoverable across all 19 dimensions'],
] as const) assert(fs.readFileSync(path,'utf8').includes(token),`historical coverage record missing: ${token}`);

const doc=fs.readFileSync('docs/character-author-db-language-voice-coverage-extension-v1.md','utf8');
for(const token of [
  'CURRENT AUTHOR-DB COVERAGE EXTENSION / 21 DIMENSIONS / EXACT WORDING AND CASTING OPEN / NO CANON FLATTENING',
  '36 / 36 discoverable across all 21 dimensions',
  'AUTHOR_RESERVOIR_NON_CANON_EXACT_WORDING_OPEN_NO_NAME_FORM_AFFECTION_SCORE',
  'AUTHOR_RESERVOIR_NON_CANON_NO_CASTING_FREEZE_NO_BODY_GENDER_VOICE_STEREOTYPE',
  'stable profile alias != spoken name','Era can constrain vocabulary and conventions. It does not automatically generate archaic speech',
  '台詞の個性は語尾の癖だけで作らない。誰をどう呼び、どこで間を置き、何を言わずに残すかまで別々に設計する。',
]) assert(doc.includes(token),`Language/Voice extension guard missing: ${token}`);

console.log(JSON.stringify({characters:36,current21:21,future15:15,coverageDimensions:21,fullyCoveredAcross21Dimensions:36,addressNamingRegister:characterAuthorDbCoverageSummary.addressNamingRegisterCoverage,voiceProsody:characterAuthorDbCoverageSummary.voiceProsodyCoverage,future15Promoted:false,candidatePromoted:false,runtimeAutoPromotionAllowed:false},null,2));
