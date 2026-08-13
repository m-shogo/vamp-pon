import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-long-wear-comfort-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-fastener-operational-access-serviceability-fidelity-master-v1.md';
const ENTRYPOINT_POLICY_PATH = 'data/visual/character-production-generation-entrypoint-v4.json';
const ENTRYPOINT_AUTHORITY_PATH = 'docs/visual/character-production-generation-entrypoint-v4.md';

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
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('operational access authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('operational access scope weakened');
if (entrypointPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || entrypointPolicy.scopeCount !== 36) throw new Error('production entrypoint v4 invalid');
if (entrypointPolicy.productionExporter !== 'tools/asset-factory/scripts/export-operational-access-locked-character-design-prompt.ts' || entrypointPolicy.wrappedExporter !== BASE_EXPORTER) throw new Error('production entrypoint v4 wrapper mismatch');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 400 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
for (const required of [
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
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 42),
  generatedBy: 'tools/asset-factory/scripts/export-operational-access-locked-character-design-prompt.ts',
  allCharacterFastenerOperationalAccessServiceabilityFidelityRequired: true,
  operationalAccessAxes: policy.operationalAxes,
  operationalAccessPreservationPriority: policy.preservationPriority,
  operationalAccessPolicyPath: POLICY_PATH,
  operationalAccessAuthorityPath: AUTHORITY_PATH,
  productionEntrypointPolicyPath: ENTRYPOINT_POLICY_PATH,
  productionEntrypointAuthorityPath: ENTRYPOINT_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const [field, expected] of Object.entries(policy.rules ?? {})) {
  result[field] = expected;
  if (expected !== false || result[field] !== false) throw new Error(`${options.characterId}: operational access guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, ENTRYPOINT_AUTHORITY_PATH, ENTRYPOINT_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);
result.authorityOrder = authorityOrder;

const operationalBlock = [
  'FASTENER / OPERATIONAL ACCESS / SERVICEABILITY FIDELITY — FINAL USABILITY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Existing closures, pockets, straps and service points must have finite, reachable, operable geometry. Preserve grip/pinch surfaces, control travel, receiving structures, reach envelopes, hand/finger/wrist clearance, layer/glove interference, seated and wheelchair geometry, pocket retrieval paths, strap adjustment, inspection and replacement access.',
  'Unknown details use SOURCE_CONSTRAINED_NEUTRAL_OPERATIONAL_ACCESS_COMPLETION. Do not resize hands/body, lengthen arms, move closures or pockets, remove equipment, invent handedness/dexterity limits/helper use, add adaptive grips/magnetic or quick-release hardware, enlarge pocket openings, rescale stored objects, or invent service panels and removable parts.',
  'Premium may not add decorative functional clutter, tiny jeweled clasps, inaccessible rear fasteners or controls too small to operate. LOD/chibi/sprite simplify rendering but preserve functional topology. Generated operation/service methods remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  authority,
  entrypointAuthority,
].join('\n');

result.prompt = `${base.prompt}\n\n${operationalBlock}`;
result.reviewChecklist = [
  'functional closure/controlがfinite grip geometryとreceiving structureを持つ',
  'reachの都合でarm/body/hand/equipmentを変形・縮小しない',
  'closure/pocket位置を操作性のため移動しない',
  'handedness/dexterity/helper/adaptive mechanismを未設定から推測しない',
  'authorized glove/layer/hair/seat/wheelchair interferenceを無視しない',
  'pocket openingがintended hand/object scaleとretrieval pathに整合する',
  'strap/buckle adjustmentがtail/clearance/load pathを持つ',
  'serviceabilityのためhidden panel/screw/modular partを勝手に追加しない',
  'premium化でunusable micro-controls/decorative fastener clutterを増やさない',
  'LOD/chibi/spriteでもfunctional topologyを保持する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
