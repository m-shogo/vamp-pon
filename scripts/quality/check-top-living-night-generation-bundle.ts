import './check-loading-top-capture-failure-honesty.ts';
import './check-top-living-night-generation-authority-lock.ts';
import './check-top-living-night-final-approval-temporal-chain.ts';
import './check-top-living-night-readiness-summary.ts';
import './check-top-living-night-final-promotion-safety.ts';
import './check-top-living-night-static-review-registration.ts';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type Reference = { id: string; path: string; gitBlobSha1: string };
type ExecutionPhase = { phase: string; requires: string[]; parallel: string[] };
type Bundle = {
  schemaVersion: number;
  status: string;
  target: { path: string; width: number; height: number; format: string; foregroundHumanCount: number };
  core5: { referenceSetSha256: string; references: Reference[] };
  compositionReference: {
    path: string;
    sha256: string;
    role: string;
    generatorFacing: boolean;
    keep: string[];
    replace: string[];
  };
  preproductionModelInputs: {
    workflow: string;
    manifest: string;
    artifactPurpose: string;
    primaryComposition: string;
    primaryIdentityCutouts: string[];
    combinedConvenienceReference: string;
    layoutProof: { path: string; role: string; finalStyleAuthority: boolean };
    sanitizer: string;
    sanitizationPolicy: {
      rawBridgeUsedInsidePreproductionOnly: boolean;
      rawBridgeUploadedToModelArtifact: boolean;
      bridgeHumanLayersUsedAsAlphaAidOnly: boolean;
      bridgeHumanPixelsComposited: boolean;
      allowedNonHumanRestoreLayers: string[];
    };
    forbiddenModelInputs: string[];
    preproductionDoesNotApprove: boolean;
  };
  promptAuthority: string;
  identityAuthority: string;
  hardRules: {
    exactlyFiveForegroundHumans: boolean;
    requiredCharacterOrder: string[];
    sixthForegroundHumanAllowed: boolean;
    genericSubstituteAllowed: boolean;
    duplicateIdentityAllowed: boolean;
    bakedLogoAllowed: boolean;
    bakedUiAllowed: boolean;
    bakedTextAllowed: boolean;
    seasonalEventArtAllowed: boolean;
    motionVideoRequired: boolean;
  };
  safeAreas: {
    titleTopFraction: number[];
    primaryContentMiddleFraction: number[];
    buttonBottomFraction: number[];
    requiredCropTargets: string[];
  };
  registration: { script: string; registrationDoesNotApprove: boolean; resetsCandidateSensitiveEvidence: boolean };
  postGenerationExecutionPlan: ExecutionPhase[];
  requiredPostGenerationChecks: string[];
};

type ReferenceManifest = {
  schemaVersion: number;
  referenceCount: number;
  referenceSetSha256: string;
  references: Reference[];
};

const root = process.cwd();
const bundlePath = 'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json';
const manifestPath = 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json';
const bundle = JSON.parse(readFileSync(join(root, bundlePath), 'utf8')) as Bundle;
const manifest = JSON.parse(readFileSync(join(root, manifestPath), 'utf8')) as ReferenceManifest;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const canonicalCandidate =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const canonicalBridge =
  'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const bridgeSha =
  'aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d';
const ids = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];
const crops = ['360x800', '390x844', '430x932'];

invariant(bundle.schemaVersion === 1, 'TOP generation bundle schema mismatch');
invariant(bundle.status === 'GENERATION_READY_NOT_FINAL', 'TOP generation bundle must not claim final approval');
invariant(bundle.target.path === canonicalCandidate, 'TOP generation target path mismatch');
invariant(bundle.target.width === 430 && bundle.target.height === 932, 'TOP generation target must be 430x932');
invariant(bundle.target.format === 'png', 'TOP generation target format must remain PNG');
invariant(bundle.target.foregroundHumanCount === 5, 'TOP generation target must require exactly five foreground humans');
invariant(bundle.core5.referenceSetSha256 === manifest.referenceSetSha256, 'TOP generation bundle Core5 reference-set fingerprint is stale');
invariant(bundle.core5.references.length === 5 && manifest.referenceCount === 5, 'TOP generation bundle requires exactly five Core5 references');
invariant(JSON.stringify(bundle.core5.references) === JSON.stringify(manifest.references), 'TOP generation bundle Core5 references diverge from locked manifest');
invariant(JSON.stringify(bundle.core5.references.map(reference => reference.id)) === JSON.stringify(ids), 'TOP generation bundle Core5 order/set mismatch');

