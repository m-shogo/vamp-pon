import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const scriptPath = 'scripts/unity/promote-top-living-night-final-approval.ts';
const finalPath = 'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const devicePath = 'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json';
const motionPath = 'docs/design-targets/generated/top-living-night-v3/motion-review-status.json';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const script = readFileSync(join(root, scriptPath), 'utf8');
for (const token of [
  "const dryRun = process.argv.includes('--dry-run')",
  "console.log('No approval files were mutated.')",
  "console.log('dry-run: no approval files changed')",
  "finalArt.approvedAsFinal = true",
  "finalArt.runtimeApproved = true",
  "device.runtimeApproved = true",
  "motion.runtimeApproved = true",
  "Loading seasonal approval flags were intentionally not modified.",
]) {
  invariant(script.includes(token), `TOP final promotion safety contract missing: ${token}`);
}

invariant(!script.includes('loadingManifest'), 'TOP final promotion must not mutate Loading seasonal approval authority');
invariant(!script.includes('writeJson(paths.identity'), 'TOP final promotion must never rewrite Core5 review evidence');
invariant(!script.includes('writeJson(paths.crop'), 'TOP final promotion must never rewrite crop review evidence');
invariant(!script.includes('writeJson(paths.human'), 'TOP final promotion must never rewrite human review evidence');
invariant(!script.includes('writeJson(paths.unity'), 'TOP final promotion must never rewrite Unity evidence');
invariant(!script.includes('writeJson(paths.capture'), 'TOP final promotion must never rewrite capture evidence');

const before = new Map(
  [finalPath, devicePath, motionPath].map(path => [path, readFileSync(join(root, path), 'utf8')]),
);
const run = spawnSync(
  process.execPath,
  ['--experimental-strip-types', scriptPath, '--dry-run'],
  { cwd: root, encoding: 'utf8' },
);
invariant(run.status === 0, `TOP final promotion dry-run failed:\n${run.stdout}\n${run.stderr}`);
invariant(
  run.stdout.includes('TOP final approval promotion: BLOCKED') ||
    run.stdout.includes('TOP final approval promotion: READY'),
  'TOP final promotion dry-run must report BLOCKED or READY',
);
for (const [path, content] of before) {
  invariant(
    readFileSync(join(root, path), 'utf8') === content,
    `TOP final promotion dry-run mutated approval evidence: ${path}`,
  );
}

const finalArt = JSON.parse(before.get(finalPath)!);
if (!finalArt.candidateGenerated) {
  invariant(run.stdout.includes('TOP final approval promotion: BLOCKED'), 'missing final candidate must keep promotion BLOCKED');
  invariant(run.stdout.includes('final-candidate'), 'missing final candidate must be named as a promotion blocker');
}

console.log('TOP Living Night final promotion safety: PASS');
console.log('dry-run: executable / mutation-free / current incomplete evidence remains blocked');
