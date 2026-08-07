import './check-top-living-night-human-review-registration.ts';
import './check-top-living-night-motion-review-registration.ts';
import './check-top-living-night-review-template-safety.ts';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const scriptPath = 'scripts/unity/register-top-living-night-static-review.ts';
const guardedPaths = [
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json',
  'docs/design-targets/generated/top-living-night-v3/crop-review-status.json',
];

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const script = readFileSync(join(root, scriptPath), 'utf8');
for (const token of [
  "const dryRun = process.argv.includes('--dry-run')",
  'input.candidateSha256 === finalArt.candidateSha256',
  'input.referenceSetSha256 === finalArt.candidateCore5ReferenceSetSha256',
  "target.result = allTrue(source, characterChecks) ? 'PASSED' : 'FAILED'",
  "target.result = allTrue(source, cropChecks) ? 'PASSED' : 'FAILED'",
  'finalArt.core5IdentityReviewed = identity.allIdentitiesApproved',
  'finalArt.cropReviewComplete = crop.allCropsApproved',
  'finalArt.runtimeApproved = false',
  'finalArt.approvedAsFinal = false',
]) {
  invariant(script.includes(token), `TOP static review registration contract missing: ${token}`);
}

invariant(!script.includes('writeJson(motion'), 'static review registrar must not rewrite motion evidence');
invariant(!script.includes('writeJson(human'), 'static review registrar must not rewrite human evidence');
invariant(!script.includes('writeJson(unity'), 'static review registrar must not rewrite Unity evidence');
invariant(!script.includes('writeJson(capture'), 'static review registrar must not rewrite capture evidence');
invariant(!script.includes('writeJson(device'), 'static review registrar must not rewrite device evidence');

const before = new Map(guardedPaths.map(path => [path, readFileSync(join(root, path), 'utf8')]));
const run = spawnSync(
  process.execPath,
  ['--experimental-strip-types', scriptPath, '--dry-run'],
  { cwd: root, encoding: 'utf8' },
);
invariant(run.status === 0, `TOP static review dry-run failed:\n${run.stdout}\n${run.stderr}`);
invariant(run.stdout.includes('TOP static review registration: DRY_RUN_READY'), 'static review dry-run did not report readiness');
for (const [path, content] of before) {
  invariant(readFileSync(join(root, path), 'utf8') === content, `static review dry-run mutated evidence: ${path}`);
}

console.log('TOP Living Night static review registration safety: PASS');
console.log('dry-run: mutation-free; human observations determine PASS/FAILED; runtime/final promotion remains separate');
