import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-viewpoint-turnaround-back-design-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-viewpoint-turnaround-back-design-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-viewpoint-turnaround-character-design-prompt.ts';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const fail = (m: string): never => { throw new Error(`[viewpoint-turnaround] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if ((policy.turnaroundInvariants ?? []).length < 37) fail('37 turnaround invariants required');
if ((policy.continuityPriority ?? []).length < 14) fail('14 continuity priorities required');
if ((policy.allowedNeutralCompletionClasses ?? []).length < 8) fail('8 neutral completion classes required');
if ((policy.forbiddenShortcuts ?? []).length < 40) fail('40+ forbidden shortcuts required');
if (policy.unknownHiddenSurfaceDefault !== 'SOURCE_CONSTRAINED_NEUTRAL_COMPLETION') fail('unknown hidden-surface default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED')) fail('authority must preserve candidate-only output');
if (!authority.includes('SOURCE_CONSTRAINED_NEUTRAL_COMPLETION')) fail('neutral hidden-surface default missing');
if (productionPolicy.productionExporter !== exporterPath) fail('production exporter not routed through turnaround wrapper');
if (productionPolicy.terminalWrapperRequiredFlags?.allCharacterViewpointTurnaroundBackDesignFidelityRequired !== true) fail('terminal turnaround requirement missing');
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
  ], { cwd: root, encoding: 'utf8', maxBuffer: 104 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterViewpointTurnaroundBackDesignFidelityRequired !== true) fail(`${id}: turnaround flag missing`);
  for (const field of [
    'unknownHiddenSurfaceMayBeInventedByImageModel',
    'viewpointMayRedesignFace',
    'viewpointMayChangeHairTopology',
    'viewpointMayInventGarmentConstruction',
    'viewpointMaySwapCanonicalAsymmetry',
    'viewpointMayInventPocketOrStorage',
    'viewpointMayInventExposure',
    'viewpointMayInventBodyModification',
    'viewpointMayMovePropForComposition',
    'viewpointMaySimplifyMobilityEquipment',
    'premiumViewMayAddRearOrnament',
    'generatedHiddenSurfaceCreatesCanon',
  ]) if (output[field] !== false) fail(`${id}: turnaround guard weakened: ${field}`);
  if ((output.viewpointTurnaroundContinuityPriority ?? []).length < 14) fail(`${id}: continuity priority missing`);
  if ((output.viewpointAllowedNeutralCompletionClasses ?? []).length < 8) fail(`${id}: neutral completion contract missing`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: turnaround authority chain missing`);
  if (!output.prompt?.includes('VIEWPOINT / TURNAROUND / BACK-DESIGN FIDELITY — FINAL TOPOLOGY LOCK.')) fail(`${id}: turnaround prompt block missing`);
  if (output.allCharacterVariantDeltaStateTransformationFidelityRequired !== true) fail(`${id}: variant delta chain missing below turnaround`);
}

console.log(`[viewpoint-turnaround] OK: ${ids.length}/36 final production prompts validated`);
