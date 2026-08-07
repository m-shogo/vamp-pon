import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as any;
const bundle = read('docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json') as {
  status: string;
  requiredPostGenerationChecks: string[];
};
const capture = read('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');
const human = read('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function validUtc(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) && Number.isFinite(Date.parse(value));
}

const required = [
  'scripts/quality/check-top-living-night-final-art-candidate.ts',
  'scripts/quality/check-top-living-night-core5-candidate-provenance.ts',
  'scripts/quality/check-top-living-night-core5-review.ts',
  'scripts/quality/check-top-living-night-crop-review.ts',
  'scripts/quality/check-top-living-night-motion-contract.ts',
  'scripts/quality/check-top-living-night-human-review.ts',
  'scripts/quality/check-top-living-night-unity-evidence.ts',
  'scripts/quality/check-loading-top-capture-pack.ts',
  'scripts/quality/check-top-living-night-approval-consistency.ts',
];

invariant(bundle.status === 'GENERATION_READY_NOT_FINAL', 'generation bundle must remain non-final');
invariant(
  JSON.stringify(bundle.requiredPostGenerationChecks) === JSON.stringify(required),
  'final TOP post-generation gate chain is incomplete, reordered, or stale',
);
for (const path of required) {
  invariant(existsSync(join(root, path)), `post-generation gate is missing: ${path}`);
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

console.log('TOP Living Night post-generation gate chain: PASS');
console.log('order: candidate -> provenance -> Core5 -> crops -> motion -> human -> Unity -> 15-frame capture -> approval');
console.log('human review chronology is bound to the exact current capture pack when executed');
console.log('generation remains non-final; runtime/review execution may still be NOT_RUN');
