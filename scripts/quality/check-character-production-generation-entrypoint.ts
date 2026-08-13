import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const policyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

function fail(message: string): never {
  throw new Error(`[character-production-entrypoint] ${message}`);
}

const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
if (policy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT') fail('policy status invalid');
if (policy.scopeCount !== 36) fail('scopeCount must be 36');
if (policy.productionExporter !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter) fail('code/policy exporter mismatch');
if (policy.authorityDocument !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.authority) fail('code/policy authority mismatch');
if (policy.lowerExportersAreProductionEntrypoints !== false) fail('lower exporter bypass guard weakened');
if (policy.handWrittenPromptIsProductionReady !== false) fail('hand prompt bypass guard weakened');
if (CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.lowerExporterOutputIsProductionReady !== false) fail('code lower-exporter guard weakened');
if (CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.handWrittenPromptIsProductionReady !== false) fail('code hand-prompt guard weakened');

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  if (!Array.isArray(json.characters)) fail(`${path}: characters missing`);
  for (const character of json.characters) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique production IDs, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, policy.productionExporter),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  const exported = JSON.parse(stdout);
  if (exported.productionImageGenerationEntrypoint !== true) fail(`${id}: production entrypoint flag missing`);
  if (exported.productionCharacterPromptReady !== true) fail(`${id}: production ready flag missing`);
  if (exported.productionPromptAuthorityLocked !== true) fail(`${id}: authority lock missing`);
  if (exported.feedbackRecurrenceGenerationEntrypoint !== true) fail(`${id}: feedback recurrence chain missing`);
  if (exported.characterImageGenerationReadinessRequired !== true) fail(`${id}: image readiness chain missing`);
  if (exported.imageGenerationReadinessState !== 'READY_FOR_CANDIDATE_GENERATION') fail(`${id}: image readiness not READY`);
  if (Array.isArray(exported.imageGenerationReadinessFailures) && exported.imageGenerationReadinessFailures.length > 0) fail(`${id}: readiness failures present`);
  if (exported.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (exported.lowerExporterOutputIsProductionReady !== false) fail(`${id}: lower exporter bypass guard weakened`);
  if (exported.handWrittenPromptIsProductionReady !== false) fail(`${id}: hand prompt bypass guard weakened`);
  if (exported.generatedImageCreatesCanon !== false) fail(`${id}: generated image canon guard weakened`);
  if (exported.generatedImageCreatesFeedbackRule !== false) fail(`${id}: generated image feedback guard weakened`);
  if (!exported.prompt.includes('CHARACTER PRODUCTION GENERATION ENTRYPOINT — FINAL AUTHORITY LOCK.')) fail(`${id}: final production prompt block missing`);
  for (const path of policy.requiredAuthorityPaths) {
    if (!exported.authorityOrder.includes(path)) fail(`${id}: required authority missing: ${path}`);
  }
  if (!exported.authorityOrder.includes(policy.authorityDocument)) fail(`${id}: production entrypoint authority missing`);
  if (!exported.authorityOrder.includes(policyPath)) fail(`${id}: production entrypoint policy missing`);
}

console.log(`[character-production-entrypoint] OK: ${ids.length}/36 production prompts exported only through ${policy.productionExporter}`);
