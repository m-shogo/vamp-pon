import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-viewpoint-turnaround-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-hair-grooming-construction-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-hair-grooming-construction-fidelity-master-v1.md';

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
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('hair/grooming authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('hair/grooming scope weakened');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 112 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterViewpointTurnaroundBackDesignFidelityRequired !== true) throw new Error(`${options.characterId}: viewpoint/turnaround chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 34),
  generatedBy: 'tools/asset-factory/scripts/export-hair-grooming-locked-character-design-prompt.ts',
  allCharacterHairGroomingConstructionFidelityRequired: true,
  unknownHairMayBeInventedByImageModel: policy.rules?.unknownHairMayBeInventedByImageModel,
  viewpointMayChangeHairline: policy.rules?.viewpointMayChangeHairline,
  viewpointMayChangePart: policy.rules?.viewpointMayChangePart,
  viewpointMayChangeFringeTopology: policy.rules?.viewpointMayChangeFringeTopology,
  viewpointMayChangeEarExposure: policy.rules?.viewpointMayChangeEarExposure,
  viewpointMayChangeTieAnchor: policy.rules?.viewpointMayChangeTieAnchor,
  viewpointMayMirrorCanonicalHairAsymmetry: policy.rules?.viewpointMayMirrorCanonicalHairAsymmetry,
  premiumAssetMayBeautifyHairline: policy.rules?.premiumAssetMayBeautifyHairline,
  premiumAssetMayIncreaseHairOrnament: policy.rules?.premiumAssetMayIncreaseHairOrnament,
  premiumAssetMayChangeHairVolume: policy.rules?.premiumAssetMayChangeHairVolume,
  stateMayChangeHairstyleWithoutAuthorizedDelta: policy.rules?.stateMayChangeHairstyleWithoutAuthorizedDelta,
  weatherMayRedesignHairTopology: policy.rules?.weatherMayRedesignHairTopology,
  motionMayRedesignHairTopology: policy.rules?.motionMayRedesignHairTopology,
  wetHairMayIncreaseSexualization: policy.rules?.wetHairMayIncreaseSexualization,
  lodMayChangeIdentityHairTopology: policy.rules?.lodMayChangeIdentityHairTopology,
  hairMayHideMobilityEquipmentForComposition: policy.rules?.hairMayHideMobilityEquipmentForComposition,
  skinToneMayInferHairTextureOrCulturalStyle: policy.rules?.skinToneMayInferHairTextureOrCulturalStyle,
  generatedHairTreatmentCreatesCanon: policy.rules?.generatedHairTreatmentCreatesCanon,
  hairConstructionAxes: policy.constructionAxes,
  hairTopologyPreservationPriority: policy.topologyPreservationPriority,
  hairAllowedNeutralCompletionClasses: policy.allowedNeutralCompletionClasses,
  hairGroomingPolicyPath: POLICY_PATH,
  hairGroomingAuthorityPath: AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const field of [
  'unknownHairMayBeInventedByImageModel',
  'viewpointMayChangeHairline',
  'viewpointMayChangePart',
  'viewpointMayChangeFringeTopology',
  'viewpointMayChangeEarExposure',
  'viewpointMayChangeTieAnchor',
  'viewpointMayMirrorCanonicalHairAsymmetry',
  'premiumAssetMayBeautifyHairline',
  'premiumAssetMayIncreaseHairOrnament',
  'premiumAssetMayChangeHairVolume',
  'stateMayChangeHairstyleWithoutAuthorizedDelta',
  'weatherMayRedesignHairTopology',
  'motionMayRedesignHairTopology',
  'wetHairMayIncreaseSexualization',
  'lodMayChangeIdentityHairTopology',
  'hairMayHideMobilityEquipmentForComposition',
  'skinToneMayInferHairTextureOrCulturalStyle',
  'generatedHairTreatmentCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: hair/grooming guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

const hairBlock = [
  'HAIR / GROOMING CONSTRUCTION FIDELITY — FINAL HAIR TOPOLOGY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`,
  `Machine policy: ${POLICY_PATH}.`,
  'Treat hair as continuous scalp-attached topology with authored grooming behavior, not as a generic beauty layer. Preserve hairline, part, fringe mass, side-lock topology, ear exposure, rear mass, tied-section anchors, canonical asymmetry, fastener inventory, length landmarks and grooming family across view, state, weather, motion and LOD.',
  'Unknown hair uses SOURCE_CONSTRAINED_MINIMUM_GROOMING_COMPLETION. Complete only mechanically necessary continuations required by stronger authority. Do not invent bangs, ahoge, flyaways, ribbons, pins, gems, braids, extra ties, exposed ears, cultural styling, glamour wet-hair treatment, or premium ornaments.',
  'Weather and motion may displace existing masses but may not redesign their origin, attachment, tie topology or grooming decision. Generated hair and grooming treatments remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  authority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${hairBlock}`;
result.reviewChecklist = [
  'hairline/part/fringe/side-lock/ear exposure/rear mass/tie anchorを全視点で同一に保つ',
  'premium/rare/state/weather/actionを理由に髪型・毛量・髪飾りを変更しない',
  'camera mirrorでside ponytailやcanonical asymmetryを反転Canon化しない',
  'wet/wind/motionは既存hair massの一時変位に留め、topologyを作り直さない',
  'LODではmicro-strand detailを先に落とし、identity hair landmarksを保持する',
  'skin tone/age/gender/sexuality/ethnicityからhair textureや文化的styleを推測しない',
  '未確定hairはSOURCE_CONSTRAINED_MINIMUM_GROOMING_COMPLETIONに留める',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
