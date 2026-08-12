import fs from 'node:fs';
import { characterRealityRootMapSummary } from '../../src/game/data/characterRealityRootMapReadModel.ts';

const js = fs.readFileSync('public/lorebook/author-dashboard-enhancement.js', 'utf8');
const doc = fs.readFileSync('docs/lorebook-author-overview-dashboard-v1.md', 'utf8');
const roots = JSON.parse(fs.readFileSync('public/lorebook/data/reality-root-map.v1.json', 'utf8'));

const fail = (message: string): never => {
  throw new Error(`[lorebook-author-dashboard-roots] ${message}`);
};

if (js.includes('reality-root-candidates.v1.json')) fail('dashboard still references removed reality-root-candidates.v1.json');
if (doc.includes('reality-root-candidates.v1.json')) fail('dashboard doc still references removed reality-root-candidates.v1.json');
if (!js.includes("roots: './data/reality-root-map.v1.json'")) fail('dashboard must read checked Reality Root Web mirror');
if (!js.includes("entry.placementKind === 'FUTURE_ABSTRACT'")) fail('Future count must derive from placementKind fallback');
if (!js.includes("entry.placementKind === 'OPEN_UNMAPPED'")) fail('Open count must derive from placementKind fallback');
if (!js.includes('roots.futureAbstractCount')) fail('dashboard must prefer mirror Future summary count');
if (!js.includes('roots.openUnmappedCount')) fail('dashboard must prefer mirror Open summary count');
if (!js.includes('roots.exactCoordinateCount')) fail('dashboard must surface exact-coordinate boundary');

if (roots.characterCount !== characterRealityRootMapSummary.characterCount) fail('Reality Root mirror character count drift');
if (roots.realJapanRegionCount !== characterRealityRootMapSummary.realJapanRegionCount) fail('Reality Root real-Japan count drift');
if (roots.futureAbstractCount !== characterRealityRootMapSummary.futureAbstractCount) fail('Reality Root Future count drift');
if (roots.openUnmappedCount !== characterRealityRootMapSummary.openUnmappedCount) fail('Reality Root Open count drift');
if (roots.exactCoordinateCount !== characterRealityRootMapSummary.exactCoordinateCount) fail('Reality Root coordinate count drift');
if (roots.characterCount !== 36 || roots.realJapanRegionCount !== 32 || roots.futureAbstractCount !== 3 || roots.openUnmappedCount !== 1 || roots.exactCoordinateCount !== 0) {
  fail(`expected 36 / 32 real / 3 future / 1 open / 0 coord; got ${roots.characterCount} / ${roots.realJapanRegionCount} / ${roots.futureAbstractCount} / ${roots.openUnmappedCount} / ${roots.exactCoordinateCount}`);
}

const noa = roots.entries?.find((entry: any) => entry.authorId === 'noa');
if (!noa) fail('Noa Reality Root row missing');
if (noa.placementKind !== 'FUTURE_ABSTRACT') fail(`Noa placement drift: ${noa.placementKind}`);
if (!String(noa.root).includes('Open')) fail('fixture assumption drift: Noa root no longer contains Open substring');
if (roots.entries.filter((entry: any) => entry.placementKind === 'OPEN_UNMAPPED').some((entry: any) => entry.authorId === 'noa')) {
  fail('Noa must not be double-counted as Open/unmapped because root text contains Open');
}

for (const token of [
  'Reality Root != birthplace/home',
  'Reality Root != incident area',
  'region != personality',
  'Future15 != future-era origin',
  'Counts must come from the checked read-model projection, not string heuristics.',
]) if (!doc.includes(token)) fail(`dashboard geography boundary missing: ${token}`);

console.log('[lorebook-author-dashboard-roots] OK checked mirror / 36 roots / 32 real / 3 future / 1 open / 0 coord');
