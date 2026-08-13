import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-dressing-workflow-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-garment-long-wear-comfort-fidelity-master-v1.md';
const ENTRYPOINT_POLICY_PATH = 'data/visual/character-production-generation-entrypoint-v3.json';
const ENTRYPOINT_AUTHORITY_PATH = 'docs/visual/character-production-generation-entrypoint-v3.md';

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
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('long-wear comfort authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('long-wear comfort scope weakened');
if (entrypointPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || entrypointPolicy.scopeCount !== 36) throw new Error('production entrypoint v3 invalid');
if (entrypointPolicy.productionExporter !== 'tools/asset-factory/scripts/export-long-wear-comfort-locked-character-design-prompt.ts' || entrypointPolicy.wrappedExporter !== BASE_EXPORTER) throw new Error('production entrypoint v3 wrapper mismatch');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 320 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
for (const required of [
  'allCharacterGarmentDonDoffDressingWorkflowFidelityRequired',
  'allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired',
  'allCharacterGarmentPatternSeamClosureLoadFidelityRequired',
  'allCharacterGarmentBodyFitTensionCompressionFidelityRequired',
  'allCharacterBodyMassPostureConstructionFidelityRequired',
  'allCharacterFaceSkullLandmarkConstructionFidelityRequired',
]) if (base[required] !== true) throw new Error(`${options.characterId}: inherited chain missing: ${required}`);

const result: Record<string, any> = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 41),
  generatedBy: 'tools/asset-factory/scripts/export-long-wear-comfort-locked-character-design-prompt.ts',
  allCharacterGarmentLongWearComfortFidelityRequired: true,
  longWearComfortAxes: policy.comfortAxes,
  longWearComfortPreservationPriority: policy.preservationPriority,
  longWearComfortPolicyPath: POLICY_PATH,
  longWearComfortAuthorityPath: AUTHORITY_PATH,
  productionEntrypointPolicyPath: ENTRYPOINT_POLICY_PATH,
  productionEntrypointAuthorityPath: ENTRYPOINT_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const [field, expected] of Object.entries(policy.rules ?? {})) {
  result[field] = expected;
  if (expected !== false || result[field] !== false) throw new Error(`${options.characterId}: long-wear comfort guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, ENTRYPOINT_AUTHORITY_PATH, ENTRYPOINT_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);
result.authorityOrder = authorityOrder;

const comfortBlock = [
  'GARMENT COMFORT / PRESSURE / CHAFING / THERMAL / LONG-WEAR FIDELITY — FINAL LIVED-USE LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Treat long-wear behavior as a physical consequence of authorized body, mobility, garment construction, material, fit, layering, dressing workflow and scene environment. Preserve real pressure/contact from collars, seams, waistbands, cuffs, straps, hardware, footwear, seats, wheelchair geometry and carried loads; preserve finite layer bulk, friction, heat retention, ventilation and moisture response.',
  'Unknown comfort behavior uses SOURCE_CONSTRAINED_NEUTRAL_LONG_WEAR_COMFORT_COMPLETION. Do not resize the body, float straps/hardware, invent padding/liners/compression wear/orthopedic support/vents/cutouts, infer pain or medical/sensory/thermal traits, invent disability accommodation, or turn ordinary adjustment into personality behavior.',
  'Wetness may change friction and thermal response but may not sexualize or reveal unsupported anatomy. Premium art may not increase compression, heels, exposure or zero-bulk tailoring. LOD/chibi/sprite preserve major load-bearing contact, footwear/equipment scale and seated mobility contact. Generated long-wear behavior remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
  entrypointAuthority,
].join('\n');

result.prompt = `${base.prompt}\n\n${comfortBlock}`;
result.reviewChecklist = [
  'pressure/contactはclosure/strap/seat/layer/footwearなど実在するload sourceを持つ',
  'comfortの都合でbody mass・footwear・mobility equipmentを縮小しない',
  'chafing riskをinjury/scar/bandageへ勝手に昇格しない',
  'medical/sensory/pain/thermal sensitivityやaccommodationを服から推測しない',
  'thermal/moisture behaviorがcoverage/layer/material/environmentと一致する',
  'seat/wheelchair/prosthetic/orthotic/assistive contactを美化のため消さない',
  'premium化でcompression/high heel/exposure/zero-bulk layerを追加しない',
  'ordinary readjustmentをcharacter habitやrelationship evidenceへ昇格しない',
  'LOD/chibi/spriteでもmajor load-bearing contactとfootwear/equipment scaleを保持する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