invariant(bundle.compositionReference.path === canonicalBridge, 'TOP generation composition reference path mismatch');
invariant(bundle.compositionReference.sha256 === bridgeSha, 'TOP generation composition reference SHA mismatch');
invariant(bundle.compositionReference.role === 'engineering-composition-history-only', 'TOP raw bridge must remain engineering-history only');
invariant(bundle.compositionReference.generatorFacing === false, 'TOP raw bridge must not be a generator-facing input');
invariant(bundle.compositionReference.keep.length >= 6, 'TOP generation bundle must preserve key bridge composition strengths');
invariant(bundle.compositionReference.replace.includes('generic human identities'), 'TOP generation bundle must replace generic bridge identities');
invariant(
  bundle.compositionReference.replace.includes('all bridge human identities rather than preserving any bridge person'),
  'TOP generation bundle must forbid inheriting any bridge human identity',
);
invariant(
  bundle.compositionReference.replace.includes('the elderly bridge man and every other non-Core5 foreground human'),
  'TOP generation bundle must explicitly remove the elderly bridge man and other non-Core5 humans',
);

const preproduction = bundle.preproductionModelInputs;
invariant(preproduction.workflow === '.github/workflows/top-art-preproduction.yml', 'TOP model-input workflow authority mismatch');
invariant(existsSync(join(root, preproduction.workflow)), 'TOP model-input workflow is missing');
invariant(preproduction.manifest === 'preproduction/manifest.json', 'TOP model-input artifact manifest path mismatch');
invariant(preproduction.primaryComposition === 'preproduction/core5-clean-composition-plate-v1.png', 'TOP primary model-facing composition must be the sanitized clean plate');
invariant(
  JSON.stringify(preproduction.primaryIdentityCutouts) === JSON.stringify(ids.map(id => `preproduction/core5-${id}-fullbody-cutout-v1.png`)),
  'TOP model-facing identity cutout set/order mismatch',
);
invariant(
  preproduction.combinedConvenienceReference === 'preproduction/core5-clean-generation-reference-pack-v1.png',
  'TOP combined clean model reference mismatch',
);
invariant(preproduction.layoutProof.path === 'preproduction/core5-layout-proof-v1.png', 'TOP layout proof artifact path mismatch');
invariant(preproduction.layoutProof.role === 'blocking-scale-depth-guide-only', 'TOP layout proof must remain blocking-only');
invariant(preproduction.layoutProof.finalStyleAuthority === false, 'TOP layout proof cannot become final-style authority');
invariant(preproduction.sanitizer === 'scripts/unity/sanitize-top-living-night-composition-plate.py', 'TOP sanitizer authority mismatch');
invariant(existsSync(join(root, preproduction.sanitizer)), 'TOP sanitizer authority is missing');
invariant(preproduction.sanitizationPolicy.rawBridgeUsedInsidePreproductionOnly === true, 'TOP raw bridge may only be used inside preproduction sanitization');
invariant(preproduction.sanitizationPolicy.rawBridgeUploadedToModelArtifact === false, 'TOP raw bridge must not be uploaded to model-facing artifact');
invariant(preproduction.sanitizationPolicy.bridgeHumanLayersUsedAsAlphaAidOnly === true, 'TOP bridge human layers must be alpha aids only');
invariant(preproduction.sanitizationPolicy.bridgeHumanPixelsComposited === false, 'TOP bridge human pixels must never be composited into model-facing references');
invariant(
  JSON.stringify(preproduction.sanitizationPolicy.allowedNonHumanRestoreLayers) ===
    JSON.stringify(['09-fire-base.png', '08-animal-robot.png', '14-foreground-accents.png']),
  'TOP sanitizer non-human restore allowlist mismatch',
);
for (const forbidden of [
  canonicalBridge,
  'docs/design-targets/generated/top-living-night-v2/layers/05-distant-companion.png',
  'docs/design-targets/generated/top-living-night-v2/layers/06-characters.png',
  'docs/design-targets/generated/top-living-night-v3/diagnostics/*',
  'development dashboards and status screenshots',
]) {
  invariant(preproduction.forbiddenModelInputs.includes(forbidden), `TOP generator-facing forbidden-input list lost: ${forbidden}`);
}
invariant(preproduction.preproductionDoesNotApprove === true, 'TOP preproduction inputs must never imply approval');

for (const authority of [bundle.promptAuthority, bundle.identityAuthority, bundle.registration.script]) {
  invariant(existsSync(join(root, authority)), `TOP generation authority is missing: ${authority}`);
}
for (const reference of bundle.core5.references) {
  invariant(existsSync(join(root, reference.path)), `TOP generation Core5 reference is missing: ${reference.path}`);
  invariant(/^[0-9a-f]{40}$/.test(reference.gitBlobSha1), `TOP generation Core5 blob SHA is invalid: ${reference.id}`);
}

