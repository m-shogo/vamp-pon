import fs from 'node:fs';
import path from 'node:path';
import {
  CHARACTER_REFERENCE_HANDOFF_POLICY,
  characterReferenceGenerationHandoff,
} from '../../src/game/data/characterReferenceGenerationHandoff.ts';

const root = process.cwd();
const jsonPath = path.join(root, 'data/visual/character-designer-craft-master-v1.json');
const docPath = path.join(root, 'docs/visual/character-designer-craft-master-v1.md');

function fail(message: string): never {
  throw new Error(`[character-designer-craft-master] ${message}`);
}

if (!fs.existsSync(docPath)) fail('missing craft master document');
if (!fs.existsSync(jsonPath)) fail('missing craft master JSON');

const craft = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const requiredModules = [
  'faceDesign',
  'bodyDesign',
  'postureGesture',
  'silhouette',
  'clothingConstruction',
  'materialSurface',
  'color',
  'hair',
  'accessoryBodyModification',
  'expressionActing',
  'propDesign',
  'iteration',
  'originality',
];

for (const key of requiredModules) {
  if (!craft.modules?.[key]) fail(`missing craft module: ${key}`);
}

if (!Array.isArray(craft.finalCraftChecks) || craft.finalCraftChecks.length < 10) {
  fail('finalCraftChecks must contain at least 10 checks');
}
if (!Array.isArray(craft.modules?.bodyDesign?.axes) || craft.modules.bodyDesign.axes.length < 8) {
  fail('bodyDesign.axes is too shallow');
}
if (!Array.isArray(craft.modules?.clothingConstruction?.mustExplain) || craft.modules.clothingConstruction.mustExplain.length < 6) {
  fail('clothingConstruction.mustExplain is too shallow');
}
if (!Array.isArray(craft.modules?.expressionActing?.range) || craft.modules.expressionActing.range.length < 8) {
  fail('expressionActing.range is too shallow');
}
if (craft.modules?.accessoryBodyModification?.unknownMeans !== 'DO_NOT_ADD') {
  fail('unknown body modification must remain DO_NOT_ADD');
}
if (craft.modules?.iteration?.diagnosisOrder?.at(-1) !== 'detail-last') {
  fail('detail must remain last in the design diagnosis order');
}

if (CHARACTER_REFERENCE_HANDOFF_POLICY.designerCraftRequired !== true) {
  fail('character reference handoff must require Designer Craft Master');
}

for (const entry of characterReferenceGenerationHandoff) {
  if (entry.designerCraftRequired !== true) fail(`${entry.characterId}: designerCraftRequired must be true`);
  for (const requiredPath of [
    'docs/visual/character-designer-craft-master-v1.md',
    'data/visual/character-designer-craft-master-v1.json',
  ]) {
    if (!entry.visualAuthorityPaths.includes(requiredPath)) {
      fail(`${entry.characterId}: missing craft authority ${requiredPath}`);
    }
  }
}

console.log(`[character-designer-craft-master] OK: modules=${requiredModules.length}; handoffItems=${characterReferenceGenerationHandoff.length}`);
