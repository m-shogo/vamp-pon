import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-feature-scale-proportion-lod-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-feature-scale-proportion-lod-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const profilePaths = ['data/visual/core5-living-visual-profiles-v1.json','data/visual/current21-extended-living-visual-profiles-v1.json','data/visual/future15-living-visual-profiles-v1.json'];
const fail = (m: string): never => { throw new Error(`[feature-scale-proportion-lod] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));
const exporterPath = productionPolicy.productionExporter;
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true || policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('production/candidate boundary weakened');
if ((policy.lodInvariants ?? []).length < 30) fail('30 LOD invariants required');
if ((policy.preservationPriority ?? []).length < 12) fail('12 preservation priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 35) fail('35+ forbidden shortcuts required');
if (policy.unknownLodDefault !== 'PROPORTION_PRESERVING_MINIMUM_SUFFICIENT_LOD') fail('unknown LOD default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('PROPORTION_PRESERVING_MINIMUM_SUFFICIENT_LOD')) fail('authority boundary/default missing');
if (typeof exporterPath !== 'string' || !exporterPath.startsWith('tools/asset-factory/scripts/export-')) fail('production exporter invalid');
if (productionPolicy.finalWrapperRequiredFlags?.allCharacterFeatureScaleProportionLodFidelityRequired !== true) fail('production LOD requirement missing');
for (const path of [authorityPath, policyPath]) if (!productionPolicy.requiredAuthorityPaths?.includes(path)) fail(`required authority path missing: ${path}`);
const ids: string[] = [];
for (const path of profilePaths) { const json = JSON.parse(readFileSync(resolve(root, path), 'utf8')); for (const character of json.characters ?? []) ids.push(character.id); }
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);
for (const id of ids) {
  const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, exporterPath), '--character', id, '--kind', 'character_reference'], { cwd: root, encoding: 'utf8', maxBuffer: 112 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterFeatureScaleProportionLodFidelityRequired !== true) fail(`${id}: LOD fidelity flag missing`);
  for (const field of ['unknownLodMayBeInventedByImageModel','lodMayEnlargeEyesForReadability','lodMayDeleteIdentityFaceLandmark','lodMayBeautifyJawOrChin','lodMayChangeHeadBodyRatio','lodMayLengthenLegs','lodMaySlimBodyCategory','lodMayDeAgeCharacter','lodMayShrinkMobilityEquipment','lodMayMascotifyAnimal','lodMayHumanizeRobot','premiumAssetMayBeautifyProportionAutomatically','generatedLodTreatmentCreatesCanon']) if (output[field] !== false) fail(`${id}: LOD guard weakened: ${field}`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: LOD authority chain missing`);
  if (!output.prompt?.includes('FEATURE SCALE / PROPORTION / LOD FIDELITY — FINAL PROPORTION LOCK.')) fail(`${id}: LOD prompt block missing`);
}
console.log(`[feature-scale-proportion-lod] OK: ${ids.length}/36 production prompts validated through ${exporterPath}`);
