import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-personal-grooming-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-footwear-ground-interface-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-footwear-ground-interface-fidelity-master-v1.md';
const ENTRYPOINT_POLICY_PATH = 'data/visual/character-production-generation-entrypoint-v9.json';
const ENTRYPOINT_AUTHORITY_PATH = 'docs/visual/character-production-generation-entrypoint-v9.md';

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

if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('footwear ground-interface authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('footwear ground-interface scope weakened');
if (entrypointPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || entrypointPolicy.scopeCount !== 36) throw new Error('production entrypoint v9 invalid');
if (entrypointPolicy.productionExporter !== 'tools/asset-factory/scripts/export-footwear-ground-interface-locked-character-design-prompt.ts' || entrypointPolicy.wrappedExporter !== BASE_EXPORTER) throw new Error('production entrypoint v9 wrapper mismatch');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 960 * 1024 * 1024 });
const base = JSON.parse(stdout);

if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
for (const required of [
  'allCharacterPersonalGroomingCosmeticsFidelityRequired',
  'allCharacterSkinCoverageExposureBoundaryFidelityRequired',
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
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 47),
  generatedBy: 'tools/asset-factory/scripts/export-footwear-ground-interface-locked-character-design-prompt.ts',
  allCharacterFootwearGroundInterfaceFidelityRequired: true,
  footwearGroundInterfaceAxes: policy.footwearAxes,
  footwearGroundInterfacePreservationPriority: policy.preservationPriority,
  footwearGroundInterfacePolicyPath: POLICY_PATH,
  footwearGroundInterfaceAuthorityPath: AUTHORITY_PATH,
  productionEntrypointPolicyPath: ENTRYPOINT_POLICY_PATH,
  productionEntrypointAuthorityPath: ENTRYPOINT_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const [field, expected] of Object.entries(policy.rules ?? {})) {
  result[field] = expected;
  if (expected !== false || result[field] !== false) throw new Error(`${options.characterId}: footwear ground-interface guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, ENTRYPOINT_AUTHORITY_PATH, ENTRYPOINT_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);
result.authorityOrder = authorityOrder;

const block = [
  'FOOTWEAR / SOLE / GROUND-INTERFACE FIDELITY — FINAL FOOT-GROUND CONSTRUCTION LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Preserve source-backed footwear or barefoot states as functional body-ground interfaces. Keep the authorized foot scale, internal toe-box/instep/heel volume, upper construction, closure route, sole and heel geometry, tread family, flex behavior, ground-contact patch and mobility-equipment clearance coherent across viewpoints, motion and asset kinds.',
  'Unknown footwear uses SOURCE_CONSTRAINED_MINIMUM_FUNCTIONAL_FOOTWEAR_COMPLETION. Do not shrink feet, narrow forefeet, slim ankles, add heels/platforms/hidden lifts, invent zippers/elastic/straps/tread/orthotic support, replace barefoot states, change footwear class for action/weather, or hide foot-shoe mismatch with crop/shadow.',
  'Premium may improve material/construction clarity but may not raise heels, narrow toe boxes, thin soles, add gold/gems/straps/glow/patent gloss or erase wear history. LOD/chibi/sprite preserve footwear existence/absence, class, scale, sole/heel family, major closure and ground orientation before micro-detail. Generated footwear construction remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
  entrypointAuthority,
].join('\n');

result.prompt = `${base.prompt}\n\n${block}`;
result.reviewChecklist = [
  'footwear/barefoot stateがsource-backedでありasset/view/stateで勝手に変化しない',
  'authorized foot scaleをtoe-box/instep/bootへ合わせるため縮小・細身化しない',
  'sole/heel/tread/closure/shaft geometryがviewpointで変化しない',
  'standing/walking/running/crouchでsame footwear classとground-contact logicを保持する',
  'wheelchair footplateやmobility equipmentとのclearance/contactを無視しない',
  'weather/seasonを理由に別footwearへ差し替えない',
  'barefootへanklet/toe ring/nail polishを勝手に追加しない',
  'premium化でheel/gold/gem/strap/glow/patent gloss/foot beautificationを追加しない',
  'LOD/chibi/spriteでもexistence/class/scale/sole/heel/closureを保持する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
