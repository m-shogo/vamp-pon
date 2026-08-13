import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const policyPath = 'data/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.md';
const entrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v4.json';
const entrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v4.md';
const parentEntrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v3.json';
const parentEntrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v3.md';
const profilePaths = ['data/visual/core5-living-visual-profiles-v1.json','data/visual/current21-extended-living-visual-profiles-v1.json','data/visual/future15-living-visual-profiles-v1.json'];
const fail = (m: string): never => { throw new Error(`[fastener-operational-access] ${m}`); };
const loadJson = (path: string): any => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

const policy = loadJson(policyPath);
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const entrypointPolicy = loadJson(entrypointPolicyPath);
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedOperationalAccessCreatesCanon !== false) fail('canon guard weakened');
if ((policy.operationalAxes ?? []).length < 80) fail('80+ operational axes required');
if ((policy.operationalInvariants ?? []).length < 35) fail('35+ operational invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 65) fail('65+ forbidden shortcuts required');
if (policy.unknownOperationalAccessDefault !== 'SOURCE_CONSTRAINED_NEUTRAL_OPERATIONAL_ACCESS_COMPLETION') fail('unknown operational default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('SOURCE_CONSTRAINED_NEUTRAL_OPERATIONAL_ACCESS_COMPLETION')) fail('authority boundary missing');
if (entrypointPolicy.productionExporter !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter || CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy !== entrypointPolicyPath) fail('official production entrypoint not promoted to v4 operational wrapper');
if (entrypointPolicy.basePolicy !== parentEntrypointPolicyPath) fail('v4 parent policy mismatch');
if (entrypointPolicy.terminalPolicy !== policyPath || entrypointPolicy.terminalAuthorityDocument !== authorityPath) fail('v4 terminal authority mismatch');

const ids: string[] = [];
for (const path of profilePaths) for (const c of loadJson(path).characters ?? []) ids.push(c.id);
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter), '--character', id, '--kind', 'character_reference'], { cwd: root, encoding: 'utf8', maxBuffer: 440 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterFastenerOperationalAccessServiceabilityFidelityRequired !== true) fail(`${id}: operational access flag missing`);
  for (const field of Object.keys(policy.rules ?? {})) if (output[field] !== false) fail(`${id}: guard weakened: ${field}`);
  if ((output.operationalAccessAxes ?? []).length < 80) fail(`${id}: operational axes missing`);
  if ((output.operationalAccessPreservationPriority ?? []).length < 12) fail(`${id}: preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  for (const path of [authorityPath, policyPath, entrypointAuthorityPath, entrypointPolicyPath, parentEntrypointAuthorityPath, parentEntrypointPolicyPath]) if (!output.authorityOrder?.includes(path)) fail(`${id}: authority lineage missing: ${path}`);
  if (!output.prompt?.includes('FASTENER / OPERATIONAL ACCESS / SERVICEABILITY FIDELITY — FINAL USABILITY LOCK.')) fail(`${id}: operational prompt block missing`);
  for (const inherited of ['allCharacterGarmentLongWearComfortFidelityRequired','allCharacterGarmentDonDoffDressingWorkflowFidelityRequired','allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired','allCharacterGarmentPatternSeamClosureLoadFidelityRequired','allCharacterGarmentBodyFitTensionCompressionFidelityRequired','allCharacterBodyMassPostureConstructionFidelityRequired','allCharacterFaceSkullLandmarkConstructionFidelityRequired']) if (output[inherited] !== true) fail(`${id}: inherited chain missing: ${inherited}`);
}

console.log(`[fastener-operational-access] OK: ${ids.length}/36 final production prompts preserve operable fasteners, pocket access and serviceability fidelity`);
