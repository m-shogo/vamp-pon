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

const root = process.cwd();
const bundlePath = 'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json';
const manifestPath = 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json';
const bundle = JSON.parse(readFileSync(join(root, bundlePath), 'utf8')) as any;
const manifest = JSON.parse(readFileSync(join(root, manifestPath), 'utf8')) as any;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const canonicalCandidate = 'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const canonicalBridge = 'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const bridgeSha = 'aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d';
const ids = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];
const cleanIdentityRefs = ids.map(id => `preproduction/core5-${id}-identity-reference-v1.png`);
const engineeringCutouts = ids.map(id => `preproduction/core5-${id}-fullbody-cutout-v1.png`);
const crops = ['360x800', '390x844', '430x932'];
const semanticLayers = [
  '00-environment-base.png',
  '04-distant-town.png',
  '06-core5.png',
  '07-animal-robot.png',
  '09-fire-base.png',
  '15-foreground-accents.png',
];

invariant(bundle.schemaVersion === 1, 'TOP generation bundle schema mismatch');
invariant(bundle.status === 'GENERATION_READY_NOT_FINAL', 'TOP generation bundle must not claim final approval');
invariant(bundle.target.path === canonicalCandidate, 'TOP generation target path mismatch');
invariant(bundle.target.width === 430 && bundle.target.height === 932 && bundle.target.format === 'png', 'TOP generation target must remain 430x932 PNG');
invariant(bundle.target.foregroundHumanCount === 5, 'TOP generation target must require exactly five foreground humans');
invariant(bundle.core5.referenceSetSha256 === manifest.referenceSetSha256, 'TOP generation bundle Core5 reference-set fingerprint is stale');
invariant(bundle.core5.references.length === 5 && manifest.referenceCount === 5, 'TOP generation bundle requires exactly five Core5 references');
invariant(JSON.stringify(bundle.core5.references) === JSON.stringify(manifest.references), 'TOP generation bundle Core5 references diverge from locked manifest');
invariant(JSON.stringify(bundle.core5.references.map((reference: Reference) => reference.id)) === JSON.stringify(ids), 'TOP generation bundle Core5 order/set mismatch');

invariant(bundle.compositionReference.path === canonicalBridge, 'TOP generation composition history path mismatch');
invariant(bundle.compositionReference.sha256 === bridgeSha, 'TOP generation composition history SHA mismatch');
invariant(bundle.compositionReference.role === 'engineering-composition-history-only' && bundle.compositionReference.generatorFacing === false, 'TOP raw bridge must remain engineering-history only');
invariant(bundle.compositionReference.replace.includes('all bridge human identities rather than preserving any bridge person'), 'TOP generation bundle must replace all bridge human identities');
invariant(bundle.compositionReference.replace.includes('the elderly bridge man and every other non-Core5 foreground human'), 'TOP generation bundle must remove every non-Core5 bridge human');

