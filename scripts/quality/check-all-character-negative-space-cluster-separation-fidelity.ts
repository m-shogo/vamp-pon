import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-negative-space-cluster-separation-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-negative-space-cluster-separation-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-surface-tone-mapped-character-design-prompt.ts';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const fail = (m: string): never => { throw new Error(`[negative-space-cluster-separation] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if ((policy.negativeSpaceInvariants ?? []).length < 30) fail('30 negative-space invariants required');
if ((policy.separationPriority ?? []).length < 10) fail('10 separation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 30) fail('30+ forbidden shortcuts required');
if (policy.unknownSpacingDefault !== 'FUNCTIONAL_IDENTITY_PRESERVING_BREATHING_ROOM') fail('unknown spacing default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED')) fail('authority must preserve candidate-only output');
if (!authority.includes('FUNCTIONAL_IDENTITY_PRESERVING_BREATHING_ROOM')) fail('unknown spacing default missing from authority');
if (productionPolicy.productionExporter !== exporterPath) fail('final exporter changed unexpectedly');
if (productionPolicy.finalWrapperRequiredFlags?.allCharacterNegativeSpaceClusterSeparationFidelityRequired !== true) fail('production spacing requirement missing');
for (const path of [authorityPath, policyPath]) if (!productionPolicy.requiredAuthorityPaths?.includes(path)) fail(`required authority path missing: ${path}`);

const ids: string[] = [];
for (const path of profilePaths) {
  const json = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  for (const character of json.characters ?? []) ids.push(character.id);
}
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(root, exporterPath),
    '--character', id,
    '--kind', 'character_reference',
  ], { cwd: root, encoding: 'utf8', maxBuffer: 72 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterNegativeSpaceClusterSeparationFidelityRequired !== true) fail(`${id}: spacing fidelity flag missing`);
  for (const field of [
    'unknownSpacingMayBeInventedByImageModel',
    'premiumAssetMayReduceNegativeSpaceAutomatically',
    'effectsMayFillIdentityCriticalNegativeSpace',
    'ornamentMayFillIdentityCriticalNegativeSpace',
    'spacingMayIncreaseExposure',
    'spacingMayInventGarmentCutout',
    'spacingMayDetachPropFromUseRelation',
    'spacingMayHideMobilityEquipment',
    'relationshipMayForceTouchingSilhouette',
    'generatedSpacingTreatmentCreatesCanon',
  ]) if (output[field] !== false) fail(`${id}: spacing guard weakened: ${field}`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: spacing authority chain missing`);
  if (!output.prompt?.includes('NEGATIVE SPACE / CLUSTER SEPARATION FIDELITY — FINAL SPACING LOCK.')) fail(`${id}: spacing prompt block missing`);
}

console.log(`[negative-space-cluster-separation] OK: ${ids.length}/36 final production prompts validated`);
