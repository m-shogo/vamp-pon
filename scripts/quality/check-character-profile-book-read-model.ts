import fs from 'node:fs';
import {
  CHARACTER_PROFILE_BOOK_RULES,
  CHARACTER_PROFILE_BOOK_SECTIONS,
  CHARACTER_PROFILE_BOOK_INDEX,
  characterProfileBookReadModelSummary,
} from '../../src/game/data/characterProfileBookReadModel.ts';
import { CHARACTER_AUTHOR_DB_COVERAGE } from '../../src/game/data/characterAuthorDbCoverageManifest.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(CHARACTER_PROFILE_BOOK_RULES.status==='AUTHORING_READ_MODEL_CURRENT_NO_RUNTIME_PROMOTION','Profile Book status drift');
assert(CHARACTER_PROFILE_BOOK_RULES.authorFacingOnly,'Profile Book v1 must remain author-facing');
assert(CHARACTER_PROFILE_BOOK_RULES.separateWebConsumerAllowed,'separate Web consumer must remain allowed');
assert(!CHARACTER_PROFILE_BOOK_RULES.gameRuntimeConsumerAllowed,'game runtime may not consume Profile Book v1');
assert(!CHARACTER_PROFILE_BOOK_RULES.duplicatesStoryAuthority,'Profile Book may not duplicate Story authority');
assert(CHARACTER_PROFILE_BOOK_RULES.sectionCountRequired===6,'Profile Book section target drift');
assert(CHARACTER_PROFILE_BOOK_RULES.dimensionCountRequired===21,'Profile Book dimension target drift');
assert(CHARACTER_PROFILE_BOOK_RULES.characterCountRequired===36,'Profile Book character target drift');
assert(CHARACTER_PROFILE_BOOK_RULES.everyDimensionAssignedExactlyOnce,'each dimension must be assigned exactly once');
assert(CHARACTER_PROFILE_BOOK_RULES.sourceStatusMustRemainVisible,'source status must remain visible');
assert(CHARACTER_PROFILE_BOOK_RULES.rosterLayerMustRemainVisible,'roster layer must remain visible');
assert(CHARACTER_PROFILE_BOOK_RULES.stableProfileIdMustRemainVisible,'stable profile ID must remain visible');
assert(CHARACTER_PROFILE_BOOK_RULES.authorIdIsRouteSlug,'author ID must drive route slug');
assert(!CHARACTER_PROFILE_BOOK_RULES.stableProfileAliasIsRouteSlug,'stable alias may not automatically become route slug');
assert(!CHARACTER_PROFILE_BOOK_RULES.spoilerSafePublicProjectionDefined,'spoiler-safe public projection must remain undefined in v1');
assert(!CHARACTER_PROFILE_BOOK_RULES.missingDataMayRenderAsFalse,'missing data may not render as false');
assert(!CHARACTER_PROFILE_BOOK_RULES.authorReservoirMayRenderAsCanon,'Author Reservoir may not render as Canon');
assert(!CHARACTER_PROFILE_BOOK_RULES.future15MayRenderAsCurrent21,'Future15 may not render as Current21');
assert(!CHARACTER_PROFILE_BOOK_RULES.runtimeAutoPromotionAllowed,'Profile Book may not auto-promote runtime');

const expectedSectionOrder=['identity-authority','ordinary-life','social-boundaries','expression-voice','learning-memory','material-trace'];
assert(JSON.stringify(CHARACTER_PROFILE_BOOK_SECTIONS.map((section)=>section.id))===JSON.stringify(expectedSectionOrder),'Profile Book section order drift');
assert(characterProfileBookReadModelSummary.sectionCount===6,'Profile Book summary section count drift');
assert(characterProfileBookReadModelSummary.assignedDimensionCount===21,'Profile Book assigned dimension count drift');
assert(characterProfileBookReadModelSummary.uniqueDimensionCount===21,'Profile Book dimensions must be unique');
assert(characterProfileBookReadModelSummary.sourceCoverageDimensions===21,'Profile Book source coverage dimension drift');
assert(characterProfileBookReadModelSummary.characterCount===36,'Profile Book character count drift');
assert(characterProfileBookReadModelSummary.current21Count===21,'Profile Book Current21 count drift');
assert(characterProfileBookReadModelSummary.future15Count===15,'Profile Book Future15 count drift');
assert(characterProfileBookReadModelSummary.fullyCoveredCharacterCount===36,'all Profile Book characters must be fully covered');
assert(characterProfileBookReadModelSummary.uniqueRouteSlugCount===36,'Profile Book route slugs must be unique');
assert(characterProfileBookReadModelSummary.uniqueStableProfileIdCount===36,'Profile Book stable IDs must be unique');
assert(!characterProfileBookReadModelSummary.runtimeAutoPromotionAllowed,'Profile Book summary may not auto-promote runtime');

