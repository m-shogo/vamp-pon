import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-accessory-prop-inventory-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-skin-coverage-exposure-boundary-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-skin-coverage-exposure-boundary-fidelity-master-v1.md';
const ENTRYPOINT_POLICY_PATH = 'data/visual/character-production-generation-entrypoint-v7.json';
const ENTRYPOINT_AUTHORITY_PATH = 'docs/visual/character-production-generation-entrypoint-v7.md';

type Options = { characterId: string; kind: string };
function parseArgs(args: string[]): Options {
  let characterId = '';
  let kind = 'character_reference';
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') { characterId = args[++i] ?? ''; continue; }
    if (arg === '--kind') { kind = args[++i] ?? ''; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!characterId) throw new Error('--character is required');
  return { characterId, kind };
}

const options = parseArgs(process.argv.slice(2));
const policy = JSON.parse(readFileSync(resolve(process.cwd(), POLICY_PATH), 'utf8'));
const authority = readFileSync(resolve(process.cwd(), AUTHORITY_PATH), 'utf8');
const entrypointPolicy = JSON.parse(readFileSync(resolve(process.cwd(), ENTRYPOINT_POLICY_PATH), 'utf8'));
const entrypointAuthority = readFileSync(resolve(process.cwd(), ENTRYPOINT_AUTHORITY_PATH), 'utf8');
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('skin coverage authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('skin coverage scope weakened');
if (entrypointPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || entrypointPolicy.scopeCount !== 36) throw new Error('production entrypoint v7 invalid');
if (entrypointPolicy.productionExporter !== 'tools/asset-factory/scripts/export-skin-coverage-locked-character-design-prompt.ts' || entrypointPolicy.wrappedExporter !== BASE_EXPORTER) throw new Error('production entrypoint v7 wrapper mismatch');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 660 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
for (const required of [
  'allCharacterAccessoryPropInventoryTransitionFidelityRequired',
  'allCharacterBodyAdornmentMarkingTopologyFidelityRequired',
  'allCharacterFastenerOperationalAccessServiceabilityFidelityRequired',
  'allCharacterGarmentLongWearComfortFidelityRequired',
  'allCharacterGarmentDonDoffDressingWorkflowFidelityRequired',
  'allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired',
  'allCharacterGarmentPatternSeamClosureLoadFidelityRequired',
  'allCharacterGarmentBodyFitTensionCompressionFidelityRequired',
  'allCharacterBodyMassPostureConstructionFidelityRequired',
  'allCharacterFaceSkullLandmarkConstructionFidelityRequired',
]) if (base[required] !== true) throw new Error(`${options.characterId}: inherited chain missing: ${required}`);

const result: Record<string, any> = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 45),
  generatedBy: 'tools/asset-factory/scripts/export-skin-coverage-locked-character-design-prompt.ts',
  allCharacterSkinCoverageExposureBoundaryFidelityRequired: true,
  skinCoverageAxes: policy.coverageAxes,
  skinCoveragePreservationPriority: policy.preservationPriority,
  skinCoveragePolicyPath: POLICY_PATH,
  skinCoverageAuthorityPath: AUTHORITY_PATH,
  productionEntrypointPolicyPath: ENTRYPOINT_POLICY_PATH,
  productionEntrypointAuthorityPath: ENTRYPOINT_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};
for (const [field, expected] of Object.entries(policy.rules ?? {})) {
  result[field] = expected;
  if (expected !== false || result[field] !== false) throw new Error(`${options.characterId}: skin coverage guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, ENTRYPOINT_AUTHORITY_PATH, ENTRYPOINT_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);
result.authorityOrder = authorityOrder;

const block = [
  'SKIN COVERAGE / EXPOSURE BOUNDARY FIDELITY — FINAL AUTHORED COVERAGE LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Preserve source-backed skin coverage and source-backed exposure equally. Treat neckline, collar, armhole, sleeve, back, waist, hem, slit, leg coverage, underlayers and seated coverage as garment topology rather than an attractiveness dial. Pose, viewpoint, motion, weather, wetness, damage and rendering may not create a new exposure boundary.',
  'Unknown coverage uses SOURCE_CONSTRAINED_BASELINE_COVERAGE_PRESERVATION. Do not deepen/open/shorten/lift garments for premium, battle, heat or composition. Do not invent undershirts, shorts, leggings, stockings, scarves, gloves, panels or other coverage to solve uncertainty. Do not infer modesty, sexuality, culture/religion, trauma or body confidence from coverage.',
  'Child and young-character exposure must never be sexualized or adultized. State variants change coverage only through explicit delta. LOD/chibi/sprite preserve major opening, layer and coverage topology before micro-detail. Generated exposure or added coverage remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
  entrypointAuthority,
].join('\n');
result.prompt = `${base.prompt}\n\n${block}`;
result.reviewChecklist = [
  'source-backed coverageとsource-backed exposureを同じ重さで保持する',
  'neckline/armhole/sleeve/back/waist/hem/slit/leg coverageをviewpointやposeで変更しない',
  'premium/battle/weather/wetness/damageを露出増加の根拠にしない',
  'uncertainty解消のためunderlayer/scarf/glove/panel等を追加しない',
  'seated/wheelchairでもhip/seat/waist/thigh coverageを保持する',
  'coverageからmodesty/sexuality/culture/trauma/body confidenceを推測しない',
  'child/young characterをpremium/wetness/damageでsexualizeしない',
  'stateはexplicit delta以外baseline coverageを継承する',
  'LOD/chibi/spriteでもmajor coverage topologyを保持する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
