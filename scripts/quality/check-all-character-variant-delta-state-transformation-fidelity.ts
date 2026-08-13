import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-variant-delta-state-transformation-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-variant-delta-state-transformation-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const profilePaths = ['data/visual/core5-living-visual-profiles-v1.json','data/visual/current21-extended-living-visual-profiles-v1.json','data/visual/future15-living-visual-profiles-v1.json'];
const fail = (m: string): never => { throw new Error(`[variant-delta-state] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));
const exporterPath = productionPolicy.productionExporter;
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true || policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('production/candidate boundary weakened');
if ((policy.baselineLockedAxes ?? []).length < 20) fail('20 baseline-locked axes required');
if ((policy.allowedDeltaClasses ?? []).length < 10) fail('10 allowed delta classes required');
if ((policy.stateInvariants ?? []).length < 32) fail('32 state invariants required');
if ((policy.forbiddenShortcuts ?? []).length < 45) fail('45+ forbidden shortcuts required');
if ((policy.deltaLedgerRequiredFields ?? []).length < 6) fail('6 delta-ledger fields required');
if (policy.unknownStateDefault !== 'BASELINE_PRESERVING_MINIMUM_AUTHORIZED_DELTA') fail('unknown state default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('BASELINE_PRESERVING_MINIMUM_AUTHORIZED_DELTA')) fail('authority boundary/default missing');
if (typeof exporterPath !== 'string' || !exporterPath.startsWith('tools/asset-factory/scripts/export-')) fail('production exporter invalid');
if (productionPolicy.finalWrapperRequiredFlags?.allCharacterVariantDeltaStateTransformationFidelityRequired !== true) fail('production variant requirement missing');
for (const path of [authorityPath, policyPath]) if (!productionPolicy.requiredAuthorityPaths?.includes(path)) fail(`required authority path missing: ${path}`);
const ids: string[] = [];
for (const path of profilePaths) { const json = JSON.parse(readFileSync(resolve(root, path), 'utf8')); for (const character of json.characters ?? []) ids.push(character.id); }
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);
for (const id of ids) {
  const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, exporterPath), '--character', id, '--kind', 'character_reference'], { cwd: root, encoding: 'utf8', maxBuffer: 112 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterVariantDeltaStateTransformationFidelityRequired !== true) fail(`${id}: variant fidelity flag missing`);
  for (const field of ['unknownStateDeltaMayBeInventedByImageModel','stateMayRedesignIdentity','stateMayChangeBodyCategory','stateMayDeAgeCharacter','stateMayIncreaseExposureAutomatically','stateMayInventBodyModification','stateMayRemoveMobilityEquipment','stateMayResetMaintenanceHistory','stateMayIncreaseOrnamentAutomatically','stateMayReplaceIdentityPaletteAutomatically','stateMayInventPropOrRelationshipEvidence','premiumVariantMayBeautifyCharacterAutomatically','generatedStateDeltaCreatesCanon']) if (output[field] !== false) fail(`${id}: variant guard weakened: ${field}`);
  if ((output.variantBaselineLockedAxes ?? []).length < 20) fail(`${id}: baseline lock list missing`);
  if ((output.variantAllowedDeltaClasses ?? []).length < 10) fail(`${id}: allowed delta classes missing`);
  if ((output.variantDeltaLedgerRequiredFields ?? []).length < 6) fail(`${id}: delta ledger contract missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: variant authority chain missing`);
  if (!output.prompt?.includes('VARIANT DELTA / STATE TRANSFORMATION FIDELITY — FINAL DELTA LOCK.')) fail(`${id}: variant prompt block missing`);
}
console.log(`[variant-delta-state] OK: ${ids.length}/36 production prompts validated through ${exporterPath}`);
