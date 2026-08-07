import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const staticTemplate = readFileSync(
  join(root, 'scripts/unity/create-top-living-night-static-review-template.ts'),
  'utf8',
);
const runtimeTemplate = readFileSync(
  join(root, 'scripts/unity/create-top-living-night-runtime-review-templates.ts'),
  'utf8',
);
const gitignore = readFileSync(join(root, '.gitignore'), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const token of [
  "if (!finalArt.candidateGenerated)",
  "console.log('NEXT=final-candidate')",
  'exactlyFiveForegroundHumans: false',
  'noGenericSubstituteHumans: false',
  'reviewedAtUtc: \'\'',
  'reviewerRole: \'\'',
  'falseMeansNotApproved: true',
  'doNotGuess: true',
]) {
  invariant(staticTemplate.includes(token), `static review template safety contract missing: ${token}`);
}

for (const token of [
  "if (!finalArt.candidateGenerated)",
  "console.log('NEXT=final-candidate')",
  "if (unity.executed && unity.result === 'PASSED')",
  "if (capture.executed && capture.result === 'PASSED')",
  "capture.expectedCaptureCount === 15 && capture.captureCount === 15",
  "capture.topCompositeKind === 'final-core5'",
  'negativeProblemFlagsDefaultFalse: true',
  'positiveReducedMotionObservationsDefaultFalse: true',
  'allFiveVisualBooleansMustBeTrueToPass: true',
  'defaultsAreNotApproval: true',
]) {
  invariant(runtimeTemplate.includes(token), `runtime review template safety contract missing: ${token}`);
}

for (const generatedPath of [
  'docs/design-targets/generated/top-living-night-v3/review-inputs/*.json',
  'docs/design-targets/generated/top-living-night-v3/readiness-summary.txt',
]) {
  invariant(
    gitignore.includes(generatedPath),
    `TOP generated review/readiness artifact must remain ignored by Git: ${generatedPath}`,
  );
}
invariant(!staticTemplate.includes('approvedAsFinal = true'), 'static review template generator must not promote final approval');
invariant(!runtimeTemplate.includes('approvedAsFinal = true'), 'runtime review template generator must not promote final approval');
invariant(!runtimeTemplate.includes('runtimeApproved = true'), 'runtime review template generator must not promote runtime approval');

console.log('TOP Living Night review template safety: PASS');
console.log('templates/readiness text are candidate/provenance-derived, generated-only, ignored by Git, and never promote runtime/final state');
