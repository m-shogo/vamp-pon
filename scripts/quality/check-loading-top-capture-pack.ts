import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

type CaptureRecord = {
  id: string;
  kind: 'loading' | 'top';
  season: string;
  file: string;
  width: number;
  height: number;
  sha256: string;
};

type CaptureManifest = {
  schemaVersion: number;
  executed: boolean;
  result: string;
  expectedCaptureCount: number;
  captureCount: number;
  generatedAtUtc: string;
  error: string;
  captures: CaptureRecord[];
};

const root = process.cwd();
const generatedRoot = join(root, 'docs/design-targets/generated/loading-seasonal-v1');
const captureRoot = join(generatedRoot, 'runtime-captures');
const manifest = JSON.parse(
  readFileSync(join(generatedRoot, 'runtime-capture-manifest.json'), 'utf8'),
) as CaptureManifest;
const automation = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingTopAutomatedCapture.cs',
  ),
  'utf8',
);
const runner = readFileSync(
  join(root, 'scripts/unity/run-loading-top-capture-pack.sh'),
  'utf8',
);
const normalizer = readFileSync(
  join(root, 'scripts/quality/normalize-loading-seasonal-editor-paths.mjs'),
  'utf8',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function inspectPng(path: string) {
  const data = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(data.subarray(0, 8).equals(signature), `${path}: invalid PNG signature`);
  invariant(data.subarray(12, 16).toString('ascii') === 'IHDR', `${path}: missing IHDR`);
  return {
    data,
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

const resolutions = [
  [360, 800],
  [390, 844],
  [430, 932],
] as const;
const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
const expected = [
  ...seasons.flatMap(season =>
    resolutions.map(([width, height]) => ({
      id: `loading-${season}-${width}x${height}`,
      kind: 'loading',
      season,
      file: `loading-${season}-${width}x${height}.png`,
      width,
      height,
    })),
  ),
  ...resolutions.map(([width, height]) => ({
    id: `top-${width}x${height}`,
    kind: 'top',
    season: '',
    file: `top-${width}x${height}.png`,
    width,
    height,
  })),
];

invariant(manifest.schemaVersion === 1, 'capture manifest schema mismatch');
invariant(manifest.expectedCaptureCount === 15, 'capture manifest must require 15 frames');
invariant(expected.length === 15, 'internal capture matrix must contain 15 frames');

for (const token of [
  'RunFromCommandLine',
  'BuildCaptures()',
  'SetGameViewSize',
  'ScreenCapture.CaptureScreenshot',
  'loading.SelectedArtIndex != capture.artIndex',
  'TopLivingNightView',
  'ReadPngDimensions',
  'ComputeSha256',
  'EditorApplication.Exit(0)',
  'expectedCaptureCount = Captures.Length',
]) {
  invariant(automation.includes(token), `automated capture missing contract: ${token}`);
}

for (const token of [
  'normalize-loading-seasonal-editor-paths.mjs',
  'LoadingTopAutomatedCapture.RunFromCommandLine',
  'check-loading-top-capture-pack.ts',
  'runtime-captures',
  'runtime-capture-manifest.json',
  'git push origin "HEAD:$SOURCE_BRANCH"',
]) {
  invariant(runner.includes(token), `capture runner missing contract: ${token}`);
}

for (const token of [
  'loading-01-spring.png',
  'loading-02-summer.png',
  'loading-03-autumn.png',
  'loading-04-winter.png',
  'top-living-night-v1/candidates',
]) {
  invariant(normalizer.includes(token), `editor path normalizer missing contract: ${token}`);
}

if (!manifest.executed) {
  invariant(manifest.result === 'NOT_RUN', 'unexecuted capture manifest must be NOT_RUN');
  invariant(manifest.captureCount === 0, 'unexecuted capture count must be zero');
  invariant(manifest.captures.length === 0, 'unexecuted capture records must be empty');
  invariant(manifest.generatedAtUtc === '', 'unexecuted timestamp must be empty');
  invariant(manifest.error === '', 'unexecuted error must be empty');
  console.log('Loading/TOP capture pack: honest NOT_RUN boundary');
  console.log('matrix: 4 seasonal Loading frames x 3 resolutions + TOP x 3 = 15');
  process.exit(0);
}

invariant(manifest.result === 'PASSED', 'executed capture manifest must be PASSED');
invariant(manifest.captureCount === 15, 'executed capture count must be 15');
invariant(manifest.captures.length === 15, 'executed capture records must contain 15 entries');
invariant(manifest.generatedAtUtc.length > 0, 'executed capture timestamp missing');
invariant(manifest.error === '', 'passed capture manifest must not contain an error');
invariant(existsSync(captureRoot), 'runtime capture directory is missing');

const actualFiles = readdirSync(captureRoot).filter(value => value.endsWith('.png')).sort();
const expectedFiles = expected.map(value => value.file).sort();
invariant(
  JSON.stringify(actualFiles) === JSON.stringify(expectedFiles),
  `runtime capture file set mismatch: expected ${expectedFiles.join(', ')}, actual ${actualFiles.join(', ')}`,
);

for (const [index, definition] of expected.entries()) {
  const record = manifest.captures[index];
  invariant(record.id === definition.id, `capture ${index} id mismatch`);
  invariant(record.kind === definition.kind, `${definition.id}: kind mismatch`);
  invariant(record.season === definition.season, `${definition.id}: season mismatch`);
  invariant(record.file === definition.file, `${definition.id}: file mismatch`);
  invariant(record.width === definition.width, `${definition.id}: manifest width mismatch`);
  invariant(record.height === definition.height, `${definition.id}: manifest height mismatch`);
  invariant(/^[0-9a-f]{64}$/.test(record.sha256), `${definition.id}: invalid SHA-256`);

  const png = inspectPng(join(captureRoot, record.file));
  invariant(png.width === definition.width, `${definition.id}: PNG width mismatch`);
  invariant(png.height === definition.height, `${definition.id}: PNG height mismatch`);
  const sha = createHash('sha256').update(png.data).digest('hex');
  invariant(sha === record.sha256, `${definition.id}: PNG SHA-256 mismatch`);
}

console.log('Loading/TOP capture pack: PASS');
console.log('captures: 15/15');
console.log('matrix: spring/summer/autumn/winter + TOP at 360x800 / 390x844 / 430x932');
