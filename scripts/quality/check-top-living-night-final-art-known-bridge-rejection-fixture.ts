import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = process.cwd();
const checker = 'scripts/quality/check-top-living-night-final-art-not-known-bridge.ts';
const statusPath = 'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const bridgePath = 'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const allowedFixturePath = 'docs/design-targets/generated/top-living-night-v1/previews/top-living-night-recommended-430x932.png';
const canonicalPath = 'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function copyInto(base: string, relativePath: string): void {
  const target = join(base, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(join(root, relativePath), target);
}

function sha256(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function writeStatus(base: string, sourceImage: string): void {
  const status = JSON.parse(readFileSync(join(base, statusPath), 'utf8')) as any;
  status.candidateGenerated = true;
  status.candidatePath = canonicalPath;
  status.candidateSha256 = sha256(sourceImage);
  status.approvedAsFinal = false;
  status.runtimeApproved = false;
  writeFileSync(join(base, statusPath), `${JSON.stringify(status, null, 2)}\n`, 'utf8');
}

function run(base: string) {
  return spawnSync(process.execPath, ['--experimental-strip-types', checker], {
    cwd: base,
    encoding: 'utf8',
  });
}

const rejected = mkdtempSync(join(tmpdir(), 'vamp-top-known-bridge-reject-'));
try {
  for (const path of [checker, statusPath, bridgePath]) copyInto(rejected, path);
  const canonical = join(rejected, canonicalPath);
  mkdirSync(dirname(canonical), { recursive: true });
  cpSync(join(root, bridgePath), canonical);
  writeStatus(rejected, canonical);

  const result = run(rejected);
  invariant(result.status !== 0, 'known V2 bridge fixture must be rejected as final TOP candidate');
  invariant(
    `${result.stdout}\n${result.stderr}`.includes('known V2 visual-recovery bridge'),
    'known bridge rejection must fail for the intended reason',
  );
} finally {
  rmSync(rejected, { recursive: true, force: true });
}

const allowed = mkdtempSync(join(tmpdir(), 'vamp-top-nonbridge-accept-'));
try {
  for (const path of [checker, statusPath, bridgePath, allowedFixturePath]) copyInto(allowed, path);
  const canonical = join(allowed, canonicalPath);
  mkdirSync(dirname(canonical), { recursive: true });
  cpSync(join(root, allowedFixturePath), canonical);
  writeStatus(allowed, canonical);

  const result = run(allowed);
  invariant(result.status === 0, `non-bridge fixture should pass bridge-only exclusion:\n${result.stdout}\n${result.stderr}`);
  invariant(result.stdout.includes('TOP final-art known-bridge exclusion: PASS'), 'non-bridge fixture did not report PASS');
} finally {
  rmSync(allowed, { recursive: true, force: true });
}

console.log('TOP final-art known-bridge rejection fixture: PASS');
console.log('known V2 bridge is rejected; distinct 430x932 historical fixture passes this bridge-only gate without implying identity/final approval');
