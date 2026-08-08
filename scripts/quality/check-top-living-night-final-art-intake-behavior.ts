import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const incomingPath = 'docs/design-targets/generated/top-living-night-v3/incoming/top-living-night-core5-candidate-430x932.png';
const canonicalPath = 'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const validFixturePng = 'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const invalidSizeFixturePng = 'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-390x844.png';
const stagingScript = 'scripts/unity/stage-top-living-night-final-art-intake.py';
const registrationScript = 'scripts/unity/register-top-living-night-final-art.ts';
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

function copyFileIntoFixture(fixture: string, relativePath: string): void {
  const source = join(root, relativePath);
  invariant(existsSync(source), `fixture source missing: ${relativePath}`);
  const target = join(fixture, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target);
}

function prepareFixture(candidateSource: string): string {
  const fixture = mkdtempSync(join(tmpdir(), 'vamp-pon-top-intake-'));
  copyFileIntoFixture(fixture, stagingScript);
  copyFileIntoFixture(fixture, registrationScript);
  for (const relativePath of authorityFiles) copyFileIntoFixture(fixture, relativePath);
  const incoming = join(fixture, incomingPath);
  mkdirSync(dirname(incoming), { recursive: true });
  cpSync(join(root, candidateSource), incoming);
  return fixture;
}

function run(command: string, args: string[], cwd: string) {
  return spawnSync(command, args, { cwd, encoding: 'utf8' });
}

function readJson(fixture: string, relativePath: string): any {
  return JSON.parse(readFileSync(join(fixture, relativePath), 'utf8'));
}

const validFixture = prepareFixture(validFixturePng);
try {
  const staged = run('python3', [stagingScript], validFixture);
  invariant(staged.status === 0, `valid TOP intake staging failed:\n${staged.stdout}\n${staged.stderr}`);
  invariant(staged.stdout.includes('TOP final-art intake staging: PASS'), 'valid TOP intake staging did not report PASS');

  const incomingBytes = readFileSync(join(validFixture, incomingPath));
  const canonicalBytes = readFileSync(join(validFixture, canonicalPath));
  invariant(incomingBytes.equals(canonicalBytes), 'valid TOP intake canonical bytes differ from incoming bytes');
  const expectedSha = createHash('sha256').update(incomingBytes).digest('hex');

  const registered = run(process.execPath, ['--experimental-strip-types', registrationScript], validFixture);
  invariant(registered.status === 0, `valid TOP intake registration failed:\n${registered.stdout}\n${registered.stderr}`);
  invariant(registered.stdout.includes('TOP final-art registration: REGISTERED'), 'valid TOP intake registration did not register candidate');

  const finalArt = readJson(validFixture, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json');
  const identity = readJson(validFixture, 'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');
  const crop = readJson(validFixture, 'docs/design-targets/generated/top-living-night-v3/crop-review-status.json');
  const motion = readJson(validFixture, 'docs/design-targets/generated/top-living-night-v3/motion-review-status.json');
  const human = readJson(validFixture, 'docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json');
  const unity = readJson(validFixture, 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');
  const device = readJson(validFixture, 'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json');
  const capture = readJson(validFixture, 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');
  const loading = readJson(validFixture, 'docs/design-targets/generated/loading-seasonal-v1/manifest.json');

  invariant(finalArt.candidateGenerated === true, 'valid TOP intake did not register candidateGenerated');
  invariant(finalArt.candidatePath === canonicalPath, 'valid TOP intake registered non-canonical path');
  invariant(finalArt.candidateSha256 === expectedSha, 'valid TOP intake registered wrong SHA-256');
  invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateCore5ReferenceSetSha256), 'valid TOP intake did not bind Core5 reference-set SHA');
  invariant(finalArt.approvedAsFinal === false && finalArt.runtimeApproved === false && finalArt.finalApprovalBlocked === true, 'valid TOP intake must not approve final/runtime state');
  invariant(identity.sourceSha256 === expectedSha && identity.allIdentitiesApproved === false, 'valid TOP intake did not reset Core5 identity evidence');
  invariant(crop.sourceSha256 === expectedSha && crop.allCropsApproved === false, 'valid TOP intake did not reset crop evidence');
  invariant(motion.motionApproved === false && motion.runtimeApproved === false, 'valid TOP intake did not reset motion evidence');
  invariant(human.executed === false && human.humanVisualReviewComplete === false, 'valid TOP intake did not reset human review evidence');
  invariant(unity.executed === false && unity.result === 'NOT_RUN', 'valid TOP intake did not reset Unity V3 evidence');
  invariant(device.simulator.executed === false && device.physicalIphone.executed === false && device.runtimeApproved === false, 'valid TOP intake did not reset device evidence');
  invariant(capture.executed === false && capture.captureCount === 0, 'valid TOP intake did not reset capture evidence');
  invariant(loading.approval.runtimeCaptureComplete === false && loading.approval.approvedAsFinal === false, 'valid TOP intake did not reset Loading approval mirror');

  rmSync(join(validFixture, incomingPath));
  invariant(existsSync(join(validFixture, canonicalPath)), 'removing one-shot incoming file removed canonical candidate');
  const idempotent = run(process.execPath, ['--experimental-strip-types', registrationScript], validFixture);
  invariant(idempotent.status === 0, `idempotent TOP registration failed:\n${idempotent.stdout}\n${idempotent.stderr}`);
  invariant(idempotent.stdout.includes('already registered; no evidence reset performed'), 'TOP registration is not idempotent after intake cleanup');
} finally {
  rmSync(validFixture, { recursive: true, force: true });
}

const invalidFixture = prepareFixture(invalidSizeFixturePng);
try {
  const beforeStatus = readFileSync(join(invalidFixture, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'));
  const staged = run('python3', [stagingScript], invalidFixture);
  invariant(staged.status !== 0, '390x844 TOP intake fixture must fail staging');
  invariant(!existsSync(join(invalidFixture, canonicalPath)), 'invalid-size TOP intake must not create canonical candidate');
  const afterStatus = readFileSync(join(invalidFixture, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'));
  invariant(beforeStatus.equals(afterStatus), 'invalid-size TOP intake mutated final-art authority');
} finally {
  rmSync(invalidFixture, { recursive: true, force: true });
}

console.log('TOP final-art intake behavior: PASS');
console.log('430x932 fixture stages/registers/resets evidence idempotently; 390x844 fixture fails closed without authority mutation');
