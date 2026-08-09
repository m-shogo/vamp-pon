import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type CaptureManifest = {
  executed: boolean;
  result: string;
  sourceCommit: string;
  generatedAtUtc: string;
  captureCount: number;
  expectedCaptureCount: number;
  captures: unknown[];
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

function isCanonicalUtc(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString().startsWith(value.slice(0, 19));
}

invariant(manifest.expectedCaptureCount === 15, 'capture temporal gate requires the full 15-frame matrix');

if (!manifest.executed) {
  invariant(manifest.result === 'NOT_RUN', 'unexecuted capture evidence must remain NOT_RUN');
  invariant(manifest.generatedAtUtc === '', 'unexecuted capture evidence must not retain a timestamp');
  invariant(manifest.sourceCommit === '', 'unexecuted capture evidence must not retain a source commit');
  invariant(manifest.captureCount === 0, 'unexecuted capture evidence must keep captureCount=0');
  invariant(manifest.captures.length === 0, 'unexecuted capture evidence must keep captures empty');
  console.log('Loading/TOP capture temporal coherence: honest NOT_RUN boundary');
  process.exit(0);
}

invariant(manifest.result === 'PASSED', 'executed capture evidence must be PASSED');
invariant(/^[0-9a-f]{40}$/.test(manifest.sourceCommit), 'executed capture evidence requires a source commit');
invariant(isCanonicalUtc(manifest.generatedAtUtc), 'executed capture evidence requires a canonical UTC timestamp');
invariant(manifest.captureCount === 15, 'executed capture evidence requires 15 captures');
invariant(manifest.captures.length === 15, 'executed capture evidence requires 15 capture records');

console.log(`Loading/TOP capture temporal coherence: PASS at ${manifest.generatedAtUtc}`);
