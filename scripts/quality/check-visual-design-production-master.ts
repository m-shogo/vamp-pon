import fs from 'node:fs';
import path from 'node:path';
import { CHARACTER_REFERENCE_HANDOFF_POLICY, characterReferenceGenerationHandoff } from '../../src/game/data/characterReferenceGenerationHandoff.ts';

const root = process.cwd();
const docPath = path.join(root, 'docs/visual/visual-design-production-master-v1.md');
const jsonPath = path.join(root, 'data/visual/visual-design-production-master-v1.json');

function fail(message: string): never {
  throw new Error(`[visual-design-production-master] ${message}`);
}

if (!fs.existsSync(docPath)) fail('visual design production master document missing');
if (!fs.existsSync(jsonPath)) fail('visual design production master JSON missing');

const doc = fs.readFileSync(docPath, 'utf8');
const master = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

if (master.status !== 'CURRENT_VISUAL_PRODUCTION_AUTHORITY') fail('status must remain CURRENT_VISUAL_PRODUCTION_AUTHORITY');
if (!Array.isArray(master.designOrder) || master.designOrder.length < 13) fail('design order incomplete');
if (!Array.isArray(master.faceLayers) || master.faceLayers.length < 8) fail('face design layers incomplete');
if (!Array.isArray(master.bodyFields) || master.bodyFields.length < 9) fail('body design fields incomplete');
if (!Array.isArray(master.clothingConstructionFields) || master.clothingConstructionFields.length < 10) fail('clothing construction fields incomplete');
if (!Array.isArray(master.materialFields) || master.materialFields.length < 8) fail('material fields incomplete');
if (!Array.isArray(master.imageGenerationReadinessDesignOnly) || master.imageGenerationReadinessDesignOnly.length < 12) fail('design-only generation gate incomplete');
if (master.productionRule?.openRequiredVisualFieldBlocksCharacterMasterGeneration !== true) fail('OPEN visual fields must block Character Master generation');
if (master.productionRule?.genericGachaFillerCannotFillMissingDesign !== true) fail('generic gacha filler must not fill missing design');
if (!Array.isArray(master.finalDesignQA) || master.finalDesignQA.length < 15) fail('final design QA incomplete');

for (const text of [
  'Design order',
  'Character identity lock',
  'Clothing construction',
  'World visual grammar',
  'Rendering authority separation',
  'Image-generation readiness — DESIGN ONLY',
  'Final design QA',
]) {
  if (!doc.includes(text)) fail(`master doc missing section: ${text}`);
}

if (CHARACTER_REFERENCE_HANDOFF_POLICY.visualDesignProductionMasterRequired !== true) fail('character handoff policy must require visual design production master');

for (const entry of characterReferenceGenerationHandoff) {
  if (entry.visualDesignProductionMasterRequired !== true) fail(`${entry.characterId}: visualDesignProductionMasterRequired must be true`);
  for (const authority of [
    'docs/visual/visual-design-production-master-v1.md',
    'data/visual/visual-design-production-master-v1.json',
  ]) {
    if (!entry.visualAuthorityPaths.includes(authority)) fail(`${entry.characterId}: missing visual design authority ${authority}`);
  }
}

console.log(`[visual-design-production-master] OK: visual design production authority active; handoff entries=${characterReferenceGenerationHandoff.length}`);