const manifestDimensionKeys=Object.keys(CHARACTER_AUTHOR_DB_COVERAGE[0].coverage).sort();
const assignedDimensionKeys=CHARACTER_PROFILE_BOOK_SECTIONS.flatMap((section)=>section.dimensions).slice().sort();
assert(JSON.stringify(assignedDimensionKeys)===JSON.stringify(manifestDimensionKeys),'Profile Book must assign every current Author DB dimension exactly once');

for(const entry of CHARACTER_PROFILE_BOOK_INDEX){
  assert(entry.routeSlug===entry.authorId,`Profile Book route must use author ID: ${entry.authorId}`);
  assert(entry.totalDimensionCount===21,`Profile Book dimension total drift: ${entry.authorId}`);
  assert(entry.coveredDimensionCount===21,`Profile Book incomplete coverage: ${entry.authorId}`);
  assert(entry.fullyCovered,`Profile Book must be fully covered: ${entry.authorId}`);
  assert(entry.sections.length===6,`Profile Book section count drift: ${entry.authorId}`);
  for(const section of entry.sections){
    assert(section.fullyCovered,`Profile Book section incomplete: ${entry.authorId}/${section.sectionId}`);
    assert(section.coveredDimensionCount===section.totalDimensionCount,`Profile Book section count mismatch: ${entry.authorId}/${section.sectionId}`);
    for(const dimension of section.dimensions){
      assert(dimension.covered,`Profile Book missing dimension: ${entry.authorId}/${dimension.key}`);
      assert(typeof dimension.sourceStatus==='string'&&dimension.sourceStatus.length>0,`Profile Book missing source status: ${entry.authorId}/${dimension.key}`);
      assert(dimension.sourceStatus!=='MISSING',`Profile Book may not hide missing source status: ${entry.authorId}/${dimension.key}`);
    }
  }
}

const byAuthorId=new Map(CHARACTER_PROFILE_BOOK_INDEX.map((entry)=>[entry.authorId,entry]));
for(const [authorId,stableProfileId] of [['yuubi','yubi'],['kaname','kage1'],['kasumi','kage2'],['toki','kage3'],['tsumugi','kage4']] as const){
  const entry=byAuthorId.get(authorId); assert(entry,`missing Profile Book alias character: ${authorId}`);
  assert(entry.stableProfileId===stableProfileId,`Profile Book stable alias drift: ${authorId}`);
  assert(entry.routeSlug===authorId,`Profile Book leaked stable alias into route: ${authorId}`);
}

const doc=fs.readFileSync('docs/character-profile-book-read-model-v1.md','utf8');
for(const token of [
  'CURRENT AUTHORING READ MODEL / 36 CHARACTERS / 6 SECTIONS / 21 DIMENSIONS / NOT GAME RUNTIME',
  'Source of truth is not copied into the Profile Book.',
  'Profile routes use `authorId`, not stable-profile aliases.',
  'A public/spoiler-safe projection is intentionally **not defined** yet.',
  '誰？',
  '普段どういう人？',
  'この情報はどこまで確定？',
  'プロフィールBookは新しい正本ではない。散らばった正本とReservoirへ迷わず辿るための「地図」にする。',
]) assert(doc.includes(token),`Profile Book doc guard missing: ${token}`);

console.log(JSON.stringify({sections:6,dimensions:21,characters:36,current21:21,future15:15,fullyCovered:36,authorRoutes:36,publicSpoilerProjectionDefined:false,runtimeAutoPromotionAllowed:false},null,2));
