import { isAbsolute, join, normalize, relative } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const canonicalFinalPath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const paths = {
  finalArt: 'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  human: 'docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json',
  capture: 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
  loading: 'docs/design-targets/generated/loading-seasonal-v1/manifest.json',
} as const;

const reviewKeys = [
  'noBlackOrBlankFrames',
  'noDevelopmentText',
  'topCore5Readable',
  'cropSafeAcrossAllTargets',
  'loadingToTopContinuityPassed',
] as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function arg(name: string): string {
  const prefix = `--${name}=`;
  const found = process.argv.find(value => value.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(join(root, path), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function validUtc(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

function canonicalInputPath(input: string): string {
  const absolute = isAbsolute(input) ? normalize(input) : join(root, normalize(input));
  const repoRelative = relative(root, absolute).replaceAll('\\', '/');
  invariant(!repoRelative.startsWith('../') && repoRelative !== '..', 'human review input must stay inside the repository');
  invariant(repoRelative.endsWith('.json'), 'human review input must be JSON');
  return repoRelative;
}

function main(): void {
  for (const path of Object.values(paths)) {
    invariant(existsSync(join(root, path)), `human review authority/evidence is missing: ${path}`);
  }

  const finalArt = readJson(paths.finalArt);
  const human = readJson(paths.human);
  const capture = readJson(paths.capture);
  const loading = readJson(paths.loading);

  invariant(finalArt.schemaVersion === 1, 'final-art schema mismatch');
  invariant(human.schemaVersion === 1, 'human review schema mismatch');
  invariant(capture.schemaVersion === 1, 'capture schema mismatch');
  invariant(finalArt.candidatePath === canonicalFinalPath, 'final candidate path is not canonical');
  invariant(human.candidatePath === canonicalFinalPath, 'human review candidate path is not canonical');

  if (dryRun) {
    console.log('TOP human review registration: DRY_RUN_READY');
    console.log('input: reviewerRole + reviewedAtUtc + five explicit visual booleans + optional notes');
    console.log('candidate/capture commit/path/SHA/count are bound automatically from current PASSED capture evidence.');
    console.log('registration never promotes runtimeApproved or approvedAsFinal.');
    return;
  }

  invariant(finalArt.candidateGenerated === true, 'human review requires registered final candidate');
  invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateSha256), 'human review requires valid final candidate SHA-256');
  invariant(!finalArt.runtimeApproved && !finalArt.approvedAsFinal, 'approved/runtime-approved final art must be re-registered before human review can change');

  invariant(capture.executed === true && capture.result === 'PASSED', 'human review requires PASSED capture evidence');
  invariant(capture.expectedCaptureCount === 15 && capture.captureCount === 15, 'human review requires complete 15-frame capture count');
  invariant(Array.isArray(capture.captures) && capture.captures.length === 15, 'human review requires complete 15-frame capture list');
  invariant(/^[0-9a-f]{40}$/.test(capture.sourceCommit), 'human review requires capture source commit');
  invariant(capture.topCompositeKind === 'final-core5', 'human review cannot use bridge capture evidence');
  invariant(capture.topCompositePath === canonicalFinalPath, 'human review requires canonical final TOP capture path');
  invariant(capture.topCompositeSha256 === finalArt.candidateSha256, 'human review requires exact current final TOP bytes');
  invariant(validUtc(capture.generatedAtUtc), 'human review requires canonical capture timestamp');

  const inputArg = arg('input');
  invariant(inputArg.length > 0, '--input=<review.json> is required');
  const inputPath = canonicalInputPath(inputArg);
  invariant(existsSync(join(root, inputPath)), `human review input is missing: ${inputPath}`);
  const input = readJson(inputPath);
  invariant(input.schemaVersion === 1, 'human review input schema mismatch');
  invariant(typeof input.reviewerRole === 'string' && input.reviewerRole.trim().length > 0, 'human review input requires reviewerRole');
  invariant(validUtc(input.reviewedAtUtc), 'human review input requires canonical UTC reviewedAtUtc');
  invariant(Date.parse(input.reviewedAtUtc) >= Date.parse(capture.generatedAtUtc), 'human review cannot predate the capture pack');
  for (const key of reviewKeys) invariant(typeof input[key] === 'boolean', `human review input requires boolean ${key}`);

  const passed = reviewKeys.every(key => input[key] === true);
  Object.assign(human, {
    executed: true,
    result: passed ? 'PASSED' : 'FAILED',
    candidateGenerated: true,
    candidatePath: canonicalFinalPath,
    candidateSha256: finalArt.candidateSha256,
    captureSourceCommit: capture.sourceCommit,
    topCompositeKind: capture.topCompositeKind,
    topCompositePath: capture.topCompositePath,
    topCompositeSha256: capture.topCompositeSha256,
    expectedFrameCount: 15,
    reviewedFrameCount: 15,
    loadingFramesReviewed: 12,
    topFramesReviewed: 3,
    reviewerRole: input.reviewerRole.trim(),
    reviewedAtUtc: input.reviewedAtUtc,
    notes: typeof input.notes === 'string' ? input.notes : '',
    humanVisualReviewComplete: passed,
    finalApprovalBlocked: !passed,
  });
  for (const key of reviewKeys) human[key] = input[key];

  finalArt.humanVisualReviewComplete = passed;
  finalArt.runtimeApproved = false;
  finalArt.approvedAsFinal = false;
  finalArt.finalApprovalBlocked = true;
  finalArt.reviewedAtUtc = '';

  // Loading owns the same human-review completion flag for the shared 15-frame pack.
  loading.approval.humanVisualReviewComplete = passed;
  loading.approval.runtimeApproved = false;
  loading.approval.approvedAsFinal = false;
  loading.approval.finalApprovalBlocked = true;

  writeJson(paths.human, human);
  writeJson(paths.finalArt, finalArt);
  writeJson(paths.loading, loading);

  console.log('TOP human review registration: RECORDED');
  console.log(`result=${human.result} frames=15/15`);
  console.log(`captureSourceCommit=${capture.sourceCommit}`);
  console.log(`candidateSha256=${finalArt.candidateSha256}`);
  console.log('runtimeApproved=false approvedAsFinal=false (human review never promotes runtime/final approval)');
}

main();
