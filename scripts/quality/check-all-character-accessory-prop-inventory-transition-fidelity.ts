import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const policyPath = 'data/visual/all-character-accessory-prop-inventory-transition-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-accessory-prop-inventory-transition-fidelity-master-v1.md';
const entrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v6.json';
const entrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v6.md';
const parentEntrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v5.json';
const parentEntrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v5.md';
const profilePaths = ['data/visual/core5-living-visual-profiles-v1.json','data/visual/current21-extended-living-visual-profiles-v1.json','data/visual/future15-living-visual-profiles-v1.json'];
const fail = (m: string): never => { throw new Error(`[accessory-prop-inventory] ${m}`); };
const loadJson = (path: string): any => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

const policy = loadJson(policyPath);
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const entrypointPolicy = loadJson(entrypointPolicyPath);
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedInventoryCreatesCanon !== false) fail('canon guard weakened');
if ((policy.inventoryAxes ?? []).length < 70) fail('70+ inventory axes required');
if ((policy.inventoryInvariants ?? []).length < 34) fail('34+ inventory invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 70) fail('70+ forbidden shortcuts required');
if (policy.unknownInventoryDefault !== 'SOURCE_CONSTRAINED_NO_INVENTION_ACCESSORY_INVENTORY_COMPLETION') fail('unknown inventory default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('SOURCE_CONSTRAINED_NO_INVENTION_ACCESSORY_INVENTORY_COMPLETION')) fail('authority boundary missing');
if (entrypointPolicy.basePolicy !== parentEntrypointPolicyPath) fail('v6 parent policy mismatch');
if (entrypointPolicy.terminalPolicy !== policyPath || entrypointPolicy.terminalAuthorityDocument !== authorityPath) fail('v6 terminal authority mismatch');

const lineagePaths: string[] = [];
const seen = new Set<string>();
let currentPath = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy;
while (true) {
  if (seen.has(currentPath)) fail(`entrypoint lineage cycle: ${currentPath}`);
  seen.add(currentPath);
  lineagePaths.push(currentPath);
  const current = loadJson(currentPath);
  if (typeof current.basePolicy !== 'string') break;
  currentPath = current.basePolicy;
}
if (!lineagePaths.includes(entrypointPolicyPath)) fail('current production lineage no longer contains v6 accessory inventory entrypoint');

const ids: string[] = [];
for (const path of profilePaths) for (const c of loadJson(path).characters ?? []) ids.push(c.id);
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter), '--character', id, '--kind', 'character_reference'], { cwd: root, encoding: 'utf8', maxBuffer: 760 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterAccessoryPropInventoryTransitionFidelityRequired !== true) fail(`${id}: accessory inventory flag missing`);
  for (const field of Object.keys(policy.rules ?? {})) if (output[field] !== false) fail(`${id}: guard weakened: ${field}`);
  if ((output.accessoryPropInventoryAxes ?? []).length < 70) fail(`${id}: inventory axes missing`);
  if ((output.accessoryPropInventoryPreservationPriority ?? []).length < 12) fail(`${id}: preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  for (const path of [authorityPath, policyPath, entrypointAuthorityPath, entrypointPolicyPath, parentEntrypointAuthorityPath, parentEntrypointPolicyPath]) if (!output.authorityOrder?.includes(path)) fail(`${id}: authority lineage missing: ${path}`);
  if (!output.prompt?.includes('ACCESSORY / PROP INVENTORY / STATE-TRANSITION FIDELITY — FINAL DISCRETE OBJECT IDENTITY LOCK.')) fail(`${id}: accessory inventory prompt block missing`);
  for (const inherited of ['allCharacterBodyAdornmentMarkingTopologyFidelityRequired','allCharacterFastenerOperationalAccessServiceabilityFidelityRequired','allCharacterGarmentLongWearComfortFidelityRequired','allCharacterGarmentDonDoffDressingWorkflowFidelityRequired','allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired','allCharacterGarmentPatternSeamClosureLoadFidelityRequired','allCharacterGarmentBodyFitTensionCompressionFidelityRequired','allCharacterBodyMassPostureConstructionFidelityRequired','allCharacterFaceSkullLandmarkConstructionFidelityRequired']) if (output[inherited] !== true) fail(`${id}: inherited chain missing: ${inherited}`);
}

console.log(`[accessory-prop-inventory] OK: ${ids.length}/36 final production prompts preserve source-backed removable object inventory and transitions across current entrypoint lineage`);
