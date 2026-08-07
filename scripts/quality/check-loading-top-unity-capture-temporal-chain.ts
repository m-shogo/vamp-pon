import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as any;

const unity = read('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');
const capture = read('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function validUtc(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) && Number.isFinite(Date.parse(value));
}

if (!capture.executed) {
  invariant(capture.result === 'NOT_RUN', 'unexecuted capture evidence must remain NOT_RUN');
  invariant(capture.generatedAtUtc === '', 'unexecuted capture evidence must not retain a timestamp');
  console.log('Loading/TOP Unity -> capture temporal chain: honest NOT_RUN boundary');
  process.exit(0);
}

invariant(capture.result === 'PASSED', 'executed capture evidence must be PASSED');
invariant(unity.executed && unity.result === 'PASSED', 'executed capture requires PASSED V3 Unity evidence');
invariant(validUtc(unity.generatedAtUtc), 'V3 Unity evidence requires canonical UTC timestamp before capture');
invariant(validUtc(capture.generatedAtUtc), 'capture evidence requires canonical UTC timestamp');
invariant(capture.sourceCommit === unity.verifiedCommit, 'capture and V3 Unity evidence must target one source commit');
invariant(capture.topCompositeKind === unity.sourceCompositeKind, 'capture and V3 Unity evidence must target one composite kind');
invariant(capture.topCompositePath === unity.sourceCompositePath, 'capture and V3 Unity evidence must target one composite path');
invariant(capture.topCompositeSha256 === unity.sourceCompositeSha256, 'capture and V3 Unity evidence must target one composite SHA-256');
invariant(Date.parse(capture.generatedAtUtc) >= Date.parse(unity.generatedAtUtc), '15-frame capture cannot predate its V3 Unity verification');
invariant(capture.expectedCaptureCount === 15 && capture.captureCount === 15, 'temporal chain requires the complete 15-frame capture pack');

console.log(`Loading/TOP Unity -> capture temporal chain: PASS unity=${unity.generatedAtUtc} capture=${capture.generatedAtUtc}`);
