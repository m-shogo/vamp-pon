import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as any;
const bundle = read('docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json') as {
  status: string;
  semanticLayerRuntime: {
    registrar: string;
    requiredLayers: string[];
    candidateShaBound: boolean;
    core5ReferenceSetBound: boolean;
    perLayerShaBound: boolean;
    flattenedFinalFallbackAllowed: boolean;
  };
  effectCompanionRuntime: {
    registrar: string;
    requiredEffects: string[];
    candidateShaBound: boolean;
    core5ReferenceSetBound: boolean;
    perEffectShaBound: boolean;
    legacyV2FallbackAllowedForFinal: boolean;
  };
  postGenerationExecutionPlan: Array<{ phase: string; requires: string[]; parallel: string[] }>;
  requiredPostGenerationChecks: string[];
};
const unity = read('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');
const capture = read('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');
const motion = read('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');
const human = read('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json');
const device = read('docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function validUtc(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) && Number.isFinite(Date.parse(value));
}

const required = [
  'scripts/quality/check-top-living-night-final-art-candidate.ts',
  'scripts/quality/check-top-living-night-core5-candidate-provenance.ts',
  'scripts/quality/check-top-living-night-effect-companion-pack.ts',
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

invariant(bundle.status === 'GENERATION_READY_NOT_FINAL', 'generation bundle must remain non-final');
invariant(
  JSON.stringify(bundle.requiredPostGenerationChecks) === JSON.stringify(required),
  'final TOP post-generation gate chain is incomplete, reordered, or stale',
);
for (const path of required) {
  invariant(existsSync(join(root, path)), `post-generation gate is missing: ${path}`);
}

const semantic = bundle.semanticLayerRuntime;
invariant(existsSync(join(root, semantic.registrar)), 'semantic layer registrar is missing');
invariant(semantic.requiredLayers.length === 6, 'semantic runtime requires exactly six coarse production layers');
invariant(semantic.candidateShaBound, 'semantic runtime must bind final candidate SHA');
invariant(semantic.core5ReferenceSetBound, 'semantic runtime must bind Core5 reference-set SHA');
invariant(semantic.perLayerShaBound, 'semantic runtime must bind each layer SHA');
invariant(semantic.flattenedFinalFallbackAllowed === false, 'final runtime must not silently fall back to flattened final');

const effects = bundle.effectCompanionRuntime;
invariant(existsSync(join(root, effects.registrar)), 'effect companion registrar is missing');
invariant(effects.requiredEffects.length === 10, 'effect runtime requires exactly ten candidate-bound companion assets');
invariant(effects.candidateShaBound, 'effect runtime must bind final candidate SHA');
invariant(effects.core5ReferenceSetBound, 'effect runtime must bind Core5 reference-set SHA');
invariant(effects.perEffectShaBound, 'effect runtime must bind each effect SHA');
invariant(effects.legacyV2FallbackAllowedForFinal === false, 'final runtime must not silently reuse V2 effect assets');

invariant(
  JSON.stringify(bundle.postGenerationExecutionPlan.map(phase => phase.phase)) ===
    JSON.stringify([
      'candidate-and-production-packs',
      'unity-v3',
      'runtime-observation',
      'capture-human-review',
      'device-performance',
      'final-promotion',
    ]),
  'final TOP dependency phases are incomplete or reordered',
);

const candidatePhase = bundle.postGenerationExecutionPlan[0];
invariant(
  candidatePhase.parallel.includes('semantic-layer-pack-registration') &&
    candidatePhase.parallel.includes('effect-companion-pack-registration'),
  'final candidate phase must register semantic and effect packs before Unity V3',
);
const unityPhase = bundle.postGenerationExecutionPlan[1];
invariant(
  unityPhase.requires.includes('semantic-layer-pack-registration') &&
    unityPhase.requires.includes('effect-companion-pack-registration') &&
    unityPhase.parallel.includes('unity-v3-verification'),
  'Unity V3 verification must depend on registered semantic and effect final packs',
);
const finalPhase = bundle.postGenerationExecutionPlan[bundle.postGenerationExecutionPlan.length - 1];
invariant(
  finalPhase.requires.includes('unity-v3-verification'),
  'final promotion must explicitly require Unity V3 verification of the production-pack runtime path',
);

const motionExecuted = motion.normalMotion?.executed || motion.reducedMotion?.executed;
if (motionExecuted) {
  invariant(unity.executed && unity.result === 'PASSED', 'executed motion review requires PASSED Unity V3 evidence first');
  invariant(validUtc(unity.generatedAtUtc), 'executed motion review requires canonical Unity timestamp');
  invariant(validUtc(motion.reviewedAtUtc), 'executed motion review requires canonical motion timestamp');
  invariant(motion.verifiedCommit === unity.verifiedCommit, 'motion review must target the exact Unity-verified source commit');
  invariant(motion.candidateSha256 === unity.sourceCompositeSha256, 'motion review must target the exact Unity-verified TOP bytes');
  invariant(Date.parse(motion.reviewedAtUtc) >= Date.parse(unity.generatedAtUtc), 'motion review cannot predate Unity V3 verification');
}

if (!human.executed) {
  invariant(human.result === 'NOT_RUN', 'unexecuted human review must remain NOT_RUN');
  invariant(human.reviewedAtUtc === '', 'unexecuted human review must not retain a timestamp');
} else {
  invariant(capture.executed && capture.result === 'PASSED', 'executed human review requires PASSED 15-frame capture evidence');
  invariant(validUtc(capture.generatedAtUtc), 'executed human review requires canonical capture timestamp');
  invariant(validUtc(human.reviewedAtUtc), 'executed human review requires canonical review timestamp');
  invariant(human.captureSourceCommit === capture.sourceCommit, 'human review must target the exact capture source commit');
  invariant(human.topCompositeSha256 === capture.topCompositeSha256, 'human review must target the exact captured TOP bytes');
  invariant(Date.parse(human.reviewedAtUtc) >= Date.parse(capture.generatedAtUtc), 'human visual review cannot predate the 15-frame capture pack it reviews');
}

for (const [name, target] of [
  ['simulator', device.simulator],
  ['physical-iphone', device.physicalIphone],
] as const) {
  if (!target.executed) continue;
  invariant(unity.executed && unity.result === 'PASSED', `${name} performance requires PASSED Unity V3 evidence first`);
  invariant(capture.executed && capture.result === 'PASSED', `${name} performance requires PASSED 15-frame capture evidence first`);
  invariant(target.sourceCommit === unity.verifiedCommit, `${name} performance must target Unity-verified source commit`);
  invariant(target.sourceCommit === capture.sourceCommit, `${name} performance must target captured source commit`);
  invariant(target.topCompositeSha256 === unity.sourceCompositeSha256, `${name} performance must target Unity-verified TOP bytes`);
  invariant(target.topCompositeSha256 === capture.topCompositeSha256, `${name} performance must target captured TOP bytes`);
  invariant(validUtc(target.recordedAtUtc), `${name} performance requires canonical timestamp`);
  invariant(validUtc(unity.generatedAtUtc) && validUtc(capture.generatedAtUtc), `${name} performance requires Unity/capture timestamps`);
  invariant(
    Date.parse(target.recordedAtUtc) >= Math.max(Date.parse(unity.generatedAtUtc), Date.parse(capture.generatedAtUtc)),
    `${name} performance cannot predate its Unity/capture prerequisites`,
  );
}

console.log('TOP Living Night post-generation gate chain: PASS');
console.log('parallel plan: candidate -> [Core5, crops, semantic pack, effect pack] -> Unity -> [motion, capture] -> human/device -> promotion');
console.log('final Unity cannot pass through flattened-only or stale-V2-effect paths; semantic and effect pack registration are explicit prerequisites');
console.log('motion is bound after Unity; human is bound after capture; device evidence is bound after Unity + capture');
console.log('generation remains non-final; runtime/review execution may still be NOT_RUN');
