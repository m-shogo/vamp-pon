import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const policyPath = 'data/visual/all-character-footwear-ground-interface-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-footwear-ground-interface-fidelity-master-v1.md';
const entrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v9.json';
const entrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v9.md';
const parentEntrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v8.json';
const parentEntrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v8.md';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const fail = (message: string): never => { throw new Error(`[footwear-ground-interface] ${message}`); };
const loadJson = (path: string): any => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

const policy = loadJson(policyPath);
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const entrypointPolicy = loadJson(entrypointPolicyPath);

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedFootwearCreatesCanon !== false) fail('canon guard weakened');
if ((policy.footwearAxes ?? []).length < 85) fail('85+ footwear axes required');
if ((policy.footwearInvariants ?? []).length < 30) fail('30+ footwear invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 70) fail('70+ forbidden shortcuts required');
if (policy.unknownFootwearDefault !== 'SOURCE_CONSTRAINED_MINIMUM_FUNCTIONAL_FOOTWEAR_COMPLETION') fail('unknown footwear default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('SOURCE_CONSTRAINED_MINIMUM_FUNCTIONAL_FOOTWEAR_COMPLETION')) fail('authority boundary missing');

if (entrypointPolicy.productionExporter !== CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter || CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy !== entrypointPolicyPath) fail('official production entrypoint not promoted to v9 footwear wrapper');
if (entrypointPolicy.basePolicy !== parentEntrypointPolicyPath) fail('v9 parent policy mismatch');
if (entrypointPolicy.terminalPolicy !== policyPath || entrypointPolicy.terminalAuthorityDocument !== authorityPath) fail('v9 terminal authority mismatch');

const ids: string[] = [];
for (const path of profilePaths) {
  const json = loadJson(path);
  for (const character of json.characters ?? []) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types',
    resolve(root, CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 1024 * 1024 * 1024 });
  const output = JSON.parse(stdout);

  if (output.allCharacterFootwearGroundInterfaceFidelityRequired !== true) fail(`${id}: footwear flag missing`);
  for (const field of Object.keys(policy.rules ?? {})) if (output[field] !== false) fail(`${id}: guard weakened: ${field}`);
  if ((output.footwearGroundInterfaceAxes ?? []).length < 85) fail(`${id}: footwear axes missing`);
  if ((output.footwearGroundInterfacePreservationPriority ?? []).length < 12) fail(`${id}: preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);

  for (const path of [authorityPath, policyPath, entrypointAuthorityPath, entrypointPolicyPath, parentEntrypointAuthorityPath, parentEntrypointPolicyPath]) {
    if (!output.authorityOrder?.includes(path)) fail(`${id}: authority lineage missing: ${path}`);
  }
  if (!output.prompt?.includes('FOOTWEAR / SOLE / GROUND-INTERFACE FIDELITY — FINAL FOOT-GROUND CONSTRUCTION LOCK.')) fail(`${id}: footwear prompt block missing`);

  for (const inherited of [
    'allCharacterPersonalGroomingCosmeticsFidelityRequired',
    'allCharacterSkinCoverageExposureBoundaryFidelityRequired',
    'allCharacterAccessoryPropInventoryTransitionFidelityRequired',
    'allCharacterBodyAdornmentMarkingTopologyFidelityRequired',
    'allCharacterFastenerOperationalAccessServiceabilityFidelityRequired',
    'allCharacterGarmentLongWearComfortFidelityRequired',
    'allCharacterGarmentDonDoffDressingWorkflowFidelityRequired',
    'allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired',
    'allCharacterGarmentPatternSeamClosureLoadFidelityRequired',
    'allCharacterGarmentBodyFitTensionCompressionFidelityRequired',
    'allCharacterBodyMassPostureConstructionFidelityRequired',
    'allCharacterFaceSkullLandmarkConstructionFidelityRequired',
  ]) if (output[inherited] !== true) fail(`${id}: inherited chain missing: ${inherited}`);
}

console.log(`[footwear-ground-interface] OK: ${ids.length}/36 final production prompts preserve source-backed footwear/barefoot, foot volume, sole/heel and ground-interface fidelity`);
