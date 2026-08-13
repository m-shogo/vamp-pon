import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const policyPath = 'data/visual/all-character-detail-density-ornament-budget-fidelity-master-v1.json';
const authorityPath = 'docs/visual/all-character-detail-density-ornament-budget-fidelity-master-v1.md';
const productionPolicyPath = 'data/visual/character-production-generation-entrypoint-v1.json';
const profilePaths = ['data/visual/core5-living-visual-profiles-v1.json','data/visual/current21-extended-living-visual-profiles-v1.json','data/visual/future15-living-visual-profiles-v1.json'];
const fail = (m: string): never => { throw new Error(`[detail-density-ornament] ${m}`); };
const policy = JSON.parse(readFileSync(resolve(root, policyPath), 'utf8'));
const authority = readFileSync(resolve(root, authorityPath), 'utf8');
const productionPolicy = JSON.parse(readFileSync(resolve(root, productionPolicyPath), 'utf8'));
const exporterPath = productionPolicy.productionExporter;
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') fail('status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9) fail('scope must remain 36/9');
if (policy.production?.requiredForCandidateGeneration !== true || policy.production?.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail('production/candidate boundary weakened');
if ((policy.informationDensityInvariants ?? []).length < 24) fail('24 detail-density invariants required');
if ((policy.detailPriority ?? []).length < 10) fail('10 detail priorities required');
if ((policy.forbiddenShortcuts ?? []).length < 30) fail('30+ forbidden shortcuts required');
if (policy.unknownDetailDefault !== 'MINIMUM_SUFFICIENT_AUTHORIZED_DETAIL') fail('unknown detail default weakened');
for (const [field, value] of Object.entries(policy.rules ?? {})) if (value !== false) fail(`rule must remain false: ${field}`);
for (const [field, value] of Object.entries(policy.defaultBudgets ?? {})) if (value !== 0) fail(`unsupported default budget must remain zero: ${field}`);
if (!authority.includes('CANDIDATE_REVIEW_REQUIRED') || !authority.includes('MINIMUM_SUFFICIENT_AUTHORIZED_DETAIL')) fail('authority boundary/default missing');
if (typeof exporterPath !== 'string' || !exporterPath.startsWith('tools/asset-factory/scripts/export-')) fail('production exporter invalid');
if (productionPolicy.finalWrapperRequiredFlags?.allCharacterDetailDensityOrnamentBudgetFidelityRequired !== true) fail('production detail-density requirement missing');
for (const path of [authorityPath, policyPath]) if (!productionPolicy.requiredAuthorityPaths?.includes(path)) fail(`required authority path missing: ${path}`);
const ids: string[] = [];
for (const path of profilePaths) { const json = JSON.parse(readFileSync(resolve(root, path), 'utf8')); for (const character of json.characters ?? []) ids.push(character.id); }
if (ids.length !== 36 || new Set(ids).size !== 36) fail(`expected 36 unique ids, got ${ids.length}/${new Set(ids).size}`);
for (const id of ids) {
  const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, exporterPath), '--character', id, '--kind', 'character_reference'], { cwd: root, encoding: 'utf8', maxBuffer: 112 * 1024 * 1024 });
  const output = JSON.parse(stdout);
  if (output.allCharacterDetailDensityOrnamentBudgetFidelityRequired !== true) fail(`${id}: detail-density flag missing`);
  for (const field of ['unknownDetailMayBeInventedByImageModel','premiumAssetMayIncreaseOrnamentCountAutomatically','highResolutionMayInventMicroDecoration','importanceMayIncreaseOrnamentDensity','rarityMayIncreaseOrnamentDensity','ornamentMayCompensateForWeakIdentity','ornamentMayAlterExposurePolicy','ornamentMayAlterBodyModificationPolicy','worldMotifMayBeRepeatedAsFiller','generatedOrnamentCreatesCanon']) if (output[field] !== false) fail(`${id}: ornament guard weakened: ${field}`);
  for (const [field, value] of Object.entries(output.detailOrnamentDefaultBudgets ?? {})) if (value !== 0) fail(`${id}: unsupported budget must remain zero: ${field}`);
  if (output.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') fail(`${id}: candidate boundary weakened`);
  if (!output.authorityOrder?.includes(authorityPath) || !output.authorityOrder?.includes(policyPath)) fail(`${id}: detail authority chain missing`);
  if (!output.prompt?.includes('DETAIL DENSITY / ORNAMENT BUDGET FIDELITY — FINAL INFORMATION-DENSITY LOCK.')) fail(`${id}: detail prompt block missing`);
}
console.log(`[detail-density-ornament] OK: ${ids.length}/36 production prompts validated through ${exporterPath}`);
