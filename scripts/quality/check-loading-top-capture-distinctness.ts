import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type CaptureRecord = {
  id: string;
  kind: 'loading' | 'top';
  season: string;
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
  captures: CaptureRecord[];
};

const root = process.cwd();
const manifest = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json'),
    'utf8',
  ),
) as CaptureManifest;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(manifest.schemaVersion === 1, 'capture distinctness manifest schema mismatch');
invariant(manifest.expectedCaptureCount === 15, 'capture distinctness requires the 15-frame matrix');

if (!manifest.executed) {
  invariant(manifest.result === 'NOT_RUN', 'unexecuted capture distinctness boundary must be NOT_RUN');
  invariant(manifest.captureCount === 0, 'unexecuted capture distinctness boundary must have zero captures');
  invariant(manifest.captures.length === 0, 'unexecuted capture distinctness boundary must have no records');
  console.log('Loading/TOP capture distinctness: honest NOT_RUN boundary');
  process.exit(0);
}

invariant(manifest.result === 'PASSED', 'capture distinctness requires PASSED capture evidence');
invariant(manifest.captureCount === 15 && manifest.captures.length === 15, 'capture distinctness requires all 15 records');

const resolutions = [
  [360, 800],
  [390, 844],
  [430, 932],
] as const;

for (const [width, height] of resolutions) {
  const atResolution = manifest.captures.filter(
    capture => capture.width === width && capture.height === height,
  );
  invariant(atResolution.length === 5, `${width}x${height}: expected four Loading captures plus one TOP capture`);

  const loading = atResolution.filter(capture => capture.kind === 'loading');
  const top = atResolution.filter(capture => capture.kind === 'top');
  invariant(loading.length === 4, `${width}x${height}: expected four seasonal Loading captures`);
  invariant(top.length === 1, `${width}x${height}: expected exactly one TOP capture`);
  invariant(
    new Set(loading.map(capture => capture.season)).size === 4,
    `${width}x${height}: seasonal Loading capture identities are duplicated`,
  );
  invariant(
    new Set(loading.map(capture => capture.sha256)).size === 4,
    `${width}x${height}: two or more seasonal Loading captures are byte-identical`,
  );
  invariant(
    !loading.some(capture => capture.sha256 === top[0].sha256),
    `${width}x${height}: TOP capture is byte-identical to a Loading capture`,
  );
}

console.log('Loading/TOP capture distinctness: PASS');
console.log('guarded: four distinct seasonal frames + distinct TOP frame at every target resolution');
