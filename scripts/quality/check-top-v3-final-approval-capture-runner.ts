import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const runnerPath = 'scripts/unity/run-top-v3-final-approval-capture.sh';
const runner = readFileSync(runnerPath, 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const requiredTokens = [
  'SOURCE_REF="${TOP_V3_FINAL_CAPTURE_SOURCE_REF:-origin/main}"',
  'git fetch origin main',
  'SOURCE_COMMIT="$(git rev-parse "${SOURCE_REF}^{commit}")"',
  'TOP_V3_FINAL_EVIDENCE_BRANCH',
  'Evidence branch must never be main',
  'git worktree add --detach "$WORKTREE" "$SOURCE_COMMIT"',
  'git reset --hard "$SOURCE_COMMIT"',
  'python3 "$NORMALIZER" --check',
  'python3 "$READINESS_FIXER" --check',
  'TopLivingNightCompositeV3UnityVerification.RunBatchmode',
  'LoadingTopAutomatedCapture.RunFromCommandLine',
  'Final approval requires sourceCompositeKind=final-core5',
  'capture["sourceCommit"] = source_commit',
  'capture["topCompositeKind"] = v3["sourceCompositeKind"]',
  'git add "$CAPTURE_ROOT" "$CAPTURE_MANIFEST" "$V3_EVIDENCE"',
  'git push origin "HEAD:refs/heads/$EVIDENCE_BRANCH"',
] as const;

for (const token of requiredTokens) {
  invariant(runner.includes(token), `final-approval capture runner missing contract: ${token}`);
}

const forbiddenTokens = [
  'SOURCE_BRANCH="agent/top-living-night-key-art-v1"',
  'git push origin "HEAD:main"',
  'git push origin "HEAD:$SOURCE_BRANCH"',
  'python3 "$NORMALIZER"\n',
  'python3 "$READINESS_FIXER"\n',
] as const;

for (const token of forbiddenTokens) {
  invariant(!runner.includes(token), `final-approval capture runner contains unsafe/stale behavior: ${token}`);
}

const syntax = spawnSync('bash', ['-n', runnerPath], {
  cwd: process.cwd(),
  encoding: 'utf8',
});
invariant(!syntax.error, `bash -n could not start: ${syntax.error?.message ?? 'unknown error'}`);
invariant(
  syntax.status === 0,
  `final-approval capture runner shell syntax failed:\n${syntax.stdout}\n${syntax.stderr}`,
);

console.log('TOP V3 final-approval capture runner: PASS');
console.log('source: current origin/main by default, immutable source commit binding');
console.log('output: evidence-only non-main branch; production source mutation/push-to-main forbidden');
console.log('formal capture: final-core5 + V3 Unity verification + 15-frame Loading -> TOP pack');
