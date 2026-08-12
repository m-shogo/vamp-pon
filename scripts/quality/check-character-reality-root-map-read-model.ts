import fs from 'node:fs';
import {
  CHARACTER_REALITY_ROOT_MAP_RULES,
  CHARACTER_REALITY_ROOT_MAP_ENTRIES,
  CHARACTER_REALITY_ROOT_MAP_GROUPS,
  characterRealityRootMapSummary,
} from '../../src/game/data/characterRealityRootMapReadModel.ts';
import { CHARACTER_REALITY_ROOTS } from '../../src/game/data/characterRealityRootRegistry.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(CHARACTER_REALITY_ROOT_MAP_RULES.status === 'AUTHORING_READ_MODEL_36_REALITY_ROOTS_REGION_LEVEL_NO_EXACT_HOME_PIN', 'Reality Root map status drift');
assert(CHARACTER_REALITY_ROOT_MAP_RULES.authorFacingOnly, 'Reality Root map must remain author-facing');
assert(CHARACTER_REALITY_ROOT_MAP_RULES.characterCountRequired === 36, 'Reality Root map character target drift');
assert(CHARACTER_REALITY_ROOT_MAP_RULES.current21Required === 21, 'Reality Root map Current21 target drift');
assert(CHARACTER_REALITY_ROOT_MAP_RULES.future15Required === 15, 'Reality Root map Future15 target drift');
assert(CHARACTER_REALITY_ROOT_MAP_RULES.sourceStatusMustRemainVisible, 'Reality Root source status must remain visible');
assert(CHARACTER_REALITY_ROOT_MAP_RULES.rootAndIncidentAreaMustRemainDistinct, 'root and incident area concepts must remain distinct');
assert(CHARACTER_REALITY_ROOT_MAP_RULES.mobilityMustRemainVisible, 'mobility must remain visible');
assert(CHARACTER_REALITY_ROOT_MAP_RULES.dialectVisibilityMayBeShownAsMetadata, 'dialect visibility metadata must remain allowed');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.dialectMayDefinePersonality, 'dialect may not define personality');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.rootMayDefinePersonality, 'root may not define personality');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.skinToneMayInferOrigin, 'skin tone may not infer origin');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.incidentAreaMayReplaceRoot, 'incident area may not replace root');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.exactHomeCoordinatesFrozen, 'exact home coordinates must remain Open');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.exactHomePinAllowed, 'exact home pin must remain forbidden');
assert(CHARACTER_REALITY_ROOT_MAP_RULES.regionLevelMapAllowed, 'region-level map must remain allowed');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.futureAbstractLocationForcedOntoJapanMap, 'future abstract location may not be forced onto Japan map');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.openLocationForcedOntoMap, 'Open location may not be forced onto map');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.pilgrimageRecommendationGeneratedAutomatically, 'pilgrimage recommendations may not auto-generate');
assert(!CHARACTER_REALITY_ROOT_MAP_RULES.runtimeAutoPromotionAllowed, 'Reality Root map may not auto-promote runtime');

assert(characterRealityRootMapSummary.characterCount === 36, 'Reality Root map character count drift');
assert(characterRealityRootMapSummary.uniqueAuthorIdCount === 36, 'Reality Root map author IDs must be unique');
assert(characterRealityRootMapSummary.uniqueStableProfileIdCount === 36, 'Reality Root map stable IDs must be unique');
assert(characterRealityRootMapSummary.uniqueRouteSlugCount === 36, 'Reality Root map routes must be unique');
assert(characterRealityRootMapSummary.current21Count === 21, 'Reality Root map Current21 count drift');
assert(characterRealityRootMapSummary.future15Count === 15, 'Reality Root map Future15 count drift');
assert(characterRealityRootMapSummary.realJapanRegionCount === 32, `Reality Root real-Japan region count drift: ${characterRealityRootMapSummary.realJapanRegionCount}`);
assert(characterRealityRootMapSummary.futureAbstractCount === 3, `Reality Root future abstract count drift: ${characterRealityRootMapSummary.futureAbstractCount}`);
assert(characterRealityRootMapSummary.openUnmappedCount === 1, `Reality Root Open-unmapped count drift: ${characterRealityRootMapSummary.openUnmappedCount}`);
assert(characterRealityRootMapSummary.exactCoordinateCount === 0, 'Reality Root map may not contain exact coordinates in v1');
assert(!characterRealityRootMapSummary.runtimeAutoPromotionAllowed, 'Reality Root map summary may not auto-promote runtime');
assert(!characterRealityRootMapSummary.sourceRuntimeAutoPromotionAllowed, 'Reality Root source may not auto-promote runtime');