invariant(bundle.hardRules.exactlyFiveForegroundHumans, 'TOP generation bundle must lock exact human count');
invariant(JSON.stringify(bundle.hardRules.requiredCharacterOrder) === JSON.stringify(ids), 'TOP generation bundle required character order/set mismatch');
for (const [name, allowed] of [
  ['sixthForegroundHumanAllowed', bundle.hardRules.sixthForegroundHumanAllowed],
  ['genericSubstituteAllowed', bundle.hardRules.genericSubstituteAllowed],
  ['duplicateIdentityAllowed', bundle.hardRules.duplicateIdentityAllowed],
  ['bakedLogoAllowed', bundle.hardRules.bakedLogoAllowed],
  ['bakedUiAllowed', bundle.hardRules.bakedUiAllowed],
  ['bakedTextAllowed', bundle.hardRules.bakedTextAllowed],
  ['seasonalEventArtAllowed', bundle.hardRules.seasonalEventArtAllowed],
  ['motionVideoRequired', bundle.hardRules.motionVideoRequired],
] as const) {
  invariant(!allowed, `TOP generation hard rule must remain false: ${name}`);
}

invariant(JSON.stringify(bundle.safeAreas.requiredCropTargets) === JSON.stringify(crops), 'TOP generation crop matrix mismatch');
invariant(bundle.safeAreas.titleTopFraction[0] === .18 && bundle.safeAreas.titleTopFraction[1] === .22, 'TOP title safe-area target mismatch');
invariant(bundle.safeAreas.buttonBottomFraction[0] === .20 && bundle.safeAreas.buttonBottomFraction[1] === .22, 'TOP button safe-area target mismatch');
invariant(bundle.registration.registrationDoesNotApprove, 'TOP image registration must never imply approval');
invariant(bundle.registration.resetsCandidateSensitiveEvidence, 'TOP image registration must reset stale downstream evidence');

const expectedExecutionPlan: ExecutionPhase[] = [
  {
    phase: 'candidate-static-and-unity',
    requires: ['final-candidate-registered'],
    parallel: ['core5-identity-review', 'three-crop-review', 'unity-v3-verification'],
  },
  {
    phase: 'runtime-observation',
    requires: ['unity-v3-verification'],
    parallel: ['normal-and-reduced-motion-review', '15-frame-capture'],
  },
  {
    phase: 'capture-human-review',
    requires: ['15-frame-capture'],
    parallel: ['human-visual-review'],
  },
  {
    phase: 'device-performance',
    requires: ['unity-v3-verification', '15-frame-capture'],
    parallel: ['simulator-performance', 'physical-iphone-performance'],
  },
  {
    phase: 'final-promotion',
    requires: [
      'core5-identity-review',
      'three-crop-review',
      'normal-and-reduced-motion-review',
      'human-visual-review',
      'simulator-performance',
      'physical-iphone-performance',
    ],
    parallel: ['approval-consistency', 'readiness-summary', 'guarded-final-promotion'],
  },
];
invariant(
  JSON.stringify(bundle.postGenerationExecutionPlan) === JSON.stringify(expectedExecutionPlan),
  'TOP generation execution plan diverged from dependency-correct parallel schedule',
);

const expectedPostGenerationChecks = [
  'scripts/quality/check-top-living-night-final-art-candidate.ts',
  'scripts/quality/check-top-living-night-core5-candidate-provenance.ts',
  'scripts/quality/check-top-living-night-core5-review.ts',
  'scripts/quality/check-top-living-night-crop-review.ts',
  'scripts/quality/check-top-living-night-unity-evidence.ts',
  'scripts/quality/check-loading-top-capture-pack.ts',
  'scripts/quality/check-top-living-night-human-review.ts',
  'scripts/quality/check-top-living-night-motion-contract.ts',
  'scripts/quality/check-top-living-night-device-performance-artifact.ts',
  'scripts/quality/check-top-living-night-device-performance-policy.ts',
  'scripts/quality/check-top-living-night-device-evidence.ts',
  'scripts/quality/check-top-living-night-approval-consistency.ts',
  'scripts/quality/check-top-living-night-readiness-summary.ts',
  'scripts/quality/check-top-living-night-final-promotion-safety.ts',
];
invariant(
  JSON.stringify(bundle.requiredPostGenerationChecks) === JSON.stringify(expectedPostGenerationChecks),
  'TOP generation bundle post-generation gate chain/order diverged',
);
for (const check of expectedPostGenerationChecks) {
  invariant(existsSync(join(root, check)), `TOP generation post-generation checker is missing: ${check}`);
}

console.log('TOP Living Night final generation bundle: PASS');
console.log(`core5ReferenceSet=${bundle.core5.referenceSetSha256}`);
console.log(`target=${bundle.target.path} ${bundle.target.width}x${bundle.target.height}`);
console.log(`postGenerationGates=${expectedPostGenerationChecks.length}`);
console.log('model-facing inputs: sanitized clean plate + five Core5 cutouts; raw bridge/05/06/diagnostics forbidden');
console.log('parallel plan: Core5/crops/Unity -> after Unity motion + capture -> after capture human + device -> guarded final promotion');
console.log('bridge human inheritance: forbidden; final foreground humans are Core5 only');
console.log('bundle remains generation-ready only; no final/runtime approval is implied');
