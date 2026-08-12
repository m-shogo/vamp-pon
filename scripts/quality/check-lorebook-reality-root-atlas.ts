import fs from 'node:fs';
import {
  CHARACTER_REALITY_ROOT_MAP_ENTRIES,
  CHARACTER_REALITY_ROOT_MAP_RULES,
  characterRealityRootMapSummary,
} from '../../src/game/data/characterRealityRootMapReadModel.ts';

const mirror = JSON.parse(fs.readFileSync('public/lorebook/data/reality-root-map.v1.json', 'utf8'));
const js = fs.readFileSync('public/lorebook/geography-enhancement.js', 'utf8');
const css = fs.readFileSync('public/lorebook/geography.css', 'utf8');
const enhancements = fs.readFileSync('public/lorebook/enhancements.js', 'utf8');

const fail = (message: string): never => {
  throw new Error(`[lorebook-reality-root-atlas] ${message}`);
};

if (mirror.schemaVersion !== 1) fail(`schemaVersion drift: ${mirror.schemaVersion}`);
if (mirror.authority !== 'src/game/data/characterRealityRootMapReadModel.ts') fail('authority drift');
if (mirror.characterCount !== characterRealityRootMapSummary.characterCount) fail('character count drift');
if (mirror.current21Count !== characterRealityRootMapSummary.current21Count) fail('Current21 count drift');
if (mirror.future15Count !== characterRealityRootMapSummary.future15Count) fail('Future15 count drift');
if (mirror.realJapanRegionCount !== characterRealityRootMapSummary.realJapanRegionCount) fail('real-Japan count drift');
if (mirror.futureAbstractCount !== characterRealityRootMapSummary.futureAbstractCount) fail('Future abstract count drift');
if (mirror.openUnmappedCount !== characterRealityRootMapSummary.openUnmappedCount) fail('Open/unmapped count drift');
if (mirror.exactCoordinateCount !== characterRealityRootMapSummary.exactCoordinateCount) fail('exact coordinate count drift');
if (mirror.runtimeAutoPromotionAllowed !== false) fail('runtime auto-promotion must remain false');
if (!Array.isArray(mirror.entries) || mirror.entries.length !== 36) fail('web mirror must contain 36 entries');

const select = (entry: any) => ({
  authorId: entry.authorId,
  name: entry.name,
  rosterLayer: entry.rosterLayer,
  root: entry.root,
  incidentArea: entry.incidentArea,
  mobility: entry.mobility,
  dialectVisibility: entry.dialectVisibility,
  sourceStatus: entry.sourceStatus,
  placementKind: entry.placementKind,
  pinPolicy: entry.pinPolicy,
  exactCoordinates: entry.exactCoordinates,
});

const source = CHARACTER_REALITY_ROOT_MAP_ENTRIES.map(select);
const client = mirror.entries.map(select);
if (JSON.stringify(client) !== JSON.stringify(source)) fail('web mirror drift from TypeScript read-model');

if (new Set(client.map((entry: any) => entry.authorId)).size !== 36) fail('authorId uniqueness drift');
if (client.some((entry: any) => entry.exactCoordinates !== null)) fail('exact coordinates must remain null');
if (client.filter((entry: any) => entry.placementKind === 'REAL_JAPAN_REGION').length !== 32) fail('expected 32 real-Japan region entries');
if (client.filter((entry: any) => entry.placementKind === 'FUTURE_ABSTRACT').length !== 3) fail('expected 3 Future abstract entries');
if (client.filter((entry: any) => entry.placementKind === 'OPEN_UNMAPPED').length !== 1) fail('expected 1 Open/unmapped entry');

for (const token of [
  'root != incident area',
  'incident area != birthplace',
  'region != personality',
  'Future15 != future-era origin',
  'exact coordinate / OPEN',
]) if (!js.includes(token)) fail(`UI boundary token missing: ${token}`);

for (const token of ['.reality-root-atlas', '.reality-root-grid', '.reality-root-card', '[data-root-placement="FUTURE_ABSTRACT"]', '[data-root-placement="OPEN_UNMAPPED"]']) {
  if (!css.includes(token)) fail(`CSS contract missing: ${token}`);
}
if (!enhancements.includes("'./geography-enhancement.js'")) fail('geography enhancement is not registered');

if (CHARACTER_REALITY_ROOT_MAP_RULES.exactHomePinAllowed !== false) fail('exact home pin rule drift');
if (CHARACTER_REALITY_ROOT_MAP_RULES.rootMayDefinePersonality !== false) fail('root/personality boundary drift');
if (CHARACTER_REALITY_ROOT_MAP_RULES.dialectMayDefinePersonality !== false) fail('dialect/personality boundary drift');
if (CHARACTER_REALITY_ROOT_MAP_RULES.skinToneMayInferOrigin !== false) fail('skin-tone/origin boundary drift');
if (CHARACTER_REALITY_ROOT_MAP_RULES.futureAbstractLocationForcedOntoJapanMap !== false) fail('Future fake-map boundary drift');
if (CHARACTER_REALITY_ROOT_MAP_RULES.openLocationForcedOntoMap !== false) fail('Open fake-map boundary drift');

console.log('[lorebook-reality-root-atlas] OK 36 roots / 32 real / 3 future / 1 open / 0 coordinates');