const preproduction = bundle.preproductionModelInputs;
invariant(preproduction.workflow === '.github/workflows/top-art-preproduction.yml' && existsSync(join(root, preproduction.workflow)), 'TOP model-input workflow authority mismatch');
invariant(preproduction.manifest === 'preproduction/manifest.json', 'TOP engineering manifest path mismatch');
invariant(preproduction.minimalManifest === 'preproduction/model-input-manifest.json', 'TOP minimal model manifest path mismatch');
invariant(preproduction.inputOrderAuthority === 'docs/design-targets/generated/top-living-night-v3/model-input-order.txt', 'TOP model input-order authority mismatch');
invariant(preproduction.primaryComposition === 'preproduction/core5-clean-composition-plate-v1.png', 'TOP primary model-facing composition must be sanitized clean plate');
invariant(JSON.stringify(preproduction.primaryIdentityCutouts) === JSON.stringify(cleanIdentityRefs), 'TOP primary identity inputs must be five ordered clean single-human master crops');
invariant(preproduction.identityInputKind === 'single-human-full-body-master-crop', 'TOP identity input kind must remain explicit');
invariant(preproduction.engineeringCutoutsGeneratorFacing === false, 'TOP engineering cutouts must never become generator-facing');
invariant(preproduction.layoutProof.path === 'preproduction/core5-layout-proof-v1.png' && preproduction.layoutProof.finalStyleAuthority === false, 'TOP layout proof must remain blocking-only');
invariant(preproduction.sanitizer === 'scripts/unity/sanitize-top-living-night-composition-plate.py' && existsSync(join(root, preproduction.sanitizer)), 'TOP sanitizer authority mismatch');
invariant(preproduction.sanitizationPolicy.rawBridgeUploadedToModelArtifact === false, 'TOP raw bridge must not be uploaded to model artifact');
invariant(preproduction.sanitizationPolicy.bridgeHumanPixelsComposited === false, 'TOP bridge human pixels must never be composited into model-facing references');
for (const forbidden of [...engineeringCutouts, canonicalBridge, 'docs/design-targets/generated/top-living-night-v2/layers/05-distant-companion.png', 'docs/design-targets/generated/top-living-night-v2/layers/06-characters.png', 'docs/design-targets/generated/top-living-night-v3/diagnostics/*', 'development dashboards and status screenshots']) {
  invariant(preproduction.forbiddenModelInputs.includes(forbidden), `TOP forbidden model-input list lost: ${forbidden}`);
}
invariant(preproduction.preproductionDoesNotApprove === true, 'TOP preproduction inputs must never imply approval');

for (const authority of [
  bundle.promptAuthority,
  bundle.isolatedPromptAuthority,
  bundle.identityAuthority,
  bundle.registration.script,
  bundle.semanticLayerRuntime.productionContract,
  bundle.semanticLayerRuntime.registrar,
]) {
  invariant(existsSync(join(root, authority)), `TOP generation authority is missing: ${authority}`);
}
for (const reference of bundle.core5.references as Reference[]) {
  invariant(existsSync(join(root, reference.path)), `TOP generation Core5 reference is missing: ${reference.path}`);
  invariant(/^[0-9a-f]{40}$/.test(reference.gitBlobSha1), `TOP generation Core5 blob SHA is invalid: ${reference.id}`);
}

invariant(bundle.hardRules.exactlyFiveForegroundHumans, 'TOP generation bundle must lock exact human count');
invariant(JSON.stringify(bundle.hardRules.requiredCharacterOrder) === JSON.stringify(ids), 'TOP generation bundle required character order/set mismatch');
for (const name of ['sixthForegroundHumanAllowed','genericSubstituteAllowed','duplicateIdentityAllowed','bakedLogoAllowed','bakedUiAllowed','bakedTextAllowed','seasonalEventArtAllowed','motionVideoRequired','flattenedFinalRuntimeAllowed']) {
  invariant(bundle.hardRules[name] === false, `TOP generation hard rule must remain false: ${name}`);
}
invariant(JSON.stringify(bundle.safeAreas.requiredCropTargets) === JSON.stringify(crops), 'TOP generation crop matrix mismatch');
invariant(bundle.safeAreas.titleTopFraction[0] === .18 && bundle.safeAreas.titleTopFraction[1] === .22, 'TOP title safe-area target mismatch');
invariant(bundle.safeAreas.buttonBottomFraction[0] === .20 && bundle.safeAreas.buttonBottomFraction[1] === .22, 'TOP button safe-area target mismatch');
invariant(bundle.registration.registrationDoesNotApprove && bundle.registration.resetsCandidateSensitiveEvidence, 'TOP registration safety contract mismatch');

