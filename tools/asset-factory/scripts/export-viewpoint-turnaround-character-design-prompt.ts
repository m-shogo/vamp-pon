import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-surface-tone-mapped-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-viewpoint-turnaround-back-design-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-viewpoint-turnaround-back-design-fidelity-master-v1.md';

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
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('viewpoint/turnaround authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('viewpoint/turnaround scope weakened');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 96 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterVariantDeltaStateTransformationFidelityRequired !== true) throw new Error(`${options.characterId}: variant delta chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 33),
  generatedBy: 'tools/asset-factory/scripts/export-viewpoint-turnaround-character-design-prompt.ts',
  allCharacterViewpointTurnaroundBackDesignFidelityRequired: true,
  unknownHiddenSurfaceMayBeInventedByImageModel: policy.rules?.unknownHiddenSurfaceMayBeInventedByImageModel,
  viewpointMayRedesignFace: policy.rules?.viewpointMayRedesignFace,
  viewpointMayChangeHairTopology: policy.rules?.viewpointMayChangeHairTopology,
  viewpointMayInventGarmentConstruction: policy.rules?.viewpointMayInventGarmentConstruction,
  viewpointMaySwapCanonicalAsymmetry: policy.rules?.viewpointMaySwapCanonicalAsymmetry,
  viewpointMayInventPocketOrStorage: policy.rules?.viewpointMayInventPocketOrStorage,
  viewpointMayInventExposure: policy.rules?.viewpointMayInventExposure,
  viewpointMayInventBodyModification: policy.rules?.viewpointMayInventBodyModification,
  viewpointMayMovePropForComposition: policy.rules?.viewpointMayMovePropForComposition,
  viewpointMaySimplifyMobilityEquipment: policy.rules?.viewpointMaySimplifyMobilityEquipment,
  premiumViewMayAddRearOrnament: policy.rules?.premiumViewMayAddRearOrnament,
  generatedHiddenSurfaceCreatesCanon: policy.rules?.generatedHiddenSurfaceCreatesCanon,
  viewpointTurnaroundContinuityPriority: policy.continuityPriority,
  viewpointAllowedNeutralCompletionClasses: policy.allowedNeutralCompletionClasses,
  viewpointTurnaroundPolicyPath: POLICY_PATH,
  viewpointTurnaroundAuthorityPath: AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const field of [
  'unknownHiddenSurfaceMayBeInventedByImageModel',
  'viewpointMayRedesignFace',
  'viewpointMayChangeHairTopology',
  'viewpointMayInventGarmentConstruction',
  'viewpointMaySwapCanonicalAsymmetry',
  'viewpointMayInventPocketOrStorage',
  'viewpointMayInventExposure',
  'viewpointMayInventBodyModification',
  'viewpointMayMovePropForComposition',
  'viewpointMaySimplifyMobilityEquipment',
  'premiumViewMayAddRearOrnament',
  'generatedHiddenSurfaceCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: viewpoint/turnaround guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

const turnaroundBlock = [
  'VIEWPOINT / TURNAROUND / BACK-DESIGN FIDELITY — FINAL TOPOLOGY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Every camera view reveals the same authorized character topology. Front, profile, 3/4, rear and high/low views must preserve face/skull volume, hair route, body proportions, garment panels, closures, layer order, canonical asymmetry, storage, props, mobility-equipment geometry, repairs and material transitions.',
  'Unknown hidden surfaces use SOURCE_CONSTRAINED_NEUTRAL_COMPLETION. Complete only mechanically necessary continuations already required by stronger authority; do not invent ornament, pockets, cutouts, markings, props, emblems, relationship evidence or state details.',
  'Camera mirroring may not swap canonical left/right design. Generated hidden-surface completion remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${turnaroundBlock}`;
result.reviewChecklist = [
  '正面・3/4・横・背面で同一の顔/頭蓋ボリュームと髪ルートを保つ',
  '服のpanel/seam/closure/layer orderを視点ごとに作り直さない',
  '左右非対称・prop位置・bag/strap/pocket/storage位置をcamera mirrorで反転Canon化しない',
  '背面の空白をbelt/gem/emblem/cutout/glow等で埋めない',
  '車椅子等mobility equipmentの寸法・接触・clearanceを全視点で一致させる',
  '未確定hidden surfaceはSOURCE_CONSTRAINED_NEUTRAL_COMPLETIONに留める',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
