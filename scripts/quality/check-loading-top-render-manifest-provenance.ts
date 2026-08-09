import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const captureRoot = join(root, 'docs/design-targets/generated/loading-seasonal-v1/runtime-captures');
const manifest = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json'),
    'utf8',
  ),
) as {
  schemaVersion: number;
  executed: boolean;
  result: string;
  expectedCaptureCount: number;
  captureCount: number;
  captures: Array<{
    id: string;
    kind: 'loading' | 'top';
    season: string;
    file: string;
    width: number;
    height: number;
    sha256: string;
  }>;
};

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(manifest.schemaVersion === 1, 'render provenance manifest schema mismatch');
invariant(manifest.expectedCaptureCount === 15, 'render provenance requires the 15-frame matrix');

if (!manifest.executed) {
  invariant(manifest.result === 'NOT_RUN', 'unexecuted render provenance must remain NOT_RUN');
  invariant(manifest.captureCount === 0, 'unexecuted render provenance must keep captureCount=0');
  invariant(manifest.captures.length === 0, 'unexecuted render provenance must keep captures empty');
  console.log('Loading/TOP render manifest provenance: honest NOT_RUN boundary');
  process.exit(0);
}

invariant(manifest.result === 'PASSED', 'render provenance requires PASSED capture evidence');
invariant(manifest.captureCount === 15 && manifest.captures.length === 15, 'render provenance requires all 15 capture records');
invariant(new Set(manifest.captures.map(value => value.id)).size === 15, 'render provenance capture ids must be unique');
invariant(new Set(manifest.captures.map(value => value.file)).size === 15, 'render provenance capture files must be unique');

for (const capture of manifest.captures) {
  invariant(/^[0-9a-f]{64}$/.test(capture.sha256), `${capture.id}: manifest SHA-256 is invalid`);
  const path = join(captureRoot, capture.file);
  invariant(existsSync(path), `${capture.id}: rendered PNG is missing`);
  const bytes = readFileSync(path);
  invariant(bytes.length >= 24, `${capture.id}: rendered PNG is truncated`);
  invariant(bytes.subarray(12, 16).toString('ascii') === 'IHDR', `${capture.id}: rendered PNG IHDR is missing`);
  invariant(bytes.readUInt32BE(16) === capture.width, `${capture.id}: rendered width diverges from manifest`);
  invariant(bytes.readUInt32BE(20) === capture.height, `${capture.id}: rendered height diverges from manifest`);
  const sha = createHash('sha256').update(bytes).digest('hex');
  invariant(sha === capture.sha256, `${capture.id}: rendered bytes diverge from manifest SHA-256`);
}

console.log('Loading/TOP render manifest provenance: PASS');
console.log('guarded: 15 unique manifest records -> exact rendered PNG dimensions and SHA-256 bytes');
