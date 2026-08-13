import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT } from '../../src/game/data/characterReferenceProductionEntrypoint.ts';

const root = process.cwd();
const policyPath = 'data/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-garment-don-doff-dressing-workflow-fidelity-master-v1.md';
const dressingEntrypointPolicyPath = 'data/visual/character-production-generation-entrypoint-v2.json';
const dressingEntrypointAuthorityPath = 'docs/visual/character-production-generation-entrypoint-v2.md';
const dressingExporterPath = 'tools/asset-factory/scripts/export-dressing-workflow-locked-character-design-prompt.ts';
const profilePaths = ['data/visual/core5-living-visual-profiles-v1.json','data/visual/current21-extended-living-visual-profiles-v1.json','data/visual/future15-living-visual-profiles-v1.json'];
const fail = (m: string): never => { throw new Error(`[garment-dressing-workflow] ${m}`); };
const loadJson = (path: string): any => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

const policy = loadJson(policyPath);
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if (policy.production?.generatedDressingWorkflowCreatesCanon !== false) fail('canon guard weakened');
if ((policy.workflowAxes ?? []).length < 65) fail('65+ workflow axes required');
if ((policy.workflowInvariants ?? []).length < 30) fail('30+ workflow invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 50) fail('50+ forbidden shortcuts required');
if (policy.unknownDressingWorkflowDefault !== 'SOURCE_CONSTRAINED_MINIMUM_PLAUSIBLE_DRESSING_WORKFLOW_COMPLETION') fail('unknown workflow default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('SOURCE_CONSTRAINED_MINIMUM_PLAUSIBLE_DRESSING_WORKFLOW_COMPLETION')) fail('authority boundary missing');

const lineagePaths: string[] = [];
const seen = new Set<string>();
let currentPath = CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.policy;
while (true) {
  if (seen.has(currentPath)) fail(`entrypoint lineage cycle: ${currentPath}`);
  seen.add(currentPath);
  lineagePaths.push(currentPath);
  const current = loadJson(currentPath);
  if (current.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || current.scopeCount !== 36) fail(`entrypoint invalid: ${currentPath}`);
  if (typeof current.basePolicy !== 'string') break;
  const parent = loadJson(current.basePolicy);
  if (current.wrappedExporter !== parent.productionExporter) fail(`entrypoint wrapper lineage mismatch: ${currentPath}`);
  currentPath = current.basePolicy;
}
if (!lineagePaths.includes(dressingEntrypointPolicyPath)) fail('v2 dressing entrypoint missing from official production lineage');
const dressingEntrypointPolicy = loadJson(dressingEntrypointPolicyPath);
if (dressingEntrypointPolicy.productionExporter !== dressingExporterPath) fail('v2 dressing exporter changed');
if (dressingEntrypointPolicy.authorityDocument !== dressingEntrypointAuthorityPath) fail('v2 dressing authority changed');
if (dressingEntrypointPolicy.terminalPolicy !== policyPath || dressingEntrypointPolicy.terminalAuthorityDocument !== authorityPath) fail('v2 dressing terminal authority mismatch');

const ids: string[] = [];
for (const path of profilePaths) for (const c of loadJson(path).characters ?? []) ids.push(c.id);
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);

for (const id of ids) {
  const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, CHARACTER_REFERENCE_PRODUCTION_ENTRYPOINT.exporter), '--character', id, '--kind', 'character_reference'], { cwd: root, encoding: 'utf8', maxBuffer: 360 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterGarmentDonDoffDressingWorkflowFidelityRequired !== true) fail(`${id}: dressing workflow flag missing`);
  for (const field of Object.keys(policy.rules ?? {})) if (output[field] !== false) fail(`${id}: guard weakened: ${field}`);
  if ((output.dressingWorkflowAxes ?? []).length < 65) fail(`${id}: workflow axes missing`);
  if ((output.dressingWorkflowPreservationPriority ?? []).length < 12) fail(`${id}: preservation priority missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  for (const path of [authorityPath, policyPath, dressingEntrypointAuthorityPath, dressingEntrypointPolicyPath]) if (!output.authorityOrder?.includes(path)) fail(`${id}: dressing authority lineage missing: ${path}`);
  if (!output.prompt?.includes('GARMENT DON / DOFF / DRESSING WORKFLOW FIDELITY — FINAL WEARABILITY LOCK.')) fail(`${id}: wearability prompt block missing`);
  for (const inherited of ['allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired','allCharacterGarmentPatternSeamClosureLoadFidelityRequired','allCharacterGarmentBodyFitTensionCompressionFidelityRequired','allCharacterBodyMassPostureConstructionFidelityRequired','allCharacterFaceSkullLandmarkConstructionFidelityRequired']) if (output[inherited] !== true) fail(`${id}: inherited chain missing: ${inherited}`);
}

console.log(`[garment-dressing-workflow] OK: ${ids.length}/36 final production prompts preserve don/doff fidelity through current entrypoint lineage`);
