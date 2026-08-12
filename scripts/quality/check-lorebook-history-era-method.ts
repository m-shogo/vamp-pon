import fs from 'node:fs';
import {
  CHARACTER_ERA_FORESHADOW_DIALOGUE,
  CHARACTER_ERA_RESERVOIR_RULES,
  characterEraReservoirSummary,
} from '../../src/game/data/characterEraForeshadowDialogueReservoir.ts';
import { CHARACTER_CROSS_ERA_ECHO_CHAINS } from '../../src/game/data/characterCrossEraEchoReservoir.ts';

const history = JSON.parse(fs.readFileSync('public/lorebook/data/history-atlas.v1.json', 'utf8'));
const js = fs.readFileSync('public/lorebook/history-enhancement.js', 'utf8');
const css = fs.readFileSync('public/lorebook/history.css', 'utf8');
const doc = fs.readFileSync('docs/lorebook-temporal-map-integration-v1.md', 'utf8');

const fail = (message: string): never => {
  throw new Error(`[lorebook-history-era-method] ${message}`);
};

if (history.schemaVersion !== 2) fail(`expected history schemaVersion 2, got ${history.schemaVersion}`);
if (history.eraMethod?.authority !== 'src/game/data/characterEraForeshadowDialogueReservoir.ts') fail('eraMethod authority drift');
if (history.eraMethod?.characterCount !== characterEraReservoirSummary.total) fail('36-character era count drift');
if (history.eraMethod?.current21Count !== characterEraReservoirSummary.current21) fail('Current21 era count drift');
if (history.eraMethod?.future15Count !== characterEraReservoirSummary.future15) fail('Future15 era count drift');
if (history.eraMethod?.characterCount !== 36 || history.eraMethod?.current21Count !== 21 || history.eraMethod?.future15Count !== 15) {
  fail('expected 36 / Current21 21 / Future15 15');
}
if (history.eraMethod?.exactYearFrozen !== false) fail('exact year must remain Open');
if (history.eraMethod?.dreamAppearanceEqualsRealityGeneration !== false) fail('Dream appearance must not equal Reality generation');
if (history.eraMethod?.future15MeansFutureEra !== false) fail('Future15 must not mean future-era origin');

const retired = new Set(['OLD', 'TRANSIT', 'RECENT', 'UNKNOWN']);
const lanes = history.eraMethod?.lanes ?? [];
if (lanes.length !== 6) fail(`expected 6 authoring entries (5 Reality + 1 special), got ${lanes.length}`);
if (lanes.some((lane: any) => retired.has(lane.id))) fail('retired OLD/TRANSIT/RECENT/UNKNOWN era labels returned');
if (lanes.filter((lane: any) => lane.kind === 'REALITY_LANE').length !== 5) fail('expected exactly 5 chronological Reality lanes');
if (lanes.filter((lane: any) => lane.kind === 'MYSTERY_SPECIAL_NOT_SIXTH_REALITY_ERA').length !== 1) fail('expected exactly 1 cross-era Mystery special');

const sourceLaneIds = [...new Set(CHARACTER_ERA_FORESHADOW_DIALOGUE.map((entry) => entry.lane))].sort();
const historyLaneIds = lanes.map((lane: any) => lane.id).sort();
if (JSON.stringify(historyLaneIds) !== JSON.stringify(sourceLaneIds)) fail('History era lane ids drift from character Era reservoir');

const special = lanes.find((lane: any) => lane.id === 'CROSS_ERA_LONG_LIVED');
if (!special || special.kind !== 'MYSTERY_SPECIAL_NOT_SIXTH_REALITY_ERA') fail('CROSS_ERA_LONG_LIVED must remain Mystery special, not sixth Reality era');

const requiredEvidence = history.eraMethod?.requiredEvidence ?? [];
for (const required of ['languageMarker','technologyMarker','dailyLifeMarker','objectOrRecordEvidence','RealityRootCompatibility','sourceStatus']) {
  if (!requiredEvidence.includes(required)) fail(`required era evidence missing: ${required}`);
}

