import fs from 'node:fs';
import {
  CHARACTER_AUTHOR_DB_RULES,
  CHARACTER_AUTHOR_DB_IDENTITIES,
  CHARACTER_AUTHOR_DB_COVERAGE,
  characterAuthorDbCoverageSummary,
} from '../../src/game/data/characterAuthorDbCoverageManifest.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/character-author-db-schema-and-coverage-v1.md',
  'src/game/data/characterAuthorDbCoverageManifest.ts',
  'src/game/data/characterRealityRootRegistry.ts',
  'src/game/data/characterOrdinaryLifeReservoir.ts',
  'src/game/data/current21SocialChemistryReservoir.ts',
  'src/game/data/future15SocialChemistryReservoir.ts',
  'src/game/data/characterBehaviorIdentityReservoir.ts',
  'src/game/data/characterLivedArtifactReservoir.ts',
  'src/game/data/characterThemeColorReservoir.ts',
  'src/game/data/realityRootLivingPlaceReservoir.ts',
  'src/game/data/seasonArchitecture.ts',
]) assert(fs.existsSync(path), `missing Character Author DB source: ${path}`);

assert(CHARACTER_AUTHOR_DB_RULES.status === 'AUTHOR_DB_INDEX_CURRENT_STRUCTURE_RESERVOIR_CONTENT', 'Author DB index status drift');
assert(CHARACTER_AUTHOR_DB_RULES.characterCountRequired === 36, 'Author DB character target drift');
assert(CHARACTER_AUTHOR_DB_RULES.current21Required === 21, 'Author DB Current21 target drift');
assert(CHARACTER_AUTHOR_DB_RULES.future15Required === 15, 'Author DB Future15 target drift');
assert(CHARACTER_AUTHOR_DB_RULES.sourceStatusMustRemainVisible, 'source status must remain visible');
assert(CHARACTER_AUTHOR_DB_RULES.currentAndCandidateMayNotBeFlattened, 'Current and Candidate may not be flattened');
assert(CHARACTER_AUTHOR_DB_RULES.aliasMapMayNotRenameStableIds, 'alias map may not rename stable IDs');
assert(!CHARACTER_AUTHOR_DB_RULES.aliasMapIsMigrationInstruction, 'alias map may not be migration instruction');
assert(!CHARACTER_AUTHOR_DB_RULES.future15CoveragePromotesRoster, 'Future15 coverage may not promote roster');
assert(!CHARACTER_AUTHOR_DB_RULES.candidateCoveragePromotesCanon, 'Candidate coverage may not promote Canon');
assert(CHARACTER_AUTHOR_DB_RULES.missingOptionalFieldMayBeUnknown, 'missing optional field must be allowed as unknown');
assert(!CHARACTER_AUTHOR_DB_RULES.missingOptionalFieldMeansFalse, 'missing optional field may not mean false');
assert(!CHARACTER_AUTHOR_DB_RULES.runtimeGameReadsAuthorDbAutomatically, 'runtime may not automatically read Author DB');
assert(!CHARACTER_AUTHOR_DB_RULES.runtimeAutoPromotionAllowed, 'Author DB may not auto-promote runtime');

assert(CHARACTER_AUTHOR_DB_IDENTITIES.length === 36, 'Author DB identities must cover 36');
assert(characterAuthorDbCoverageSummary.characterCount === 36, 'Author DB coverage must cover 36');
assert(characterAuthorDbCoverageSummary.uniqueAuthorIds === 36, 'author IDs must be unique');
assert(characterAuthorDbCoverageSummary.uniqueStableProfileIds === 36, 'stable profile IDs must be unique');
assert(characterAuthorDbCoverageSummary.current21Count === 21, 'Current21 count drift');
assert(characterAuthorDbCoverageSummary.future15Count === 15, 'Future15 count drift');
assert(characterAuthorDbCoverageSummary.aliasCount === 5, `expected exactly 5 explicit stable-ID aliases, got ${characterAuthorDbCoverageSummary.aliasCount}`);
assert(characterAuthorDbCoverageSummary.fullyCoveredCount === 36, `all 36 should be discoverable across current 9 dimensions, got ${characterAuthorDbCoverageSummary.fullyCoveredCount}`);
assert(characterAuthorDbCoverageSummary.realityRootCoverage === 36, 'Reality Root coverage drift');
assert(characterAuthorDbCoverageSummary.seasonCoverage === 36, 'Season coverage drift');
assert(characterAuthorDbCoverageSummary.ordinaryLifeCoverage === 36, 'Ordinary Life coverage drift');
assert(characterAuthorDbCoverageSummary.socialChemistryCoverage === 36, 'Social Chemistry coverage drift');
assert(characterAuthorDbCoverageSummary.behaviorIdentityCoverage === 36, 'Behavior Identity coverage drift');
assert(characterAuthorDbCoverageSummary.livedArtifactCoverage === 36, 'Lived Artifact coverage drift');
assert(characterAuthorDbCoverageSummary.themeColorCoverage === 36, 'Theme Color coverage drift');
assert(characterAuthorDbCoverageSummary.livingPlaceCoverage === 36, 'Living Place coverage drift');
assert(characterAuthorDbCoverageSummary.physicalIdentityAuthorityCoverage === 36, 'Physical Identity authority coverage drift');
assert(!characterAuthorDbCoverageSummary.future15PromotedByManifest, 'manifest may not promote Future15');
assert(!characterAuthorDbCoverageSummary.candidatePromotedByManifest, 'manifest may not promote Candidate to Canon');
assert(!characterAuthorDbCoverageSummary.runtimeAutoPromotionAllowed, 'manifest summary may not auto-promote runtime');

