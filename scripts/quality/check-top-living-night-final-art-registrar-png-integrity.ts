import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const registrar = 'scripts/unity/register-top-living-night-final-art.ts';
const candidate = 'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const sourcePng = 'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const authorityFiles = [
  'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json',
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json',
  'docs/design-targets/generated/top-living-night-v3/crop-review-status.json',
  'docs/design-targets/generated/top-living-night-v3/motion-review-status.json',
  'docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json',
  'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json',
  'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json',
  'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
  'docs/design-targets/generated/loading-seasonal-v1/manifest.json',
] as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function copy(relativePath: string, fixture: string): void {
  invariant(existsSync(join(root, relativePath)), `registrar PNG fixture source missing: ${relativePath}`);
  const target = join(fixture, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(join(root, relativePath), target);
}

const fixture = mkdtempSync(join(tmpdir(), 'vamp-top-registrar-png-'));
try {
  copy(registrar, fixture);
  for (const path of authorityFiles) copy(path, fixture);
  const candidatePath = join(fixture, candidate);
  mkdirSync(dirname(candidatePath), { recursive: true });
  cpSync(join(root, sourcePng), candidatePath);

  const valid = spawnSync(process.execPath, ['--experimental-strip-types', registrar, '--dry-run'], {
    cwd: fixture,
    encoding: 'utf8',
  });
  invariant(valid.status === 0, `valid full PNG did not pass registrar parser:\n${valid.stdout}\n${valid.stderr}`);
  invariant(valid.stdout.includes('candidate is ready to register'), 'valid full PNG dry-run did not reach registration-ready boundary');

  const fullBytes = readFileSync(candidatePath);
  invariant(fullBytes.length > 12, 'registrar PNG fixture is unexpectedly tiny');
  writeFileSync(candidatePath, fullBytes.subarray(0, fullBytes.length - 12));
  const before = new Map(authorityFiles.map(path => [path, readFileSync(join(fixture, path))]));

  const corrupt = spawnSync(process.execPath, ['--experimental-strip-types', registrar], {
    cwd: fixture,
    encoding: 'utf8',
  });
  invariant(corrupt.status !== 0, 'truncated 430x932 PNG must fail direct registrar execution');
  const failureText = `${corrupt.stdout}\n${corrupt.stderr}`;
  invariant(
    failureText.includes('missing IEND') || failureText.includes('truncated chunk'),
    `corrupt registrar PNG failed for an unexpected reason:\n${failureText}`,
  );
  for (const [path, bytes] of before) {
    invariant(readFileSync(join(fixture, path)).equals(bytes), `corrupt registrar PNG mutated authority before rejection: ${path}`);
  }

  console.log('TOP final-art registrar PNG integrity behavior: PASS');
  console.log('real 430x932 PNG reaches dry-run readiness; truncated same-size PNG fails before any authority mutation');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