assert(CHARACTER_REALITY_ROOT_MAP_ENTRIES.length === CHARACTER_REALITY_ROOTS.length, 'Reality Root map must mirror source character count');
const sourceById = new Map(CHARACTER_REALITY_ROOTS.map((entry) => [entry.id, entry]));
for (const entry of CHARACTER_REALITY_ROOT_MAP_ENTRIES) {
  const source = sourceById.get(entry.authorId);
  assert(source, `Reality Root source missing for map entry: ${entry.authorId}`);
  assert(entry.routeSlug === entry.authorId, `Reality Root route must use authorId: ${entry.authorId}`);
  assert(entry.root === source.root, `Reality Root text drift: ${entry.authorId}`);
  assert(entry.incidentArea === source.incidentArea, `Reality Root incident area drift: ${entry.authorId}`);
  assert(entry.mobility === source.mobility, `Reality Root mobility drift: ${entry.authorId}`);
  assert(entry.dialectVisibility === source.dialect, `Reality Root dialect visibility drift: ${entry.authorId}`);
  assert(entry.sourceStatus === source.status, `Reality Root source status drift: ${entry.authorId}`);
  assert(entry.exactCoordinates === null, `exact coordinate leaked into Reality Root map: ${entry.authorId}`);
  if (entry.placementKind === 'REAL_JAPAN_REGION') assert(entry.pinPolicy === 'REGION_LEVEL_ONLY', `real region pin policy drift: ${entry.authorId}`);
  if (entry.placementKind === 'FUTURE_ABSTRACT') assert(entry.pinPolicy === 'ABSTRACT_FUTURE_LANE', `future abstract pin policy drift: ${entry.authorId}`);
  if (entry.placementKind === 'OPEN_UNMAPPED') assert(entry.pinPolicy === 'NO_PIN_OPEN', `Open location pin policy drift: ${entry.authorId}`);
}

assert(CHARACTER_REALITY_ROOT_MAP_GROUPS.futureAbstract.map((entry) => entry.authorId).sort().join(',') === ['asa','noa','rum'].sort().join(','), 'future abstract Reality Root membership drift');
assert(CHARACTER_REALITY_ROOT_MAP_GROUPS.openUnmapped.map((entry) => entry.authorId).join(',') === 'chloe', 'Open-unmapped Reality Root membership drift');

const byAuthorId = new Map(CHARACTER_REALITY_ROOT_MAP_ENTRIES.map((entry) => [entry.authorId, entry]));
for (const [authorId, stableProfileId] of [['yuubi','yubi'],['kaname','kage1'],['kasumi','kage2'],['toki','kage3'],['tsumugi','kage4']] as const) {
  const entry = byAuthorId.get(authorId); assert(entry, `Reality Root alias character missing: ${authorId}`);
  assert(entry.stableProfileId === stableProfileId, `Reality Root stable alias drift: ${authorId}`);
  assert(entry.routeSlug === authorId, `Reality Root leaked stable alias into profile route: ${authorId}`);
}
assert(byAuthorId.get('hiyori')?.root === '鹿児島県奄美文化圏', 'Hiyori root drift');
assert(byAuthorId.get('touma')?.root === '埼玉県川口市圏', 'Touma root drift');
assert(byAuthorId.get('amane')?.root === '神奈川県横浜市圏', 'Amane root drift');
assert(byAuthorId.get('kuu')?.dialectVisibility === 'NONVERBAL_NOT_APPLICABLE', 'Kuu dialect boundary drift');
assert(byAuthorId.get('yomo')?.dialectVisibility === 'NONVERBAL_NOT_APPLICABLE', 'Yomo dialect boundary drift');

const doc = fs.readFileSync('docs/character-reality-root-map-read-model-v1.md', 'utf8');
for (const token of [
  'CURRENT AUTHORING GEOGRAPHY MAP / 36 CHARACTERS / REGION LEVEL / NO EXACT HOME PIN',
  'incident area is not automatically birthplace or home.',
  'prefecture/region = personality',
  'skin tone = nationality/origin',
  '`FUTURE_ABSTRACT`',
  '`OPEN_UNMAPPED`',
  'Future15 status does not mean future-era origin.',
  '地図は「この県の人だからこういう性格」を作るためではなく、その人がどこから来て、なぜ別の場所へ行けたのかをSource付きで確かめるために使う。',
]) assert(doc.includes(token), `Reality Root map doc guard missing: ${token}`);

console.log(JSON.stringify({characters:36,current21:21,future15:15,realJapanRegions:32,futureAbstract:3,openUnmapped:1,exactCoordinates:0,runtimeAutoPromotionAllowed:false}, null, 2));