const aliasExpected = new Map([
  ['yuubi', 'yubi'],
  ['kaname', 'kage1'],
  ['kasumi', 'kage2'],
  ['toki', 'kage3'],
  ['tsumugi', 'kage4'],
]);
for (const identity of CHARACTER_AUTHOR_DB_IDENTITIES) {
  const expected = aliasExpected.get(identity.authorId);
  if (expected) assert(identity.stableProfileId === expected, `stable alias drift: ${identity.authorId}`);
  else assert(identity.authorId === identity.stableProfileId, `unexpected alias introduced: ${identity.authorId}->${identity.stableProfileId}`);
}

for (const entry of CHARACTER_AUTHOR_DB_COVERAGE) {
  assert(Object.values(entry.coverage).every(Boolean), `Author DB source coverage incomplete: ${entry.authorId}`);
  assert(!Object.values(entry.sourceStatus).includes('MISSING'), `Author DB source status missing: ${entry.authorId}`);
  if (entry.rosterLayer === 'FUTURE15') {
    assert(entry.sourceStatus.seasonArchitecture === 'FUTURE15_ASSIGNMENT_NO_PROMOTION', `Future15 season status drift: ${entry.authorId}`);
    assert(entry.sourceStatus.socialChemistry === 'FUTURE15_AUTHOR_RESERVOIR_NOT_CURRENT21', `Future15 social status drift: ${entry.authorId}`);
  }
}

const doc = fs.readFileSync('docs/character-author-db-schema-and-coverage-v1.md', 'utf8');
assert(doc.includes('CURRENT AUTHOR-DB INDEX STRUCTURE / CONTENT STATUS INHERITED / NO CANON FLATTENING'), 'Author DB doc status drift');
assert(doc.includes('Alias mapはrename migration命令ではない'), 'stable ID alias guard missing');
assert(doc.includes('OPEN != false'), 'Unknown/Open semantics guard missing');
assert(doc.includes('データが充実した = 本編登場確定'), 'Future15 data-richness promotion guard missing');
assert(doc.includes('36 / 36 discoverable across all 9 dimensions'), '36/36 coverage target missing');
assert(doc.includes('設定を一つに潰すDBではなく、「何が決まっていて、何が候補で、どこに根拠があるか」が一目で分かるDBにする。'), 'Author DB principle missing');

console.log(JSON.stringify({
  characters: characterAuthorDbCoverageSummary.characterCount,
  current21: characterAuthorDbCoverageSummary.current21Count,
  future15: characterAuthorDbCoverageSummary.future15Count,
  explicitAliases: characterAuthorDbCoverageSummary.aliasCount,
  fullyCoveredAcross9Dimensions: characterAuthorDbCoverageSummary.fullyCoveredCount,
  realityRoot: characterAuthorDbCoverageSummary.realityRootCoverage,
  season: characterAuthorDbCoverageSummary.seasonCoverage,
  ordinaryLife: characterAuthorDbCoverageSummary.ordinaryLifeCoverage,
  socialChemistry: characterAuthorDbCoverageSummary.socialChemistryCoverage,
  behaviorIdentity: characterAuthorDbCoverageSummary.behaviorIdentityCoverage,
  livedArtifact: characterAuthorDbCoverageSummary.livedArtifactCoverage,
  themeColor: characterAuthorDbCoverageSummary.themeColorCoverage,
  livingPlace: characterAuthorDbCoverageSummary.livingPlaceCoverage,
  physicalIdentityAuthority: characterAuthorDbCoverageSummary.physicalIdentityAuthorityCoverage,
  future15Promoted: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
