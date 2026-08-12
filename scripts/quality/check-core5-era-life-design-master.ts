import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataPath = path.join(root, 'data/visual/core5-era-life-design-master-v1.json');
const handoffPath = path.join(root, 'src/game/data/characterReferenceGenerationHandoff.ts');
const exporterPath = path.join(root, 'tools/asset-factory/scripts/export-character-asset-prompt.ts');

function fail(message: string): never {
  throw new Error(`[core5-era-life-design-master] ${message}`);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const handoff = fs.readFileSync(handoffPath, 'utf8');
const exporter = fs.readFileSync(exporterPath, 'utf8');

if (data.status !== 'CROSS_DISCIPLINE_CURRENT_AUTHORING_MASTER') fail('status must remain current authoring master');
if (!Array.isArray(data.requiredEraAxes) || data.requiredEraAxes.length < 10) fail('requiredEraAxes must contain at least 10 axes');
if ((data.minimumDistinctAxesPerEra ?? 0) < 5) fail('minimumDistinctAxesPerEra must be at least 5');

const expectedIds = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];
const characters = data.characters ?? [];
if (characters.length !== 5) fail(`expected 5 Core5 profiles, got ${characters.length}`);
const byId = new Map(characters.map((entry: any) => [entry.id, entry]));

for (const id of expectedIds) {
  const entry: any = byId.get(id);
  if (!entry) fail(`missing Core5 era-life profile: ${id}`);
  if (!entry.eraBand || !entry.coreQuestion) fail(`${id}: eraBand/coreQuestion missing`);
  const ordinary = entry.ordinarySystems ?? {};
  const coveredAxes = data.requiredEraAxes.filter((axis: string) => Array.isArray(ordinary[axis]) && ordinary[axis].length > 0);
  if (coveredAxes.length < data.minimumDistinctAxesPerEra) {
    fail(`${id}: only ${coveredAxes.length} ordinary-system axes populated`);
  }
  if (coveredAxes.length !== data.requiredEraAxes.length) {
    fail(`${id}: all ${data.requiredEraAxes.length} era axes must be explicitly authored; got ${coveredAxes.length}`);
  }
  for (const field of ['visualTranslation', 'scenarioTranslation']) {
    if (!entry[field]) fail(`${id}: ${field} missing`);
  }
  if (!Array.isArray(entry.visualTranslation.priorities) || entry.visualTranslation.priorities.length < 4) {
    fail(`${id}: visual priorities must contain at least four items`);
  }
  if (!Array.isArray(entry.visualTranslation.forbidden) || entry.visualTranslation.forbidden.length < 3) {
    fail(`${id}: visual forbidden list must contain at least three items`);
  }
  if (!entry.visualTranslation.designQuestion) fail(`${id}: visual designQuestion missing`);
  if (!Array.isArray(entry.scenarioTranslation.dailyActions) || entry.scenarioTranslation.dailyActions.length < 3) {
    fail(`${id}: scenario dailyActions must contain at least three items`);
  }
  if (!entry.scenarioTranslation.incidentPressure) fail(`${id}: incidentPressure missing`);
  if (!entry.scenarioTranslation.kokuyou) fail(`${id}: kokuyou missing`);
  if (!Array.isArray(entry.scenarioTranslation.growthProof) || entry.scenarioTranslation.growthProof.length < 2) {
    fail(`${id}: growthProof must contain at least two items`);
  }
}

if (!data.crossEraPartyRule?.ordinaryTaskExample) fail('crossEraPartyRule ordinary task example missing');
if (!Array.isArray(data.visualQa) || data.visualQa.length < 7) fail('visualQa too small');
if (!Array.isArray(data.scenarioQa) || data.scenarioQa.length < 6) fail('scenarioQa too small');

for (const required of [
  'data/visual/core5-era-life-design-master-v1.json',
  'docs/visual/core5-era-life-design-master-v1.md',
  'core5EraLifeMasterRequired: true',
  'eraLifeMasterRequired',
]) {
  if (!handoff.includes(required)) fail(`handoff missing ${required}`);
}

for (const required of [
  'CORE5 ERA LIFE PROFILE — REQUIRED ERA/LIFE AUTHORITY.',
  'data/visual/core5-era-life-design-master-v1.json',
  'eraLifeProfile',
  'Do not express era only through costume styling',
]) {
  if (!exporter.includes(required)) fail(`resolved exporter missing ${required}`);
}

console.log('[core5-era-life-design-master] OK: 5 Core5 profiles with 12 ordinary-life axes and generation integration');
