import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const masterPath = 'data/visual/character-image-generation-readiness-master-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-final-character-design-prompt.ts';
const livingPaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

function fail(message: string): never {
  throw new Error(`[character-image-readiness] ${message}`);
}

const master = JSON.parse(readFileSync(resolve(root, masterPath), 'utf8'));
if (master.status !== 'TOP_LEVEL_IMAGE_GENERATION_GATE') fail('master status must be top-level image-generation gate');
if (master.scopeCount !== 36) fail('scopeCount must be 36');
if (master.passingState !== 'READY_FOR_CANDIDATE_GENERATION') fail('passing state weakened');
if (master.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('generated output must remain candidate review required');
if (master.generatedImageCreatesCanon !== false || master.openMeansModelFreedom !== false || master.highResolutionMayAddConcepts !== false) fail('anti-invention policy weakened');
if (!Array.isArray(master.genericGachaDrift) || master.genericGachaDrift.length < 12) fail('generic-gacha drift detector incomplete');
if (!Array.isArray(master.imageGenerationGate) || master.imageGenerationGate.length < 14) fail('readiness gate incomplete');
if (!master.detailDensityBudget || !Array.isArray(master.detailDensityBudget.mayNotAdd) || master.detailDensityBudget.mayNotAdd.length < 6) fail('detail-density budget incomplete');
if (!Array.isArray(master.postGenerationReviewTaxonomy) || master.postGenerationReviewTaxonomy.length < 5) fail('post-generation review taxonomy incomplete');

const characters = livingPaths.flatMap((path) => {
  const doc = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  return doc.characters ?? [];
});
if (characters.length !== 36) fail(`expected 36 Living Visual profiles, got ${characters.length}`);

for (const character of characters) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath),
    '--character', character.id, '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  const exported = JSON.parse(stdout);

  if (exported.imageGenerationReadinessState !== 'READY_FOR_CANDIDATE_GENERATION') fail(`${character.id}: readiness state is ${exported.imageGenerationReadinessState}`);
  if (!Array.isArray(exported.imageGenerationReadinessFailures) || exported.imageGenerationReadinessFailures.length !== 0) fail(`${character.id}: readiness failures not empty`);
  if (exported.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${character.id}: generated output state weakened`);
  if (exported.openMeansModelFreedom !== false || exported.generatedImageCreatesCanon !== false) fail(`${character.id}: final anti-canon/model-freedom guard weakened`);
  if (exported.characterImageGenerationReadinessRequired !== true) fail(`${character.id}: readiness Master not required`);
  if (!exported.authorityOrder.includes('docs/visual/character-image-generation-readiness-master-v1.md')) fail(`${character.id}: readiness authority missing from order`);
  if (!exported.prompt.includes('CHARACTER IMAGE GENERATION READINESS MASTER — TOP-LEVEL FINAL GATE.')) fail(`${character.id}: readiness prompt block missing`);

  for (const [field, expected] of Object.entries(master.requiredOutputFlags ?? {})) {
    if (exported[field] !== expected) fail(`${character.id}: ${field} expected ${String(expected)}, got ${String(exported[field])}`);
  }
  for (const field of master.requiredObjects ?? []) {
    if (exported[field] === null || exported[field] === undefined) fail(`${character.id}: required object missing: ${field}`);
  }
}

console.log(`[character-image-readiness] OK: 36/36 final prompts are READY_FOR_CANDIDATE_GENERATION with zero readiness failures`);
