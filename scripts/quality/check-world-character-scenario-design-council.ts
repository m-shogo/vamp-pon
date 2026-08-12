import fs from 'node:fs';
import path from 'node:path';
import { CHARACTER_REFERENCE_HANDOFF_POLICY, characterReferenceGenerationHandoff } from '../../src/game/data/characterReferenceGenerationHandoff.ts';

const root = process.cwd();
const docPath = path.join(root, 'docs/visual/world-character-scenario-design-council-master-v1.md');
const jsonPath = path.join(root, 'data/visual/world-character-scenario-design-council-master-v1.json');
const eraLifeDocPath = path.join(root, 'docs/visual/core5-era-life-design-master-v1.md');
const eraLifeJsonPath = path.join(root, 'data/visual/core5-era-life-design-master-v1.json');
const worldPlacePath = path.join(root, 'docs/visual/world-place-design-contract-v1.md');
const scenarioScenePath = path.join(root, 'docs/visual/scenario-scene-design-contract-v1.md');

function fail(message: string): never {
  throw new Error(`[design-council] ${message}`);
}

for (const requiredPath of [docPath, jsonPath, eraLifeDocPath, eraLifeJsonPath, worldPlacePath, scenarioScenePath]) {
  if (!fs.existsSync(requiredPath)) fail(`required design authority missing: ${path.relative(root, requiredPath)}`);
}

const document = fs.readFileSync(docPath, 'utf8');
const council = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

if (council.status !== 'CURRENT_CROSS_DISCIPLINE_AUTHORITY') fail('council status must remain current authority');
if (!Array.isArray(council.causalLoop) || council.causalLoop.length < 8) fail('causal loop incomplete');
for (const role of ['worldDesigner','characterDesigner','scenarioDesigner']) {
  if (!council.roles?.[role]?.core) fail(`missing role core: ${role}`);
}
if (!Array.isArray(council.importantSceneRequiredLayers) || council.importantSceneRequiredLayers.length < 10) {
  fail('important scene must retain the expanded ten-layer scene contract');
}
if (!Array.isArray(council.ordinarySceneReservoir) || council.ordinarySceneReservoir.length < 10) {
  fail('ordinary scene reservoir too small');
}
if (!Array.isArray(council.antiGenericDrift) || council.antiGenericDrift.length < 12) {
  fail('anti-generic drift list too small');
}
for (const gate of ['characterAsset','importantScene','worldLocation']) {
  if (!Array.isArray(council.productionGates?.[gate]) || council.productionGates[gate].length < 7) {
    fail(`production gate incomplete: ${gate}`);
  }
}

const contracts = council.productionContracts ?? {};
if (contracts.core5EraLife?.data !== 'data/visual/core5-era-life-design-master-v1.json') fail('Core5 Era Life contract route missing');
if (contracts.worldPlace?.document !== 'docs/visual/world-place-design-contract-v1.md') fail('World Place contract route missing');
if (contracts.scenarioScene?.document !== 'docs/visual/scenario-scene-design-contract-v1.md') fail('Scenario Scene contract route missing');

for (const requiredText of [
  'World Designer',
  'Character Designer',
  'Scenario Designer',
  'Return to ordinary life is proof of growth',
  'Anti-generic drift checklist',
]) {
  if (!document.includes(requiredText)) fail(`council doc missing section/text: ${requiredText}`);
}

if (CHARACTER_REFERENCE_HANDOFF_POLICY.designCouncilRequired !== true) fail('character handoff must require council');
if (CHARACTER_REFERENCE_HANDOFF_POLICY.worldMasterRequired !== true) fail('character handoff must require world master');
if (CHARACTER_REFERENCE_HANDOFF_POLICY.core5EraLifeMasterRequired !== true) fail('character handoff must require Core5 Era Life master');

for (const entry of characterReferenceGenerationHandoff) {
  if (entry.designCouncilRequired !== true) fail(`${entry.characterId}: designCouncilRequired must be true`);
  const requiredAuthorities = [
    'docs/00-current-story-world-master.md',
    'docs/visual/world-character-scenario-design-council-master-v1.md',
    'data/visual/world-character-scenario-design-council-master-v1.json',
  ];
  for (const authority of requiredAuthorities) {
    if (!entry.visualAuthorityPaths.includes(authority)) fail(`${entry.characterId}: missing authority ${authority}`);
  }
  if (['yui','asa','nagi','michiru','tomori'].includes(entry.characterId)) {
    for (const authority of [
      'docs/visual/core5-era-life-design-master-v1.md',
      'data/visual/core5-era-life-design-master-v1.json',
    ]) {
      if (!entry.visualAuthorityPaths.includes(authority)) fail(`${entry.characterId}: missing Core5 era authority ${authority}`);
    }
    if (entry.eraLifeMasterRequired !== true) fail(`${entry.characterId}: eraLifeMasterRequired must be true`);
  }
}

console.log(`[design-council] OK: cross-discipline authority + Era Life + World Place + Scenario Scene contracts active; character handoff entries=${characterReferenceGenerationHandoff.length}`);
