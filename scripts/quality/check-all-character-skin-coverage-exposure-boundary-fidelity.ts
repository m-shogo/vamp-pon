import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const policyPath = 'data/visual/all-character-skin-coverage-exposure-boundary-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-skin-coverage-exposure-boundary-fidelity-master-v1.md';
const entrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v7.json';
const entrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v7.md';
const parentEntrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v6.json';
const parentEntrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v6.md';
const profilePaths = ['data/visual/core5-living-visual-profiles-v1.json','data/visual/current21-extended-living-visual-profiles-v1.json','data/visual/future15-living-visual-profiles-v1.json'];
const fail = (m: string): never => { throw new Error(`[skin-coverage-exposure] ${m}`); };
const loadJson = (path: string): any => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

const policy = loadJson(policyPath);
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const entrypointPolicy = loadJson(entrypointPolicyPath);
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedExposureCreatesCanon !== false) fail('canon guard weakened');
if ((policy.coverageAxes ?? []).length < 80) fail('80+ coverage axes required');
if ((policy.coverageInvariants ?? []).length < 30) fail('30+ coverage invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 70) fail('70+ forbidden shortcuts required');
if (policy.unknownCoverageDefault !== 'SOURCE_CONSTRAINED_BASELINE_COVERAGE_PRESERVATION') fail('unknown coverage default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('SOURCE_CONSTRAINED_BASELINE_COVERAGE_PRESERVATION')) fail('authority boundary missing');
if (entrypointPolicy.basePolicy !== parentEntrypointPolicyPath) fail('v7 parent policy mismatch');
if (entrypointPolicy.terminalPolicy !== policyPath || entrypointPolicy.terminalAuthorityDocument !== authorityPath) fail('v7 terminal authority mismatch');

let lineagePath = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy;
const seen = new Set<string>();
let foundV7 = false;
while (typeof lineagePath === 'string') {
  if (seen.has(lineagePath)) fail(`entrypoint lineage cycle: ${lineagePath}`);
  seen.add(lineagePath);
  if (lineagePath === entrypointPolicyPath) { foundV7 = true; break; }
  const lineagePolicy = loadJson(lineagePath);
  lineagePath = lineagePolicy.basePolicy;
}
if (!foundV7) fail('official production lineage no longer contains v7 skin-coverage layer');

const ids: string[] = [];
for (const path of profilePaths) for (const c of loadJson(path).characters ?? []) ids.push(c.id);
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter), '--character', id, '--kind', 'character_reference'], { cwd: root, encoding: 'utf8', maxBuffer: 900 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterSkinCoverageExposureBoundaryFidelityRequired !== true) fail(`${id}: coverage flag missing`);
  for (const field of Object.keys(policy.rules ?? {})) if (output[field] !== false) fail(`${id}: guard weakened: ${field}`);
  if ((output.skinCoverageAxes ?? []).length < 80) fail(`${id}: coverage axes missing`);
  if ((output.skinCoveragePreservationPriority ?? []).length < 12) fail(`${id}: preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  for (const path of [authorityPath, policyPath, entrypointAuthorityPath, entrypointPolicyPath, parentEntrypointAuthorityPath, parentEntrypointPolicyPath]) if (!output.authorityOrder?.includes(path)) fail(`${id}: authority lineage missing: ${path}`);
  if (!output.prompt?.includes('SKIN COVERAGE / EXPOSURE BOUNDARY FIDELITY — FINAL AUTHORED COVERAGE LOCK.')) fail(`${id}: coverage prompt block missing`);
  for (const inherited of ['allCharacterAccessoryPropInventoryTransitionFidelityRequired','allCharacterBodyAdornmentMarkingTopologyFidelityRequired','allCharacterFastenerOperationalAccessServiceabilityFidelityRequired','allCharacterGarmentLongWearComfortFidelityRequired','allCharacterGarmentDonDoffDressingWorkflowFidelityRequired','allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired','allCharacterGarmentPatternSeamClosureLoadFidelityRequired','allCharacterGarmentBodyFitTensionCompressionFidelityRequired','allCharacterBodyMassPostureConstructionFidelityRequired','allCharacterFaceSkullLandmarkConstructionFidelityRequired']) if (output[inherited] !== true) fail(`${id}: inherited chain missing: ${inherited}`);
}

console.log(`[skin-coverage-exposure] OK: ${ids.length}/36 final production prompts preserve authored coverage/exposure boundaries without inference or sexualization drift`);
