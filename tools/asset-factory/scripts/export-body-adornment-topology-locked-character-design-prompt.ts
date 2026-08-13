import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-operational-access-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-body-adornment-marking-topology-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-body-adornment-marking-topology-fidelity-master-v1.md';
const ENTRYPOINT_POLICY_PATH = 'data/visual/character-production-generation-entrypoint-v5.json';
const ENTRYPOINT_AUTHORITY_PATH = 'docs/visual/character-production-generation-entrypoint-v5.md';

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
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('body adornment topology authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('body adornment topology scope weakened');
if (entrypointPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || entrypointPolicy.scopeCount !== 36) throw new Error('production entrypoint v5 invalid');
if (entrypointPolicy.productionExporter !== 'tools/asset-factory/scripts/export-body-adornment-topology-locked-character-design-prompt.ts' || entrypointPolicy.wrappedExporter !== BASE_EXPORTER) throw new Error('production entrypoint v5 wrapper mismatch');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 480 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
for (const required of [
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
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 43),
  generatedBy: 'tools/asset-factory/scripts/export-body-adornment-topology-locked-character-design-prompt.ts',
  allCharacterBodyAdornmentMarkingTopologyFidelityRequired: true,
  bodyAdornmentTopologyAxes: policy.topologyAxes,
  bodyAdornmentPreservationPriority: policy.preservationPriority,
  bodyAdornmentPolicyPath: POLICY_PATH,
  bodyAdornmentAuthorityPath: AUTHORITY_PATH,
  productionEntrypointPolicyPath: ENTRYPOINT_POLICY_PATH,
  productionEntrypointAuthorityPath: ENTRYPOINT_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};
for (const [field, expected] of Object.entries(policy.rules ?? {})) {
  result[field] = expected;
  if (expected !== false || result[field] !== false) throw new Error(`${options.characterId}: body adornment guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, ENTRYPOINT_AUTHORITY_PATH, ENTRYPOINT_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);
result.authorityOrder = authorityOrder;

const block = [
  'BODY ADORNMENT / PIERCING / JEWELRY / SKIN-MARKING TOPOLOGY FIDELITY — FINAL BODY-ATTACHED IDENTITY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Preserve only source-backed body-attached features. Treat piercing sites, jewelry inventory, tattoo/ink coverage, scars, birthmarks and temporary markings as anatomical topology with explicit region, side, count, anchor, major geometry and coverage boundaries. Occlusion may hide a feature but may never relocate, mirror, duplicate or delete its topology.',
  'Unknown treatment uses SOURCE_CONSTRAINED_NO_INVENTION_BODY_ADORNMENT_COMPLETION. Do not invent piercing, jewelry, tattoo, scar, birthmark or body paint from attractiveness, role, gender presentation, sexuality, skin tone, ethnicity, personality, combat history, world setting, exposure, rarity or premium status. Generated damage never creates scars and exposed skin never creates permission for new markings.',
  'Premium may clarify source-backed features but may not add gems, gold chains, extra piercings, symmetric duplicates, glowing tattoos or magical scars. LOD/chibi/sprite preserve existence, anatomical region and canonical sidedness before micro-detail. Generated placement and hidden continuation remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  authority,
  entrypointAuthority,
].join('\n');
result.prompt = `${base.prompt}\n\n${block}`;
result.reviewChecklist = [
  'visible piercing/jewelry/tattoo/scar/birthmark/body-paintはsource authorityを持つ',
  '未指定body-attached featureをnegative spaceやrarity signalとして追加しない',
  'anatomical region/side/count/anchor/coverageをviewpointで変えない',
  'occlusionはhideのみでrelocate/mirror/duplicate/deleteしない',
  'generated damageやbattle contextからscarを新規作成しない',
  'exposure/wetness/high-resを新しいtattoo/markingの根拠にしない',
  'premium化でpiercing/jewelry count・gem・gold・glow・symmetryを増やさない',
  'LOD/chibi/spriteでもexistence/region/sidednessをmicro-detailより優先する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
