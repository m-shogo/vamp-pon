import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-focus-depth-effects-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-focus-depth-effects-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-focus-depth-effects-character-design-prompt.ts';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const fail = (m: string): never => { throw new Error(`[focus-depth-effects] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if ((policy.focusDepthInvariants ?? []).length < 20) fail('20 focus/depth invariants required');
if ((policy.preservationPriority ?? []).length < 10) fail('10 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 30) fail('30+ forbidden shortcuts required');
if (policy.unknownFocusDefault !== 'RESTRAINED_IDENTITY_PRESERVING_FOCUS') fail('unknown focus default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED')) fail('authority must preserve candidate-only output');
if (!authority.includes('RESTRAINED_IDENTITY_PRESERVING_FOCUS')) fail('authority unknown-focus default missing');
if (productionPolicy.productionExporter !== exporterPath) fail('focus wrapper must be top-level production exporter');
if (productionPolicy.wrapperRequiredFlags?.allCharacterFocusDepthEffectsFidelityRequired !== true) fail('wrapper focus requirement missing');
for (const [field, expected] of Object.entries(productionPolicy.wrapperRequiredFlags ?? {})) {
  if (field === 'allCharacterFocusDepthEffectsFidelityRequired') {
    if (expected !== true) fail(`wrapper flag must remain true: ${field}`);
  } else if (expected !== false) {
    fail(`wrapper guard must remain false: ${field}`);
  }
}
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
  ], { cwd: root, encoding: 'utf8', maxBuffer: 48 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterFocusDepthEffectsFidelityRequired !== true) fail(`${id}: focus/depth/effects flag missing`);
  if (output.unknownFocusMayBeInventedByImageModel !== false) fail(`${id}: unknown focus guard weakened`);
  if (output.effectsMayHideIdentityCriticalError !== false) fail(`${id}: effects error-hiding guard weakened`);
  if (output.effectsMayInventAuraOrEmission !== false) fail(`${id}: aura/emission guard weakened`);
  if (output.effectsMayReplaceIdentityPalette !== false) fail(`${id}: palette guard weakened`);
  if (output.effectsMayHideMobilityEquipment !== false) fail(`${id}: mobility effect guard weakened`);
  if (output.premiumAssetMayIncreaseEffectDensityAutomatically !== false) fail(`${id}: premium effect density guard weakened`);
  if (output.generatedEffectTreatmentCreatesCanon !== false) fail(`${id}: generated effect canon guard weakened`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: focus authority chain missing`);
  if (!output.prompt?.includes('FOCUS / DEPTH / EFFECTS FIDELITY — FINAL RENDERING LOCK.')) fail(`${id}: focus prompt block missing`);
}

console.log(`[focus-depth-effects] OK: ${ids.length}/36 focus/depth/effects production prompts validated`);
