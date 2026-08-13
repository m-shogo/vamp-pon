import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const policyPath = 'data/visual/all-character-personal-grooming-cosmetics-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-personal-grooming-cosmetics-fidelity-master-v1.md';
const entrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v8.json';
const entrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v8.md';
const parentEntrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v7.json';
const parentEntrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v7.md';
const profilePaths = ['data/visual/core5-living-visual-profiles-v1.json','data/visual/current21-extended-living-visual-profiles-v1.json','data/visual/future15-living-visual-profiles-v1.json'];
const fail = (m: string): never => { throw new Error(`[personal-grooming] ${m}`); };
const loadJson = (path: string): any => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

const policy = loadJson(policyPath);
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const entrypointPolicy = loadJson(entrypointPolicyPath);
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedGroomingCreatesCanon !== false) fail('canon guard weakened');
if ((policy.groomingAxes ?? []).length < 65) fail('65+ grooming axes required');
if ((policy.groomingInvariants ?? []).length < 30) fail('30+ grooming invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 65) fail('65+ forbidden shortcuts required');
if (policy.unknownGroomingDefault !== 'SOURCE_CONSTRAINED_NO_INVENTION_PERSONAL_GROOMING_COMPLETION') fail('unknown grooming default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('SOURCE_CONSTRAINED_NO_INVENTION_PERSONAL_GROOMING_COMPLETION')) fail('authority boundary missing');
if (entrypointPolicy.basePolicy !== parentEntrypointPolicyPath) fail('v8 parent policy mismatch');
if (entrypointPolicy.terminalPolicy !== policyPath || entrypointPolicy.terminalAuthorityDocument !== authorityPath) fail('v8 terminal authority mismatch');

let lineagePath = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy;
const seen = new Set<string>();
let foundV8 = false;
while (typeof lineagePath === 'string') {
  if (seen.has(lineagePath)) fail(`entrypoint lineage cycle: ${lineagePath}`);
  seen.add(lineagePath);
  if (lineagePath === entrypointPolicyPath) { foundV8 = true; break; }
  const lineagePolicy = loadJson(lineagePath);
  lineagePath = lineagePolicy.basePolicy;
}
if (!foundV8) fail('official production lineage no longer contains v8 personal-grooming layer');

const ids: string[] = [];
for (const path of profilePaths) for (const c of loadJson(path).characters ?? []) ids.push(c.id);
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter), '--character', id, '--kind', 'character_reference'], { cwd: root, encoding: 'utf8', maxBuffer: 1024 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterPersonalGroomingCosmeticsFidelityRequired !== true) fail(`${id}: grooming flag missing`);
  for (const field of Object.keys(policy.rules ?? {})) if (output[field] !== false) fail(`${id}: guard weakened: ${field}`);
  if ((output.personalGroomingAxes ?? []).length < 65) fail(`${id}: grooming axes missing`);
  if ((output.personalGroomingPreservationPriority ?? []).length < 12) fail(`${id}: preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  for (const path of [authorityPath, policyPath, entrypointAuthorityPath, entrypointPolicyPath, parentEntrypointAuthorityPath, parentEntrypointPolicyPath]) if (!output.authorityOrder?.includes(path)) fail(`${id}: authority lineage missing: ${path}`);
  if (!output.prompt?.includes('PERSONAL GROOMING / COSMETICS / NAILS / FACIAL-HAIR FIDELITY — FINAL GROOMING-CHOICE LOCK.')) fail(`${id}: grooming prompt block missing`);
  for (const inherited of ['allCharacterSkinCoverageExposureBoundaryFidelityRequired','allCharacterAccessoryPropInventoryTransitionFidelityRequired','allCharacterBodyAdornmentMarkingTopologyFidelityRequired','allCharacterFastenerOperationalAccessServiceabilityFidelityRequired','allCharacterGarmentLongWearComfortFidelityRequired','allCharacterGarmentDonDoffDressingWorkflowFidelityRequired','allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired','allCharacterGarmentPatternSeamClosureLoadFidelityRequired','allCharacterGarmentBodyFitTensionCompressionFidelityRequired','allCharacterBodyMassPostureConstructionFidelityRequired','allCharacterFaceSkullLandmarkConstructionFidelityRequired']) if (output[inherited] !== true) fail(`${id}: inherited chain missing: ${inherited}`);
}

console.log(`[personal-grooming] OK: ${ids.length}/36 final production prompts preserve source-backed grooming choices without stereotype or beauty normalization`);
