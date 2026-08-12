import fs from 'node:fs';
import path from 'node:path';
import { CHARACTER_REFERENCE_HANDOFF_POLICY, characterReferenceGenerationHandoff } from '../../src/game/data/characterReferenceGenerationHandoff.ts';

const root = process.cwd();
const docPath = path.join(root, 'docs/visual/world-character-scenario-design-council-master-v1.md');
const jsonPath = path.join(root, 'data/visual/world-character-scenario-design-council-master-v1.json');

function fail(message: string): never {
  throw new Error(`[design-council] ${message}`);
}

if (!fs.existsSync(docPath)) fail('council document missing');
if (!fs.existsSync(jsonPath)) fail('council JSON missing');

const document = fs.readFileSync(docPath, 'utf8');
const council = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

if (council.status !== 'CURRENT_CROSS_DISCIPLINE_AUTHORITY') fail('council status must remain current authority');
if (!Array.isArray(council.causalLoop) || council.causalLoop.length < 8) fail('causal loop incomplete');
for (const role of ['worldDesigner','characterDesigner','scenarioDesigner']) {
  if (!council.roles?.[role]?.core) fail(`missing role core: ${role}`);
}
if (!Array.isArray(council.importantSceneRequiredLayers) || council.importantSceneRequiredLayers.length !== 5) {
  fail('important scene must retain five required layers');
}
if (!Array.isArray(council.ordinarySceneReservoir) || council.ordinarySceneReservoir.length < 7) {
  fail('ordinary scene reservoir too small');
}
if (!Array.isArray(council.antiGenericDrift) || council.antiGenericDrift.length < 10) {
  fail('anti-generic drift list too small');
}
for (const gate of ['characterAsset','importantScene','worldLocation']) {
  if (!Array.isArray(council.productionGates?.[gate]) || council.productionGates[gate].length < 5) {
    fail(`production gate incomplete: ${gate}`);
  }
}

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
}

console.log(`[design-council] OK: cross-discipline authority active; character handoff entries=${characterReferenceGenerationHandoff.length}`);
