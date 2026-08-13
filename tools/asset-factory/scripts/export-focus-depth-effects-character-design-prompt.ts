import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-production-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-focus-depth-effects-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-focus-depth-effects-fidelity-master-v1.md';

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
  if (!kind) throw new Error('--kind is required');
  return { characterId, kind };
}

const options = parseArgs(process.argv.slice(2));
const policy = JSON.parse(readFileSync(resolve(process.cwd(), POLICY_PATH), 'utf8'));
const authority = readFileSync(resolve(process.cwd(), AUTHORITY_PATH), 'utf8');
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('focus/depth/effects authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('focus/depth/effects scope weakened');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 48 * 1024 * 1024 });
const base = JSON.parse(stdout);

if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) {
  throw new Error(`${options.characterId}: lower production chain not ready`);
}
if (base.generatedOutputState !== 'CANDIDATE_REVIEW_REQUIRED') throw new Error(`${options.characterId}: candidate boundary weakened`);

const effective = {
  ...base,
  allCharacterFocusDepthEffectsFidelityRequired: true,
  unknownFocusMayBeInventedByImageModel: policy.rules?.unknownFocusMayBeInventedByImageModel,
  focusMayRedesignCharacter: policy.rules?.focusMayRedesignCharacter,
  effectsMayHideIdentityCriticalError: policy.rules?.effectsMayHideIdentityCriticalError,
  effectsMayInventAuraOrEmission: policy.rules?.effectsMayInventAuraOrEmission,
  effectsMayReplaceIdentityPalette: policy.rules?.effectsMayReplaceIdentityPalette,
  effectsMayHideMobilityEquipment: policy.rules?.effectsMayHideMobilityEquipment,
  premiumAssetMayIncreaseEffectDensityAutomatically: policy.rules?.premiumAssetMayIncreaseEffectDensityAutomatically,
  generatedEffectTreatmentCreatesCanon: policy.rules?.generatedEffectTreatmentCreatesCanon,
};

const expectedFalse = [
  'unknownFocusMayBeInventedByImageModel',
  'focusMayRedesignCharacter',
  'effectsMayHideIdentityCriticalError',
  'effectsMayInventAuraOrEmission',
  'effectsMayReplaceIdentityPalette',
  'effectsMayHideMobilityEquipment',
  'premiumAssetMayIncreaseEffectDensityAutomatically',
  'generatedEffectTreatmentCreatesCanon',
];
for (const field of expectedFalse) {
  if (effective[field] !== false) throw new Error(`${options.characterId}: focus/effects guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH]) {
  if (!authorityOrder.includes(path)) authorityOrder.push(path);
}

const focusBlock = [
  'FOCUS / DEPTH / EFFECTS FIDELITY — FINAL RENDERING LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Effects support design and may not replace readable identity, garment construction, hand/contact, prop relation, mobility equipment or world grounding.',
  'Unknown focus direction uses RESTRAINED_IDENTITY_PRESERVING_FOCUS. OPEN is not model freedom.',
  'Do not hide unresolved anatomy, clipping, grip, mobility, body-category or garment errors with blur, bloom, fog, ink, darkness, flare, glow, foreground particles or shallow depth of field.',
  'Do not invent aura, emission, neon outline, halo, bokeh signature or rarity-driven effect density.',
  'Reduce decorative effects before reducing identity evidence. Generated focus/effect treatments remain CANDIDATE_REVIEW_REQUIRED and do not create canon.',
  authority,
].join('\n');

const result = {
  ...effective,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 25),
  generatedBy: 'tools/asset-factory/scripts/export-focus-depth-effects-character-design-prompt.ts',
  focusDepthEffectsFidelityPolicyPath: POLICY_PATH,
  focusDepthEffectsFidelityAuthorityPath: AUTHORITY_PATH,
  productionImageGenerationEntrypoint: true,
  productionCharacterPromptReady: true,
  productionPromptAuthorityLocked: true,
  lowerExporterOutputIsProductionReady: false,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
  authorityOrder,
  prompt: `${base.prompt}\n\n${focusBlock}`,
  reviewChecklist: [
    '被写界深度・前景・発光・煙・墨・bloomでidentity-critical情報を隠さない',
    '顔だけをsharpにして体格・服構造・mobility equipmentをblurで消さない',
    '未承認のaura/emission/outline glowを追加しない',
    'effectより先にidentity・contact・prop・silhouetteを保持する',
    ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
  ],
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
