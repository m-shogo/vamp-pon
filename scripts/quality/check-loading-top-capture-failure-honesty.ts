import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const capture = JSON.parse(readFileSync(join(root, 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json'), 'utf8')) as any;
const finalArt = JSON.parse(readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'), 'utf8')) as any;
const loading = JSON.parse(readFileSync(join(root, 'docs/design-targets/generated/loading-seasonal-v1/manifest.json'), 'utf8')) as any;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function validUtc(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) && Number.isFinite(Date.parse(value));
}

invariant(capture.schemaVersion === 1, 'capture failure-honesty schema mismatch');
invariant(capture.expectedCaptureCount === 15, 'capture failure-honesty requires 15 expected frames');
invariant(capture.captureCount === capture.captures.length, 'captureCount must equal capture record length');
invariant(capture.captureCount >= 0 && capture.captureCount <= 15, 'captureCount must remain within 0..15');

if (!capture.executed) {
  invariant(capture.result === 'NOT_RUN', 'unexecuted capture must remain NOT_RUN');
  invariant(capture.captureCount === 0, 'NOT_RUN capture cannot retain partial frames');
  invariant(capture.error === '', 'NOT_RUN capture cannot retain a failure error');
  invariant(capture.generatedAtUtc === '', 'NOT_RUN capture cannot retain a timestamp');
} else if (capture.result === 'FAILED') {
  invariant(typeof capture.error === 'string' && capture.error.trim().length > 0, 'FAILED capture requires a concrete error');
  invariant(validUtc(capture.generatedAtUtc), 'FAILED capture requires a UTC timestamp');
  invariant(!finalArt.runtimeCaptureComplete, 'FAILED capture cannot promote final runtimeCaptureComplete');
  invariant(!finalArt.runtimeApproved, 'FAILED capture cannot promote runtimeApproved');
  invariant(!finalArt.approvedAsFinal, 'FAILED capture cannot promote approvedAsFinal');
  invariant(!loading.approval.runtimeCaptureComplete, 'FAILED capture cannot promote Loading runtimeCaptureComplete');
  invariant(!loading.approval.runtimeApproved, 'FAILED capture cannot promote Loading runtimeApproved');
  invariant(loading.approval.finalApprovalBlocked, 'FAILED capture must keep Loading final approval blocked');
} else {
  invariant(capture.result === 'PASSED', `unexpected executed capture result: ${capture.result}`);
  invariant(capture.captureCount === 15, 'PASSED capture requires all 15 frames');
  invariant(capture.error === '', 'PASSED capture cannot retain an error');
  invariant(validUtc(capture.generatedAtUtc), 'PASSED capture requires a UTC timestamp');
}

console.log(`Loading/TOP capture failure honesty: PASS (${capture.result}, ${capture.captureCount}/15)`);
