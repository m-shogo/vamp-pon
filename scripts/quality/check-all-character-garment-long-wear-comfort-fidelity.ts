import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const policyPath = 'data/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.md';
const entrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v3.json';
const entrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v3.md';
const parentEntrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v2.json';
const parentEntrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v2.md';
const profilePaths = ['data/visual/core5-living-visual-profiles-v1.json','data/visual/current21-extended-living-visual-profiles-v1.json','data/visual/future15-living-visual-profiles-v1.json'];
const fail = (m: string): never => { throw new Error(`[garment-long-wear-comfort] ${m}`); };

const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const entrypointPolicy = JSON.parse(readFileSync(resolve(root, entrypointPolicyPath), 'utf8'));
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedLongWearBehaviorCreatesCanon !== false) fail('canon guard weakened');
if ((policy.comfortAxes ?? []).length < 80) fail('80+ comfort axes required');
if ((policy.comfortInvariants ?? []).length < 35) fail('35+ comfort invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 60) fail('60+ forbidden shortcuts required');
if (policy.unknownComfortDefault !== 'SOURCE_CONSTRAINED_NEUTRAL_LONG_WEAR_COMFORT_COMPLETION') fail('unknown comfort default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('SOURCE_CONSTRAINED_NEUTRAL_LONG_WEAR_COMFORT_COMPLETION')) fail('authority boundary missing');
if (entrypointPolicy.productionExporter !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter || CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy !== entrypointPolicyPath) fail('official production entrypoint not promoted to v3 long-wear wrapper');
if (entrypointPolicy.basePolicy !== parentEntrypointPolicyPath) fail('v3 parent policy mismatch');

const ids: string[] = [];
for (const path of profilePaths) for (const c of JSON.parse(readFileSync(resolve(root, path), 'utf8')).characters ?? []) ids.push(c.id);
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter), '--character', id, '--kind', 'character_reference'], { cwd: root, encoding: 'utf8', maxBuffer: 360 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterGarmentLongWearComfortFidelityRequired !== true) fail(`${id}: long-wear comfort flag missing`);
  for (const field of Object.keys(policy.rules ?? {})) if (output[field] !== false) fail(`${id}: guard weakened: ${field}`);
  if ((output.longWearComfortAxes ?? []).length < 80) fail(`${id}: comfort axes missing`);
  if ((output.longWearComfortPreservationPriority ?? []).length < 12) fail(`${id}: preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  for (const path of [authorityPath, policyPath, entrypointAuthorityPath, entrypointPolicyPath, parentEntrypointAuthorityPath, parentEntrypointPolicyPath]) if (!output.authorityOrder?.includes(path)) fail(`${id}: authority lineage missing: ${path}`);
  if (!output.prompt?.includes('GARMENT COMFORT / PRESSURE / CHAFING / THERMAL / LONG-WEAR FIDELITY — FINAL LIVED-USE LOCK.')) fail(`${id}: long-wear prompt block missing`);
  for (const inherited of ['allCharacterGarmentDonDoffDressingWorkflowFidelityRequired','allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired','allCharacterGarmentPatternSeamClosureLoadFidelityRequired','allCharacterGarmentBodyFitTensionCompressionFidelityRequired','allCharacterBodyMassPostureConstructionFidelityRequired','allCharacterFaceSkullLandmarkConstructionFidelityRequired']) if (output[inherited] !== true) fail(`${id}: inherited chain missing: ${inherited}`);
}

console.log(`[garment-long-wear-comfort] OK: ${ids.length}/36 final production prompts preserve long-wear pressure, friction, thermal and lived-use fidelity`);
