import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-surface-tone-mapping-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-surface-tone-mapping-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const exporterPath = 'tools/asset-factory/scripts/export-surface-tone-mapped-character-design-prompt.ts';
const profilePaths = [
  'data/visual/core5-living-visual-profiles-v1.json',
  'data/visual/current21-extended-living-visual-profiles-v1.json',
  'data/visual/future15-living-visual-profiles-v1.json',
];

const fail = (m: string): never => { throw new Error(`[surface-tone-mapping] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true) fail('production requirement weakened');
if (policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('candidate boundary weakened');
if ((policy.surfaceInvariants ?? []).length < 22) fail('22 surface invariants required');
if ((policy.materialClasses ?? []).length < 12) fail('12 material classes required');
if ((policy.forbiddenShortcuts ?? []).length < 30) fail('30+ forbidden shortcuts required');
if (policy.unknownSurfaceDefault !== 'MATERIAL_APPROPRIATE_NEUTRAL_SURFACE') fail('unknown surface default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED')) fail('authority candidate boundary missing');
if (!authority.includes('MATERIAL_APPROPRIATE_NEUTRAL_SURFACE')) fail('authority unknown surface default missing');
if (productionPolicy.productionExporter !== exporterPath) fail('surface wrapper must be top-level exporter');
if (productionPolicy.finalWrapperRequiredFlags?.allCharacterSurfaceToneMappingFidelityRequired !== true) fail('final surface wrapper requirement missing');
for (const path of [authorityPath, policyPath]) if (!productionPolicy.requiredAuthorityPaths?.includes(path)) fail(`required authority missing: ${path}`);

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
  ], { cwd: root, encoding: 'utf8', maxBuffer: 56 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterFocusDepthEffectsFidelityRequired !== true) fail(`${id}: focus chain missing`);
  if (output.allCharacterSurfaceToneMappingFidelityRequired !== true) fail(`${id}: surface/tone flag missing`);
  if (output.unknownSurfaceMayBeInventedByImageModel !== false) fail(`${id}: unknown surface guard weakened`);
  if (output.toneMappingMayChangeSkinIdentity !== false) fail(`${id}: skin identity guard weakened`);
  if (output.surfacePolishMayDeAgeCharacter !== false) fail(`${id}: age guard weakened`);
  if (output.surfacePolishMaySlimBodyByHighlight !== false) fail(`${id}: body highlight guard weakened`);
  if (output.premiumAssetMayUniversalizeGloss !== false) fail(`${id}: gloss guard weakened`);
  if (output.weatherMaySexualizeWetSurface !== false) fail(`${id}: wet-surface guard weakened`);
  if (output.nonHumanSurfaceMayHumanize !== false) fail(`${id}: non-human surface guard weakened`);
  if (output.generatedMicrotextureCreatesCanon !== false) fail(`${id}: microtexture canon guard weakened`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: surface authority missing`);
  if (!output.prompt?.includes('SURFACE / TONE-MAPPING FIDELITY — FINAL MATERIAL LOCK.')) fail(`${id}: surface prompt block missing`);
}

console.log(`[surface-tone-mapping] OK: ${ids.length}/36 surface/tone-mapping production prompts validated`);
