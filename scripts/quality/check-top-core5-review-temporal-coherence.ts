import './check-top-core5-review-reference-set.ts';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as any;

const finalArt = read('docs/design-targets/generated/top-living-night-v3/final-art-status.json');
const identity = read('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');
const crop = read('docs/design-targets/generated/top-living-night-v3/crop-review-status.json');
const human = read('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function validUtc(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) && Number.isFinite(Date.parse(value));
}

const identityExecuted = identity.reviews?.some((review: any) => review.executed) ?? false;
const cropExecuted = crop.reviews?.some((review: any) => review.executed) ?? false;

if (!finalArt.candidateGenerated) {
  invariant(finalArt.reviewedAtUtc === '', 'missing final candidate must not retain final-art review timestamp');
  invariant(identity.reviewedAtUtc === '', 'missing final candidate must not retain Core5 review timestamp');
  invariant(crop.reviewedAtUtc === '', 'missing final candidate must not retain crop review timestamp');
  invariant(human.reviewedAtUtc === '', 'missing final candidate must not retain human review timestamp');
  console.log('TOP Core5 review temporal coherence: honest pre-candidate boundary');
  process.exit(0);
}

if (identityExecuted) invariant(validUtc(identity.reviewedAtUtc), 'executed Core5 review requires canonical UTC timestamp');
else invariant(identity.reviewedAtUtc === '', 'unexecuted Core5 review must not retain timestamp');

if (cropExecuted) invariant(validUtc(crop.reviewedAtUtc), 'executed crop review requires canonical UTC timestamp');
else invariant(crop.reviewedAtUtc === '', 'unexecuted crop review must not retain timestamp');

if (human.executed) invariant(validUtc(human.reviewedAtUtc), 'executed human visual review requires canonical UTC timestamp');
else invariant(human.reviewedAtUtc === '', 'unexecuted human visual review must not retain timestamp');

if (finalArt.approvedAsFinal) {
  invariant(validUtc(finalArt.reviewedAtUtc), 'final-approved TOP requires canonical UTC review timestamp');
  invariant(identity.allIdentitiesApproved, 'final approval requires completed Core5 review');
  invariant(crop.allCropsApproved, 'final approval requires completed crop review');
  invariant(human.humanVisualReviewComplete, 'final approval requires completed human visual review');
} else {
  invariant(finalArt.reviewedAtUtc === '', 'non-final TOP must not retain final approval timestamp');
}

console.log('TOP Core5 review temporal coherence: PASS');
