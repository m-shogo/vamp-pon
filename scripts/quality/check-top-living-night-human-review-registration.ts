import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const scriptPath = 'scripts/unity/register-top-living-night-human-review.ts';
const guardedPaths = [
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  'docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json',
  'docs/design-targets/generated/loading-seasonal-v1/manifest.json',
];

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const script = readFileSync(join(root, scriptPath), 'utf8');
for (const token of [
  "const dryRun = process.argv.includes('--dry-run')",
  "capture.executed === true && capture.result === 'PASSED'",
  "capture.expectedCaptureCount === 15 && capture.captureCount === 15",
  "capture.topCompositeKind === 'final-core5'",
  'capture.topCompositeSha256 === finalArt.candidateSha256',
  "const passed = reviewKeys.every(key => input[key] === true)",
  'finalArt.humanVisualReviewComplete = passed',
  'loading.approval.humanVisualReviewComplete = passed',
  'finalArt.runtimeApproved = false',
  'finalArt.approvedAsFinal = false',
]) {
  invariant(script.includes(token), `TOP human review registration contract missing: ${token}`);
}

for (const forbidden of [
  'writeJson(paths.motion',
  'writeJson(paths.unity',
  'writeJson(paths.capture',
  'writeJson(paths.device',
]) {
  invariant(!script.includes(forbidden), `TOP human review registrar must not rewrite source runtime evidence: ${forbidden}`);
}

const before = new Map(guardedPaths.map(path => [path, readFileSync(join(root, path), 'utf8')]));
const run = spawnSync(
  process.execPath,
  ['--experimental-strip-types', scriptPath, '--dry-run'],
  { cwd: root, encoding: 'utf8' },
);
invariant(run.status === 0, `TOP human review dry-run failed:\n${run.stdout}\n${run.stderr}`);
invariant(run.stdout.includes('TOP human review registration: DRY_RUN_READY'), 'human review dry-run did not report readiness');
for (const [path, content] of before) {
  invariant(readFileSync(join(root, path), 'utf8') === content, `human review dry-run mutated evidence: ${path}`);
}

console.log('TOP Living Night human review registration safety: PASS');
console.log('dry-run mutation-free; capture provenance auto-bound; five explicit human visual observations decide PASS/FAILED');