const semantic = bundle.semanticLayerRuntime;
invariant(semantic.incomingRoot === 'docs/design-targets/generated/top-living-night-v3/incoming/layers', 'TOP semantic incoming root mismatch');
invariant(semantic.finalRoot === 'docs/design-targets/generated/top-living-night-v3/final/layers', 'TOP semantic final root mismatch');
invariant(semantic.manifest === 'docs/design-targets/generated/top-living-night-v3/final/semantic-layer-pack.json', 'TOP semantic manifest path mismatch');
invariant(JSON.stringify(semantic.requiredLayers) === JSON.stringify(semanticLayers), 'TOP semantic required layer order/set mismatch');
invariant(semantic.candidateShaBound === true, 'TOP semantic pack must bind candidate SHA');
invariant(semantic.core5ReferenceSetBound === true, 'TOP semantic pack must bind Core5 reference-set SHA');
invariant(semantic.perLayerShaBound === true, 'TOP semantic pack must bind every layer SHA');
invariant(semantic.flattenedFinalFallbackAllowed === false, 'TOP final runtime must not silently flatten');
invariant(semantic.bridgeMayUseExistingV2SemanticLayers === true, 'TOP bridge semantic migration boundary mismatch');
invariant(bundle.automation.semanticLayerRegistrar === semantic.registrar, 'TOP semantic layer registrar automation mismatch');

const expectedExecutionPlan: ExecutionPhase[] = [
  { phase: 'candidate-and-semantic-pack', requires: ['final-candidate-registered'], parallel: ['core5-identity-review', 'three-crop-review', 'semantic-layer-pack-registration'] },
  { phase: 'unity-v3', requires: ['final-candidate-registered', 'semantic-layer-pack-registration'], parallel: ['unity-v3-verification'] },
  { phase: 'runtime-observation', requires: ['unity-v3-verification'], parallel: ['normal-and-reduced-motion-review', '15-frame-capture'] },
  { phase: 'capture-human-review', requires: ['15-frame-capture'], parallel: ['human-visual-review'] },
  { phase: 'device-performance', requires: ['unity-v3-verification', '15-frame-capture'], parallel: ['simulator-performance', 'physical-iphone-performance'] },
  { phase: 'final-promotion', requires: ['core5-identity-review','three-crop-review','unity-v3-verification','normal-and-reduced-motion-review','human-visual-review','simulator-performance','physical-iphone-performance'], parallel: ['approval-consistency','readiness-summary','guarded-final-promotion'] },
];
invariant(JSON.stringify(bundle.postGenerationExecutionPlan) === JSON.stringify(expectedExecutionPlan), 'TOP generation execution plan diverged from dependency-correct semantic schedule');

const expectedChecks = [
  'scripts/quality/check-top-living-night-final-art-candidate.ts','scripts/quality/check-top-living-night-core5-candidate-provenance.ts','scripts/quality/check-top-living-night-core5-review.ts','scripts/quality/check-top-living-night-crop-review.ts','scripts/quality/check-top-living-night-unity-evidence.ts','scripts/quality/check-loading-top-capture-pack.ts','scripts/quality/check-top-living-night-human-review.ts','scripts/quality/check-top-living-night-motion-contract.ts','scripts/quality/check-top-living-night-device-performance-artifact.ts','scripts/quality/check-top-living-night-device-performance-policy.ts','scripts/quality/check-top-living-night-device-evidence.ts','scripts/quality/check-top-living-night-approval-consistency.ts','scripts/quality/check-top-living-night-readiness-summary.ts','scripts/quality/check-top-living-night-final-promotion-safety.ts',
];
invariant(JSON.stringify(bundle.requiredPostGenerationChecks) === JSON.stringify(expectedChecks), 'TOP post-generation gate chain/order diverged');
for (const check of expectedChecks) invariant(existsSync(join(root, check)), `TOP post-generation checker missing: ${check}`);

console.log('TOP Living Night final generation bundle: PASS');
console.log(`core5ReferenceSet=${bundle.core5.referenceSetSha256}`);
console.log('model-facing inputs: sanitized 430x932 plate + five single-human Core5 identity references; engineering cutouts/raw bridge/diagnostics/dashboard context forbidden');
console.log('runtime handoff: final candidate -> candidate-bound six-layer semantic pack -> Unity V3; flattened final fallback forbidden');
console.log('bundle remains generation-ready only; no final/runtime approval is implied');
