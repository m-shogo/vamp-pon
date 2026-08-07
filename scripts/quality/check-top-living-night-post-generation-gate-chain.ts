import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bundlePath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json',
);
const bundle = JSON.parse(readFileSync(bundlePath, 'utf8')) as {
  status: string;
  requiredPostGenerationChecks: string[];
};

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
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

console.log('TOP Living Night post-generation gate chain: PASS');
console.log('order: candidate -> provenance -> Core5 -> crops -> motion -> human -> Unity -> 15-frame capture -> approval');
console.log('generation remains non-final; runtime/review execution may still be NOT_RUN');
