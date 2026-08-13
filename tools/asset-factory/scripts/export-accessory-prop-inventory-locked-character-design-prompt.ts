import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-body-adornment-topology-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-accessory-prop-inventory-transition-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-accessory-prop-inventory-transition-fidelity-master-v1.md';
const ENTRYPOINT_POLICY_PATH = 'data/visual/character-production-generation-entrypoint-v6.json';
const ENTRYPOINT_AUTHORITY_PATH = 'docs/visual/character-production-generation-entrypoint-v6.md';

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
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('accessory prop inventory authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('accessory prop inventory scope weakened');
if (entrypointPolicy.status !== 'TOP_LEVEL_PRODUCTION_IMAGE_GENERATION_ENTRYPOINT' || entrypointPolicy.scopeCount !== 36) throw new Error('production entrypoint v6 invalid');
if (entrypointPolicy.productionExporter !== 'tools/asset-factory/scripts/export-accessory-prop-inventory-locked-character-design-prompt.ts' || entrypointPolicy.wrappedExporter !== BASE_EXPORTER) throw new Error('production entrypoint v6 wrapper mismatch');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 560 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
for (const required of [
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
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 44),
  generatedBy: 'tools/asset-factory/scripts/export-accessory-prop-inventory-locked-character-design-prompt.ts',
  allCharacterAccessoryPropInventoryTransitionFidelityRequired: true,
  accessoryPropInventoryAxes: policy.inventoryAxes,
  accessoryPropInventoryPreservationPriority: policy.preservationPriority,
  accessoryPropInventoryPolicyPath: POLICY_PATH,
  accessoryPropInventoryAuthorityPath: AUTHORITY_PATH,
  productionEntrypointPolicyPath: ENTRYPOINT_POLICY_PATH,
  productionEntrypointAuthorityPath: ENTRYPOINT_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};
for (const [field, expected] of Object.entries(policy.rules ?? {})) {
  result[field] = expected;
  if (expected !== false || result[field] !== false) throw new Error(`${options.characterId}: accessory prop inventory guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, ENTRYPOINT_AUTHORITY_PATH, ENTRYPOINT_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);
result.authorityOrder = authorityOrder;

const block = [
  'ACCESSORY / PROP INVENTORY / STATE-TRANSITION FIDELITY — FINAL DISCRETE OBJECT IDENTITY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Preserve only source-backed removable accessories and props as discrete object identities with authoritative count, pair/single logic, attachment or storage location, worn/held/stored/placed state and mechanically plausible retrieval/return transitions. One object remains one object across viewpoints and states.',
  'Unknown inventory uses SOURCE_CONSTRAINED_NO_INVENTION_ACCESSORY_INVENTORY_COMPLETION. Do not invent accessories, props, bags, pouches, eyewear, headwear, gloves, tools, cases, spares, gifts, matching relationship tokens or genre-standard equipment. Do not duplicate a held object in storage, mirror one-sided attachments, shrink objects to fit storage, enlarge storage to fit objects, or teleport objects between states.',
  'Premium may clarify existing inventory but may not increase count, add utility pouches, gold/gems/glow, relationship tokens or ornate replacement variants. LOD/chibi/sprite preserve existence, count, object identity, one-sided location and major state before micro-detail. Generated object state and inventory remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  authority,
  entrypointAuthority,
].join('\n');
result.prompt = `${base.prompt}\n\n${block}`;
result.reviewChecklist = [
  'removable accessory/propはsource-backed existence authorityを持つ',
  'inventory countとsingle/pair logicがasset/view/stateで変化しない',
  'held objectがstorageにもduplicateして残らない',
  'worn/held/stored/placed間でsame object identityを保持する',
  'storage opening/volume/retrieval pathがobject scaleと整合する',
  'one-sided pouch/case/strap等をviewpointでmirror/migrateしない',
  'relationship/gift/ownership meaningを生成物から推測しない',
  'premium化でextra accessory/prop/pouch/gem/glow/ornate variantを追加しない',
  'LOD/chibi/spriteでもexistence/count/location/object identityを保持する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
