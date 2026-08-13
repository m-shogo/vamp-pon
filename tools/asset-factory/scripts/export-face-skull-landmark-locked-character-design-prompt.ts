import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-hair-grooming-locked-character-design-prompt.ts';
const POLICY_PATH = 'data/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.json';
const AUTHORITY_PATH = 'docs/visual/all-character-face-skull-landmark-construction-fidelity-master-v1.md';
const BODY_POLICY_PATH = 'data/visual/all-character-body-mass-posture-construction-fidelity-master-v1.json';
const BODY_AUTHORITY_PATH = 'docs/visual/all-character-body-mass-posture-construction-fidelity-master-v1.md';
const GARMENT_FIT_POLICY_PATH = 'data/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.json';
const GARMENT_FIT_AUTHORITY_PATH = 'docs/visual/all-character-garment-body-fit-tension-compression-fidelity-master-v1.md';
const GARMENT_CONSTRUCTION_POLICY_PATH = 'data/visual/all-character-garment-pattern-seam-closure-load-fidelity-master-v1.json';
const GARMENT_CONSTRUCTION_AUTHORITY_PATH = 'docs/visual/all-character-garment-pattern-seam-closure-load-fidelity-master-v1.md';
const GARMENT_MATERIAL_POLICY_PATH = 'data/visual/all-character-garment-material-drape-fold-memory-fidelity-master-v1.json';
const GARMENT_MATERIAL_AUTHORITY_PATH = 'docs/visual/all-character-garment-material-drape-fold-memory-fidelity-master-v1.md';

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
const bodyPolicy = JSON.parse(readFileSync(resolve(process.cwd(), BODY_POLICY_PATH), 'utf8'));
const bodyAuthority = readFileSync(resolve(process.cwd(), BODY_AUTHORITY_PATH), 'utf8');
const garmentFitPolicy = JSON.parse(readFileSync(resolve(process.cwd(), GARMENT_FIT_POLICY_PATH), 'utf8'));
const garmentFitAuthority = readFileSync(resolve(process.cwd(), GARMENT_FIT_AUTHORITY_PATH), 'utf8');
const garmentConstructionPolicy = JSON.parse(readFileSync(resolve(process.cwd(), GARMENT_CONSTRUCTION_POLICY_PATH), 'utf8'));
const garmentConstructionAuthority = readFileSync(resolve(process.cwd(), GARMENT_CONSTRUCTION_AUTHORITY_PATH), 'utf8');
const garmentMaterialPolicy = JSON.parse(readFileSync(resolve(process.cwd(), GARMENT_MATERIAL_POLICY_PATH), 'utf8'));
const garmentMaterialAuthority = readFileSync(resolve(process.cwd(), GARMENT_MATERIAL_AUTHORITY_PATH), 'utf8');
if (policy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('face/skull landmark authority status invalid');
if (policy.scopeCount !== 36 || policy.assetKindCount !== 9 || policy.production?.requiredForCandidateGeneration !== true) throw new Error('face/skull landmark scope weakened');
if (bodyPolicy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('body/mass/posture authority status invalid');
if (bodyPolicy.scopeCount !== 36 || bodyPolicy.assetKindCount !== 9 || bodyPolicy.production?.requiredForCandidateGeneration !== true) throw new Error('body/mass/posture scope weakened');
if (garmentFitPolicy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('garment/body fit authority status invalid');
if (garmentFitPolicy.scopeCount !== 36 || garmentFitPolicy.assetKindCount !== 9 || garmentFitPolicy.production?.requiredForCandidateGeneration !== true) throw new Error('garment/body fit scope weakened');
if (garmentConstructionPolicy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('garment construction authority status invalid');
if (garmentConstructionPolicy.scopeCount !== 36 || garmentConstructionPolicy.assetKindCount !== 9 || garmentConstructionPolicy.production?.requiredForCandidateGeneration !== true) throw new Error('garment construction scope weakened');
if (garmentMaterialPolicy.status !== 'CURRENT_PRODUCTION_VISUAL_AUTHORITY') throw new Error('garment material mechanics authority status invalid');
if (garmentMaterialPolicy.scopeCount !== 36 || garmentMaterialPolicy.assetKindCount !== 9 || garmentMaterialPolicy.production?.requiredForCandidateGeneration !== true) throw new Error('garment material mechanics scope weakened');

const stdout = execFileSync(process.execPath, [
  '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
  '--character', options.characterId,
  '--kind', options.kind,
], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 176 * 1024 * 1024 });
const base = JSON.parse(stdout);
if (base.productionImageGenerationEntrypoint !== true || base.productionCharacterPromptReady !== true || base.productionPromptAuthorityLocked !== true) throw new Error(`${options.characterId}: lower production chain not ready`);
if (base.allCharacterHairGroomingConstructionFidelityRequired !== true) throw new Error(`${options.characterId}: hair/grooming chain missing`);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 39),
  generatedBy: 'tools/asset-factory/scripts/export-face-skull-landmark-locked-character-design-prompt.ts',
  allCharacterFaceSkullLandmarkConstructionFidelityRequired: true,
  unknownFaceGeometryMayBeInventedByImageModel: policy.rules?.unknownFaceGeometryMayBeInventedByImageModel,
  viewpointMayRedesignCraniofacialLandmarks: policy.rules?.viewpointMayRedesignCraniofacialLandmarks,
  expressionMayRedesignSkullGeometry: policy.rules?.expressionMayRedesignSkullGeometry,
  premiumMayBeautifyFaceRatios: policy.rules?.premiumMayBeautifyFaceRatios,
  premiumMayIncreaseEyeSize: policy.rules?.premiumMayIncreaseEyeSize,
  premiumMayNarrowJaw: policy.rules?.premiumMayNarrowJaw,
  premiumMaySharpenChin: policy.rules?.premiumMaySharpenChin,
  premiumMayShrinkNose: policy.rules?.premiumMayShrinkNose,
  lodMayConvergeToGenericFace: policy.rules?.lodMayConvergeToGenericFace,
  chibiMayConvergeToGenericFace: policy.rules?.chibiMayConvergeToGenericFace,
  spriteMayConvergeToGenericFace: policy.rules?.spriteMayConvergeToGenericFace,
  stateMayChangeBaselineFaceWithoutTransformationAuthority: policy.rules?.stateMayChangeBaselineFaceWithoutTransformationAuthority,
  lightingMayHideFaceMismatch: policy.rules?.lightingMayHideFaceMismatch,
  hairMayHideFaceMismatch: policy.rules?.hairMayHideFaceMismatch,
  cropMayHideFaceMismatch: policy.rules?.cropMayHideFaceMismatch,
  effectsMayHideFaceMismatch: policy.rules?.effectsMayHideFaceMismatch,
  identityTraitsMayBeGuessedFromFacialStereotype: policy.rules?.identityTraitsMayBeGuessedFromFacialStereotype,
  generatedFaceTreatmentCreatesCanon: policy.rules?.generatedFaceTreatmentCreatesCanon,
  faceConstructionAxes: policy.constructionAxes,
  faceLandmarkPreservationPriority: policy.preservationPriority,
  faceSkullPolicyPath: POLICY_PATH,
  faceSkullAuthorityPath: AUTHORITY_PATH,
  allCharacterBodyMassPostureConstructionFidelityRequired: true,
  unknownBodyGeometryMayBeInventedByImageModel: bodyPolicy.rules?.unknownBodyGeometryMayBeInventedByImageModel,
  premiumMayBeautifyBodyProportions: bodyPolicy.rules?.premiumMayBeautifyBodyProportions,
  premiumMayLengthenLegs: bodyPolicy.rules?.premiumMayLengthenLegs,
  premiumMayNarrowWaist: bodyPolicy.rules?.premiumMayNarrowWaist,
  premiumMaySlimBodyCategory: bodyPolicy.rules?.premiumMaySlimBodyCategory,
  premiumMayIncreaseMuscularity: bodyPolicy.rules?.premiumMayIncreaseMuscularity,
  viewpointMayRedesignBodyProportions: bodyPolicy.rules?.viewpointMayRedesignBodyProportions,
  perspectiveMayChangeBodyCategory: bodyPolicy.rules?.perspectiveMayChangeBodyCategory,
  poseMayChangeBaselineBodyConstruction: bodyPolicy.rules?.poseMayChangeBaselineBodyConstruction,
  lightingMaySlimAuthorizedBodyMass: bodyPolicy.rules?.lightingMaySlimAuthorizedBodyMass,
  surfaceMayInventMusculature: bodyPolicy.rules?.surfaceMayInventMusculature,
  clothingMayImplyUnsupportedBodyShape: bodyPolicy.rules?.clothingMayImplyUnsupportedBodyShape,
  wetClothingMayIncreaseBodySexualization: bodyPolicy.rules?.wetClothingMayIncreaseBodySexualization,
  damageMayRevealUnsupportedAnatomy: bodyPolicy.rules?.damageMayRevealUnsupportedAnatomy,
  lodMayConvergeToGenericBody: bodyPolicy.rules?.lodMayConvergeToGenericBody,
  chibiMayConvergeToGenericBody: bodyPolicy.rules?.chibiMayConvergeToGenericBody,
  spriteMayConvergeToGenericBody: bodyPolicy.rules?.spriteMayConvergeToGenericBody,
  cropMayHideBodyMismatch: bodyPolicy.rules?.cropMayHideBodyMismatch,
  effectsMayHideBodyMismatch: bodyPolicy.rules?.effectsMayHideBodyMismatch,
  hairMayHideShoulderMismatch: bodyPolicy.rules?.hairMayHideShoulderMismatch,
  mobilityEquipmentMayBeRescaledForBodyBeautification: bodyPolicy.rules?.mobilityEquipmentMayBeRescaledForBodyBeautification,
  identityTraitsMayBeGuessedFromBodyStereotype: bodyPolicy.rules?.identityTraitsMayBeGuessedFromBodyStereotype,
  generatedBodyTreatmentCreatesCanon: bodyPolicy.rules?.generatedBodyTreatmentCreatesCanon,
  bodyConstructionAxes: bodyPolicy.constructionAxes,
  bodyPreservationPriority: bodyPolicy.preservationPriority,
  bodyMassPosturePolicyPath: BODY_POLICY_PATH,
  bodyMassPostureAuthorityPath: BODY_AUTHORITY_PATH,
  allCharacterGarmentBodyFitTensionCompressionFidelityRequired: true,
  unknownGarmentFitMayBeInventedByImageModel: garmentFitPolicy.rules?.unknownGarmentFitMayBeInventedByImageModel,
  garmentMayRedesignAuthorizedBody: garmentFitPolicy.rules?.garmentMayRedesignAuthorizedBody,
  looseGarmentMayImplyThinnerBody: garmentFitPolicy.rules?.looseGarmentMayImplyThinnerBody,
  tightGarmentMayInventUnsupportedAnatomy: garmentFitPolicy.rules?.tightGarmentMayInventUnsupportedAnatomy,
  premiumMayIncreaseBodyCling: garmentFitPolicy.rules?.premiumMayIncreaseBodyCling,
  premiumMaySuppressWaist: garmentFitPolicy.rules?.premiumMaySuppressWaist,
  premiumMayIncreaseExposureForFit: garmentFitPolicy.rules?.premiumMayIncreaseExposureForFit,
  poseMayChangeGarmentConstruction: garmentFitPolicy.rules?.poseMayChangeGarmentConstruction,
  seatedPoseMaySlimBodyForClearance: garmentFitPolicy.rules?.seatedPoseMaySlimBodyForClearance,
  crouchMaySlimBodyForOverlap: garmentFitPolicy.rules?.crouchMaySlimBodyForOverlap,
  wetnessMayIncreaseAnatomicalRevelation: garmentFitPolicy.rules?.wetnessMayIncreaseAnatomicalRevelation,
  damageMayChangeFitOrExposureWithoutAuthority: garmentFitPolicy.rules?.damageMayChangeFitOrExposureWithoutAuthority,
  foldsMayInventMusculature: garmentFitPolicy.rules?.foldsMayInventMusculature,
  strapsMayReshapeBodyBeyondLocalizedPressure: garmentFitPolicy.rules?.strapsMayReshapeBodyBeyondLocalizedPressure,
  beltsMayManufactureNarrowerWaist: garmentFitPolicy.rules?.beltsMayManufactureNarrowerWaist,
  layersMayEraseAuthorizedBodyMass: garmentFitPolicy.rules?.layersMayEraseAuthorizedBodyMass,
  mobilityEquipmentMayBeHiddenToSimplifyFit: garmentFitPolicy.rules?.mobilityEquipmentMayBeHiddenToSimplifyFit,
  wheelchairContactMayBeIgnored: garmentFitPolicy.rules?.wheelchairContactMayBeIgnored,
  assistiveDeviceClearanceMayBeIgnored: garmentFitPolicy.rules?.assistiveDeviceClearanceMayBeIgnored,
  lodMayConvergeToGenericSlimFit: garmentFitPolicy.rules?.lodMayConvergeToGenericSlimFit,
  chibiMayConvergeToGenericSlimFit: garmentFitPolicy.rules?.chibiMayConvergeToGenericSlimFit,
  spriteMayConvergeToGenericSlimFit: garmentFitPolicy.rules?.spriteMayConvergeToGenericSlimFit,
  identityTraitsMayBeGuessedFromFitStereotype: garmentFitPolicy.rules?.identityTraitsMayBeGuessedFromFitStereotype,
  generatedGarmentFitCreatesCanon: garmentFitPolicy.rules?.generatedGarmentFitCreatesCanon,
  garmentFitConstructionAxes: garmentFitPolicy.constructionAxes,
  garmentFitPreservationPriority: garmentFitPolicy.preservationPriority,
  garmentBodyFitPolicyPath: GARMENT_FIT_POLICY_PATH,
  garmentBodyFitAuthorityPath: GARMENT_FIT_AUTHORITY_PATH,
  allCharacterGarmentPatternSeamClosureLoadFidelityRequired: true,
  unknownGarmentConstructionMayBeInventedByImageModel: garmentConstructionPolicy.rules?.unknownGarmentConstructionMayBeInventedByImageModel,
  viewpointMayRedesignPatternTopology: garmentConstructionPolicy.rules?.viewpointMayRedesignPatternTopology,
  viewpointMayMoveSeams: garmentConstructionPolicy.rules?.viewpointMayMoveSeams,
  viewpointMayMoveClosures: garmentConstructionPolicy.rules?.viewpointMayMoveClosures,
  viewpointMayMovePockets: garmentConstructionPolicy.rules?.viewpointMayMovePockets,
  premiumMayAddConstructionComplexity: garmentConstructionPolicy.rules?.premiumMayAddConstructionComplexity,
  premiumMayAddDecorativeSeams: garmentConstructionPolicy.rules?.premiumMayAddDecorativeSeams,
  premiumMayAddCorsetryOrHarness: garmentConstructionPolicy.rules?.premiumMayAddCorsetryOrHarness,
  constructionMayIncreaseExposure: garmentConstructionPolicy.rules?.constructionMayIncreaseExposure,
  constructionMayRedesignAuthorizedBody: garmentConstructionPolicy.rules?.constructionMayRedesignAuthorizedBody,
  motionMayChangeGarmentTopology: garmentConstructionPolicy.rules?.motionMayChangeGarmentTopology,
  poseMayInventGussetVentOrSlit: garmentConstructionPolicy.rules?.poseMayInventGussetVentOrSlit,
  closureMayOpenToSolveFit: garmentConstructionPolicy.rules?.closureMayOpenToSolveFit,
  closureMayOpenToIncreaseExposure: garmentConstructionPolicy.rules?.closureMayOpenToIncreaseExposure,
  seamMayBeUsedForBodyBeautification: garmentConstructionPolicy.rules?.seamMayBeUsedForBodyBeautification,
  dartMayInventUnsupportedAnatomy: garmentConstructionPolicy.rules?.dartMayInventUnsupportedAnatomy,
  pocketMayMigrateForComposition: garmentConstructionPolicy.rules?.pocketMayMigrateForComposition,
  loadPathMayTerminateWithoutAnchor: garmentConstructionPolicy.rules?.loadPathMayTerminateWithoutAnchor,
  materialMayIgnoreConstructionLimits: garmentConstructionPolicy.rules?.materialMayIgnoreConstructionLimits,
  mobilityEquipmentContactMayBeIgnored: garmentConstructionPolicy.rules?.mobilityEquipmentContactMayBeIgnored,
  assistiveClearanceMayBeSolvedByInventedOpening: garmentConstructionPolicy.rules?.assistiveClearanceMayBeSolvedByInventedOpening,
  lodMayConvergeToGenericGarmentTopology: garmentConstructionPolicy.rules?.lodMayConvergeToGenericGarmentTopology,
  chibiMayConvergeToGenericGarmentTopology: garmentConstructionPolicy.rules?.chibiMayConvergeToGenericGarmentTopology,
  spriteMayConvergeToGenericGarmentTopology: garmentConstructionPolicy.rules?.spriteMayConvergeToGenericGarmentTopology,
  generatedGarmentConstructionCreatesCanon: garmentConstructionPolicy.rules?.generatedGarmentConstructionCreatesCanon,
  garmentConstructionAxes: garmentConstructionPolicy.constructionAxes,
  garmentConstructionPreservationPriority: garmentConstructionPolicy.preservationPriority,
  garmentConstructionPolicyPath: GARMENT_CONSTRUCTION_POLICY_PATH,
  garmentConstructionAuthorityPath: GARMENT_CONSTRUCTION_AUTHORITY_PATH,
  allCharacterGarmentMaterialDrapeFoldMemoryFidelityRequired: true,
  unknownMaterialMechanicsMayBeInventedByImageModel: garmentMaterialPolicy.rules?.unknownMaterialMechanicsMayBeInventedByImageModel,
  viewpointMayResetMaterialMechanics: garmentMaterialPolicy.rules?.viewpointMayResetMaterialMechanics,
  viewpointMayChangeThicknessFamily: garmentMaterialPolicy.rules?.viewpointMayChangeThicknessFamily,
  premiumMayChangeMaterialClass: garmentMaterialPolicy.rules?.premiumMayChangeMaterialClass,
  premiumMayIncreaseCling: garmentMaterialPolicy.rules?.premiumMayIncreaseCling,
  premiumMayIncreaseGloss: garmentMaterialPolicy.rules?.premiumMayIncreaseGloss,
  premiumMayEraseWrinkleHistory: garmentMaterialPolicy.rules?.premiumMayEraseWrinkleHistory,
  premiumMayIncreaseTransparency: garmentMaterialPolicy.rules?.premiumMayIncreaseTransparency,
  wetnessMayRevealUnsupportedAnatomy: garmentMaterialPolicy.rules?.wetnessMayRevealUnsupportedAnatomy,
  wetnessMayUniversalizeGloss: garmentMaterialPolicy.rules?.wetnessMayUniversalizeGloss,
  windMayRedesignGarmentTopology: garmentMaterialPolicy.rules?.windMayRedesignGarmentTopology,
  windMayBreakClosureAnchors: garmentMaterialPolicy.rules?.windMayBreakClosureAnchors,
  motionMayResetFoldMemory: garmentMaterialPolicy.rules?.motionMayResetFoldMemory,
  foldsMayInventBodyGeometry: garmentMaterialPolicy.rules?.foldsMayInventBodyGeometry,
  lightingMayEraseLayerBulk: garmentMaterialPolicy.rules?.lightingMayEraseLayerBulk,
  lightingMayReplaceMaterialMechanics: garmentMaterialPolicy.rules?.lightingMayReplaceMaterialMechanics,
  seatContactMayBeIgnored: garmentMaterialPolicy.rules?.seatContactMayBeIgnored,
  wheelchairContactMayBeIgnoredForDrape: garmentMaterialPolicy.rules?.wheelchairContactMayBeIgnoredForDrape,
  assistiveEquipmentContactMayBeIgnoredForDrape: garmentMaterialPolicy.rules?.assistiveEquipmentContactMayBeIgnoredForDrape,
  layerThicknessMayCollapseForCleanSilhouette: garmentMaterialPolicy.rules?.layerThicknessMayCollapseForCleanSilhouette,
  pocketLoadMayIgnoreMaterialResponse: garmentMaterialPolicy.rules?.pocketLoadMayIgnoreMaterialResponse,
  strapLoadMayIgnoreMaterialResponse: garmentMaterialPolicy.rules?.strapLoadMayIgnoreMaterialResponse,
  lodMayFlattenMaterialClassDifferences: garmentMaterialPolicy.rules?.lodMayFlattenMaterialClassDifferences,
  chibiMayFlattenMaterialClassDifferences: garmentMaterialPolicy.rules?.chibiMayFlattenMaterialClassDifferences,
  spriteMayFlattenMaterialClassDifferences: garmentMaterialPolicy.rules?.spriteMayFlattenMaterialClassDifferences,
  generatedMaterialMechanicsCreatesCanon: garmentMaterialPolicy.rules?.generatedMaterialMechanicsCreatesCanon,
  garmentMaterialMechanicsAxes: garmentMaterialPolicy.mechanicsAxes,
  garmentMaterialPreservationPriority: garmentMaterialPolicy.preservationPriority,
  garmentMaterialPolicyPath: GARMENT_MATERIAL_POLICY_PATH,
  garmentMaterialAuthorityPath: GARMENT_MATERIAL_AUTHORITY_PATH,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
};

for (const field of [
  'unknownFaceGeometryMayBeInventedByImageModel', 'viewpointMayRedesignCraniofacialLandmarks', 'expressionMayRedesignSkullGeometry',
  'premiumMayBeautifyFaceRatios', 'premiumMayIncreaseEyeSize', 'premiumMayNarrowJaw', 'premiumMaySharpenChin', 'premiumMayShrinkNose',
  'lodMayConvergeToGenericFace', 'chibiMayConvergeToGenericFace', 'spriteMayConvergeToGenericFace',
  'stateMayChangeBaselineFaceWithoutTransformationAuthority', 'lightingMayHideFaceMismatch', 'hairMayHideFaceMismatch',
  'cropMayHideFaceMismatch', 'effectsMayHideFaceMismatch', 'identityTraitsMayBeGuessedFromFacialStereotype', 'generatedFaceTreatmentCreatesCanon',
  'unknownBodyGeometryMayBeInventedByImageModel', 'premiumMayBeautifyBodyProportions', 'premiumMayLengthenLegs', 'premiumMayNarrowWaist',
  'premiumMaySlimBodyCategory', 'premiumMayIncreaseMuscularity', 'viewpointMayRedesignBodyProportions', 'perspectiveMayChangeBodyCategory',
  'poseMayChangeBaselineBodyConstruction', 'lightingMaySlimAuthorizedBodyMass', 'surfaceMayInventMusculature', 'clothingMayImplyUnsupportedBodyShape',
  'wetClothingMayIncreaseBodySexualization', 'damageMayRevealUnsupportedAnatomy', 'lodMayConvergeToGenericBody', 'chibiMayConvergeToGenericBody',
  'spriteMayConvergeToGenericBody', 'cropMayHideBodyMismatch', 'effectsMayHideBodyMismatch', 'hairMayHideShoulderMismatch',
  'mobilityEquipmentMayBeRescaledForBodyBeautification', 'identityTraitsMayBeGuessedFromBodyStereotype', 'generatedBodyTreatmentCreatesCanon',
  'unknownGarmentFitMayBeInventedByImageModel', 'garmentMayRedesignAuthorizedBody', 'looseGarmentMayImplyThinnerBody',
  'tightGarmentMayInventUnsupportedAnatomy', 'premiumMayIncreaseBodyCling', 'premiumMaySuppressWaist', 'premiumMayIncreaseExposureForFit',
  'poseMayChangeGarmentConstruction', 'seatedPoseMaySlimBodyForClearance', 'crouchMaySlimBodyForOverlap',
  'wetnessMayIncreaseAnatomicalRevelation', 'damageMayChangeFitOrExposureWithoutAuthority', 'foldsMayInventMusculature',
  'strapsMayReshapeBodyBeyondLocalizedPressure', 'beltsMayManufactureNarrowerWaist', 'layersMayEraseAuthorizedBodyMass',
  'mobilityEquipmentMayBeHiddenToSimplifyFit', 'wheelchairContactMayBeIgnored', 'assistiveDeviceClearanceMayBeIgnored',
  'lodMayConvergeToGenericSlimFit', 'chibiMayConvergeToGenericSlimFit', 'spriteMayConvergeToGenericSlimFit',
  'identityTraitsMayBeGuessedFromFitStereotype', 'generatedGarmentFitCreatesCanon',
  'unknownGarmentConstructionMayBeInventedByImageModel', 'viewpointMayRedesignPatternTopology', 'viewpointMayMoveSeams',
  'viewpointMayMoveClosures', 'viewpointMayMovePockets', 'premiumMayAddConstructionComplexity', 'premiumMayAddDecorativeSeams',
  'premiumMayAddCorsetryOrHarness', 'constructionMayIncreaseExposure', 'constructionMayRedesignAuthorizedBody',
  'motionMayChangeGarmentTopology', 'poseMayInventGussetVentOrSlit', 'closureMayOpenToSolveFit', 'closureMayOpenToIncreaseExposure',
  'seamMayBeUsedForBodyBeautification', 'dartMayInventUnsupportedAnatomy', 'pocketMayMigrateForComposition',
  'loadPathMayTerminateWithoutAnchor', 'materialMayIgnoreConstructionLimits', 'mobilityEquipmentContactMayBeIgnored',
  'assistiveClearanceMayBeSolvedByInventedOpening', 'lodMayConvergeToGenericGarmentTopology',
  'chibiMayConvergeToGenericGarmentTopology', 'spriteMayConvergeToGenericGarmentTopology', 'generatedGarmentConstructionCreatesCanon',
  'unknownMaterialMechanicsMayBeInventedByImageModel', 'viewpointMayResetMaterialMechanics', 'viewpointMayChangeThicknessFamily',
  'premiumMayChangeMaterialClass', 'premiumMayIncreaseCling', 'premiumMayIncreaseGloss', 'premiumMayEraseWrinkleHistory',
  'premiumMayIncreaseTransparency', 'wetnessMayRevealUnsupportedAnatomy', 'wetnessMayUniversalizeGloss',
  'windMayRedesignGarmentTopology', 'windMayBreakClosureAnchors', 'motionMayResetFoldMemory', 'foldsMayInventBodyGeometry',
  'lightingMayEraseLayerBulk', 'lightingMayReplaceMaterialMechanics', 'seatContactMayBeIgnored',
  'wheelchairContactMayBeIgnoredForDrape', 'assistiveEquipmentContactMayBeIgnoredForDrape',
  'layerThicknessMayCollapseForCleanSilhouette', 'pocketLoadMayIgnoreMaterialResponse', 'strapLoadMayIgnoreMaterialResponse',
  'lodMayFlattenMaterialClassDifferences', 'chibiMayFlattenMaterialClassDifferences', 'spriteMayFlattenMaterialClassDifferences',
  'generatedMaterialMechanicsCreatesCanon',
]) {
  if (result[field] !== false) throw new Error(`${options.characterId}: identity construction guard weakened: ${field}`);
}

const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
for (const path of [AUTHORITY_PATH, POLICY_PATH, BODY_AUTHORITY_PATH, BODY_POLICY_PATH, GARMENT_FIT_AUTHORITY_PATH, GARMENT_FIT_POLICY_PATH, GARMENT_CONSTRUCTION_AUTHORITY_PATH, GARMENT_CONSTRUCTION_POLICY_PATH, GARMENT_MATERIAL_AUTHORITY_PATH, GARMENT_MATERIAL_POLICY_PATH]) if (!authorityOrder.includes(path)) authorityOrder.push(path);

const faceBlock = [
  'FACE / SKULL LANDMARK CONSTRUCTION FIDELITY — FINAL CRANIOFACIAL IDENTITY LOCK.',
  `Authority: ${AUTHORITY_PATH}.`, `Machine policy: ${POLICY_PATH}.`,
  'Treat the face as one three-dimensional craniofacial construction, not a generic attractive anime-face base. Preserve face-height/width family, forehead/temple proportion, inter-eye spacing and axis, brow family, nose root/bridge/projection, cheekbone and soft-tissue volume, mouth width, jaw angle, chin geometry, ear placement, authorized asymmetry and age-bearing structural cues.',
  'Unknown facial geometry uses SOURCE_CONSTRAINED_IDENTITY_NEUTRAL_FACE_COMPLETION. Do not enlarge eyes, shrink nose, narrow jaw, sharpen chin, smooth age, symmetrize, stereotype identity traits, or hide mismatch behind hair, crop, shadow, glow, hands, props or effects.',
  'LOD/chibi/sprite may remove micro-detail but may not converge characters onto one giant-eye/tiny-nose/pointed-chin face base. Generated facial geometry remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  authority,
].join('\n');
const bodyBlock = [
  'BODY / MASS DISTRIBUTION / POSTURE CONSTRUCTION FIDELITY — FINAL EMBODIED IDENTITY LOCK.',
  `Authority: ${BODY_AUTHORITY_PATH}.`, `Machine policy: ${BODY_POLICY_PATH}.`,
  'Treat the body as one authored mass-and-proportion construction with a habitual center of gravity, not as a generic attractive body hidden beneath clothing. Preserve stature family, head/body ratio, neck, shoulder/ribcage/pelvis relationship, torso/limb proportion, hand/foot scale, soft-tissue distribution, age-bearing body cues, posture, weight-bearing habit, seated/crouched compression, and mobility-equipment clearance.',
  'Unknown body geometry uses SOURCE_CONSTRAINED_EMBODIED_NEUTRAL_COMPLETION. Do not lengthen legs, narrow waist, slim body category, add muscles, shrink hands/feet, adultize children, de-age adults, normalize broad/soft/plus-size bodies, or hide mismatch with crop, coat, hair, shadow, effects, perspective or pose.',
  'Clothing, wetness, damage, premium rendering, state variants, LOD, chibi and sprite treatment may not redesign the baseline body. Generated body geometry remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  bodyAuthority,
].join('\n');
const garmentFitBlock = [
  'GARMENT-TO-BODY FIT / TENSION / COMPRESSION FIDELITY — FINAL CLOTH-BODY MECHANICS LOCK.',
  `Authority: ${GARMENT_FIT_AUTHORITY_PATH}.`, `Machine policy: ${GARMENT_FIT_POLICY_PATH}.`,
  'Garment fit follows the authorized body rather than replacing it. Resolve cloth as constructed material with authored seams, closures, grain, weight, stretch limits, ease, layering allowance, movement clearance and localized pressure. Preserve the same body underneath loose, close, layered, seated, crouched and moving clothing.',
  'Unknown fit uses SOURCE_CONSTRAINED_MECHANICALLY_PLAUSIBLE_FIT_COMPLETION. Do not tailor every character toward a slim fashion body, manufacture a narrow waist with belts or folds, invent anatomy through tight cloth, hide body mismatch beneath oversized clothing, increase body cling or exposure for premium art, or use wetness/damage as anatomical revelation.',
  'Every tension line needs a load path; every compression zone needs a contact cause. Seated and wheelchair cloth must preserve body mass, seat/back contact, layer thickness and assistive-equipment clearance. LOD/chibi/sprite remove secondary folds before fit identity. Generated fit remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  garmentFitAuthority,
].join('\n');
const garmentConstructionBlock = [
  'GARMENT PATTERN / SEAM / CLOSURE / LOAD FIDELITY — FINAL CONSTRUCTION TOPOLOGY LOCK.',
  `Authority: ${GARMENT_CONSTRUCTION_AUTHORITY_PATH}.`, `Machine policy: ${GARMENT_CONSTRUCTION_POLICY_PATH}.`,
  'Resolve every garment as one mechanically coherent pattern-and-assembly system. Preserve major pattern pieces, seam routes, darts/pleats/gathers only where authorized, closure type and route, pocket volume, strap/buckle anchors, layer order, material edge finishing and load transfer across all viewpoints and poses.',
  'Unknown construction uses SOURCE_CONSTRAINED_MINIMUM_MECHANICALLY_VALID_GARMENT_COMPLETION. Do not invent decorative seams, corsetry, harnesses, zippers, buckles, lacing, darts, vents, slits, gussets, cutouts or premium paneling. A seam is construction, a closure requires a receiving side and termination, and every load path requires an anchor.',
  'Motion redistributes load but does not change garment topology. Never open closures, raise hems, widen necklines, roll sleeves, add slits/vents/cutouts or remove layers to solve fit, clipping or exposure. LOD/chibi/sprite remove stitch micro-detail before major topology. Generated construction remains CANDIDATE_REVIEW_REQUIRED and never creates canon.',
  garmentConstructionAuthority,
].join('\n');
const garmentMaterialBlock = [
  'GARMENT MATERIAL / DRAPE / FOLD MEMORY FIDELITY — FINAL CLOTH PHYSICS LOCK.',
  `Authority: ${GARMENT_MATERIAL_AUTHORITY_PATH}.`, `Machine policy: ${GARMENT_MATERIAL_POLICY_PATH}.`,
  'Preserve material mechanics as part of garment identity: finite thickness, layer bulk, bending stiffness, fold radius, stretch/recovery, compression, friction, seam bulk, gravity drape, inertia, crease memory, wet response, wind response, seat contact and load deformation. Surface rendering must describe these mechanics rather than replace them.',
  'Unknown mechanics use SOURCE_CONSTRAINED_NEUTRAL_MATERIAL_MECHANICS_COMPLETION. Do not default every garment to thin silk, satin gloss, weightless flutter, rigid cardboard, random micro-wrinkles or factory-flat cloth. Premium status may not increase cling/gloss/transparency/wind lift or erase wrinkle history.',
  'Wetness may change weight and local cling only within material authority and may never reveal unsupported anatomy. Wind follows mass/stiffness/anchors. Viewpoint and motion do not reset material mechanics or fold memory. LOD/chibi/sprite remove micro-wrinkles before thickness/stiffness/material identity. Generated mechanics remain CANDIDATE_REVIEW_REQUIRED and never create canon.',
  garmentMaterialAuthority,
].join('\n');

result.authorityOrder = authorityOrder;
result.prompt = `${base.prompt}\n\n${faceBlock}\n\n${bodyBlock}\n\n${garmentFitBlock}\n\n${garmentConstructionBlock}\n\n${garmentMaterialBlock}`;
result.reviewChecklist = [
  '髪色・髪型・服・アクセ・照明を外しても顔だけで本人差が残る',
  'front/3-4/profileが同一のskull/nose/jaw/chinを説明している',
  'premium化でeye enlargement/nose shrink/jaw narrow/chin sharpenをしない',
  'age/body category/cheek soft-tissueをgeneric美形へ正規化しない',
  '肩幅・ribcage・pelvis・torso/limb比率・hand/foot scaleを本人の構造として保持する',
  'plus-size/broad/soft/child/older bodyを細身・長脚・若年・athleticへ正規化しない',
  '立位・座位・crouchでcenter of gravityとmass compressionが同じ人物を説明している',
  'mobility equipmentを身体美化や構図のため縮小・除去しない',
  'clothing/crop/hair/shadow/effectsでbody mismatchを隠さない',
  '服のease/clearanceがauthorized bodyとgarment constructionの両方に整合する',
  'loose clothingで細身を捏造せず、tight clothingで未承認anatomyを捏造しない',
  'fold/tension/compressionはgravity/contact/motion/closureの因果を持つ',
  'belt/strap/harnessは局所圧力だけを作りbody categoryを再設計しない',
  '座位・wheelchairでbody mass/seat contact/layer thickness/clearanceを保持する',
  'premium化でbody cling/waist suppression/exposureを増やさない',
  'pattern pieces/seam routes/closure routes/pocketsがviewごとに移動しない',
  'visible seamは実際のjoin/shaping/attachment/repairの仕事を持つ',
  'zipper/button/buckle/lacing/drawcordはreceiving side/termination/anchor/channelを持つ',
  'motion/poseでgusset/vent/slit/cutout/extra closureを後付けしない',
  'construction問題をexposure増加やlayer削除で解決しない',
  'premium化でcorsetry/harness/extra seams/zippers/bucklesを増やさない',
  'thickness/layer bulk/seam bulkが有限でconstructionと一致する',
  'fold radius/densityがmaterial stiffnessとload causeに一致する',
  'viewpoint/motionでmaterial mechanicsやcrease memoryをresetしない',
  'wetness/windがmaterial authorityに従いexposureを増やさない',
  'seat/wheelchair/equipment contactでclothが浮かず、layer bulkを保持する',
  'premium化でsilk cling/satin gloss/transparency/wind lift/wrinkle removalを自動追加しない',
  'LOD/chibi/spriteではmicro-wrinkleを先に落としthickness/stiffness/material identityを保持する',
  ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
];

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
