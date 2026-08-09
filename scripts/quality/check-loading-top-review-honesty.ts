import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type CaptureManifest = {
  executed: boolean;
  result: string;
  expectedCaptureCount: number;
  captureCount: number;
  generatedAtUtc: string;
  error: string;
  captures: unknown[];
};

const root = process.cwd();
const manifest = JSON.parse(
  readFileSync(
    join(
      root,
      'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
    ),
    'utf8',
  ),
) as CaptureManifest;
const checklist = readFileSync(
  join(
    root,
    'docs/design-targets/generated/loading-seasonal-v1/runtime-review-checklist.md',
  ),
  'utf8',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(manifest.expectedCaptureCount === 15, 'Loading/TOP review honesty requires a 15-frame matrix');

for (const token of [
  'Historical evidence rule',
  'not current V3 approval evidence',
  'humanVisualReviewComplete=false',
  'approvedAsFinal=false',
  'runtimeApproved=false',
  'finalApprovalBlocked=true',
]) {
  invariant(checklist.includes(token), `Loading/TOP review checklist honesty token missing: ${token}`);
}

if (!manifest.executed) {
  invariant(manifest.result === 'NOT_RUN', 'unexecuted Loading/TOP capture must be NOT_RUN');
  invariant(manifest.captureCount === 0, 'unexecuted Loading/TOP capture count must be zero');
  invariant(manifest.captures.length === 0, 'unexecuted Loading/TOP capture records must be empty');
  invariant(manifest.generatedAtUtc === '', 'unexecuted Loading/TOP capture timestamp must be empty');
  invariant(manifest.error === '', 'unexecuted Loading/TOP capture error must be empty');

  for (const token of [
    'V3_RECAPTURE_REQUIRED / CURRENT_RUNTIME_NOT_RUN',
    'executed=false',
    'result=NOT_RUN',
    'captureCount=0',
    'runtimeCaptureComplete=false',
    'Current V3 Unity verifier executes and reports `PASSED`.',
    'Current V3 runtime visibly shows Loading -> TOP without StageSelect flash-through.',
  ]) {
    invariant(checklist.includes(token), `NOT_RUN checklist boundary missing: ${token}`);
  }

  invariant(
    !checklist.includes('- [x] `runtimeCaptureComplete=true`'),
    'checklist must not mark runtimeCaptureComplete=true while current manifest is NOT_RUN',
  );
  invariant(
    !checklist.includes('- [x] Unity 6000.5.1f1 executes the current V3 full capture matrix.'),
    'checklist must not mark current V3 Unity capture executed while manifest is NOT_RUN',
  );

  console.log('Loading/TOP review honesty: PASS (current V3 capture honestly NOT_RUN)');
  process.exit(0);
}

invariant(manifest.result === 'PASSED', 'executed Loading/TOP capture must be PASSED');
invariant(manifest.captureCount === 15, 'executed Loading/TOP capture count must be 15');
invariant(manifest.captures.length === 15, 'executed Loading/TOP capture records must contain 15 frames');
invariant(manifest.generatedAtUtc.length > 0, 'executed Loading/TOP capture timestamp is missing');
invariant(manifest.error === '', 'PASSED Loading/TOP capture must not contain an error');

invariant(
  !checklist.includes('V3_RECAPTURE_REQUIRED / CURRENT_RUNTIME_NOT_RUN'),
  'capture manifest is PASSED but review checklist still claims CURRENT_RUNTIME_NOT_RUN; review evidence must be synchronized',
);
invariant(
  !checklist.includes('executed=false\nresult=NOT_RUN'),
  'capture manifest is PASSED but checklist still embeds the NOT_RUN authority block',
);

console.log('Loading/TOP review honesty: PASS (current capture executed and checklist synchronized)');