const expectedLocks = ['tomori','michiru','nagi','yui','asa'];
const locks = history.eraMethod?.upstreamLocks ?? [];
if (locks.length !== 5) fail(`expected 5 upstream locks, got ${locks.length}`);
for (const id of expectedLocks) {
  const source = CHARACTER_ERA_FORESHADOW_DIALOGUE.find((entry) => entry.id === id);
  const lock = locks.find((entry: any) => entry.characterId === id);
  if (!source || !lock) fail(`missing upstream lock: ${id}`);
  if (source.assignmentStatus !== 'UPSTREAM_CURRENT') fail(`source no longer UPSTREAM_CURRENT: ${id}`);
  if (lock.status !== 'UPSTREAM_CURRENT') fail(`History lock status drift: ${id}`);
  if (lock.lane !== source.lane) fail(`History lock lane drift for ${id}: ${lock.lane} vs ${source.lane}`);
}

const lantern = history.objectThreads?.find((thread: any) => thread.id === 'thread-lantern');
if (!lantern) fail('lantern object thread missing');
if (lantern.status !== 'CANDIDATE') fail('lantern thread must remain Candidate');
if (!String(lantern.evidenceState).includes('EXACT HANDOFF OPEN')) fail('lantern exact handoff must remain Open');
if (!lantern.known.some((item: string) => item.includes('AUTHOR_CANDIDATE'))) fail('lantern anchor list must label exact same-object handoff as Candidate');
if (lantern.known.some((item: string) => item === 'トモリはユイのランタンを直した痕跡を持つ。')) fail('legacy lantern handoff must not be shown as Current-known fact');
if (!lantern.gap.includes('本当に同一物')) fail('lantern thread must keep same-object identity unresolved');

const repairEcho = CHARACTER_CROSS_ERA_ECHO_CHAINS.find((chain) => chain.id === 'repair-trace-tomori-yui');
if (!repairEcho || repairEcho.canonStatus !== 'AUTHOR_CANDIDATE') fail('Tomori/Yui repair echo must remain AUTHOR_CANDIDATE');
if (repairEcho.evidenceGate.length < 3) fail('Tomori/Yui repair echo needs 3+ evidence gates');

for (const thread of history.objectThreads ?? []) {
  if ('confidence' in thread) fail(`legacy confidence score-like field remains on object thread: ${thread.id}`);
  if (!thread.evidenceState) fail(`evidenceState missing from object thread: ${thread.id}`);
}

for (const rule of [
  'Dream is a cross-era overlay, not a sixth Reality era',
  'Future15 != future-era origin',
  'one evidence != era proof',
  'Tomori official constellation set != Yui official constellation set is forbidden',
]) {
  if (!(history.eraMethod?.rules ?? []).includes(rule)) fail(`History hard boundary missing: ${rule}`);
}

if (CHARACTER_ERA_RESERVOIR_RULES.tomoriYuiOfficialConstellationListDiffAllowed !== false) fail('source Tomori/Yui official-list guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.future15MeansFutureEra !== false) fail('source Future15 guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.oneEvidenceMayRevealEra !== false) fail('source one-evidence era guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.oldEraMeansIgnorant !== false) fail('source old/ignorance guard drift');
if (CHARACTER_ERA_RESERVOIR_RULES.futureEraMeansSuperior !== false) fail('source future/superiority guard drift');

for (const token of [
  'Source anchors / Candidate boundary',
  '36 CHARACTER ERA METHOD / AUTHOR CANDIDATE',
  'OLD / RECENTではなく',
  'data-era-kind',
  'OPEN SPECIAL',
  'TomoriとPresent Yuiのofficial IAU 88 set差を年代伏線にはしない',
  'Candidate handoffを「今わかっている事実」へ混ぜない',
]) if (!js.includes(token)) fail(`History renderer contract missing: ${token}`);

for (const token of [
  '[data-era-kind="MYSTERY_SPECIAL_NOT_SIXTH_REALITY_ERA"]',
  '.era-method-rules',
  '.era-anchors b',
]) if (!css.includes(token)) fail(`History CSS contract missing: ${token}`);

for (const token of [
  '`OLD`',
  '`TRANSIT`',
  '`RECENT`',
  '`UNKNOWN`',
  'Tomori official constellation set != Present Yui official constellation set is forbidden.',
  'object motif overlap != proven same-object lineage',
  '`CROSS_ERA_LONG_LIVED` != sixth chronological era',
]) if (!doc.includes(token)) fail(`Temporal integration doc boundary missing: ${token}`);

console.log('[lorebook-history-era-method] OK schema2 / 5 Reality lanes + 1 Mystery special / 36 characters / lantern handoff Candidate');
